// 空运出口
import request from '@/utils/request'

// 锁定订单
export function adjustConfirmOrderApi(id) {
  return request({
    url: `/api/air-service/air/order/export/adjustComplete/${id}`,
    method: 'PUT'
  })
}

// 新增订单
export function addAirExportApi(data) {
  return request({
    url: `/api/air-service/air/order/export`,
    method: 'post',
    data
  })
}

// 新增订单并加入主单
export function addAirExportOriginMasterApi(data) {
  return request({
    url: `/api/air-service/air/job/export/${data.jobId}/createOrder`,
    method: 'post',
    data
  })
}

// 新增小票初始化
export function addAirExportInitApi(jobId) {
  return request({
    url: `/api/air-service/air/job/export/${jobId}/initOrder`,
    method: 'post'
  })
}

// 获取订单列表
export function getAirExportOrderListApi(params) {
  return request({
    url: `/api/air-service/air/order/export/pages`,
    method: 'get',
    params
  })
}

// 配舱管理_订单列表
export function getAirExportOrderCargoPlanListApi(params) {
  return request({
    url: `/api/air-service/air/order/export/cargoPlan/pages`,
    method: 'get',
    params
  })
}

// 配舱管理_配舱
export function putAirExportOrderCargoPlanApi(orderId, data) {
  return request({
    url: `/api/air-service/air/order/export/${orderId}/cargoPlan`,
    method: 'put',
    data
  })
}

// 获取空出作业订单列表
export function getAirExportJobListApi(params) {
  return request({
    url: `/api/air-service/air/job/export/pages`,
    method: 'get',
    params
  })
}

// 获取空出作业订单列表
export function getAirExportJobChildrenListApi(jobId) {
  return request({
    url: `/api/air-service/air/job/export/${jobId}/subOrders`,
    method: 'get'
  })
}

// 获取主单详情
export function getAirExportOrderMasterDetailApi(jobId) {
  return request({
    url: `/api/air-service/air/job/export/${jobId}`,
    method: 'get'
  })
}

// 获取订单详情
export function getAirExportOrderDetailApi(orderId) {
  return request({
    url: `/api/air-service/air/order/export/${orderId}`,
    method: 'get'
  })
}

// 基础信息调整
export function updateAirExportOrderBaseInfoApi(data) {
  return request({
    url: `/api/air-service/air/order/export/${data.orderId}/baseInfo`,
    method: 'put',
    data
  })
}

// 合并
export function updateAirExportOrderMergeApi(data) {
  return request({
    url: `/api/air-service/air/order/export/orders/merge`,
    method: 'post',
    data: data
  })
}

// 批量改配 order
export function updateAirExportOrderShippingSpaceBatchApi(data) {
  return request({
    url: `/api/air-service/air/order/export/batch/modification/space`,
    method: 'put',
    data
  })
}

// 批量改配 job
export function updateAirExportJobShippingSpaceBatchApi(data) {
  return request({
    url: `/api/air-service/air/job/export/batch/modification/space`,
    method: 'put',
    data
  })
}

// 改配 order
export function updateAirExportOrderShippingSpaceApi(data) {
  return request({
    url: `/api/air-service/air/order/export/${data.orderId}/modification/space`,
    method: 'put',
    data
  })
}

// 改配 job
export function updateAirExportJobShippingSpaceApi(data) {
  return request({
    url: `/api/air-service/air/job/export/${data.jobId}/modification/space`,
    method: 'put',
    data
  })
}

// 空出拼票主单批量起飞
export function updateAirExportJobAtdBatchApi(data) {
  return request({
    url: `/api/air-service/air/job/export/batch/atd/${data.atd}`,
    method: 'put',
    data: data.ids
  })
}

// 批量起飞
export function updateAirExportOrderAtdBatchApi(data) {
  return request({
    url: `/api/air-service/air/order/export/batch/atd/${data.atd}`,
    method: 'put',
    data: data.ids
  })
}

// 空出拼票主单批量到港
export function updateAirExportJobAtaBatchApi(data) {
  return request({
    url: `/api/air-service/air/job/export/batch/ata/${data.ata}`,
    method: 'put',
    data: data.ids
  })
}

// 批量到港
export function updateAirExportOrderAtaBatchApi(data) {
  return request({
    url: `/api/air-service/air/order/export/batch/ata/${data.ata}`,
    method: 'put',
    data: data.ids
  })
}


