import { request } from '@/utils';
import type { Result«List«DmnTermAndItemVO»», Result«List«下拉框value值对应为string»», Result«List«行业术语项列表»», Result«long» } from '../interfaces';

/**
 * 行业术语列表
 */
export function queryUsingGET_27(
) {
  return request<OptimizeModel<Result«List«行业术语项列表»»>>({
    url: `${__BASE_SERVICE__}/dmn/term`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * getIdByTermTypeAndCode
 * @param code code
 * @param termType termType
 */
export function getIdByTermTypeAndCodeUsingGET(
  code: string,
  termType: string,
) {
  return request<OptimizeModel<Result«long»>>({
    url: `${__BASE_SERVICE__}/dmn/term/${termType}/${code}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 行业术语父子级列表
 * @param data 数据
 */
export function queryTermAndItemListUsingPOST(
  data: string[],
) {
  return request<OptimizeModel<Result«List«DmnTermAndItemVO»»>>({
    url: `${__BASE_SERVICE__}/dmn/termAndItem`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 行业术-术语类型
 */
export function termTypeListUsingGET(
) {
  return request<OptimizeModel<Result«List«下拉框value值对应为string»»>>({
    url: `${__BASE_SERVICE__}/dmn/termtype`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}