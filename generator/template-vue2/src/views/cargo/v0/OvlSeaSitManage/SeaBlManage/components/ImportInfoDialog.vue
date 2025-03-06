<template>
	<div>
		<el-dialog	:visible.sync="dialogVisible" title="更新进口信息" width="800px"	:close-on-click-modal="false">
      <div class="dialog-content">
        <el-form label-width="100px" label-position="left" :model="formData" ref="formData" v-if="dialogVisible" v-loading="loading" >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="getZH('customerName')" >
                <TypeSelect v-model="formData.customerId" :defaultDisplay="formData.customerShortName" customerLabel="shortName" type="customer" @selected="customerSelected" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="getZH('ctnNo')" prop="ctnNo" >
              <el-input size="mini" v-model="initData.ctnNo" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="getZH('changeDate')">
                <CommonPicker  v-model="formData.updateCustomerDate" pickerFormat="yyyy-MM-dd"  pikcerType="date" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="getZH('importer')">
                <el-input size="mini" v-model="formData.importer" :placeholder="inputZH('importer')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="getZH('saller')" >
                <el-input v-model="formData.saller"  size="mini" :placeholder="inputZH('saller')" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="getZH('purchaser')" >
                <el-input v-model="formData.actualBuyer" :placeholder="inputZH('purchaser')" size="mini" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="getZH('description')" >
                <el-input v-model="formData.updateImportInfoRemark" :placeholder="inputZH('description')" size="mini" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" @click="submitData('formData')">{{$t("common.saveConfirmBtn")}}</el-button>
        <el-button size="mini" @click="dialogVisible = false">{{$t("common.cancelBtn")}}</el-button>
      </span>
		</el-dialog>
	</div>
</template>

<script>
import { updateSeaCtnInfoApi } from '@/api/OvlSeaSitManage/seaBl'
export default {
	name: 'ImportInfoDialog',
	props: {
		blId: String,
		visible: {
			type: Boolean,
			default: false
		},
		initData: Object

	},
	data() {
		let defaultForm = {
			id: null,
			customerId: null,
			customerName: null,
			customerShortName: null,
			importer: null,
			saller: null,
			actualBuyer: null,
			updateCustomerDate: null,
			updateImportInfoRemark: null
		}
		return {
			dialogVisible: false,
			loading: false,
			defaultForm,
			formData: this.$extends({}, defaultForm)
		}
	},

	methods: {
		/**
	 * 客户选择
	 */
		customerSelected(data) {
			this.formData.customerName = data.chineseName
			this.formData.customerShortName = data.shortName
		},
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
		async submitData(refName) {
			this.$refs[refName].validate(valid => {
				if (!valid) {
					this.mixinsFormScrollIntoView()
					return false
				}
				const saveForm = this.$extends(true, {}, this.formData)
				saveForm.id = this.initData.id
				this.loading = true
				updateSeaCtnInfoApi(saveForm).then(res => {
					if (res && res.ok) {
						this.$message.success(this.getZH('saveSuccess', 'common'))
						this.dialogVisible = false
						this.loading = false
						this.$emit('saved')
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
				this.formData = this.$extends({}, this.defaultForm)
				this.formData.customerId = this.initData.customerId
				this.formData.customerName = this.initData.customerName
				this.formData.customerShortName = this.initData.customerShortName
			}
			this.dialogVisible = val
		}
	}

}
</script>

<style>
</style>
