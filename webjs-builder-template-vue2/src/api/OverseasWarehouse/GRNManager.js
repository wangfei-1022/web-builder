import request from '@/utils/request'

// 获取入库单列表
export function getGRNListApi(params) {
  return request({
    url: `/api/ovl-service/omc/order/inbound/page/list`,
    method: 'get',
    params
  })
}

// 获取入库单列表-批量
export function getGRNListBatchApi(data) {
    return request({
      url: `/api/ovl-service/omc/order/inbound/page/list/batch`,
      method: 'POST',
      data
    })
  }

// 获取入库单预约列表
export function getStorageReservationListApi(params) {
  return request({
    url: `/api/ovl-service/omc/appoint/inbound/page/list`,
    method: 'get',
    params
  })
}

// 获取入库单预约列表
export function getStorageReservationListBatchApi(data) {
    return request({
      url: `/api/ovl-service/omc/appoint/inbound/page/list/batch`,
      method: 'POST',
      data
    })
  }

// 获取入库单预约详情
export function getDeatilInfoApi(id) {
  return request({
    url: `/api/ovl-service/omc/appoint/inbound/${id}/detail`,
    method: 'get'
  })
}

// 提交拒绝理由
export function setRefuseReasonApi(id, data) {
  return request({
    url: `/api/ovl-service/omc/appoint/inbound/${id}/refuse/reason`,
    method: 'put',
    data
  })
}
// 入库单详情
export function detailOrderInboundApi(id) {
  return request({
    url: `/api/ovl-service/omc/order/inbound/${id}/detail`,
    method: 'get'
  })
}

// 跟进
export function followUpInboundApi(id) {
  return request({
    url: `/api/ovl-service/omc/appoint/inbound/${id}/followUp`,
    method: 'put'
  })
}
// 同意
export function auditAgreeApi(id) {
  return request({
    url: `/api/ovl-service/omc/order/inbound/${id}/audit/agree`,
    method: 'put'
  })
}
// 拒绝
export function auditRejectApi(data) {
  return request({
    url: `/api/ovl-service/omc/order/inbound/${data.id}/audit/reject`,
    method: 'put',
    data
  })
}
// 入库单-录入实际托盘数和实际箱数
export function updateRealTrayBoxCountApi(data) {
  return request({
    url: `/api/ovl-service/omc/order/inbound/${data.id}/update/realTrayBoxCount`,
    method: 'put',
    data
  })
}
// 入库单-导出对接仓库模板
export function exporFieldSelectionsApi(params) {
  return request({
    url: `/api/ovl-service/ovl/export/field/selections`,
    method: 'get',
    params
  })
}
// 入库单-导出
export function exporInboundApi(params) {
  return request({
    url: `/api/ovl-service/order/inbound/export`,
    method: 'get',
    params
  })
}
// 入库单-取消
export function cancelInboundApi(id) {
  return request({
    url: `/api/ovl-service/omc/order/inbound/cancel/${id}`,
    method: 'put'
  })
}
// 重新发送预约入库单确认邮件
export function sendInboundEmailApi(orderNo) {
  return request({
    url: `/api/ovl-service/appoint/inbound/send/confirm/email/${orderNo}`,
    method: 'get'
  })
}
// 入库单批量导入光伏件
export function imporInboundtApi(data) {
  return request({
    url: `/api/ovl-service/order/inbound/import`,
    method: 'post',
    data
  })
}
// 入库单-运营批量审核
export function batchAuditInboundtApi(data) {
  return request({
    url: `/api/ovl-service/omc/order/inbound/audit/batch`,
    method: 'post',
    data
  })
}
// 入库单-重新上架
export function groundingInboundAgainApi(id) {
  return request({
    url: `/api/ovl-service/omc/order/inbound/grounding/again/${id}`,
    method: 'put'
  })
}
// 导出入库单装箱信息
export function exportGoodsBoxApi(id) {
  return request({
    url: `/api/ovl-service/order/inbound/box/goods/export/${id}`,
    method: 'get'
  })
}
// 入库单-统计各个状态数量
export function getStatusCountApi(params) {
  return request({
    url: `/api/ovl-service/omc/order/inbound/status/count`,
    method: 'get',
    params
  })
}
// 入库单-统计各个状态数量
export function getStatusCountBatchApi(data) {
  return request({
    url: `/api/ovl-service/omc/order/inbound/status/count/batch`,
    method: 'POST',
    data
  })
}
/** *******************************************入库任务*************************************************** */

