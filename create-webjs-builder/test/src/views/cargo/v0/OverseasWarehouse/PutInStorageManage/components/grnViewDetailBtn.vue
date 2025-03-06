<template>
	<div class="edi-operation-button-in-aggrid">
		<el-button type="text" size="mini" @click="viewDetail">
			{{ $t("common.viewBtn") }}
		</el-button>
		<el-button	type="text"	size="mini"	v-if="params.data.orderState === 2" @click="viewDetail">
			{{ $t("common.auditBtn") }}
		</el-button>
		<el-button type="text" size="mini" @click="params.context.componentParent.addInfo(	params.data.id,params.data.inWarehouseType,	params.data.boxUpType)">
			{{ $t("putInStorageManage.addInfo") }}
		</el-button>
		<el-button type="text" size="mini" v-if="params.data.groundingButtonFlag" @click="groundingItem(params.data.id,params)">
			{{ $t("putInStorageManage.groundingButton") }}
		</el-button>
    <el-button class="fc-red" type="text" size="mini" v-if="cancelBtnStatus.includes(params.data.orderState)"  @click="cancel(params.data.id,params)">
			{{ $t("common.cancelBtn") }}
		</el-button>
	</div>
</template>
<script>
import { cancelInboundApi, groundingInboundAgainApi } from '@/api/OverseasWarehouse/GRNManager'
export default {
	name: 'OperationBtn',
	data() {
		return {
			cancelBtnStatus: [2, 3, 4, 5, 6, 8]
		}
	},
	beforeMount() {
	},
	methods: {
		viewDetail() {
			this.$router.push({ name: 'GRNDetail', query: { timestamp: new Date().getTime(), id: this.params.data.id } })
		},
		cancel(id, params) {
			this.$confirm(this.$t('common.cancelWarnningTips'), this.$t('common.tips'), {
				confirmButtonText: this.$t('common.confirmBtn'),
				cancelButtonText: this.$t('common.cancelBtn'),
				type: 'warning'
			}).then(async () => {
				cancelInboundApi(id).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.cancelSuccess'))
						params.context.componentParent.getList()
					}
				})
			}).catch(() => { })
		},
		// 重上架
		async groundingItem(id, params) {
			params.context.componentParent.loading = true
			let res = await groundingInboundAgainApi(id).catch(() => {
				params.context.componentParent.loading = false
			})
			if (res.ok) {
				params.context.componentParent.loading = false
				this.$message.success(this.$t('putInStorageManage.groundingSuccess'))
				params.context.componentParent.getList()
			} else {
				params.context.componentParent.loading = false
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
