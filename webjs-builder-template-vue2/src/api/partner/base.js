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
export function checkContractNoIsUniqueApi(params) {
  return request({
    url: `/api/cms-service/cms/contract/exists`,
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

// 获取结算信息
export function getSettlementInfoApi(data) {
  return request({
    url: `/api/member-service/cms/settlement/company/${data.settlementCompanyId}/${data.rechargeCurrency}/${data.bankAccount}/title`,
    method: 'get'
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
