import { request } from '@/utils';
import type { ComVessel, Result, Result«ComVessel», Result«List«ComVesselVO»», Result«List«下拉框value值对应为short类型»», Result«PageInfo«ComVesselVO»» } from '../interfaces';

/**
 * 船舶信息查询列表
 * @param params 参数
 */
export function queryUsingGET_3(
  params: {
    /** 船舶呼号 */
    callSign?: string;
    /** 船公司简称 */
    carrierShortName?: string;
    /** 中文船名 */
    chineseName?: string;
    /** 英文船名 */
    englishName?: string;
    /** 简单查询通用条件key */
    keyword?: string;
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 排序 */
    sort?: string;
    /** 租户id */
    tenantId?: number;
    /** 船舶代码 */
    vesselCode?: string;
  },
) {
  return request<OptimizeModel<Result«PageInfo«ComVesselVO»»>>({
    url: `${__BASE_SERVICE__}/com/vessel`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 船舶信息新增保存
 * @param data 数据
 */
export function saveUsingPOST_5(
  data: ComVessel,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/com/vessel`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 船舶信息批量删除
 * @param params 参数
 */
export function deleteBatchUsingDELETE_1(
  params?: {
    /** ids */
    ids?: string;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/com/vessel/batch`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 船舶信息下拉框List
 * @param params 参数
 */
export function queryByListUsingGET_1(
  params?: {
    /** keyword */
    keyword?: string;
  },
) {
  return request<OptimizeModel<Result«List«ComVesselVO»»>>({
    url: `${__BASE_SERVICE__}/com/vessel/list`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 船舶类型下拉框List
 */
export function getVesselTypeListUsingGET(
) {
  return request<OptimizeModel<Result«List«下拉框value值对应为short类型»»>>({
    url: `${__BASE_SERVICE__}/com/vessel/vesseltypelist`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 船舶信息查询详情
 * @param id ID
 */
export function detailUsingGET_3(
  id: number,
) {
  return request<OptimizeModel<Result«ComVessel»>>({
    url: `${__BASE_SERVICE__}/com/vessel/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 船舶信息修改保存
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_4(
  id: number,
  data: ComVessel,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/com/vessel/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 船舶信息删除
 * @param id id
 */
export function deleteUsingDELETE_4(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/com/vessel/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}