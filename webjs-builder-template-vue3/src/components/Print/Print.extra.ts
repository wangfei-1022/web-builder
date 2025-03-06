import type { Component } from 'vue';

/** 模板 */
export interface Template {
  /** 唯一标识 */
  id: string | number;
  /** 名称 */
  name: string;
  /** 描述 */
  description?: string;
  /** 组件 */
  component: Component;
}