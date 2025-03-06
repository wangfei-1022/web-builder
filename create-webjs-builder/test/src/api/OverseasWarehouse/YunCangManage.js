import request from '@/utils/request'


/**
 * 云仓管理-入库单列表
 * @returns {*}
 */
export function getCloudInboundApi(params) {
  return request({
    url: `/api/ovl-service/omc/ovl/cloud/warehouse/order/inbound/list`,
    method: 'get',
    params
  })
}

/**
 * 云仓管理-入库单列表-批量
 * @returns {*}
 */
export function getCloudInboundBatchApi(data) {
    return request({
      url: `/api/ovl-service/omc/ovl/cloud/warehouse/order/inbound/list/batch`,
      method: 'post',
      data
    })
  }

/**
 * 云仓管理-入库单列表-导出
 * @returns {*}
 */
export function exportCloudInboundApi(params) {
  return request({
    url: `/api/ovl-service/omc/ovl/cloud/warehouse/order/inbound/export`,
    method: 'get',
    params
  })
}
/**
 * 云仓管理-入库单列表-导入
 * @returns {*}
 */
export function importCloudInboundApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/cloud/warehouse/order/inbound/import`,
    method: 'post',
    data
  })
}
// /api/ovl-service/omc/ovl/cloud/warehouse/order/inbound/{id}/skuInfo

/**
 * 云仓管理-入库单列表-查看sku信息
 * @returns {*}
 */
export function getSkuInfoCloudInboundApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/cloud/warehouse/order/inbound/${id}/skuInfo`,
    method: 'get'
  })
}

/**
 * 云仓管理-入库单列表-跟新单条数据
 * @returns {*}
 */
export function updateCloudInboundApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/cloud/warehouse/order/inbound/orderNo/${data.orderNo}/grounding`,
    method: 'put',
    data
  })
}
/**
 * 云仓管理-入库单列表-部分上架
 * @returns {*}
 */
export function partCloudInboundApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/cloud/warehouse/order/inbound/orderNo/${data.orderNo}/part/grounding`,
    method: 'put',
    data
  })
}
/**
 * 云仓管理-入库单列表-上架完成
 * @returns {*}
 */
export function completeCloudInboundApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/cloud/warehouse/order/inbound/complete/grounding/${id}`,
    method: 'put'
  })
}
/**
 * 云仓管理-出库单列表
 * @returns {*}
 */
export function getCloudOutboundApi(params) {
  return request({
    url: `/api/ovl-service/omc/ovl/cloud/warehouse/order/outbound/list`,
    method: 'get',
    params
  })
}

/**
 * 云仓管理-出库单列表-批量
 * @returns {*}
 */
export function getCloudOutboundBatchApi(data) {
    return request({
      url: `/api/ovl-service/omc/ovl/cloud/warehouse/order/outbound/list/batch/condition`,
      method: 'POST',
      data
    })
  }
/**
 * 云仓管理-出库单列表-导入
 * @returns {*}
 */
export function importCloudOutboundApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/cloud/warehouse/order/outbound/import`,
    method: 'post',
    data
  })
}
/**
 * 云仓管理-出库单列表-导出
 * @returns {*}
 */
export function exportCloudOutboundApi(params) {
  return request({
    url: `/api/ovl-service/omc/ovl/cloud/warehouse/order/outbound/export`,
    method: 'get',
    params
  })
}

/**
 * 云仓管理-出库单列表-查看sku信息
 * @returns {*}
 */
export function getSkuInfoCloudOutboundApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/cloud/warehouse/order/outbound/${id}/skuInfo`,
    method: 'get'
  })
}

/**
 * 云仓管理-出库单列表-跟新单条数据
 * @returns {*}
 */
export function updateCloudOnboundApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/cloud/warehouse/order/outbound/orderNo/${data.orderNo}/out`,
    method: 'put',
    data
  })
}

/**
 * 云仓管理-出库单-更新快递单号
 * @returns {*}
 */
export function updateShipmentNoCloudOnboundApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/cloud/warehouse/order/outbound/${data.id}/${data.shipmentNo}`,
    method: 'put',
    data
  })
}
/**
 * 云仓管理-出库单-快递单号导入
 * @returns {*}
 */
export function importShipmentCloudOnboundApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/cloud/warehouse/order/outbound/shipmentNo/import`,
    method: 'post',
    data
  })
}
/**
 * 云仓出库单-运营批量出库
 * @returns {*}
 */
export function batchOutCloudOnboundApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/cloud/warehouse/order/outbound/out/batch`,
    method: 'post',
    data
  })
}
/** ***********************************包裹入库******************************** */
/**
 * 云仓管理-包裹入库列表
 * @returns {*}
 */
export function getCloudPackageboundApi(params) {
  return request({
    url: `/api/ovl-service/omc/ovl/cloud/warehouse/order/inbound/package/list`,
    method: 'get',
    params
  })
}
/**
 * 云仓管理-包裹入库查看Sku信息
 * @returns {*}
 */
export function getSkuInfoCloudPackageInboundApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/cloud/warehouse/order/inbound/package/${id}/skuInfo`,
    method: 'get'
  })
}
/**
 * 云仓管理-包裹入库列表-导入
 * @returns {*}
 */
export function importCloudPackageInboundApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/cloud/warehouse/order/inbound/import/package`,
    method: 'post',
    data
  })
}
/**
 * 云仓管理-包裹入库列表-导出
 * @returns {*}
 */
export function exportCloudPackageInboundApi(params) {
  return request({
    url: `/api/ovl-service/omc/ovl/cloud/warehouse/order/inbound/package/export`,
    method: 'get',
    params
  })
}
