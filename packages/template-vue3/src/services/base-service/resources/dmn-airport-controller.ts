import { request } from '@/utils';
import type { Result«dmnAirportDTO», Result«PageInfo«dmnAirportDTO»» } from '../interfaces';

/**
 * 根据代码查询
 * @param code code
 */
export function queryByCodeUsingGET_1(
  code: string,
) {
  return request<OptimizeModel<Result«dmnAirportDTO»>>({
    url: `${__BASE_SERVICE__}/dmn/airport/code/${code}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 查询列表
 * @param params 参数
 */
export function queryUsingGET_7(
  params: {
    /** 三字码查询 */
    code?: string;
    /** 创建时间结束 */
    createTimeEnd?: number;
    /** 创建时间开始 */
    createTimeStart?: number;
    /** 主键 */
    id?: number;
    /** 主键列表 */
    ids?: number | number[];
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
  return request<OptimizeModel<Result«PageInfo«dmnAirportDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/airport/pages`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}