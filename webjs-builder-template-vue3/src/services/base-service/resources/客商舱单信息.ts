import { request } from '@/utils';
import type { PnrManifestInfo, Result, Result«List«PnrManifestInfo»», Result«PnrManifestInfo» } from '../interfaces';

/**
 * 客商舱单信息查询列表-反恐舱单
 * @param params 参数
 */
export function queryUsingGET_44(
  params?: {
    /** partnerId */
    partnerId?: number;
  },
) {
  return request<OptimizeModel<Result«List«PnrManifestInfo»»>>({
    url: `${__BASE_SERVICE__}/pnr/manifest/info/ct`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 客商舱单信息新增保存-反恐舱单
 * @param data 数据
 */
export function saveCtManifestUsingPOST(
  data: PnrManifestInfo,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/manifest/info/ct`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 客商舱单信息查询详情-反恐舱单
 * @param id ID
 */
export function detailCtUsingGET(
  id: number,
) {
  return request<OptimizeModel<Result«PnrManifestInfo»>>({
    url: `${__BASE_SERVICE__}/pnr/manifest/info/ct/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 客商舱单信息修改保存-反恐舱单
 * @param id id
 * @param data 数据
 */
export function updateCtUsingPUT(
  id: number,
  data: PnrManifestInfo,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/manifest/info/ct/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 客商舱单信息删除-反恐舱单
 * @param id id
 */
export function deleteCtUsingDELETE(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/manifest/info/ct/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 客商舱单信息查询列表-预配舱单
 * @param params 参数
 */
export function getPreManifestUsingGET(
  params?: {
    /** partnerId */
    partnerId?: number;
  },
) {
  return request<OptimizeModel<Result«List«PnrManifestInfo»»>>({
    url: `${__BASE_SERVICE__}/pnr/manifest/info/pre`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 客商舱单信息新增保存-预配舱单
 * @param data 数据
 */
export function savePreManifestUsingPOST(
  data: PnrManifestInfo,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/manifest/info/pre`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 客商舱单信息查询详情-预配舱单
 * @param id ID
 */
export function detailPreUsingGET(
  id: number,
) {
  return request<OptimizeModel<Result«PnrManifestInfo»>>({
    url: `${__BASE_SERVICE__}/pnr/manifest/info/pre/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 客商舱单信息修改保存-预配舱单
 * @param id id
 * @param data 数据
 */
export function updatePreUsingPUT(
  id: number,
  data: PnrManifestInfo,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/manifest/info/pre/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 客商舱单信息删除-预配舱单
 * @param id id
 */
export function deletePreUsingDELETE(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/manifest/info/pre/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}