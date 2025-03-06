import request from '@/utils/request'
import URL from './urlTranslator'

export function getShippingList(params) {
  return request({
    url: URL.dmn.shippingInfo,
    method: 'get',
    params
  })
}

export function getShippingTypeList(params) {
  return request({
    url: URL.dmn.shippingType,
    method: 'get',
    params
  })
}

export function getShippingById(id) {
  return request({
    url: `${URL.dmn.shippingInfo}/${id}`,
    method: 'get'
  })
}

export function saveShipping(data, id) {
  return request({
    url: `${URL.dmn.shippingInfo}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}

export function delShipping(id) {
  return request({
    url: `${URL.dmn.shippingInfo}/${id}`,
    method: 'delete'
  })
}

export function batchDelShipping(ids) {
  const params = { ids }
  return request({
    url: `${URL.dmn.shippingBatchDel}`,
    method: 'delete',
    params
  })
}
