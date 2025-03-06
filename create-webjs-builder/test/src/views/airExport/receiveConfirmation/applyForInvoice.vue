<template>
  <apply-invoice-component :config="config" />
</template>
<script>

import ApplyInvoiceComponent from '@/views/financial/applyReceiptInvoice/ApplyInvoice.vue'
import {
  invoiceApplyTaxInitAirApi,
  invoiceApplyTaxSubmitAirApi,
  invoiceApplyCommercialInitAirApi,
  invoiceApplyCommercialSubmitAirApi
} from "@/api/fmsReceiveAir"

export default {
  name: "FmsAirApplyForInvoice",
  components: {
    ApplyInvoiceComponent
  },
  data () {
    return {
      config: {}
    }
  },
  created () {
    let map = {
      // CHARGE: 'DetailsExpensesReceivableList',
      CONFIRMATION: 'AirReceiveConfirmation'
    }
    let backPath = map[this.$route.query.origin]

    this.config = {
      taxInitApi: invoiceApplyTaxInitAirApi, // 税票初始化
      taxSubmitApi: invoiceApplyTaxSubmitAirApi, // 税票提交
      commercialInitApi: invoiceApplyCommercialInitAirApi, // 形票初始化
      commercialSubmitApi: invoiceApplyCommercialSubmitAirApi, // 形票提交
      taxInvoiceApplyDetailPath: 'AirFmsTaxInvoiceApplyDetail', // 查看对应的税票申请详情name(开票申请提交之后 可查看申请详情)
      commercialInvoiceDetailPath: 'FmsCommercialInvoiceDetail', // 查看对应的形票详情name(形票电子申请提交之后 可查看发票详情)
      backPath: backPath, // 返回
      businessType: "AIR_EXPORT"
    }
  },
  methods: {}
}
</script>
<style lang="scss" scoped></style>
