import { request } from '@/utils';
import type { Result«List«string»» } from '../interfaces';

/**
 * 从数据库加载角色权限
 * @param roleCode roleCode
 */
export function loadPrivilegeByGroupUsingGET(
  roleCode: string,
) {
  return request<OptimizeModel<Result«List«string»»>>({
    url: `${__BASE_SERVICE__}/sys/load/role/access/privileges/${roleCode}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}