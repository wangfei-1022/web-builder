import request from '@/utils/request'
import url from '../urlTranslator'
const URL = {
  getInfo: '/api/member-service/omc/mem/goods/kinds',
  dropdownlist: '/api/mdm-service/dmn/term/item/dropdownlist',
  goodsOwner: '/api/member-service/omc/goods/owner/list',
  getCountryList: '/api/mdm-service/dmn/frequent/countrylist'
}

/**
 * 获取货品列表
 * @returns {*}
 */

export function getGoodsListApi(params) {
  return request({
    url: `${URL.getInfo}/list`,
    method: 'get',
    params
  })
}

/**
 * 保存货品草稿数据
 */
export function saveGoodsInfoApi(data) {
  return request({
    url: `${URL.getInfo}/save_draft`,
    method: 'post',
    data
  })
}
/**
 * 获取详情
 * @param {*} id
 * @returns
 */
export function getGoodsDetailApi(id) {
  return request({
    url: `${URL.getInfo}/detail/${id}`,
    method: 'get'
  })
}
/**
 * 批量导入货品信息或图片
 * @param {*} id
 * @returns
 */
export function uploadFileBacthApi(data) {
  return request({
    url: `/api/member-service/omc/mem/goods/kinds/batch/import/goodsInfoOrPic`,
    method: 'post',
    data
  })
}
/**
 * 提交审核
 * @param {*} data
 * @returns
 */
export function submitGoodsAuditApi(data) {
  return request({
    url: `${URL.getInfo}/submit`,
    method: 'post',
    data
  })
}
/**
 * 批量审核
 * @param {*} data
 * @returns
 */
export function batchGoodsAuditApi(data) {
  return request({
    url: `/api/member-service/omc/mem/goods/kinds/batch/audit`,
    method: 'put',
    data
  })
}
/**
 * 获取电商平台数据
 * @param {*} data
 * @returns
 */
export function getDropdownlistApi(params) {
  return request({
    url: `${URL.dropdownlist}`,
    method: 'get',
    params
  })
}
/**
 * 更新数据
 * @param {*} data
 * @returns
 */
export function updateGoodsInfoApi(data) {
  return request({
    url: `/api/member-service/omc/mem/goods/kinds/updatePart/${data.id}`,
    method: 'put',
    data
  })
}
/**
 * 获取货主
 * @param {*} data
 * @returns
 */
export function getGoodsOwnerApi(params) {
  return request({
    url: `${URL.goodsOwner}`,
    method: 'get',
    params
  })
}

/**
 * 上传文件
 * @param {} params
 * @returns
 */
export function uploadFileApi(data) {
  return request({
    url: `${url.omc.uploadWebUrl}`,
    method: 'post',
    data
  })
}
export function auditGoodsApi(data) {
  return request({
    url: `${URL.getInfo}/audit/${data.id}`,
    method: 'put',
    data
  })
}
/**
 * 获取销售国家
 * @param {*} data
 * @returns
 */
export function getCountryListApi(params) {
  return request({
    url: `${URL.getCountryList}`,
    method: 'get',
    params
  })
}

/**
 * 获取品类列表
 * @param {*} data
 * @returns
 */
export function getCategoryListApi(params) {
  return request({
    url: `/api/member-service/omc/mem/goods/category/list/pages`,
    method: 'get',
    params
  })
}
/**
 * 获取品类详情
 * @param {*} data
 * @returns
 */
export function getCategoryDetailApi(id) {
  return request({
    url: `/api/member-service/omc/mem/goods/category/${id}/detail`,
    method: 'get'
  })
}

/**
 * 获取品类保存/编辑
 * @param {*} data
 * @returns
 */
export function saveCategoryApi(data) {
  return request({
    url: data.id ? `/api/member-service/omc/mem/goods/category/${data.id}` : '/api/member-service/omc/mem/goods/category',
    method: data.id ? 'put' : 'post',
    data
  })
}
//
/**
 * 获取父类下拉
 * @param {*} data
 * @returns
 */
export function getParentCategoryApi(params) {
  return request({
    url: "/api/member-service/omc/mem/goods/category/selections",
    method: "get",
    params
  })
}

/**
 * 获取品类删除
 * @param {*} data
 * @returns
 */
export function delCategoryApi(id) {
  return request({
    url: `/api/member-service/omc/mem/goods/category/${id}`,
    method: 'delete'
  })
}
/**
 * 货品自定义编码枚举
 * @param {*} params
 * @returns
 */
export function getGoodsTypeIdListApi() {
  return request({
    url: `/api/member-service/mem/goods/custom/code/codeTypeIdList`,
    method: 'get'
  })
}
/**
 * 货品自定义编码
 * @param {*} params
 * @returns
 */
export function getTermAndItemApi(data) {
  return request({
    url: `/api/mdm-service/dmn/termAndItem`,
    method: 'post',
    data
  })
}
/**
 * 货品打印-海外仓
 * @param {*} params
 * @returns
 */
export function goodsPrintCodeApi(params) {
  return request({
    url: `/api/member-service/mem/goods/kinds/print`,
    method: 'get',
    params
  })
}
/**
 * 货品第三方编码-海外仓
 * @param {*} id
 * @returns
 */
export function getGoodsCustomCodeApi(id) {
  return request({
    url: `/api/member-service/mem/goods/kinds/customCode/${id}`,
    method: 'get'
  })
}
/**
 * 货品打印-进口
 * @param {*} params
 * @returns
 */
export function goodsSeaPrintCodeApi(params) {
  return request({
    url: `/api/sit-service/sea/import/goods/print`,
    method: 'get',
    params
  })
}
/**
 * 货品第三方编码-进口
 * @param {*} id
 * @returns
 */
export function getSeaGoodsCustomCodeApi(id) {
  return request({
    url: `/api/sit-service/sea/import/goods/customCode/${id}`,
    method: 'get'
  })
}
/**
 * 货品导出
 * @param {*} params
 * @returns
 */
export function exportGoodsApi(params) {
  return request({
    url: `/api/member-service/omc/mem/goods/kinds/export`,
    method: 'get',
    params
  })
}
