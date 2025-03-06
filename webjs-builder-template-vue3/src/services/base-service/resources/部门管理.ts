import { request } from '@/utils';
import type { Result, Result«List«SysDepartment»», Result«List«下拉框value值对应为string»», Result«List«公司组织架构»», Result«List«费用方案列表实体»», Result«List«部门人员信息列表»», Result«SysDepartmentDTO», SysDepartment } from '../interfaces';

/**
 * 查询列表
 * @param params 参数
 */
export function queryUsingGET_47(
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
    url: `${__BASE_SERVICE__}/sys/department`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 部门新增
 * @param data 数据
 */
export function saveUsingPOST_32(
  data: SysDepartment,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/department`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 部门禁用状态设置
 * @param params 参数
 */
export function activeDisableUsingPUT_13(
  params: {
    /** 部门id */
    id: number;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/department/activedisable`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 部门启用状态设置
 * @param params 参数
 */
export function activeEnableUsingPUT_14(
  params: {
    /** 部门id */
    id: number;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/department/activeenable`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 部门数据源下拉框List
 * @param params 参数
 */
export function getDropdownlistUsingGET(
  params?: {
    /** officeId */
    officeId?: number;
  },
) {
  return request<OptimizeModel<Result«List«下拉框value值对应为string»»>>({
    url: `${__BASE_SERVICE__}/sys/department/dropdownlist`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 部门数据源下拉框List-含上级部门公司信息
 */
export function getListWithParentUsingGET(
) {
  return request<OptimizeModel<Result«List«费用方案列表实体»»>>({
    url: `${__BASE_SERVICE__}/sys/department/parent/list`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 可以授权数据权限的部门列表
 * @param params 参数
 */
export function queryPermissionDepartmentUsingGET(
  params: {
    /** 维度 */
    permissionDimension: string;
    /** 权限code */
    privilegeCode: string;
    /** 权限ID */
    roleId: number;
  },
) {
  return request<OptimizeModel<Result«List«公司组织架构»»>>({
    url: `${__BASE_SERVICE__}/sys/department/permssion-departments`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 部门tree结构
 */
export function treeListUsingGET_1(
) {
  return request<OptimizeModel<Result«List«SysDepartment»»>>({
    url: `${__BASE_SERVICE__}/sys/department/tree`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 指定公司部门tree结构
 * @param officeId officeId
 */
export function treeListByOfficeUsingGET(
  officeId: number,
) {
  return request<OptimizeModel<Result«List«SysDepartment»»>>({
    url: `${__BASE_SERVICE__}/sys/department/treebyoffice/${officeId}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 查看部门下的用户信息
 */
export function getDepartmentInfoUsingGET(
) {
  return request<OptimizeModel<Result«List«部门人员信息列表»»>>({
    url: `${__BASE_SERVICE__}/sys/department/user`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 部门查询详情
 * @param id ID
 */
export function detailUsingGET_19(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/department/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 部门修改
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_41(
  id: number,
  data: SysDepartment,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/department/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 部门删除
 * @param id id
 */
export function deleteUsingDELETE_43(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/department/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 获取部门信息，供内部系统调用
 * @param id ID
 */
export function getSysDepartmentInfoUsingGET(
  id: number,
) {
  return request<OptimizeModel<Result«SysDepartmentDTO»>>({
    url: `${__BASE_SERVICE__}/sys/departmentinfo/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}