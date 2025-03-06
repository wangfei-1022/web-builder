import request from '@/utils/request'

// 列表
export function getFmsOrderLockListApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/order/lockOrder/list/locked`,
    method: 'post',
    data
  })
}

// 列表-全部
export function getFmsOrderLockListAllApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/order/lockOrder/list/locked/all`,
    method: 'post',
    data
  })
}

// 列表
export function getFmsOrderLockCountApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/order/lockOrder/list/locked/count/adjustComplete`,
    method: 'get',
    params
  })
}

// 详情
export function getFmsOrderLockDetailApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/order/lockOrder/list/locked/${params.orderEntityType}/${params.orderId}/charges`,
    method: 'get',
    params
  })
}

// 解锁
export function fmsOrderUnlockApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/order/lockOrder/${data.orderEntityType}/${data.orderId}/unlock`,
    method: 'put',
    data
  })
}

// 锁单
export function fmsOrderLockApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/order/lockOrder/${data.orderEntityType}/${data.orderId}/lock`,
    method: 'put',
    data
  })
}

// 获取锁单并单的信息
export function getOrderLockInfoApi(params) {
    return request({
      url: `/api/fms-service/omc/fms/order/lockOrder/${params.orderEntityType}/${params.orderId}/mergedOrderNos`,
      method: 'get',
      params
    })
  }