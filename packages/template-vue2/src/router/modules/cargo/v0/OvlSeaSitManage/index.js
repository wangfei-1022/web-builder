import Layout from "@/layout"

export const OvlSeaSitManageRouteMap = {
  // 关务管理
  "omc:ovl:sea:sit": {
    component: Layout,
    alwaysShow: true,
    name: "OvlSeaSitManage"
  },
  // 货品列表
  "ovl:sea:goods": {
    component: () => import("@/views/cargo/v0/OvlSeaSitManage/SeaGoodsManage/SeaGoodsList"),
    children: ['ovl:sea:goods:detail'],
    name: "SeaGoodsList"
  },
  // 货品列表维护
  'ovl:sea:goods:detail': {
    path: "/sea/goods/detail/:operate/:id?",
    component: () => import("@/views/cargo/v0/OvlSeaSitManage/SeaGoodsManage/SeaGoodsDetail"),
    name: "SeaGoodsDetail",
    hidden: true,
    meta: { title: "SeaGoodsDetail" }
  },
  // 预报单管理
  "ovl:sea:bl": {
    component: () => import("@/views/cargo/v0/OvlSeaSitManage/SeaBlManage/SeaBlList"),
    children: ['ovl:sea:bl:detail'],
    name: "SeaBlList"
  },
  // 预报单管理维护
  'ovl:sea:bl:detail': {
    path: "/sea/bl/detail/:operate/:id?",
    component: () => import("@/views/cargo/v0/OvlSeaSitManage/SeaBlManage/SeaBlDetail"),
    name: "SeaBlDetail",
    hidden: true,
    meta: { title: "SeaBlDetail", noCache: true }
  },
  // 提柜管理
  "ovl:sea:pick:up": {
    component: () => import("@/views/cargo/v0/OvlSeaSitManage/SeaBlManage/ContainerHandleManage"),
    children: ['ovl:sea:pick:up:detail'],
    name: "ContainerHandleManage"
  },
  // 提柜管理维护
  'ovl:sea:pick:up:detail': {
    component: () => import("@/views/cargo/v0/OvlSeaSitManage/SeaBlManage/ContainerHandleDetail"),
    name: "ContainerHandleDetail",
    path: "/sea/pick/up/detail/:operate/:id?",
    hidden: true,
    meta: { title: "ContainerHandleDetail", noCache: true }
  },
  // 还柜管理
  "ovl:sea:return": {
    component: () => import("@/views/cargo/v0/OvlSeaSitManage/SeaBlManage/ContainerReturnManage"),
    children: ['ovl:sea:return:detail'],
    name: "ContainerReturnManage"
  },
  // 还柜管理维护
  "ovl:sea:return:detail": {
    component: () => import("@/views/cargo/v0/OvlSeaSitManage/SeaBlManage/ContainerReturnDetail"),
    name: "ContainerReturnDetail",
    path: "/sea/return/detail/:operate/:id?",
    hidden: true,
    meta: { title: "ContainerReturnDetail", noCache: true }
  },
  // 报关管理
  "ovl:sea:customs": {
    component: () => import("@/views/cargo/v0/OvlSeaSitManage/SeaBlManage/CustomsDeclarationManage"),
    children: ['ovl:sea:customs:detail'],
    name: "CustomsDeclarationManage"
  },
  // 报关管理维护
  "ovl:sea:customs:detail": {
    component: () => import("@/views/cargo/v0/OvlSeaSitManage/SeaBlManage/CustomsDeclarationDetail"),
    name: "CustomsDeclarationDetail",
    path: "/sea/customs/detail/:operate/:id?",
    hidden: true,
    meta: { title: "CustomsDeclarationDetail", noCache: true }
  },
  // 报关管理
  "ovl:sea:ctn": {
    component: () => import("@/views/cargo/v0/OvlSeaSitManage/SeaBlManage/ContainerManage"),
    name: "ContainerManage"
  }
}
