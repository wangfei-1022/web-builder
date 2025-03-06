// 小包
import request from '@/utils/request'

// 纯尾程客户价卡-列表-产品
export function getOfferCustomerLastProductListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/last/list/product`,
    method: 'get',
    params
  })
}

// 纯尾程客户价卡-列表-销售
export function getOfferCustomerLastSaleListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/last/list/sales`,
    method: 'get',
    params
  })
}

// 纯尾程客户价卡-列表-历史版本
export function getOfferCustomerLastHistoryListApi(offerId) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/last/list/history/${offerId}`,
    method: 'get'
  })
}


// 纯尾程客户价卡-创建
export function createOfferCustomerLastApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/last/create`,
    method: 'POST',
    data
  })
}

// 纯尾程客户价卡-更新
export function updateOfferCustomerLastApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/last/update`,
    method: 'POST',
    data
  })
}

// 纯尾程客户价卡-详情
export function getDetailOfferCustomerLastApi(offerId) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/last/detail/${offerId}`,
    method: 'get'
  })
}

// 纯尾程客户价卡-提交
export function submitOfferCustomerLastApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/last/submit`,
    method: 'POST',
    data
  })
}

// 纯尾程客户价卡-发布
export function publishOfferCustomerLastApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/last/publish`,
    method: 'POST',
    data
  })
}

// 纯尾程客户价卡-删除
export function deleteOfferCustomerLastApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/last/delete`,
    method: 'POST',
    data
  })
}

// 纯尾程客户价卡-更新价格
export function updatePriceOfferCustomerLastApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/last/update/price`,
    method: 'POST',
    data
  })
}

// 纯尾程客户价卡-调整价卡
export function adjustInitOfferCustomerLastApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/last/adjust`,
    method: 'POST',
    data
  })
}

// 纯尾程客户价卡-复制价卡
export function copyInitOfferCustomerLastApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/last/copy`,
    method: 'POST',
    data
  })
}

// 纯尾程客户价卡-审核通过
export function auditOfferCustomerLastApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/last/batch/verify/accept`,
    method: 'POST',
    data
  })
}

// 纯尾程客户价卡-作废-下线
export function offlineOfferCustomerLastApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/last/nullify`,
    method: 'POST',
    data
  })
}

// 纯尾程客户价卡-作废-下线-失效时间
export function offlineExpireTimeOfferCustomerLastApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/customer/last/schedule`,
    method: 'POST',
    data
  })
}

// 纯尾程客户价卡-导入
export function importOfferCustomerLastApiApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/offer/offer/customer/last/import',
    method: 'post',
    data
  })
}

// 纯尾程客户价卡-导出
export function exportOfferCustomerLastApiApi(params) {
  return request({
    url: '/api/ilp-service/omc/ilp/offer/offer/customer/last/list/product/export',
    method: 'get',
    params
  })
}
