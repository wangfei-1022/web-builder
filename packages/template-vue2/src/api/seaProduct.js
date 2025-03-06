import request from '@/utils/request'

// 获取订单列表
export function getSeaProductSubscriptionListApi(params) {
  return request({
    url: `/api/sea-service/sea/product/subscription/pages`,
    method: 'get',
    params
  })
}

// 获取订单详情
export function getSeaProductSubscriptionDetailApi(orderId) {
  return request({
    url: `/api/sea-service/sea/product/subscription/detail/${orderId}`,
    method: 'get'
  })
}

// 新增订阅
export function saveSeaProductSubscriptionApi(data) {
  return request({
    url: `/api/sea-service/sea/product/subscription`,
    method: 'post',
    data
  })
}

// 修改订阅
export function editSeaProductSubscriptionApi(orderId, data) {
  return request({
    url: `/api/sea-service/sea/product/subscription/${orderId}`,
    method: 'put',
    data
  })
}

// 取消报价
export function unsubscribeSeaProductSubscriptionApi(orderId) {
  return request({
    url: `/api/sea-service/sea/product/subscription/unsubscribe/${orderId}`,
    method: 'put'
  })
}

//
export function seaportlistAllAPi() {
  return request({
    url: `/api/mdm-service/dmn/seaportlistAll`,
    method: 'get'
  })
}

// 获取海运运费成本价卡列表
export function getSeaProductPriceCardListApi(params) {
  return request({
    url: `/api/sea-service/sea/product/price/card/pages`,
    method: 'get',
    params
  })
}

// 获取海运运费成本价卡管理列表
export function getSeaProductPriceCardManageListApi(params) {
  return request({
    url: `/api/sea-service/sea/product/price/card/managePages`,
    method: 'get',
    params
  })
}

// 根据成本价卡id查询船期列表
export function getSailScheduleDetailListByPriceCardApi(priceCard) {
  return request({
    url: `/api/sea-service/sea/product/sail/schedule/detailListByPriceCard/${priceCard}`,
    method: 'get'
  })
}

// 运价费用明细
export function getPriceCardChargesDetailListApi(id) {
  return request({
    url: `/api/sea-service/sea/product/price/card/chargesDetailList/${id}`,
    method: 'get'
  })
}

// 成本价卡模板类目列表
export function getPriceCardTemplateApi(params) {
  return request({
    url: `/api/sea-service/sea/product/price/card/freightPriceCardTemplate`,
    method: 'get',
    params
  })
}
// 新增成本价卡
export function saveSeatPriceCardApi(data) {
  return request({
    url: `/api/sea-service/sea/product/price/card`,
    method: 'post',
    data
  })
}
// 获取订单详情
export function getSeatPriceCardDetailApi(orderId) {
  return request({
    url: `/api/sea-service/sea/product/price/card/detail/${orderId}`,
    method: 'get'
  })
}

// 修改成本价卡
export function editSeatPriceCardApi(orderId, data) {
  return request({
    url: `/api/sea-service/sea/product/price/card/${orderId}`,
    method: 'put',
    data
  })
}

// 上架
export function upShelfSeatPriceCardApi(orderId) {
  return request({
    url: `/api/sea-service/sea/product/price/card/upShelf/${orderId}`,
    method: 'put'
  })
}

// 批量上架
export function batchUpShelfSeatPriceCardApi(data) {
  return request({
    url: `/api/sea-service/sea/product/price/card/batchUpShelf`,
    method: 'put',
    data: data.ids
  })
}

// 下架
export function downShelfSeatPriceCardApi(orderId) {
  return request({
    url: `/api/sea-service/sea/product/price/card/downShelf/${orderId}`,
    method: 'put'
  })
}

// 删除
export function deletePriceCardApi(orderId) {
  return request({
    url: `/api/sea-service/sea/product/price/card/${orderId}`,
    method: 'delete'
  })
}

// 批量删除
export function batchDeletePriceCardApi(data) {
  return request({
    url: `/api/sea-service/sea/product/price/card/batchDelete`,
    method: 'delete',
    data
  })
}

// 延期
export function extensionPriceCardApi(orderId, data) {
  return request({
    url: `/api/sea-service/sea/product/price/card/extension/${orderId}`,
    method: 'put',
    data
  })
}

// 修改失效日期
export function batchEfficacyPriceCardApi(data) {
  return request({
    url: `/api/sea-service/sea/product/price/card/batchEfficacy`,
    method: 'put',
    data
  })
}


// 导入海运费成本价卡
export function importPriceCardApi(data) {
  return request({
    url: `/api/sea-service/sea/product/price/card/import`,
    method: 'post',
    data
  })
}

