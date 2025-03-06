import { request } from '@/utils';
import type { FlwNodeConfigVO, Result«FlwNodeConfig», Result«FlwNodeRuteEdgeVO», Result«int» } from '../interfaces';

/**
 * 新增
 * @param data 数据
 */
export function saveUsingPOST_19(
  data: FlwNodeConfigVO,
) {
  return request<OptimizeModel<Result«FlwNodeConfig»>>({
    url: `${__BASE_SERVICE__}/flw/node/config`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 修改
 * @param id 节点配置ID
 * @param data 数据
 */
export function updateUsingPUT_25(
  id: number,
  data: FlwNodeConfigVO,
) {
  return request<OptimizeModel<Result«FlwNodeConfig»>>({
    url: `${__BASE_SERVICE__}/flw/node/config/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 删除
 * @param id 节点配置ID
 */
export function deleteUsingDELETE_25(
  id: number,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/flw/node/config/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 工作流的流程图
 * @param nodeConfigId nodeConfigId
 */
export function routeEdgeUsingGET(
  nodeConfigId: number,
) {
  return request<OptimizeModel<Result«FlwNodeRuteEdgeVO»>>({
    url: `${__BASE_SERVICE__}/flw/node/route/edge/${nodeConfigId}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}