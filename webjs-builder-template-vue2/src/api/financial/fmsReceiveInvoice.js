import request from '@/utils/request'

// 税票
// 税票申请--申请人-初始化 第一步
export function invoiceApplyTaxInitApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/tax/init`,
    method: 'post',
    data
  })
}

// 申请开票 根据费用id 获取费用
export function getInvoiceChargeByChargeApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/ar/list/invoiceapply`,
    method: 'post',
    data
  })
}


// 申请开票 根据费用确认单id 获取费用
export function getInvoiceChargeByConfirmationApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/ar/list/invoiceapply/confirmation`,
    method: 'post',
    data
  })
}


// 申请开票 根据账单id 获取费用
export function getInvoiceChargeByBillApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/ar/list/invoiceapply/bill`,
    method: 'post',
    data
  })
}

// 税票申请-申请人-提交
export function invoiceApplyTaxSubmitApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/tax/submit`,
    method: 'post',
    data
  })
}

// 查询-税票申请-申请人-列表-待开票
export function getApplyTaxToInvoiceListByOperatorApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/tax/applier/toinvoice/list`,
    method: 'get',
    params
  })
}

// 查询-税票申请-申请人-列表-待开票-合计
export function getApplyTaxToInvoiceTotalByOperatorApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/tax/applier/toinvoice/total`,
    method: 'get',
    params
  })
}

// 查询-税票申请-申请人-列表-已撤回
export function getApplyTaxRecallInvoiceListByOperatorApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/tax/applier/nullified/list`,
    method: 'get',
    params
  })
}

// 查询-税票申请-申请人-列表-已撤回-合计
export function getApplyTaxRecallInvoiceTotalByOperatorApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/tax/applier/nullified/total`,
    method: 'get',
    params
  })
}

// 查询-税票申请-申请人-列表-已开票
export function getApplyTaxInvoicedListByOperatorApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/tax/applier/invoiced/list`,
    method: 'get',
    params
  })
}


// 查询-税票申请-申请人-列表-已开票-合计
export function getApplyTaxInvoicedTotalByOperatorApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/tax/applier/invoiced/total`,
    method: 'get',
    params
  })
}

// 查询-税票申请-申请人-列表-已开票-全部-商务
export function getApplyTaxInvoicedListByBusinessApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/tax/all/applier/invoiced/list`,
    method: 'get',
    params
  })
}


// 查询-税票申请-申请人-列表-已开票-合计-全部-商务
export function getApplyTaxInvoicedTotalByBusinessApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/tax/all/applier/invoiced/total`,
    method: 'get',
    params
  })
}

// 查询-税票-申请人-税票列表
export function getTaxInvoicedListByOperatorApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/applier/invoiced/list`,
    method: 'get',
    params
  })
}

// 查询-税票-申请人-税票列表-合计
export function getTaxInvoicedTotalByOperatorApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/applier/invoiced/total`,
    method: 'get',
    params
  })
}

// 查询-税票-申请人-税票列表--全部-商务
export function getTaxInvoicedListByBusinessApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/all/applier/invoiced/list`,
    method: 'get',
    params
  })
}

// 查询-税票-申请人-税票列表-合计--全部-商务
export function getTaxInvoicedTotalByBusinessApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/all/applier/invoiced/total`,
    method: 'get',
    params
  })
}

// 查询-税票申请-申请人-待办数量
export function getTaxApplyInvoiceStatusNumberApi() {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/tax/applier/todo/count`,
    method: 'get'
  })
}

// 查询-税票申请-详情
export function getApplyTaxDetailApi(id) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/tax/detail/${id}`,
    method: 'get'
  })
}

// 税票申请列表-财务-作废
export function applyInvoiceTaxRecallApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/tax/nullify`,
    method: 'post',
    data
  })
}

// 查询-税票申请-开票人-财务-列表-待开票
export function getApplyTaxToInvoiceListByFinanceApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/tax/drawer/toinvoice/list`,
    method: 'get',
    params
  })
}

// 查询-税票申请-开票人-财务-列表-待开票-合计
export function getApplyTaxToInvoiceTotalByFinanceApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/tax/drawer/toinvoice/total`,
    method: 'get',
    params
  })
}

