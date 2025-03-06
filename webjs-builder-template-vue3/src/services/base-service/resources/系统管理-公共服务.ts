import { request } from '@/utils';
import type { Result«List«PnrContactDTO»», Result«List«PnrPartnerRelevantVO»», Result«List«SysUserDropdownDTO»», Result«List«下拉框value值对应为short类型»», Result«report业务所属公司数据源» } from '../interfaces';

/**
 * 货物类型下拉框List
 */
export function getCargTypeListUsingGET(
) {
  return request<OptimizeModel<Result«List«下拉框value值对应为short类型»»>>({
    url: `${__BASE_SERVICE__}/sys/common/cargotypelist`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 整拼类型下拉框List
 */
export function getFclLclListUsingGET(
) {
  return request<OptimizeModel<Result«List«下拉框value值对应为short类型»»>>({
    url: `${__BASE_SERVICE__}/sys/common/fcllcllist`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 业务类型下拉框List
 */
export function getJobTypeListUsingGET_1(
) {
  return request<OptimizeModel<Result«List«下拉框value值对应为short类型»»>>({
    url: `${__BASE_SERVICE__}/sys/common/jobtypelist`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 客商资料下拉框List
 * @param params 参数
 */
export function getPnrpartnerListUsingGET(
  params: {
    /** 客商简称 */
    abbreviation?: string;
    /** 关键字 */
    keyword?: string;
    /** 客商助记码 */
    mnemonic?: string;
    /** 所属分公司 */
    officeId?: number;
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 客户类型 客户,船公司 ... */
    range?: string | string[];
    /** 客户类型拼接条件sql */
    rangeCondition?: string;
    /** 排序 */
    sort?: string;
    /** 租户id */
    tenantId?: number;
  },
) {
  return request<OptimizeModel<Result«List«PnrPartnerRelevantVO»»>>({
    url: `${__BASE_SERVICE__}/sys/common/pnrpartnerlist`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 客商资料_联系人
 * @param partnerId partnerId
 */
export function queryPnrPartnerContactUsingGET(
  partnerId: number,
) {
  return request<OptimizeModel<Result«List«PnrContactDTO»»>>({
    url: `${__BASE_SERVICE__}/sys/common/pnrpartnerlist/contact/${partnerId}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 客商资料-岗位类型下拉框List
 */
export function positionTypeListUsingGET(
) {
  return request<OptimizeModel<Result«List«下拉框value值对应为short类型»»>>({
    url: `${__BASE_SERVICE__}/sys/common/positiontypelist`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * report业务所属公司打印数据源(未使用 oms,act里直接db获取)
 * @param params 参数
 */
export function getReportOfficeUsingGET(
  params?: {
    /** officeId */
    officeId?: number;
  },
) {
  return request<OptimizeModel<Result«report业务所属公司数据源»>>({
    url: `${__BASE_SERVICE__}/sys/common/report/office`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 用户下拉框List
 * @param params 参数
 */
export function getUserListUsingGET(
  params?: {
    /** 中文名 */
    chineseName?: string;
    /** 当前登录用户officeId */
    currentOfficeId?: number;
    /** 所属部门Id */
    departmentId?: number;
    /** 手机号 */
    email?: string;
    /** 英文名 */
    englishName?: string;
    /** 关键字 */
    keyword?: string;
    /** 所属分公司Id */
    officeId?: number;
    /** 用户类型用户属性 销售,客服 ... */
    range?: string | string[];
    /** 租户Id */
    tenantId?: number;
    /** 用户名 */
    userName?: string;
  },
) {
  return request<OptimizeModel<Result«List«SysUserDropdownDTO»»>>({
    url: `${__BASE_SERVICE__}/sys/common/sysuserlist`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}