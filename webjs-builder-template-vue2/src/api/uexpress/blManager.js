// 小包 - 提单管理
import request from '@/utils/request'

// 提单列表
export function getBLListApi(params) {
  return request({
    url: '/api/ilp-service/omc/ilp/bol/list',
    method: 'get',
    params
  })
}

// 提单详情
export function getBLDetailApi(bolId) {
  return request({
    url: `/api/ilp-service/omc/ilp/bol/detail/${bolId}`,
    method: 'get'
  })
}

// 包裹列表
export function getBLParcelListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/parcel/list/bol`,
    method: 'get',
    params
  })
}

// 提单日志列表
export function getBLLogListApi(bolId) {
  return request({
    url: `/api/ilp-service/omc/ilp/bol/log/${bolId}`,
    method: 'get'
  })
}

// 弹窗提单详情
export function getBLDialogInfoApi(blNo) {
  return request({
    url: `/api/ilp-service/omc/ilp/bol/detail/${blNo}`,
    method: 'get'
  })
}

// 保存提单修改
export function submitModifyBLInfoApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/bol/air/update',
    method: 'post',
    data
  })
}

// 提单-更新状态
export function submitUpdateStateBLApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/bol/air/update/status',
    method: 'post',
    data
  })
}

// 提单-导出清关数据
export function exportManifestDataApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/bol/air/manifest/import/export',
    method: 'post',
    data
  })
}

// 提单-导出清关数据-发送邮件
export function sendEmailManifestDataApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/bol/air/manifest/import/send',
    method: 'post',
    data
  })
}

// 提单-导出清关数据-推送
export function pushManifestDataApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/bol/air/manifest/import/send',
    method: 'post',
    data
  })
}


// 提单-导出清关数据-发送尾程预报邮件
export function sendManifestLastMileApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/bol/air/manifest/last/mile/send',
    method: 'post',
    data
  })
}

// 提单-详情-批次列表
export function getBLBatchInfoApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/outbound/list/bol`,
    method: 'get',
    params
  })
}

// 提单 - 导出
export function getBlExportApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/bol/exportOrderSalesByBol',
    method: 'post',
    data
  })
}
