import { request } from '@/utils';
import type { DmnContainer, Result, Result«DmnContainerDTO», Result«List«DmnContainer»», Result«List«string»», Result«PageInfo«DmnContainer»» } from '../interfaces';

/**
 * 集装箱箱型查询列表
 * @param params 参数
 */
export function queryUsingGET_10(
  params: {
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 尺寸代码 */
    sizeCode?: string;
    /** 排序 */
    sort?: string;
    /** 租户id */
    tenantId?: number;
    /** 箱型代码 */
    typeCode?: string;
  },
) {
  return request<OptimizeModel<Result«PageInfo«DmnContainer»»>>({
    url: `${__BASE_SERVICE__}/dmn/container`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 集装箱箱型新增(未使用)
 * @param data 数据
 */
export function saveUsingPOST_8(
  data: DmnContainer,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/container`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 集装箱箱型禁用状态设置
 * @param params 参数
 */
export function activeDisableUsingPUT_1(
  params: {
    /** id */
    id: number;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/container/activedisable`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 集装箱箱型启用状态设置
 * @param params 参数
 */
export function activeEnableUsingPUT_1(
  params: {
    /** id */
    id: number;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/container/activeenable`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 集装箱下来选项框
 * @param params 参数
 */
export function getContainerListUsingGET(
  params: {
    /** 行政区划等级 0:省;1:城市;2:区县 */
    areaLevel?: number;
    /** 编码 */
    code?: string;
    /** 国家二字码list */
    code2List?: string | string[];
    /** 国家代码 */
    countryCode?: string;
    /** 创建日期起始日 */
    createTimeBegin?: number;
    /** 创建日期截止日 */
    createTimeEnd?: number;
    /** ids */
    ids?: number | number[];
    /** 关键字 */
    keyword?: string;
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 上级code */
    parentCode?: string;
    /** 排序 */
    sort?: string;
    /** 租户id */
    tenantId?: number;
  },
) {
  return request<OptimizeModel<Result«List«DmnContainer»»>>({
    url: `${__BASE_SERVICE__}/dmn/container/dropdownlist`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 集装箱enName
 * @param enName enName
 */
export function getContainerByEnNameUsingGET(
  enName: string,
) {
  return request<OptimizeModel<Result«DmnContainerDTO»>>({
    url: `${__BASE_SERVICE__}/dmn/container/enName/${enName}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 查询不存的的箱型
 * @param params 参数
 */
export function getNoExistContainerUsingGET(
  params: {
    /** englishNameList */
    englishNameList: string | string[];
  },
) {
  return request<OptimizeModel<Result«List«string»»>>({
    url: `${__BASE_SERVICE__}/dmn/container/getNoExistContainer`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 集装箱箱型修改(未使用)
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_7(
  id: number,
  data: DmnContainer,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/container/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 集装箱箱型删除(未使用)
 * @param id id
 */
export function deleteUsingDELETE_8(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/container/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}