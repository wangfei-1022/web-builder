import { request } from '@/utils';
import type { ComSailingSchedule, Result, Result«ComSailingScheduleVO», Result«List«ComSailingScheduleVO»», Result«PageInfo«ComSailingScheduleVO»» } from '../interfaces';

/**
 * 船期查询列表
 * @param params 参数
 */
export function queryUsingGET_1(
  params: {
    /** 船公司id */
    carrierId?: number;
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
    /** 船名 */
    vesselName?: string;
    /** 航次 */
    voyageNo?: string;
  },
) {
  return request<OptimizeModel<Result«PageInfo«ComSailingScheduleVO»»>>({
    url: `${__BASE_SERVICE__}/com/sailing/schedule`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 船期新增保存
 * @param data 数据
 */
export function saveUsingPOST_4(
  data: ComSailingSchedule,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/com/sailing/schedule`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 船期批量删除
 * @param params 参数
 */
export function deleteBatchUsingDELETE(
  params?: {
    /** ids */
    ids?: string;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/com/sailing/schedule/batch`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 业务入口船期信息下拉框List
 * @param params 参数
 */
export function queryByListUsingGET(
  params?: {
    /** carrierId */
    carrierId?: number;
    /** vessel */
    vessel?: string;
  },
) {
  return request<OptimizeModel<Result«List«ComSailingScheduleVO»»>>({
    url: `${__BASE_SERVICE__}/com/sailing/schedule/list`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 船期查询详情
 * @param id ID
 */
export function detailUsingGET_2(
  id: number,
) {
  return request<OptimizeModel<Result«ComSailingScheduleVO»>>({
    url: `${__BASE_SERVICE__}/com/sailing/schedule/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 船期修改保存
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_2(
  id: number,
  data: ComSailingSchedule,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/com/sailing/schedule/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 船期删除
 * @param id id
 */
export function deleteUsingDELETE_3(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/com/sailing/schedule/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}