import Layout from "@/layout"
import { MemberRouterMap } from './member'
import { ContractRouterMap } from './contract'

export const MemberManagementRouterMap = {
  // 会员管理
  'mem:user': {
    component: Layout,
    alwaysShow: true,
    name: 'Member'
  },
  ...MemberRouterMap,
  ...ContractRouterMap
}
