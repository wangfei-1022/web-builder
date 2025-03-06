import request from '@/utils/request'

// 获取关账可选时间与账套
export function getProfitClosingOfficeApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/profit/closing/list/office/years`,
    method: 'get',
    params
  })
}

// 获取账套 所有的月份信息
export function getProfitClosingOfficeMonthApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/profit/closing/list/simple`,
    method: 'get',
    params
  })
}

// 获取账套 获取关账明细列表
export function getProfitClosingDetailApi(closingId) {
  return request({
    url: `/api/fms-service/omc/fms/profit/closing/${closingId}/item/list`,
    method: 'get'
  })
}

// 关账
export function profitClosingApi(closingId) {
  return request({
    url: `/api/fms-service/omc/fms/profit/closing/${closingId}/close`,
    method: 'PUT'
  })
}

// 取消关账
export function profitClosingCancelApi(closingId) {
  return request({
    url: `/api/fms-service/omc/fms/profit/closing/${closingId}/revert`,
    method: 'PUT'
  })
}

// 取消关账
export function uploadVoucherNumberApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/profit/closing/${data.id}/upload/voucherNumber`,
    method: 'PUT',
    data
  })
}


// 导出
export function profitClosingExportApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/profit/closing/item/${params.closingId}/export/charges`,
    method: 'GET',
    params
  })
}