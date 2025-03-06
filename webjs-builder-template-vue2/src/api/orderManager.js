import request from '@/utils/request'
/**
 * 获取提单列表数据
 * @param {*} params
 * @returns
 */

// 获取币种列表
export function getCurrencyListApi() {
  return request({
    url: '/api/mdm-service/dmn/currency/dropdownlist',
    method: 'get'
  })
}

// 获取用户列表
export function getMemberListApi(val) {
  return request({
    url: `/api/member-service/mem/member/info/spinner?keyword=${val}`,
    method: 'get'
  })
}

// 订单信息列表
export function getOrderListApi(params) {
  return request({
    url: '/api/ctn-service/ctn/order/list',
    method: 'get',
    params
  })
}

// 新增订单信息
export function createOrderApi(data) {
  return request({
    url: '/api/ctn-service/ctn/order/save',
    method: 'post',
    data
  })
}

// 订单信息详情
export function getOrderDetailApi(id) {
  return request({
    url: `/api/ctn-service/ctn/order/detail/${id}`,
    method: 'get'
  })
}

// 更新订单信息
export function updateOrderApi(id, data) {
  return request({
    url: `/api/ctn-service/ctn/order/${id}`,
    method: 'put',
    data
  })
}
