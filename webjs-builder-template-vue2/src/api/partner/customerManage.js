import request from '@/utils/request'

// 客户列表
export function getCustomerListApi(params) {
  return request({
    url: '/api/crm-service/omc/crm/customer/pages',
    method: 'get',
    params
  })
}

// 客户列表-导出
export function exportCustomerListApi(params) {
  return request({
    url: '/api/crm-service/omc/crm/customer/export',
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

// 职务类型
export function getPostTypeListApi() {
  return request({
    url: '/api/crm-service/crm/customer/linkman/post/type/selections',
    method: 'get'
  })
}

// 业务类型
export function getBusinessTypeListApi() {
  return request({
    url: '/api/mdm-service/dmn/term/item/dropdownlist',
    method: 'get',
    params: { termCode: 'BUSINESS_TYPE' }
  })
}

// 客户类型
export function getCustomerTypeListApi() {
  return request({
    url: '/api/crm-service/crm/customer/customerType/selections',
    method: 'get'
  })
}

// 校验客户唯一
export function checkCustomerIsUniqueApi(data) {
  return request({
    url: `/api/crm-service/crm/customer/countryCode/${data.countryCode}/name/${data.customerName}/exists`,
    method: 'get'
  })
}

// 根据客户名称获取对应的回显
export function getCustomerByNameApi(data) {
  return request({
    url: `/api/member-service/omc/member/user/byNameOrId/thirdPartyOrMember/enterprise`,
    method: 'get',
    params: data
  })
}

// 提交客户
export function submitCustomerApi(data) {
  return request({
    url: `/api/crm-service/omc/crm/customer/submit`,
    method: 'post',
    data: data
  })
}

// 编辑客户
export function updateCustomerApi(data) {
  return request({
    url: `/api/crm-service/omc/crm/customer/${data.id}`,
    method: 'put',
    data: data
  })
}

// 客户详情
export function getCustomerDetailApi(id) {
  return request({
    url: `/api/crm-service/omc/crm/customer/${id}/detail`,
    method: 'get'
  })
}

// 客户详情-联系人
export function getCustomerLinkmanApi(id) {
  return request({
    url: `/api/crm-service/omc/crm/customer/${id}/linkman`,
    method: 'get'
  })
}

// 客户详情-联系人新建
export function addCustomerLinkmanApi(data) {
  return request({
    url: `/api/crm-service/omc/crm/customer/linkman`,
    method: 'post',
    data
  })
}

// 客户合作业务
export function getCustomerBusinessApi(id) {
  return request({
    url: `/api/crm-service/omc/crm/customer/${id}/business`,
    method: 'get'
  })
}

// 历史合同
export function getCustomerHistoryContractApi(params) {
  return request({
    url: `/api/cms-service/omc/cms/contract/customer/history/pages`,
    method: 'get',
    params
  })
}

// 客户联系人删除校验
export function deleteCheckApi(id) {
  return request({
    url: `/api/crm-service/omc/crm/customer/linkman/businessCheck/${id}`,
    method: 'get'
  })
}

// 客户销售列表
export function getCustomerSalesListApi(id) {
  return request({
    url: `/api/crm-service/crm/customer/principle/${id}/list`,
    method: 'get'
  })
}

// 客户-结算单位管理
export function getCustomerSettlementListApi(params) {
  return request({
    url: `/api/fms-service/fin/settlement/title/config/pages`,
    method: 'get',
    params
  })
}

// 客户-结算单位管理-更新
export function updateCustomerSettlementEmailApi(data) {
  return request({
    url: `/api/fms-service/fin/settlement/title/config/${data.id}`,
    method: 'put',
    data
  })
}

// 客户- 客户来源
export function getCustomerSourceTypeApi(params) {
  return request({
    url: `api/crm-service/crm/customer/customerSourceType/selections`,
    method: 'get',
    params
  })
}
