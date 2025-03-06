// 小包
import request from '@/utils/request'

// 报关商品-列表
export function getGoodsListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/customs/goods/list`,
    method: 'get',
    params
  })
}

// 报关商品-新建
export function createGoodsListApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/customs/goods/create`,
    method: 'post',
    data
  })
}

// 报关商品-更新
export function updateGoodsListApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/customs/goods/update`,
    method: 'post',
    data
  })
}

// 报关商品-导入
export function importGoodsListApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/customs/goods/import`,
    method: 'post',
    data
  })
}
