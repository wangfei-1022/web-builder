import request from '@/utils/request'
/**
 * 获取货品列表
 * @returns {*}
 */

export function getSeaGoodsListApi(params) {
  return request({
    url: `/api/sit-service/sea/import/goods/pages`,
    method: 'get',
    params
  })
}
/**
 * 保存货品
 * @returns {*}
 */

export function saveSeaGoodsApi(data) {
  return request({
    url: data.id ? `/api/sit-service/sea/import/goods/${data.id}` : `/api/sit-service/sea/import/goods`,
    method: data.id ? 'put' : 'post',
    data
  })
}

/**
 * 货品详情
 * @returns {*}
 */

export function detailSeaGoodsApi(id) {
  return request({
    url: `/api/sit-service/sea/import/goods/detail/${id}`,
    method: 'get'
  })
}
/**
 * 货品更新状态
 * @returns {*}
 */

export function updateStateGoodsApi(data) {
  return request({
    url: `/api/sit-service/sea/import/goods/${data.id}/updateState`,
    method: 'put',
    data
  })
}
/**
 * 货品导入
 * @returns {*}
 */

export function importGoodsApi(data) {
  return request({
    url: `/api/sit-service/sea/import/goods/import`,
    method: 'post',
    data
  })
}
