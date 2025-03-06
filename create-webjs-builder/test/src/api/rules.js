import request from '@/utils/request'
import URL from './urlTranslator'

export function getRulesList(params) {
  return getRulesListByOfficeId(0)
}

export function getRulesById(id) {
  return request({
    url: `${URL.cfg.rulesInfo}/${id}`,
    method: 'get'
  })
}
export function batchCopyRules(sourceOfficeId, targetOfficeId) {
  const data = { sourceOfficeId, targetOfficeId }
  return request({
    url: `${URL.cfg.rulesInfoCopy}`,
    method: 'post',
    data
  })
}

export function saveRules(data, id) {
  return request({
    url: `${URL.cfg.rulesInfo}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}

export function delRules(id) {
  return request({
    url: `${URL.cfg.rulesInfo}/${id}`,
    method: 'delete'
  })
}

export function generateJobNoExample(params) {
  return request({
    url: URL.cfg.generateRulesJobNo,
    method: 'get',
    params
  })
}

export function loadDetailInitInfo(id) {
  return request({
    url: URL.cfg.rulesDetailInit,
    method: 'get'
  })
}

export function getRulesListByOfficeId(officeId) {
  return request({
    url: `${URL.cfg.getRulesByOfficeId}/${officeId}`,
    method: 'get'
  })
}

export function getCompanyList() {
  return request({
    url: URL.sys.officeList,
    method: 'get'
  })
}

export function switchRulesStatus(id, bActive) {
  const params = { id: id }
  const url = bActive ? URL.cfg.rulesEnable : URL.cfg.rulesDisable
  return request({
    url: url,
    method: 'put',
    params
  })
}

export function getAssignedUser(id) {
  return request({
    url: `${URL.sys.ruleAssignedUser}/${id}`,
    method: 'get'
  })
}

export function saveAssignedUser(data) {
  return request({
    url: `${URL.sys.ruleAssignUser}`,
    method: 'post',
    data
  })
}
