import request from '@/utils/request'

// 开票公司信息_查询列表
export function crmSettlementCompanyListApi(params) {
  return request({
    url: '/api/member-service/omc/title/settlement/company/pages',
    method: 'get',
    params
  })
}

// 开票公司信息_保存
export function crmSettlementCompanySaveApi(data) {
  return request({
    url: '/api/member-service/omc/title/settlement/company',
    method: 'post',
    data
  })
}
// 开票公司信息_更新
export function crmSettlementCompanyPutApi(data) {
  return request({
    url: `/api/member-service/omc/title/settlement/company/${data.id}`,
    method: 'put',
    data
  })
}
// 开票公司信息_查询详情
export function crmSettlementCompanyDetailApi(id) {
  return request({
    url: `/api/member-service/omc/title/settlement/company/detail/${id}`,
    method: 'get'
  })
}
