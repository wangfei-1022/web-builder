import request from '@/utils/request'

// 库存列表查询
export function getInventoryListApi(params) {
  return request({
    url: `/api/ovl-service/omc/stock/page/list`,
    method: 'get',
    params
  })
}

// 库存列表导出
export function exportInventoryApi(params) {
  return request({
    url: `/api/ovl-service/omc/stock/query/async/export/excel`,
    method: 'get',
    params
  })
}

// 批次日志列表
export function getLogListApi(params) {
  return request({
    url: `/api/ovl-service/omc/stock/detail/log/page/list`,
    method: 'get',
    params
  })
}
// 货品日志列表
export function getLogGoodsApi(params) {
  return request({
    url: `/api/ovl-service/omc/stock/log/page/list`,
    method: 'get',
    params
  })
}

// 货品库存日志导出
export function exportGoodsLogApi(params) {
  return request({
    url: `/api/ovl-service/omc/stock/log/query/async/export/excel`,
    method: 'get',
    params
  })
}
// 批次库存日志导出
export function exportLogApi(params) {
  return request({
    url: `/api/ovl-service/omc/stock/detail/log/query/async/export/excel`,
    method: 'get',
    params
  })
}
// 库龄导出
export function exportInventoryAgeApi(params) {
  return request({
    url: `/api/ovl-service/omc/stock/age/query/async/export/excel`,
    method: 'get',
    params
  })
}
// 库龄列表
export function getInventoryAgeListApi(params) {
  return request({
    url: `/api/ovl-service/omc/stock/age/page/list`,
    method: 'get',
    params
  })
}
// 库龄列表-批量
export function getInventoryAgeListBatchApi(data) {
  return request({
    url: `/api/ovl-service/omc/stock/age/page/list/batch`,
    method: 'POST',
    data
  })
}
/** *******************************仓储计费单******************************* */
// 仓储计费单汇总列表
export function getStockPagesApi(params) {
  return request({
    url: `/api/ovl-service/ovl/order/stock/pages`,
    method: 'get',
    params
  })
}
// 仓储计费单汇总列表
export function getStockDetailApi(params) {
  return request({
    url: `/api/ovl-service/ovl/stock/charge/pages`,
    method: 'get',
    params
  })
}
// 仓储计费重新计费
export function recalculateApi(orderStockId) {
  return request({
    url: `/api/ovl-service/ovl/order/stock/${orderStockId}/recalculate`,
    method: 'put'
  })
}
// 仓储费明细导出
export function exportChargeDetailApi(data) {
  return request({
    url: `/api/ovl-service/ovl/stock/charge/export`,
    method: 'post',
    data
  })
}
/** *************************光伏库存*************************************** */

// 库龄列表-光伏库龄列表
export function getStockPVListApi(params) {
  return request({
    url: `/api/ovl-service/omc/stock/age/page/list/customer`,
    method: 'get',
    params
  })
}
// 入库单-补录MRN信息
export function saveInboundMrnApi(data) {
  return request({
    url: `/api/ovl-service/omc/order/inbound/mrn`,
    method: 'put',
    data
  })
}
// 入库-MRN文件批量导入
export function importInboundMrnApi(data) {
  return request({
    url: `/api/ovl-service/omc/order/inbound/mrn/import`,
    method: 'post',
    data
  })
}
// 光伏库龄列表导出
export function exportInboundMrnApi(params) {
  return request({
    url: `/api/ovl-service/omc/stock/age/query/async/export/excel/customer`,
    method: 'get',
    params
  })
}
/** *************************盘点列表*************************************** */
// 盘点任务-列表
export function getTakeStockListApi(params) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/take/stock/task/pages`,
    method: 'get',
    params
  })
}
// 盘点任务-详情
export function detailTakeStockApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/take/stock/task/detail/${id}`,
    method: 'get'
  })
}
// 盘点任务-提交盘存
export function submitTakeStockApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/take/stock/task/submit/${data.id}`,
    method: 'put',
    data
  })
}
// 盘点任务-重新下发盘存
export function deliverTakeStockApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/take/stock/task/deliver/${id}`,
    method: 'put'
  })
}
// 盘点任务-导出
export function exportTakeStockApi(params) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/take/stock/task/export`,
    method: 'get',
    params
  })
}
// 盘点任务-导入
export function importTakeStockApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/take/stock/task/import/${data.id}`,
    method: 'post',
    data
  })
}
// 盘点任务明细-列表
export function getTakeStockDetailListApi(params) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/take/stock/task/detail/list`,
    method: 'get',
    params
  })
}
// 库存列表-统计库存
export function getStockCountApi(params) {
  return request({
    url: `/api/ovl-service/omc/stock/count`,
    method: 'get',
    params
  })
}
