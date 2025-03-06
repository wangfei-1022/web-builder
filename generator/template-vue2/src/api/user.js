import request from '@/utils/request'
import URL from './urlTranslator'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getUserList(params) {
  return request({
    url: URL.sysUser,
    method: 'get',
    params
  })
}

export function getUsers(params) {
  return request({
    url: '/api/member-service/mem/user/list',
    method: 'get',
    params
  })
}

export function getUserById(id) {
  return request({
    url: `${URL.sysUser}/${id}`,
    method: 'get'
  })
}

export function getUserDutyList() {
  return request({
    url: `${URL.sys.userDutyList}`,
    method: 'get'
  })
}

export function saveUser(data, id) {
  return request({
    url: `${URL.sysUser}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}

export function activateUser(id) {
  return request({
    url: `${URL.sys.userEnable}`,
    method: 'put',
    params: { id }
  })
}

export function deactivateUser(id) {
  return request({
    url: `${URL.sys.userDisable}`,
    method: 'put',
    params: { id }
  })
}

export function getOffice() {
  return request({
    url: `${URL.sys.officeList}`,
    method: 'get'
  })
}

export function getDepartment() {
  return request({
    url: `${URL.sys.departmentList}`,
    method: 'get'
  })
}

export function getDepartmentByOfficeId(officeId) {
  return request({
    url: `${URL.sys.departmentList}`,
    method: 'get',
    params: { officeId }
  })
}

export function getAssignedRole(id) {
  return request({
    url: `${URL.sys.userAssignedRole}/${id}`,
    method: 'get'
  })
}

export function saveAssignedRole(data) {
  return request({
    url: `${URL.sys.userAssignRole}`,
    method: 'post',
    data
  })
}

export function getAssignedRule(id) {
  return request({
    url: `${URL.sys.userAssignedRule}/${id}`,
    method: 'get'
  })
}

export function saveAssignedRule(data) {
  return request({
    url: `${URL.sys.userAssignRule}`,
    method: 'post',
    data
  })
}

export function getUserDropDownList(params) {
  return request({
    url: URL.sys.userDropDownList,
    method: 'get',
    params
  })
}

export function resetPassword(userId) {
  return request({
    url: `${URL.sys.resetPassword}/${userId}`,
    method: 'put'
  })
}

export function changePassword(data) {
  return request({
    url: `${URL.sys.changePassword}`,
    method: 'post',
    data
  })
}

// 通过用户名查询用户列表 -- 下拉列表 远程搜索
export function getRemoteMemberApi(params) {
  return request({
    url: URL.remoteMember,
    method: 'get',
    params
  })
}

// 获取用户的菜单
export function getUserMenuApi() {
  return request({
    url: `/api/sys-service/sys/user/current/menu/tree`,
    method: 'get'
  })
}

// 收藏菜单
export function saveFavoriteApi(privilegeId) {
  return request({
    url: `/api/sys-service/per/menu/favorite/${privilegeId}`,
    method: 'post'
  })
}

// 取消收藏菜单
export function removeFavoriteApi(privilegeId) {
  return request({
    url: `/api/sys-service/per/menu/favorite/${privilegeId}`,
    method: 'delete'
  })
}

// 获取已收藏列表
export function getFavoriteListApi() {
  return request({
    url: `/api/sys-service/per/menu/favorite/list`,
    method: 'get'
  })
}

// 最近访问列表
export function getLastestVisitedListApi() {
  return request({
    url: `/api/sys-service/per/menu/logs/list`,
    method: 'get'
  })
}
