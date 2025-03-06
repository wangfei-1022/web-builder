/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

export const AirExportRouterMap = {
  // 会员管理
  'air:export': {
    component: Layout,
    alwaysShow: true,
    name: 'AirExport'
  },
  // 空出作业管理 'fms:receive:apply:invoice',
  'air:order:export': {
    component: () => import('@/views/airExport/airOrderManagement/list'),
    name: 'AirOrderManagement',
    children: ['air:order:export:edit', 'air:order:export:orderDetail', 'air:fms:receive:confirmation:list:detail', 'air:confirm:pay:detail',
      'air:airOrderManagement:apply:invoice', 'air:fms:receive:tax:invoice:apply:detail', 'sys:template:config', "air:apply:clear:page"]
  },
  'air:order:export:edit': {
    path: 'airOrderManagement/edit',
    component: () => import('@/views/airExport/airOrderManagement/edit'),
    name: 'AirOrderManagementEdit',
    hidden: true,
    meta: { title: '新增订单' }
  },
  'air:order:export:orderDetail': {
    path: 'airOrderManagement/orderDetail',
    component: () => import('@/views/airExport/airOrderManagement/orderDetail'),
    name: 'AirOrderManagementOrderDetail',
    hidden: true,
    meta: { title: '订单详情' }
  },

  // 空出2C业务管理
  'air:order:exportToC': {
    component: () => import('@/views/airExport/airOrderManagementToC/list'),
    name: 'AirOrderManagementToC',
    children: ['air:order:exportToC:edit', 'air:order:exportToC:orderDetail', 'air:fms:receive:confirmation:list:detail', 'air:confirm:pay:detail',
      'air:airOrderManagementToC:apply:invoice', 'air:fms:receive:tax:invoice:apply:detail', 'sys:template:config']
  },
  'air:order:exportToC:edit': {
    path: 'airOrderManagementToC/edit',
    component: () => import('@/views/airExport/airOrderManagementToC/edit'),
    name: 'AirOrderManagementToCEdit',
    hidden: true,
    meta: { title: '新增2C业务单' }
  },
  'air:order:exportToC:orderDetail': {
    path: 'airOrderManagementToC/orderDetail',
    component: () => import('@/views/airExport/airOrderManagementToC/orderDetail'),
    name: 'AirOrderManagementToCOrderDetail',
    hidden: true,
    meta: { title: '2C业务单详情' }
  },


  // 空出作业拼票管理
  'air:job:export': {
    component: () => import('@/views/airExport/airJobManagement/list'),
    name: 'AirJobManagement',
    children: ['air:job:export:jobDetail']
  },
  'air:job:export:jobDetail': {
    path: 'airJobManagement/jobDetail',
    component: () => import('@/views/airExport/airJobManagement/jobDetail'),
    name: 'AirJobManagementJobDetail',
    hidden: true,
    meta: { title: '作业单详情' }
  },
  // 应收费用确认单
  'air:confirm:receive:list': {
    component: () => import('@/views/airExport/receiveConfirmation/index'),
    name: 'AirReceiveConfirmation',
    children: ['air:fms:receive:confirmation:list:detail', 'air:receive:apply:invoice', 'air:fms:receive:tax:invoice:apply:detail', 'sys:template:config', "air:apply:clear:page"]
  },
  // 应付费用确认单 , 'fms:receive:apply:invoice',
  'air:confirm:pay:list': {
    component: () => import('@/views/airExport/payConfirmation/list'),
    name: 'AirPayConfirmation',
    children: ['air:fms:payable:confirmation:list:detail', "air:payable:apply:payment", "air:payApply:clear:page"]
  },
  // 应收费用明细
  'air:fmsDetail:receive:list': {
    component: () => import('@/views/airExport/fmsDetail/receiveList'),
    name: 'AirReceiveDetailList',
    children: ['air:fms:receive:bill:detail', "air:apply:clear:page"]
  },
  // 应付费用明细
  'air:fmsDetail:pay:list': {
    component: () => import('@/views/airExport/fmsDetail/payList'),
    name: 'AirPayDetailList',
    children: ['air:fms:payable:bill:list:detail', "air:payable:apply:payment", "air:payApply:clear:page"]
  },
  // 空出产品航线管理
  'air:airProductLineManagement:list': {
    component: () => import('@/views/airExport/airProductLineManagement/list'),
    name: 'AirProductLineManagement',
    children: ['air:airProductLineManagement:add', 'air:airProductLineManagement:detail']
  },
  'air:airProductLineManagement:add': {
    path: 'airProductLineManagement/add',
    component: () => import('@/views/airExport/airProductLineManagement/add'),
    name: 'AirProductLineManagementAdd',
    hidden: true,
    meta: { title: '新增产品' }
  },
  'air:airProductLineManagement:detail': {
    path: 'airProductLineManagement/detail',
    component: () => import('@/views/airExport/airProductLineManagement/detail'),
    name: 'AirProductLineManagementDetail',
    hidden: true,
    meta: { title: '产品详情' }
  },
  // 空出配舱管理
  'air:airMakingCargoPlan:list': {
    component: () => import('@/views/airExport/airMakingCargoPlan/list'),
    name: 'AirMakingCargoPlan'
  },
  // 空出航线管理
  'air:airLineManagement:list': {
    component: () => import('@/views/airExport/airLineManagement/list'),
    name: 'AirLineManagement',
    children: ['air:airLineManagement:detail', 'air:airLineManagement:addFlightSchedule']
  },
  'air:airLineManagement:detail': {
    path: 'airLineManagement/detail',
    component: () => import('@/views/airExport/airLineManagement/detail'),
    name: 'AirLineManagementDetail',
    hidden: true,
    meta: { title: '航线详情' }
  },
  'air:airLineManagement:addFlightSchedule': {
    path: 'airLineManagement/addFlightSchedule',
    component: () => import('@/views/airExport/airLineManagement/addFlightSchedule'),
    name: 'AddFlightSchedule',
    hidden: true,
    meta: { title: '新增航班计划' }
  },

  // 应收费用确认单详情
  "air:fms:receive:confirmation:list:detail": {
    path: "air/financial/receive/confirmation/detail",
    component: () => import("@/views/financial/receiptConfirmation/detail"),
    name: "AirFmsReceiveConfirmationDetail",
    hidden: true,
    meta: { title: "应收费用确认单详情" }
  },
  // 应付费用确认单详情
  "air:fms:payable:confirmation:list:detail": {
    path: "air/financial/payable/confirmation/detail",
    component: () => import("@/views/financial/payableConfirmation/detail"),
    name: "AirFmsPayableConfirmationDetail",
    hidden: true,
    meta: { title: "应付费用确认单详情" }
  },
  // 应付账单详情
  "air:fms:payable:bill:list:detail": {
    path: "air/financial/payable/bill/detail",
    component: () => import("@/views/financial/payableBill/detail"),
    name: "AirFmsPayableBillDetail",
    hidden: true,
    meta: { title: "应付账单详情" }
  },
  // 应收账单详情
  "air:fms:receive:bill:detail": {
    path: "air/financial/receive/bill/detail",
    component: () => import("@/views/financial/receiptBill/detail"),
    name: "AirFmsReceiveBillDetail",
    hidden: true,
    meta: { title: "应收账单详情" }
  },
  // 'air:confirm:receive:detail': {
  //   path: 'airOrderManagement/components/payFmsDetail',
  //   component: () => import('@/views/airExport/airOrderManagement/components/payFmsDetail'),
  //   name: 'AirFmsReceiveConfirmationDetail',
  //   hidden: true,
  //   meta: { title: '应收费用确认单详情' }
  // },
  'air:confirm:pay:detail': {
    path: 'airOrderManagement/components/payFmsDetail',
    component: () => import('@/views/airExport/airOrderManagement/components/payFmsDetail'),
    name: 'PayFmsDetail',
    hidden: true,
    meta: { title: '应付费用确认单详情' }
  },
  // 开票功能
  "air:receive:apply:invoice": {
    path: "receiveConfirmation/applyForInvoice",
    component: () => import("@/views/airExport/receiveConfirmation/applyForInvoice"),
    name: "FmsAirApplyForInvoice",
    hidden: true,
    meta: { title: "申请开票" }
  },
  // 开票功能
  "air:airOrderManagement:apply:invoice": {
    path: "receiveConfirmation/applyForInvoice",
    component: () => import("@/views/airExport/airOrderManagement/components/applyForInvoice"),
    name: "AirOrderManagementApplyForInvoice",
    hidden: true,
    meta: { title: "申请开票" }
  },
  // 开票功能
  "air:airOrderManagementToC:apply:invoice": {
    path: "receiveConfirmation/applyForInvoice",
    component: () => import("@/views/airExport/airOrderManagementToC/components/applyForInvoice"),
    name: "AirOrderManagementToCApplyForInvoice",
    hidden: true,
    meta: { title: "申请开票" }
  },
  // 申请核销应收
  "air:apply:clear:page": {
    path: 'receipt/clear/apply/clear',
    component: () => import('@/views/airExport/components/applyClearPage'),
    hidden: true,
    name: 'AirFmsApplyClearPage',
    meta: { title: '申请核销' }
  },
  // 申请核销应付
  "air:payApply:clear:page": {
    path: 'air/pay/clear/apply/clear',
    component: () => import('@/views/airExport/components/applyClearPayPage'),
    hidden: true,
    name: 'AirPayApplyClearPage',
    meta: { title: '申请核销' }
  },
  // 申请付款
  "air:payable:apply:payment": {
    path: 'air/payable/apply/payment',
    component: () => import('@/views/airExport/components/applyPaymentPage'),
    hidden: true,
    name: 'AirApplyForPayment',
    meta: { title: '申请付款' }
  },
  // 开票功能
  // "fms:receive:apply:invoice": {
  //   path: "/financial/receive/apply/invoice",
  //   component: () => import("@/views/financial/applyReceiptInvoice/index"),
  //   name: "FmsApplyForInvoice",
  //   hidden: true,
  //   meta: { title: "申请开票" }
  // },
  "air:fms:receive:tax:invoice:apply:detail": {
    path: "air/financial/receive/tax/invoice/apply/detail",
    component: () => import("@/views/financial/receiveInvoiceTaxApply/detail"),
    hidden: true,
    name: "AirFmsTaxInvoiceApplyDetail",
    meta: { title: "开票申请详情" }
  },
  'sys:template:config': {
    path: 'ReportPageView',
    component: () => import('@/views/cargo/v0/Management/reportPageView'),
    name: 'ReportPageView',
    hidden: true,
    meta: { title: '模板设计 / 预览视图', keepAlive: true, showIframe: true }
  },

  // 空出订单确认管理
  'air:order:airConfirmationManagement': {
    component: () => import('@/views/airExport/airConfirmationManagement/list'),
    name: 'AirConfirmationManagement',
    children: ['air:order:airConfirmationManagement:OrderConfirmation']
  },
  // 确认单 airConfirmationManagement
  'air:order:airConfirmationManagement:OrderConfirmation': {
    path: 'airConfirmationManagement/orderConfirmation',
    component: () => import('@/views/airExport/airConfirmationManagement/orderConfirmation'),
    name: 'AirOrderConfirmation',
    hidden: true,
    meta: { title: '订单确认' }
  },

  // 空出报价管理  air:order:export
  'air:airQuotationManagement:list': {
    component: () => import('@/views/airExport/airQuotationManagement/list'),
    name: 'AirQuotationManagement',
    children: ['air:airQuotationManagement:quote', 'air:airQuotationManagement:batchQuote']
  },
  // 报价
  'air:airQuotationManagement:quote': {
    path: 'airQuotationManagement/quote',
    component: () => import('@/views/airExport/airQuotationManagement/quote'),
    name: 'AirQuotationManagementQuote',
    hidden: true,
    meta: { title: '客户委托详情' }
  },
  // 报价报价
  'air:airQuotationManagement:batchQuote': {
    path: 'airQuotationManagement/batchQuote',
    component: () => import('@/views/airExport/airQuotationManagement/batchQuote'),
    name: 'AirQuotationManagementBatchQuote',
    hidden: true,
    meta: { title: '客户委托批量详情' }
  },
  // 空出订单确认管理ToB
  'air:airConfirmationManagementToB:list': {
    component: () => import('@/views/airExport/airConfirmationManagementToB/list'),
    name: 'AirConfirmationManagementToB',
    children: ['air:airConfirmationManagementToB:orderConfirmationToB']
  },
  // 确认管理ToB
  'air:airConfirmationManagementToB:orderConfirmationToB': {
    path: 'airConfirmationManagementToB/orderConfirmationToB',
    component: () => import('@/views/airExport/airConfirmationManagementToB/orderConfirmationToB'),
    name: 'OrderConfirmationToB',
    hidden: true,
    meta: { title: '订单确认' }
  }
}
