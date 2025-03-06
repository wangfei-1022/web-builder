import { request } from '@/utils';
import type { PnrContractInfo, Result, Result«List«PnrContractInfoVO»», Result«List«下拉框value值对应为short类型»», Result«PnrContractInfoVO», Result«客商合同信息» } from '../interfaces';

/**
 * 客商合同信息查询列表
 * @param params 参数
 */
export function queryUsingGET_40(
  params?: {
    /** partnerId */
    partnerId?: number;
  },
) {
  return request<OptimizeModel<Result«List«PnrContractInfoVO»»>>({
    url: `${__BASE_SERVICE__}/pnr/contract/info`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 客商合同新增保存
 * @param data 数据
 */
export function saveUsingPOST_26(
  data: PnrContractInfo,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/contract/info`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 客商合同日期信息
 * @param params 参数
 */
export function getCalContractInfoUsingGET(
  params?: {
    /** 业务类型 */
    jobType?: number;
    /** 客商Id */
    partnerId?: number;
  },
) {
  return request<OptimizeModel<Result«客商合同信息»>>({
    url: `${__BASE_SERVICE__}/pnr/contract/info/cal`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 客商合同信息业务类型下拉框List
 * @param partnerId 客商Id
 */
export function getJobTypeListUsingGET(
  partnerId: number,
) {
  return request<OptimizeModel<Result«List«下拉框value值对应为short类型»»>>({
    url: `${__BASE_SERVICE__}/pnr/contract/info/jobtypelist/${partnerId}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 客商合同查询详情
 * @param id ID
 */
export function detailUsingGET_12(
  id: number,
) {
  return request<OptimizeModel<Result«PnrContractInfoVO»>>({
    url: `${__BASE_SERVICE__}/pnr/contract/info/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 客商合同修改保存
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_34(
  id: number,
  data: PnrContractInfo,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/contract/info/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 客商合同删除
 * @param id id
 */
export function deleteUsingDELETE_36(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/contract/info/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}