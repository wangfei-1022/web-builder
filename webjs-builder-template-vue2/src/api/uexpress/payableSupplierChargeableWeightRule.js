import request from '@/utils/request'

// 供应商计费重规则-列表
export function getSupplierWeightRuleListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/weight/rule/list`,
    method: 'get',
    params
  })
}

// 供应商计费重规则-新增
export function addSupplierWeightRuleApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/weight/rule/create`,
    method: 'POST',
    data
  })
}

// 供应商计费重规则-重量规则-创建重量规则版本
export function addVersionSupplierWeightRuleApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/weight/rule/create/version`,
    method: 'POST',
    data
  })
}

// 供应商计费重规则-重量规则-更新重量规则版本
export function updateSupplierWeightRuleApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/weight/rule/update`,
    method: 'POST',
    data
  })
}


// 供应商计费重规则-重量规则-删除重量规则版本
export function deleteSupplierWeightRuleApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/weight/rule/delete`,
    method: 'POST',
    data
  })
}
