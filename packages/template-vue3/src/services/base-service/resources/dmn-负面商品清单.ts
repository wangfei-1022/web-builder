import { request } from '@/utils';
import type { DmnNegativeList, Result, Result«PageInfo«DmnNegativeList»» } from '../interfaces';

/**
 * 负面商品清单查询列表
 * @param params 参数
 */
export function queryUsingGET_23(
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
  return request<OptimizeModel<Result«PageInfo«DmnNegativeList»»>>({
    url: `${__BASE_SERVICE__}/dmn/negative/list`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 负面商品清单新增保存
 * @param data 数据
 */
export function saveUsingPOST_14(
  data: DmnNegativeList,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/negative/list`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 负面商品清单修改保存
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_20(
  id: number,
  data: DmnNegativeList,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/negative/list/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 负面商品清单删除
 * @param id id
 */
export function deleteUsingDELETE_20(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/negative/list/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}