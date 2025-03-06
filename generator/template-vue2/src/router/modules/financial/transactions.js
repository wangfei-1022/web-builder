export const TransactionsRouterMap = {
  // 收款管理
  "fms:re:trans:list": {
    component: () => import(/* webpackChunkName: 'clear' */ '@/views/financial/receiptTransactions/transactions'),
    name: 'TransactionsReceiptList',
    children: ["fms:re:trans:detail"]
  },
  // 认领管理
  "fms:re:trans:claim:list": {
    component: () => import(/* webpackChunkName: 'clear' */ '@/views/financial/receiptTransactions/claim'),
    name: 'ClaimReceiptList',
    children: ["fms:re:trans:detail", 'fms:re:trans:claim:detail']
  },
  // 收款详情
  "fms:re:trans:detail": {
    hidden: true,
    path: 'receipt/transactions/detail',
    component: () => import(/* webpackChunkName: 'clear' */ '@/views/financial/receiptTransactions/detailTransactions'),
    name: 'TransactionsReceiptDetail',
    meta: { title: '收款详情' }
  },
  // 我的认领详情
  "fms:re:trans:claim:detail": {
    path: 'receipt/transactions/detail/claimer',
    component: () => import(/* webpackChunkName: 'clear' */ '@/views/financial/receiptTransactions/detailClaimer'),
    hidden: true,
    name: 'TransactionsReceiptDetailClaimer',
    meta: { title: '我的认领详情' }
  }
}
