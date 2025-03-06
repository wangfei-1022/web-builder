import { request } from '@/utils';
import type { CfgGridSchemeCmd, CfgGridSchemeUpdateCmd, Result«boolean», Result«cfgGridSchemeDTO», Result«List«cfgGridSchemeDTO»», Result«long» } from '../interfaces';

/**
 * 表格方案_更新
 * @param data 数据
 */
export function updateUsingPUT(
  data: CfgGridSchemeUpdateCmd,
) {
  return request<OptimizeModel<Result«long»>>({
    url: `${__BASE_SERVICE__}/cfg/grid/scheme`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 表格方案_保存
 * @param data 数据
 */
export function saveUsingPOST(
  data: CfgGridSchemeCmd,
) {
  return request<OptimizeModel<Result«long»>>({
    url: `${__BASE_SERVICE__}/cfg/grid/scheme`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 表格方案_查询详情
 * @param id id
 */
export function getByIdUsingGET_1(
  id: number,
) {
  return request<OptimizeModel<Result«cfgGridSchemeDTO»>>({
    url: `${__BASE_SERVICE__}/cfg/grid/scheme/detail/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 表格方案_查询用户下拉方案
 * @param moduleCode moduleCode
 */
export function selectsUsingGET(
  moduleCode: string,
) {
  return request<OptimizeModel<Result«List«cfgGridSchemeDTO»»>>({
    url: `${__BASE_SERVICE__}/cfg/grid/scheme/user/${moduleCode}/selects`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 表格方案_删除
 * @param id id
 */
export function deleteUsingDELETE(
  id: number,
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/cfg/grid/scheme/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 表格方案_标记默认方案
 * @param schemeId schemeId
 */
export function markDefaultUsingPUT(
  schemeId: number,
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/cfg/grid/scheme/${schemeId}/default`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 表格方案_更新方案名称
 * @param schemeId schemeId
 * @param params 参数
 */
export function updateSchemeNameUsingPUT(
  schemeId: number,
  params: {
    /** schemeName */
    schemeName: string;
  },
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/cfg/grid/scheme/${schemeId}/name`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}