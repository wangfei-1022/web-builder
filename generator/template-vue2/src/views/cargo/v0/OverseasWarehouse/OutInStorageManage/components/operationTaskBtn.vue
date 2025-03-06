<template>
	<div class="edit-btn-wrap">
		<el-button type="text" size="mini" @click="params.context.componentParent.view(params.data.id, 'view')">{{
			$t("common.viewBtn") }}</el-button>
		<el-button type="text" size="mini" v-if="addBtnView"
			@click="params.context.componentParent.detail(params.data.id, 'add')">{{ $t("common.addBtn") }}</el-button>
		<el-button type="text" size="mini" v-if="params.data.orderStatus === 1"
			@click="params.context.componentParent.detail(params.data.id, 'confirm')">{{ $t("common.confirmBtns")
			}}</el-button>
		<!-- v-if="!updateOutboundBtn && callbackBtnView" -->
		<el-button type="text" size="mini" v-if="params.data.showCallLongiFlag"
			@click="params.context.componentParent.updateOutboundInfo(params.data.id)">{{
				$t("outInStorageManage.updateOutboundInfo") }}</el-button>
		<!-- v-if="updateOutboundBtn" -->
		<el-button type="text" size="mini" v-if="params.data.showOutFlag"
			@click="params.context.componentParent.updateOutbound(params.data.id)">{{ $t("outInStorageManage.updateOutbound")
			}}</el-button>
		<el-button type="text" size="mini" v-if="params.data.orderStatus === 5" class="fc-red"
			@click="params.context.componentParent.detail(params.data.id, 'cancel')">{{
				$t("outInStorageManage.confirmCancelBtn") }}</el-button>
		<!-- v-if="params.data.abnormalFlag || recallBtnView" -->
		<el-button type="text" size="mini" v-if="params.data.showRecallLongiFlag"
			@click="params.context.componentParent.recall(params.data)">{{ $t("putInStorageManage.recall") }}</el-button>
	</div>
</template>
<script>
export default {
	name: 'OperationTaskBtn',
	data() {
		return {


		}
	},
	computed: {
		addBtnView() {
			let orderStatus = this.params.data.orderStatus
			// let callback = this.params.data.callbackStatus
			// let orderOutboundStatus = this.params.data.orderOutboundStatus
			// let noPickupFlag = !this.params.data.pickup && orderStatus === 2 && callback === 1 && orderOutboundStatus === 1
			// let pickupFlag = this.params.data.pickup &&
			return [2, 3].includes(orderStatus)
		},
		callbackBtnView() {
			let orderStatus = this.params.data.orderStatus
			let callback = this.params.data.callbackStatus
			let orderOutboundStatus = this.params.data.orderOutboundStatus
			let cloudWarehouseFlag = this.params.data.cloudWarehouseFlag
			let noPickupFlag = !this.params.data.pickup && orderStatus === 4 && callback === 1 && ((orderOutboundStatus === 4 && cloudWarehouseFlag) || (orderOutboundStatus === 2 && !cloudWarehouseFlag))
			// (orderOutboundStatus === 4 && cloudWarehouseFlag) || (orderOutboundStatus === 2 && !cloudWarehouseFlag)
			let pickupFlag = this.params.data.pickup && [3, 4].includes(orderStatus) && [1, 2].includes(callback)
			return noPickupFlag || pickupFlag
		},
		recallBtnView() {
			let orderStatus = this.params.data.orderStatus
			let callback = this.params.data.callbackStatus
			let orderOutboundStatus = this.params.data.orderOutboundStatus
			let noPickupFlag = !this.params.data.pickup && orderStatus === 4 && callback === 3 && orderOutboundStatus === 4
			let pickupFlag = this.params.data.pickup && [3, 4].includes(orderStatus) && [2, 3].includes(callback) && [3, 4].includes(orderOutboundStatus)
			return noPickupFlag || pickupFlag
		},
		updateOutboundBtn() {
			let data = this.params.data
			if (data.cloudWarehouseFlag && !data.pickup && data.orderStatus === 4 && data.orderOutboundStatus === 2) {
				return true
			}
			return false
		}
	},
	methods: {

	}
}
</script>
<style></style>
