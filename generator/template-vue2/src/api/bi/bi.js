import request from '@/utils/request'

// 获取船期监控数据
export function getScreenV2Api() {
  return request({
    url: '/api/bi-service/bi/screen/data/today',
    method: 'get'
  })
}
