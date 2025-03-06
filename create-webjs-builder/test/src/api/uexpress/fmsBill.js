import request from '@/utils/request'

// 获取查询-应收账单列表
export function getReceiveBillListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/settlement/bill/ar/list`,
    method: 'get',
    params
  })
}

// 获取查询-应收账单列表-统计
export function getReceiveBillListTotalApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/settlement/bill/ar/list/total`,
    method: 'get',
    params
  })
}

// 发送账单 （chargeDirect ar 应收 ap 应付）
export function sendReceiveBillEmailApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/settlement/bill/ar/list/email/send`,
    method: 'put',
    data
  })
}

// 下载账单
export function downloadBillFileApi(billId) {
  return request({
    url: `/api/ilp-service/omc/ilp/settlement/bill/ar/list/file/${billId}`,
    method: 'get'
  })
}

// 账单-确认账单
export function receiveBillConfirmApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/settlement/bill/ar/confirm`,
    method: 'post',
    data
  })
}

// 尾程账单导入-列表
export function getBillLastMileImportListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/bill/import/log/list`,
    method: 'get',
    params
  })
}

// 尾程账单导入-导入
export function billLastMileImportOperApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/bill/import/log/import`,
    method: 'post',
    data
  })
}

// 尾程账单导入-详情
export function getBillLastMileImportDetailApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/bill/import/log/order/list`,
    method: 'get',
    params
  })
}

// 尾程账单导入-状态
export function getBillLastMileStateListApi() {
  return request({
    url: `/api/ilp-service/omc/ilp/bill/import/log/state/list`,
    method: 'get'
  })
}

// 尾程账单导入-订单处理状态
export function getBillLastMileOrderStateListApi() {
  return request({
    url: `/api/ilp-service/omc/ilp/bill/import/log/order/state/list`,
    method: 'get'
  })
}

// 尾程账单导入- 一键重推
export function repushBillLastMileImportApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/bill/import/log/handle/fail/order`,
    method: 'POST',
    data
  })
}
