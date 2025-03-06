// 箱货信息
import request from '@/utils/request'

// 集装箱动态列表
export function getDynamicListApi(params) {
  return request({
    url: `/api/ctn-service/ctn/status/logs/list`,
    method: 'get',
    params
  })
}

// 更新时查询详情
export function getDynamicUpgradeDetailApi(_id) {
  return request({
    url: `/api/ctn-service/ctn/status/logs/detail/${_id}`,
    method: 'get'
  })
}

// 保存更新
export function saveDynamicUpgradeApi(data) {
  return request({
    url: `/api/ctn-service/ctn/status/logs`,
    method: 'post',
    data
  })
}

// 修改时查询详情
export function getDynamicModifyDetailApi(_id, containerId) {
  return request({
    url: `/api/ctn-service/ctn/status/logs/getPartDetail/${_id}/${containerId}`,
    method: 'get'
  })
}

// 保存修改
export function saveDynamicModifyApi(_id, data) {
  return request({
    url: `/api/ctn-service/ctn/status/logs/${_id}`,
    method: 'put',
    data
  })
}

// 集装箱操作项下拉
export function getOpreatorCodeListApi() {
  return request({
    url: `/api/ctn-service/ctn/container/operations/getDropdownList`,
    method: 'get'
  })
}

// 集装箱状态项下拉
export function getStatusListApi() {
  return request({
    url: `/api/ctn-service/ctn/container/status/getDropdownList`,
    method: 'get'
  })
}

// 集装箱操作状态下拉
export function getOpreatorStatusListApi() {
  return request({
    url: `/api/ctn-service/ctn/container/operation/status/getDropdownList`,
    method: 'get'
  })
}

// 集装箱信息列表
export function getContainerInfoListApi(params) {
  return request({
    url: `/api/ctn-service/ctn/status/logs/getContainerList`,
    method: 'get',
    params
  })
}

// 查看二级列表
export function getLogContainerDetailApi(params) {
  return request({
    url: `/api/ctn-service/ctn/status/logs/getLogContainerDetail`,
    method: 'get',
    params
  })
}

// 批量导入箱动态
export function uploadDynamicInfoApi(data) {
  return request({
    url: `/api/ctn-service/ctn/status/logs/batchUpload`,
    method: 'post',
    data
  })
}

// 动态列表批量导出
export function exportDynamicListApi(params) {
  return request({
    url: `/api/ctn-service/ctn/status/logs/exportLog`,
    method: 'get',
    params
  })
}

// 在场列表批量导出
export function exportInsideListApi(data) {
  return request({
    url: `/api/ctn-service/ctn/status/logs/exportInYard`,
    method: 'post',
    data
  })
}

// 场外列表批量导出
export function exportOutsideListApi(data) {
  return request({
    url: `/api/ctn-service/ctn/status/logs/exportOutYard`,
    method: 'post',
    data
  })
}

// 在船列表批量导出
export function exportOnBoatListApi(data) {
  return request({
    url: `/api/ctn-service/ctn/status/logs/exportOnBoard`,
    method: 'post',
    data
  })
}

// 动态列表页面批量删除
export function deleteBatchDynamicApi(data) {
  return request({
    url: `/api/ctn-service/ctn/status/logs/batchDelete`,
    method: 'delete',
    data
  })
}

// 被拒动态列表
export function getDynamicRejectListApi(params) {
  return request({
    url: `/api/ctn-service/ctn/upadte/status/log/reject/list`,
    method: 'get',
    params
  })
}

// 导入被拒动态
export function importDynamicRejectApi(data) {
  return request({
    url: '/api/ctn-service/ctn/upadte/status/log/reject/import',
    method: 'post',
    data
  })
}

// 导出被拒动态
export function exportDynamicRejectApi(data) {
  return request({
    url: '/api/ctn-service/ctn/upadte/status/log/reject/export',
    method: 'post',
    data
  })
}

// 删除被拒动态
export function deleteDynamicRejectApi(data) {
  return request({
    url: '/api/ctn-service/ctn/upadte/status/log/reject/batchDelete',
    method: 'delete',
    data
  })
}

// 被拒动态详情
export function getDynamicRejectDetailApi(id) {
  return request({
    url: `/api/ctn-service/ctn/upadte/status/log/detail/${id}`,
    method: 'get'
  })
}

// 被拒动态编辑
export function ModifyDynamicRejectDetailApi(data) {
  return request({
    url: `/api/ctn-service/ctn/upadte/status/log/reject/update`,
    method: 'post',
    data
  })
}

// 强制提交被拒动态
export function submitDynamicRejectRowsApi(data) {
  return request({
    url: `/api/ctn-service/ctn/upadte/status/log/reject/forceCommit`,
    method: 'post',
    data
  })
}
