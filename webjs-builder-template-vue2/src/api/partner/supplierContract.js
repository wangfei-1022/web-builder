import request from '@/utils/request'

// 合同列表-结算抬头状态
export function getSettlementTitleStatusListApi(params) {
  return request({
    url: 'api/cms-service/cms/contract/payment/settlementCompanyStatusType/selections',
    method: 'get',
    params
  })
}

// 合同列表-附件类型
export function getAttachmentTypeListApi(params) {
  return request({
    url: '/api/cms-service/omc/cms/contract/payment/file/type/list',
    method: 'get',
    params
  })
}

// 合同列表
export function getContractListApi(params) {
  return request({
    url: '/api/cms-service/omc/cms/contract/pages',
    method: 'get',
    params
  })
}

// 合同名称
export function getContractNameListApi() {
  return request({
    url: '/api/mdm-service/dmn/term/item/dropdownlist',
    method: 'get',
    params: { termCode: 'CONTRACT_NAME' }
  })
}

// 业务类型
export function getBusinessTypeListApi() {
  return request({
    url: '/api/mdm-service/dmn/term/item/dropdownlist',
    method: 'get',
    params: { termCode: 'BUSINESS_TYPE' }
  })
}

// 合同类型
export function getContractReceiveTypeListApi() {
  return request({
    url: '/api/cms-service/cms/contract/contractType/receipt/selections',
    method: 'get'
  })
}

// 合同类型
export function getContractPaymentTypeListApi() {
  return request({
    url: '/api/cms-service/cms/contract/contractType/payment/selections',
    method: 'get'
  })
}

// 合同状态
export function getContractStatusListApi() {
  return request({
    url: '/api/cms-service/cms/contract/contractStatusType/selections',
    method: 'get'
  })
}

// 所属销售
export function getSalesApi() {
  return request({
    url: '/api/sys-service/sys/user/selections/sales',
    method: 'get'
  })
}

// 所属产品
export function getProductApi() {
  return request({
    url: '/api/sys-service/sys/user/selections/productManager',
    method: 'get'
  })
}

// 所属销售/产品
export function getSalesAndProductApi() {
  return request({
    url: '/api/sys-service/sys/user/selections/salesAndProductManager',
    method: 'get'
  })
}

// 一海通签约主体
export function getYHTListApi() {
  return request({
    url: '/api/sys-service/sys/office/dropdownlist',
    method: 'get'
  })
}

// 客户签约主体
export function getCustomerListApi() {
  return request({
    url: '/api/crm-service/crm/customer/selections',
    method: 'get'
  })
}

// 客户签约人
export function getCustomerSignListApi(id) {
  return request({
    url: `/api/crm-service/crm/customer/${id}/linkman/selections`,
    method: 'get'
  })
}

// 收款合同-结算抬头类型
export function getReceiveSettlementCompanyTitleTypeApi() {
  return request({
    url: `/api/cms-service/cms/contract/settlementCompanyTitleType/selections`,
    method: 'get'
  })
}

// 校验合同唯一
export function checkSupplierContractNoIsUniqueApi(params) {
  return request({
    url: `/api/cms-service/omc/cms/contract/supplier/exists`,
    method: 'get',
    params
  })
}

// 对账模式
export function getStatementModeApi(data) {
  return request({
    url: `/api/cms-service/cms/contract/selections/statementMode`,
    method: 'get'
  })
}

// 出账模式
export function getBillModeApi(data) {
  return request({
    url: `/api/cms-service/cms/contract/selections/billMode`,
    method: 'get'
  })
}

// 开票模式
export function getInvoiceModeApi(data) {
  return request({
    url: `/api/cms-service/cms/contract/selections/invoiceMode`,
    method: 'get'
  })
}

// 付款模式
export function getPayModeApi(data) {
  return request({
    url: `/api/cms-service/cms/contract/selections/payMode`,
    method: 'get'
  })
}

// 收款模式
export function getReceiptModeApi(data) {
  return request({
    url: `/api/cms-service/cms/contract/selections/receiptMode`,
    method: 'get'
  })
}

// 结算模式
export function getRechargeModeApi(data) {
  return request({
    url: `/api/cms-service/cms/contract/selections/rechargeMode`,
    method: 'get'
  })
}

// 根据名字检索出会员列表。供结算主体选择
export function getSettlementListByNameApi(data) {
  return request({
    url: `/api/member-service/omc/member/user/byNameOrId/thirdPartyOrMember/enterprise`,
    method: 'get'
  })
}

// 试单合同初始化
export function contractTrialInitApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/contract/trial`,
    method: 'post',
    data
  })
}

// 试单合同提交
export function contractTrialSubmitApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/contract/trial/submit/${data.id}`,
    method: 'post',
    data
  })
}


