import { request } from '@/utils';
import type { Result, Result«当前登录用户redis存储用户详细信息» } from '../interfaces';

/**
 * 用户登陆
 */
export function loginUsingGET(
) {
  return request<OptimizeModel<Result«当前登录用户redis存储用户详细信息»>>({
    url: `${__BASE_SERVICE__}/sys/login`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 退出登陆
 */
export function logoutUsingPOST_1(
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/logout`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}