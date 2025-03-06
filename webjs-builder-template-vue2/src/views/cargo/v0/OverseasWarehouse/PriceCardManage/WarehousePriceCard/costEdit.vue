<template>
  <div class="pd-16 min-width pageContent"  style="width:932px">
    <el-form ref="formData" :model="formData" label-width="110px" :rules="rules" size="mini" class="hack-form">
      <div class="flex-box">
        <div class="pd-16 content-title">{{$t('warehousePriceCard.base_info')}}</div>
      </div>
      <el-form-item :label="$t('warehousePriceCard.customer_name')" prop="customerId" v-if="formData.cardType == 13">
        <!-- <type-select v-model="formData.customerId" type="customer" @selected="setCustomerInfo" /> -->
        <MemberList v-model="formData.customerId"	@selected="setCustomerInfo"	clearable	/>
      </el-form-item>
      <el-form-item :label="$t('warehousePriceCard.price_card_name')" prop="priceCardName">
        <el-input v-model="formData.priceCardName" size="mini" :placeholder="$t('warehousePriceCard.please_enter_cost_price_card_name')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('warehousePriceCard.warehouse_name')" prop="warehouseId">
        <storageWarehouseSelect v-model="formData.warehouseId"  @selected="changeWarehouse" />
      </el-form-item>
      <el-form-item :label="$t('warehousePriceCard.type')" prop="cardType">
        <el-select v-model="formData.cardType" size="mini" :placeholder="$t('warehousePriceCard.please_select')" :disabled="formData.cardType === 13">
          <el-option v-for="(item, index) in priceCardTypes" :key="index" :label="item.name" :value="item.code"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('warehousePriceCard.currency')" prop="currencyCode">
        <el-select size="mini" v-model="formData.currencyCode" :placeholder="$t('warehousePriceCard.please_select_currency')">
          <el-option v-for="item in currenciesList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('warehousePriceCard.effective_time')" prop="validTimeRange">
        <!-- <CommonPicker v-model="formData.validTimeRange" pikcer-type="datetimerange" pickerFormat="yyyy-MM-dd HH:mm:ss" size="mini"/> -->
         <common-picker
          :useUTC="true"
          v-model="formData.validTimeRange"
          valueFormat="timestamp"
          size="mini"
          format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          :start-placeholder="$t('channelPriceCard.effective_start_time')"
          :end-placeholder="$t('channelPriceCard.effective_end_time')"
          class="w-full"
          :clearable="false"
          :default-time="['00:00:00', '23:59:59']"
        >
        </common-picker>
      </el-form-item>
      <el-form-item :label="$t('warehousePriceCard.unit_category_type')" prop="unitCategoryType">
        <el-select v-model="formData.unitCategoryType" :placeholder="$t('common.placeholder')" size="mini">
          <el-option :label="$t('common.unitCategoryType.METRIC')" :value="10"></el-option>
          <el-option :label="$t('common.unitCategoryType.IMPERIAL')" :value="11"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('channelPriceCard.meter_bubble_coefficient')" prop="meterBubbleCoefficient" v-if='showMeterBubbleCoefficient'>
        <el-input v-model="formData.meterBubbleCoefficient" size="mini" :placeholder="$t('channelPriceCard.please_enter_meter_bubble_coefficient')" />
      </el-form-item>
      <div style="clear: both;text-align: right;">
        <el-button size="mini" :loading="loading" type="primary" @click="confirmFn">{{$t('warehousePriceCard.confirm')}}</el-button>
        <el-button size="mini" :loading="loading" @click="resetForm">{{$t('warehousePriceCard.reset')}}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getCurrenciesListApi } from '@/api/common'
import { getWarehouseSelectionsApi, priceCardsBaseInfoApi, checkCardNameExists, getWarehouseTempTypeApi } from '@/api/OverseasWarehouse/warehousePriceCard'
import { priceCardTypes, priceCardCustomerTypes } from "@/utils/constant"
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'

