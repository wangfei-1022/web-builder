import { request } from '@/utils';
import type { CfgParameterItem, Result } from '../interfaces';

/**
 * 数据同步api
 * @param data 数据
 */
export function synDataUsingPOST_2(
  data: CfgParameterItem,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/cfg/parameter/item/syndata`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}