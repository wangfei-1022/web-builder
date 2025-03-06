import request from '@/utils/request'
import URL from './urlTranslator'

export function getNegativeList(params) {
  return request({
    url: URL.dmn.negative,
    method: 'get',
    params
  })
}

export function getNegativeById(id) {
  return request({
    url: `${URL.dmn.negative}/${id}`,
    method: 'get'
  })
}
