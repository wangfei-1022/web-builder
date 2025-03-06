import { request } from '@/utils';
import type { PnrCustomerCreditInfoVO, Result, Result«List«PnrCustomerCreditInfoVO»», Result«List«下拉框value值对应为short类型»», Result«PnrCustomerCreditInfoVO» } from '../interfaces';

/**
 * 客商信控信息查询列表
 * @param params 参数
 */
export function queryUsingGET_41(
  params?: {
    /** partnerId */
    partnerId?: number;
  },
) {
  return request<OptimizeModel<Result«List«PnrCustomerCreditInfoVO»»>>({
    url: `${__BASE_SERVICE__}/pnr/customer/credit/info`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 客商信控信息新增保存
 * @param data 数据
 */
export function saveUsingPOST_27(
  data: PnrCustomerCreditInfoVO,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/customer/credit/info`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 超限控制下拉框list
 */
export function getControlModeListUsingGET(
) {
  return request<OptimizeModel<Result«List«下拉框value值对应为short类型»»>>({
    url: `${__BASE_SERVICE__}/pnr/customer/credit/info/controlmodelist`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 账期日期类型下拉框List
 */
export function getCreditDateTypeListUsingGET(
) {
  return request<OptimizeModel<Result«List«下拉框value值对应为short类型»»>>({
    url: `${__BASE_SERVICE__}/pnr/customer/credit/info/datetypelist`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 结算方式下拉框List
 */
export function getSettleModeListUsingGET(
) {
  return request<OptimizeModel<Result«List«下拉框value值对应为short类型»»>>({
    url: `${__BASE_SERVICE__}/pnr/customer/credit/info/settlemodelist`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 账期单位下拉框List
 */
export function getCreditTermUnitListUsingGET(
) {
  return request<OptimizeModel<Result«List«下拉框value值对应为short类型»»>>({
    url: `${__BASE_SERVICE__}/pnr/customer/credit/info/termunitlist`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 客商信控信息查询详情
 * @param id ID
 */
export function detailUsingGET_13(
  id: number,
) {
  return request<OptimizeModel<Result«PnrCustomerCreditInfoVO»>>({
    url: `${__BASE_SERVICE__}/pnr/customer/credit/info/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 客商信控信息修改保存
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_35(
  id: number,
  data: PnrCustomerCreditInfoVO,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/customer/credit/info/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 客商信控信息删除
 * @param id id
 */
export function deleteUsingDELETE_37(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/customer/credit/info/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}