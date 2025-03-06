<template>
  <div class="full-screen" :class="{ 'full-screen-active': props.modelValue }">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, watch } from 'vue';

// 定义属性
const props = defineProps({
  /** 模型值 */
  modelValue: Boolean,
});

// 定义事件
const emit = defineEmits<{
  (event: 'update:modelValue', modelValue: boolean): void;
}>();

// 监听全屏变化
watch(
  () => props.modelValue,
  () => {
    const isFullScreenWidthBody = (
      document.fullscreenElement === document.body ||
      (document as any).webkitFullScreenElement === document.body ||
      (document as any).mozFullScreenElement === document.body
    );
    if (props.modelValue) {
      if (!isFullScreenWidthBody) {
        if (document.body.requestFullscreen) {
          document.body.requestFullscreen();
        } else if ((document.body as any).webkitRequestFullScreen) {
          (document.body as any).webkitRequestFullScreen();
        } else if ((document.body as any).mozRequestFullScreen) {
          (document.body as any).mozRequestFullScreen();
        }
      }
    } else {
      if (isFullScreenWidthBody) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          (document as any).mozCancelFullScreen();
        }
      }
    }
  },
  { immediate: true },
);

// 退出全屏
const updateExitFullScreenHandle = () => {
  const isFullScreenWidthBody = (
    document.fullscreenElement === document.body ||
    (document as any).webkitFullScreenElement === document.body ||
    (document as any).mozFullScreenElement === document.body
  );
  if (isFullScreenWidthBody) {
    if (props.modelValue !== true) {
      emit('update:modelValue', true);
    }
  } else {
    if (props.modelValue !== false) {
      emit('update:modelValue', false);
    }
  }
}
document.addEventListener('fullscreenchange', updateExitFullScreenHandle);
document.addEventListener('webkitfullscreenchange', updateExitFullScreenHandle);
document.addEventListener('mozfullscreenchange', updateExitFullScreenHandle);
onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', updateExitFullScreenHandle);
  document.removeEventListener('webkitfullscreenchange', updateExitFullScreenHandle);
  document.removeEventListener('mozfullscreenchange', updateExitFullScreenHandle);
});
</script>

<style lang="less" scoped>
.full-screen-active {
  background-color: @color-bg-1;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
}
</style>