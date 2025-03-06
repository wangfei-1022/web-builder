export const ReceiptChargeBillRouterMap = {
  // 应收费用明细
  "fms:receive:charge:list": {
    component: () => import("@/views/financial/receiptCharge/index"),
    name: "FmsReceiveCharge",
    children: ["fms:receive:apply:invoice", "fms:receive:apply:clear:page", "fms:receive:apply:clear:offset:page"]
  },
  // 应收费用确认单
  "fms:receive:confirmation:list": {
    component: () => import("@/views/financial/receiptConfirmation/index"),
    name: "FmsReceiveConfirmation",
    children: ["fms:receive:confirmation:list:detail", "fms:receive:apply:invoice", "fms:receive:apply:clear:page", "fms:receive:apply:clear:offset:page"]
  },
  // 应收费用确认单详情
  "fms:receive:confirmation:list:detail": {
    path: "/financial/receive/confirmation/detail",
    component: () => import("@/views/financial/receiptConfirmation/detail"),
    name: "FmsReceiveConfirmationDetail",
    hidden: true,
    meta: { title: "fmsReceiveConfirmationDetail" }
  },
  // 应收账单管理
  "fms:receive:bill": {
    component: () => import("@/views/financial/receiptBill/index"),
    name: "FmsReceiveBill",
    children: ["fms:receive:bill:detail", "fms:receive:apply:invoice", "fms:receive:apply:clear:page", "fms:receive:apply:clear:offset:page"]
  },
  // 应收账单详情
  "fms:receive:bill:detail": {
    path: "/financial/receive/bill/detail",
    component: () => import("@/views/financial/receiptBill/detail"),
    name: "FmsReceiveBillDetail",
    hidden: true,
    meta: { title: "fmsReceiveBillDetail" }
  }
}
