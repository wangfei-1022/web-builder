import request from '@/utils/request'
import URL from './urlTranslator'

// VITE-SP
export function supplementaryCompleted() { }

export function adjustConfirmOrderApi(id) {
  return request({
    url: `/api/sea-service/sea/order/export/adjustComplete/${id}`,
    method: 'PUT'
  })
}

export function getCustomerList(code) { // 行业术语 基础数据 TRANSPORTITEM
  return request({
    url: `${URL.dmn.terminologyByType}?termCode=${code}`,
    method: 'get'
  })
}

export function seaCityListApi(type) { // 行业术语 基础数据  1收货地 2交货地
  return request({
    url: `api/sea-service/sea/city/list?type=${type}`,
    method: 'get'
  })
}
// 订单变更委托人校验
export function alterCustomerValidApi(id) {
  return request({
    url: `/api/sea-service/sea/order/export/alterCustomerValid/${id}`,
    method: 'get'
  })
}
// 订单变更委托人
export function alterCustomerApi(id, data) {
  return request({
    url: `/api/sea-service/sea/order/export/alterCustomer/${id}`,
    method: 'PUT',
    data
  })
}
// 订单管理_列表导出
export function seaOrderListExportApi(params) {
  return request({
    url: `/api/sea-service/sea/order/export/export`,
    method: 'get',
    params
  })
}
// 订单管理_毛利清单导出
export function seaOrderExportGrossProfitApi(params) {
  return request({
    url: `/api/sea-service/sea/order/export/grossProfit/export`,
    method: 'get',
    params
  })
}

// 新建订单
export function exportAddApi(data) {
  return request({
    url: `/api/sea-service/sea/order/export/add`,
    method: 'post',
    data
  })
}
// 订单管理-改单查询
export function orderAlterApi(id) {
  return request({
    url: `/api/sea-service/sea/order/export/alter/order/${id}`,
    method: 'get'
  })
}
// 订单管理-改单
export function orderAlterOrderApi(data) {
  return request({
    url: `/api/sea-service/sea/order/export/alter/alterOrder`,
    method: 'put',
    data
  })
}
// 订单管理-改单-批量
export function alterOrderBatchApi(data) {
  return request({
    url: `/api/sea-service/sea/order/export/alter/alterOrderBatch`,
    method: 'put',
    data
  })
}
// 订单管理_编辑订单
export function orderExportEditApi(data, id) {
  return request({
    url: `/api/sea-service/sea/order/export/${id}`,
    method: 'PUT',
    data
  })
}
// 订单管理_取消订单 /
export function orderCancelApi(id) {
  return request({
    url: `api/sea-service/sea/order/export/cancel/${id}`,
    method: 'PUT'
  })
}
// 订单管理_列表
export function orderListApi(params) {
  return request({
    url: `/api/sea-service/sea/order/export/list`,
    method: 'get',
    params
  })
}
// 订单管理_签发
export function orderIssueApi(data) {
  return request({
    url: `/api/sea-service/sea/order/export/issue`,
    method: 'PUT',
    data
  })
}
// 订单管理_查看订单详情
export function seaOrderDetailApi(id) {
  return request({
    url: `/api/sea-service/sea/order/export/detail/${id}`,
    method: 'GET'
  })
}
// 订舱管理-自动订舱-保存草稿
export function seaAutoBookingSaveDraftApi(data) {
  return request({
    url: `/api/sea-service/sea/ex/auto/booking/job/saveDraft`,
    method: 'post',
    data
  })
}
// 订舱管理-自动订舱-发送订舱
export function seaAutoBookingSendBookingApi(data) {
  return request({
    url: `/api/sea-service/sea/ex/auto/booking/job/sendBooking`,
    method: 'post',
    data
  })
}
// 订舱管理-自动订舱-提交订舱
export function submitBookingApi(id) {
  return request({
    url: `/api/sea-service/sea/ex/auto/booking/job/submitBooking/${id}`,
    method: 'post'
  })
}
// 订单管理_删除订舱
export function deleteBookingApi(id) {
  return request({
    url: `/api/sea-service/sea/ex/booking/job/delete/${id}`,
    method: 'PUT'
  })
}
// 订舱管理-自动订舱-保存订舱
export function seaAutoBookingSaveBookingApi(data) {
  return request({
    url: `/api/sea-service/sea/ex/auto/booking/job/saveBooking`,
    method: 'post',
    data
  })
}

