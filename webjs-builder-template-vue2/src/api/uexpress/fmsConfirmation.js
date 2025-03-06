import request from '@/utils/request'

/*
//获取结算中心状态数据接口
1 入账状态
2 发票申请状态
3 开票状态
4 核销状态
*/
export function getDictDataApi(dictType) {
  return request({
    url: `/api/ilp-service/ilp/dict/list/${dictType}`,
    method: 'get'
  })
}

// 获取查询-费用确认单列表-结算
export function getReceiveConfirmationListFinanceApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/settlement/confirmation/ar/list/settler`,
    method: 'get',
    params
  })
}

// 获取查询-费用确认单列表-产品
export function getReceiveConfirmationListProductApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/settlement/confirmation/ar/list/product`,
    method: 'get',
    params
  })
}

// 获取查询-费用确认单列表-运营
export function getReceiveConfirmationListOperatorApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/settlement/confirmation/ar/list/op`,
    method: 'get',
    params
  })
}

// 获取查询-费用确认单列表-结算
export function getReceiveConfirmationListFinanceByNosApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/settlement/confirmation/ar/list/settler/nos`,
    method: 'POST',
    data
  })
}

// 获取查询-费用确认单列表-产品
export function getReceiveConfirmationListProductByNosApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/settlement/confirmation/ar/list/product/nos`,
    method: 'POST',
    data
  })
}

// 获取查询-费用确认单列表-运营
export function getReceiveConfirmationListOperatorByNosApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/settlement/confirmation/ar/list/op/nos`,
    method: 'POST',
    data
  })
}

// 获取查询-费用确认单列表-统计
export function getReceiveConfirmationListTotalApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/settlement/confirmation/ar/list/total`,
    method: 'get',
    params
  })
}

// 费用确认单 批量调整
export function importBatchAdjustChargeApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/settlement/confirmation/ar/charge/adjust/batch`,
    method: 'post',
    data
  })
}

// 费用确认单 批量确认
export function receiveConfirmationConfirmApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/settlement/confirmation/ar/confirm/include/adjust`,
    method: 'post',
    data
  })
}

// 费用确认单 批量确认-单个循环
export function receiveConfirmationConfirmOneApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/settlement/confirmation/ar/confirm/include/adjust/one`,
    method: 'post',
    data
  })
}

// 获取查询-费用确认单列表-费用确认单 撤回确认
export function receiveRecallConfirmationConfirmApi(ids) {
  return request({
    url: `/api/ilp-service/omc/fms/settlement/order/confirmation/withdraw`,
    method: 'post',
    data: {
      confirmationIds: ids
    }
  })
}

// 获取查询-费用确认单列表-详情 单个
export function getReceiveConfirmationDetailByIdApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/settlement/confirmation/ar/detail`,
    method: 'get',
    params
  })
}

// 获取费用确认单-获取费用确认单详情
// 入参订单号
export function getReceiveConfirmationDetailApi(entityNo) {
  return request({
    url: `/api/ilp-service/omc/fms/settlement/order/confirmation/detail/${entityNo}`,
    method: 'get'
  })
}

// 费用确认单-添加费用
export function receiveConfirmationAddChargeApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/settlement/confirmation/ar/charge/add`,
    method: 'post',
    data
  })
}

// 费用确认单-调整费用
export function receiveConfirmationAdjustChargeApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/settlement/confirmation/ar/charge/adjust`,
    method: 'post',
    data
  })
}

// 费用确认单-移出账单
export function receiveConfirmationRemoveBillApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/settlement/confirmation/ar/entry/cancel`,
    method: 'post',
    data
  })
}

// 费用确认单-加入账单
export function receiveConfirmationJoinBillApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/settlement/confirmation/ar/entry`,
    method: 'post',
    data
  })
}

// 不再出账
export function receiveUnallowBillApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/settlement/confirmation/ar/entry/unallow`,
    method: 'post',
    data
  })
}

// 允许出账/恢复出账
export function receiveAllowBillApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/settlement/confirmation/ar/entry/allow`,
    method: 'post',
    data
  })
}


// 费用确认单-费用项规则
export function getConfirmationChargeRuleApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/settlement/confirmation/ar/charge/rule/list`,
    method: 'get',
    params
  })
}

// 下载账单
export function downloadBillFileApi(billid) {
  return request({
    url: `/api/ilp-service/omc/fms/bill/file/${billid}`,
    method: 'get'
  })
}

