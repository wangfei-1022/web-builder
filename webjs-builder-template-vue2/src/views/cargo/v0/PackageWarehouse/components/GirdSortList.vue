<template>
  <div>
    <el-table :data="girdProductList">
      <el-table-column
        header-align="center"
        align="center"
        prop="productId"
        :label="$t('packageWarehouse.girdConfig.productLabel')"
        width="200">
        <template slot-scope="{row, column, $index}">
          <el-select v-model="row.productId" v-show="row.isEdit" filterable size="mini" @change="setOtherInfo($index)" :placeholder="$t('common.placeholder')">
            <el-option v-for="item in productList" :key="item.id" :label="item.productName" :value="item.id"></el-option>
          </el-select>
          <span v-show="!row.isEdit">{{row.productName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="productId"
        :label="$t('packageWarehouse.girdConfig.batchCodeLabel')"
        width="200">
        <template slot-scope="{row}">
          <el-select v-model="row.sortCode" allow-create v-show="row.isEdit" filterable size="mini" :placeholder="$t('common.placeholder')">
            <el-option v-for="item in row.sortCodeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <!-- <el-input v-model="row.sortCode" v-show="row.isEdit" size="mini"></el-input> -->
          <span v-show="!row.isEdit">{{row.sortCode}}</span>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="countryCode"
        :label="$t('packageWarehouse.girdConfig.countryLabel')"
        width="200">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="productParcelType"
        :label="$t('packageWarehouse.girdConfig.DPTLabel')"
        width="200">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="girdNo"
        :label="$t('packageWarehouse.girdConfig.girdNo')"
        width="200">
        <template slot-scope="{row}">
          <NumberInput
            v-show="row.isEdit"
            v-model.trim="row.girdNo"
            limitType="int"
            :limitRange="{digits: 3, decimal: 0}" />
          <span v-show="!row.isEdit">{{row.girdNo}}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!viewDetail"
        header-align="center"
        align="center"
        prop="productId"
        :label="$t('common.operation')"
        width="200">
        <template slot-scope="{row, column, $index}">
          <el-button type="text" @click="editRow($index)" v-show="!row.isEdit">{{$t('common.editBtn')}}</el-button>
          <el-button type="text" @click="checkDelete($index)" v-show="!row.isEdit">{{$t('common.deleteBtn')}}</el-button>
          <el-button type="text" @click="saveRow(row, $index)" v-show="row.isEdit">{{$t('common.saveBtn')}}</el-button>
          <el-button type="text" @click="dropEdit($index)" v-show="row.isEdit">{{$t('common.cancelBtn')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="text" icon="el-icon-plus" v-show="!viewDetail" @click="createNewLine">{{$t('planManager.addGrid')}}</el-button>
  </div>
</template>
<script>
import { getProductListApi, removeGridApi } from '@/api/packageWarehouse'
import NumberInput from '@/components/Cargo/NumberInput/NumberInput'
export default {
  name: 'GirdSortList',
  components: {
    NumberInput
  },
  props: {
    girdProductSortCodeDTOList: {
      type: Array,
      default: () => []
    },
    viewDetail: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      vm: this,
      productList: [],
      tplRow: null
    }
  },
  computed: {
    girdProductList() {
      if (this.girdProductSortCodeDTOList.lenght === 0) {
        return []
      } else {
        let dataArr = []
        this.girdProductSortCodeDTOList.map(v1 => {
          this.productList.map(v2 => {
            if (v1.productId === v2.id) {
              const _obj = {
                extData: v2.extData,
                sortCodeList: [],
                productId: v2.id,
                productCode: v2.productCode,
                productName: v2.productName,
                countryCode: v2.countryCode,
                countryName: v2.countryName,
                carrierCode: JSON.parse(v2.extData).carrierCode,
                productParcelType: v2.productParcelType,
                sortCode: v1.sortCode,
                girdNo: v1.girdNo,
                isEdit: false
              }

              if (v2.extData.trim().length > 0) {
                const _arr = JSON.parse(JSON.parse(v2.extData).sortCodeList)
                _arr.map(item => {
                  _obj.sortCodeList.push({
                    value: item,
                    label: item
                  })
                })
                if (!_arr.includes(_obj.sortCode)) {
                  _obj.sortCodeList.push({
                    value: _obj.sortCode,
                    label: _obj.sortCode
                  })
                }
              }
              dataArr.push(_obj)
            }
          })
        })
        return dataArr
      }
    }
  },
  watch: {},
  filters: {},
  methods: {
    async getProductList() {
      const res = await getProductListApi()
      if (res && res.ok) {
        this.productList = []
        res.content.map(item => {
          let _extData = {}
          if (item.extData.trim().length > 0) {
            _extData = JSON.parse(item.extData)
          }
          if (typeof _extData.inboundAfterSortFlag !== 'undefined') {
            this.productList.push(item)
          }
        })
      }
    },
    createNewLine() {
      const hasEditRow = this.girdProductList.filter(item => item.isEdit)
      if (hasEditRow.length > 0) {
        this.$message.warning(this.$t('packageWarehouse.girdConfig.saveWarning'))
        return false
      } else {
        let rowData = {
          sortCodeList: [],
          productId: null,
          productCode: '',
          productName: '',
          countryCode: '',
          countryName: '',
          carrierCode: '',
          productParcelType: '',
          sortCode: '',
          girdNo: '',
          isEdit: true
        }
        this.girdProductList.push(rowData)
      }
    },
    setOtherInfo(_index) {
      const rowData = this.girdProductList[_index]
      this.productList.map((v, i) => {
        if (v.id === rowData.productId) {
          let newInfo = {
            sortCodeList: [],
            productId: v.id,
            productCode: v.productCode,
            productName: v.productName,
            countryCode: v.countryCode,
            countryName: v.countryName,
            carrierCode: JSON.parse(v.extData).carrierCode,
            productParcelType: v.productParcelType,
            sortCode: rowData.sortCode || '',
            girdNo: rowData.girdNo || '',
            isEdit: true
          }
          if (v.extData.trim().length > 0) {
            const _arr = JSON.parse(JSON.parse(v.extData).sortCodeList)
            _arr.map(item => {
              newInfo.sortCodeList.push({
                value: item,
                label: item
              })
            })
          }
          this.$set(this.girdProductList, _index, newInfo)
        }
      })
    },
    editRow(index) {
      // 生成分拣码下拉
      const _obj = this.girdProductList[index]
      // 保存原数据
      this.tplRow = {..._obj}
      // 可修改
      _obj.isEdit = true
      this.$set(this.girdProductList, index, _obj)
    },
    saveRow(obj, index) {
      if (!obj.productId) {
        this.$message.error(this.$t('packageWarehouse.girdConfig.productIdInvalid'))
        return
      } else if (!obj.girdNo) {
        this.$message.error(this.$t('packageWarehouse.girdConfig.girdNoInvalid'))
        return
      } else {
        this.girdProductList[index].isEdit = false
        this.tplRow = null
      }
    },
    dropEdit(index) {
      // 已有数据取消编辑
      if (this.tplRow) {
        this.$set(this.girdProductList, index, this.tplRow)
      } else {
        // 新数据取消编辑
        this.girdProductList.splice(index, 1)
      }
    },
    checkDelete(_index) {
      this.$confirm(this.$t('packageWarehouse.girdConfig.deleteText'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.deleteBtn'),
        cancelButtonText: this.$t('common.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.girdProductList.splice(_index, 1)
      }).catch(() => {})
    }
  },
  created() {
    this.getProductList()
  },
  mounted() {}
}
</script>
<style lang="scss" scoped>
.el-form-item__content .el-input-group{
  display: inline-table!important;
}
.table-wrap{
  width: 100%;
  margin-top: 20px;
  border-top: 1px solid #ccc;
}
.required-mark{
  color: red;
}
.required-input{
  width: 90%;
}
</style>
