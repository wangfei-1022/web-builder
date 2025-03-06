// 小包
import request from '@/utils/request'

// 燃油费率-列表
export function getPayableFuelRateListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/supplier/fuel/list`,
    method: 'get',
    params
  })
}

// 燃油费率-列表-历史版本
export function getPayableFuelRateHistoryListApi(offerId) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/supplier/fuel/list/history/${offerId}`,
    method: 'get'
  })
}


// 燃油费率-创建
export function createPayableFuelRateApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/supplier/fuel/create`,
    method: 'POST',
    data
  })
}

// 燃油费率-更新
export function updatePayableFuelRateApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/supplier/fuel/update`,
    method: 'POST',
    data
  })
}

// 燃油费率-发布
export function publishPayableFuelRateApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/supplier/fuel/publish`,
    method: 'POST',
    data
  })
}

// 燃油费率-删除
export function deletePayableFuelRateApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/supplier/fuel/delete`,
    method: 'POST',
    data
  })
}

// 燃油费率-调整价卡
export function adjustPayableFuelRateApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/supplier/fuel/adjust`,
    method: 'POST',
    data
  })
}


// 燃油费率-导入
export function importPayableFuelRateApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/offer/offer/supplier/fuel/import',
    method: 'post',
    data
  })
}

// 燃油费率-导出
export function exportPayableFuelRateApi(params) {
  return request({
    url: '/api/ilp-service/omc/ilp/offer/offer/supplier/fuel/list/product/export',
    method: 'get',
    params
  })
}

// 燃油费率-作废-下线-失效时间-当前时间
export function offlineExpireTimePayableFuelRateApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/supplier/fuel/schedule`,
    method: 'POST',
    data
  })
}
