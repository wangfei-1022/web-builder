<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="serial" :label="$t('seaProduct.index')" width="50"></el-table-column>
      <el-table-column prop="chargeItemName" :label="$t('seaProduct.charge_item_name')" width="150"></el-table-column>
      <el-table-column prop="chargeItemCurrency" :label="$t('seaProduct.currency')" width="150"></el-table-column>
      <el-table-column v-for="item in column" :key="item.key" :prop="item.key" :label="item.name"></el-table-column>
      <el-table-column prop="chargeModeName" :label="$t('seaProduct.charge_mode_name')" width="100"></el-table-column>
      <el-table-column prop="price" :label="$t('seaProduct.price')" width="100">
        <template slot-scope="{ row, $index }">
          <el-input v-if="!isDetail" v-model="row.price" :placeholder="$t('seaProduct.please_enter')" size="mini"
            @change="changePrice($index, $event)"
            v-input-limit="[-9, 2]"
           ></el-input>
          <span v-if="isDetail">{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" :label="$t('seaProduct.operation')">
        <template slot-scope="{ $index }" v-if="!isDetail">
          <i class="iconfont icon-minus-circle" v-if="tableData.length > 1" @click="deleteFn($index)"></i>
          <i class="iconfont icon-add-circle" v-if="$index == 0" @click="addFn($index)"></i>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog :visible.sync="visibleDel" :title="$t('seaProduct.recover')" width="980px" :close-on-click-modal="false"
      @close="closeFn">
      <el-table :data="delTableList" style="width: 100%">
        <el-table-column prop="serial" :label="$t('seaProduct.index')" width="50"></el-table-column>
        <el-table-column prop="chargeItemName" :label="$t('seaProduct.charge_item_name')" width="150"></el-table-column>
        <el-table-column prop="chargeItemCurrency" :label="$t('seaProduct.currency')" width="150"></el-table-column>
        <el-table-column v-for="item in column" :key="item.key" :prop="item.key" :label="item.name"></el-table-column>
        <el-table-column prop="chargeModeName" :label="$t('seaProduct.charge_mode_name')" width="100"></el-table-column>
        <el-table-column prop="price" :label="$t('seaProduct.price')" width="100">
        </el-table-column>
        <el-table-column prop="address" :label="$t('seaProduct.operation')">
          <template slot-scope="{ $index }">
            <el-button type="text" size="mini" @click="recover($index)">
              {{ $t('seaProduct.recover') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
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
    categoryId: [String, Number],
    chargeTypeItem: {
      type: Object,
      default: function () {
        return {}
      }
    },
    chargeTypeTemplate: {
      type: Object,
      default: function () {
        return {}
      }
    },
    isDetail: Boolean
  },
  data () {
    return {
      visibleDel: false,
      delTableList: [],
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
      handler (val, oldVal) {
        let column = []
        let tableData = []
        let data = val.chargeItemDetailDTOList || []
        data.forEach(item => {
          let obj = {}
          obj.serial = item.serial
          obj.id = item.id
          obj.carrierCodeList = item.carrierCodeList
          obj.chargeItemCode = item.chargeItemCode

          obj.chargeItemColumnAttrDTOList = item.chargeItemColumnAttrDTOList
          obj.chargeItemName = item.chargeItemName
          obj.chargeItemCurrency = 'USD'
          obj.price = item.price
          obj.chargeItemTypeId = item.chargeItemTypeId
          obj.chargeMode = item.chargeMode
          obj.chargeModeName = item.chargeModeName
          // 业务限制 (箱型)
          obj.cubeType = ""
          // 收费条件信息 (箱型)
          obj.chargeConditions = ""
          item.chargeItemColumnAttrDTOList.forEach(v => {
            let key = v.showColumnType

            // 拼接每一个Attr需要展示的内容
            let showValue = []
            v.chargeItemConditionAttrDTOList.forEach(v => {
              showValue.push(this.getColumnVal(v))
            })
            obj[key] = showValue.join('/')
            // 业务限制 (箱型)
            if (v.showColumnType === 3) {
              obj.cubeType = showValue.join('/')
            }
            // 满足计费 且 收费条件5
            if (item.chargeMode === 20 && v.showColumnType === 5 && v.chargeItemConditionAttrDTOList.length > 0) {
              v.chargeItemConditionAttrDTOList[0].chargeItemConditionValueDTOList.forEach(v => {
                obj.chargeConditions += v.startValue.toString() + v.endValue.toString()
              })
            }
            let index = column.findIndex(item => Number(item.key) === key)
            if (index < 0) {
              column.push({
                key: key + '',
                name: v.showColumnTypeName
              })
            }

            // 如果有收费条件 则显示编辑按钮
            if (key === 5 && v.chargeItemConditionAttrDTOList && v.chargeItemConditionAttrDTOList.length) {
              // 10 —>"枚举"  20—>"范围-值" 21—>"范围-时间" 30—> "DB业务数据" 99 —> "计费单位数值
              // 20 21为范围 则可编辑或看详情
              if (v.chargeItemConditionAttrDTOList[0].conditionAttrValueType === 20 ||
                v.chargeItemConditionAttrDTOList[0].conditionAttrValueType === 21) {
                obj.editBtn = true
              }

            }
          })
          // 唯一组装：费用code + 计费方式(正常、满足) + 业务限制（箱型）+ 收费条件信息
          obj.unique = item.chargeItemCode + item.chargeMode + obj.cubeType + obj.chargeConditions
          tableData.push(obj)
        })
        this.column = column
        this.tableData = tableData
        this.tableData.sort((a, b) => a.serial - b.serial)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 删除数据
    diff () {
      this.delTableList = []
      let TemData = []
      let data = this.chargeTypeTemplate.chargeItemDetailDTOList || []
      data.forEach(item => {
        let obj = {}
        obj.serial = item.serial
        obj.id = item.id
        obj.carrierCodeList = item.carrierCodeList
        obj.chargeItemCode = item.chargeItemCode

        obj.chargeItemColumnAttrDTOList = item.chargeItemColumnAttrDTOList
        obj.chargeItemName = item.chargeItemName
        obj.chargeItemCurrency = 'USD'
        obj.price = item.price
        obj.chargeItemTypeId = item.chargeItemTypeId
        obj.chargeMode = item.chargeMode
        obj.chargeModeName = item.chargeModeName
        // 业务限制 (箱型)
        obj.cubeType = ""
        // 收费条件信息 (箱型)
        obj.chargeConditions = ""
        item.chargeItemColumnAttrDTOList.forEach(v => {
          let key = v.showColumnType

          // 拼接每一个Attr需要展示的内容
          let showValue = []
          v.chargeItemConditionAttrDTOList.forEach(v => {
            showValue.push(this.getColumnVal(v))
          })
          obj[key] = showValue.join('/')
          // 业务限制 (箱型)
          if (v.showColumnType === 3) {
            obj.cubeType = showValue.join('/')
          }
          // 满足计费 且 收费条件5
          if (item.chargeMode === 20 && v.showColumnType === 5 && v.chargeItemConditionAttrDTOList.length > 0) {
            v.chargeItemConditionAttrDTOList[0].chargeItemConditionValueDTOList.forEach(v => {
              obj.chargeConditions += v.startValue.toString() + v.endValue.toString()
            })
          }
          // 如果有收费条件 则显示编辑按钮
          if (key === 5 && v.chargeItemConditionAttrDTOList && v.chargeItemConditionAttrDTOList.length) {
            // 10 —>"枚举"  20—>"范围-值" 21—>"范围-时间" 30—> "DB业务数据" 99 —> "计费单位数值
            // 20 21为范围 则可编辑或看详情
            if (v.chargeItemConditionAttrDTOList[0].conditionAttrValueType === 20 ||
              v.chargeItemConditionAttrDTOList[0].conditionAttrValueType === 21) {
              obj.editBtn = true
            }

          }
        })
        // 唯一组装：费用code + 计费方式(正常、满足) + 业务限制（箱型）+ 收费条件信息
        obj.unique = item.chargeItemCode + item.chargeMode + obj.cubeType + obj.chargeConditions
        TemData.push(obj)
      })
      let delTable = TemData.filter(v => this.tableData.every(val => val.unique !== v.unique))
      this.delTableList = delTable
    },
    recover (index) {
      this.tableData.push(this.delTableList[index])
      this.tableData.sort((a, b) => a.serial - b.serial)
      this.delTableList.splice(index, 1)
      this.$emit('update', this.tableData, this.categoryId)
    },
    closeFn () {
      this.visibleDel = false
    },
    deleteFn (index) {
      // this.delTableList.push(this.tableData[index])
      // this.delTableList.sort((a, b) => a.serial - b.serial)
      this.tableData.splice(index, 1)

      this.$emit('update', this.tableData, this.categoryId)

    },
    addFn () {
      this.diff()
      this.visibleDel = true
    },
    getColumnVal (conditionAttr) {
      let getSymbolReverseMap = {
        12: '<',
        13: '>',
        14: '>=',
        15: '<='
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
              // data.conditionEndSignTypeName
              showValue += getSymbolReverseMap[data.conditionEndSignType]
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
              arrB.push(item.enumValueName)
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
          showValue = conditionAttr.attributeCdesc
          // conditionAttr.chargeItemConditionAttrDTOList[0].chargeItemConditionValueDTOList.forEach((item, index) => {
          //   showValue += (index > 0 ? '/' : '') + item.unitTypeName
          // })
        }
      }
      return showValue
    },

    closeChargeEditDialog () {
      this.chargeEditDialogVisible = false
    },
    changePrice (index, price) {
      let mockData = this.chargeTypeItem.chargeItemDetailDTOList
      mockData[index].price = price
      this.$emit('update', this.tableData, this.categoryId)
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
