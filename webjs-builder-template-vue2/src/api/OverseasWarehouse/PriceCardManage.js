import request from '@/utils/request'


/**
 * 物流产品价卡列表
 * @returns {*}
 */

export function getPriceCardsListApi(params) {
  return request({
    url: `/api/trans-service/omc/lnt/products/priceCards/pages`,
    method: 'get',
    params
  })
}
/**
 * 渠道价卡列表
 * @returns {*}
 */

export function getChannelsPriceCardsListApi(params) {
  return request({
    url: `/api/trans-service/omc/lnt/products/channels/priceCards/pages`,
    method: 'get',
    params
  })
}
/**
 * 新增基础信息-快递-成本
 * @returns {*}
 */

export function saveBaseFormApi(data) {
  return request({
    url: `/api/trans-service/omc/lnt/products/express/priceCards/costCards`,
    method: 'post',
    data
  })
}
/**
 * 新增基础信息-FBA卡车-成本
 * @returns {*}
 */

export function saveTruckBaseFormApi(data) {
  return request({
    url: `/api/trans-service/omc/lnt/products/truck/priceCards/costCards`,
    method: 'post',
    data
  })
}
/**
 * 查询详情接口-快递
 * @returns {*}
 */

export function detailPriceCardsApi(cardId) {
  return request({
    url: `/api/trans-service/omc/lnt/products/express/priceCards/${cardId}`,
    method: 'get'
  })
}
/**
 * 查询详情接口-FBA卡车-成本
 * @param {*} cardId
 * @returns
 */

export function detailtruckPriceCardsApi(cardId) {
  return request({
    url: `/api/trans-service/omc/lnt/products/truck/priceCards/costCards/${cardId}`,
    method: 'get'
  })
}
/**
 * 查询详情接口-FBA卡车-非成本
 * @param {*} cardId
 * @returns
 */

export function detailtruckNotCostCardsApi(cardId) {
  return request({
    url: `/api/trans-service/omc/lnt/products/truck/priceCards/notCostCards/${cardId}`,
    method: 'get'
  })
}
/**
 *根据产品Id生成导入模板文件接口-快递
 * @returns {*}
 */

export function expressImportExcelApi(productId) {
  return request({
    url: `/api/trans-service/omc/lnt/products/${productId}/express/priceCards/costCards/deliveryCharges/importExcel/template`,
    method: 'get'
  })
}
/**
 *派送费-导入解析接口-卡车
 * @returns {*}
 */

export function expressTruckImportExcelApi(productId) {
  return request({
    url: `/api/trans-service/omc/lnt/products/truck/priceCards/costCards/importExcel/template`,
    method: 'get',
    params: { productId }
  })
}

/**
 *根据系数等参数计算分区价格接口-快递
 * @returns {*}
 */

export function deliveryChargesWithCoefficientApi(data, baseCardId, cardType) {
  return request({
    url: `/api/trans-service/omc/lnt/products/express/priceCards/${baseCardId}/${cardType}/deliveryCharges/withCoefficient`,
    method: 'post',
    data
  })
}
/**
 *根据系数等参数计算分区价格接口-卡车
 * @returns {*}
 */

export function deliveryTruckChargesWithCoefficientApi(data, baseCardId, cardType) {
  return request({
    url: `/api/trans-service/omc/lnt/products/truck/priceCards/${baseCardId}/${cardType}/deliveryCharges/withCoefficient`,
    method: 'post',
    data
  })
}
/**
 *编辑保存草稿接口-快递
 * @returns {*}
 */

export function saveDraftPriceCardsApi(data) {
  return request({
    url: `/api/trans-service/omc/lnt/products/express/priceCards/${data.id}/draft`,
    method: 'put',
    data
  })
}
/**
 *编辑保存草稿接口-卡车
 * @returns {*}
 */

export function saveDraftTruckPriceCardsApi(data) {
  return request({
    url: `/api/trans-service/omc/lnt/products/truck/priceCards/costCards/${data.id}/draft`,
    method: 'put',
    data
  })
}
/**
 *提交保存接口-快递
 * @returns {*}
 */

export function submitPriceCardsApi(data) {
  return request({
    url: `/api/trans-service/omc/lnt/products/express/priceCards/${data.id}`,
    method: 'put',
    data
  })
}
/**
 *提交保存接口-卡车
 * @returns {*}
 */

export function submitTruckPriceCardsApi(data) {
  return request({
    url: `/api/trans-service/omc/lnt/products/truck/priceCards/costCards/${data.id}/submit`,
    method: 'put',
    data
  })
}

/**
 *通过物流产品获取渠道价卡
 * @returns {*}
 */

export function getPriceCardsOfChannelApi(params) {
  return request({
    url: `/api/trans-service/omc/lnt/products/${params.productId}/priceCards/${params.cardType}`,
    method: 'get'
  })
}

/**
 *客户价卡列表
 * @returns {*}
 */

export function getPriceCardsOfCustomerApi(params) {
  return request({
    url: `/api/trans-service/omc/lnt/products/priceCardsOfCustomer/pages`,
    method: 'get',
    params
  })
}
/**
 *非成本新增基础信息-快递
 * @returns {*}
 */

export function saveNotCostCards(data) {
  return request({
    url: `/api/trans-service/omc/lnt/products/express/priceCards/${data.associatedPriceCardId}/notCostCards`,
    method: 'post',
    data
  })
}
/**
 *非成本新增基础信息-卡车
 * @returns {*}
 */

