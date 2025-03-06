import { request } from '@/utils';
import type { Result, 发送邮件实体 } from '../interfaces';

/**
 * 发送邮件
 * @param data 数据
 */
export function sendEmailUsingPOST(
  data: 发送邮件实体,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/send/email`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}