import { request } from '@/utils';
import type { DmnFeeItem, FeeItemCodesQuery, FeeItemNamesQuery, Result, Result«DmnFeeItemDTO», Result«DmnFeeItemVO», Result«List«DmnFeeItemDropdownList»», Result«List«DmnFeeItemDTO»», Result«List«FeeItemDTO»», Result«PageInfo«DmnFeeItemVO»» } from '../interfaces';

/**
 * 根据及业务类型、费用代码查询费用项
 * @param data 数据
 */
export function findOfBusinessTypeByCodesUsingPOST(
  data: FeeItemCodesQuery,
) {
  return request<OptimizeModel<Result«List«DmnFeeItemDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/fee/business/codes`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 根据及业务类型、费用名称查询费用项
 * @param data 数据
 */
export function findOfBusinessTypeByNamesUsingPOST(
  data: FeeItemNamesQuery,
) {
  return request<OptimizeModel<Result«List«DmnFeeItemDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/fee/business/names`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 根据及业务类型、费用代码查询费用项
 * @param code code
 * @param params 参数
 */
export function findOfBusinessTypeByCodeUsingGET(
  code: string,
  params: {
    /** businessTypeCode */
    businessTypeCode: string;
  },
) {
  return request<OptimizeModel<Result«DmnFeeItemDTO»>>({
    url: `${__BASE_SERVICE__}/dmn/fee/business/${code}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 费用项下拉框List
 * @param params 参数
 */
export function dmnFeeiIemListUsingGET(
  params?: {
    /** keyword */
    keyword?: string;
  },
) {
  return request<OptimizeModel<Result«List«DmnFeeItemDropdownList»»>>({
    url: `${__BASE_SERVICE__}/dmn/fee/dropdown/list`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 查询列表
 * @param params 参数
 */
export function queryUsingGET_19(
  params: {
    /** 费用中文名 */
    chineseName?: string;
    /** 费用代码 */
    code?: string;
    /** 创建日期截止日 */
    createTimeEnd?: number;
    /** 创建日期起始日 */
    createTimeStart?: number;
    /** 费用英文名 */
    englishName?: string;
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
  return request<OptimizeModel<Result«PageInfo«DmnFeeItemVO»»>>({
    url: `${__BASE_SERVICE__}/dmn/fee/item`,
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
export function saveUsingPOST_13(
  data: DmnFeeItem,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/fee/item`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 禁用状态设置
 * @param params 参数
 */
export function activeDisableUsingPUT_4(
  params: {
    /** 费用项id */
    id: number;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/fee/item/activedisable`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 启用状态设置
 * @param params 参数
 */
export function activeEnableUsingPUT_5(
  params: {
    /** 费用项id */
    id: number;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/fee/item/activeenable`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 获取详情
 * @param code code
 * @param id id
 */
export function getByCodeUsingGET_2(
  code: string,
  id: any,
) {
  return request<OptimizeModel<Result«DmnFeeItemDTO»>>({
    url: `${__BASE_SERVICE__}/dmn/fee/item/info/${code}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 获取详情
 * @param id id
 */
export function getByIdUsingGET_9(
  id: number,
) {
  return request<OptimizeModel<Result«DmnFeeItemVO»>>({
    url: `${__BASE_SERVICE__}/dmn/fee/item/${id}`,
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
export function updateUsingPUT_17(
  id: number,
  data: DmnFeeItem,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/fee/item/${id}`,
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
export function deleteUsingDELETE_18(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/fee/item/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 根据关键字查询费用项-指定业务类型代码
 * @param params 参数
 */
export function findOfBusinessTypeUsingGET(
  params: {
    /** businessTypeCode */
    businessTypeCode: string;
    /** keyword */
    keyword: string;
  },
) {
  return request<OptimizeModel<Result«List«FeeItemDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/fee/list`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 根据关键字查询费用项-结算中心
 * @param params 参数
 */
export function findOfFmsUsingGET(
  params: {
    /** keyword */
    keyword: string;
  },
) {
  return request<OptimizeModel<Result«List«FeeItemDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/fee/list/fms`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 根据关键字查询费用项-海外仓
 * @param params 参数
 */
export function findOfOvlUsingGET(
  params: {
    /** keyword */
    keyword: string;
  },
) {
  return request<OptimizeModel<Result«List«FeeItemDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/fee/list/ovl`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}