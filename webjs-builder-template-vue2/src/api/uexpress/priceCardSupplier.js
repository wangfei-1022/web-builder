// 小包
import request from '@/utils/request'

// 供应商价卡-列表-产品
export function getOfferSupplierProductListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/supplier/list`,
    method: 'get',
    params
  })
}

// 供应商价卡-列表-销售
export function getOfferSupplierSaleListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/supplier/list/sales`,
    method: 'get',
    params
  })
}

// 供应商价卡-列表-历史版本
export function getOfferSupplierHistoryListApi(offerId) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/supplier/list/history/${offerId}`,
    method: 'get'
  })
}


// 供应商价卡-创建
export function createOfferSupplierApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/composite/offer/supplier/create`,
    method: 'POST',
    data
  })
}

// 供应商价卡-更新
export function updateOfferSupplierApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/composite/offer/supplier/update`,
    method: 'POST',
    data
  })
}

// 供应商价卡-详情
export function getDetailOfferSupplierApi(offerId) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/supplier/detail/${offerId}`,
    method: 'get'
  })
}

// 供应商价卡-提交
export function submitOfferSupplierApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/supplier/submit`,
    method: 'POST',
    data
  })
}

// 供应商价卡-发布
export function publishOfferSupplierApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/supplier/publish`,
    method: 'POST',
    data
  })
}

// 供应商价卡-删除
export function deleteOfferSupplierApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/supplier/delete`,
    method: 'POST',
    data
  })
}

// 供应商价卡-更新价格
export function updatePriceOfferSupplierApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/supplier/update/price`,
    method: 'POST',
    data
  })
}

// 供应商价卡-调整价卡
export function adjustInitOfferSupplierApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/supplier/adjust`,
    method: 'POST',
    data
  })
}

// 供应商价卡-复制价卡
export function copyInitOfferSupplierApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/supplier/copy`,
    method: 'POST',
    data
  })
}

// 供应商价卡-审核通过
export function auditOfferSupplierApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/supplier/batch/verify/accept`,
    method: 'POST',
    data
  })
}

// 供应商价卡-作废-下线
export function offlineOfferSupplierApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/supplier/nullify`,
    method: 'POST',
    data
  })
}

// 供应商价卡-作废-下线-失效时间
export function offlineExpireTimeOfferSupplierApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/offer/supplier/schedule`,
    method: 'POST',
    data
  })
}

// 供应商价卡-导入
export function importOfferSupplierApiApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/offer/offer/supplier/import',
    method: 'post',
    data
  })
}

// 供应商价卡-导出
export function exportOfferSupplierApiApi(params) {
  return request({
    url: '/api/ilp-service/omc/ilp/offer/offer/supplier/export',
    method: 'get',
    params
  })
}
