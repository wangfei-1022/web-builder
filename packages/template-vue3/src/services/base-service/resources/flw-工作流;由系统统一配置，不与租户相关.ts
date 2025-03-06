import { request } from '@/utils';
import type { Result«List«工作流类型-平台级别»» } from '../interfaces';

/**
 * 平台统一配置类型集合
 */
export function getFlwFlowModeListUsingGET(
) {
  return request<OptimizeModel<Result«List«工作流类型-平台级别»»>>({
    url: `${__BASE_SERVICE__}/flw/flow/modelist`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}