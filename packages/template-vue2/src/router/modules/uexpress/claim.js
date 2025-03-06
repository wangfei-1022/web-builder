export const ClaimRouterMap = {
  // 投保管理
  'ilp:insurance:list': {
    component: () => import('@/views/uexpress/insuranceList/index'),
    name: 'UExpressInsuranceList'
  },
  // 客户理赔管理
  'ilp:claim:customer:list': {
    component: () => import('@/views/uexpress/claimCustomerList/index'),
    name: 'UExpressClaimCustomerList',
    children: ["ilp:claim:customer:list:add", "ilp:claim:customer:list:edit", 'ilp:claim:customer:list:audit', 'ilp:claim:customer:list:detail']
  },
  // 客户理赔管理-新增
  'ilp:claim:customer:list:add': {
    path: '/uexpress/claim/customer/add',
    component: () => import('@/views/uexpress/claimCustomerList/add'),
    name: 'UExpressClaimCustomerListAdd',
    hidden: true,
    meta: {
      title: "客户理赔管理-新增"
    }
  },
  // 客户理赔管理-修改
  'ilp:claim:customer:list:edit': {
    path: '/uexpress/claim/customer/edit',
    component: () => import('@/views/uexpress/claimCustomerList/edit'),
    name: 'UExpressClaimCustomerListEdit',
    hidden: true,
    meta: {
      title: "客户理赔管理-修改"
    }
  },
  // 客户理赔管理-审核
  'ilp:claim:customer:list:audit': {
    path: '/uexpress/claim/customer/audit',
    component: () => import('@/views/uexpress/claimCustomerList/audit'),
    name: 'UExpressClaimCustomerListAudit',
    hidden: true,
    meta: {
      title: "客户理赔管理-审核"
    }
  },
  // 客户理赔管理-详情
  'ilp:claim:customer:list:detail': {
    path: '/uexpress/claim/customer/detail',
    component: () => import('@/views/uexpress/claimCustomerList/detail'),
    name: 'UExpressClaimCustomerListDetail',
    hidden: true,
    meta: {
      title: "客户理赔管理-详情"
    }
  },
  // 保险理赔管理
  'ilp:claim:insurance:list': {
    component: () => import('@/views/uexpress/claimInsuranceList/index'),
    name: 'UExpressInsuranceClaimList'
  },
  // 供应商理赔管理
  'ilp:claim:supplier:list': {
    component: () => import('@/views/uexpress/claimSupplierList/index'),
    name: 'UExpressSupplierClaimList'
  },
  // 理赔汇总
  'ilp:claim:summary:list': {
    component: () => import('@/views/uexpress/claimSummaryList/index'),
    name: 'UExpressClaimSummaryList'
  },
  // 供应商取号管理
  'ilp:ord:order:channel:list': {
    component: () => import('@/views/uexpress/orderChannelList/index'),
    name: 'UexpressOrderChannelList'
  }
}
