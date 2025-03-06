import { request } from '@/utils';
import type { CfgParameter, Result } from '../interfaces';

/**
 * 数据同步api
 * @param data 数据
 */
export function synDataUsingPOST_1(
  data: CfgParameter,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/cfg/parameter/syndata`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}