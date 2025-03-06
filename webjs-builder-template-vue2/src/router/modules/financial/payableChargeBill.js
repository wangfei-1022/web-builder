export const PayableChargeBillRouterMap = {
  // 应付费用明细
  "fms:payable:charge:list": {
    component: () => import("@/views/financial/payableCharge/index"),
    name: "FmsPayableCharge"
  },
  // 应付费用确认单
  "fms:payable:confirmation:list": {
    component: () => import("@/views/financial/payableConfirmation/index"),
    name: "FmsPayableConfirmation",
    children: ["fms:payable:confirmation:list:detail"]
  },
  // 应付费用确认单详情
  "fms:payable:confirmation:list:detail": {
    path: "/financial/payable/confirmation/detail",
    component: () => import("@/views/financial/payableConfirmation/detail"),
    name: "FmsPayableConfirmationDetail",
    hidden: true,
    meta: { title: "fmsPayableConfirmationDetail" }
  },
  // 应付账单管理
  "fms:payable:bill:list": {
    component: () => import("@/views/financial/payableBill/index"),
    name: "FmsPayableBill",
    children: ["fms:payable:bill:list:detail", "fms:payable:apply:payment", "fms:payable:apply:clear:page"]
  },
  // 应付账单详情
  "fms:payable:bill:list:detail": {
    path: "/financial/payable/bill/detail",
    component: () => import("@/views/financial/payableBill/detail"),
    name: "FmsPayableBillDetail",
    hidden: true,
    meta: { title: "fmsPayableBillDetail" }
  }
}
