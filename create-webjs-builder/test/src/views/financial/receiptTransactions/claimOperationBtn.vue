<template>
	<div class="option-btn-wrap">
		<el-button v-if="params.data.auditingStatus != 0" type="text" size="mini" class="ml-10" @click="params.context.componentParent.viewFn(params.data)">
			{{$t("fmsReceiptTransactions.view")}}
		</el-button>
		<el-button v-if="params.data.instructionState == 1" type="text" size="mini" class="ml-10" @click="params.context.componentParent.cancelFn(params.data)">
			{{$t("fmsReceiptTransactions.recall")}}
		</el-button>
	</div>
</template>
<script>
export default {
	name: "ClaimOperationBtn",
	data() {
		return {};
	},
	created() {},
	beforeMount() {},
	methods: {}
};
</script>
<style lang="scss" scoped>
.option-btn-wrap {
	span {
		cursor: pointer;
	}
}
</style>

