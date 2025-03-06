<template>
  <div>
    <el-table :data="girdLocktList">
      <el-table-column
        header-align="center"
        align="center"
        prop="lockType"
        :label="$t('packageWarehouse.girdConfig.lockTypeLabel')"
        width="200">
        <template slot-scope="{row, column, $index}">
          <el-select v-model="row.lockType" v-show="row.isEdit" filterable size="mini" @change="setOtherInfo($index)" :placeholder="$t('common.placeholder')">
            <el-option v-for="item in lockTypeList" :key="item.name + item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
          <span v-show="!row.isEdit">{{row.name}}</span>
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
        prop="lockType"
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
import { getLockTypeListApi, removeLockGridApi } from '@/api/packageWarehouse'
import NumberInput from '@/components/Cargo/NumberInput/NumberInput'
export default {
  name: 'GirdLockList',
  components: {
    NumberInput
  },
  props: {
    girdLockDTOList: {
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
      lockTypeList: [],
      tplRow: null
    }
  },
  computed: {
    girdLocktList() {
      if (this.girdLockDTOList.lenght === 0) {
        return []
      } else {
        let dataArr = []
        this.girdLockDTOList.map(v1 => {
          this.lockTypeList.map(v2 => {
            if (v1.lockType === v2.code) {
              dataArr.push({
                lockType: v2.code,
                name: v2.name,
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
  methods: {
    async getLockTypeList() {
      const res = await getLockTypeListApi()
      if (res && res.ok && res.content) {
        this.lockTypeList = res.content
      }
    },
    createNewLine() {
      const hasEditRow = this.girdLocktList.filter(item => item.isEdit)
      if (hasEditRow.length > 0) {
        this.$message.warning(this.$t('packageWarehouse.girdConfig.saveWarning'))
        return false
      } else {
        let rowData = {
          lockType: null,
          name: '',
          girdNo: '',
          isEdit: true
        }
        this.girdLocktList.push(rowData)
      }
    },
    setOtherInfo(index) {
      const rowData = this.girdLocktList[index]
      this.lockTypeList.map((v, i) => {
        if (v.code === rowData.lockType) {
          let newInfo = {
            lockType: v.code,
            name: v.name,
            girdNo: rowData.girdNo || '',
            isEdit: true
          }
          this.$set(this.girdLocktList, index, newInfo)
        }
      })
    },
    editRow(index) {
      this.tplRow = {...this.girdLocktList[index]}
      const _obj = {...this.girdLocktList[index]}
      _obj.isEdit = true
      this.$set(this.girdLocktList, index, _obj)
    },
    saveRow(obj, index) {
      if (!obj.lockType) {
        this.$message.error(this.$t('packageWarehouse.girdConfig.lockTypeInvalid'))
        return
      } else if (!obj.girdNo) {
        this.$message.error(this.$t('packageWarehouse.girdConfig.girdNoInvalid'))
        return
      } else {
        this.girdLocktList[index].isEdit = false
        this.tplRow = null
      }
    },
    dropEdit(index) {
      // 已有数据取消编辑
      if (this.tplRow) {
        this.$set(this.girdLocktList, index, this.tplRow)
      } else {
        // 新数据取消编辑
        this.girdLocktList.splice(index, 1)
      }
    },
    checkDelete(_index) {
      this.$confirm(this.$t('packageWarehouse.girdConfig.deleteText'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.deleteBtn'),
        cancelButtonText: this.$t('common.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.girdLocktList.splice(_index, 1)
      }).catch(() => {})
    }
  },
  created() {
    this.getLockTypeList()
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