// 加入之前的查询
export function getJoinAirExportOrderListApi(params) {
  return request({
    url: `/api/air-service/air/job/export/addable/order`,
    method: 'get',
    params
  })
}

// 加入
export function joinUpdateAirExportOrderListApi(data) {
  return request({
    url: `/api/air-service/air/job/export/${data.jobId}/add/orders`,
    method: 'post',
    data: data.ids
  })
}

// 移除
export function joinRemoveAirExportOrderListApi(data) {
  return request({
    url: `/api/air-service/air/job/export/${data.jobId}/remove/${data.orderId}`,
    method: 'post'
  })
}

// 主单收货
export function deliveryAirExportJobListApi(jobId) {
  return request({
    url: `/api/air-service/air/job/export/${jobId}/arrived`,
    method: 'put'
  })
}

// 订单收货
export function deliveryAirExportOrderListApi(orderId) {
  return request({
    url: `/api/air-service/air/order/export/${orderId}/arrived`,
    method: 'put'
  })
}

// 入仓初始化
export function inboundInitAirExportOrderApi(orderId) {
  return request({
    url: `/api/air-service/air/job/export/inbound/${orderId}/list`,
    method: 'get'
  })
}

// 入仓
export function inboundAirExportOrderApi(data) {
  return request({
    url: `/api/air-service/air/job/export/inbound/${data.orderId}/cargo`,
    method: 'put',
    data: data
  })
}

// MBL 获取详情
export function getMBLDetailApi(jobId) {
  return request({
    url: `/api/air-service/air/bl/job/${jobId}/mbl`,
    method: 'get'
  })
}

// MBL 更新
export function updateMBLDetailApi(data) {
  return request({
    url: `/api/air-service/air/bl/mbl/${data.id}`,
    method: 'put',
    data: data
  })
}

// HBL 获取详情
export function getHBLDetailApi(orderId) {
  return request({
    url: `/api/air-service/air/bl/order/${orderId}/hbl`,
    method: 'get'
  })
}

// MBL 更新
export function updateHBLDetailApi(data) {
  return request({
    url: `/api/air-service/air/bl/hbl/${data.id}`,
    method: 'put',
    data: data
  })
}


// tree
export function getDocumentTypeCodeTreeApi() {
  return request({
    url: `/api/mdm-service/dmn/document/treelist/`,
    method: 'get',
    params: {
      parentCode: 'AE'
    }
  })
}


// booking
export function bookingAirExportOrderApi(orderId) {
  return request({
    url: `/api/air-service/air/order/export/${orderId}/booking`,
    method: 'put'
  })
}

// booking
export function bookingAirExportJobApi(orderId) {
  return request({
    url: `/api/air-service/air/job/export/${orderId}/booking`,
    method: 'put'
  })
}

export function getCustomerAirExportCreate() {
  return request({
    url: `/api/air-service/air/order/export/create`,
    method: 'get'
  })
}
// 产品航线列表
export function getAirLineList() {
  return request({
    url: `/api/air-service/air/product/airline/allRelease`,
    method: 'get'
  })
}
// 订舱确认
export function updateBookingInfo(id, data) {
  return request({
    url: `/api/air-service/air/order/export/${id}/updateBookingInfo`,
    method: 'put',
    data: data
  })
}


// 应付费用确认列表
export function getAirfmsConfirmationPayListApi(params) {
  return request({
    url: `/api/air-service/air/omc/fms/confirmation/pay/pages`,
    method: 'get',
    params
  })
}

export function batchConfirmAirfmsConfirmationPay(data) {
  return request({
    url: `/api/air-service/air/omc/fms/confirmation/pay/batchConfirm`,
    method: 'put',
    data: data
  })
}

// // customer contact
export function getCustomerContactAirExportJobApi(id) {
  return request({
    url: `api/sys-service/sys/common/pnrpartnerlist/contact/${id}`,
    method: 'get',
  })
}

// 应收费用明细-列表
export function detailPagesListChargeApi(params) {
  return request({
    url: `/api/air-service/air/omc/fms/charge/detail/pages`,
    method: 'get',
    params
  })
}

// 应收费用明细-全部入账-费用明细过滤
export function payEntryConditionApi(params) {
  return request({
    url: `/api/air-service/air/omc/fms/pay/detail/all/entry/condition`,
    method: 'get',
    params
  })
}
// 应收费用明细-获取供应商历史账单列表
export function supplierHistoryChargeApi(params) {
  return request({
    url: `/api/air-service/air/omc/fms/charge/detail/bill/supplier/history`,
    method: 'get',
    params
  })
}

