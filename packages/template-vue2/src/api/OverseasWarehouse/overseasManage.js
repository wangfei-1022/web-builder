import request from "@/utils/request";
// 获取客户列表
export function getOvlCustomerListApi(params) {
  return request({
    url: `/api/ovl-service/omc/ovl/customer/config/pages/list`,
    method: "get",
    params
  })
}
// 查询客户详情
export function detailCustomerApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/customer/config/detail/${id}`,
    method: "get"
  })
}
// 更新客户基础信息
export function updateCustomerBaseInfoApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/customer/config/${data.id
      }/update/baseConfig`,
    method: "put",
    data
  })
}
// 更新客户业务状态
export function updateCustomerStatusApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/customer/config/${data.id}/update/status`,
    method: "put",
    data
  })
}
// 保存客户仓库配置
export function saveCustomerWarehouseApi(data) {
  return request({
    url: data.id ? `/api/ovl-service/omc/ovl/customer/warehouse/config/${data.id}` : `/api/ovl-service/omc/ovl/customer/warehouse/config`,
    method: data.id ? 'put' : "post",
    data
  })
}
// 更新客户仓库配置
export function updateCustomerWarehouseApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/customer/warehouse/config/${data.id}`,
    method: "put",
    data
  })
}
// 更新客户仓库配置生效失效状态
export function updateCustomerWarehouseStatusApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/customer/warehouse/config/${data.id}/update/activeFlag`,
    method: "put",
    data
  })
}
// 获取业务类型
export function getBusinessTypeApi() {
  return request({
    url: `/api/ovl-service/ovl/selections/businessLineTypes`,
    method: "get"
  })
}
// 获取费用类型
export function getChargeTypeApi() {
  return request({
    url: `/api/ovl-service/ovl/selections/charge/type`,
    method: "get"
  })
}
// 获取仓库下产品和物流公司
export function getWarehouseProductAndLogisticsCompanyApi(warehouseId) {
  return request({
    url: `/api/ovl-service/ovl/warehouse/${warehouseId}/productAndLogisticsCompany/selections`,
    method: "get"
  })
}
// 渠道价卡模板-列表
export function getChannelPriceCardBusinessTempApi(params) {
  return request({
    url: `/api/trans-service/omc/lnt/channel/priceCard/template/list`,
    method: "get",
    params
  })
}
// 仓库价卡模板-列表
export function getWarehousePriceCardBusinessTempApi(params) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/priceCard/template/list`,
    method: "get",
    params
  })
}
// 价卡模板-根据价卡场景查询模板下拉数据
export function getPriceCardBusinessSelectionsApi(sceneType) {
  return request({
    url: `/api/pro-service/pro/price/card/business/template/${sceneType}/selections`,
    method: "get"
  })
}
// 价卡模板-保存
export function savePriceCardBusinessTempApi(data) {
  return request({
    url: `/api/pro-service/pro/price/card/business/template`,
    method: "post",
    data
  })
}
// 仓库-查询未关联价卡模板的仓库
export function getWarehousUnRelevancePriceCardsApi() {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/priceCards/unRelevance/channel/list`,
    method: "get"
  })
}
// 仓-价卡-查询所有关联价卡模板的仓库
export function getWarehousRelevancePriceCardsApi() {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/priceCards/template/all`,
    method: "get"
  })
}
// 仓库-关联模板价卡-删除
export function delWarehousePriceCardsTemplateApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/priceCards/template/${id}`,
    method: "delete"
  })
}
// 渠道-关联模板价卡-删除
export function delLntPriceCardsTemplateApi(id) {
  return request({
    url: `/api/trans-service/omc/lnt/priceCards/template/${id}`,
    method: "delete"
  })
}
// 渠道-查询未关联价卡模板的渠道
export function getLntUnRelevanceePriceCardsApi() {
  return request({
    url: `/api/trans-service/omc/lnt/priceCards/unRelevance/channel/list`,
    method: "get"
  })
}
// 渠道-查询所有关联价卡模板的渠道
export function getChannelRelevancePriceCardsApi() {
  return request({
    url: `/api/trans-service/omc/lnt/priceCards/channel/list`,
    method: "get"
  })
}
// 渠道-查询所有关联价卡模板的渠道
export function checkBusinessTemplatekApi(id) {
  return request({
    url: `/api/pro-service/pro/price/card/business/template/exist/${id}`,
    method: "get"
  })
}
// 查看客户钱包额度信息
export function getConfigWallettApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/customer/config/wallet/${id}`,
    method: "get"
  })
}


/** **************************** FBA仓库***************************************/
// FBA仓库管理_列表
export function getFBAWarehouseApi(params) {
  return request({
    url: `/api/ovl-service/ovl/fba/warehouse/pages`,
    method: "get",
    params
  })
}
// FBA仓库管理_查看详情
export function detailFBAWarehouseApi(id) {
  return request({
    url: `/api/ovl-service/ovl/fba/warehouse/detail/${id}`,
    method: "get"
  })
}
// FBA仓库管理_更新
export function saveFBAWarehouseApi(data) {
  return request({
    url: data.id ? `/api/ovl-service/ovl/fba/warehouse/${data.id}` : `/api/ovl-service/ovl/fba/warehouse`,
    method: data.id ? "put" : 'post',
    data
  })
}
// FBA仓库管理_删除
export function delFBAWarehouseApi(id) {
  return request({
    url: `/api/ovl-service/ovl/fba/warehouse/${id}`,
    method: "delete"
  })
}
// FBA仓库管理_批量导入
export function exportFBAWarehouseApi(data) {
  return request({
    url: `/api/ovl-service/ovl/fba/warehouse/import`,
    method: "post",
    data
  })
}
