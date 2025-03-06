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
        prop="countryCode"
        :label="$t('packageWarehouse.girdConfig.countryLabel')"
        width="200">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="carrierCode"
        :label="$t('packageWarehouse.girdConfig.carrierLabel')"
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
        prop="area"
        :label="$t('packageWarehouse.girdConfig.areaLabel')"
        width="200">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="queryNumberCode"
        :label="$t('packageWarehouse.girdConfig.queryNumberCode')"
        width="200">
        <template slot-scope="{row}">
          <el-select v-model="row.queryNumberCode" v-show="row.isEdit" size="mini" :placeholder="$t('common.placeholder')">
            <el-option v-for="item in queryNumberCodeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <span v-show="!row.isEdit">{{row.queryNumberCode | filterNumberCode(vm)}}</span>
        </template>
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
  name: 'GirdProductList',
  components: {
    NumberInput
  },
  props: {
    girdProductDTOList: {
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
      tplRow: null,
      queryNumberCodeList: [
        {
          label: this.$t('packageWarehouse.girdConfig.queryNumberCodeList[0]'),
          value: -1
        },
        {
          label: this.$t('packageWarehouse.girdConfig.queryNumberCodeList[1]'),
          value: 1
        },
        {
          label: this.$t('packageWarehouse.girdConfig.queryNumberCodeList[2]'),
          value: 2
        },
        {
          label: this.$t('packageWarehouse.girdConfig.queryNumberCodeList[3]'),
          value: 3
        }
      ]
    }
  },
  computed: {
    girdProductList() {
      if (this.girdProductDTOList.lenght === 0) {
        return []
      } else {
        let dataArr = []
        this.girdProductDTOList.map(v1 => {
          this.productList.map(v2 => {
            if (v1.productId === v2.id) {
              dataArr.push({
                productId: v2.id,
                productCode: v2.productCode,
                productName: v2.productName,
                countryCode: v2.countryCode,
                countryName: v2.countryName,
                carrierCode: JSON.parse(v2.extData).carrierCode,
                productParcelType: v2.productParcelType,
                queryNumberCode: v1.queryNumberCode,
                area: JSON.parse(v2.extData).area,
                girdNo: v1.girdNo,
                isEdit: false
              })
            }
          })
        })
        return dataArr
      }
    }
  },
  watch: {},
  filters: {
    filterNumberCode(code, vm) {
      if (typeof code == 'undefined') {
        return ''
      } else if (code > 0) {
        return vm.$t(`packageWarehouse.girdConfig.queryNumberCodeList[${code}]`)
      } else {
        return vm.$t('packageWarehouse.girdConfig.queryNumberCodeList[0]')
      }
    }
  },
  methods: {
    async getProductList() {
      const res = await getProductListApi()
      if (res && res.ok) {
        this.productList = res.content
      }
    },
    createNewLine() {
      const hasEditRow = this.girdProductList.filter(item => item.isEdit)
      if (hasEditRow.length > 0) {
        this.$message.warning(this.$t('packageWarehouse.girdConfig.saveWarning'))
        return false
      } else {
        let rowData = {
          productId: null,
          productCode: '',
          productName: '',
          countryCode: '',
          countryName: '',
          carrierCode: '',
          productParcelType: '',
          area: '',
          queryNumberCode: '',
          girdNo: '',
          isEdit: true
        }
        this.girdProductList.push(rowData)
      }
    },
    setOtherInfo(index) {
      const rowData = this.girdProductList[index]
      this.productList.map((v, i) => {
        if (v.id === rowData.productId) {
          let newInfo = {
            productId: v.id,
            productCode: v.productCode,
            productName: v.productName,
            countryCode: v.countryCode,
            countryName: v.countryName,
            carrierCode: JSON.parse(v.extData).carrierCode,
            productParcelType: v.productParcelType,
            area: JSON.parse(v.extData).area ? JSON.parse(v.extData).area : '',
            queryNumberCode: rowData.queryNumberCode || '',
            girdNo: rowData.girdNo || '',
            isEdit: true
          }
          this.$set(this.girdProductList, index, newInfo)
        }
      })
    },
    editRow(index) {
      this.tplRow = {...this.girdProductList[index]}
      const _obj = {...this.girdProductList[index]}
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
