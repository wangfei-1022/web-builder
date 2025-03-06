import request from '@/utils/request'
import URL from './urlTranslator'
const urlApi = {
  inputBl: '/api/cas-service/omc/cas/job/bl',
  signDeclare: '/api/cas-service/omc/cas/job/bl/sign_declare',
  importMasterBl: '/api/cas-service/omc/cas/job/bl/importMasterBl'
}
/**
 * 获取提单列表数据
 * @param {*} params
 * @returns
 */
export function getBLList(params) {
  return request({
    url: `${URL.omc.getBLList}`,
    method: 'get',
    params
  })
}
/**
 * 获取详情
 * @param {*} id
 * @returns
 */
export function billDetail(id) {
  return request({
    url: `${URL.omc.billDetail}/${id}`,
    method: 'get'
  })
}
/**
 * 批量删除
 * @param {*} data
 * @returns
 */
export function batchDelete(data) {
  return request({
    url: `${URL.omc.batchDelete}`,
    method: 'delete',
    data
  })
}
/**
 * 批量签发
 * @param {*} data
 * @returns
 */

export function batchIssue(data) {
  return request({
    url: `${URL.omc.batchIssue}`,
    method: 'put',
    data
  })
}
/**
 * 提单列表相关导出
 * @param {*} params
 * @returns
 */
export function exportBL(params) {
  return request({
    url: `${URL.omc.exportBL}`,
    method: 'get',
    params
  })
}
// 包船提单信息-提单列表相关-批量出样单
export function batchExportCopy(params) {
  return request({
    url: `/api/cas-service/omc/cas/job/bl/report/batchExportCopy`,
    method: 'get',
    params
  })
}
/**
 * 提单出单
 * @param {*} data
 * @returns
 */
export function billPrint(params) {
  return request({
    url: `${URL.omc.billPrint}/${params.billId}`,
    method: 'get',
    params
  })
}
// new add

// 提单补料时通过箱子id，生成提单号
export function buildBillNo(params) {
  return request({
    url: '/api/cas-service/member/cas/order/container/getBlNoAndScn',
    method: 'get',
    params
  })
}

// 提单补料时通过箱子id，查询箱子详情
export function getContainerDetailByIdsApi(params) {
  return request({
    url: '/api/cas-service/omc/cas/order/container/getContainerDetailByIds',
    method: 'get',
    params
  })
}
// 提单补料时通过箱子id，查询箱子详情
export function partnerAdvancedApi(id) {
  return request({
    url: `/api/cas-service/cas/destination/agent/detail/${id}`,
    method: 'get'
  })
}
// 创建
export function getContainerSailingDetailByIdsApi(params) {
  return request({
    url: '/api/cas-service/omc/cas/order/container/getContainerSailingDetailByIds',
    method: 'get',
    params
  })
}
// 创建
export function billOfLoading(data) {
  return request({
    url: '/api/cas-service/omc/cas/order/container/billOfLoading',
    method: 'post',
    data
  })
}
// 编辑提交
export function submitSaveEdit(data) {
  return request({
    url: '/api/cas-service/omc/cas/job/bl/saveEdit',
    method: 'put',
    data
  })
}
// 驳回
export function reject(data) {
  return request({
    url: '/api/cas-service/omc/cas/job/bl/reject',
    method: 'put',
    data
  })
}
// 审核
export function review(data) {
  return request({
    url: '/api/cas-service/omc/cas/job/bl/review',
    method: 'put',
    data
  })
}
// 拆合
export function blMerge(data) {
  return request({
    url: '/api/cas-service/omc/cas/order/container/blMerge',
    method: 'post',
    data
  })
}

// 提单补料通过SO或箱货查询可以补料的箱子
export function findContainerForBillOfLoading(params) {
  return request({
    url: '/api/cas-service/omc/cas/order/container/findContainerForBillOfLoading',
    method: 'get',
    params
  })
}
export function list(params) {
  return request({
    url: '/api/cas-service/member/cas/order/container/list',
    method: 'get',
    params
  })
}
// 通过提单id，查询提单详情
export function getBillDetail(params) {
  return request({
    url: '/api/cas-service/omc/cas/order/container/billDetail/' + params,
    method: 'get'
  })
}
// 通过提单blNo，查询提单详情
export function billDetailByBlNo(params) {
  return request({
    url: '/api/cas-service/omc/cas/order/container/billDetailByBlNo/' + params,
    method: 'get'
  })
}

// 提单补料时查询最近20条收发通 memberId
export function getLastScn(params) {
  return request({
    url: '/api/cas-service/omc/cas/order/container/getLastScn',
    method: 'get',
    params
  })
}

// 行业术语code查找细项
export function dropdownlist(params) {
  return request({
    url: '/api/mdm-service/dmn/term/item/dropdownlist',
    method: 'get',
    params
  })
}

// 录入mblNo
export function inputBlApi(data, id) {
  return request({
    url: `${urlApi.inputBl}/${id}`,
    method: 'put',
    data
  })
}

// 批量标记申报状态
export function signDeclareApi(data, ids) {
  return request({
    url: `${urlApi.signDeclare}/${ids}`,
    method: 'put',
    data
  })
}
// 批量标记申报状态
export function importMasterBlApi(data) {
  return request({
    url: `${urlApi.importMasterBl}`,
    method: 'post',
    data
  })
}

// 校验mblNo是否重复
export function checkMblNoApi(id, params) {
  return request({
    url: `/api/cas-service/omc/cas/job/bl/checkMblNo/${id}`,
    method: 'get',
    params
  })
}
// 提单审核更新mblNo
export function updateMblNoApi(data, id) {
  return request({
    url: `/api/cas-service/omc/cas/job/bl/updateMblNo/${id}`,
    method: 'put',
    data
  })
}
// 提单补料通过箱货查询预配舱单申报的物料信息
export function getContainerDetailByContainerNoApi(params) {
  return request({
    url: '/api/cas-service/omc/cas/order/container/getContainerDetailByContainerNo',
    method: 'get',
    params
  })
}

// 查询总数/未签发数量
export function issueStatisticApi(params) {
  return request({
    url: '/api/cas-service/omc/cas/job/bl/issueStatistic',
    method: 'get',
    params
  })
}
