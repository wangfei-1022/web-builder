export const PayablePriceCardRouterMap = {
  // 费用项分类-应付
  'ilp:ap:charge:item': {
    component: () => import('@/views/uexpress/payableChargeItem/index'),
    name: 'UexpressChargeItemPayable'
  },
  // 费用项规则-应付
  'ilp:ap:charge:rules': {
    component: () => import('@/views/uexpress/payableChargeRule/index'),
    name: 'UexpressChargeRulePayable'
  },
  // 报价分区管理-应付
  'ilp:ap:charge:area': {
    component: () => import('@/views/uexpress/payableChargeArea/index'),
    name: 'UexpressChargeAreaPayable',
    children: ["ilp:ap:charge:area:list:add", "ilp:ap:charge:area:list:edit"]
  },
  // 报价分区-新增
  'ilp:ap:charge:area:list:add': {
    path: 'uexpress/ap/charge/area/add',
    component: () => import('@/views/uexpress/payableChargeArea/add'),
    name: 'UexpressChargeAreaPayableAdd',
    hidden: true,
    meta: {
      title: "报价分区新增"
    }
  },
  // 报价分区-修改
  'ilp:ap:charge:area:list:edit': {
    path: 'uexpress/ap/charge/area/edit',
    component: () => import('@/views/uexpress/payableChargeArea/edit'),
    name: 'UexpressChargeAreaPayableEdit',
    hidden: true,
    meta: {
      title: "报价分区修改"
    }
  },
  // 供应商价卡管理
  'ilp:ap:supplier:price': {
    component: () => import('@/views/uexpress/priceCardSupplier/list'),
    name: 'UexpressPriceCardSupplierPayable',
    children: [
      "ilp:ap:supplier:price:list:add",
      "ilp:ap:supplier:price:list:update",
      "ilp:ap:supplier:price:list:update:price",
      'ilp:ap:supplier:price:list:detail',
      'ilp:ap:supplier:price:list:copy:price',
      'ilp:ap:supplier:price:list:adjust:price']
  },
  // 供应商价卡管理-新建
  'ilp:ap:supplier:price:list:add': {
    path: '/uexpress/ap/price/card/supplier/add',
    component: () => import('@/views/uexpress/priceCardSupplier/add'),
    name: 'UexpressPriceCardSupplierPayableAdd',
    hidden: true,
    meta: {
      title: "供应商价卡管理-新建"
    }
  },
  // 供应商价卡管理-编辑
  'ilp:ap:supplier:price:list:update': {
    path: '/uexpress/ap/price/card/supplier/edit',
    component: () => import('@/views/uexpress/priceCardSupplier/edit'),
    name: 'UexpressPriceCardSupplierPayableEdit',
    hidden: true,
    meta: {
      title: "供应商价卡管理-编辑"
    }
  },
  // 供应商价卡管理-维护报价
  'ilp:ap:supplier:price:list:update:price': {
    path: '/uexpress/ap/price/card/supplier/edit/price',
    component: () => import('@/views/uexpress/priceCardSupplier/editPrice'),
    name: 'UexpressPriceCardSupplierPayableEditPirce',
    hidden: true,
    meta: {
      title: "供应商价卡管理-维护报价"
    }
  },
  // 供应商价卡管理-复制价卡
  'ilp:ap:supplier:price:list:copy:price': {
    path: '/uexpress/ap/price/card/supplier/copy/price',
    component: () => import('@/views/uexpress/priceCardSupplier/copyPrice'),
    name: 'UexpressPriceCardSupplierPayableCopyPrice',
    hidden: true,
    meta: {
      title: "供应商价卡管理-复制价卡"
    }
  },
  // 供应商价卡管理-调整价卡
  'ilp:ap:supplier:price:list:adjust:price': {
    path: '/uexpress/ap/price/card/supplier/adjust/price',
    component: () => import('@/views/uexpress/priceCardSupplier/adjustPrice'),
    name: 'UexpressPriceCardSupplierPayableAdjustPrice',
    hidden: true,
    meta: {
      title: "供应商价卡管理-调整价卡"
    }
  },
  // 供应商价卡管理-查看
  'ilp:ap:supplier:price:list:detail': {
    path: '/uexpress/ap/price/card/supplier/detail',
    component: () => import('@/views/uexpress/priceCardSupplier/detail'),
    name: 'UexpressPriceCardSupplierPayableDetail',
    hidden: true,
    meta: {
      title: "供应商价卡管理-详情"
    }
  },
  // 燃油费率管理-应付
  'ilp:ap:fuel:rate:list': {
    component: () => import('@/views/uexpress/payableFuelRate/index'),
    name: 'UexpressPayableFuelRateList',
    children: []
  },
}
