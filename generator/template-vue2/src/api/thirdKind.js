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

/**
 * 获取第三方订单列表
 * @returns {*}
 */

export function getThikPageListApi(params) {
  return request({
    url: `/api/thk-service/thk/order/pages`,
    method: 'get',
    params
  })
}
/**
 * 获取第三类订单业务类型
 * @returns {*}
 */

export function getThikBusinessTypeListApi(params) {
    return request({
      url: `/api/thk-service/thk/order/businessTypeList`,
      method: 'get',
      params
    })
  }
/**
 * 获取第三类订单业务类型
 * @returns {*}
 */

export function getThikBusinessTypeListGroupApi(params) {
  return request({
    url: `/api/thk-service/thk/order/businessGroup`,
    method: 'get',
    params
  })
}
/**
 * 获取第三类电子文件类型
 * @returns {*}
 */

export function getDocumentTreelistApi(params) {
  return request({
    url: `api/mdm-service/dmn/document/treelist`,
    method: 'get',
    params
  })
}
/**
 * 获取客户的是否存在合同
 * @returns {*}
 */

export function getCrmCustomerContractReceiptApi(params) {
  return request({
    url: `/api/thk-service/thk/order/customerContractCheck`,
    method: 'get',
    params
  })
}
/**
 * 获取客户的联系人和销售信息
 * @returns {*}
 */

export function getCrmCustomerLinkmanApi(params) {
  return request({
    url: `/api/thk-service/thk/order/crmCustomerLinkman/${params.customerId}`,
    method: 'get',
    params
  })
}
/**
 * 新增保存第三类订单
 * @returns {*}
 */

export function saveThiOrderApi(data) {
  return request({
    url: `/api/thk-service/thk/order`,
    method: 'post',
    data
  })
}
/**
 * 更新第三类订单客户信息
 * @returns {*}
 */

export function saveThiOrderBaseApi(data) {
  return request({
    url: `/api/thk-service/thk/order/base/${data.id}`,
    method: 'put',
    data
  })
}
/**
 * 更新第三类订单业务信息
 * @returns {*}
 */

export function saveThiOrderBusinessApi(data) {
  return request({
    url: `/api/thk-service/thk/order/business/${data.id}`,
    method: 'put',
    data
  })
}

/**
 *第三类订单详情
 * @returns {*}
 */
export function detailThiOrderApi(id) {
  return request({
    url: `/api/thk-service/thk/order/detail/${id}`,
    method: 'get'
  })
}

/**
 *第三类订单取消
 * @returns {*}
 */
export function cancelThiOrderApi(id) {
  return request({
    url: `/api/thk-service/thk/order/cancel/${id}`,
    method: 'put'
  })
}

/** *******************CCX**************************/

// 费用列表
export function getThiChargeListApi(params) {
  return request({
    url: `/api/thk-service/thk/order/fms/order/charge`,
    method: 'get',
    params
  })
}

// 应收费用确认单列表
export function getThiReceiveListApi(params) {
  return request({
    url: `/api/thk-service/thk/order/omc/fms/settlement/order/entity/list`,
    method: 'get',
    params
  })
}

// 应收费用确认单-调整
export function confirmationAdjustApi(data) {
  return request({
    url: `/api/thk-service/thk/order/omc/fms/settlement/order/confirmation/adjust`,
    method: 'post',
    data
  })
}

// 结算单据-费用确认单-新增/保存编辑
export function receiveConfirmationRecordApi(data) {
  return request({
    url: `/api/thk-service/thk/order/omc/fms/settlement/order/confirmation/charge/record`,
    method: 'post',
    data
  })
}

// 结算单据-费用确认单-调整记账费用
export function receiveConfirmationAdjustApi(data) {
  return request({
    url: `/api/thk-service/thk/order/fms/settlement/order/confirmation/adjust`,
    method: 'post',
    data
  })
}

// 获取查询-费用确认单列表-费用确认单 费用确认
export function receiveConfirmationConfirmApi(confirmationId) {
  return request({
    url: `/api/thk-service/thk/order/omc/fms/settlement/order/confirmation/${confirmationId}/confirm`,
    method: 'post'
  })
}

// 结算单据-费用确认单-删除确认单
export function deleteConfirmationApi(confirmationId) {
  return request({
    url: `/api/thk-service/thk/order/omc/fms/settlement/order/confirmation/${confirmationId}/delete`,
    method: 'delete'
  })
}

// 结算单据-费用确认单-迁移
export function moveConfirmationApi(data) {
  return request({
    url: `/api/thk-service/thk/order/omc/fms/settlement/order/confirmation/charge/move`,
    method: 'post',
    data
  })
}

