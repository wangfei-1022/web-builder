import { request } from '@/utils';
import type { Result«List«第三方企业库下拉»», Result«第三方企业库详情» } from '../interfaces';

/**
 * 第三方企业库_通过ChineseName获取详情
 * @param chineseName chineseName
 */
export function getDetailByChineseNameUsingGET_2(
  chineseName: string,
) {
  return request<OptimizeModel<Result«第三方企业库详情»>>({
    url: `${__BASE_SERVICE__}/dmn/third/party/enterprise/chineseName/${chineseName}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 第三方企业库_下拉列表
 * @param params 参数
 */
export function getSelectListUsingGET_1(
  params: {
    /** keyword */
    keyword: string;
  },
) {
  return request<OptimizeModel<Result«List«第三方企业库下拉»»>>({
    url: `${__BASE_SERVICE__}/dmn/third/party/enterprise/list/select`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 第三方企业库_通过主键获取详情
 * @param id id
 */
export function getDetailByIdUsingGET(
  id: number,
) {
  return request<OptimizeModel<Result«第三方企业库详情»>>({
    url: `${__BASE_SERVICE__}/dmn/third/party/enterprise/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}