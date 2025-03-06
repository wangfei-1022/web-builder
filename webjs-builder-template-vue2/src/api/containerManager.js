import request from '@/utils/request'
/**
 * 获取提单列表数据
 * @param {*} params
 * @returns
 */

// 箱主信息列表
export function getOwnerListApi(params) {
  return request({
    url: '/api/mdm-service/dmn/container/owner/list',
    method: 'get',
    params
  })
}

// 新增箱主信息
export function createOwnerApi(data) {
  return request({
    url: '/api/mdm-service/dmn/container/owner/save',
    method: 'post',
    data
  })
}

// 箱主信息详情
export function getOwnerDetailApi(id) {
  return request({
    url: `/api/mdm-service/dmn/container/owner/detail/${id}`,
    method: 'get'
  })
}

// 更新箱主信息
export function updateOwnerApi(id, data) {
  return request({
    url: `/api/mdm-service/dmn/container/owner/update/${id}`,
    method: 'put',
    data
  })
}

// 国家列表
export function getCountryApi() {
  return request({
    url: `/api/mdm-service/dmn/countrylist`,
    method: 'get',
    params: { areaLevel: 0 }
  })
}

// 省市区联动
export function getProvinceApi(params) {
  return request({
    url: `/api/mdm-service/dmn/administrative/division`,
    method: 'get',
    params
  })
}

// 根据订单号及集装箱类型搜索订单
export function remoteOrderListApi(orderNo, orderType) {
  return request({
    url: `/api/ctn-service/ctn/order/dropdownlist/${orderNo}/${orderType}`,
    method: 'get'
  })
}

// 箱型列表
export function getContainerTypeListApi() {
  return request({
    url: '/api/mdm-service/dmn/container/dropdownlist',
    method: 'get'
  })
}

// 集装箱信息列表
export function getContainerListApi(params) {
  return request({
    url: '/api/ctn-service/ctn/container/manage/list',
    method: 'get',
    params
  })
}

// 集装箱登记
export function createContainerApi(data) {
  return request({
    url: '/api/ctn-service/ctn/container/save',
    method: 'post',
    data
  })
}

// 更新集装箱
export function updateContainerApi(id, data) {
  return request({
    url: `/api/ctn-service/ctn/container/edit/${id}`,
    method: 'put',
    data
  })
}

// 集装箱详情 新箱列表跳转时
export function getContainerDetailApi(id, orderType) {
  return request({
    url: `/api/ctn-service/ctn/container/detail/${id}/${orderType}`,
    method: 'get'
  })
}

// 集装箱详情 租借箱列表跳转时
export function getContainerDetailByOrderApi(id, orderType) {
  return request({
    url: `/api/ctn-service/ctn/container/order/detail/${id}`,
    method: 'get'
  })
}

// 根据图片ID查询URL
export function getImageUrlApi(params) {
  return request({
    url: '/api/mdm-service/cloud/urls/fileIds',
    method: 'get',
    params
  })
}

// 租赁列表
export function getLeaseListApi(params) {
  return request({
    url: '/api/ctn-service/ctn/container/lease/list',
    method: 'get',
    params
  })
}

// 批量上传
export function uploadFileBacthApi(data) {
  return request({
    url: '/api/ctn-service/ctn/container/batchUpload',
    method: 'post',
    data
  })
}

// 导入虚拟箱号
export function uploadVirtualNoApi(data) {
  return request({
    url: '/api/ctn-service/ctn/container/batchUploadVirtual',
    method: 'post',
    data
  })
}

// 批量退租
export function batchUploadOffHireApi(data) {
  return request({
    url: '/api/ctn-service/ctn/container/batchUploadOffHire',
    method: 'post',
    data
  })
}

// 禁用/启用
export function updateStatusApi(data) {
  return request({
    url: '/api/ctn-service/ctn/container/activedisable',
    method: 'put',
    data
  })
}

// 借出编辑 -> 箱号远程搜索
export function remoteContainerNoApi(data) {
  return request({
    url: '/api/ctn-service/ctn/container/containerDropdownlist',
    method: 'post',
    data
  })
}

// 借出新建 - 校验箱号是否已存在
export function validateContainerNOApi(containerNo) {
  return request({
    url: `/api/ctn-service/ctn/container/checkContainerExist?containerNo=${containerNo}`,
    method: 'get'
  })
}

// 交箱地下拉列表
export function getContainerYardListApi(params) {
  return request({
    url: `/api/mdm-service/dmn/container/yard/getContainerYardList`,
    method: 'get',
    params
  })
}

// 报文解析日志
export function getUpdateStatusLogApi(params) {
  return request({
    url: `/api/ctn-service/ctn/upadte/status/log/list`,
    method: 'get',
    params
  })
}
