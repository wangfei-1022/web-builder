import request from '@/utils/request'

// 供应商列表
export function getSupplierListApi(params) {
  return request({
    url: '/api/scm-service/omc/scm/supplier/pages',
    method: 'get',
    params
  })
}

// 供应商列表-导出
export function exportSupplierListApi(params) {
  return request({
    url: '/api/scm-service/omc/scm/supplier/export',
    method: 'get',
    params
  })
}

// 供应商类型
export function getSupplierTypeApi() {
  return request({
    url: '/api/scm-service/scm/supplier/supplierType/selections',
    method: 'get'
  })
}

// 供应商等级
export function getScoreLevelTypeApi() {
  return request({
    url: '/api/scm-service/scm/supplier/scoreLevelType/selections',
    method: 'get'
  })
}

// 供应商详情
export function getSupplierDetailApi(id) {
  return request({
    url: `/api/scm-service/omc/scm/supplier/detail/${id}`,
    method: 'get'
  })
}

// 提交
export function submitSupplierApi(data) {
  return request({
    url: '/api/scm-service/omc/scm/supplier/submit',
    method: 'post',
    data
  })
}

// 更新
export function updateSupplierApi(data) {
  return request({
    url: `/api/scm-service/omc/scm/supplier/${data.id}`,
    method: 'put',
    data
  })
}

// 更新供应商类型
export function updateSupplierTypeApi(data) {
  return request({
    url: `/api/scm-service/omc/scm/supplier/${data.id}/partner/role`,
    method: 'POST',
    data
  })
}

// 供应商详情
export function getSupplierRoleApi(id) {
  return request({
    url: `/api/scm-service/omc/scm/supplier/${id}/partner/role`,
    method: 'get'
  })
}

// 校验供应商名字唯一
export function checkSupplierIsUniqueApi(params) {
  return request({
    url: `/api/scm-service/scm/supplier/countryCode/${params.countryCode}/name/exists`,
    method: 'get',
    params
  })
}

// 供应商联系人-获取联系人列表
export function getSupplierContactListApi(memberId) {
  return request({
    url: `/api/scm-service/scm/supplier/linkman/member/${memberId}/linkmen`,
    method: 'get'
  })
}

// 供应商合作业务
export function getSupplierBusinessApi(id) {
  return request({
    url: `/api/scm-service/omc/scm/supplier/${id}/business`,
    method: 'get'
  })
}

// 供应商联系人-联系人新建
export function addSupplierLinkmanApi(data) {
  return request({
    url: `/api/scm-service/omc/scm/supplier/linkman`,
    method: 'post',
    data
  })
}

// 历史合同
export function getSupplierHistoryContractApi(params) {
  return request({
    url: `/api/cms-service/omc/cms/contract/supplier/history/pages`,
    method: 'get',
    params
  })
}
