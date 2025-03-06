import request from '@/utils/request'
import URL from './urlTranslator'

export function getDivisionList(areaLevel) {
  const params = { areaLevel }
  return request({
    url: URL.dmn.divisionInfo,
    method: 'get',
    params
  })
}

export function getDivisionListV2(params) {
  return request({
    url: URL.dmn.divisionInfo,
    method: 'get',
    params
  })
}

export function getAllDivisionList() {
  return request({
    url: URL.dmn.divisionAllList,
    method: 'get'
  })
}

export function getDivisionByCountry(countryCode) {
  const params = { countryCode: countryCode }
  return request({
    url: URL.dmn.divisionByCountry,
    method: 'get',
    params
  })
}

export function getDivisionById(id) {
  return request({
    url: `${URL.dmn.divisionInfo}/${id}`,
    method: 'get'
  })
}

export function saveDivision(data, id) {
  return request({
    url: `${URL.dmn.divisionInfo}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}

export function delDivision(id) {
  return request({
    url: `${URL.dmn.divisionInfo}/${id}`,
    method: 'delete'
  })
}
export function switchDivisionStatus(id, status) {
  return request({
    url: ''
  })
}

/**
 * 初始化详情页数据
 * @param id
 */
export function loadDetailInitInfo(id) {
  return request({
    url: '',
    method: 'get'
  })
}

