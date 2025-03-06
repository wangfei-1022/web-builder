import { request } from '@/utils';
import type { messageActionDTO, Result«int» } from '../interfaces';

/**
 * 取消订阅
 * @param data 数据
 */
export function cancleSubscribeUsingPUT(
  data: messageActionDTO,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/nfy/subscription/cancleSubscribe`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}