// 查询-税票列表-财务-待提交税控
export function getTaxToInvoiceListByFinanceApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/drawer/toinvoice/list`,
    method: 'get',
    params
  })
}

// 查询-税票列表-财务-待提交税控-合计
export function getTaxToInvoiceTotalByFinanceApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/drawer/toinvoice/total`,
    method: 'get',
    params
  })
}

// 查询-税票-开票人-列表-税控异常
export function getTaxInvoiceExceptListByFinanceApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/drawer/except/list`,
    method: 'get',
    params
  })
}


// 查询-税票-开票人-列表-税控异常-合计
export function getTaxInvoiceExceptTotalByFinanceApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/drawer/except/total`,
    method: 'get',
    params
  })
}

// 查询-税票-开票人-列表-推送异常
export function getTaxInvoiceSendExceptListByFinanceApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/drawer/push/except/list`,
    method: 'get',
    params
  })
}


// 查询-税票-开票人-列表-推送异常-合计
export function getTaxInvoiceSendExceptTotalByFinanceApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/drawer/push/except/total`,
    method: 'get',
    params
  })
}

// 查询-税票-开票人-列表-待回传
export function getTaxInvoiceTouploadListByFinanceApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/drawer/toupload/list`,
    method: 'get',
    params
  })
}

// 查询-税票-开票人-列表-待回传-合计
export function getTaxInvoiceTouploadTotalByFinanceApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/drawer/toupload/total`,
    method: 'get',
    params
  })
}

// 查询-税票-开票人-列表-开票完成- 税控列表
export function getTaxInvoicedListByFinanceApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/drawer/invoiced/list`,
    method: 'get',
    params
  })
}

// 查询-税票-开票人-列表-开票完成- 税控列表-合计
export function getTaxInvoicedTotalByFinanceApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/drawer/invoiced/total`,
    method: 'get',
    params
  })
}

// 查询-税票-开票人-列表- 已开票
export function getApplyTaxInvoicedListByFinanceApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/tax/drawer/invoiced/list`,
    method: 'get',
    params
  })
}

// 查询-税票-开票人-列表- 已开票- 合计
export function getApplyTaxInvoicedTotalByFinanceApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/tax/drawer/invoiced/total`,
    method: 'get',
    params
  })
}

// 查询-税票-开票人(申请)-待办数量
export function getApplyTaxInvoiceNumberByFinanceApi() {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/tax/drawer/todo/count`,
    method: 'get'
  })
}

// 查询-税票-开票人(发票)-待办数量
export function getTaxInvoiceNumberByFinanceApi() {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/drawer/todo/count`,
    method: 'get'
  })
}

// 税票-发票的文件预览
export function getTaxInvoiceFilesApi(id) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/files/view/${id}`,
    method: 'get'
  })
}

// 税票-发票的预览详情
export function getTaxInvoiceDetailApi(id) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/detail/${id}`,
    method: 'get'
  })
}

// 税票-发票的-进行编辑-再次提交
export function taxInvoiceSaveApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/save`,
    method: 'post',
    data
  })
}

// 查询-税票申请-相应的费用列表- 明细
export function getApplyTaxDetailChargeListApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/charge/list`,
    method: 'get',
    params
  })
}

// 查询-发票-相应的费用列表- 明细
export function getInvoiceDetailChargeListApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/charge/list`,
    method: 'get',
    params
  })
}

// 税票-开票人-预创建
export function invoiceTaxPrecreateApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/precreate`,
    method: 'POST',
    data
  })
}

// 税票-开票人-创建
export function invoiceTaxCreateApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/create`,
    method: 'POST',
    data
  })
}

// 税票-开票人-提交税控
export function invoiceTaxToSubmitApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/invoice`,
    method: 'POST',
    data
  })
}

// 税票-开票人- 打印发票
export function invoiceTaxPrintApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/print`,
    method: 'POST',
    data
  })
}


// 税票-开票人-回传单号
export function invoiceTaxExpressNoApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/expressno/record`,
    method: 'POST',
    data
  })
}

// 税票-开票人-上传文件
export function invoiceTaxFileUploadApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/file/upload`,
    method: 'POST',
    data
  })
}


// 税票-开票人- 开具红冲 - 预生成
export function invoiceTaxReversePrecreateApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/reverse/precreate`,
    method: 'POST',
    data
  })
}

