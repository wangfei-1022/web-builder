import request from '@/utils/request'
import URL from './urlTranslator'

export function getInvoiceList(params) {
  return request({
    url: URL.act.invoice,
    method: 'get',
    params
  })
}

export function getInvoiceDashboard(params) {
  return request({
    url: URL.act.invoiceDashboard,
    method: 'get',
    params
  })
}

export function getInvoiceDetailById(id) {
  return request({
    url: `${URL.act.invoice}/${id}`,
    method: 'get'
  })
}

export function batchDelInvoice(invoiceIds) {
  const params = { invoiceIds }
  return request({
    url: URL.act.invoiceBatchDel,
    method: 'delete',
    params
  })
}

export function batchAbolishInvoice(invoiceIds) {
  const params = { invoiceIds }
  return request({
    url: URL.act.invoiceBatchAbolish,
    method: 'put',
    params
  })
}
export function getInvoiceListByJob(jobId) {
  return request({
    url: `${URL.act.invoiceByJob}/${jobId}`,
    method: 'get'
  })
}

export function combineInvoice(data) {
  return request({
    url: `${URL.act.invoiceCombine}`,
    method: 'post',
    data
  })
}
export function getInvoiceOffsetPlatform(invoiceIds) {
  const params = { invoiceIds }
  return request({
    url: `${URL.act.invoiceOffsetPlatform}`,
    method: 'get',
    params
  })
}
// edi
export function generateThirdInvoice(invoiceIds) {
  return request({
    url: `${URL.act.invoiceThirdGenerate}?invoiceIds=${invoiceIds}`,
    method: 'post'
  })
}
export function generateThirdRedInvoice(invoiceIds) {
  return request({
    url: `${URL.act.invoiceThirdOffset}?invoiceIds=${invoiceIds}`,
    method: 'post'
  })
}
// invoiceRemoveCharge:
// invoiceJoinCharge:

export function invoiceConfirm(id, params) {
  return request({
    url: `${URL.act.invoiceConfirm}/${id}`,
    method: 'put',
    params
  })
}
