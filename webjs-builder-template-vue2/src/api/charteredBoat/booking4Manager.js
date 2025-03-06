import request from '@/utils/request'
import URL from '@/api/urlTranslator'

/**
 * 获取订舱列表
 * @returns {*}
 */
export function getBookingList(params) {
  return request({
    url: URL.charteredBoat.booking.list,
    method: 'get',
    params
  })
}

/**
 * 获取模板
 * @returns {*}
 */
export function getTemplate(typeCode) {
  return request({
    url: `${URL.charteredBoat.booking.getTemplate}/${typeCode}`,
    method: 'get'
  })
}
/**
 * 联系人-详情
 * @returns {*}
 */
export function getContactDetail(id) {
  return request({
    url: URL.charteredBoat.booking.contactDetail + '/' + id,
    method: 'get'
  })
}

/**
 * 订舱订单保存更新
 * @returns {*}
 */
export function saveUpdateBooking(data, id) {
  return request({
    url: URL.charteredBoat.booking.saveBookingOrder + '/' + id,
    method: 'put',
    data
  })
}

/**
 * 装货港堆场支持箱型
 * @returns {*}
 */
export function getSupportSizeType(polCode, sailingId) {
  return request({
    url: URL.charteredBoat.booking.supportSizeType,
    method: 'get',
    params: { polCode, sailingId }
  })
}

/**
 * 联系人列表
 * @returns {*}
 */
export function getContactList(memberId) {
  return request({
    url: URL.charteredBoat.booking.contactList,
    method: 'get',
    params: { memberId }
  })
}

/**
 * 订舱订单-审核
 * @returns {*}
 */
export function auditBooking(data, id) {
  return request({
    url: `${URL.charteredBoat.booking.auditBooking}/${id}`,
    method: 'put',
    data
  })
}

/**
 * 订舱订单-取消
 * @returns {*}
 */
export function cancelBooking(id) {
  return request({
    url: `${URL.charteredBoat.booking.cancelBooking}/${id}`,
    method: 'put'
  })
}
/**
 * 订舱订单-取消确认
 * @returns {*}
 */
export function confirmCancelBooking(id) {
  return request({
    url: `${URL.charteredBoat.booking.confirmCancelBooking}/${id}`,
    method: 'put'
  })
}

/**
 * 订舱订单-驳回
 * @returns {*}
 */
export function rejectBooking(data, id) {
  return request({
    url: `${URL.charteredBoat.booking.rejectBooking}/${id}`,
    method: 'put',
    data
  })
}

/**
 * 订舱-校验so
 * @returns {*}
 */
export function checkSoExists(soNo) {
  return request({
    url: `${URL.charteredBoat.booking.checkSoExists}`,
    method: 'get',
    repeat: true,
    params: { soNo }
  })
}

/**
 * 订舱订单详情
 */
export function getBookingDetail(id) {
  return request({
    url: `${URL.charteredBoat.booking.bookingDetail}/${id}`,
    method: 'get'
  })
}

/**
 * 下载订舱确认函
 */
export function downloadBookingConfirm(id) {
  return request({
    url: `${URL.charteredBoat.booking.downloadBooking}/${id}`,
    method: 'get'
  })
}

/**
 * 发送订舱确认函
 */
export function sendBookingConfirm(ids) {
  return request({
    url: `${URL.charteredBoat.booking.sendBooking}`,
    method: 'put',
    data: { ids }
  })
}

/**
 * 列表统计数据
 */
export function getStatistics4List(params) {
  return request({
    url: URL.charteredBoat.booking.statistics4List,
    method: 'get',
    params
  })
}

/**
 * 根据卸货港获取提还箱点列表
 */
export function loadingPortAddressList(polCode, sailingId) {
  return request({
    url: URL.charteredBoat.booking.loadingPortAddress,
    method: 'get',
    params: { polCode, sailingId }
  })
}

/**
 * 订单的还箱点列表
 */
export function getAddressList(orderId) {
  return request({
    url: URL.charteredBoat.booking.addressDetail + '/' + orderId,
    method: 'get',
    repeat: true
  })
}

/**
 * 订单的还箱点列表
 */
export function saveAddressList(data, orderId) {
  return request({
    url: URL.charteredBoat.booking.addressDetail + '/' + orderId,
    method: 'put',
    data
  })
}

/**
 * 船期信息详情（订舱详情页需要）
 */
export function getSailingDetailList(polCode, podCode, sailingId) {
  return request({
    url: URL.charteredBoat.booking.sailingDetail,
    method: 'get',
    params: { polCode, podCode, sailingId }
  })
}

/**
 * 订舱箱信息保存
 */
export function saveContainer(orderId, data) {
  return request({
    url: `${URL.charteredBoat.booking.containerUrlPrefix}${orderId}/container/use`,
    method: 'post',
    data
  })
}

/**
 * 订舱箱信息更新
 */
export function updateContainer(orderId, data) {
  return request({
    url: `${URL.charteredBoat.booking.containerUrlPrefix}${orderId}/container/use/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * 订舱箱信息删除
 */
export function delContainer(orderId, id) {
  return request({
    url: `${URL.charteredBoat.booking.containerUrlPrefix}${orderId}/container/use/${id}`,
    method: 'delete'
  })
}

//  会员订舱字段更新

/**
 * 订舱信息- 更新指定的字段
 */
export function updateAssignFieldInfo(orderId, data) {
  return request({
    url: `${URL.charteredBoat.booking.updateAssignFieldInfo}/${orderId}`,
    method: 'put',
    data
  })
}
// 订舱审核-预分配提箱点
export function distributeApi(params) {
  return request({
    url: `/api/cas-service/omc/cas/order/pick/distribute`,
    method: 'get',
    params
  })
}

// 箱属变更-预分配提箱点
export function pickDistributeApi(params) {
  return request({
    url: `/api/cas-service/omc/cas/order/container/change/pick/distribute`,
    method: 'get',
    params
  })
}
// 集装箱信息-免柜天数调整-查看
export function settingStatisticApi(params) {
  return request({
    url: `/api/cas-service/omc/cas/port/free/days/setting/statistic`,
    method: 'get',
    params
  })
}
// 集装箱信息-免柜天数调整-设置
export function settingStatisticSetApi(data) {
  return request({
    url: `/api/cas-service/omc/cas/port/free/days/setting/statisticSet`,
    method: 'post',
    data
  })
}

