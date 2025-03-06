import request from '@/utils/request'
import URL from './urlTranslator'

export function getJobList(params) {
  return request({
    url: URL.sta.queryJob,
    method: 'get',
    params
  })
}

export function getJobListAdvanced(data) {
  return request({
    url: URL.sta.queryJobAdvanced,
    method: 'post',
    data
  })
}

export function getProfitList(params) {
  return request({
    url: URL.sta.queryProfit,
    method: 'get',
    params
  })
}

export function getProfitListAdvanced(data, staRequest) {
  return request({
    url: URL.sta.queryProfitAdvanced,
    method: 'post',
    data, staRequest
  })
}
