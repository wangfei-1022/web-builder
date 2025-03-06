import request from '@/utils/request'
import URL from './urlTranslator'

export function getVoyageList(params) {
  return request({
    url: URL.dmn.voyageInfo,
    method: 'get',
    params
  })
}

export function getVoyageById(id) {
  return request({
    url: `${URL.dmn.voyageInfo}/${id}`,
    method: 'get'
  })
}

export function saveVoyage(data, id) {
  return request({
    url: `${URL.dmn.voyageInfo}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}

export function delVoyage(id) {
  return request({
    url: `${URL.dmn.voyageInfo}/${id}`,
    method: 'delete'
  })
}

export function batchDelVoyage(ids) {
  return request({
    url: URL.dmn.voyageBatchDel,
    method: 'delete',
    params: { ids }
  })
}