// 订单管理_客户提单判断提单号是否已存在
export function customerAndBlNoListApi(params) {
  return request({
    url: `/api/sea-service/sea/bl/job/customerAndBlNoList`,
    method: 'GET',
    params
  })
}
// 订舱-调整箱型箱量的箱列表
export function jobBookingContainersApi(id) {
  return request({
    url: `/api/sea-service/sea/ex/booking/job/bookingContainers/${id}`,
    method: 'GET'
  })
}
// 订舱-调整箱型箱量
export function jobUpdateContainerApi(data, id) {
  return request({
    url: `/api/sea-service/sea/ex/booking/job/updateContainer/${id}`,
    method: 'PUT',
    data
  })
}
// 订舱提交-判断订舱流水号是否存在
export function repeatCheckThirdSerialNoApi(params) {
  return request({
    url: `/api/sea-service/sea/ex/booking/job/repeatCheck/thirdSerialNo`,
    method: 'GET',
    params
  })
}
// 订舱提交-判断订舱号是否存在
export function repeatCheckSoApi(params) {
  return request({
    url: `/api/sea-service/sea/ex/booking/job/repeatCheck/so`,
    method: 'GET',
    params
  })
}
/** ============================= 订舱 =================================================== * */
// 订单管理_订舱初始化
export function seaBookingInitApi(id) {
  return request({
    url: `/api/sea-service/sea/ex/booking/job/initialize/${id}`,
    method: 'GET'
  })
}
// 获取历史价卡
export function seaBookingContractNoApi(id) {
  return request({
    url: `/api/sea-service/sea/ex/booking/job/contractNo/${id}`,
    method: 'GET'
  })
}
// 订单管理_查看订舱详情
export function seaBookingDetailApi(id) {
  return request({
    url: `/api/sea-service/sea/ex/booking/job/detail/${id}`,
    method: 'GET'
  })
}

// 订单管理_完成订舱 新建
export function seaBookingAddApi(data) {
  return request({
    url: `/api/sea-service/sea/ex/booking/job/save`,
    method: 'post',
    data
  })
}
// 订单管理_人工完成订舱 编辑
export function seaBookingEditApi(data) {
  return request({
    url: `/api/sea-service/sea/ex/booking/job/${data.id}`,
    method: 'PUT',
    data
  })
}
// 订单管理_取消订舱
export function seaBookingCancelApi(id) {
  return request({
    url: `/api/sea-service/sea/ex/booking/job/cancel/${id}`,
    method: 'PUT'

  })
}
// 订单管理_订舱_ 维护船期时间
export function seaUpdateSailingApi(data, id) {
  return request({
    url: `/api/sea-service/sea/ex/booking/job/sailing/${id}`,
    method: 'PUT',
    data
  })
}
// 订舱信息-客户历史收发通
export function seaScnHistoryApi(id, type) {
  return request({
    url: `/api/sea-service/sea/ex/booking/job/scnHistory/${id}?type=${type}`,
    method: 'GET'
  })
}
// 订单管理_订舱_退关
export function seaShutOutApi(id) {
  return request({
    url: `/api/sea-service/sea/ex/booking/job/shutOut/${id}`,
    method: 'PUT'
  })
}
// 订舱-判断订舱号是否可编辑
export function seaSoNoEditApi(id) {
  return request({
    url: `/api/sea-service/sea/ex/booking/job/soNoEdit/${id}`,
    method: 'GET'
  })
}

/** ============================= 装箱 ===================================================
 * */

// 订单管理_装箱_箱信息汇总
export function containerGatherApi(id) {
  return request({
    url: `/api/sea-service/sea/ex/load/job/gather/${id}`,
    method: 'GET'
  })
}

// 订单管理_装箱_根据订舱id查看装箱信息
export function containerListApi(id) {
  return request({
    url: `/api/sea-service/sea/ex/load/job/detail/${id}`,
    method: 'GET'
  })
}

// 订单管理_装箱_根据订舱id查看装箱信息
export function containerInfoListApi(id) {
  return request({
    url: `/api/sea-service/sea/ex/load/job/containerInfoList/${id}`,
    method: 'GET'
  })
}
// 订单管理_装箱信息编辑
export function loadJobApi(data) {
  return request({
    url: `/api/sea-service/sea/ex/load/job/${data.id}`,
    method: 'PUT',
    data
  })
}

