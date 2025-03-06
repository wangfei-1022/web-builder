<template>
  <div class="water-mark-container">
    <slot></slot>
    <div class="water-mark-inner" ref="waterMarkInnerOdd"></div>
    <div class="water-mark-inner" ref="waterMarkInnerEven"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const waterMarkInnerOdd = ref<HTMLDivElement>();
const waterMarkInnerEven = ref<HTMLDivElement>();

// 定义属性
const props = defineProps({
  /** 内容 */
  content: {
    type: String,
    required: true,
  },
  /** 字体尺寸 */
  fontSize: {
    type: Number,
    default: 16,
  },
  /** 字体名称，默认为文档 body 的字体名称 */
  fontFamily: String,
  /** 颜色 */
  color: {
    type: String,
    default: '#A9AEB8',
  },
  /** 透明度 */
  opacity: {
    type: Number,
    default: 0.25,
  },
  /** 旋转角度 */
  rotate: {
    type: Number,
    default: -12,
  },
  /** 间隔 */
  space: {
    type: Number,
    default: 45,
  },
  /** 层叠 */
  zIndex: Number,
});

// 添加水印
watch(
  () => ({ ...props }),
  () => {
    const {
      fontSize,
      fontFamily = getComputedStyle(document.body).fontFamily,
      color,
      opacity,
      rotate,
      space,
      zIndex,
    } =
      props;
    const canvas = document.createElement('canvas');
    let context = canvas.getContext('2d')!;
    context.font = `${fontSize}px ${fontFamily}`;
    const textWidth = context.measureText(props.content).width;
    const textHeight = fontSize * 1.35;
    const rad = rotate * Math.PI / 180;
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);
    const newTextWidth = Math.abs(textWidth * cos) + Math.abs(textHeight * sin) + space * 2;
    const newTextHeight = Math.abs(textWidth * sin) + Math.abs(textHeight * cos) + space * 2;
    canvas.width = newTextWidth;
    canvas.height = newTextHeight * 2;
    context = canvas.getContext('2d')!;
    context.font = `${fontSize}px ${fontFamily}`;
    context.translate(newTextWidth / 2, newTextHeight / 2);
    context.rotate(rad);
    context.fillStyle = color;
    context.globalAlpha = opacity;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(props.content, 0, 0);
    const waterMarkUrl = canvas.toDataURL('image/png');
    waterMarkInnerOdd.value!.style.background = `url(${waterMarkUrl}) ${-space}px ${-space}px repeat`;
    waterMarkInnerOdd.value!.style.zIndex = zIndex?.toString() || '';
    waterMarkInnerEven.value!.style.background = `url(${waterMarkUrl}) ${-space + newTextWidth / 2}px ${-space + newTextHeight}px repeat`;
    waterMarkInnerEven.value!.style.zIndex = zIndex?.toString() || '';
  },
);
</script>

<style lang="less" scoped>
.water-mark-container {
  position: relative;
}

.water-mark-inner {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
}
</style>