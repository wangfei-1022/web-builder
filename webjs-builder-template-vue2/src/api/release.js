import request from '@/utils/request'
import URL from './urlTranslator'

export function allowRelease(data) {
  return request({
    url: URL.act.releaseAllow,
    method: 'put',
    data
  })
}
export function rejectRelease(data) {
  return request({
    url: URL.act.releaseReject,
    method: 'put',
    data
  })
}
export function passRelease(data) {
  return request({
    url: URL.act.releasePass,
    method: 'put',
    data
  })
}
export function getReleaseArrearageInfo(jobId, customerId) {
  const params = { customerId }
  return request({
    url: `${URL.act.releaseArrearage}/${jobId}`,
    method: 'get',
    params
  })
}