// 订单管理_装箱_删除
export function delContainerApi(id) {
  return request({
    url: `/api/sea-service/sea/ex/load/job/delete/${id}`,
    method: 'PUT'
  })
}
// 订单管理_装箱_退关
export function exitCustomsContainerApi(data) {
  return request({
    url: `/api/sea-service/sea/ex/load/job/shutOut`,
    method: 'PUT',
    data
  })
}

export function saveSeaExportJob(data, seJobId) {
  return request({
    url: `${URL.oms.seaExportJob}/${seJobId}`,
    method: 'put',
    data
  })
}

export function quickAddSoNo(data) {
  return request({
    url: `${URL.oms.quickAddSoNo}`,
    method: 'post',
    data
  })
}
// 获取历史船期
export function seaOrderSailingApi(id) {
  return request({
    url: `/api/sea-service/sea/order/export/sailing`,
    method: 'GET'
  })
}
/** 客户提单*********************************************************************************************************/
// 订单管理_客户提单_根据订单id初始化客户提单
export function seaOrderInfoApi(id) {
  return request({
    url: `/api/sea-service/sea/bl/job/orderInfo/${id}`,
    method: 'GET'
  })
}
// 订单管理_客户提单信息汇总
export function seaContainerCalculateApi(params) {
  return request({
    url: `/api/sea-service/sea/bl/job/container/calculate`,
    method: 'GET',
    params
  })
}
// 订单管理_客户提单_获取其他订舱装箱信息
export function seaSoAndContainerListApi(id) {
  return request({
    url: `/api/sea-service/sea/bl/job/soAndContainerList/${id}`,
    method: 'GET'
  })
}
// 订单管理_客户提单_根据箱id加载未生成提单的数据
export function seaContainerInfoListApi(params) {
  return request({
    url: `/api/sea-service/sea/bl/job/containerInfoList`,
    method: 'GET',
    params
  })
}
// 订单管理_客户提单信息保存
export function seaBlSaveApi(data) {
  return request({
    url: `/api/sea-service/sea/bl/job`,
    method: 'post',
    data
  })
}
// 订单管理_客户提单信息编辑
export function seaBlEditSaveApi(data) {
  return request({
    url: `/api/sea-service/sea/bl/job/${data.blId}`,
    method: 'PUT',
    data
  })
}
// 订单管理_客户提单_查看
export function seaBlDetailApi(id) {
  return request({
    url: `/api/sea-service/sea/bl/job/detail/${id}`,
    method: 'GET'
  })
}

// 订单管理_客户提单列表
export function seaBlListApi(id) {
  return request({
    url: `/api/sea-service/sea/bl/job/list/${id}`,
    method: 'GET'
  })
}
// 订单管理_客户提单历史邮箱
export function seaEmailHistoryApi() {
  return request({
    url: `/api/sea-service/sea/bl/job/emailHistory`,
    method: 'GET'
  })
}
/** *船司***********************************************************************/
// 订单管理_船司提单信息保存
export function seaCarrierBlSaveApi(data) {
  return request({
    url: `/api/sea-service/sea/carrier/bl/job`,
    method: 'post',
    data
  })
}
// 订单管理_MBL客户提单保存并发送补料
export function customerSaveAndSendSupplementaryApi(data) {
  return request({
    url: `/api/sea-service/sea/bl/job/saveAndSendSupplementary`,
    method: 'post',
    data
  })
}
// 订单管理_船司提单保存并发送补料
export function saveAndSendSupplementaryApi(data) {
  return request({
    url: `/api/sea-service/sea/carrier/bl/job/saveAndSendSupplementary`,
    method: 'post',
    data
  })
}
// 订单管理_船司提单更新并发送补料
export function updateAndSendSupplementary(data, id) {
  return request({
    url: `/api/sea-service/sea/carrier/bl/job/updateAndSendSupplementary/${id}`,
    method: 'put',
    data
  })
}
// 订单管理_MBL客户提单保存并补料完成
export function customerSupplementaryCompletedApi(data) {
  return request({
    url: `/api/sea-service/sea/bl/job/supplementaryCompleted`,
    method: 'post',
    data
  })
}
// 订单管理_客户提单保存并补料完成 - 新建
export function blSupplementaryCompletedApi(data) {
  return request({
    url: `/api/sea-service/sea/bl/job/supplementaryCompleted`,
    method: 'post',
    data
  })
}
// 订单管理_船司提单保存并补料完成 - 新建
export function supplementaryCompletedApi(data) {
  return request({
    url: `/api/sea-service/sea/carrier/bl/job/supplementaryCompleted`,
    method: 'post',
    data
  })
}
// 订单管理_船司提单保存并补料完成 - 更新
export function supplementaryCompletedUpdateApi(data) {
  return request({
    url: `/api/sea-service/sea/carrier/bl/job/supplementaryCompleted/${data.id}`,
    method: 'put',
    data
  })
}
// 订单管理_发送补料指令
export function sendSupplementaryApi(data) {
  return request({
    url: `/api/sea-service/sea/carrier/bl/job/sendSupplementary`,
    method: 'post',
    data
  })
}
// 订单管理_船司提单上传
export function carrierBlUploadApi(data, id) {
  return request({
    url: `/api/sea-service/sea/carrier/bl/job/upload/${id}`,
    method: 'post',
    data
  })
}
// 订单管理_船司提单信息编辑
export function seaCarrierBlEditApi(data) {
  return request({
    url: `/api/sea-service/sea/carrier/bl/job/${data.blId}`,
    method: 'PUT',
    data
  })
}

