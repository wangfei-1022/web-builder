import { request } from '@/utils';
import type { Result«List«本地企业库下拉»», Result«本地企业库详情» } from '../interfaces';

/**
 * 企业库_详情（所有平台）
 * @param chineseName chineseName
 * @param country country
 */
export function getDetailByChineseNameFromAllPlatformUsingGET(
  chineseName: string,
  country: string,
) {
  return request<OptimizeModel<Result«本地企业库详情»>>({
    url: `${__BASE_SERVICE__}/dmn/enterprise/all/platform/country/${country}/chineseName/${chineseName}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 本地企业库_详情（chineseName）
 * @param chineseName chineseName
 */
export function getDetailByChineseNameUsingGET_1(
  chineseName: string,
) {
  return request<OptimizeModel<Result«本地企业库详情»>>({
    url: `${__BASE_SERVICE__}/dmn/enterprise/chineseName/${chineseName}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 本地企业库_详情（chineseName）
 * @param chineseName chineseName
 * @param country country
 */
export function getDetailByChineseNameUsingGET(
  chineseName: string,
  country: string,
) {
  return request<OptimizeModel<Result«本地企业库详情»>>({
    url: `${__BASE_SERVICE__}/dmn/enterprise/country/${country}/chineseName/${chineseName}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 本地企业库_下拉列表
 * @param params 参数
 */
export function getSelectListUsingGET(
  params: {
    /** keyword */
    keyword: string;
  },
) {
  return request<OptimizeModel<Result«List«本地企业库下拉»»>>({
    url: `${__BASE_SERVICE__}/dmn/enterprise/list/select`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 本地企业库_详情（id）
 * @param id id
 */
export function getDetailUsingGET(
  id: number,
) {
  return request<OptimizeModel<Result«本地企业库详情»>>({
    url: `${__BASE_SERVICE__}/dmn/enterprise/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}