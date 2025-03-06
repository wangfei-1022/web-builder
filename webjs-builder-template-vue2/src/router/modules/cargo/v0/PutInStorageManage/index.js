import Layout from '@/layout'

export const PutInStorageManageMap = {
  // 入库管理
  'ovl:storage:in': {
    component: Layout,
    name: 'PutInStorageManage'
  },
  // 入库预约单
  'ovl:storage:in:form': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/PutInStorageManage/StorageReservationForm'),
    children: ['ovl:storage:in:form:detail'],
    name: 'StorageReservationForm'
  },
  'ovl:storage:in:form:detail': {
    path: '/storageReservation/detail',
    component: () => import('@/views/cargo/v0/OverseasWarehouse/PutInStorageManage/StorageReservationFormDetail'),
    name: 'StorageReservationFormDetail',
    hidden: true,
    meta: { title: 'storageReservationFormDetail' }
  },
  // 入库单
  'ovl:storage:in:list': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/PutInStorageManage/GRNList.vue'),
    children: ['ovl:storage:in:detail'],
    name: 'GRNList'
  },
  // 入库单详情
  "ovl:storage:in:detail": {
    path: '/GRNDetail',
    component: () => import('@/views/cargo/v0/OverseasWarehouse/PutInStorageManage/GRNDetail'),
    name: 'GRNDetail',
    hidden: true,
    meta: { title: 'storageIn' }
  },
  // 包裹入库单
  'ovl:inbound:package:list': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/PutInStorageManage/parcelStorage.vue'),
    children: ['ovl:inbound:package:detail'],
    name: 'ParcelStorage'
  },
  // 包裹入库单详情
  "ovl:inbound:package:detail": {
    path: '/warehouse/inbound/package/detail',
    component: () => import('@/views/cargo/v0/OverseasWarehouse/PutInStorageManage/parcelStorageDetail.vue'),
    name: 'ParcelStorageDetail',
    hidden: true,
    meta: { title: 'parcelStorageDetail' }
  },
  // 入库任务列表
  'ovl:inbound:task:list': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/PutInStorageManage/InboundTask'),
    children: ['ovl:inbound:task:detail'],
    name: 'InboundTask'
  },
  'ovl:inbound:task:detail': {
    path: '/inbound/task/detail',
    component: () => import('@/views/cargo/v0/OverseasWarehouse/PutInStorageManage/InboundTaskDetail'),
    name: 'InboundTaskDetail',
    hidden: true,
    meta: { title: 'InboundTaskDetail' }
  },
  // 提单集装箱明细列表
  'ovl:inbound:bl:list': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/PutInStorageManage/InboundBlList'),
    children: ['ovl:inbound:bl:detail'],
    name: 'InboundBlList'
  },
  'ovl:inbound:bl:detail': {
    path: '/inbound/bl/detail',
    component: () => import('@/views/cargo/v0/OverseasWarehouse/PutInStorageManage/InboundBlDetail'),
    name: 'InboundBlDetail',
    hidden: true,
    meta: { title: 'InboundBlDetail' }
  }
}
