import { request } from '@/utils';
import type { receiverEditDTO, Result, Result«int», Result«List«nfyReceiverDTO»», Result«nfyReceiverDTO» } from '../interfaces';

/**
 * 保存
 * @param data 数据
 */
export function insertUsingPOST_10(
  data: receiverEditDTO,
) {
  return request<OptimizeModel<Result«nfyReceiverDTO»>>({
    url: `${__BASE_SERVICE__}/omc/nfy/receiver`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 批量设置接收人时的接收人列表
 */
export function getReceiverListUsingGET_1(
) {
  return request<OptimizeModel<Result«List«nfyReceiverDTO»»>>({
    url: `${__BASE_SERVICE__}/omc/nfy/receiver/active/receivers`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 单独发送邮箱验证
 * @param id id
 */
export function checkEmailUsingGET_1(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/omc/nfy/receiver/checkEmail/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 查询详情
 * @param id id
 */
export function getByIdUsingGET_14(
  id: number,
) {
  return request<OptimizeModel<Result«nfyReceiverDTO»>>({
    url: `${__BASE_SERVICE__}/omc/nfy/receiver/detail/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 邮箱验证回调
 * @param id id
 */
export function emailCallbackUsingPUT_1(
  id: number,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/omc/nfy/receiver/email/activate/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 手机号验证回调
 * @param id id
 */
export function mobileCallbackUsingPUT_1(
  id: number,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/omc/nfy/receiver/mobile/activate/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 查询列表
 * @param params 参数
 */
export function queryUsingGET_32(
  params: {
    /** 用户订阅配置id */
    configId?: number;
    /** 创建时间结束 */
    createTimeEnd?: number;
    /** 创建时间开始 */
    createTimeStart?: number;
    /** email */
    email?: string;
    /** 主键 */
    id?: number;
    /** 主键列表 */
    ids?: number | number[];
    /** mobile */
    mobile?: string;
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 平台代码:1-运营;2-会员 */
    receivePlatformCode?: number;
    /** 排序 */
    sort?: string;
    /** systemUserFlag */
    systemUserFlag?: boolean;
    /** 用户ID */
    userId?: number;
  },
) {
  return request<OptimizeModel<Result«List«nfyReceiverDTO»»>>({
    url: `${__BASE_SERVICE__}/omc/nfy/receiver/receivers`,
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
export function updateUsingPUT_27(
  id: number,
  data: receiverEditDTO,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/omc/nfy/receiver/${id}`,
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
export function deleteUsingDELETE_27(
  id: number,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/omc/nfy/receiver/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}