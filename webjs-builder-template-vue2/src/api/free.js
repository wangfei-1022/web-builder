import request from '@/utils/request'


// 免堆期管理 - 查询列表
export function getFreePagesApi(params) {
  return request({
    url: `/api/sit-service/sea/import/free/port/pages`,
    method: 'get',
    params
  })
}
// 免堆期管理 - 删除
export function delFreeApi(id) {
  return request({
    url: `/api/sit-service/sea/import/free/${id}`,
    method: 'delete'
  })
}
// 免堆期管理 - 保存
export function saveFreeApi(data) {
  return request({
    url: data.id ? `/api/sit-service/sea/import/free/port/${data.id}` : `/api/sit-service/sea/import/free/port`,
    method: data.id ? 'put' : 'post',
    data
  })
}
// 免堆期管理 - 确认
export function confirmFreeApi(id) {
  return request({
    url: `/api/sit-service/sea/import/free/accept/${id}`,
    method: 'put'
  })
}
// 免堆期管理 - 退回
export function backFreeApi(id) {
  return request({
    url: `/api/sit-service/sea/import/free/back/${id}`,
    method: 'put'
  })
}

// 免堆期管理 - 船公司 - 查询列表
export function getFreeCarrierPagesApi(params) {
  return request({
    url: `/api/sit-service/sea/import/free/carrier/pages`,
    method: 'get',
    params
  })
}
// 免堆期管理 -  船公司 - 保存
export function saveFreeCarrierApi(data) {
  return request({
    url: data.id ? `/api/sit-service/sea/import/free/carrier/${data.id}` : `/api/sit-service/sea/import/free/carrier`,
    method: data.id ? 'put' : 'post',
    data
  })
}
// 免堆期管理 -客户 -查询列表
export function getFreeCustomerPagesApi(params) {
  return request({
    url: `/api/sit-service/sea/import/free/customer/pages`,
    method: 'get',
    params
  })
}
// 免堆期管理 -  客户 - 保存
export function saveFreeCustomerApi(data) {
  return request({
    url: data.id ? `/api/sit-service/sea/import/free/customer/${data.id}` : `/api/sit-service/sea/import/free/customer`,
    method: data.id ? 'put' : 'post',
    data
  })
}
