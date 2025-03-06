// 小包
import request from '@/utils/request'

// 服务产品-列表
export function getProductSalesListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/product/sales/list`,
    method: 'get',
    params
  })
}

// 服务产品-创建
export function addProductSalesApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/product/sales/create`,
    method: 'post',
    data
  })
}

// 服务产品-更新
export function updateProductSalesApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/product/sales/update`,
    method: 'post',
    data
  })
}

// 服务产品-详情
export function getProductSalesDetailApi(id) {
  return request({
    url: `/api/ilp-service/omc/ilp/product/sales/detail/${id}`,
    method: 'get'
  })
}

// 服务产品-产品线路列表
export function getProductLineListBySalesApi(productId) {
  return request({
    url: `/api/ilp-service/omc/ilp/product/line/list/product/${productId}`,
    method: 'get'
  })
}

// 服务产品-禁用
export function productSalesForbiddenApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/product/sales/forbidden`,
    method: 'post',
    data
  })
}

// 服务产品-启用
export function productSalesActivateApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/product/sales/activate`,
    method: 'post',
    data
  })
}