// 校验价卡有效期,是否可以下一步
export function checkValiditySeatPriceCardApi(params) {
  return request({
    url: `/api/sea-service/sea/product/price/card/checkValidity`,
    method: 'get',
    params
  })
}

// 海运产品线路

// 获取订单列表
export function getSeaProductLineListApi(params) {
  return request({
    url: `/api/sea-service/sea/product/line/pages`,
    method: 'get',
    params
  })
}

// 获取订单详情
export function getSeaProductLineDetailApi(orderId) {
  return request({
    url: `/api/sea-service/sea/product/line/detail/${orderId}`,
    method: 'get'
  })
}

// 新增
export function saveSeaProductLineApi(data) {
  return request({
    url: `/api/sea-service/sea/product/line`,
    method: 'post',
    data
  })
}

// 修改
export function editSeaProductLineApi(orderId, data) {
  return request({
    url: `/api/sea-service/sea/product/line/${orderId}`,
    method: 'put',
    data
  })
}

// 上架
export function upShelfSeaProductLineApi(orderId) {
  return request({
    url: `/api/sea-service/sea/product/line/upShelf/${orderId}`,
    method: 'put'
  })
}

// 下架
export function downShelfSeaProductLineApi(orderId) {
  return request({
    url: `/api/sea-service/sea/product/line/downShelf/${orderId}`,
    method: 'put'
  })
}

// 海运产品线路end

// 海运船期start
// 获取订单列表
export function getSeaProductSailScheduleListApi(params) {
  return request({
    url: `/api/sea-service/sea/product/sail/schedule/pages`,
    method: 'get',
    params
  })
}

// 获取订单详情
export function getSeaProductSailScheduleDetailApi(orderId) {
  return request({
    url: `/api/sea-service/sea/product/sail/schedule/detail/${orderId}`,
    method: 'get'
  })
}

// 新增
export function saveSeaProductSailScheduleApi(data) {
  return request({
    url: `/api/sea-service/sea/product/sail/schedule`,
    method: 'post',
    data
  })
}

// 修改
export function editSeaProductSailScheduleApi(orderId, data) {
  return request({
    url: `/api/sea-service/sea/product/sail/schedule/${orderId}`,
    method: 'put',
    data
  })
}

// 上架
export function upShelfSeaProductSailScheduleApi(orderId) {
  return request({
    url: `/api/sea-service/sea/product/sail/schedule/upShelf/${orderId}`,
    method: 'put'
  })
}

// 下架
export function downShelfSeaProductSailScheduleApi(orderId) {
  return request({
    url: `/api/sea-service/sea/product/sail/schedule/downShelf/${orderId}`,
    method: 'put'
  })
}
// 海运船期end

// 海运附加费start
// 获取订单列表
export function getSeaProductExtraPriceCardListApi(params) {
  return request({
    url: `/api/sea-service/sea/product/extra/price/card/pages`,
    method: 'get',
    params
  })
}

// 附加费成本价卡模板类目列表
export function getExtraPriceCardTemplateApi(params) {
  return request({
    url: `/api/sea-service/sea/product/extra/price/card/additionalPriceCardTemplate`,
    method: 'get',
    params
  })
}
// 附加费新增成本价卡
export function saveSeaExtraPriceCardApi(data) {
  return request({
    url: `/api/sea-service/sea/product/extra/price/card`,
    method: 'post',
    data
  })
}
// 附加费获取订单详情
export function getSeaExtraPriceCardDetailApi(orderId) {
  return request({
    url: `/api/sea-service/sea/product/extra/price/card/detailForManage/${orderId}`,
    method: 'get'
  })
}

// 附加费修改成本价卡
export function editSeaExtraPriceCardApi(orderId, data) {
  return request({
    url: `/api/sea-service/sea/product/extra/price/card/${orderId}`,
    method: 'put',
    data
  })
}

// 附加费上架
export function upShelfSeaExtraPriceCardApi(orderId) {
  return request({
    url: `/api/sea-service/sea/product/extra/price/card/upShelf/${orderId}`,
    method: 'put'
  })
}

// 附加费下架
export function downShelfSeaExtraPriceCardApi(orderId) {
  return request({
    url: `/api/sea-service/sea/product/extra/price/card/downShelf/${orderId}`,
    method: 'put'
  })
}

// 校验价卡有效期,是否可以下一步
export function checkValiditySeaExtraPriceCardApi(params) {
  return request({
    url: `/api/sea-service/sea/product/extra/price/card/checkValidity`,
    method: 'get',
    params
  })
}
// 运价费用明细（船司合约价）
export function getChargesDetailSeaExtraPriceCardApi(productPriceId) {
  return request({
    url: `/api/sea-service/sea/product/extra/price/card/chargesDetailList/${productPriceId}`,
    method: 'get'
  })
}

// 海运附加费end