// 税票-开票人- 开具红冲 - 创建红冲
export function invoiceTaxReverseCreateApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/reverse/create`,
    method: 'POST',
    data
  })
}

// 税票-开票人- 开具红冲 - 提交税控红冲
export function invoiceTaxReverseSubmitApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/reverse`,
    method: 'POST',
    data
  })
}

// 税票-开票人-待提交税控-可撤回
export function invoiceTaxCancelApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/cancel`,
    method: 'POST',
    data
  })
}

// 税票-开票人-作废发票
export function invoiceTaxNullifyApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/nullify`,
    method: 'POST',
    data
  })
}

// 税票-批量下载发票
export function invoiceTaxDownloadFilesApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/files/download/batch`,
    method: 'POST',
    data
  })
}

// 税票-批量下载文件
export function invoiceTaxDownloadFilesBySelectApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/files/specified/download/batch`,
    method: 'POST',
    data
  })
}


// 税票-批量下载发票-单个发票对应的选择类型批量下载
export function invoiceTaxDownloadFilesByIdApi(id, data) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/files/download/${id}`,
    method: 'POST',
    data
  })
}

// 税票-已申请开票-对应的查看发票
export function applyInvoiceTaxFilesApi(invoiceApplyId) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/applier/list/${invoiceApplyId}`,
    method: 'get'
  })
}


// 税票-开票人-取消红冲
export function invoiceTaxReverseCancelApi(id) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/reverse/cancel/${id}`,
    method: 'post'
  })
}

// 税票-开票人-取消作废
export function invoiceTaxNullifyCancelApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/nullify/cancel`,
    method: 'post',
    data
  })
}

// 以下都是形式发票
// 以下都是形式发票
// 以下都是形式发票
// 以下都是形式发票
// 以下都是形式发票
// 以下都是形式发票
// 形票申请-申请人-初始化 第一步
export function invoiceApplyCommercialInitApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/commercial/init`,
    method: 'post',
    data
  })
}

// 形票申请-申请人-提交
export function invoiceApplyCommercialSubmitApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/commercial/submit`,
    method: 'post',
    data
  })
}


// 查询-形票申请-申请人-待办数量
export function getCommercialApplyInvoiceStatusNumberApi() {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/commercial/applier/todo/count`,
    method: 'get'
  })
}


// 查询-形票申请-申请人-列表-待开票
export function getApplyCommercialToInvoiceListByOperatorApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/commercial/applier/toinvoice/list`,
    method: 'get',
    params
  })
}

// 查询-形票申请-申请人-列表-待开票-合计
export function getApplyCommercialToInvoiceTotalByOperatorApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/commercial/applier/toinvoice/total`,
    method: 'get',
    params
  })
}

// 查询-形票申请-详情
export function getApplyCommercialDetailApi(id) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/commercial/detail/${id}`,
    method: 'get'
  })
}

// 查询-形票申请-申请人-列表-已作废
export function getApplyCommercialNullfiedListByOperatorApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/commercial/applier/nullified/list`,
    method: 'get',
    params
  })
}

// 查询-形票申请-申请人-列表-已作废-合计
export function getApplyCommercialNullfiedTotalByOperatorApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/commercial/applier/nullified/total`,
    method: 'get',
    params
  })
}

// 查询-形票申请-申请人-列表-已开票
export function getApplyCommercialInvoicedListByOperatorApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/commercial/applier/invoiced/list`,
    method: 'get',
    params
  })
}

// 查询-形票申请-申请人-列表-已开票-合计
export function getApplyCommercialInvoicedTotalByOperatorApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/commercial/applier/invoiced/total`,
    method: 'get',
    params
  })
}

// 查询-形票申请-申请人-列表-已开票-全部-商务
export function getApplyCommercialInvoicedListByBusinessApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/commercial/all/applier/invoiced/list`,
    method: 'get',
    params
  })
}

// 查询-形票申请-申请人-列表-已开票-合计-全部-商务
export function getApplyCommercialInvoicedTotalByBusinessApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/commercial/all/applier/invoiced/total`,
    method: 'get',
    params
  })
}

