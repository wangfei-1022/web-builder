import { request } from '@/utils';
import type { PnrBlAddress, Result, Result«List«PnrBlAddress»», Result«PnrBlAddress» } from '../interfaces';

/**
 * 客商收发通信息列表
 * @param params 参数
 */
export function queryUsingGET_38(
  params?: {
    /** partnerId */
    partnerId?: number;
  },
) {
  return request<OptimizeModel<Result«List«PnrBlAddress»»>>({
    url: `${__BASE_SERVICE__}/pnr/bl/address`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 客商收发通信息新增保存
 * @param data 数据
 */
export function saveUsingPOST_24(
  data: PnrBlAddress,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/bl/address`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 客商收发通信息查询详情
 * @param id ID
 */
export function detailUsingGET_10(
  id: number,
) {
  return request<OptimizeModel<Result«PnrBlAddress»>>({
    url: `${__BASE_SERVICE__}/pnr/bl/address/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 客商收发通信息修改保存
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_32(
  id: number,
  data: PnrBlAddress,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/bl/address/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 客商收发通信息删除
 * @param id id
 */
export function deleteUsingDELETE_34(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/bl/address/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}