import storageWarehouseSelect from '../../components/storageWarehouseSelect'
export default {
	name: 'WarehousePriceCardCostEdit',
	components: { cargoLimitedSelect, storageWarehouseSelect },
	data() {
		const validateName = (rule, value, callback) => {
			if (!value) {
				callback(this.$t('warehousePriceCard.please_enter_cost_price_card_name'))
			} else {
				checkCardNameExists({ priceCardName: value, cardType: Number(this.$route.query.priceCardType) || 10 }).then(res => {
					if (res.ok && res.content) {
						// 卡名称在(priceCardTypeName)中已存在
						let name = this.$t('warehousePriceCard.price_card_in') + res.content.priceCardTypeName + this.$t('warehousePriceCard.price_card_already_exist')
						callback(name)
					} else {
						callback()
					}
				})
			}
		}
		return {
			priceCardTypes: [],
			loading: false,
			showMeterBubbleCoefficient: false, // 是否需要维护计泡系数
			formData: {
				customerName: '',
				customerId: '',
				validTimeRange: [],
				priceCardName: '',
				warehouseId: '',
				supplierId: '',
				supplierName: '',
				cardType: '',
				unitCategoryType: '',
				currencyCode: '',
				currencyName: '',
				expiryDateStart: '',
				expiryDateEnd: '',
				warehouseCode: '',
				countryName: '',
				warehouseName: '',
				meterBubbleCoefficient: ''
			},
			activeName: '',
			currenciesList: [],
			warehouseIdList: [],
			productList: [],
			rules: {
				customerId: [{ required: true, message: this.$t('warehousePriceCard.please_select_customer_name') }],
				priceCardName: [{ required: true, validator: validateName, trigger: 'blur' }],
				cardType: [{ required: true, message: this.$t('warehousePriceCard.please_select') }],
				warehouseId: [{ required: true, message: this.$t('warehousePriceCard.please_select_warehouse_name') }],
				validTimeRange: [{ required: true, message: this.$t('warehousePriceCard.please_select_effective_time') }],
				unitCategoryType: [{ required: true, message: this.$t('warehousePriceCard.please_select_unit_category_type') }],
				currencyCode: [{ required: true, message: this.$t('warehousePriceCard.please_select_currency') }],
				meterBubbleCoefficient: [{ required: true, message: this.$t('channelPriceCard.please_enter_meter_bubble_coefficient') }, { validator: this.$validators.isNumber }]
			}

		}
	},
	created() {
		let cardType = Number(this.$route.query.priceCardType)
		if (cardType === 13) {
			this.priceCardTypes = priceCardTypes.concat(priceCardCustomerTypes)
			this.formData.cardType = Number(cardType)
		} else {
			this.priceCardTypes = priceCardTypes
		}
		this.init()
	},
	methods: {
		setCustomerInfo(customer) {
			this.formData.customerId = customer.id
			this.formData.customerName = customer.chineseName
		},
		changeWarehouse(item) {
			if (this.$isEmpty(item)) {
				return
			}
			this.formData.warehouseCode = item.warehouseCode
			this.formData.warehouseName = item.name
			this.formData.supplierId = item.supplierId
			this.formData.supplierName = item.supplierName
			this.formData.countryName = item.countryName
			this.formData.countryCode = item.countryCode
			this.formData.warehouseId = item.id
			this.getWarehouseTempType(item.id)
		},
		init() {
			getCurrenciesListApi().then(res => {
				if (res.ok) {
					this.currenciesList = res.content || []
				}
			})

			getWarehouseSelectionsApi().then(res => {
				if (res.ok) {
					this.warehouseIdList = res.content || []
				}
			})
		},
		// 判断仓库是否需要维护计泡系数
		async getWarehouseTempType(id) {
			let res = await getWarehouseTempTypeApi(id)
			if (res.ok) {
				this.showMeterBubbleCoefficient = res.content || false
			}
		},
		confirmFn() {
			this.$refs.formData.validate(valid => {
				if (valid) {
					let i = this.currenciesList.findIndex(item => item.code === this.formData.currencyCode)
					this.formData.currencyName = this.currenciesList[i].name
					this.formData.expiryDateStart = this.formData.validTimeRange[0]
					this.formData.expiryDateEnd = this.formData.validTimeRange[1]
					this.loading = true
					let cardType = this.formData.cardType
					priceCardsBaseInfoApi(this.formData).then(res => {
						this.loading = false
						if (res.ok) {
							this.resetForm()
							this.$store.dispatch('tagsView/delView', this.$route)
							this.$router.push({ name: 'WarehousePriceCardEdit', query: { id: res.content, operateCode: 'ADD', priceCardType: cardType } })
						}
					}).catch(() => {
						this.loading = false
					})
				}
			})
		},
		resetForm() {
			this.$refs.formData.resetFields()
		},
		backList() {
			this.$store.dispatch('tagsView/delView', this.$route)
			this.$router.push({ name: 'WarehousePriceCardList' })
		}
	}
}
</script>

<style scoped lang="less">
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
</style>
