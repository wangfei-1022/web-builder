import { request } from '@/utils';
import type { Result«string» } from '../interfaces';

/**
 * deregisterInstance
 */
export function deregisterInstanceUsingGET(
) {
  return request<OptimizeModel<Result«string»>>({
    url: `${__BASE_SERVICE__}/api/nacos/deregister`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}