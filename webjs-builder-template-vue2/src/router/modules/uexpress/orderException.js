export const OrderExceptionRouterMap = {
  // 异常订单管理
  'ilp:ord:exception': {
    component: () => import('@/views/uexpress/orderException/index'),
    name: 'UexpressOrderExceptionList',
    children: ["ilp:ord:order:list:detail"]
  },
  // 重量差异异常处理
  'ilp:ord:exception:weight': {
    component: () => import('@/views/uexpress/orderExceptionWeight/index'),
    name: 'UexpressOrderExceptionWeightList',
    children: ["ilp:ord:order:list:detail"]
  },
  // 报关查验异常处理
  'ilp:ord:exception:export:declare': {
    component: () => import('@/views/uexpress/orderExceptionExportDeclare/index'),
    name: 'UexpressOrderExceptionExportDeclareList',
    children: ["ilp:ord:order:list:detail"]
  },
  // 机场安检异常处理
  'ilp:ord:exception:airport': {
    component: () => import('@/views/uexpress/orderExceptionAirportSecurity/index'),
    name: 'UexpressOrderExceptionAirportSecurityList',
    children: ["ilp:ord:order:list:detail"]
  },
  // 清关查验异常处理
  'ilp:ord:exception:import:declare': {
    component: () => import('@/views/uexpress/orderExceptionImportDeclare/index'),
    name: 'UexpressOrderExceptionImportDeclareList',
    children: ["ilp:ord:order:list:detail"]
  },
  // 退回海外仓异常处理
  'ilp:ord:exception:return:warehouse': {
    component: () => import('@/views/uexpress/orderExceptionReturnWarehouse/index'),
    name: 'UexpressOrderExceptionReturnWarehouseList',
    children: ["ilp:ord:order:list:detail"]
  },
  // 未妥投异常处理
  'ilp:ord:exception:undelivered': {
    component: () => import('@/views/uexpress/orderExceptionUndelivered/index'),
    name: 'UexpressOrderExceptionUndeliveredList',
    children: ["ilp:ord:order:list:detail"]
  },
  // 费用异常处理
  'ilp:ord:exception:cost': {
    component: () => import('@/views/uexpress/orderExceptionCharge/index'),
    name: 'UexpressOrderExceptionChargeList',
    children: ["ilp:ord:order:list:detail"]
  },
  // 泡货待确认
  'ilp:ord:exception:exempt:foam': {
    component: () => import('@/views/uexpress/orderExceptionExemptFoam/index'),
    name: 'UexpressOrderExceptionExemptFoamList',
    children: ["ilp:ord:order:list:detail"]
  }
}
