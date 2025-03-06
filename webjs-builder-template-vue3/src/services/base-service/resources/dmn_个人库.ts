import { request } from '@/utils';
import type { dmnIndividual新增DTO, dmnIndividual更新DTO, Result«dmnIndividual详情DTO», Result«int», Result«PageInfo«dmnIndividual列表DTO»» } from '../interfaces';

/**
 * 保存
 * @param data 数据
 */
export function insertUsingPOST_7(
  data: dmnIndividual新增DTO,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/dmn/individual`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 查询详情
 * @param id id
 */
export function getByIdUsingGET_10(
  id: number,
) {
  return request<OptimizeModel<Result«dmnIndividual详情DTO»>>({
    url: `${__BASE_SERVICE__}/dmn/individual/detail/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 查询列表
 * @param params 参数
 */
export function queryUsingGET_21(
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
    /** 排序 */
    sort?: string;
  },
) {
  return request<OptimizeModel<Result«PageInfo«dmnIndividual列表DTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/individual/list`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 更新
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_18(
  id: number,
  data: dmnIndividual更新DTO,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/dmn/individual/${id}`,
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
export function deleteUsingDELETE_19(
  id: number,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/dmn/individual/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}