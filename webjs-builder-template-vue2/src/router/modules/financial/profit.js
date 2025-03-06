import Layout from "@/layout"

export const ProfitRouterMap = {
  // 财务结算-盈亏管理
  "fms:manage:payable:clear": {
    component: Layout,
    alwaysShow: true,
    name: "PayableClear"
  },
  // 盈亏申请管理
  "fms:manage:profit:apply:list": {
    component: () => import('@/views/financial/profitApplyList/index'),
    name: 'FmsProfitApplyList',
    children: ["fms:manage:profit:apply:list:submit", "fms:manage:profit:apply:list:detail"]
  },
  // 盈亏申请-提交
  "fms:manage:profit:apply:list:submit": {
    path: '/fms/profit/apply/list/submit',
    component: () => import('@/views/financial/profitApplyList/submit'),
    hidden: true,
    name: 'FmsProfitApplyListSubmit',
    meta: { title: '盈亏申请-提交' }
  },
  // 盈亏申请详情
  "fms:manage:profit:apply:list:detail": {
    path: '/fms/profit/apply/list/detail',
    component: () => import('@/views/financial/profitApplyList/detail'),
    hidden: true,
    name: 'FmsProfitApplyListDetail',
    meta: { title: '盈亏申请详情' }
  },
  // 盈亏审核管理
  "fms:manage:profit:audit:list": {
    component: () => import('@/views/financial/profitAuditList/index'),
    name: 'FmsProfitAuditList',
    children: ["fms:manage:profit:audit:list:audit", "fms:manage:profit:audit:list:detail"]
  },
  // 盈亏审核管理-审核
  "fms:manage:profit:audit:list:audit": {
    path: '/fms/profit/audit/list/audit',
    component: () => import('@/views/financial/profitAuditList/audit'),
    hidden: true,
    name: 'FmsProfitAuditListAudit',
    meta: { title: '盈亏申请-审核' }
  },
  // 盈亏审核管理-详情
  "fms:manage:profit:audit:list:detail": {
    path: '/fms/profit/audit/list/detail',
    component: () => import('@/views/financial/profitAuditList/detail'),
    hidden: true,
    name: 'FmsProfitAuditListDetail',
    meta: { title: '盈亏审核详情' }
  },
  // 盈亏管理
  "fms:manage:profit:manage:list": {
    component: () => import('@/views/financial/profitManageList/index'),
    name: 'FmsProfitManageList',
    children: []
  }
}
