<template>
	<div>
		<div v-if="productType === 1">
			<el-row
				class="mt-10"
				:gutter="20"
				v-for="(item, index) in data.chargeTypeCoefficientDTOList"
				:key="index"
			>
				<el-col :span="10">
					<el-form-item
						:label="$t('channelPriceCard.area')"
						label-width="50px"
						:prop="getPrefix + index + '.areaCodeList'"
						:rules="[
							{
								required: true,
								message: $t('channelPriceCard.please_select_area'),
							},
						]"
					>
						<el-select
							v-model="item.areaCodeList"
							:placeholder="$t('channelPriceCard.please_select_area')"
							multiple
							size="mini"
							class="w-full"
							:disabled="isDisabled"
						>
							<el-option
								v-for="item in areaList"
								:label="item"
								:value="item"
								:key="item"
							/>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<div class="flex-box">
						<el-form-item
							:label="$t('channelPriceCard.weight_start_value')"
							label-width="105px"
							:prop="getPrefix + index + '.weightStartValue'"
							:rules="[
								{
									required: true,
									message: $t('channelPriceCard.please_enter_weight_start_value')
								},
								{ validator: $validators.isNumber },
							]"
						>
							<el-input
								:disabled="isDisabled"
								v-model="item.weightStartValue"
								size="mini"
								@change="valChange($event, 'start', item.weightEndValue, item)"
							/>
						</el-form-item>
						<el-form-item
							:label="$t('channelPriceCard.weight_end_value')"
							label-width="105px"
							class="ml-10"
							:prop="getPrefix + index + '.weightEndValue'"
							:rules="[
								{
									required: true,
									message: $t('channelPriceCard.please_enter_weight_end_value')
								},
								{ validator: $validators.isNumber },
							]"
						>
							<el-input
								:disabled="isDisabled"
								v-model="item.weightEndValue"
								size="mini"
								@change="valChange($event, 'end', item.weightStartValue, item)"
							/>
						</el-form-item>
					</div>
				</el-col>
				<el-col :span="4">
					<el-form-item
						:label="$t('channelPriceCard.adjustment_coefficient')"
						label-width="70px"
						:prop="getPrefix + index + '.adjustmentCoefficient'"
						:rules="[
							{
								required: true,
								message: $t('channelPriceCard.please_enter_adjustment_coefficient')
							},
							{ validator: $validators.checkNumerGreaterZero },
						]"
					>
						<el-input
							v-model="item.adjustmentCoefficient"
							size="mini"
							:disabled="isDisabled"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="2" v-if="!isDisabled">
					<el-form-item label="  " label-width="0px">
						<span
							v-if="index + 1 === data.chargeTypeCoefficientDTOList.length"
							class="el-icon-circle-plus-outline icon"
							@click="addItem()"
						/>
						<span
							v-if="data.chargeTypeCoefficientDTOList.length > 1"
							class="el-icon-remove-outline icon"
							@click="delItem(index)"
						/>
					</el-form-item>
				</el-col>
			</el-row>
		</div>
		<div v-else>
			<el-row
				class="mt-10"
				:gutter="20"
				v-for="(item, index) in data.chargeTypeCoefficientDTOList"
				:key="index"
			>
				<el-col :span="5">
					<el-form-item
						:label="$t('channelPriceCard.warehouse')"
						label-width="50px"
						:prop="getPrefix + index + '.startWarehouseId'"
						:rules="[
							{
								required: true,
								message: $t('channelPriceCard.please_select_warehouse')
							},
						]"
					>
						<el-select
							v-model="item.startWarehouseId"
							:placeholder="$t('channelPriceCard.please_select_warehouse')"
							size="mini"
							class="w-full"
							:disabled="isDisabled"
              @change="startWarehouseChange($event,item)"
						>
							<el-option
								v-for="item in warehouseList"
								:value="item.warehouseId"
								:key="item.warehouseId"
								:label="item.warehouseName"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="5">
					<el-form-item
						:label="$t('channelPriceCard.destination')"
						label-width="70px"
						:prop="getPrefix + index + '.endWarehouseId'"
						:rules="[
							{
								required: true,
								message: $t('channelPriceCard.please_select_destination')
							},
						]"
					>
						<el-select
							v-model="item.endWarehouseId"
							filterable
							reserve-keyword
							:placeholder="$t('channelPriceCard.please_select_destination')"
							size="mini"
							:disabled="isDisabled"
						>
							<el-option
								v-for="item in FBAWarehouseMap[item.startWarehouseId]"
								:key="item.warehouseId"
								:label="item.warehouseName"
								:value="item.warehouseId"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<div class="flex-box">
						<el-form-item
							:label="$t('channelPriceCard.start_tray')"
							label-width="85px"
							:prop="getPrefix + index + '.startTray'"
							:rules="[
								{
									required: true,
									message: $t('channelPriceCard.please_enter_start_tray'),
								},
								{ validator: $validators.pInt },
							]"
						>
							<el-input
								:disabled="isDisabled"
								v-model="item.startTray"
								size="mini"
								@change="valChange($event, 'start', item.endTray, item)"
							/>
						</el-form-item>
						<el-form-item
              :label="$t('channelPriceCard.end_tray')"
							label-width="85px"
							class="ml-10"
							:prop="getPrefix + index + '.endTray'"
							:rules="[
								{
									required: true,
									message: $t('channelPriceCard.please_enter_end_tray'),
								},
								{ validator: $validators.pInt },
							]"
						>
							<el-input
								:disabled="isDisabled"
								v-model="item.endTray"
								size="mini"
								@change="valChange($event, 'end', item.startTray, item)"
							/>
						</el-form-item>
					</div>
				</el-col>
				<el-col :span="4">
					<el-form-item
						:label="$t('channelPriceCard.adjustment_coefficient')"
						label-width="70px"
						:prop="getPrefix + index + '.adjustmentCoefficient'"
						:rules="[
							{
								required: true,
								message: $t('channelPriceCard.please_enter_adjustment_coefficient')
							},
							{ validator: $validators.checkNumerGreaterZero },
						]"
					>
						<el-input
							v-model="item.adjustmentCoefficient"
							size="mini"
							:disabled="isDisabled"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="2" v-if="!isDisabled">
					<el-form-item label="  " label-width="0px">
						<span
							v-if="index + 1 === data.chargeTypeCoefficientDTOList.length"
							class="el-icon-circle-plus-outline icon"
							@click="addItem()"
						/>
						<span
							v-if="data.chargeTypeCoefficientDTOList.length > 1"
							class="el-icon-remove-outline icon"
							@click="delItem(index)"
						/>
					</el-form-item>
				</el-col>
			</el-row>
		</div>
		<el-row>
			<el-col :span="6">
				<el-form-item
					:label="$t('channelPriceCard.carriage_min_amount')"
					label-width="110px"
					:prop="
						moduleType === '1'
							? `minAmount`
							: `chargeTypeForDeliveryChargeDTO.minAmount`
					"
					:rules="[
						{
							required: true,
							message: $t('channelPriceCard.please_enter_carriage_min_amount'),
						},
						{ validator: $validators.checkNumerGreaterZero },
					]"
				>
					<el-input
						v-model="data.minAmount"
						size="mini"
						:disabled="isDisabled"
            class="w-140"
					/>
				</el-form-item>
			</el-col>
            <el-col :span="8" v-if="productType === 1">
				<el-form-item
					:label="$t('channelPriceCard.expressSurchargeMinChargeWeight')"
					label-width="190px"
					:prop="
						moduleType === '1'
							? `expressSurchargeMinChargeWeight`
							: `chargeTypeForDeliveryChargeDTO.expressSurchargeMinChargeWeight`
					"
					:rules="[
						{
							required: true,
							message: $t('channelPriceCard.expressSurchargeMinChargeWeight'),
						},
						{ validator: $validators.checkNumerGreaterZero },
					]"
				>
					<el-input
						v-model="data.expressSurchargeMinChargeWeight"
						size="mini"
						:disabled="isDisabled">
            <template slot="append">{{getViewUnit}}</template>
            </el-input>
				</el-form-item>
			</el-col>
			<el-col :span="8" v-if="productType === 1">
				<el-form-item
					:label="$t('channelPriceCard.oversizeSurchargeMinChargeWeight')"
					label-width="190px"
					:prop="
						moduleType === '1'
							? `oversizeSurchargeMinChargeWeight`
							: `chargeTypeForDeliveryChargeDTO.oversizeSurchargeMinChargeWeight`
					"
					:rules="[
						{
							required: true,
							message: $t('channelPriceCard.please_enter_oversizeSurchargeMinChargeWeight'),
						},
						{ validator: $validators.checkNumerGreaterZero },
					]"
				>
					<el-input
						v-model="data.oversizeSurchargeMinChargeWeight"
						size="mini"
						:disabled="isDisabled">
            <template slot="append">{{getViewUnit}}</template>
            </el-input>
				</el-form-item>
			</el-col>
			<slot name="refresh"></slot>
		</el-row>
	</div>
