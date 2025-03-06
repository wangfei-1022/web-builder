// 小包
import request from '@/utils/request'

// 渠道管理列表
export function getChannelListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/channel/list`,
    method: 'get',
    params
  })
}

// 渠道管理列表-新建
export function addChannelApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/channel/create`,
    method: 'post',
    data
  })
}

// 渠道管理列表-修改
export function updateChannelApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/channel/update`,
    method: 'post',
    data
  })
}

// 渠道管理-详情
export function getChannelDetailApi(id) {
  return request({
    url: `/api/ilp-service/omc/ilp/channel/detail/${id}`,
    method: 'get'
  })
}

// 渠道管理-禁用
export function channelForbiddenApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/channel/forbidden`,
    method: 'post',
    data
  })
}

// 渠道管理-启用
export function channelActivateApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/channel/activate`,
    method: 'post',
    data
  })
}

