// 小包
import request from '@/utils/request'

// 基础信息下拉
export function getDictListApi(dictType) {
  return request({
    url: `/api/ilp-service/ilp/dict/list/${dictType}`,
    method: 'get'
  })
}

// 基本信息-供应商产品-列表
export function getSupplierProductByApi(params) {
  return request({
    url: `/api/ilp-service/ilp/product/supply/list/info`,
    method: 'get',
    params
  })
}

// 基本信息-约束类型-列表
export function getRestrictionTypeApi(category) {
  return request({
    url: `/api/ilp-service/ilp/dict/restriction/type/list/${category}`,
    method: 'get'
  })
}

// 基本信息-约束单位-列表
export function getRestrictionUnitTypeApi(category) {
  return request({
    url: `/api/ilp-service/ilp/dict/unit/type/list/${category}`,
    method: 'get'
  })
}

// 基本信息-约束币种-列表
export function getRestrictionCurrencyApi(category) {
  return request({
    url: `/api/ilp-service/ilp/dict/currency/list/${category}`,
    method: 'get'
  })
}

// 基本信息-产品-列表
export function getProductSalesByApi(params) {
  return request({
    url: `/api/ilp-service/ilp/product/sales/list/info`,
    method: 'get',
    params
  })
}

// 基本信息-获取所有的渠道分区
export function getAllAreaChannelApi(params) {
  return request({
    url: `/api/ilp-service/ilp/area/channel/list/info`,
    method: 'get',
    params
  })
}


// 基本信息-渠道分区-列表-指定产品
export function getProductAreaChannelApi(params) {
  return request({
    url: `/api/ilp-service/ilp/area/channel/list/info/product`,
    method: 'get',
    params
  })
}


// 基本信息-渠道分区-起运分区
export function getChannelDepartureApi(params) {
  return request({
    url: `/api/ilp-service/ilp/area/channel/default/departure`,
    method: 'get',
    params
  })
}

// 基本信息-产品分区-起运分区
export function getProductDepartureApi(params) {
  return request({
    url: `/api/ilp-service/ilp/area/product/default/departure`,
    method: 'get',
    params
  })
}

// 基本信息-文件模板
export function getTemplateFileApi(fileType) {
  return request({
    url: `/api/ilp-service/ilp/file/${fileType}`,
    method: 'get'
  })
}

// 基本信息-出口报关模板-列表
export function getExportManifestTemplateApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/config/export/manifest/template/list`,
    method: 'get',
    params
  })
}

// 基本信息-进口清关模板-列表
export function getImportManifestTemplateApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/config/import/manifest/template/list`,
    method: 'get',
    params
  })
}

// 价卡模板-列表
export function getChargeTemplateListApi(params) {
  return request({
    url: `/api/ilp-service/ilp/offer/template/list/info`,
    method: 'get',
    params
  })
}

// 基本信息-费用类别
export function getChargeCategoryListApi(params) {
  return request({
    url: `/api/ilp-service/ilp/dict/charge/category/list`,
    method: 'get',
    params
  })
}


// 基本信息-产品分区-列表
export function getAllAreaProductApi() {
  return request({
    url: `/api/ilp-service/ilp/area/product/list/info`,
    method: 'get',
    params: { areaType: 2 }
  })
}

// 基本信息-渠道-列表
export function getAllChannelApi() {
  return request({
    url: `/api/ilp-service/ilp/channel/list/info`,
    method: 'get'
  })
}

// 轨迹节点下拉
export function getNodeDropdownApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/tracking/node/list/info`,
    method: 'get',
    params
  })
}

// 轨迹渠道-渠道基本信息-列表
export function getTraceChannelInfoApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/tracking/channel/info/list`,
    method: 'get',
    params
  })
}

// 异常信息下拉
export function getAbnormalityStateListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/abnormality/state/list`,
    method: 'get',
    params
  })
}

// 处理方案下拉
export function getPreocessPlanListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/abnormality/preocess/plan/list`,
    method: 'get',
    params
  })
}

// 处理方案状态下拉
export function getPreocessPlanStateListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/abnormality/process/list`,
    method: 'get',
    params
  })
}

// 异常类型下拉
export function getAbnormalityTypeListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/abnormality/type/list`,
    method: 'get',
    params
  })
}

// 退回方式下拉
export function getReturnTypeListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/abnormality/return/type/list`,
    method: 'get',
    params
  })
}

// 异常退回-退回地址类型列表接口
export function getReturnAddressTypeListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/abnormality/return/address/type/list`,
    method: 'get',
    params
  })
}


// 获取费用项下拉
export function getChargeItemApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/charge/item/list/no/page`,
    method: 'get',
    params
  })
}
