import { request } from '@/utils';
import type { DmnCurrency, Result, Result«List«DmnCurrencyDTO»», Result«List«下拉框value值对应为string»», Result«List«基本的可选项数据DTO«string»»», Result«PageInfo«DmnCurrency»» } from '../interfaces';

/**
 * 查询列表
 * @param params 参数
 */
export function queryUsingGET_14(
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
  return request<OptimizeModel<Result«PageInfo«DmnCurrency»»>>({
    url: `${__BASE_SERVICE__}/dmn/currency`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 新增(未使用)
 * @param data 数据
 */
export function saveUsingPOST_10(
  data: DmnCurrency,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/currency`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 禁用状态设置(未使用)
 * @param params 参数
 */
export function activeDisableUsingPOST(
  params: {
    /** 分公司id */
    id: number;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/currency/activedisable`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 启用状态设置(未使用)
 * @param params 参数
 */
export function activeEnableUsingPUT_2(
  params: {
    /** 分公司id */
    id: number;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/currency/activeenable`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 币种数据源下拉框List
 */
export function getCurrencyListUsingGET(
) {
  return request<OptimizeModel<Result«List«下拉框value值对应为string»»>>({
    url: `${__BASE_SERVICE__}/dmn/currency/dropdownlist`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 获取可以开通的会员账户币种
 */
export function getCurrenciesUsingGET(
) {
  return request<OptimizeModel<Result«List«基本的可选项数据DTO«string»»»>>({
    url: `${__BASE_SERVICE__}/dmn/currency/dropdownlist/currencies`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 根据code查询币种列表
 * @param params 参数
 */
export function getCurrencyListByCodesUsingGET(
  params: {
    /** currencyCodes */
    currencyCodes: string | string[];
  },
) {
  return request<OptimizeModel<Result«List«DmnCurrencyDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/currency/list/by/codes`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 修改(未使用)
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_11(
  id: number,
  data: DmnCurrency,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/currency/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 删除(未使用)
 * @param id id
 */
export function deleteUsingDELETE_12(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/currency/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}