// 小包
import request from '@/utils/request'

// 产品线路列表
export function getProductLineListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/product/line/list`,
    method: 'get',
    params
  })
}

// 服务产品-产品线路列表
export function getProductLineListBySalesApi(productId) {
  return request({
    url: `/api/ilp-service/omc/ilp/product/line/list/product/${productId}`,
    method: 'get'
  })
}

// 服务产品-产品线路-禁用
export function productLineForbiddenApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/product/line/forbidden`,
    method: 'post',
    data
  })
}

// 服务产品-产品线路-启用
export function productLineActivateApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/product/line/activate`,
    method: 'post',
    data
  })
}

// 服务产品-产品线路-创建
export function addProductLineApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/product/line/create`,
    method: 'post',
    data
  })
}

// 服务产品-产品线路-详情
export function getProductLineDetailApi(productLineId) {
  return request({
    url: `/api/ilp-service/omc/ilp/product/line/detail/${productLineId}`,
    method: 'get'
  })
}


// 服务产品-产品线路-修改
export function updateProductLineApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/product/line/update`,
    method: 'post',
    data
  })
}

// 服务产品-产品线路-删除
export function deleteProductLineApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/product/line/delete`,
    method: 'post',
    data
  })
}
