import Layout from '@/layout'

const InformationRouterMap = {
  // 资料管理
  'mdm:manage': {
    component: Layout,
    alwaysShow: true,
    name: 'Information'
  },
  // 行业术语
  'mdm:term': {
    component: () => import('@/views/cargo/v0/Information/terminology'),
    name: 'Terminology'
  },
  // 币种
  'mdm:currency': {
    component: () => import('@/views/cargo/v0/Information/currency'),
    name: 'Currency'
  },
  // 汇率
  'mdm:rate': {
    component: () => import('@/views/partner/exchangeRate'),
    name: 'ExchangeRate'
  },
  // 海运港口
  'mdm:seaport': {
    component: () => import('@/views/cargo/v0/Information/seaPort'),
    name: 'SeaPort'
  },
  // 集装箱型
  'mdm:container:type': {
    component: () => import('@/views/cargo/v0/Information/containerType'),
    name: 'ContainerType'
  },
  // 客户代码类型
  'mdm:codetype': {
    component: () => import('@/views/cargo/v0/Information/companyCodeType'),
    name: 'CompanyCodeType'
  },
  // 箱主信息管理
  'mdm:owner:list': {
    component: () => import('@/views/cargo/v0/Information/OwnerList'),
    name: 'ownerList'
  },
  // 堆场信息管理
  'mdm:yard:list': {
    component: () => import('@/views/cargo/v0/Information/YardList'),
    name: 'yardList'
  },
  // 费用代码(草稿)
  'dmn:fee:item:list:draft': {
    component: () => import('@/views/partner/feeItem/draft'),
    name: 'FeeItemListDraft',
    children: ['mdm:fee:create']
  },
  // 费用代码(可用)
  'dmn:fee:item:list': {
    component: () => import('@/views/partner/feeItem/list'),
    name: 'FeeItemList',
    children: ['mdm:fee:detail']
  },
  'mdm:fee:create': {
    path: '/fee/item/add',
    component: () => import('@/views/partner/feeItem/add'),
    name: 'FeeItemAdd',
    hidden: true,
    meta: { title: '新建费用项' },
    roles: []
  },
  'mdm:fee:detail': {
    path: '/fee/item/detail',
    component: () => import('@/views/partner/feeItem/detail'),
    name: 'FeeItemDetail',
    hidden: true,
    meta: { title: '费用代码详情' },
    roles: []
  },
  // 代码项
  'ovl:sea:code:manager': {
    component: () => import('@/views/cargo/v0/Information/codeManager'),
    children: ['sea:code:item'],
    name: 'CodeManager'
  },
  'sea:code:item': {
    path: '/code/item/:id',
    component: () => import('@/views/cargo/v0/Information/codeItemList'),
    name: 'CodeItemList',
    hidden: true,
    meta: { title: 'CodeItemList' }
  }
}

export default InformationRouterMap
