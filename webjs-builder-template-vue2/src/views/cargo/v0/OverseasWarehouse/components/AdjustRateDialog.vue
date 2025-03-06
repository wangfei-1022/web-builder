<template>
  <el-dialog :visible.sync="dialogVisible" :title="$t('ovlDivisionRate.adjustRate')" width="320px" :close-on-click-modal="false">
    <div class="dialog-content">
      <el-input size="mini" v-model="rate" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')" :placeholder="$t('ovlDivisionRate.rateInput')">
         <template slot="append">%</template>
      </el-input>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary"	size="mini"	:disabled="$isEmpty(rate)" @click="saveForm" :loading="loading">{{ $t("common.saveBtn") }}</el-button>
      <el-button	size="mini"	@click="dialogVisible = false">	{{ $t("common.cancelBtn") }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { saveDivisionRateApi } from '@/api/OverseasWarehouse/overseasWarehouseManager'
export default {
	name: 'AdjustRateDialog',
	components: {},
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		id: String
	},
	data() {
		return {
			dialogVisible: false,
			loading: false,
			rate: null,
		}

	},
	methods: {
		async saveForm() {
			let data = {
				id: this.id,
				rate: this.rate
			}
			this.loading = true
			let res = await saveDivisionRateApi(data)
			if (res.ok) {
				this.$message.success(this.$t('common.saveSuccess'))
				this.$emit('saved')
				this.dialogVisible = false
			}
			this.loading = false
		},
	},
	watch: {
		dialogVisible(val) {
			if (!val) {
				this.rate = null
				this.$emit('update:visible', val)
			}
		},
		visible(val) {
			this.dialogVisible = val
		}
	}

}
</script>

<style lang="scss" scoped>
</style>
