import { request } from '@/utils';
import type { Result, 站内信发送业务消息 } from '../interfaces';

/**
 * sendBusinessToUser
 * @param data 数据
 */
export function sendBusinessToUserUsingPOST(
  data: 站内信发送业务消息,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/nfy/business/message/send`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}