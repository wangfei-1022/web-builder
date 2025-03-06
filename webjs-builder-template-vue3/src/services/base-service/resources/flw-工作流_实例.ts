import { request } from '@/utils';
import type { FlwFlowInstanceSubmitVO, Result, Result«List«FlwFlowApproveEntityLogVO»», Result«List«FlwFlowInstanceNodeVO»», Result«List«全部待审批数量»», Result«long», 获取审批历史查询条件 } from '../interfaces';

/**
 * 提交
 * @param data 数据
 */
export function saveUsingPOST_18(
  data: FlwFlowInstanceSubmitVO,
) {
  return request<OptimizeModel<Result«long»>>({
    url: `${__BASE_SERVICE__}/flw/flow/instance`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 审批
 * @param data 数据
 * @param params 参数
 */
export function approveUsingPUT(
  data: number[],
  params?: {
    /** 过程节点ID */
    pid?: any;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/flw/flow/instance/approve`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
    params,
  });
}

/**
 * 获取全部审批历史数量
 * @param data 数据
 */
export function getApproveCompleteCountUsingPOST(
  data: 获取审批历史查询条件,
) {
  return request<OptimizeModel<Result«List«全部待审批数量»»>>({
    url: `${__BASE_SERVICE__}/flw/flow/instance/approve/complete/count`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 获取指定流程类型的当前人审批或者通知节点列表
 * @param data 数据
 */
export function getApproveCompleteInstanceListUsingPOST(
  data: 获取审批历史查询条件,
) {
  return request<OptimizeModel<Result«List«FlwFlowInstanceNodeVO»»>>({
    url: `${__BASE_SERVICE__}/flw/flow/instance/approve/complete/list`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 获取指定流程实例的审批日志
 * @param params 参数
 */
export function getApproveEntityLogUsingGET(
  params: {
    /** 业务实体id */
    eid: number;
  },
) {
  return request<OptimizeModel<Result«List«FlwFlowApproveEntityLogVO»»>>({
    url: `${__BASE_SERVICE__}/flw/flow/instance/entity/log/${eid}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 获取待审批数量
 */
export function getPendingApproveCountUsingGET(
) {
  return request<OptimizeModel<Result«List«全部待审批数量»»>>({
    url: `${__BASE_SERVICE__}/flw/flow/instance/pending/approve/count`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 获取待审批列表
 * @param params 参数
 */
export function getPendingApproveListUsingGET(
  params?: {
    /** 工作流代码 */
    flowCode?: string;
  },
) {
  return request<OptimizeModel<Result«List«FlwFlowInstanceNodeVO»»>>({
    url: `${__BASE_SERVICE__}/flw/flow/instance/pending/approve/list`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 拒绝
 * @param data 数据
 * @param params 参数
 */
export function rejectUsingPUT(
  data: number[],
  params?: {
    /** 过程节点ID */
    pid?: any;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/flw/flow/instance/reject`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
    params,
  });
}

/**
 * 撤回
 * @param data 数据
 * @param params 参数
 */
export function rollbackUsingPUT(
  data: number[],
  params?: {
    /** 过程节点ID */
    pid?: any;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/flw/flow/instance/rollback`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
    params,
  });
}