// 应收费用明细-列表导出
export function chargeDetailExportApi(params) {
  return request({
    url: `/api/air-service/air/omc/fms/charge/detail/export`,
    method: 'get',
    params
  })
}
// 应收费用明细-全部入账-费用明细过滤
export function chargeEntryConditionApi(params) {
  return request({
    url: `/api/air-service/air/omc/fms/charge/detail/all/entry/condition`,
    method: 'get',
    params
  })
}
// 应收费用明细-合计
export function detailPagesTotalChargeApi(params) {
  return request({
    url: `/api/air-service/air/omc/fms/charge/detail/pagesTotal`,
    method: 'get',
    params
  })
}

// 应付start
// 应付明细列表
export function getAirfmsPayListApi(params) {
  return request({
    url: `/api/air-service/air/omc/fms/pay/detail/pages`,
    method: 'get',
    params
  })
}
// 应付明细导出
export function exportAirfmsPayApi(params) {
  return request({
    url: `/api/air-service/air/omc/fms/pay/detail/export`,
    method: 'get',
    params
  })
}
// 应付明细入账
export function entryAirfmsPayApi(data) {
  return request({
    url: `/api/air-service/air/omc/fms/pay/detail/entry`,
    method: 'put',
    data: data
  })
}

// 应付明细合计
export function detailPagesTotalApi(params) {
  return request({
    url: `/api/air-service/air/omc/fms/pay/detail/pagesTotal`,
    method: 'get',
    params
  })
}

// 应付费用明细-全部入账
export function detailAllEntryApi(data) {
  return request({
    url: `/api/air-service/air/omc/fms/pay/detail/allEntry`,
    method: 'put',
    data
  })
}

// 应付费用明细-列表入账
export function detailListEntryApi(data) {
  return request({
    url: `/api/air-service/air/omc/fms/pay/detail/entry`,
    method: 'put',
    data
  })
}
// 应付费用明细-获取供应商历史账单列表
export function supplierHistoryApi(params) {
  return request({
    url: `/api/air-service/air/omc/fms/pay/detail/bill/supplier/history`,
    method: 'get',
    params
  })
}

// 应付-空运业务结算单位类型列表
export function supplierTypeBusinessApi(businessType) {
  return request({
    url: `api/scm-service/scm/supplier/supplierType/business/${businessType}`,
    method: 'get'
  })
}
// 应付-空运业务根据供应商类型查询供应商列表
export function supplierSupplierTypeApi(partnerRole) {
  return request({
    url: `/api/scm-service/omc/scm/supplier/supplier/type/${partnerRole}`,
    method: 'get'
  })
}
// 应付-空运业务有效的结算抬头-指定时间指定业务
export function supplierSupplierActiveTitleApi(params) {
  return request({
    url: `api/cms-service/omc/cms/supplier/title/list/active/supplier/title`,
    method: 'get',
    params
  })
}
// 应付end

// 申请核销 结算
export function postCollectNotifyApi(data) {
  return request({
    url: `/api/air-service/air/omc/fms/confirmation/pay/fms/instruction/receipt/collect/notify`,
    method: 'post',
    data
  })
}

// 申请核销应付
export function postApClearApplyApi(data) {
  return request({
    url: `/api/air-service/air/omc/fms/confirmation/pay/fms/instruction/ap/clear/apply`,
    method: 'post',
    data
  })
}

// 应付收款 提交
export function postChargePaymentApplyApi(data) {
  return request({
    url: `/api/air-service/air/omc/fms/confirmation/pay/fms/instruction/ap/payment/apply`,
    method: 'post',
    data
  })
}

// 应收费用明细-全部入账
export function detailAllEntryChargeApi(data) {
  return request({
    url: `/api/air-service/air/omc/fms/charge/detail/allEntry`,
    method: 'put',
    data
  })
}

// 应收费用明细-列表入账
export function detailListEntryChargeApi(data) {
  return request({
    url: `/api/air-service/air/omc/fms/charge/detail/entry`,
    method: 'put',
    data
  })
}

// 费用确认单-调整确认(不区分应收应付)
export function confirmationAdjustSubmit(data) {
  return request({
    url: `/api/air-service/air/omc/fms/settlement/order/confirmation/adjust/submit`,
    method: 'post',
    data
  })
}

// 应收费用确认单-调整
export function confirmationAdjust(data) {
  return request({
    url: `/api/air-service/air/omc/fms/settlement/order/confirmation/adjust`,
    method: 'post',
    data
  })
}

