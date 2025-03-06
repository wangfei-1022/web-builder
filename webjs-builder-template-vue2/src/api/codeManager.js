import request from '@/utils/request'
/**
 * 获取提单列表数据
 * @param {*} params
 * @returns
 */

// 代码列表
export function getCustomAttributeListApi(params) {
  return request({
    url: '/api/mdm-service/dmn/custom/attribute/pages',
    method: 'get',
    params
  })
}

// 禁用代码
export function disableAttributeApi(id) {
  return request({
    url: `/api/mdm-service/dmn/custom/attribute/activedisable/${id}`,
    method: 'put'
  })
}

// 启用代码
export function enableAttributeApi(id) {
  return request({
    url: `/api/mdm-service/dmn/custom/attribute/activeenable/${id}`,
    method: 'put'
  })
}

// 删除代码
export function deleteAttributeApi(id) {
  return request({
    url: `/api/mdm-service/dmn/custom/attribute/${id}`,
    method: 'delete'
  })
}

// 代码详情
export function getAttributeDetailApi(id) {
  return request({
    url: `/api/mdm-service/dmn/custom/attribute/detail/${id}`,
    method: 'get'
  })
}

// 新增代码
export function createAttributeDetailApi(data) {
  return request({
    url: '/api/mdm-service/dmn/custom/attribute',
    method: 'post',
    data
  })
}

// 提交编辑代码
export function updateAttributeDetailApi(id, data) {
  return request({
    url: `/api/mdm-service/dmn/custom/attribute/${id}`,
    method: 'put',
    data
  })
}

// 代码下拉
export function getAttributeDropdownApi(params) {
  return request({
    url: '/api/mdm-service/dmn/custom/attribute/selections',
    method: 'get',
    params
  })
}

// 获取代码项列表
export function getSubitemListApi(params) {
  return request({
    url: '/api/mdm-service/dmn/custom/attribute/item/pages',
    method: 'get',
    params
  })
}

export function getSubitemDropdownListApi(params) {
  return request({
    url: '/api/mdm-service/dmn/custom/attribute/item/selections',
    method: 'get',
    params
  })
}


// 新增代码项
export function createSubitemApi(data) {
  return request({
    url: data.id ? `/api/mdm-service/dmn/custom/attribute/item/${data.id}` : '/api/mdm-service/dmn/custom/attribute/item',
    method: data.id ? 'put' : 'post',
    data
  })
}

// 删除代码项
export function deleteSubitemApi(id) {
  return request({
    url: `/api/mdm-service/dmn/custom/attribute/item/${id}`,
    method: 'delete'
  })
}

// 启用代码项
export function enableSubitemApi(id) {
  return request({
    url: `/api/mdm-service/dmn/custom/attribute/item/activeenable/${id}`,
    method: 'put'
  })
}

// 停用代码项
export function disableSubitemApi(id) {
  return request({
    url: `/api/mdm-service/dmn/custom/attribute/item/activedisable/${id}`,
    method: 'put'
  })
}
// 代码项管理 - 下拉框查询
export function getCustomItemSelectionsApi(params) {
  return request({
    url: `/api/mdm-service/dmn/custom/attribute/item/selections`,
    method: 'get',
    params
  })
}