// 结算单据-费用确认单-迁移-新建
export function moveNewConfirmationApi(data) {
  return request({
    url: `/api/thk-service/thk/order/omc/fms/settlement/order/confirmation/charge/movetonew`,
    method: 'post',
    data
  })
}

// 费用确认单-调整确认(不区分应收应付)
export function confirmationAdjustSubmitApi(data) {
  return request({
    url: `/api/thk-service/thk/order/omc/fms/settlement/order/confirmation/adjust/submit`,
    method: 'post',
    data
  })
}

// 发送短信至客户
export function thkChargeSendToCustomerApi(data) {
  return request({
    url: `/api/thk-service/thk/order/omc/fms/confirmation/sendToCustomer/${data.id}`,
    method: 'put',
    data
  })
}

// 税票申请--申请人-初始化
export function invoiceApplyTaxInitThkApi(data) {
  return request({
    url: `/api/thk-service/thk/order/omc/fms/confirmation/charge/invoiceapply/tax/init/${data.businessType}`,
    method: 'post',
    data
  })
}

// 税票申请-申请人-提交
export function invoiceApplyTaxSubmitThkApi(data) {
  return request({
    url: `/api/thk-service/thk/order/omc/fms/confirmation/charge/invoiceapply/tax/submit/${data.businessType}`,
    method: 'post',
    data
  })
}

// 形票申请-申请人-初始化
export function invoiceApplyCommercialInitThkApi(data) {
  return request({
    url: `/api/thk-service/thk/order/omc/fms/confirmation/charge/invoiceapply/commercial/init/${data.businessType}`,
    method: 'post',
    data
  })
}

// 形票申请-申请人-提交
export function invoiceApplyCommercialSubmitThkApi(data) {
  return request({
    url: `/api/thk-service/thk/order/omc/fms/confirmation/charge/invoiceapply/commercial/submit/${data.businessType}`,
    method: 'post',
    data
  })
}

// 应收 - 申请核销 - 提交
// 申请核销 结算
export function postCollectNotifyApi(data) {
  return request({
    url: `/api/thk-service/thk/order/omc/fms/instruction/receipt/collect/notify`,
    method: 'post',
    data
  })
}
// 应付 - 申请核销 - 提交
// 申请核销 结算
export function postAPCollectNotifyApi(data) {
  return request({
    url: `/api/thk-service/omc/fms/confirmation/ap/instruction/clear/apply`,
    method: 'post',
    data
  })
}

// 应付收款 提交
export function postChargePaymentApplyApi(data) {
  return request({
    url: `/api/thk-service/omc/fms/confirmation/ap/instruction/payment/apply`,
    method: 'POST',
    data
  })
}
// 获取查询-应付费用确认单列表
export function getPayConfirmationListApi(id) {
  return request({
    url: `/api/thk-service/thk/order/omc/fms/confirmation/pay/order/entity/${id}/list`,
    method: 'get'
  })
}

// 应付费用确认单新增
export function payConfirmationSubmitApi(data) {
  return request({
    url: `/api/thk-service/thk/order/omc/fms/confirmation/pay/submit`,
    method: 'post',
    data
  })
}

// 应付费用确认单编辑
export function payConfirmationCommonUpdateApi(id, data) {
  return request({
    url: `/api/thk-service/thk/order/omc/fms/confirmation/pay/commonUpdate/${id}`,
    method: 'put',
    data
  })
}

// 应付费用确认单-调整
export function confirmationPayAdjustApi(id, data) {
  return request({
    url: `/api/thk-service/thk/order/omc/fms/confirmation/pay/adjust/${id}`,
    method: 'put',
    data
  })
}

// 应付费用确认单-删除
export function delPayConfirmationApi(id) {
  return request({
    url: `/api/thk-service/thk/order/omc/fms/confirmation/pay/${id}`,
    method: 'delete'
  })
}

// 应付费用确认单 - 迁移
export function payConfirmationRemoveApi(data) {
  return request({
    url: `/api/thk-service/thk/order/omc/fms/confirmation/pay/remove`,
    method: 'put',
    data
  })
}

// 应付费用确认单 - 迁移新建
export function payConfirmationMoveToNewApi(data) {
  return request({
    url: `/api/thk-service/thk/order/omc/fms/confirmation/pay/moveToNew`,
    method: 'put',
    data
  })
}

// 应付费用确认单 - 费用确认
export function payConfirmationConfirmApi(id) {
  return request({
    url: `/api/thk-service/thk/order/omc/fms/confirmation/pay/confirm/${id}`,
    method: 'put'
  })
}

