import { request } from '@/utils';
import type { Result«int», Result«List«菜单树形»» } from '../interfaces';

/**
 * 获取收藏列表(默认显示6个)
 */
export function getListUsingGET_1(
) {
  return request<OptimizeModel<Result«List«菜单树形»»>>({
    url: `${__BASE_SERVICE__}/per/menu/favorite/list`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 收藏
 * @param privilegeId privilegeId
 */
export function favoriteMenuUsingPOST(
  privilegeId: number,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/per/menu/favorite/${privilegeId}`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 取消收藏
 * @param privilegeId privilegeId
 */
export function deleteUsingDELETE_30(
  privilegeId: number,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/per/menu/favorite/${privilegeId}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}