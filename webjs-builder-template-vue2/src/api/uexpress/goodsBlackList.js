// 小包
import request from '@/utils/request'

// 黑名单-报关商品-列表
export function getGoodsBlackListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/customs/blacklist/goods/pages`,
    method: 'get',
    params
  })
}

// 黑名单-类型
export function getGoodsBlackTypeApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/customs/blacklist/goods/type/list`,
    method: 'get',
    params
  })
}


// 黑名单-报关商品-新建
export function createGoodsBlackListApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/customs/blacklist/goods/create`,
    method: 'post',
    data
  })
}

// 黑名单-报关商品-更新
export function updateGoodsBlackListApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/customs/blacklist/goods`,
    method: 'post',
    data
  })
}

// 黑名单-报关商品-删除
export function deleteGoodsBlackListApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/customs/blacklist/goods`,
    method: 'delete',
    data
  })
}

// 黑名单-报关商品-导入
export function importGoodsBlackListApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/customs/blacklist/goods/import`,
    method: 'post',
    data
  })
}
