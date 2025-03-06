import { request } from '@/utils';
import type { Result, Result«Credentials» } from '../interfaces';

/**
 * getOSSOpenSts
 */
export function getOSSOpenStsUsingGET(
) {
  return request<OptimizeModel<Result«Credentials»>>({
    url: `${__BASE_SERVICE__}/oss/openSts`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * getOSSSts
 */
export function getOSSStsUsingGET(
) {
  return request<OptimizeModel<Result«Credentials»>>({
    url: `${__BASE_SERVICE__}/oss/sts`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * clearCache
 */
export function clearCacheUsingGET(
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/oss/sts/clear/cache`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}