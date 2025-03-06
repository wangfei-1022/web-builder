<template>
  <AForm ref="form" :model="formValue" layout="vertical">
    <AGrid :cols="1" :colGap="16">
      <AGridItem>
        <AFormItem label="where"
                   field="where">
          <ASelect placeholder="请选择"
                   :triggerProps="{ autoFitPopupMinWidth: true }"
                   v-model="formValue.where"
                   allowClear
                   allowSearch />
        </AFormItem>
      </AGridItem>
      <AGridItem>
        <AFormItem label="limit"
                   field="limit">
          <ASelect placeholder="请选择"
                   :triggerProps="{ autoFitPopupMinWidth: true }"
                   v-model="formValue.limit"
                   allowClear
                   allowSearch />
        </AFormItem>
      </AGridItem>
    </AGrid>
  </AForm>
</template>

<script lang="ts" setup>
import type { UserListDto } from '@/services/test-service';
import { updateForm, useFormTransform } from '@/utils';
import type { FormInstance } from '@arco-design/web-vue';
import { cloneDeep } from 'lodash';
import { reactive, ref, watch, type PropType } from 'vue';

const form = ref<FormInstance>();

// 定义属性
const props = defineProps({
  /** 表单补丁 */
  patch: Object as PropType<PartialModel<OptimizeModel<UserListDto>>>,
});

// 表单值
const formInitialValue = {
  /** where */
  where: undefined as ref | undefined,
  /** limit */
  limit: undefined as ref | undefined,
};
const formValue = reactive(cloneDeep(formInitialValue));
const formTransform = useFormTransform<typeof formInitialValue, OptimizeModel<UserListDto>>([
]);

// 更新表单关联值
// const updateFormRelatedValueHandle = (field: keyof typeof formInitialValue) => {
// };

// 更新表单值
watch(
  () => props.patch,
  () => {
    const { ...patch } = props.patch ?? {};
    const formPatch = {
      ...cloneDeep(formInitialValue),
      ...formTransform.toFormPatch(patch),
    };
    updateForm(formValue, formPatch);
  },
  {
    immediate: true,
  },
);

// 暴露实例
defineExpose({
  /**
   * 校验表单
   */
  validate: async () => {
    const errors = await form.value!.validate();
    if (errors) throw errors;
    const { ..._formValue } = formValue;
    const modelPatch = {
      ...formTransform.toModelPatch(_formValue),
    };
    return modelPatch as OptimizeForm<typeof modelPatch, UserListDto>;
  },
});
</script>