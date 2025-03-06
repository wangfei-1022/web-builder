import i18n from '../lang' // Internationalization

export const logServiceName = {
  SEA_SERVICE: 'sea-service',
  AIR_SERVICE: 'air-service',
  OVL_SERVICE: 'ovl-service'
}

export const logOrigin = {
  SYSTEM_OPERATION: 1, // 系统操作
  LOGISTICS_LINKS: 2 // 物流环节
}

export const airLogBusinessType = {
  MAKING_CARGO_PLAN: 'air_lg_001', // 配舱
  INBOUND: 'air_lg_002', // 入仓
  BOOKING_CONFIRMATION: 'air_lg_003', // 订舱确认
  TAKE_OFF: 'air_lg_004', // 起飞
  ARRIVAL_AT_PORT: 'air_lg_005', // 到港
  ORDER_MODIFY: 'air_sys_001', // 订单调整
  TO_MATCH: 'air_sys_002' // 配舱
}

export const seaLogBusinessType = {
  PRODUCT_PRICE_CARD_QUERY: 'sea_sys_004' // 海运运价查询
}

export const priceCardTypes = [{
  code: 10,
  name: i18n.t('common.priceCardType.COST')
}, {
  code: 11,
  name: i18n.t('common.priceCardType.GUIDE')
}, {
  code: 12,
  name: i18n.t('common.priceCardType.LOWER')
}]

export const priceCardCustomerTypes = [{
  code: 13,
  name: i18n.t('common.priceCardType.CUSTOMER')
}]

export const priceCardStatusMap = {
  DRAFT: 10, // 草稿
  SUBMIT: 20, // 已提交
  PUBLISH: 30, // 发布中
  PUBLISH_SUCCESS_INIT: 31, // 发布成功待上线
  PUBLISH_SUCCESS: 32, // 发布成功已上线
  PUBLISH_FAILED: 33, // 发布失败
  EXPIRE_INVALID: 41, // 过期下线
  FORCE_INVALID: 42 // 强制下线
}

export const contractTypeMap = {
  RECEIPT_CONTRACT: 1, // 收款合同
  PAYMENT_CONTRACT: 2, // 付款合同
  RECEIPT_TRIAL_CONTRACT: 3, // 试单合同
  RECEIPT_RECEIVE_PIECE_CONTRACT: 10, // 收款票结合同
  RECEIPT_PAYMENT_PIECE_CONTRACT: 20 // 付款票结合同
}

// 发票类型
export const invoiceTypeMap = {
  TAX_SPECIAL_RECEIPT: 1, // 增值税专用发票
  TAX_RECEIPT: 2, // 增值税普通发票
  COMMERCIAL_INVOICE: 3 // 形式发票
}

// 发票类型
export const invoiceTypeList = [{
  code: 1,
  name: '增值税专用发票 '
}, {
  code: 2,
  name: '增值税普通发票 '
}, {
  code: 3,
  name: '形式发票'
}]

// 发票材质
export const invoiceMaterialTypeMap = {
  ELECTRONIC: 2, // 电子
  PACKING_LIST: 'PACKING_LIST', // 扫描件
  PAPER: 1 // 纸质
}

// 发票材质
export const invoiceMaterialTypeList = [{
  code: 2,
  name: '电子'
}, {
  code: 'PACKING_LIST',
  name: '扫描件'
}, {
  code: 1,
  name: '纸质'
}]


export const currencyAymbol = {
  CNY: '¥', // 人民币
  HKD: 'HK$', // 港币
  EUR: '€', // 欧元
  USD: '$', // 美元
  GBP: '£', // 英镑
  AUD: '$' // 澳元
}
// 海外仓 按钮埋点CODE
export const pointOvl = {
  // 盘点管理
  OVL_TAKE_STOCK_EXPORT: 'ovl_take_stock_export', // 导出
  OVL_TAKE_STOCK_BATCH_UPDATE: 'ovl_take_stock_batch_update', // 批量更新
  OVL_TAKE_STOCK_SUBMIT: 'ovl_take_stock_submit', // 提交盘点
  // 出库任务
  OVL_OUTBOUND_TASK_CONFIRM: 'ovl_outbound_task_confirm', // 出库任务回调隆基
  OVL_OUTBOUND_TASK_VERIFY: 'ovl_outbound_task_verify', // 出库任务确认
  OVL_OUTBOUND_TASK_SAVE_DRAFT: ' ovl_outbound_task_save_draft', // 出库任务确认
  // 入库任务列表
  OVL_INBOUND_TASK_BATCH_UPDATE: 'ovl_inbound_task_batch_update', // 入库任务批量更新
  OVL_INBOUND_TASK_EXPORT: 'ovl_inbound_task_export', // 入库任务导出
  // 提单集装箱明细
  OVL_INBOUND_BL_IMPORT: 'ovl_inbound_bl_import', // 提单集装箱导入
  OVL_INBOUND_BL_PUSH: 'ovl_inbound_bl_push', // 提单集装箱推送
  // 出库管理-一单多件
  OVL_INBOUND_MERGE_PACK_EXPORT: 'ovl_outbound_merge_pack_export', // 一单多件导出
  OVL_INBOUND_MERGE_PACK_EXPRESS_SHEET_IMPORT: 'ovl_outbound_merge_pack_express_sheet_import', // 一单多件导入快递单号
  OVL_INBOUND_MERGE_PACK_ORDER_EXPORT: 'ovl_outbound_merge_pack_order_export', // 一单多件面单（订单号）导出
  OVL_INBOUND_MERGE_PACK_EXPRESS_SHEET_EXPORT: 'ovl_outbound_merge_pack_express_sheet_export' // 一单多件面单（快递单号）导出
}


// 第三类订单分类
export const ThirdBusinessGroup = {
    RAIL_BUSINESS: 'RAIL_BUSINESS', // 铁路业务
    ROAD_TRANSPORT: 'ROAD_TRANSPORT', // 公路业务
    OVERSEAS_WAREHOUSE: 'OVERSEAS_WAREHOUSE', // 海外仓配
    DOMESTIC_TRADE: 'DOMESTIC_TRADE', // 内贸业务
    INTEGRATED_SERVICE: 'INTEGRATED_SERVICE', // 综合业务
}