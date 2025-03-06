import { request } from '@/utils';
import type { PerFocus, Result } from '../interfaces';

/**
 * 新增关注(关注)
 * @param data 数据
 */
export function saveUsingPOST_20(
  data: PerFocus,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/per/focus`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 批量关注
 * @param data 数据
 */
export function batchSaveUsingPOST_1(
  data: PerFocus[],
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/per/focus/batch`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 批量删除(取消关注)
 * @param businessIds 业务ids
 * @param params 参数
 */
export function batchDeleteUsingDELETE_1(
  businessIds: string,
  params?: {
    /** focusType */
    focusType?: number;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/per/focus/batch`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 删除(取消关注)
 * @param businessId 业务id
 * @param params 参数
 */
export function deleteUsingDELETE_29(
  businessId: number,
  params?: {
    /** focusType */
    focusType?: number;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/per/focus/${businessId}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}