export function saveTruckNotCostCards(data) {
  return request({
    url: `/api/trans-service/omc/lnt/products/truck/priceCards/notCostCards`,
    method: 'post',
    data
  })
}

/**
 *获取FBA仓库列表
 * @returns {*}
 */

export function getFBAWarehouseApi(params) {
  return request({
    url: `/api/ovl-service/ovl/fba/warehouse/selections`,
    method: 'get',
    params
  })
}

/**
 *获取FBA仓库列表
 * @returns {*}
 */

export function getAreaListByProductIdApi(productId) {
  return request({
    url: `/api/trans-service/omc/lnt/area/scheme/areaList/byProductId/${productId}`,
    method: 'get'
  })
}
/**
 *获取FBA仓库列表
 * @returns {*}
 */

export function getWarehouseApi(productId) {
  return request({
    url: `/api/trans-service/warehouse/selections`,
    method: 'get'
  })
}
/**
 *客户价卡详情-卡车
 * @returns {*}
 */

export function detailTruckPriceCardsOfCustomer(cardId) {
  return request({
    url: `/api/trans-service/omc/lnt/products/truck/priceCards/priceCardsOfCustomer/${cardId}`,
    method: 'get'
  })
}
/**
 *客户价卡详情-快递
 * @returns {*}
 */

export function detailPriceCardsOfCustomer(cardId) {
  return request({
    url: `/api/trans-service/omc/lnt/products/express/priceCardsOfCustomer/${cardId}`,
    method: 'get'
  })
}
/**
 *客户价卡编辑草稿-快递
 * @returns {*}
 */

export function saveDraftPriceCardsOfCustomer(data) {
  return request({
    url: `/api/trans-service/omc/lnt/products/express/priceCardsOfCustomer/${data.id}/draft`,
    method: 'put',
    data
  })
}
/**
 *客户价卡编辑草稿-卡车
 * @returns {*}
 */

export function saveDraftTruckPriceCardsOfCustomer(data) {
  return request({
    url: `/api/trans-service/omc/lnt/products/truck/priceCards/notCostCards/${data.id}/draft`,
    method: 'put',
    data
  })
}
/**
 *客户价卡编辑提交-快递
 * @returns {*}
 */

export function submitPriceCardsOfCustomer(data) {
  return request({
    url: `/api/trans-service/omc/lnt/products/express/priceCardsOfCustomer/${data.id}`,
    method: 'put',
    data
  })
}
/**
 *客户价卡编辑提交-卡车
 * @returns {*}
 */

export function submitTruckPriceCardsOfCustomer(data) {
  return request({
    url: `/api/trans-service/omc/lnt/products/truck/priceCards/notCostCards/${data.id}/submit`,
    method: 'put',
    data
  })
}
/**
 *客户价卡编辑提交-卡车
 * @returns {*}
 */

export function getPriceCardsSummaryApi(cardId) {
  return request({
    url: `/api/trans-service/omc/lnt/products/truck/priceCards/${cardId}/summary/info`,
    method: 'get'
  })
}
/**
 *客户价卡新增基础信息-卡车
 * @returns {*}
 */

export function saveTruckPriceCards(data) {
  return request({
    url: `/api/trans-service/omc/lnt/products/truck/priceCards/priceCardsOfCustomer`,
    method: 'post',
    data
  })
}

/**
 *成本价卡发布-快递
 * @returns {*}
 */

export function publishCostPriceCard(cardId) {
  return request({
    url: `/api/trans-service/omc/lnt/price/card/publish/${cardId}`,
    method: 'put'
  })
}
/**
 *成本价卡发布-卡车
 * @returns {*}
 */

export function publishTruckCostPriceCard(cardId) {
  return request({
    url: `/api/trans-service/omc/lnt/price/card/truck/publish/${cardId}`,
    method: 'put'
  })
}

//
/**
 *根据产品获取价卡有效期匹配的旺季和费率
 * @returns {*}
 */

export function getPssAndFuelApi(params) {
  return request({
    url: `/api/trans-service/omc/lnt/products/express/priceCards/pssAndFuel/byProduct`,
    method: 'get',
    params
  })
}

/**
 * 价卡删除
 */
export function delPriceCard(id) {
  return request({
    url: `/api/trans-service/omc/lnt/products/express/priceCards/${id}`,
    method: 'delete'
  })
}

/**
 * 根据渠道获取相关价卡
 */
export function getChannelPriceCardApi(params) {
  return request({
    url: `/api/trans-service/omc/lnt/channel/${params.channelId}/priceCards/${params.cardType}`,
    method: 'get'
  })
}
/**
 * 渠道成本价卡复制
 */
export function copyChannelPriceCardApi(data) {
  return request({
    url: `/api/trans-service/omc/lnt/priceCards/copy`,
    method: 'post',
    data
  })
}
/**
 * 渠道客户价卡复制
 */
export function copyCustomerPriceCardApi(data) {
  return request({
    url: `/api/trans-service/omc/lnt/priceCards/customer/copy`,
    method: 'post',
    data
  })
}
/**
 * 价卡-价卡名称是否已经存在
 */
export function existsPriceCardNameApi(params) {
  return request({
    url: `/api/trans-service/omc/lnt/priceCards/priceCardName/exists`,
    method: 'get',
    params
  })
}
/**
 * 价卡-境内运输/价卡-延期
 */
export function postponeChannelPriceCardApi(data) {
  return request({
    url: `/api/trans-service/omc/lnt/products/express/priceCards/costCards/postpone/${data.cardId}/${data.expireTime}`,
    method: 'put'
  })
}
