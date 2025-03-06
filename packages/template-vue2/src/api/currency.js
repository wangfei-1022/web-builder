import request from '@/utils/request'
import URL from './urlTranslator'

export function getCurrencyList(params) {
  return request({
    url: URL.dmn.currencyInfo,
    method: 'get',
    params
  })
}

export function getCurrencyById(id) {
  return request({
    url: `${URL.dmn.currencyInfo}/${id}`,
    method: 'get'
  })
}

export function saveCurrency(data, id) {
  return request({
    url: `${URL.dmn.currencyInfo}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}

export function delCurrency(id) {
  return request({
    url: `${URL.dmn.currencyInfo}/${id}`,
    method: 'delete'
  })
}
export function switchCurrencyStatus(id, status) {
  const params = { id: id }
  return request({
    url: '',
    method: 'put',
    params
  })
}

export function getCurrencyDropDownList() {
  return request({
    url: `${URL.dmn.currencyDropDownList}`,
    method: 'get'
  })
}
