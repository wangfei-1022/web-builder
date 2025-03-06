import request from '@/utils/request'
import URL from './urlTranslator'

export function getCompanyCodeList(params) {
  return request({
    url: URL.dmn.companyCode,
    method: 'get',
    params
  })
}

export function getCompanyCodeById(id) {
  return request({
    url: `${URL.dmn.companyCode}/${id}`,
    method: 'get'
  })
}
