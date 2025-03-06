<template>
  <div>
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column prop="serial" :label="$t('warehousePriceCard.index')" width="50"></el-table-column>
      <el-table-column prop="chargeItemName" :label="$t('warehousePriceCard.charge_item_name')" width="150"></el-table-column>
      <el-table-column v-for="item in column" :key="item.key" :prop="item.key" :label="item.name"></el-table-column>
      <el-table-column prop="chargeModeName" :label="$t('warehousePriceCard.charge_mode_name')" width="100"></el-table-column>
      <el-table-column prop="costPrice" :label="$t('warehousePriceCard.price')" width="100">
        <template slot-scope="{ row, $index }">
          <el-input v-if="!isDetail" v-model="row.costPrice" :placeholder="$t('warehousePriceCard.please_enter')" size="mini" @change="changePrice($index, $event)" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g,'$1')"></el-input>
          <span v-if="isDetail">{{row.costPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" :label="$t('warehousePriceCard.operation')">
        <template slot-scope="{ row }">
          <el-button v-if="row.editBtn" type="text" size="mini" @click="editRowFn(row)">
            {{ !isDetail ? $t('warehousePriceCard.edit') : $t('warehousePriceCard.detail') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
		<charge-edit-dialog
			:isDetail="isDetail"
			v-if="chargeEditDialogVisible"
			:visible="chargeEditDialogVisible"
			:data="dialogData"
			:column="column"
			:row="currentRow"
			@close="closeChargeEditDialog"
			@update="updateChargeEditDialog"
		></charge-edit-dialog>
	</div>
</template>

<script>
import chargeEditDialog from './chargeEditDialog'

export default {
	name: 'ChargeTable',
	components: {
		chargeEditDialog
	},
	props: {
		priceCardType: [String, Number],
		chargeTypeItem: {
			type: Object,
			default: function () {
				return {}
			}
		},
		isDetail: Boolean
	},
	data() {
		return {
			chargeEditDialogVisible: false,
			dialogData: [],
			type: 0,
			column: [],
			tableData: [],
			currentRow: {}
		}
	},
	watch: {
		chargeTypeItem: {
			handler(val, oldVal) {
				let column = []
				let tableData = []
				let data = val.chargeItemDetailDTOList || []
				data.forEach(item => {
					let obj = {}
					obj.extendInfoMap = item.extendInfoMap || undefined
					obj.type = 0.0
					obj.serial = item.serial
					obj.chargeItemTypeCategoryCode = item.chargeItemTypeCategoryCode // 费用的code
					obj.adjustmentPrice = item.adjustmentPrice
					obj.adjustmentCoefficient = item.adjustmentCoefficient
					obj.costPrice = item.costPrice
					obj.basePrice = item.basePrice
					obj.chargeItemName = item.chargeItemName
					obj.chargeModeName = item.chargeModeName
					item.chargeItemColumnAttrDTOList.forEach(v => {
						let key = v.showColumnType

						// 拼接每一个Attr需要展示的内容
						let showValue = []
						v.chargeItemConditionAttrDTOList.forEach(v => {
							showValue.push(this.getColumnVal(v))
						})
						obj[key] = showValue.join('/')
						let index = column.findIndex(item => Number(item.key) === key)
						if (index < 0) {
							column.push({
								key: key + '',
								name: v.showColumnTypeName
							})
						}

						// 如果有收费条件 则显示编辑按钮
						if (key === 2 && v.chargeItemConditionAttrDTOList && v.chargeItemConditionAttrDTOList.length) {
							// 10 —>"枚举"  20—>"范围-值" 21—>"范围-时间" 30—> "DB业务数据" 99 —> "计费单位数值
							// 20 21为范围 则可编辑或看详情
							if (v.chargeItemConditionAttrDTOList[0].conditionAttrValueType === 20 ||
								v.chargeItemConditionAttrDTOList[0].conditionAttrValueType === 21) {
								obj.editBtn = true
							}

						}
					})
					tableData.push(obj)
				})
				this.column = column
				this.tableData = tableData
			},
			deep: true,
			immediate: true
		}
	},
	methods: {
		getColumnVal(conditionAttr) {
			let getSymbolReverseMap = {
				12: '<',
				13: '>',
				14: '<=',
				15: '>='
			}
			let showValue = ''
			if (conditionAttr.attrCategoryType === 1) {
				switch (conditionAttr.conditionAttrValueType) {
					case 10: // 枚举
						// 条件属性
						let arr = []
						conditionAttr.chargeItemConditionValueDTOList.forEach(item => {
							arr.push(item.enumValueName)
						})
						showValue = arr.join('，')
						break
					case 20: // 范围
						let data = conditionAttr.chargeItemConditionValueDTOList[0]
						if (!data) {
							return
						}
						// 当没有起始值时
						if (this.$isEmpty(data.startValue)) {
							showValue += conditionAttr.attributeCdesc
							showValue += data.conditionEndSignTypeName
							showValue += data.endValue
							showValue += data.unitTypeName
						} else if (this.$isEmpty(data.endValue)) {
							// 当没有结束值时
							showValue += conditionAttr.attributeCdesc
							showValue += data.conditionStartSignTypeName
							showValue += data.startValue
							showValue += data.unitTypeName
						} else {
							showValue += data.startValue
							showValue += data.unitTypeName
							showValue += getSymbolReverseMap[data.conditionStartSignType]
							showValue += conditionAttr.attributeCdesc
							showValue += data.conditionEndSignTypeName
							showValue += data.endValue
							showValue += data.unitTypeName
						}
						break
					case 21: // 时间范围
						let dataRange = conditionAttr.chargeItemConditionValueDTOList[0]
						showValue += dataRange.startValue + "-"
						showValue += dataRange.endValue
						break
					case 30: // 业务数据
						let arrB = []
						conditionAttr.chargeItemConditionValueDTOList.forEach(item => {
							arrB.push(item.businessValue)
						})
						showValue = arrB.join('，')
						break
					default:
						showValue = '-'
						break
				}
			} else if (conditionAttr.attrCategoryType === 2) {
				// attrCategoryType 2 表示的是单位值，
				// 99 表示是计费单位
				if (conditionAttr.conditionAttrValueType === 99) {
					showValue = conditionAttr.attributeCdesc
				} else {
					conditionAttr.chargeItemConditionValueDTOList.forEach((item, index) => {
						showValue += (index > 0 ? '/' : '') + item.unitTypeName
					})
				}
			}
			return showValue
		},
		/**
		 * 编辑数据
		 */
		editRowFn(row) {
			let dialogData = []
			this.chargeTypeItem.chargeItemDetailDTOList.forEach(v => {
				// 判断是否是一致的费用
				if (this.compareChargeDiff(row, v)) {
					dialogData.push(v)
				}
			})
			this.currentRow = row
			this.dialogData = dialogData
			this.chargeEditDialogVisible = true
		},
		// 判断是否是一致的费用
		compareChargeDiff(target, current) {
			// 仓储费 有是否非标品之后 后端拓展了 extendInfoMap.group 相等之后的判断
			// 否则还是 费用项相同即可归类为一组
			if (target.extendInfoMap) {
				let rowGroup = target.extendInfoMap.group
				if (!current.extendInfoMap) {
					return false
				}
				let vGroup = current.extendInfoMap.group
				if (current.chargeItemTypeCategoryCode === target.chargeItemTypeCategoryCode && rowGroup === vGroup) {
					return true
				}
			} else {
				if (current.chargeItemTypeCategoryCode === target.chargeItemTypeCategoryCode) {
					return true
				}
			}
			return false
		},
		closeChargeEditDialog() {
			this.chargeEditDialogVisible = false
		},
		changePrice(index, price) {
			let mockData = JSON.parse(JSON.stringify(this.chargeTypeItem.chargeItemDetailDTOList))
			mockData[index].costPrice = price
			this.$emit('update', this.chargeTypeItem.chargeType, mockData)
		},
		updateChargeEditDialog(editData) {
			let mockData = JSON.parse(JSON.stringify(this.chargeTypeItem.chargeItemDetailDTOList))

			// 判断出是区间还是单边范围
			let it = editData[0]
			let IS_BETWEEN = false
			it.chargeItemColumnAttrDTOList.forEach(v => {
				v.chargeItemConditionAttrDTOList = v.chargeItemConditionAttrDTOList || []
				v.chargeItemConditionAttrDTOList.forEach(c => {
					// 区间
					if (c.conditionAttrValueType === 20) {
						// 判断是区间还是单边范围
						c.chargeItemConditionValueDTOList = c.chargeItemConditionValueDTOList || []
						let item = c.chargeItemConditionValueDTOList[0]
						if (item && !this.$isEmpty(item.startValue) && !this.$isEmpty(item.endValue)) {
							IS_BETWEEN = true
						}
					}
				})
			})
			// 当判断出不是区间 则单行替换就行
			if (editData.length === 1 && !IS_BETWEEN) {
				let item = editData[0]
				mockData.forEach((v, index) => {
					if (this.compareChargeDiff(item, v)) {
						mockData[index] = item
					}
				})
			} else {
				let item = editData[0]
				// 判断是否是一致的费用
				// 判断出费用的起始
				let firstIndex = mockData.findIndex(v => this.compareChargeDiff(item, v))
				for (let i = mockData.length - 1; i >= 0; i--) {
					// 判断是否是一致的费用
					// 一致则删除
					if (this.compareChargeDiff(item, mockData[i])) {
						mockData.splice(i, 1)
					}
				}
				mockData.splice(firstIndex, 0, ...editData)
			}
			this.$emit('update', this.chargeTypeItem.chargeType, mockData)
		}
	}
}
</script>

<style scoped lang="less">
.add-info {
	font-size: 14px;
	color: #606266;
}
</style>