// 订单管理_船司提单列表
export function seaCarrierBlListApi(id) {
  return request({
    url: `/api/sea-service/sea/carrier/bl/job/list/${id}`,
    method: 'GET'
  })
}
// 订单管理_船司提单_船司提单初始化
export function seaBlInitializeApi(id, params) {
  return request({
    url: `/api/sea-service/sea/carrier/bl/job/initialize/${id}`,
    method: 'GET',
    params
  })
}
// 订单管理_船司提单_查看
export function seaCarrierDetailApi(id) {
  return request({
    url: `/api/sea-service/sea/carrier/bl/job/detail/${id}`,
    method: 'GET'
  })
}
// 订单管理__船司提单_获取当前提单下 相同船名航次卸货港的提单客户信息
export function seaCustomerAndBlNoListApi(id) {
  return request({
    url: `/api/sea-service/sea/bl/job/customerAndBlNoList/${id}`,
    method: 'GET'
  })
}
// 订单管理_客户提单删除
export function seaCustomerBlDelApi(id) {
  return request({
    url: `/api/sea-service/sea/bl/job/${id}`,
    method: 'DELETE'
  })
}
// 订单管理_船司提单MBL生成
export function seaCarrierMblApi(data) {
  return request({
    url: `/api/sea-service/sea/carrier/bl/job/mbl`,
    method: 'POST',
    data
  })
}
// 订单管理_船司提单HBL生成
export function seaCarrierHblApi(params) {
  return request({
    url: `/api/sea-service/sea/carrier/bl/job/validBlJob`,
    method: 'get',
    params
  })
}
// 订单管理_根据hbl加载箱信息
export function seaCarrierContainerInfoListApi(params) {
  return request({
    url: `/api/sea-service/sea/carrier/bl/job/containerInfoList`,
    method: 'get',
    params
  })
}
// 订单管理_船期查询
export function bookingJobScheduleListApi(params) {
  return request({
    url: `/api/sea-service/sea/ex/auto/booking/job/schedule/list`,
    method: 'get',
    params
  })
}

/** ** 应收费用确认单 ==================================================================================*/
// 合同管理-结算方式下拉列表
export function rechargeModeApi() {
  return request({
    url: `/api/cms-service/cms/contract/selections/rechargeMode`,
    method: 'get'
  })
}
// settlementOffice 收款账套
export function settlementOfficeListApi() {
  return request({
    url: `/api/sys-service/sys/office/dropdownlist`,
    method: 'get'
  })
}

