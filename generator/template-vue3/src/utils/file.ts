import { parseJsonString } from './data';

/**
 * 获取实体文件地址列表
 * @param options 选项
 */
export function getEntityFileUrls<DataIndex extends string>(options: {
  /** 实体 */
  entity: Record<string, any> | undefined;
  /** 数据索引列表 */
  dataIndexes: DataIndex[];
  /** 地址 */
  url: (fileId: number) => string;
}): { [key in DataIndex]: string[] | undefined } {
  return Object.fromEntries(
    options.dataIndexes.map(dataIndex => [
      dataIndex,
      options.entity
        ? parseJsonString<number[]>(options.entity[dataIndex])?.map(options.url)
        : undefined,
    ]),
  ) as any;
}