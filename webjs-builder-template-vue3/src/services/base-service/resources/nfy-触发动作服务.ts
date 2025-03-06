import { request } from '@/utils';
import type { Result«boolean», triggerActionDTO } from '../interfaces';

/**
 * 触发动作, 生成订阅(订阅人类型默认为系统用户)
 * @param data 数据
 */
export function triggerActionUsingPOST(
  data: triggerActionDTO,
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/nfy/trigger/action`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 触发动作, 取消订阅(默认系统用户)
 * @param data 数据
 */
export function triggerActionCancelUsingPOST(
  data: triggerActionDTO,
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/nfy/trigger/action/cancel`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 触发动作, 取消邮件方式订阅
 * @param data 数据
 */
export function triggerActionCancelEmailUsingPOST(
  data: triggerActionDTO,
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/nfy/trigger/action/cancel/email`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 触发动作, 取消短信方式订阅
 * @param data 数据
 */
export function triggerActionCancelSmsUsingPOST(
  data: triggerActionDTO,
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/nfy/trigger/action/cancel/sms`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 触发动作, 生成订阅(订阅人类型为邮件)
 * @param data 数据
 */
export function triggerActionEmailUsingPOST(
  data: triggerActionDTO,
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/nfy/trigger/action/email`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 触发动作, 生成订阅(订阅人类型为手机)
 * @param data 数据
 */
export function triggerActionSmsUsingPOST(
  data: triggerActionDTO,
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/nfy/trigger/action/sms`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}