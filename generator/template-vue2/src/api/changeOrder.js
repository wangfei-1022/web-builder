import request from '@/utils/request'

// 改单申请列表
export function getApplicationListApi(params) {
  return request({
    url: `/api/cas-service/omc/cas/container/change/application/list`,
    method: 'get',
    params
  })
}

// 处理改单
export function applicationSignApi(data) {
  return request({
    url: `/api/cas-service/omc/cas/container/change/application/sign`,
    method: 'put',
    data
  })
}

// 申请清单导出
export function exportApplicationListApi(params) {
  return request({
    url: `/api/cas-service/omc/cas/container/change/application/exportApplicationList`,
    method: 'get',
    params
  })
}
