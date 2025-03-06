/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

export const InventoryManagerRouterMap = {
  // 库存管理
  'ovl:inventory': {
    component: Layout,
    name: 'inventoryManager'
  },
  // 库存列表
  'ovl:inventory:list': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/InventoryManager/inventoryList'), // Parent router-view
    name: 'InventoryList'
  },
  // 批次库龄列表
  'ovl:inventory:batch:list': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/InventoryManager/batchList'), // Parent router-view
    name: 'BatchList'
  },
  // 库存日志列表
  'ovl:inventory:log:list': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/InventoryManager/logList'), // Parent router-view
    name: 'LogList',
    status: 1
  },
  // 货品库存日志
  'ovl:inventory:log:goods': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/InventoryManager/logList'), // Parent router-view
    name: 'LogGoods',
    status: 2
  },
  // 货品库存日志
  'ovl:pv:inventory:batch:list': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/InventoryManager/inventoryPvList.vue'), // Parent router-view
    name: 'InventoryPvList',
    status: 2
  },
  // 盘点列表
  'ovl:inventory:check:task:list': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/InventoryManager/takeStock'), // Parent router-view
    children: ['ovl:inventory:check:task:detail'],
    name: 'TakeStock'
  },
  // 盘点详情
  "ovl:inventory:check:task:detail": {
    path: 'detail',
    component: () => import('@/views/cargo/v0/OverseasWarehouse/InventoryManager/takeStockDetail'), // Parent router-view
    name: 'TakeStockDetail',
    hidden: true,
    meta: { title: 'TakeStockDetail' }
  }
}