// 查询-形票-申请人- 形票列表
export function getCommercialInvoicedListByOperatorApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/commercial/applier/invoiced/list`,
    method: 'get',
    params
  })
}

// 查询-形票-申请人- 形票列表-合计
export function getCommercialInvoicedTotalByOperatorApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/commercial/applier/invoiced/total`,
    method: 'get',
    params
  })
}


// 查询-形票-申请人- 形票列表-全部-商务
export function getCommercialInvoicedListByBusinessApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/commercial/all/applier/invoiced/list`,
    method: 'get',
    params
  })
}

// 查询-形票-申请人- 形票列表-合计-全部-商务
export function getCommercialInvoicedTotalByBusinessApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/commercial/all/applier/invoiced/total`,
    method: 'get',
    params
  })
}

// 查询-形票列表-财务-推送异常
export function getCommercialInvoiceSendExceptListByFinanceApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/commercial/drawer/push/except/list`,
    method: 'get',
    params
  })
}

// 查询-形票列表-财务-推送异常
export function getCommercialInvoiceSendExceptTotalByFinanceApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/commercial/drawer/push/except/total`,
    method: 'get',
    params
  })
}


// 查询-形票列表-财务-待回传
export function getCommercialInvoiceTouploadListByFinanceApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/commercial/drawer/toupload/list`,
    method: 'get',
    params
  })
}

// 查询-形票列表-财务-待回传-合计
export function getCommercialInvoiceTouploadTotalByFinanceApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/commercial/drawer/toupload/total`,
    method: 'get',
    params
  })
}

// 查询-形票-开票人(申请)-待办数量
export function getApplyCommercialInvoiceNumberByFinanceApi() {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/commercial/drawer/todo/count`,
    method: 'get'
  })
}

// 查询-形票-开票人(发票)-待办数量
export function getCommercialInvoiceNumberByFinanceApi() {
  return request({
    url: `/api/fms-service/omc/fms/invoice/commercial/drawer/todo/count`,
    method: 'get'
  })
}


// 查询-形票-开票人-列表-开票完成- 形票列表
export function getCommercialInvoicedListByFinanceApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/commercial/drawer/invoiced/list`,
    method: 'get',
    params
  })
}

// 查询-形票-开票人-列表-开票完成- 形票列表-合计
export function getCommercialInvoicedTotalByFinanceApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/commercial/drawer/invoiced/total`,
    method: 'get',
    params
  })
}

// 查询-形票-开票人-列表- 已开票
export function getApplyCommercialInvoicedListByFinanceApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/commercial/drawer/invoiced/list`,
    method: 'get',
    params
  })
}

// 查询-形票-开票人-列表- 已开票-合计
export function getApplyCommercialInvoicedTotalByFinanceApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/commercial/drawer/invoiced/total`,
    method: 'get',
    params
  })
}

// 形票-开票人-回传单号
export function invoiceCommercialExpressNoApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/commercial/expressno/record`,
    method: 'POST',
    data
  })
}

// 形票-开票人-上传文件
export function invoiceCommercialFileUploadApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/commercial/file/upload`,
    method: 'POST',
    data
  })
}


// 形票-发票的文件预览
export function getCommercialInvoiceFilesApi(id) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/commercial/files/view/${id}`,
    method: 'get'
  })
}


// 形票-批量下载发票
export function invoiceCommercialDownloadFilesApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/commercial/files/download/batch`,
    method: 'POST',
    data
  })
}

// 形票-批量下载文件
export function invoiceCommercialDownloadFilesBySelectApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/commercial/files/specified/download/batch`,
    method: 'POST',
    data
  })
}

// 形票-批量下载发票-单个发票对应的选择类型批量下载
export function invoiceCommercialDownloadFilesByIdApi(id, data) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/commercial/files/download/${id}`,
    method: 'POST',
    data
  })
}

// 形票-开票人-已开票的申请-》作废申请-<
export function applyInvoiceCommercialNullifyApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/commercial/nullify`,
    method: 'POST',
    data
  })
}

// 形票-已申请开票-对应的查看发票
export function applyInvoiceCommercialFilesApi(invoiceApplyId) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/commercial/applier/list/${invoiceApplyId}`,
    method: 'get'
  })
}


// 税票-查看发票
export function getInvoiceTaxInvoiceFileApi(invoiceId) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/files/view/invoice/${invoiceId}`,
    method: 'get'
  })
}


