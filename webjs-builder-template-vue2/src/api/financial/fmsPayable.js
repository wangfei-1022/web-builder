import request from '@/utils/request'

export function getSettlementListByMemberIdApi(memberId) {
  return request({
    url: `/api/cms-service/omc/cms/customer/title/${memberId}/list`,
    method: 'get'
  })
}

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

// 获取查询-费用确认单列表
export function getPayableConfirmationListApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/confirmation/ap/list`,
    method: 'get',
    params
  })
}

// 获取查询-费用确认单列表-统计
export function getPayableConfirmationListTotalApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/confirmation/ap/list/total`,
    method: 'get',
    params
  })
}

// 获取查询-应付费用明细列表
export function getPayableChargeListApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/charge/ap/list`,
    method: 'get',
    params
  })
}

// 获取查询-应付费用明细列表-统计
export function getPayableChargeListTotalApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/charge/ap/list/total`,
    method: 'get',
    params
  })
}

// 获取查询-应付账单列表
export function getPayableBillListApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/bill/ap/list`,
    method: 'get',
    params
  })
}

// 获取查询-应付账单列表-统计
export function getPayableBillListTotalApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/bill/ap/list/total`,
    method: 'get',
    params
  })
}

// 获取查询-应付账单-获取账单详情
export function getPayableBillDetailApi(billId) {
  return request({
    url: `/api/fms-service/omc/fms/bill/detail/${billId}`,
    method: 'get'
  })
}

// 获取查询-应付账单-获取账单费用
export function getPayableBillDetailChargeApi(billId) {
  return request({
    url: `/api/fms-service/omc/fms/charge/bill/${billId}`,
    method: 'get'
  })
}

// 账单-确认账单
export function receiveBillConfirmApi(billId) {
  return request({
    url: `/api/fms-service/omc/fms/bill/${billId}/confirm`,
    method: 'post'
  })
}

// 账单 撤回
export function receiveBillRecallApi(billId) {
  return request({
    url: `/api/fms-service/omc/fms/bill/${billId}/cancel`,
    method: 'post'
  })
}

// 获取查询-费用确认单列表-费用确认单 确认
export function receiveConfirmationConfirmApi(confirmationId) {
  return request({
    url: `/api/fms-service/omc/fms/settlement/order/confirmation/${confirmationId}/confirm`,
    method: 'post'
  })
}

// 获取查询-费用确认单列表-详情 单个
export function getPayableConfirmationDetailByIdApi(id) {
  return request({
    url: `/api/fms-service/omc/fms/settlement/order/confirmation/detail/id/${id}`,
    method: 'get'
  })
}

// 获取结算单据-费用确认单-获取费用确认单详情
// 入参订单号
export function getPayableConfirmationDetailApi(entityNo) {
  return request({
    url: `/api/fms-service/omc/fms/settlement/order/confirmation/detail/${entityNo}`,
    method: 'get'
  })
}

// 结算单据-费用确认单-登记费用
export function receiveConfirmationRecordApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/settlement/order/confirmation/charge/record`,
    method: 'post',
    data
  })
}

// 结算单据-费用确认单-调整记账费用
export function receiveConfirmationAdjustApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/settlement/order/confirmation/charge/adjust`,
    method: 'post',
    data
  })
}

// 应付-获取账单号-加入账单
export function getPayableBillNoApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/bill/ap/list/nopage`,
    method: 'get',
    params
  })
}

// 应付费用明细-加入账单
export function receiveChargeJoinBillApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/entry`,
    method: 'post',
    data
  })
}

// 费用确认单-加入账单
export function receiveConfirmationJoinBillApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/confirmation/entry`,
    method: 'post',
    data
  })
}

// 不再出账
export function receiveChargeUnallowApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/entry/unallow`,
    method: 'post',
    data
  })
}

// 允许出账/恢复出账
export function receiveChargeAllowApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/entry/allow`,
    method: 'post',
    data
  })
}

// 应付费用明细-生成账单
export function payableChargeCreateBillApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/bill/ap/create/chargeids`,
    method: 'post',
    data
  })
}

// 应付费用确认单-生成账单
export function payableConfirmationCreateBillApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/bill/ap/create/confirmationids`,
    method: 'post',
    data
  })
}

// 查询-账单列表状态数量
export function getBillStatusNumberApi(countType) {
  return request({
    url: `/api/fms-service/omc/fms/bill/ap/count/${countType}`,
    method: 'get'
  })
}

// 下载账单
export function downloadBillFileApi(billid) {
  return request({
    url: `/api/fms-service/omc/fms/bill/file/${billid}`,
    method: 'get'
  })
}


// 查询-费用列表-导出excel-ap
export function payableChargeExportExcelApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/ap/list/export/excel`,
    method: 'put',
    data
  })
}

// 查询-账单列表-导出excel-ap
export function payableBillExportExcelApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/bill/ap/list/export/excel`,
    method: 'put',
    data
  })
}

// 费用明细列表进行导出费用明细
export function payableChargeExportSearchApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/ap/list/export/easy/excel`,
    method: 'put',
    data
  })
}

// 费用明细 多单号查询
export function getPayableChargeMultipleSearchApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/ap/multipleNos/list`,
    method: 'put',
    data
  })
}

// 费用明细 多单号查询 合计金额
export function getPayableChargeMultipleTotalApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/ap/multipleNos/list/total`,
    method: 'put',
    data
  })
}

// 费用明细列表 不分页
export function getPayableChargeListALlApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/ap/list/nopage`,
    method: 'POST',
    data
  })
}


// 发送账单 （chargeDirect ar 应收 ap 应付）
export function sendPayableBillEmailApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/bill/ap/list/email/send`,
    method: 'put',
    data
  })
}
