<template>
	<apply-invoice-component :config="config" />
</template>
<script>
import {
	invoiceApplyTaxInitApi,
	invoiceApplyTaxSubmitApi,
	invoiceApplyCommercialInitApi,
	invoiceApplyCommercialSubmitApi,
	getInvoiceChargeByChargeApi,
	getInvoiceChargeByConfirmationApi,
	getInvoiceChargeByBillApi
} from "@/api/financial/fmsReceiveInvoice"
import ApplyInvoiceComponent from './ApplyInvoice'

export default {
	name: "FmsApplyForInvoice",
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
			CHARGE: 'FmsReceiveCharge',
			CONFIRMATION: 'FmsReceiveConfirmation',
			BILL: 'FmsReceiveBill'
		}
		let backPath = map[this.$route.query.origin]
			this.config = {
				taxInitApi: invoiceApplyTaxInitApi, // 税票初始化
				taxSubmitApi: invoiceApplyTaxSubmitApi, // 税票提交
				commercialInitApi: invoiceApplyCommercialInitApi, // 形票初始化
				commercialSubmitApi: invoiceApplyCommercialSubmitApi, // 形票提交
				taxInvoiceApplyDetailPath: 'FmsTaxInvoiceApplyDetail', // 查看对应的税票申请详情name(开票申请提交之后 可查看申请详情)
				commercialInvoiceDetailPath: 'FmsCommercialInvoiceDetail', // 查看对应的形票详情name(形票电子申请提交之后 可查看发票详情)
				backPath: backPath // 返回
			}
	},
	methods: {}
}
</script>
<style lang="scss" scoped>
</style>
