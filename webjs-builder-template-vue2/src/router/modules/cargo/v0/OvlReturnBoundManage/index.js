import Layout from "@/layout"

export const OvlReturnBoundManageMap = {
  // 退货管理
  "ovl:return": {
    component: Layout,
    alwaysShow: true,
    name: "OvlReturnBoundManage"
  },
  // 退货列表
  "ovl:return:list": {
    component: () => import("@/views/cargo/v0/OverseasWarehouse/ReturnBoundManage/returnStorage.vue"),
    children: ['ovl:return:list:detail'],
    name: "ReturnStorage"
  },
  // 退货管理详情
  'ovl:return:list:detail': {
    path: "/ovl/return/detail",
    component: () => import("@/views/cargo/v0/OverseasWarehouse/ReturnBoundManage/returnStorageDetail.vue"),
    name: "ReturnStorageDetail",
    hidden: true,
    meta: { title: "ReturnStorageDetail" }
  }

}
