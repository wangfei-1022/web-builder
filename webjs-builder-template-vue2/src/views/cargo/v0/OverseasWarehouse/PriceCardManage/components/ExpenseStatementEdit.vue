<template>
	<div>
		<el-dialog
			:visible.sync="dialogVisible"
			:title="$t('channelPriceCard.edit')"
			width="600px"
			:close-on-click-modal="false"
		>
			<div class="dialog-content">
				<el-form
					label-width="90px"
					label-position="left"
					:model="formData"
					ref="formData"
					v-if="dialogVisible"
				>
					<div class="pd-16 content-title">{{$t('channelPriceCard.base_info')}}</div>
					<div class="content">
						<el-row :gutter="20">
							<el-col :span="12">
								<el-form-item :label="$t('channelPriceCard.charge_item_name')">
									<span>{{ data.chargeItemName }}</span>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item :label="$t('channelPriceCard.is_area')">
									<el-select v-if="isEdit" size="mini" v-model="data.isArea">
										<el-option :label="$t('channelPriceCard.YES')" :value="true"></el-option>
										<el-option :label="$t('channelPriceCard.NO')" :value="false"></el-option>
									</el-select>
									<span v-else>{{ data.isArea ? $t('channelPriceCard.YES') : $t('channelPriceCard.NO') }}</span>
								</el-form-item>
							</el-col>
						</el-row>
					</div>
					<!-- 可编辑列 -->
					<div>
						<div
							v-for="(column, index) in data.chargeItemColumnAttrDTOList"
							:key="index"
						>
							<div
								class="pd-16 content-title"
								v-if="getIsHidden(column.chargeItemConditionAttrDTOList)"
							>
                {{$t('channelPriceCard.charge_condition')}}
							</div>
							<div
								class="content"
								v-for="(row, idx) in column.chargeItemConditionAttrDTOList"
								:key="idx"
							>
								<!-- 时间范围 -->
								<el-row :gutter="20" v-if="row.conditionAttrValueType === 21">
									<el-form-item :label="column.showColumnTypeName" label-width="70px">
										<span>
											{{ $moment(parseInt(row.chargeItemConditionValueDTOList[0].startValue, 10)).utc().format("YYYY-MM-DD HH:mm:ss")}}
										</span>
										-
										<span>{{ $moment(parseInt(row.chargeItemConditionValueDTOList[0].endValue, 10)).utc().format("YYYY-MM-DD HH:mm:ss")}}</span>
									</el-form-item>
								</el-row>
								<!-- 范围 -->
								<el-row :gutter="20" v-if="row.conditionAttrValueType === 20">
									<el-form-item
										:label="row.attributeCdesc"
										label-width="70px"
										v-if="$isNotEmpty(row.chargeItemConditionValueDTOList[0].conditionStartSignTypeName)">
										<span class="mr-20">
											{{row.chargeItemConditionValueDTOList[0].conditionStartSignTypeName}}
										</span>
										<el-input
											v-if="isEdit"
											size="mini"
											class="w-110"
											:maxlength="10"
											:placeholder="$t('channelPriceCard.please_enter')"
											v-model="row.chargeItemConditionValueDTOList[0].startValue"
                      oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g,'$1')"
										/>
										<span v-else>
											{{ row.chargeItemConditionValueDTOList[0].startValue }}
										</span>
										<span>
												{{ row.chargeItemConditionValueDTOList[0].unitTypeName }}
										</span>
									</el-form-item>
									<el-form-item
										:label="row.attributeCdesc"
										label-width="70px"
										v-if="
											$isNotEmpty(
												row.chargeItemConditionValueDTOList[0]
													.conditionEndSignTypeName
											)
										"
									>
										<span class="mr-20">
											{{
												row.chargeItemConditionValueDTOList[0]
													.conditionEndSignTypeName
											}}
										</span>
										<el-input
											v-if="isEdit"
											size="mini"
											class="w-110"
											:maxlength="10"
                      :placeholder="$t('channelPriceCard.please_enter')"
											v-model="row.chargeItemConditionValueDTOList[0].endValue"
                      oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g,'$1')"
										/>
										<span v-else>
											{{ row.chargeItemConditionValueDTOList[0].endValue }}
										</span>
										<span>
												{{ row.chargeItemConditionValueDTOList[0].unitTypeName }}
										</span>
									</el-form-item>
								</el-row>
							</div>
						</div>
					</div>
					<div v-if="!data.isArea">
						<div class="pd-16 content-title">{{$t('channelPriceCard.price')}}</div>
						<div class="content">
							<el-form-item :label="$t('channelPriceCard.price')" label-width="50px">
								<el-input
									v-if="isEdit"
									v-model="data.adjustmentPrice"
									class="w-110"
									:maxlength="10"
									size="mini"
									:placeholder="$t('channelPriceCard.please_enter_price')"
									:min="0"
                  oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g,'$1')"
								>
								</el-input>
								<span v-else> {{ data.adjustmentPrice || "-" }}</span>
							</el-form-item>
						</div>
					</div>
					<div v-if="data.isArea">
						<div class="pd-16 content-title">{{$t('channelPriceCard.price')}}</div>
						<el-tabs
							v-model="activeTabName"
							style="width: 100%"
							:max-height="400"
							v-if="
								data.chargeItemDetailAreasModuleDTOList[Number(activeTabName)]
									.length > 1
							"
						>
							<el-tab-pane
								v-for="(item, index) in data.chargeItemDetailAreasModuleDTOList"
								:key="index"
								:label="item.labelName"
								:name="String(index)"
							>
							</el-tab-pane>
						</el-tabs>
						<div class="flex-box top-tips" v-if="!isBaseCard">
							<div>{{$t('channelPriceCard.new_adjustment_coefficient')}}：{{ newAdjustmentCoefficient }}</div>
						</div>
						<el-table
							:data="data.chargeItemDetailAreasModuleDTOList[Number(activeTabName)].chargeItemDetailAreasDTOList"
							row-key="id"
						>
							<el-table-column :label="$t('channelPriceCard.area')" width="100">
								<template slot-scope="{ row }">
									<span>{{ row.areaName }}</span>
								</template>
							</el-table-column>
							<el-table-column :label="$t('channelPriceCard.price')" v-if="isBaseCard">
								<template slot-scope="{ row }">
									<span>
										<el-input
											v-if="isEdit"
											size="mini"
											v-model="row.price"
											:min="0"
                      :placeholder="$t('channelPriceCard.please_enter_price')"
                      oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g,'$1')"
										></el-input>
										<span v-else>{{ row.price }}</span>
									</span>
								</template>
							</el-table-column>
							<el-table-column :label="$t('channelPriceCard.base_price')" v-if="!isBaseCard">
								<template slot-scope="{ row }">
									<span>{{ row.basePrice }}</span>
								</template>
							</el-table-column>
							<el-table-column :label="$t('channelPriceCard.adjustment_coefficient')" v-if="!isBaseCard">
								<template slot-scope="{ row }">
									<span>
										<el-input
											v-if="Number(type) === 0"
											size="mini"
											v-model="row.adjustmentCoefficient"
											:min="0"
											:placeholder="$t('channelPriceCard.please_enter_adjustment_coefficient')"
											@change="adjustmentCoefficientChange($event, row)"
                      oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g,'$1')"
										></el-input>
										<span v-else>{{ row.adjustmentCoefficient }}</span>
									</span>
								</template>
							</el-table-column>
							<el-table-column :label="$t('channelPriceCard.adjustment_price')" v-if="!isBaseCard">
								<template slot-scope="{ row }">
									<span>{{ row.price }}</span>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<!-- v-permission="['sys:template:update']" -->
				<el-button type="primary" size="mini" @click="saveForm">{{$t('channelPriceCard.confirm')}}</el-button>
				<el-button size="mini" @click="close()"> {{$t('channelPriceCard.cancel')}} </el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'ExpenseStatementEdit',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		data: {
			type: Object,
			require: true
		},
		type: String,
		// 是否为成本价卡
		isBaseCard: {
			type: Boolean,
			default: true
		},
		newAdjustmentCoefficient: [String, Number]
	},
	data() {
		return {
			dialogVisible: false,
			activeTabName: '0',
			tempData: {},
			formData: {

			}
		}
	},
	methods: {
		getshowColumnNameValue() {
			return this.data.chargeItemColumnAttrDTOList[0].showColumnNameValue
		},
		getIsHidden(list) {
			if (this.$isEmpty(list)) {
				return false
			}
			let itemData = list.find(item => item.conditionAttrValueType === 21 || item.conditionAttrValueType === 20)
			return this.$isNotEmpty(itemData)
		},
		saveForm() {
			let data = this.data.chargeItemColumnAttrDTOList[0].chargeItemConditionAttrDTOList[0]
			let checkType = data.conditionAttrValueType
			let msg = ''
			// 如果是范围类型
			if (checkType === 20) {
				let startValue = data.chargeItemConditionValueDTOList[0].startValue
				let endValue = data.chargeItemConditionValueDTOList[0].endValue
				let conditionStartSignTypeName = data.chargeItemConditionValueDTOList[0].conditionStartSignTypeName
				let conditionEndSignTypeName = data.chargeItemConditionValueDTOList[0].conditionEndSignTypeName
				if (this.$isEmpty(startValue) && this.$isNotEmpty(conditionStartSignTypeName) || this.$isEmpty(endValue) && this.$isNotEmpty(conditionEndSignTypeName)) {
					msg = this.$t('channelPriceCard.charge_condition_cannot_be_null')
				} else if (this.$isEmpty(conditionStartSignTypeName) || this.$isEmpty(conditionEndSignTypeName)) {
					console.log(endValue, startValue)
				} else if (Number(endValue) < Number(startValue)) {
					msg = this.$t('channelPriceCard.charge_condition_end_value_is_greater_than_start_value')
				}
			}
			// 如果是分区 校验每个分区价格必填
			if (this.data.isArea && this.$isEmpty(msg)) {
				this.data.chargeItemDetailAreasModuleDTOList.forEach(item => {
					if (this.$isNotEmpty(item.chargeItemDetailAreasDTOList)) {
						let emptys = []
						item.chargeItemDetailAreasDTOList.forEach(area => {
							if (this.$isEmpty(area.price)) {
								emptys.push(area.areaName)
							}
						})
						if (this.$isNotEmpty(emptys)) {
							let name = emptys.join(',')
							msg = this.$t('channelPriceCard.area') + name + this.$t('channelPriceCard.price_cannot_be_null')
						}
					}
				})
			}
			if (this.$isNotEmpty(msg)) {
				this.$message.error(msg)
				return
			}
			this.dialogVisible = false
		},
		close() {
			this.$emit("closed", this.tempData)
			this.dialogVisible = false
		},
		/**
 * 计算调整价格
 */
		adjustmentCoefficientChange(val, row) {
			if (this._isNumber(val)) {
				let Decimal = require('decimal');
				let cnt = new Decimal(Number(val)).mul(Number(row.basePrice))
				cnt = Math.round((Number(cnt.internal) + Number.EPSILON) * 100) / 100
				row.price = cnt
			} else {
				row.price = null
				this.$message.error(this.$t('channelPriceCard.number_error'))
			}
		}
	},
	computed: {
		isEdit() {
			return Number(this.type) === 0 && this.isBaseCard
		}
	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		visible(val) {
			if (val) {
				// 缓存原来数据
				if (this.$isNotEmpty(this.data)) {
					this.tempData = this.$extends(true, {}, this.data)
				}
			}
			this.dialogVisible = val
		}
	}

}
</script>

<style lang="less">
.content {
	padding-left: 20px;
}
.top-tips {
	height: 36px;
	line-height: 36px;
	color: #909399;
	font-size: 14px;
	margin-left: 30px;
}
</style>
