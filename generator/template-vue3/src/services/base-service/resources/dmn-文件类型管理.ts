import { request } from '@/utils';
import type { DmnDocumentType, Result, Result«List«DmnDocumentTypeDTO»» } from '../interfaces';

/**
 * 文件类型树形结构
 * @param params 参数
 */
export function treeListUsingGET(
  params?: {
    /** parentCode */
    parentCode?: string;
  },
) {
  return request<OptimizeModel<Result«List«DmnDocumentTypeDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/document/treelist`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 新增
 * @param data 数据
 */
export function saveUsingPOST_11(
  data: DmnDocumentType,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/document/type`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 修改
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_14(
  id: number,
  data: DmnDocumentType,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/document/type/${id}`,
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
export function deleteUsingDELETE_15(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/document/type/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}