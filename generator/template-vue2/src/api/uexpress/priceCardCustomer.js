// 小包
import request from '@/utils/request'

// 客户价卡-列表-产品
export function getOfferCustomerProductListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/list/product`,
    method: 'get',
    params
  })
}

// 客户价卡-列表-销售
export function getOfferCustomerSaleListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/list/sales`,
    method: 'get',
    params
  })
}

// 客户价卡-列表-历史版本
export function getOfferCustomerHistoryApi(offerId) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/list/history/${offerId}`,
    method: 'get'
  })
}

// 客户价卡-创建
export function createOfferCustomerApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/create`,
    method: 'POST',
    data
  })
}

// 客户价卡-更新
export function updateOfferCustomerApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/update`,
    method: 'POST',
    data
  })
}

// 客户价卡-创建-销售
export function createOfferCustomerSalesApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/create/sales`,
    method: 'POST',
    data
  })
}

// 客户价卡-更新-销售
export function updateOfferCustomerSalesApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/update`,
    method: 'POST',
    data
  })
}

// 客户价卡-更新价格
export function updatePriceOfferCustomerApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/update/price`,
    method: 'POST',
    data
  })
}

// 客户价卡-详情
export function getDetailOfferCustomerApi(id) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/detail/${id}`,
    method: 'get'
  })
}

// 客户价卡-提交
export function submitOfferCustomerApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/submit`,
    method: 'POST',
    data
  })
}

// 客户价卡-删除
export function deleteOfferCustomerApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/delete`,
    method: 'POST',
    data
  })
}

// 客户价卡-审核通过
export function auditOfferCustomerApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/verify/accept`,
    method: 'POST',
    data
  })
}

// 客户价卡-调整
export function adjustInitOfferCustomerApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/adjust`,
    method: 'POST',
    data
  })
}

// 客户价卡-作废
export function offlineOfferCustomerApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/nullify`,
    method: 'POST',
    data
  })
}

// 客户价卡-导入报价
export function importCustomerPriceApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/import`,
    method: 'POST',
    data
  })
}

