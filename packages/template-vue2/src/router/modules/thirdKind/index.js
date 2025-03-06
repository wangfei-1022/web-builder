import Layout from "@/layout"


export const thirdKindRouterMap = {
  // 第三类订单管理
  'thk:order:business': {
    component: Layout,
    alwaysShow: true,
    name: 'ThkOrder'
  },
  // 第三类订单列表-综合业务
  'thk:order:list:integrated': {
    component: () => import('@/views/thirdKind/orderManage/integrated.vue'),
    name: 'ThirdKindOrderListIntegrated',
    children: ["thk:order:detail", "thk:order:add"]
  },
  // 第三类订单列表-铁路业务
  'thk:order:list:rail': {
    component: () => import('@/views/thirdKind/orderManage/rail.vue'),
    name: 'ThirdKindOrderListRail',
    children: ["thk:order:detail", "thk:order:add"]
  },
  // 第三类订单列表-公路业务
  'thk:order:list:road': {
    component: () => import('@/views/thirdKind/orderManage/road.vue'),
    name: 'ThirdKindOrderListRoad',
    children: ["thk:order:detail", "thk:order:add"]
  },
  // 第三类订单列表-海外仓配
  'thk:order:list:overseas': {
    component: () => import('@/views/thirdKind/orderManage/overseas.vue'),
    name: 'ThirdKindOrderListOverseas',
    children: ["thk:order:detail", "thk:order:add"]
  },
  // 第三类订单列表-内贸业务
  'thk:order:list:domestic': {
    component: () => import('@/views/thirdKind/orderManage/domestic.vue'),
    name: 'ThirdKindOrderListDomestic',
    children: ["thk:order:detail", "thk:order:add"]
  },
    // 第三类订单-新增
    "thk:order:add": {
        path: "/thk/order/add",
        component: () => import("@/views/thirdKind/orderManage/order/thirdKindOrderAdd.vue"),
        name: "ThirdKindOrderAdd",
        hidden: true,
        meta: { title: "ThirdKindOrderAdd" },
    },
    
  // 第三类订单详情
  "thk:order:detail": {
    path: "/thk/order/detail",
    component: () => import("@/views/thirdKind/orderManage/order/thirdKindOrderDetail.vue"),
    name: "ThirdKindOrderDetail",
    hidden: true,
    meta: { title: "ThirdKindOrderDetail" },
    children: ["thk:receive:invoice:detail", "thk:confirmation:receive:detail", "thk:confirmation:apply:clear", "thk:confirmation:apply:clear:payment", "thk:confirmation:apply:payment"]
  },

  // 应收费用开票申请
  "thk:receive:invoice:detail": {
    path: "/thk/receive/invoice",
    component: () => import("@/views/thirdKind/settleManage/operatePage/applyForInvoice.vue"),
    name: "ThkOrderManagementApplyForInvoice",
    hidden: true,
    meta: { title: "ThkOrderManagementApplyForInvoice" }
  },
  // 应收费用确认单详情
  "thk:confirmation:receive:detail": {
    path: "thk/receive/confirmation/detail",
    component: () => import("@/views/thirdKind/settleManage/expenseConfirmation/confirmationExpenseReceivableDetail.vue"),
    name: "ConfirmationExpenseReceivableDetail",
    hidden: true,
    meta: { title: "ThkReceiveConfirmationDetail" }
  },
  // 应付费用确认单详情
  "thk:confirmation:payable:detail": {
    path: "/thk/payable/confirmation/detail",
    component: () => import("@/views/thirdKind/settleManage/expenseConfirmation/confirmationExpensesPayableDetail.vue"),
    name: "ConfirmationExpensesPayableDetail",
    hidden: true,
    meta: { title: "ThkPayableConfirmationDetail" }
  },
  // 应收费用申请核销
  "thk:confirmation:apply:clear": {
    path: "thk/receive/applyClear",
    component: () => import("@/views/thirdKind/settleManage/operatePage/applyClearReceivablePage.vue"),
    name: "ThkFmsApplyClearPage",
    hidden: true,
    meta: { title: "ThkFmsApplyClearPage" }
  },
  // 应付费用申请核销
  "thk:confirmation:apply:clear:payment": {
    path: "thk/receive/applyClear/payment",
    component: () => import("@/views/thirdKind/settleManage/operatePage/applyClearPayablePage.vue"),
    name: "ThkFmsApplyPayClearPage",
    hidden: true,
    meta: { title: "ThkFmsApplyClearPage" }
  },
  // 应收费用申请付款
  "thk:confirmation:apply:payment": {
    path: "thk/receive/applyClear",
    component: () => import("@/views/thirdKind/settleManage/operatePage/applyPaymentPage.vue"),
    name: "ThkApplyForPayment",
    hidden: true,
    meta: { title: "ThkApplyForPayment" }
  },
  // 应收费用确认单管理
  "thk:confirmation:charge:list": {
    component: () => import('@/views/thirdKind/settleManage/expenseConfirmation/confirmationExpenseReceivable.vue'),
    name: 'ConfirmationExpenseReceivable',
    children: ["thk:confirmation:receive:detail", "thk:fms:receive:tax:invoice:apply:detail"]
  },
  // 应付费用确认单管理
  "thk:confirmation:pay:list": {
    component: () => import('@/views/thirdKind/settleManage/expenseConfirmation/confirmationExpensesPayable.vue'),
    name: 'ConfirmationExpensesPayable',
    children: ["thk:confirmation:payable:detail"]
  },
  // 应收费用明细
  "thk:receivable:detail:list": {
    component: () => import('@/views/thirdKind/settleManage/expenseDetail/expenseReceivableDetail.vue'),
    children: ["thk:fms:receive:tax:invoice:apply:detail"],
    name: 'ExpenseReceivableDetail'
  },
  // 应付费用明细
  "thk:payable:detail:list": {
    component: () => import('@/views/thirdKind/settleManage/expenseDetail/expensePayableDetail.vue'),
    name: 'ExpensePayableDetail'
  },
  "thk:fms:receive:tax:invoice:apply:detail": {
    path: "thk/receive/tax/invoice/apply/detail",
    component: () => import("@/views/financial/receiveInvoiceTaxApply/detail"),
    hidden: true,
    name: "ThkFmsTaxInvoiceApplyDetail",
    meta: { title: "开票申请详情" }
  }
}
