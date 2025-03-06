// 小包
import request from '@/utils/request'

// 理赔汇总-列表
export function getClaimSummaryListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/summary/list`,
    method: 'get',
    params
  })
}
