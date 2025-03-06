<template>
	<div class="page-edit-container bg-white full-page">
		<div class="page-edit-content">
			<el-form
				ref="formData"
				:model="formData"
				label-width="110px"
				:rules="rules"
				v-loading="loading"
			>
				<div class="flex-box">
					<div class="pd-16 content-title">{{$t('channelPriceCard.base_info')}}</div>
					<span class="sub-title">
						<span class="el-icon-info fc-blue fs-14"></span>
						{{$t('channelPriceCard.by_cost_price_card')}}{{ formData.costPriceCardName }}{{$t('channelPriceCard.pre_load')}}

						<el-tooltip placement="top">
							<div slot="content">
								<span>
                  {{$moment(parseInt(formData.costPriceCardExpiryDateStart, 10)).utc().format("YYYY-MM-DD HH:mm:ss")}}
								</span>
								{{$t('channelPriceCard.to')}}
								<span>
                  {{$moment(parseInt(formData.costPriceCardExpiryDateEnd, 10)).utc().format("YYYY-MM-DD HH:mm:ss")}}
								</span>
							</div>
							<span class="ml-10 fc-blue pointer">{{$t('channelPriceCard.show_cost_price_card_effective_time')}}</span>
						</el-tooltip>
					</span>
				</div>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item :label="$t('channelPriceCard.price_card_name')">
							<span>{{ formData.priceCardName }}</span>
						</el-form-item>
					</el-col>
          <el-col :span="12">
						<el-form-item :label="$t('channelPriceCard.price_card_code')" >
							<span >{{ formData.priceCardNo }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item :label="$t('channelPriceCard.product_code')">
							<span>{{ formData.productName }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="!isMember">
						<el-form-item :label="$t('channelPriceCard.channel')">
							<span>{{ formData.channelName }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="isMember">
						<el-form-item :label="$t('channelPriceCard.customer_name')">
							<span>{{ formData.customerName }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item :label="$t('channelPriceCard.currency')">
							<span>{{ formData.currencyName }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item :label="$t('channelPriceCard.price_card_type')">
							<span>{{ formData.priceCardTypeName }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item :label="$t('channelPriceCard.weight_unit')">
							<span>{{ formData.unitCategoryTypeName }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="formData.productType == 1">
            <el-row :gutter="10">
              <el-col :span="10">
                <el-form-item :label="$t('channelPriceCard.meter_bubble_coefficient')" prop="meterBubbleCoefficient">
                  <el-input  v-if="type == 0"	v-model="formData.meterBubbleCoefficient" size="mini" :placeholder="$t('channelPriceCard.please_enter_meter_bubble_coefficient')"/>
                  <span v-else>{{ $isNotEmpty(formData.meterBubbleCoefficient)?formData.meterBubbleCoefficient:'-' }}</span>
                  <span class="tips-warning" v-if='showCoefficientTips'>{{$t('channelPriceCard.meterBubbleCoefficientTips') }}</span>
              </el-form-item>
              </el-col>
              <el-col :span="14">
                <BubbleCountingCondition :isEdit="type == 0" :unitCategoryType="formData.unitCategoryType" :data="formData.bubbleConditionMap" />
              </el-col>
            </el-row>

					</el-col>
					<el-col :span="12" v-if="formData.productType == 2">
						<el-form-item :label="$t('channelPriceCard.dest_warehouse_type')">
							<span>{{ formData.destWarehouseTypeName }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item :label="$t('channelPriceCard.effective_time')" prop="validTimeRange" class="relative">
              <common-picker
                v-if="type == 0"
                :useUTC="true"
                format="yyyy-MM-dd HH:mm:ss"
                v-model="formData.validTimeRange"
                valueFormat="timestamp"
                size="mini"
                type="datetimerange"
                :start-placeholder="$t('channelPriceCard.effective_start_time')"
                :end-placeholder="$t('channelPriceCard.effective_end_time')"
                class="w-full"
                :clearable="false"
                :default-time="['00:00:00', '23:59:59']"
                @change="dateTimeChange">
              </common-picker>
							<span v-else>
								{{$moment(parseInt(formData.expiryDateStart, 10)).utc().format("YYYY-MM-DD HH:mm:ss")}}{{$t('channelPriceCard.to')}}
								{{$moment(parseInt(formData.expiryDateEnd, 10)).utc().format("YYYY-MM-DD HH:mm:ss")}}
							</span>
							<div class="tips-warning" v-if="beyondTips">
								<span class="el-icon-warning fc-yellow"></span>
                {{$t('channelPriceCard.effective_time_tips')}}
							</div>
						</el-form-item>
					</el-col>
				</el-row>
				<div v-if="formData.id">
					<FuelRateDetail :dataList="formData.fuelRateDTOList" />
					<div v-if="formData.productType == 1">
						<div class="pd-16 content-title">{{$t('channelPriceCard.charge')}}</div>
						<el-tabs v-model="activeTabName" style="width: 100%">
							<el-tab-pane
								:label="$t('channelPriceCard.delivery_charge')"
								name="ProductDeliveryFee"
							></el-tab-pane>
							<el-tab-pane
								v-for="(item, index) in formData.chargeTypeList"
								:key="index"
								:label="item.labelName"
								:name="tabsMapKey[index + 2]"
							></el-tab-pane>
						</el-tabs>
						<!--动态组件-->
						<component
							:is="activeTabName"
							:productId="formData.productId"
							:productType="formData.productType"
							:isBaseCard="false"
							:refreshThePriceCard="refreshThePriceCard"
							:type="type"
              :formData="formData"
							:data="
								activeTabName == 'ProductDeliveryFee'
									? formData.chargeTypeForDeliveryChargeDTO
									: formData.chargeTypeList[nameMapKey[activeTabName]]
							"
						>
						</component>
					</div>
					<!-- 卡车 -->
					<!-- v-if="formData.productType == '2'" -->
					<div v-else>
						<div class="pd-16 content-title">{{$t('channelPriceCard.charge')}}</div>
						<ProductDeliveryFee
							:productType="formData.productType"
							:type="type"
							:productId="formData.productId"
							:data="formData"
              :formData="formData"
							:refreshThePriceCard="refreshThePriceCard"
						/>
					</div>
				</div>
			</el-form>
		</div>
    <div class="page-edit-footer">
        <el-button size="mini" :loading="loading" @click="backList()">
          {{$t('channelPriceCard.cancel')}}
        </el-button>
        <el-button
          size="mini"
          :loading="loading"
          @click="refreshThePriceCard('formData', 1)"
          v-if="type == 0 && formData.status != 33"
        >
          {{$t('channelPriceCard.save_draft')}}
        </el-button>
        <el-button
          size="mini"
          :loading="loading"
          type="primary"
          @click="refreshThePriceCard('formData', 2)"
          v-if="type == 0"
        >
          {{$t('channelPriceCard.submit')}}
        </el-button>
    </div>
	</div>
</template>

<script>
import ProductDeliveryFee from '../components/ProductDeliveryFee.vue'
import ExpenseStatement from '../components/ExpenseStatement.vue'
import PeakSeasonExpenses from '../components/PeakSeasonExpenses.vue'
import FuelRateDetail from '../components/FuelRateDetail.vue'
import BubbleCountingCondition from './components/BubbleCountingCondition.vue'
import { detailPriceCardsApi, detailTruckPriceCardsOfCustomer, detailPriceCardsOfCustomer, saveDraftPriceCardsApi, saveDraftTruckPriceCardsApi, submitPriceCardsApi, submitTruckPriceCardsApi, deliveryChargesWithCoefficientApi, deliveryTruckChargesWithCoefficientApi, saveDraftPriceCardsOfCustomer, saveDraftTruckPriceCardsOfCustomer, submitPriceCardsOfCustomer, submitTruckPriceCardsOfCustomer, detailtruckNotCostCardsApi, getPssAndFuelApi } from '@/api/OverseasWarehouse/PriceCardManage.js'
export default {
	name: 'ChannelPriceCardDetail',
	props: {
		// 是否为客户价卡
		isMember: {
			type: Boolean,
			default: false
		},
		productType: Number
	},
	components: { ProductDeliveryFee, FuelRateDetail, ExpenseStatement, PeakSeasonExpenses, BubbleCountingCondition },
	data() {
		return {
			loading: false,
			type: 0,
			tabsMapKey: {
				1: 'ProductDeliveryFee',
				2: 'ExpenseStatement',
				3: 'PeakSeasonExpenses'
			},
			nameMapKey: {
				'ProductDeliveryFee': 2,
				'ExpenseStatement': 0,
				'PeakSeasonExpenses': 1
			},
			datePickerOptions: {
				disabledDate: time => time.getTime() < new Date().getTime() - 24 * 60 * 60 * 1000
			},
			activeTabName: 'ProductDeliveryFee',
			formData: {},
			peakSeasonData: {},
			channelList: [],
			currenciesList: [],
			productList: [],
			isEdit: false,
			originMeterBubbleCoefficient: null,
			rules: {
				priceCardName: [{ required: true, message: this.$t('channelPriceCard.please_enter_price_card_name_desc') }],
				productId: [{ required: true, message: this.$t('channelPriceCard.please_select_product_code') }],
				channelId: [{ required: true, message: this.$t('channelPriceCard.please_select_channel') }],
				validTimeRange: [{ required: true, message: this.$t('channelPriceCard.please_select_effective_time') }],
				unitType: [{ required: true, message: this.$t('channelPriceCard.please_select_unit_category_type') }],
				currencyCode: [{ required: true, message: this.$t('channelPriceCard.please_select_currency') }],
				meterBubbleCoefficient: [{ required: true, message: this.$t('channelPriceCard.please_enter_meter_bubble_coefficient') }, { validator: this.$validators.isNumber }]
			}
		}
	},
	created() {
		this.type = this.$route.query.type || '0'
		this.isEdit = Number(this.$route.query.edit) === 1
		this.getDetail(this.$route.query.id)
	},
	computed: {
		beyondTips() {
			if (this.$isEmpty(this.formData.validTimeRange)) {
				return false
			}
			return Number(this.formData.validTimeRange[0]) < Number(this.formData.costPriceCardExpiryDateStart) || Number(this.formData.validTimeRange[1]) > Number(this.formData.costPriceCardExpiryDateEnd)
		},
		showCoefficientTips() {
			return Number(this.originMeterBubbleCoefficient) < Number(this.formData.meterBubbleCoefficient)
		}
	},
	methods: {
		/**
		 * 获取模板详情
		 */
		async getDetail(id) {
			this.loading = true
			let fn = this.isMember ? this.productType === 1 ? detailPriceCardsOfCustomer : detailTruckPriceCardsOfCustomer : Number(this.$route.query.productType) === 1 ? detailPriceCardsApi : detailtruckNotCostCardsApi
			let res = await fn(id).catch(() => {
				this.loading = false
			})
			if (res.ok && res.content) {
				this.loading = false
				if (res.content.productType === 1) {
					// 处理计泡条件
					let bubbleConditionMap = {
						checked: false,
						volume: null
					}
					if (res.content.bubbleConditionJson) {
						let bubbleConditionJson = JSON.parse(res.content.bubbleConditionJson)
						if (this.$isNotEmpty(bubbleConditionJson.volume)) {
							bubbleConditionMap = {
								checked: true,
								volume: bubbleConditionJson.volume
							}
						}
					}
					res.content.bubbleConditionMap = bubbleConditionMap
					// 缓存旺季附加费数据
					if (this.$isNotEmpty(res.content.chargeTypeList) && res.content.chargeTypeList.length === 2) {
						this.peakSeasonData = this.$extends(true, {}, res.content.chargeTypeList[1])
					} else {
						this.peakSeasonData = {
							chargeItemDetailDTOList: [],
							labelName: this.$t('channelPriceCard.peak_season_surcharge'),
							newAdjustmentCoefficient: 1
						}
					}
				}
				res.content.validTimeRange = [Number(res.content.expiryDateStart), Number(res.content.expiryDateEnd)]
				// 将度量单位赋值到派送费上
				if (res.content.chargeTypeForDeliveryChargeDTO) {
					res.content.chargeTypeForDeliveryChargeDTO.unitCategoryType = res.content.unitCategoryType
				}
				// 处理起始仓库和结束仓库
				if (this.$isNotEmpty(res.content.chargeTypeCoefficientDTOList)) {
					res.content.chargeTypeCoefficientDTOList.forEach(item => {
						item.startWarehouseId = this.$isNotEmpty(item.startWarehouseIdList) ? item.startWarehouseIdList[0] : null
						item.endWarehouseId = this.$isNotEmpty(item.endWarehouseIdList) ? item.endWarehouseIdList[0] : null
					})
				}
				// 保留成本价卡计泡系数
				this.originMeterBubbleCoefficient = res.content.costPriceCardMeterBubbleCoefficient || 0
				this.formData = res.content
			} else {
				this.loading = false
			}
		},
		/**
		 *
		 * 选择币种
		 */
		refreshThePriceCard(refName, type) {
			this.$refs[refName].validate(valid => {
				if (!valid) {
					this.mixinsFormScrollIntoView()
					return false
				}
				this.loading = true
				let fn = this.formData.productType === 1 ? deliveryChargesWithCoefficientApi : deliveryTruckChargesWithCoefficientApi
				let saveForm = null
				if (this.formData.productType === 1) {
					saveForm = this.$extends(true, {}, this.formData.chargeTypeForDeliveryChargeDTO)
					delete saveForm.chargeDetailForDeliveryChargeDTOList
				} else {
					let chargeTypeCoefficientDTOList = this.$extends(true, [], this.formData.chargeTypeCoefficientDTOList)
					chargeTypeCoefficientDTOList.forEach(item => {
						item.endWarehouseIdList = item.endWarehouseId ? [item.endWarehouseId] : null
						item.startWarehouseIdList = item.startWarehouseId ? [item.startWarehouseId] : null
					})
					saveForm = {
						minAmount: this.formData.minAmount,
						chargeTypeCoefficientDTOList: chargeTypeCoefficientDTOList
					}
				}
				fn(saveForm, this.formData.associatedPriceCardId, this.formData.priceCardType).then(res => {
					if (res.ok) {
						if (this.formData.productType === 1) {
							this.formData.chargeTypeForDeliveryChargeDTO.chargeDetailForDeliveryChargeDTOList = res.content[0].chargeDetailForDeliveryChargeDTOList
						} else {
							this.formData.warehouseTruckChargeDetailList = res.content || []
						}
						if (type === 1) {
							// 保存草稿
							this.saveDraft()
						} else if (type === 2) {
							// 提交
							this.submit()
						}

						this.loading = false
					} else {
						this.loading = false
					}
				}).catch(() => {
					this.loading = false
					return false
				})
			})
		},
		/**
		 *
		 * 有效期变更
		 */

		async dateTimeChange(val) {
			if (this.formData.productType === 1) {
				if (this.$isNotEmpty(val)) {
					let data = {
						productId: this.formData.productId,
						startTime: val[0],
						channelCode: this.formData.channelCode,
						endTime: val[1]
					}
					this.loading = true
					let res = await getPssAndFuelApi(data)
					if (res.ok) {
						this.formData.fuelRateDTOList = res.content.fuelRateDTOList || []

						let pssChargeType = res.content.pssChargeType || {}
						if (this.$isNotEmpty(pssChargeType)) {
							let dataItem = this.$extends(true, {}, this.peakSeasonData)
							dataItem.chargeItemDetailDTOList = pssChargeType
							this.formData.chargeTypeList.splice(1, 1, dataItem)
						} else {
							this.formData.chargeTypeList.splice(1, 1)
							// 重置tab 页签
							if (this.activeTabName === 'PeakSeasonExpenses') {
								this.activeTabName = 'ProductDeliveryFee'
							}
						}
						this.loading = false
					} else {
						this.loading = false
					}
				} else {
					this.formData.chargeTypeList.splice(1, 1)
					this.formData.fuelRateDTOList = []
					// 重置tab 页签
					if (this.activeTabName === 'PeakSeasonExpenses') {
						this.activeTabName = 'ProductDeliveryFee'
					}
				}
			}
		},
		/**
			 * 保存草稿
			 */
		async saveDraft() {
			this.loading = true
			let fn = this.isMember ? this.formData.productType === 1 ? saveDraftPriceCardsOfCustomer : saveDraftTruckPriceCardsOfCustomer : this.formData.productType === 1 ? saveDraftPriceCardsApi : saveDraftTruckPriceCardsApi
			let saveForm = this.handlerForm()
			fn(saveForm).then(res => {
				if (res.ok) {
					this.$message.success(this.$t('channelPriceCard.save_success'))
					this.removeTag()
				} else {
					this.loading = false
				}
			}).catch(() => {
				this.loading = false
			})
		},
		handlerForm() {
			let formData = this.$extends(true, {}, this.formData)
			formData.expiryDateStart = formData.validTimeRange[0]
			formData.expiryDateEnd = formData.validTimeRange[1]
			if (this.$isNotEmpty(formData.chargeTypeCoefficientDTOList)) {
				formData.chargeTypeCoefficientDTOList.forEach((item, index) => {
					item.serial = index + 1
					item.endWarehouseIdList = item.endWarehouseId ? [item.endWarehouseId] : []
					item.startWarehouseIdList = item.startWarehouseId ? [item.startWarehouseId] : []
				})
			}
			let bubbleConditionJson = null
			if (Number(formData.productType) === 1 && formData.bubbleConditionMap.checked) {
				bubbleConditionJson = JSON.stringify({ volume: formData.bubbleConditionMap.volume })
			}
			formData.bubbleConditionJson = bubbleConditionJson
			return formData
		},
		/**
	 * 移除当前Tag
	 */
		removeTag(refresh = true) {
			this.$store.dispatch('tagsView/delView', this.$route)
			this.$router.push({ name: this.isMember ? 'ProductCustomerPriceCard' : 'ProductCostPriceCard', query: { refresh } })
			this.loading = false
		},
		/**
		 * 提交
		 */
		submit() {
			this.loading = true
			let fn = this.isMember ? this.formData.productType === 1 ? submitPriceCardsOfCustomer : submitTruckPriceCardsOfCustomer : this.formData.productType === 1 ? submitPriceCardsApi : submitTruckPriceCardsApi
			let saveForm = this.handlerForm()
			fn(saveForm).then(res => {
				if (res.ok) {
					this.$message.success(this.$t('channelPriceCard.save_success'))
					this.removeTag()
				} else {
					this.loading = false
				}
			}).catch(() => {
				this.loading = false
			})
		},


		/**
		 * 返回列表
		 */
		backList() {
			this.loading = true
			if (Number(this.type) === 1) {
				this.removeTag()
				return
			}
			let msg = this.isEdit ? this.$t('channelPriceCard.un_save_info_mention') : this.formData.priceCardName + this.$t('channelPriceCard.save_draft_info_mention')
			this.$confirm(msg, this.$t('channelPriceCard.prompt'), {
				confirmButtonText: this.$isEmpty(this.formData.id) ? this.$t('channelPriceCard.confirm') : this.$t('channelPriceCard.confirm'),
				cancelButtonText: this.$t('channelPriceCard.cancel'),
				type: 'warning'
			}).then(() => {
				this.removeTag()
			}).catch(() => {
				this.loading = false
			})
		}
	}
}
</script>

<style scoped lang="less">
.tips-warning {
	position: absolute;
	left: 0px;
	top: 30px;
	font-size: 12px;
	color: #f78989;
}
.sub-title {
	font-size: 14px;
	margin-left: -10px;
	color: #606266;
}
.content-container {
	padding-left: 40px;
	.label {
		font-size: 14px;
		color: #606266;
	}
}
</style>
