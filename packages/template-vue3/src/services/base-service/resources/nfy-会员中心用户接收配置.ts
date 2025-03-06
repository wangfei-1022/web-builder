import { request } from '@/utils';
import type { Result«int», Result«List«nfyReceiverDTO»», Result«List«用户接收配置(查询用)DTO»», Result«用户接收配置(编辑用)DTO», 修改联系人用DTO, 批量修改联系人用DTO, 用户接收配置(编辑用)DTO } from '../interfaces';

/**
 * 批量设置接收人
 * @param data 数据
 */
export function batchUpdateReceiversUsingPUT(
  data: 批量修改联系人用DTO,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/member/nfy/user/reception/config/batch/receivers`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 设置邮件开关
 * @param data 数据
 */
export function emailOnOffUsingPUT(
  data: 用户接收配置(编辑用)DTO,
) {
  return request<OptimizeModel<Result«用户接收配置(编辑用)DTO»>>({
    url: `${__BASE_SERVICE__}/member/nfy/user/reception/config/email/on-off`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 设置短信开关
 * @param data 数据
 */
export function mobileOnOffUsingPUT(
  data: 用户接收配置(编辑用)DTO,
) {
  return request<OptimizeModel<Result«用户接收配置(编辑用)DTO»>>({
    url: `${__BASE_SERVICE__}/member/nfy/user/reception/config/mobile/on-off`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 设置站内信开关
 * @param data 数据
 */
export function msgOnOffUsingPUT(
  data: 用户接收配置(编辑用)DTO,
) {
  return request<OptimizeModel<Result«用户接收配置(编辑用)DTO»>>({
    url: `${__BASE_SERVICE__}/member/nfy/user/reception/config/msg/on-off`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 设置接收人
 * @param data 数据
 */
export function updateReceiversUsingPUT(
  data: 修改联系人用DTO,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/member/nfy/user/reception/config/receivers`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 查询列表
 * @param params 参数
 */
export function queryUsingGET_30(
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
    /** 订阅CODE */
    subscribeActionCode?: string;
    /** 订阅者id */
    subscriberId?: number;
    /** 订阅者ids */
    subscriberIds?: number | number[];
    /** 目标类型CODE */
    targetTypeCode?: string;
  },
) {
  return request<OptimizeModel<Result«List«用户接收配置(查询用)DTO»»>>({
    url: `${__BASE_SERVICE__}/member/nfy/user/reception/config/types/tree`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 获取某个配置的联系人列表
 * @param id id
 */
export function getReceiverListByConfigUsingGET(
  id: number,
) {
  return request<OptimizeModel<Result«List«nfyReceiverDTO»»>>({
    url: `${__BASE_SERVICE__}/member/nfy/user/reception/config/${id}/receivers`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}