import { request } from '@/utils';
import type { auth用户VO, Result, Result«auth用户VO», Result«long», Result«string» } from '../interfaces';

/**
 * RequestParameters测试
 * @param params 参数
 */
export function getResultUsingGET(
  params?: {
    /** appId */
    appId?: number;
    /** 中文名称 */
    chineseName?: string;
    /** 邮件 */
    email?: string;
    /** 英文名称 */
    englishName?: string;
    /** 主键ID */
    id?: number;
    /** 会员id */
    memberId?: number;
    /** 会员名称 */
    memberName?: string;
    /** 手机 */
    mobile?: string;
    /** 状态 */
    status?: number;
    /** 租户ID */
    tenantId?: number;
    /** 用户名 */
    username?: string;
    /** userType */
    userType?: number;
  },
) {
  return request<OptimizeModel<Result«auth用户VO»>>({
    url: `${__BASE_SERVICE__}/auth/user/test`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 服务相互调用
 * @param data 数据
 */
export function putResultUsingPUT(
  data: auth用户VO,
) {
  return request<OptimizeModel<Result«auth用户VO»>>({
    url: `${__BASE_SERVICE__}/auth/user/test`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * RequestBody测试
 * @param data 数据
 */
export function postResultUsingPOST(
  data: auth用户VO,
) {
  return request<OptimizeModel<Result«auth用户VO»>>({
    url: `${__BASE_SERVICE__}/auth/user/test`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 测试文件上传
 * @param data 数据
 */
export function uploadFileTestUsingPOST(
  data: Blob,
) {
  return request<OptimizeModel<Result«string»>>({
    url: `${__BASE_SERVICE__}/auth/user/test/file`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: 'multipart/form-data',
    },
    data,
  });
}

/**
 * RequestBody忽略功能测试
 * @param data 数据
 */
export function ignoreResultUsingPOST(
  data: auth用户VO,
) {
  return request<OptimizeModel<Result«auth用户VO»>>({
    url: `${__BASE_SERVICE__}/auth/user/test/ignore`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 测试负载均衡
 * @param params 参数
 */
export function loadBalanceTestUsingGET(
  params?: {
    /** waitTime */
    waitTime?: number;
  },
) {
  return request<OptimizeModel<Result«long»>>({
    url: `${__BASE_SERVICE__}/auth/user/test/loadBalanceTest`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 获取status
 * @param params 参数
 */
export function getHttpStatusUsingGET(
  params?: {
    /** code */
    code?: string;
    /** status */
    status?: number;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/auth/user/test/open/http/status`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 测试文件上传
 * @param data 数据
 */
export function testYunLspUsingPOST(
  data: auth用户VO,
) {
  return request<OptimizeModel<Result«string»>>({
    url: `${__BASE_SERVICE__}/auth/user/test/open/yunlsp/fallback`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * PathVariable测试
 * @param id id
 */
export function deleteResultUsingDELETE(
  id: number,
) {
  return request<OptimizeModel<Result«long»>>({
    url: `${__BASE_SERVICE__}/auth/user/test/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}