// 小包 - 客户管理
import request from '@/utils/request'

// 渠道订单-取号情况列表-运营
export function getOrderChannelListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/order/channel/list`,
    method: 'get',
    params
  })
}