// 公共-获取近半年账期
export function periodSettlementModeApi(settlementMode) {
  return request({
    url: `/api/fms-service/fms/bill/period/list/${settlementMode}`,
    method: 'get'
  })
}

// 公共-获取客户联系人信息
export function crmCustomerLinkman(param) {
  return request({
    url: `/api/air-service/air/order/export/crmCustomerLinkman/${param}`,
    method: 'get'
  })
}

// 取消订单
export function cancelAirExportApi(data) {
  return request({
    url: `/api/air-service/air/order/export/${data.id}/cancel`,
    method: 'put',
    data
  })
}

// 退关订单
export function shoutoutsAirExportApi(param) {
  return request({
    url: `/api/air-service/air/order/export/${param}/shoutouts`,
    method: 'put'
  })
}

// MblNo是否重复
export function existsByMblNo(params) {
  return request({
    url: `/api/air-service/air/order/export/existsByMblNo`,
    method: 'get',
    params
  })
}


// 应收导出
export function chargeExportByTemplateCode(params) {
  return request({
    url: `/api/air-service/air/omc/fms/charge/detail/exportByTemplateCode`,
    method: 'get',
    params
  })
}
// 应付导出
export function payExportByTemplateCode(params) {
  return request({
    url: `/api/air-service/air/omc/fms/pay/detail/exportByTemplateCode`,
    method: 'get',
    params
  })
}

// ae_空出产品航线
// 查询列表
export function airProductAirlineList(params) {
  return request({
    url: `/api/air-service/air/product/airline/pages`,
    method: 'get',
    params
  })
}
// 查询详情
export function airProductAirlineDetail(id) {
  return request({
    url: `/api/air-service/air/product/airline/detail/${id}`,
    method: 'get'
  })
}

// 新增产品
export function addAirProductAirline(data) {
  return request({
    url: `/api/air-service/air/product/airline`,
    method: 'post',
    data
  })
}

// 发布空运产品
export function putAirProductAirline(id) {
  return request({
    url: `/api/air-service/air/product/airline/${id}`,
    method: 'put'
  })
}

// 作废空运产品
export function delAirProductAirline(id) {
  return request({
    url: `/api/air-service/air/product/airline/${id}`,
    method: 'delete'
  })
}

// 空出航班计划
// 查询列表
export function airFlightPlanList(params) {
  return request({
    url: `/api/air-service/air/flight/plan/pages`,
    method: 'get',
    params
  })
}

export function airFlightPlanExport(params) {
  return request({
    url: `/api/air-service/air/flight/plan/export`,
    method: 'get',
    params
  })
}


// 查询航班计划:产品id和计划月份查询
export function airFlightPlanQueryByEtdMonth(params) {
  return request({
    url: `/api/air-service/air/flight/plan/queryByEtdMonth`,
    method: 'get',
    params
  })
}
// 查询详情
export function airFlightPlanDetail(id) {
  return request({
    url: `/api/air-service/air/flight/plan/detail/${id}`,
    method: 'get'
  })
}
// 新增航班计划
export function addAirFlightPlan(data) {
  return request({
    url: `/api/air-service/air/flight/plan`,
    method: 'post',
    data
  })
}

// 调整计划
export function putAirFlightPlan(id, data) {
  return request({
    url: `/api/air-service/air/flight/plan/${id}`,
    method: 'put',
    data
  })
}
// 取消计划
export function delAirFlightPlan(id) {
  return request({
    url: `/api/air-service/air/flight/plan/${id}`,
    method: 'delete'
  })
}
// 查询航班计划是否被业务使用
export function airFlightPlanOccupied(id) {
  return request({
    url: `/api/air-service/air/flight/plan/occupied/${id}`,
    method: 'get'
  })
}

// 查询航班计划的所有创建人
export function airFlightPlanCreateByList() {
  return request({
    url: `/api/air-service/air/flight/plan/createByList`,
    method: 'get'
  })
}

// 空出订单_批量改配
export function airOrderExportBatchOrderSpaceInfo(data) {
  return request({
    url: `/api/air-service/air/order/export/batch/modification/orderSpaceInfo`,
    method: 'put',
    data
  })
}

// 空出订单_2C列表
export function getAirOrderExportc2cQueryList(params) {
  return request({
    url: `/api/air-service/air/order/export/c2cQuery/pages`,
    method: 'get',
    params
  })
}

