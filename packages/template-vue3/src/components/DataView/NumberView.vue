<template>
  <span class="number-view">
    <template v-if="_value !== undefined">
      <slot v-if="$slots.prefix" name="prefix"></slot>
      <span v-else-if="prefix" class="number-view-prefix">{{ prefix }}</span>
      <span class="number-view-value">{{ _value }}</span>
      <slot v-if="$slots.suffix" name="suffix"></slot>
      <span v-else-if="suffix" class="number-view-suffix">{{ suffix }}</span>
    </template>
    <template v-else>
      <slot v-if="$slots.empty" name="empty"></slot>
      <span v-else class="number-view-empty"></span>
    </template>
  </span>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue';

// 定义属性
const props = defineProps({
  /** 数值 */
  value: [Number, String, Object] as PropType<number | string | null>,
  /**
   * 格式
   * @usage <整数最小位数>.<小数最小位数>-<小数最大位数>
   * @usage <整数最小位数>.<小数位数>
   * @usage <整数最小位数>
   */
  format: {
    type: String as PropType<`${bigint}.${bigint}-${bigint}` | `${bigint}.${bigint}` | `${bigint}`>,
    default: '1.0-2',
  },
  /** 分组 */
  grouping: {
    type: Boolean,
    default: true,
  },
  /** 前缀 */
  prefix: String,
  /** 后缀 */
  suffix: String,
});

// 显示值
const _value = computed(() => {
  let result: number | undefined;
  switch (typeof props.value) {
    case 'number': result = props.value; break;
    case 'string': result = parseFloat(props.value); break;
  }
  if (typeof result === 'number' && !isNaN(result)) {
    let [
      minimumIntegerDigits,
      minimumFractionDigits,
      maximumFractionDigits,
    ] =
      props.format.split(/[.-]/).map(value => Number(value));
    if (minimumIntegerDigits === 0) {
      minimumIntegerDigits = 1;
    }
    if (minimumFractionDigits === undefined) {
      minimumFractionDigits = 0;
    }
    if (maximumFractionDigits === undefined) {
      maximumFractionDigits = minimumFractionDigits;
    }
    return result.toLocaleString(undefined, {
      useGrouping: props.grouping,
      minimumIntegerDigits,
      minimumFractionDigits,
      maximumFractionDigits,
    });
  }
});
</script>

<style lang="less" scoped>
.number-view-empty {
  &::before {
    content: '-';
    color: @color-text-4;
  }
}
</style>