// 应付费用确认单查询列表
export function getThirdConfirmationApListApi(params) {
  return request({
    url: `/api/thk-service/omc/fms/confirmation/ap/list`,
    method: 'get',
    params
  })
}
// 应收费用确认单查询列表
export function getThirdConfirmationArListApi(params) {
  return request({
    url: `/api/thk-service/omc/fms/confirmation/ar/list`,
    method: 'get',
    params
  })
}
// 应付费用确认单批量确认
export function batchConfirmApApi(data) {
  return request({
    url: `/api/thk-service/omc/fms/confirmation/ap/batchConfirm`,
    method: 'put',
    data
  })
}
// 应收费用确认单批量确认
export function batchConfirmArApi(data) {
  return request({
    url: `/api/thk-service/omc/fms/confirmation/ar/batchConfirm`,
    method: 'put',
    data
  })
}
// 应收费用明细查询列表
export function getChargeArPagesApi(params) {
  return request({
    url: `/api/thk-service/omc/fms/charge/ar/pages`,
    method: 'get',
    params
  })
}
// 应收费用明细查询总数
export function getChargeArTotalApi(params) {
  return request({
    url: `/api/thk-service/omc/fms/charge/ar/pagesTotal`,
    method: 'get',
    params
  })
}
// 应付费用明细查询列表
export function getChargeApPagesApi(params) {
  return request({
    url: `/api/thk-service/omc/fms/charge/ap/pages`,
    method: 'get',
    params
  })
}
// 应付费用明细查询总数
export function getChargeApTotalApi(params) {
  return request({
    url: `/api/thk-service/omc/fms/charge/ap/pagesTotal`,
    method: 'get',
    params
  })
}
// 应付费用明细选择入账
export function entryApChargeApi(data) {
  return request({
    url: `/api/thk-service/omc/fms/charge/ap/entry`,
    method: 'put',
    data
  })
}
// 应收费用明细选择入账
export function entryArChargeApi(data) {
  return request({
    url: `/api/thk-service/omc/fms/charge/ar/entry`,
    method: 'put',
    data
  })
}
// 应付费用明细选择入账-获取历史账期
export function detailApChargeBillApi(params) {
  return request({
    url: `/api/thk-service/omc/fms/charge/ap/bill/supplier/history`,
    method: 'get',
    params
  })
}
// 应收费用明细选择入账-获取历史账期
export function detailArChargeBillApi(params) {
  return request({
    url: `/api/thk-service/omc/fms/charge/ar/bill/supplier/history`,
    method: 'get',
    params
  })
}




// 应收费用确认单详情
export function confirmationArDetailApi(id) {
  return request({
    url: `/api/thk-service/omc/fms/confirmation/ar/detail/${id}`,
    method: 'get'
  })
}

// 应付费用确认单详情
export function confirmationApDetailApi(id) {
  return request({
    url: `/api/thk-service/omc/fms/confirmation/ap/detail/${id}`,
    method: 'get'
  })
}

// 订单调整完成
export function adjustCompleteApi(id) {
  return request({
    url: `/api/thk-service/thk/order/adjustComplete/${id}`,
    method: 'put'
  })
}

// 装箱信息-导入批量保存箱子
export function batchSaveOrderBoxInfoApi(data) {
    return request({
      url: `/api/thk-service/thk/order/box/order/batch/save`,
      method: 'post',
      data
    })
}
  
// 装箱信息-保存箱子
export function saveOrderBoxInfoApi(data) {
    return request({
      url: `/api/thk-service/thk/order/box/${data.id}`,
      method: 'put',
      data
    })
}
    
// 装箱信息-删除箱子
export function deleteOrderBoxInfoApi(id) {
    return request({
      url: `/api/thk-service/thk/order/box/${id}`,
      method: 'delete',
    })
}

    
// 获取税率 businessType arAp
export function getOrderBusinessTaxRateApi(params) {
    return request({
      url: `/api/thk-service/thk/order/business/charge/rate`,
      method: 'get',
      params
    })
}

/**
 * 更新第三类订单箱量
 * @returns {*}
 */
export function saveThiOrderContainerInfoApi(data) {
    return request({
      url: `/api/thk-service/thk/order/box/order/batch/update`,
      method: 'post',
      data
    })
}

export function importThikOrderApi(data) {
    return request({
      url: `/api/thk-service/thk/order/import/order`,
      method: 'post',
      data
    })
}

export function importThikOrderChargeApi(data) {
    return request({
      url: `/api/thk-service/thk/order/import/charge`,
      method: 'post',
      data
    })
}

export function exportThikOrderApi(params) {
    return request({
        url: `/api/thk-service/thk/order/export/charge`,
        method: 'GET',
        params
    })
}
