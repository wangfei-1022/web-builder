import { request } from '@/utils';
import type { 站内信消息 内容 } from '../interfaces';

/**
 * sendToUser
 * @param data 数据
 */
export function sendToUserUsingPOST(
  data: 站内信消息 内容,
) {
  return request<void>({
    url: `${__BASE_SERVICE__}/message/send`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}