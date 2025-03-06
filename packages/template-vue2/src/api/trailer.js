import request from '@/utils/request'
import URL from './urlTranslator'

// 车队列表
export function getTrailerListApi(params) {
  return request({
    url: URL.charteredBoat.getTrailerList,
    method: 'get',
    params
  })
}

// 取消预约
export function cancelTrailersApi(data) {
  return request({
    url: URL.charteredBoat.cancelTrailers,
    method: 'put',
    data
  })
}

// 打印预约
export function printTrailersApi(id, code) {
  return request({
    url: `${URL.charteredBoat.printTrailer}/${id}?templateCode=${code}`,
    method: 'get'
  })
}
