import { request } from '@/utils';
import type { dmnContainerYardDTO, Result«dmnContainerYardDTO», Result«int», Result«List«dmnContainerYardDTO»», Result«PageInfo«dmnContainerYardDTO»» } from '../interfaces';

/**
 * 查询详情
 * @param id id
 */
export function getByIdUsingGET_5(
  id: number,
) {
  return request<OptimizeModel<Result«dmnContainerYardDTO»>>({
    url: `${__BASE_SERVICE__}/dmn/container/yard/detail/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 根据条件获取堆场列表
 * @param params 参数
 */
export function getContainerYardListUsingGET_1(
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
    /** 港口代码 */
    portCode?: string;
    /** 排序 */
    sort?: string;
    /** 堆场编码 */
    yardCode?: string;
    /** 堆场编码list */
    yardCodes?: string | string[];
    /** 堆场名称 */
    yardName?: string;
    /** 堆场类型：1堆场；2码头 */
    yardType?: number;
  },
) {
  return request<OptimizeModel<Result«List«dmnContainerYardDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/container/yard/getContainerYardList`,
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
export function queryUsingGET_12(
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
    /** 港口编码 */
    portCode?: string;
    /** 排序 */
    sort?: string;
    /** 堆场编码 */
    yardCode?: string;
    /** 堆场编码list */
    yardCodes?: string | string[];
    /** 堆场名称 */
    yardName?: string;
    /** 堆场类型 */
    yardType?: number;
  },
) {
  return request<OptimizeModel<Result«PageInfo«dmnContainerYardDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/container/yard/list`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * queryByYardCode
 * @param params 参数
 */
export function queryByYardCodeUsingGET(
  params: {
    /** yardCode */
    yardCode: string;
  },
) {
  return request<OptimizeModel<Result«dmnContainerYardDTO»>>({
    url: `${__BASE_SERVICE__}/dmn/container/yard/queryByYardCode`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 新增堆场
 * @param data 数据
 */
export function insertUsingPOST_3(
  data: dmnContainerYardDTO,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/dmn/container/yard/save`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 修改堆场
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_9(
  id: number,
  data: dmnContainerYardDTO,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/dmn/container/yard/update/${id}`,
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
export function deleteUsingDELETE_10(
  id: number,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/dmn/container/yard/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}