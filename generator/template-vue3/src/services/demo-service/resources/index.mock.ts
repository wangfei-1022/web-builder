import { defineMockAPI } from '@cloudplex/cortex';
import { Buffer } from 'buffer';
import { mock, Random } from 'mockjs';

export default defineMockAPI({

  /** 注册用户 */
  'POST /api/passport/register':
    function register({ body }) {
      const account = body?.login;
      const { passport } = generatePassport(account);
      return {
        body: passport,
      };
    },

  /** 重置密码 */
  'PUT /api/passport/reset-password':
    function resetPassword() {
      return {
        body: true,
      };
    },

  /** 密码登录 */
  'POST /api/passport/login-by-password':
    function loginByPassword({ body }) {
      const account = body?.login;
      const { token } = generatePassport(account);
      return {
        body: token,
      };
    },

  /** 验证码登录 */
  'POST /api/passport/login-by-captcha':
    function loginByCaptcha({ body }) {
      const account = body?.mobileNumber;
      const { token } = generatePassport(account);
      return {
        body: token,
      };
    },

  /** 微信登录 */
  'POST /api/passport/login-by-wechat':
    function loginByWechat({ query }) {
      const account = Array.isArray(query.code) ? query.code[0] : query.code;
      const { token } = generatePassport(account);
      return {
        body: token,
      };
    },

  /** 获取验证码 */
  'GET /api/passport/captcha':
    function getCaptcha() {
      return {
        body: null,
      };
    },

  /** 获取通行证 */
  'GET /api/passport':
    function getPassport({ headers }) {
      try {
        const passport = verifyAuthorization(headers);
        return {
          body: passport,
        };
      } catch (error) {
        return error as any;
      }
    },

  /** 更新通行证 */
  'PUT /api/passport':
    function updatePassport({ headers, body }) {
      try {
        const passport = verifyAuthorization(headers);
        Object.keys(passport)
          .filter(key => body?.[key] !== undefined)
          .forEach(key => {
            passport[key] = body[key];
          });
        return {
          body: passport,
        };
      } catch (error) {
        return error as any;
      }
    },

  /** 获取功能权限 */
  'GET /api/passport/permissions':
    function getPermissions({ headers }) {
      try {
        verifyAuthorization(headers);
        const accesses = mock({
          'TestComponent_EntityUpdate|1': true,
          'TestComponent_EntityDelete|1': true,
          'TestComponent_BusinessFunction1|1': true,
          'TestComponent_BusinessFunction2|1': true,
          'TestComponent_BusinessFunction3|1': true,
        });
        return {
          body: accesses,
        };
      } catch (error) {
        return error as any;
      }
    },

  /** 修改密码 */
  'PUT /api/passport/change-password':
    function changePassword({ headers }) {
      try {
        verifyAuthorization(headers);
        return {
          body: true,
        };
      } catch (error) {
        return error as any;
      }
    },

  /** 绑定手机号 */
  'PUT /api/passport/mp/bind-mobile-number':
    function bindMobileNumber({ headers, body }) {
      try {
        const passport = verifyAuthorization(headers);
        Object.keys(passport)
          .filter(key => body?.[key] !== undefined)
          .forEach(key => {
            passport[key] = body[key];
          });
        return {
          body: passport,
        };
      } catch (error) {
        return error as any;
      }
    },

  /** 绑定微信 */
  'PUT /api/passport/bind-wechat':
    function bindWechat({ headers }) {
      try {
        const passport = verifyAuthorization(headers);
        passport.openId = mock(/\d{28}/);
        return {
          body: passport,
        };
      } catch (error) {
        return error as any;
      }
    },

  /** 解除绑定微信 */
  'PUT /api/passport/unbind-wechat':
    function unbindWechat({ headers }) {
      try {
        const passport = verifyAuthorization(headers);
        passport.openId = null;
        return {
          body: passport,
        };
      } catch (error) {
        return error as any;
      }
    },

});

/** 全局对象 */
const _global = global as any;
/** 通行证引用列表 */
const passportRefs = _global.passportRefs = _global.passportRefs ?? {};
/** 失效范围 */
const expiredRange = 1000 * 60 * 30;

/**
 * 生成通行证
 * @param account 账号
 */
function generatePassport(account: string) {
  // 生成通行证
  const passport = mock({
    id: Random.natural(1, 999),
    account,
    name: '@cname',
    'passwordStrength|1': ['低', '中', '高'],
    avatarUrl() {
      return Random.image('128x128', '#50B347', '#FFFFFF', this.name.slice(0, 1));
    },
    mobileNumber() {
      return Random.boolean() ? mock(/1\d{10}/) : null;
    },
    email: '@email',
    companyName() {
      return Random.boolean() ? `${Random.ctitle()}有限公司` : null;
    },
    type() {
      return this.companyName ? '企业用户' : '个人用户';
    },
    lastLoginTime: new Date().toISOString(),
    openId() {
      return this.account === 'wechat' ? mock(/\d{28}/) : null;
    },
  });
  // 更新通行证引用
  passportRefs[passport.id] = {
    origin: passport,
    extra: {
      expiredTime: Date.now() + expiredRange,
    },
  };
  // 生成令牌
  const token = Buffer.from(passport.id.toString()).toString('base64');
  // 返回通行证和令牌
  return { passport, token };
}

/**
 * 验证授权
 * @param headers 头部
 */
function verifyAuthorization(headers: Record<string, string | string[]>) {
  try {
    const authorization = headers.authorization as string;
    // 验证令牌
    const token = authorization?.replace(/^Bearer /, '');
    if (!token) throw '无效请求';
    // 验证通行证
    const passportId = JSON.parse(Buffer.from(token, 'base64').toString());
    const passportRef = passportRefs[passportId];
    if (!passportRef) throw '用户不存在';
    // 验证登录超时
    const passportExtra = passportRef.extra;
    if (Date.now() > passportExtra.expiredTime) throw '登录超时';
    // 续期通行证
    passportExtra.expiredTime += expiredRange;
    // 返回通行证
    const passport = passportRef.origin;
    return passport;
  } catch (error) {
    // 抛出错误
    throw {
      statusCode: 401,
      body: typeof error === 'string' ? error : '无效令牌',
    };
  }
}