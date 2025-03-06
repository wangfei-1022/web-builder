import request from '@/utils/request'


// 海外仓订单类型
export function getOrderTypesApi() {
  return request({
    url: `/api/ovl-service/ovl/selections/orderTypes`,
    method: 'get'
  })
}

/*
//获取结算中心状态数据接口
1 入账状态
2 发票申请状态
3 开票状态
4 核销状态
*/
export function getDictDataApi(dictType) {
  return request({
    url: `/api/fms-service/fms/dict/list/${dictType}`,
    method: 'get'
  })
}

// 获取查询-费用确认单列表
export function getReceiveConfirmationListApi(params) {
  return request({
    url: `/api/ovl-service/ovl/omc/fms/confirmation/list`,
    method: 'get',
    params
  })
}

// 获取查询-应收费用明细列表
export function getReceiveChargeListApi(params) {
  return request({
    url: `/api/ovl-service/ovl/omc/fms/charge/list`,
    method: 'get',
    params
  })
}

// 获取查询-应收账单列表
export function getReceiveBillListApi(params) {
  return request({
    url: `/api/ovl-service/ovl/omc/fms/bill/list`,
    method: 'get',
    params
  })
}

// 账单-确认账单
export function receiveBillConfirmApi(billId) {
  return request({
    url: `/api/ovl-service/ovl/omc/fms/bill/${billId}/confirmBill`,
    method: 'put'
  })
}


// 获取结算单据-费用确认单-获取费用确认单详情
// 入参订单号
export function getReceiveConfirmationDetailApi(entityNo) {
  return request({
    url: `/api/ovl-service/ovl/omc/fms/settlement/order/confirmation/detail/${entityNo}`,
    method: 'get'
  })
}

// 结算单据-费用确认单-调整记账费用
export function receiveConfirmationAdjustApi(data) {
  return request({
    url: `/api/ovl-service/ovl/omc/fms/settlement/order/confirmation/submit`,
    method: 'post',
    data
  })
}

// 应收费用明细-加入账单
export function receiveChargeJoinBillApi(data) {
  return request({
    url: `/api/ovl-service/ovl/omc/fms/charge/entry`,
    method: 'post',
    data
  })
}

// 费用确认单-加入账单
export function receiveConfirmationJoinBillApi(data) {
  return request({
    url: `/api/ovl-service/ovl/omc/fms/charge/confirmation/entry`,
    method: 'post',
    data
  })
}

// 不再出账
export function receiveChargeUnallowApi(data) {
  return request({
    url: `/api/ovl-service/ovl/omc/fms/charge/entry/unallow`,
    method: 'post',
    data
  })
}

// 允许出账/恢复出账
export function receiveChargeAllowApi(data) {
  return request({
    url: `/api/ovl-service/ovl/omc/fms/charge/entry/allow`,
    method: 'post',
    data
  })
}


// 下载账单
export function downloadBillFileApi(billid) {
  return request({
    url: `/api/ovl-service/ovl/omc/fms/bill/file/${billid}`,
    method: 'get'
  })
}

// 费用确认单新增费用
export function addOrderConfirmationChargeApi(data) {
  return request({
    url: `/api/ovl-service/ovl/omc/fms/settlement/order/confirmation/charge`,
    method: 'post',
    data
  })
}
// 校验业务单号是否有费用确认单
export function checkOrderConfirmationChargeApi(params) {
  return request({
    url: `/api/ovl-service/ovl/omc/fms/settlement/order/confirmation/charge/check/bizNo`,
    method: 'put',
    params
  })
}

