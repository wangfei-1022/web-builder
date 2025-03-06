<template>
  <div class="page-edit-container" v-loading="loading">
    <div class="page-edit-content">
      <el-form ref="formData" :model="formData" label-width="110px" :rules="rules">
        <div class="flex-box">
          <div class="content-title">{{$t('warehousePriceCard.base_info')}}</div>
        </div>
        <el-form-item :label="$t('warehousePriceCard.customer_name')" v-if="formData.priceCardType == 13">
          <el-input v-model="formData.customerName" size="mini" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('warehousePriceCard.price_card_name')">
          <el-input v-model="formData.priceCardName" size="mini" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('channelPriceCard.price_card_code')">
          <span >{{ formData.priceCardNo }}</span>
        </el-form-item>
        <el-form-item :label="$t('warehousePriceCard.warehouse_name')">
          <el-input v-model="formData.warehouseName" size="mini" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('warehousePriceCard.price_card_type')">
          <el-input v-model="formData.priceCardTypeName" size="mini" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('warehousePriceCard.currency')">
          <el-input v-model="formData.currencyName" size="mini" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('warehousePriceCard.effective_time')" prop="validTimeRange">
          <common-picker
            v-model="formData.validTimeRange"
            :useUTC="true"
            valueFormat="timestamp"
            format="yyyy-MM-dd HH:mm:ss"
            size="mini"
            type="datetimerange"
            :start-placeholder="$t('channelPriceCard.effective_start_time')"
            :end-placeholder="$t('channelPriceCard.effective_end_time')"
            class="w-full"
            :clearable="false"
            :default-time="['00:00:00', '23:59:59']"
          >
          </common-picker>
          <!-- <CommonPicker
            v-model="formData.validTimeRange"
            pikcer-type="datetimerange"
            pickerFormat="yyyy-MM-dd HH:mm:ss"
            size="mini"
          /> -->
          <div class="tips-warning" v-if="beyondTips">
            <span class="el-icon-warning fc-yellow"></span>
            {{$t('warehousePriceCard.effective_time_tips')}}
          </div>
        </el-form-item>
        <el-form-item :label="$t('warehousePriceCard.unit_category_type')">
          <el-select v-model="formData.unitCategoryType" :placeholder="$t('common.placeholder')" size="mini" disabled>
            <el-option :label="$t('common.unitCategoryType.METRIC')" :value="10"></el-option>
            <el-option :label="$t('common.unitCategoryType.IMPERIAL')" :value="11"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('channelPriceCard.meter_bubble_coefficient')" prop="meterBubbleCoefficient" v-if='formData.showMeterBubbleCoefficient'>
          <el-input v-model="formData.meterBubbleCoefficient" size="mini" :placeholder="$t('channelPriceCard.please_enter_meter_bubble_coefficient')" />
        </el-form-item>
        <div class="tab-container-wrap">
          <el-tabs style="width: 100%" v-model="activeName">
            <el-tab-pane v-for="(item, index) in formData.chargeTypeList" :key="index" :label="item.chargeTypeName" :name="item.id">
              <el-form-item v-if="item.chargeType === 11" :label="$t('warehousePriceCard.minCalculateQuantity')" :prop="`chargeTypeList[${index}].minCalculateQuantity`" :rules="[{ required: true, message: $t('warehousePriceCard.please_enter_min_calculateQuantity') }]">
                <el-input v-model="item.minCalculateQuantity" size="mini" :placeholder="$t('common.placeholder')">
                  <template slot="append">{{formData.unitCategoryType === 10 ? $t('warehousePriceCard.cubicMeter') : $t('warehousePriceCard.cubicFoot') }}</template>
                </el-input>
              </el-form-item>
              <charge-table :chargeTypeItem="item" :priceCardType="formData.priceCardType" @update="updateCharge"></charge-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-form>
    </div>
    <div class="page-edit-footer">
      <el-button size="mini" @click="backList()">{{$t('warehousePriceCard.cancel')}}</el-button>
      <el-button size="mini" :loading="draftLoading" @click="saveDraft()" v-if="formData.status != 33">{{$t('warehousePriceCard.save_draft')}}</el-button>
      <el-button size="mini" :loading="submitLoading" type="primary" @click="submitForm('formData')">{{$t('warehousePriceCard.submit')}}</el-button>
    </div>
  </div>

