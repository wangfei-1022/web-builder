import Layout from '@/layout'

const SpaceManagerMap = {
  // 舱位管理
  'shipping:manage': {
    component: Layout,
    alwaysShow: true,
    name: 'spaceManager'
  },
  // 抢舱规则
  'shipping:rule': {
    component: () => import('@/views/cargo/v0/SpaceManager/SpaceRuleList'),
    name: 'SpaceRuleList',
    children: ['shipping:rule:modify']
  },
  'shipping:rule:modify': {
    path: 'SpaceRuleSetter/:id?',
    component: () => import('@/views/cargo/v0/SpaceManager/SpaceRuleSetter'),
    name: 'SpaceRuleSetter',
    hidden: true,
    meta: { title: '规则编辑', noCache: true }
  }
}

export default SpaceManagerMap
