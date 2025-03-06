import Layout from '@/layout'

export const YunCangManageMap = {
  // 云仓管理
  'ovl:cloud:warehouse': {
    component: Layout,
    name: 'CloudWarehouseManage'
  },
  // 入库单
  'ovl:cloud:warehouse:inbound': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/YunCangManage/WarehouseInbound'),
    name: 'WarehouseInbound'
  },
  // 出库单
  'ovl:cloud:warehouse:outbound': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/YunCangManage/WarehouseOutbound'),
    name: 'WarehouseOutbound'
  },
  // 包裹入库单
  'ovl:cloud:warehouse:inbound:package': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/YunCangManage/WarehouseParcelStorage'),
    name: 'WarehouseParcelStorage'
  }
}
