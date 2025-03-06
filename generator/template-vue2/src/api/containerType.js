import request from '@/utils/request'
import URL from './urlTranslator'

export function getContainerTypeList(params) {
  return request({
    url: URL.dmn.containerTypeInfo,
    method: 'get',
    params
  })
}

export function getContainerTypeById(id) {
  return request({
    url: `${URL.dmn.containerTypeInfo}/${id}`,
    method: 'get'
  })
}

export function saveContainerType(data, id) {
  return request({
    url: `${URL.dmn.containerTypeInfo}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}

export function delContainerType(id) {
  return request({
    url: `${URL.dmn.containerTypeInfo}/${id}`,
    method: 'delete'
  })
}

export function switchContainerTypeStatus(id, bActive) {
  const params = { id: id }
  const url = bActive ? URL.dmn.containerEnable : URL.dmn.containerDisable
  return request({
    url: url,
    method: 'put',
    params
  })
}
