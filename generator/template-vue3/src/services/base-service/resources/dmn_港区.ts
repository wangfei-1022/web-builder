import { request } from '@/utils';
import type { DmnBerth, Result, Result«DmnBerth», Result«PageInfo«DmnBerth»» } from '../interfaces';

/**
 * 查询列表
 * @param params 参数
 */
export function queryUsingGET_8(
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
  return request<OptimizeModel<Result«PageInfo«DmnBerth»»>>({
    url: `${__BASE_SERVICE__}/dmn/berth`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 新增
 * @param data 数据
 */
export function saveUsingPOST_7(
  data: DmnBerth,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/berth`,
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
export function synDataUsingPOST_3(
  data: DmnBerth,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/berth/syndata`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 查询详情
 * @param id ID
 */
export function detailUsingGET_4(
  id: number,
) {
  return request<OptimizeModel<Result«DmnBerth»>>({
    url: `${__BASE_SERVICE__}/dmn/berth/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 修改
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_6(
  id: number,
  data: DmnBerth,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/berth/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 删除
 * @param id id
 */
export function deleteUsingDELETE_7(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/berth/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}