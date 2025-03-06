import { request } from '@/utils';
import type { Result«PageInfo«DmnHscode»» } from '../interfaces';

/**
 * hscodehscode查询列表
 * @param params 参数
 */
export function queryUsingGET_20(
  params: {
    /** goodsName */
    goodsName?: string;
    /** hsCode */
    hsCode?: string;
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 排序 */
    sort?: string;
  },
) {
  return request<OptimizeModel<Result«PageInfo«DmnHscode»»>>({
    url: `${__BASE_SERVICE__}/dmn/hscode`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}