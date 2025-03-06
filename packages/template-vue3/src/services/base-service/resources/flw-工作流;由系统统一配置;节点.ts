import { request } from '@/utils';
import type { Result, Result«List«FlwNodeVO»» } from '../interfaces';

/**
 * 平台统一配置类型集合
 * @param params 参数
 */
export function getFlwNodeModeListUsingGET(
  params?: {
    /** 工作流代码 */
    flowCode?: string;
  },
) {
  return request<OptimizeModel<Result«List«FlwNodeVO»»>>({
    url: `${__BASE_SERVICE__}/flw/node/modelist`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 路由规则表达式校验
 * @param data 数据
 */
export function validateRuleExpressionUsingPOST(
  data: string,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/flw/node/route/rule/validation`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}