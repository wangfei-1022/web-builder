import request from '@/utils/request'

// 收款-列表-待认领（完成）
export function getTransactionsReceiptListToclaimApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/transactions/receipt/list/toclaim`,
    method: 'get',
    params
  })
}

// 收款-列表-待认领-合计
export function getTransactionsReceiptListToclaimTotalApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/transactions/receipt/total/toclaim`,
    method: 'get',
    params
  })
}

// 收款-列表-全部（完成）
export function getTransactionsReceiptListApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/transactions/receipt/list/treasurer`,
    method: 'get',
    params
  })
}

// 收款-列表-我的认领（完成）
export function getTransactionsReceiptMyListApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/transactions/receipt/list/claimer`,
    method: 'get',
    params
  })
}

// 收款-列表-结算-全部认领（完成）
export function getTransactionsReceiptListAllApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/transactions/receipt/list/settler`,
    method: 'get',
    params
  })
}


// 收款-列表-结算-认领管理-全部认领-导出
export function exportClaimListAllApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/transactions/receipt/claim/list/export/easy/excel`,
    method: 'post',
    data
  })
}


// 收款-获取分公司收款账户(完成)
export function getYHTReceiptAccountApi(id) {
  return request({
    url: `/api/fms-service/fms/office/collect/account/${id}`,
    method: 'get'
  })
}

// 收款-获取所有分公司收款账户
export function getYHTReceiptAccountAllApi() {
  return request({
    url: `/api/fms-service/fms/office/collect/account/all`,
    method: 'get'
  })
}

// 收款-获取所有分公司收款账户归类
export function getYHTReceiptCategoryAllApi() {
  return request({
    url: `/api/fms-service/fms/office/collect/category/all`,
    method: 'get'
  })
}

// 收款-获取第三方支付平台（完成）
export function getThirdPartyPaymentApi(id) {
  return request({
    url: `/api/fms-service/fms/office/third/party/payment/${id}`,
    method: 'get'
  })
}

// 收款-登记(完成)
export function transactionReceiptRecordApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/wallet/transaction/record`,
    method: 'post',
    data
  })
}

// 收款-撤回
export function transactionReceiptCancelApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/transactions/receipt/cancel`,
    method: 'post',
    data
  })
}

// 收款-撤回认领
export function transactionReceiptCancelClaimApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/transactions/receipt/claim/cancel`,
    method: 'post',
    data
  })
}

// 收款-认领
export function transactionReceiptClaimApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/transactions/receipt/claim`,
    method: 'post',
    data
  })
}

// 根据多个认领Id 去查对应的详情
export function getTransactionReceiptClaimByIdsApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/transactions/receipt/list/ids`,
    method: 'post',
    data
  })
}

// 收款-详情
export function getTransactionReceiptDetailApi(id) {
  return request({
    url: `/api/fms-service/omc/fms/transactions/receipt/detail/${id}`,
    method: 'get'
  })
}


// 收款-我的认领-详情
export function getTransactionClaimerDetailApi(id) {
  return request({
    url: `/api/fms-service/omc/fms/transactions/receipt/detail/claim/${id}`,
    method: 'get'
  })
}


// 关联-获取待关联收款信息（完成）
export function getRelativeTransactionReceiptListApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/transactions/receipt/list/uninstruction`,
    method: 'get',
    params
  })
}

// 导入
export function walletTransactionImportApi(data) {
  return request({
    url: `/api/fms-service//omc/fms/wallet/transaction/import`,
    method: 'post',
    data
  })
}

// 导出
export function walletTransactionExportApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/transactions/receipt/list/export/easy/excel`,
    method: 'post',
    data
  })
}

// 批量认领初始化-获取收款信息
export function getTransactionInfoArrApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/transactions/receipt/claim/batch/init`,
    method: 'post',
    data
  })
}

// 批量认领-提交
export function submitTransactionInfoArrApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/transactions/receipt/claim/batch`,
    method: 'post',
    data
  })
}

// 收款-根据名称获取会员信息
export function getSettlementInfoByName(params) {
  return request({
    url: `/api/fms-service/fms/member/loose/name`,
    method: 'get',
    params
  })
}

// 查询-收款核销明细-列表
export function getTransactionClearInfoApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/clear/charge/list/by/transactions`,
    method: 'get',
    params
  })
}

// 查询-收款核销明细-列表-合计
export function getTransactionClearInfoTotalApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/clear/charge/total/by/transactions`,
    method: 'get',
    params
  })
}

// 查询-认领核销明细-列表
export function getClaimClearInfoApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/clear/charge/list/by/claim`,
    method: 'get',
    params
  })
}

// 查询-认领核销明细-列表-合计
export function getClaimClearInfoTotalApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/clear/charge/total/by/claim`,
    method: 'get',
    params
  })
}


// 查询-收款核销明细-列表-充值核销详情
export function getTransactionRechargeClearInfoApi(params) {
  return request({
    url: `/api/fms-service/v2/omc/recharge/clear/list/by/transactions`,
    method: 'get',
    params
  })
}

// 查询-收款核销明细-列表-充值核销详情-合计
export function getTransactionRechargeClearInfoTotalApi(params) {
  return request({
    url: `/api/fms-service/v2/omc/recharge/clear/total/by/transactions`,
    method: 'get',
    params
  })
}

// 查询-认领核销明细-列表-充值核销详情
export function getClaimRechargeClearInfoApi(params) {
  return request({
    url: `/api/fms-service/v2/omc/recharge/clear/list/by/claims`,
    method: 'get',
    params
  })
}

// 查询-认领核销明细-列表-充值核销详情-合计
export function getClaimRechargeClearInfoTotalApi(params) {
  return request({
    url: `/api/fms-service/v2/omc/recharge/clear/total/by/claim`,
    method: 'get',
    params
  })
}
