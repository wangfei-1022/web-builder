<template>
  <NumberView class="percent-view" :value="_value" :format="format" :grouping="grouping" suffix="%">
    <slot v-if="$slots.empty" name="empty"></slot>
  </NumberView>
</template>

<script lang="ts" setup>
import Big from 'big.js';
import { computed, type PropType } from 'vue';
import NumberView from './NumberView.vue';

// 定义属性
const props = defineProps({
  /** 数值 */
  value: [Number, String, Object] as PropType<number | string | null>,
  /** 转换数值 */
  transform: {
    type: Boolean,
    default: true,
  },
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
});

// 显示值
const _value = computed(() => {
  let result: number | undefined;
  switch (typeof props.value) {
    case 'number': result = props.value; break;
    case 'string': result = parseFloat(props.value); break;
  }
  if (typeof result === 'number' && !isNaN(result)) {
    return props.transform
      ? Big(result).mul(100).toNumber()
      : result;
  }
});
</script>