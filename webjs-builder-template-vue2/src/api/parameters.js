import request from '@/utils/request'
import URL from './urlTranslator'

export function getCompanyList() {
  return request({
    url: URL.sys.companyList,
    method: 'get'
  })
}

export function getParametersListByCompany(officeId) {
  const params = { officeId }
  return request({
    url: `${URL.cfg.parametersList}`,
    method: 'get',
    params
  })
}
// 编辑保存参数项
export function saveParameterItem({ configId, configValue, configValueDesc, officeId, parameterCode }) {
  const data = { configId, configValue, configValueDesc, officeId, parameterCode }
  return request({
    url: `${URL.cfg.parametersList}`,
    method: 'post',
    data
  })
}
// 根据itemCode获取参数列表
export function getParameterValueListByCode(parameterCode) {
  console.log('---parameterCode', parameterCode)
  return request({
    url: `${URL.cfg.parameterValueListByCode}/${parameterCode}`,
    method: 'get'
  })
}
// 重置参数
export function resetParametersList(officeId) {
  return request({
    url: `${URL.cfg.parametersListReset}/${officeId}`,
    method: 'put'
  })
}
// 参数复制
export function copyParametersList(sourceOfficeId, targetOfficeId) {
  const data = { sourceOfficeId, targetOfficeId }
  return request({
    url: `${URL.cfg.parametersListCopy}`,
    method: 'post',
    data
  })
}

