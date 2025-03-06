<template>
	<div v-loading="loading" class="page-edit-container full-page bg-white">
    <div class="page-edit-content">
      <el-form ref="formData"	:model="formData" label-width="110px" :rules="rules">
        <div class="pd-16 content-title">{{getZH('baseInfo')}}</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="getZH('ctnNo')" prop="ctnNo" >
              <el-input v-model.trim="formData.ctnNo" :disabled="isDisabled" size="mini" :placeholder="inputZH('ctnNo')" @change='ctnNoChange' />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('blNo')" prop="blNo" >
              <el-input v-model="formData.blNo" :disabled="true" size="mini" :placeholder="inputZH('blNo')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('customerName')">
              <el-input v-model="formData.customerName" :disabled="true" size="mini" :placeholder="inputZH('customerName')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="SKU" >
              <el-input v-model="formData.skuCode" :disabled="true" size="mini"  />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('totalTray')" >
              <el-input v-model="formData.trayNum" :disabled="true" size="mini"  />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="getZH('deliveryDate')" prop="pickUpTime" >
            <CommonPicker  v-model="formData.pickUpTime" pickerFormat="yyyy-MM-dd"  pikcerType="date" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('trailerNumber')" prop="trailerNumber" >
              <el-input v-model="formData.transportNo" :disabled="isDisabled" size="mini" :placeholder="inputZH('trailerNumber')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('supplierName')" prop="supplierId" >
               <TypeSelect v-model="formData.supplierId" type="supplier" :defaultDisplay="formData.supplierName"  @selected="supplierSelected" :disabled="isDisabled" />
            </el-form-item>
          </el-col>
          <!--  -->
           <el-col :span="8">
            <el-form-item :label="getZH('returnDate')"  prop="returnTime">
              <CommonPicker  v-model="formData.returnTime" pickerFormat="yyyy-MM-dd" :clearable="false"  pikcerType="date" :disabled="isDisabled" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('emptyWharf')" prop="returnEmptyDock" >
              <el-input v-model="formData.returnEmptyDock" :disabled="isDisabled" size="mini" :placeholder="inputZH('emptyWharf')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
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
            <el-form-item :label="getZH('blState')"  prop="blState" >
              <el-input v-model="formData.stateName" :disabled="true" size="mini" :placeholder="inputZH('blState')" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
		<div class="page-edit-footer">
      <el-button type="primary" size="mini"  :loading="loading" v-if='!isDisabled' @click="saveForm('formData')"> {{getZH('saveBtn','common')}} </el-button>
      <el-button type="success" size="mini"  :loading="loading" v-if='!isDisabled && formData.state==1' @click="submitData('formData')"> {{getZH('submitBtn','common')}} </el-button>
      <el-button size="mini" @click="backList" :loading="loading">{{getZH('backList','common')}}</el-button>
		</div>
	</div>
</template>

<script>
import { saveCtnReturnApi, detailCtnReturnApi, submitCtnReturnApi, getCtnReturnApi } from '@/api/OvlSeaSitManage/seaBl'
export default {
	name: 'ContainerReturnDetail',
	components: {},
	data() {
		let defaultForm = {
			id: null,
			blId: null,
			blNo: null,
			ctnId: null,
			ctnNo: null,
			skuCode: null,
			customerName: null,
			trayNum: null,
			pickUpTime: null,
			returnTime: new Date().getTime(),
			returnEmptyDock: null,
			state: 1,
			stateName: '草稿',
			supplierName: null,
			supplierId: null,
			transportNo: null,
			createTime: null,
			createByName: null
		}
		return {
			loading: false,
			operate: null,
			defaultForm,
			formData: this.$extends(true, {}, defaultForm),
			rules: {
				returnTime: [{ required: true, message: this.selectZH('returnDate') }],
				ctnNo: [{ required: true, message: this.inputZH('ctnNo') }],
				returnEmptyDock: [{ required: true, message: this.inputZH('emptyWharf') }]
			}
		}
	},
	computed: {
		isDisabled() {
			return this.operate === 'view'
		}
	},
	async created() {
		this.operate = this.$route.params.operate
		this.id = this.$route.params.id
		await this.$nextTick()
		if (this.operate !== 'add') {
			this.getDetail()
		}
	},
	mounted() {

	},
	methods: {
		// 箱号变更
		ctnNoChange(ctnNo) {
			if (this.$isNotEmpty(ctnNo)) {
				this.loading = true
				getCtnReturnApi({ ctnNo }).then(res => {
					if (res.ok) {
						if (this.$isNotEmpty(res.content)) {
							this.setBlInfo(res.content)
							this.formData.ctnId = res.content.id

							if (this.$isNotEmpty(res.content.pickupInfo)) {
								this.formData.pickUpTime = res.content.pickupInfo.pickUpTime
								this.formData.returnEmptyDock = res.content.pickupInfo.returnEmptyDock
							}
						} else {
							this.$alert(this.getZH('ctnEmpty'), this.$t('common.tips'), {
								confirmButtonText: this.getZH('theKnow', 'common'),
								callback: () => {
									this.formData.ctnNo = null
								}
							})
						}
						this.loading = false
					} else {
						this.loading = false
					}

				})
			}
		},
		// 设置提单信息
		setBlInfo(data) {
			let blDetail = data.blDetail
			let goods = this.$isEmpty(data.ctnGoodsList) ? {} : data.ctnGoodsList[0]
			this.formData.blId = blDetail.id
			this.formData.blNo = blDetail.blNo
			this.formData.customerName = blDetail.customerName
			this.formData.trayNum = goods.trayNum
			this.formData.skuCode = goods.skuCode
		},
		supplierSelected(data) {
			this.formData.supplierName = data.chineseName
		},
		warehouseSelect(data) {
			this.formData.warehouseName = data.name
		},
		/**
		 * 获取详情
		 */
		async getDetail() {
			this.loading = true
			const res = await detailCtnReturnApi(this.id).catch(() => {
				this.loading = false
			})
			if (res.ok) {
				this.$copyProps(this.formData, res.content)
				// 处理额外属性
				this.setBlInfo(res.content)
				if (this.$isNotEmpty(res.content.seaImportCtnPickup)) {
					this.formData.pickUpTime = res.content.seaImportCtnPickup.pickUpTime
				}
				this.loading = false
			} else {
				this.loading = false
			}
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
				const saveForm = this.$extends(true, {}, this.formData)
				saveCtnReturnApi(saveForm).then(res => {
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
					const saveForm = this.$extends(true, {}, this.formData)
					submitCtnReturnApi(saveForm).then(res => {
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
			this.$router.push({ name: `ContainerReturnManage` })
		}
	}
}
</script>

<style scoped lang="scss">
</style>