</template>

<script>
import ChargeTable from './components/chargeTable'
import {
	getWarehouseCostPriceCardsDetailApi,
	getWarehouseNotCostPriceCardsDetailApi,
	getWarehouseCustomerPriceCardsDetailApi,

	updateDraftCostPriceCardsBaseInfoApi,
	updateDraftNotCostPriceCardsBaseInfoApi,
	updateDraftCustomerPriceCardsBaseInfoApi,

	updateSubmitCostPriceCardsBaseInfoApi,
	updateSubmitNotCostPriceCardsBaseInfoApi,
	updateSubmitCustomerPriceCardsBaseInfoApi
} from '@/api/OverseasWarehouse/warehousePriceCard'

export default {
	name: 'ChannelPriceCardDetail',
	components: {
		ChargeTable
	},
	data() {
		return {
			loading: false,
			draftLoading: false,
			submitLoading: false,
			formData: {
				priceCardName: '',
				warehouseName: '',
				priceCardType: '',
				priceCardTypeName: '',
				validTimeRange: [],
				currencyName: '',
				unitCategoryType: '',
				chargeTypeList: [],
				priceCardNo: null,
				meterBubbleCoefficient: null,
				showMeterBubbleCoefficient: false
			},
			activeName: '',
			currenciesList: [],
			productList: [],
			rules: {
				priceCardName: [{ required: true, message: this.$t('warehousePriceCard.please_enter_price_card_name') }],
				warehouseId: [{ required: true, message: this.$t('warehousePriceCard.please_select_warehouse_name') }],
				validTimeRange: [{ required: true, message: this.$t('warehousePriceCard.please_select_effective_time') }],
				unitCategoryType: [{ required: true, message: this.$t('warehousePriceCard.please_select_unit_category_type') }],
				currencyCode: [{ required: true, message: this.$t('warehousePriceCard.please_select_currency') }],
				meterBubbleCoefficient: [{ required: true, message: this.$t('channelPriceCard.please_enter_meter_bubble_coefficient') }, { validator: this.$validators.isNumber }]
			}

		}
	},
	created() {
		this.id = this.$route.query.id
		this.priceCardType = Number(this.$route.query.priceCardType)
		this.operateCode = this.$route.query.operateCode
		this.getDetail()
	},
	computed: {
		beyondTips() {
			if (this.$isEmpty(this.formData.validTimeRange)) {
				return false
			}
			if (this.formData.costPriceCardExpiryDateStart && this.formData.costPriceCardExpiryDateEnd) {
				return Number(this.formData.validTimeRange[0]) < Number(this.formData.costPriceCardExpiryDateStart) || Number(this.formData.validTimeRange[1]) > Number(this.formData.costPriceCardExpiryDateEnd)
			}
			return false
		}
	},
	methods: {
		/**
		 * 获取模板详情
		 */
		async getDetail() {
			let fn = null
			if (this.priceCardType === 10) {
				fn = getWarehouseCostPriceCardsDetailApi
			} else if (this.priceCardType === 11 || this.priceCardType === 12) {
				fn = getWarehouseNotCostPriceCardsDetailApi
			} else if (this.priceCardType === 13) {
				fn = getWarehouseCustomerPriceCardsDetailApi
			}
			if (!fn) {
				this.$message.warning(this.$t('warehousePriceCard.exception_info'))
				return
			}
			this.loading = true
			let res = await fn(this.id).catch(() => {
				this.loading = false
			})
			if (res.ok) {
				if (!res.content) {
					this.$message.warning(this.$t('warehousePriceCard.exception_data'))
					return
				}
				this.loading = false
				res.content.validTimeRange = [res.content.expiryDateStart, res.content.expiryDateEnd]
				this.formData = res.content
				this.activeName = res.content.chargeTypeList[0].id
			}
		},
		updateCharge(chargeType, data) {
			this.formData.chargeTypeList.forEach((item, index) => {
				if (item.chargeType === chargeType) {
					data.forEach(function (x, index) {
						x.serial = index + 1
					})
					item.chargeItemDetailDTOList = data
				}
			})
		},
		/**
 * 保存接口
 */
		submitForm(refName) {
			this.$refs[refName].validate(valid => {
				if (valid) {
					this.saveForm()
				} else {
					let emptyData = this.formData.chargeTypeList.find(item => item.chargeType === 11)
					if (emptyData && this.$isEmpty(emptyData.minCalculateQuantity)) {
						this.activeName = emptyData.id
					}
					this.mixinsFormScrollIntoView()
					return false
				}
			})
		},
		saveForm() {
			let flag = false
			let list = this.formData.chargeTypeList
			let errName = null
			let chargeTypeName = null
			list.forEach(item => {
				let costPriceItem = item.chargeItemDetailDTOList.find(costData => this.$isEmpty(costData.costPrice))
				if (this.$isNotEmpty(costPriceItem)) {
					chargeTypeName = item.chargeTypeName
					errName = costPriceItem.chargeItemName
					flag = true
				}
			})
			if (flag) {
				this.$message.error('请维护' + chargeTypeName + '中' + errName + '的价格')
				return
			}
			this.submitLoading = true
			this.formData.expiryDateStart = this.formData.validTimeRange[0]
			this.formData.expiryDateEnd = this.formData.validTimeRange[1]

			let fn = updateSubmitCostPriceCardsBaseInfoApi
			if (this.priceCardType === 11 || this.priceCardType === 12) {
				fn = updateSubmitNotCostPriceCardsBaseInfoApi
			} else if (this.priceCardType === 13) {
				fn = updateSubmitCustomerPriceCardsBaseInfoApi
			}
			fn(this.formData).then(res => {
				this.submitLoading = false
				if (res && res.ok) {
					this.back()
					this.$message.success(this.$t('warehousePriceCard.submit_success'))
				}
			})
		},
		saveDraft() {
			this.draftLoading = true
			this.formData.expiryDateStart = this.formData.validTimeRange[0]
			this.formData.expiryDateEnd = this.formData.validTimeRange[1]
			let fn = updateDraftCostPriceCardsBaseInfoApi
			if (this.priceCardType === 11 || this.priceCardType === 12) {
				fn = updateDraftNotCostPriceCardsBaseInfoApi
			} else if (this.priceCardType === 13) {
				fn = updateDraftCustomerPriceCardsBaseInfoApi
			}
			fn(this.formData).then(res => {
				this.draftLoading = false
				if (res && res.ok) {
					this.back()
					this.$message.success(this.$t('warehousePriceCard.save_draft_success'))
				}
			})
		},
		resetForm() {
			this.$refs.formData.resetFields()
		},
		back() {
			this.$store.dispatch('tagsView/delView', this.$route)
			let name = 'WarehousePriceCardList'
			if (this.formData.priceCardType === 13) {
				name = 'WarehouseCustomerPriceCardList'
			}
			this.$router.push({ name: name })
		},
		backList() {
			let ms = ''
			if (this.operateCode === 'ADD') {
				ms = this.formData.priceCardName + this.$t('warehousePriceCard.save_draft_info_mention')
			} else {
				ms = this.$t('warehousePriceCard.un_save_info_mention')
			}
			this.$confirm(ms, {
				confirmButtonText: this.$t('warehousePriceCard.confirm'),
				cancelButtonText: this.$t('warehousePriceCard.cancel'),
				type: 'warning'
			}).then(() => {
				this.back()
			}).catch(() => {
			})
		}
	}
}
</script>

<style scoped lang="less">
.page-edit-container {
	background: #fff;
}
.el-form-item {
	margin-bottom: 22px;
	width: 450px;
	float: left;
}
.tab-container-wrap {
	clear: both;
}
.el-select {
	width: 100%;
}

::v-deep .el-form-item--medium .el-form-item__label {
	line-height: 37px;
}
.tips-warning {
	position: relative;
	font-size: 12px;
	color: #f78989;
}
</style>
