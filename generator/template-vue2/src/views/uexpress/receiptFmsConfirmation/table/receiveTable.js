export default {
  defaultFlag: true,
  moduleName: '应收费用确认单',
  moduleCode: 'RECEIVE_CONFIRMATION_PAGE',
  schemeName: '默认表头',
  schemeContent: [{
    field: 'index',
    headerNameKey: '',
    width: 55,
    pinned: 'left',
    suppressSorting: true,
    checkboxSelection: true,
    suppressMenu: true,
    suppressSizeToFit: true,
    suppressResize: true,
    headerCheckboxSelection: true
  }, {
    field: "confirmationNo",
    headerNameKey: "uexpressFmsConfirmation.serial_no",
    width: 150
  }, {
    field: "orderNo",
    headerNameKey: "uexpressFmsConfirmation.orderNo",
    width: 150
  }, {
    field: "channelOrderNo",
    headerNameKey: "uexpressFmsConfirmation.channelOrderNo",
    width: 150
  }, {
    field: "memberOrderNo",
    headerNameKey: "uexpressFmsConfirmation.memberOrderNo",
    width: 100
  }, {
    field: "memberName",
    headerNameKey: "uexpressFmsConfirmation.customer_name",
    width: 130
  }, {
    field: "settlementModeName",
    headerNameKey: "uexpressFmsConfirmation.settlement_mode",
    width: 100
  }, {
    field: "confirmationTypeName",
    headerNameKey: "uexpressFmsConfirmation.confirmationType",
    width: 100
  }, {
    field: "receiptAmount", // 应收金额
    headerNameKey: "uexpressFmsConfirmation.receiptAmount",
    type: 'numericColumn',
    width: 100
  }, {
    field: "currency", // 应收币种
    headerNameKey: "uexpressFmsConfirmation.currency",
    width: 100
  }, {
    field: "entryStateName",
    headerNameKey: "uexpressFmsConfirmation.bill_status",
    width: 100
  }, {
    field: "confirmationStateName",
    headerNameKey: "uexpressFmsConfirmation.confirmation_state",
    width: 130
  }, {
    field: "clearStateName",
    headerNameKey: "uexpressFmsConfirmation.clear_status",
    width: 90
  }, {
    field: "chargeWeight", // 计费重（kg）
    headerNameKey: "uexpressFmsConfirmation.chargeWeight",
    width: 100
  }, {
    field: "weight", // 实重（kg）
    headerNameKey: "uexpressFmsConfirmation.weight",
    width: 90
  }, {
    field: "dimension", // 长宽高（CM）
    headerNameKey: "uexpressFmsConfirmation.dimension",
    width: 120
  }, {
    field: "volumeWeight", // 体积重（kg）
    headerNameKey: "uexpressFmsConfirmation.volumeWeight",
    width: 90
  }, {
    field: "volumeWeightRate", // 计抛系数
    headerNameKey: "uexpressFmsConfirmation.volumeWeightRate",
    width: 90
  }, {
    field: "declaredValue", // 申报价值
    headerNameKey: "uexpressFmsConfirmation.declaredValue",
    width: 90
  }, {
    field: "declaredCurrency", // 申报币种
    headerNameKey: "uexpressFmsConfirmation.currency",
    width: 90
  }, {
    field: "billNo", // 账单编号
    headerNameKey: "uexpressFmsConfirmation.billNo",
    width: 90
  }, {
    field: "createByName", // 提交人
    headerNameKey: "uexpressFmsConfirmation.submitByName",
    width: 150
  }, {
    field: "createTime", // 提交时间
    headerNameKey: "uexpressFmsConfirmation.submitTime",
    width: 150
  }, {
    field: "inboundTime", // 入库时间
    headerNameKey: "uexpressFmsConfirmation.inboundTime",
    width: 150
  }, {
    field: "outboundTime", // 出库时间
    headerNameKey: "uexpressFmsConfirmation.outboundTime",
    width: 150
  }, {
    field: "orderTime", // 下单时间
    headerNameKey: "uexpressFmsConfirmation.orderTime",
    width: 150
  }, {
    field: "lastMileCollectDateTime", // 尾程已揽收时间
    headerNameKey: "uexpressFmsConfirmation.lastMileCollectDateTime",
    width: 150
  }, {
    field: "payTime", // 赔付时间
    headerNameKey: "uexpressFmsConfirmation.payTime",
    width: 150
  }, {
    field: "offsetTime", // 抵扣时间
    headerNameKey: "uexpressFmsConfirmation.offsetTime",
    width: 150
  }, {
    field: "productName", // 产品名称
    headerNameKey: "uexpressFmsConfirmation.productName",
    width: 150
  }, {
    field: "productTypeName", // 业务类型
    headerNameKey: "uexpressFmsConfirmation.productType",
    width: 120
  }, {
    field: "countryName", // 目的地
    headerNameKey: "uexpressFmsConfirmation.countryCode",
    width: 120
  }, {
    field: "salesName", // 所属销售
    headerNameKey: "uexpressFmsConfirmation.sales_names",
    width: 90
  }, {
    field: "optionBtn",
    headerNameKey: "uexpressFmsConfirmation.operation",
    cellRendererFramework: "UExpressOptionBtnConfirmation",
    pinned: 'right',
    width: 180
  }]
}

