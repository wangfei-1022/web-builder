import Layout from "@/layout"
import { OrderRouterMap } from './order'
import { OrderExceptionRouterMap } from './orderException'
import { TrackRouterMap } from './track'
import { UexpressRechargeRouterMap } from './recharge'
import { ClaimRouterMap } from './claim'
import { ProductRouterMap } from './product'
import { BaseInfoRouterMap } from './baseInfo'
import { UexpressReceiptBillRouterMap } from './receiptBill'
import { ReceiptPriceCardRouterMap } from './receiptPriceCard'
import { UexpressPayableBillRouterMap } from './payableBill'
import { PayablePriceCardRouterMap } from './payablePriceCard'

export const UExpressRouterMap = {
  // 国际专线业务
  'ilp': {
    component: Layout,
    alwaysShow: true,
    name: 'ILP',
    path: '/uexpress'
  },
  ...OrderRouterMap,
  ...OrderExceptionRouterMap,
  ...ReceiptPriceCardRouterMap,
  ...TrackRouterMap,
  ...UexpressRechargeRouterMap,
  ...ClaimRouterMap,
  ...ProductRouterMap,
  ...BaseInfoRouterMap,
  ...UexpressReceiptBillRouterMap,
  ...UexpressPayableBillRouterMap,
  ...PayablePriceCardRouterMap
}
