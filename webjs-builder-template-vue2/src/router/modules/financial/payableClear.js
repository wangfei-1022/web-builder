import Layout from "@/layout"

export const PayableClearRouterMap = {
  // 财务结算-应付核销管理
  "fms:manage:payable:clear": {
    component: Layout,
    alwaysShow: true,
    name: "PayableClear"
  },
  // 申请核销
  "fms:payable:apply:clear:page": {
    path: 'payable/clear/apply/clear',
    component: () => import('@/views/financial/applyPayableClear/applyClearPage'),
    hidden: true,
    name: 'FmsPayableApplyClearPage',
    meta: { title: 'fmsPayableApplyClearPage' }
  },
  // 对冲核销
  "fms:payable:apply:clear:offset:page": {
    path: 'payable/clear/offset/clear',
    component: () => import('@/views/financial/applyPayableClear/offsetClearPage'),
    hidden: true,
    name: 'FmsPayableOffsetClearPage',
    meta: { title: 'fmsPayableOffsetClearPage' }
  },
  // 核销管理
  "fms:manage:payable:clear:list": {
    component: () => import('@/views/financial/payableClearList/index'),
    name: 'FmsPayableClearBusinessList',
    children: ["fms:payable:clear:detail", "fms:payable:clear:offset:detail"]
  },
  // 核销申请管理
  "fms:manage:payable:clear:apply:list": {
    component: () => import('@/views/financial/payableClearApplyList/index'),
    name: 'FmsPayableClearApplyOperatorList',
    children: ["fms:payable:clear:detail", "fms:payable:clear:offset:detail"]
  },
  // 核销管理 详情
  "fms:payable:clear:detail": {
    path: 'payable/clear/detail',
    component: () => import('@/views/financial/payableClearList/clearDetail'),
    hidden: true,
    name: 'FmsPayableClearDetail',
    meta: { title: 'fmsPayableClearDetail' }
  },
  // 核销管理 对冲核销详情
  "fms:payable:clear:offset:detail": {
    path: 'payable/clear/offset/detail',
    component: () => import('@/views/financial/payableClearList/offsetClearDetail'),
    hidden: true,
    name: 'FmsPayableOffsetClearDetail',
    meta: { title: 'fmsPayableOffsetClearDetail' }
  }
}
