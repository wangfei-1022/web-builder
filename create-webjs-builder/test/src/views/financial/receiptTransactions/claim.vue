<template>
	<el-tabs type="border-card" class="top-tabs">
    <!--待认领-->
		<el-tab-pane :label="$t('fmsReceiptTransactions.to_claim')">
			<toclaim role="BUSINESS"></toclaim>
		</el-tab-pane>
    <!--我的认领-->
		<el-tab-pane :label="$t('fmsReceiptTransactions.my_claim')" lazy>
			<claim-list type="MY" role="BUSINESS"></claim-list>
		</el-tab-pane>
    <!--全部认领-->
		<el-tab-pane :label="$t('fmsReceiptTransactions.all_claim')" lazy v-if="isAllClaimList">
			<claim-list type="ALL" role="BUSINESS"></claim-list>
		</el-tab-pane>
    <!--全部收款-->
		<el-tab-pane :label="$t('fmsReceiptTransactions.all_transactions')" lazy v-if="isAllTransactionsList">
			<transactions-all role="BUSINESS"></transactions-all>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
import toclaim from "./toclaim";
import claimList from "./claimList";
import transactionsAll from "./transactionsAll";
import { getBillStatusNumberApi } from "@/api/financial/fmsReceive";
import store from "@/store";

export default {
	name: "ClaimReceiptList",
	components: {
		toclaim,
		claimList,
		transactionsAll
	},
	data() {
		return {
			loading: false,
			isAllTransactionsList: false,
			isAllClaimList: false
		};
	},
	created() {
		const roles = store.getters && store.getters.roles;
		roles.forEach(v => {
			if (v === "fms:re:trans:claim:all:re") {
				this.isAllTransactionsList = true;
			}
			if (v === "fms:re:trans:claim:all:claim") {
				this.isAllClaimList = true;
			}
		});
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
