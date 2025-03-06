import request from '@/utils/request'
import { getUserInfo as getUserInfo4LocalSession } from '@/utils/auth'
import URL from './urlTranslator'

export function loginByUsername(data) {
  return request({
    url: URL.authLogin,
    // url: 'http://127.0.0.1:8220/test?a=123123',
    method: 'post',
    data
  })
}

export function loginInitRedisInfo() {
  return request({
    url: URL.sys.loginInitRedisInfo,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: URL.logout,
    method: 'post'
  })
}

export function getUserInfo() {
  return new Promise((resolve, reject) => {
    const userInfo = getUserInfo4LocalSession()
    userInfo.roles = userInfo.privilegeCodeList || []
    resolve(userInfo)
  })
  // return request({
  //   url: URL.authAuth,
  //   method: 'get'
  // })
}

