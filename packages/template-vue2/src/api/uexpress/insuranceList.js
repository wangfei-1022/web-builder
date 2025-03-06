// 小包
import request from '@/utils/request'

// 保单-保险公司-列表 -- 投保列表
export function getInsuranceListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/insurance/insurer/list`,
    method: 'get',
    params
  })
}
