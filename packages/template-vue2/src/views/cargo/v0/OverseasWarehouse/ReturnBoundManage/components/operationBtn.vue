<template>
	<div class="edit-btn-wrap">
		<el-button type="text" size="mini" @click="viewLog()">{{$t("common.viewBtn")}}</el-button>
		<el-button type="text" size="mini" v-if="params.data.status === 210" @click="aduit()">{{$t("common.auditBtn")}}</el-button>
		<el-button type="text" size="mini" v-if="params.data.status === 215 && $isEmpty(params.data.shipmentNo)" @click="params.context.componentParent.supplement(params.data)">{{$t("outInStorageManage.makeSupplementNo")}}</el-button>
		<el-button type="text" size="mini"  v-if="[410,415].includes(params.data.status)" @click="params.context.componentParent.handlerItem(params.data)">{{$t("outInStorageManage.followUp")}}</el-button>
		<el-button type="text" size="mini"  v-if="[330,215].includes(params.data.status)" @click="params.context.componentParent.updateWarehouse(params.data)">{{$t("outInStorageManage.updateWarehouse")}}</el-button>
	</div>
</template>
<script>
export default {
	name: 'OpearationBtn',
	data() {
		return {
			statusChange: false
		}
	},
	created() {

	},
	methods: {
		viewLog() {
			this.$router.push({ name: 'ReturnStorageDetail', query: { id: this.params.data.id } })
		},
		aduit() {
			this.$router.push({ name: 'ReturnStorageDetail', query: { id: this.params.data.id, audit: true } })
		}
	}
}
</script>
<style>
</style>
