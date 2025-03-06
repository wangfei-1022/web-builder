<template>
	<div class="edi-operation-button-in-aggrid">
		<el-button
			v-permission="['ovl:warehouse:peakseason:add']"
			type="text"
			size="mini"
      v-if="false"
		>
    <!-- 	@click="params.context.componentParent.edit(params.data.id, '2')" -->
			{{ $t("peakSeasonTimeManage.detail") }}
		</el-button>
    <el-button
			type="text"
			size="mini"
			@click="params.context.componentParent.publishFn(params.data.id)"
			v-if="params.data.status == 20"
		>
			{{ $t("peakSeasonTimeManage.publish") }}
		</el-button>
	</div>
</template>
<script>
export default {
	name: 'OperationBtn',
	data() {
		return {

		}
	},
	beforeMount() {
	},
	methods: {

	}
}
</script>
<style>
.edi-operation-button-in-aggrid .el-button {
	padding: 0;
}
</style>
