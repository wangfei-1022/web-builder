<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" :title="getZH('FBAWarehouseEdit')" width="900px" :close-on-click-modal="false">
      <el-form v-if="dialogVisible" ref="formData" v-loading="loading" label-width="80px" :rules="rules" label-position="left" :model="formData">
        <div class="content-title mb-10">{{ getZH('base_info') }}</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="getZH('warehouseCode')" prop="code" >
              <el-input size="mini" v-model="formData.code" :placeholder="inputZH('warehouseCode')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
           <el-form-item :label="getZH('country')" prop="countryCode">
              <NationalGroupSelect v-model="formData.countryCode" @change="cuontryChange($event)" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('provinceName')" prop="provinceCode" >
              <el-select size="mini" v-model="formData.provinceCode">
                <el-option v-for="item in provinceOptions" :key="item.code" :label="item.chineseName" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="getZH('city')" prop="city">
              <el-input size="mini" v-model="formData.city" :placeholder="inputZH('city')" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item :label="getZH('address')" prop="address1">
              <el-input size="mini" v-model="formData.address1" :placeholder="inputZH('address')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="getZH('zipcode')" prop="zipcode"	>
              <el-input size='mini' v-model="formData.zipcode" :placeholder="inputZH('zipcode')" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="saveForm('formData')">{{ $t('common.saveBtn') }} </el-button>
        <el-button size="mini" @click="dialogVisible = false"> {{ $t('common.cancelBtn') }} </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { detailFBAWarehouseApi, saveFBAWarehouseApi } from '@/api/OverseasWarehouse/overseasManage.js'
import NationalGroupSelect from '../components/NationalGroupSelect'
import { getReginInfoApi } from '@/api/partner/member.js'
import getZHMixin from './components/getZHMixin'
import { validateZipCode } from '@/utils/validate'
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
	components: { NationalGroupSelect },
	data() {
		const defaultForm = {
			id: null,
			address1: null,
			city: null,
			code: null,
			countryCode: null,
			// name: null,
			provinceCode: null,
			zipcode: null
		}
		const validateZipCodeFn = (rule, value, callback) => {
			if (value && !validateZipCode(this.formData.countryCode, value)) {
				callback(new Error(this.getZH('zipcodeTips')))
			} else {
				callback()
			}
		}
		return {
			defaultForm,
			dialogVisible: false,
			isEdit: false,
			provinceOptions: [],
			loading: false,
			rules: {
				code: [{ required: true, message: this.inputZH('warehouseCode') }],
				countryCode: [{ required: true, message: this.inputZH('country') }],
				provinceCode: [{ required: true, message: this.inputZH('provinceName') }],
				city: [{ required: true, message: this.inputZH('city') }],
				address1: [{ required: true, message: this.inputZH('address') }],
				zipcode: [{ required: true, message: this.inputZH('zipcode') }, { validator: validateZipCodeFn }]
			},
			formData: this.$extends(true, {}, defaultForm)
		}
	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		visible(val) {
			if (val) {
				if (this.$isNotEmpty(this.id)) {
					this.getDetail()
				} else {
					this.formData = this.$extends(true, {}, this.defaultForm)
				}
			}
			this.dialogVisible = val
		}
	},
	methods: {

		/**
		 * 跟新状态
		 */
		async cuontryChange(val, init) {
			let data = {
				areaLevel: 1,
				countryCode: val
			}
			let res = await getReginInfoApi(data)
			if (res.ok) {
				this.provinceOptions = res.content.list || []
				if (!init) {
					this.formData.provinceCode = null
				}
			}
		},
		/**
		 * 获取详情
		 */
		async getDetail() {
			let res = await detailFBAWarehouseApi(this.id)
			if (res.ok) {
				if (this.$isNotEmpty(this.formData.countryCode)) {
					this.cuontryChange(this.formData.countryCode, true)
				}
				this.$copyProps(this.formData, res.content)
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
				saveFBAWarehouseApi(this.formData).then(res => {
					if (res.ok) {
						this.$message.success(this.getZH('saveSuccess', 'common'))
						this.$emit('saved')
						this.dialogVisible = false
					}
					this.loading = false
				})
			})
		}
	}

}
</script>

<style>
</style>
