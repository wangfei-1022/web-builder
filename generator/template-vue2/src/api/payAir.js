import request from '@/utils/request'

// VITE-SP
export function getReceiveConfirmationDetailApi() { }

// 获取查询-应付费用确认单列表
export function getPayConfirmationListApi(id, params) {
  return request({
    url: `/api/air-service/air/omc/fms/confirmation/pay/order/entity/${id}/list`,
    method: 'get',
    params
  })
}
// 费用确认单提交
export function payConfirmationSubmitApi(data) {
  return request({
    url: `/api/air-service/air/omc/fms/confirmation/pay/submit`,
    method: 'post',
    data
  })
}

// 更新
export function payConfirmationCommonUpdateApi(id, data) {
  return request({
    url: `/api/air-service/air/omc/fms/confirmation/pay/commonUpdate/${id}`,
    method: 'put',
    data
  })
}

// 查询详情
export function getPayConfirmationCommonDetailApi(id) {
  return request({
    url: `/api/air-service/air/omc/fms/confirmation/pay/commonDetail/${id}`,
    method: 'get'
  })
}


// 费用确认单确认
export function payConfirmationConfirmApi(id) {
  return request({
    url: `/api/air-service/air/omc/fms/confirmation/pay/confirm/${id}`,
    method: 'put'
  })
}

// 删除
export function delPayConfirmationApi(id) {
  return request({
    url: `/api/air-service/air/omc/fms/confirmation/pay/${id}`,
    method: 'delete'
  })
}

// 移动费用至另外一个费用确认单
export function payConfirmationRemoveApi(data) {
  return request({
    url: `/api/air-service/air/omc/fms/confirmation/pay/remove`,
    method: 'put',
    data
  })
}

// 移动费用至新建费用确认单
export function payConfirmationMoveToNewApi(data) {
  return request({
    url: `/api/air-service/air/omc/fms/confirmation/pay/moveToNew`,
    method: 'put',
    data
  })
}

// 应付费用确认单-调整
export function confirmationPayAdjust(id, data) {
  return request({
    url: `/api/air-service/air/omc/fms/confirmation/pay/adjust/${id}`,
    method: 'put',
    data
  })
}
