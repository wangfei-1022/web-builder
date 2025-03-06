<template>
	<div class="edi-operation-button-in-aggrid">
		<el-button type="text" size="mini" @click="viewDetail('view')">
			{{ $t("common.viewBtn") }}
		</el-button>
		<el-button	type="text"	size="mini"	v-if="params.data.orderState === 2" @click="viewDetail('audit')">
			{{ $t("common.auditBtn") }}
		</el-button>
    <el-button class="fc-red" type="text" size="mini" v-if="cancelBtnStatus.includes(params.data.orderState)"  @click="cancel(params.data.id,params)">
			{{ $t("common.cancelBtn") }}
		</el-button>
	</div>
</template>
<script>
import { cancelInboundApi } from '@/api/OverseasWarehouse/GRNManager'
export default {
	name: 'ParcelStorageBtn',
	data() {
		return {
			cancelBtnStatus: [2, 3, 4, 5, 6, 8]
		}
	},
	beforeMount() {
	},
	methods: {
		viewDetail(operate) {
			this.$router.push({ name: 'ParcelStorageDetail', query: { id: this.params.data.id, operate } })
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
						params.context.componentParent.list()
					}
				})
			}).catch(() => { })
		},
	}
}
</script>
<style>
.edi-operation-button-in-aggrid .el-button {
	padding: 0;
}
</style>
