import { request } from '@/utils';
import type { dmnCustomAttributeDTO, Result, Result«dmnCustomAttributeDTO», Result«int», Result«List«dmnCustomAttributeDTO»», Result«List«代码下拉框数据源»», Result«PageInfo«dmnCustomAttributeDTO»» } from '../interfaces';

/**
 * 代码管理 - 新增保存
 * @param data 数据
 */
export function insertUsingPOST_4(
  data: dmnCustomAttributeDTO,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/dmn/custom/attribute`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 代码管理 - 禁用状态设置
 * @param id id
 */
export function activeDisableUsingPUT_2(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/custom/attribute/activedisable/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 代码管理 - 启用状态设置
 * @param id id
 */
export function activeEnableUsingPUT_3(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/custom/attribute/activeenable/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 代码管理 - 查询详情
 * @param id id
 */
export function getByIdUsingGET_6(
  id: number,
) {
  return request<OptimizeModel<Result«dmnCustomAttributeDTO»>>({
    url: `${__BASE_SERVICE__}/dmn/custom/attribute/detail/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 代码管理 - 根据Code获取数据
 * @param params 参数
 */
export function getByCodeUsingGET(
  params: {
    /** code */
    code: string;
  },
) {
  return request<OptimizeModel<Result«dmnCustomAttributeDTO»>>({
    url: `${__BASE_SERVICE__}/dmn/custom/attribute/getByCode`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 代码管理 - 获取下级
 * @param params 参数
 */
export function getSubListUsingGET(
  params: {
    /** code */
    code: string;
  },
) {
  return request<OptimizeModel<Result«List«dmnCustomAttributeDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/custom/attribute/getSubList`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 代码管理 - 查询列表
 * @param params 参数
 */
export function queryUsingGET_15(
  params: {
    /** 创建时间结束 */
    createTimeEnd?: number;
    /** 创建时间开始 */
    createTimeStart?: number;
    /** 主键 */
    id?: number;
    /** 主键列表 */
    ids?: number | number[];
    /** 代码或名称 */
    keyword?: string;
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 父级id */
    parentId?: number;
    /** 排序 */
    sort?: string;
  },
) {
  return request<OptimizeModel<Result«PageInfo«dmnCustomAttributeDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/custom/attribute/pages`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 代码管理 - 下拉框查询
 * @param params 参数
 */
export function queryByKeywordUsingGET(
  params?: {
    /** 代码或名称 */
    keyword?: string;
  },
) {
  return request<OptimizeModel<Result«List«代码下拉框数据源»»>>({
    url: `${__BASE_SERVICE__}/dmn/custom/attribute/selections`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 代码管理 - 更新
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_12(
  id: number,
  data: dmnCustomAttributeDTO,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/dmn/custom/attribute/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 代码管理 - 删除
 * @param id id
 */
export function deleteUsingDELETE_13(
  id: number,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/dmn/custom/attribute/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}