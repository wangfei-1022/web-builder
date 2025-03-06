import { request } from '@/utils';
import type { DmnSeaLine, Result, Result«PageInfo«DmnSeaLine»» } from '../interfaces';

/**
 * 海运航线查询列表
 * @param params 参数
 */
export function queryUsingGET_24(
  params: {
    /** 行政区划等级 0:省;1:城市;2:区县 */
    areaLevel?: number;
    /** 编码 */
    code?: string;
    /** 国家二字码list */
    code2List?: string | string[];
    /** 国家代码 */
    countryCode?: string;
    /** 创建日期起始日 */
    createTimeBegin?: number;
    /** 创建日期截止日 */
    createTimeEnd?: number;
    /** ids */
    ids?: number | number[];
    /** 关键字 */
    keyword?: string;
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 上级code */
    parentCode?: string;
    /** 排序 */
    sort?: string;
    /** 租户id */
    tenantId?: number;
  },
) {
  return request<OptimizeModel<Result«PageInfo«DmnSeaLine»»>>({
    url: `${__BASE_SERVICE__}/dmn/sea/line`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 海运航线新增保存
 * @param data 数据
 */
export function saveUsingPOST_15(
  data: DmnSeaLine,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/sea/line`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * MDM同步数据至CW_dmn数据接收
 * @param data 数据
 */
export function synDataUsingPOST_6(
  data: DmnSeaLine,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/sea/line/syndata`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 海运航线修改保存
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_22(
  id: number,
  data: DmnSeaLine,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/sea/line/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 海运航线删除
 * @param id id
 */
export function deleteUsingDELETE_22(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/sea/line/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}