import { request } from '@/utils';
import type { Result«dmnAirlineCompanyDTO», Result«PageInfo«dmnAirlineCompanyDTO»» } from '../interfaces';

/**
 * 根据代码查询
 * @param code code
 */
export function queryByCodeUsingGET(
  code: string,
) {
  return request<OptimizeModel<Result«dmnAirlineCompanyDTO»>>({
    url: `${__BASE_SERVICE__}/dmn/airline/company/code/${code}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 查询列表
 * @param params 参数
 */
export function queryUsingGET_6(
  params: {
    /** code查询 */
    code?: string;
    /** 关键字查询 */
    keyword?: string;
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 排序 */
    sort?: string;
  },
) {
  return request<OptimizeModel<Result«PageInfo«dmnAirlineCompanyDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/airline/company/pages`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}