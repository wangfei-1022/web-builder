<template>
	<offset-clear-component :config="config" />
</template>
<script>
import { getBillClearingApi, getInvoiceClearingApi, getConfirmationClearingApi, getChargeClearingApi, getPayableBillUninstructionApi, getHedgeResultApi, fmsInstructionOffsetSubmitApi } from "@/api/financial/fmsReceiptClear";
import OffsetClearComponent from "./offsetClearComponent";

export default {
	name: "FmsReceiptOffsetClearPage",
	components: {
		OffsetClearComponent
	},
	data() {
		return {
			ids: [],
			origin: "",
			back: "",
			config: {}
		};
	},
	created() {
		let ids = this.$route.query.ids; // 传入的参数Ids
		this.ids = ids.split(",");
		this.origin = this.$route.query.origin; // 来源类型
		this.back = this.$route.query.back; // 来源Router Name
		this.config = {
			ids: this.ids,
			origin: this.origin,
			getBillClearingApi: getBillClearingApi, // 获取未销账单
			getInvoiceClearingApi: getInvoiceClearingApi, // 获取未销发票
			getConfirmationClearingApi: getConfirmationClearingApi, // 获取未销确认单费用
			getChargeClearingApi: getChargeClearingApi, // 获取未销费用
			fmsInstructionOffsetSubmitApi: fmsInstructionOffsetSubmitApi, // 提交对冲申请核销（收款应付应收核销进行关联）
			getPayableBillUninstructionApi: getPayableBillUninstructionApi, // 获取应付的未关联的账单
			getHedgeResultApi: getHedgeResultApi, // 第一步获取应收应付的对冲结果
			backPath: this.back // 返回
		};
	},
	methods: {}
};
</script>
<style lang="scss" scoped>
</style>
