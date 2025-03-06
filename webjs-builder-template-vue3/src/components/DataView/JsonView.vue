<template>
  <slot :data="parseJsonString(value)"></slot>
</template>

<script lang="ts" setup>
import { parseJsonString } from '@/utils';
import type { PropType } from 'vue';

// 定义属性
defineProps({
  /** Json值 */
  value: [String, Object] as PropType<string | null>,
});
</script>