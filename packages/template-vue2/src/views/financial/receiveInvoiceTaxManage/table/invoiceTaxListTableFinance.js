// 税票列表(财务)
export default {
  defaultFlag: true,
  moduleName: '税票列表(财务)',
  moduleCode: 'RECEIVE_TAX_INVOICE_FINANCE_PAGE',
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
    field: "invoiceNo",
    headerNameKey: 'fmsReceiveInvoice.invoice_no', // 发票号
    width: 130
  }, {
    field: "invoiceCode",
    headerNameKey: 'fmsReceiveInvoice.invoice_code', // 发票编码
    width: 130
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
    headerNameKey: 'fmsReceiveInvoice.amount', // 金额
    width: 130,
    type: 'numericColumn'
  }, {
    field: "sourceAmountCurrencyStr",
    headerNameKey: 'fmsReceiveInvoice.sourceAmountCurrencyStr', // 原币金额
    width: 130
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
    field: "invoiceDate",
    headerNameKey: 'fmsReceiveInvoice.invoice_date', // 开票时间
    width: 150
  }, {
    field: "nullifyDate",
    headerNameKey: 'fmsReceiveInvoice.nullify_date', // 作废时间
    width: 150
  }, {
    field: "taxSystemStateName",
    headerNameKey: 'fmsReceiveInvoice.tax_system_state_name', // 税控状态
    width: 100
  }, {
    field: "printStateName",
    headerNameKey: 'fmsReceiveInvoice.print_state_name', // 打印状态
    width: 100
  }, {
    field: "taxInvoiceStateName",
    headerNameKey: 'fmsReceiveInvoice.invoice_state_name', // 发票状态
    width: 100
  }, {
    field: "notifyStateName",
    headerNameKey: 'fmsReceiveInvoice.notify_state_name', // 推送状态
    width: 100
  }, {
    field: "expressStateName",
    headerNameKey: 'fmsReceiveInvoice.express_state_name', // 寄送状态
    width: 100
  }, {
    field: "instructionStateName",
    headerNameKey: "fmsReceiveInvoice.instruction_state_name", // 申请核销状态
    width: 120
  }, {
    field: "clearStateName",
    headerNameKey: 'fmsReceiveInvoice.clear_state_name', // 核销状态
    width: 100
  }, {
    field: "expressNo",
    headerNameKey: 'fmsReceiveInvoice.express_no', // 快递单号
    width: 150
  },
  {
    field: "operationField",
    headerNameKey: "fmsReceiveInvoice.operation",
    cellRendererFramework: "optionBtnInvoiceOper",
    pinned: 'right',
    width: 200
  }]
}
