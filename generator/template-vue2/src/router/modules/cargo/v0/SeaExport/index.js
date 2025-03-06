import Layout from '@/layout'

export const SeaExportRouterMap = {
  // 海运出口
  'se:manage': {
    component: Layout,
    alwaysShow: true,
    name: 'SeaExport'
  },
  // 海出作业管理
  // 'se:job': {
  //   component: () => import('@/views/cargo/v0/SeaExport/list'),
  //   name: 'SeaExportJobList'
  // },
  'sea:export:order:list': {
    component: () => import('@/views/cargo/v0/SeaExport/orderList'),
    name: 'SeaExportOrderList',
    children: ['sea:export:order:list:create', 'sea:export:order:list:view']
  },
  'sea:export:order:list:create': {
    path: 'SeaExportOrderCreate',
    component: () => import('@/views/cargo/v0/SeaExport/orderCreate'),
    name: 'SeaExportOrderCreate',
    meta: { roles: ['se:order'], title: '新建订单' },
    hidden: true
  },
  'sea:export:order:list:view': {
    path: 'SeaExportOrderView',
    component: () => import('@/views/cargo/v0/SeaExport/orderView'),
    name: 'SeaExportOrderView',
    meta: { roles: ['se:order'], title: '查看订单' },
    hidden: true,
    children: ['sea:confirmation:charge:invoiceapply']
  },
  'sea:confirmation:charge:list': { // 应收费用确认单管理
    component: () => import('@/views/cargo/v0/SeaExport/expensesReceivableList'),
    name: 'ExpensesReceivableList',
    children: ['sea:confirmation:charge:invoiceapply', 'sea:charge:detail:invoiceapply', "sea:apply:clear:page", "sea:payApply:clear:page", "sea:payable:apply:payment"]
  },
  'sea:confirmation:pay:list': { // 应付费用确认单管理
    component: () => import('@/views/cargo/v0/SeaExport/payableCostConfirmationList'),
    name: 'PayableCostConfirmationList',
    children: ['sea:confirmation:charge:invoiceapply', 'sea:charge:detail:invoiceapply', "sea:apply:clear:page", "sea:payApply:clear:page", "sea:payable:apply:payment"]
  },
  'sea:receivable:detail:list': { // 应收费用明细
    component: () => import('@/views/cargo/v0/SeaExport/detailsExpensesReceivableList'),
    name: 'DetailsExpensesReceivableList',
    children: ['sea:confirmation:charge:invoiceapply', 'sea:charge:detail:invoiceapply', "sea:apply:clear:page", "sea:payApply:clear:page", "sea:payable:apply:payment"]
  },
  'sea:payable:detail:list': { // 应付费用明细
    component: () => import('@/views/cargo/v0/SeaExport/detailsFeesPayList'),
    name: 'DetailsFeesPayList',
    children: ['sea:confirmation:charge:invoiceapply', 'sea:charge:detail:invoiceapply', "sea:apply:clear:page", "sea:payApply:clear:page", "sea:payable:apply:payment"]
  },
  'sea:confirmation:charge:invoiceapply': { // 申请开票
    path: '/financial/sea/receive/apply/invoice',
    component: () => import('@/views/cargo/v0/SeaExport/applyForInvoice'),
    name: 'FmsSeaApplyForInvoice',
    meta: { title: '申请开票' },
    hidden: true
  },
  'sea:charge:detail:invoiceapply': { // 申请开票明细
    path: '/financial/sea/receive/apply/invoice',
    component: () => import('@/views/cargo/v0/SeaExport/applyForInvoiceCharge'),
    name: 'FmsSeaApplyForInvoiceCharge',
    meta: { title: '申请开票' },
    hidden: true
  },
  // 申请核销应收
  "sea:apply:clear:page": {
    path: 'DetailsExpensesReceivableList/clear/apply/clear',
    component: () => import('@/views/cargo/v0/SeaExport/applyClearPage'),
    hidden: true,
    name: 'SeaFmsApplyClearPage',
    meta: { title: '申请核销' }
  },
  // 申请核销应付
  "sea:payApply:clear:page": {
    path: 'sea/pay/clear/apply/clear',
    component: () => import('@/views/cargo/v0/SeaExport/applyClearPayPage'),
    hidden: true,
    name: 'SeaPayApplyClearPage',
    meta: { title: '申请核销' }
  },
  // 申请付款
  "sea:payable:apply:payment": {
    path: 'sea/payable/apply/payment',
    component: () => import('@/views/cargo/v0/SeaExport/applyPaymentPage'),
    hidden: true,
    name: 'SeaApplyForPayment',
    meta: { title: '申请付款' }
  }
}


