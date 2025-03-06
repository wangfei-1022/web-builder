// 小包
import request from '@/utils/request'

// 供应商服务产品列表
export function supplierProductSupplyListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/product/supply/list`,
    method: 'get',
    params
  })
}

// 供应商服务产品-新增
export function supplierProductSupplyAddApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/product/supply/create`,
    method: 'post',
    data
  })
}

// 供应商服务产品-更新
export function supplierProductSupplyUpdateApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/product/supply/update`,
    method: 'post',
    data
  })
}

// 供应商服务产品-禁用
export function supplierProductSupplyForbiddenApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/product/supply/forbidden`,
    method: 'post',
    data
  })
}

// 供应商服务产品-启用
export function supplierProductSupplyActivateApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/product/supply/activate`,
    method: 'post',
    data
  })
}
