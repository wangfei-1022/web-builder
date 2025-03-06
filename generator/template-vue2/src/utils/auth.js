import Cookies from 'js-cookie'
import Secret from '@/utils/secret'

const TokenKey = 'Authorization'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setUserInfo(userInfoObj) {
  return window.localStorage.setItem('userInfoStr', Secret.Encrypt(JSON.stringify(userInfoObj)))
}

export function getUserInfo() {
  return JSON.parse(Secret.Decrypt(window.localStorage.getItem('userInfoStr')))
}
