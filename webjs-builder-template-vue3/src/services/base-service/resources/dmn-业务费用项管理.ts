import { request } from '@/utils';
import type { Result«List«dmnFeeItemBusiness列表DTO»» } from '../interfaces';

/**
 * 查询业务费用项
 * @param params 参数
 */
export function dmnFeeIemBusinessListUsingGET(
  params: {
    /** 基础费用项类型 */
    businessType?: string;
    /** 基础费用项编码 */
    code?: string;
    /** 创建时间结束 */
    createTimeEnd?: number;
    /** 创建时间开始 */
    createTimeStart?: number;
    /** 主键 */
    id?: number;
    /** 主键列表 */
    ids?: number | number[];
    /** 关键字搜索 */
    keyword?: string;
    /** 基础费用项名称 */
    name?: string;
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 排序 */
    sort?: string;
    /** 基础费用项类型 */
    status?: number;
  },
) {
  return request<OptimizeModel<Result«List«dmnFeeItemBusiness列表DTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/fee/business/list`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}