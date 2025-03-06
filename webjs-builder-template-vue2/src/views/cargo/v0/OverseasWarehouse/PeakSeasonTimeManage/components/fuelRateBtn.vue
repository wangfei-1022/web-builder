<template>
	<div class="edi-operation-button-in-aggrid">
		<el-button
			v-permission="['ovl:warehouse:fuel:rate:add']"
			type="text"
			size="mini"
			@click="params.context.componentParent.edit(params.data.id, '2')"
		>
			{{ $t("peakSeasonTimeManage.detail") }}
			<!-- ovl:warehouse:fuel:rate -->
		</el-button>
    <el-button
			type="text"
			size="mini"
			@click="params.context.componentParent.publishFn(params.data.id)"
			v-if="params.data.status === 20"
		>
			{{ $t("peakSeasonTimeManage.publish") }}
		</el-button>
	</div>
</template>
<script>
export default {
	name: 'FuelRateBtn',
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
