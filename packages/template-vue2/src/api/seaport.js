import request from '@/utils/request'
import URL from './urlTranslator'

export function getSeaPortList(params) {
  return request({
    url: URL.dmn.seaPortInfo,
    method: 'get',
    params
  })
}

export function getSeaPortById(id) {
  return request({
    url: `${URL.dmn.seaPortInfo}/${id}`,
    method: 'get'
  })
}

export function addSeaPortApi(data) {
  return request({
    url: `${URL.dmn.seaPortInfo}`,
    method: 'post',
    data
  })
}

export function saveSeaPort(data, id) {
  return request({
    url: `${URL.dmn.seaPortInfo}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}

export function delSeaPort(id) {
  return request({
    url: `${URL.dmn.seaPortInfo}/${id}`,
    method: 'delete'
  })
}

export function batchDelSeaPort() {
  return request({

  })
}

export function switchSeaPortStatus(id, bActive) {
  const params = { id: id }
  const url = bActive ? URL.dmn.seaPortInfoEnable : URL.dmn.seaPortInfoDisable
  return request({
    url: url,
    method: 'put',
    params
  })
}

