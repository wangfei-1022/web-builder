// 小包
import request from '@/utils/request'

// 燃油费率-列表
export function getReceiptFuelRateListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/fuel/list`,
    method: 'get',
    params
  })
}

// 燃油费率-列表-历史版本
export function getReceiptFuelRateHistoryListApi(offerId) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/fuel/list/history/${offerId}`,
    method: 'get'
  })
}


// 燃油费率-创建
export function createReceiptFuelRateApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/fuel/create`,
    method: 'POST',
    data
  })
}

// 燃油费率-更新
export function updateReceiptFuelRateApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/fuel/update`,
    method: 'POST',
    data
  })
}

// 燃油费率-发布
export function publishReceiptFuelRateApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/fuel/publish`,
    method: 'POST',
    data
  })
}

// 燃油费率-删除
export function deleteReceiptFuelRateApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/fuel/delete`,
    method: 'POST',
    data
  })
}

// 燃油费率-调整价卡
export function adjustReceiptFuelRateApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/fuel/adjust`,
    method: 'POST',
    data
  })
}


// 燃油费率-导入
export function importReceiptFuelRateApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/offer/offer/fuel/import',
    method: 'post',
    data
  })
}

// 燃油费率-导出
export function exportReceiptFuelRateApi(params) {
  return request({
    url: '/api/ilp-service/omc/ilp/offer/offer/fuel/list/product/export',
    method: 'get',
    params
  })
}

// 燃油费率-作废-下线-失效时间-当前时间
export function offlineExpireTimeReceiptFuelRateApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/fuel/schedule`,
    method: 'POST',
    data
  })
}
