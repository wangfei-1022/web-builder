import Layout from "@/layout"

export const FmsLockRouterMap = {
  // 锁单管理
  "fms:manage:lock": {
    component: Layout,
    alwaysShow: true,
    name: "PayableClear"
  },
  // 锁单申请管理
  "fms:manage:lock:apply:manage:list": {
    component: () => import("@/views/financial/lockApplyManageList/index"),
    name: "FmsLockApplyManageList",
    children: ["fms:manage:lock:apply:manage:list:detail"]
  },
  // 锁单申请管理详情
  "fms:manage:lock:apply:manage:list:detail": {
    path: '/fms/lock/apply/manage/list/detail',
    component: () => import('@/views/financial/lockApplyManageList/detail'),
    hidden: true,
    name: 'FmsLockApplyManageListDetail',
    meta: { title: '锁单申请管理详情' }
  },
}