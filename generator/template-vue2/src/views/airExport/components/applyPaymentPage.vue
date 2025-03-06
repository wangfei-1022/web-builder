<template>
	<apply-payment-component :config="config"/>
</template>
<script>
import {getChargeClearingApi, getConfirmationClearingApi, getBillClearingApi } from "@/api/financial/base"
import ApplyPaymentComponent from "@/views/financial/applyPayablePayment/ApplyPaymentComponent";
import {postChargePaymentApplyApi} from "@/api/airExport";

export default {
	name: "AirApplyForPayment",
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
			BILL: getBillClearingApi
		}
    let ids = (this.$route.query.ids || this.$route.params.ids || "").split(",");
    this.config = {
      ids: ids,
      paymentChargeInitFn: mapFn[this.$route.query.origin],
      submitApi: postChargePaymentApplyApi,
      backPath: this.$route.query.back // 返回
    }
	},
	methods: {}
}
</script>
<style lang="scss" scoped>
</style>
