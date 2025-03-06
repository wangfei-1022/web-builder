import Layout from '@/layout'

const ContainerManagerRouterMap = {
  // 集装箱信息管理
  'ctn:container': {
    component: Layout,
    name: 'ContainerManager'
  },
  // 交易订单列表
  'ctn:order:list': {
    component: () => import('@/views/cargo/v0/ContainerManager/OrderList'),
    name: 'OrderList',
    children: ['ctn:order:list:detail']
  },
  // 集装箱信息列表
  'ctn:info:list': {
    component: () => import('@/views/cargo/v0/ContainerManager/InfoList'),
    name: 'InfoList',
    children: ['ctn:info:list:detail']
  },
  // 租借信息列表
  'ctn:lease:list': {
    component: () => import('@/views/cargo/v0/ContainerManager/LeaseList'),
    name: 'LeaseList',
    children: ['ctn:lease:list:lease', 'ctn:lease:list:loan']
  },
  // 箱动态列表
  'ctn:status:log:list': {
    component: () => import('@/views/cargo/v0/ContainerManager/DynamicList'),
    name: 'DynamicList',
    children: ['ctn:status:log:list:update', 'ctn:status:log:list:detail', 'ctn:status:log:list:list']
  },
  // 在场列表
  'ctn:status:log:inyardList': {
    component: () => import('@/views/cargo/v0/ContainerManager/InsideYardList'),
    name: 'InsideYardList'
  },
  // 场外列表
  'ctn:status:log:outyardList': {
    component: () => import('@/views/cargo/v0/ContainerManager/OutsideYardList'),
    name: 'OutsideYardList'
  },
  // 在船列表
  'ctn:status:log:onboardList': {
    component: () => import('@/views/cargo/v0/ContainerManager/OnBoatList'),
    name: 'OnBoatList'
  },
  // 放箱列表
  'ctn:release:list': {
    component: () => import('@/views/cargo/v0/ContainerManager/ReleasedList'),
    name: 'ReleasedList',
    children: ['ctn:release:list:views', 'ctn:release:list:edit']
  },
  // 报文解析日志
  'ctn:analyze:log:list': {
    component: () => import('@/views/cargo/v0/ContainerManager/AnalyzeLog'),
    name: 'AnalyzeLog',
    noCache: true
  },
  'ctn:reject:log:list': {
    component: () => import('@/views/cargo/v0/ContainerManager/DynamicRejectList'),
    name: 'DynamicRejectList',
    noCache: true,
    children: ['ctn:reject:log:modify']
  },
  // 详情页
  'ctn:order:list:detail': {
    path: 'orderDetail/:operate?/:id?',
    component: () => import('@/views/cargo/v0/ContainerManager/OrderDetail'),
    name: 'OrderDetail',
    hidden: true,
    meta: { title: '交易订单详情', noCache: true}
  },
  'ctn:info:list:detail': {
    path: 'infoDetail/:editType?/:id?',
    component: () => import('@/views/cargo/v0/ContainerManager/InfoDetail'),
    name: 'InfoDetail',
    hidden: true,
    meta: { title: '集装箱信息详情', noCache: true}
  },
  'ctn:lease:list:lease': {
    path: 'leaseDetail/:editType?/:orderType?/:id?',
    component: () => import('@/views/cargo/v0/ContainerManager/LeaseDetail'),
    name: 'LeaseDetail',
    hidden: true,
    meta: { title: '租入信息详情', noCache: true}
  },
  'ctn:lease:list:loan': {
    path: 'loanDetail/:editType?/:orderType?/:id?',
    component: () => import('@/views/cargo/v0/ContainerManager/LoanDetail'),
    name: 'LoanDetail',
    hidden: true,
    meta: { title: '借出信息详情', noCache: true}
  },
  'ctn:status:log:list:update': {
    path: 'upgradeDynamic/:id',
    component: () => import('@/views/cargo/v0/ContainerManager/DynamicUpgrade'),
    name: 'UpgradeDynamic',
    hidden: true,
    meta: { title: '更新箱动态'}
  },
  'ctn:status:log:list:detail': {
    path: 'viewDynamicSubDetail/:type/:yard/:code',
    component: () => import('@/views/cargo/v0/ContainerManager/ViewDynamicSubDetail'),
    name: 'ViewDynamicSubDetail',
    hidden: true,
    meta: { title: '箱动态详情', noCache: true}
  },
  'ctn:status:log:list:list': {
    path: 'viewContainerList/:viewType',
    component: () => import('@/views/cargo/v0/ContainerManager/ViewContainerList'),
    name: 'ViewContainerList',
    meta: { title: '查看集装箱列表', noCache: true},
    hidden: true
  },
  'ctn:release:list:views': {
    path: 'viewReleasedDetail/:sailScheduleId',
    component: () => import('@/views/cargo/v0/ContainerManager/ViewReleasedDetail'),
    name: 'ViewReleasedDetail',
    hidden: true,
    meta: { title: '放箱详情查看', noCache: true}
  },
  'ctn:release:list:edit': {
    path: 'modifyReleasedInfo/:sailScheduleId',
    component: () => import('@/views/cargo/v0/ContainerManager/ModifyReleasedInfo'),
    name: 'ModifyReleasedInfo',
    hidden: true,
    meta: { title: '放箱编辑', noCache: true}
  },
  'ctn:reject:log:modify': {
    path: 'daynamicRejectModify/:id',
    component: () => import('@/views/cargo/v0/ContainerManager/DynamicRejectModify'),
    name: 'DynamicRejectModify',
    hidden: true,
    meta: { title: '拒绝放箱编辑', noCache: true}
  }
}

export default ContainerManagerRouterMap
