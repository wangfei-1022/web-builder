import request from '@/utils/request'
import URL from './urlTranslator'

/**
 * 通用组件API
 */

// 收付类型
export function getArApDropDownList(params) {
  return request({
    url: `${URL.act.arApDropDownList}`,
    method: 'get',
    params
  })
}

// 收付款申请-结算方式
export function getPayTypeDropDownList(params) {
  return request({
    url: `${URL.act.payTypeDropDownList}`,
    method: 'get',
    params
  })
}

// 核销详情-结算方式
export function getPayTypeForClearDropdownList(params) {
  return request({
    url: `${URL.act.payTypeForClearDropdownList}`,
    method: 'get',
    params
  })
}

// 客商列表-全部
export function getPartnerDropDownList(params) {
  return request({
    url: `${URL.sys.partnerDropDownList}`,
    method: 'get',
    params
  })
}

// 客商列表-工作号-费用-收付申请向导
export function getCustomerDropDownListByJobForPayment(data) {
  return request({
    url: `${URL.act.customerDropDownListByJobForPayment}`,
    method: 'post',
    data
  })
}

export function getUserDropDownList(params) {
  return request({
    url: URL.sys.userDropDownList,
    method: 'get',
    params
  })
}

export function currencyDropDownList() {
  return request({
    url: `${URL.dmn.currencyDropDownList}`,
    method: 'get'
  })
}

export function getFeeItemDropdownList() {
  return request({
    url: `${URL.act.feeItemDropdownList}`,
    method: 'get'
  })
}
export function getCompanyList() {
  return request({
    url: URL.sys.companyList,
    method: 'get'
  })
}

//
export function getGlobalQueryConfig(configType, configModule) {
  const params = { configType, configModule }
  return request({
    url: URL.sys.getGlobalQueryConfig,
    method: 'get',
    params
  })
}
export function getPersonQueryConfig(configType, configModule) {
  const params = { configType, configModule }
  console.log('params:', params)
  return request({
    url: URL.sys.personQueryConfig,
    method: 'get',
    params
  })
}
export function getStaSchemaTree() {
  return request({
    url: URL.sys.getStaSchemaTree,
    method: 'get'
  })
}
export function savePersonQueryConfig(data) {
  return request({
    url: URL.sys.personQueryConfig,
    method: 'post',
    data
  })
}
export function saveShareQueryConfig(data) {
  return request({
    url: URL.sys.shareQueryConfig,
    method: 'post',
    data
  })
}
export function delPersonQueryConfig(id) {
  return request({
    url: URL.sys.personQueryConfig + `/${id}`,
    method: 'delete'
  })
}
export function updatePersonQueryConfig(data, id) {
  return request({
    url: URL.sys.personQueryConfig + `/${id}`,
    method: 'put',
    data
  })
}
export function getAdvQueryResult(url, data, method = 'post') {
  return request({
    url: url,
    method: method,
    [method === "post" ? 'data' : 'params']: data
  })
}
export function getSimQueryResult(url, params) {
  return request({
    url: url,
    method: 'get',
    params
  })
}

//
export function cloudFileNameApi(params) {
  return request({
    url: `/api/mdm-service/cloud/url/cloudFileName?cloudFileName=${params}`,
    method: 'get'
  })
}
// 结算主体
export function selectionsBaseInfoApi(params) {
  return request({
    url: `/api/member-service/mem/member/info/selections/baseInfo`,
    method: 'get',
    params
  })
}
