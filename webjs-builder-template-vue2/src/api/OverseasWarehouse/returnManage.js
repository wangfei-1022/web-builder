import request from '@/utils/request'

// VITE-SP
export function delReturnOutboundApi() { }
export function batchSubmitReturnboundApi() { }
export function batchDelReturnboundApi() { }

/**
 * 出库单号查看列表
 * @returns {*}
 */

export function getReturnOutboundPagesApi(params) {
  return request({
    url: `/api/ovl-service/omc/ovl/return/page`,
    method: 'get',
    params
  })
}

/**
 * 出库单号查看详情
 * @returns {*}
 */

export function detailReturnOutboundApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/return/${id}/details`,
    method: 'get'
  })
}
/**
 * 获取退货单类型
 * @returns {*}
 */

export function getReturnTypeApi() {
  return request({
    url: `/api/ovl-service/ovl/order/return/type/selections`,
    method: 'get'
  })
}
/**
 * 获取退货单状态
 * @returns {*}
 */

export function getReturnStatusApi() {
  return request({
    url: `/api/ovl-service/ovl/order/return/status/selections`,
    method: 'get'
  })
}


/**
 * 确认上架
 * @returns {*}
 */

export function groundingReturnboundApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/return/${data.id}/status/ws/grounding/complete`,
    method: 'put',
    data
  })
}
/**
 * 确认摧毁
 * @returns {*}
 */

export function destroyReturnboundApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/return/${data.id}/status/ws/destroy/complete`,
    method: 'put',
    data
  })
}
/**
 * 退货到仓
 * @returns {*}
 */

export function arrivalReturnboundApi(data) {
  return request({
    url: `/api/ovl-service/ovl/order/return/arrival/ws`,
    method: 'post',
    data
  })
}
/**
 * 审核通过
 * @returns {*}
 */

export function acceptedReturnboundApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/return/${id}/status/platform/accepted`,
    method: 'put'
  })
}
/**
 * 审核通过
 * @returns {*}
 */

export function rejectedReturnboundApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/return/${data.id}/status/platform/rejected`,
    method: 'put',
    data
  })
}
/**
 * 补录物流信息
 * @returns {*}
 */

export function returnLogisticsboundApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/return/${data.id}/logistics`,
    method: 'put',
    data
  })
}
/**
 * 退货到仓
 * @returns {*}
 */

export function returnArrivalWarehouseApi(data) {
  return request({
    url: `/api/ovl-service/ovl/order/return/arrival/ws`,
    method: 'post',
    data
  })
}
/**
 * 导出
 * @returns {*}
 */

export function exportReturnBoundApi(params) {
  return request({
    url: `/api/ovl-service/omc/ovl/return/export`,
    method: 'get',
    params
  })
}
