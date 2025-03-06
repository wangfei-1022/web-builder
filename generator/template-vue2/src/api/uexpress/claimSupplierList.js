// 小包
import request from '@/utils/request'

// 理赔-供应商-列表
export function getClaimSupplierListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/supplier/list`,
    method: 'get',
    params
  })
}

// 理赔-供应商-列表
export function getClaimSupplierListByNosApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/supplier/list/nos`,
    method: 'POST',
    data
  })
}

// 理赔-供应商--导入
export function importClaimSupplierApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/supplier/import`,
    method: 'post',
    data
  })
}

// 理赔-供应商-勾选导出
export function claimSupplierExportByIdsApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/claim/supplier/export/ids',
    method: 'post',
    data
  })
}

// 理赔-供应商-条件导出
export function claimSupplierExportByConditionsApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/claim/supplier/export/conditions',
    method: 'post',
    data
  })
}

// 理赔-供应商-单号导出
export function claimSupplierExportByNosApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/claim/supplier/export/nos',
    method: 'post',
    data
  })
}
