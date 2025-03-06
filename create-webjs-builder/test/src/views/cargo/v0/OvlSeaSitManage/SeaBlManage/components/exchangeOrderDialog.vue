<template>
	<div>
		<el-dialog	:visible.sync="dialogVisible" title="DO维护" width="800px"	:close-on-click-modal="false">
      <div class="dialog-content">
        <el-form label-width="100px" label-position="left" :model="formData" ref="formData" v-if="dialogVisible" v-loading="loading" >
          <div class="pd-16 content-title">{{getZH('baseInfo')}}</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="getZH('customerName')" >
                <el-input size="mini" v-model="saveForm.customerName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="getZH('declareDate')" prop="declareDate" >
              <CommonPicker  v-model="saveForm.declareDate" pickerFormat="yyyy-MM-dd"  pikcerType="date" disabled />
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
              <el-form-item :label="getZH('mblNo')"  >
                <el-input v-model="saveForm.mblNo" disabled size="mini" />
              </el-form-item>
            </el-col>
          </el-row>
          <div class="pd-16 content-title">{{getZH('DOInfo')}}</div>
          <el-row :gutter="20">
            <el-col :span="12">
            <el-form-item :label="getZH('consignationFlag')" prop="consignationFlag" :rules="[{ required:true, message: selectZH('consignationFlag') }]">
             <el-select size="mini" v-model="formData.consignationFlag" class="w-full" >
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
             </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="getZH('consignationSupplierName')" prop="supplierId" :rules="[{ required:formData.consignationFlag, message: selectZH('consignationSupplierName') }]">
               <TypeSelect v-model="formData.supplierId" type="supplier" :defaultDisplay="formData.supplierName"  @selected="supplierSelected"  />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="getZH('consignationDate')" prop="consignationDate" :rules="[{ required:formData.consignationFlag, message: selectZH('consignationDate') }]">
              <CommonPicker  v-model="formData.consignationDate" pickerFormat="yyyy-MM-dd"  pikcerType="date" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="getZH('doFinishDate')" prop="doFinishDate" :rules="[{ required:true, message: selectZH('doFinishDate') }]">
              <CommonPicker  v-model="formData.doFinishDate" pickerFormat="yyyy-MM-dd"  pikcerType="date" />
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item :label="getZH('DO')"  prop="fileObj.originFileName"  :rules="[{ required:true, message: selectZH('DO') }]">
              <div class="flex-box">
                <div class="input-link mr-10 flex-grow" @click="downFile(formData.fileObj)">{{formData.fileObj.originFileName}}</div>
                <UploadFile :showFileList="false" @success="uploadSuccess" ></UploadFile>
              </div>
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
import { detailSeaBlApi, delFileApi, saveDoByBlIdApi } from '@/api/OvlSeaSitManage/seaBl'
export default {
	name: 'ExchangeOrderDialog',
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
			consignationFlag: null,
			supplierId: null,
			supplierName: null,
			supplierShortName: null,
			consignationDate: null,
			doFinishDate: null,
			fileObj: {}
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
				id: null
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
		// 上传成功
		uploadSuccess(data) {
			let saveForm = {
				entityType: null,
				entityId: this.saveForm.id,
				fieldCode: 'do',
				url: null,
				originFileName: null,
				cloudFileName: null,
				documentTypeCode: null,
				sourceType: null,
				fileSize: null
			}

			this.$copyProps(saveForm, data)
			this.formData.fileObj = data
			this.loading = true
			let delData = {
				deleteDTO: {
					blId: this.saveForm.id,
					blFileCode: 'do'
				},
				addList: [saveForm]
			}
			delFileApi(delData).then(res => {
				if (res.ok) {
					this.$message.success(this.$t('common.uploadTextSuccess'))
					this.loading = false
				} else {
					this.loading = false
				}
			}).catch(() => {
				this.loading = false
			})
			// saveFileApi(saveForm).then(res => {
			// 	if (res.ok) {
			// 		this.$message.success(this.$t('common.saveSuccess'))
			// 		this.loading = false
			// 	} else {
			// 		this.loading = false
			// 	}
			// })
		},
		// 选中供应商
		supplierSelected(data) {
			this.formData.supplierName = data.chineseName
			this.formData.supplierShortName = data.shortName
		},
		// 下载
		downFile(row) {
			let obj = {
				fileName: row.originFileName,
				url: row.url
			}
			this.downloadFile(obj)
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
				const saveForm = this.$extends(true, {}, this.formData)
				saveForm.id = this.saveForm.id
				saveDoByBlIdApi(saveForm).then(res => {
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