// 海运出口-应收费用确认单-获取业务单号
export function getEntityNosApi(id) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/charge/getEntityNos/${id}`,
    method: 'get'
  })
}
// 海运出口-应收费用确认单-获取业务单号-列表使用
export function getEntityNosByEntityApi(params) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/charge/getEntityNosByEntity`,
    method: 'get',
    params
  })
}
// 海运出口-应付费用确认单-获取业务单号-列表使用
export function payGetEntityNosByEntityApi(params) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/pay/pay/getEntityNosByEntity`,
    method: 'get',
    params
  })
}
// 客户结算单位
export function memberListApi(memberId) {
  return request({
    url: `/api/cms-service/omc/cms/customer/title/${memberId}/list`,
    method: 'get'
  })
}
// 费用名称
export function businessTypeCodeApi() {
  return request({
    url: `/api/mdm-service/dmn/fee/list?businessTypeCode=SEA_EXPORT&keyword=`,
    method: 'get'
  })
}
// 计费方式
export function dictListApi(num = 8) {
  return request({
    url: `/api/fms-service/fms/dict/list/${num}`,
    method: 'get'
  })
}

// 海运出口-费用确认单-提交
export function chargeSubmitApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/charge/submit`,
    method: 'post',
    data
  })
}
// 海运出口-费用确认单-提交-编辑
export function chargeCommonUpdateApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/commonUpdate/${data.confirmationId}`,
    method: 'put',
    data
  })
}
// 海运出口-费用确认单-编辑-高级
export function chargeSpecialUpdateApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/specialUpdate/${data.confirmationId}`,
    method: 'put',
    data
  })
}
// 海运出口-费用确认单-编辑-调整中
export function chargeAdjustUpdateApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/adjustUpdate/${data.confirmationId}`,
    method: 'put',
    data
  })
}
// 费用确认单模板查重接口
export function chargeDuplicateCheckApi(params) {
  return request({
    url: `/api/sea-service/sea/confirmation/charge/template/duplicateCheck`,
    method: 'GET',
    params
  })
}

// 海运出口-获取订单下所有应收费用确认单列表
export function confirmationChargeOrderListApi(id) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/order/entity/${id}/list`,
    method: 'get'
  })
}
// 海运出口-保存海运订单费用类型
export function saveSeaChargeCategoryTypeApi(data) {
  return request({
    url: `/api/sea-service/sea/order/export/chargeCategoryType/${data.id}`,
    method: 'put',
    data
  })
}
// 海运出口-应收费用确认单-列表
export function confirmationChargePageListApi(params) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/pages`,
    method: 'get',
    params
  })
}
// 海运出口-应收费用确认单-删除
export function confirmationChargeDeleteApi(id) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/${id}`,
    method: 'DELETE'
  })
}
// 海运出口-应付费用确认单-删除
export function confirmationPayDeleteApi(id) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/pay/${id}`,
    method: 'DELETE'
  })
}
// 海运出口-应付费用确认单-删除-高级
export function confirmationSpecialPayDeleteApi(id) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/pay/specialDelete/${id}`,
    method: 'DELETE'
  })
}
// 海运出口-应收费用确认单-删除-高级
export function confirmationSpecialDeleteApi(id) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/specialDelete/${id}`,
    method: 'DELETE'
  })
}
// 海运出口-应收费用确认单-单个详情
export function confirmationChargeCommonDetailApi(id) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/commonDetail/${id}`,
    method: 'get'
  })
}
// 海运出口-应收费用确认单-查看-高级
export function confirmationChargeSpecialDetailApi(id) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/specialDetail/${id}`,
    method: 'get'
  })
}


// 海运出口-费用总览-根据订单获取费用明细数据
export function confirmationChargeOrderDetailApi(id) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/order/detail/${id}`,
    method: 'get'
  })
}
// 海运出口-根据单据类型获取当前单据下费用确认单列表-列表迁移
export function confirmationNosByEntityNoApi(params) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/charge/confirmationNosByEntityNo`,
    method: 'get',
    params
  })
}
// 海运出口-根据订单id获取当前单据下费用确认单列表-详情迁移
export function confirmationNoListApi(id) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/order/entity/${id}/confirmationNoList`,
    method: 'get'
  })
}

