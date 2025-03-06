<template>
  <div class="descriptions">
    <div v-if="$slots.title || title || $slots.extra" class="descriptions-head">
      <ARow align="center">
        <ACol flex="1">
          <slot v-if="$slots.title" name="title"></slot>
          <template v-else-if="title">
            <div class="descriptions-head-title">{{ title }}</div>
          </template>
        </ACol>
        <ACol v-if="$slots.extra" flex="initial">
          <slot name="extra"></slot>
        </ACol>
      </ARow>
    </div>
    <div class="descriptions-body" :class="{ 'descriptions-body-inline': inline }">
      <AGrid :cols="cols" :rowGap="4" :colGap="16">
        <AGridItem class="descriptions-item"
                   v-for="column in columns"
                   :key="column.dataIndex"
                   :span="column.span">
          <div class="descriptions-item-label">
            <slot v-if="column.titleSlotName && $slots[column.titleSlotName]" :name="column.titleSlotName" :column="column"></slot>
            <template v-else>{{ column.title }}</template>
          </div>
          <div class="descriptions-item-value">
            <ASkeleton :loading="loading" animation>
              <ASkeletonLine />
            </ASkeleton>
            <div v-if="!loading" class="descriptions-item-value-inner">
              <slot v-if="column.slotName && $slots[column.slotName]"
                    :name="column.slotName"
                    :column="column"
                    :value="data && get(data, column.dataIndex)">
              </slot>
              <template v-else>{{ data && get(data, column.dataIndex) }}</template>
            </div>
          </div>
        </AGridItem>
      </AGrid>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ResponsiveValue } from '@arco-design/web-vue';
import { get } from 'lodash';
import { computed, type PropType } from 'vue';
import type { DescriptionsColumnData } from './Descriptions.extra';

// 定义属性
const props = defineProps({
  /** 标题 */
  title: String,
  /** 每行展示的列数 */
  cols: {
    type: [Number, Object] as PropType<number | ResponsiveValue>,
    default: () => ({ xs: 1, sm: 1, md: 2, lg: 3, xl: 4, xxl: 4 }),
  },
  /** 标签宽度 */
  labelWidth: Number,
  /** 标签对齐 */
  labelAlign: {
    type: String as PropType<'left' | 'right'>,
    default: 'right',
  },
  /** 内联的 */
  inline: Boolean,
  /** 列描述 */
  columns: Array as PropType<DescriptionsColumnData[]>,
  /** 加载状态 */
  loading: Boolean,
  /** 数据 */
  data: Object,
});

// 处理属性
const cssLabelWidth = computed(() => (isNaN(props.labelWidth!) ? 'auto' : `${props.labelWidth}px`));
</script>

<style lang="less" scoped>
.descriptions-head {
  margin-bottom: 12px;
}

.descriptions-head-title {
  color: @color-text-1;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.descriptions-body {
  &.descriptions-body-inline {
    padding: 16px;
    background-color: @color-bg-4;
  }
}

.descriptions-item {
  display: flex;
  line-height: 1.5715;
}

.descriptions-item-label {
  flex: 0 0 v-bind('cssLabelWidth');
  text-align: v-bind('props.labelAlign');
  color: @color-text-3;
  font-weight: 500;

  &::after {
    content: '：';
  }
}

.descriptions-item-value {
  flex: 1;
}

.descriptions-item-value-inner {
  color: @color-text-1;
  font-weight: 400;

  &:empty::before {
    content: '-';
    color: @color-text-4;
  }
}
</style>