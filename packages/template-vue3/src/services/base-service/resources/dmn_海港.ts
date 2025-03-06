import { request } from '@/utils';
import type { dmnSeaportDTO, Result, Result«dmnSeaportDTO», Result«DmnSeaport», Result«List«dmnSeaportDTO»», Result«List«港口下拉列表»», Result«List«港口下拉框数据源»», Result«PageInfo«汇率列表»» } from '../interfaces';

/**
 * 海港查询列表
 * @param params 参数
 */
export function queryUsingGET_25(
  params: {
    /** 海港五字码 */
    code5?: string;
    /** 国家代码 */
    countryCode?: string;
    /** 国家名称 */
    countryName?: string;
    /** 港口英文名 */
    englishName?: string;
    /** 关键字 */
    keyword?: string;
    /** 航线code */
    lineCode?: string;
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 排序 */
    sort?: string;
    /** 租户id */
    tenantId?: number;
  },
) {
  return request<OptimizeModel<Result«PageInfo«汇率列表»»>>({
    url: `${__BASE_SERVICE__}/dmn/seaport`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 海港新增保存
 * @param data 数据
 */
export function saveUsingPOST_16(
  data: number[],
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/seaport`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 海港禁用状态设置
 * @param params 参数
 */
export function activeDisableUsingPUT_5(
  params: {
    /** id */
    id: number;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/seaport/activedisable`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 海港启用状态设置
 * @param params 参数
 */
export function activeEnableUsingPUT_6(
  params: {
    /** id */
    id: number;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/seaport/activeenable`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 查询所有海港信息
 */
export function allDmnSeaportUsingGET(
) {
  return request<OptimizeModel<Result«List«dmnSeaportDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/seaport/allDmnSeaport`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 批量根据五字码查询海港信息
 * @param params 参数
 */
export function batchGetByCode5UsingGET(
  params: {
    /** code5List */
    code5List: string | string[];
  },
) {
  return request<OptimizeModel<Result«List«dmnSeaportDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/seaport/batchByCode5`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 根据五字码查询海港信息
 * @param code5 code5
 */
export function getByCode5UsingGET(
  code5: string,
) {
  return request<OptimizeModel<Result«dmnSeaportDTO»>>({
    url: `${__BASE_SERVICE__}/dmn/seaport/byCode5/${code5}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 获取港口字典数据(取前100条数据, 排除已经添加的)
 * @param params 参数
 */
export function dictionarySeaportUsingGET(
  params?: {
    /** 关键字搜索 */
    keyword?: string;
  },
) {
  return request<OptimizeModel<Result«List«港口下拉列表»»>>({
    url: `${__BASE_SERVICE__}/dmn/seaport/dictionary`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 根据航线code列表获取港口列表
 * @param params 参数
 */
export function getCode5ListByRouteCodeListUsingGET(
  params: {
    /** routeCodeList */
    routeCodeList: string | string[];
  },
) {
  return request<OptimizeModel<Result«List«dmnSeaportDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/seaport/getCode5ListByRouteCodeList`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * refreshSeaport
 */
export function refreshSeaportUsingPUT(
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/seaport/refresh`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 海港查询列表
 * @param id id
 */
export function getByIdUsingGET_12(
  id: number,
) {
  return request<OptimizeModel<Result«DmnSeaport»>>({
    url: `${__BASE_SERVICE__}/dmn/seaport/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 海港修改保存
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_23(
  id: number,
  data: dmnSeaportDTO,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/seaport/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 海港查询列表
 * @param params 参数
 */
export function queryDropDownListUsingGET_1(
  params: {
    /** 海港五字码 */
    code5?: string;
    /** 国家代码 */
    countryCode?: string;
    /** 国家名称 */
    countryName?: string;
    /** 港口英文名 */
    englishName?: string;
    /** 关键字 */
    keyword?: string;
    /** 航线code */
    lineCode?: string;
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 排序 */
    sort?: string;
    /** 租户id */
    tenantId?: number;
  },
) {
  return request<OptimizeModel<Result«List«港口下拉框数据源»»>>({
    url: `${__BASE_SERVICE__}/dmn/seaportlist`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 海港查询所有列表
 * @param params 参数
 */
export function getAllDownListUsingGET(
  params: {
    /** 海港五字码 */
    code5?: string;
    /** 国家代码 */
    countryCode?: string;
    /** 国家名称 */
    countryName?: string;
    /** 港口英文名 */
    englishName?: string;
    /** 关键字 */
    keyword?: string;
    /** 航线code */
    lineCode?: string;
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 排序 */
    sort?: string;
    /** 租户id */
    tenantId?: number;
  },
) {
  return request<OptimizeModel<Result«List«港口下拉框数据源»»>>({
    url: `${__BASE_SERVICE__}/dmn/seaportlistAll`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}