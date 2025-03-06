import { request } from '@/utils';
import type { PnrCustomerPosition, Result, Result«List«PnrCustomerPositionVO»», Result«PnrCustomerPositionVO» } from '../interfaces';

/**
 * 客户服务人员列表
 * @param params 参数
 */
export function queryUsingGET_42(
  params?: {
    /** partnerId */
    partnerId?: number;
  },
) {
  return request<OptimizeModel<Result«List«PnrCustomerPositionVO»»>>({
    url: `${__BASE_SERVICE__}/pnr/customer/position`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 客户服务人员新增保存
 * @param data 数据
 */
export function saveUsingPOST_28(
  data: PnrCustomerPosition,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/customer/position`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 客户服务人员查询详情
 * @param id ID
 */
export function detailUsingGET_14(
  id: number,
) {
  return request<OptimizeModel<Result«PnrCustomerPositionVO»>>({
    url: `${__BASE_SERVICE__}/pnr/customer/position/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 客户服务人员修改保存
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_36(
  id: number,
  data: PnrCustomerPosition,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/customer/position/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 客户服务人员删除
 * @param id id
 */
export function deleteUsingDELETE_38(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/customer/position/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}