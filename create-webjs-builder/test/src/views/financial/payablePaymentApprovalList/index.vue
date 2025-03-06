<template>
	<el-tabs type="border-card" class="top-tabs">
		<!--待审批-->
		<el-tab-pane :label="$t('fmsPayablePayment.UN_APPROVAL') + '(' + unApprovalCount + ')'">
			<unapproval-list origin="FmsPayablePaymentApprovalList" />
		</el-tab-pane>
		<!--已审批-->
		<el-tab-pane :label="$t('fmsPayablePayment.APPROVAL')" lazy>
			<approval-list origin="FmsPayablePaymentApprovalList" />
		</el-tab-pane>
		<!--审批拒绝-->
		<el-tab-pane :label="$t('fmsPayablePayment.APPROVAL_REJECT')" lazy>
			<approval-reject-list origin="FmsPayablePaymentApprovalList" />
		</el-tab-pane>
		<!--全部-->
		<el-tab-pane :label="$t('fmsPayablePayment.ALL')" lazy>
			<all-list origin="FmsPayablePaymentApprovalList" />
		</el-tab-pane>
	</el-tabs>
</template>

<script>
import UnapprovalList from "./list/UnapprovalList";
import ApprovalList from "./list/ApprovalList";
import ApprovalRejectList from "./list/ApprovalRejectList";
import AllList from "./list/AllList";
import { getPayablePaymentApprovalCountApi } from "@/api/financial/fmsPayablePayment";

export default {
	name: "FmsPayablePaymentApprovalList",
	components: {
    UnapprovalList,
    ApprovalList,
    ApprovalRejectList,
    AllList
	},
	data() {
		return {
			loading: false,
      unApprovalCount: 0
		};
	},
	created() {
		this.init();
	},
	methods: {
		init() {
			// 1 待审批
			getPayablePaymentApprovalCountApi(1).then(res => {
				if (res.ok) {
					this.unApprovalCount = res.content.value;
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
