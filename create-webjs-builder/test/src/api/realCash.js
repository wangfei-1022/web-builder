import request from '@/utils/request'
import URL from './urlTranslator'

export function getRealCashList(params) {
  return request({
    url: URL.act.realCash,
    method: 'get',
    params
  })
}

export function getRealCashById(id) {
  return request({
    url: `${URL.act.realCash}/${id}`,
    method: 'get'
  })
}

export function saveRealCash(data, id) {
  return request({
    url: `${URL.act.realCash}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}

export function delRealCashById(id) {
  return request({
    url: `${URL.act.realCash}/${id}`,
    method: 'delete'
  })
}

export function batchDelRealCash(actualPaymentIds) {
  const params = { actualPaymentIds }
  return request({
    url: `${URL.act.realCashBatchDel}`,
    method: 'delete',
    params
  })
}

// 查看实收付中关联的核销的费用列表
export function getChargeByClearId(id) {
  return request({
    url: `${URL.act.dd}/${id}`,
    method: 'get'
  })
}

export function submitRealCash(id) {
  return request({
    url: `${URL.act.realCashSubmitSuccess}/${id}`,
    method: 'put'
  })
}
export function cancelSubmitRealCash(id) {
  return request({
    url: `${URL.act.realCashSubmitCancel}/${id}`,
    method: 'put'
  })
}

export function getClearsOfRealCash(clearId) {
  return request({
    url: `${URL.act.realCashClears}/${clearId}`,
    method: 'get'
  })
}

export function getClearChargesOfRealCash(realCashId) {
  return request({
    url: `${URL.act.realCashClearCharges}/${realCashId}`,
    method: 'get'
  })
}

export function acceptRealCash(id) {
  return request({
    url: `${URL.act.realCashAcceptSuccess}/${id}`,
    method: 'put'
  })
}
export function cancelAcceptRealCash(id) {
  return request({
    url: `${URL.act.realCashAcceptCancel}/${id}`,
    method: 'put'
  })
}

