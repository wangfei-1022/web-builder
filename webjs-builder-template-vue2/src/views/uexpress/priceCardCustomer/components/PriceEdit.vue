<template>
  <div>
    <el-table :data="dataList" style="width: 100%" border>
      <el-table-column prop="productName" :label='$t("uexpressPriceCard.productName")' min-width="220"></el-table-column>
      <el-table-column prop="destinationCountryName" :label='$t("uexpressPriceCard.destinationCountry")' min-width="180"></el-table-column>
      <el-table-column prop="feeItemName" :label='$t("uexpressPriceCard.feeItem")' min-width="120"></el-table-column>
      <el-table-column :prop="item.prop" :label="item.label" min-width="130" v-for="(item, index) in columnList" :key="index">
        <template slot-scope="{row}">
          <span v-if="isDetail">{{row[item.prop]}}</span>
          <el-input v-else v-model="row[item.prop]" size="mini" />
        </template>
      </el-table-column>
      <el-table-column prop="operation" :label='$t("uexpressPriceCard.operation")' min-width="100" fixed="right" v-if="!isDetail">
        <template slot-scope="{row, $index}">
          <i class="iconfont icon-add-circle" @click="addFn(row, $index)" />
          <i class="iconfont icon-minus-circle" @click="removeFn($index)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>

