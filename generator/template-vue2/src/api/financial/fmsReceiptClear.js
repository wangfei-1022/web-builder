import request from '@/utils/request'

// 关联-获取应付未关联账单（完成）
export function getPayableBillUninstructionApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/bill/ap/list/company/uninstruction`,
    method: 'get',
    params
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

// 关联-同币种对冲（完成）
// 获取对冲结果api
export function getHedgeResultApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/offset/same`,
    method: 'post',
    data
  })
}

// 关联-申请应收关联（完成）
export function fmsInstructionReceiptCollectApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/receipt/collect/notify`,
    method: 'post',
    data
  })
}

// 申请对冲 提交
export function fmsInstructionOffsetSubmitApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/offset/notify`,
    method: 'post',
    data
  })
}


// 关联-应收核销（完成）// 正常核销 商务审核通过
export function receiptClearAuditApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/clear/receipt/clear`,
    method: 'post',
    data
  })
}

// 关联-应收核销（完成）// 对冲核销 商务审核通过
export function receiptOffsetClearAuditApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/clear/offset/clear`,
    method: 'post',
    data
  })
}

// 关联-获取核销详情（完成）
export function getReceiptClearDetailApi(id) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/receipt/detail/${id}`,
    method: 'get'
  })
}

// 关联-获取对冲核销详情（完成）
export function getReceiptOffsetClearDetailApi(id) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/offset/detail/${id}`,
    method: 'get'
  })
}

// 核销申请-撤回核销申请
export function receiptApplyClearCancelApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/receipt/collect/cancel`,
    method: 'post',
    data
  })
}

// 核销-撤回应收核销
export function receiptClearCancelApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/clear/receipt/cancel`,
    method: 'post',
    data
  })
}

// 对冲核销-撤回对冲核销（完成）
export function receiptClearOffsetCancelApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/clear/offset/cancel`,
    method: 'post',
    data
  })
}

// 所有的列表
// 关联-列表-待核销-申请人（完成）
export function getApplyClearListApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/receipt/list/toclear/applier`,
    method: 'get',
    params
  })
}

// 关联-列表-全部核销-申请人（完成）
export function getClearListAllApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/receipt/list/applier`,
    method: 'get',
    params
  })
}


// 关联-列表-待核销-核销人（完成）
export function getApplyClearListToclearApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/receipt/list/toclear/settler`,
    method: 'get',
    params
  })
}

// 关联-列表-全部-核销人（完成）
export function getClearListAllToclearApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/receipt/list/settler`,
    method: 'get',
    params
  })
}

// 对冲-列表-待核销-申请人（完成）
export function getApplyClearListOffsetApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/offset/list/toclear/applier`,
    method: 'get',
    params
  })
}

// 对冲-列表-全部-申请人（完成）
export function getClearListAllOffsetApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/offset/list/applier`,
    method: 'get',
    params
  })
}

// 对冲-列表-待核销-核销人（完成）
export function getApplyClearListToclearOffsetApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/offset/list/toclear/settler`,
    method: 'get',
    params
  })
}

// 对冲-列表-全部-核销人（完成）
export function getClearListAllToclearOffsetApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/offset/list/settler`,
    method: 'get',
    params
  })
}

// 核销申请-获取费用明细（完成）
export function getReceiptClearChargeDetailApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/charge/list`,
    method: 'get',
    params
  })
}

// 余额核销获取客户的余额下拉
export function getMemberWalletAccountListClearApi(data) {
  return request({
    url: `/api/fms-service/v2/omc/wallet/account/${data.memberId}/accountCode/${data.accountCode}/list`,
    method: 'get'
  })
}
