import request from '@/utils/request'
import URL from './urlTranslator'

export function getRoleList() {
  return request({
    url: URL.sys.role,
    method: 'get',
    params: { pageSize: 100 }
  })
}

export function getRoleById(id) {
  return request({
    url: `${URL.sys.role}/${id}`,
    method: 'get'
  })
}
export function activateRole(id) {
  return request({
    url: URL.sys.roleEnable,
    method: 'put',
    params: { id }
  })
}
export function deactivateRole(id) {
  return request({
    url: URL.sys.roleDisable,
    method: 'put',
    params: { id }
  })
}
export function saveRole(data, id) {
  return request({
    url: `${URL.sys.role}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}
export function deleteRole(id) {
  return request({
    url: `${URL.sys.role}/${id}`,
    method: 'delete'
  })
}
export function getRolePrivilegeById(id) {
  return request({
    url: `${URL.sys.privilege}/${id}`,
    method: 'get'
  })
}

export function getRelatedPrivilege(pid) {
  return request({
    url: `${URL.sys.privilegeRelated}/${pid}`,
    method: 'get'
  })
}

export function saveRoleAuthorizedPrivilege(data) {
  return request({
    url: `${URL.sys.privilegeAuthorize}`,
    method: 'post',
    data
  })
}

export function getAssignedUser(roleId) {
  return request({
    url: `${URL.sys.roleAssignedUser}/${roleId}`,
    method: 'get'
  })
}

export function saveAssignedUser(data) {
  return request({
    url: `${URL.sys.roleAssignUser}`,
    method: 'post',
    data
  })
}

export function copyRole(data) {
  return request({
    url: `${URL.sys.roleCopy}`,
    method: 'post',
    data
  })
}

export function getDataPrivilege(params) {
  return request({
    url: `${URL.sys.privilegeOfData}`, // privilegeOfData - 数据权限
    method: 'get',
    params
  })
}
export function addDataPrivilegeSave(data) {
  return request({
    url: `${URL.sys.dataPrivilege}`,
    method: 'post',
    data
  })
}
export function removeDataPrivilege(params) {
  return request({
    url: `${URL.sys.removeDataPrivilege}`,
    method: 'delete',
    params
  })
}
