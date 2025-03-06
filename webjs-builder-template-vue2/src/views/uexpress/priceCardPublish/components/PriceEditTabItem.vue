<template>
  <div>
    <el-table :data="dataList" style="width: 100%" border>
      <el-table-column prop="feeItemName" :label='$t("uexpressPriceCard.feeItem")' ></el-table-column>
      <el-table-column :prop="item.prop" :label="item.label"  v-for="(item, index) in columnList" :key="index">
        <template slot-scope="{row}">
          <span v-if="isDetail">{{row[item.prop]}}</span>
          <el-input v-else v-model="row[item.prop]" size="mini" :disabled="item.disabled"/>
        </template>
      </el-table-column>
      <el-table-column prop="operation" :label='$t("uexpressPriceCard.operation")' v-if="isShowOperation && !isDetail">
        <template slot-scope="{$index}">
          <i class="iconfont icon-add-circle" @click="addFn($index)"/>
          <i class="iconfont icon-minus-circle" @click="removeFn($index)"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { descartes } from "@/utils/index";

export default {
	name: "UexpressPriceCardPublishReceiptPriceEditItem",
  props: {
    isDetail: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    templateChargeItem: {
      type: Object,
      default: function() {
        return {}
      }
    },
    charge: {
      type: Object,
      default: function() {
        return {}
      }
    },
    baseForm: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
	data() {
		return {
      dataList: [],
      columnList: [],
      isShowOperation: false,
      isCheckOunce: false
		};
	},
	created() {
    let dataList = []
    let columnList = []
    // 运费且是英镑
    this.isCheckOunce = this.templateChargeItem.feeItemCode === "TRC" && this.baseForm.unitGroup === 2
    // 30 阶梯
    this.isShowOperation = false
    if (this.templateChargeItem.rowAttributeCommodityInfos) {
      // 40 是布尔的类型
      // 特定场景不需要展示
      // 只需要后续构造此row 对应的行 去输入价格即可
      this.templateChargeItem.rowAttributeCommodityInfos.forEach(v => {
        let label = v.attributeCommodityName
        if (this.isCheckOunce) {
          if (this.templateChargeItem.ounceFlag === true) {
            label += '(' + this.$t("uexpressPriceCard.OUNCE") + ')'
          }
          if (this.templateChargeItem.ounceFlag === false) {
            label += '(' + this.$t("uexpressPriceCard.POUND") + ')'
          }
        }
         if (v.attributeCommodityType !== 40) {
          columnList.push({
            prop: v.attributeCommodityCode,
            label: label,
            isAdditional: true, // 额外的column 如重量 违禁品
            disabled: v.attributeCommodityType === 10 // 固定的枚举 而非 阶梯的话 不可编辑
          })
        }
        if (v.attributeCommodityType === 30) {
          this.isShowOperation = true
        }
      })
    }
    // 构造价格列
    // 没有分区的情况下 增加价格列
    if (this.templateChargeItem.haveNonColumnAttributeCharge) {
      columnList.push({
        prop: 'PRICE',
        label: this.$t("uexpressPriceCard.PRICE")
      })
    }

    // 横向表头拼接
    if (this.templateChargeItem.columnAttributeCommodityInfo) {
      // 拼接表头时候的排序
      let arr = this.templateChargeItem.columnAttributeCommodityInfo.attributeCommoditys.sort(function(a, b) {
        return a.attributeCommodityValueKey.localeCompare(b.attributeCommodityValueKey)
      })
      arr.forEach(v => {
        columnList.push({
          prop: v.attributeCommodityValueKey,
          label: v.attributeCommodityValueDesc,
          expression: {
            attributeCommodityCode: v.attributeCommodityCode,
            attributeCommodityValueDesc: v.attributeCommodityValueDesc,
            attributeCommodityValueKey: v.attributeCommodityValueKey
          }
        })
      })
    }

    let typeArr = []
    // 先看row的界定 其次再看column的界定
    if (this.templateChargeItem.rowAttributeCommodityInfos) {
      this.templateChargeItem.rowAttributeCommodityInfos.forEach(rowItem => {
        typeArr.push(rowItem.attributeCommodityType)
      })
    } else if (this.templateChargeItem.columnAttributeCommodityInfo) {
      typeArr.push(this.templateChargeItem.columnAttributeCommodityInfo.attributeCommodityType) // 偏远分区没有row 只有column
    }
    // 如果没有回显数据 则采用模板构造表格
    if (this.$isEmpty(this.charge)) {
      if (this.templateChargeItem.rowAttributeCommodityInfos) {
        let list = []
        let target = {
          expression: [],
          feeItemCode: this.templateChargeItem.feeItemCode,
          feeItemName: this.templateChargeItem.feeItemName
        }
        this.templateChargeItem.rowAttributeCommodityInfos.forEach(v => {
          if (v.attributeCommoditys.length) {
            list.push(v.attributeCommoditys)
          } else {
            list.push([{
              attributeCommodityCode: v.attributeCommodityCode,
              attributeCommodityValueDesc: v.attributeCommodityValueDesc
            }])
          }

          if (v.attributeCommodityType === 10 || v.attributeCommodityType === 30) {
            // 重量那一列
            target[v.attributeCommodityCode] = v.attributeCommodityValueDesc
          } else if (v.attributeCommodityType === 40) {
            target.PRICE = ''
          }
        })

        let descartesList = descartes(list)
        descartesList.forEach(descartesItem => {
          let expression = []
          descartesItem.forEach(v => {
            expression.push({
              attributeCommodityCode: v.attributeCommodityCode,
              attributeCommodityValueDesc: v.attributeCommodityValueDesc,
              attributeCommodityValueKey: v.attributeCommodityValueKey
            })

            if (v.attributeCommodityType === 10) {
              // 违禁品罚金那一列默认值回显
              target[v.attributeCommodityCode] = v.attributeCommodityValueDesc
            }
          })
          target.expression = expression

          dataList.push({
            ...target
          })
        })
      } else {
        dataList.push({
          feeItemCode: this.templateChargeItem.feeItemCode,
          feeItemName: this.templateChargeItem.feeItemName
        })
      }
    } else {
      // 如果有回显数据
      let chargePrices = this.charge.chargePrices
      // 如果是阶梯的返回值 则进行排序
      this.templateChargeItem.rowAttributeCommodityInfos.forEach(v => {
        if (v.attributeCommodityType === 30) {
          chargePrices.sort(function(a, b) {
            let indexA = a.rowAttributeCommodityValues.findIndex(xx => xx.attributeCommodityType === 30)
            let indexB = b.rowAttributeCommodityValues.findIndex(xx => xx.attributeCommodityType === 30)
            if (indexA >= 0 && indexB >= 0) {
              return a.rowAttributeCommodityValues[indexA].seqNo - b.rowAttributeCommodityValues[indexB].seqNo
            } else {
              return false
            }
          })
        }
      })

      chargePrices.forEach(v => {
        // FIND
        // 判断这个row 有木有被构建进data里去
        let index = dataList.findIndex(list => {
          let expression = []
          v.rowAttributeCommodityValues.forEach(xx => {
            expression.push({
              attributeCommodityCode: xx.attributeCommodityCode,
              attributeCommodityValueDesc: xx.attributeCommodityValueDesc,
              attributeCommodityValueKey: xx.attributeCommodityValueKey
            })
          })
          return JSON.stringify(list.expression) === JSON.stringify(expression)
        })
        // 如果找到这个已经存在的row组成的行信息，则不用构造重量阶梯了。直接添加对应的分区映射价格即可
        let dataItem = null
        if (index >= 0) {
          // 如果找到这个已经存在的row组成的行信息，
          dataItem = dataList[index]
        } else {
          if (v.rowAttributeCommodityValues) {
            let expression = []
            dataItem = {
              expression: [],
              feeItemCode: this.charge.feeItemCode,
              feeItemName: this.charge.feeItemName
            }
            v.rowAttributeCommodityValues.forEach(xxxx => {
              if (xxxx.attributeCommodityType === 10 || xxxx.attributeCommodityType === 30) {
                // 构建重量 违禁品罚金的值
                dataItem[xxxx.attributeCommodityCode] = xxxx.attributeCommodityValueDesc
              }
              expression.push({
                attributeCommodityCode: xxxx.attributeCommodityCode,
                attributeCommodityValueDesc: xxxx.attributeCommodityValueDesc,
                attributeCommodityValueKey: xxxx.attributeCommodityValueKey
              })
            })
            dataItem.expression = expression
          } else {
            dataItem = {
              feeItemCode: this.charge.feeItemCode,
              feeItemName: this.charge.feeItemName
            }
          }
        }

        // 存在对应的column 如分区 -针对横向的价格 单独处理的
        if (v.columnAttributeCommodityValue) {
          dataItem[v.columnAttributeCommodityValue.attributeCommodityValueKey] = v.price
        } else {
          // 否则 则给到默认的PRICE
          dataItem.PRICE = v.price
        }
        if (index >= 0) {
          dataList[index] = dataItem
        } else {
          dataList.push(dataItem)
        }
      })
    }
    this.columnList = columnList
    this.dataList = dataList
  },
	methods: {
    addFn(index) {
      let item = {
        feeItemCode: this.templateChargeItem.feeItemCode,
        feeItemName: this.templateChargeItem.feeItemName
      }
      item.expression = this.$extends(true, [], this.dataList[index].expression)
      this.dataList.splice(index + 1, 0, item)
    },
    removeFn(index) {
      this.dataList.splice(index, 1)
    },
    validateStepValue() {
      let valid = true

      // 对于阶梯增加的校验
      // 非阶梯则可直接返回true
      let EXIT = false
      this.templateChargeItem.rowAttributeCommodityInfos.forEach(v => {
        if (v.attributeCommodityType === 30) {
          EXIT = true
        }
      })
      if (!EXIT) {
        return true
      }

      let reg = /^(?:[0-9]+(\.[0-9]+)?-[0-9]+(\.[0-9]+)?(\/(?:[0-9]+(\.[0-9]+)?\^[0-9]+(\.[0-9]+)?|[0-9]+(\.[0-9]+)?(\+)?))?|min|max)$/
      let arr = ['min', 'max']
      // 取出阶梯属性值
      let prop = this.columnList[0].prop

      // 检测单项的格式和其中假如是min和max的位置的合理性
      const checkItem = (value, position) => {
        let v = true
        if (!reg.test(value)) {
          // 输入格式错误
          this.$message.error(this.$t('uexpressPriceCard.priceInputWarningError', {feeItemName: this.templateChargeItem.feeItemName}))
          v = false
        }
        // 包含了min 或者 max (观测min和max所在的位置是否合理)
        if (arr.indexOf(value) >= 0) {
          // 观测其上 或者 其下面是否都是min或者max
          let leftValid = true
          for (let index = 0; index < position; index++) {
            let item = this.dataList[index]
            let value = String(item[prop]).toLocaleLowerCase()
            if (arr.indexOf(value) < 0) {
              leftValid = false
              break;
            }
          }
          let rightValid = true
          for (let index = position + 1; index < this.dataList.length; index++) {
            let item = this.dataList[index]
            let value = String(item[prop]).toLocaleLowerCase()
            if (arr.indexOf(value) < 0) {
              rightValid = false
              break;
            }
          }
          // 说明min或者max处于中间
          if (!leftValid && !rightValid) {
            this.$message.error(this.$t('uexpressPriceCard.priceInputWarningPositionError', {feeItemName: this.templateChargeItem.feeItemName}))
            v = false
          }
        }
        return v
      }

      for (let index = 0, len = this.dataList.length; index < len; index++) {
        let item = this.dataList[index]
        let value = String(item[prop]).toLocaleLowerCase()
        if (!checkItem(value, index)) {
          valid = false
          break;
        }

        let end = value.split('/')[0].split('-')[1]
        let start = value.split('/')[0].split('-')[0]
        if (index === 0 && start > 0) {
          // 重量必须从0开始 ESIT-21231
          this.$message.error(this.$t('uexpressPriceCard.priceInputWarningStartZero', {feeItemName: this.templateChargeItem.feeItemName}))
          valid = false
          break;
        }
        if(this.isCheckOunce && this.templateChargeItem.ounceFlag === true && end > 16) {
          // 运费 盎司 最大不能超过16
          this.$message.error(this.$t('uexpressPriceCard.ounceError1', {feeItemName: this.templateChargeItem.feeItemName}))
          valid = false
          break;
        }

        if (this.isCheckOunce && this.templateChargeItem.ounceFlag === false && start < 1) {
          // 运费 磅 最小不能小于1
          this.$message.error(this.$t('uexpressPriceCard.ounceError2', {feeItemName: this.templateChargeItem.feeItemName}))
          valid = false
          break;
        }

        // 获取其下一行进行对比
        let nextIndex = index + 1
        let nextItem = null
        let nextValue = null
        if (len - 1 >= nextIndex) {
          nextItem = this.dataList[nextIndex]
          nextValue = String(nextItem[prop]).toLocaleLowerCase()
          if (!checkItem(nextValue, nextIndex)) {
            valid = false
            break;
          }
        }

        if (value && nextValue && arr.indexOf(value) < 0 && arr.indexOf(nextValue) < 0) {
          // 存在下一行与当前行进行对比
          let firstEnd = value.split('/')[0].split('-')[1]
          let secondStart = nextValue.split('-')[0]

          if (firstEnd !== secondStart) {
            // 重量段不能重复，且重量段不能缺失，否则会找不到报价
            this.$message.error(this.$t('uexpressPriceCard.priceInputWarningStepError', {feeItemName: this.templateChargeItem.feeItemName}))
            valid = false
            break;
          }
        }
      }
      return valid
    },
    validate() {
      let valid = true
      this.dataList.forEach(item => {
        // 校验所有的动态输入列 是否填写值了
        this.columnList.forEach(column => {
          // 输入了价格 则收集对应的数据
          if (item[column.prop] === '' || item[column.prop] === undefined || item[column.prop] === null) {
            valid = false
          }
        })
      })
      if (!valid) {
        // '请先完整填写' + this.templateChargeItem.feeItemName + '的价格！'
        this.$message.error(this.$t('uexpressPriceCard.priceInputWarning', {feeItemName: this.templateChargeItem.feeItemName}))
        return false
      }

      // 阶梯的校验
      valid = this.validateStepValue()
      return valid
    },
    getValue() {
      let list = []
      this.dataList.forEach(item => {
        let matchExpressions = []
        this.templateChargeItem.rowAttributeCommodityInfos.forEach(v => {
          // 找到那一行的属性
          let index = item.expression.findIndex(xx => xx.attributeCommodityCode === v.attributeCommodityCode)
          if (index >= 0) {
            item.expression[index].attributeCommodityValueDesc = item[v.attributeCommodityCode]
          }
        })
        matchExpressions.push(...item.expression)

        this.columnList.forEach(column => {
          let columnExpression = []
          columnExpression = columnExpression.concat(matchExpressions)
          // 如果是阶梯的则过滤掉对应的阶梯列横向展示的
          if (!column.isAdditional) {
            // 输入了价格 则收集对应的数据
            if (item[column.prop] !== undefined && item[column.prop] !== null && item[column.prop] !== '') {
              column.expression && columnExpression.push(column.expression)
              list.push({
                price: item[column.prop],
                matchExpressions: columnExpression
              })
            }
          }
        })
      })
      return {
        templateChargeId: this.templateChargeItem.templateChargeId,
        chargePrices: list
      }
    }
  }
};
</script>
<style scoped lang="scss">
.icon-add-circle,
.icon-minus-circle {
	color: #1890ff;
	font-size: 24px;
	margin-left: 10px;
}
</style>
