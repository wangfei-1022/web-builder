<template>
  <div v-loading="loading" class="page-edit-container full-page bg-white">
    <div class="page-edit-content">
      <el-form ref="formData" :model="formData" label-width="110px" :rules="rules">
        <div class="pd-16 content-title">{{getZH('baseInfo')}}</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="getZH('customerName')" prop="customerId" >
              <TypeSelect v-model="formData.customerId" :defaultDisplay="formData.customerName" type="customer" @selected="customerSelected" :disabled="isDisabled" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('declareDate')" prop="declareDate" >
            <CommonPicker  v-model="formData.declareDate" pickerFormat="yyyy-MM-dd"  pikcerType="date" :disabled="isDisabled" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('carrierName')" prop="carrierId">
              <TypeSelect v-model="formData.carrierId" type="shippingCompany" :defaultDisplay="formData.carrierName"  @selected="customerSelectedShipping" :disabled="isDisabled" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('vessel')" prop="vessel" >
              <el-input v-model="formData.vessel" :disabled="isDisabled" size="mini" :placeholder="inputZH('vessel')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('voyage')" prop="voyage" >
              <el-input v-model="formData.voyage" :disabled="isDisabled" size="mini" :placeholder="inputZH('voyage')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('podCode')" prop="podCode" >
            <TypeSelect v-model="formData.podCode" type="seaport" @selected="seaportSelect" :defaultDisplay="formData.pod" :podLable="'englishName'" :disabled="isDisabled" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('blNo')" prop="blNo" class="relative">
              <el-input v-model="formData.blNo" :disabled="isDisabled" maxlength="20" size="mini" :placeholder="inputZH('blNo')" @blur="checkBlNo" />
              <div class="blNoTips" v-if="blNoTipsFlag && $isNotEmpty(formData.blNo)">{{ getZH('blNoTips')}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('mblNo')"  prop="mblNo" >
              <el-input v-model="formData.mblNo" :disabled="isDisabled" size="mini" :placeholder="inputZH('mblNo')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('PACode')"  prop="paNo" >
              <el-input v-model="formData.paNo" :disabled="isDisabled" size="mini" :placeholder="inputZH('PACode')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('ETA')" prop="eta" >
            <CommonPicker  v-model="formData.eta" pickerFormat="yyyy-MM-dd"  pikcerType="date" :disabled="isDisabled" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('ATA')" prop="ata" >
            <CommonPicker  v-model="formData.ata" pickerFormat="yyyy-MM-dd"  pikcerType="date" :disabled="isDisabled" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('blState')"  prop="blState" >
              <el-input v-model="formData.blStateName" :disabled="true" size="mini" :placeholder="inputZH('blState')" />
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
          <el-col :span="8">
            <el-form-item :label="getZH('systemNo')" prop="systemNo" >
              <el-input v-model="formData.systemNo" :disabled="true" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="pd-16 content-title">{{getZH('importInfo')}}</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="getZH('importer')"  prop="importer" >
              <el-input v-model="formData.importer" :disabled="isDisabled" size="mini" :placeholder="inputZH('importer')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('saller')" prop="saller" >
              <el-input v-model="formData.saller" :disabled="isDisabled" size="mini" :placeholder="inputZH('saller')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('actualBuyer')" prop="actualBuyer" >
              <el-input v-model="formData.actualBuyer" :disabled="isDisabled" size="mini" :placeholder="inputZH('actualBuyer')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('tradeTerm')" prop="tradeTerm" >
              <ItemCodeSelect v-model="formData.tradeTerm" :disabled="isDisabled" parentCode="ESIT_IMPORT_BASE_TRADE_CLASS" @selected="tradeTermSelected" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('clearInvoiceNo')" prop="clearInvoiceNo" >
              <el-input v-model="formData.clearInvoiceNo" :disabled="isDisabled" size="mini" :placeholder="inputZH('clearInvoiceNo')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('warehouseName')" prop="warehouseId" >
              <StorageWarehouseSelect v-model="formData.warehouseId" :disabled="isDisabled" @selected='warehouseSelect' clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="getZH('bondedFlag')" prop="bondedFlag" >
              <el-checkbox :disabled="isDisabled" v-model="formData.bondedFlag">{{getZH('bondedFlagChecked')}}</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="pd-16 content-title">{{getZH('importService')}}</div>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label="getZH('commissionedService')"  >
              <el-checkbox :disabled="isDisabled" v-model="formData.clearanceFlag" @change="clearanceFlagChange">{{getZH('clearanceOrtransfer')}}</el-checkbox>
              <el-checkbox :disabled="isDisabled" v-model="formData.blFlag">{{getZH('DOService')}}</el-checkbox>
              <el-checkbox :disabled="isDisabled" v-model="formData.tranFlag">{{getZH('Trayervice')}}</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="formData.clearanceFlag">
            <el-form-item :label="getZH('declarationType')" prop="clearanceType" >
              <el-select size="mini" v-model="formData.clearanceType" class="w-full" :disabled="isDisabled">
                <el-option :label="getZH('clearance')" :value="1"> </el-option>
                <el-option :label="getZH('transfer')" :value="2"> </el-option>
                <!-- <el-option :label="getZH('none')" value="3"> </el-option> -->
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if='formData.id'>
          <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane :label="getZH('goodsInfo')" name="1">
              <GoodsInfoTable  :blId="formData.id" ref="GoodsInfoTable" v-if="activeName==1" :isDetail="isDisabled" />
            </el-tab-pane>
            <el-tab-pane :label="getZH('boxInfo')" name="2">
              <ContainerInfoTable :blId="formData.id" ref="ContainerInfoTable" v-if="activeName==2" :isDetail="isDisabled" />
            </el-tab-pane>
            <el-tab-pane :label="getZH('trayInfo')" name="3" >
              <TrayTable :blId="formData.id" v-if="activeName==3" :isDetail="isDisabled" />
            </el-tab-pane>
            <el-tab-pane :label="getZH('logInfo')" name="4">
              <LogsTable :blId="formData.id" v-if="activeName==4" />
            </el-tab-pane>
          </el-tabs>
          <div class="pd-16 content-title">{{getZH('dataInfo')}}</div>
          <DataInfoTable :blId="formData.id" :isDetail="isDisabled"  />
        </div>
      </el-form>
    </div>
    <div class="page-edit-footer">
      <el-button type="primary" size="mini"  :loading="loading" v-if='!isDisabled' @click="saveForm('formData')"> {{getZH('saveBtn','common')}} </el-button>
      <el-button type="success" size="mini"  :loading="loading" v-if='!isDisabled && formData.blState==1 && formData.id' @click="submitData('formData')"> {{getZH('submitBtn','common')}} </el-button>
      <el-button type="danger" size="mini"  :loading="loading" v-if='isDisabled && formData.blState==5' @click="revocation()"> {{getZH('revocation')}} </el-button>
      <el-button size="mini" @click="backList" :loading="loading">{{getZH('backList','common')}}</el-button>
    </div>
  </div>
</template>

<script>
import saleCountryInfo from '../../OverseasWarehouse/GoodsManagement/components/saleCountryInfo'
import StorageWarehouseSelect from '../../OverseasWarehouse/components/storageWarehouseSelect'
import { saveSeaBlApi, detailSeaBlApi, submitDataSeaBlListApi, cancelSeaBlApi, checkBlNoApi } from '@/api/OvlSeaSitManage/seaBl'
import GoodsInfoTable from './components/goodsInfoTable'
import ContainerInfoTable from './components/containerInfoTable'
import TrayTable from './components/trayTable'
import DataInfoTable from './components/dataInfoTable'
import LogsTable from './components/logsTable'
import ItemCodeSelect from '../Components/ItemCodeSelect'
export default {
	name: 'SeaBlDetail',
	components: { saleCountryInfo, StorageWarehouseSelect, GoodsInfoTable, ItemCodeSelect, ContainerInfoTable, TrayTable, LogsTable, DataInfoTable },
	data() {
		let defaultForm = {
			id: null,
			ata: null,
			eta: null,
			blState: '1',
			blStateName: '草稿',
			blType: 1,
			blNo: null,
			actualBuyer: null,
			carrierId: null,
			carrierName: null,
			carrierShortName: null,
			carrierShortNameEn: null,
			clearInvoiceNo: null,
			customerId: null,
			customerName: null,
			customerShortName: null,
			declareDate: null,
			importer: null,
			mblId: null,
			mblNo: null,
			pod: null,
			podCode: null,
			saller: null,
			systemNo: null,
			tradeTerm: null,
			tradeTermName: null,
			vessel: null,
			voyage: null,
			warehouseId: null,
			warehouseName: null,
			clearanceFlag: 0,
			blFlag: null,
			tranFlag: null,
			clearanceType: null,
			paNo: null,
			createByName: null,
			createTime: null,
			bondedFlag: false
		}
		return {
			loading: false,
			blNoTipsFlag: false,
			operate: null,
			defaultForm,
			formData: this.$extends(true, {}, defaultForm),
			id: null,
			activeName: '1',
			goodsTypes: [],
			shipperList: [],
			countryOptions: [],
			customCodesOptions: [],
			rules: {
				customerId: [{ required: true, message: this.selectZH('customerName') }],
				declareDate: [{ required: true, message: this.selectZH('declareDate') }],
				vessel: [{ required: true, message: this.selectZH('vessel') }],
				voyage: [{ required: true, message: this.selectZH('voyage') }],
				podCode: [{ required: true, message: this.selectZH('podCode') }],
				carrierId: [{ required: true, message: this.selectZH('carrierName') }],
				blNo: [{
					required: true, message: this.inputZH('blNo')
				}],
				warehouseId: [{ required: true, message: this.selectZH('warehouseName') }],
				tradeTerm: [{ required: true, message: this.selectZH('tradeTerm') }],
				clearanceType: [{ required: true, message: this.selectZH('declarationType') }]
			}
		}
	},
	computed: {
		isDisabled() {
			return this.operate === 'view'
		},
		/**
		 * 过滤国家数据
		 */
		filterData() {
			let arr = this.countryOptions
			arr = arr.filter(item => this.formData.goodsSaleCountryList.indexOf(item.id) === -1)
			return arr
		}
	},
	async created() {
		this.operate = this.$route.params.operate
		this.id = this.$route.params.id
		await this.$nextTick()
		if (this.operate === 'copy') {
			this.copyDetail()
		} else if (this.operate !== 'add') {
			this.getDetail()
		}
	},
	mounted() {

	},
	methods: {

		/**
		 * 客户选择
		 */
		customerSelected(data) {
			this.formData.customerName = data.chineseName
			this.formData.customerShortName = data.shortName

		},
		// 船公司选择
		customerSelectedShipping(data) {
			this.formData.carrierName = data.chineseName
			this.formData.carrierShortName = data.chineseShortname
			this.formData.carrierShortNameEn = data.englishShortname
		},
		// 港口选择
		seaportSelect(data) {
			this.formData.pod = data.englishName
		},
		// 贸易条款
		tradeTermSelected(data) {
			this.formData.tradeTermName = data.name
		},
		// 清关、转关变更
		clearanceFlagChange(val) {
			if (val) {
				this.formData.clearanceType = null
			} else {
				this.formData.clearanceType = 0
			}
		},
		warehouseSelect(data) {
			this.formData.warehouseName = data.name
		},
		// 撤销数据
		revocation() {
			this.$confirm(this.$t('seaBl.revocationTips'), this.$t('common.tips'), {
				confirmButtonText: this.$t('common.confirmBtn'),
				cancelButtonText: this.$t('common.cancelBtn'),
				type: 'warning'
			}).then(() => {
				this.loading = true
				cancelSeaBlApi(this.formData.id).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('seaBl.revocationSuccess'))
						this.backList()
						this.loading = false
					} else {
						this.loading = false
					}
				}).catch(() => {
					this.loading = false
				})

			}).catch(() => {
				// do nothing
			})
		},
		// 检查tab页是否有待保存的数据
		checkSave() {
			if (this.formData.id) {
				if (Number(this.activeName) === 1) {
					let editFlag = this.$refs.GoodsInfoTable.isEdit
					if (editFlag) {
						this.$alert(this.$t('seaBl.GoodsEdit'), {
							confirmButtonText: this.$t('common.theKnow')
						})
					}
					return editFlag
				}
				if (Number(this.activeName) === 2) {
					let editFlag = this.$refs.ContainerInfoTable.isEdit
					if (editFlag) {
						this.$alert(this.$t('seaBl.ContainerInfoEdit'), {
							confirmButtonText: this.$t('common.theKnow')
						})
					}
					return editFlag
				}
			}
			return false
		},
		/**
		 * 获取详情
		 */
		async getDetail() {
			this.loading = true
			const res = await detailSeaBlApi(this.id).catch(() => {
				this.loading = false
			})
			if (res.ok) {
				// 处理额外属性
				this.$copyProps(this.formData, res.content)
				this.loading = false
			} else {
				this.loading = false
			}
		},
		/**
		 * 获取详情
		 */
		async copyDetail() {
			this.loading = true
			const res = await detailSeaBlApi(this.id)
			if (res.ok) {
				// 处理额外属性
				const copyData = {
					customerId: res.content.customerId,
					customerName: res.content.customerName,
					customerShortName: res.content.customerShortName,
					carrierId: res.content.carrierId,
					carrierName: res.content.carrierName,
					carrierShortName: res.content.carrierShortName,
					vessel: res.content.vessel,
					voyage: res.content.voyage,
					pod: res.content.pod,
					podCode: res.content.podCode,
					warehouseId: res.content.warehouseId,
					warehouseName: res.content.warehouseName,
					ata: res.content.ata,
					eta: res.content.eta
				}
				this.$copyProps(this.formData, copyData)
			}
			this.loading = false
		},
		/**
		 * 保存数据
		 */
		saveForm(refName) {
			this.$refs[refName].validate(valid => {
				if (!valid) {
					this.mixinsFormScrollIntoView()
					return false
				}
				let flag = this.checkSave()
				if (flag) {
					return
				}
				const saveForm = this.$extends(true, {}, this.formData)
				saveSeaBlApi(saveForm).then(res => {
					if (res && res.ok) {
						this.$message.success(this.getZH('saveSuccess', 'common'))
						if (!this.formData.id) {
							this.$router.push({ name: `SeaBlDetail`, params: { operate: 'edit', id: res.content } })
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
				this.$refs[refName].validate(valid => {
					if (!valid) {
						this.mixinsFormScrollIntoView()
						return false
					}
					let flag = this.checkSave()
					if (flag) {
						return
					}
					const saveForm = this.$extends(true, {}, this.formData)
					submitDataSeaBlListApi(saveForm).then(res => {
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
		// 检验提单号是否重复
		async checkBlNo() {
			if (this.$isEmpty(this.formData.blNo)) {
				this.blNoTipsFlag = false
				return
			}
			let data = {
				id: this.formData.id,
				blNo: this.formData.blNo
			}
			let res = await checkBlNoApi(data)
			if (res.ok) {
				this.blNoTipsFlag = res.content
			}
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
			this.$router.push({ name: `SeaBlList` })
		}
	}
}
</script>

<style scoped lang="scss">
::v-deep .el-checkbox__label {
	font-size: 12px;
}
.uploadFile-box {
	width: 80px;
	height: 80px;
	border: 1px dashed #d9d9d9;
}
.upload-box {
	width: 80px;
	height: 80px;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1px dashed #d9d9d9;
	font-size: 24px;
	color: #c0c4cc;
	margin-right: 10px;
}
.img-box {
	width: 80px;
	height: 80px;
	margin-right: 10px;

	img {
		display: block;
		width: 100%;
		height: 100%;
	}
}
.img-tips {
	width: 148px;
	height: 80px;
	margin-left: 10px;
	line-height: 22px;
	background-color: #fcf5ec;
	color: #edbc84;
	padding: 10px;
	font-size: 12px;
}
.addIcon {
	color: #666;
}
.editIcon {
	margin-top: 8px;
	margin-left: 8px;
	color: #999;
	font-size: 20px;
	cursor: pointer;
}

.warning-text {
	color: #ffba00;
}
.relative {
	position: relative;
	&:hover .delete {
		display: block;
	}
}
.delete {
	position: absolute;
	right: 12px;
	top: 4px;
	color: #bf1111;
	display: none;
}
.blNoTips {
	position: absolute;
	color: #f56c6c;
	top: 28px;
	font-size: 12px;
}
</style>
