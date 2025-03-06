<template>
  <div>
    <AInput placeholder="输入任意查询条件" v-model="keyword" allowClear />
    <ARadioGroup v-model="selectedTemplateId">
      <AGrid v-if="displayTemplates?.length" :cols="3" :colGap="16" :rowGap="16">
        <AGridItem v-for="template in displayTemplates" :key="template.id">
          <ARadio :value="template.id">
            <template #radio="{ checked }">
              <div class="radio-btn" :class="{ 'radio-btn-checked': checked }">
                <ATypographyTitle :heading="6" :ellipsis="{ showTooltip: true }">
                  <IconFile />
                  {{ template.name }}
                </ATypographyTitle>
                <ATypographyParagraph type="secondary" :ellipsis="{ rows: 2, showTooltip: true }">
                  {{ template.description }}
                </ATypographyParagraph>
              </div>
            </template>
          </ARadio>
        </AGridItem>
      </AGrid>
      <AEmpty v-else />
    </ARadioGroup>

    <Teleport to="body">
      <div v-if="printTemplate" class="print-wrapper" ref="printWrapper">
        <component :key="printTemplate.id" :is="printTemplate.component" v-bind="props.templateParams"></component>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, shallowRef, watch, type PropType } from 'vue';
import type { Template } from './Print.extra';

// 定义属性
const props = defineProps({
  /** 模板 */
  templates: {
    type: Array as PropType<Template[]>,
    required: true,
  },
  /** 模板参数 */
  templateParams: Object as PropType<Record<string, any>>,
});

// 筛选模板
const keyword = ref<string>();
const displayTemplates = computed(() => props.templates.filter(template => {
  const keywordReg = RegExp(keyword.value!, 'i');
  return (
    keywordReg.test(template.name) ||
    keywordReg.test(template.description!)
  );
}));

// 选择模板
const selectedTemplateId = ref<Template['id']>();
watch(
  displayTemplates,
  () => {
    if (!displayTemplates.value.some(template => template.id === selectedTemplateId.value)) {
      selectedTemplateId.value = displayTemplates.value[0]?.id;
    }
  },
  { immediate: true },
);

// 打印
const printWrapper = ref<HTMLDivElement>();
const printTemplate = shallowRef<Template>();
const print = async () => {
  printTemplate.value = displayTemplates.value.find(template => template.id === selectedTemplateId.value);
  document.body.classList.add('printing');
  await nextTick();
  await Promise.all(
    Array
      .from(printWrapper.value!.querySelectorAll('img'))
      .map(async img => {
        if (img.complete) return;
        return new Promise(resolve => {
          img.addEventListener('load', resolve);
          img.addEventListener('error', resolve);
        });
      }),
  );
  window.print();
  document.body.classList.remove('printing');
  printTemplate.value = undefined;
};

// 暴露实例
defineExpose({
  /** 打印 */
  print,
});
</script>

<style lang="less" scoped>
.@{prefix}-grid-item {
  display: block !important;
}

.@{prefix}-radio-group {
  display: block;
  margin-top: 20px;
  height: (78px + 16px) * 2 - 16px;
  overflow: auto;

  .@{prefix}-radio {
    display: block;
    margin-right: 0;
    padding-left: 0;
  }
}

.@{prefix}-icon-file {
  margin-right: 4px;
}

.radio-btn {
  padding: 8px 16px;
  background-color: @color-bg-2;
  border: 1px solid @color-fill-3;
  border-radius: @border-radius-small;
  transition: all .1s cubic-bezier(0, 0, 1, 1);

  &:hover {
    background-color: @primary-1;
    border-color: @primary-5;
  }
}

.radio-btn-checked {
  background-color: @primary-5;
  border-color: @primary-5;

  &:hover {
    background-color: @primary-5;
    border-color: @primary-5;
  }

  .@{prefix}-typography {
    color: #fff;
  }
}
</style>