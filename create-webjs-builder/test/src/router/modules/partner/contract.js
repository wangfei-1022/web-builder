export const ContractRouterMap = {
  // 客户合同
  'cms:customer:list': {
    component: () => import('@/views/partner/customerContract/customer'),
    name: 'ContractCustomerList',
    children: [
      'cms:contract:list:customer:edit',
      'cms:contract:list:customer:detail',
      'cms:contract:list:customer:adjust',
      'cms:contract:list:customer:add:child',
      'cms:contract:list:customer:add'
    ]
  },
  // 供应商合同(产品)
  'cms:supplier:list': {
    component: () => import('@/views/partner/supplierContract/supplier'),
    name: 'ContractSupplierList',
    children: [
      'cms:contract:list:supplier:edit',
      'cms:contract:list:supplier:detail',
      'cms:contract:list:supplier:add',
      'cms:contract:list:supplier:add:child',
      'cms:contract:list:supplier:adjust',
      'cms:contract:list:customer:edit',
      'cms:contract:list:customer:detail',
      'cms:contract:list:customer:adjust',
      'cms:contract:list:customer:add:child',
      'cms:contract:list:customer:add'
    ]
  },
  // 供应商合同(财务)
  'cms:supplier:finance:list': {
    component: () => import('@/views/partner/supplierContract/finance'),
    name: 'ContractSupplierFinanceList',
    children: [
      'cms:contract:list:supplier:edit',
      'cms:contract:list:supplier:detail',
      'cms:contract:list:supplier:add',
      'cms:contract:list:supplier:add:child',
      'cms:contract:list:customer:edit',
      'cms:contract:list:customer:detail',
      'cms:contract:list:customer:adjust',
      'cms:contract:list:customer:add:child',
      'cms:contract:list:customer:add'
    ]
  },

  // 合同管理-客户收款-新建
  'cms:contract:list:customer:add': {
    path: '/contract/customer/receipt/add',
    component: () => import('@/views/partner/customerContract/add'),
    name: 'CRMContractCustomerReceiptAdd',
    hidden: true,
    meta: { title: '新建合同' },
    roles: []
  },
  // 合同管理-客户收款-新建子合同
  'cms:contract:list:customer:add:child': {
    path: '/contract/customer/receipt/add/child',
    component: () => import('@/views/partner/customerContract/add'),
    name: 'CRMContractCustomerReceiptAddChild',
    hidden: true,
    meta: { title: '新建子合同' },
    roles: []
  },
  // 合同管理-客户收款-编辑
  'cms:contract:list:customer:edit': {
    path: '/contract/customer/receipt/edit',
    component: () => import('@/views/partner/customerContract/add'),
    name: 'CRMContractCustomerReceiptEdit',
    hidden: true,
    meta: { title: '编辑合同' },
    roles: []
  },
  // 合同管理-客户收款-调整
  'cms:contract:list:customer:adjust': {
    path: '/contract/customer/receipt/adjust',
    component: () => import('@/views/partner/customerContract/adjust'),
    name: 'CRMContractCustomerReceiptAdjust',
    hidden: true,
    meta: { title: '合同调整' },
    roles: []
  },
  // 合同管理-客户收款-详情
  'cms:contract:list:customer:detail': {
    path: '/contract/customer/receipt/detail',
    component: () => import('@/views/partner/customerContract/detail'),
    name: 'CRMContractCustomerReceiptDetail',
    hidden: true,
    meta: { title: '合同详情' },
    roles: []
  },
  // 合同管理-供应商付款-新建
  'cms:contract:list:supplier:add': {
    path: '/contract/supplier/payment/add',
    component: () => import('@/views/partner/supplierContract/add'),
    name: 'CRMContractSupplierPaymentAdd',
    hidden: true,
    meta: { title: '新建合同' },
    roles: []
  },
  // 合同管理-供应商付款-编辑
  'cms:contract:list:supplier:edit': {
    path: '/contract/supplier/payment/edit',
    component: () => import('@/views/partner/supplierContract/add'),
    name: 'CRMContractSupplierPaymentEdit',
    hidden: true,
    meta: { title: '编辑合同' },
    roles: []
  },
  // 合同管理-供应商付款-新建子合同
  'cms:contract:list:supplier:add:child': {
    path: '/contract/supplier/payment/add/child',
    component: () => import('@/views/partner/supplierContract/add'),
    name: 'CRMContractSupplierPaymentAddChild',
    hidden: true,
    meta: { title: '新建子合同' },
    roles: []
  },
  // 合同管理-供应商付款-详情
  'cms:contract:list:supplier:detail': {
    path: '/contract/supplier/payment/detail',
    component: () => import('@/views/partner/supplierContract/detail'),
    name: 'CRMContractSupplierPaymentDetail',
    hidden: true,
    meta: { title: '合同详情' },
    roles: []
  },
  // 合同管理-供应商付款-调整
  'cms:contract:list:supplier:adjust': {
    path: '/contract/supplier/payment/adjust',
    component: () => import('@/views/partner/supplierContract/adjust'),
    name: 'CRMContractSupplierPaymentAdjust',
    hidden: true,
    meta: { title: '合同调整' },
    roles: []
  }
}
