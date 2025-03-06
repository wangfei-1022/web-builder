// 小包
import request from '@/utils/request'

// 基本信息-轨迹分类-列表
export function getSegmentApi() {
  return request({
    url: `/api/ilp-service/ilp/tracking/node/segment/list`,
    method: 'get'
  })
}

// 标准轨迹节点列表
export function getStandNodeApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/tracking/node/list`,
    method: 'get',
    params
  })
}

// 标准轨迹节点新建
export function createStandNodeApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/tracking/node/create`,
    method: 'post',
    data
  })
}

// 标准轨迹节点更新
export function modifyStandNodeApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/tracking/node/update`,
    method: 'post',
    data
  })
}

// 标准轨迹节点删除
export function deleteStandNodeApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/tracking/node/delete`,
    method: 'post',
    data
  })
}

// 轨迹渠道列表
export function getTraceChannelApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/tracking/channel/list`,
    method: 'get',
    params
  })
}

// 轨迹渠道新建
export function createTraceChannelApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/tracking/channel/create`,
    method: 'post',
    data
  })
}

// 轨迹渠道更新
export function updateTraceChannelApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/tracking/channel/update`,
    method: 'post',
    data
  })
}

// 轨迹渠道删除
export function deleteTraceChannelApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/tracking/channel/delete`,
    method: 'post',
    data
  })
}

// 轨迹抓取配置列表
export function getTraceCatchApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/tracking/channel/route/list`,
    method: 'get',
    params
  })
}

// 轨迹抓取新建
export function createTraceCatchApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/tracking/channel/route/create`,
    method: 'post',
    data
  })
}

// 轨迹抓取更新
export function updateTraceCatchApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/tracking/channel/route/update`,
    method: 'post',
    data
  })
}

// 轨迹抓取删除
export function deleteTraceCatchApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/tracking/channel/route/delete`,
    method: 'post',
    data
  })
}

// 原始轨迹查询列表
export function getTraceOriginalApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/order/sales/tracking/list`,
    method: 'get',
    params
  })
}

// 轨迹查询 - 运营端
export function getTraceInfoApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/order/sales/tracking/order`,
    method: 'get',
    params
  })
}

// 轨迹映射列表
export function getTraceMapApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/tracking/channel/mapping/list`,
    method: 'get',
    params
  })
}

// 轨迹映射下拉
export function getTraceMapInfoApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/tracking/channel/mapping/node/info`,
    method: 'get',
    params
  })
}

// 轨迹映射新建
export function createTraceMapApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/tracking/channel/mapping/create`,
    method: 'post',
    data
  })
}

// 轨迹抓取更新
export function updateTraceMapApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/tracking/channel/mapping/update`,
    method: 'post',
    data
  })
}

// 轨迹抓取删除
export function deleteTraceMapApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/tracking/channel/mapping/delete`,
    method: 'post',
    data
  })
}
