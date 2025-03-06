/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare global {
  import '@arco-design/web-vue/es/components';
  import '@arco-design/web-vue/es/icon/icon-components.d.ts';
  import 'vue';
  declare module 'vue' {
    declare interface MultiTabbed {
      /** 刷新当前标签 */
      refreshCurrentTab: () => void;
      /** 关闭当前标签 */
      closeCurrentTab: () => void;
      /** 设置当前标签标题 */
      setCurrentTabTitle: (title: string) => void;
    }
    export function provide(key: 'multiTabbed', value: () => MultiTabbed): void;
    export function inject(key: 'multiTabbed'): (() => MultiTabbed) | undefined;
  }
}

/** 优化模型 */
type OptimizeModel<ModelValue extends Record<string, any>> = {
  [Key in keyof ModelValue]-?:
  Key extends
  | 'id'
  | 'createdBy'
  | 'createdTime'
  | 'lastModifiedBy'
  | 'lastModifiedTime'
  ? NonNullable<ModelValue[Key]>
  : ModelValue[Key] extends
  | string
  | number
  | boolean
  | undefined
  | null
  ? ModelValue[Key]
  : OptimizeModel<ModelValue[Key]>;
};

/** 可选模型 */
type PartialModel<ModelValue extends Record<string, any>> = {
  [Key in keyof ModelValue]?:
  ModelValue[Key] extends
  | string
  | number
  | boolean
  | undefined
  | null
  ? ModelValue[Key]
  : PartialModel<ModelValue[Key]>;
};

/** 优化表单 */
type OptimizeForm<FormValue extends Record<string, any>, ModelValue extends Record<string, any>> = {
  [Key in keyof FormValue]-?:
  Key extends keyof ModelValue
  ? FormValue[Key] extends
  | string
  | number
  | boolean
  | undefined
  | null
  ? Exclude<ModelValue[Key], null>
  : OptimizeForm<FormValue[Key], NonNullable<ModelValue[Key]>>
  : FormValue[Key];
};

/** 解析类型 */
type Resolve<Handle> =
  Handle extends (...args: any) => any
  ? Resolve<ReturnType<Handle>>
  : Handle extends Promise<infer Data>
  ? Data
  : Handle;

/** 应用名称 */
declare const __APP_NAME__: string;
/** 令牌存储键 */
declare const __TOKEN_STORAGE_KEY__: string;