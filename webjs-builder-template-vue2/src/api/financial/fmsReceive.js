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
export function getReceiveConfirmationListApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/confirmation/ar/list`,
    method: 'get',
    params
  })
}

// 获取查询-费用确认单列表-统计
export function getReceiveConfirmationListTotalApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/confirmation/ar/list/total`,
    method: 'get',
    params
  })
}

// 获取查询-应收费用明细列表
export function getReceiveChargeListApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/charge/ar/list`,
    method: 'get',
    params
  })
}

// 获取查询-应收费用明细列表-统计
export function getReceiveChargeListTotalApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/charge/ar/list/total`,
    method: 'get',
    params
  })
}

// 获取查询-应收账单列表
export function getReceiveBillListApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/bill/ar/list`,
    method: 'get',
    params
  })
}

// 获取查询-应收账单列表-统计
export function getReceiveBillListTotalApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/bill/ar/list/total`,
    method: 'get',
    params
  })
}

// 获取查询-应收账单-获取账单详情
export function getReceiveBillDetailApi(billId) {
  return request({
    url: `/api/fms-service/omc/fms/bill/detail/${billId}`,
    method: 'get'
  })
}

// 获取查询-应收账单-获取账单费用
export function getReceiveBillDetailChargeApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/charge/bill/${params.id}`,
    method: 'get',
    params
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

// 账单 撤回对账
export function receiveBillRecallWithdrawApi(billId) {
  return request({
    url: `/api/fms-service/omc/fms/bill/${billId}/withdraw`,
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

// 获取查询-费用确认单列表-费用确认单 撤回确认
export function receiveRecallConfirmationConfirmApi(ids) {
  return request({
    url: `/api/fms-service/omc/fms/settlement/order/confirmation/withdraw`,
    method: 'post',
    data: {
      confirmationIds: ids
    }
  })
}

// 获取查询-费用确认单列表-详情 单个
export function getReceiveConfirmationDetailByIdApi(id) {
  return request({
    url: `/api/fms-service/omc/fms/settlement/order/confirmation/detail/id/${id}`,
    method: 'get'
  })
}

// 获取结算单据-费用确认单-获取费用确认单详情
// 入参订单号
export function getReceiveConfirmationDetailApi(entityNo) {
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

// 应收-获取账单号-加入账单
export function getReceiptBillNoApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/bill/ar/list/nopage`,
    method: 'get',
    params
  })
}

// 应收费用明细-加入账单
export function receiveChargeJoinBillApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/entry`,
    method: 'post',
    data
  })
}

// 应收费用明细-移出账单
export function receiveChargeRemoveFromBillApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/entry/cancel`,
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

// 应收费用明细-生成账单
export function receiveChargeCreateBillApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/bill/ar/create/chargeids`,
    method: 'post',
    data
  })
}

// 应收费用确认单-生成账单
export function receiveConfirmationCreateBillApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/bill/ar/create/confirmationids`,
    method: 'post',
    data
  })
}

// 应收费用明细-变更对账主体
export function changeChargeSettlementCheckPrincipalApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/settlement/order/change/checkPrincipal`,
    method: 'put',
    data
  })
}

// 应收费用确认单-变更对账主体
export function changeConfirmationSettlementCheckPrincipalApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/settlement/order/change/checkPrincipal/confirmation`,
    method: 'put',
    data
  })
}

// 查询-账单列表状态数量
export function getBillStatusNumberApi(countType) {
  return request({
    url: `/api/fms-service/omc/fms/bill/ar/count/${countType}`,
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

// 标记核销-账单
export function markClearedBillApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/mark/cleared/bill`,
    method: 'post',
    data
  })
}

// 标记开票-账单
export function markInvoicedBillApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/mark/invoiced/bill`,
    method: 'post',
    data
  })
}

// 标记核销-费用确认单
export function markClearedConfirmationApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/mark/cleared/confirmation`,
    method: 'post',
    data
  })
}

// 标记开票-费用确认单
export function markInvoicedConfirmationApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/mark/invoiced/confirmation`,
    method: 'post',
    data
  })
}