// 空出订单_2C新增
export function addAirOrderExportsaveC2(data) {
  return request({
    url: `/api/air-service/air/order/export/saveC2COrder`,
    method: 'post',
    data
  })
}

// 空出订单_2C信息补录
export function exportAirExportSupplementarySpaceC2Api(data) {
  return request({
    url: `/api/air-service/air/order/export/${data.orderId}/supplementary/space`,
    method: 'put',
    data
  })
}

// 空出订单_导出
export function exportAirOrderExportApi(params) {
  return request({
    url: `/api/air-service/air/order/export/export`,
    method: 'get',
    params
  })
}

// 空出订单_委托调整
export function exportAirOrderEntrustAdjustment(data) {
  return request({
    url: `/api/air-service/air/order/export/${data.orderId}/entrustAdjustment`,
    method: 'put',
    data
  })
}

// 费用名称
export function dmnBusinessList(params) {
  return request({
    url: `/api/air-service/dmn/fee/business/list`,
    method: 'get',
    params
  })
}

// 应收结算单位列表
// export function airCustomerTitleList(memberId) {
//   return request({
//     url: `/api/cms-service/omc/cms/customer/title/${memberId}/current/businessType/AIR_EXPORT/list`,
//     method: 'get'
//   })
// }
export function airCustomerTitleList(params) {
  return request({
    url: `/api/cms-service/v2/omc/cms/customer/title/customerTitle`,
    method: 'get',
    params
  })
}
// 获取当前生效结算方式
export function airRechargeModeCurrentTimeList(params) {
  return request({
    url: `/api/air-service/air/current/rechargeMode`,
    method: 'get',
    params
  })
}

// 空出订单确认管理
// 空出订单确认管理列表列表
export function getAirConfirmationManagementList(params) {
  return request({
    url: `/api/air-service/air/bag/plan/pages`,
    method: 'get',
    params
  })
}

// 空出订单确认管理详情
export function getAirConfirmationManagementDetail(id) {
  return request({
    url: `/api/air-service/air/bag/plan/detail/${id}`,
    method: 'get'
  })
}

// 空出订单确认管理确认提交
export function getAirConfirmationManagementAffirm(data) {
  return request({
    url: `/api/air-service/air/bag/plan/affirm`,
    method: 'post',
    data
  })
}

// 空出订单确认管理删除
export function getAirConfirmationManagementDel(params) {
  return request({
    url: `/api/air-service/air/bag/plan`,
    method: 'delete',
    params
  })
}

// 计算计费重
export function getAirOrderChargeableWeight(params) {
  return request({
    url: `/api/air-service/air/order/export/orderChargeableWeight`,
    method: 'get',
    params
  })
}


// 空出报价订单
// 列表
export function getAirOrderOfferPages(params) {
  return request({
    url: `/api/air-service/air/order/export/offer/pages`,
    method: 'get',
    params
  })
}
// 报价（单个与批量）
export function addAirOrderOffer(data) {
  return request({
    url: `/api/air-service/air/order/export/offer`,
    method: 'put',
    data
  })
}


// 空出订单确认管理 toB
// 列表
export function getAirOrderConfirmePages(params) {
  return request({
    url: `/api/air-service/air/order/export/confirme/pages`,
    method: 'get',
    params
  })
}
// 确认
export function addAirOrderAffirm(data) {
  return request({
    url: `/api/air-service/air/order/export/${data.id}/affirm`,
    method: 'put',
    data
  })
}
// 拒绝
export function airOrderAffirmRefused(data) {
  return request({
    url: `/api/air-service/air/order/export/${data.id}/affirmRefused`,
    method: 'put',
    data
  })
}
// 订单-报价信息
export function getAirOrderAffirmInfo(data) {
  return request({
    url: `/api/air-service/air/order/export/${data}/affirmInfo`,
    method: 'get'
  })
}
// 产品报价编辑
// 拒绝
export function airOrderAffirmModify(data) {
  return request({
    url: `/api/air-service/air/order/export/${data.id}/affirmModify`,
    method: 'put',
    data
  })
}

// ae_空出订单操作记录
// 列表
export function getAirOrderOperationRecordPages(params) {
  return request({
    url: `/api/air-service/air/order/export/operation/record/pages`,
    method: 'get',
    params
  })
}
// 空出订单_批量查询订单详情,orderId逗号隔开
export function getAirOrderExportBatchDetail(params) {
  return request({
    url: `/api/air-service/air/order/export/batchDetail/${params}/`,
    method: 'get'
  })
}
