import { request } from '@/utils';
import type { Result, Result«List«CfgParameterItem»», Result«PageInfo«CfgParameterConfigListVO»», Result«PageInfo«CfgParameterConfig»», 参数配置保存入参, 参数配置复制入参, 获取参数配置入参 } from '../interfaces';

/**
 * 参数配置查询列表
 * @param params 参数
 */
export function queryUsingGET(
  params: {
    /** 分公司id */
    officeId: number;
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 名称 */
    parameterName?: string;
    /** 参数类型 */
    parameterType?: number;
    /** 排序 */
    sort?: string;
    /** 租户id */
    tenantId?: number;
  },
) {
  return request<OptimizeModel<Result«PageInfo«CfgParameterConfigListVO»»>>({
    url: `${__BASE_SERVICE__}/cfg/parameter/config`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 参数配置保存
 * @param data 数据
 */
export function saveUsingPOST_3(
  data: 参数配置保存入参,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/cfg/parameter/config`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 参数配置复制
 * @param data 数据
 */
export function configCopyUsingPOST(
  data: 参数配置复制入参,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/cfg/parameter/config/copy`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 参数配置恢复默认
 * @param officeId officeId
 */
export function configResetUsingPUT(
  officeId: number,
) {
  return request<OptimizeModel<Result«PageInfo«CfgParameterConfig»»>>({
    url: `${__BASE_SERVICE__}/cfg/parameter/config/reset/${officeId}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 根据参数code获取配置值
 * @param data 数据
 */
export function getConfigValueUsingPOST(
  data: 获取参数配置入参,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/cfg/parameter/config/value`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 根据parameterCode 获取选项值
 * @param parameterCode parameterCode
 */
export function getParameterItemUsingGET(
  parameterCode: string,
) {
  return request<OptimizeModel<Result«List«CfgParameterItem»»>>({
    url: `${__BASE_SERVICE__}/cfg/parameter/item/${parameterCode}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}