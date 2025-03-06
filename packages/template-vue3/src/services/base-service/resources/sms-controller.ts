import { request } from '@/utils';
import type { Result, 发送短信实体 } from '../interfaces';

/**
 * 发送短信)
 * @param data 数据
 */
export function sendSmsUsingPOST(
  data: 发送短信实体,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/send/sms`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}