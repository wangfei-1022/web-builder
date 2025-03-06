import { request } from '@/utils';
import type { Result«List«mdmNumberStoreDTO»» } from '../interfaces';

/**
 * 获取并更新号码
 * @param count count
 * @param data 数据
 * @param params 参数
 */
export function getAndUpdateUsingPUT(
  count: number,
  data: number[],
  params: {
    /** businessIds */
    businessIds: number | number[];
  },
) {
  return request<OptimizeModel<Result«List«mdmNumberStoreDTO»»>>({
    url: `${__BASE_SERVICE__}/mdm/numberStore/${count}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
    params,
  });
}