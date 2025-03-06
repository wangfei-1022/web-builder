<template>
	<div>
		<div class="flex-box top-tips" v-if="!isBaseCard">
			<div v-if="isPeakSeason" class="flex-box">
					<el-form-item
						:label="$t('channelPriceCard.adjustment_coefficient')+'：'"
						label-width="100px"
						:prop="`chargeTypeList[${1}][newAdjustmentCoefficient]`"
						:rules="[
							{
								required: true,
								message: $t('channelPriceCard.please_newAdjustmentCoefficient'),
							},
						]"
					>
					<el-input
						v-if="Number(type) === 0"
						size="mini"
						v-model="data.newAdjustmentCoefficient"
						:placeholder="$t('channelPriceCard.please_enter_adjustment_coefficient')"
						:min="0"
            oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g,'$1')"
						@blur="calcCostPrice(data.newAdjustmentCoefficient)"
					></el-input>
					<span v-else>{{data.newAdjustmentCoefficient}}</span>
					</el-form-item>
			</div>
			<div v-else>
				<el-form-item
						:label="$t('channelPriceCard.new_adjustment_coefficient')+'：'"
						label-width="120px"
					>
					<span >{{data.newAdjustmentCoefficient}}</span>
				</el-form-item>
			</div>
		</div>
		<el-table
			:data="data.chargeItemDetailDTOList || []"
			size="mini"
			style="width: 100%"
		>
			<el-table-column :label="$t('channelPriceCard.index')" width="60">
				<template slot-scope="{ $index }">{{ $index + 1 }}</template>
			</el-table-column>
			<el-table-column :label="$t('channelPriceCard.charge_item_name')" prop="chargeItemName" />
			<el-table-column
				v-for="(item, index) in columns"
				:key="index"
				:label="item.label"
			>
				<template slot-scope="{ row }">{{
					getColumnVal(item.type, row.chargeItemColumnAttrDTOList)
				}}</template>
			</el-table-column>
			<el-table-column :label="$t('channelPriceCard.is_area')" width="100" v-if="isBaseCard && !isPeakSeason">
				<template slot-scope="{ row }">
					<el-select size="mini" v-model="row.isArea" v-if="Number(type) === 0">
						<el-option :label="$t('channelPriceCard.YES')" :value="true"></el-option>
						<el-option :label="$t('channelPriceCard.NO')" :value="false"></el-option>
					</el-select>
					<span v-else>{{ row.isArea ? $t('channelPriceCard.YES') : $t('channelPriceCard.NO') }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t('channelPriceCard.is_area')" width="100" v-if="!isBaseCard && !isPeakSeason">
				<template slot-scope="{ row }">
					<span>{{ row.isArea ? $t('channelPriceCard.YES') : $t('channelPriceCard.NO') }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="isPeakSeason?'旺季价格':'价格'" width="140" v-if="isBaseCard">
				<template slot-scope="{ row }">
					<div>
						<span v-if="!row.isArea">
							<el-input
								v-if="Number(type) === 0 && !isPeakSeason"
								size="mini"
								v-model="row.adjustmentPrice"
								:placeholder="$t('channelPriceCard.please_enter_price')"
								:min="0"
                oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g,'$1')"
							></el-input>
							<span v-else>{{ row.adjustmentPrice }}</span>
						</span>
						<div v-else>
							<span v-if="getHasAreaVal(row)">
								<el-button type="text" size="mini" @click="editRow(row)">
									{{$t('channelPriceCard.view')}}
								</el-button>
							</span>
							<span v-else>
								<el-button type="text" size="mini" @click="editRow(row)">
									{{$t('channelPriceCard.edit')}}
								</el-button>
							</span>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column :label="$t('channelPriceCard.base_price')" width="140" v-if="!isBaseCard">
				<template slot-scope="{ row }">
					<div v-if="!row.isArea">
						{{ row.basePrice }}
					</div>
					<el-button v-else type="text" size="mini" @click="editRow(row)">
            {{$t('channelPriceCard.view')}}
					</el-button>
				</template>
			</el-table-column>
			<el-table-column :label="$t('channelPriceCard.adjustment_coefficient')" width="140" v-if="!isBaseCard && !isPeakSeason">
				<template slot-scope="{ row }">
					<div>
						<span v-if="!row.isArea">
							<el-input
								v-if="Number(type) === 0"
								size="mini"
								v-model="row.adjustmentCoefficient"
								@change="adjustmentCoefficientChange($event, row)"
								:min="0"
								:placeholder="$t('channelPriceCard.please_enter_adjustment_coefficient')"
                oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g,'$1')"
							></el-input>
							<span v-else>{{ row.adjustmentCoefficient }}</span>
						</span>
						<span v-else>-</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column :label="$t('channelPriceCard.adjustment_price')" width="140" v-if="!isBaseCard">
				<template slot-scope="{ row }">
					<div v-if="!row.isArea">
						{{ row.adjustmentPrice }}
					</div>
					<div v-else>-</div>
				</template>
			</el-table-column>
			<el-table-column :label="$t('channelPriceCard.operation')" width="100" v-if="Number(type) === 0 && !isPeakSeason">
				<template slot-scope="{ row }">
					<el-button type="text" size="mini" @click="editRow(row)">
						{{ Number(type) === 0 && isBaseCard ? $t('channelPriceCard.edit') : $t('channelPriceCard.view') }}
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<ExpenseStatementEdit
			:visible.sync="dialog.visible"
			:type="type"
			:data="currentRow"
			:isBaseCard="isBaseCard"
			:newAdjustmentCoefficient="data.newAdjustmentCoefficient"
			@closed="
				(val) => {
					$copyProps(currentRow, val);
				}
			"
		/>
	</div>
