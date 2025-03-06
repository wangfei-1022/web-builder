<template>
	<div>
		<el-dialog	:visible.sync="dialogVisible" :title="initData.opType==1?'单箱提柜':'单箱还柜'" width="800px"	:close-on-click-modal="false">
      <div class="dialog-content">
        <el-form label-width="100px" label-position="left" :model="formData" ref="formData" v-if="dialogVisible" v-loading="loading" >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="getZH('ctnNo')" prop="ctnNo" >
                <el-input v-model.trim="formData.ctnNo" size="mini" disabled :placeholder="inputZH('ctnNo')" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="getZH('blNo')" prop="blNo" >
                <el-input v-model="formData.blNo" disabled size="mini" :placeholder="inputZH('blNo')" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="getZH('customerName')">
                <el-input v-model="formData.customerName" disabled size="mini" :placeholder="inputZH('customerName')" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="SKU" >
                <el-input v-model="formData.skuCode" disabled size="mini"  />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="getZH('totalTray')" >
                <el-input v-model="formData.trayNum" disabled size="mini"  />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="getZH('deliveryDate')" prop="pickUpTime"  :rules="[{ required:initData.opType==1, message: selectZH('deliveryDate') }]">
                <CommonPicker  v-model="formData.pickUpTime"  :disabled="initData.opType==2" pickerFormat="yyyy-MM-dd"  pikcerType="date" :clearable="false" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="getZH('trailerNumber')" prop="trailerNumber" >
                <el-input v-model="formData.transportNo"  size="mini" :placeholder="inputZH('trailerNumber')" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="getZH('supplierName')" prop="supplierId" >
                <TypeSelect v-model="formData.supplierId" type="supplier" :defaultDisplay="formData.supplierName"  @selected="supplierSelected" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="initData.opType==1">
               <el-form-item :label="getZH('destinationBin')"  prop="warehouseId" :rules="[{ required:true, message: selectZH('destinationBin') }]">
                <StorageWarehouseSelect v-model="formData.warehouseId" @selected='warehouseSelect' clearable />
              </el-form-item>
            </el-col>
             <el-col :span="12" v-if="initData.opType==2">
              <el-form-item :label="getZH('returnDate')"  prop="returnTime" :rules="[{ required:true, message: selectZH('returnDate') }]">
                <CommonPicker  v-model="formData.returnTime" pickerFormat="yyyy-MM-dd" :clearable="false"  pikcerType="date" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
               <el-form-item :label="getZH('emptyWharf')" prop="returnEmptyDock" :rules="[{ required:true, message: inputZH('emptyWharf') }]">
                <el-input v-model="formData.returnEmptyDock" size="mini" :placeholder="inputZH('emptyWharf')" />
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
import StorageWarehouseSelect from '../../../OverseasWarehouse/components/storageWarehouseSelect'
import { saveOrUpdateReturnApi, saveOrUpdatePickupApi } from '@/api/OvlSeaSitManage/seaBl'
export default {
	name: 'CtnOpDialog',
	components: { StorageWarehouseSelect },
	props: {
		initData: Object,
		visible: {
			type: Boolean,
			default: false
		}

	},
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
			returnTime: null,
			returnEmptyDock: null,
			supplierName: null,
			supplierId: null,
			transportNo: null,
			warehouseId: null,
			warehouseName: null
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
		supplierSelected(data) {
			this.formData.supplierName = data.chineseName
		},
		warehouseSelect(data) {
			this.formData.warehouseName = data.name
		},
		// 提交
		async submitData(refName) {
			this.$refs[refName].validate(valid => {
				if (!valid) {
					this.mixinsFormScrollIntoView()
					return false
				}
				const saveForm = this.$extends(true, {}, this.formData)
				let fn = this.initData.opType === 1 ? saveOrUpdatePickupApi : saveOrUpdateReturnApi
				this.loading = true
				fn(saveForm).then(res => {
					if (res && res.ok) {
						this.$message.success(this.$t('common.saveSuccess'))
						this.dialogVisible = false
						this.$emit('saved')
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
				this.$copyProps(this.formData, this.defaultForm)
				this.$copyProps(this.formData, this.initData)
				console.log(this.formData);

			}
			this.dialogVisible = val
		}
	}

}
</script>

<style>
</style>
