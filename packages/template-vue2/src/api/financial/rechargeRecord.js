import request from '@/utils/request'

// VITE-SP
export function getAccountListBy() { }
export function saveAccount() { }

// 申请记录状态下拉-财务
export function getRechargeRecordStateFinApi(params) {
  return request({
    url: `/api/fms-service/v2/recharge/state/fin/selection`,
    method: 'get',
    params
  })
}

// 申请记录状态下拉-销售-运营
export function getRechargeRecordStateOperaApi(params) {
  return request({
    url: `/api/fms-service/v2/recharge/state/oms/selection`,
    method: 'get',
    params
  })
}

// 销售-统计条数
export function getSaleCountApi(params) {
  return request({
    url: `/api/fms-service/v2/omc/recharge/claim/currentUser/count`,
    method: 'get',
    params
  })
}

// 销售-列表
export function getSaleRechargeApplyListApi(params) {
  return request({
    url: `/api/fms-service/v2/omc/recharge/claim/currentUser/list`,
    method: 'get',
    params
  })
}

// 销售-列表-详情
export function getRechargeApplyDetailListApi(id) {
  return request({
    url: `/api/fms-service/v2/omc/recharge/claim/detail/${id}`,
    method: 'get'
  })
}

// 运营-统计条数
export function getOperatorCountApi(params) {
  return request({
    url: `/api/fms-service/v2/omc/recharge/claim/count`,
    method: 'get',
    params
  })
}


// 运营-列表
export function getOperatorRechargeApplyListApi(params) {
  return request({
    url: `/api/fms-service/v2/omc/recharge/claim/list`,
    method: 'get',
    params
  })
}

// 运营-统计条数
export function getFinanceCountApi(params) {
  return request({
    url: `/api/fms-service/v2/omc/recharge/clear/count`,
    method: 'get',
    params
  })
}


// 退回申请
export function returnApplyApi(data) {
  return request({
    url: `/api/fms-service/v2/omc/recharge/claim/${data.id}/reject`,
    method: 'put',
    data
  })
}

// 关联收款操作
export function rechargeClaimConfirmApi(data) {
  return request({
    url: `/api/fms-service/v2/omc/recharge/claim/${data.id}/confirm`,
    method: 'put',
    data
  })
}

// 关联收款操作之后的详情-属于是核销申请
export function getRechargeDetailRelativeTransApi(id) {
  return request({
    url: `/api/fms-service/v2/omc/recharge/clear/detail/${id}`,
    method: 'get'
  })
}


// 财务-待审核列表
export function getAuditRechargeRecordListApi(params) {
  return request({
    url: `/api/fms-service/v2/omc/recharge/clear/audit/list`,
    method: 'get',
    params
  })
}

// 财务-全部列表
export function getAllRechargeRecordListApi(params) {
  return request({
    url: `/api/fms-service/v2/omc/recharge/clear/list`,
    method: 'get',
    params
  })
}

// 财务-全部列表-审核之后的详情-核销
export function getRechargeSuccessDetailListApi(id) {
  return request({
    url: `/api/fms-service/v2/omc/recharge/clear/instruction/detail/${id}`,
    method: 'get'
  })
}

// 财务-全部列表-财务拒绝
export function rejectApplyTransApi(data) {
  return request({
    url: `/api/fms-service/v2/omc/recharge/clear/${data.id}/reject`,
    method: 'put',
    data
  })
}

// 财务-全部列表-审核通过
export function auditApplyTransApi(data) {
  return request({
    url: `/api/fms-service/v2/omc/recharge/clear/${data.id}/confirm`,
    method: 'put',
    data
  })
}

// 财务-全部列表-补充手续费
export function supplyFeeApi(data) {
  return request({
    url: `/api/fms-service/v2/omc/recharge/clear/${data.rechargeId}/handle/fee`,
    method: 'put',
    data
  })
}
