/** ***************************物流公司相关接口************************ */
import request from '@/utils/request'
const URL = {
  getCompany: '/api/mdm-service/dmn/logistics/company',
  getProduct: '/api/trans-service/omc/lnt/product',
  getAreaScheme: '/api/trans-service/omc/lnt/area/scheme',
  getChannel: '/api/trans-service/omc/lnt/channel'
}
/**
 * 获取物流公司列表
 * @param {} params
 * @returns
 */
export function getCompanyListApi(params) {
  return request({
    url: `${URL.getCompany}/list`,
    method: 'get',
    params
  })
}

/**
 * 查询物流公司详情
 * @param {} params
 * @returns
 */
export function detailCompanyApi(id) {
  return request({
    url: `${URL.getCompany}/detail/${id}`,
    method: 'get'
  })
}

/**
 * 保存更新物流公司
 * @param {} params
 * @returns
 */
export function saveCompanyApi(data, id) {
  return request({
    url: `${URL.getCompany}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}

/** ***************************物流产品相关接口************************ */

/**
 * 获取物流产品列表
 * @param {} params
 * @returns
 */
export function getProductListApi(params) {
  return request({
    url: `${URL.getProduct}/list`,
    method: 'get',
    params
  })
}

/**
 * 查询物流产品详情
 * @param {} params
 * @returns
 */
export function detailProductApi(id) {
  return request({
    url: `${URL.getProduct}/detail/${id}`,
    method: 'get'
  })
}

/**
 * 保存物流产品
 * @param {} params
 * @returns
 */
export function saveProductApi(data, id) {
  return request({
    url: `${URL.getProduct}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}

/**
 * 删除物流产品
 * @param {} params
 * @returns
 */
export function delProductApi(data, id) {
  return request({
    url: `${URL.getProduct}` + id ? `/${id}` : '',
    method: id ? 'put' : 'post',
    data
  })
}
/**
 * 获取签名配置下拉选项
 * @param {*} data
 * @returns
 */

export function getSignGroupApi(params) {
  return request({
    url: `/api/trans-service/lnt/product/service/sign/group/selections`,
    method: 'get',
    params
  })
}
/**
 * 获取保险保价配置下拉选项
 * @param {*} params
 * @returns
 */
export function getInsuranceGroupApi(params) {
  return request({
    url: `/api/trans-service/lnt/product/service/insurance/group/selections`,
    method: 'get',
    params
  })
}
/**
 * 获取iftGate配置下拉选项
 * @param {*} params
 * @returns
 */
export function getLiftGateGroupApi(params) {
  return request({
    url: `/api/trans-service/lnt/product/service/liftGate/group/selections`,
    method: 'get',
    params
  })
}
/**
 * 获取偏远地区code
 * @param {*} data
 * @returns
 */
export function getRemoteAreaTypeApi() {
  return request({
    url: `/api/trans-service/omc/lnt/product/remoteAreaType/selections`,
    method: 'get'
  })
}
/**
 * 编辑产品限制条件
 * @param {*} data
 * @returns
 */
export function saveLimitConditionApi(data) {
  return request({
    url: `/api/trans-service/omc/lnt/product/limitCondition/${data.id}`,
    method: 'put',
    data
  })
}

/** ***************************分区相关接口************************ */
/**
 * 获取分区列表
 * @param {} params
 * @returns
 */
export function getAreaSchemeListApi(params) {
  return request({
    url: `${URL.getAreaScheme}/list`,
    method: 'get',
    params
  })
}

/**
 * 查询分区详情
 * @param {} params
 * @returns
 */
export function detailAreaSchemeApi(id) {
  return request({
    url: `${URL.getAreaScheme}/detail/${id}`,
    method: 'get'
  })
}
/**
 * 删除分区
 * @param {} params
 * @returns
 */
export function delAreaSchemeApi(id) {
  return request({
    url: `${URL.getAreaScheme}/${id}`,
    method: 'delete'
  })
}

/**
 * 保存分区详情
 * @param {} params
 * @returns
 */
export function saveSchemeApi(data, id) {
  return request({
    url: `${URL.getAreaScheme}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}
/**
 * 通过物流产品获取分区模版
 * @param {} params
 * @returns
 */
export function downloadTemplateApi(params) {
  return request({
    url: `/api/trans-service/omc/lnt/area/scheme/template/filename/${params.areaImportType}`,
    method: 'get',
    params
  })
}

/**
 * 获取分区类型
 * @param {} params
 * @returns
 */
export function getAreaTypesApi() {
  return request({
    url: `/api/trans-service/omc/lnt/area/scheme/areatypes`,
    method: 'get'
  })
}

/**
 * 分区国家配置列表接口
 * @param {} params
 * @returns
 */
export function getCountryConfigApi(params) {
  return request({
    url: `/api/trans-service/omc/lnt/area/country/config/list`,
    method: 'get',
    params
  })
}

//
/** ***************************渠道相关接口************************ */

/**
 * 获取渠道列表
 * @param {} params
 * @returns
 */
export function getChannelListApi(params) {
  return request({
    url: `${URL.getChannel}/list`,
    method: 'get',
    params
  })
}

/**
 * 查询渠道详情
 * @param {} params
 * @returns
 */
export function getChannelDetailApi(id) {
  return request({
    url: `${URL.getChannel}/detail/${id}`,
    method: 'get'
  })
}

/**
 * 保存渠道数据
 * @param {} params
 * @returns
 */
export function saveChannelApi(data, id) {
  return request({
    url: `${URL.getChannel}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}

/**
 * 删除渠道数据
 * @param {} params
 * @returns
 */
export function delChannelApi(id) {
  return request({
    url: `${URL.getChannel}/${id}`,
    method: 'delete'
  })
}

/** ***************************税率配置 相关接口************************ */

/**
 * 费率配置列表
 * @param {} params
 * @returns
 */
export function getDivisionRatePagesApi(params) {
  return request({
    url: `/api/ovl-service/ovl/division/rate/pages`,
    method: 'get',
    params
  })
}
/**
 * 费率配置列表
 * @param {} data
 * @returns
 */
export function saveDivisionRateApi(data) {
  return request({
    url: `/api/ovl-service/ovl/division/rate/${data.id}`,
    method: 'put',
    data
  })
}
