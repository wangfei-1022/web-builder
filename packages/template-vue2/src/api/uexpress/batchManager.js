// 小包 - 批次管理
import request from '@/utils/request'

// 批次列表
export function getBatchListApi(params) {
  return request({
    url: '/api/ilp-service/omc/ilp/outbound/list',
    method: 'get',
    params
  })
}

// 验证提单号是否存在
export function validateBlNoApi(bolNo) {
  return request({
    url: `/api/ilp-service/omc/ilp/bol/detail/update/${bolNo}`,
    method: 'get'
  })
}

// 批次详情
export function getBatchDetailApi(outboundId) {
  return request({
    url: `/api/ilp-service/omc/ilp/outbound/detail/${outboundId}`,
    method: 'get'
  })
}

// 查看批次操作日志
export function getBatchLogListApi(outboundId) {
  return request({
    url: `/api/ilp-service/omc/ilp/outbound/log/${outboundId}`,
    method: 'get'
  })
}

// 批次详情 - 包裹列表
export function getBatchParcelListApi(params) {
  return request({
    url: '/api/ilp-service/omc/ilp/parcel/list/outbound',
    method: 'get',
    params
  })
}

// 批次提交备注
export function submitBatchRemarksApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/outbound/remarks/submit',
    method: 'post',
    data
  })
}

// 解绑提单
export function unbindBlNoApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/composite/outbound/bind/cancel',
    method: 'post',
    data
  })
}

// 批次绑定提单
export function batchBindBlNoApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/composite/outbound/bind',
    method: 'post',
    data
  })
}

// 批批次-导出报关数据
export function exportManifestDataApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/outbound/manifest/import/send',
    method: 'post',
    data
  })
}

// 批次详情 - 导出
export function getBatchExportApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/outbound/exportOrderSalesByOutbound',
    method: 'post',
    data
  })
}
