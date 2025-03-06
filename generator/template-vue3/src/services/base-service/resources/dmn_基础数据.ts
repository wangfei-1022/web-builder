import { request } from '@/utils';
import type { Result«List«基本的可选项数据DTO«int»»» } from '../interfaces';

/**
 * 基础数据-业务类型下拉列表
 */
export function getBusinessTypeUsingGET(
) {
  return request<OptimizeModel<Result«List«基本的可选项数据DTO«int»»»>>({
    url: `${__BASE_SERVICE__}/dmn/dict/selections/businessType`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}