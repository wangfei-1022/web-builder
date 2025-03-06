import Vue from '@/main'

const searchData = [{
  "itemType": "member",
  "subType": { "range": ["b_customer"] },
  "itemName": "customerId",
  "itemLabel": Vue.$t('sea.requester'),
  "itemValue": "",
  "selected": 0,
  "valueExpression": "",
  "defaultSelected": 1
},
//   {
//   "itemType": "customer",
//   "subType": {"range": ["b_customer"]},
//   "itemName": "clientId",
//   "itemLabel": "客户",
//   "itemValue": "",
//   "selected": 0,
//   "valueExpression": "",
//   "defaultSelected": 1
// },
{
  "itemType": "port",
  "itemName": "polCode",
  "itemLabel": Vue.$t('sea.pol'),
  "itemValue": "",
  "selected": 0,
  "valueExpression": "",
  "defaultSelected": 1
}, {
  "itemType": "port",
  "itemName": "podCode",
  "itemLabel": Vue.$t('sea.pod'),
  "itemValue": "",
  "selected": 0,
  "valueExpression": "",
  "defaultSelected": 1
}, {
  "itemType": "customer",
  "subType": { "range": ["b_destination_agent"] },
  "itemName": "destinationAgentId",
  "itemLabel": Vue.$t('sea.pod2'),
  "itemValue": "",
  "selected": 0,
  "valueExpression": "",
  "defaultSelected": 0
}, {
  "itemType": "input",
  "itemName": "vessel",
  "itemLabel": Vue.$t('sea.shipName'),
  "itemValue": "",
  "selected": 0,
  "valueExpression": "",
  "defaultSelected": 1
}, {
  "itemType": "input",
  "itemName": "voyage",
  "itemLabel": Vue.$t('sea.voyage'),
  "itemValue": "",
  "selected": 0,
  "valueExpression": "",
  "defaultSelected": 1
}, {
  "itemType": "input",
  "itemName": "soNo",
  "itemLabel": "SO",
  "itemValue": "",
  "selected": 0,
  "valueExpression": "",
  "defaultSelected": 1
}, {
  "itemType": "select",
  "itemName": "orderStates",
  "itemLabel": Vue.$t('sea.orderState'),
  "itemValue": null,
  "selected": null,
  "multiple": 1,
  "valueExpression": {
    "valueType": "static",
    "valueContent": [
      // {"label": Vue.$t('sea.all'), "value": null},
      { "label": Vue.$t('sea.toBeBooked'), "value": 20 }, // 待订舱
      { "label": Vue.$t('sea.bookingProgress'), "value": 25 }, // 订舱处理中
      { "label": Vue.$t('sea.supplementing'), "value": 80 }, // 订舱处理中
      { "label": Vue.$t('sea.toBePrepared'), "value": 30 }, // 待制单
      { "label": Vue.$t('sea.materialsToBeSupplemented'), "value": 40 }, // 待补料
      { "label": Vue.$t('sea.toBeIssued'), "value": 50 }, // 待签发
      { "label": Vue.$t('sea.issued'), "value": 60 }, // 已签发
      { "label": Vue.$t('sea.cancelled'), "value": 100 }, // 已取消
      { "label": Vue.$t('sea.exit'), "value": 70 }] // 已退关
  },
  "defaultSelected": 1
}, {
  "itemType": "input",

  "itemName": "memberBlNo",
  "itemLabel": Vue.$t('sea.customerBill'),
  "itemValue": "",
  "selected": 0,
  "valueExpression": "",
  "defaultSelected": 1
}, {
  "itemType": "input",
  "itemName": "carrierBlNo",
  "itemLabel": Vue.$t('sea.carrierBlNo'),
  "itemValue": "",
  "selected": 0,
  "valueExpression": "",
  "defaultSelected": 1
}, {
  "itemType": "user",
  "itemName": "createBy",
  "itemLabel": Vue.$t('sea.createdBy'),
  "itemValue": "",
  "selected": 0,
  "valueExpression": "",
  "defaultSelected": 1
}, {
  "itemType": "date",
  "subType": "daterange",
  "itemName": "etd",
  "itemLabel": "ETD",
  "itemValue": "",
  "selected": 0,
  "valueExpression": "",
  "defaultSelected": 1
}, {
  "itemType": "date",
  "subType": "daterange",
  "itemName": "atd",
  "itemLabel": "ATD",
  "itemValue": "",
  "selected": 0,
  "valueExpression": "",
  "defaultSelected": 1
}, {
  "itemType": "date",
  "subType": "daterange",
  "itemName": "eta",
  "itemLabel": "ETA",
  "itemValue": "",
  "selected": 0,
  "valueExpression": "",
  "defaultSelected": 1
}, {
  "itemType": "select",
  "itemName": "receivableType",
  "itemLabel": Vue.$t('sea.feesReceivable'),
  "itemValue": null,
  "selected": null,
  "valueExpression": {
    "valueType": "static",
    "valueContent": [{ "label": Vue.$t('sea.all'), "value": null },
    { "label": Vue.$t('sea.notMaintained'), "value": 0 }, // 未维护
    { "label": Vue.$t('sea.unconfirmed'), "value": 1 }, // 未确认
    { "label": Vue.$t('sea.confirmed'), "value": 2 }, // 已确认
    { "label": Vue.$t('sea.confirmationInProgress'), "value": 9 }] // 确认中
    // {"label": Vue.$t('sea.maintained'), "value": 1}] // 已维护
  },
  "defaultSelected": 1
}, {
  "itemType": "select",
  "itemName": "payableType",
  "itemLabel": Vue.$t('sea.feesPayable'),
  "itemValue": null,
  "selected": null,
  "valueExpression": {
    "valueType": "static",
    "valueContent": [{ "label": Vue.$t('sea.all'), "value": null },
    { "label": Vue.$t('sea.notMaintained'), "value": 0 }, // 未维护
    { "label": Vue.$t('sea.unconfirmed'), "value": 1 }, // 未确认
    { "label": Vue.$t('sea.confirmed'), "value": 2 }, // 已确认
    { "label": Vue.$t('sea.confirmationInProgress'), "value": 9 }] // 确认中
    // {"label": Vue.$t('sea.maintained'), "value": 1}] // 已维护
  },
  "defaultSelected": 1
}, {
  "itemType": "carrier",
  "itemName": "carrierId",
  "itemLabel": Vue.$t('sea.shippingCompany'),
  "itemValue": "",
  "selected": 0,
  "valueExpression": "",
  "defaultSelected": 1
}, {
  "itemType": "input",
  "itemName": "orderNo",
  "itemLabel": Vue.$t('sea.orderNumber'),
  "itemValue": "",
  "selected": 0,
  "valueExpression": "",
  "defaultSelected": 1
}, {
  "itemType": "input",
  "itemName": "containerNo",
  "itemLabel": Vue.$t('sea.containerNo'),
  "itemValue": "",
  "selected": 0,
  "valueExpression": "",
  "defaultSelected": 1
}, {
  "itemType": "select",
  "itemName": "arInvoiceState",
  "itemLabel": '应收开票状态',
  "itemValue": null,
  "selected": null,
  "valueExpression": {
    "valueType": "static",
    "valueContent": []
  },
  "defaultSelected": 1
}, {
  "itemType": "select",
  "itemName": "arInstructionState",
  "itemLabel": '应收申请核销状态',
  "itemValue": null,
  "selected": null,
  "valueExpression": {
    "valueType": "static",
    "valueContent": []
  },
  "defaultSelected": 1
}, {
  "itemType": "select",
  "itemName": "arClearState",
  "itemLabel": '应收核销状态',
  "itemValue": null,
  "selected": null,
  "valueExpression": {
    "valueType": "static",
    "valueContent": []
  },
  "defaultSelected": 1
}, {
  "itemType": "select",
  "itemName": "tradeTermCode",
  "itemLabel": Vue.$t('sea.tradeTerms'),
  "itemValue": null,
  "selected": null,
  "valueExpression": {
    "valueType": "static",
    "valueContent": []
  },
  "defaultSelected": 1
}, {
  "itemType": "select",
  "itemName": "businessTagCodeList",
  "itemLabel": Vue.$t('sea.businessTag'),
  "itemValue": null,
  "selected": null,
  "multiple": 1,
  "valueExpression": {
    "valueType": "static",
    // 1.海外仓头程 2.全链路 3.仅目的港服务 4.FBA&FBW 5.海运集拼
    "valueContent": [
      { "label": Vue.$t('sea.overseasPosition'), "value": 1 },
      { "label": Vue.$t('sea.fullLink'), "value": 2 },
      { "label": Vue.$t('sea.destinationServiceOnly'), "value": 3 },
      { "label": 'FBA&FBW', "value": 4 },
      { "label": Vue.$t('sea.seaCollection'), "value": 5 }]
  },
  "defaultSelected": 1
}, {
  "itemType": "select",
  "itemName": "orderLockState",
  "itemLabel": Vue.$t('sea.orderLockStateName'),
  "itemValue": null,
  "selected": null,
  "valueExpression": {
    "valueType": "static",
    // 1.海外仓头程 2.全链路 3.仅目的港服务 4.FBA&FBW 5.海运集拼
    "valueContent": [{ "label": Vue.$t('sea.all'), "value": null },
    { "label": "未锁定", "value": 0 },
    { "label": "已锁定", "value": 10 },
    { "label": "调整中", "value": 20 },
    { "label": "已调整", "value": 30 }
    ]
  },
  "defaultSelected": 1
}
]

export default searchData
