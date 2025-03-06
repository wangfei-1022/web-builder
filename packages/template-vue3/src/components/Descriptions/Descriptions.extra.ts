import type { ResponsiveValue } from '@arco-design/web-vue';

/** 描述列表列描述数据 */
export interface DescriptionsColumnData {
  [key: string]: any;
  /** 标题 */
  title: string;
  /** 标题插槽名称 */
  titleSlotName?: string;
  /** 数据索引 */
  dataIndex: string;
  /** 插槽名称 */
  slotName?: string;
  /** 跨越的格数 */
  span?: number | ResponsiveValue;
}