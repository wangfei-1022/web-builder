// 小包
import request from '@/utils/request'

// 渠道分区列表
export function areaChannelListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/area/channel/list`,
    method: 'get',
    params
  })
}

// 渠道分区列表-新增
export function addAreaChannelApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/area/channel/create`,
    method: 'post',
    data
  })
}

// 渠道分区列表-修改
export function updateAreaChannelApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/area/channel/update`,
    method: 'post',
    data
  })
}

// 渠道分区列表-详情
export function getAreaChannelDetailApi(id) {
  return request({
    url: `/api/ilp-service/omc/ilp/area/channel/detail/${id}`,
    method: 'get'
  })
}

// 渠道分区列表-禁用
export function areaChannelForbiddenApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/area/channel/forbidden`,
    method: 'post',
    data
  })
}

// 渠道分区列表-启用
export function areaChannelActivateApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/area/channel/activate`,
    method: 'post',
    data
  })
}

// 渠道分区-获取分区范围详情
export function getAreaDetailListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/area/channel/range`,
    method: 'get',
    params
  })
}


// 渠道分区-新增分区范围
export function addAreaApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/area/channel/range/create`,
    method: 'post',
    data
  })
}

// 渠道分区-修改分区范围
export function updateAreaApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/area/channel/range/update`,
    method: 'post',
    data
  })
}

// 渠道分区-修改分区范围
export function deleteAreaApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/area/channel/range/delete`,
    method: 'post',
    data
  })
}

// 渠道分区-导入
export function importChannelAreaListApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/area/channel/import`,
    method: 'post',
    data
  })
}

// 渠道分区-导入分区详情
export function importChannelAreaDetailApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/area/channel/detail/import`,
    method: 'post',
    data
  })
}

// 渠道分区-删除
export function deleteChannelAreaApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/area/channel/delete`,
    method: 'post',
    data
  })
}