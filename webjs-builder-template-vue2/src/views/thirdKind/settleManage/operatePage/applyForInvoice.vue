<template>
  <apply-invoice-component :config="config" />
</template>
<script>
import ApplyInvoiceComponent from '@/views/financial/applyReceiptInvoice/ApplyInvoice.vue'
import { invoiceApplyTaxInitThkApi, invoiceApplyTaxSubmitThkApi, invoiceApplyCommercialInitThkApi, invoiceApplyCommercialSubmitThkApi } from "@/api/thirdKind"

export default {
	name: "ThkOrderManagementApplyForInvoice",
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
			CHARGE: 'ExpenseReceivableDetail', // 应付费用确认单
			CONFIRMATION: 'ConfirmationExpenseReceivable' // 应收费用确认单
		}
		let backPath = map[this.$route.query.origin]
		this.config = {
			taxInitApi: invoiceApplyTaxInitThkApi, // 税票初始化
			taxSubmitApi: invoiceApplyTaxSubmitThkApi, // 税票提交
			commercialInitApi: invoiceApplyCommercialInitThkApi, // 形票初始化
			commercialSubmitApi: invoiceApplyCommercialSubmitThkApi, // 形票提交
			taxInvoiceApplyDetailPath: 'ThkFmsTaxInvoiceApplyDetail', // 查看对应的税票申请详情name(开票申请提交之后 可查看申请详情)
			commercialInvoiceDetailPath: 'FmsCommercialInvoiceDetail', // 查看对应的形票详情name(形票电子申请提交之后 可查看发票详情)
			backPath: backPath, // 返回
			businessType: this.$route.query.businessType || ''
		}
	},
	methods: {}
}
</script>
<style lang="scss" scoped></style>