// 海运出口-应收费用确认单-发送至客户
export function chargeSendToCustomerApi(data, id) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/sendToCustomer/${id}`,
    method: 'PUT',
    data
  })
}
// 海运出口-费用确认单-转入 迁移
export function chargeMoveApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/charge/remove`,
    method: 'PUT',
    data
  })
}
export function payMoveApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/pay/pay/remove`,
    method: 'PUT',
    data
  })
}
// 海运出口-费用确认单-转入-高级
export function chargeSpecialRemoveApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/charge/specialRemove`,
    method: 'PUT',
    data
  })
}
export function paySpecialRemoveApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/pay/pay/specialRemove`,
    method: 'PUT',
    data
  })
}
// 海运出口-费用确认单-转入新建
export function chargeMoveToNewApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/charge/moveToNew`,
    method: 'PUT',
    data
  })
}
export function payMoveToNewApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/pay/pay/moveToNew`,
    method: 'PUT',
    data
  })
}
// 海运出口-费用确认单-转入新建-高级
export function chargeSpecialMoveToNewApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/charge/specialMoveToNew`,
    method: 'PUT',
    data
  })
}
export function paySpecialMoveToNewApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/pay/pay/specialMoveToNew`,
    method: 'PUT',
    data
  })
}
// 海运出口-应收费用确认单-批量费用确认单确认-单个
export function chargeConfirmOneApi(id) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/adjustConfirm/${id}`,
    method: 'PUT'
  })
}
// 海运出口-应收费用确认单-批量费用确认单确认
export function chargeConfirmApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/batchConfirm`,
    method: 'PUT',
    data
  })
}
// 海运出口-应付费用确认单-确认-单个
export function payConfirmOneApi(id) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/pay/adjustConfirm/${id}`,
    method: 'PUT'
  })
}
// 海运出口-应付费用确认单-确认
export function payConfirmApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/pay/batchConfirm`,
    method: 'PUT',
    data
  })
}
// 海运出口-应收费用确认单-根据单据类型获取箱型列表
export function getContainerSizeTypeListApi(params) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/charge/getContainerSizeTypeList`,
    method: 'GET',
    params
  })
}
// 海运出口-应收费用确认单-根据单据类型获取箱型列表
export function payGetContainerSizeTypeListApi(params) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/pay/pay/getContainerSizeTypeList`,
    method: 'GET',
    params
  })
}
// 海运出口-应收费用确认单-根据单据类型获取箱型列表
export function getContainerSizeTypePayListApi(params) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/pay/pay/getContainerSizeTypeList`,
    method: 'GET',
    params
  })
}

/** ======================== 应付 ==================================== */
// 海运出口-应收费用确认单-列表
export function confirmationPayPageListApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/pay/pages`,
    method: 'post',
    data
  })
}
// 海运出口-应收费用确认单-列表-单号批量
export function confirmationPayNosPageListApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/pay/nos/pages`,
    method: 'post',
    data
  })
}
// 海运出口-应收费用确认单-列表-统计
export function confirmationPayPagesTotalApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/pay/pagesTotal`,
    method: 'post',
    data
  })
}
// 海运出口-应收费用确认单-列表-统计-单号批量
export function confirmationPayNosPagesTotalApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/pay/nos/pagesTotal`,
    method: 'post',
    data
  })
}

// 海运出口-应收费用确认单-获取业务单号
export function getEntityNosPayApi(id) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/pay/pay/getEntityNos/${id}`,
    method: 'get'
  })
}
// 海运出口-费用确认单-提交 新建
export function paySubmitApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/pay/pay/submit`,
    method: 'post',
    data
  })
}
// 海运出口-费用确认单-提交-编辑-普通用户
export function payCommonUpdateApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/pay/commonUpdate/${data.confirmationId}`,
    method: 'put',
    data
  })
}
// 海运出口-费用确认单-编辑-高级
export function paySpecialUpdateApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/pay/specialUpdate/${data.confirmationId}`,
    method: 'put',
    data
  })
}
// 海运出口-费用确认单-编辑-高级
export function payAdjustUpdateApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/pay/adjustUpdate/${data.confirmationId}`,
    method: 'put',
    data
  })
}
// 海运出口-获取订单下所有应收费用确认单列表
export function confirmationPayOrderListApi(id) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/pay/order/entity/${id}/list`,
    method: 'get'
  })
}

