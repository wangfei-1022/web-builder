import request from '@/utils/request'

// VITE-SP
export function getCompanyListApi() { }

// 一件代发列表
export function getOutboundsListApi(params) {
  return request({
    url: `/api/ovl-service/omc/ovl/outbounds/drop/shipping`,
    method: 'get',
    params
  })
}
// 一件代发列表-批量
export function getOutboundsListBatchApi(data) {
    return request({
      url: `/api/ovl-service/omc/ovl/outbounds/drop/shipping/page/batch`,
      method: 'post',
      data
    })
  }
// 物流产品下拉数据
export function getProductListApi(params) {
  return request({
    url: `/api/ovl-service/lnt/product/selections`,
    method: 'get',
    params
  })
}
// 出库单基础数据_出库单状态列表
export function getOutboundStatusApi(params) {
  return request({
    url: `/api/ovl-service/ovl/outbounds/outbound/status/selections`,
    method: 'get',
    params
  })
}
// 物流公司管理_获取物流公司下拉列表
export function getLogisticsCompanyApi(params) {
  return request({
    url: `/api/mdm-service/dmn/logistics/company/selections`,
    method: 'get',
    params
  })
}

// 追踪轨迹_查询列表
export function getOrderTracksApi(orderId) {
  return request({
    url: `/api/ovl-service/omc/ovl/outbounds/tracks/${orderId}`,
    method: 'get'
  })
}

// 追踪_查询列表
export function getOrderLogsApi(orderId) {
  return request({
    url: `/api/ord-service/omc/ord/order/logs/order/${orderId}`,
    method: 'get'
  })
}

// 出库单详情
export function getOrderDetailApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/outbounds/${id}/details`,
    method: 'get'
  })
}

// 出库单补录文件
export function saveOutboundsVas(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/outbounds/${data.id}/vas`,
    method: 'PUT',
    data
  })
}
// 出库单管理_获取补录信息(BOL和托盘贴标)
export function getBolAndPalletLabel(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/outbounds/${id}/vas/bolAndPalletLabel`,
    method: 'get'
  })
}

// 出库单管理_保存补录信息
export function saveOutboundsBaseInfo(data, id) {
  return request({
    url: `/api/ovl-service/omc/ovl/outbounds/${id}/actualPalletQuantity`,
    method: 'PUT',
    data
  })
}

// 根据图片ID查询URL
export function getImageUrlApi(params) {
  return request({
    url: '/api/comm-service/cloud/url/cloudFileNames',
    method: 'get',
    params
  })
}

/**
 * 出库单审核通过
 */
export function auditOutboundsApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/outbounds/${data.id}/status/platform/accepted`,
    method: 'put',
    data
  })
}
/**
 * 出库单审核通过
 */
export function rejectedOutboundsApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/outbounds/${data.id}/status/platform/rejected`,
    method: 'put',
    data
  })
}
/** ***************************转仓************************** */


// 转仓列表
export function getTransferOutboundsListApi(params) {
  return request({
    url: `/api/ovl-service/omc/ovl/outbounds/transfer/warehouse`,
    method: 'get',
    params
  })
}
// 转仓列表-批量
export function getTransferOutboundsListBatchApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/outbounds/transfer/warehouse/page/batch`,
    method: 'post',
    data
  })
}
// 出库单导出
export function exportOutboundsListApi(params) {
  return request({
    url: `/api/ovl-service/omc/ovl/outbounds/export`,
    method: 'get',
    params
  })
}
// 一件代发快递单号导入
export function importOutboundShipmentNoApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/outbounds/drop/shipping/shipmentNo/import`,
    method: 'post',
    data
  })
}
// 出库单面单文件导出
export function exportOutboundsShipmentApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/outbounds/shipment/export`,
    method: 'post',
    data
  })
}
// 出库单-取消
export function cancelOutboundApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/outbounds/cancel/${id}`,
    method: 'put'
  })
}
// 出库单—出库单等待提货重试
export function recallOutboundApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/outbounds/waiting/recall/${id}`,
    method: 'put'
  })
}
// 异常处理重试接口
export function exceptionRetryApi(exceptionLogId) {
  return request({
    url: `/api/ovl-service/ovl/exception/retry/${exceptionLogId}`,
    method: 'put'
  })
}
// 转运和转运FBA 出库单提交
export function submitTransferOutboundById(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/outbounds/transfer/warehouse/${id}/submitById`,
    method: 'put'
  })
}
// 一件代发 出库单提交
export function submitOutboundsSubmitByIdApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/outbounds/drop/shipping/${id}/submitById`,
    method: 'put'
  })
}
/** ***************************一单多件************************** */