</template>

<script>
let lastTriggeredAt // 用户远程搜索（记录最后一次触发时间）
import { getAreaListByProductIdApi, getPriceCardsSummaryApi } from '@/api/OverseasWarehouse/PriceCardManage.js'
export default {
	name: 'DistributionCostCoefficient',
	props: {
		data: Object,
		// 类型 1为配送费 2为运费
		productType: {
			type: Number,
			default: 1
		},
		moduleType: {
			type: String,
			default: '1'
		},
		productId: String,
		isAdd: {
			type: Boolean,
			default: true
		},
		// 0 为可编辑 1为详情
		type: {
			type: String,
			default: '0'
		}
	},
	data() {
		return {
			FBAWarehouseList: [],
			// selectedWarehouse: {},
			FBAWarehouseMap: {},
			areaList: [],
			warehouseList: [],
			loading: false
		}
	},
	created() {

	},
	watch: {
		productId: {
			handler(val) {
				if (this.$isNotEmpty(val)) {
					if (Number(this.productType) === 1) {
						this.processData(1)
					}
				}
			},
			immediate: true
		},
		'data.costPriceCardId': {
			handler(val) {
				if (this.$isNotEmpty(val)) {
					if (this.productType === 2) {
						this.processData(2)
					}
				}

			},
			immediate: true
		}
	},
	computed: {
		getPrefix() {
			return this.moduleType === "1" ? 'chargeTypeCoefficientDTOList.' : 'chargeTypeForDeliveryChargeDTO.chargeTypeCoefficientDTOList.'
		},
		isDisabled() {
			return Number(this.type) !== 0
		},
		/**
		 * 获取单位显示
		 */
		getViewUnit() {
			let str = ''
			let val = Number(this.data.unitCategoryType)
			switch (val) {
				case 11:
					str = this.$t('channelPriceCard.unitCategory.LB')
					break
				case 20:
					str = this.$t('channelPriceCard.unitCategory.g')
					break
				case 21:
					str = this.$t('channelPriceCard.unitCategory.OZ')
					break
				default: str = this.$t('channelPriceCard.unitCategory.KG')
					break
			}
			return str
		},
	},
	methods: {
		/**
		 * 根据物流产品获取分区
		 */
		async processData(type) {
			let fn = Number(type) === 1 ? getAreaListByProductIdApi : getPriceCardsSummaryApi
			let data = Number(type) === 1 ? this.productId : this.data.costPriceCardId
			let res = await fn(data)
			if (res.ok) {
				if (this.isAdd) {
					this.data.chargeTypeCoefficientDTOList = [{
						adjustmentCoefficient: 1,
						serial: 1,
						areaCodeList: [],
						weightEndValue: '',
						weightStartValue: '',
						endWarehouseIdList: [],
						endWarehouseId: null,
						startWarehouseIdList: [],
						startWarehouseId: null,
						endTray: '',
						startTray: ''
					}]
				}
				if (this.productType === 1) {
					this.areaList = res.content || []
				} else {
					this.warehouseList = res.content.startWarehouseList
					this.FBAWarehouseMap = {}
					this.warehouseList.forEach(item => {
						this.FBAWarehouseMap[item.warehouseId] = item.endWarehouseList || []
					})
					console.log(this.FBAWarehouseMap)
					// this.FBAWarehouseList = res.content.endWarehouseList
				}
			}
		},

		/**
			 * 新增派送费洗漱
			 */
		addItem() {
			let dataItem = {
				adjustmentCoefficient: 1,
				areaCodes: '',
				areaIds: '',
				areaIdList: [],
				areaCodeList: [],
				serial: this.data.chargeTypeCoefficientDTOList.length,
				weightEndValue: '',
				weightStartValue: '',
				endWarehouseIdList: [],
				endWarehouseId: null,
				startWarehouseIdList: [],
				startWarehouseId: null,
				endTray: '',
				startTray: ''
			}
			this.data.chargeTypeCoefficientDTOList.push(dataItem)
		},
		/**
		 *删除数据
		 */
		delItem(index) {
			this.data.chargeTypeCoefficientDTOList.splice(index, 1)
		},
		/**
	 *
	 */
		valChange(val, type, compareVal, item) {
			if (this.$isEmpty(compareVal)) {
				return
			}
			if (type === 'start' && Number(compareVal) < Number(val)) {
				let tips = this.productType === 1 ? this.$t('channelPriceCard.weight_start_value_less_than_end_value') : this.$t('channelPriceCard.tray_start_value_less_than_end_value')
				this.$message.error(tips)
				item.weightStartValue = null
			}
			if (type === 'end' && Number(compareVal) > Number(val)) {
				let tips = this.productType === 1 ? this.$t('channelPriceCard.weight_end_value_greater_than_start_value') : this.$t('channelPriceCard.tray_end_value_greater_than_start_value')
				this.$message.error(tips)
				item.weightEndValue = null
			}
		},
		// 起始仓库变更 过滤结束仓库
		startWarehouseChange(val, item) {
			item.endWarehouseId = null
		}
	}
}
</script>

<style scoped lang="less">
.el-form-item__content .el-input-group {
	vertical-align: inherit !important;
}
</style>
