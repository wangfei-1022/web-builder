import { request } from '@/utils';
import type { Result«string» } from '../interfaces';

/**
 * 短链接功能_长链接转换为短链接_GET方式请求
 * @param params 参数
 */
export function saveAndTranslateToShortUsingGET(
  params: {
    /** desc */
    desc?: string;
    /** url */
    url: string;
  },
) {
  return request<OptimizeModel<Result«string»>>({
    url: `${__BASE_SERVICE__}/short/url`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 短链接功能_长链接转换为短链接压缩码_GET方式请求
 * @param params 参数
 */
export function saveAndTranslateToShortCodeUsingGET(
  params: {
    /** desc */
    desc?: string;
    /** url */
    url: string;
  },
) {
  return request<OptimizeModel<Result«string»>>({
    url: `${__BASE_SERVICE__}/short/url/code`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 短链接功能_跳转
 * @param compressionCode compressionCode
 */
export function redirectUsingGET(
  compressionCode: string,
) {
  return request<void>({
    url: `${__BASE_SERVICE__}/u/${compressionCode}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}