export const OrderRouterMap = {
  // 待审核客户列表
  // 客商里面公用的children key
  'ilp:customer:bus:audit:list': {
    component: () => import('@/views/partner/customerAudit/uexpress'),
    name: 'UexpressCustomerAuditList',
    children: ['mem:customer:audit:list:detail', 'mem:customer:audit:list:audit']
  },
  // 客户管理列表
  'ilp:ord:customer:list': {
    component: () => import('@/views/uexpress/customer/list'),
    name: 'UexpressCustomerList'
  },
  // 订单管理列表
  'ilp:ord:order:list': {
    component: () => import('@/views/uexpress/order/list'),
    name: 'UexpressOrderList',
    children: ["ilp:ord:order:list:detail"]
  },
  // 订单管理列表-详情
  'ilp:ord:order:list:detail': {
    path: '/uexpress/order/detail/:orderId/:shardingKey',
    component: () => import('@/views/uexpress/order/detail'),
    name: 'UexpressOrderDetail',
    hidden: true,
    meta: {
      title: "订单管理详情"
    }
  },
  // 批量导出数据-通过Excel导入的方式
  'ilp:ord:order:export': {
    component: () => import('@/views/uexpress/orderExcelExport/index'),
    name: 'UexpressOrderExcelExport'
  },
  // 集装箱管理
  'ilp:main:box:list': {
    component: () => import('@/views/uexpress/boxManager/list'),
    name: 'UexpressBoxList',
    children: ["ilp:main:box:list:detail"]
  },
  // 集装箱管理-详情
  'ilp:main:box:list:detail': {
    path: 'box/detail/:boxId/:shardingKey',
    component: () => import('@/views/uexpress/boxManager/boxDetail'),
    name: 'UexpressBoxDetail',
    hidden: true,
    meta: {
      title: "箱子详情"
    }
  },
  // 出库批次管理
  'ilp:main:batch:list': {
    component: () => import('@/views/uexpress/batchManager/list'),
    name: 'UexpressBatchList',
    children: ["ilp:main:batch:list:detail"]
  },
  // 出库批次管理-详情
  'ilp:main:batch:list:detail': {
    path: 'batch/detail/:outboundId/:shardingKey',
    component: () => import('@/views/uexpress/batchManager/batchDetail'),
    name: 'UexpressBatchDetail',
    hidden: true,
    meta: {
      title: "出库批次详情"
    }
  },
  // 提单管理
  'ilp:main:bl:list': {
    component: () => import('@/views/uexpress/blManager/list'),
    name: 'UexpressBLList",',
    children: ["ilp:main:bl:list:detail"]
  },
  // 提单管理-详情
  'ilp:main:bl:list:detail': {
    path: '/uexpress/bl/detail/:blId',
    component: () => import('@/views/uexpress/blManager/blDetail'),
    name: 'UexpressBLDetail',
    hidden: true,
    meta: {
      title: "提单详情"
    }
  }
}
