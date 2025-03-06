import { request } from '@/utils';
import type { dmnLogisticsCompanyDTO, Result«dmnLogisticsCompanyDTO», Result«int», Result«List«dmnLogisticsCompanyDTO»», Result«List«物流公司下拉数据DTO»», Result«PageInfo«dmnLogisticsCompanyDTO»» } from '../interfaces';

/**
 * 保存
 * @param data 数据
 */
export function insertUsingPOST_8(
  data: dmnLogisticsCompanyDTO,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/dmn/logistics/company`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 根据条件查询所有列表
 * @param params 参数
 */
export function getListUsingGET(
  params: {
    /** 中文全称;如太平洋船务有限公司 */
    chineseName?: string;
    /** 国家代码 */
    countryCode?: string;
    /** 创建时间结束 */
    createTimeEnd?: number;
    /** 创建时间开始 */
    createTimeStart?: number;
    /** 英文全称;如PacificInternationalLines; */
    englishName?: string;
    /** 主键 */
    id?: number;
    /** 主键列表 */
    ids?: number | number[];
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** SCAC代码 */
    scacCode?: string;
    /** 公司简称;如PIL */
    shortname?: string;
    /** 排序 */
    sort?: string;
    /** 轨迹查询代码 */
    trackCode?: string;
    /** 轨迹查询地址 */
    trackUrl?: string;
    /** 运输方式：1.快递express2.卡车truck3.铁路railway4.拖车container_truck，多个以逗号隔开; */
    transportMode?: number;
  },
) {
  return request<OptimizeModel<Result«List«dmnLogisticsCompanyDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/logistics/company/allList`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 查询详情
 * @param code code
 */
export function getByCodeUsingGET_3(
  code: string,
) {
  return request<OptimizeModel<Result«dmnLogisticsCompanyDTO»>>({
    url: `${__BASE_SERVICE__}/dmn/logistics/company/detail/code/${code}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 查询详情
 * @param id id
 */
export function getByIdUsingGET_11(
  id: number,
) {
  return request<OptimizeModel<Result«dmnLogisticsCompanyDTO»>>({
    url: `${__BASE_SERVICE__}/dmn/logistics/company/detail/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 查询列表
 * @param params 参数
 */
export function queryUsingGET_22(
  params: {
    /** 中文全称;如太平洋船务有限公司 */
    chineseName?: string;
    /** 国家代码 */
    countryCode?: string;
    /** 创建时间结束 */
    createTimeEnd?: number;
    /** 创建时间开始 */
    createTimeStart?: number;
    /** 英文全称;如PacificInternationalLines; */
    englishName?: string;
    /** 主键 */
    id?: number;
    /** 主键列表 */
    ids?: number | number[];
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** SCAC代码 */
    scacCode?: string;
    /** 公司简称;如PIL */
    shortname?: string;
    /** 排序 */
    sort?: string;
    /** 轨迹查询代码 */
    trackCode?: string;
    /** 轨迹查询地址 */
    trackUrl?: string;
    /** 运输方式：1.快递express2.卡车truck3.铁路railway4.拖车container_truck，多个以逗号隔开; */
    transportMode?: number;
  },
) {
  return request<OptimizeModel<Result«PageInfo«dmnLogisticsCompanyDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/logistics/company/list`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 根据运输方式查询
 * @param params 参数
 */
export function queryByTransportModeUsingGET(
  params?: {
    /** transportMode */
    transportMode?: string;
  },
) {
  return request<OptimizeModel<Result«List«dmnLogisticsCompanyDTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/logistics/company/list/byTransportMode`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 物流公司管理_获取物流公司下拉列表
 * @param params 参数
 */
export function selectionsUsingGET(
  params?: {
    /** keyword */
    keyword?: string;
  },
) {
  return request<OptimizeModel<Result«List«物流公司下拉数据DTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/logistics/company/selections`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 物流公司管理_获取物流公司下拉列表
 * @param params 参数
 */
export function selectionsSearchUsingGET(
  params?: {
    /** keyword */
    keyword?: string;
  },
) {
  return request<OptimizeModel<Result«List«物流公司下拉数据DTO»»>>({
    url: `${__BASE_SERVICE__}/dmn/logistics/company/selections/search`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 更新
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_19(
  id: number,
  data: dmnLogisticsCompanyDTO,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/dmn/logistics/company/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}