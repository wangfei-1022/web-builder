import request from '@/utils/request'
// 获取燃油附加费列表
export function getFuelRateListApi(params) {
  return request({
    url: `/api/trans-service/omc/lnt/product/fuel/rate/list/pages`,
    method: 'get',
    params
  })
}
// 更新状态生效、失效
export function updateStatusApi(data) {
  return request({
    url: `/api/trans-service/omc/lnt/product/fuel/rate/updateStatus/${data.id}`,
    method: 'put',
    data
  })
}
// 提交燃油附加费
export function submitFuelRateApi(data) {
  return request({
    url: '/api/trans-service/omc/lnt/product/fuel/rate/submit',
    method: 'post',
    data
  })
}
// 查看旺季附加费
export function detailFuelRateApi(id) {
  return request({
    url: `/api/trans-service/omc/lnt/product/fuel/rate/detail/${id}`
  })
}

// 燃油费率管理-发布
export function channelFuelRatePublishApi(id) {
  return request({
    url: `/api/trans-service/omc/lnt/price/card/fuel/publish/${id}`,
    method: 'put'
  })
}

