import { request } from '@/utils';
import type { Result, Result«boolean», Result«int», Result«nfyReceiverDTO», Result«string», syncReceiverDTO, 更新联系人, 联系人状态更新 } from '../interfaces';

/**
 * 获取用户的信息
 * @param userId userId
 */
export function getSystemUserByUserIdUsingGET(
  userId: number,
) {
  return request<OptimizeModel<Result«nfyReceiverDTO»>>({
    url: `${__BASE_SERVICE__}/nfy/receiver/system/user/${userId}/receiver`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 确认对应用户是否已经存在
 * @param userId userId
 */
export function checkSystemUserByUserIdUsingGET(
  userId: number,
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/nfy/receiver/system/user/${userId}/receiver/exists`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 更新系统用户
 * @param data 数据
 */
export function updateSystemUserUsingPUT(
  data: syncReceiverDTO,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/nfy/receiver/systemUser`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 新增系统用户
 * @param data 数据
 */
export function saveSystemUserUsingPOST(
  data: syncReceiverDTO,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/nfy/receiver/systemUser`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 更新联系人状态
 * @param userId userId
 * @param data 数据
 */
export function syncSystemUserUsingPUT(
  userId: number,
  data: 联系人状态更新,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/nfy/receiver/user/${id}/status`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 获取联系人邮箱
 * @param userId userId
 */
export function getEmailUsingGET(
  userId: number,
) {
  return request<OptimizeModel<Result«string»>>({
    url: `${__BASE_SERVICE__}/nfy/receiver/user/${userId}/email`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 更新联系人邮箱
 * @param userId userId
 * @param data 数据
 */
export function updateSystemUserStatusEmailFlagUsingPUT(
  userId: number,
  data: 更新联系人,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/nfy/receiver/user/${userId}/email`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 激活联系人邮箱状态
 * @param userId userId
 */
export function updateSystemUserStatusEmailFlagUsingPUT_1(
  userId: number,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/nfy/receiver/user/${userId}/email/flag/activation`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 更新联系人手机
 * @param userId userId
 * @param data 数据
 */
export function updateSystemUserStatusMobileFlagUsingPUT(
  userId: number,
  data: 更新联系人,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/nfy/receiver/user/${userId}/mobile`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 激活联系人手机状态
 * @param userId userId
 */
export function updateSystemUserStatusMobileFlagUsingPUT_1(
  userId: number,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/nfy/receiver/user/${userId}/mobile/flag/activation`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}