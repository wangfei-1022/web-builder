import { request } from '@/utils';
import type { DmnFeeGroup, Result, Result«PageInfo«DmnFeeGroup»» } from '../interfaces';

/**
 * 查询列表
 * @param params 参数
 */
export function queryUsingGET_17(
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
  return request<OptimizeModel<Result«PageInfo«DmnFeeGroup»»>>({
    url: `${__BASE_SERVICE__}/dmn/fee/group`,
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
export function saveUsingPOST_12(
  data: DmnFeeGroup,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/fee/group`,
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
export function updateUsingPUT_15(
  id: number,
  data: DmnFeeGroup,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/fee/group/${id}`,
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
export function deleteUsingDELETE_16(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/dmn/fee/group/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}