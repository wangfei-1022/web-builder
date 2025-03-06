/** 注册VM */
export type RegisterVM = {
  /** 手机号 */
  mobileNumber: string;
  /** 验证码 */
  captcha: string;
  /** 用户名 */
  name: string;
  /** 密码 */
  password: string;
};

/** 重置密码VM */
export type ResetPasswordVM = {
  /** 手机号 */
  mobileNumber: string;
  /** 验证码 */
  captcha: string;
  /** 新密码 */
  newPassword: string;
};

/** 密码登录VM */
export type LoginByPasswordVM = {
  /** 登录名 */
  login: string;
  /** 密码 */
  password: string;
  /** 记住我 */
  rememberMe: boolean | null;
};

/** 验证码登录VM */
export type LoginByCaptchaVM = {
  /** 手机号 */
  mobileNumber: string | null;
  /** 验证码 */
  captcha: string;
  /** 记住我 */
  rememberMe: boolean | null;
};

/** 通行证VM */
export type PassportVM = {
  /** id */
  id: number | null;
  /** 账号 */
  account: string;
  /** 密码强度 */
  passwordStrength: string | null;
  /** 姓名 */
  name: string;
  /** 头像地址 */
  avatarUrl: string | null;
  /** 手机号 */
  mobileNumber: string | null;
  /** 邮箱 */
  email: string | null;
  /** 用户类型 */
  type: string | null;
  /** 公司名称 */
  companyName: string | null;
  /** 最后登录时间 */
  lastLoginTime: string | null;
  /** openId */
  openId: string | null;
};

/** 更新通行证VM */
export type UpdatePassportVM = {
  /** 用户名 */
  name: string | null;
  /** 邮箱 */
  email: string | null;
};

/** 修改密码VM */
export type ChangePasswordVM = {
  /** 当前密码 */
  currentPassword: string;
  /** 新密码 */
  newPassword: string;
};
