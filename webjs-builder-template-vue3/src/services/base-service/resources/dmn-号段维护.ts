import { request } from '@/utils';
import type { mdmNumberSegmentRequest, Result«boolean», Result«int», Result«List«mdmNumberSegmentDTO»», Result«mdmNumberSegmentDTO» } from '../interfaces';

/**
 * 保存号段
 * @param data 数据
 */
export function batchSaveUsingPOST(
  data: mdmNumberSegmentRequest[],
) {
  return request<OptimizeModel<Result«List«mdmNumberSegmentDTO»»>>({
    url: `${__BASE_SERVICE__}/mdm/numberSegment`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 一海通号码使用达到阈值，自动补充
 * @param params 参数
 */
export function autoAddYhtNoUsingPUT(
  params?: {
    /** count */
    count?: number;
    /** start */
    start?: number;
  },
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/mdm/numberSegment/autoAddYhtNo`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 批量删除号段
 * @param params 参数
 */
export function batchDeleteUsingDELETE(
  params: {
    /** force */
    force: boolean;
    /** numberSegmentIds */
    numberSegmentIds: string;
  },
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/mdm/numberSegment/batchDelete`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * getYhtSeg
 */
export function getYhtSegUsingGET(
) {
  return request<OptimizeModel<Result«mdmNumberSegmentDTO»>>({
    url: `${__BASE_SERVICE__}/mdm/numberSegment/getYhtSeg`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 更新号段
 * @param numberSegmentId numberSegmentId
 * @param params 参数
 */
export function updateUsingPUT_21(
  numberSegmentId: number,
  params: {
    /** 创建时间结束 */
    createTimeEnd?: number;
    /** 创建时间开始 */
    createTimeStart?: number;
    /** 结束号段 */
    endNo: string;
    /** id */
    id?: number;
    /** 主键列表 */
    ids?: number | number[];
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 号段正则规则 */
    rule?: string;
    /** 排序 */
    sort?: string;
    /** 起始号段 */
    startNo: string;
    /** 号段状态 */
    status?: number;
    /** 步长 */
    step: number;
    /** 余量 */
    surplus?: number;
    /** 号段总量 */
    total?: number;
    /** 号段类型 */
    type?: number;
  },
) {
  return request<OptimizeModel<Result«mdmNumberSegmentDTO»>>({
    url: `${__BASE_SERVICE__}/mdm/numberSegment/${numberSegmentId}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 删除号段
 * @param numberSegmentId numberSegmentId
 */
export function deleteUsingDELETE_21(
  numberSegmentId: number,
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/mdm/numberSegment/${numberSegmentId}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 发布号段
 * @param numberSegmentId numberSegmentId
 */
export function publishUsingPUT(
  numberSegmentId: number,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/mdm/numberSegment/${numberSegmentId}/publish`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}