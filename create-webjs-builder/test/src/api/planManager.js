import request from '@/utils/request'

// 计划列表
export function getPlanListApi(params) {
  return request({
    url: `/api/ilw-service/ilw/plan/query`,
    method: 'get',
    params
  })
}

// 计划详情
export function getPlanDetailApi(id) {
  return request({
    url: `/api/ilw-service/ilw/plan/detail/${id}`,
    method: 'get'
  })
}

// 新建计划 - 国家下拉
export function getPlanCountryListApi(params) {
  return request({
    url: `/api/ilw-service/ilw/product/queryAllCountry`,
    method: 'get',
    params
  })
}

// 保存计划
export function createNewPlanApi(data) {
  return request({
    url: '/api/ilw-service/ilw/plan',
    method: 'post',
    data
  })
}

// 更新计划
export function updatePlanApi(id, data) {
  return request({
    url: `/api/ilw-service/ilw/plan/${id}`,
    method: 'put',
    data
  })
}

// 删除计划
export function deletePlanApi(id) {
  return request({
    url: `/api/ilw-service/ilw/plan/${id}`,
    method: 'delete'
  })
}

// 计划对应的批次列表
export function getPopupBatchListApi(params) {
  return request({
    url: '/api/ilw-service/ilw/batch/query',
    method: 'get',
    params
  })
}

// 新建提单
export function createBillApi(data) {
  return request({
    url: '/api/ilw-service/ilw/plan/bill',
    method: 'post',
    data
  })
}

// 提单列表查询
export function getBillListApi(params) {
  return request({
    url: '/api/ilw-service/ilw/plan/bill/query',
    method: 'get',
    params
  })
}

// 提单详情查询
export function getBillDetailApi(id) {
  return request({
    url: `/api/ilw-service/ilw/plan/bill/detail/${id}`,
    method: 'get'
  })
}

// 提单详情更新
export function updateBillDetailApi(data) {
  return request({
    url: `/api/ilw-service/ilw/plan/bill/${data.id}`,
    method: 'put',
    data
  })
}

// 提单列表删除
export function deleteBillListApi(id) {
  return request({
    url: `/api/ilw-service/ilw/plan/bill/${id}`,
    method: 'delete'
  })
}

// 批次列表
export function getBatchListApi(params) {
  return request({
    url: '/api/ilw-service/ilw/batch/query',
    method: 'get',
    params
  })
}

// 批次详情
export function getBatchDetailApi(id) {
  return request({
    url: `/api/ilw-service/ilw/batch/detail/${id}`,
    method: 'get'
  })
}

// 创建批次
export function createBatchDetailApi(data) {
  return request({
    url: '/api/ilw-service/ilw/batch',
    method: 'post',
    data
  })
}

// 批次更新
export function updateBatchDetailApi(id, data) {
  return request({
    url: `/api/ilw-service/ilw/batch/${id}`,
    method: 'put',
    data
  })
}

// 绑定车辆信息
export function bindCarInfoApi(data) {
  return request({
    url: '/api/ilw-service/ilw/batch/binding/car',
    method: 'post',
    data
  })
}

// 导出批次
export function exportBatchInfoApi(params) {
  return request({
    url: '/api/ilw-service/ilw/batch/export',
    method: 'get',
    params
  })
}

// 绑定计划
export function batchBindPlanApi(data) {
  return request({
    url: '/api/ilw-service/ilw/batch/binding/plan',
    method: 'put',
    data
  })
}

// 解绑计划
export function batchUnbindPlanApi(batchId) {
  return request({
    url: `/api/ilw-service/ilw/batch/unbindingPlan/${batchId}`,
    method: 'put'
  })
}

// 箱维度批次列表
export function getBatchBoxListApi(params) {
  return request({
    url: '/api/ilw-service/ilw/batch/listBoxDetailForBatch',
    method: 'get',
    params
  })
}

// 订单维度批次列表
export function getBatchOrderListApi(params) {
  return request({
    url: '/api/ilw-service/ilw/batch/listParcelDetailForBox',
    method: 'get',
    params
  })
}

// 批次绑定提单
export function batchBindBillApi(data) {
  return request({
    url: '/api/ilw-service/ilw/batch/binding/planBill',
    method: 'put',
    data
  })
}

// 批次解绑提单
export function batchUnbindBillApi(batchId) {
  return request({
    url: `/api/ilw-service/ilw/batch/unbindingPlanBill/${batchId}`,
    method: 'put'
  })
}
