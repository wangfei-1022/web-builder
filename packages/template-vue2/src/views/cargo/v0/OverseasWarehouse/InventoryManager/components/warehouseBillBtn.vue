<template>
  <div class="edit-btn-wrap">
    <el-button type="text" size="mini" @click="getDetail(JSON.stringify(params.data))"
      v-permission="['ovl:warehouse:bill:detail']">
      {{ $t("common.viewBtn") }}
    </el-button>
    <el-button type="text" size="mini" v-if="[ 200, 210 ].includes(params.data.chargeCalculateState)"  @click="params.context.componentParent.retryBill(params.data.id)">
      {{ $t("inventoryManager.retryBill") }}
    </el-button>
    <el-button type="text" size="mini" v-if="params.data.chargeCalculateState === 300 || params.data.chargeCalculateState === 10"  @click="exportDetail(params.data.id)">
      {{ $t("inventoryManager.exportingDetails") }}
    </el-button>
  </div>
</template>
<script>

import { exportChargeDetailApi } from '@/api/inventory'
export default {
	name: 'WarehouseBillBtn',
	data() {
		return {
			statusChange: false
		}
	},
	beforeMount() {
	},
	methods: {
		getDetail(data) {
			this.$router.push({ name: 'WarehouseBillDetail', query: { data, time: new Date().getTime() } })
		},
		exportDetail(orderStockId) {
			let data = { orderStockId }
			this.loading = true
			exportChargeDetailApi(data).then(res => {
				if (res.ok) {
					this.$alert(`<div><span class="fc-red fs-16">${this.$t('common.handlerTime')}</span><span class="fs-16">,${this.$t('common.handlerRes')}</span></div>`, this.$t('common.handlerExportTips'), {
						dangerouslyUseHTMLString: true,
						confirmButtonText: this.$t('common.theKnow'),
						callback: () => { }
					})
					this.loading = false
				} else {
					this.loading = false
				}
			})
		}
	}
}
</script>
<style>
</style>
