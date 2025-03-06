export const TrackRouterMap = {
  // 标准轨迹节点管理
  'ilp:trace:stand:node': {
    name: 'TraceStandNode',
    component: () => import('@/views/uexpress/traceStandNode')
  },
  // 轨迹渠道管理
  'ilp:trace:channel': {
    name: 'TraceChannel',
    component: () => import('@/views/uexpress/traceChannel')
  },
  // 轨迹抓取配置管理
  'ilp:trace:catch:config': {
    name: 'TraceCatchConfig',
    component: () => import('@/views/uexpress/traceCatchConfig')
  },
  // 原始轨迹查询
  'ilp:trace:original': {
    name: 'TraceOriginal',
    component: () => import('@/views/uexpress/traceOriginal')
  },
  // 轨迹查询
  'ilp:trace:search': {
    name: 'TraceSearch',
    component: () => import('@/views/uexpress/traceSearch')
  },
  // 供应商轨迹映射
  'ilp:trace:map:supplier': {
    name: 'TraceMapSupplier',
    component: () => import('@/views/uexpress/traceMapSupplier')
  }
}
