<template>
	<apply-clear-component :config="config" />
</template>
<script>
import { getBillClearingApi, getInvoiceClearingApi, fmsInstructionReceiptCollectApi, getConfirmationClearingApi, getChargeClearingApi } from "@/api/financial/fmsReceiptClear";
import ApplyClearComponent from "./ApplyClearComponent";
import { payableClearApplyApi } from "@/api/financial/fmsPayableClear";

export default {
	name: "FmsPayableApplyClearPage",
	components: {
		ApplyClearComponent
	},
	data() {
		return {
			ids: [],
			origin: "",
      localServicePaymentType: "",
			back: "",
			config: {}
		};
	},
	created() {
		let ids = this.$route.query.ids; // 传入的参数Ids
		this.ids = ids.split(",");
		this.origin = this.$route.query.origin; // 来源类型
    this.localServicePaymentType = this.$route.query.localServicePaymentType;
		this.back = this.$route.query.back; // 来源Router Name

    let mapFn = {
			CHARGE: getChargeClearingApi, // 获取未销费用
			CONFIRMATION: getConfirmationClearingApi, // 获取未销确认单费用
			BILL: getBillClearingApi, // 获取未销账单
			INVOICE: getInvoiceClearingApi // 获取未销发票
		}

		this.config = {
			ids: this.ids,
      localServicePaymentType: this.localServicePaymentType,
			origin: this.origin,
			payableClearChargeInitApi: mapFn[this.origin],
			payableClearApplyApi: payableClearApplyApi, // 提交申请核销（收款核销进行关联）
			backPath: this.back // 返回
		};
	},
	methods: {}
};
</script>
<style lang="scss" scoped>
</style>
