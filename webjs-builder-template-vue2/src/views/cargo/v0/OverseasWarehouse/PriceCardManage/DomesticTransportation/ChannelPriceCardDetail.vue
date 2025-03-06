<template>
	<div class="page-edit-container full-page bg-white">
		<div class="page-edit-content">
			<el-form
				ref="formData"
				:model="formData"
				label-width="110px"
				:rules="rules"
			>
				<div class="pd-16 content-title">{{$t('channelPriceCard.base_info')}}</div>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item :label="$t('channelPriceCard.price_card_name')" prop="priceCardName">
							<el-input
								v-if="!formData.id"
								v-model.trim="formData.priceCardName"
								size="mini"
								:placeholder="$t('channelPriceCard.please_enter_price_card_name')"
							/>
							<span v-else>{{ formData.priceCardName }}</span>
						</el-form-item>
					</el-col>
          <el-col :span="12" v-if="formData.id">
						<el-form-item :label="$t('channelPriceCard.price_card_code')" >
							<span >{{ formData.priceCardNo }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item :label="$t('channelPriceCard.channel')" prop="channelId">
              <type-select v-if="!formData.id" v-model="formData.channelId"  type="channel" @selected="channelChange" clearable />
							<span v-else>{{ formData.channelName }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item :label="$t('channelPriceCard.product_code')" prop="productName">
							<el-input
								size="mini"
								disabled
								v-if="!formData.id"
								v-model="formData.productName"
							></el-input>
							<span v-else>{{ formData.productName }}</span>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item :label="$t('channelPriceCard.currency')" prop="currencyCode">
							<el-select
								v-if="!formData.id"
								size="mini"
								v-model="formData.currencyCode"
								@change="currencieChange"
								class="w-full"
								:placeholder="$t('channelPriceCard.please_select_currency')"
							>
								<el-option
									v-for="item in currenciesList"
									:key="item.code"
									:label="item.name"
									:value="item.code"
								></el-option>
							</el-select>
							<span v-else>{{ formData.currencyName }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item :label="$t('channelPriceCard.effective_time')" prop="validTimeRange">
              <common-picker
                v-if="Number(type) === 0"
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
								{{ $moment(parseInt(formData.expiryDateStart, 10)).utc().format("YYYY-MM-DD HH:mm:ss")}}{{$t('channelPriceCard.to')}}
								{{$moment(parseInt(formData.expiryDateEnd, 10)).utc().format("YYYY-MM-DD HH:mm:ss")}}
							</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item :label="$t('channelPriceCard.unit_category_type')" prop="unitCategoryType">
							<el-select
								v-if="!formData.id"
								size="mini"
								v-model="formData.unitCategoryType"
								class="w-full"
								:placeholder="$t('channelPriceCard.please_select_unit_category_type')"
							>
								<el-option :label="$t('channelPriceCard.unitCategoryType.METRIC')" :value="10"></el-option>
								<el-option :label="$t('channelPriceCard.unitCategoryType.IMPERIAL')" :value="11"></el-option>
								<el-option :label="$t('channelPriceCard.unitCategoryType.METGRAM')" :value="20"></el-option>
								<el-option :label="$t('channelPriceCard.unitCategoryType.FEETOUNCES')" :value="21"></el-option>
							</el-select>
							<span v-else>{{getViewUnit}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="Number(formData.productType) === 2">
						<el-form-item :label="$t('channelPriceCard.dest_warehouse_type')" prop="destWarehouseType">
							<el-select
								v-if="!formData.id"
								size="mini"
								v-model="formData.destWarehouseType"
								class="w-full"
								:placeholder="$t('channelPriceCard.please_select_dest_warehouse_type')"
							>
								<el-option :label="$t('channelPriceCard.destWarehouseType.FBA')" :value="1"></el-option>
							</el-select>
							<span v-else>{{ formData.destWarehouseTypeName }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="Number(formData.productType)  === 1">
            <el-row :gutter="10">
              <el-col :span="10">
                <el-form-item :label="$t('channelPriceCard.meter_bubble_coefficient')" prop="meterBubbleCoefficient">
                  <el-input
                    v-if="!formData.id || Number($route.query.copy) === 1"
                    v-model="formData.meterBubbleCoefficient"
                    size="mini"
                    :placeholder="$t('channelPriceCard.please_enter_meter_bubble_coefficient')"
                  />
                  <span v-else>{{ formData.meterBubbleCoefficient }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <BubbleCountingCondition :isEdit="!formData.id || Number($route.query.copy) === 1" :unitCategoryType="formData.unitCategoryType" :data="formData.bubbleConditionMap" />
              </el-col>
            </el-row>
					</el-col>
				</el-row>
				<div class="flex-right" v-if="!formData.id">
					<el-button
						size="mini"
						type="primary"
						:loading="loading"
						@click="saveForm('formData')"
					>
						{{$t('channelPriceCard.confirm')}}
					</el-button>
					<el-button size="mini" :loading="loading" @click="resetForm()">
            {{$t('channelPriceCard.reset')}}
					</el-button>
				</div>
				<div v-if="formData.id">
					<FuelRate :dataList="formData.fuelRateDTOList || []" />
					<!-- 快递 -->
					<div v-if="Number(formData.productType)  === 1">
						<el-tabs
							v-if="Number(formData.productType)  === 1"
							v-model="activeTabName"
							style="width: 100%"
						>
							<el-tab-pane :label="$t('channelPriceCard.delivery_charge')" name="DeliveryFee"></el-tab-pane>
							<el-tab-pane
								v-for="(item, index) in formData.chargeTypeList"
								:key="index"
								:label="item.labelName"
								:name="tabsMapKey[index + 2]"
							></el-tab-pane>
						</el-tabs>
						<component
							:is="activeTabName"
							:type="type"
							:productId="formData.productId"
							:productType="formData.productType"
							:data="
								activeTabName == 'DeliveryFee'
									? formData.chargeTypeForDeliveryChargeDTO || {}
									: formData.chargeTypeList[nameMapKey[activeTabName]]
							"
						>
						</component>
					</div>
					<!-- 卡车 -->
					<div v-if="formData.productType == '2'">
						<div class="pd-16 content-title">{{$t('channelPriceCard.charge')}}</div>
						<DeliveryFee
							:productType="formData.productType"
							:type="type"
							:productId="formData.productId"
							:data="formData"
						/>
					</div>
				</div>

			</el-form>
		</div>
    <div class="page-edit-footer" v-if="formData.id">
      <el-button size="mini" :loading="loading" @click="backList()">{{$t('channelPriceCard.cancel')}}</el-button>
      <el-button size="mini" :loading="loading" @click="saveDraft" v-if="type == 0 && formData.status != 33">{{$t('channelPriceCard.save_draft')}}</el-button>
      <el-button size="mini" :loading="loading" type="primary" v-if="type == 0" @click="submit('formData')">{{$t('channelPriceCard.submit')}}</el-button>
    </div>
	</div>
</template>

<script>
import { getCurrenciesListApi } from '@/api/common.js'
import DeliveryFee from '../components/DeliveryFee.vue'
import FuelRate from '../components/FuelRateDetail.vue'
import ExpenseStatement from '../components/ExpenseStatement.vue'
import PeakSeasonExpenses from '../components/PeakSeasonExpenses.vue'
import BubbleCountingCondition from './components/BubbleCountingCondition.vue'
import { saveBaseFormApi, saveTruckBaseFormApi, detailPriceCardsApi, detailtruckPriceCardsApi, saveDraftTruckPriceCardsApi, saveDraftPriceCardsApi, submitPriceCardsApi, submitTruckPriceCardsApi, getPssAndFuelApi } from '@/api/OverseasWarehouse/PriceCardManage.js'
export default {
	name: 'ChannelPriceCardDetail',
	components: { DeliveryFee, FuelRate, ExpenseStatement, PeakSeasonExpenses, BubbleCountingCondition },
	data() {
		let defaultForm = {
			id: '',
			priceCardName: '',
			productId: '',
			productName: '',
			channelName: '',
			productType: 1,
			channelCode: '',
			channelId: '',
			currencyCode: '',
			currencyName: '',
			destWarehouseType: "",
			destinationName: "",
			meterBubbleCoefficient: '',
			countryName: '',
			countryCode: '',
			expiryDateEnd: null,
			expiryDateStart: null,
			unitCategoryType: null,
			validTimeRange: [],
			fuelRateDTOList: [],
			priceCardType: 10,
			priceCardNo: null,
			bubbleConditionJson: null,
			bubbleConditionMap: {
				checked: false,
				volume: null
			}
		}
		return {
			defaultForm,
			loading: false,
			type: null,
			activeTabName: 'DeliveryFee',
			formData: this.$extends({}, defaultForm),
			currenciesList: [],
			peakSeasonData: {},
			isEdit: false,
			activeTruckTabName: '0',
			tabsMapKey: {
				1: 'DeliveryFee',
				2: 'ExpenseStatement',
				3: 'PeakSeasonExpenses'
			},
			nameMapKey: {
				'DeliveryFee': 2,
				'ExpenseStatement': 0,
				'PeakSeasonExpenses': 1
			},
			datePickerOptions: {
				disabledDate: time => time.getTime() < new Date().getTime() - 24 * 60 * 60 * 1000
			},
			rules: {
				priceCardName: [{ required: true, message: this.$t('channelPriceCard.please_enter_price_card_name_desc') }],
				productName: [{ required: true, message: this.$t('channelPriceCard.please_select_product_code_desc') }],
				channelId: [{ required: true, message: this.$t('channelPriceCard.please_select_channel') }],
				validTimeRange: [{ required: true, message: this.$t('channelPriceCard.effective_time') }],
				unitCategoryType: [{ required: true, message: this.$t('channelPriceCard.please_select_unit_category_type') }],
				computeMode: [{ required: true, message: this.$t('channelPriceCard.please_enter_compute_mode') }],
				currencyCode: [{ required: true, message: this.$t('channelPriceCard.please_select_currency') }],
				destWarehouseType: [{ required: true, message: this.$t('channelPriceCard.please_select_dest_warehouse_type') }],
				meterBubbleCoefficient: [{ required: true, message: this.$t('channelPriceCard.please_enter_meter_bubble_coefficient') }, { validator: this.$validators.isNumber }]
			}
		}
	},
	created() {
		this.type = this.$route.query.type || '0'
		this.isEdit = Number(this.$route.query.edit) === 1
		this.init()
		if (this.$isNotEmpty(this.$route.query.id)) {
			this.getDetail(this.$route.query.id)
		}
	},
	computed: {
		/**
		 * 获取单位显示
		 */
		getViewUnit() {
			let val = Number(this.formData.unitCategoryType)
			let str = ''
			switch (val) {
				case 11:
					str = this.$t('channelPriceCard.unitCategoryType.IMPERIAL')
					break
				case 20:
					str = this.$t('channelPriceCard.unitCategoryType.METGRAM')
					break
				case 21:
					str = this.$t('channelPriceCard.unitCategoryType.FEETOUNCES')
					break
				default: str = this.$t('channelPriceCard.unitCategoryType.METRIC')
					break
			}
			return str
		}
	},
	methods: {

		async init() {
			let rs = await getCurrenciesListApi()
			if (rs.ok) {
				this.currenciesList = rs.content || []
			}
		},
		/**
		 * 有效期变更
		 */

		async dateTimeChange(val) {
			if (this.$isEmpty(this.formData.id)) {
				return
			}
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
								this.activeTabName = 'DeliveryFee'
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
						this.activeTabName = 'DeliveryFee'
					}
				}
			}
		},
		/**
		 * 获取模板详情
		 */
		async getDetail(id) {
			this.loading = true
			let productType = Number(this.$route.query.productType) || this.formData.productType
			let fn = productType === 1 ? detailPriceCardsApi : detailtruckPriceCardsApi
			let res = await fn(id).catch(() => {
				this.loading = false
			})
			if (res.ok) {
				this.loading = false
				res.content.validTimeRange = [res.content.expiryDateStart, res.content.expiryDateEnd]
				// 快递相关处理数据
				if (this.formData.productType === 1) {
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
					// 处理派送费为空 后端返回 NULL
					res.content.chargeTypeForDeliveryChargeDTO = res.content.chargeTypeForDeliveryChargeDTO || {
						chargeDetailForDeliveryChargeDTOList: []
					}
					// 缓存旺季附加费数据
					if (this.$isNotEmpty(res.content.chargeTypeList) && res.content.chargeTypeList.length === 2) {
						this.peakSeasonData = this.$extends(true, {}, res.content.chargeTypeList[1])
					} else {
						this.peakSeasonData = {
							chargeItemDetailDTOList: [],
							labelName: this.$t('channelPriceCard.peak_season_surcharge'),
							newAdjustmentCoefficient: null
						}
					}
					// 将度量单位赋值到派送费上
					res.content.chargeTypeForDeliveryChargeDTO.unitCategoryType = res.content.unitCategoryType
				} else if (this.formData.productType === 2) {
					// 卡车相关的数据处理
					res.content.chargeTypeForFabTruckDTOList = res.content.chargeTypeForFabTruckDTOList || []
				}
				this.formData = res.content
			}
		},
		/**
		 *
		 * 选择币种
		 */
		currencieChange(code) {
			let selectData = this.currenciesList.find(item => item.code === code)
			this.formData.currencyName = selectData.name
		},
		/**
		 * 选择渠道
		 */
		channelChange(selectData) {
			this.formData.channelName = selectData.channelName
			this.formData.channelCode = selectData.channelCode
			this.formData.productName = selectData.productName
			this.formData.productCode = selectData.productCode
			this.formData.productId = selectData.productId
			this.formData.productType = Number(selectData.productType)
			this.formData.countryCode = selectData.countryCode
			this.formData.countryName = selectData.countryName
		},
		/**
		 * 保存接口
		 */
		saveForm(refName) {
			this.$refs[refName].validate(valid => {
				if (!valid) {
					this.mixinsFormScrollIntoView()
					return false
				}
				this.handlerForm()
				this.loading = true
				let fn = this.formData.productType === 1 ? saveBaseFormApi : saveTruckBaseFormApi
				fn(this.formData).then(res => {
					if (res.ok) {
						this.getDetail(res.content)
					} else {
						this.loading = false
					}
				}).catch(() => {
					this.loading = false
				})

			})
		},
		handlerForm() {
			this.formData.expiryDateStart = this.formData.validTimeRange[0]
			this.formData.expiryDateEnd = this.formData.validTimeRange[1]
			let bubbleConditionJson = null
			if (Number(this.formData.productType) === 1 && this.formData.bubbleConditionMap.checked) {
				bubbleConditionJson = JSON.stringify({ volume: this.formData.bubbleConditionMap.volume })
			}
			this.formData.bubbleConditionJson = bubbleConditionJson
		},
		/**
		 * 保存草稿
		 */
		saveDraft() {
			this.handlerForm()
			this.loading = true
			let fn = this.formData.productType === 1 ? saveDraftPriceCardsApi : saveDraftTruckPriceCardsApi
			fn(this.formData).then(res => {
				if (res.ok) {
					this.loading = false
					this.$message.success(this.$t('channelPriceCard.save_success'))
					this.removeTag()
				} else {
					this.loading = false
				}
			}).catch(() => {
				this.loading = false
			})
		},
		submit(refName) {
			this.$refs[refName].validate(valid => {
				if (!valid) {
					this.mixinsFormScrollIntoView()
					return false
				}
				if (this.formData.productType === 1) {
					if (this.formData.chargeTypeForDeliveryChargeDTO && this.$isEmpty(this.formData.chargeTypeForDeliveryChargeDTO.chargeDetailForDeliveryChargeDTOList)) {
						this.$message.error('派送费不能为空')
						return
					}
				} else {
					if (this.$isEmpty(this.formData.warehouseTruckChargeDetailList)) {
						this.$message.error('卡车派送费不能为空')
						return
					}
				}
				this.loading = true
				this.handlerForm()
				let fn = this.formData.productType === 1 ? submitPriceCardsApi : submitTruckPriceCardsApi
				fn(this.formData).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('channelPriceCard.save_success'))
						this.removeTag()
					} else {
						this.loading = false
					}
				}).catch(() => {
					this.loading = false
				})

			})
		},
		/**
		 * 移除当前Tag
		 */
		removeTag(refresh = true) {
			this.$store.dispatch('tagsView/delView', this.$route)
			this.$router.push({ name: 'ChannelPriceCard', query: { refresh } })
			this.loading = false
		},
		/**
		 * 重置表单
		 */
		resetForm() {
			this.$refs.formData.resetFields()
		},
		/**
		 * 返回列表
		 */
		backList() {
			if (Number(this.type) === 1) {
				this.removeTag()
				return
			}
			let msg = this.$isEmpty(this.formData.id) || this.isEdit ? this.$t('channelPriceCard.un_save_info_mention') : this.formData.priceCardName + this.$t('channelPriceCard.save_draft_info_mention')
			this.$confirm(msg, this.$t('channelPriceCard.prompt'), {
				confirmButtonText: this.$isEmpty(this.formData.id) ? this.$t('channelPriceCard.confirm') : this.$t('channelPriceCard.confirm'),
				cancelButtonText: this.$t('channelPriceCard.cancel'),
				type: 'warning'
			}).then(() => {
				this.removeTag()
			}).catch(() => {

			})
		}
	}
}
</script>

<style scoped lang="less">
</style>
