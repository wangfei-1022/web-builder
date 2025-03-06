import request from '@/utils/request'
import URL from './urlTranslator'

export function switchCompanyStatus(id, bActive) {
  const url = bActive ? URL.sys.companyEnable : URL.sys.companyDisable
  const params = { id: id }
  return request({
    url: url,
    method: 'put',
    params
  })
}

export function getCompanyInfoById(id) {
  return request({
    url: `${URL.sys.companyInfo}/${id}`,
    method: 'get'
  })
}

export function getMembersOfDept(departmentId) {
  return request({
    url: `${URL.sys.membersOfDept}`,
    method: 'get',
    params: {
      departmentId: departmentId
    }
  })
}

export function getDeptTree(officeId) {
  return request({
    url: `${URL.sys.deptTree}/${officeId}`,
    method: 'get'
  })
}

export function getBankAccountsByOffice(officeId) {
  return request({
    url: `${URL.sys.bankAccounts}/${officeId}`,
    method: 'get'
  })
}

export function saveCompanyInfo(data, id) {
  return request({
    url: `${URL.sys.companyInfo}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}

export function saveBank(data, id) {
  return request({
    url: `${URL.sys.bankInfo}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}

export function switchBankStatus(id, bActive) {
  const url = bActive ? URL.sys.bankEnable : URL.sys.bankDisable
  return request({
    url: url + `/${id}`,
    method: 'put'
  })
}

export function getBankById(id) {
  return request({
    url: `${URL.sys.bankInfo}/${id}`,
    method: 'get'
  })
}

export function delBank(id) {
  return request({
    url: `${URL.sys.bankInfo}/${id}`,
    method: 'delete'
  })
}

export function saveOfficeLogo(data) {
  return request({
    url: `${URL.oms.seaExportJobElectronicFileSave}`,
    method: 'post',
    data
  })
}
