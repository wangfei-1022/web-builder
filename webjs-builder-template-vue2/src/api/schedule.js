import request from '@/utils/request'
import URL from './urlTranslator'
/**
 * 获取船期列表
 * @returns
 */
export function getScheduleList(params) {
  return request({
    url: `${URL.omc.scheduleList}`,
    method: 'get',
    params
  })
}
/**
 * 保存船期信息
 * @param {*} data
 * @returns
 */
export function saveScheduleInfo(data) {
  return request({
    url: `${URL.omc.scheduleInfo}`,
    method: 'post',
    data
  })
}
/**
 * 保存船期信息详情
 * @param {*} id
 * @returns
 */
export function detailScheduleInfo(id) {
  return request({
    url: `${URL.omc.scheduleInfoDetail}/${id}`,
    method: 'get'
  })
}
/**
 * 删除
 * @param {*} id
 * @returns
 */
export function delScheduleInfo(id) {
  return request({
    url: `${URL.omc.scheduleDel}/${id}`,
    method: 'delete'
  })
}
/**
 * 发布
 * @param {*} id
 * @returns
 */
export function scheduleInfoPublish(data) {
  return request({
    url: `${URL.omc.scheduleInfoPublish}`,
    method: 'put',
    data
  })
}
/**
 * 下架
 * @param {*} id
 * @returns
 */
export function scheduleInfoUndercarriage(data) {
  return request({
    url: `${URL.omc.scheduleInfoUndercarriage}`,
    method: 'put',
    data
  })
}
/**
 * 获取港口代理
 * @param {}} params
 * @returns
 */
export function partnerAdv(data) {
  return request({
    url: `${URL.pnr.partnerAdv}`,
    method: 'post',
    data
  })
}
export function partnerAdvNew(params) {
  return request({
    url: `/api/cas-service/cas/destination/agent/pages`,
    method: 'get',
    params
  })
}
/**
 * 更新船期基础数据
 * @param {}} params
 * @returns
 */
export function updateBaseData(data) {
  return request({
    url: `${URL.omc.updateBaseData}`,
    method: 'put',
    data
  })
}

/**
 * 保存装货港信息单条数据
 * @param {} params
 * @returns
 */
export function saveScheduleLoading(data) {
  return request({
    url: `${URL.omc.saveScheduleLoading}`,
    method: 'post',
    data
  })
}

/**
 * 删除装货港信息单条数据
 * @param {} id
 * @returns
 */
export function delScheduleLoading(id) {
  return request({
    url: `${URL.omc.delScheduleLoading}/${id}`,
    method: 'delete'
  })
}

/**
 * 保存卸货港信息单条数据
 * @param {} params
 * @returns
 */
export function saveDischarge(data) {
  return request({
    url: `${URL.omc.saveDischarge}`,
    method: 'post',
    data
  })
}

/**
 * 删除装货港信息单条数据
 * @param {} id
 * @returns
 */
export function delDischarge(id) {
  return request({
    url: `${URL.omc.delDischarge}/${id}`,
    method: 'delete'
  })
}

/**
 * 保存提还箱点信息
 * @param {} params
 * @returns
 */
export function savePickReturnAddress(data) {
  return request({
    url: `${URL.omc.savePickReturnAddress}`,
    method: 'post',
    data
  })
}

/**
 * 删除提还箱点信息
 * @param {} id
 * @returns
 */
export function delPickReturnAddress(id) {
  return request({
    url: `${URL.omc.delPickReturnAddress}/${id}`,
    method: 'delete'
  })
}
/** **********************SO规则相关******************************* */

/**
 * 查询船期船期号段
 * @param {} id
 * @returns
 */
export function numberSegmentList(id) {
  return request({
    url: `/api/cas-service/omc/cas/sailing/${id}/numberSegment/list`,
    method: 'get'
  })
}
/**
 * 保存船期号段
 * @param {} id
 * @returns
 */
export function saveNumberSegment(data) {
  return request({
    url: `/api/cas-service/omc/cas/sailing/numberSegment`,
    method: 'post',
    data
  })
}

/**
 * 更新船期号段
 * @param {} id
 * @returns
 */
export function updateNumberSegment(data) {
  return request({
    url: `/api/cas-service/omc/cas/sailing/numberSegment/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * 删除船期号段
 * @param {} id
 * @returns
 */
export function delNumberSegment(id) {
  return request({
    url: `/api/cas-service/omc/cas/sailing/numberSegment/${id}`,
    method: 'delete'
  })
}
/**
 * 发布船期号段
 * @param {} id
 * @returns
 */
export function publishNumberSegment(id) {
  return request({
    url: `/api/cas-service/omc/cas/sailing/numberSegment/${id}/publish`,
    method: 'put'
  })
}
// 可配置船期列表
export function releaseListApi(id) {
  return request({
    url: `/api/cas-service/omc/cas/sailing/schedule/release_list`,
    method: 'get'
  })
}
// 放箱设置
export function releaseSettingApi(data) {
  return request({
    url: `/api/cas-service/omc/cas/sailing/schedule/release_setting`,
    method: 'put',
    data
  })
}
// 免柜列表
export function freeListApi(sailingId) {
  return request({
    url: `/api/cas-service/omc/cas/member/dnd/free/days/${sailingId}/list`,
    method: 'get'
  })
}

// 更新免柜列表
export function freeUpdateApi(data, sailingId) {
  return request({
    url: `/api/cas-service/omc/cas/member/dnd/free/days/${data.sailingId}/update`,
    method: 'put',
    data: data.data
  })
}

// 海管家船名配置
export function updateYunlspVesselApi(data, id) {
  return request({
    url: `/api/cas-service/omc/cas/sailing/schedule/update_yunlsp_vessel/${id}`,
    method: 'put',
    data
  })
}

// 装货港变更
export function polChangeApi(data) {
  return request({
    url: `/api/cas-service/omc/cas/schedule/loading/polChange`,
    method: 'put',
    data
  })
}

// 装货港变更
export function getYardListByRequestApi(params) {
  return request({
    url: `/api/mdm-service/dmn/container/yard/getContainerYardList`,
    method: 'get',
    params
  })
}

// 船期信息-用箱信息
export function containerInfoApi(id) {
  return request({
    url: `/api/cas-service/omc/cas/sailing/schedule/container_info/${id}`,
    method: 'get'
  })
}

// 船期信息-用箱信息
export function containerPlanApi(data) {
  return request({
    url: `/api/cas-service/omc/cas/sailing/schedule/container/plan`,
    method: 'put',
    data
  })
}
// 船期信息-根据卸货港获取航线
export function routeDirectionApi(params) {
  return request({
    url: `/api/mdm-service/dmn/term/SEALINE/batch/routeDirection`,
    method: 'GET',
    params
  })
}
