// 小包 - 客户管理
import request from '@/utils/request'

// 异常订单列表
export function getOrderExceptionListApi(params) {
  return request({
    url: '/api/ilp-service/omc/ilp/abnormality/list',
    method: 'get',
    params
  })
}

// 未妥投异常-勾选导出
export function orderExceptionExportByIdsApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/abnormality/export/all/ids',
    method: 'post',
    data
  })
}

// 未妥投异常-条件导出
export function orderExceptionExportByConditionsApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/abnormality/export/all/conditions',
    method: 'post',
    data
  })
}

// 未妥投异常-单号导出
export function orderExceptionExportByNosApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/abnormality/export/all/nos',
    method: 'post',
    data
  })
}

// 异常订单列表-单号
export function getOrderExceptionListByNosApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/abnormality/nos',
    method: 'post',
    data
  })
}


// 异常订单列表-Count
export function getOrderExceptionCountApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/abnormality/state/group/count/${params.abnormalityType}`,
    method: 'get',
    params
  })
}

// 重量异常-退回方案接口-我司重量放行-重测重量-重测重量放行
export function returnPlanApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/abnormality/plan',
    method: 'post',
    data
  })
}

// 重量异常-退回-快递退回/司机退回
export function returnPlanAddressApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/abnormality/return/plan/address',
    method: 'post',
    data
  })
}

// 重量异常-退回-客户自提
export function returnPlanCustomerPickupApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/abnormality/return/plan/customer/pickup',
    method: 'post',
    data
  })
}

// 重量异常-退回-委托第三方公司
export function returnPlanThirdPartyApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/abnormality/return/plan/third/party',
    method: 'post',
    data
  })
}

// 报关查验-导入
export function exportDeclareImportApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/abnormality/import/customs/inspection',
    method: 'post',
    data
  })
}


// 报关查验-供应商销毁
export function exportDeclareSupplierDestructionApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/abnormality/customs/inspection/destruction/plan',
    method: 'post',
    data
  })
}

// 报关查验-退回我司仓库
export function exportDeclareReturnWarehouseApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/abnormality/customs/inspection/return/plan',
    method: 'post',
    data
  })
}

// 报关查验-供应商换货出库
export function exportDeclareSupplierExchangeApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/abnormality/customs/inspection/swap/box',
    method: 'post',
    data
  })
}

// 机场安检-导入
export function airportSecurityImportApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/abnormality/import/airport/inspection',
    method: 'post',
    data
  })
}


// 机场安检-供应商销毁
export function airportSecuritySupplierDestructionApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/abnormality/airport/inspection/destruction/plan',
    method: 'post',
    data
  })
}

// 机场安检-退回我司仓库
export function airportSecurityReturnWarehouseApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/abnormality/airport/inspection/returnWms/plan',
    method: 'post',
    data
  })
}

// 清关查验-导入
export function importDeclareImportApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/abnormality/import/customsClearance/inspection',
    method: 'post',
    data
  })
}

// 清关查验-供应商销毁
export function importDeclareSupplierDestructionApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/abnormality/customs/clearance/inspection/destruction/plan',
    method: 'post',
    data
  })
}

// 清关查验-放行
export function importDeclareReleaseApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/abnormality/customs/clearance/inspection/release/plan',
    method: 'post',
    data
  })
}

// 退回海外仓导入-导入
export function importReturnWarehouseApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/abnormality/import/return/oversea/warehouse',
    method: 'post',
    data
  })
}

// 未妥投异常-跟进
export function undeliveredFollowApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/abnormality/undelivery/flow/up',
    method: 'post',
    data
  })
}

// 未妥投异常-批量跟进
export function undeliveredBatchFollowApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/abnormality/import/undelivery/flow/up',
    method: 'post',
    data
  })
}

// 未妥投异常-批量处理完成
export function undeliveredBatchCompletedApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/abnormality/batch/processed',
    method: 'post',
    data
  })
}

// 异常订单列表-费用异常-Count
export function getOrderExceptionChargeCountApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/abnormality/state/group/count/cost/exception`,
    method: 'get',
    params
  })
}

// 泡货待确认异常-免泡申请
export function exemptFoamApplyApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/abnormality/exemptFoamApply',
    method: 'post',
    data
  })
}

// 泡货待确认异常-免泡确认
export function exemptFoamPassApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/abnormality/exemptFoamPass',
    method: 'post',
    data
  })
}

// 泡货待确认异常-产品审核
export function exemptFoamProductAuditApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/abnormality/productAudit',
    method: 'post',
    data
  })
}

// 泡货待确认异常-负责人审核
export function exemptFoamPrincipalAuditApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/abnormality/principalAudit',
    method: 'post',
    data
  })
}

// 泡货待确认异常-泡重放行
export function exemptFoamWeightDischargeApi(data) {
  return request({
    url: '/api/ilp-service/omc/ilp/abnormality/foamWeightDischarge',
    method: 'post',
    data
  })
}