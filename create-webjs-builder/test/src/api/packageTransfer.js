import request from '@/utils/request'

export function transferByParcelApi(data) {
  return request({
    url: '/api/ilw-service/ilw/requisition/byParcel',
    method: 'post',
    data
  })
}

export function transferByBoxApi(data) {
  return request({
    url: '/api/ilw-service/ilw/requisition/byBox',
    method: 'post',
    data
  })
}

export function createJobNoApi() {
  return request({
    url: '/api/ilw-service/ilw/requisition/genJobNo',
    method: 'get'
  })
}

export function getTransferredListApi(params) {
  return request({
    url: '/api/ilw-service/ilw/requisition/query',
    method: 'get',
    params
  })
}

export function exportTransferredListApi(params) {
  return request({
    url: '/api/ilw-service/ilw/requisition/export',
    method: 'get',
    params
  })
}

export function batchArrivedApi(data) {
  return request({
    url: '/api/ilw-service/ilw/requisition/batchDestination',
    method: 'post',
    data
  })
}

export function printTagsApi(id) {
  return request({
    url: `/api/ilw-service/ilw/requisition/labelAndUpdate/${id}`,
    method: 'put'
  })
}

export function getTransferredDetailApi(id) {
  return request({
    url: `/api/ilw-service/ilw/requisition/detailByRequisitionId/${id}`,
    method: 'get'
  })
}

export function revokTransferredApi(parcelId) {
  return request({
    url: `/api/ilw-service/ilw/requisition/cancelRequisition/${parcelId}`,
    method: 'post'
  })
}

export function printTransferredApi(data) {
  return request({
    url: '/api/ilw-service/ilw/requisition/label',
    method: 'post',
    data
  })
}

// 导出调拨明细
export function exportTransferredDetailApi(params) {
  return request({
    url: '/api/ilw-service/ilw/requisition/exportDetail',
    method: 'get',
    params
  })
}
