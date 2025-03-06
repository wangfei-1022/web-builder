import request from '@/utils/request'

// 列表
export function getFeeItemListApi(params) {
  return request({
    url: `/api/mdm-service/dmn/fee/item/base/business/pages`,
    method: 'get',
    params
  })
}

// 详情
export function getFeeItemDetailApi(id) {
  return request({
    url: `/api/mdm-service/dmn/fee/item/base/detail/${id}`,
    method: 'get'
  })
}

// 新增草稿
export function feeAddDraftApi(data) {
  return request({
    url: `/api/mdm-service/dmn/fee/item/base`,
    method: 'POST',
    data
  })
}

// 更新草稿
export function feeUpdateDraftApi(data) {
  return request({
    url: `/api/mdm-service/dmn/fee/item/base/${data.id}`,
    method: 'put',
    data
  })
}

// 新增提交
export function feeAddSubmitApi(data) {
  return request({
    url: `/api/mdm-service/dmn/fee/item/base/submit`,
    method: 'POST',
    data
  })
}

// 更新提交
export function feeUpdateSubmitApi(data) {
  return request({
    url: `/api/mdm-service/dmn/fee/item/base/${data.id}/submit`,
    method: 'put',
    data
  })
}

// 删除
export function feeDeleteApi(id) {
  return request({
    url: `/api/mdm-service/dmn/fee/item/base/business/${id}`,
    method: 'DELETE'
  })
}