// 形票-查看发票
export function getInvoiceCommercialInvoiceFileApi(invoiceId) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/commercial/files/view/invoice/${invoiceId}`,
    method: 'get'
  })
}


// 分公司-获取形票抬头
export function getOfficeTitleApiCommercialApi(id) {
  return request({
    url: `/api/fms-service/fms/office/title/commercial/${id}`,
    method: 'get'
  })
}


// 税票获取 结算单位 对应的结算抬头信息
export function getMemberTitleApiTaxApi(data) {
  return request({
    url: `/api/fms-service/fms/member/title/tax/${data.settlementCompanyId}`,
    method: 'get',
    data
  })
}

// 发送账单-邮箱下拉
export function getSendBillEmailListListApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/settlement/linkman/sendbill/selects`,
    method: 'get',
    params
  })
}

// 发送账单-邮箱-设置默认
export function setSendBillEmailDefaultApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/settlement/linkman/sendbill/${params.seqNo}/mark/default`,
    method: 'put',
    params
  })
}

// 发送账单-邮箱 取消默认
export function setSendBillEmailRemoveDefaultApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/settlement/linkman/sendbill/${params.seqNo}/cancel/default`,
    method: 'put',
    params
  })
}

// 发送账单-邮箱 删除
export function setSendBillEmailDeleteApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/settlement/linkman/sendbill/${params.seqNo}`,
    method: 'delete',
    params
  })
}


// 申请开票收件人-下拉
export function getApplyInvoiceConsigneeListApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/settlement/linkman/invoiceapply/recipients/selects`,
    method: 'get',
    params
  })
}

// 申请开票收件人-设置默认
export function setApplyInvoiceConsigneeDefaultApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/settlement/linkman/invoiceapply/recipients/${params.seqNo}/mark/default`,
    method: 'PUT',
    params
  })
}

// 申请开票收件人-取消默认
export function setApplyInvoiceConsigneeRemoveDefaultApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/settlement/linkman/invoiceapply/recipients/${params.seqNo}/cancel/default`,
    method: 'PUT',
    params
  })
}

// 申请开票收件人- 删除
export function setApplyInvoiceConsigneeDeleteApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/settlement/linkman/invoiceapply/recipients/${params.seqNo}`,
    method: 'DELETE',
    params
  })
}


// 申请开票-通知客户-下拉
export function getApplyInvoiceNotifyCustomerListApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/settlement/linkman/invoiceapply/customernotify/selects`,
    method: 'get',
    params
  })
}

// 申请开票收件人-设置默认
export function setApplyInvoiceNotifyCustomerDefaultApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/settlement/linkman/invoiceapply/customernotify/${params.seqNo}/mark/default`,
    method: 'PUT',
    params
  })
}

// 申请开票收件人-取消默认
export function setApplyInvoiceNotifyCustomerRemoveDefaultApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/settlement/linkman/invoiceapply/customernotify/${params.seqNo}/cancel/default`,
    method: 'PUT',
    params
  })
}

// 申请开票收件人- 删除
export function setApplyInvoiceNotifyCustomerDeleteApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/settlement/linkman/invoiceapply/customernotify/${params.seqNo}`,
    method: 'DELETE',
    params
  })
}

// 形票- 推送失败后 - 重新推送
export function resendEmailCommercialInvoiceApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/commercial/send/invoiced/email/retry`,
    method: 'get',
    params
  })
}

// 税票- 推送失败后 - 重新推送
export function resendEmailTaxInvoiceApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/send/invoiced/email/retry`,
    method: 'get',
    params
  })
}

// 税票-开票人-推送异常-重新推送
export function resendTaxInvoiceApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/batch/send/invoiced/email/retry`,
    method: 'put',
    data
  })
}

// 形票-开票人-推送异常-重新推送
export function resendCommercialInvoiceApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/commercial/batch/send/invoiced/email/retry`,
    method: 'put',
    data
  })
}


// 税票申请-拆分申请-获取币种
export function getInvoiceApplyTaxSplitCurrencyApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoiceapply/tax/allow/withdraw/currency/selects`,
    method: 'get',
    params
  })
}

// 税票申请-拆分申请
export function invoiceApplyTaxSplitApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/invoice/tax/split/apply`,
    method: 'post',
    params
  })
}
