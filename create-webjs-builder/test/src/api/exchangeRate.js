import request from '@/utils/request'
import URL from './urlTranslator'

export function getExchangeRateList(params) {
  return request({
    url: URL.act.exchangeRateInfo,
    method: 'get',
    params
  })
}

export function getExchangeRateById(id) {
  return request({
    url: `${URL.act.exchangeRateInfo}/${id}`,
    method: 'get'
  })
}

export function saveExchangeRate(data, id) {
  return request({
    url: `${URL.act.exchangeRateInfo}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}

export function delExchangeRate(id) {
  return request({
    url: `${URL.act.exchangeRateInfo}/${id}`,
    method: 'delete'
  })
}

export function batchDelExchangeRate(rateIds) {
  const params = { rateIds }
  return request({
    url: `${URL.act.exchangeRateBatch}`,
    method: 'delete',
    params
  })
}

export function switchExchangeRateStatus(id, status) {
  return request({
    url: ''
  })
}

/**
 * 批量增加
 * @param data 数据
 */
export function batchAddExchangeRate(data) {
  return request({
    url: URL.act.exchangeRateBatch,
    method: 'post',
    data
  })
}
/**
 * 根据periodCode获取详情
 */
export function getExchangeRateByPeriodCode(groupId) {
  return request({
    url: `${URL.act.exchangeRateBatch}/${groupId}`,
    method: 'get'
  })
}

/**
 * 批量编辑
 * @param groupId 生效 批次id
 * @param data 数据
 */
export function batchEditExchangeRate(groupId, data) {
  return request({
    url: `${URL.act.exchangeRateBatch}?periodCode=${groupId}`,
    method: 'put',
    data
  })
}

export function getDetailPageInitData() {
  return request({
    url: URL.act.exchangeRateDetailInit,
    method: 'get'
  })
}
