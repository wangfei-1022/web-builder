import Layout from "@/layout"

export const PayablePaymentRouterMap = {
  // 财务结算-付款管理
  "fms:manage:payable:payment": {
    component: Layout,
    alwaysShow: true,
    name: "Payment"
  },
  // 申请付款
  "fms:payable:apply:payment": {
    path: "/financial/payable/apply/payment",
    component: () => import("@/views/financial/applyPayablePayment/applyPaymentPage"),
    name: "FmsPayableApplyPayment",
    hidden: true,
    meta: { title: "fmsPayableApplyForPayment" }
  },
  // 申请预付款
  "fms:payable:apply:pre:payment": {
    path: "/financial/payable/apply/pre/payment",
    component: () => import("@/views/financial/applyPayablePayment/applyPrePaymentPage"),
    name: "FmsPayableApplyPrePayment",
    hidden: true,
    meta: { title: "fmsPayableApplyForPrePayment" }
  },
  // 付款管理
  "fms:manage:payable:payment:list": {
    component: () => import('@/views/financial/payablePaymentList/index'),
    name: 'FmsPayablePaymentList',
    children: ["fms:payable:apply:pre:payment", "fms:manage:payable:payment:apply:detail"]
  },
  // 付款申请管理
  "fms:manage:payable:payment:apply:list": {
    component: () => import('@/views/financial/payablePaymentApplyList/index'),
    name: 'FmsPayablePaymentApplyList',
    children: ["fms:payable:apply:pre:payment", "fms:manage:payable:payment:apply:detail"]
  },
  // 付款管理-审批人
  "fms:manage:payable:payment:approval:list": {
    component: () => import('@/views/financial/payablePaymentApprovalList/index'),
    name: 'FmsPayablePaymentApprovalList',
    children: ["fms:payable:apply:pre:payment", "fms:manage:payable:payment:apply:detail"]
  },
  // 付款申请管理-详情
  "fms:manage:payable:payment:apply:detail": {
    path: "/financial/payable/apply/payment/detail",
    component: () => import('@/views/financial/payablePaymentApplyList/detail'),
    name: 'FmsPayablePaymentApplyDetail',
    hidden: true,
    meta: { title: "fmsPayablePaymentApplyDetail" }
  }
}
