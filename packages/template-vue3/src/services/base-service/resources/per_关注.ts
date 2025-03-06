import { request } from '@/utils';
import type { Result«List«菜单树形»» } from '../interfaces';

/**
 * 最近访问菜单列表(默认返回前6条)
 */
export function queryUsingGET_34(
) {
  return request<OptimizeModel<Result«List«菜单树形»»>>({
    url: `${__BASE_SERVICE__}/per/menu/logs/list`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}