import Layout from '@/layout'

export const DomesticTransportationMap = {
  // 境内运输
  'trans:domestic': {
    component: Layout,
    alwaysShow: true,
    name: 'DomesticTransportation'
  },
  // 物流公司
  'ovl:logistics:company': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/LogisticsCompany'),
    name: 'LogisticsCompany'
  },
  // 物流产品
  'ovl:logistics:products': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/LogisticsProducts'),
    children: ["ovl:product:edit"],
    name: 'LogisticsProducts'
  },
  "ovl:product:edit": {
    path: 'logistics/product/detail',
    component: () => import('@/views/cargo/v0/OverseasWarehouse/LogisticsProductsDetail'),
    name: 'LogisticsProductsDetail',
    hidden: true,
    meta: { title: 'productEdit' }
  },
  // 分区
  'ovl:partition': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/Partition'),
    name: 'Partition'
  },
  // 渠道
  'ovl:channel': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/Channel'),
    name: 'Channel'
  },
  // 税率配置
  'ovl:division:rate': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/OvlDivisionRate'),
    name: 'OvlDivisionRate'
  },
  // 渠道成本价卡
  'ovl:trans:cost:price:card': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/PriceCardManage/DomesticTransportation/ChannelPriceCard'),
    children: ["ovl:trans:cost:price:card:edit"],
    name: 'ChannelPriceCard'
  },
  // 渠道成本价卡维护
  "ovl:trans:cost:price:card:edit": {
    path: 'price/card/edit',
    component: () => import('@/views/cargo/v0/OverseasWarehouse/PriceCardManage/DomesticTransportation/ChannelPriceCardDetail.vue'),
    name: 'ChannelPriceCardDetail',
    hidden: true,
    meta: { title: 'channelPriceCardEdit' }
  },
  // 物流产品基础价卡
  'ovl:trans:base:price:card': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/PriceCardManage/DomesticTransportation/ProductCostPriceCard'),
    children: ['ovl:trans:base:price:card:edit'],
    name: 'ProductCostPriceCard'
  },
  // 物流产品基础价卡维护
  'ovl:trans:base:price:card:edit': {
    path: 'cost/price/card/edit',
    component: () => import('@/views/cargo/v0/OverseasWarehouse/PriceCardManage/DomesticTransportation/ProductCostPriceCardDetail.vue'),
    name: 'ProductCostPriceCardDetail',
    hidden: true,
    meta: { title: 'productCostPriceCardEdit' }
  },
  // 物流产品客户价卡
  'ovl:trans:customer:price:card': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/PriceCardManage/DomesticTransportation/ProductCustomerPriceCard'),
    children: ['ovl:trans:customer:price:card:edit'],
    name: 'ProductCustomerPriceCard'
  },
  // 物流产品客户价卡维护
  'ovl:trans:customer:price:card:edit': {
    path: 'customer/price/card/edit',
    component: () => import('@/views/cargo/v0/OverseasWarehouse/PriceCardManage/DomesticTransportation/ProductCustomerPriceCardDetail.vue'),
    name: 'ProductCustomerPriceCardDetail',
    hidden: true,
    meta: { title: 'productCustomerPriceCardEdit' }
  },
  // 燃油费率管理列表
  'ovl:warehouse:fuel:rate': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/PeakSeasonTimeManage/fuelRateList'),
    children: ['ovl:warehouse:fuel:rate:edit'],
    name: 'FuelRateList'
  },
  // 燃油费率管理列表维护
  'ovl:warehouse:fuel:rate:edit': {
    path: 'fuel/rate/detail',
    component: () => import('@/views/cargo/v0/OverseasWarehouse/PeakSeasonTimeManage/fuelRateDetail'),
    name: 'FuelRateDetail',
    hidden: true,
    meta: { title: 'fuelRateEdit' }
  },
  // 旺季时间管理
  "ovl:warehouse:peakseason:surcharge": {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/PeakSeasonTimeManage/peakSeasonSurchargeList'),
    children: ["ovl:warehouse:peakseason:surcharge:edit"],
    name: 'PeakSeasonSurchargeList'
  },
  "ovl:warehouse:peakseason:surcharge:edit": {
    path: '/peak/season/surcharge/detail',
    component: () => import('@/views/cargo/v0/OverseasWarehouse/PeakSeasonTimeManage/peakSeasonSurchargeDetail'),
    name: 'PeakSeasonSurchargeDetail',
    hidden: true,
    meta: { title: 'peakSeasonSurchargeEdit' }
  },
  // 渠道旺季成本
  "trans:channel:peak:season:list": {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/PriceCardManage/DomesticTransportation/channelPeakSeasonCostPriceCard'),
    name: 'ChannelPeakSeasonCostPriceCard'
  },
  // 渠道模板匹配
  'ovl:channel:priceCard:template:matching': {
    component: () => import('@/views/cargo/v0/OverseasWarehouse/PriceCardManage/DomesticTransportation/tplChannelMatching.vue'), // Parent router-view
    name: 'TplChannelMatching'
  }
}
