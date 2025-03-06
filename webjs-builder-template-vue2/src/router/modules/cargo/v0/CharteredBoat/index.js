import Layout from '@/layout'

const CharteredBoatRouteMap = {
  // 包船业务
  'cas:order': {
    component: Layout,
    alwaysShow: true,
    name: 'CharteredBoat'
  },
  // 船期信息列表
  'cas:etd:list': {
    component: () => import('@/views/cargo/v0/CharteredBoat/ETDList'),
    name: 'ETDList',
    children: ['cas:etd:list:info']
  },
  // 订舱信息列表
  'cas:booking:list': {
    component: () => import('@/views/cargo/v0/CharteredBoat/booking'),
    name: 'Booking'
  },
  // 提单信息列表
  'cas:bl:list': {
    component: () => import('@/views/cargo/v0/CharteredBoat/BillList'),
    name: 'BLList',
    children: ['cas:bl:list:info']
  },
  // 箱货信息列表
  'cas:container:list': {
    component: () => import('@/views/cargo/v0/CharteredBoat/ContainerList'),
    name: 'ContainerList'
  },
  // 车队预约记录
  'cas:fleet:list': {
    component: () => import('@/views/cargo/v0/CharteredBoat/FleetList'),
    name: 'FleetList'
  },
  // 改单申请列表
  'cas:change:order:list': {
    component: () => import('@/views/cargo/v0/CharteredBoat/ChangeOrderList'),
    name: 'ChangeOrderList'
  },
  // 集装箱作业记录
  'cas:container:transfer': {
    component: () => import('@/views/cargo/v0/CharteredBoat/containerTransfer'),
    name: 'containerTransfer'
  },
  // AMS申报信息列表
  'cas:ams:list': {
    component: () => import('@/views/cargo/v0/CharteredBoat/AMSList'),
    name: 'AMSList',
    children: ['cas:ams:list:bill']
  },
  'cas:release:business:list': {
    path: '/CharteredBoat/ReleaseBillListBusiness',
      component: () => import('@/views/cargo/v0/CharteredBoat/ReleaseBillListBusiness'),
    name: 'ReleaseBillListBusiness'
    // meta: { title: '放单管理列表(商务)', }
  },
  'cas:release:operate:list': {
    path: 'ReleaseBillListOperate',
      component: () => import('@/views/cargo/v0/CharteredBoat/ReleaseBillListOperate'),
    name: 'ReleaseBillListOperate'
    // meta: { title: '放单管理列表(运营)', noCache: true }
  },
  'cas:pre:manifest:list': {
    path: 'PreManifestList',
    component: () => import('@/views/cargo/v0/CharteredBoat/preManifestList'),
    name: 'PreManifestList',
    children: ['cas:pre:manifest:list:info']
  },

  // 详情
  'cas:etd:list:info': {
    path: 'ETDInfo',
    component: () => import('@/views/cargo/v0/CharteredBoat/ETDInfo'),
    name: 'ETDInfo',
    hidden: true,
    meta: { title: '船期信息列表维护', keepAlive: true }
  },
  'cas:bl:list:info': {
    path: 'BlInfo',
    component: () => import('@/views/cargo/v0/CharteredBoat/BlInfo'),
    name: 'BLInfo',
    hidden: true,
    meta: { title: '提单信息详情' }
  },
  'cas:ams:list:bill': {
    path: 'BillAMS',
    component: () => import('@/views/cargo/v0/CharteredBoat/BillAMS'),
    name: 'BillAMS',
    hidden: true,
    meta: { title: 'AMS申报' }
  },
  'cas:pre:manifest:list:info': {
    path: 'PreManifestInfo',
    component: () => import('@/views/cargo/v0/CharteredBoat/preManifestInfo'),
    name: 'PreManifestInfo',
    hidden: true,
    meta: { title: '舱单申报' }
  }
}

export default CharteredBoatRouteMap
