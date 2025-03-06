import request from '@/utils/request'

// 费用确认单-列表
export function getPayableConfirmationListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/settlement/confirmation/ap/list/settler`,
    method: 'get',
    params
  })
}

// 费用确认单-列表-详情
export function getPayableConfirmationDetailApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/settlement/confirmation/ap/detail`,
    method: 'get',
    params
  })
}

// 尾程账单管理-列表
export function getBillLastMileListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/bill/cost/bill/list`,
    method: 'get',
    params
  })
}

// 尾程账单管理-列表-详情
export function getBillLastMileListDetailApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/bill/cost/order/list/bill`,
    method: 'get',
    params
  })
}

// 尾程账单管理-列表-开始对账
export function beginCheckBillLastMileApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/bill/cost/bill/begin/check`,
    method: 'post',
    data
  })
}

// 尾程账单管理-列表-确认
export function confirmBillLastMileApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/bill/cost/bill/confirm`,
    method: 'post',
    data
  })
}

// 尾程账单管理-列表-生成结算账单
export function createBillLastMileApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/bill/cost/bill/create/bill`,
    method: 'post',
    data
  })
}

