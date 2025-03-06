import Layout from "@/layout"

export const OverseasWarehouseRouteMap = {
  // 海外仓
  "ovl:sea:house": {
    component: Layout,
    alwaysShow: true,
    name: "OverseasWarehouse"
  },
  // 仓库列表
  "ovl:warehouse:list": {
    component: () => import("@/views/cargo/v0/OverseasWarehouse/WarehouseManagement/WarehouseList"),
    children: ['ovl:warehouse:detail'],
    name: "WarehouseList"
  },
  'ovl:warehouse:detail': {
    path: "/warehouse/detail",
    component: () => import("@/views/cargo/v0/OverseasWarehouse/WarehouseManagement/WarehouseDetail"),
    name: "WarehouseDetail",
    hidden: true,
    meta: { title: "warehouseEdit" }
  },
  // 仓库基础价卡列表
  "ovl:warehouse:base:price:card": {
    component: () => import("@/views/cargo/v0/OverseasWarehouse/PriceCardManage/WarehousePriceCard/list"),
    children: ['ovl:warehouse:base:price:card:detail', 'ovl:warehouse:base:price:card:edit', 'ovl:warehouse:base:price:card:cost:edit'],
    name: "WarehousePriceCardList"
  },
  // 仓库客户价卡列表
  "ovl:warehouse:customer:price:card": {
    component: () => import("@/views/cargo/v0/OverseasWarehouse/PriceCardManage/WarehousePriceCard/customerList"),
    children: ['ovl:warehouse:base:price:card:detail', 'ovl:warehouse:base:price:card:edit', 'ovl:warehouse:base:price:card:cost:edit'],
    name: "WarehouseCustomerPriceCardList"
  },
  "ovl:warehouse:base:price:card:detail": {
    path: "warehouse/price/card/detail",
    component: () => import("@/views/cargo/v0/OverseasWarehouse/PriceCardManage/WarehousePriceCard/detail.vue"),
    name: "WarehousePriceCardDetail",
    hidden: true,
    meta: { title: "warehousePriceCardDetail" }
  },
  "ovl:warehouse:base:price:card:edit": {
    path: "warehouse/price/card/edit",
    component: () => import("@/views/cargo/v0/OverseasWarehouse/PriceCardManage/WarehousePriceCard/edit.vue"),
    name: "WarehousePriceCardEdit",
    hidden: true,
    meta: { title: "warehousePriceCardEdit" }
  },
  "ovl:warehouse:base:price:card:cost:edit": {
    path: "warehouse/price/card/costEdit",
    component: () => import("@/views/cargo/v0/OverseasWarehouse/PriceCardManage/WarehousePriceCard/costEdit.vue"),
    name: "WarehousePriceCardCostEdit",
    hidden: true,
    meta: { title: "warehousePriceCardCostEdit" }
  },


  // 仓库旺季列表
  "ovl:warehouse:peakseason": {
    component: () => import("@/views/cargo/v0/OverseasWarehouse/PeakSeasonTimeManage/warehouseSeasonList"),
    children: ['ovl:warehouse:peakseason:detail'],
    name: "WarehouseSeasonList"
  },
  "ovl:warehouse:peakseason:detail": {
    path: "warehouse/season/detail",
    component: () => import("@/views/cargo/v0/OverseasWarehouse/PeakSeasonTimeManage/warehouseSeasonDetail"),
    name: "WarehouseSeasonDetail",
    hidden: true,
    meta: { title: "warehouseSeasonEdit" }
  },
  'ovl:warehouse:priceCard:template:matching': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/PriceCardManage/WarehousePriceCard/tplWarehouseMatching.vue'), // Parent router-view
    name: 'TplWarehouseMatching'
  }
}
