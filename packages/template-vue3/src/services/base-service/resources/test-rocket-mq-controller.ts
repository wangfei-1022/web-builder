import { request } from '@/utils';
import type { Result«Map«string,object»» } from '../interfaces';

/**
 * testCommSendNums
 * @param nums nums
 */
export function testCommSendNumsUsingPOST(
  nums: number,
) {
  return request<OptimizeModel<Result«Map«string,object»»>>({
    url: `${__BASE_SERVICE__}/test/comm/send/${nums}`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * testDelaySendNums
 * @param nums nums
 */
export function testDelaySendNumsUsingPOST(
  nums: number,
) {
  return request<OptimizeModel<Result«Map«string,object»»>>({
    url: `${__BASE_SERVICE__}/test/delay/send/${nums}`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * testFifoSendNums
 * @param nums nums
 */
export function testFifoSendNumsUsingPOST(
  nums: number,
) {
  return request<OptimizeModel<Result«Map«string,object»»>>({
    url: `${__BASE_SERVICE__}/test/fifo/send/${nums}`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}