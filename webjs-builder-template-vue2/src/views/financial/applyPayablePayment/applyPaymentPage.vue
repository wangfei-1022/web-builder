<template>
	<apply-payment-component :config="config" />
</template>
<script>
import {getChargeClearingApi, getConfirmationClearingApi, getBillClearingApi } from "@/api/financial/base"
import { submitPaymentApplyApi, getPaymentApplyCopyInitApi } from "@/api/financial/fmsPayablePayment"
import ApplyPaymentComponent from './ApplyPaymentComponent'

export default {
	name: "FmsPayableApplyPayment",
	components: {
		ApplyPaymentComponent
	},
	data() {
		return {
			config: {}
		}
	},
	created() {
    let mapFn = {
			CHARGE: getChargeClearingApi,
			CONFIRMATION: getConfirmationClearingApi,
			BILL: getBillClearingApi,
			PAYMENT_APPLY_COPY: getPaymentApplyCopyInitApi,
		}
    let ids = (this.$route.query.ids || this.$route.params.ids || "").split(",");
    this.config = {
      ids: ids,
      paymentChargeInitFn: mapFn[this.$route.query.origin],
      submitApi: submitPaymentApplyApi,
      backPath: this.$route.query.back // 返回
    }
	},
	methods: {}
}
</script>
<style lang="scss" scoped>
</style>
