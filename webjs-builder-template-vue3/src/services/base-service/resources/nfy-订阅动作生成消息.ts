import { request } from '@/utils';
import type { Result«boolean», 订阅动作 } from '../interfaces';

/**
 * 触发消息通知
 * @param data 数据
 */
export function notifyUsingPOST(
  data: 订阅动作,
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/nfy/subscribe/action/notify`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}