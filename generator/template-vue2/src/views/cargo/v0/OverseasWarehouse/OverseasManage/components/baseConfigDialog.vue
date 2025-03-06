<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" :title="getZH('customer_base_config')" width="800px"
      :close-on-click-modal="false">
      <el-form v-if="dialogVisible" ref="formData" v-loading="loading" label-width="110px" label-position="left"
        :model="formData">
        <div class="content-title">{{ getZH('base_info') }}</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="getZH('customer_cName')">
              <span>{{ formData.chineseName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="getZH('customerNumber')">
              <span>{{ formData.no }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="getZH('customer_short_Name')">
              <span>{{ formData.shortName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="getZH('customer_eName')">
              <span>{{ formData.englishName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="getZH('sales_names')">
              <span>{{formData.salesNames?formData.salesNames.join(","):''}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="content-title">{{ getZH('base_config') }}</div>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label="getZH('customerType')" prop="customerType"   :rules="[{ required: true, message:selectZH('customerType'), trigger: 'blur' },]">
              <el-radio-group v-model="formData.customerType">
                <el-radio :label="1">{{ getZH('proprietary') }}</el-radio>
                <el-radio :label="2">{{ getZH('generation_of_operating') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="saveForm('formData')">{{ $t('common.saveBtn') }} </el-button>
        <el-button type="primary" size="mini" @click="updateStatus(1)"
          v-if="Number(formData.status) === 2 || Number(formData.status) === 3">{{
              getZH('restore_order')
          }}</el-button>
        <el-button type="danger" size="mini" @click="updateStatus(3)" v-if="Number(formData.status) === 1">{{ getZH('stop_order')
        }}</el-button>
        <el-button size="mini" @click="dialogVisible = false"> {{ $t('common.cancelBtn') }} </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { detailCustomerApi, updateCustomerBaseInfoApi, updateCustomerStatusApi } from '@/api/OverseasWarehouse/overseasManage.js'
import getZHMixin from './getZHMixin'
export default {
	name: 'BaseConfigDialog',
	mixins: [getZHMixin],
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		id: String
	},
	data() {
		const defaultForm = {
			id: null,
			chineseName: null,
			englishName: null,
			salesNames: null,
			shortName: null,
			customerType: 1,
			customerTypeName: null,
			no: null,
			status: 1
		}
		return {
			defaultForm,
			dialogVisible: false,
			isEdit: false,
			tempData: {},
			loading: false,
			formData: this.$extends(true, {}, defaultForm)
		}
	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		visible(val) {
			if (val) {
				this.formData = this.$extends(true, {}, this.defaultForm)
				this.init()
			}
			this.dialogVisible = val
		}
	},
	methods: {
		/**
		 * 获取物流产品列表数据
		 */
		async init() {
			this.isEdit = false
			this.loading = true
			const res = await detailCustomerApi(this.id).catch(() => {
				this.loading = false
			})
			if (res.ok) {
				this.$copyProps(this.formData, res.content)
				this.loading = false

			} else {
				this.loading = false
			}
		},
		/**
		 * 提示信息
		 */
		updateStatus(status) {
			if (status === 3) {
				this.$confirm(this.getZH('confim_stop_tips'), this.getZH('confim_stop'), {
					cancelButtonText: this.getZH('cancel', 'common'),
					confirmButtonText: this.getZH('determined_to_stop'),
					type: 'danger'
				}).then(() => {
					this.saveUpdateStatus(status)
				})
			} else {
				this.$confirm(this.getZH('confim_restore_tips'), this.getZH('confim_restore'), {
					cancelButtonText: this.getZH('cancel', 'common'),
					confirmButtonText: this.getZH('restore_order'),
					type: 'danger'
				}).then(() => {
					this.saveUpdateStatus(status)
				})
			}
		},
		/**
		 * 跟新状态
		 */
		async saveUpdateStatus(status) {
			let data = {
				id: this.formData.id,
				status
			}
			let res = await updateCustomerStatusApi(data)
			if (res.ok) {
				this.$message.success(this.getZH('uploadSuccess', 'common'))
				this.$emit('saved')
				this.dialogVisible = false
			}
		},
		/**
		 * 保存
		 */
		saveForm(refName) {
			this.loading = true
			this.$refs[refName].validate(valid => {
				if (!valid) {
					this.loading = false
					return false
				}
				this.loading = false
				let saveForm = {
					id: this.formData.id,
					customerType: this.formData.customerType
				}
				updateCustomerBaseInfoApi(saveForm).then(res => {
					if (res.ok) {
						this.$message.success(this.getZH('saveSuccess', 'common'))
					}
				})
				this.dialogVisible = false
			})
		}
	}

}
</script>

<style>
</style>
