import { request } from '@/utils';
import type { PnrContact, Result, Result«List«PnrContact»», Result«PnrContact» } from '../interfaces';

/**
 * 客商联系人查询列表
 * @param params 参数
 */
export function queryUsingGET_39(
  params?: {
    /** partnerId */
    partnerId?: number;
  },
) {
  return request<OptimizeModel<Result«List«PnrContact»»>>({
    url: `${__BASE_SERVICE__}/pnr/contact`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 客商联系人新增保存
 * @param data 数据
 */
export function saveUsingPOST_25(
  data: PnrContact,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/contact`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 禁用客商联系人
 * @param id id
 */
export function activeDisableUsingPUT_9(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/contact/activedisable/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 启用客商联系人
 * @param id id
 */
export function activeEnableUsingPUT_10(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/contact/activeenable/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 客商联系人查询详情
 * @param id ID
 */
export function detailUsingGET_11(
  id: number,
) {
  return request<OptimizeModel<Result«PnrContact»>>({
    url: `${__BASE_SERVICE__}/pnr/contact/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 客商联系人修改保存
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_33(
  id: number,
  data: PnrContact,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/contact/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 客商联系人删除
 * @param id id
 */
export function deleteUsingDELETE_35(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/contact/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}