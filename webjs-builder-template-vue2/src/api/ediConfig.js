import request from '@/utils/request'
import URL from './urlTranslator'

export function getCommunicationModeList(typeChannelId) {
  return request({
    url: `${URL.sys.ediCommunicationModeList}/${typeChannelId}`,
    method: 'get'
  })
}

export function getReceiverTypeList() {
  return request({
    url: `${URL.sys.ediReceiverTypeList}`,
    method: 'get'
  })
}
export function getEdiConfigList(params) {
  return request({
    url: URL.sys.ediConfig,
    method: 'get',
    params
  })
}

export function getEdiConfigById(id) {
  return request({
    url: `${URL.sys.ediConfig}/${id}`,
    method: 'get'
  })
}

export function saveEdiConfig(data, id) {
  return request({
    url: `${URL.sys.ediConfig}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}

export function delEdiConfig(id) {
  return request({
    url: `${URL.sys.ediConfig}/${id}`,
    method: 'delete'
  })
}

