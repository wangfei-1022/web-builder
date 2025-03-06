export const BaseInfoRouterMap = {
  // 品名库管理
  'ilp:base:goods:list': {
    component: () => import('@/views/uexpress/goodsList/index'),
    name: 'UexpressGoodsList'
  },
  // 黑名单品名库管理
  'ilp:base:goods:black:list': {
    component: () => import('@/views/uexpress/goodsBlackList/index'),
    name: 'UexpressGoodsBlackList'
  }
}
