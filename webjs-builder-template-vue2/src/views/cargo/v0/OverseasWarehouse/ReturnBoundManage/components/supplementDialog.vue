<template>
	<div>
		<el-dialog :visible.sync="dialogVisible" :title="$t('outInStorageManage.makeSupplementNo')"	width="360px" :close-on-click-modal="false">
			<el-form :model="formData" ref="formData" label-width="100px">
        <el-form-item :label="$t('outInStorageManage.returnOrderNo')">
          {{orderNo || "-"}}
        </el-form-item>
        <el-form-item :label="$t('outInStorageManage.carrier')" prop="carrierName" :rules="[{ required:true, message:$t('outInStorageManage.please_input_carrier_name')}]">
          <el-input size="mini" v-model="formData.carrierName" :placeholder="$t('outInStorageManage.please_input_carrier_name')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('outInStorageManage.shipmentNo')" prop="shipmentNo" :rules="[{ required:true, message:$t('outInStorageManage.please_input_shipment_no')}]">
          <el-input size="mini" v-model="formData.shipmentNo"  :placeholder="$t('outInStorageManage.please_input_shipment_no')"></el-input>
        </el-form-item>
      </el-form>
			<span slot="footer" class="dialog-footer">
				<el-button	size="mini" type="primary"	@click="saveForm('formData')">	{{ $t("common.saveBtn") }}</el-button>
				<el-button	size="mini"	@click="dialogVisible = false">	{{ $t("common.cancel") }}</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { returnLogisticsboundApi } from '@/api/OverseasWarehouse/returnManage'
export default {
	name: 'SupplementDialog',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		orderNo: String,
		id: String
	},
	data() {
		let defaultForm = {
			id: null,
			carrierName: null,
			shipmentNo: null
		}
		return {
			defaultForm,
			formData: this.$extends({}, defaultForm),
			dialogVisible: false
		}

	},
	methods: {
		/**
	* 保存数据
	*/
		saveForm(refName) {
			this.$refs[refName].validate(valid => {
				if (valid) {
					this.formData.id = this.id
					this.loading = true
					returnLogisticsboundApi(this.formData).then(res => {
						if (res.ok) {
							this.loading = false
							this.$message.success(this.$t('common.saveSuccess'))
							this.$emit('saved')
							this.dialogVisible = false
						} else {
							this.loading = false
						}
					}).catch(() => {
						this.loading = false
					})
				} else {
					this.mixinsFormScrollIntoView()
					return false
				}
			})
		}
	},
	watch: {
		dialogVisible(val) {
			if (!val) {
				this.$emit('update:visible', val)
			}
		},
		visible(val) {
			if (val) {
				this.formData = this.$extends({}, this.defaultForm)
			}
			this.dialogVisible = val
		}
	}

}
</script>

<style lang="scss" scoped>
.item-box {
	width: 150px;
	height: 100px;
	background-color: #108ee9;
	color: #fff;
	border-radius: 4px;
	cursor: pointer;
	.item-icon {
		text-align: center;
		font-size: 26px;
		margin-bottom: 4px;
		width: 100%;
	}
}
</style>
