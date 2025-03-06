import request from '@/utils/request'
import URL from './urlTranslator'

export function getCountryList(params) {
  return request({
    url: URL.dmn.countryInfo,
    method: 'get',
    params
  })
}

export function getCountryListApi(params) {
  return request({
    url: URL.dmn.countryList,
    method: 'get',
    params
  })
}

export function getCountryById(id) {
  return request({
    url: `${URL.dmn.countryInfo}/${id}`,
    method: 'get'
  })
}

export function saveCountry(data, id) {
  return request({
    url: `${URL.dmn.countryInfo}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}

export function delCountry(id) {
  return request({
    url: `${URL.dmn.countryInfo}/${id}`,
    method: 'delete'
  })
}
export function switchCountryStatus(id, status) {
  return request({
    url: ''
  })
}

// 查询国家（带常用）
export function getCountryApi(params) {
  return request({
    url: '/api/mdm-service/dmn/country/selections',
    method: 'get',
    params
  })
}
