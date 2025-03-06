import { request } from '@/utils';
import type { PerUiConfig, Result, Result«List«PerUiConfig»», Result«PageInfo«PerUiConfig»», Result«PerUiConfig» } from '../interfaces';

/**
 * 查询个人配置列表
 * @param params 参数
 */
export function queryUsingGET_35(
  params: {
    /** BDefault */
    BDefault?: boolean;
    /** 配置人 */
    configBy?: number;
    /** 配置内容;存为jason格式 */
    configContent?: string;
    /** 配置模块;1海出列表2海出详情; */
    configModule?: number;
    /** 配置方案名称(默认为空) */
    configName?: string;
    /** 配置类型;1列表,2全景视图; */
    configType?: number;
    /** 创建人 */
    createBy?: number;
    /** 创建人名 */
    createByName?: string;
    /** 创建时间 */
    createTime?: number;
    /** 主键id */
    id?: number;
    /** 数据操作url */
    optUrl?: string;
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 备注 */
    remark?: string;
    /** 排序 */
    sort?: string;
    /** 租户ID */
    tenantId?: number;
    /** 更新人 */
    updateBy?: number;
    /** 更新人名 */
    updateByName?: string;
    /** 更新时间 */
    updateTime?: number;
  },
) {
  return request<OptimizeModel<Result«PageInfo«PerUiConfig»»>>({
    url: `${__BASE_SERVICE__}/per/config`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 新增个人配置
 * @param data 数据
 */
export function saveUsingPOST_21(
  data: PerUiConfig,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/per/config`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 查询全局配置
 * @param params 参数
 */
export function getGlobalUsingGET(
  params: {
    /** BDefault */
    BDefault?: boolean;
    /** 配置人 */
    configBy?: number;
    /** 配置内容;存为jason格式 */
    configContent?: string;
    /** 模块 */
    configModule: number;
    /** 配置方案名称(默认为空) */
    configName?: string;
    /** 类型 */
    configType: number;
    /** 创建人 */
    createBy?: number;
    /** 创建人名 */
    createByName?: string;
    /** 创建时间 */
    createTime?: number;
    /** 主键id */
    id?: number;
    /** 数据操作url */
    optUrl?: string;
    /** 备注 */
    remark?: string;
    /** 租户ID */
    tenantId?: number;
    /** 更新人 */
    updateBy?: number;
    /** 更新人名 */
    updateByName?: string;
    /** 更新时间 */
    updateTime?: number;
  },
) {
  return request<OptimizeModel<Result«PerUiConfig»>>({
    url: `${__BASE_SERVICE__}/per/config/global`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 分享配置方案
 * @param data 数据
 */
export function shareUsingPOST(
  data: PerUiConfig,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/per/config/share`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 查询通用报表配置
 */
export function queryStaSchemaTreeUsingGET(
) {
  return request<OptimizeModel<Result«List«PerUiConfig»»>>({
    url: `${__BASE_SERVICE__}/per/config/sta`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 修改个人配置
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_29(
  id: number,
  data: PerUiConfig,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/per/config/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 删除个人配置
 * @param id id
 */
export function deleteUsingDELETE_31(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/per/config/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}