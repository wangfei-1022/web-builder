// 小包
import request from '@/utils/request'

// 费用项-列表
export function getChargeItemListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/charge/item/list`,
    method: 'get',
    params
  })
}

// 费用项规则-列表
export function getChargeRulesListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/charge/rule/list`,
    method: 'get',
    params
  })
}
