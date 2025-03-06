<template>
	<div class="option-btn-wrap">
		<el-button
      v-if="params.data.auditingStatus != 0 && params.data.role == 'FINANCE'"
      type="text"
      size="mini"
      @click="params.context.componentParent.viewFn(params.data)">
			{{$t("fmsReceiptTransactions.view")}}
		</el-button>
		<el-button
      v-if="params.data.instructionState == '1' && params.data.claimState == 1 && params.data.role == 'FINANCE'"
      type="text"
      size="mini"
      @click="params.context.componentParent.deleteFn(params.data)">
			{{$t("fmsReceiptTransactions.delete")}}
		</el-button>

    <el-button
      v-if="params.data.auditingStatus != 0 && params.data.role == 'BUSINESS'"
      v-permission="['fms:re:trans:claim:all:re:view']"
      type="text"
      size="mini"
      @click="params.context.componentParent.viewFn(params.data)"
    >
			{{$t("fmsReceiptTransactions.view")}}
		</el-button>
		<el-button
      v-if="params.data.instructionState == '1' && params.data.claimState == 1 && params.data.role == 'BUSINESS'"
      v-permission="['fms:re:trans:claim:all:re:delete']"
      type="text"
      size="mini"
      @click="params.context.componentParent.deleteFn(params.data)">
			{{$t("fmsReceiptTransactions.delete")}}
		</el-button>
	</div>
</template>
<script>
export default {
	name: "TransactionsOperationBtn",
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

