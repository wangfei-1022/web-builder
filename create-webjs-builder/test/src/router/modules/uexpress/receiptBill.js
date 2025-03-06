export const UexpressReceiptBillRouterMap = {
  // 应收费用明细
  'ilp:bill:ar:charge:list': {
    component: () => import('@/views/uexpress/receiptFmsCharge/index'),
    name: 'UExpressReceiveFmsChargeList',
    children: []
  },
  // 应收费用确认单（结算）
  'ilp:bill:receipt:confirm:finance': {
    component: () => import('@/views/uexpress/receiptFmsConfirmation/finance'),
    name: 'UExpressReceiveConfirmationFinance',
    children: ["ilp:bill:receipt:confirm:detail"]
  },
  // 应收费用确认单（产品）
  'ilp:bill:receipt:confirm:product': {
    component: () => import('@/views/uexpress/receiptFmsConfirmation/product'),
    name: 'UExpressReceiveConfirmationProduct',
    children: ["ilp:bill:receipt:confirm:detail", "ilp:bill:receipt:confirm:adjust"]
  },
  // 应收费用确认单（运营）
  'ilp:bill:receipt:confirm:operator': {
    component: () => import('@/views/uexpress/receiptFmsConfirmation/operator'),
    name: 'UExpressReceiveConfirmationOperator',
    children: ["ilp:bill:receipt:confirm:detail", "ilp:bill:receipt:confirm:adjust"]
  },
  // 应收费用确认单-详情
  'ilp:bill:receipt:confirm:detail': {
    path: '/uexpress/fms/confirmation/receive/detail',
    component: () => import('@/views/uexpress/receiptFmsConfirmation/detail'),
    name: 'UExpressFmsReceiveConfirmationDetail',
    hidden: true,
    meta: {
      title: "费用确认单-详情"
    }
  },
  // 应收费用确认单-调整费用
  'ilp:bill:receipt:confirm:adjust': {
    path: '/uexpress/fms/confirmation/receive/adjust',
    component: () => import('@/views/uexpress/receiptFmsConfirmation/adjust'),
    name: 'UexpressFmsConfirmationAdjust',
    hidden: true,
    meta: {
      title: "调整费用"
    }
  },
  // 应收账单
  'ilp:bill:receipt:list': {
    component: () => import('@/views/uexpress/receiptFmsBill/receive'),
    name: 'UExpressFmsReceiveBill'
  },
  // 尾程账单导入
  'ilp:fms:bill:lastmile:import': {
    name: 'UexpressBillLastMileImport',
    component: () => import('@/views/uexpress/receiptFmsLastMileBillImport/index'),
    children: ["ilp:fms:bill:lastmile:import:detail"]
  },
  // 尾程账单导入-详情
  'ilp:fms:bill:lastmile:import:detail': {
    path: '/uexpress/fms/bill/lastMile/import/detail',
    name: 'UexpressFmsBillLastMileImportDetail',
    component: () => import('@/views/uexpress/receiptFmsLastMileBillImport/detail.vue'),
    hidden: true,
    meta: {
      title: "尾程账单导入明细"
    }
  }
}
