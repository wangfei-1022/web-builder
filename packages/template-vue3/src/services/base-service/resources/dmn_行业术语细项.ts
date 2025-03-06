import { request } from '@/utils';
import type { DmnTermItem, Result, Result«DmnTermItemDTO», Result«DmnTermItem», Result«List«DmnTermItemDTO»», Result«List«DmnTermItem»», Result«List«SeaLineDTO»», Result«long», Result«Map«string,long»», Result«Map«string,string»», Result«SeaLineDTO» } from '../interfaces';

/**
 * 获取SEALINE 流向
 * @param params 参数
 */
export function routeDirectionsUsingGET(
  params: {
    /** codes */
    codes: string | string[];
  },
) {
  return request<OptimizeModel<Result«List«SeaLineDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/term/SEALINE/batch/routeDirection`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 获取SEALINE 流向
 * @param code code
 */
export function routeDirectionUsingGET(
  code: string,
) {
  return request<OptimizeModel<Result«SeaLineDTO»>>({
    url: `${__BASE_SERVICE__}/dmn/term/SEALINE/${code}/routeDirection`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * getItemById
 * @param id id
 */
export function getItemByIdUsingGET(
  id: number,
) {
  return request<OptimizeModel<Result«DmnTermItem»>>({
    url: `${__BASE_SERVICE__}/dmn/term/getitem/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 新增
 * @param data 数据
 */
export function saveUsingPOST_17(
  data: DmnTermItem,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/term/item`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 行业术语细项禁用状态设置
 * @param id 行业术语细项id
 */
export function activeDisableUsingPUT_6(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/term/item/activedisable/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 行业术语细项启用状态设置
 * @param id 行业术语细项id
 */
export function activeEnableUsingPUT_7(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/term/item/activeenable/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 行业术语code查找细项
 * @param params 参数
 */
export function dropdownListUsingGET(
  params?: {
    /** keyword */
    keyword?: string;
    /** 行业术语termCode */
    termCode?: string;
  },
) {
  return request<OptimizeModel<Result«List«DmnTermItemDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/term/item/dropdownlist`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 列表
 * @param params 参数
 */
export function listUsingGET(
  params: {
    /** 创建时间结束 */
    createTimeEnd?: number;
    /** 创建时间开始 */
    createTimeStart?: number;
    /** 主键 */
    id?: number;
    /** 主键列表 */
    ids?: number | number[];
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 排序 */
    sort?: string;
  },
) {
  return request<OptimizeModel<Result«List«DmnTermItem»»>>({
    url: `${__BASE_SERVICE__}/dmn/term/item/list`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * getListByTermCode
 * @param termCode termCode
 */
export function getListByTermCodeUsingGET(
  termCode: string,
) {
  return request<OptimizeModel<Result«List«DmnTermItemDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/term/item/termCode/${termCode}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * getCodeEnNameMapMapByTermCode
 * @param termCode termCode
 */
export function getCodeEnNameMapMapByTermCodeUsingGET(
  termCode: string,
) {
  return request<OptimizeModel<Result«Map«string,string»»>>({
    url: `${__BASE_SERVICE__}/dmn/term/item/termCode/${termCode}/code/enName/map`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * getKeywordIdMapByTermCode
 * @param termCode termCode
 */
export function getKeywordIdMapByTermCodeUsingGET(
  termCode: string,
) {
  return request<OptimizeModel<Result«Map«string,long»»>>({
    url: `${__BASE_SERVICE__}/dmn/term/item/termCode/${termCode}/code/id/map`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * getCodeNameMapMapByTermCode
 * @param termCode termCode
 */
export function getCodeNameMapMapByTermCodeUsingGET(
  termCode: string,
) {
  return request<OptimizeModel<Result«Map«string,string»»>>({
    url: `${__BASE_SERVICE__}/dmn/term/item/termCode/${termCode}/code/name/map`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 行业术语_通过类型与CODE获取对象
 * @param code code
 * @param termCode termCode
 */
export function getByTermCodeAndCodeUsingGET(
  code: string,
  termCode: string,
) {
  return request<OptimizeModel<Result«DmnTermItemDTO»>>({
    url: `${__BASE_SERVICE__}/dmn/term/item/termCode/${termCode}/code/${code}/base/info`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 行业术语_通过类型与CODE获取ID
 * @param code code
 * @param termCode termCode
 */
export function getIdByTermCodeAndCodeUsingGET(
  code: string,
  termCode: string,
) {
  return request<OptimizeModel<Result«long»>>({
    url: `${__BASE_SERVICE__}/dmn/term/item/termCode/${termCode}/code/${code}/id`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 查询详情
 * @param id ID
 */
export function detailUsingGET_6(
  id: number,
) {
  return request<OptimizeModel<Result«DmnTermItem»>>({
    url: `${__BASE_SERVICE__}/dmn/term/item/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 修改
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_24(
  id: number,
  data: DmnTermItem,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/term/item/${id}`,
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
export function deleteUsingDELETE_23(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/term/item/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}