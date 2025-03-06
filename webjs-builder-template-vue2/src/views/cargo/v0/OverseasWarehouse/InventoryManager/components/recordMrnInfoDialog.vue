<template>
	<div>
		<el-dialog	:visible.sync="dialogVisible" :title="$t('inventoryManager.recordMrnInfo')" width="550px" :close-on-click-modal="false">
      <div class="dialog-content">
        <el-form label-width="140px" label-position="left" :model="formData" ref="formData" :rules="rules" v-if="dialogVisible" v-loading="loading" >
          <el-form-item :label="$t('inventoryManager.stockNo')" >
            <span>{{data.orderInboundNo}}</span>
          </el-form-item>
          <el-form-item :label="$t('inventoryManager.mrnNo')" prop="mrnNo" v-if="!data.mrnNo">
            <el-input v-model="formData.mrnNo" size="mini" :placeholder="$t('inventoryManager.mrnNoEmpty')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('inventoryManager.mrnCreateTime')"  prop="mrnCreateTime" v-if="!data.mrnCreateTime">
           <CommonPicker v-model="formData.mrnCreateTime" pikcer-type="date" pickerFormat="yyyy-MM-dd" size="mini" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" @click="saveForm">
          {{ $t("common.confirmBtn") }}
        </el-button>
        <el-button size="mini" @click="dialogVisible = false">{{
          $t("common.cancelBtn")
        }}</el-button>
      </span>
		</el-dialog>
	</div>
</template>

<script>
import { saveInboundMrnApi } from '@/api/inventory'
export default {
	name: 'ImportMrnInfoDialog',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		data: {
			type: Object,
			require: true
		}
	},
	data() {
		return {
			dialogVisible: false,
			formData: {
				orderInboundNo: null,
				mrnNo: null,
				mrnCreateTime: null
			},
			rules: {
				// mrnNo: [{ required: true, message: this.$t('inventoryManager.mrnNoEmpty') }],
				// mrnCreateTime: [{ required: true, message: this.$t('inventoryManager.mrnCreateTimeEmpty') }]
			},
			loading: false
		}
	},
	methods: {
		async saveForm() {
			this.loading = true
			let rs = await saveInboundMrnApi(this.formData)
			if (rs.ok) {
				this.loading = false
				this.dialogVisible = false
				this.$emit('saved')
				this.$message.success(this.$t('common.saveSuccess'))
			} else {
				this.loading = false
			}
		},
		/**
		 * 上传时
		 */
		handletProgress() {
			this.loading = true
		}
	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		visible(val) {
			if (val) {
				this.$copyProps(this.formData, this.data)
			}
			this.dialogVisible = val
		}
	}

}
</script>

<style>
</style>
