import Layout from "@/layout"
import { ReceiptChargeBillRouterMap } from './receiptChargeBill'
import { ReceiptClearRouterMap } from './receiptClear'
import { ReceiptInvoiceRouterMap } from './receiptInvoice'

import { PayableChargeBillRouterMap } from './payableChargeBill'
import { PayablePaymentRouterMap } from './payablePayment'
import { PayableClearRouterMap } from './payableClear'

import { RechargeRecordRouterMap } from './rechargeRecord'
import { TransactionsRouterMap } from './transactions'
import { ProfitRouterMap } from './profit'
import { FmsLockRouterMap } from './lock'

export const FmsRouterMap = {
  // 财务结算
  "fms:manage": {
    component: Layout,
    alwaysShow: true,
    name: "Financial"
  },
  // 理赔列表--小包业务
  'fms:uexpress:claim:customer:list': {
    component: () => import('@/views/financial/claimCustomerList/index'),
    name: 'FmsClaimCustomerList'
  },
  ...ReceiptChargeBillRouterMap,
  ...ReceiptClearRouterMap,
  ...ReceiptInvoiceRouterMap,

  ...RechargeRecordRouterMap,
  ...TransactionsRouterMap,

  ...PayablePaymentRouterMap,
  ...PayableClearRouterMap,
  ...PayableChargeBillRouterMap,
  ...ProfitRouterMap,
  ...FmsLockRouterMap
}