// 入库任务-查询列表
export function getInboundTaskPagesApi(params) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/inbound/task/pages`,
    method: 'get',
    params
  })
}

// 入库任务-查询列表-批量
export function getInboundTaskPagesBatchApi(data) {
    return request({
      url: `/api/ovl-service/omc/ovl/order/inbound/task/pages/batch`,
      method: 'POST',
      data
    })
  }
// 入库任务-查询详情
export function detailInboundTaskApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/inbound/task/detail/${id}`,
    method: 'get'
  })
}
// 入库任务-运营确认
export function confirmInboundTaskApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/inbound/task/confirm/${data.id}`,
    method: 'put',
    data
  })
}
// 入库任务-确认取消
export function cancelInboundTaskApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/inbound/task/cancel/confirm/${id}`,
    method: 'put'
  })
}
// 入库任务-拒绝取消
export function rejectInboundTaskApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/inbound/task/cancel/reject/${id}`,
    method: 'put'
  })
}
// 入库任务-导出
export function exportInboundTaskApi(params) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/inbound/task/export`,
    method: 'get',
    params
  })
}
// 入库任务-导出明细
export function exportDetailInboundTaskApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/inbound/task/detail/export/${id}`,
    method: 'get'
  })
}
// 入库任务-更新数据导出
export function exportInboundTaskUpdateDataApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/inbound/task/export/update/template`,
    method: 'post',
    data
  })
}
// 入库任务-批量更新数据
export function importInboundTaskInfoApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/inbound/task/info/import`,
    method: 'post',
    data
  })
}
// 入库任务-根据入库任务id获取明细列表
export function getInboundTaskDetailListApi(orderInboundTaskId) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/inbound/task/detail/list/${orderInboundTaskId}`,
    method: 'get'
  })
}
// 入库任务-根据入库任务批量更新
export function importInboundTaskDetailListApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/inbound/task/detail/import`,
    method: 'post',
    data
  })
}
// 入库任务-异常处理重新回调
export function recallInboundTaskApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/inbound/task/recall/${id}`,
    method: 'put'
  })
}

/** *******************************************提单集装箱明细列表*************************************************** */
// 入库提单箱号关系列表
export function getInboundbBlListApi(params) {
  return request({
    url: `/api/ovl-service/ovl/bl/inbound/pages`,
    method: 'get',
    params
  })
}
// 入库提单箱号关系列表-列表
export function getInboundbBlListBatchApi(data) {
    return request({
      url: `/api/ovl-service/ovl/bl/inbound/pages/batch`,
      method: 'POST',
      data
    })
  }
// 入库提单箱号关系导入
export function importInboundbBlApi(data) {
  return request({
    url: `/api/ovl-service/ovl/bl/inbound/import`,
    method: 'post',
    data
  })
}
// 入库提单推送1-1
export function pushInboundbBlApi(blNo) {
  return request({
    url: `/api/ovl-service/ovl/bl/inbound/delivery/${blNo}`,
    method: 'put'
  })
}
// 入库提单推送1-2
export function pushInboundbBlNewApi(data) {
    return request({
      url: `/api/ovl-service/ovl/bl/inbound/delivery/eta`,
      method: 'post',
      data
    })
  }

// 包裹入库-查询列表
export function getPackageInboundListApi(params) {
  return request({
    url: `/api/ovl-service/omc/order/inbound/package/page/list`,
    method: 'get',
    params
  })
}
// 包裹入库-详情
export function detailPackageInboundApi(id) {
  return request({
    url: `/api/ovl-service/omc/order/inbound/package/${id}/detail`,
    method: 'get'
  })
}
// 包裹入库单-统计各个状态数量
export function getPackageInboundStatusCountApi() {
  return request({
    url: `/api/ovl-service/omc/order/inbound/package/status/count`,
    method: 'get'
  })
}
// 包裹入库单-导出
export function exportPackageInboundApi(params) {
  return request({
    url: `/api/ovl-service/order/inbound/export`,
    method: 'get',
    params
  })
}
/**
 * 包裹入库单-获取轨迹信息
 */
export function getInboundLogisticsTracksApi(params) {
  return request({
    url: `/api/ovl-service/omc/order/inbound/package/tracks/${params.orderId}`,
    method: 'get',
    params
  })
}
// 出库任务-批量导入
export function importTaskInboundApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/order/inbound/task/import`,
    method: "post",
    data
  })
}
