import request from '@/utils/request'


/**
 * 仓库-价卡-价卡类型下拉接口
 * @returns {*}
 */
export function getPriceCardsSelectionsApi() {
  return request({
    url: `/api/ovl-service/omc/ovl/priceCards/selections`,
    method: 'get'
  })
}
/**
 * 仓库-价卡-价卡状态下拉接口
 * @returns {*}
 */
export function getPriceCardsStatusApi() {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/priceCards/statuses`,
    method: 'get'
  })
}

/**
 * 验证名字是否重复
 * @returns {*}
 */
export function checkCardNameExists(params) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/priceCards/priceCardName/exists`,
    method: 'get',
    params
  })
}

/**
 * 仓库-价卡-价卡类型下拉接口
 * @returns {*}
 */
export function getWarehouseSelectionsApi() {
  return request({
    url: `/api/ovl-service/warehouse/selections`,
    method: 'get'
  })
}

/**
 * 价卡新增基础信息
 * @returns {*}
 */
export function priceCardsBaseInfoApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/priceCards`,
    method: 'post',
    data
  })
}

/**
 * 最低价格 && 指导价 价卡新增基础信息
 * @returns {*}
 */
export function basePriceCardsBaseInfoApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/priceCards/notCostCards`,
    method: 'post',
    data
  })
}

/**
 * 仓库成本价卡详情
 * @returns {*}
 */
export function getWarehouseCostPriceCardsDetailApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/priceCards/costCards/${id}`,
    method: 'get'
  })
}

/**
 * 仓库最低/指导价卡详情
 * @returns {*}
 */
export function getWarehouseNotCostPriceCardsDetailApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/priceCards/notCostCards/${id}`,
    method: 'get'
  })
}

/**
 * 仓库客户价卡详情
 * @returns {*}
 */
export function getWarehouseCustomerPriceCardsDetailApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/priceCardOfCustomers/${id}`,
    method: 'get'
  })
}


/**
 * 保存草稿 成本价卡
 * @returns {*}
 */
export function updateDraftCostPriceCardsBaseInfoApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/priceCards/costCards/${data.id}/draft`,
    method: 'put',
    data
  })
}

/**
 * 提交 成本价卡
 * @returns {*}
 */
export function updateSubmitCostPriceCardsBaseInfoApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/priceCards/costCards/${data.id}/submit`,
    method: 'put',
    data
  })
}


/**
 * 保存草稿 指导/最低价卡
 * @returns {*}
 */
export function updateDraftNotCostPriceCardsBaseInfoApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/priceCards/notCostCards/${data.id}/draft`,
    method: 'put',
    data
  })
}

/**
 * 提交 指导/最低价卡
 * @returns {*}
 */
export function updateSubmitNotCostPriceCardsBaseInfoApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/priceCards/notCostCards/${data.id}/submit`,
    method: 'put',
    data
  })
}


/**
 * 保存草稿 客户价卡
 * @returns {*}
 */
export function updateDraftCustomerPriceCardsBaseInfoApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/priceCardOfCustomers/${data.id}/draft`,
    method: 'put',
    data
  })
}

/**
 * 提交 客户价卡
 * @returns {*}
 */
export function updateSubmitCustomerPriceCardsBaseInfoApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/priceCardOfCustomers/${data.id}/submit`,
    method: 'put',
    data
  })
}


/**
 * 仓库价卡列表
 * @returns {*}
 */
export function getWarehousePriceCardsListApi(params) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/priceCards/pages`,
    method: 'get',
    params
  })
}

/**
 * 获取可构造仓库价卡列表
 * @returns {*}
 */
export function getWarehousePriceCardsTypeListApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/priceCards/${data.warehouseId}/${data.cardType}/baseInfo/list`,
    method: 'get'
  })
}

/**
 * 客户-获取可构造仓库价卡列表
 * @returns {*}
 */
export function getWarehouseCustomerPriceCardsTypeListApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/priceCardOfCustomers/warehouse/${data.warehouseId}/baseInfo/list`,
    method: 'get'
  })
}

/**
 * 复制 成本价卡新增基础信息
 * @returns {*}
 */
export function copyAddCostPriceCardsBaseInfoApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/priceCards/costCards/copy`,
    method: 'post',
    data
  })
}

/**
 * 复制 指导/最低价卡新增基础信息
 * @returns {*}
 */
export function copyAddNotCostPriceCardsBaseInfoApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/priceCards/notCostCards/copy`,
    method: 'post',
    data
  })
}

/**
 * 客户价卡查询列表
 * @returns {*}
 */
export function getCustomerCostPriceCardsListApi(params) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/priceCardOfCustomers/pages`,
    method: 'get',
    params
  })
}

/**
 * 客户价卡新增基础信息
 * @returns {*}
 */
export function customerPriceCardsBaseInfoApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/priceCardOfCustomers`,
    method: 'post',
    data
  })
}

/**
 *价卡发布-仓库
 * @returns {*}
 */

export function publishWarehouseCostPriceCard(cardId) {
  return request({
    url: `/api/ovl-service/omc/ovl/price/card/publish/${cardId}`,
    method: 'put'
  })
}
/**
 * 价卡删除
 */
export function delWarehouseCostPriceCard(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/priceCards/${id}`,
    method: 'delete'
  })
}
/**
 * 仓库-客户价卡-复制新增基础信息
 */
export function copyWarehouseCustomerPriceCardApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/priceCardOfCustomers/copy`,
    method: 'post',
    data
  })
}
/**
 * 仓库-客户价卡-仓库客户价卡延期
 */
export function postponeWarehousePriceCardApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/priceCardOfCustomers/postpone/${data.cardId}/${data.expireTime}`,
    method: 'put',
    data
  })
}
/**
 * 仓库-客户价卡-判断仓库是否增加计泡系数
 */
export function getWarehouseTempTypeApi(warehouseId) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/priceCard/template/${warehouseId}`,
    method: 'get'
  })
}
