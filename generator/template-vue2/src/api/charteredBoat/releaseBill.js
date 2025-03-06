import request from '@/utils/request'
import URL from '@/api/urlTranslator'

// 商务查询列表
export function releaseListBusinessApi(params) {
  return request({
    url: `/api/cas-service/omc/cas/bl/release/application/pageByBusiness`,
    method: 'get',
    params
  })
}

// 运营查询列表
export function releaseListOperateApi(params) {
  return request({
    url: `/api/cas-service/omc/cas/bl/release/application/pageByOperate`,
    method: 'get',
    params
  })
}

// 放单保函/凭证文件查看
export function releaseFileListApi(params, id) {
  return request({
    url: `/api/cas-service/omc/cas/bl/release/application/file_list/${id}`,
    method: 'get',
    params
  })
}

// 确认查询详情
export function releaseDetailApi(id) {
  return request({
    url: `/api/cas-service/omc/cas/bl/release/application/detail/${id}`,
    method: 'get'
  })
}

// 商务审核
export function updateStatusByBusinessApi(data, id) {
  return request({
    url: `/api/cas-service/omc/cas/bl/release/application/updateStatusByBusiness/${id}`,
    method: 'put',
    data
  })
}

// 运营审核
export function updateStatusByOperateApi(data, id) {
  return request({
    url: `/api/cas-service/omc/cas/bl/release/application/updateStatusByOperate/${id}`,
    method: 'put',
    data
  })
}

// 查看提单详情

export function releaseJobBlApi(blNo) {
  return request({
    url: `/api/cas-service/omc/cas/bl/release/application/jobBl/${blNo}`,
    method: 'get'
  })
}

// 商务标记款项未到账
export function updateAccountStatusApi(data, id) {
  return request({
    url: `/api/cas-service/omc/cas/bl/release/application/updateAccountStatus/${id}`,
    method: 'put',
    data
  })
}
