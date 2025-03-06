<template>
	<div class="option-btn-wrap">
		<el-button v-if="params.data.auditingStatus != 0" type="text" size="mini" @click="params.context.componentParent.viewFn(params.data)">
			{{$t("fmsReceiptTransactions.view")}}
		</el-button>
		<el-button v-if="params.data.role == 'FINANCE'" type="text" size="mini" @click="params.context.componentParent.deleteFn(params.data)">
			{{$t("fmsReceiptTransactions.delete")}}
		</el-button>
		<el-button v-if="params.data.role != 'FINANCE'" type="text" size="mini" @click="params.context.componentParent.claimerFn(params.data)">
			{{$t("fmsReceiptTransactions.claim")}}
		</el-button>
	</div>
</template>
<script>
export default {
	name: "ToClaimOperationBtn",
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

