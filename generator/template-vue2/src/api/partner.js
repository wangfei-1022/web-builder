import request from '@/utils/request'
import URL from './urlTranslator'
export function getOfficeList() {
  return request({
    url: `${URL.sys.officeList}`,
    method: 'get'
  })
}

export function getOfficeListForSettingDataPrivilege(params) {
  return request({
    url: `${URL.sys.officeListForSettingDataPrivilege}`,
    method: 'get',
    params
  })
}
export function getDepartmentListForSettingDataPrivilege(params) {
  return request({
    url: `${URL.sys.departmentListForSettingDataPrivilege}`,
    method: 'get',
    params
  })
}
export function getPersonListForSettingDataPrivilege(params) {
  return request({
    url: `${URL.sys.personListForSettingDataPrivilege}`,
    method: 'get',
    params
  })
}
