import request from '@/utils/request'
import URL from '@/api/urlTranslator'

export function manifestListApi(params) {
  return request({
    url: `/api/cas-service/omc/cas/manifest/list`,
    method: 'get',
    params
  })
}
// 查询当前用户的提单号列表
export function manifestSoNoListApi() {
  return request({
    url: `/api/cas-service/omc/cas/manifest/so_no_list`,
    method: 'get'
  })
}

// 根据soNo获取订舱信息
export function manifestOrderInfoListApi(params) {
  return request({
    url: `/api/cas-service/omc/cas/manifest/order_info`,
    method: 'get',
    params
  })
}

// 查询船期下的箱号列表
export function manifestContainersListApi(params) {
  return request({
    url: `/api/cas-service/omc/cas/manifest/containers`,
    method: 'get',
    params
  })
}

// 查询选择箱子的物料信息
export function manifestContainerCargoListApi(params) {
  return request({
    url: `/api/cas-service/omc/cas/manifest/container_cargo`,
    method: 'get',
    params
  })
}

// 保存
export function saveManifestApi(data) {
  return request({
    url: '/api/cas-service/omc/cas/manifest',
    method: 'post',
    data
  })
}

// 查询详情
export function manifestDetailApi(id) {
  return request({
    url: `/api/cas-service/omc/cas/manifest/detail/${id}`,
    method: 'get'
  })
}

// 更新
export function updateManifestApi(data, id) {
  return request({
    url: `/api/cas-service/omc/cas/manifest/${id}`,
    method: 'put',
    data
  })
}

// 查询箱子是否拼箱
export function manifestIsFullApi(params) {
  return request({
    url: `/api/cas-service/omc/cas/manifest/is_full`,
    method: 'get',
    params
  })
}

// 打印
export function exportManifestListApi(params) {
  return request({
    url: `/api/cas-service/omc/cas/manifest/export_manifest_list`,
    method: 'get',
    params
  })
}
// 更新申报反馈
export function manifestUpdateStatusApi(data, id) {
  return request({
    url: `/api/cas-service/omc/cas/manifest/update_status/${id}`,
    method: 'put',
    data
  })
}

// 查询当前订舱是否能申报
export function manifestDeclareStatusApi(params) {
  return request({
    url: `/api/cas-service/omc/cas/manifest/manifest_declare_status`,
    method: 'get',
    params
  })
}

