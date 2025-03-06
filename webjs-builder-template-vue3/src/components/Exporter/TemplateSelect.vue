<template>
  <div class="template-select">
    <AInput placeholder="输入任意查询条件" v-model="keyword" allowClear />
    <ARadioGroup v-model="current">
      <AGrid v-if="_templates.length" :cols="3" :colGap="16" :rowGap="16">
        <AGridItem v-for="{ id, name, description } in _templates" :key="id">
          <ARadio :value="id">
            <template #radio="{ checked }">
              <div class="radio-btn" :class="{ 'radio-btn-checked': checked }">
                <ATypographyTitle :heading="6" :ellipsis="{ showTooltip: true }">
                  <IconFile />
                  {{ name }}
                </ATypographyTitle>
                <ATypographyParagraph type="secondary" :ellipsis="{ rows: 2, showTooltip: true }">
                  {{ description }}
                </ATypographyParagraph>
              </div>
            </template>
          </ARadio>
        </AGridItem>
      </AGrid>
      <AEmpty v-else />
    </ARadioGroup>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, type PropType } from 'vue';
import type { ExporterTemplate } from './Exporter';

// 定义属性
const props = defineProps({
  /** 模板 */
  templates: {
    type: Array as PropType<ExporterTemplate[]>,
    required: true,
  },
  /** 模型值 */
  modelValue: Function as PropType<ExporterTemplate['request']>,
});

// 定义事件
const emit = defineEmits<{
  (event: 'update:modelValue', value: ExporterTemplate['request'] | undefined): void;
}>();

// 筛选模板
const keyword = ref<string>();
const _templates = computed(() => props.templates.filter(template => {
  const keywordReg = RegExp(keyword.value!, 'i');
  return (
    keywordReg.test(template.name) ||
    keywordReg.test(template.description!)
  );
}));

// 选择模板
const current = ref<ExporterTemplate['id']>();
watch(
  _templates,
  () => {
    if (!_templates.value.some(({ id }) => id === current.value)) {
      current.value = _templates.value[0]?.id;
    }
  },
  { immediate: true },
);
watch(
  current,
  () => {
    const template = _templates.value.find(({ id }) => id === current.value);
    emit('update:modelValue', template?.request);
  },
  { immediate: true },
);
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