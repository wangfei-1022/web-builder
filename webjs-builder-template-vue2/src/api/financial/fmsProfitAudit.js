import request from '@/utils/request'

// 盈亏审核列表
export function getProfitAuditListApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/profit/apply/list/audit`,
    method: 'get',
    params
  })
}

// 盈亏审核列表-cuont
export function getProfitAduitCountApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/profit/apply/count/audit`,
    method: 'get',
    params
  })
}

// 盈亏审核详情-操作日志
export function getProfitAuditLogsApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/profit/apply/${params.profitApplyId}/logs`,
    method: 'get',
    params
  })
}

// 盈亏审核列表-审核通过
export function profitApplyAuditApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/profit/apply/${data.profitApplyId}/pass`,
    method: 'PUT',
    data
  })
}

// 盈亏审核列表-审核通过-批量
export function profitApplyAuditBatchApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/profit/apply/batch/${data.profitApplyId}/pass`,
    method: 'PUT',
    data
  })
}

// 盈亏审核列表-审核拒绝
export function profitApplyRejectApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/profit/apply/${data.profitApplyId}/reject`,
    method: 'PUT',
    data
  })
}

// 盈亏审核列表-审核时候获取相应的账套
export function getProfitAuditSettlementOfficeIdApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/profit/apply/list/settlementOfficeId`,
    method: 'POST',
    data
  })
}


// 盈亏审核列表-审核时候获取 根据相应的账套 获取盈亏月份
export function getProfitAuditProfitPeroidApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/profit/closing/list/last/unclosed/simple`,
    method: 'get',
    params
  })
}

// 盈亏审核列表-往来费用-当期往期枚举
export function getProfitHistoryStateApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/order/charge/selection/profitApply/historyState`,
    method: 'get',
    params
  })
}
