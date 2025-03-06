import Layout from "@/layout"

export const OvlBillRouterMap = {
  // 海外仓账单管理
  "ovl:charge": {
    component: Layout,
    alwaysShow: true,
    name: "OvlBill"
  },
  // 应收费用明细
  "ovl:receive:charge:list": {
    component: () => import("@/views/ovl/receiveCharge"),
    name: "OvlReceiveCharge",
    children: ["ovl:receive:charge:add", "ovl:receive:charge:adjust"]
  },
  // 应收费用确认单
  "ovl:receive:confirmation:list": {
    component: () => import("@/views/ovl/receiveConfirmation"),
    name: "OvlReceiveConfirmation",
    children: ["ovl:receive:charge:add", "ovl:receive:charge:adjust"]
  },
  // 应收账单
  "ovl:receive:bill": {
    component: () => import("@/views/ovl/receiveBill"),
    name: "OvlReceiveBill"
  },
  // 应收费用-添加费用
  "ovl:receive:charge:add": {
    path: "/ovl/receive/charge/add",
    component: () => import("@/views/ovl/adjustCharge"),
    name: "OvlAdjustChargeAdd",
    hidden: true,
    meta: { title: "添加费用" }
  },
  // 应收费用-添加费用
  "ovl:receive:charge:adjust": {
    path: "/ovl/receive/charge/adjust",
    component: () => import("@/views/ovl/adjustCharge"),
    name: "OvlAdjustCharge",
    hidden: true,
    meta: { title: "调整费用" }
  },
  // 仓储计费单
  'ovl:warehouse:bill:list': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/InventoryManager/warehouseBill'), // Parent router-view
    children: ['ovl:warehouse:bill:detail'],
    name: 'WarehouseBill'
  },
  // 仓储计费单明细
  'ovl:warehouse:bill:detail': {
    path: 'warehouse/bill/detail',
    component: () => import('@/views/cargo/v0/OverseasWarehouse/InventoryManager/warehouseBillDetail'), // Parent router-view
    name: 'WarehouseBillDetail',
    hidden: true,
    meta: { title: 'warehouseBillDetail' }
  },
  // 费用变更日志
  "ovl:charge:log:list": {
    component: () => import("@/views/ovl/chargeLogList"),
    name: "ChargeLogList"
  },
  // 订单预估费用
  "ovl:estimate:charge:list": {
    component: () => import("@/views/ovl/estimateChargeList"),
    name: "EstimateChargeList"
  },
}
