import request from '@/utils/request'

/*
//获取结算中心状态数据接口
1 入账状态
2 发票申请状态
3 开票状态
4 核销状态
*/
export function getDictDataApi(dictType) {
  return request({
    url: `/api/fms-service/fms/dict/list/${dictType}`,
    method: 'get'
  })
}

// 关联-获取未关联费用-确认单id（完成）
export function getChargeClearingApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/clearing`,
    method: 'post',
    data
  })
}

// 关联-获取未关联费用-确认单id（完成）
export function getConfirmationClearingApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/clearing/confirmation`,
    method: 'post',
    data
  })
}

// 关联-获取未关联账单（完成）
export function getBillClearingApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/bill/clearing`,
    method: 'post',
    data
  })
}

// 关联-获取未关联税发票（完成）
export function getInvoiceClearingApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/clearing`,
    method: 'post',
    data
  })
}

// 付款与核销 获取对应的订单统计账款
export function orderTotalByInstructionApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/charge/instruction/${params.instructionId}/total`,
    method: 'get',
    params
  })
}

// 勾选的费用 获取对应的订单统计账款
export function orderTotalByChargesApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/instruction/total/charges`,
    method: 'post',
    data
  })
}

// 勾选的费用确认单 获取对应的订单统计账款
export function orderTotalByConfirmationsApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/instruction/total/confirmations`,
    method: 'post',
    data
  })
}

// 勾选的账单 获取对应的订单统计账款
export function orderTotalByBillsApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/instruction/total/bills`,
    method: 'post',
    data
  })
}


// 勾选的费用 查询-费用-准备核销费用信息-付款申请相关-特殊检验
export function getSpecialInfoByChargesApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/ap/instruction/special/info/charges`,
    method: 'post',
    data
  })
}

// 勾选的费用确认单 查询-费用-准备核销确认单信息-付款申请相关-特殊检验
export function getSpecialInfoByConfirmationsApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/ap/instruction/special/info/confirmations`,
    method: 'post',
    data
  })
}

// 勾选的账单 查询-费用-准备核销账单信息-付款申请相关-特殊检验
export function getSpecialInfoByBillsApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/ap/instruction/special/info/bills`,
    method: 'post',
    data
  })
}

// 盈亏申请管理_订单盈亏状态）
export function getProfitAppplyStateApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/profit/apply/selection/profitApply/profitState`,
    method: 'get',
    params
  })
}
// 盈亏申请管理_订单盈亏状态）
export function getProfitAppplyTypeApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/profit/apply/selection/profitApply/profitType`,
    method: 'get',
    params
  })
}

// 锁单状态
export function getLockOrderStateApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/order/lockOrder/selection/orderLockState`,
    method: 'get',
    params
  })
}