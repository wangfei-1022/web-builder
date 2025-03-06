import request from '@/utils/request'
import URL from './urlTranslator'

export function getTerminologyList(params) {
  return request({
    url: URL.dmn.terminologyInfo,
    method: 'get',
    params
  })
}

export function getTerminologyTypeList(termType) {
  const params = { termType }
  return request({
    url: URL.dmn.terminologyTypeInfo,
    method: 'get',
    params
  })
}

export function getTerminologyListByType(termCode) {
  const params = { termCode }
  return request({
    url: URL.dmn.terminologyByType,
    method: 'get',
    params
  })
}

export function getTerminologyById(id) {
  return request({
    url: `${URL.dmn.terminologyInfo}/${id}`,
    method: 'get'
  })
}

export function saveTerminology(data, id) {
  return request({
    url: `${URL.dmn.terminologyInfo}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}

export function delTerminology(id) {
  return request({
    url: `${URL.dmn.terminologyInfo}/${id}`,
    method: 'delete'
  })
}

export function switchTerminologyStatus(id, bActive) {
  const url = bActive ? URL.dmn.terminologyEnable : URL.dmn.terminologyDisable
  return request({
    url: url + `/${id}`,
    method: 'put'
  })
}
