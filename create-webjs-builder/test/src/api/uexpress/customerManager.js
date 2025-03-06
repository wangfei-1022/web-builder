// 小包 - 客户管理
import request from '@/utils/request'

// 基础信息下拉
export function getDictListApi(dictType) {
  return request({
    url: `/api/ilp-service/ilp/dict/list/${dictType}`,
    method: 'get'
  })
}

// 客户管理 - 列表
export function getCustomerListApi(params) {
  return request({
    url: '/api/ilp-service/omc/ilp/customer/list',
    method: 'get',
    params
  })
}

// 所属销售
export function getSalesListApi() {
  return request({
    url: '/api/sys-service/sys/user/selections/sales',
    method: 'get'
  })
}

// 客户列表-导出
export function exportCustomerListApi(params) {
  return request({
    url: '/api/ilp-service/omc/crm/customer/export',
    method: 'get',
    params
  })
}

// 客户管理 - 启用
export function enableCustomerApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/customer/activate',
    method: 'post',
    data
  })
}

// 客户管理 - 禁用
export function disableCustomerApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/customer/forbidden',
    method: 'post',
    data
  })
}

// 客户详情
export function getCustomerDetailApi(customerId) {
  return request({
    url: `/api/ilp-service/omc/ilp/customer/detail/${customerId}`,
    method: 'get'
  })
}

// 业务配置
export function savetCustomerOperationApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/customer/update',
    method: 'post',
    data
  })
}

// 导出客户余额
export function customerExportBalanceApi(params) {
  return request({
    url: '/api/ilp-service/omc/ilp/customer/exportBalance',
    method: 'get',
    params
  })
}
