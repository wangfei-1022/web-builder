export const ReceiptInvoiceRouterMap = {
  // 申请开票
  "fms:receive:apply:invoice": {
    path: "/financial/receive/apply/invoice",
    component: () => import("@/views/financial/applyReceiptInvoice/index"),
    name: "FmsApplyForInvoice",
    hidden: true,
    meta: { title: "申请开票" }
  },
  // 税票申请管理
  "fms:receive:tax:apply:list": {
    component: () => import("@/views/financial/receiveInvoiceTaxApply/tax"),
    name: "FmsTaxInvoiceListOperator",
    children: [
      'fms:receive:apply:invoice:detail',
      'fms:receive:invoice:detail',
      'fms:receive:apply:clear:page',
      'fms:receive:apply:clear:offset:page'
    ]
  },
  // 形票申请管理
  "fms:receive:commercial:apply:list": {
    component: () => import("@/views/financial/receiveInvoiceCommercialApply/commercial"),
    name: "FmsCommercialInvoiceListOperator",
    children: [
      'fms:receive:apply:invoice:detail',
      'fms:receive:invoice:detail',
      'fms:receive:apply:clear:page',
      'fms:receive:apply:clear:offset:page'
    ]
  },
  // 税票开票管理
  "fms:receive:tax:invoice:list": {
    component: () => import("@/views/financial/receiveInvoiceTaxManage/tax"),
    name: "FmsTaxInvoiceListFinance",
    children: [
      'fms:receive:apply:invoice:detail',
      'fms:receive:invoice:detail',
      "fms:receive:apply:tax:invoice:make",
      "fms:receive:tax:invoice:reverse",
      "fms:receive:tax:invoice:update",
      'fms:receive:apply:clear:page',
      'fms:receive:apply:clear:offset:page'
    ]
  },
  // 形票开票管理
  "fms:receive:commercial:invoice:list": {
    component: () => import("@/views/financial/receiveInvoiceCommercialManage/commercial"),
    name: "FmsCommercialInvoiceListFinance",
    children: [
      'fms:receive:apply:invoice:detail',
      'fms:receive:invoice:detail',
      'fms:receive:apply:clear:page',
      'fms:receive:apply:clear:offset:page'
    ]
  },
  // 开票申请详情
  "fms:receive:apply:invoice:detail": {
    path: "/financial/receive/tax/invoice/apply/detail",
    component: () => import("@/views/financial/receiveInvoiceTaxApply/detail"),
    hidden: true,
    name: "FmsTaxInvoiceApplyDetail",
    meta: { title: "开票申请详情" }
  },
  // 开票
  "fms:receive:apply:tax:invoice:make": {
    path: "/financial/receive/tax/invoice/make",
    component: () => import("@/views/financial/receiveInvoiceTaxManage/makeInvoice"),
    name: "FmsTaxInvoiceMake",
    hidden: true,
    meta: { title: "开票" }
  },
  // 开具红冲
  "fms:receive:tax:invoice:reverse": {
    path: "/financial/receive/tax/invoice/reverse",
    component: () => import("@/views/financial/receiveInvoiceTaxManage/reverseInvoice"),
    name: "FmsTaxInvoiceReverse",
    hidden: true,
    meta: { title: "开具红冲" }
  },
  // 编辑发票
  "fms:receive:tax:invoice:update": {
    path: "/financial/receive/tax/invoice/update",
    component: () => import("@/views/financial/receiveInvoiceTaxManage/updateInvoiceObject"),
    hidden: true,
    name: "FmsTaxInvoiceUpdate",
    meta: { title: "编辑发票" }
  },
  // 发票详情
  "fms:receive:invoice:detail": {
    path: "/financial/receive/tax/invoice/detail",
    component: () => import("@/views/financial/receiveInvoiceTaxManage/detail"),
    hidden: true,
    name: "FmsTaxInvoiceDetail",
    meta: { title: "发票详情" }
  }
}
