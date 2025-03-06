// 税票异常(财务)
export default {
  defaultFlag: true,
  moduleName: '税票异常(财务)',
  moduleCode: 'RECEIVE_TAX_INVOICE_EXCEPT_FINANCE_PAGE',
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
    field: "invoiceSeqNo",
    headerNameKey: 'fmsReceiveInvoice.invoice_seq_no', // 发票流水号
    width: 130
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
    field: "invoiceAmount",
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
    field: "applyByName",
    headerNameKey: 'fmsReceiveInvoice.apply_by_name', // 申请人
    width: 100
  }, {
    field: "applyTime",
    headerNameKey: 'fmsReceiveInvoice.apply_time', // 申请时间
    width: 150
  }, {
    field: "failMessage",
    headerNameKey: 'fmsReceiveInvoice.except_message', // 异常原因
    width: 200
  }, {
    field: "taxSystemStateName",
    headerNameKey: 'fmsReceiveInvoice.except_state_name', // 异常状态
    width: 100
  },
  {
    field: "operationField",
    headerNameKey: "fmsReceiveInvoice.operation",
    cellRendererFramework: "optionBtnInvoiceOper",
    pinned: 'right',
    width: 200
  }]
}
