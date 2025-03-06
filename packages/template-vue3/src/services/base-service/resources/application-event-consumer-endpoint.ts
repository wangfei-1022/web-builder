import { request } from '@/utils';
import type { Result } from '../interfaces';

/**
 * consume
 * @param data 数据
 */
export function consumeUsingPOST(
  data: string,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/system/event/ApplicationEventConsumerEndpoint`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}