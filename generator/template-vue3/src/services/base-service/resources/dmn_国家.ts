import { request } from '@/utils';
import type { DmnCountry, Result, Result«DmnCountrySelectionDTO», Result«DmnCountry», Result«List«DmnCountrySelectionDTO»», Result«List«DmnCountry»», Result«List«dmnFrequentCountryDTO»», Result«Map«string,DmnCountrySelectionDTO»», Result«Map«string,string»», Result«PageInfo«DmnCountry»», Result«string», Result«常用-最近-所有-下拉选项模型«DmnCountrySelectionDTO»» } from '../interfaces';

/**
 * 查询列表
 * @param params 参数
 */
export function queryUsingGET_13(
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
  return request<OptimizeModel<Result«PageInfo«DmnCountry»»>>({
    url: `${__BASE_SERVICE__}/dmn/country`,
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
export function saveUsingPOST_9(
  data: DmnCountry,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/country`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 国家拉框List
 * @param params 参数
 */
export function getCountryByCodeUsingGET(
  params: {
    /** code2 */
    code2: string;
  },
) {
  return request<OptimizeModel<Result«DmnCountry»>>({
    url: `${__BASE_SERVICE__}/dmn/country/byCode`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 国家拉框List2
 * @param params 参数
 */
export function getCountryDTOByCode2UsingGET(
  params: {
    /** code2 */
    code2: string;
  },
) {
  return request<OptimizeModel<Result«DmnCountrySelectionDTO»>>({
    url: `${__BASE_SERVICE__}/dmn/country/byCode2`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 国家CODE获取名字
 * @param code2 code2
 */
export function getCountryNameByCode2UsingGET(
  code2: string,
) {
  return request<OptimizeModel<Result«string»>>({
    url: `${__BASE_SERVICE__}/dmn/country/code2/${code2}/name`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * getCountryByCodeOrName
 * @param params 参数
 */
export function getCountryByCodeOrNameUsingGET(
  params: {
    /** countryName */
    countryName: string;
  },
) {
  return request<OptimizeModel<Result«DmnCountrySelectionDTO»>>({
    url: `${__BASE_SERVICE__}/dmn/country/codeOrName`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 通过keyword获取国家列表
 * @param params 参数
 */
export function getCountryDTOByKeywordUsingGET(
  params: {
    /** keyword */
    keyword: string;
  },
) {
  return request<OptimizeModel<Result«List«DmnCountrySelectionDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/country/keyword`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 批量查询：根据国家code获取列表
 * @param params 参数
 */
export function getCountryListByCodesUsingGET(
  params: {
    /** codes */
    codes: string | string[];
  },
) {
  return request<OptimizeModel<Result«List«DmnCountrySelectionDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/country/list/by/codes`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 根据国家code获取列表
 * @param params 参数
 */
export function getCountryListByCodesOrNamesUsingGET(
  params: {
    /** codes */
    codes: string | string[];
    /** names */
    names: string | string[];
  },
) {
  return request<OptimizeModel<Result«List«DmnCountrySelectionDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/country/list/by/codesOrNames`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 国家名字列表获取国家Map
 * @param params 参数
 */
export function getCountrySelectionsDTOMapByNamesUsingGET(
  params: {
    /** names */
    names: string | string[];
  },
) {
  return request<OptimizeModel<Result«Map«string,DmnCountrySelectionDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/country/names/selections`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 国家名字列表获取国家CodeMap
 * @param params 参数
 */
export function getCountryCodeMapByNamesUsingGET(
  params: {
    /** names */
    names: string | string[];
  },
) {
  return request<OptimizeModel<Result«Map«string,string»»>>({
    url: `${__BASE_SERVICE__}/dmn/country/names/selections/code2`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 国家下拉框
 * @param params 参数
 */
export function getCountrySelectionsUsingGET(
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
  return request<OptimizeModel<Result«常用-最近-所有-下拉选项模型«DmnCountrySelectionDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/country/selections`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * MDM同步数据至CW_dmn数据接收
 * @param data 数据
 */
export function synDataUsingPOST_5(
  data: DmnCountry,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/country/syndata`,
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
export function updateUsingPUT_10(
  id: number,
  data: DmnCountry,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/country/${id}`,
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
export function deleteUsingDELETE_11(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/country/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 国家拉框List
 * @param params 参数
 */
export function getCountryListUsingGET(
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
  return request<OptimizeModel<Result«List«DmnCountry»»>>({
    url: `${__BASE_SERVICE__}/dmn/countrylist`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 常用国家拉框List
 * @param params 参数
 */
export function getFrequentCountryListUsingGET(
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
  return request<OptimizeModel<Result«List«dmnFrequentCountryDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/frequent/countrylist`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}