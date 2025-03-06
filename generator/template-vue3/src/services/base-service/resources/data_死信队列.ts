import { request } from '@/utils';
import type { dataMqDlqMsg新增DTO, dataMqDlqMsg更新DTO, Result«boolean», Result«dataMqDlqMsg详情DTO», Result«int», Result«long», Result«PageInfo«dataMqDlqMsg列表DTO»», SendLastDeadLetterQueueMsgToDevParam } from '../interfaces';

/**
 * 保存
 * @param data 数据
 */
export function insertUsingPOST_1(
  data: dataMqDlqMsg新增DTO,
) {
  return request<OptimizeModel<Result«long»>>({
    url: `${__BASE_SERVICE__}/data/mq/dlq/msg`,
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
export function getByIdUsingGET_3(
  id: number,
) {
  return request<OptimizeModel<Result«dataMqDlqMsg详情DTO»>>({
    url: `${__BASE_SERVICE__}/data/mq/dlq/msg/detail/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 查询列表
 * @param params 参数
 */
export function queryUsingGET_4(
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
  return request<OptimizeModel<Result«PageInfo«dataMqDlqMsg列表DTO»»>>({
    url: `${__BASE_SERVICE__}/data/mq/dlq/msg/pages`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 通过id重试
 * @param data 数据
 */
export function resendByIdUsingPOST(
  data: number[],
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/data/mq/dlq/msg/resend/ids`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 发送近几天的死信消息到开发环境
 * @param data 数据
 */
export function sendNotifyUsingGET(
  data: SendLastDeadLetterQueueMsgToDevParam,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/data/mq/dlq/msg/send/notify`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}

/**
 * 更新
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_5(
  id: number,
  data: dataMqDlqMsg更新DTO,
) {
  return request<OptimizeModel<Result«long»>>({
    url: `${__BASE_SERVICE__}/data/mq/dlq/msg/${id}`,
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
export function deleteUsingDELETE_5(
  id: number,
) {
  return request<OptimizeModel<Result«long»>>({
    url: `${__BASE_SERVICE__}/data/mq/dlq/msg/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}