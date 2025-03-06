import request from '@/utils/request'

// 付款-列表-未关联核销
export function getRelativePaymentListApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/transactions/payment/list/prepay/uninstruction`,
    method: 'get',
    params
  })
}

// 应付核销申请-提交
export function payableClearApplyApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/clear/apply`,
    method: 'post',
    data
  })
}


// 所有的列表
// 列表-全部-申请人
export function getPayableApplyClearListOperatorAllApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/clear/list/applier`,
    method: 'get',
    params
  })
}

// 列表-待核销-申请人
export function getPayableApplyClearListOperatorUnClearApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/clear/list/toclear/applier`,
    method: 'get',
    params
  })
}


// 列表-待核销-核销人-商务
export function getPayableApplyClearListBusinessUnClearApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/clear/list/toclear/settler`,
    method: 'get',
    params
  })
}

// 列表-全部-核销人-商务
export function getPayableApplyClearListBusinessAllApi(params) {
  return request({
    url: `/api/fms-service//omc/fms/instruction/ap/clear/list/settler`,
    method: 'get',
    params
  })
}

// 获取核销详情（完成）
export function getPayableClearDetailApi(id) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/clear/detail/${id}`,
    method: 'get'
  })
}

// 正常核销 商务审核通过
export function payableClearAuditApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/clear/payment/clear`,
    method: 'post',
    data
  })
}

// 核销申请-撤回核销申请
export function payableApplyClearCancelApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/clear/apply/cancel`,
    method: 'post',
    data
  })
}

// 核销申请-撤回核销申请-申请人
export function payableApplyClearRecallApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/clear/apply/cancel/before/approval`,
    method: 'post',
    data
  })
}

// 核销申请-催办-申请人
export function payableApplyClearUrgingApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/clear/apply/approval/remind`,
    method: 'post',
    data
  })
}

// 核销-撤回应收核销
export function payableClearCancelApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/clear/payment/cancel`,
    method: 'post',
    data
  })
}


// 核销申请-审批同意
export function payableClearApprovalAgreeApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/clear/approval/agree`,
    method: 'post',
    data
  })
}

// 核销申请-审批拒绝
export function payableClearApprovalRejectApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/clear/approval/reject`,
    method: 'post',
    data
  })
}

// 核销申请-重新提交工作流
export function clearApprovalRepushApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/clear/approval/push`,
    method: 'POST',
    data
  })
}
