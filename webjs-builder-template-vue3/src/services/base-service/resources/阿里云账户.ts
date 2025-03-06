import { request } from '@/utils';
import type { Result«用户Token» } from '../interfaces';

/**
 * getAuthToken
 */
export function getAuthTokenUsingGET(
) {
  return request<OptimizeModel<Result«用户Token»>>({
    url: `${__BASE_SERVICE__}/auth/user/aliyun/authToken/lowcode`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}