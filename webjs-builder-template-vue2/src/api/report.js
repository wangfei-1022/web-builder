import request from '@/utils/request'
import URL from './urlTranslator'
/**
 * 获取报表类型列表
 * @returns
 */
export function getReportTemplateTypeList() {
  return request({
    url: URL.sys.reportTypeList,
    method: 'get'
  })
}
/**
 * 保存报表类型
 * * @param {object} data
 * @returns
 */
export function saveReportType(data, id) {
  return request({
    url: `${URL.sys.reportTypeList}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}
/**
 * 删除报表类型
 * @param {string} id
 * @returns
 */
export function delReportType(id) {
  return request({
    url: `${URL.sys.reportTypeList}/${id}`,
    method: 'delete'
  })
}
/**
 * 获取报表类型详情
 * @param {string} id
 * @returns
 */
export function detailReportType(id) {
  return request({
    url: `${URL.sys.detailReportType}/${id}`,
    method: 'get'
  })
}
/**
 * 根据类型获取模板数据
 * @param {*} typeCode
 * @returns
 */
export function getReportTemplateList(typeCode, name) {
  return request({
    url: `${URL.sys.reportListByType}/${typeCode}?name=${name}`,
    method: 'get'
  })
}
export function getBusinessReportTemplateList(typeCode) {
  return request({
    url: `${URL.sys.businessReportListByType}/${typeCode}`,
    method: 'get'
  })
}

export function getBusinessReportArrTemplateList(params) {
  return request({
    url: `/api/report-service/cfg/template/listbyapply/typeCodeList`,
    method: 'get',
    params
  })
}

export function saveReport(data, id) {
  return request({
    url: `${URL.sys.report}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}

export function delReport(id) {
  return request({
    url: `${URL.sys.report}/${id}`,
    method: 'delete'
  })
}

export function getReportTemplateDataInit(data) {
  return request({
    url: `${URL.sys.reportTemplateDataInit}`,
    method: 'post',
    data
  })
}
export function getDesignerReportURL(data) {
  return `${URL.report.designerReport}`
}
export function getViewReportURL(data) {
  return `${URL.report.viewReport}`
}

export function designerReport(data) {
  return request({
    url: `${URL.report.designerReport}`,
    method: 'post',
    data
  })
}

export function viewReport(data) {
  return request({
    url: `${URL.report.viewReport}`,
    method: 'post',
    data
  })
}
/** ************************************数据源接口*********************************** */
/**
 * 获取列表数据
 * @returns
 */
export function schemeDataList(params) {
  return request({
    url: `${URL.sys.schemeDataList}`,
    method: 'get',
    params
  })
}
/**
 * 保存数据
 */
export function saveSchemeData(data, id) {
  return request({
    url: `${URL.sys.schemeData}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}
/**
 * 删除数据
 */
export function delSchemeData(id) {
  return request({
    url: `${URL.sys.schemeData}/${id}`,
    method: 'delete'
  })
}
/**
 * 获取列表数据name code
 */
export function getSchemeList() {
  return request({
    url: `${URL.sys.schemeDataCodes}`,
    method: 'get'
  })
}
/**
 * 获取列表数据详情
 */
export function detailScheme(id) {
  return request({
    url: `${URL.sys.schemeDataDetail}/${id}`,
    method: 'get'
  })
}
