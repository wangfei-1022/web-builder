import { request } from '@/utils';
import type { Result«用户token相关信息» } from '../interfaces';

/**
 * 从数据库加载用户信息
 * @param userId userId
 */
export function loadUserInfoUsingGET(
  userId: number,
) {
  return request<OptimizeModel<Result«用户token相关信息»>>({
    url: `${__BASE_SERVICE__}/sys/load/user/${userId}/info`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 从数据库加载用户权限
 * @param userId userId
 */
export function loadUserPermissionUsingGET(
  userId: number,
) {
  return request<OptimizeModel<Result«用户token相关信息»>>({
    url: `${__BASE_SERVICE__}/sys/load/user/${userId}/permission`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}