export default {
  defaultFlag: true,
  moduleName: '应付费用明细',
  moduleCode: 'PAYABLE_CHARGE_PAGE',
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
    field: "id",
    headerNameKey: "payableFms.charge_no",
    width: 150
  }, {
    field: "entityNo",
    headerNameKey: "payableFms.entity_no",
    width: 150
  }, {
    field: "entityTypeName",
    headerNameKey: "payableFms.entityTypeName",
    width: 150
  }, {
    field: "extendInfo11",
    headerNameKey: 'payableFms.business_no',
    width: 150
  }, {
    field: "extendInfo12",
    headerNameKey: 'payableFms.SO',
    width: 150
  }, {
    field: "extendInfo13",
    headerNameKey: 'payableFms.MBL',
    width: 120
  }, {
    field: "extendInfo14",
    headerNameKey: 'payableFms.HBL',
    width: 120
  },
  {
    field: "confirmationNo",
    headerNameKey: "payableFms.confirmation_no",
    width: 140
  },
  {
    field: "billNo",
    headerNameKey: "payableFms.bill_no",
    width: 140
  },
  {
    field: "businessTypeName",
    headerNameKey: "payableFms.business_type",
    width: 100
  }, {
    field: "memberName",
    headerNameKey: "receiveFms.memberLocalName",
    width: 130
  }, {
    field: "settlementCompanyName",
    headerNameKey: "payableFms.settlement_company_name",
    width: 130
  }, {
    field: "settlementOfficeName",
    headerNameKey: "payableFms.settlement_office_name",
    width: 130
  },
  {
    field: "instructionByNames",
    headerNameKey: "payableFms.instructionByNames",
    width: 130
  },
  {
    field: "responsiblePersonName",
    headerNameKey: "payableFms.sales_names",
    width: 100
  },
  {
    field: "feeItemName",
    headerNameKey: "payableFms.charge_name",
    width: 110
  }, {
    field: "currency",
    headerNameKey: "payableFms.currency",
    width: 80
  }, {
    field: "priceText", // js统一处理好之后进行展示
    headerNameKey: "payableFms.price",
    width: 80,
    type: 'numericColumn'
  }, {
    field: "chargeQuantity1",
    headerNameKey: "payableFms.number",
    width: 80
  }, {
    field: "invoiceTaxRateName",
    headerNameKey: "payableFms.tax_rate",
    width: 80
  }, {
    field: "taxAmountText", // js统一处理好之后进行展示
    headerNameKey: "payableFms.tax_amount",
    width: 80,
    type: 'numericColumn'
  }, {
    field: "excludeTaxAmountText", // js统一处理好之后进行展示
    headerNameKey: "payableFms.exclude_tax_amount",
    width: 100,
    type: 'numericColumn'
  }, {
    field: "entryAmountText", // js统一处理好之后进行展示
    headerNameKey: "payableFms.amount",
    width: 100,
    type: 'numericColumn'
  }, {
    field: "bussinessDate",
    headerNameKey: "payableFms.business_date",
    width: 150
  }, {
    field: "entryDate",
    headerNameKey: "payableFms.entry_date_estimate",
    width: 150
  }, {
    field: "settlementModeName",
    headerNameKey: "payableFms.settlement_mode",
    width: 100
  }, {
    field: "periodName",
    headerNameKey: "payableFms.profit_and_loss_period",
    width: 100
  }, {
    field: "lastClearedByName",
    headerNameKey: "payableFms.clear_by",
    width: 100
  }, {
    field: "lastClearDate",
    headerNameKey: "payableFms.clear_date",
    width: 150
  }, {
    field: "entryStateName",
    headerNameKey: "payableFms.bill_status",
    width: 100,
    pinned: 'right'
  },
  {
    field: "instructionStateName",
    headerNameKey: "payableFms.instructionStateNamePayable",
    width: 120,
    hide: false,
    resizable: true
  },
  // {
  //   field: "paymentStateName",
  //   headerNameKey: "payableFms.paymentStateName",
  //   width: 120,
  //   hide: false,
  //   resizable: true
  // },
  {
    field: "clearStateName",
    headerNameKey: "payableFms.verification_status",
    width: 100,
    cellRendererFramework: "ClearStateCell",
    pinned: 'right'
  }, {
    field: "lastPayDateTime",
    headerNameKey: "payableFms.lastPayDateTime",
    width: 100
  }, {
    field: "hasClearedAmount", // js统一处理好之后进行展示
    headerNameKey: "payableFms.has_cleared_amount",
    width: 100,
    type: 'numericColumn'
  }, {
    field: "unClearedAmount", // js统一处理好之后进行展示
    headerNameKey: "payableFms.un_cleared_amount",
    width: 100,
    type: 'numericColumn'
  }, {
    field: "lastProfitDate",
    headerNameKey: "payableFms.profit_date",
    width: 150
  }, {
    field: "dateExtendInfo2",
    headerNameKey: "payableFms.eta",
    width: 150
  }, {
    field: "profitStateName",
    headerNameKey: "payableFms.profit_state",
    width: 100,
    pinned: 'right'
  }, {
    field: "confirmByName",
    headerNameKey: "payableFms.submit_name",
    width: 100
  }, {
    field: "confirmTime",
    headerNameKey: "payableFms.submit_time",
    width: 150
  }, {
    field: "standardAmountText", // js统一处理好之后进行展示
    headerNameKey: "payableFms.standard_amount",
    width: 180,
    type: 'numericColumn'
  }, {
    field: "clearingStandardAmountText", // js统一处理好之后进行展示
    headerNameKey: "payableFms.un_clear_standard_amount",
    width: 160,
    type: 'numericColumn'
  }, {
    field: "customerBL",
    headerNameKey: "payableFms.customerBL",
    width: 150
  }, {
    field: "businessTagTypeName",
    headerNameKey: "payableFms.businessTag",
    width: 100
  }, {
    field: "optionBtn",
    headerNameKey: "payableFms.operation",
    cellRendererFramework: "OptionBtnCharge",
    pinned: 'right',
    width: 80
  }]
}

