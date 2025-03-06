<template>
  <span class="boolean-view">
    <template v-if="value === true">
      <slot v-if="$slots.trueValue" name="trueValue"></slot>
      <span class="boolean-view-value">{{ trueValue }}</span>
    </template>
    <template v-else-if="value === false">
      <slot v-if="$slots.falseValue" name="falseValue"></slot>
      <span class="boolean-view-value">{{ falseValue }}</span>
    </template>
    <template v-else>
      <slot v-if="$slots.empty"></slot>
      <span v-else class="boolean-view-empty"></span>
    </template>
  </span>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';

// 定义属性
defineProps({
  /** 布尔值 */
  value: [Boolean, Object] as PropType<boolean | null>,
  /** 为真时的值 */
  trueValue: {
    type: String,
    default: '是',
  },
  /** 为假时的值 */
  falseValue: {
    type: String,
    default: '否',
  },
});
</script>

<style lang="less" scoped>
.boolean-view-empty {
  &::before {
    content: '-';
    color: @color-text-4;
  }
}
</style>