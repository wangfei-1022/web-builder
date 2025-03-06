export const UexpressRechargeRouterMap = {
  // 客户账户流水
  'ilp:account:statement': {
    component: () => import('@/views/uexpress/fmsStatement'),
    name: 'UexpressFmsStatement'
  },
  // 客户充值记录(销售)
  'ilp:ord:recharge:seller': {
    name: 'UexpressRechargeRecordSale',
    component: () => import('@/views/uexpress/rechargeRecord/sale'),
    children: ["fms:recharge:record:detail", "fms:recharge:record:relative"]
  },
  // 客户充值记录(销售主管)
  'ilp:ord:recharge:list:seller:manger': {
    name: 'UexpressRechargeRecordList',
    component: () => import('@/views/uexpress/rechargeRecord/index'),
    children: ["fms:recharge:record:detail", "fms:recharge:record:relative"]
  }
}
