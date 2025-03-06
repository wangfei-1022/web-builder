export const MemberRouterMap = {
  // 会员列表
  'mem:user:list': {
    component: () => import('@/views/partner/member/index'),
    name: 'MemberUserList'
  },
  // 开票信息管理
  'mem:settle:company:list': {
    component: () => import('@/views/partner/invoiceInfo/index'),
    name: 'InformationInvoicing',
    children: ['mem:settle:company:list:add']
  },
  'mem:settle:company:list:add': {
    path: '/partner/invoicing/add',
    hidden: true,
    meta: { title: '开票信息管理' },
    component: () => import('@/views/partner/invoiceInfo/add'),
    name: 'InformationInvoicingAdd'
  },
  // 付款信息管理
  'scm:supplier:payment:list': {
    component: () => import('@/views/partner/paymentInfo'),
    name: 'PartnerPaymentInfoList',
    children: ['scm:supplier:payment:list:add', 'scm:supplier:payment:list:edit', 'scm:supplier:payment:list:view']
  },
  'scm:supplier:payment:list:add': {
    path: '/partner/payment/info/add',
    hidden: true,
    meta: { title: '付款信息-新增' },
    component: () => import('@/views/partner/paymentInfo/add'),
    name: 'PartnerPaymentInfoAdd'
  },
  'scm:supplier:payment:list:edit': {
    path: '/partner/payment/info/edit',
    hidden: true,
    meta: { title: '付款信息-编辑' },
    component: () => import('@/views/partner/paymentInfo/edit'),
    name: 'PartnerPaymentInfoEdit'
  },
  'scm:supplier:payment:list:view': {
    path: '/partner/payment/info/detail',
    hidden: true,
    meta: { title: '付款信息-详情' },
    component: () => import('@/views/partner/paymentInfo/detail'),
    name: 'PartnerPaymentInfoView'
  },
  // 客户管理
  'mem:customer:list': {
    component: () => import('@/views/partner/customerManage/index'),
    name: 'CRMCustomerList',
    children: ['mem:customer:list:add', 'mem:customer:list:edit', 'mem:customer:list:detail']
  },
  // 客户管理- 新增
  'mem:customer:list:add': {
    path: '/customer/add',
    component: () => import('@/views/partner/customerManage/add'),
    name: 'CRMCustomerAdd',
    hidden: true,
    meta: { title: '新增客户' },
    roles: []
  },
  // 客户管理- 编辑
  'mem:customer:list:edit': {
    path: '/customer/edit',
    component: () => import('@/views/partner/customerManage/add'),
    name: 'CRMCustomerEdit',
    hidden: true,
    meta: { title: '编辑客户' },
    roles: []
  },
  // 客户管理- 详情
  'mem:customer:list:detail': {
    path: '/customer/detail',
    component: () => import('@/views/partner/customerManage/detail'),
    name: 'CRMCustomerDetail',
    hidden: true,
    meta: { title: '客户详情' },
    roles: []
  },

  // 供应商管理
  'scm:supplier:list': {
    component: () => import('@/views/partner/supplierManage/index'),
    name: 'CRMSupplierList',
    children: ['scm:supplier:list:add', 'scm:supplier:list:edit', 'scm:supplier:list:detail']
  },
  // 供应商管理-新建
  'scm:supplier:list:add': {
    path: '/supplier/add',
    component: () => import('@/views/partner/supplierManage/add'),
    name: 'CRMSupplierAdd',
    hidden: true,
    meta: { title: '新增供应商' },
    roles: []
  },
  // 供应商管理-编辑
  'scm:supplier:list:edit': {
    path: 'supplier/edit',
    component: () => import('@/views/partner/supplierManage/add'),
    name: 'CRMSupplierEdit',
    hidden: true,
    meta: { title: '编辑供应商' },
    roles: []
  },
  // 供应商管理-详情
  'scm:supplier:list:detail': {
    path: '/supplier/detail',
    component: () => import('@/views/partner/supplierManage/detail'),
    name: 'CRMSupplierDetail',
    hidden: true,
    meta: { title: '供应商详情' },
    roles: []
  },
  // 结算单位管理
  'fms:settlement:title:config': {
    component: () => import('@/views/partner/settlementTitleList'),
    name: 'CRMSettlementTitleList'
  },
  // 待客户审核列表-审核
  'mem:customer:audit:list:audit': {
    path: '/customer/audit/list/audit',
    component: () => import('@/views/partner/customerAudit/audit'),
    name: 'CRMCustomerAuditAudit',
    hidden: true,
    meta: { title: '客户审核-审核' },
    roles: []
  },
  // 待客户审核列表-详情
  'mem:customer:audit:list:detail': {
    path: '/customer/audit/list/detail',
    component: () => import('@/views/partner/customerAudit/detail'),
    name: 'CRMCustomerAuditDetail',
    hidden: true,
    meta: { title: '客户审核-详情' },
    roles: []
  }
}
