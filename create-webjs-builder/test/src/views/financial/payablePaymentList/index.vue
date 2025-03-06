<template>
	<el-tabs type="border-card" class="top-tabs">
    <!--待付款-->
		<el-tab-pane :label="$t('fmsPayablePayment.UN_PAY') + '(' + unPayCount + ')'">
			<un-pay-list role="FINANCE" origin="FmsPayablePaymentList" />
		</el-tab-pane>
		<!--审批中-->
		<el-tab-pane :label="$t('fmsPayablePayment.IN_APPROVAL') + '(' + inApprovalCount + ')'" lazy>
			<in-approval-list role="FINANCE" origin="FmsPayablePaymentList" />
		</el-tab-pane>
		<!--全部-->
		<el-tab-pane :label="$t('fmsPayablePayment.ALL')" lazy>
			<all-list role="FINANCE" origin="FmsPayablePaymentList" />
		</el-tab-pane>
	</el-tabs>
</template>

<script>
import InApprovalList from "@/views/financial/payablePaymentApplyList/list/InApprovalList";
import UnPayList from "@/views/financial/payablePaymentApplyList/list/UnPayList";
import AllList from "@/views/financial/payablePaymentApplyList/list/AllList";
import { getPayablePaymentFinanceCountApi } from "@/api/financial/fmsPayablePayment";

export default {
	name: "FmsPayablePaymentList",
	components: {
		InApprovalList,
    UnPayList,
    AllList
	},
	data() {
		return {
			loading: false,
      unPayCount: 0,
      inApprovalCount: 0
		};
	},
	created() {
		this.init();
	},
	methods: {
		init() {
      // 1 待付款 2 审批中
			getPayablePaymentFinanceCountApi(1).then(res => {
				if (res.ok) {
					this.unPayCount = res.content.value;
				}
			});
      getPayablePaymentFinanceCountApi(2).then(res => {
				if (res.ok) {
					this.inApprovalCount = res.content.value;
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
