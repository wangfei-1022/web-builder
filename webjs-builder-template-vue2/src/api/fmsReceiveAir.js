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
    url: `/api/fms-service/fms/dict/list/${dictType}`,
    method: 'get'
  })
}

// 获取查询-费用确认单列表
export function getReceiveConfirmationListApi(params) {
    return request({
        url: `/api/air-service/air/omc/fms/confirmation/list`,
        method: 'get',
        params
    })
}

// 获取查询-费用确认单列表-统计
export function getReceiveConfirmationListTotalApi(params) {
    return request({
        url: `/api/air-service/air/omc/fms/confirmation/list/total`,
        method: 'get',
        params
    })
}

// 获取查询-应收费用明细列表
export function getReceiveChargeListApi(params) {
    return request({
        url: `/api/air-service/air/omc/fms/charge/list`,
        method: 'get',
        params
    })
}

// 获取查询-应收费用明细列表-统计
export function getReceiveChargeListTotalApi(params) {
    return request({
        url: `/api/air-service/air/omc/fms/charge/list/total`,
        method: 'get',
        params
    })
}

// 获取查询-应收账单列表
export function getReceiveBillListApi(params) {
    return request({
        url: `/api/air-service/air/omc/fms/bill/list`,
        method: 'get',
        params
    })
}

// 获取查询-应收账单-获取账单详情
export function getReceiveBillDetailApi(billId) {
    return request({
        url: `/api/air-service/air/omc/fms/bill/detail/${billId}`,
        method: 'get'
    })
}

// 获取查询-应收账单-获取账单费用
export function getReceiveBillDetailChargeApi(billId) {
    return request({
        url: `/api/air-service/air/omc/fms/charge/bill/${billId}`,
        method: 'get'
    })
}

// 获取查询-应收账单列表-统计
export function getReceiveBillListTotalApi(params) {
    return request({
        url: `/api/air-service/air/omc/fms/bill/list/total`,
        method: 'get',
        params
    })
}

// 账单-确认账单
export function receiveBillConfirmApi(billId) {
    return request({
        url: `/api/air-service/air/omc/fms/bill/${billId}/confirm`,
        method: 'post'
    })
}

// 账单 撤回
export function receiveBillRecallApi(billId) {
    return request({
        url: `/api/air-service/air/omc/fms/bill/${billId}/cancel`,
        method: 'post'
    })
}

// 获取查询-费用确认单列表-费用确认单 确认
export function receiveConfirmationConfirmApi(confirmationId) {
    return request({
        url: `/api/air-service/air/omc/fms/settlement/order/confirmation/${confirmationId}/confirm`,
        method: 'post'
    })
}

// 获取查询-费用确认单列表-详情 单个
export function getReceiveConfirmationDetailByIdApi(id) {
    return request({
        url: `/api/air-service/air/omc/fms/settlement/order/confirmation/detail/id/${id}`,
        method: 'get'
    })
}

// 获取订单的费用总览
export function geOrderChargeDetailApi(orderId) {
  return request({
      url: `/api/air-service/air/omc/fms/order/charge`,
      method: 'get',
      params: {
        orderId: orderId
      }
  })
}

// 获取结算单据-费用确认单-获取费用确认单详情
// 根据入参订单号
export function getReceiveConfirmationDetailApi(entityNo) {
    return request({
        url: `/api/air-service/air/omc/fms/settlement/order/confirmation/detail/${entityNo}`,
        method: 'get'
    })
}

// 获取结算单据-费用确认单-获取费用确认单详情
// 根据订单Id
export function getReceiveConfirmationByOrderIdApi(orderId, entityType) {
  return request({
      url: `/api/air-service/air/omc/fms/settlement/order/entity/list`,
      method: 'get',
      params: {
        orderId: orderId,
        entityType: entityType
      }
  })
}

// 结算单据-费用确认单-删除确认单
export function deleteConfirmationApi(confirmationId) {
  return request({
    url: `/api/air-service/air/omc/fms/settlement/order/confirmation/${confirmationId}/delete`,
    method: 'post'
  })
}

// 结算单据-费用确认单-迁移
export function moveConfirmationApi(data) {
  return request({
    url: `/api/air-service/air/omc/fms/settlement/order/confirmation/charge/move`,
    method: 'post',
    data
  })
}

