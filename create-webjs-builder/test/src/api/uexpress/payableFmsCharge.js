import request from '@/utils/request'

// 获取查询-费用列表
export function getPayableChargeListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/bill/cost/order/list`,
    method: 'get',
    params
  })
}

// 获取查询-费用列表
export function getPayableChargeListByNosApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/bill/cost/order/list/nos`,
    method: 'POST',
    data
  })
}

// 获取查询-费用列表-详情
export function getPayableChargeDetailApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/bill/cost/order/detail`,
    method: 'get',
    params
  })
}

// 获取查询-费用列表-更新订单
export function updateOrderPayableChargeApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/bill/cost/order/update`,
    method: 'POST',
    data
  })
}

// 获取查询-费用列表-更新费用
export function updateChargePayableChargeApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/bill/cost/order/update/charge`,
    method: 'POST',
    data
  })
}

// 批量调整费用
export function batchAdjustChargeApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/bill/cost/order/update/charge/batch`,
    method: 'POST',
    data
  })
}

// 批量调整订单
export function batchAdjustOrderApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/bill/cost/order/update/batch`,
    method: 'POST',
    data
  })
}

// 批量确认
export function batchConfirmChargeApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/bill/cost/order/confirm/batch`,
    method: 'POST',
    data
  })
}

// 单个确认
export function confirmChargeApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/bill/cost/order/confirm`,
    method: 'POST',
    data
  })
}

// 导出订单差异-多ids
export function exportPayableChargeByIdsApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/bill/cost/order/export/ids`,
    method: 'POST',
    data
  })
}

// 导出订单差异-条件
export function exportPayableChargeByConditionsApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/bill/cost/order/export/conditions`,
    method: 'POST',
    data
  })
}

// 导出订单差异-多单号
export function exportPayableChargeByNosApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/bill/cost/order/export/nos`,
    method: 'POST',
    data
  })
}
