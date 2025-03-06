<template>
	<div class="edit-btn-wrap">
		<el-button type="text" size="mini" @click="params.context.componentParent.recordMrnInfo(params.data)" v-if="!params.data.mrnNo && !params.data.mrnCreateTime">{{$t("inventoryManager.recordMrnInfo")}}</el-button>
	</div>
</template>
<script>
export default {
	name: 'OperationPV',
	data() {
		return {
			activeData: {}
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