// 海运出口-应付费用确认单-单个详情
export function confirmationPayCommonDetailApi(id) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/pay/commonDetail/${id}`,
    method: 'get'
  })
}
// 海运出口-应付费用确认单-查看-高级
export function confirmationPaySpecialDetailApi(id) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/pay/specialDetail/${id}`,
    method: 'get'
  })
}
// 海运出口-根据订单id获取当前单据下费用确认单列表-详情迁移
export function confirmationPayNoListApi(id) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/pay/order/entity/${id}/confirmationNoList`,
    method: 'get'
  })
}
// 海运出口-根据单据类型获取当前单据下费用确认单列表-列表迁移
export function confirmationPayEntityNoApi(params) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/pay/pay/confirmationNosByEntityNo`,
    method: 'get',
    params
  })
}
// 应付费用明细-列表
export function detailPagesListApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/pay/detail/pages`,
    method: 'post',
    data
  })
}
// 应付费用明细-列表-单号批量
export function detailPagesNosListApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/pay/detail/nos/pages`,
    method: 'post',
    data
  })
}
// 应收费用明细-列表
export function detailPagesListChargeApi(params) {
  return request({
    url: `/api/sea-service/sea/omc/fms/charge/detail/pages`,
    method: 'get',
    params
  })
}
// 应付费用明细-合计
export function detailPagesTotalApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/pay/detail/pagesTotal`,
    method: 'post',
    data
  })
}
// 应付费用明细-合计-单号批量
export function detailPagesNosTotalApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/pay/detail/nos/pagesTotal`,
    method: 'post',
    data
  })
}
// 应收费用明细-合计
export function detailPagesTotalChargeApi(params) {
  return request({
    url: `/api/sea-service/sea/omc/fms/charge/detail/pagesTotal`,
    method: 'get',
    params
  })
}
// 公共-获取近半年账期
export function periodSettlementModeApi(settlementMode) {
  return request({
    url: `/api/fms-service/fms/bill/period/list/${settlementMode}`,
    method: 'get'
  })
}
// 应付费用明细-获取供应商历史账单列表
export function supplierHistoryApi(params) {
  return request({
    url: `/api/sea-service/sea/omc/fms/pay/detail/bill/supplier/history`,
    method: 'get',
    params
  })
}
// 应收费用明细-获取供应商历史账单列表
export function supplierHistoryChargeApi(params) {
  return request({
    url: `/api/sea-service/sea/omc/fms/charge/detail/bill/supplier/history`,
    method: 'get',
    params
  })
}
// 应付费用明细-全部入账
export function detailAllEntryApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/pay/detail/allEntry`,
    method: 'put',
    data
  })
}
// 应收费用明细-全部入账
export function detailAllEntryChargeApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/charge/detail/allEntry`,
    method: 'put',
    data
  })
}
// 应付费用明细-列表入账
export function detailListEntryApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/pay/detail/entry`,
    method: 'put',
    data
  })
}
// 应收费用明细-列表入账
export function detailListEntryChargeApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/charge/detail/entry`,
    method: 'put',
    data
  })
}
// 应付费用明细-列表导出
export function payDetailExportApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/pay/detail/export`,
    method: 'post',
    data
  })
}
// 应收费用明细-列表导出
export function chargeDetailExportApi(params) {
  return request({
    url: `/api/sea-service/sea/omc/fms/charge/detail/export`,
    method: 'get',
    params
  })
}
// 应收费用明细-全部入账-费用明细过滤
export function chargeEntryConditionApi(params) {
  return request({
    url: `/api/sea-service/sea/omc/fms/charge/detail/all/entry/condition`,
    method: 'get',
    params
  })
}
// 应收费用明细-全部入账-费用明细过滤
export function payEntryConditionApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/pay/detail/all/entry/condition`,
    method: 'post',
    data
  })
}
/** ======================== 应付end ==================================== */
// 应收应付费用时能够给出并单提醒
export function addChargeRemindApi(id) {
  return request({
    url: `/api/sea-service/sea/order/export/addChargeRemind/${id}`,
    method: 'get'
  })
}

// 应收结算单位列表
export function listOfSettlementUnitsApi(params) {
  return request({
    // url: `/api/cms-service/omc/cms/customer/title/${memberId}/timestamp/${timestamp}/businessType/SEA_EXPORT/list`,
    url: `/api/cms-service/v2/omc/cms/customer/title/customerTitle`,
    method: 'get',
    params
  })
}
// 结算分公司下获取应收结算单位
export function settlementBranchUnitApi(partnerRole = 18000) {
  return request({
    // url: `/api/cms-service/omc/cms/customer/title/${memberId}/timestamp/${timestamp}/businessType/SEA_EXPORT/list`,
    url: `/api/scm-service/scm/supplier/selections?name=&partnerRole=${partnerRole}`,
    method: 'get'
  })
}
//
export function customerLinkmanMemberApi(memberId) {
  return request({
    url: `/api/crm-service/crm/customer/linkman/member/${memberId}/linkmen`,
    method: 'get'
  })
}
// 费用确认单模板-根据模板id查询详情
export function confirmationTemplateDetailApi(id) {
  return request({
    url: `/api/sea-service/sea/confirmation/charge/template/detail/${id}`,
    method: 'get'
  })
}
// 费用确认单模板列表
export function confirmationTemplateListApi(params) {
  return request({
    url: `/api/sea-service/sea/confirmation/charge/template/list`,
    method: 'get',
    params
  })
}
// 海运出口-应收费用确认单-根据单据类型获取箱子总毛重和总体积
export function getContainerSumWeightAndVolumeApi(params) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/charge/getContainerSumWeightAndVolume`,
    method: 'get',
    params
  })
}
// 应付费用确认单-根据单据类型获取箱子总毛重和总体积
export function getContainerSumWeightAndVolumePayApi(params) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/pay/pay/getContainerSumWeightAndVolume`,
    method: 'get',
    params
  })
}
// 装箱_获取近期责任方列表(近2个月)
export function getRecentResponsiblePartyApi(params) {
  return request({
    url: `/api/sea-service/sea/ex/load/job/getRecentResponsibleParty`,
    method: 'get',
    params
  })
}
// 装箱_根据责任方获取近期授权人列表(近2个月)
export function getRecentAuthorizedPersonApi(params) {
  return request({
    url: `/api/sea-service/sea/ex/load/job/getRecentAuthorizedPerson`,
    method: 'get',
    params
  })
}

