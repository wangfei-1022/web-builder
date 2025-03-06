import request from '@/utils/request'
// 账单管理-预估费用列表
export function getEstimateListApi(params) {
  return request({
    url: `/api/ovl-service/ovl/omc/fms/estimate/page`,
    method: 'get',
    params
  })
}
// 账单管理-费用日志列表
export function getChargeLogListApi(params) {
  return request({
    url: `/api/ovl-service/omc/ovl/charge/log/pages`,
    method: 'get',
    params
  })
}