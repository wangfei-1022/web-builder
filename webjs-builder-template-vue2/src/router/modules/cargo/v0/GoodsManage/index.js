import Layout from '@/layout'

export const GoodsManageRouterMap = {
  // 货品管理
  'mem:goods': {
    component: Layout,
    alwaysShow: true,
    name: 'GoodsManage'
  },
  // 货品列表（可用）
  'mem:goods:list': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/GoodsManagement/GoodsList'),
    status: [4, 5, 6],
    children: ["mem:goods:detail"],
    name: 'GoodsList'
  },
  // 货品列表（待审核）
  'mem:goods:audit:list': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/GoodsManagement/GoodsToAudit'),
    status: [2, 4],
    children: ["mem:goods:detail"],
    name: 'GoodsToAudit'
  },
  // 品类管理
  'mem:goods:category:list': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/GoodsManagement/categoryList'),
    name: 'CategoryList'
  },
  'mem:goods:detail': {
    path: '/goodsList/detail',
    component: () => import('@/views/cargo/v0/OverseasWarehouse/GoodsManagement/GoodsDetail'),
    name: 'GoodsDetial',
    hidden: true,
    meta: { title: 'goodsDetial' }
  }
}
