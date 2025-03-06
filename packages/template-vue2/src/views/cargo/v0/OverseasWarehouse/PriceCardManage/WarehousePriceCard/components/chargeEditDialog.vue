<template>
  <div>
    <el-dialog :visible.sync="visible" :title="$t('warehousePriceCard.edit')" width="600px" :close-on-click-modal="false" @close="closeFn">
      <el-form label-width="90px" label-position="left" :model="formData" ref="formData">
        <div class="module">
          <div class="content-title">{{$t('warehousePriceCard.base_info')}}</div>
          <div class="content-base-item">
            <span>{{$t('warehousePriceCard.charge_item_name')}}：</span>
            <span>{{row.chargeItemName}}</span>
          </div>
          <div v-for="(item,index) in column" :key='index'>
            <div class="content-base-item" v-if="item.key != 2">
              <span>{{item.name}}：</span>
              <span>{{row[item.key]}}</span>
            </div>
          </div>
        </div>
        <div v-if="!IS_BETWEEN">
          <div class="module">
            <div class="content-title">{{$t('warehousePriceCard.charge_condition')}}</div>
            <div class="content-item">
              <span>{{ conditionList[0].attributeCdesc }}</span>
              <span>{{ conditionList[0].conditionStartSignTypeName }}</span>
              <el-input size="mini" v-model="conditionList[0].startValue" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g,'$1')" :disabled="isDetail"></el-input>
              <span>{{ conditionList[0].unitTypeName }}</span>
            </div>
          </div>
          <div class="module">
            <div class="content-title">{{$t('warehousePriceCard.price')}}</div>
            <div class="content-item">
              <span>{{$t('warehousePriceCard.price')}}：</span>
              <el-input size="mini" v-model="conditionList[0].costPrice" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g,'$1')" :disabled="isDetail"></el-input>
            </div>
          </div>
        </div>
        <div v-if="IS_BETWEEN">
          <div class="module">
            <div class="content-title">{{$t('warehousePriceCard.condition_and_mount')}}</div>
            <div class="content-item" v-for="(item, index) in conditionList" :key="index">
              <el-input size="mini" v-model="item.startValue" disabled></el-input>
              <span>{{ item.unitTypeName }}</span>
              <span>
                {{ getSymbolReverseMap[item.conditionStartSignType] }}
              </span>
              <span>{{ item.attributeCdesc }}</span>
              <span v-if="item.conditionEndSignTypeName" >
                <span>{{ item.conditionEndSignTypeName }}</span>
                <el-input size="mini" v-model="item.endValue" @change="endChange(index)" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g,'$1')" :disabled="isDetail"></el-input>
                <span>{{ item.unitTypeName }}</span>
              </span>
              <span v-if="!item.conditionEndSignTypeName" style="width: 145px;height: 10px;"></span>
              <span>{{$t('warehousePriceCard.price')}}</span>
              <el-input size="mini" v-model="item.costPrice" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g,'$1')" :disabled="isDetail"></el-input>
              <i class="icon iconfont icon-minus-circle" v-if="conditionList.length > 1 && !isDetail" @click="removeFn(index)"></i>
              <i class="icon iconfont icon-add-circle" v-if="index == conditionList.length - 1 && !isDetail" @click="addFn"></i>
            </div>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="confirmFn" v-if="!isDetail"> {{$t('warehousePriceCard.confirm')}} </el-button>
        <el-button size="mini" @click="closeFn" v-if="!isDetail"> {{$t('warehousePriceCard.cancel')}} </el-button>
        <el-button type="primary" size="mini" plain @click="closeFn" v-if="isDetail"> {{$t('warehousePriceCard.close')}} </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
	name: 'ChargeEditDialog',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		data: {
			type: Array,
			require: true
		},
		column: {
			type: Array,
			require: true,
			default: function () {
				return []
			}
		},
		row: {
			type: Object,
			require: true,
			default: function () {
				return {}
			}
		},
		isDetail: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			getSymbolReverseMap: {
				12: '<',
				13: '>',
				14: '<=',
				15: '>='
			},
			conditionList: [{}],
			formData: {
				shortname: ''
			},
			copyPre: {},
			IS_BETWEEN: false // 判断是不是区间进行展示
		}
	},
	mounted() {
		let conditionList = []
		// 判断是区间还是单边范围
		let it = this.data[0]
		it.chargeItemColumnAttrDTOList.forEach(v => {
			v.chargeItemConditionAttrDTOList = v.chargeItemConditionAttrDTOList || []
			v.chargeItemConditionAttrDTOList.forEach(c => {
				// 区间
				if (c.conditionAttrValueType === 20) {
					// 判断是区间还是单边范围
					c.chargeItemConditionValueDTOList = c.chargeItemConditionValueDTOList || []
					let item = c.chargeItemConditionValueDTOList[0]
					if (item && !this.$isEmpty(item.startValue) && !this.$isEmpty(item.endValue)) {
						this.IS_BETWEEN = true
					}
				}
			})
		})
		this.data.forEach(function (v) {
			v.chargeItemColumnAttrDTOList.forEach(function (item) {
				if (item.showColumnType === 2) {
					let conditionAttr = item.chargeItemConditionAttrDTOList[0]
					let conditionValue = {
						...conditionAttr.chargeItemConditionValueDTOList[0],
						conditionAttrType: conditionAttr.conditionAttrType,
						attributeCdesc: conditionAttr.attributeCdesc,
						costPrice: v.costPrice
					}
					conditionList.push(conditionValue)
				}
			})
		})
		// 预留到后面删除到最后的区间时候 作复制用
		if (conditionList.length) {
			this.copyPre = conditionList[0]
		}
		this.conditionList = conditionList
	},
	methods: {
		endChange(index) {
			let currentItem = this.conditionList[index]
			let nextItem = this.conditionList[index + 1]
			if (currentItem && nextItem) {
				nextItem.startValue = currentItem.endValue
			}
		},
		removeFn(index) {
			let preItem = this.conditionList[index - 1]
			let nextItem = this.conditionList[index + 1]
			if (preItem && nextItem) {
				nextItem.startValue = preItem.endValue
			}
			this.conditionList.splice(index, 1)
			if (index === 0) {
				this.conditionList[0].startValue = 0
			}
		},
		addFn() {
			let item = this.$extends({}, this.copyPre)
			let conditionList = this.$extends([], this.conditionList)
			item.startValue = ''
			item.endValue = ''
			let lastEndValue = this.conditionList[this.conditionList.length - 1].endValue
			if (lastEndValue) {
				item.startValue = lastEndValue
			}

			// 先把现有的最后赋值上结束值和符号
			let lastIndex = conditionList.length - 1
			let lastItem = conditionList[lastIndex]
			lastItem.conditionEndSignType = item.conditionEndSignType
			lastItem.conditionEndSignTypeName = item.conditionEndSignTypeName
			conditionList[lastIndex] = lastItem

			// 再把新的直接清除结束值和符号
			item.conditionEndSignType = null
			item.conditionEndSignTypeName = ''
			conditionList.push(item)
			this.conditionList = conditionList
		},
		confirmFn() {
			let item = this.data[0]
			let data = []

			let list = this.conditionList
			let valid = true
			for (let index = 0; index < list.length; index++) {
				let editConditionItem = list[index]
				// 先看看每一行是否填写完整
				if (!editConditionItem.endValue && !editConditionItem.startValue) {
					this.$message.error(this.$t('warehousePriceCard.be_cannot_be_null'))
					valid = false
					return false
				}

				// 如果是区间则去校验范围值是否按照大小来的
				if (this.IS_BETWEEN) {
					// 在都有值的情况下 才校验前后值的大小
					if (!this.$isEmpty(editConditionItem.endValue) && !this.$isEmpty(editConditionItem.startValue)) {
						if (Number(editConditionItem.endValue) <= Number(editConditionItem.startValue)) {
							this.$message.error(this.$t('warehousePriceCard.condition_cannot_be_repeat'))
							valid = false
							return false
						}
					}

					// 不是最后一行的取值都拿出来做比较
					if (index < list.length - 1) {
						// 最后一行 如果是空 则不作比较
						if (index + 1 === list.length - 1 && !list[index + 1].endValue) {
							// 不作处理
						} else {
							if (Number(editConditionItem.endValue) > Number(list[index + 1].endValue)) {
								this.$message.error(this.$t('warehousePriceCard.condition_cannot_be_repeat'))
								valid = false
								return false
							}
						}
					}
				}

				let copy = JSON.parse(JSON.stringify(item))
				copy.costPrice = editConditionItem.costPrice
				copy.chargeItemColumnAttrDTOList.forEach(attr => {
					if (attr.showColumnType === 2) {
						let conditionAttr = attr.chargeItemConditionAttrDTOList[0]
						conditionAttr.chargeItemConditionValueDTOList[0] = editConditionItem
					}
				})
				data.push(copy)
			}

			// 验证通过之后
			if (valid) {
				this.closeFn()
				this.$emit('update', data)
			}
		},
		closeFn() {
			this.$emit('close')
		}
	}

}

</script>
<style lang="less" scoped>
.module {
	overflow: hidden;
	margin-bottom: 15px;
}

.content-title {
	font-size: 15px;
	font-weight: 600;
	margin-bottom: 10px;
}

.content-base-item {
	margin-right: 30px;
	float: left;
	margin-bottom: 8px;
}

.content-item {
	margin-bottom: 8px;

	.el-input {
		width: 80px;
	}

	span {
		display: inline-block;
		margin: 0 5px;
	}
}
</style>
