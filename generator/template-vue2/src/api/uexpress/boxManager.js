// 小包 - 集装箱管理
import request from '@/utils/request'

// 集装箱列表
export function getBoxListApi(params) {
  return request({
    url: '/api/ilp-service/omc/ilp/box/list',
    method: 'get',
    params
  })
}

// 集装箱详情
export function getBoxDetailApi(params) {
  return request({
    url: '/api/ilp-service/omc/ilp/box/detail',
    method: 'get',
    params
  })
}

// 集装箱 - 包裹列表
export function getBoxPackageListApi(params) {
  return request({
    url: '/api/ilp-service/omc/ilp/parcel/list/box',
    method: 'get',
    params
  })
}

// 集装箱 - 导出
export function getBoxExportApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/box/exportOrderSalesByBox',
    method: 'post',
    data
  })
}
