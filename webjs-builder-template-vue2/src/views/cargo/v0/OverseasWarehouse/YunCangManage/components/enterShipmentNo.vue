<template>
	<div>
		<el-dialog
			:visible.sync="dialogVisible"
			:title="$t('outInStorageManage.logisticsSingleNumberEnter')"
			width="550px"
			:close-on-click-modal="false"
		>
      <div class="dialog-content">
        <el-form
          label-width="70px"
          label-position="left"
          :model="formData"
          ref="formData"
          v-if="dialogVisible"
          v-loading="loading"
        >
          <el-form-item :label="$t('outInStorageManage.shipmentNo')" required>
            <el-input size="mini" v-model.trim="formData.shipmentNo" :placeholder="$t('outInStorageManage.please_input_shipmentNumber')"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading"  size="mini" @click="saveForm" :disabled="$isEmpty(formData.shipmentNo)">
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
import { updateShipmentNoCloudOnboundApi } from "@/api/OverseasWarehouse/YunCangManage"
export default {
	name: 'EnterShipmentNo',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		shipmentNo: String,
		id: String
	},
	data() {
		return {
			dialogVisible: false,
			fileList: [],
			loading: false,
			formData: {
				shipmentNo: null
			}
		}
	},
	computed: {

	},
	methods: {
		async saveForm() {
			this.loading = true
			let saveData = {
				id: this.id,
				shipmentNo: this.formData.shipmentNo.replace(/\s+/g, '')
			}
			let rs = await updateShipmentNoCloudOnboundApi(saveData)
			if (rs.ok) {
				this.loading = false
				this.dialogVisible = false
				this.$emit('saved')
				this.$message.success(this.$t('common.uploadSuccess'))
			} else {
				this.loading = false
			}
		}

	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		visible(val) {
			if (val) {
				this.formData.shipmentNo = this.shipmentNo
			}
			this.dialogVisible = val
		}
	}

}
</script>

<style>
</style>