// 转仓列表
export function getMergePackBoundsListApi(params) {
  return request({
    url: `/api/ovl-service/omc/ovl/outbounds/merge/pack`,
    method: 'get',
    params
  })
}
// 转仓列表
export function getMergePackBoundsListBatchApi(data) {
    return request({
      url: `/api/ovl-service/omc/ovl/outbounds/transfer/warehouse/page/batch`,
      method: 'post',
      data
    })
  }
// 一单多件快递单号导入
export function importPackOutboundShipmentNoApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/outbounds/merge/pack/shipmentNo/import`,
    method: 'post',
    data
  })
}
/** ***************************出库任务************************** */

// 出库任务-列表
export function getOutboundTaskPagesApi(params) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/outbound/task/pages`,
    method: 'get',
    params
  })
}

// 出库任务-列表-批量
export function getOutboundTaskPagesBatchApi(data) {
    return request({
      url: `/api/ovl-service/omc/ovl/order/outbound/task/pages/batch`,
      method: 'POST',
      data
    })
  }
// 出库任务-详情
export function detailOutboundTaskApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/outbound/task/detail/${id}`,
    method: 'get'
  })
}
// 出库任务-新增出库单详情
export function detailCreateOutboundTaskApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/outbound/task/detail/create/${id}`,
    method: 'get'
  })
}
// 出库任务-操作详情
export function detailOutboundTaskByIdApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/outbound/task/out/detail/${id}`,
    method: 'get'
  })
}
// 出库任务-运营确认
export function confirmOutboundTaskApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/outbound/task/confirm/${data.id}`,
    method: 'put',
    data
  })
}
// 出库任务-运营保存草稿
export function saveDraftOutboundTaskApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/outbound/task/confirm/draft/${data.id}`,
    method: 'put',
    data
  })
}
// 出库任务-运营确认取消
export function cancelOutboundTaskApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/outbound/task/cancel/confirm/${id}`,
    method: 'put'
  })
}
// 出库任务-运营拒绝取消
export function rejectOutboundTaskApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/outbound/task/cancel/reject/${id}`,
    method: 'put'
  })
}
// 出库任务-导出
export function exportOutboundTaskApi(params) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/outbound/task/export`,
    method: 'get',
    params
  })
}
// 出库任务明细-导出
export function exportDetailOutboundTaskApi(outboundTaskId) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/outbound/task/detail/export/${outboundTaskId}`,
    method: 'get'
  })
}
// 根据仓库获取尾程服务
export function getLastServiceApi(data) {
  return request({
    url: `/api/ovl-service/ovl/warehouse/${data.warehouseId}/${data.customerId}/product/selections?transportMode=${data.transportMode}`,
    method: "get"
  })
}
// 出库任务-出库
export function saveTaskCallBackOutboundApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/outbound/task/confirm/outbound/out`,
    method: "post",
    data
  })
}


// 根据物流产品获取限制国家
export function getCountryByProductApi(params) {
  return request({
    url: `/api/trans-service/lnt/product/service/country/selections`,
    method: "get",
    params
  })
}
// 出库任务-根据仓库获取仓库配置timeSlot
export function getWarehouseTimeSlotApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/timeSlot/${id}`,
    method: "get"
  })
}
// 出库任务-异常处理重新回调
export function recallOutboundTaskApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/outbound/task/outbound/recall/${id}`,
    method: "put"
  })
}
// 出库任务-创建出库单
export function saveTaskOutboundApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/outbound/task/order`,
    method: "post",
    data
  })
}
// 出库任务-回调隆基详情
export function detailTaskOutboundBackApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/outbound/task/detailForOutbound/${id}`,
    method: "get"
  })
}
// 出库任务-根据托盘号回去库存信息
export function getOutboundGoodsInfoApi(params) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/outbound/task/stockForConfirmOutbound`,
    method: "get",
    params
  })
}
// 出库任务-根据任务id 获取出库单
export function getOutboundByIdApi(id) {
  return request({
    url: `/api/ovl-service/ovl/order/outbound/listBySourceId/${id}`,
    method: "get"
  })
}
// 出库任务-出库货品校验
export function checkOutboundTaskGoodsApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/outbound/task/goods/check`,
    method: "post",
    data
  })
}
// 出库任务-批量导入
export function importTaskOutboundApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/outbound/task/import`,
    method: "post",
    data
  })
}
// 出库任务—非自提回调隆基
export function callTaskOutboundApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/outbound/task/call/${data.id}`,
    method: "put",
    data
  })
}
// 出库任务—云仓出库
export function cloudTaskOutboundApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/outbound/task/confirm/cloud/outbound/out`,
    method: "post",
    data
  })
}
