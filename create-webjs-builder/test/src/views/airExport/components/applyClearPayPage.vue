<template>
	<apply-clear-component :config="config" />
</template>
<script>
import { getBillClearingApi, getInvoiceClearingApi, fmsInstructionReceiptCollectApi, getConfirmationClearingApi, getChargeClearingApi } from "@/api/financial/fmsReceiptClear";
import { payableClearApplyApi } from "@/api/financial/fmsPayableClear";
import ApplyClearComponent from "@/views/financial/applyPayableClear/ApplyClearComponent";
import {postApClearApplyApi} from "@/api/airExport";

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
		this.back = this.$route.query.back; // 来源Router Name
    this.localServicePaymentType = this.$route.query.localServicePaymentType; 

    let mapFn = {
			CHARGE: getChargeClearingApi, // 获取未销费用
			CONFIRMATION: getConfirmationClearingApi, // 获取未销确认单费用
			BILL: getBillClearingApi, // 获取未销账单
			INVOICE: getInvoiceClearingApi // 获取未销发票
		}

		this.config = {
      localServicePaymentType: "",
			ids: this.ids,
			origin: this.origin,
			payableClearChargeInitApi: mapFn[this.origin],
			payableClearApplyApi: postApClearApplyApi, // 提交申请核销（收款核销进行关联）
			backPath: this.back // 返回
		};
	},
	methods: {}
};
</script>
<style lang="scss" scoped>
</style>
