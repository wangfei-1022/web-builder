import request from '@/utils/request'

// VITE-SP
export function getCustomerDropDownListByJob() { }


// 页面的表头设置功能
// 页面表格表头信息-保存
export function gridSchemeSaveApi(data) {
  return request({
    url: '/api/mdm-service/cfg/grid/scheme',
    method: 'post',
    data
  })
}

// 页面表格表头信息-更新
export function gridSchemeUpdateApi(data) {
  return request({
    url: '/api/mdm-service/cfg/grid/scheme',
    method: 'put',
    data
  })
}

// 页面表格表头信息-更新名称
export function gridSchemeUpdateTemplateNameApi(params) {
  return request({
    url: `/api/mdm-service/cfg/grid/scheme/${params.schemeId}/name`,
    method: 'put',
    params
  })
}

// 页面表格表头信息-LIST
export function getGridSchemeListApi(moduleCode) {
  return request({
    url: `/api/mdm-service/cfg/grid/scheme/user/${moduleCode}/selects`,
    method: 'get'
  })
}

// 页面表格表头信息-删除
export function gridSchemeDeleteApi(id) {
  return request({
    url: `/api/mdm-service/cfg/grid/scheme/${id}`,
    method: 'DELETE'
  })
}

// 一海通分公司
export function getYHTListApi() {
  return request({
    url: '/api/sys-service/sys/office/dropdownlist',
    method: 'get'
  })
}

/**
 * 获取币种 name==code
 * @param {*} params
 * @returns
 */
export function getCurrenciesListApi(params) {
  return request({
    url: '/api/mdm-service/dmn/currency/dropdownlist/currencies',
    method: 'get',
    params
  })
}
/**
 * 获取币种 name!=code
 * @param {*} params
 * @returns
 */
export function getCurrenciesApi(params) {
  return request({
    url: '/api/fms-service/wallet/account/currencies',
    method: 'get',
    params
  })
}

/**
 * 仓库下拉
 * @param {*} params
 * @returns
 */
export function getWarehouseListApi(params) {
  return request({
    url: '/api/ovl-service/warehouse/selections/list',
    method: 'get',
    params
  })
}


// 获取已经添加了的海运港口
export function seaportAddListApi(data) {
  return request({
    url: `/api/mdm-service/dmn/seaport/dictionary`,
    method: 'get',
    params: data
  })
}

// 获取海运港口基础数据
export function seaportListApi(data) {
  return request({
    url: `/api/mdm-service/dmn/seaportlist`,
    method: 'get',
    params: data
  })
}

// 获取铁路站基础数据
export function getRailStationListApi(data) {
    return request({
      url: `/api/mdm-service/dmn/railway/station/dropdown/list`,
      method: 'get',
      params: data
    })
  }

// 获取空运港口
export function airportListApi(data) {
  return request({
    url: `/api/mdm-service/dmn/airport/pages`,
    method: 'get',
    params: data
  })
}

// 获取航空公司
export function airLineListApi(data) {
  return request({
    url: `/api/mdm-service/dmn/airline/company/pages`,
    method: 'get',
    params: data
  })
}

// 获取运费条款
export function getTerminologyListByTypeApi(termCode) {
  const params = { termCode }
  return request({
    url: `/api/mdm-service/dmn/term/item/dropdownlist`,
    method: 'get',
    params
  })
}

// 获取贸易条款
export function getTerminologyListByTypeSearchApi(params) {
  return request({
    url: `/api/mdm-service/dmn/term/item/dropdownlist`,
    method: 'get',
    params
  })
}

// 获取客户列表
export function getCustomerDropDownListApi(params) {
  return request({
    url: `/api/crm-service/crm/customer/selections`,
    method: 'get',
    params
  })
}

// 获取供应商列表
export function getSupplierDropDownListApi(params) {
  return request({
    url: `/api/scm-service/scm/supplier/selections`,
    method: 'get',
    params
  })
}

