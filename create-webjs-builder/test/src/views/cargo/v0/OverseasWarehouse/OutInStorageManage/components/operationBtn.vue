<template>
	<div class="edit-btn-wrap">
		<el-button
			type="text"
			size="mini"
			v-if="(params.data.status === 210 && params.data.transportMode === 2) || params.data.showPlatformButton"
			@click="params.context.componentParent.audit(params.data.id)"
		>
			{{ $t("common.auditBtn") }}
		</el-button>
    <el-button	type="text" size="mini" 	v-if="params.data.status === 324" 	@click="submitFn(params)">
			{{ $t("outInStorageManage.submitFn") }}
		</el-button>
		<el-button
			type="text"
			size="mini"
			@click="params.context.componentParent.detail(params.data.id)"
		>
			{{ $t("common.viewBtn") }}
		</el-button>
		<el-button
			v-if="params.data.transportMode  === 2 && limits.includes(params.data.status)"
			type="text"
			size="mini"
			@click="params.context.componentParent.uploadFile(params.data.id)"
		>
			{{ $t("outInStorageManage.uploadBOL") }}
		</el-button>
		<el-button
			v-if="params.data.transportMode === 2 && limitInfo.includes(params.data.status)"
			type="text"
			size="mini"
			@click="params.context.componentParent.updateBaseInfo(params.data)"
		>
			{{ $t("outInStorageManage.addInfo") }}
		</el-button>
    <el-button v-if="params.data.abnormalFlag" type="text" size="mini" @click="params.context.componentParent.handleAbnormal(params.data)">{{ $t("outInStorageManage.exceptionHandle") }}</el-button>
    <el-button v-if="cancelBtns.includes(params.data.status)"	type="text" size="mini" class="fc-red" @click="cancel(params.data.id,params)">{{ $t("common.cancelBtn") }}</el-button>
     <el-button v-if="params.data.status === 350" type="text" size="mini" @click="retryFn(params.data, params)">{{ $t("outInStorageManage.retry") }}</el-button>
	</div>
</template>
<script>
import { cancelOutboundApi, submitOutboundsSubmitByIdApi, submitTransferOutboundById, recallOutboundApi } from "@/api/OverseasWarehouse/outInStorageManage.js"
export default {
	name: 'OperationBtn',
	data() {
		return {
			limits: [100, 210, 215, 325, 330, 340, 345, 350],
			limitInfo: [215, 325, 330, 340, 345, 350],
			cancelBtns: [100, 210, 215, 290, 310, 325, 330, 340, 345, 350]
		}
	},
	beforeMount() {
	},
	methods: {
        retryFn(row, params) {
          this.$confirm(this.$t('outInStorageManage.recallWarnningTips'), this.$t('common.tips'), {
				confirmButtonText: this.$t('common.confirmBtn'),
				cancelButtonText: this.$t('common.cancelBtn'),
				type: 'warning'
			}).then(async () => {
				recallOutboundApi(row.id).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('outInStorageManage.recallSuccess'))
						params.context.componentParent.list()
					}
				})
			}).catch(() => { })  
        },
		cancel(id, params) {
			this.$confirm(this.$t('common.cancelWarnningTips'), this.$t('common.tips'), {
				confirmButtonText: this.$t('common.confirmBtn'),
				cancelButtonText: this.$t('common.cancelBtn'),
				type: 'warning'
			}).then(async () => {
				cancelOutboundApi(id).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.cancelSuccess'))
						params.context.componentParent.list()
					}
				})
			}).catch(() => { })
		},
		// 提交数据
		async submitFn(params) {
			let fn = params.data.type === 10 ? submitOutboundsSubmitByIdApi : submitTransferOutboundById
			params.context.componentParent.loading = true
			let res = await fn(params.data.id).catch(() => {
				params.context.componentParent.loading = false
			})
			if (res.ok) {
				this.$message.success(this.$t('common.submitSuccess'))
				params.context.componentParent.loading = false
				params.context.componentParent.list()
			} else {
				params.context.componentParent.loading = false
			}
		}
	}
}
</script>
<style>
</style>
