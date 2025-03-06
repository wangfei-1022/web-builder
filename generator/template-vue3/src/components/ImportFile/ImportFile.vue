<template>
  <AModal :title="props.title || '导入文件'"
          :visible="props.visible"
          @update:visible="emit('update:visible', $event)"
          :maskClosable="false"
          :width="modalWidth"
          unmountOnClose>
    <template v-if="$slots.title" #title>
      <slot name="title"></slot>
    </template>
    <template v-if="step === 1">
      <AAlert>
        <span>{{ props.templateAlert || '请使用模板文件导入' }}</span>
        <ALink :href="props.templateUrl" style="display: inline; margin-left: 4px;">
          <span>下载模板</span>
          <span v-if="props.templateVersion">({{ props.templateVersion }})</span>
        </ALink>
      </AAlert>
      <AForm ref="fileFormComponent" :model="fileForm" autoLabelWidth>
        <AFormItem label="上传文件"
                   field="file"
                   required
                   :rules="[
                     { required: true, message: '该项为必填项' },
                   ]">
          <input ref="inputFile" type="file" :accept="props.accept" @change="onSelectFile" hidden>
          <ASpace direction="vertical" style="width: 100%;">
            <AButton @click="($refs.inputFile as HTMLInputElement).click()">
              <template #icon>
                <IconUpload />
              </template>选择文件
            </AButton>
            <span>{{ fileForm.file?.name }}</span>
          </ASpace>
        </AFormItem>
      </AForm>
    </template>
    <template v-else-if="step === 2">
      <AAlert v-if="importDataFormHasError" type="error">
        存在数据错误，请检查标注红色的单元格
      </AAlert>
      <AForm v-if="importData" ref="importDataFormComponent" :model="importData">
        <ATable v-if="importDataDisplay"
                rowKey="sequence"
                :data="importDataDisplay"
                :columns="importDataColumns"
                :pagination="false"
                columnResizable
                :bordered="false"
                tableLayoutFixed
                size="small">
          <template #formItem="{ column, record, rowIndex }">
            <AFormItem :field="`${rowIndex}.${column.dataIndex}`" hideLabel>
              <div class="value-content">{{ record[column.dataIndex] }}</div>
            </AFormItem>
          </template>
        </ATable>
      </AForm>
    </template>
    <template #footer>
      <AButton @click="emit('update:visible', false)">取消</AButton>
      <template v-if="step === 1">
        <AButton type="primary" :loading="stepToVerifyImportDataReuqest.loading" @click="stepToVerifyImportDataReuqest.load">下一步</AButton>
      </template>
      <template v-if="step === 2">
        <AButton @click="stepBackSelectFile">上一步</AButton>
        <AButton type="primary" :loading="stepToSubmitImportDataRequest.loading" @click="stepToSubmitImportDataRequest.load">导入</AButton>
      </template>
    </template>
  </AModal>
</template>

<script lang="ts" setup>
import { getErrorMessage, parseJsonString, useRequest } from '@/utils';
import { Modal, type FormInstance, type TableColumnData } from '@arco-design/web-vue';
import Big from 'big.js';
import dayjs from 'dayjs';
import { nextTick, reactive, ref, watch, type PropType } from 'vue';
import { read, utils } from 'xlsx';
import type { ImportFileSubmitHandle, ImportFileVerifyHandle } from './ImportFile.extra';

// 定义属性
const props = defineProps({
  /** 标题 */
  title: String,
  /** 可见的 */
  visible: Boolean,
  /** 文件类型 */
  accept: String,
  /** 模板提示 */
  templateAlert: String,
  /** 模板版本 */
  templateVersion: String,
  /** 模板地址 */
  templateUrl: {
    type: String,
    required: true,
  },
  /** 验证处理 */
  onVerify: Function as PropType<ImportFileVerifyHandle>,
  /** 提交处理 */
  onSubmit: Function as PropType<ImportFileSubmitHandle>,
});

// 定义事件
const emit = defineEmits<{
  (event: 'update:visible', visible: boolean): void;
}>();

