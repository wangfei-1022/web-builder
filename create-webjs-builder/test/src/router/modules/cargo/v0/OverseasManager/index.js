/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

export const CustomerManagerRouterMap = {
  // 客户管理
  'ovl:overseas:manager': {
    component: Layout,
    alwaysShow: true,
    name: 'customerManager'
  },
  // 客户列表
  'ovl:customer:list': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/OverseasManage/customerList.vue'),
    children: ['ovl:customer:list:detail'], // Parent router-view
    name: 'OvlCustomerList'
  },
  'ovl:customer:list:detail': {
    path: "/customer/config",
    component: () => import('@/views/cargo/v0/OverseasWarehouse/OverseasManage/customerConfigDetail.vue'),
    name: "CustomerConfigDetail",
    hidden: true,
    meta: { title: "CustomerConfigDetail" }
  },
  // 待审核客户列表
  // 客商里面公用的children key
  'ovl:customer:bus:audit:list': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/OverseasManage/customerAuditList.vue'), // Parent router-view
    name: 'OvlCustomerAuditList',
    children: ['mem:customer:audit:list:detail', 'mem:customer:audit:list:audit']
  },
  'ovl:fba:warehouse:list': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/OverseasManage/FBAWarehouseList.vue'), // Parent router-view
    name: 'FBAWarehouseList'
  },
  'ovl:interface:log': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/OverseasManage/InterfaceLog.vue'), // Parent router-view
    name: 'InterfaceLog'
  },
  // 客户充值记录
  'ovl:recharge:list': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/RechargeRecord/index.vue'),
    name: 'OvlRechargeRecord',
    children: ["fms:recharge:record:detail", "fms:recharge:record:relative"]
  }
}