</template>

<script>
import ExpenseStatementEdit from "./ExpenseStatementEdit.vue"
export default {
	name: 'ExpenseStatement',
	components: { ExpenseStatementEdit },
	props: {
		data: {
			type: Object,
			require: true
		},
		// 编辑为0 详情为1
		type: String,
		isBaseCard: {
			type: Boolean,
			default: true
		},
		// 是否为旺季附加费
		isPeakSeason: {
			type: Boolean,
			default: false
		}


	},
	data() {
		return {
			columns: [],
			currentRow: {}

		}
	},
	mounted() {

	},
	watch: {
		data: {
			handler() {
				this.initData()
			},
			immediate: true
		}
	},
	methods: {
		// 初始化数据
		initData() {
			if (this.$isNotEmpty(this.data.chargeItemDetailDTOList)) {
				let handlerData = this.data.chargeItemDetailDTOList[0]
				this.columns = []
				handlerData.chargeItemColumnAttrDTOList.forEach(item => {
					let data = {
						label: item.showColumnTypeName,
						type: item.showColumnType
					}
					this.columns.push(data)
				})
				this.calcCostPrice(this.data.newAdjustmentCoefficient)
			}
		},

		calcCostPrice(val) {
			if (this.isBaseCard || !this.isPeakSeason) {
				return
			}
			if (this.$isNotEmpty(val)) {
				if (this._isNumber(val)) {
					let Decimal = require('decimal');
					this.data.chargeItemDetailDTOList.forEach(row => {
						let cnt = new Decimal(Number(val)).mul(Number(row.basePrice))
						cnt = Math.round((Number(cnt.internal) + Number.EPSILON) * 100) / 100
						row.adjustmentPrice = cnt
					})
				} else {
					this.data.chargeItemDetailDTOList.forEach(row => {
						row.adjustmentPrice = null
					})
					this.$message.error(this.$t('channelPriceCard.number_error'))

				}
			} else {
				this.data.chargeItemDetailDTOList.forEach(row => {
					row.adjustmentPrice = null
				})
			}

		},

		/**
		 * 获取动态头数据
		 */
		getColumnVal(type, dataList) {
			if (this.$isEmpty(type) || this.$isEmpty(dataList)) {
				return null
			}
			let showData = dataList.find(item => item.showColumnType === type).chargeItemConditionAttrDTOList
			let showValue = ''
			if (this.$isNotEmpty(showData)) {
				showData.forEach((item, index) => {
					if (index > 0) {
						showValue += "、"
					}
					switch (item.conditionAttrValueType) {
						case 10: // 枚举
							item.chargeItemConditionValueDTOList.forEach(item => {
								showValue += item.enumValueName
							})
							break
						case 20: // 范围
							let data = item.chargeItemConditionValueDTOList[0]
							// 当没有起始值时
							if (this.$isEmpty(data.startValue)) {
								showValue += item.attributeCdesc
								showValue += data.conditionEndSignTypeName
								showValue += data.endValue
								showValue += data.unitTypeName
							} else if (this.$isEmpty(data.endValue)) {
								// 当没有结束值时
								showValue += item.attributeCdesc
								showValue += data.conditionStartSignTypeName
								showValue += data.startValue
								showValue += data.unitTypeName
							} else {
								showValue += data.startValue
								showValue += data.unitTypeName
								showValue += data.conditionStartSignType === 12 ? '<' : data.conditionStartSignType === 13 ? '>'
									: data.conditionStartSignType === 14 ? '<=' : data.conditionStartSignType === 15 ? '>=' : data.conditionStartSignTypeName
								showValue += item.attributeCdesc
								showValue += data.conditionEndSignTypeName
								showValue += data.endValue
								showValue += data.unitTypeName
							}
							break
						case 21: // 时间范围
							let dataRange = item.chargeItemConditionValueDTOList[0]
							showValue += this.$moment(parseInt(dataRange.startValue, 10)).utc().format("YYYY-MM-DD HH:mm:ss")
							if (dataRange.endValue) {
								showValue += "-" + this.$moment(parseInt(dataRange.endValue, 10)).utc().format("YYYY-MM-DD HH:mm:ss")
							} else {
								showValue += this.$t('channelPriceCard.upToNow')
							}
							break
						case 30: // 业务数据
							item.chargeItemConditionValueDTOList.forEach(item => {
								showValue += item.businessValue
							})
							break
						default: showValue = '-'
							break
					}
				})
			}

			return showValue
		},
		/**
		 * 获取分区是否有值
		 */
		getHasAreaVal(row) {
			let areaList = row.chargeItemDetailAreasModuleDTOList[0].chargeItemDetailAreasDTOList || []
			if (areaList.findIndex(item => this.$isNotEmpty(item.price)) > -1) {
				return true
			} else {
				return false
			}
		},
		/**
		 * 计算调整价格
		 */
		adjustmentCoefficientChange(val, row) {


			if (this._isNumber(val)) {
				let Decimal = require('decimal');
				let cnt = new Decimal(Number(val)).mul(Number(row.basePrice))
				cnt = Math.round((Number(cnt.internal) + Number.EPSILON) * 100) / 100
				row.adjustmentPrice = cnt
			} else {
				row.adjustmentPrice = null
				this.$message.error(this.$t('channelPriceCard.number_error'))
			}
		},
		/**
		 * 编辑数据
		 */
		editRow(row) {
			this.currentRow = row
			this.dialog.visible = true
		}
	}
}
</script>

<style scoped lang="scss">
.top-tips {
	height: 36px;
	line-height: 36px;
	color: #909399;
	font-size: 14px;
	margin-left: 30px;
}
</style>
