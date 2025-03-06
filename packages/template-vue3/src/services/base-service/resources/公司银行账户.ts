import { request } from '@/utils';
import type { Result, Result«List«SysBankAccount»», SysBankAccount } from '../interfaces';

/**
 * 新增
 * @param data 数据
 */
export function saveUsingPOST_31(
  data: SysBankAccount,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/bank/account`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 禁用公司银行账号
 * @param id id
 */
export function activeDisableUsingPUT_12(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/bank/account/activedisable/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 启用公司银行账号
 * @param id id
 */
export function activeEnableUsingPUT_13(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/bank/account/activeenable/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 分公司下银行账号list-业务入口
 * @param params 参数
 */
export function bankAccountListUsingGET(
  params?: {
    /** officeId */
    officeId?: number;
  },
) {
  return request<OptimizeModel<Result«List«SysBankAccount»»>>({
    url: `${__BASE_SERVICE__}/sys/bank/account/list-business`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 分公司下银行账号
 * @param officeId officeId
 */
export function bankAccountByOfficeUsingGET(
  officeId: number,
) {
  return request<OptimizeModel<Result«List«SysBankAccount»»>>({
    url: `${__BASE_SERVICE__}/sys/bank/account/list/${officeId}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 查询详情
 * @param id ID
 */
export function detailUsingGET_18(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/bank/account/${id}`,
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
export function updateUsingPUT_40(
  id: number,
  data: SysBankAccount,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/bank/account/${id}`,
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
export function deleteUsingDELETE_42(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/bank/account/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}