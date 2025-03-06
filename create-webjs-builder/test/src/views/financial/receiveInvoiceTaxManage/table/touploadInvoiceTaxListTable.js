// 税票待回传(财务)
export default {
  defaultFlag: true,
  moduleName: '税票待回传(财务)',
  moduleCode: 'RECEIVE_TAX_INVOICE_TOUPLOAD_FINANCE_PAGE',
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
    field: "taxInvoiceStateName",
    headerNameKey: 'fmsReceiveInvoice.invoice_state_name_invoice', // 开票状态
    width: 100
  }, {
    field: "uploadChargeFileCell",
    headerNameKey: 'fmsReceiveInvoice.upload_charge_file_cell', // 扫描件账单
    width: 130,
    cellRendererFramework: "uploadChargeFileCell"
  }, {
    field: "uploadOtherFileCell",
    headerNameKey: 'fmsReceiveInvoice.upload_other_file_cell', // 其他扫描件
    width: 130,
    cellRendererFramework: "uploadOtherFileCell"
  },
  {
    field: "operationField",
    headerNameKey: "fmsReceiveInvoice.operation",
    cellRendererFramework: "optionBtnInvoiceOper",
    pinned: 'right',
    width: 200
  }]
}
