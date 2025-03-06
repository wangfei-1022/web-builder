// 小包
import request from '@/utils/request'

// 公布价卡-列表-产品
export function getOfferPublishProductListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/publish/list/product`,
    method: 'get',
    params
  })
}

// 公布价卡-列表-销售
export function getOfferPublishSaleListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/publish/list/sales`,
    method: 'get',
    params
  })
}

// 公布价卡-列表-历史版本
export function getOfferPublishHistoryListApi(offerId) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/publish/list/history/${offerId}`,
    method: 'get'
  })
}


// 公布价卡-创建
export function createOfferPublishApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/publish/create`,
    method: 'POST',
    data
  })
}

// 公布价卡-更新
export function updateOfferPublishApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/publish/update`,
    method: 'POST',
    data
  })
}

// 公布价卡-详情
export function getDetailOfferPublishApi(offerId) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/publish/detail/${offerId}`,
    method: 'get'
  })
}

// 公布价卡-提交
export function submitOfferPublishApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/publish/submit`,
    method: 'POST',
    data
  })
}

// 公布价卡-发布
export function publishOfferPublishApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/publish/publish`,
    method: 'POST',
    data
  })
}

// 公布价卡-删除
export function deleteOfferPublishApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/publish/delete`,
    method: 'POST',
    data
  })
}

// 公布价卡-更新价格
export function updatePriceOfferPublishApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/publish/update/price`,
    method: 'POST',
    data
  })
}

// 公布价卡-调整价卡
export function adjustInitOfferPublishApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/publish/adjust`,
    method: 'POST',
    data
  })
}

// 公布价卡-复制价卡
export function copyInitOfferPublishApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/publish/copy`,
    method: 'POST',
    data
  })
}

// 公布价卡-导入
export function importOfferPublishApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/offer/offer/publish/import',
    method: 'post',
    data
  })
}

// 公布价卡-导出
export function exportOfferPublishApi(params) {
  return request({
    url: '/api/ilp-service/omc/ilp/offer/offer/publish/list/product/export',
    method: 'get',
    params
  })
}

// 供应商价卡-作废-下线-失效时间-当前时间
export function offlineExpireTimeOfferPublishApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/publish/schedule`,
    method: 'POST',
    data
  })
}
