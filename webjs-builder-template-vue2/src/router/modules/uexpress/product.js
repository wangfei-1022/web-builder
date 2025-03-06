export const ProductRouterMap = {
  // 供应商服务产品管理
  'ilp:chl:supplier:product:supply': {
    component: () => import('@/views/uexpress/supplierProductSupply/index'),
    name: 'SupplierProductSupply'
  },
  // 渠道分区
  'ilp:chl:area:list': {
    component: () => import('@/views/uexpress/channelArea/index'),
    name: 'ChannelAreaList',
    children: ["ilp:chl:area:list:add", "ilp:chl:area:list:edit"]
  },
  // 渠道分区-新增
  'ilp:chl:area:list:add': {
    path: 'channel/area/add',
    component: () => import('@/views/uexpress/channelArea/add'),
    name: 'ChannelAreaAdd',
    hidden: true,
    meta: {
      title: "渠道分区新增"
    }
  },
  // 渠道分区-修改
  'ilp:chl:area:list:edit': {
    path: 'channel/area/edit',
    component: () => import('@/views/uexpress/channelArea/edit'),
    name: 'ChannelAreaEdit',
    hidden: true,
    meta: {
      title: "渠道分区修改"
    }
  },
  // 渠道管理
  'ilp:chl:list': {
    component: () => import('@/views/uexpress/channelList/index'),
    name: 'UexpressChannelList',
    children: ["ilp:chl:list:add", "ilp:chl:list:edit"]
  },
  // 渠道管理-新增
  'ilp:chl:list:add': {
    path: 'channel/list/add',
    component: () => import('@/views/uexpress/channelList/add'),
    name: 'UexpressChannelListAdd',
    hidden: true,
    meta: {
      title: "渠道新增"
    }
  },
  // 渠道管理-修改
  'ilp:chl:list:edit': {
    path: 'channel/list/edit',
    component: () => import('@/views/uexpress/channelList/edit'),
    name: 'UexpressChannelListEdit',
    hidden: true,
    meta: {
      title: "渠道修改"
    }
  },
  // 产品分区
  'ilp:prd:area:list': {
    component: () => import('@/views/uexpress/productArea/index'),
    name: 'ProductAreaList',
    children: ["ilp:prd:area:list:add", "ilp:prd:area:list:edit"]
  },
  // 产品分区-新增
  'ilp:prd:area:list:add': {
    path: 'product/area/add',
    component: () => import('@/views/uexpress/productArea/add'),
    name: 'ProductAreaAdd',
    hidden: true,
    meta: {
      title: "产品分区新增"
    }
  },
  // 产品分区-修改
  'ilp:prd:area:list:edit': {
    path: 'area/product/edit',
    component: () => import('@/views/uexpress/productArea/edit'),
    name: 'ProductAreaEdit',
    hidden: true,
    meta: {
      title: "产品分区修改"
    }
  },
  // 产品线路管理
  'ilp:prd:line:list': {
    component: () => import('@/views/uexpress/productLine/index'),
    name: 'ProductLineList',
    children: ["ilp:prd:line:list:detail"]
  },
  // 产品线路管理-详情
  'ilp:prd:line:list:detail': {
    path: 'product/line/detail',
    component: () => import('@/views/uexpress/productLine/detail'),
    name: 'ProductLineDetail',
    hidden: true,
    meta: {
      title: "产品线路详情"
    }
  },
  // 服务产品管理
  'ilp:prd:sales:list': {
    component: () => import('@/views/uexpress/productSales/index'),
    name: 'ProductSalesList',
    children: ["ilp:prd:sales:list:add", "ilp:prd:sales:list:edit"]
  },
  // 服务产品管理-新增
  'ilp:prd:sales:list:add': {
    path: 'product/sales/add',
    component: () => import('@/views/uexpress/productSales/add'),
    name: 'ProductSalesAdd',
    hidden: true,
    meta: {
      title: "服务产品新增"
    }
  },
  // 服务产品管理-修改
  'ilp:prd:sales:list:edit': {
    path: 'product/sales/edit',
    component: () => import('@/views/uexpress/productSales/edit'),
    name: 'ProductSalesEdit',
    hidden: true,
    meta: {
      title: "服务产品修改"
    }
  }
}
