// 箱货信息
import request from '@/utils/request'

export function getContainerListApi(query) {
  return request({
    url: `/api/cas-service/omc/cas/order/container/list?${query}`,
    // url: 'http://127.0.0.1:8220/cms/test',
    method: 'get'
  })
}

export function deleteRecordsApi(data) {
  return request({
    url: '/api/cas-service/omc/cas/order/container/batchDelete',
    method: 'delete',
    data
  })
}

export function checkContainerStatusApi(query) {
  return request({
    url: `/api/cas-service/omc/cas/order/container/getContainerDetailByIds?${query}`,
    method: 'get'
  })
}
// 是否ams申请
export function checkContainerDeclareByIdsApi(query) {
  return request({
    url: `/api/cas-service/omc/cas/order/container/checkContainerDeclareByIds?${query}`,
    method: 'get'
  })
}

export function getBLInfoApi(_blNo) {
  return request({
    url: `/api/cas-service/omc/cas/order/container/billDetailByBlNo/${_blNo}`,
    method: 'get'
  })
}

export function checkExistsApi(_blNo) {
  return request({
    url: `/api/cas-service/omc/cas/job/bl/checkExists/${_blNo}`,
    method: 'get'
  })
}

export function getMemberListApi(params) {
  return request({
    url: `/api/member-service/mem/member/info/spinner`,
    method: 'get',
    params
  })
}

export function exportCasOrderApi(params) {
  return request({
    url: `/api/cas-service/omc/cas/order/container/exportCasOrderList`,
    method: 'get',
    params
  })
}
// 获取箱子同一装卸货港代码的不同船期
export function polPodListApi(params) {
  return request({
    url: `/api/cas-service/omc/cas/order/container/change/polPodList`,
    method: 'get',
    params
  })
}
// 船期变更
export function containerVesselChangeApi(data) {
  return request({
    url: `/api/cas-service/omc/cas/order/container/change/containerVesselChange`,
    method: 'put',
    data
  })
}

// 获取当前流水号下的箱型箱量
export function containerTypeAndQtyApi(params) {
  return request({
    url: `/api/cas-service/omc/cas/order/container/change/containerTypeAndQty`,
    method: 'get',
    params
  })
}

// 箱属变更
export function containerSocChangeApi(data) {
  return request({
    url: `/api/cas-service/omc/cas/order/container/change/containerSocChange`,
    method: 'put',
    data
  })
}

// 校验箱号是否重复
export function checkContainerNoApi(data) {
  return request({
    url: `/api/cas-service/omc/cas/order/container/change/checkContainerNo`,
    method: 'post',
    data
  })
}
// 箱号变更
export function containerNoChangeApi(data) {
  return request({
    url: `/api/cas-service/omc/cas/order/container/change/containerNoChange`,
    method: 'put',
    data
  })
}

// 获取箱子同一卸货港代码的不同卸货港列表
export function changePodListApi(params) {
  return request({
    url: `/api/cas-service/omc/cas/order/container/change/podList`,
    method: 'get',
    params
  })
}

// 卸货港变更
export function podChangeApi(data) {
  return request({
    url: `/api/cas-service/omc/cas/order/container/change/podChange`,
    method: 'put',
    data
  })
}
// 箱货列表-变更提箱点-可分配的列表
export function pickChangeListApi(params) {
  return request({
    url: `/api/cas-service/omc/cas/order/container/change/pick/charge/list`,
    method: 'get',
    params
  })
}
// 箱货列表-变更提箱点
export function pickChangeApi(data) {
  return request({
    url: `/api/cas-service/omc/cas/order/container/change/pick/charge`,
    method: 'PUT',
    data
  })
}
// 箱货信息列表-退关操作
export function batchShutOutApi(data) {
  return request({
    url: `/api/cas-service/omc/cas/order/container/batchShutOut`,
    method: 'put',
    data
  })
}
// 集装箱信息列表-统计
export function listStatisticsApi(params) {
  return request({
    url: `/api/cas-service/omc/cas/order/container/list_statistics`,
    method: 'get',
    params
  })
}
// 箱货信息-集装箱轨迹
export function containerTrackingApi(id) {
  return request({
    url: `/api/cas-service/omc/cas/order/container/containerTracking/${id}`,
    method: 'get'
  })
}
