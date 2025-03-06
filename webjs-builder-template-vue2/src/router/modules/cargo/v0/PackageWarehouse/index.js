import Layout from '@/layout'

const PackageWarehouseMap = {
  'ilw:manage': {
    component: Layout,
    name: 'PackageWarehouse'
  },
  // 交易订单列表
  'ilw:parcel:list': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/orderList'),
    mete: {noCache: false},
    name: 'PackageOrderList',
    children: ['ilw:parcel:list:detail']
  },
  // 揽收操作
  'ilw:parcel:received': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/packageReceived'),
    mete: {noCache: false},
    name: 'PackageReceived'
  },
  // 入库管理
  'ilw:parcel:inbound': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/packageCheckin'),
    mete: {noCache: false},
    name: 'PackageCheckin'
  },
  // 出库管理
  'ilw:parcel:outbound': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/packageCheckout'),
    mete: {noCache: false},
    name: 'PackageCheckout'
  },
  // 快进快出
  'ilw:parcel:inboundBox': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/quicklyInQuicklyOut'),
    mete: {noCache: false},
    name: 'QuicklyInQuicklyOut'
  },
  // 二次称重
  'ilw:parcel:secondInbound': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/secondaryMatch'),
    mete: {noCache: false},
    name: 'SecondaryMatch'
  },
  // 装箱管理
  'ilw:box:list': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/boxList'),
    mete: {noCache: false},
    name: 'BoxList',
    children: ['ilw:box:list:detail', 'ilw:box:nubmer:print']
  },
  // 渠道列表
  'ilw:product:list': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/channelList'),
    name: 'ChannelList'
  },
  // 扣件管理
  'ilw:lockInfo:list': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/distrainList'),
    mete: {noCache: false},
    name: 'DistrainList'
  },
  // 仓库管理
  'ilw:warehouse:list': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/warehouseList'),
    name: 'PackageWarehouseList'
  },
  // 仓库工作人员
  'ilw:warehousePerson:list': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/employeeList'),
    name: 'EmployeeList'
  },
  // 仓库差异配置
  'ilw:memberSetting:list': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/weightDiscrepancy'),
    name: 'WeightDiscrepancy'
  },
  // 待办事项
  'ilw:schedule:list': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/scheduleList'),
    name: 'ScheduleList',
    children: ['ilw:schedule:list:detail']
  },
  // 提单列表
  'ilw:planBill:list': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/billList'),
    name: 'BillList'
  },
  // 仓库发运计划
  'ilw:plan:list': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/planList'),
    name: 'PlanList',
    children: ['ilw:plan:list:create']
  },
  // 批次监控
  'ilw:batch:list': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/batchManager'),
    name: 'BatchManager',
    children: ['ilw:batch:list:box', 'ilw:batch:list:order']
  },
  // 外部订单管理
  'ilw:agentParcel:list': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/agentParcelManager'),
    name: 'AgentParcelManager',
    children: ['ilw:agentParcel:list:detail']
  },
  // 外部揽收操作
  'ilw:agentParcel:received': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/agentParcelRecived'),
    name: 'AgentParcelRecived'
  },
  // 换箱操作
  'ilw:parcel:swapBox': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/packageChange'),
    name: 'SwapBox'
  },
  // 一票一箱
  'ilw:parcel:inBoxPerOrder': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/boxPerOrder'),
    name: 'BoxPerOrder'
  },
  'ilw:boxPrediction:weightBySteelyard': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/largePackageCheckin'),
    name: 'LargePackageCheckin'
  },
  'ilw:boxPrediction:list': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/largePackageList'),
    name: 'LargePackageList'
  },
  // 仓库调拨
  'ilw:requisition:scan': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/transferred'),
    name: 'Transferred'
  },
  // 调拨列表
  'ilw:requisition:list': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/transferredList'),
    name: 'TransferredList',
    children: ['ilw:requisition:list:detail']
  },
  // 格口配置列表
  'ilw:gird:list': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/girdList'),
    name: 'GirdList',
    children: ['ilw:gird:list:detail']
  },
  // 应用列表
  'ilw:app:list': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/applicationManager'),
    name: 'ApplicationManager'
  },
  // 司机列表
  'ilw:driver:list': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/dirverManager'),
    name: 'DirverManager'
  },
  // 大包揽收
  'ilw:logistics:list': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/logisticsList'),
    name: 'LogisticsList',
    children: ['ilw:logistics:list:detail']
  },
  // 换单操作
  'ilw:parcel:printTrackLabel': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/transferredOrder'),
    name: 'TransferredOrder'
  },
  // 泡货不扣件客户配置
  'ilw:memberExemptionBubbleSetting:list': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/freeBulkyCustomer'),
    name: 'FreeBulkyCustomer'
  },
  // 暂扣件扫描状态确认
  'ilw:parcel:lockinfo': {
    component: () => import('@/views/cargo/v0/PackageWarehouse/distrainScan'),
    name: 'DistrainScan'
  },
  /**
   * ******************* 详情 ***************************
  */
  'ilw:parcel:list:detail': {
    path: 'packageOrderDetail/:id',
    component: () => import('@/views/cargo/v0/PackageWarehouse/orderDetail'),
    name: 'PackageOrderDetail',
    hidden: true,
    meta: { title: '订单详情' }
  },
  'ilw:plan:list:create': {
    path: 'createPlan',
    component: () => import('@/views/cargo/v0/PackageWarehouse/createPlan'),
    name: 'CreatePlan',
    hidden: true,
    meta: { title: '发货计划' }
  },
  'ilw:batch:list:box': {
    path: 'batchBoxList/:batchId',
    component: () => import('@/views/cargo/v0/PackageWarehouse/batchBoxList'),
    name: 'BatchBoxList',
    hidden: true,
    meta: { title: '批次监控-箱维度' }
  },
  'ilw:batch:list:order': {
    path: 'batchOrderList/:boxId',
    component: () => import('@/views/cargo/v0/PackageWarehouse/batchOrderList'),
    name: 'BatchOrderList',
    hidden: true,
    meta: { title: '批次监控-订单维度' }
  },
  'ilw:box:list:detail': {
    path: 'boxDetail/:id',
    component: () => import('@/views/cargo/v0/PackageWarehouse/boxDetail'),
    name: 'BoxDetail',
    hidden: true,
    meta: { title: '装箱列表详情' }
  },
  'ilw:box:nubmer:print': {
    path: 'packagePrintTagsThirdPart',
    component: () => import('@/views/cargo/v0/PackageWarehouse/packagePrintTagsThirdPart'),
    name: 'packagePrintTagsThirdPart',
    hidden: true,
    meta: { title: '箱唛打印' }
  },
  'ilw:schedule:list:detail': {
    path: 'scheduleDetail/:id',
    component: () => import('@/views/cargo/v0/PackageWarehouse/scheduleDetail'),
    name: 'ScheduleDetail',
    hidden: true,
    meta: { title: '待办详情' }
  },
  'ilw:agentParcel:list:detail': {
    path: 'largePackageDetail/:id',
    component: () => import('@/views/cargo/v0/PackageWarehouse/largePackageDetail'),
    name: 'LargePackageDetail',
    hidden: true,
    meta: { title: '外部大包详情' }
  },
  'ilw:requisition:list:detail': {
    path: 'transferredDetail/:id',
    component: () => import('@/views/cargo/v0/PackageWarehouse/transferredDetail'),
    name: 'TransferredDetail',
    hidden: true,
    meta: { title: '调拨详情' }
  },
  'ilw:gird:list:detail': {
    path: 'GirdDetail/:operator/:id?',
    component: () => import('@/views/cargo/v0/PackageWarehouse/girdDetail'),
    name: 'GirdDetail',
    hidden: true,
    meta: { title: '格口配置' }
  },
  // 大包揽收
  'ilw:logistics:list:detail': {
    path: 'logisticsDetail/:id',
    component: () => import('@/views/cargo/v0/PackageWarehouse/logisticsDetail'),
    name: 'LogisticsDetail',
    hidden: true,
    meta: { title: '快递单详情' }
  }
}

export default PackageWarehouseMap
