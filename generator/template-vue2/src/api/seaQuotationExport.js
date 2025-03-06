import request from '@/utils/request'

// 获取订单列表
export function getSeaQuotationExportListApi(params) {
  return request({
    url: `/api/sea-service/sea/quotation/export/pages`,
    method: 'get',
    params
  })
}

// 获取订单详情
export function getSeaQuotationExportDetailApi(orderId) {
  return request({
    url: `/api/sea-service/sea/quotation/export/detail/${orderId}`,
    method: 'get'
  })
}

// 报价
export function quoteSeaQuotationExportApi(data) {
  return request({
    url: `/api/sea-service/sea/quotation/export/quote`,
    method: 'post',
    data
  })
}

// 取消报价
export function cancelQuoteSeaQuotationExportApi(orderId) {
  return request({
    url: `/api/sea-service/sea/quotation/export/${orderId}/cancelQuote`,
    method: 'put'
  })
}

// 重新推送
export function systemRetryPushSeaQuotationExportApi(data) {
  return request({
    url: `/api/sea-service/sea/quotation/export/systemRetryPush`,
    method: 'put',
    data
  })
}


// 修改标签
export function updOrderLabelTypeSeaQuotationExportApi(orderId, data) {
  return request({
    url: `/api/sea-service/sea/quotation/export/${orderId}/updOrderLabelType`,
    method: 'put',
    data
  })
}