// 全局状态
const modalWidth = ref(480);
const step = ref(1);
watch(
  () => props.visible,
  () => {
    if (!props.visible) {
      modalWidth.value = 480;
      step.value = 1;
      fileForm.file = undefined;
      importDataColumns.value = undefined;
      importData.value = undefined;
      importDataDisplay.value = undefined;
      importDataFormComponent.value?.clearValidate();
      importDataFormHasError.value = false;
    }
  },
);

// 选择文件
const fileFormComponent = ref<FormInstance>();
const fileForm = reactive({
  file: undefined as File | undefined,
});
const onSelectFile = (event: Event) => {
  const input = event.target as HTMLInputElement;
  fileForm.file = input.files?.[0];
  fileFormComponent.value?.validate();
  input.value = '';
  if (fileForm.file) {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const { Sheets } = read(fileReader.result, { type: 'binary' });
      if (!props.templateVersion || props.templateVersion === Sheets['使用说明']?.B2?.w) {
        const importDataMapRaw = utils.sheet_to_json<any>(Sheets['使用说明'], { defval: null, range: 3 });
        const importDataRaw = utils.sheet_to_json<any>(Sheets['导入数据'], { defval: null, range: 1 });
        // 生成数据列描述列表
        importDataColumns.value = importDataMapRaw
          .map(mapItem => ({
            title: mapItem['名称'],
            dataIndex: mapItem['数据索引'],
            slotName: 'formItem',
            width: mapItem['名称'].length * 14 + 16 * 2,
            align: mapItem['类型'] === '数值' ? 'right' : 'left',
          }));
        // 生成数据
        importData.value = importDataRaw
          .map(({ ...item }, itemIndex) => {
            item.sequence = itemIndex + 1;
            importDataMapRaw.forEach(mapItem => {
              let value = item[mapItem['名称']];
              if (value !== null) {
                if (mapItem['类型'] === '文本' && typeof value !== 'string') {
                  value = value?.toString() || null;
                }
                if (mapItem['类型'] === '数值' && typeof value !== 'number') {
                  value = !isNaN(value) ? parseFloat(value) : null;
                  if (mapItem['数值精度'] > 0 && value !== null) {
                    value = Number(value.toFixed(mapItem['数值精度']));
                  }
                }
                if (mapItem['类型'] === '布尔' && typeof value !== 'boolean') {
                  value = value === '是' ? true : value === '否' ? false : null;
                }
                if (mapItem['类型'] === '日期') {
                  if (typeof value === 'number') {
                    const ahour = Big(1000).mul(60).mul(60);
                    const aday = ahour.mul(24);
                    const excelTimeStart = Big(new Date('1900-01-01T00:00:00.000Z').valueOf()).minus(aday);
                    const valueTimestamp = excelTimeStart.add(Big(value).mul(aday)).minus(aday).minus(ahour.mul(8)).toNumber();
                    value = dayjs(valueTimestamp).format('YYYY-MM-DD');
                  } else if (typeof value !== 'string' || !/^\d{4}([-/]\d{2}){2}$/.test(value)) {
                    value = null;
                  }
                }
                if (mapItem['类型'] === '时间') {
                  if (typeof value === 'number') {
                    const ahour = Big(1000).mul(60).mul(60);
                    const aday = ahour.mul(24);
                    const excelTimeStart = Big(new Date('1900-01-01T00:00:00.000Z').valueOf()).minus(aday);
                    const valueTimestamp = excelTimeStart.add(Big(value).mul(aday)).minus(aday).minus(ahour.mul(8)).toNumber();
                    value = dayjs(valueTimestamp).format('YYYY-MM-DD HH:mm:ss');
                  } else if (typeof value !== 'string' || !/^\d{4}([-/]\d{2}){2} \d{2}(:\d{2}){2}$/.test(value)) {
                    value = null;
                  }
                }
              }
              item[mapItem['数据索引']] = value;
              delete item[mapItem['名称']];
            });
            return item;
          });
        // 生成显示数据
        importDataDisplay.value = importData.value
          .map(({ ...item }) => {
            importDataMapRaw.forEach((mapItem, mapItemIndex) => {
              let value = item[mapItem['数据索引']];
              if (mapItem['类型'] === '数值' && typeof value === 'number') {
                value = mapItem['数值精度'] > 0
                  ? value.toLocaleString(undefined, {
                    minimumFractionDigits: mapItem['数值精度'],
                    maximumFractionDigits: mapItem['数值精度'],
                  })
                  : value.toLocaleString();
              }
              if (mapItem['类型'] === '布尔' && typeof value === 'boolean') {
                value = value === true ? '是' : value === false ? '否' : null;
              }
              item[mapItem['数据索引']] = value;
              // 更新列宽
              importDataColumns.value![mapItemIndex].width = Math.min(360, Math.max(
                importDataColumns.value![mapItemIndex].width!,
                (item[mapItem['数据索引']]?.length || 0) * 14 + 16 * 2,
              ));
            });
            return item;
          });
      } else {
        fileForm.file = undefined;
        importDataColumns.value = undefined;
        importData.value = undefined;
        importDataDisplay.value = undefined;
        Modal.error({
          title: '导入失败',
          content: '模板版本错误，请重新下载模板',
        });
      }
    };
    fileReader.readAsBinaryString(fileForm.file);
  } else {
    importDataColumns.value = undefined;
    importData.value = undefined;
    importDataDisplay.value = undefined;
  }
};
const stepToVerifyImportDataReuqest = useRequest(
  async () => {
    const errors = await fileFormComponent.value?.validate();
    if (errors) return;
    if (!importData.value?.length) throw Error('模板数据为空');
    const verifyResults = await props.onVerify?.(importData.value);
    modalWidth.value = 1200;
    step.value = 2;
    await nextTick();
    return verifyResults;
  },
  {
    manual: true,
    onSuccess: verifyResults => {
      if (verifyResults) {
        verifyResults
          .sort((verifyResult_0, verifyResult_1) => verifyResult_0.sequence - verifyResult_1.sequence)
          .forEach((verifyResult, verifyResultIndex) => {
            if (!verifyResult.success) {
              const errors = parseJsonString(verifyResult.resultMessage);
              for (const key in errors) {
                importDataFormHasError.value = true;
                importDataFormComponent.value?.setFields({
                  [`${verifyResultIndex}.${key}`]: { status: 'error', message: errors[key] },
                });
              }
            }
          });
      }
    },
    onError: error => {
      Modal.error({
        title: '验证失败',
        content: getErrorMessage(error),
      });
    },
  },
);

