<template>
	<div class="edi-operation-button-in-aggrid">
		<el-button
			v-permission="['ovl:warehouse:peakseason:surcharge:add']"
			type="text"
			size="mini"
			@click="params.context.componentParent.edit(params.data.id, '2')"
		>
			{{ $t("peakSeasonTimeManage.detail") }}
		</el-button>
		<el-button
			v-permission="['ovl:warehouse:peakseason:surcharge:active']"
			type="text"
			size="mini"
			@click="params.context.componentParent.updateStatus(params.data.id, 1)"
			v-if="params.data.status === 2"
			class="fc-red"
		>
			{{ $t("peakSeasonTimeManage.active") }}
		</el-button>
		<el-button
			v-permission="['ovl:warehouse:peakseason:surcharge:inactive']"
			type="text"
			size="mini"
			v-if="params.data.status === 1"
			@click="params.context.componentParent.updateStatus(params.data.id, 2)"
		>
			{{ $t("peakSeasonTimeManage.inactive") }}
		</el-button>
	</div>
</template>
<script>
export default {
	name: 'Operation',
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
