import request from '@/utils/request'

export function getCustomerAuditListApi(params) {
  return request({
    url: `/api/crm-service/crm/customer/business/page`,
    method: 'get',
    params
  })
}

export function getCustomerAuditCountApi(params) {
  return request({
    url: `/api/crm-service/crm/customer/business/count`,
    method: 'get',
    params
  })
}


export function getCustomerAuditDetailApi(id) {
  return request({
    url: `/api/crm-service/crm/customer/business/detail/${id}`,
    method: 'get'
  })
}

export function auditCustomerApi(data) {
  return request({
    url: `/api/crm-service/crm/customer/business/review`,
    method: 'post',
    data
  })
}

