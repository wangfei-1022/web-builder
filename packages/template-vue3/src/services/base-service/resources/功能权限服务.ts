import { request } from '@/utils';
import type { Result«List«sysPrivilegeDTO»», Result«List«SysPrivilege»», Result«long», Result«object», Result«sysPrivilegeDTO», sysPrivilegeDTOReq } from '../interfaces';

/**
 * fillPrivilegesPath
 */
export function fillPrivilegesPathUsingGET(
) {
  return request<string>({
    url: `${__BASE_SERVICE__}/fillPrivilegesPath`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * fillPrivilegesPath
 */
export function fillPrivilegesPathUsingPUT(
) {
  return request<string>({
    url: `${__BASE_SERVICE__}/fillPrivilegesPath`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * fillPrivilegesPath
 */
export function fillPrivilegesPathUsingPOST(
) {
  return request<string>({
    url: `${__BASE_SERVICE__}/fillPrivilegesPath`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * fillPrivilegesPath
 */
export function fillPrivilegesPathUsingDELETE(
) {
  return request<string>({
    url: `${__BASE_SERVICE__}/fillPrivilegesPath`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * fillPrivilegesPath
 */
export function fillPrivilegesPathUsingOPTIONS(
) {
  return request<string>({
    url: `${__BASE_SERVICE__}/fillPrivilegesPath`,
    method: 'OPTIONS',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * fillPrivilegesPath
 */
export function fillPrivilegesPathUsingHEAD(
) {
  return request<string>({
    url: `${__BASE_SERVICE__}/fillPrivilegesPath`,
    method: 'HEAD',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * fillPrivilegesPath
 */
export function fillPrivilegesPathUsingPATCH(
) {
  return request<string>({
    url: `${__BASE_SERVICE__}/fillPrivilegesPath`,
    method: 'PATCH',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 保存
 * @param data 数据
 */
export function insertUsingPOST_11(
  data: sysPrivilegeDTOReq,
) {
  return request<OptimizeModel<Result«long»>>({
    url: `${__BASE_SERVICE__}/omc/sys/privilege`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 查询详情
 * @param id id
 */
export function getByIdUsingGET_15(
  id: number,
) {
  return request<OptimizeModel<Result«sysPrivilegeDTO»>>({
    url: `${__BASE_SERVICE__}/omc/sys/privilege/detail/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 查询权限父级平级节点
 * @param id id
 */
export function getFlatLevelListUsingGET(
  id: number,
) {
  return request<OptimizeModel<Result«List«sysPrivilegeDTO»»>>({
    url: `${__BASE_SERVICE__}/omc/sys/privilege/getFlatLevelList/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 更新
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_28(
  id: number,
  data: sysPrivilegeDTOReq,
) {
  return request<OptimizeModel<Result«long»>>({
    url: `${__BASE_SERVICE__}/omc/sys/privilege/${id}`,
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
export function deleteUsingDELETE_28(
  id: number,
) {
  return request<OptimizeModel<Result«long»>>({
    url: `${__BASE_SERVICE__}/omc/sys/privilege/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 权限列表
 * @param id id
 */
export function checkListUsingGET(
  id: number,
) {
  return request<OptimizeModel<Result«object»>>({
    url: `${__BASE_SERVICE__}/sys/privilege/checklist/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 权限列表
 */
export function queryUsingGET_48(
) {
  return request<OptimizeModel<Result«List«SysPrivilege»»>>({
    url: `${__BASE_SERVICE__}/sys/privilege/list`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 权限树
 */
export function treeListUsingGET_3(
) {
  return request<OptimizeModel<Result«List«SysPrivilege»»>>({
    url: `${__BASE_SERVICE__}/sys/privilege/treelist`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}