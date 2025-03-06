<template>
	<apply-clear-component :config="config" />
</template>
<script>
import { getBillClearingApi, getInvoiceClearingApi, getConfirmationClearingApi, getChargeClearingApi } from "@/api/financial/fmsReceiptClear";
import ApplyClearComponent from "@/views/financial/applyReceiptClear/applyClearComponent";
import {getCollectNotifyApi} from "@/api/seaExportOrder";

export default {
	name: "SeaFmsApplyClearPage",
	components: {
		ApplyClearComponent
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
			fmsInstructionReceiptCollectApi: getCollectNotifyApi, // 提交申请核销（收款核销进行关联）
			backPath: this.back // 返回
		};
	},
	methods: {}
};
</script>
<style lang="scss" scoped>
</style>
