import { request } from '@/utils';
import type { ChangePasswordVM, LoginByCaptchaVM, LoginByPasswordVM, PassportVM, RegisterVM, ResetPasswordVM, UpdatePassportVM } from '../interfaces';

/**
 * 注册用户
 * @param data 数据
 */
export function register(
  data: RegisterVM,
) {
  const url = `${__DEMO_SERVICE__}/api/passport/register`;
  return request<OptimizeModel<PassportVM>>({
    url,
    method: 'POST',
    data,
  });
}

/**
 * 重置密码
 * @param data 数据
 */
export function resetPassword(
  data: ResetPasswordVM,
) {
  const url = `${__DEMO_SERVICE__}/api/passport/reset-password`;
  return request<boolean>({
    url,
    method: 'PUT',
    data,
  });
}

/**
 * 密码登录
 * @param data 数据
 */
export function loginByPassword(
  data: LoginByPasswordVM,
) {
  const url = `${__DEMO_SERVICE__}/api/auth-service/login`;
  return request<string>({
    url,
    method: 'POST',
    data,
  });
}

/**
 * 验证码登录
 * @param data 数据
 */
export function loginByCaptcha(
  data: LoginByCaptchaVM,
) {
  const url = `${__DEMO_SERVICE__}/api/passport/login-by-captcha`;
  return request<string>({
    url,
    method: 'POST',
    data,
  });
}

/**
 * 微信登录
 * @param params 参数
 */
export function loginByWechat(
  params?: {
    /** code */
    code?: string;
    /** state */
    state?: string;
  },
) {
  const url = `${__DEMO_SERVICE__}/api/passport/login-by-wechat`;
  return request<string>({
    url,
    method: 'POST',
    params,
  });
}

/**
 * 获取验证码
 * @param params 参数
 */
export function getCaptcha(
  params?: {
    /** type */
    type?: string;
    /** mobileNumber */
    mobileNumber?: string;
  },
) {
  const url = `${__DEMO_SERVICE__}/api/passport/captcha`;
  return request<void>({
    url,
    params,
  });
}

/**
 * 获取通行证
 */
export function getPassport(
) {
  const url = `${__DEMO_SERVICE__}/api/passport`;
  return request<OptimizeModel<PassportVM>>({
    url,
    headers: {
      Authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 更新通行证
 * @param data 数据
 */
export function updatePassport(
  data: UpdatePassportVM,
) {
  const url = `${__DEMO_SERVICE__}/api/passport`;
  return request<OptimizeModel<PassportVM>>({
    url,
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 获取功能权限列表
 * @param params 参数
 */
export function getPermissions(
) {
  const url = `${__DEMO_SERVICE__}/api/passport/permissions`;
  return request<Record<string, boolean>>({
    url,
    headers: {
      Authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 修改密码
 * @param data 数据
 */
export function changePassword(
  data: ChangePasswordVM,
) {
  const url = `${__DEMO_SERVICE__}/api/passport/change-password`;
  return request<boolean>({
    url,
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 绑定手机号
 * @param params 参数
 */
export function bindMobileNumber(
  params: {
    /** 手机号 */
    mobileNumber: string;
    /** 验证码 */
    captcha: string;
  },
) {
  const url = `${__DEMO_SERVICE__}/api/passport/mp/bind-mobile-number`;
  return request<OptimizeModel<PassportVM>>({
    url,
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 绑定微信
 * @param params 参数
 */
export function bindWechat(
  params: {
    /** code */
    code: string;
  },
) {
  const url = `${__DEMO_SERVICE__}/api/passport/bind-wechat`;
  return request<OptimizeModel<PassportVM>>({
    url,
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 解除绑定微信
 */
export function unbindWechat(
) {
  const url = `${__DEMO_SERVICE__}/api/passport/unbind-wechat`;
  return request<OptimizeModel<PassportVM>>({
    url,
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}