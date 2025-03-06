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
    headerNameKey: "receiveFms.serial_no",
    width: 150
  }, {
    field: "entityNo",
    headerNameKey: "receiveFms.entity_no",
    width: 150
  }, {
    field: "extendInfo13",
    headerNameKey: "receiveFms.MBL",
    width: 150
  },{
    field: "extendInfo14",
    headerNameKey: "receiveFms.HBL",
    width: 150
  }, {
    field: "billNos",
    headerNameKey: "receiveFms.bill_no",
    width: 150
  }, {
    field: "entityTypeName",
    headerNameKey: "receiveFms.entityTypeName",
    width: 150
  }, {
    field: "extendInfo11",
    headerNameKey: "receiveFms.business_no",
    width: 150
  }, {
    field: "businessTypeName",
    headerNameKey: "receiveFms.business_type",
    width: 100
  }, {
    field: "settlementCompanyName",
    headerNameKey: "receiveFms.settlement_company_name",
    width: 130
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
    field: "settlementOfficeName",
    headerNameKey: "receiveFms.settlement_office_name",
    width: 130
  }, {
    field: "responsiblePersonName",
    headerNameKey: "receiveFms.sales_names",
    width: 100
  }, {
    field: "settlementModeName",
    headerNameKey: "receiveFms.settlement_mode",
    width: 100
  }, {
    field: "confirmByName",
    headerNameKey: "receiveFms.submit_name",
    width: 100
  }, {
    field: "confirmTime",
    headerNameKey: "receiveFms.submit_time",
    width: 150
  }, {
    field: "bussinessDate",
    headerNameKey: "receiveFms.business_date",
    width: 150
  }, {
    field: "entryStateName",
    headerNameKey: "receiveFms.bill_status",
    width: 100
  }, {
    field: "invoiceApplyStateName",
    headerNameKey: "receiveFms.invoice_apply_state_name",
    width: 100
  }, {
    field: "createByName",
    headerNameKey: 'receiveFms.create_by_name',
    width: 100
  }, {
    field: "invoiceStateName",
    headerNameKey: "receiveFms.invoice_status",
    width: 90
  }, {
    field: "instructionStateName",
    headerNameKey: "receiveFms.apply_clear_status",
    width: 120
  }, {
    field: "clearStateName",
    headerNameKey: "receiveFms.clear_status",
    width: 90
  }, {
    field: "confirmationStateName",
    headerNameKey: "receiveFms.confirmation_state",
    width: 130
  }, {
    field: "checkPrincipalTypeNames",
    headerNameKey: "receiveFms.check_principal_type_name",
    width: 150
  }, {
    field: "JPY",
    headerNameKey: "common.JPY",
    width: 100,
    type: 'numericColumn',
    hide: true
  },
  {
    field: "AUD",
    headerNameKey: "common.AUD",
    width: 100,
    type: 'numericColumn',
    hide: true
  },
  {
    field: "BRL",
    headerNameKey: "common.BRL",
    width: 100,
    type: 'numericColumn',
    hide: true
  },
  {
    field: "MAN",
    headerNameKey: "common.MAN",
    width: 100,
    type: 'numericColumn',
    hide: true
  },
  {
    field: "VND",
    headerNameKey: "common.VND",
    width: 100,
    type: 'numericColumn',
    hide: true
  }, {
    field: "profitStateName",
    headerNameKey: "receiveFms.profit_state",
    width: 100
  }, {
    field: "optionBtn",
    headerNameKey: "receiveFms.operation",
    cellRendererFramework: "OptionBtnConfirmation",
    pinned: 'right',
    width: 130
  }]
}

