import request from '@/utils/request'
import URL from './urlTranslator'

export function getOverviewByJobId(jobId) {
  return request({
    url: `${URL.act.overview}/${jobId}`,
    method: 'get'
  })
}

export function getOverviewList() {
  return request({
    url: `${URL.act.overview}`,
    method: 'get'
  })
}
export function getOverviewDetailStatus(jobId) {
  return request({
    url: `${URL.act.overviewDetailStatus}/${jobId}`,
    method: 'get'
  })
}

