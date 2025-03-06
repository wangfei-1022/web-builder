<template>
	<div>
		<el-dialog	:visible.sync="dialogVisible" :title="getZH('updateETAInfo')" width="800px"	:close-on-click-modal="false">
      <div class="dialog-content">
        <el-form label-width="70px" label-position="left" :model="formData" ref="formData" v-if="dialogVisible" v-loading="loading" >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="getZH('customerName')" >
                <el-input size="mini" v-model="saveForm.customerName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="getZH('carrierName')">
                <el-input size="mini" v-model="saveForm.carrierName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="getZH('vessel')" >
                <el-input v-model="saveForm.vessel" disabled size="mini" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="getZH('voyage')" >
                <el-input v-model="saveForm.voyage" disabled size="mini" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="getZH('podCode')" >
                <el-input v-model="saveForm.pod" disabled size="mini" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="getZH('blNo')" >
                <el-input v-model="saveForm.blNo" disabled size="mini" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="getZH('ETA')" prop="eta" >
              <CommonPicker  v-model="saveForm.eta" pickerFormat="yyyy-MM-dd"  pikcerType="date"  class="w-full"  />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="getZH('ATA')" prop="ata" >
                <CommonPicker  v-model="saveForm.ata" pickerFormat="yyyy-MM-dd"  pikcerType="date"  class="w-full" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" @click="submitData('formData')">{{$t("common.confirmBtn")}}</el-button>
        <el-button size="mini" @click="dialogVisible = false">{{$t("common.cancelBtn")}}</el-button>
      </span>
		</el-dialog>
	</div>
</template>

<script>
import { detailSeaBlApi, delFileApi, updateEtaAtaApi } from '@/api/OvlSeaSitManage/seaBl'
export default {
	name: 'ETAUpdateDialog',
	props: {
		blId: String,
		visible: {
			type: Boolean,
			default: false
		}
	},
	data() {
		let defaultForm = {
			id: null,
			ata: null,
			eta: null
		}
		return {
			dialogVisible: false,
			loading: false,
			defaultForm,
			formData: this.$extends({}, defaultForm),
			saveForm: {
				customerName: null,
				mblNo: null,
				blNo: null,
				carrierName: null,
				voyage: null,
				vessel: null,
				declareDate: null,
				pod: null,
				id: null,
				eta: null,
				ata: null
			}
		}
	},

	methods: {
		/**
		* 下拉框
		*/
		selectZH(key) {
			return this.getZH('selectPlaceholder', 'common') + this.getZH(key)
		},
		/**
		 * 输入框
		 */
		inputZH(key) {
			return this.getZH('placeholder', 'common') + this.getZH(key)
		},
		/**
		 * 获取中英文
		 */
		getZH(key, obj) {
			obj = obj || 'seaBl'
			let str = obj + '.' + key
			return this.$t(str)
		},
		// 获取详情
		async getDetail() {
			if (this.$isEmpty(this.blId)) {
				return
			}
			this.loading = true
			detailSeaBlApi(this.blId).then(res => {
				if (res.ok) {
					this.loading = false
					this.$copyProps(this.saveForm, res.content)
				} else {
					this.loading = false
				}
			})
		},
		async submitData(refName) {
			this.$refs[refName].validate(valid => {
				if (!valid) {
					this.mixinsFormScrollIntoView()
					return false
				}
				this.$copyProps(this.formData, this.saveForm)
				updateEtaAtaApi(this.formData).then(res => {
					if (res && res.ok) {
						this.$message.success(this.getZH('saveSuccess', 'common'))
						this.dialogVisible = false
						this.loading = false
					} else {
						this.loading = false
					}
				}).catch(() => {
					this.loading = false
				})
			})
		}

	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		visible(val) {
			if (val) {
				this.getDetail()
			}
			this.dialogVisible = val
		}
	}

}
</script>

<style>
</style>
