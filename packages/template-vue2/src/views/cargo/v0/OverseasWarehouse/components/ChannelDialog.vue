<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="1200px" :close-on-click-modal="false">
      <div class="dialog-content">
        <el-form v-if="dialogVisible" ref="formData" v-loading="loading" label-width="100px" label-position="left" :rules="rules" :model="formData">
          <div class="content-title mb-20">{{$t('channel.base_info')}}</div>
          <el-row :gutter="20">
            <el-col :span='12'>
             <el-form-item :label="$t('channel.channel_code')" prop="channelCode">
                <el-input v-model="formData.channelCode" :placeholder="$t('channel.please_enter_channel_code')" size="mini" :disabled="$isNotEmpty(id)" />
            </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item :label="$t('channel.channel_name')" prop="channelName">
                <el-input v-model="formData.channelName" size="mini" :placeholder="$t('channel.please_enter_channel_name')" :disabled="$isNotEmpty(id)" />
              </el-form-item>
            </el-col>
            <el-col :span='12'>
             <el-form-item :label="$t('channel.supplier')" prop="supplierId" :placeholder="$t('channel.please_select_supplier')">
               <type-select v-model="formData.supplierId" type="supplier" @selected="supplierSelected"  :disabled="$isNotEmpty(id)" :defaultDisplay="formData.supplierName" :requestParams="{businessType: 'OVERSEAS_WAREHOUSE'}"></type-select>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item :label="$t('channel.product_code')" prop="productCode">
                <type-select v-model="formData.productCode" type="ovlProduct"  @selected="productChange" :disabled="$isNotEmpty(id)" />
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item :label="$t('channel.supplierChannelCode')" >
                <el-input v-model.trim="formData.supplierChannelCode" size="mini" :placeholder="$t('channel.please_enter_supplier_channel_code')" :disabled="type==1" />
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="$isEmpty(id) && $isNotEmpty(formData.productCode)">
            <peakSeasonTimeEditPrice :data="formData"  />
          </div>
      </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="type!=1" type="primary" size="mini" :disabled="loading" @click="saveForm('formData')"> {{$t('channel.confirm')}} </el-button>
        <el-button size="mini" @click="dialogVisible = false"> {{$t('channel.cancel')}} </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { validEnglishNumbers } from '@/utils/validate'
import { getChannelDetailApi, saveChannelApi } from '@/api/OverseasWarehouse/overseasWarehouseManager'
import peakSeasonTimeEditPrice from './peakSeasonTimeEditPrice.vue'
export default {
	name: 'ChannelDialog',
	components: { peakSeasonTimeEditPrice },
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		id: [String, Number],
		type: [String, Number]
	},
	data() {
		const defaultForm = {
			id: null,
			channelCode: '',
			channelName: '',
			supplierId: '',
			supplierName: '',
			productCode: '',
			productName: '',
			supplierChannelCode: '',
			ediMappingId: null
		}
		return {
			dialogVisible: false,
			defaultForm: defaultForm,
			loading: false,
			title: '',
			rules: {
				channelCode: [{ required: true, message: this.$t('channel.please_enter_channel_code'), trigger: 'change' }, { validator: validEnglishNumbers }],
				supplierId: [{ required: true, message: this.$t('channel.please_select_supplier'), trigger: 'change' }],
				productCode: [{ required: true, message: this.$t('channel.please_select_product_code'), trigger: 'change' }],
				channelName: [{ required: true, message: this.$t('channel.please_enter_channel_name'), trigger: 'change' }]
			},
			formData: this.$extends({}, defaultForm)
		}
	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		async visible(val) {
			if (val) {
				this.loading = true
				if (this.$isNotEmpty(this.id)) {
					this.title = this.type === 1 ? this.$t('channel.channel_detail') : this.$t('channel.edit_channel')
					await this.$nextTick()
					const res = await getChannelDetailApi(this.id)
					if (res.ok) {
						this.$copyProps(this.formData, res.content)
					}
				} else {
					this.tempList = []
					this.title = this.$t('channel.add_channel')
					this.formData = this.$extends({}, this.defaultForm)
				}
			}
			await this.$nextTick()
			this.loading = false
			this.dialogVisible = val
		}
	},
	methods: {
		/**
		 * 保存数据
		 */
		saveForm(refName) {
			this.$refs[refName].validate(valid => {
				if (valid) {
					this.loading = true
					let saveForm = this.$extends(true, {}, this.formData)
					console.log(saveForm);
					// peakSeasonTimeList
					let peakSeasonTimeList = []
					if (this.$isNotEmpty(saveForm.peakSeasonTimeChargeDetailDTOList)) {
						saveForm.peakSeasonTimeChargeDetailDTOList.forEach(item => {
							if (this.$isNotEmpty(item.peakSeasonTimeList)) {
								item.peakSeasonTimeList.forEach(data => {
									peakSeasonTimeList.push({
										id: data.id,
										costPrice: data.costPrice,
										currencyCode: data.currencyCode,
										currencyName: data.currencyName
									})
								})
							}
						})
					}
					this.$set(saveForm, 'peakSeasonTimeList', peakSeasonTimeList)
					delete saveForm.peakSeasonTimeChargeDetailDTOList
					saveChannelApi(saveForm, saveForm.id).then(res => {
						if (res.ok) {
							this.loading = false
							this.$message.success(this.$t('TipsMessage.saveMessage'))
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
		},
		supplierSelected(data) {
			this.formData.supplierName = data.supplierName
		},
		/**
		 * 物流产品变更
		 */
		productChange(data) {
			this.formData.productCode = data.productCode
			this.formData.productName = data.productName
		}
	}

}
</script>

<style>
</style>
