import { request } from '@/utils';
import type { Result, Result«List«SysPrivilege»», Result«List«SysRolePermission»», Result«List«用户列表及详细信息»», SysRole, SysRolePermission, 分配入参实体:用户分配角色,角色分配用户,角色分配权限,用户分配工作号编码规则, 用户分配角色列表&明细页实体 } from '../interfaces';

/**
 * 角色查询列表
 * @param params 参数
 */
export function queryUsingGET_49(
  params: {
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 排序 */
    sort?: string;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/role`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 角色编辑新增保存
 * @param data 数据
 */
export function saveUsingPOST_34(
  data: SysRole,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/role`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 角色禁用状态设置
 * @param params 参数
 */
export function activeDisableUsingPUT_15(
  params: {
    /** 角色id */
    id: number;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/role/activedisable`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 角色启用状态设置
 * @param params 参数
 */
export function activeEnableUsingPUT_16(
  params: {
    /** 角色id */
    id: number;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/role/activeenable`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 角色分配用户
 * @param data 数据
 */
export function assignUserUsingPOST(
  data: 分配入参实体:用户分配角色,角色分配用户,角色分配权限,用户分配工作号编码规则,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/role/assign-user`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 角色授权权限
 * @param data 数据
 */
export function authorizationPrivilegesUsingPOST(
  data: 分配入参实体:用户分配角色,角色分配用户,角色分配权限,用户分配工作号编码规则,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/role/authorization-privilege`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 角色复制保存
 * @param data 数据
 */
export function saveByCopyUsingPOST(
  data: 用户分配角色列表&明细页实体,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/role/copy`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 角色拥有数据权限
 * @param roleId roleId
 */
export function queryPermissionUsingGET(
  roleId: number,
) {
  return request<OptimizeModel<Result«List«SysPrivilege»»>>({
    url: `${__BASE_SERVICE__}/sys/role/permission/privileges/${roleId}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 角色-权限-授权数据权限
 * @param data 数据
 */
export function batchSavePermissionUsingPOST(
  data: SysRolePermission[],
) {
  return request<OptimizeModel<Result«List«SysRolePermission»»>>({
    url: `${__BASE_SERVICE__}/sys/role/privilege-permissions`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 角色-权限包含所有数据权限列表
 * @param params 参数
 */
export function getPermissionListUsingGET(
  params: {
    /** 权限code */
    privilegeCode: string;
    /** roleId */
    roleId: number;
  },
) {
  return request<OptimizeModel<Result«List«SysRolePermission»»>>({
    url: `${__BASE_SERVICE__}/sys/role/privilege/permissions`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 角色-权限-移除数据权限
 * @param params 参数
 */
export function removePermissionUsingDELETE(
  params: {
    /** 数据权限ID集合 */
    permissionIds: string;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/role/privilege/remove-permission`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 角色拥有功能权限list
 * @param roleId roleId
 */
export function getPrivilegeListUsingGET(
  roleId: number,
) {
  return request<OptimizeModel<Result«List«SysPrivilege»»>>({
    url: `${__BASE_SERVICE__}/sys/role/privilegelist/${roleId}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 角色拥有权限包含所有权限以及被选中
 * @param roleId roleId
 */
export function getPrivilegeListViewUsingGET(
  roleId: number,
) {
  return request<OptimizeModel<Result«List«SysPrivilege»»>>({
    url: `${__BASE_SERVICE__}/sys/role/privilegelistview/${roleId}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 用户列表,标识属于当前角色的用户
 * @param roleId roleId
 */
export function userlistUsingGET(
  roleId: number,
) {
  return request<OptimizeModel<Result«List«用户列表及详细信息»»>>({
    url: `${__BASE_SERVICE__}/sys/role/userlist/${roleId}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 角色查询详情
 * @param id ID
 */
export function detailUsingGET_21(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/role/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 角色修改保存
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_43(
  id: number,
  data: SysRole,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/role/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 角色删除
 * @param id id
 */
export function deleteUsingDELETE_45(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/role/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}