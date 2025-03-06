// 小包 - 客户管理
import request from '@/utils/request'

// 基础信息下拉
export function getDictListApi(dictType) {
  return request({
    url: `/api/ilp-service/ilp/dict/list/${dictType}`,
    method: 'get'
  })
}

// 订单列表
export function getOrderListApi(params) {
  return request({
    url: '/api/ilp-service/omc/ilp/order/sales/list',
    method: 'get',
    params
  })
}

// 订单列表-单号
export function getOrderListByNosApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/order/sales/nos/list',
    method: 'post',
    data
  })
}

// 取消订单
export function cancelOrderApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/order/sales/cancel',
    method: 'post',
    data
  })
}

// 导出订单-单号
export function exportOrderNosApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/order/sales/export/nos',
    method: 'post',
    data
  })
}

// 导出订单-条件
export function exportOrderConditionsApi(params) {
  return request({
    url: '/api/ilp-service/omc/ilp/order/sales/export/conditions',
    method: 'get',
    params
  })
}

// 导出订单-选择
export function exportOrderSelectedApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/order/sales/export/ids',
    method: 'post',
    data
  })
}

// 导出订单-发货证明1
export function exportProofOfShipment1Api(data) {
  return request({
    url: '/api/ilp-service/mem/ilp/order/sales/print/proofOfShipment1',
    method: 'post',
    data
  })
}

// 导出订单-发货证明2
export function exportProofOfShipment2Api(data) {
  return request({
    url: '/api/ilp-service/mem/ilp/order/sales/print/proofOfShipment2',
    method: 'post',
    data
  })
}

// 导出订单-签收证明
export function exportProofOfSignApi(data) {
  return request({
    url: '/api/ilp-service/mem/ilp/order/sales/print/proofOfSign',
    method: 'post',
    data
  })
}

// 导出订单-excel导入
export function exportOrderExcelApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/order/sales/export/excel',
    method: 'post',
    data
  })
}

// 订单详情
export function getOrderDetailApi(params) {
  return request({
    url: '/api/ilp-service/omc/ilp/order/sales/detail',
    method: 'get',
    params
  })
}


// 订单详情-面单
export function getOrderLabelApi(params) {
  return request({
    url: '/api/ilp-service/omc/ilp/order/sales/label/download',
    method: 'get',
    params
  })
}

// 订单-批量备注
export function importBatchRemarkApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/order/sales/importRemark',
    method: 'post',
    data
  })
}

// 订单-批量维护重派运单号
export function importBatchChannelNoApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/order/sales/importChannelNo',
    method: 'post',
    data
  })
}

// 修改地址
export function updateConsigneeAddressApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/order/sales/update/consigneeAddress`,
    method: 'post',
    data
  })
}

// 订单详情-打印面单
export function printOrderPdfIdsApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/order/sales/print/ids',
    method: 'post',
    data
  })
}

// 订单详情-打印面单
export function printOrderPdfApi(params) {
  return request({
    url: '/api/ilp-service/omc/ilp/order/sales/print/simpleLabelOrTrackLabel',
    method: 'get',
    params
  })
}

// 重新派送
export function redeliveryOrderApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/order/sales/redelivery`,
    method: 'post',
    data
  })
}

// 批量换渠道
export function batchChangeChannelApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/order/sales/batchSwitchOrder`,
    method: 'post',
    data
  })
}

// 批量换产品
export function batchChangeProductApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/order/sales/batchSwitchProduct`,
    method: 'post',
    data
  })
}

// 恢复
export function reuseConfirmOrderApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/order/sales/reuseConfirm`,
    method: 'post',
    data
  })
}

// 更新品名
export function updateGoodsItemListApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/order/sales/update/updateGoodsItemList`,
    method: 'post',
    data
  })
}
