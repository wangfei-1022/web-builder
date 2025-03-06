export default {
  defaultFlag: true,
  moduleName: '小包业务-订单列表',
  moduleCode: 'UEXPRESS_ORDER_PAGE',
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
  },
  {
    field: "orderNo",
    headerNameKey: "uexpressOrder.orderNo",
    width: 160,
    cellRendererFramework: "OrderNoComponent"
  },
  {
    field: "orderChannelNo",
    headerNameKey: "uexpressOrder.orderChannelNo",
    width: 140,
    cellRendererFramework: "OrderChannelNoComponent"
  },
  {
    field: "memberOrderNo",
    headerNameKey: "uexpressOrder.memberOrderNo",
    width: 160,
    cellRendererFramework: "MemberOrderNoComponent"
  },
  {
    field: "orderStateName",
    headerNameKey: "uexpressOrder.orderStateName",
    width: 120
  },
  {
    field: "OrderAmount",
    headerNameKey: "uexpressOrder.orderAmount",
    width: 120,
    type: 'numericColumn',
    cellRendererFramework: "OrderAmount"
  },
  {
    field: "customerName",
    headerNameKey: "uexpressOrder.customerName",
    width: 120
  },
  {
    field: "productName",
    headerNameKey: "uexpressOrder.productName",
    width: 150
  },
  {
    field: "consigneeCountryName",
    headerNameKey: "uexpressOrder.destinationAreaName",
    width: 120
  },
  {
    field: "channelName",
    headerNameKey: "uexpressOrder.channelName",
    width: 120
  },
  {
    field: "channelSupplierName",
    headerNameKey: "uexpressOrder.channelSupplierName",
    width: 120
  },
  {
    field: "salesSettlementStateName",
    headerNameKey: "uexpressOrder.salesSettlementStateName",
    width: 120
  },
  {
    field: "exceptionFlagStr",
    headerNameKey: "uexpressOrder.exceptionFlag",
    width: 100
  },
  {
    field: "abnormalTypeName",
    headerNameKey: "uexpressOrder.channelPushFailMessage",
    width: 120
  },
  {
    field: "redeliveryFlagStr",
    headerNameKey: "uexpressOrder.redeliveryFlag",
    width: 100
  },
  {
    field: "sourceChannelOrderNo",
    headerNameKey: "uexpressOrder.sourceChannelOrderNo",
    width: 120
  },
  {
    field: "previousChannelOrderNo",
    headerNameKey: "uexpressOrder.previousChannelOrderNo",
    width: 120
  },
  {
    field: "channelPushStateName",
    headerNameKey: "uexpressOrder.channelPushStateName",
    width: 120
  },
  {
    field: 'orderTime',
    headerNameKey: "uexpressOrder.orderTime",
    width: 150
  },
  {
    field: 'inboundTime',
    headerNameKey: "uexpressOrder.inboundTime",
    width: 150
  },
  {
    field: 'outboundTime',
    headerNameKey: "uexpressOrder.outboundTime",
    width: 150
  },
  {
    field: "salesName",
    headerNameKey: "uexpressOrder.salesName",
    width: 120
  },
  {
    field: "customerServiceName",
    headerNameKey: "uexpressOrder.customerServiceName",
    width: 120
  },
  {
    field: "orderId",
    pinned: 'right',
    headerNameKey: "common.operation",
    cellRendererFramework: "OptionBtn",
    width: 220
  }]
}

