import request from '@/utils/request'

// 付款信息_查询列表
export function partnerPaymentInfoListApi(params) {
  return request({
    url: '/api/member-service/omc/supplier/title/settlement/company/pages',
    method: 'get',
    params
  })
}

// 付款信息_保存
export function partnerPaymentInfoSaveApi(data) {
  return request({
    url: '/api/member-service/omc/supplier/title/settlement/company',
    method: 'post',
    data
  })
}
// 付款信息_更新
export function partnerPaymentInfoPutApi(data) {
  return request({
    url: `/api/member-service/omc/supplier/title/settlement/company/${data.id}`,
    method: 'put',
    data
  })
}
// 付款信息_查询详情
export function partnerPaymentInfoDetailApi(id) {
  return request({
    url: `/api/member-service/omc/supplier/title/settlement/company/detail/${id}`,
    method: 'get'
  })
}