// 验证导入数据
const importDataColumns = ref<TableColumnData[]>();
const importData = ref<any[]>();
const importDataDisplay = ref<any[]>();
const importDataFormComponent = ref<FormInstance>();
const importDataFormHasError = ref(false);
const stepBackSelectFile = () => {
  modalWidth.value = 480;
  step.value = 1;
  importDataFormComponent.value?.clearValidate();
  importDataFormHasError.value = false;
};
const stepToSubmitImportDataRequest = useRequest(
  async () => {
    if (importDataFormHasError.value) return false;
    const closed = await props.onSubmit?.(importData.value!);
    return closed;
  },
  {
    manual: true,
    onSuccess: closed => {
      if (closed !== false) {
        emit('update:visible', false);
      }
    },
    onError: error => {
      Modal.error({
        title: '导入失败',
        content: getErrorMessage(error),
      });
    },
  },
);
</script>

<style lang="less" scoped>
.@{prefix}-alert {
  margin-bottom: 16px;
}

.@{prefix}-table {
  :deep(.@{prefix}-table-content) {
    min-height: 480px;
    overflow: auto;
  }

  :deep(.@{prefix}-table-th) {
    position: sticky;
    top: 0;
    z-index: 1;

    .@{prefix}-table-cell {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  :deep(.@{prefix}-table-td-align-right) {
    .@{prefix}-form-item-content {
      justify-content: flex-end;
    }
  }
}

.value-content {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:empty::before {
    content: '-';
    color: @color-text-4;
  }
}

.@{prefix}-form-item-error {
  .value-content {
    background-color: @color-danger-light-1;
    border-radius: 2px;
  }
}
</style>