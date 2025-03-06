export const UexpressPayableBillRouterMap = {
  // 应付费用明细
  'ilp:ap:charge:list': {
    component: () => import('@/views/uexpress/payableFmsCharge/index'),
    name: 'UExpressPayableFmsChargeList',
    children: ["ilp:ap:fms:charge:detail", "ilp:ap:fms:charge:adjust"]
  },
  // 应付费用明细-详情
  'ilp:ap:fms:charge:detail': {
    path: '/uexpress/ap/fms/charge/payable/detail',
    component: () => import('@/views/uexpress/payableFmsCharge/detail'),
    name: 'UexpressPayableFmsChargeDetail',
    hidden: true,
    meta: {
      title: "应付费用明细-详情"
    }
  },
  // 应付费用明细-调整费用
  'ilp:ap:fms:charge:adjust': {
    path: '/uexpress/ap/fms/charge/payable/adjust',
    component: () => import('@/views/uexpress/payableFmsCharge/adjust'),
    name: 'UexpressPayableFmsChargeAdjust',
    hidden: true,
    meta: {
      title: "应付费用明细-调整"
    }
  },
  // 应付费用确认单
  'ilp:ap:confirmation:list': {
    component: () => import('@/views/uexpress/payableFmsConfirmation/index'),
    name: 'UExpressPayableFmsConfirmationList',
    children: ['ilp:ap:fms:confirmation:detail']
  },
  // 应付费用明细-详情
  'ilp:ap:fms:confirmation:detail': {
    path: '/uexpress/ap/fms/confirmation/payable/detail',
    component: () => import('@/views/uexpress/payableFmsConfirmation/detail'),
    name: 'UexpressPayableFmsConfirmationDetail',
    hidden: true,
    meta: {
      title: "应付费用确认单-详情"
    }
  },
  // // 应付账单
  // 'ilp:ap:bill:list': {
  //   component: () => import('@/views/uexpress/payableFmsBill/receive'),
  //   name: 'UExpressFmsPayableBill'
  // },
  // 尾程账单导入
  'ilp:ap:bill:lastMile:import': {
    name: 'UexpressPayableFmsLastMileBillImport',
    component: () => import('@/views/uexpress/payableFmsLastMileBillImport/index'),
    children: ["ilp:ap:bill:lastMile:import:detail"]
  },
  // 尾程账单导入-详情
  'ilp:ap:bill:lastMile:import:detail': {
    path: '/uexpress/ap/fms/bill/lastMile/import/detail',
    name: 'UexpressPayableFmsLastMileBillImportDetail',
    component: () => import('@/views/uexpress/payableFmsLastMileBillImport/detail.vue'),
    hidden: true,
    meta: {
      title: "尾程账单导入-详情"
    }
  },
  // 尾程账单导入-导入之后的账单
  'ilp:ap:bill:lastMile:list': {
    name: 'UexpressPayableFmsBillLastMileList',
    component: () => import('@/views/uexpress/payableFmsLastMileBillList/index'),
    children: ["ilp:ap:bill:lastMile:list:detail"]
  },
  // 尾程账单导入-导入之后的账单-详情
  'ilp:ap:bill:lastMile:list:detail': {
    path: '/uexpress/ap/fms/bill/lastMile/list/detail',
    name: 'UexpressPayableFmsBillLastMileListDetail',
    component: () => import('@/views/uexpress/payableFmsLastMileBillList/detail.vue'),
    hidden: true,
    meta: {
      title: "尾程账单管理-详情"
    }
  },
  // 供应商计费重规则
  'ilp:ap:supplier:weight:rule': {
    name: 'UexpressPayableSupplierChargeableWeightRule',
    component: () => import('@/views/uexpress/payableSupplierChargeableWeightRule/index'),
    children: ["ilp:ap:supplier:weight:rule:add"]
  }
}
