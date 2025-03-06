import request from '@/utils/request'
import URL from './urlTranslator'

export function getHscodeList(params) {
  return request({
    url: URL.dmn.hscode,
    method: 'get',
    params
  })
}

export function getHscodeById(id) {
  return request({
    url: `${URL.dmn.hscode}/${id}`,
    method: 'get'
  })
}
