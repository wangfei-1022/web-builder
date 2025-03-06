import { request } from '@/utils';
import type { Result, Result«List«PnrAddressInfo»», Result«List«PnrPartnerDTO»», Result«Map«long,业务模块客户属性信息»», Result«PageInfo«客商资料详细页信息»», Result«PnrCustomerPositionUserVO», Result«PnrPartnerDTO», Result«业务模块客户属性信息», Result«客商资料详细页信息», 客商资料列表查询条件, 客商资料合并入参, 客商资料详细页信息Req } from '../interfaces';

/**
 * 业务入口获取门点地址
 * @param params 参数
 */
export function getAddressListUsingGET(
  params?: {
    /** customerIds */
    customerIds?: string | string[];
  },
) {
  return request<OptimizeModel<Result«List«PnrAddressInfo»»>>({
    url: `${__BASE_SERVICE__}/pnr/customer/address/list`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 业务入口获取联系人&地址信息
 * @param customerId customerId
 */
export function getContactAddressUsingGET(
  customerId: number,
) {
  return request<OptimizeModel<Result«客商资料详细页信息»>>({
    url: `${__BASE_SERVICE__}/pnr/customer/infolist/${customerId}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 业务入口获取默认销售&客服
 * @param customerId customerId
 * @param params 参数
 */
export function getDefaultSaleUsingGET(
  customerId: number,
  params?: {
    /** 业务类型 */
    jobType?: number;
  },
) {
  return request<OptimizeModel<Result«PnrCustomerPositionUserVO»>>({
    url: `${__BASE_SERVICE__}/pnr/customer/position/default/${customerId}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 客商资料查询列表-快捷查询
 * @param params 参数
 */
export function queryUsingGET_45(
  params: {
    /** keyword */
    keyword?: string;
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 排序 */
    sort?: string;
  },
) {
  return request<OptimizeModel<Result«PageInfo«客商资料详细页信息»»>>({
    url: `${__BASE_SERVICE__}/pnr/partner`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 客商资料新增
 */
export function createUsingPOST(
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/partner`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 取消审核客商资料
 * @param id id
 */
export function acceptPnrPartnerCancelUsingPUT(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/partner/accept/cancel/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 审核客商资料
 * @param id id
 */
export function acceptPnrPartnerUsingPUT(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/partner/accept/success/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 禁用客商资料
 * @param id id
 */
export function activeDisableUsingPUT_11(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/partner/activedisable/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 启用客商资料
 * @param id id
 */
export function activeEnableUsingPUT_12(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/partner/activeenable/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 客商资料查询列表-高级查询
 * @param data 数据
 */
export function advancedQueryUsingPOST(
  data: 客商资料列表查询条件,
) {
  return request<OptimizeModel<Result«PageInfo«客商资料详细页信息»»>>({
    url: `${__BASE_SERVICE__}/pnr/partner/advanced`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 客商资料查询详情-高级查询
 * @param id id
 */
export function advancedQueryByIdUsingGET(
  id: number,
) {
  return request<OptimizeModel<Result«PnrPartnerDTO»>>({
    url: `${__BASE_SERVICE__}/pnr/partner/advanced/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 客商基本信息列表
 * @param params 参数
 */
export function getBaseInfoMapUsingGET(
  params: {
    /** ids */
    ids: number | number[];
  },
) {
  return request<OptimizeModel<Result«Map«long,业务模块客户属性信息»»>>({
    url: `${__BASE_SERVICE__}/pnr/partner/base/info/map`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 业务入口获取客户属性&结算方式
 * @param customerId 客户id
 * @param params 参数
 */
export function getCustomerInfoUsingGET(
  customerId: number,
  params?: {
    /** 业务类型 */
    jobType?: number;
    /** 业务分公司 */
    officeId?: any;
  },
) {
  return request<OptimizeModel<Result«业务模块客户属性信息»>>({
    url: `${__BASE_SERVICE__}/pnr/partner/customer/${customerId}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 客商资料查询列表
 * @param params 参数
 */
export function queryListUsingGET_1(
  params?: {
    /** ids */
    ids?: number | number[];
    /** mnemonics */
    mnemonics?: string | string[];
  },
) {
  return request<OptimizeModel<Result«List«PnrPartnerDTO»»>>({
    url: `${__BASE_SERVICE__}/pnr/partner/list`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 客商合并
 * @param data 数据
 */
export function mergePartnerUsingPOST(
  data: 客商资料合并入参,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/partner/merge`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 业务入口获取客户属性&结算方式
 * @param customerId 客户id
 * @param params 参数
 */
export function getCustomerPropertyUsingGET(
  customerId: number,
  params?: {
    /** 业务类型 */
    jobType?: number;
    /** 业务分公司 */
    officeId?: number;
  },
) {
  return request<OptimizeModel<Result«业务模块客户属性信息»>>({
    url: `${__BASE_SERVICE__}/pnr/partner/property/${customerId}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 取消提交客商资料
 * @param id id
 */
export function submitPnrPartnerCancelUsingPUT(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/partner/submit/cancel/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 提交客商资料
 * @param id id
 */
export function submitPnrPartnerUsingPUT(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/partner/submit/success/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 客商资料查询详情
 * @param id ID
 */
export function detailUsingGET_16(
  id: number,
) {
  return request<OptimizeModel<Result«客商资料详细页信息»>>({
    url: `${__BASE_SERVICE__}/pnr/partner/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 客商资料修改保存
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_38(
  id: number,
  data: 客商资料详细页信息Req,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/partner/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 客商资料删除
 * @param id id
 */
export function deleteUsingDELETE_40(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/pnr/partner/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}