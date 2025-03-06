// 小包
import request from '@/utils/request'

// 价卡模板-列表
export function getChargeTemplateListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/template/list`,
    method: 'get',
    params
  })
}

// 价卡模板-创建
export function createChargeTemplateApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/template/create`,
    method: 'post',
    data
  })
}

// 价卡模板-更新
export function updateChargeTemplateApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/template/update`,
    method: 'post',
    data
  })
}

// 价卡模板-删除
export function deleteChargeTemplateApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/template/delete`,
    method: 'post',
    data
  })
}

// 价卡模板-详情
export function getChargeTemplateDetailApi(templateId) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/template/detail/${templateId}`,
    method: 'get'
  })
}

// 基本信息-产品计费分区-列表
export function getAllChargeAreaListApi(params) {
  return request({
    url: `/api/ilp-service/ilp/area/product/list/info`,
    method: 'get',
    params
  })
}

// 价卡模板-启用
export function enableChargeTemplateApi(templateId) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/template/enable/${templateId}`,
    method: 'POST'
  })
}

// 价卡模板-禁用
export function disabledChargeTemplateApi(templateId) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/template/disable/${templateId}`,
    method: 'POST'
  })
}


// 价卡模板-详情-根据模板编号
export function getChargeTemplateDetailByNoApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/offer/template/detail/no`,
    method: 'get',
    params
  })
}
