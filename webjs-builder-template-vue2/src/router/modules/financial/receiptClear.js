import Layout from "@/layout"

export const ReceiptClearRouterMap = {
  // 财务结算
  "fms:clear:manager": {
    component: Layout,
    alwaysShow: true,
    name: "Financial"
  },
  // 申请核销
  "fms:receive:apply:clear:page": {
    path: 'receipt/clear/apply/clear',
    component: () => import('@/views/financial/applyReceiptClear/applyClearPage'),
    hidden: true,
    name: 'FmsReceiptApplyClearPage',
    meta: { title: 'fmsReceiveApplyClearPage' }
  },
  // 对冲核销
  "fms:receive:apply:clear:offset:page": {
    path: 'receipt/clear/offset/clear',
    component: () => import('@/views/financial/applyReceiptClear/offsetClearPage'),
    hidden: true,
    name: 'FmsReceiptOffsetClearPage',
    meta: { title: 'fmsReceiveOffsetClearPage' }
  },
  // 核销管理
  "fms:re:clear:list": {
    component: () => import(/* webpackChunkName: 'clear' */ '@/views/financial/receiptClearList/list'),
    name: 'ReceiptClearBusinessList',
    children: ["fms:re:clear:detail", "fms:re:clear:offset:detail"]
  },
  // 核销管理
  "fms:re:clear:apply:list": {
    component: () => import(/* webpackChunkName: 'clear' */ '@/views/financial/receiptClearList/applyList'),
    name: 'ReceiptClearApplyOperatorList',
    children: ["fms:re:clear:detail", "fms:re:clear:offset:detail"]
  },
  // 核销管理 详情
  "fms:re:clear:detail": {
    path: 'receipt/clear/detail',
    component: () => import(/* webpackChunkName: 'clear' */ '@/views/financial/receiptClearList/clearDetail'),
    hidden: true,
    name: 'FmsReceiptClearDetail',
    meta: { title: 'fmsReceiptClearDetail' }
  },
  // 核销管理 对冲核销详情
  "fms:re:clear:offset:detail": {
    path: 'receipt/clear/offset/detail',
    component: () => import(/* webpackChunkName: 'clear' */ '@/views/financial/receiptClearList/offsetClearDetail'),
    hidden: true,
    name: 'FmsReceiptOffsetClearDetail',
    meta: { title: 'fmsReceiptOffsetClearDetail' }
  }
}
