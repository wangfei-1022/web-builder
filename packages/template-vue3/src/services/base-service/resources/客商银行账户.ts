import { request } from '@/utils';
import type { PnrBankAccount, Result, Result«List«PnrBankAccount»», Result«PnrBankAccount» } from '../interfaces';

/**
 * 客商银行账户查询列表
 * @param params 参数
 */
export function queryUsingGET_37(
  params?: {
    /** partnerId */
    partnerId?: number;
  },
) {
  return request<OptimizeModel<Result«List«PnrBankAccount»»>>({
    url: `${__BASE_SERVICE__}/pnr/bank/account`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 客商银行账户新增保存
 * @param data 数据
 */
export function saveUsingPOST_23(
  data: PnrBankAccount,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/bank/account`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 禁用客商银行账户
 * @param id id
 */
export function activeDisableUsingPUT_8(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/bank/account/activedisable/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 启用客商银行账户
 * @param id id
 */
export function activeEnableUsingPUT_9(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/bank/account/activeenable/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 客商银行账户查询详情
 * @param id ID
 */
export function detailUsingGET_9(
  id: number,
) {
  return request<OptimizeModel<Result«PnrBankAccount»>>({
    url: `${__BASE_SERVICE__}/pnr/bank/account/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 客商银行账户修改保存
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_31(
  id: number,
  data: PnrBankAccount,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/bank/account/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 客商银行账户删除
 * @param id id
 */
export function deleteUsingDELETE_33(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/bank/account/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}