// 结算单据-费用确认单-迁移-新建
export function moveNewConfirmationApi(data) {
  return request({
    url: `/api/air-service/air/omc/fms/settlement/order/confirmation/charge/movetonew`,
    method: 'post',
    data
  })
}

// 结算单据-费用确认单-登记费用
export function receiveConfirmationRecordApi(data) {
  return request({
    url: `/api/air-service/air/omc/fms/settlement/order/confirmation/charge/record`,
    method: 'post',
    data
  })
}

// 结算单据-费用确认单-调整记账费用
export function receiveConfirmationAdjustApi(data) {
    return request({
        url: `/api/air-service/air/omc/fms/settlement/order/confirmation/charge/adjust`,
        method: 'post',
        data
    })
}

// 应收费用明细-加入账单
export function receiveChargeJoinBillApi(data) {
    return request({
        url: `/api/air-service/air/omc/fms/charge/entry`,
        method: 'post',
        data
    })
}

// 费用确认单-加入账单
export function receiveConfirmationJoinBillApi(data) {
    return request({
        url: `/api/air-service/air/omc/fms/charge/confirmation/entry`,
        method: 'post',
        data
    })
}

// 不再出账
export function receiveChargeUnallowApi(data) {
    return request({
        url: `/api/air-service/air/omc/fms/charge/entry/unallow`,
        method: 'post',
        data
    })
}

// 允许出账/恢复出账
export function receiveChargeAllowApi(data) {
    return request({
        url: `/api/air-service/air/omc/fms/charge/entry/allow`,
        method: 'post',
        data
    })
}

// 应收费用明细-生成账单
export function receiveChargeCreateBillApi(data) {
    return request({
        url: `/api/air-service/air/omc/fms/bill/create/chargeids`,
        method: 'post',
        data
    })
}

// 应收费用确认单-生成账单
export function receiveConfirmationCreateBillApi(data) {
    return request({
        url: `/api/air-service/air/omc/fms/bill/create/confirmationids`,
        method: 'post',
        data
    })
}

// 应收费用确认单-生成账单
export function receiveConfirmationCreateBillArApi(data) {
  return request({
      url: `/api/air-service/air/omc/fms/bill/ar/create/confirmationids`,
      method: 'post',
      data
  })
}

// 应付费用确认单-生成账单
export function receiveConfirmationCreateBillAPApi(data) {
  return request({
      url: `/api/air-service/air/omc/fms/bill/ap/create/confirmationids`,
      method: 'post',
      data
  })
}

// 查询-账单列表状态数量
export function getBillStatusNumberApi(countType) {
    return request({
        url: `/api/air-service/air/omc/fms/bill/count/${countType}`,
        method: 'get'
    })
}

// 下载账单
export function downloadBillFileApi(billid) {
    return request({
        url: `/api/air-service/air/omc/fms/bill/file/${billid}`,
        method: 'get'
    })
}

// 发送短信至客户
export function airChargeSendToCustomerApi(data, billid) {
  return request({
      url: `/api/air-service/air/omc/fms/confirmation/sendToCustomer//${billid}`,
      method: 'put',
      data
  })
}

// 形票申请-申请人-初始化 第一步-空运
export function invoiceApplyCommercialInitAirApi(data) {
  return request({
    url: `/api/air-service/air/omc/fms/confirmation/charge/invoiceapply/commercial/init`,
    method: 'post',
    data
  })
}

// 形票申请-申请人-提交-空运
export function invoiceApplyCommercialSubmitAirApi(data) {
  return request({
    url: `/api/air-service/air/omc/fms/confirmation/charge/invoiceapply/commercial/submit`,
    method: 'post',
    data
  })
}

// 税票申请--申请人-初始化 第一步 - 空运
export function invoiceApplyTaxInitAirApi(data) {
  return request({
    url: `/api/air-service/air/omc/fms/confirmation/charge/invoiceapply/tax/init`,
    method: 'post',
    data
  })
}

// 税票申请-申请人-提交-空运
export function invoiceApplyTaxSubmitAirApi(data) {
  return request({
    url: `/api/air-service/air/omc/fms/confirmation/charge/invoiceapply/tax/submit`,
    method: 'post',
    data
  })
}
