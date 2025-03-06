// 形票申请(运营)
export default {
  defaultFlag: true,
  moduleName: '形票申请(运营)',
  moduleCode: 'RECEIVE_COMMERCIAL_INVOICE_APPLY_OPERATORS_PAGE',
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
    field: "applyNo",
    headerNameKey: 'fmsReceiveInvoice.apply_no', // 申请编号
    width: 150
  }, {
    field: "businessTypeName",
    headerNameKey: 'fmsReceiveInvoice.business_type_name', // 业务类型
    width: 130
  }, {
    field: "settlementCompanyName",
    headerNameKey: 'fmsReceiveInvoice.settlement_company_name', // 结算单位
    width: 130
  }, {
    field: "settlementOfficeName",
    headerNameKey: 'fmsReceiveInvoice.settlement_office_name', // 结算分公司
    width: 130
  }, {
    field: "invoiceCurrencyAmountStr",
    headerNameKey: 'fmsReceiveInvoice.invoice_currency_amount_str', // 金额币种
    width: 130,
    type: 'numericColumn'
  }, {
    field: "invoiceTypeName",
    headerNameKey: 'fmsReceiveInvoice.invoice_type_name', // 发票类型
    width: 100
  }, {
    field: "invoiceMediumName",
    headerNameKey: 'fmsReceiveInvoice.invoice_medium_name', // 发票材质
    width: 100
  }, {
    field: "invoiceGroupTypeName",
    headerNameKey: 'fmsReceiveInvoice.invoice_group_type_name', // 开票方式
    width: 100
  }, {
    field: "invoiceStateName",
    headerNameKey: 'fmsReceiveInvoice.invoice_state_name_invoice', // 开票状态
    width: 100
  }, {
    field: "applyStateName",
    headerNameKey: 'fmsReceiveInvoice.apply_state_name', // 申请状态
    width: 100
  }, {
    field: "applyByName",
    headerNameKey: 'fmsReceiveInvoice.apply_by_name', // 申请人
    width: 100
  }, {
    field: "applyTime",
    headerNameKey: 'fmsReceiveInvoice.apply_time', // 申请时间
    width: 150
  },
  {
    field: "operationField",
    headerNameKey: "fmsReceiveInvoice.operation",
    cellRendererFramework: "optionBtnApplyTax",
    pinned: 'right',
    width: 150
  }]
}
