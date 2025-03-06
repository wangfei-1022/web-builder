import request from '@/utils/request'
import URL from './urlTranslator'

export function delInvoice(id) {
  return request({
    url: `${URL.act.invoice}/${id}`,
    method: 'delete'
  })
}

export function abolishInvoice(id) {
  return request({
    url: `${URL.act.invoiceAbolish}/${id}`,
    method: 'put'
  })
}

export function saveInvoice(data, id) {
  console.log('saveInvoice data', data)
  return request({
    url: `${URL.act.invoice}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}

export function getTaxRateDropDownList() {
  const params = { termCode: 'TAXRATE' } // 从行业术语中获取维护的税率
  return request({
    url: URL.sys.dmnTermItemList,
    method: 'get',
    params
  })
}
export function getInvoiceTextureDropDownList() {
  return request({
    url: URL.act.invoiceTextureList,
    method: 'get'
  })
}

export function getInvoiceTypeDropDownList() {
  return request({
    url: URL.act.invoiceTypeList,
    method: 'get'
  })
}

export function getChargeInvoiceDetailPageInit(data) {
  return request({
    url: URL.act.chargeInvoiceDetailPageInit,
    method: 'post',
    data
  })
}

export function getBillInvoiceDetailPageInit(data) {
  return request({
    url: URL.act.billInvoiceDetailPageInit,
    method: 'post',
    data
  })
}

export function getStatementInvoiceDetailPageInit(data) {
  return request({
    url: URL.act.statementInvoiceDetailPageInit,
    method: 'post',
    data
  })
}

export function getInvoiceDetailPageInit(data) {
  return request({
    url: URL.act.invoiceInitCommon,
    method: 'post',
    data
  })
}
export function validationBeforeInvoiceAddPageInit(data) {
  return request({
    url: URL.act.validationBeforeInvoiceAddPageInit,
    method: 'post',
    data
  })
}

export function getInvoiceItemAfter(data) {
  return request({
    url: URL.act.invoiceItemAfter,
    method: 'post',
    data
  })
}

// 清空发票号
export function clearInvoiceNo(invoiceId) {
  return request({
    url: `${URL.act.invoiceDetailClearInvno}/${invoiceId}`,
    method: 'put'
  })
}
// 红冲
export function offsetInvoice(invoiceId) {
  return request({
    url: `${URL.act.invoiceDetailOffsetInv}/${invoiceId}`,
    method: 'get'
  })
}

export function getBankAccountsByOffice(officeId) {
  const params = { officeId }
  return request({
    url: `${URL.sys.invoiceBankAccounts}`,
    method: 'get',
    params
  })
}
