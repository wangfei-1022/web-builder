import { request } from '@/utils';
import type { Result«dmnShippingCompanyDTO», Result«List«dmnShippingCompanyDTO»», Result«List«DmnShippingCompany»» } from '../interfaces';

/**
 * 根据id获取船公司信息
 * @param params 参数
 */
export function queryCompanyListByIdsUsingGET(
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
  return request<OptimizeModel<Result«List«DmnShippingCompany»»>>({
    url: `${__BASE_SERVICE__}/dmn/shipping/companyListByIds`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 船公司拉框List
 * @param params 参数
 */
export function queryUsingGET_26(
  params?: {
    /** keyword */
    keyword?: string;
  },
) {
  return request<OptimizeModel<Result«List«DmnShippingCompany»»>>({
    url: `${__BASE_SERVICE__}/dmn/shipping/companylist`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 获取所有船公司信息
 */
export function allDmnShippingCompanyUsingGET(
) {
  return request<OptimizeModel<Result«List«dmnShippingCompanyDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/shipping/enShortName/allDmnShippingCompany`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 根据enShortName获取船公司信息
 * @param enShortName enShortName
 */
export function queryCompanyByEnShortNameUsingGET(
  enShortName: string,
) {
  return request<OptimizeModel<Result«dmnShippingCompanyDTO»>>({
    url: `${__BASE_SERVICE__}/dmn/shipping/enShortName/${enShortName}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 获取船公司信息
 * @param params 参数
 */
export function queryCompanyListUsingGET(
  params?: {
    /** SCAC代码list */
    scacCodeList?: string | string[];
  },
) {
  return request<OptimizeModel<Result«List«DmnShippingCompany»»>>({
    url: `${__BASE_SERVICE__}/dmn/shipping/queryCompanyList`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}