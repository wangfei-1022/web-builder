<template>
	<div>
		<el-button
			type="text"
			size="mini"
			v-if="params.data.shipmentNos && params.data.shipmentNos.length > 1"
			@click="params.context.componentParent.detail(params.data.id, '1')"
		>
			{{ $t("common.viewBtn") }}
		</el-button>
		<el-button
			type="text"
			size="mini"
			v-if="params.data.shipmentNos && params.data.shipmentNos.length === 1"
			@click="params.context.componentParent.detail(params.data.id, '1')"
		>
			{{ params.value[0] }}
		</el-button>
	</div>
</template>
<script>
export default {
	name: 'ShipmentNos',
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
</style>
