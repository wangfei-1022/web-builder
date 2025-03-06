import request from '@/utils/request'
// 获取旺季时间列表
export function getPeakSeasonTimeListApi(params) {
  return request({
    url: `/api/trans-service/omc/lnt/product/peak/season/time/list/pages`,
    method: 'get',
    params
  })
}
// 获取费用项下拉
export function getFeeDropdownApi() {
  return request({
    url: `/api/mdm-service/dmn/fee/dropdown/list`,
    method: 'get'
  })
}


// 更新状态生效、失效
export function updateStatusApi(data) {
  return request({
    url: `/api/trans-service/omc/lnt/product/peak/season/time/updateStatus/${data.id}`,
    method: 'put',
    data
  })
}
// 提交旺季附加费
export function submitPeakSeasonTimeApi(data) {
  return request({
    url: `/api/trans-service/omc/lnt/product/peak/season/time/submit`,
    method: 'post',
    data
  })
}
// 查看旺季附加费
export function detailPeakSeasonTimeApi(id) {
  return request({
    url: `/api/trans-service/omc/lnt/product/peak/season/time/detail/${id}`,
    method: 'get'
  })
}

// 通过物流产品获取渠道
export function getChannelByProductApi(productCode) {
  return request({
    url: `/api/trans-service/omc/lnt/channel/listByProductCode/${productCode}`,
    method: 'get'
  })
}

// 通过物流产品获取旺季时间
export function getPeakByProductApi(params) {
  return request({
    url: `/api/trans-service/omc/lnt/product/peak/season/time/list`,
    method: 'get',
    params
  })
}
// 模糊查询物流产品

export function getProductListApi(likeKey) {
  return request({
    url: `/api/trans-service/omc/lnt/product/${likeKey}/list`,
    method: 'get'
  })
}
// 渠道旺季成本-查询列表

export function getChannelPeakSeasonListApi(params) {
  return request({
    url: `/api/trans-service/omc/lnt/channel/peak/season/price/list/pages`,
    method: 'get',
    params
  })
}

// 渠道旺季成本-发布
export function channelPeakSeasonPublishApi(id) {
  return request({
    url: `/api/trans-service/omc/lnt/price/card/peak/season/publish/${id}`,
    method: 'put'
  })
}
