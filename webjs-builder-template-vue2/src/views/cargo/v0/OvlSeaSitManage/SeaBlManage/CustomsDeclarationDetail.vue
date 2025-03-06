<template>
  <div v-loading="loading" class="page-edit-container full-page bg-white">
    <div class="page-edit-content">
      <el-form ref="formData" :model="formData" label-width="110px" :rules="rules">
        <div class="pd-16 content-title">{{getZH('baseInfo')}}</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="getZH('blNo')" prop="blNo" >
              <el-select size="mini" v-model="formData.blNo" class="w-full" filterable :disabled="isDisabled" @change="selectedBl">
                <el-option v-for="item in blList" :key="item.blNo" :label="item.blNo" :value="item.blNo" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('declarationType')" prop="clearanceType" >
              <el-select size="mini" v-model="formData.clearanceType" class="w-full" :disabled="isDisabled" @change='setDetailList'>
                <el-option :label="getZH('clearance')" :value="1"> </el-option>
                <el-option :label="getZH('transfer')" :value="2"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('customerName')">
              <TypeSelect v-model="formData.customerId" :defaultDisplay='formData.customerName' type="customer" :requestParams="{businessType: 'OVERSEAS_WAREHOUSE'}" :disabled="isDisabled" @selected="customerSelected" :tips="false" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('vessel')" >
              <el-input v-model="formData.vessel" :disabled="true" size="mini"  />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('voyage')" >
              <el-input v-model="formData.voyage" :disabled="true" size="mini"  />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('pod')" >
              <el-input v-model="formData.pod" :disabled="true" size="mini"  />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="ETA" prop="eta" >
              <CommonPicker  v-model="formData.eta" pickerFormat="yyyy-MM-dd"  pikcerType="date" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('clearInvoiceNo')" >
              <el-input v-model="formData.clearInvoiceNo" :disabled="isDisabled" size="mini" :placeholder="inputZH('clearInvoiceNo')"  />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('delivery')" >
              <el-input v-model="formData.delivery" :disabled="isDisabled" size="mini" :placeholder="inputZH('delivery')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('consignationFlag')" prop="consignationFlag">
             <el-select size="mini" v-model="formData.consignationFlag" class="w-full" :disabled="isDisabled">
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
             </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('consignationSupplierName')" prop="supplierId" :rules="[{ required:formData.consignationFlag, message: selectZH('consignationSupplierName') }]">
               <TypeSelect v-model="formData.supplierId" type="supplier" :defaultDisplay="formData.supplierName"  @selected="supplierSelected" :disabled="isDisabled && operate!='confirm'" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('consignationDate')" prop="consignationDate" :rules="[{ required:formData.consignationFlag, message: selectZH('consignationDate') }]">
              <CommonPicker  v-model="formData.consignationDate" pickerFormat="yyyy-MM-dd"  pikcerType="date" :disabled="isDisabled && operate!='confirm'" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('customsFinishDate')" prop="customsFinishDate" :rules="[{ required:operate==='confirm', message: selectZH('consignationDate') }]">
              <CommonPicker  v-model="formData.customsFinishDate" pickerFormat="yyyy-MM-dd"  pikcerType="date" :disabled="operate!='confirm'" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('customsClearanceData')" :rules="[{ required:operate==='confirm', message: selectZH('customsClearanceData') }]" prop="fileObj.originFileName">
              <div class="download-wrap">
                <div class="input-link" @click="downFile(formData.fileObj)">{{formData.fileObj.originFileName}}</div>
                <UploadFile class="ml-10" :showFileList="false" @success="uploadSuccess" v-if="operate==='confirm'"></UploadFile>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="formData.clearanceType === 1">
            <el-form-item :label="getZH('customsClearFileNo')" :rules="[{ required:operate==='confirm', message: getZH('invalidClearFileNo') }]" prop="clearFileNo">
              <el-input v-model="formData.clearFileNo" size="mini"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="getZH('systemNo')" >
              <el-input v-model="formData.systemNo" :disabled="true" size="mini"  />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('createByName')"  prop="createByName" >
              <el-input v-model="formData.createByName" :disabled="true" size="mini"  />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('createTime')" prop="createTime" >
              <CommonPicker  v-model="formData.createTime" pickerFormat="yyyy-MM-dd"  pikcerType="date" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="formData.clearanceType === 1">
            <el-form-item :label="getZH('bondedFlag')" prop="bondedFlag" >
              {{formData.bondedFlag | getBondedStr(vm)}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('blState')"  prop="blState" >
              <el-input v-model="formData.stateName" :disabled="true" size="mini" :placeholder="inputZH('blState')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('remark')" prop="remark" >
              <el-input v-model="formData.remark" type="textarea" size="mini" :disabled="isDisabled && operate!='confirm'" />
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="formData.id">
          <div class="pd-16 content-title">{{getZH('ctnDetail')}}</div>
          <TaxTable ref="skuTable" :skuList="formData.goodsList" @saved="getDetail(true)" :isDetail='isDisabled' :blId="formData.blId" :customsId="formData.id" v-if="formData.clearanceType === 1 && formData.bondedFlag"/>
          <ctnTable ref="ctnTable" :ctnList="formData.seaImportCtnList" @saved="getDetail(true)" :isDetail='isDisabled' :blId="formData.blId" :customsId="formData.id" :clearanceType="formData.clearanceType" v-else />
        </div>
      </el-form>
    </div>
    <div class="page-edit-footer">
      <el-button type="primary" size="mini"  :loading="loading" v-if='!isDisabled' @click="saveForm('formData')"> {{getZH('saveBtn','common')}} </el-button>
      <el-button type="success" size="mini"  :loading="loading" v-if='!isDisabled && formData.state===0 && formData.id' @click="submitData('formData')"> {{getZH('submitBtn','common')}} </el-button>
      <el-button type="success" size="mini"  :loading="loading" v-if='operate==="confirm"' @click="confirmData('formData')"> {{getZH('confirmBtn','common')}} </el-button>
      <el-button size="mini" @click="backList" :loading="loading">{{getZH('backList','common')}}</el-button>
    </div>
  </div>
</template>

<script>
import { saveSeaCustomsApi, detailSeaCustomsApi, submitSeaCustomsApi, getSeaBlListApi, finishSeaCustomsApi, getCustomsCntsApi, getCustomsSKUApi } from '@/api/OvlSeaSitManage/seaBl'
import ctnTable from './components/ctnTable'
import TaxTable from './components/TaxTable'
import { deepCloneMethod } from '@/utils'
export default {
	name: 'CustomsDeclarationDetail',
	components: { ctnTable, TaxTable },
	data() {
		let defaultForm = {
			id: null,
			blId: null,
			blNo: null,
			clearFileNo: null,
			clearInvoiceNo: null,
			clearanceType: null,
			consignationDate: null,
			createByName: null,
			createTime: null,
			customerId: null,
			customerName: null,
			customerShortName: null,
			customsFinishDate: null,
			delivery: null,
			eta: null,
			podCode: null,
			pod: null,
			remark: null,
			state: 0,
			stateName: this.$t('common.draft'),
			supplierId: null,
			supplierName: null,
			supplierShortName: null,
			systemNo: null,
			vessel: null,
			voyage: null,
			consignationFlag: true,
			fileObj: {},
			seaImportCtnList: [],
			ctnList: [],
			goodsList: [],
			bondedFlag: false
		}
		return {
			vm: this,
			loading: false,
			operate: null,
			defaultForm,
			formData: this.$extends(true, {}, defaultForm),
			blList: [],
			rules: {
				blNo: [{ required: true, message: this.selectZH('blNo') }],
				clearanceType: [{ required: true, message: this.selectZH('declarationType') }],
				consignationFlag: [{ required: true, message: this.selectZH('consignationFlag') }]
			},
			originalBlId: '',
			originalCtnList: [],
			originalSKUList: []
		}
	},
	filters: {
		getBondedStr: function (flag, vm) {
			return flag ? vm.$t('common.trueText') : vm.$t('common.falseText')
		}
	},
	computed: {
		isDisabled() {
			return this.operate === 'view' || this.operate === 'confirm'
		}
	},
	async created() {
		this.operate = this.$route.params.operate
		this.id = this.$route.params.id
		this.init()
		await this.$nextTick()
		if (this.operate !== 'add') {
			this.getDetail()
		}
	},
	mounted() { },
	methods: {
		async init() {
			let res = await getSeaBlListApi({
				pageNum: 1,
				pageSize: 1000,
				blState: 5
			})
			if (res.ok) {
				this.blList = res.content.list || []
			}
		},
		// 选中客户
		customerSelected(data) {
			this.formData.customerName = data.chineseName
			this.formData.customerShortName = data.shortName
		},
		// 选中供应商
		supplierSelected(data) {
			this.formData.supplierName = data.chineseName
			this.formData.supplierShortName = data.shortName
		},
		// 选中仓库
		warehouseSelect(data) {
			this.formData.warehouseName = data.name
		},
		// 上传成功
		uploadSuccess(data) {
			this.formData.fileObj = data
		},
		// 选中提单
		selectedBl(blNo) {
			this.loading = true
			let selected = this.blList.find(item => item.blNo === blNo)
			if (this.$isNotEmpty(selected)) {
				this.formData.customerId = selected.customerId
				this.formData.customerName = selected.customerName
				this.formData.vessel = selected.vessel
				this.formData.voyage = selected.voyage
				this.formData.eta = selected.eta
				this.formData.pod = selected.pod
				this.formData.podCode = selected.podCode
				this.formData.clearInvoiceNo = selected.clearInvoiceNo
				this.formData.clearanceType = selected.clearanceType
				this.formData.blId = selected.id
				this.formData.bondedFlag = selected.bondedFlag
			}

			// 设置箱详情列表
			if (this.formData.clearanceType !== null) {
				this.setDetailList()
			} else {
				this.formData.seaImportCtnList = []
				this.formData.goodsList = []
			}
			this.loading = false
		},
		setDetailList() {
			if (this.formData.blId === this.originalBlId) {
				this.formData.ctnList = deepCloneMethod(this.originalCtnList)
				this.formData.goodsList = deepCloneMethod(this.originalSKUList)
			} else {
				if (!this.formData.bondedFlag && this.formData.blId && this.formData.id) {
					this.getCustomsCnts()
					this.$nextTick(() => {
						this.$refs.ctnTable.isEdit = false
					})
				}

				if (this.formData.bondedFlag && this.formData.blId && this.formData.id) {
					this.getCustomsSKU()
					this.$nextTick(() => {
						this.$refs.skuTable.isEdit = false
					})
				}
			}
		},
		// 获取可报关的箱子
		async getCustomsCnts() {
			const res = await getCustomsCntsApi({ blId: this.formData.blId })
			if (res.ok) {
				let data = []
				res.content.forEach(item => {
					let itemData = {
						id: null,
						ctnNo: null,
						ctnType: null,
						skuCodeList: null,
						totalTray: null,
						totalNw: null,
						totalGw: null,
						totalImportValue: null,
						currencyName: null
					}
					this.$copyProps(itemData, item)
					data.push(itemData)
				})
				this.formData.seaImportCtnList = data
			}
		},
		// 获取可报关的SKU
		async getCustomsSKU() {
			let queryData = {
				blId: this.formData.blId,
				skuCode: ''
			}
			const res = await getCustomsSKUApi(queryData)
			if (res.ok) {
				let data = []
				res.content.map(item => {
					let itemData = {
						skuId: null,
						skuCode: null,
						skuName: null,
						skuNum: null,
						currency: null,
						currencyName: null,
						importValue: null
					}
					this.$copyProps(itemData, item)
					data.push(itemData)
				})
				this.formData.goodsList = data
			}
		},
		// 下载
		downFile(row) {
			let obj = {
				fileName: row.originFileName,
				url: row.url
			}
			this.downloadFile(obj)
		},
		/**
		 * 获取详情
		 */
		async getDetail(update) {
			this.loading = true
			const res = await detailSeaCustomsApi(this.id).catch(() => {
				this.loading = false
			})
			if (res.ok) {
				// 箱子导入成功
				if (update) {
					this.formData.seaImportCtnList = res.content.seaImportCtnList
				} else {
					// 处理额外属性
					if (this.$isNotEmpty(res.content.fileJson)) {
						res.content.fileObj = JSON.parse(res.content.fileJson)
					}
					this.$copyProps(this.formData, res.content)
					this.setOriginalInfo()
				}
				this.loading = false
			} else {
				this.loading = false
			}
		},
		// 设置原数据
		setOriginalInfo() {
			this.originalBlId = this.formData.blId
			this.originalCtnList = deepCloneMethod(this.formData.seaImportCtnList)
			this.originalSKUList = deepCloneMethod(this.formData.goodsList)
		},
		/**
		 * 保存数据
		 */
		saveForm(refName) {
			this.loading = true
			this.$refs[refName].validate(valid => {
				if (!valid) {
					this.mixinsFormScrollIntoView()
					this.loading = false
					return false
				}
				if (this.$refs.ctnTable && this.$refs.ctnTable.isEdit) {
					this.$message.error(this.$t('seaBl.saveTips'))
					this.loading = false
					return
				}
				if (this.$refs.skuTable && this.$refs.skuTable.isEdit) {
					this.$message.error(this.$t('seaBl.saveTips'))
					this.loading = false
					return
				}
				this.setCtns()
				this.setSkus()
				const saveForm = this.$extends(true, {}, this.formData)
				saveForm.fileJson = this.$isNotEmpty(saveForm.fileObj) ? JSON.stringify(saveForm.fileObj) : null
				delete saveForm.fileObj
				saveSeaCustomsApi(saveForm).then(res => {
					if (res && res.ok) {
						this.$message.success(this.getZH('saveSuccess', 'common'))
						if (!this.formData.id) {
							this.$router.push({ name: `CustomsDeclarationDetail`, params: { operate: 'edit', id: res.content } })
						} else {
							this.backList()
						}
						this.loading = false
					} else {
						this.loading = false
					}
				}).catch(() => {
					this.loading = false
				})
			})
		},
		/**
		 * 提交数据
		 */
		submitData(refName) {
			this.$confirm(this.$t('seaBl.submitTips'), this.$t('common.tips'), {
				confirmButtonText: this.$t('common.confirmBtn'),
				cancelButtonText: this.$t('common.cancelBtn'),
				type: 'warning'
			}).then(() => {
				this.loading = true
				this.$refs[refName].validate(valid => {
					if (!valid) {
						this.mixinsFormScrollIntoView()
						this.loading = false
						return false
					}
					if (this.$refs.ctnTable && this.$refs.ctnTable.isEdit) {
						this.$message.error(this.$t('seaBl.saveTips'))
						this.loading = false
						return
					}
					if (this.$refs.skuTable && this.$refs.skuTable.isEdit) {
						this.$message.error(this.$t('seaBl.saveTips'))
						this.loading = false
						return
					}
					this.setCtns()
					this.setSkus()
					const saveForm = this.$extends(true, {}, this.formData)
					saveForm.fileJson = this.$isNotEmpty(saveForm.fileObj) ? JSON.stringify(saveForm.fileObj) : null
					delete saveForm.fileObj
					submitSeaCustomsApi(saveForm).then(res => {
						if (res && res.ok) {
							this.$message.success(this.getZH('saveSuccess', 'common'))
							this.backList()
							this.loading = false
						} else {
							this.loading = false
						}
					}).catch(() => {
						this.loading = false
					})
				})
			}).catch(() => {
				// do nothing
			})
		},
		// 获取箱详情提交的对象
		setCtns() {
			this.formData.ctnList = []
			if (this.formData.clearanceType === 2 && this.formData.id) {
				this.formData.ctnList = this.$refs.ctnTable.dataList.map(item =>
				({
					id: item.id,
					mrn: item.mrn,
					mrnDate: item.mrnDate
				})
				)
			}
		},
		// 提单保税时获取箱详情对象
		setSkus() {
			this.formData.goodsList = []
			if (this.formData.bondedFlag && this.formData.id && this.formData.clearanceType === 1) {
				this.formData.goodsList = this.$refs.skuTable.dataList
			}
		},
		/**
		 * 确认数据
		 */
		confirmData(refName) {
			this.$confirm(this.$t('seaBl.submitTips'), this.$t('common.tips'), {
				confirmButtonText: this.$t('common.confirmBtn'),
				cancelButtonText: this.$t('common.cancelBtn'),
				type: 'warning'
			}).then(() => {
				this.$refs[refName].validate(valid => {
					if (!valid) {
						this.mixinsFormScrollIntoView()
						return false
					}
					const saveForm = this.$extends(true, {}, this.formData)
					saveForm.fileJson = this.$isNotEmpty(saveForm.fileObj) ? JSON.stringify(saveForm.fileObj) : null
					delete saveForm.fileObj
					finishSeaCustomsApi(saveForm).then(res => {
						if (res && res.ok) {
							this.$message.success(this.getZH('saveSuccess', 'common'))
							this.backList()
							this.loading = false
						} else {
							this.loading = false
						}
					}).catch(() => {
						this.loading = false
					})
				})
			}).catch(() => {
				// do nothing
			})

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
		/**
		 * 返回列表
		 */
		backList() {
			this.$store.dispatch('tagsView/delView', this.$route)
			this.$router.push({ name: `CustomsDeclarationManage` })
		}
	}
}
</script>

<style scoped lang="scss">
.download-wrap {
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-start;
	align-items: center;
	vertical-align: middle;
	width: 100%;
	height: 36px;
}
</style>
