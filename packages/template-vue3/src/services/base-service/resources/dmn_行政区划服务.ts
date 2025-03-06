import { request } from '@/utils';
import type { DmnAdministrativeDivisionCreateDTO, dmn数据查询条件, Result, Result«DmnAdministrativeDivisionDTO», Result«List«DmnAdministrativeDivisionDTO»», Result«List«DmnAdministrativeDivision»», Result«List«string»», Result«PageInfo«DmnAdministrativeDivisionDTO»», Result«PageInfo«DmnAdministrativeDivisionListDTO»» } from '../interfaces';

/**
 * 根据level查询列表
 * @param params 参数
 */
export function queryUsingGET_5(
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
  return request<OptimizeModel<Result«PageInfo«DmnAdministrativeDivisionDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/administrative/division`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 行政区划新增
 * @param data 数据
 */
export function saveUsingPOST_6(
  data: DmnAdministrativeDivisionCreateDTO,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/administrative/division`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * getDivisionListByCountryCodeAndCode
 * @param data 数据
 */
export function getDivisionListByCountryCodeAndCodeUsingPOST(
  data: dmn数据查询条件,
) {
  return request<OptimizeModel<Result«List«DmnAdministrativeDivisionDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/administrative/division/List/codes`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * queryDivisionByCountryCodeAndCode
 * @param params 参数
 */
export function queryDivisionByCountryCodeAndCodeUsingGET(
  params?: {
    /** 代码 */
    code?: string;
    /** 国家代码 */
    countryCode?: string;
  },
) {
  return request<OptimizeModel<Result«DmnAdministrativeDivisionDTO»>>({
    url: `${__BASE_SERVICE__}/dmn/administrative/division/countryCode/code`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 根据country查询列表
 * @param params 参数
 */
export function queryByCountryUsingGET(
  params?: {
    /** 国家代码 */
    countryCode?: string;
  },
) {
  return request<OptimizeModel<Result«List«DmnAdministrativeDivision»»>>({
    url: `${__BASE_SERVICE__}/dmn/administrative/division/listbycountry`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 获取州省郡列表
 * @param params 参数
 */
export function queryPageUsingGET(
  params: {
    /** 行政区划等级 0:省;1:城市;2:区县 */
    areaLevel?: number;
    /** 州省郡中文名称 */
    chineseName?: string;
    /** 编码 */
    code?: string;
    /** 国家中午名称 */
    countryChineseName?: string;
    /** 国家代码 */
    countryCode?: string;
    /** 关键字 */
    keyword?: string;
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 排序 */
    sort?: string;
  },
) {
  return request<OptimizeModel<Result«PageInfo«DmnAdministrativeDivisionListDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/administrative/division/page`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * getDivisionByCountryCodeAndName
 * @param countryCode countryCode
 * @param params 参数
 */
export function getDivisionByCountryCodeAndNameUsingGET(
  countryCode: string,
  params: {
    /** name */
    name: string;
  },
) {
  return request<OptimizeModel<Result«DmnAdministrativeDivisionDTO»>>({
    url: `${__BASE_SERVICE__}/dmn/administrative/division/${countryCode}/division/name`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * getDivisionByCountryCodeAndCode
 * @param code code
 * @param countryCode countryCode
 */
export function getDivisionByCountryCodeAndCodeUsingGET(
  code: string,
  countryCode: string,
) {
  return request<OptimizeModel<Result«DmnAdministrativeDivisionDTO»>>({
    url: `${__BASE_SERVICE__}/dmn/administrative/division/${countryCode}/${code}/division`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 行政区划删除
 * @param id id
 */
export function deleteUsingDELETE_6(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/administrative/division/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 获取有城市的国家code
 */
export function getCountryCodeByCityUsingGET(
) {
  return request<OptimizeModel<Result«List«string»»>>({
    url: `${__BASE_SERVICE__}/dmn/country/list/code`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}