import { request } from '@/utils';
import type { dmnContainerOwnerDTO, Result«dmnContainerOwnerDTO», Result«int», Result«List«dmn_箱主»», Result«PageInfo«dmnContainerOwnerDTO»» } from '../interfaces';

/**
 * 查询详情
 * @param id id
 */
export function getByIdUsingGET_4(
  id: number,
) {
  return request<OptimizeModel<Result«dmnContainerOwnerDTO»>>({
    url: `${__BASE_SERVICE__}/dmn/container/owner/detail/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 获取现有堆场列表
 * @param params 参数
 */
export function getContainerYardListUsingGET(
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
  return request<OptimizeModel<Result«List«dmn_箱主»»>>({
    url: `${__BASE_SERVICE__}/dmn/container/owner/getContainerOwnerList`,
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
export function queryUsingGET_11(
  params: {
    /** 创建时间结束 */
    createTimeEnd?: number;
    /** 创建时间开始 */
    createTimeStart?: number;
    /** 主键 */
    id?: number;
    /** 主键列表 */
    ids?: number | number[];
    /** 箱主编码 */
    ownerCode?: string;
    /** 箱主名称 */
    ownerName?: string;
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 排序 */
    sort?: string;
  },
) {
  return request<OptimizeModel<Result«PageInfo«dmnContainerOwnerDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/container/owner/list`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 新增箱主信息
 * @param data 数据
 */
export function insertUsingPOST_2(
  data: dmnContainerOwnerDTO,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/dmn/container/owner/save`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 更新箱主信息
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_8(
  id: number,
  data: dmnContainerOwnerDTO,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/dmn/container/owner/update/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 删除（未使用）
 * @param id id
 */
export function deleteUsingDELETE_9(
  id: number,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/dmn/container/owner/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}