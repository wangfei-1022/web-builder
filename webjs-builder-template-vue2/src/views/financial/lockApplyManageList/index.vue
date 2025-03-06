<template>
	<el-tabs type="border-card" class="top-tabs">
		<!--待解锁-->
		<el-tab-pane :label="$t('fmsLock.LOCKED')">
			<locked :lockOrderState="50" origin="FmsLockApplyManageList" />
		</el-tab-pane>
		<!--待上锁-->
		<el-tab-pane :label="$t('fmsLock.UNLOCKED') + '(' + UNLOCKED + ')'" lazy>
			<list :lockOrderState="40" origin="FmsLockApplyManageList" />
		</el-tab-pane>
		<!--全部-->
		<el-tab-pane :label="$t('fmsLock.ALL')" lazy>
			<list origin="FmsLockApplyManageList" />
		</el-tab-pane>
	</el-tabs>
</template>

<script>
import List from "./list";
import Locked from "./locked";
import { getFmsOrderLockCountApi } from "@/api/financial/fmsLock";

// 锁单状态：0-待锁单,20-审批中,30-调整中,40-待上锁, 50-已锁单

export default {
	name: "FmsLockApplyManageList",
	components: {
		List,
        Locked
	},
	data() {
		return {
			loading: false,
      UNLOCKED: 0
		};
	},
	created() {
		this.init();
	},
	methods: {
		init() {
			getFmsOrderLockCountApi(1).then(res => {
				if (res.ok) {
					this.UNLOCKED = res.content || 0
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