// 收款票结合同初始化
export function contractReceivePieceInitApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/contract/receipt/piece`,
    method: 'post',
    data
  })
}

// 付款票结合同初始化
export function contractPaymentPieceInitApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/contract/payment/piece`,
    method: 'post',
    data
  })
}

// 收款票结合同提交
export function contractReceivePieceSubmitApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/contract/receipt/piece/submit/${data.id}`,
    method: 'post',
    data
  })
}

// 付款票结合同提交
export function contractPaymentPieceSubmitApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/contract/payment/piece/submit/${data.id}`,
    method: 'post',
    data
  })
}

// 收款合同保存草稿
export function contractReceiptSaveDraftApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/contract/receipt/draft`,
    method: 'post',
    data
  })
}

// 收款合同草稿更新
export function contractReceiptUpdateDraftApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/contract/receipt/draft/${data.id}`,
    method: 'put',
    data
  })
}

// 收款合同-保存草稿-供应商
export function contractReceiptSupplierSaveDraftApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/contract/supplier/receipt/draft`,
    method: 'post',
    data
  })
}


// 收款合同保存提交
export function contractReceiptSubmitApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/contract/receipt/submit`,
    method: 'post',
    data
  })
}

// 收款合同保存提交-供应商
export function contractReceiptSupplierSubmitApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/contract/supplier/receipt/submit`,
    method: 'post',
    data
  })
}

// 收款合同提交更新
export function contractReceiptUpdateSubmitApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/contract/receipt/submit/${data.id}`,
    method: 'put',
    data
  })
}

// 收款合同详情
export function getReceiptContractDetailApi(id) {
  return request({
    url: `/api/cms-service/omc/cms/contract/receipt/detail/${id}`,
    method: 'get'
  })
}

// 获取子合同树
export function getContractChildrenListApi(mainContractId) {
  return request({
    url: `/api/cms-service/omc/cms/contract/subContract/${mainContractId}`,
    method: 'get'
  })
}

// 收款合同子合同初始化
export function receiptChildrenContractInitApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/contract/receipt/sub`,
    method: 'post',
    data
  })
}

// 收款合同子合同提交
export function receiptChildrenContractSubmitApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/contract/receipt/submit/sub/${data.id}`,
    method: 'post',
    data
  })
}

// 收款合同子合同提交
export function deleteContractApi(id) {
  return request({
    url: `/api/cms-service/omc/cms/contract/${id}`,
    method: 'delete'
  })
}

// 获取结算信息
export function getSettlementInfoApi(data) {
  return request({
    url: `/api/member-service/cms/settlement/company/${data.settlementCompanyId}/${data.rechargeCurrency}/${data.bankAccount}/title`,
    method: 'get'
  })
}

// 新增结算抬头-收款
export function addReceiveSettlementInfoApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/customer/title`,
    method: 'post',
    data
  })
}

// 编辑结算抬头-收款
export function editReceiveSettlementInfoApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/customer/title/${data.id}`,
    method: 'put',
    data
  })
}

// 删除结算抬头-收款
export function deleteReceiveSettlementInfoApi(id) {
  return request({
    url: `/api/cms-service/omc/cms/customer/title/${id}`,
    method: 'delete'
  })
}


// 新增结算抬头-付款
export function addPaymentSettlementInfoApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/supplier/title`,
    method: 'post',
    data
  })
}

// 编辑结算抬头-付款
export function editPaymentSettlementInfoApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/supplier/title/${data.id}`,
    method: 'put',
    data
  })
}

// 删除结算抬头-付款
export function deletePaymentSettlementInfoApi(id) {
  return request({
    url: `/api/cms-service/omc/cms/supplier/title/${id}`,
    method: 'delete'
  })
}

// 应收合同-提交前确认是否存在票结试单
export function contractSubmitCheckApi(params) {
  return request({
    url: `/api/cms-service/omc/cms/contract/receipt/check`,
    method: 'get',
    params
  })
}

// 付款合同-提交前确认是否存在票结试单
export function contractPaymentSubmitCheckApi(params) {
  return request({
    url: `/api/cms-service/omc/cms/contract/payment/check`,
    method: 'get',
    params
  })
}

// 付款合同 保存草稿
export function contractPaymentDraftApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/contract/payment/draft`,
    method: 'post',
    data
  })
}

// 付款合同草稿更新
export function contractPaymentUpdateDraftApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/contract/payment/draft/${data.id}`,
    method: 'put',
    data
  })
}

// 付款合同 提交
export function contractPaymentSubmitApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/contract/payment/submit`,
    method: 'post',
    data
  })
}

// 付款合同 提交更新
export function contractPaymentUpdateSubmitApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/contract/payment/submit/${data.id}`,
    method: 'put',
    data
  })
}

