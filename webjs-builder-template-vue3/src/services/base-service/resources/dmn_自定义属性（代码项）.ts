import { request } from '@/utils';
import type { dmnCustomAttributeDTO, Result, Result«dmnCustomAttributeDTO», Result«int», Result«List«代码项下拉框数据源»», Result«PageInfo«dmnCustomAttributeDTO»» } from '../interfaces';

/**
 * 代码项管理 - 新增保存
 * @param data 数据
 */
export function insertUsingPOST_5(
  data: dmnCustomAttributeDTO,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/dmn/custom/attribute/item`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 代码项管理 - 禁用状态设置
 * @param id id
 */
export function activeDisableUsingPUT_3(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/custom/attribute/item/activedisable/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 代码项管理 - 启用状态设置
 * @param id id
 */
export function activeEnableUsingPUT_4(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/custom/attribute/item/activeenable/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 代码项管理 - 查询详情
 * @param id id
 */
export function getByIdUsingGET_7(
  id: number,
) {
  return request<OptimizeModel<Result«dmnCustomAttributeDTO»>>({
    url: `${__BASE_SERVICE__}/dmn/custom/attribute/item/detail/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 代码项管理 - 根据Code获取数据
 * @param params 参数
 */
export function getByCodeUsingGET_1(
  params: {
    /** code */
    code: string;
  },
) {
  return request<OptimizeModel<Result«dmnCustomAttributeDTO»>>({
    url: `${__BASE_SERVICE__}/dmn/custom/attribute/item/getByCode`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 代码项管理 - 查询列表
 * @param params 参数
 */
export function queryUsingGET_16(
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
    url: `${__BASE_SERVICE__}/dmn/custom/attribute/item/pages`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 代码项管理 - 下拉框查询
 * @param params 参数
 */
export function queryByKeywordUsingGET_1(
  params?: {
    /** 代码项代码 */
    curCode?: string;
    /** 父级代码 */
    parentCode?: string;
  },
) {
  return request<OptimizeModel<Result«List«代码项下拉框数据源»»>>({
    url: `${__BASE_SERVICE__}/dmn/custom/attribute/item/selections`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 代码项管理 - 更新
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_13(
  id: number,
  data: dmnCustomAttributeDTO,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/dmn/custom/attribute/item/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 代码项管理 - 删除
 * @param id id
 */
export function deleteUsingDELETE_14(
  id: number,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/dmn/custom/attribute/item/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}