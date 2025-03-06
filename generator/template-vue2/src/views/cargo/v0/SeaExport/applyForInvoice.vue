<template>
  <apply-invoice-component :config="config" />
</template>
<script>
import {
  invoiceApplyCommercialInitSeaApi, invoiceApplyCommercialSubmitSeaApi,
  invoiceApplyTaxInitSeaApi, invoiceApplyTaxSubmitSeaApi
} from "@/api/seaExportOrder";
import ApplyInvoiceComponent from '@/views/financial/applyReceiptInvoice/ApplyInvoice.vue'

export default {
  name: "FmsSeaApplyForInvoice",
  components: {
    ApplyInvoiceComponent
  },
  data() {
    return {
      config: {}
    }
  },
  created() {
    let map = {
      CHARGE: 'DetailsExpensesReceivableList',
      CONFIRMATION: 'ExpensesReceivableList',
      // BILL: 'FmsReceiveBill'
    }
    let backPath = map[this.$route.query.origin]
      this.config = {
        businessType: 'SEA_EXPORT',
        taxInitApi: invoiceApplyTaxInitSeaApi, // 税票初始化
        taxSubmitApi: invoiceApplyTaxSubmitSeaApi, // 税票提交
        commercialInitApi: invoiceApplyCommercialInitSeaApi, // 形票初始化
        commercialSubmitApi: invoiceApplyCommercialSubmitSeaApi, // 形票提交
        taxInvoiceApplyDetailPath: 'FmsTaxInvoiceApplyDetail', // 查看对应的税票申请详情name(开票申请提交之后 可查看申请详情)
        commercialInvoiceDetailPath: 'FmsCommercialInvoiceDetail', // 查看对应的形票详情name(形票电子申请提交之后 可查看发票详情)
        backPath: backPath // 返回
      }
  },
  methods: { }
}
</script>
<style lang="scss" scoped>
</style>
