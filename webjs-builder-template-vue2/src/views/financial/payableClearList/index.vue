<template>
	<el-tabs type="border-card" class="top-tabs">
		<!--待核销-->
		<el-tab-pane :label="$t('fmsReceiveClear.un_clear')">
			<clear-list-un role="BUSINESS" origin="FmsPayableClearBusinessList"></clear-list-un>
		</el-tab-pane>
		<!--待对冲核销-->
		<el-tab-pane :label="$t('fmsReceiveClear.un_offset_clear')" v-if="false">
			<offset-clear-list-un role="BUSINESS" origin="FmsPayableClearBusinessList"></offset-clear-list-un>
		</el-tab-pane>
		<!--全部核销-->
		<el-tab-pane :label="$t('fmsReceiveClear.all_clear')" lazy>
			<clear-list-all role="BUSINESS" origin="FmsPayableClearBusinessList"></clear-list-all>
		</el-tab-pane>
		<!--全部对冲核销-->
		<el-tab-pane :label="$t('fmsReceiveClear.all_offset_clear')" lazy v-if="false">
			<offset-clear-list-all role="BUSINESS" origin="FmsPayableClearBusinessList"></offset-clear-list-all>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
import ClearListUn from "./clearListUn";
import ClearListAll from "./clearListAll";
import OffsetClearListUn from "./offsetClearListUn";
import OffsetClearListAll from "./offsetClearListAll";
import { getBillStatusNumberApi } from "@/api/financial/fmsReceive";

export default {
	name: "FmsPayableClearBusinessList",
	components: {
		ClearListUn,
		ClearListAll,
		OffsetClearListUn,
		OffsetClearListAll
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
