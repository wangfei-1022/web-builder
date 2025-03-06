<template>
	<el-tabs type="border-card" class="top-tabs">
		<!--待核销-->
		<el-tab-pane :label="$t('fmsReceiveClear.un_clear')">
			<clear-list-un role="OPERATOR" origin="ReceiptClearApplyOperatorList"></clear-list-un>
		</el-tab-pane>
		<!--待对冲核销-->
		<el-tab-pane :label="$t('fmsReceiveClear.un_offset_clear')" lazy v-if="isOffsetClearList">
			<offset-clear-list-un role="OPERATOR" origin="ReceiptClearApplyOperatorList"></offset-clear-list-un>
		</el-tab-pane>
		<!--全部核销-->
		<el-tab-pane :label="$t('fmsReceiveClear.all_clear')" lazy>
			<clear-list-all role="OPERATOR" origin="ReceiptClearApplyOperatorList"></clear-list-all>
		</el-tab-pane>
		<!--全部对冲核销-->
		<el-tab-pane :label="$t('fmsReceiveClear.all_offset_clear')" lazy v-if="isAllOffsetClearList">
			<offset-clear-list-all role="OPERATOR" origin="ReceiptClearApplyOperatorList"></offset-clear-list-all>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
import ClearListUn from "./clearListUn";
import ClearListAll from "./clearListAll";
import OffsetClearListUn from "./offsetClearListUn";
import OffsetClearListAll from "./offsetClearListAll";
import { getBillStatusNumberApi } from "@/api/financial/fmsReceive";
import store from "@/store";

export default {
	name: "ReceiptClearApplyOperatorList",
	components: {
		ClearListUn,
		ClearListAll,
		OffsetClearListUn,
		OffsetClearListAll
	},
	data() {
		return {
			loading: false,
			isOffsetClearList: false,
			isAllOffsetClearList: false
		};
	},
	created() {
		const roles = store.getters && store.getters.roles;
		roles.forEach(v => {
			if (v === "fms:re:clear:offset:all") {
				this.isAllOffsetClearList = true;
			}
			if (v === "fms:re:clear:offset:wait") {
				this.isOffsetClearList = true;
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
