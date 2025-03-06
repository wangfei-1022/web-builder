import Layout from '@/layout'
export const OutInStorageManageRouterMap = {
  // 出库管理
  'ovl:outbound': {
    component: Layout,
    alwaysShow: true,
    name: 'OutInStorageManage'
  },
  // 出库管理-一件代发列表
  'ovl:outbound:drop:shipping': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/OutInStorageManage/outboundList'),
    children: ['ovl:outbound:detail'],
    name: 'OutboundList'
  },
  // 出库管理-转仓列表
  'ovl:outbound:transfer:list': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/OutInStorageManage/transferBoundList'),
    status: '20',
    children: ['ovl:outbound:detail'],
    name: 'TransferBoundList'
  },
  // 出库管理-转仓FBA列表
  'ovl:outbound:transfer:fba': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/OutInStorageManage/transferFBABoundList'),
    status: '22',
    children: ['ovl:outbound:detail'],
    name: 'TransferFBABoundList'
  },
  // 出库管理-一单多件
  'ovl:outbound:merge:pack': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/OutInStorageManage/mergePackList'),
    status: 30,
    children: ['ovl:outbound:detail'],
    name: 'MergePackList'
  },
  // 出库管理-出库详情
  "ovl:outbound:detail": {
    path: 'detail',
    component: () => import('@/views/cargo/v0/OverseasWarehouse/OutInStorageManage/outboundDetail'),
    name: 'OutboundDetail',
    hidden: true,
    meta: { title: 'outboundDetail' }
  },
  // 出库任务-出库任务列表
  'ovl:outbound:task:list': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/OutInStorageManage/outboundTask.vue'),
    children: ['ovl:outbound:task:detail', 'ovl:outbound:task:view'],
    name: 'OutboundTask'
  },
  // 出库任务- 出库任务确认
  'ovl:outbound:task:detail': {
    path: 'task/detail',
    component: () => import('@/views/cargo/v0/OverseasWarehouse/OutInStorageManage/outboundTaskDetail.vue'),
    name: 'OutboundTaskDetail',
    hidden: true,
    meta: { title: 'OutboundTaskDetail' }
  },
  // 出库任务- 出库任务详情
  'ovl:outbound:task:view': {
    path: 'task/view',
    component: () => import('@/views/cargo/v0/OverseasWarehouse/OutInStorageManage/outboundTaskView.vue'),
    name: 'OutboundTaskView',
    hidden: true,
    meta: { title: 'OutboundTaskView' }
  }
}
