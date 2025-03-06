import Layout from '@/layout'

export const SeaContractRouterMap = {
  // 舱位管理
  'sea:spaceManage': {
    component: Layout,
    alwaysShow: true,
    name: 'seaContract'
  },
  // 合约管理
  'sea:contract': {
    component: () => import('@/views/cargo/v0/SpaceManager/ContractManagement'),
    name: 'ContractManagement'
  },
  // 舱位申请(销售)
  'sea:space:apply': {
    component: () => import('@/views/cargo/v0/SpaceManager/SpaceApplication'),
    name: 'SpaceApplication'
  },
  // 舱位申请(产品)
  'sea:space:applyManage': {
    component: () => import('@/views/cargo/v0/SpaceManager/SpaceApplicationManagement'),
    name: 'SpaceApplicationManagement'
  }
}

// const SeaContract = {
//   path: '/shippingManager',
//   component: Layout,
//   redirect: 'noredirect',
//   name: 'spaceManager',
//   meta: {
//     title: '舱位管理',
//     icon: 'icon-jizhuangxiang'
//   },
//   children: [
    // {
    //   path: 'ContractManagement',
    //   component: () => import('@/views/cargo/v0/SpaceManager/ContractManagement'),
    //   name: 'ContractManagement',
    //   meta: { roles: ['se:DetailsFeesPayList'], title: '合约管理' }
    // }, {
    //   path: 'SpaceApplication',
    //   component: () => import('@/views/cargo/v0/SpaceManager/SpaceApplication'),
    //   name: 'SpaceApplication',
    //   meta: { roles: ['se:DetailsFeesPayList'], title: '舱位申请(销售)' }
    // }, {
    //   path: 'SpaceApplicationManagement',
    //   component: () => import('@/views/cargo/v0/SpaceManager/SpaceApplicationManagement'),
    //   name: 'SpaceApplicationManagement',
    //   meta: { roles: ['se:DetailsFeesPayList'], title: '舱位申请(产品)' }
    // },
//     {
//       path: 'SpaceRuleSetter/:id?',
//       component: () => import('@/views/cargo/v0/SpaceManager/SpaceRuleSetter'),
//       name: 'SpaceRuleSetter',
//       hidden: true,
//       meta: { title: '规则编辑', noCache: true }
//     }
//   ]
// }

// export default SeaContract
