import { request } from '@/utils';
import type { dmnFeeItemBase新增DTO, Result«boolean», Result«dmnFeeItemBase详情DTO», Result«dmnFeeItemBusiness详情DTO», Result«List«基本的可选项数据DTO«int»»», Result«long», Result«PageInfo«dmnFeeItemBase列表DTO»», Result«PageInfo«dmnFeeItemBusiness列表DTO»» } from '../interfaces';

/**
 * 基础费用项目-新增草稿
 * @param data 数据
 */
export function insertUsingPOST_6(
  data: dmnFeeItemBase新增DTO,
) {
  return request<OptimizeModel<Result«long»>>({
    url: `${__BASE_SERVICE__}/dmn/fee/item/base`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 基础费用项目-是否存在业务编码
 * @param params 参数
 */
export function existsUsingGET_1(
  params: {
    /** 业务类型 */
    businessTypeCode: string;
    /** 业务类型名称 */
    businessTypeName?: string;
    /** 中文名称 */
    chineseName?: string;
    /** 代码 */
    code?: string;
    /** 英文名称 */
    englishName?: string;
    /** 排除的ID */
    excludeId?: number;
    /** 费用助记码 */
    feeShortName?: string;
  },
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/dmn/fee/item/base/business/exists`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 基础费用项目-查询列表
 * @param params 参数
 */
export function businessFeeItemCodeQueryUsingGET(
  params: {
    /** 基础费用项类型 */
    businessType?: string;
    /** 基础费用项编码 */
    code?: string;
    /** 创建时间结束 */
    createTimeEnd?: number;
    /** 创建时间开始 */
    createTimeStart?: number;
    /** 主键 */
    id?: number;
    /** 主键列表 */
    ids?: number | number[];
    /** 关键字搜索 */
    keyword?: string;
    /** 基础费用项名称 */
    name?: string;
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 排序 */
    sort?: string;
    /** 基础费用项类型 */
    status?: number;
  },
) {
  return request<OptimizeModel<Result«PageInfo«dmnFeeItemBusiness列表DTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/fee/item/base/business/pages`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 基础费用项目-删除
 * @param businessId businessId
 */
export function deleteBusinessUsingDELETE(
  businessId: number,
) {
  return request<OptimizeModel<Result«long»>>({
    url: `${__BASE_SERVICE__}/dmn/fee/item/base/business/${businessId}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 基础费用项目-查询业务详情
 * @param id id
 */
export function getBusinessDetailByIdUsingGET(
  id: number,
) {
  return request<OptimizeModel<Result«dmnFeeItemBusiness详情DTO»>>({
    url: `${__BASE_SERVICE__}/dmn/fee/item/base/detail/business/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 基础费用项目-查询详情
 * @param id id
 */
export function getByIdUsingGET_8(
  id: number,
) {
  return request<OptimizeModel<Result«dmnFeeItemBase详情DTO»>>({
    url: `${__BASE_SERVICE__}/dmn/fee/item/base/detail/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 基础费用项目-是否存在基础费用项目
 * @param params 参数
 */
export function existsUsingGET(
  params?: {
    /** 中文名称 */
    chineseName?: string;
    /** 代码 */
    code?: string;
    /** 英文名称 */
    englishName?: string;
    /** 排除的ID */
    excludeId?: number;
    /** 费用助记码 */
    feeShortName?: string;
  },
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/dmn/fee/item/base/exists`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 基础费用项目-查询列表
 * @param params 参数
 */
export function queryUsingGET_18(
  params: {
    /** 基础费用项类型 */
    businessType?: string;
    /** 基础费用项编码 */
    code?: string;
    /** 创建时间结束 */
    createTimeEnd?: number;
    /** 创建时间开始 */
    createTimeStart?: number;
    /** 主键 */
    id?: number;
    /** 主键列表 */
    ids?: number | number[];
    /** 基础费用项名称 */
    name?: string;
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 排序 */
    sort?: string;
    /** 基础费用项类型 */
    status?: number;
  },
) {
  return request<OptimizeModel<Result«PageInfo«dmnFeeItemBase列表DTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/fee/item/base/pages`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 基础费用项目-状态列表
 */
export function getAllStatusSelectionUsingGET(
) {
  return request<OptimizeModel<Result«List«基本的可选项数据DTO«int»»»>>({
    url: `${__BASE_SERVICE__}/dmn/fee/item/base/selections/status`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 基础费用项目-新增提交
 * @param data 数据
 */
export function submitUsingPOST(
  data: dmnFeeItemBase新增DTO,
) {
  return request<OptimizeModel<Result«long»>>({
    url: `${__BASE_SERVICE__}/dmn/fee/item/base/submit`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 基础费用项目-草稿更新
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_16(
  id: number,
  data: dmnFeeItemBase新增DTO,
) {
  return request<OptimizeModel<Result«long»>>({
    url: `${__BASE_SERVICE__}/dmn/fee/item/base/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 基础费用项目-删除
 * @param id id
 */
export function deleteUsingDELETE_17(
  id: number,
) {
  return request<OptimizeModel<Result«long»>>({
    url: `${__BASE_SERVICE__}/dmn/fee/item/base/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 基础费用项目-更新提交
 * @param id id
 * @param data 数据
 */
export function updateAndSubmitUsingPUT(
  id: number,
  data: dmnFeeItemBase新增DTO,
) {
  return request<OptimizeModel<Result«long»>>({
    url: `${__BASE_SERVICE__}/dmn/fee/item/base/${id}/submit`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}