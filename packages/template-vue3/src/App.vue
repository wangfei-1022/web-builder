<template>
  <RouterView />
</template>

<script lang="ts" setup>
import { RouterView } from 'vue-router';
</script>

<style lang="less">
// 滚动条
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

::-webkit-scrollbar-thumb {
  border: 4px solid transparent;
  background-clip: padding-box;
  border-radius: 7px;
  background-color: @gray-4;

  &:hover {
    background-color: @gray-6;
  }
}

// 表格
.@{prefix}-table-td>.@{prefix}-table-cell>.@{prefix}-table-td-content:empty::before,
.@{prefix}-table-td>.@{prefix}-table-cell>.@{prefix}-table-td-content>.@{prefix}-auto-tooltip-content:empty::before {
  content: '-';
  color: @color-text-4;
}

.cell-ghost {
  .@{prefix}-table-cell {
    display: none;
  }
}

// 表格表单
.@{prefix}-table-cell .@{prefix}-form-item {
  position: relative;
  margin-bottom: 0;

  &:hover {
    .@{prefix}-form-item-message {
      visibility: visible;
      opacity: 1;
      top: -8px;
    }
  }

  .@{prefix}-form-item-message {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    top: 0;
    z-index: 1;
    transform: translateY(-100%);
    padding: 4px 8px;
    background-color: @color-bg-popup;
    border: 1px solid @color-fill-3;
    border-radius: @border-radius-medium;
    box-shadow: 0 4px 10px #0000001a;
    white-space: nowrap;
    transition: all 0.1s cubic-bezier(0, 0, 1, 1) 0.36s;

    &::before {
      content: '';
      position: absolute;
      left: 16px;
      bottom: -8.6px;
      transform: translate(-50%, -50%) rotate(45deg);
      display: block;
      box-sizing: border-box;
      width: 8px;
      height: 8px;
      background-color: @color-bg-popup;
      border: 1px solid @color-fill-3;
      border-left: none;
      border-top: none;
      border-top-left-radius: @border-radius-small;
    }
  }
}

// 描述列表
.@{prefix}-descriptions {
  &.@{prefix}-descriptions-layout-horizontal {
    .@{prefix}-descriptions-item-label {
      vertical-align: top;

      &::after {
        content: '：';
      }
    }
  }

  .@{prefix}-descriptions-item-value:empty::before {
    content: '-';
    color: @color-text-4;
  }
}

// 树
.@{prefix}-tree-node-drag-icon {
  margin-left: unset !important;
}

// 链接
.@{prefix}-link {
  .@{prefix}-link-icon:only-child {
    margin-right: 0;
  }
}

// 打印
.printing>*:not(.print-wrapper) {
  display: none;
}

// 章节标题
.section-title-1 {
  color: @color-text-1;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 500;
}
</style>