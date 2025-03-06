import { request } from '@/utils';
import type { BaseIdListRequest, Result«int», Result«List«nfyUserNotifyDTO»», Result«long», Result«PageInfo«消息列表出参»», Result«消息详情» } from '../interfaces';

/**
 * 获取消息列表
 * @param params 参数
 */
export function queryUsingGET_31(
  params: {
    /** 消息的类型 */
    notifyType?: number;
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 是否已读 */
    readFlag?: boolean;
    /** 排序 */
    sort?: string;
  },
) {
  return request<OptimizeModel<Result«PageInfo«消息列表出参»»>>({
    url: `${__BASE_SERVICE__}/nfy/notify/message`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 消息类型统计
 */
export function notifyCountUsingGET(
) {
  return request<OptimizeModel<Result«List«nfyUserNotifyDTO»»>>({
    url: `${__BASE_SERVICE__}/nfy/notify/message/notify/type`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 批量标为已读
 * @param data 数据
 */
export function batchUpdateToReadUsingPUT(
  data: BaseIdListRequest,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/nfy/notify/message/read/messages`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 用户点击详情并标记为已读
 * @param id id
 */
export function getByIdUsingPUT(
  id: number,
) {
  return request<OptimizeModel<Result«消息详情»>>({
    url: `${__BASE_SERVICE__}/nfy/notify/message/read/${id}/message`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 获取未读消息数量
 */
export function countNfyUserNotifyUsingGET(
) {
  return request<OptimizeModel<Result«long»>>({
    url: `${__BASE_SERVICE__}/nfy/notify/message/unread/number`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}