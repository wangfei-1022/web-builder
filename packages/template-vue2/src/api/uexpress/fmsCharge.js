import request from '@/utils/request'

// 获取查询
export function getReceiveChargeListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/ar/detail/charge/list`,
    method: 'get',
    params
  })
}

// 获取查询
export function getReceiveChargeListByNosApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/ar/detail/charge/list/nos`,
    method: 'POST',
    data
  })
}

// 导出订单-单号
export function exportOrderNosApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/ar/detail/charge/list/export/nos',
    method: 'post',
    data
  })
}

// 导出订单-条件
export function exportOrderConditionsApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/ar/detail/charge/list/export/condition',
    method: 'post',
    data
  })
}

// 导出订单-选择
export function exportOrderSelectedApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/ar/detail/charge/list/export/ids',
    method: 'post',
    data
  })
}