// 付款合同 详情
export function getContractPaymentDetailApi(id) {
  return request({
    url: `/api/cms-service/omc/cms/contract/payment/detail/${id}`,
    method: 'get'
  })
}

// 付款子合同 初始化
export function paymentChildrenContractInitApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/contract/payment/sub`,
    method: 'post',
    data
  })
}

// 付款子合同 初始化
export function paymentChildrenContractSubmitApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/contract/payment/submit/sub/${data.id}`,
    method: 'put',
    data
  })
}


// 客户合同-列表
export function getCustomerContractListApi(params) {
  return request({
    url: `/api/cms-service/omc/cms/contract/customer/pages`,
    method: 'get',
    params
  })
}

// 客户合同-合同类型
export function getCustomerContractTypeApi(params) {
  return request({
    url: `/api/cms-service/omc/cms/contract/customer/contractType/selections`,
    method: 'get',
    params
  })
}

// 供应商合同-列表(产品)
export function getSupplierContractListApi(params) {
  return request({
    url: `/api/cms-service/omc/cms/contract/supplier/pages`,
    method: 'get',
    params
  })
}

// 供应商合同-列表(财商)
export function getSupplierContractFinanceListApi(params) {
  return request({
    url: `/api/cms-service/omc/cms/contract/supplier/submit/pages`,
    method: 'get',
    params
  })
}

// 供应商合同-合同类型
export function getSupplierContractTypeApi(params) {
  return request({
    url: `/api/cms-service/omc/cms/contract/supplier/contractType/selections`,
    method: 'get',
    params
  })
}

// 付款合同-结算抬头-财务审核通过
export function auditSupplierTitleApi(id) {
  return request({
    url: `/api/cms-service/omc/cms/supplier/title/${id}/accept`,
    method: 'put'
  })
}

// 付款合同-结算抬头-财务审核拒绝
export function rejectSupplierTitleApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/supplier/title/${data.id}/reject`,
    method: 'put',
    data
  })
}

// 收款合同-新增业务
export function addNewBusinessReceiveApi(data, contractId) {
  return request({
    url: `/api/cms-service/omc/cms/contract/receipt/submit/${contractId}/business`,
    method: 'post',
    data
  })
}

// 付款合同-新增业务
export function addNewBusinessPaymentApi(data, contractId) {
  return request({
    url: `/api/cms-service/omc/cms/contract/payment/submit/${contractId}/business`,
    method: 'post',
    data
  })
}

// 获取当前客户的历史结算抬头
export function settlementcompanyApi(memberId) {
  return request({
    url: `/api/cms-service/omc/cms/customer/title/memberId/${memberId}/settlementcompany`,
    method: 'post'
  })
}

// 获取当前客户的历史结算抬头-供应商收款合同
export function settlementCompanyBySupplierReceiptApi(memberId) {
  return request({
    url: `/api/cms-service/omc/cms/supplier/receipt/customer/title/memberId/${memberId}/settlementcompany`,
    method: 'post'
  })
}

// 合同管理-收款合同-结算抬头批量保存
export function customerTitleBatchApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/customer/title/batch`,
    method: 'post',
    data
  })
}

// 合同管理-收款合同-结算抬头批量保存-供应商收款合同
export function supplierReceiptTitleBatchApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/supplier/receipt/customer/title/batch`,
    method: 'post',
    data
  })
}

// 合同提交后，允许上传附件（收付款合同都要）
export function uploadFileContractApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/contract/${data.id}/attachments`,
    method: 'put',
    data
  })
}

// 合同管理-收款合同- 根据票结 + 业务类型 获取账期信息
export function getPeriodInfoByBusinessTypeApi(businessType) {
  return request({
    url: `/api/cms-service/omc/cms/customer/title/piece/${businessType}/default`,
    method: 'get'
  })
}

// 合同提交后，允许上传附件-供应商
export function uploadFileContractSupplierApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/contract/${data.id}/type/attachments`,
    method: 'put',
    data
  })
}

// 有效的结算抬头-指定时间指定业务
export function getSupplierTitleByBusinessDateApi(params) {
  return request({
    url: `/api/cms-service/omc/cms/supplier/title/list/active/supplier/title`,
    method: 'get',
    params
  })
}

// 作废付款合同
export function invalidSupplierPaymentContractApi(id) {
  return request({
    url: `/api/cms-service/omc/cms/contract/payment/invalid/${id}`,
    method: 'put'
  })
}

// 续签付款合同
export function renewSupplierPaymentContractApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/contract/payment/renew/${data.id}`,
    method: 'put',
    data
  })
}

// 调整付款合同基础信息
export function updateSupplierContractPaymentApi(data) {
  return request({
    url: `/api/cms-service/omc/cms/contract/payment/update/${data.id}`,
    method: 'put',
    data
  })
}
