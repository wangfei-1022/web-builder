import { request } from '@/utils';
import type { Result«用户Token» } from '../interfaces';

/**
 * getAuthToken
 */
export function getAuthTokenUsingGET_1(
) {
  return request<OptimizeModel<Result«用户Token»>>({
    url: `${__BASE_SERVICE__}/auth/user/tencent/authToken/lowcode`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}