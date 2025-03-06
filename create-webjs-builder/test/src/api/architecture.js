import request from '@/utils/request'
import URL from './urlTranslator'

export function getArchitectureList(params) {
  return request({
    url: URL.sys.architectureInfo,
    method: 'get',
    params
  })
}

export function getArchitectureById(id) {
  return request({
    url: `${URL.sys.architectureInfo}/${id}`,
    method: 'get'
  })
}

export function saveCompany(data, id) {
  return request({
    url: `${URL.sys.architectureInfo}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}

export function delArchitecture(id, orgType) {
  const params = { orgType }
  return request({
    url: `${URL.sys.architectureInfo}/${id}`,
    method: 'delete',
    params
  })
}

export function getDeptById(id) {
  return request({
    url: `${URL.sys.deptInfo}/${id}`,
    method: 'get'
  })
}

export function saveDept(data, id) {
  return request({
    url: `${URL.sys.deptInfo}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}

export function delDept(id) {
  return request({
    url: `${URL.sys.deptInfo}/${id}`,
    method: 'delete'
  })
}

export function getCompanyList() {
  return request({
    url: URL.sys.officeList,
    method: 'get'
  })
}

export function getCompanyVisualView() {
  return request({
    url: URL.sys.companyVisualView,
    method: 'get'
  })
}
