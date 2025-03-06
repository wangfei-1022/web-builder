import request from '@/utils/request'

// 待提交订单列表
export function getProfitApplyUncommittedListApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/order/list/profitApply`,
    method: 'get',
    params
  })
}

// 盈亏申请列表
export function getProfitApplyListApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/profit/apply/list/apply`,
    method: 'get',
    params
  })
}

// 盈亏申请列表-cuont
export function getProfitApplyCountApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/profit/apply/count/apply`,
    method: 'get',
    params
  })
}

// 订单信息
export function getProfitApplyDetailByOrderApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/order/${params.orderId}/${params.entityType}/profitApply/detail`,
    method: 'get',
    params
  })
}

// 往来费用
export function getProfitApplyDetailChargeByOrderApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/order/${params.orderId}/${params.entityType}/profitApply/charges`,
    method: 'get',
    params
  })
}

// 往期 当期
export function getProfitApplyHistoryStateApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/order/charge/selection/profitApply/historyState`,
    method: 'get',
    params
  })
}

// 提交
export function profitApplySubmitApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/profit/apply`,
    method: 'POST',
    data
  })
}

// 提交-批量
export function profitApplySubmitBatchApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/profit/apply/batch`,
    method: 'POST',
    data
  })
}

// 重新提交
export function profitApplyResubmitApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/profit/apply/${data.profitApplyId}/reapply`,
    method: 'PUT',
    data
  })
}

// 撤回
export function profitApplyRecallApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/profit/apply/${data.profitApplyId}/revert`,
    method: 'PUT',
    data
  })
}


// 撤回-批量
export function profitApplyRecallBatchApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/profit/apply/batch/${data.profitApplyId}/revert`,
    method: 'PUT',
    data
  })
}

// 盈亏申请详情
export function getProfitApplyDetailApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/profit/apply/${params.profitApplyId}/detail`,
    method: 'get',
    params
  })
}

// 盈亏申请详情-费用
export function getProfitApplyDetailChargeApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/profit/apply/${params.profitApplyId}/charges`,
    method: 'get',
    params
  })
}
