import { request } from '@/utils';
import type { Result, Result«List«SysOffice»», Result«List«下拉框value值对应为string»», Result«List«公司组织架构»», Result«Map«long,SysOfficeNameInfoDTO»», Result«SysOfficeNameInfoDTO», Result«公司组织架构-可视化结构», Result«公司详情页实体», Result«我司地址,联系人信息及其他信息», SysOffice } from '../interfaces';

/**
 * 根据名称获取公司信息
 * @param params 参数
 */
export function detailByNameUsingGET(
  params: {
    /** officeName */
    officeName: string;
  },
) {
  return request<OptimizeModel<Result«公司详情页实体»>>({
    url: `${__BASE_SERVICE__}/sys/office`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 公司信息新增(cw里不允许新建第一级公司,从omc同步)
 * @param data 数据
 */
export function saveUsingPOST_33(
  data: SysOffice,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/office`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 公司禁用状态设置
 * @param params 参数
 */
export function activeDisableUsingPUT_14(
  params: {
    /** 分公司id */
    id: number;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/office/activedisable`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 公司启用状态设置
 * @param params 参数
 */
export function activeEnableUsingPUT_15(
  params: {
    /** 分公司id */
    id: number;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/office/activeenable`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 分公司数据源下拉框List
 */
export function pageInitUsingGET_1(
) {
  return request<OptimizeModel<Result«List«下拉框value值对应为string»»>>({
    url: `${__BASE_SERVICE__}/sys/office/dropdownlist`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * getSysOfficeNameInfoDTOMap
 * @param params 参数
 */
export function getSysOfficeNameInfoDTOMapUsingGET(
  params: {
    /** officeIds */
    officeIds: number | number[];
  },
) {
  return request<OptimizeModel<Result«Map«long,SysOfficeNameInfoDTO»»>>({
    url: `${__BASE_SERVICE__}/sys/office/name/infos`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 公司组织架构-树形列表展示
 */
export function OrganizationUsingGET(
) {
  return request<OptimizeModel<Result«List«公司组织架构»»>>({
    url: `${__BASE_SERVICE__}/sys/office/organization`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 公司组织架构-可视化展示
 */
export function OrganizationByViewUsingGET(
) {
  return request<OptimizeModel<Result«公司组织架构-可视化结构»>>({
    url: `${__BASE_SERVICE__}/sys/office/organization/visualview`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 公司组织架构删除
 * @param id id
 * @param params 参数
 */
export function deleteOrgUsingDELETE(
  id: number,
  params: {
    /** 类型:0:公司;1:部门 */
    orgType: number;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/office/organization/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 可以授权数据权限的公司列表
 * @param params 参数
 */
export function queryPermssionOfficeUsingGET(
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
    url: `${__BASE_SERVICE__}/sys/office/permssion-offices`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 获取公司财务用相关信息
 * @param params 参数
 */
export function getSysOfficeTaxInfoDTOUsingGET(
  params?: {
    /** officeId */
    officeId?: number;
  },
) {
  return request<OptimizeModel<Result«我司地址,联系人信息及其他信息»>>({
    url: `${__BASE_SERVICE__}/sys/office/tax/info`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 公司tree列表
 */
export function treeListUsingGET_2(
) {
  return request<OptimizeModel<Result«List«SysOffice»»>>({
    url: `${__BASE_SERVICE__}/sys/office/tree`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 公司查询详情
 * @param id ID
 */
export function detailUsingGET_20(
  id: number,
) {
  return request<OptimizeModel<Result«公司详情页实体»>>({
    url: `${__BASE_SERVICE__}/sys/office/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 公司信息修改
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_42(
  id: number,
  data: SysOffice,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/office/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 公司删除
 * @param id id
 */
export function deleteUsingDELETE_44(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/office/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * getSysOfficeNameInfoDTO
 * @param id id
 */
export function getSysOfficeNameInfoDTOUsingGET(
  id: number,
) {
  return request<OptimizeModel<Result«SysOfficeNameInfoDTO»>>({
    url: `${__BASE_SERVICE__}/sys/office/${id}/name/info`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 根据id获取公司信息
 * @param id id
 */
export function officeInfoByIdUsingGET(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/officeinfo/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 公司列表(业务模块调用到,不能加权限控制)
 */
export function listUsingGET_1(
) {
  return request<OptimizeModel<Result«List«SysOffice»»>>({
    url: `${__BASE_SERVICE__}/sys/officelist`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}