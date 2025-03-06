// 小包
import request from '@/utils/request'

// 理赔-客户-列表
export function getClaimCustomerListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/customer/list`,
    method: 'get',
    params
  })
}

// 理赔-客户-列表-Nos
export function getClaimCustomerListNosApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/customer/nos/list`,
    method: 'post',
    data
  })
}

// 理赔-客户-勾选导出
export function claimCustomerExportByIdsApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/claim/customer/export/ids',
    method: 'post',
    data
  })
}

// 理赔-客户-条件导出
export function claimCustomerExportByConditionsApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/claim/customer/export/conditions',
    method: 'post',
    data
  })
}

// 理赔-客户-单号导出
export function claimCustomerExportByNosApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/claim/customer/export/nos',
    method: 'post',
    data
  })
}

// 理赔-客户-列表-待赔付
export function getClaimCustomerToPayListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/customer/list/to/pay`,
    method: 'get',
    params
  })
}

// 理赔-客户-列表-待抵扣
export function getClaimCustomerToOffsetListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/customer/list/to/offset`,
    method: 'get',
    params
  })
}

// 理赔-客户-列表-数量
export function getClaimCustomerCountApi() {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/customer/count/to/do`,
    method: 'get'
  })
}

// 客户理赔-创建
export function createClaimCustomerApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/customer/create`,
    method: 'post',
    data
  })
}

// 理赔-客户-导入
export function importClaimCustomerApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/customer/import`,
    method: 'post',
    data
  })
}

// 客户理赔-修改
export function updateClaimCustomerApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/customer/update`,
    method: 'post',
    data
  })
}


// 客户理赔-重新提交
export function resubmitClaimCustomerApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/customer/resubmit`,
    method: 'post',
    data
  })
}

// 客户理赔-取消
export function cancelClaimCustomerApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/customer/cancel`,
    method: 'post',
    data
  })
}

// 客户理赔-批量抵扣
export function batchOffsetClaimCustomerApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/customer/submit/offset`,
    method: 'post',
    data
  })
}

// 客户理赔-批量赔付
export function batchPayClaimCustomerApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/customer/submit/pay`,
    method: 'post',
    data
  })
}

// 理赔-客户-审核通过-客服
export function auditClaimCustomerApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/customer/auditing/success`,
    method: 'post',
    data
  })
}

// 理赔-客户-拒绝-客服
export function rejectClaimCustomerApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/customer/auditing/fail`,
    method: 'post',
    data
  })
}

// 理赔-客户-客服-批量审核
export function batchCSAuditClaimCustomerApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/customer/batch/auditing`,
    method: 'post',
    data
  })
}

// 理赔-客户-产品-批量审核
export function batchProductAuditClaimCustomerApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/customer/batch/auditing/product`,
    method: 'post',
    data
  })
}

// 理赔-客户-审核通过-产品
export function auditProductClaimCustomerApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/customer/auditing/product/success`,
    method: 'post',
    data
  })
}

// 理赔-客户-拒绝-产品
export function rejectProductClaimCustomerApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/customer/auditing/product/fail`,
    method: 'post',
    data
  })
}

// 保单-客户-详情
export function getClaimCustomerDetailApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/customer/detail`,
    method: 'get',
    params
  })
}

// 保单-客户-通过订单号去检测
export function getClaimDetailByOrderNoApi(orderNo) {
  return request({
    url: `/api/ilp-service/omc/ilp/insurance/customer/detail/orderNo/${orderNo}`,
    method: 'get'
  })
}

// 理赔-客户-预创建-校验
export function checkClaimDetailByOrderNoApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/customer/pre/create`,
    method: 'get',
    params
  })
}

// 理赔-客户-可修改信息的详情
export function getEditClaimDetailApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/customer/update/info`,
    method: 'get',
    params
  })
}

// 理赔-保险公司-推送-客户理赔发起
export function cusomerPushInsuranceClaimApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/insurer/push/customer`,
    method: 'POST',
    data
  })
}
