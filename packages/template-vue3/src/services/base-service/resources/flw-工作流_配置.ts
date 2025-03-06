import { request } from '@/utils';
import type { FlwFlowConfigInItVO, FlwFlowConfigVO, Result, Result«FlwFlowConfigVO», Result«List«FlwFlowConfigVO»», Result«long» } from '../interfaces';

/**
 * 新增-初始化
 * @param data 数据
 */
export function configInitUsingPOST(
  data: FlwFlowConfigInItVO,
) {
  return request<OptimizeModel<Result«long»>>({
    url: `${__BASE_SERVICE__}/flw/flow/config/init`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 工作流_配置_某个类型
 * @param params 参数
 */
export function getFlwFlowConfigModeListUsingGET(
  params?: {
    /** 工作流代码 */
    flowCode?: string;
  },
) {
  return request<OptimizeModel<Result«List«FlwFlowConfigVO»»>>({
    url: `${__BASE_SERVICE__}/flw/flow/config/modelist`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 修改公司或干预人
 * @param data 数据
 */
export function updateOfficeAndInterveneUserUsingPUT(
  data: FlwFlowConfigVO,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/flw/flow/config/office/admin`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 查询详情
 * @param id 工作流配置ID
 */
export function detailUsingGET_7(
  id: number,
) {
  return request<OptimizeModel<Result«FlwFlowConfigVO»>>({
    url: `${__BASE_SERVICE__}/flw/flow/config/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 删除
 * @param id 工作流配置ID
 */
export function deleteUsingDELETE_24(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/flw/flow/config/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}