/** ===结算=====*/
export function getCollectNotifyApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/fms/instruction/receipt/collect/notify`,
    method: 'post',
    data
  })
}
// 申请核销应付
export function getApClearApplyApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/fms/instruction/ap/clear/apply`,
    method: 'post',
    data
  })
}

// 税票申请--申请人-初始化 第一步 - 海运
export function invoiceApplyTaxInitSeaApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/invoiceapply/tax/init`,
    method: 'post',
    data
  })
}
// 税票申请-申请人-提交-海运
export function invoiceApplyTaxSubmitSeaApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/invoiceapply/tax/submit`,
    method: 'post',
    data
  })
}
// 形票申请-申请人-初始化 第一步-海运
export function invoiceApplyCommercialInitSeaApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/invoiceapply/commercial/init`,
    method: 'post',
    data
  })
}
// 形票申请-申请人-提交-海运
export function invoiceApplyCommercialSubmitSeaApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/invoiceapply/commercial/submit`,
    method: 'post',
    data
  })
}
// 99.海运订单编辑-贸易条款编辑
export function tradeTermUpdateApi(id, data) {
  return request({
    url: `/api/sea-service/sea/order/export/tradeTermUpdate/${id}`,
    method: 'put',
    data
  })
}
// 100.海运订单编辑-订舱备注编辑
export function putRemarksUpdateApi(id, data) {
  return request({
    url: `/api/sea-service/sea/order/export/remarksUpdate/${id}`,
    method: 'put',
    data
  })
}
// 1.1订单预警-订单校验
export function getCheckAndGetApi(id) {
  return request({
    url: `/api/sea-service/sea/order/export/pre/alert/checkAndGet/${id}`,
    method: 'get'
  })
}
// 1.2订单预警-附件信息列表
export function getAttachmentApi(id) {
  return request({
    url: `/api/sea-service/sea/order/export/pre/alert/attachment/${id}`,
    method: 'get'
  })
}
// 1.3订单预警-邮箱历史列表
export function getEmailHistoryApi() {
  return request({
    url: `/api/sea-service/sea/order/export/pre/alert/emailHistory`,
    method: 'get'
  })
}
// 1.4订单预警-保存
export function postPreAlertApi(data) {
  return request({
    url: `/api/sea-service/sea/order/export/pre/alert`,
    method: 'POST',
    data
  })
}
// 2.1订单-客户提单导出-校验
export function postHblExportCheckApi(data) {
  return request({
    url: `/api/sea-service/sea/order/export/hblExportCheck`,
    method: 'POST',
    data
  })
}

// 应付收款 提交
export function postChargePaymentApplyApi(data) {
  return request({
    url: `/api/sea-service/sea/omc/fms/confirmation/charge/fms/instruction/ap/payment/apply`,
    method: 'POST',
    data
  })
}

// 获取客户企业注册地址
export function getEnterpriseBaseInfoApi(id) {
  return request({
    url: `/api/member-service/omc/member/user/enterprise/baseInfo/${id}`,
    method: 'get'
  })
}
// 101.海运订单编辑-业务标签编辑
export function putBusinessTagUpdateApi(data) {
  return request({
    url: `/api/sea-service/sea/order/export/businessTagUpdate/${data.id}`,
    method: 'PUT',
    data
  })
}
// 102.海运订单编辑-运输条款编辑
export function putTransportTermUpdateApi(data) {
  return request({
    url: `/api/sea-service/sea/order/export/transportTermUpdate/${data.id}`,
    method: 'put',
    data
  })
}

// 102.海运订单编辑-运输条款编辑
export function payableCostConfirmationListExportApi(data) {
    return request({
      url: `/api/sea-service/sea/omc/fms/confirmation/pay/export/excel`,
      method: 'post',
      data
    })
}
