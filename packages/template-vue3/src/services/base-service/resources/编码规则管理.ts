import { request } from '@/utils';
import type { CfgIdentifierRule, Result, Result«List«CfgIdentifierRule»», Result«PageInfo«编码规则列表及详细页»», Result«编码规则列表及详细页», Result«编码规则详细页初始加载内容» } from '../interfaces';

/**
 * 初始化编号规则到缓存
 * @param data 数据
 */
export function initCacheUsingPOST(
  data: number[],
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/cfg/identifier/initCache`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 编码规则新增保存
 * @param data 数据
 */
export function saveUsingPOST_1(
  data: CfgIdentifierRule,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/cfg/identifier/rule`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 禁用编码规则
 * @param params 参数
 */
export function activeDisableUsingPUT(
  params: {
    /** id */
    id: number;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/cfg/identifier/rule/activedisable`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 启用编码规则
 * @param params 参数
 */
export function activeEnableUsingPUT(
  params: {
    /** id */
    id: number;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/cfg/identifier/rule/activeenable`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 生成编号示例
 * @param params 参数
 */
export function getJobNoExampleUsingGET(
  params: {
    /** 当月:0;下月:1 */
    monthType?: string;
    /** 规则表达式 */
    ruleExpression: string;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/cfg/identifier/rule/jobnoexample`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 指定编码类型获取规则list
 * @param params 参数
 */
export function getListByTypeUsingGET(
  params?: {
    /** identifierType */
    identifierType?: number;
    /** officeId */
    officeId?: number;
  },
) {
  return request<OptimizeModel<Result«List«CfgIdentifierRule»»>>({
    url: `${__BASE_SERVICE__}/cfg/identifier/rule/list`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 根据分公司id查询列表
 * @param officeId officeId
 * @param params 参数
 */
export function listByOfficeUsingGET(
  officeId: number,
  params: {
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 排序 */
    sort?: string;
  },
) {
  return request<OptimizeModel<Result«PageInfo«编码规则列表及详细页»»>>({
    url: `${__BASE_SERVICE__}/cfg/identifier/rule/list/${officeId}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 详细页面加载初始
 */
export function pageInitUsingGET(
) {
  return request<OptimizeModel<Result«编码规则详细页初始加载内容»>>({
    url: `${__BASE_SERVICE__}/cfg/identifier/rule/pageinit`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 查询详情
 * @param id ID
 */
export function detailUsingGET(
  id: number,
) {
  return request<OptimizeModel<Result«编码规则列表及详细页»>>({
    url: `${__BASE_SERVICE__}/cfg/identifier/rule/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 编码规则修改保存
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_1(
  id: number,
  data: CfgIdentifierRule,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/cfg/identifier/rule/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 编码规则删除
 * @param id id
 */
export function deleteUsingDELETE_1(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/cfg/identifier/rule/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 同步缓存到数据库
 * @param data 数据
 */
export function sycnCache2DBUsingPOST(
  data: number[],
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/cfg/identifier/syncCache/db`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}