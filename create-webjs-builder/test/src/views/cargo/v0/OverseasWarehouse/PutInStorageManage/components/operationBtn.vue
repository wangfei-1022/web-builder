<template>
	<div class="edi-operation-button-in-aggrid">
		<el-button
			type="text"
			size="mini"
			@click="params.context.componentParent.edit(params.data.id, '2')"
		>
			{{ $t("common.viewBtn") }}
		</el-button>
		<el-button
			type="text"
			size="mini"
			v-if="params.data.orderState === 7 && $isEmpty(params.data.refuseReason)"
			@click="params.context.componentParent.handler(params.data.id)"
		>
			{{ $t("common.handler") }}
		</el-button>
		<el-button
			type="text"
			size="mini"
			v-if="params.data.orderState === 9 && (params.data.operatorDealStatus==10 || params.data.operatorDealStatus==11 )"
			@click="params.context.componentParent.followUp(params.data.id)"
		>
			{{ $t("putInStorageManage.followUp") }}
		</el-button>
		<el-button
			type="text"
			size="mini"
      v-if="params.data.orderState === 9 && $isEmpty(params.data.operatorDealStatus)"
			@click="sendEmail(params.data.no)"
		>
			{{ $t("putInStorageManage.sendEmail") }}
		</el-button>
	</div>
</template>
<script>
import { sendInboundEmailApi } from '@/api/OverseasWarehouse/GRNManager'
export default {
	name: 'OperationBtn',
	data() {
		return {

		}
	},
	beforeMount() {
	},
	methods: {
		async sendEmail(orderNo) {
			let res = await sendInboundEmailApi(orderNo)
			if (res.ok) {
				this.$message.success(this.$t("putInStorageManage.sendEmailSuccess"))
			}
		}
	}
}
</script>
<style>
.edi-operation-button-in-aggrid .el-button {
	padding: 0;
}
</style>
