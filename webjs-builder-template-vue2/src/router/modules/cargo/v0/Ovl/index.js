import Layout from "@/layout"

export const OvlRouteMap = {
  // 海外仓
  "mdm:ovl": {
    component: Layout,
    alwaysShow: true,
    name: "OvlManage"
  },
  // 免堆期管理
  "ovl:sea:free:period": {
    component: () => import("@/views/cargo/v0/Information/Free/FreePeriod.vue"),
    name: "FreePeriod"
  },
  'ovl:sea:free:box': {
    component: () => import("@/views/cargo/v0/Information/Free/FreeBox.vue"),
    name: "FreeBox"
  },
  'ovl:country:division:list': {
    component: () => import("@/views/cargo/v0/Information/countryDivisionList.vue"),
    name: "countryDivisionList"
  }
}
