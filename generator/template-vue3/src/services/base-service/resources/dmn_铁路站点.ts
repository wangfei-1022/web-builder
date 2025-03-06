import { request } from '@/utils';
import type { Result«DmnRailwayStationVO», Result«List«DmnRailwayStationVO»» } from '../interfaces';

/**
 * 铁路站点查询列表
 * @param params 参数
 */
export function queryDropDownListUsingGET(
  params: {
    /** ids */
    ids?: number | number[];
    /** 关键字 */
    keyword?: string;
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 排序 */
    sort?: string;
    /** 租户id */
    tenantId?: number;
  },
) {
  return request<OptimizeModel<Result«List«DmnRailwayStationVO»»>>({
    url: `${__BASE_SERVICE__}/dmn/railway/station/dropdown/list`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * getDmnRailwayStationByCode
 * @param params 参数
 */
export function getDmnRailwayStationByCodeUsingGET(
  params: {
    /** code */
    code: string;
  },
) {
  return request<OptimizeModel<Result«DmnRailwayStationVO»>>({
    url: `${__BASE_SERVICE__}/dmn/railway/station/getDmnRailwayStationByCode`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 铁路站点查询列表
 * @param params 参数
 */
export function queryListUsingGET(
  params: {
    /** ids */
    ids?: number | number[];
    /** 关键字 */
    keyword?: string;
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 排序 */
    sort?: string;
    /** 租户id */
    tenantId?: number;
  },
) {
  return request<OptimizeModel<Result«List«DmnRailwayStationVO»»>>({
    url: `${__BASE_SERVICE__}/dmn/railway/station/list`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}