// 获取应收 结算单位
export function getSettlementCompanyListApi(params) {
  return request({
    url: `/api/cms-service/omc/cms/customer/title/selections`,
    method: 'get',
    params
  })
}

// 获取会员列表
export function getMemberDropDownListApi(params) {
  return request({
    url: `/api/member-service/mem/member/info/selections`,
    method: 'get',
    params
  })
}

// 指定业务类型 费用项目查询
export function getFeeListApi(params) {
  return request({
    url: `/api/mdm-service/dmn/fee/list`,
    method: 'get',
    params
  })
}

// 结算中心 费用项目查询
export function getFmsFeeByKeyApi(params) {
  return request({
    url: `/api/mdm-service/dmn/fee/list/fms`,
    method: 'get',
    params
  })
}

// 所有运营
export function getAllOperationApi(params) {
  return request({
    url: '/api/sys-service/sys/user/selections/all',
    method: 'get',
    params
  })
}

// 船公司
export function getShippingCompanyListApi(params) {
  return request({
    url: '/api/mdm-service/dmn/shipping/companylist',
    method: 'get',
    params
  })
}

// 快递公司
export function getExpressDeliveryListApi(params) {
  return request({
    url: '/api/mdm-service/dmn/logistics/company/selections',
    method: 'get',
    params
  })
}

// 快递公司
export function getTaxRateListApi() {
  return request({
    url: '/api/fms-service/fms/invoice/tax/rate/list',
    method: 'get'
  })
}
// 结算抬头-指定时刻
export function getSettlementHeaderApi(memberId, timestamp) {
  return request({
    // url: `/api/cms-service/omc/cms/customer/title/${memberId}/timestamp/${timestamp}/list`,
    url: `/api/cms-service/omc/cms/customer/title/memberRole/20/${memberId}/timestamp/${timestamp}/businessType/SEA_EXPORT/list`,
    method: 'get'
  })
}

// 结算抬头-指定时刻
export function getRechargeModeApi(memberId, timestamp) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/member/${memberId}/businessType/SEA_EXPORT/timestamp/${timestamp}/rechargeMode`,
    method: 'get'
  })
}
// 结算抬头-获取客户指定业务时间的结算抬头(指定角色)
export function memberRoleCustomerTitleApi(params) {
  return request({
    url: `/api/cms-service/v2/omc/cms/customer/title/memberRole/customerTitle`,
    method: 'get',
    params
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

// oss 上传获取 临时访问权限
export function getOssUploadSecurityTokenApi() {
  return request({
    url: `/api/mdm-service/oss/sts`,
    method: 'get'
  })
}

// oss 上传获取 临时访问权限
export function getOssUploadPathApi() {
  return request({
    url: `/api/mdm-service/oss/xpath`,
    method: 'get'
  })
}

// 获取存在city的country code
export function getCountryHasCityApi() {
  return request({
    url: `/api/mdm-service/dmn/country/list/code`,
    method: 'get'
  })
}

// 获取部门下拉
export function getDepartmentListApi() {
  // officeId
  return request({
    url: `/api/sys-service/sys/department/dropdownlist`,
    method: 'get'
  })
}

// 获取省市区
export function getReginInfoApi(params) {
  return request({
    url: '/api/mdm-service/dmn/administrative/division',
    method: 'get',
    params
  })
}

// 根据业务类型获取应付供应商结算单位类型列表
export function getSettementCompanyTypeListApi(params) {
  return request({
    url: `/api/scm-service/scm/supplier/supplierType/business/${params.businessType}`,
    method: 'get',
    params
  })
}

// 客服
export function getCustomerServiceListApi(params) {
  return request({
    url: `/api/sys-service/sys/user/selections/customerService`,
    method: 'get',
    params
  })
}

export function getUserDropDownList(params) {
  return request({
    url: '/api/sys-service/sys/common/sysuserlist',
    method: 'get',
    params
  })
}
