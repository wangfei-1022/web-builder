<template>
	<el-tabs type="border-card" class="top-tabs">
     <!--待认领-->
		<el-tab-pane :label="$t('fmsReceiptTransactions.to_claim')">
			<toclaim role="FINANCE"></toclaim>
		</el-tab-pane>
     <!--全部收款-->
		<el-tab-pane :label="$t('fmsReceiptTransactions.all_transactions')" lazy>
			<transactions-all role="FINANCE"></transactions-all>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
import toclaim from "./toclaim";
import transactionsAll from "./transactionsAll";
import { getBillStatusNumberApi } from "@/api/financial/fmsReceive";

export default {
	name: "TransactionsReceiptList",
	components: {
		toclaim,
		transactionsAll
	},
	data() {
		return {
			loading: false
		};
	},
	created() {
		this.init();
	},
	methods: {
		init() {
			// 待对账
			getBillStatusNumberApi(1).then(res => {
				if (res.ok) {
					this.unBillStateTitle = this.$t("receiveFms.UN_VERIFY") + "(" + res.content.value + ")";
				}
			});
		}
	}
};
</script>
<style lang="scss" scoped>
::v-deep .el-tabs__content{
  padding: 0px;
}
</style>
