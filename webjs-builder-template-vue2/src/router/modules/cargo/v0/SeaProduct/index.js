import Layout from '@/layout'

export const SeaProductRouterMap = {
  // 海运询盘单
  'sea:product': {
    component: Layout,
    alwaysShow: true,
    name: 'seaProduct'
  },

  'sea:productSubscription:list': {
    component: () => import('@/views/cargo/v0/SeaProduct/productSubscription/list'),
    name: 'SeaProductSubscriptionList',
    children: ['sea:productSubscription:detail', 'sea:productSubscription:add', 'sea:productSubscription:edit']
  },

  // 详情
  'sea:productSubscription:detail': {
    path: 'SeaProductSubscription/detail',
    component: () => import('@/views/cargo/v0/SeaProduct/productSubscription/detail'),
    name: 'SeaProductSubscriptionDetail',
    hidden: true,
    meta: { title: '订阅详情'}
  },

  // 新增
  'sea:productSubscription:add': {
    path: 'SeaProductSubscription/add',
    component: () => import('@/views/cargo/v0/SeaProduct/productSubscription/add'),
    name: 'SeaProductSubscriptionAdd',
    hidden: true,
    meta: { title: '新增订阅'}
  },
  // 编辑
  'sea:productSubscription:edit': {
    path: 'SeaProductSubscription/edit',
    component: () => import('@/views/cargo/v0/SeaProduct/productSubscription/edit'),
    name: 'SeaProductSubscriptionEdit',
    hidden: true,
    meta: { title: '编辑订阅'}
  },
  // 海运运价查询
  'sea:productPriceQuery:list': {
    component: () => import('@/views/cargo/v0/SeaProduct/productPriceQuery/list'),
    name: 'SeaProductPriceQueryList'
  },

  // 海运产品线路管理
  'sea:productLine:list': {
    component: () => import('@/views/cargo/v0/SeaProduct/productLine/list'),
    name: 'SeaProductLineList'
  },

    // 海运运费成本价卡 sea:productPriceCard:list
  'sea:productPriceCard:list': {
    component: () => import('@/views/cargo/v0/SeaProduct/productPriceCard/list'),
    name: 'SeaProductPriceCardList',
    children: ['sea:productPriceCard:add', 'sea:productPriceCard:edit', 'sea:productPriceCard:view']
  },
  // 新增
  'sea:productPriceCard:add': {
    path: 'SeaProductPriceCard/add',
    component: () => import('@/views/cargo/v0/SeaProduct/productPriceCard/add'),
    name: 'SeaProductPriceCardAdd',
    hidden: true,
    meta: { title: '新增价卡'}
  },
  // 修改
  'sea:productPriceCard:edit': {
    path: 'SeaProductPriceCard/edit',
    component: () => import('@/views/cargo/v0/SeaProduct/productPriceCard/edit'),
    name: 'SeaProductPriceCardEdit',
    hidden: true,
    meta: { title: '修改价卡'}
  },
  // 详情
  'sea:productPriceCard:view': {
    path: 'SeaProductPriceCard/view',
    component: () => import('@/views/cargo/v0/SeaProduct/productPriceCard/view'),
    name: 'SeaProductPriceCardView',
    hidden: true,
    meta: { title: '价卡详情'}
  },

  // 海运船期管理 sea:productSailSchedule:list
  'sea:productSailSchedule:list': {
    component: () => import('@/views/cargo/v0/SeaProduct/productSailSchedule/list'),
    name: 'SeaProductSailScheduleList'
  },

  // 海运附加费价卡管理 sea:productExtraPriceCard:list
  'sea:productExtraPriceCard:list': {
    component: () => import('@/views/cargo/v0/SeaProduct/productExtraPriceCard/list'),
    name: 'SeaProductExtraPriceCardList',
    children: ['sea:productExtraPriceCard:add', 'sea:productExtraPriceCard:edit', 'sea:productExtraPriceCard:detail']
  },
  // 新增
  'sea:productExtraPriceCard:add': {
    path: 'productExtraPriceCard/add',
    component: () => import('@/views/cargo/v0/SeaProduct/productExtraPriceCard/add'),
    name: 'SeaExtraProductPriceCardAdd',
    hidden: true,
    meta: { title: '新增附加费价卡'}
  },
  // 修改
  'sea:productExtraPriceCard:edit': {
    path: 'productExtraPriceCard/edit',
    component: () => import('@/views/cargo/v0/SeaProduct/productExtraPriceCard/edit'),
    name: 'SeaExtraProductPriceCardEdit',
    hidden: true,
    meta: { title: 'priceCardDetailEdit'}
  },
  // 详情
  'sea:productExtraPriceCard:detail': {
    path: 'productExtraPriceCard/detail',
    component: () => import('@/views/cargo/v0/SeaProduct/productExtraPriceCard/detail'),
    name: 'SeaExtraProductPriceCardDetail',
    hidden: true,
    meta: { title: 'priceCardDetail'}
  }
}
