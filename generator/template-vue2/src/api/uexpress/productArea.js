// 小包
import request from '@/utils/request'

// 产品分区列表
export function areaProductListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/area/product/list`,
    method: 'get',
    params
  })
}

// 产品分区列表
export function addAreaProductApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/area/product/create`,
    method: 'post',
    data
  })
}

// 产品分区列表
export function updateAreaProductApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/area/product/update`,
    method: 'post',
    data
  })
}


// 产品分区-详情
export function getAreaProductDetailApi(id) {
  return request({
    url: `/api/ilp-service/omc/ilp/area/product/detail/${id}`,
    method: 'get'
  })
}

// 产品分区-禁用
export function areaProductForbiddenApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/area/product/forbidden`,
    method: 'post',
    data
  })
}

// 产品分区-启用
export function areaProductActivateApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/area/product/activate`,
    method: 'post',
    data
  })
}

// 产品分区-获取分区范围详情
export function getAreaDetailListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/area/product/range`,
    method: 'get',
    params
  })
}

// 产品分区-新增分区范围
export function addAreaApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/area/product/range/create`,
    method: 'post',
    data
  })
}

// 产品分区-修改分区范围
export function updateAreaApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/area/product/range/update`,
    method: 'post',
    data
  })
}

// 产品分区-修改分区范围
export function deleteAreaApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/area/product/range/delete`,
    method: 'post',
    data
  })
}


// 产品分区-导入
export function importProductAreaListApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/area/product/import`,
    method: 'post',
    data
  })
}

// 产品分区-导入分区详情
export function importProductAreaDetailApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/area/product/detail/import`,
    method: 'post',
    data
  })
}
