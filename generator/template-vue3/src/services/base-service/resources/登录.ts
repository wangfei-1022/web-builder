import { request } from '@/utils';
import type { AuthUserLoginRequest, Result«boolean», Result«int», Result«string», 微信openId登录token, 微信登录并绑定openId, 运营用户授权登录会员, 验证码登录 } from '../interfaces';

/**
 * 获取腾讯微搭授权码
 */
export function getLowCodeWedaAuthCodeUsingGET(
) {
  return request<OptimizeModel<Result«string»>>({
    url: `${__BASE_SERVICE__}/auth/lowcode/weda/auth/code`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 权限登录_授权登录会员
 * @param data 数据
 */
export function authorizerLoginUsingPOST(
  data: 运营用户授权登录会员,
) {
  return request<OptimizeModel<Result«string»>>({
    url: `${__BASE_SERVICE__}/auth/member/authorizer/token`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 登录接口
 * @param data 数据
 */
export function loginUsingPOST(
  data: AuthUserLoginRequest,
) {
  return request<OptimizeModel<Result«string»>>({
    url: `${__BASE_SERVICE__}/login`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 登录接口:验证码登录
 * @param data 数据
 */
export function loginByCodeUsingPOST(
  data: 验证码登录,
) {
  return request<OptimizeModel<Result«string»>>({
    url: `${__BASE_SERVICE__}/login/code`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 登出
 */
export function logoutUsingPOST(
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/logout`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 生成新的token-仅feign使用
 * @param userId userId
 */
export function createNewTokenUsingGET(
  userId: number,
) {
  return request<OptimizeModel<Result«string»>>({
    url: `${__BASE_SERVICE__}/only_feign/user/${userId}/token`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 权限登录_授权登录会员
 */
export function authorizerLoginUsingGET(
) {
  return request<OptimizeModel<Result«string»>>({
    url: `${__BASE_SERVICE__}/timeout/timeout`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 根据已有的token刷新token 的信息 memberName
 */
export function refreshTokenMemberNameUsingGET(
) {
  return request<OptimizeModel<Result«string»>>({
    url: `${__BASE_SERVICE__}/token/refresh/memberName`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 微信登录并绑定openId(注意一个用户只能绑定一个微信,默认后面的覆盖前面的)
 * @param data 数据
 */
export function wxLoginAndBUsingPOST(
  data: AuthUserLoginRequest,
) {
  return request<OptimizeModel<Result«string»>>({
    url: `${__BASE_SERVICE__}/wx/login`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 微信openId登录token
 * @param data 数据
 */
export function wxOpenIdloginUsingPOST(
  data: 微信openId登录token,
) {
  return request<OptimizeModel<Result«string»>>({
    url: `${__BASE_SERVICE__}/wx/openId/login`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 微信登录并绑定openId
 * @param data 数据
 */
export function wxOpenIdUnbindUsingPOST(
  data: 微信登录并绑定openId,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/wx/openId/unbind`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}