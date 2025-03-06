<template>
	<div class="edit-btn-wrap">
		<el-button type="text" size="mini" @click="viewDetail(params.data.id,'view')" >{{$t("common.viewBtn")}}</el-button>
		<el-button type="text" size="mini" v-if="params.data.orderStatus === 3" @click="params.context.componentParent.deliverTakeStock(params.data.id)" >{{$t("inventoryManager.deliverBtn")}}</el-button>
		<el-button type="text" size="mini" v-if="(params.data.orderStatus === 1 || params.data.orderStatus === 3) && params.data.importStatus!==1" @click="viewDetail(params.data.id,'submit')">{{$t("inventoryManager.submitakeInfo")}}</el-button>
	</div>
</template>
<script>
export default {
	name: 'BatchListBtn',
	data() {
		return {
			statusChange: false
		}
	},
	beforeMount() {
	},
	methods: {
		viewDetail(id, operate) {
			this.$router.push({ name: 'TakeStockDetail', query: { id, operate } })
		}
	}
}
</script>
<style>
</style>