// const SeaExportRouter = {
//   path: '/SeaExport',
//   component: Layout,
//   redirect: 'noredirect',
//   name: 'SeaExport',
//   alwaysShow: true,
//   meta: {
//     roles: ['se:manage'],
//     title: '海运出口',
//     icon: 'icon-shenhe'
//   },
//   children: [
    // {
    // path: 'ExpensesReceivableList',
    // component: () => import('@/views/cargo/v0/SeaExport/expensesReceivableList'),
    // name: 'ExpensesReceivableList',
    // meta: { roles: ['se:ExpensesReceivableList'], title: '应收费用确认单管理' }
    // }, {
    //   path: 'PayableCostConfirmationList',
    //   component: () => import('@/views/cargo/v0/SeaExport/payableCostConfirmationList'),
    //   name: 'PayableCostConfirmationList',
    //   meta: { roles: ['se:PayableCostConfirmationList'], title: '应付费用确认单管理' }
    // },
    // {
    //   path: 'DetailsExpensesReceivableList',
    //   component: () => import('@/views/cargo/v0/SeaExport/detailsExpensesReceivableList'),
    //   name: 'DetailsExpensesReceivableList',
    //   meta: { roles: ['se:DetailsExpensesReceivableList'], title: '应收费用明细' }
    // }, {
    //   path: 'DetailsFeesPayList',
    //   component: () => import('@/views/cargo/v0/SeaExport/detailsFeesPayList'),
    //   name: 'DetailsFeesPayList',
    //   meta: { roles: ['se:DetailsFeesPayList'], title: '应付费用明细' }
    // },
    // {
    //   path: 'SeaExportOrderCreate',
    //   component: () => import('@/views/cargo/v0/SeaExport/orderCreate'),
    //   name: 'SeaExportOrderCreate',
    //   meta: { roles: ['se:order'], title: '新建订单'},
    //   hidden: true
    // }, {
    //   path: 'SeaExportOrderView',
    //   component: () => import('@/views/cargo/v0/SeaExport/orderView'),
    //   name: 'SeaExportOrderView',
    //   meta: { roles: ['se:order'], title: '查看订单' },
    //   hidden: true
    // }, {
    //   path: 'ExpenseEntry',
    //   component: () => import('@/views/cargo/v0/SeaExport/expenseEntry'),
    //   name: 'ExpenseEntry',
    //   meta: { roles: ['se:expenseEntry'], title: '费用入账' },
    //   hidden: true
    // },
  // {
  //   path: 'SeReleaseBill',
  //   component: () => import('@/views/cargo/v0/SeaExport/releaseBill'),
  //   name: 'SeReleaseBill',
  //   meta: { roles: ['act:release'], title: '放单管理' }
  // },
  // {
  //   path: 'EdiLog',
  //   component: () => import('@/views/cargo/v0/Management/ediLog'),
  //   name: 'EdiLog',
  //   meta: { title: 'EDI日志' }
  // },
  // {
  //   hidden: true,
  //   path: '',
  //   component: () => import('@/views/cargo/v0/blank'),
  //   name: '',
  //   meta: { title: '放货管理' }
  // },
//   {
//     hidden: true,
//     path: 'ListV2',
//     component: () => import('@/views/cargo/v0/SeaExport/listV2'),
//     name: 'ListV2',
//     meta: { title: '海出作业管理V2' }
//   }, {
//     hidden: true,
//     path: 'VisuallyLcl',
//     component: () => import('@/views/cargo/v0/SeaExport/visuallyLclTemp'),
//     name: 'VisuallyLcl',
//     meta: { title: '可视化拼箱' }
//   }, {
//     hidden: true,
//     path: 'Operate',
//     component: () => import('@/views/cargo/v0/SeaExport/operate'),
//     name: 'SeaExportOperate',
//     meta: { roles: ['se:job:detail'], title: '海出工作台', keepAlive: true }
//   }, {
//     hidden: true,
//     path: 'SeaExportRedirect',
//     component: () => import('@/views/cargo/v0/SeaExport/redirect'),
//     name: 'SeaExportRedirect',
//     meta: { title: '加载中...' }
//   }, {
//     hidden: true,
//     path: 'OperateConsol',
//     component: () => import('@/views/cargo/v0/SeaExport/operateConsol'),
//     name: 'SeaExportOperateConsol',
//     meta: { roles: ['se:job:detail'], title: '海出工作台', keepAlive: true }
//   }]
// }

// export default SeaExportRouter
