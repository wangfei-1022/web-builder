<template>
	<el-tabs type="border-card" class="top-tabs">
		<!--待提交-->
		<el-tab-pane :label="$t('fmsProfit.UNCOMMITTED') + '(' + UNCOMMITTED + ')'">
			<uncommitted-list role="BUSINESS" origin="FmsProfitApplyList" />
		</el-tab-pane>
		<!--待审核-->
		<el-tab-pane :label="$t('fmsProfit.UNAUDITED') + '(' + UNAUDITED + ')'" lazy>
			<unaudited-list role="BUSINESS" origin="FmsProfitApplyList" />
		</el-tab-pane>
		<!--审核拒绝-->
		<el-tab-pane :label="$t('fmsProfit.AUDITED_REJECT') + '(' + AUDITED_REJECT + ')'" lazy>
			<audited-reject-list role="BUSINESS" origin="FmsProfitApplyList" />
		</el-tab-pane>
		<!--全部-->
		<el-tab-pane :label="$t('fmsProfit.ALL')" lazy>
			<all-list role="BUSINESS" origin="FmsProfitApplyList" />
		</el-tab-pane>
	</el-tabs>
</template>

<script>
import UncommittedList from "./list/UncommittedList";
import UnauditedList from "./list/UnauditedList";
import AuditedRejectList from "./list/AuditedRejectList";
import AllList from "./list/AllList";
import { getProfitApplyCountApi } from "@/api/financial/fmsProfitApply";

export default {
	name: "FmsProfitApplyList",
	components: {
		UncommittedList,
    UnauditedList,
    AuditedRejectList,
    AllList
	},
	data() {
		return {
			loading: false,
      UNCOMMITTED: 0,
      UNAUDITED: 0,
      AUDITED_REJECT: 0
		};
	},
	created() {
		this.init();
	},
	methods: {
		init() {
			getProfitApplyCountApi(1).then(res => {
				if (res.ok) {
					res.content.forEach(v => {
            if(v.profitState === 5) {
              this.UNCOMMITTED = v.count
            }
            if(v.profitState === 10) {
              this.UNAUDITED = v.count
            }
            if(v.profitState === 30) {
              this.AUDITED_REJECT = v.count
            }
          })
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
