import request from '@/utils/request'

/** edi*/
// 新增EDI映射
export function getAddEdiMappingApi(data) {
  return request({
    url: `/api/edi-service/omc/edi/mapping`,
    method: 'POST',
    data
  })
}
// 映射渠道代码下拉列表
export function getMappingChannelCodeSelectionsApi(params) {
  return request({
    url: `/api/edi-service/omc/edi/mapping/channelCode/type/selections`,
    method: 'GET',
    params
  })
}
// 映射数据源类型下拉列表
export function getMappingDataSourceSelectionsApi(params) {
  return request({
    url: `/api/edi-service/omc/edi/mapping/dataSource/type/selections`,
    method: 'GET',
    params
  })
}
// 详情
export function getMappingDetailApi(id) {
  return request({
    url: `/api/edi-service/omc/edi/mapping/detail/${id}`,
    method: 'GET'
  })
}
// 查询列表
export function getMappingListApi(params) {
  return request({
    url: `/api/edi-service/omc/edi/mapping/list`,
    method: 'GET',
    params
  })
}
// 修改
export function getMappingEditApi(data) {
  return request({
    url: `/api/edi-service/omc/edi/mapping/${data.id}`,
    method: 'PUT',
    data
  })
}
// 删除
export function getMappingDelApi(id) {
  return request({
    url: `/api/edi-service/omc/edi/mapping/${id}`,
    method: 'DELETE'
  })
}
/** edi END*/
// 权限列表
export function getSysPrivilegeListApi() {
  return request({
    url: `/api/sys-service/sys/privilege/list`,
    method: 'get'
  })
}
// 新增权限
export function getSysPrivilegeApi(data) {
  return request({
    url: `/api/sys-service/omc/sys/privilege`,
    method: 'POST',
    data
  })
}
// 更新权限
export function getSysPrivilegeEditApi(data) {
  return request({
    url: `/api/sys-service/omc/sys/privilege/${data.id}`,
    method: 'PUT',
    data
  })
}
// 查询详情权限
export function getSysPrivilegeDetailApi(id) {
  return request({
    url: `/api/sys-service/omc/sys/privilege/detail/${id}`,
    method: 'get'
  })
}
// 删除权限
export function getSysPrivilegeDelApi(id) {
  return request({
    url: `/api/sys-service/omc/sys/privilege/${id}`,
    method: 'DELETE'
  })
}

// 查询权限父级平级节点
export function getFlatLevelListApi(id) {
  return request({
    url: `/api/sys-service/omc/sys/privilege/getFlatLevelList/${id}`,
    method: 'get'
  })
}
