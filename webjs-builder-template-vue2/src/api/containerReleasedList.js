import request from '@/utils/request'

// 箱主信息列表
export function getReleasedListApi(params) {
  return request({
    url: '/api/ctn-service/ctn/sail/schedule/list',
    method: 'get',
    params
  })
}

// 查看放箱信息
export function getViewInfoApi(sailScheduleId) {
  return request({
    url: `/api/ctn-service/ctn/sail/schedule/detail/${sailScheduleId}`,
    method: 'get'
  })
}

// 新增/编辑时查询对应的放箱信息
export function getReleasedInfoApi(sailScheduleId) {
  return request({
    url: `/api/ctn-service/ctn/release/info/draftDetail/${sailScheduleId}`,
    method: 'get'
  })
}

// 查询集装箱存量
export function getStorageApi(data) {
  return request({
    url: `/api/ctn-service/ctn/inyard/stock/getInyardStorage`,
    method: 'post',
    data
  })
}

// 新增放箱草稿
export function submitCreateReleasedApi(data) {
  return request({
    url: `/api/ctn-service/ctn/release/info/saveDraft`,
    method: 'post',
    data
  })
}

// 更新放箱草稿
export function submitModifyReleasedApi(data) {
  return request({
    url: `/api/ctn-service/ctn/release/info/editDraft`,
    method: 'put',
    data
  })
}

// 更新放箱备注
export function submitModifyReleasedRemarkApi(data) {
  return request({
    url: `/api/ctn-service/ctn/sail/schedule/updateRemark/${data.sailScheduleId}`,
    method: 'put',
    data: { remark: data.remark }
  })
}

// 删除单条堆场数据
export function deleteYardDataApi(data) {
  return request({
    url: `/api/ctn-service/ctn/release/info/deleteDraft`,
    method: 'delete',
    data
  })
}

// 放箱发布
export function publishReleasedApi(sailScheduleId) {
  return request({
    url: `/api/ctn-service/ctn/release/info/publish/${sailScheduleId}`,
    method: 'put'
  })
}
