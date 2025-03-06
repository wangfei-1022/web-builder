import request from '@/utils/request'
const URL = {
  warehouseInfo: '/api/ovl-service/omc/ovl/warehouse'
}
/**
 * 获取仓库列表
 * @param {} params
 * @returns
 */
export function getWarehouseListApi(params) {
  return request({
    url: `${URL.warehouseInfo}/list`,
    method: 'get',
    params
  })
}
/**
 * 保存仓库数据
 * @param {} data
 * @returns
 */
export function saveWarehouseApi(data) {
  return request({
    url: `${URL.warehouseInfo}` + (data.id ? `/${data.id}` : ''),
    method: data.id ? 'put' : 'post',
    data
  })
}
/**
 * 更新状态
 */
export function updateStatusApi(data) {
  return request({
    url: `${URL.warehouseInfo}/updateStatus/${data.id}`,
    method: 'put',
    data
  })
}
/**
 *获取详情
 */
export function detailWarehouseApi(id) {
  return request({
    url: `${URL.warehouseInfo}/detail/${id}`,
    method: 'get'
  })
}
/**
 *仓库管理-基本信息-更新
 */
export function saveBaseInfoApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/base/info`,
    method: 'put',
    data
  })
}
/**
 *仓库管理-联系人信息-更新
 */
export function saveContactfoApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/contact/info`,
    method: 'put',
    data
  })
}
/**
 *仓库管理-基本配置-更新
 */
export function saveBaseConfigApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/base/config`,
    method: 'put',
    data
  })
}
/**
 *仓库管理-入库配置-更新
 */
export function saveStorageConfigApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/storage/config`,
    method: 'put',
    data
  })
}
/**
 *仓库管理-出库配置-更新
 */
export function saveOutboundConfigApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/outbound/config`,
    method: 'put',
    data
  })
}
/**
 *仓库管理-库内配置-更新
 */
export function saveRollsConfigApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/rolls/config`,
    method: 'put',
    data
  })
}
/**
 *仓库管理-保税信息-更新
 */
export function saveBondedWarehouseInfoApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/bonded/info/${data.warehouseId}`,
    method: 'put',
    data
  })
}
/**
 *仓库管理-仓库国家下拉列表
 */
export function getWarhouseCountryApi() {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/countryList`,
    method: 'get'
  })
}
/**
 *仓库管理-仓库承运商下拉列表
 */
export function getWarhouseSupplierApi(params) {
  return request({
    url: `/api/scm-service/scm/supplier/selections`,
    method: 'get',
    params
  })
}
