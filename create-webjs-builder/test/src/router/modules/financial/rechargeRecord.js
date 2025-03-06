export const RechargeRecordRouterMap = {
  // 客户充值记录
  "fms:recharge:record": {
    component: () => import("@/views/financial/rechargeRecord/finance"),
    keepAlive: true,
    name: "RechargeRecordFinanceList",
    children: ["fms:recharge:record:detail", "fms:recharge:record:audit"]
  },
  // 充值记录详情
  "fms:recharge:record:detail": {
    path: "/recharge/record/detail",
    component: () => import("@/views/financial/rechargeRecord/detail"),
    name: "RechargeRecordDetail",
    hidden: true,
    meta: {
      title: "充值记录详情",
      keepAlive: false,
      noCache: true,
      affix: false
    }
  },
  // 充值记录-关联
  "fms:recharge:record:relative": {
    path: "/recharge/record/relative/trans",
    component: () => import("@/views/financial/rechargeRecord/relativeTrans"),
    name: "RechargeRecordRelativeTrans",
    hidden: true,
    meta: {
      title: "充值记录-关联收款",
      keepAlive: false,
      noCache: true,
      affix: false
    }
  },
  // 充值记录-审核
  "fms:recharge:record:audit": {
    path: "/recharge/record/audit",
    component: () => import("@/views/financial/rechargeRecord/audit"),
    name: "RechargeRecordAudit",
    hidden: true,
    meta: {
      title: "充值记录-审核",
      keepAlive: false,
      noCache: true,
      affix: false
    }
  }
}
