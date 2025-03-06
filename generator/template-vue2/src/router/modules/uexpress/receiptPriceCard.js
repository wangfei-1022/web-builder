export const ReceiptPriceCardRouterMap = {
  // 费用项分类-应收
  'ilp:ar:charge:item:list': {
    component: () => import('@/views/uexpress/receiptChargeItem/index'),
    name: 'UexpressChargeItemReceipt'
  },
  // 费用项规则-应收
  'ilp:ar:charge:rules:list': {
    component: () => import('@/views/uexpress/receiptChargeRule/index'),
    name: 'UexpressChargeRuleReceipt'
  },
  // 报价分区管理-应收
  'ilp:ar:price:area:list': {
    component: () => import('@/views/uexpress/receiptChargeArea/index'),
    name: 'UexpressChargeAreaReceipt',
    children: ["ilp:ar:price:area:list:add", "ilp:ar:price:area:list:edit"]
  },
  // 报价分区-新增
  'ilp:ar:price:area:list:add': {
    path: 'uexpress/ar/charge/area/add',
    component: () => import('@/views/uexpress/receiptChargeArea/add'),
    name: 'UexpressChargeAreaReceiptAdd',
    hidden: true,
    meta: {
      title: "报价分区新增"
    }
  },
  // 报价分区-修改
  'ilp:ar:price:area:list:edit': {
    path: 'uexpress/ar/charge/area/edit',
    component: () => import('@/views/uexpress/receiptChargeArea/edit'),
    name: 'UexpressChargeAreaReceiptEdit',
    hidden: true,
    meta: {
      title: "报价分区修改"
    }
  },
  // 价卡模板管理-应收
  'ilp:ar:price:template:list': {
    component: () => import('@/views/uexpress/priceCardTemplate/index'),
    name: 'UexpressPriceCardTemplateReceipt',
    children: ["ilp:ar:price:template:list:add", "ilp:ar:price:template:list:update", "ilp:ar:price:template:list:detail"]
  },
  // 价卡模板管理-新建-应收
  'ilp:ar:price:template:list:add': {
    path: '/uexpress/ar/charge/template/list/add',
    component: () => import('@/views/uexpress/priceCardTemplate/add'),
    name: 'UexpressPriceCardTemplateReceiptAdd',
    hidden: true,
    meta: {
      title: "价卡模板管理-新建"
    }
  },
  // 价卡模板管理-编辑-应收
  'ilp:ar:price:template:list:update': {
    path: '/uexpress/ar/charge/template/list/edit',
    component: () => import('@/views/uexpress/priceCardTemplate/edit'),
    name: 'UexpressPriceCardTemplateReceiptEdit',
    hidden: true,
    meta: {
      title: "价卡模板管理-编辑"
    }
  },
  // 价卡模板管理-查看详情-应收
  'ilp:ar:price:template:list:detail': {
    path: '/uexpress/ar/charge/template/list/detail',
    component: () => import('@/views/uexpress/priceCardTemplate/detail'),
    name: 'UexpressPriceCardTemplateReceiptDetail',
    hidden: true,
    meta: {
      title: "价卡模板管理-详情"
    }
  },
  // 公布价管理-产品
  'ilp:ar:price:publish:product:list': {
    component: () => import('@/views/uexpress/priceCardPublish/product'),
    name: 'UexpressPriceCardPublishProductReceipt',
    children: [
      "ilp:ar:price:publish:list:add",
      "ilp:ar:price:publish:list:update",
      "ilp:ar:price:publish:list:update:price",
      'ilp:ar:price:publish:list:detail',
      'ilp:ar:price:publish:list:copy:price',
      'ilp:ar:price:publish:list:adjust:price']
  },
  // 公布价查询-销售
  'ilp:ar:price:publish:sale:list': {
    component: () => import('@/views/uexpress/priceCardPublish/sale'),
    name: 'UexpressPriceCardPublishSaleReceipt'
  },
  // 公布价-新建
  'ilp:ar:price:publish:list:add': {
    path: '/uexpress/ar/price/card/publish/add',
    component: () => import('@/views/uexpress/priceCardPublish/add'),
    name: 'UexpressPriceCardPublishReceiptAdd',
    hidden: true,
    meta: {
      title: "公布价-新建"
    }
  },
  // 公布价-编辑
  'ilp:ar:price:publish:list:update': {
    path: '/uexpress/ar/price/card/publish/edit',
    component: () => import('@/views/uexpress/priceCardPublish/edit'),
    name: 'UexpressPriceCardPublishReceiptEdit',
    hidden: true,
    meta: {
      title: "公布价-编辑"
    }
  },
  // 公布价-维护报价
  'ilp:ar:price:publish:list:update:price': {
    path: '/uexpress/ar/price/card/publish/edit/price',
    component: () => import('@/views/uexpress/priceCardPublish/editPrice'),
    name: 'UexpressPriceCardPublishReceiptEditPirce',
    hidden: true,
    meta: {
      title: "公布价-维护报价"
    }
  },
  // 公布价-复制价卡
  'ilp:ar:price:publish:list:copy:price': {
    path: '/uexpress/ar/price/card/publish/copy/price',
    component: () => import('@/views/uexpress/priceCardPublish/copyPrice'),
    name: 'UexpressPriceCardPublishReceiptCopyPrice',
    hidden: true,
    meta: {
      title: "公布价-复制价卡"
    }
  },
  // 公布价-调整价卡
  'ilp:ar:price:publish:list:adjust:price': {
    path: '/uexpress/ar/price/card/publish/adjust/price',
    component: () => import('@/views/uexpress/priceCardPublish/adjustPrice'),
    name: 'UexpressPriceCardPublishReceiptAdjustPrice',
    hidden: true,
    meta: {
      title: "公布价-调整价卡"
    }
  },
  // 公布价-查看
  'ilp:ar:price:publish:list:detail': {
    path: '/uexpress/ar/price/card/publish/detail',
    component: () => import('@/views/uexpress/priceCardPublish/detail'),
    name: 'UexpressPriceCardPublishReceiptDetail',
    hidden: true,
    meta: {
      title: "公布价-详情"
    }
  },
  // 客户价卡管理（产品）-应收
  'ilp:ar:customer:price:product:list': {
    component: () => import('@/views/uexpress/priceCardCustomer/product'),
    name: 'UexpressPriceCardCustomerProductReceipt',
    children: [
      "ilp:ar:price:customer:list:add",
      "ilp:ar:price:customer:list:update",
      "ilp:ar:price:customer:list:update:price",
      'ilp:ar:price:customer:list:detail',
      'ilp:ar:price:customer:list:adjust:price']
  },
  // 客户价卡管理（销售）-应收
  'ilp:ar:customer:price:sale:list': {
    component: () => import('@/views/uexpress/priceCardCustomer/sale'),
    name: 'UexpressPriceCardCustomerSaleReceipt',
    children: [
      "ilp:ar:price:customer:list:add",
      "ilp:ar:price:customer:list:update",
      "ilp:ar:price:customer:list:update:price",
      'ilp:ar:price:customer:list:detail',
      'ilp:ar:price:customer:list:adjust:price']
  },
  // 客户价卡-新建
  'ilp:ar:price:customer:list:add': {
    path: '/uexpress/ar/price/card/customer/add',
    component: () => import('@/views/uexpress/priceCardCustomer/add'),
    name: 'UexpressPriceCardCustomerReceiptAdd',
    hidden: true,
    meta: {
      title: "客户价卡-新建"
    }
  },
  // 客户价卡-编辑
  'ilp:ar:price:customer:list:update': {
    path: '/uexpress/ar/price/card/customer/edit',
    component: () => import('@/views/uexpress/priceCardCustomer/edit'),
    name: 'UexpressPriceCardCustomerReceiptEdit',
    hidden: true,
    meta: {
      title: "客户价卡-编辑"
    }
  },
  // 客户价卡-维护报价
  'ilp:ar:price:customer:list:update:price': {
    path: '/uexpress/ar/price/card/customer/edit/price',
    component: () => import('@/views/uexpress/priceCardCustomer/editPrice'),
    name: 'UexpressPriceCardCustomerReceiptEditPirce',
    hidden: true,
    meta: {
      title: "客户价卡-维护报价"
    }
  },
  // 客户价卡-维护报价-调整价卡
  'ilp:ar:price:customer:list:adjust:price': {
    path: '/uexpress/ar/price/card/customer/adjust/price',
    component: () => import('@/views/uexpress/priceCardCustomer/adjustPrice'),
    name: 'UexpressPriceCardCustomerReceiptAdjustPirce',
    hidden: true,
    meta: {
      title: "客户价卡-调整价卡"
    }
  },
  // 客户价卡-详情
  'ilp:ar:price:customer:list:detail': {
    path: '/uexpress/ar/price/card/customer/detail',
    component: () => import('@/views/uexpress/priceCardCustomer/detail'),
    name: 'UexpressPriceCardCustomerReceiptDetail',
    hidden: true,
    meta: {
      title: "客户价卡-详情"
    }
  },
  // 纯尾程客户价卡管理-产品
  'ilp:ar:customer:price:last:product:list': {
    component: () => import('@/views/uexpress/priceCardCustomerLast/product'),
    name: 'UexpressPriceCardCustomerLastProductReceipt',
    children: [
      "ilp:ar:price:customer:last:list:add",
      "ilp:ar:price:customer:last:list:update",
      "ilp:ar:price:customer:last:list:update:price",
      'ilp:ar:price:customer:last:list:detail',
      'ilp:ar:price:customer:last:list:copy:price',
      'ilp:ar:price:customer:last:list:adjust:price']
  },
  // 纯尾程客户价卡查询-销售
  'ilp:ar:customer:price:last:sale:list': {
    component: () => import('@/views/uexpress/priceCardCustomerLast/sale'),
    name: 'UexpressPriceCardCustomerLastSaleReceipt',
    children: [
      "ilp:ar:price:customer:last:list:add",
      "ilp:ar:price:customer:last:list:update",
      "ilp:ar:price:customer:last:list:update:price",
      'ilp:ar:price:customer:last:list:detail',
      'ilp:ar:price:customer:last:list:copy:price',
      'ilp:ar:price:customer:last:list:adjust:price']
  },
  // 纯尾程客户价卡-新建
  'ilp:ar:price:customer:last:list:add': {
    path: '/uexpress/ar/price/card/customer/last/add',
    component: () => import('@/views/uexpress/priceCardCustomerLast/add'),
    name: 'UexpressPriceCardCustomerLastReceiptAdd',
    hidden: true,
    meta: {
      title: "客户价卡-新建"
    }
  },
  // 纯尾程客户价卡-编辑
  'ilp:ar:price:customer:last:list:update': {
    path: '/uexpress/ar/price/card/customer/last/edit',
    component: () => import('@/views/uexpress/priceCardCustomerLast/edit'),
    name: 'UexpressPriceCardCustomerLastReceiptEdit',
    hidden: true,
    meta: {
      title: "客户价卡-编辑"
    }
  },
  // 纯尾程客户价卡-维护报价
  'ilp:ar:price:customer:last:list:update:price': {
    path: '/uexpress/ar/price/card/customer/last/edit/price',
    component: () => import('@/views/uexpress/priceCardCustomerLast/editPrice'),
    name: 'UexpressPriceCardCustomerLastReceiptEditPirce',
    hidden: true,
    meta: {
      title: "客户价卡-维护报价"
    }
  },
  // 纯尾程客户价卡-复制价卡
  'ilp:ar:price:customer:last:list:copy:price': {
    path: '/uexpress/ar/price/card/customer/last/copy/price',
    component: () => import('@/views/uexpress/priceCardCustomerLast/copyPrice'),
    name: 'UexpressPriceCardCustomerLastReceiptCopyPrice',
    hidden: true,
    meta: {
      title: "客户价卡-复制价卡"
    }
  },
  // 纯尾程客户价卡-调整价卡
  'ilp:ar:price:customer:last:list:adjust:price': {
    path: '/uexpress/ar/price/card/customer/last/adjust/price',
    component: () => import('@/views/uexpress/priceCardCustomerLast/adjustPrice'),
    name: 'UexpressPriceCardCustomerLastReceiptAdjustPrice',
    hidden: true,
    meta: {
      title: "客户价卡-调整价卡"
    }
  },
  // 纯尾程客户价卡-查看
  'ilp:ar:price:customer:last:list:detail': {
    path: '/uexpress/ar/price/card/customer/last/detail',
    component: () => import('@/views/uexpress/priceCardCustomerLast/detail'),
    name: 'UexpressPriceCardCustomerLastReceiptDetail',
    hidden: true,
    meta: {
      title: "客户价卡-详情"
    }
  },
  // 燃油费率管理-应收
  'ilp:ar:fuel:rate:list': {
    component: () => import('@/views/uexpress/receiptFuelRate/index'),
    name: 'UexpressReceiptFuelRateList',
    children: []
  },
}
