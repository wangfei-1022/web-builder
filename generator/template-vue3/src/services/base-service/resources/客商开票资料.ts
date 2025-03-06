import { request } from '@/utils';
import type { PnrInvoiceInfo, Result, Result«List«PnrInvoiceInfo»», Result«PnrInvoiceInfo», Result«结算单位发票税号地址及其他信息» } from '../interfaces';

/**
 * 客商结算单位发票税号地址及其他信息
 * @param id ID
 * @param params 参数
 */
export function getCustTaxInfoUsingGET(
  id: any,
  params?: {
    /** customerId */
    customerId?: number;
    /** invoiceTitle */
    invoiceTitle?: string;
  },
) {
  return request<OptimizeModel<Result«结算单位发票税号地址及其他信息»>>({
    url: `${__BASE_SERVICE__}/pnr/invoice/custTaxInfo`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 客商开票资料查询列表
 * @param params 参数
 */
export function queryUsingGET_43(
  params?: {
    /** partnerId */
    partnerId?: number;
  },
) {
  return request<OptimizeModel<Result«List«PnrInvoiceInfo»»>>({
    url: `${__BASE_SERVICE__}/pnr/invoice/info`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 客商开票资料新增保存
 * @param data 数据
 */
export function saveUsingPOST_29(
  data: PnrInvoiceInfo,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/invoice/info`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 禁用客商开票资料
 * @param id id
 */
export function activeDisableUsingPUT_10(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/invoice/info/activedisable/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 启用客商开票资料
 * @param id id
 */
export function activeEnableUsingPUT_11(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/invoice/info/activeenable/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 客商开票资料查询详情
 * @param id ID
 */
export function detailUsingGET_15(
  id: number,
) {
  return request<OptimizeModel<Result«PnrInvoiceInfo»>>({
    url: `${__BASE_SERVICE__}/pnr/invoice/info/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 客商开票资料修改保存
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_37(
  id: number,
  data: PnrInvoiceInfo,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/invoice/info/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 客商开票资料删除
 * @param id id
 */
export function deleteUsingDELETE_39(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/invoice/info/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}