export default {
	name: "PriceEdit",
	components: {

	},
  props: {
    isDetail: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    detail: {
      type: Object,
      default: function() {
        return []
      }
    }
  },
	data() {
		return {
      dataList: [],
      columnList: []
		};
	},
  watch: {
    detail: {
      handler(val) {
        this.init()
      },
      deep: true,
      immediate: true
    }
  },
	created() {

  },
	methods: {
    init() {
      let val = this.detail
      if (val.offerVersionId) {
        let columnList = []
        if (val.columnOtherAttributeCommodityInfos) {
          val.columnOtherAttributeCommodityInfos.forEach(v => {
            columnList.push({
              prop: v.attributeCommodityCode,
              label: v.attributeCommodityName
            })
          })
        }

        // 构造价格列
        if (val.haveNonColumnAttributeCharge) {
          columnList.push({
            prop: 'PRICE',
            label: this.$t("uexpressPriceCard.PRICE")
          })
        }
        if (val.columnAttributeCommodityInfo && val.columnAttributeCommodityInfo.attributeCommoditys) {
          val.columnAttributeCommodityInfo.attributeCommoditys.forEach(column => {
            columnList.push({
              prop: column.attributeCommodityValueKey,
              label: column.attributeCommodityValueDesc,
              expression: {
                attributeCommodityCode: column.attributeCommodityCode,
                attributeCommodityValueDesc: column.attributeCommodityValueDesc,
                attributeCommodityValueKey: column.attributeCommodityValueKey
              }
            })
          })
        }

        this.columnList = columnList

        let dataList = []
        val.charges.forEach(v => {
          let target = {
            ...v
          }
          let expression = []
          if (v.rowAttributeCommodityValue) {
            expression.push({
              attributeCommodityType: v.rowAttributeCommodityValue.attributeCommodityType,
              attributeCommodityCode: v.rowAttributeCommodityValue.attributeCommodityCode,
              attributeCommodityValueDesc: v.rowAttributeCommodityValue.attributeCommodityValueDesc,
              attributeCommodityValueKey: v.rowAttributeCommodityValue.attributeCommodityValueKey
            })
          }
          target.expression = expression
          v.chargePrices.forEach(item => {
            // 如果存在对应的Column条件 则说明有分区这样的设置
            // 否则则是固定的价格列 // PRICE
            if (item.columnAttributeCommodityValue) {
              target[item.columnAttributeCommodityValue.attributeCommodityValueKey] = item.price
            } else {
              target.PRICE = item.price
            }
          })
          if (v.rowAttributeCommodityValue) {
            target[v.rowAttributeCommodityValue.attributeCommodityCode] = v.rowAttributeCommodityValue.attributeCommodityValueDesc
          }
          dataList.push(target)
        })
        this.dataList = dataList
      }
    },
    addFn(row, index) {
      let item = {
        ...row
      }
      this.dataList.splice(index, 0, item)
    },
    removeFn(index) {
      this.dataList.splice(index, 1)
    },
    getValue() {
      let list = []
      this.dataList.forEach(item => {
        let dataItem = {
          templateChargeId: item.templateChargeId,
          productCode: item.productCode,
          destinationCountryCode: item.destinationCountryCode
        }
        let chargeList = []
        let matchExpressions = []
        if (item.expression) {
          // 把重量阶梯的输入值 描述到attributeCommodityValueDesc
          item.expression.forEach(expressionItem => {
            let index = this.detail.columnOtherAttributeCommodityInfos.findIndex(e => expressionItem.attributeCommodityCode === e.attributeCommodityCode)
            if (index >= 0) {
              expressionItem.attributeCommodityValueDesc = item[expressionItem.attributeCommodityCode]
            }
          })
          // item.expression.attributeCommodityValueDesc = item[this.templateChargeItem.rowAttributeCommodityInfo.attributeCommodityCode]
          matchExpressions = matchExpressions.concat(item.expression)
        }

        this.columnList.forEach(column => {
          // 输入的价格有值的情况下则处理收集数据
          if (item[column.prop] !== undefined && item[column.prop] !== null && item[column.prop] !== '') {
            let columnExpression = []
            columnExpression = matchExpressions.concat()
            // 此为排除第一列 如重量阶段这样的 或者是 申报价值
            // 假如存在的话
            let index = this.detail.columnOtherAttributeCommodityInfos.findIndex(item => column.prop === item.attributeCommodityCode)
            if (index < 0) {
              column.expression && columnExpression.push(column.expression)
              chargeList.push({
                price: item[column.prop],
                matchExpressions: columnExpression
              })
            }
          }
        })
        dataItem.chargePrices = JSON.parse(JSON.stringify(chargeList))
        list.push(dataItem)
      })
      return list
    },
    validate() {
      let VALID = true
      let groupArr = []
      this.dataList.forEach(v => {
        // 同一条线路和同一条产品
        let index = groupArr.findIndex(item => item.templateChargeId === v.templateChargeId && item.productCode === v.productCode)
        if (index < 0) {
          groupArr.push({
            rowAttributeCommodityValue: v.rowAttributeCommodityValue,
            feeItemCode: v.feeItemCode,
            feeItemName: v.feeItemName,
            templateChargeId: v.templateChargeId,
            productCode: v.productCode,
            productName: v.productName,
            chargeList: [v]
          })
        } else {
          groupArr[index].chargeList.push(v)
        }
      })

      groupArr.forEach(chargeGroup => {
        // 对于阶梯增加的校验
        if (chargeGroup.rowAttributeCommodityValue && chargeGroup.rowAttributeCommodityValue.attributeCommodityType === 30) {
          let valid = this.validateStepValue(chargeGroup, chargeGroup.rowAttributeCommodityValue.attributeCommodityCode)
          if (!valid) {
           VALID = false
          }
        }
      })
      return VALID
    },
    validateStepValue(chargeGroup, prop) {
      let chargeList = chargeGroup.chargeList
      let valid = true

      let reg = /^(?:[0-9]+(\.[0-9]+)?-[0-9]+(\.[0-9]+)?(\/(?:[0-9]+(\.[0-9]+)?\^[0-9]+(\.[0-9]+)?|[0-9]+(\.[0-9]+)?(\+)?))?|min|max)$/
      let arr = ['min', 'max']
      // 取出阶梯属性值

      // 检测单项的格式和其中假如是min和max的位置的合理性
      const checkItem = (value, position) => {
        let v = true
        if (!reg.test(value)) {
          // 输入格式错误
          this.$message.error(this.$t('uexpressPriceCard.customerPriceInputWarningError', {feeItemName: chargeGroup.feeItemName, productName: chargeGroup.productName}))
          v = false
        }
        // 包含了min 或者 max (观测min和max所在的位置是否合理)
        if (arr.indexOf(value) >= 0) {
          // 观测其上 或者 其下面是否都是min或者max
          let leftValid = true
          for (let index = 0; index < position; index++) {
            let item = chargeList[index]
            let value = String(item[prop]).toLocaleLowerCase()
            if (arr.indexOf(value) < 0) {
              leftValid = false
              break;
            }
          }
          let rightValid = true
          for (let index = position + 1; index < chargeList.length; index++) {
            let item = chargeList[index]
            let value = String(item[prop]).toLocaleLowerCase()
            if (arr.indexOf(value) < 0) {
              rightValid = false
              break;
            }
          }
          // 说明min或者max处于中间
          if (!leftValid && !rightValid) {
            this.$message.error(this.$t('uexpressPriceCard.customerPriceInputWarningPositionError', {feeItemName: chargeGroup.feeItemName, productName: chargeGroup.productName}))
            v = false
          }
        }
        return v
      }

      for (let index = 0, len = chargeList.length; index < len; index++) {
        let item = chargeList[index]
        let value = String(item[prop]).toLocaleLowerCase()
        if (!checkItem(value, index)) {
          valid = false
          break;
        }

        // 获取其下一行进行对比
        let nextIndex = index + 1
        let nextItem = null
        let nextValue = null
        if (len - 1 >= nextIndex) {
          nextItem = chargeList[nextIndex]
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
            this.$message.error(this.$t('uexpressPriceCard.customerPriceInputWarningStepError', {feeItemName: chargeGroup.feeItemName, productName: chargeGroup.productName}))
            valid = false
            break;
          }
        }
      }
      return valid
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