// 标记核销-费用明细
export function markClearedChargeApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/mark/cleared`,
    method: 'post',
    data
  })
}

// 标记核销-费用明细-取消核销
export function cancelClearedReceiveChargeApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/cancel/cleared`,
    method: 'post',
    data
  })
}

// 标记开票-费用明细
export function markInvoicedChargeApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/mark/invoiced`,
    method: 'post',
    data
  })
}

// 盈亏审核-账期
export function getProfitPeriodListApi() {
  return request({
    url: `/api/fms-service/fms/profit/period/list`,
    method: 'get'
  })
}

// 盈亏审核-标记
export function markProfitApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/mark/profit`,
    method: 'post',
    data
  })
}

// 部分核销
export function clearPartApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/mark/cleared/part`,
    method: 'post',
    data
  })
}

// 查询-费用列表-导出excel-ar
export function receiveChargeExportExcelApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/ar/list/export/excel`,
    method: 'put',
    data
  })
}

// 查询-账单列表-导出excel-ar
export function receiveBillExportExcelApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/bill/ar/list/export/excel`,
    method: 'put',
    data
  })
}

// 公共-获取近半年账期
export function getPeriodListApi(settlementMode) {
  return request({
    url: `/api/fms-service/fms/bill/period/list/${settlementMode}`,
    method: 'get'
  })
}

// 费用明细列表进行导出费用明细
export function receiveChargeExportSearchApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/ar/list/export/easy/excel`,
    method: 'put',
    data
  })
}

// 费用明细 多单号查询
export function getReceiveChargeMultipleSearchApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/ar/multipleNos/list`,
    method: 'put',
    data
  })
}

// 费用明细 多单号查询 合计金额
export function getReceiveChargeMultipleTotalApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/ar/multipleNos/list/total`,
    method: 'put',
    data
  })
}

// 费用明细列表 不分页
export function getReceiveChargeListALlApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/ar/list/nopage`,
    method: 'POST',
    data
  })
}

// 发送账单 获取模板
export function getBillEmailTemplateApi() {
  return request({
    url: `/api/fms-service/omc/fms/bill/email/templates`,
    method: 'get'
  })
}

// 发送账单 （chargeDirect ar 应收 ap 应付）
export function sendReceiveBillEmailApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/bill/ar/list/email/send`,
    method: 'put',
    data
  })
}

// 根据查询结果进行批量发送账单 （chargeDirect ar 应收 ap 应付）
export function sendReceiveBillEmailBySearchApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/bill/ar/email/push/batch/cond`,
    method: 'put',
    data
  })
}

// 根据Ids进行批量发送账单 （chargeDirect ar 应收 ap 应付）
export function sendReceiveBillEmailByIdsApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/bill/ar/email/push/batch/ids`,
    method: 'put',
    data
  })
}

// 账单-查询对应的申请开票的默认值（专票还是普票）
export function getInvoiceTypeDefaultByBillApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/bill/invoice/type/default`,
    method: 'POST',
    data
  })
}

// 费用明细-查询对应的申请开票的默认值（专票还是普票）
export function getInvoiceTypeDefaultByChargeApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/invoice/type/default`,
    method: 'POST',
    data
  })
}

// 费用确认单-查询对应的申请开票的默认值（专票还是普票）
export function getInvoiceTypeDefaultByConfirmationApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/confirmation/invoice/type/default`,
    method: 'POST',
    data
  })
}

// 应收账单-获取配置的发送账单邮箱
export function getBillSendEmailApi(data) {
  return request({
    url: `/api/fms-service/fin/settlement/title/config/memberId/${data.memberId}/businessType/${data.businessType}/billEmail`,
    method: 'get'
  })
}


// 账单确认单-内部确认-撤回确认
export function recallBillInnerConfirmApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/bill/${params.billId}/confirmBill/withdraw`,
    method: 'POST',
    params
  })
}
