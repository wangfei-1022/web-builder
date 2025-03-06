<template>
	<el-tabs type="border-card" class="top-tabs">
		<!--待审核-->
		<el-tab-pane :label="$t('fmsProfit.UNAUDITED') + '(' + UNAUDITED + ')'" lazy>
			<unaudited-list role="SETTLEMENT" origin="FmsProfitAuditList" />
		</el-tab-pane>
		<!--全部-->
		<el-tab-pane :label="$t('fmsProfit.ALL')" lazy>
			<all-list role="SETTLEMENT" origin="FmsProfitAuditList" />
		</el-tab-pane>
	</el-tabs>
</template>

<script>
import UnauditedList from "@/views/financial/profitApplyList/list/UnauditedList";
import AllList from "@/views/financial/profitApplyList/list/AllList";
import { getProfitAduitCountApi } from "@/api/financial/fmsProfitAudit";

export default {
	name: "FmsProfitAuditList",
	components: {
    UnauditedList,
    AllList
	},
	data() {
		return {
			loading: false,
      UNAUDITED: 0
		};
	},
	created() {
		this.init();
	},
	methods: {
		init() {
			getProfitAduitCountApi().then(res => {
				if (res.ok) {
					res.content.forEach(v => {
            if(v.profitState === 10) {
              this.UNAUDITED = v.count
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
