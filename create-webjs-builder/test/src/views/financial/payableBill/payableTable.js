export default {
  defaultFlag: true,
  moduleName: '应付账单',
  moduleCode: 'PAYABLE_BILL_PAGE',
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
    field: "billNo",
    headerNameKey: "payableFms.bill_no",
    width: 130
  }, {
    field: "businessTypeName",
    headerNameKey: "payableFms.business_type",
    width: 100
  }, {
    field: "settlementCompanyName",
    headerNameKey: "payableFms.settlement_company_name",
    width: 130
  }, {
    field: "settlementOfficeName",
    headerNameKey: "payableFms.settlement_office_name",
    width: 130
  }, {
    field: "periodName",
    headerNameKey: "payableFms.period",
    width: 100,
    hide: false,
    resizable: true
  }, {
    field: "settlementModeName",
    headerNameKey: "receiveFms.settlement_mode",
    width: 100
  }, {
    field: "entityTypeName",
    headerNameKey: "payableFms.entityTypeName",
    width: 150
  }, {
    field: "USD",
    headerNameKey: "common.USD",
    width: 100,
    type: 'numericColumn'
  },
  {
    field: "CNY",
    headerNameKey: "common.CNY",
    width: 100,
    type: 'numericColumn'
  },
  {
    field: "EUR",
    headerNameKey: "common.EUR",
    width: 100,
    type: 'numericColumn'
  },
  {
    field: "GBP",
    headerNameKey: "common.GBP",
    width: 100,
    type: 'numericColumn'
  },
  {
    field: "HKD",
    headerNameKey: "common.HKD",
    width: 100,
    type: 'numericColumn'
  }, {
    field: "billDateActual",
    headerNameKey: "payableFms.bill_date_actual",
    width: 150
  }, {
    field: "confirmDateActual",
    headerNameKey: "payableFms.confirm_date_actual",
    width: 150
  }, {
    field: "billStateName",
    headerNameKey: "payableFms.bill_status",
    width: 100
  },
  {
    field: "instructionStateName",
    headerNameKey: "payableFms.apply_clear_status",
    width: 120,
    hide: false,
    resizable: true
  },
  {
    field: "clearStateName",
    headerNameKey: "payableFms.verification_status",
    width: 100
  }, {
    field: "confirmByName",
    headerNameKey: "payableFms.confirm_by_name",
    width: 100
  }, {
    field: "createByName",
    headerNameKey: "payableFms.create_by_name",
    width: 100
  }, {
    field: "JPY",
    headerNameKey: "common.JPY",
    width: 100,
    hide: true
  },
  {
    field: "AUD",
    headerNameKey: "common.AUD",
    width: 100,
    hide: true
  },
  {
    field: "BRL",
    headerNameKey: "common.BRL",
    width: 100,
    hide: true
  },
  {
    field: "MAN",
    headerNameKey: "common.MAN",
    width: 100,
    hide: true
  },
  {
    field: "VND",
    headerNameKey: "common.VND",
    width: 100,
    hide: true
  }, {
    field: "optionBtn",
    headerNameKey: "payableFms.operation",
    cellRendererFramework: "OptionBtnBill",
    pinned: 'right',
    width: 180
  }]
}

