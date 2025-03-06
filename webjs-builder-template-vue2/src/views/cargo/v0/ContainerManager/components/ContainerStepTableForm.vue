<template>
  <div class="form-wrap">
    <div class="line-info-wrap">
      <el-table id="containerStepList" :data="containerStepList" :class="['task-table', {'invalidated': tableDataError}]">
        <el-table-column v-for="(v, i) in infoTableFileds" :key="`item-${i}`" :prop="v.field" :width="v.width" header-align="center" align="center">
          <template slot="header">
            <span class="required-header-text" v-if="v.required">*</span>
            <span>{{v.title}}</span>
          </template>
          <template slot-scope="scope">
            <template v-if="scope.row.isModify">
              <template v-if="v.field === 'containerType'">
                <el-select
                  v-model="scope.row[v.field]"
                  filterable
                  reserve-keyword
                  size="mini">
                  <el-option
                    v-for="item in containerTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
              <template v-else-if="v.field === 'dateRange'">
                <el-row :gutter="4">
                  <el-col :span="10">
                    <NumberInput v-model="scope.row.startDate" limitType="int" :limitRange="{digits: 4, decimal: 0}" @keyup.enter.native="saveContainer(scope.row, scope.$index)"></NumberInput>
                  </el-col>
                  <el-col :span="2">-</el-col>
                  <el-col :span="10">
                    <NumberInput v-model="scope.row.endDate" limitType="int" :limitRange="{digits: 4, decimal: 0}" @keyup.enter.native="saveContainer(scope.row, scope.$index)"></NumberInput>
                  </el-col>
                </el-row>
              </template>
              <template v-else>
                <NumberInput v-model="scope.row[v.field]" limitType="decimal" :limitRange="{digits: 4, decimal: 2}" @keyup.enter.native="saveContainer(scope.row, scope.$index)"></NumberInput>
              </template>
            </template>
            <template v-else>
              <span v-if="v.field === 'dateRange'">
                {{scope.row.startDate}} - {{scope.row.endDate}}
              </span>
              <span v-else>{{scope.row[v.field]}}</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.operation')" width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="modifyContainer(scope.$index)" v-show="!scope.row.isModify" :disabled="$parent.viewDetail">{{$t('common.editBtn')}}</el-button>
            <el-button type="text" @click="saveContainer(scope.row, scope.$index)" v-show="scope.row.isModify">{{$t('common.saveBtn')}}</el-button>
            <el-button type="text" @click="cancelContainer(scope.$index)" v-show="scope.row.isModify">{{$t('common.cancelBtn')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="error-tips" v-show="tableDataError">
        {{tableErrorMessage}}
      </div>
      <el-button type="text" @click="createNewInfo" :disabled="noneList" v-show="!$parent.viewDetail">+{{$t('containerManager.orderDetail.createContainerType')}}</el-button>
    </div>
  </div>
</template>
<script>
  import Bus from '@/utils/eventBus.js'
  import NumberInput from '@/components/Cargo/NumberInput/NumberInput'
  export default {
    name: 'ContainerStepForm',
    components: {
      NumberInput
    },
    data() {
      return {
        vm: this,
        containerTypeList: [],
        containerStepList: [],
        orderContainerCharges: [],
        tableErrorMessage: '',
        tableDataError: false,
        infoTableFileds: [
          {field: 'containerType', title: this.$t('containerManager.containerType'), width: 220, required: true},
          {field: 'dateRange', title: this.$t('containerManager.orderDetail.timeRange'), width: 220, required: true},
          {field: 'charge', title: this.$t('containerManager.orderDetail.rate'), width: 220, required: true}
        ],
        timeout: null
      }
    },
    watch: {
    },
    computed: {
      noneList: function() {
        return this.containerTypeList.length === 0
      }
    },
    methods: {
      setList(arr) {
        this.orderContainerCharges = arr
        this.containerStepList = []
        arr.forEach(item => {
          this.containerStepList.push({
            ...item,
            isModify: false,
            hasSaved: true
          })
        })
      },
      createNewInfo() {
        if (this.checkSaveStatus()) {
          this.containerStepList.push({
            containerType: '',
            startDate: '',
            endDate: '',
            charge: '',
            isModify: true,
            hasSaved: false
          })
        }
      },
      // 是否满足新增条件
      checkSaveStatus() {
        const hasEdit = this.containerStepList.filter(v => v.isModify === true)
        if (hasEdit.length > 0) {
          this.$message({
            type: 'warning',
            message: this.$t('common.saveTips')
          })
          this.tableDataError = true
          return false
        }

        return true
      },
      saveContainer(rateObj, _index) {
        // 点击保存，验证单行数据
        if (this.validateLineForm(rateObj, _index)) {
          this.tableDataError = false
          rateObj.isModify = false
          rateObj.hasSaved = true
          this.sortTable()
          this.setFinalTable(rateObj, _index)
        }
      },
      // 验证单行数据
      validateLineForm(rateObj, _index) {
        if (rateObj.containerType.trim().length === 0) {
          this.tableErrorMessage = this.$t('containerManager.containerTypeInvalid')
          this.tableDataError = true
          return false
        } else if (rateObj.startDate === '' || Number(rateObj.startDate) === 0) {
          this.tableErrorMessage = this.$t('containerManager.orderDetail.startRangeInvalid')
          this.tableDataError = true
          return false
        } else if (rateObj.endDate === '' || Number(rateObj.endDate) === 0) {
          this.tableErrorMessage = this.$t('containerManager.orderDetail.endRangeInvalid')
          this.tableDataError = true
          return false
        } else if (rateObj.charge === '' || parseFloat(rateObj.charge) === 0) {
          this.tableErrorMessage = this.$t('containerManager.orderDetail.rateInvalid')
          this.tableDataError = true
          return false
        } else if (!this.checkDuplicatedDate(rateObj, _index)) { // 日期范围是否符合规范
          this.tableErrorMessage = this.$t('containerManager.orderDetail.containerRepeatInvalid')
          this.tableDataError = true
          return false
        } else {
          return true
        }
      },
      // 检查时间范围是否重复
      checkDuplicatedDate(_obj, _index) {
        if (Number(_obj.startDate) === Number(_obj.endDate)) {
          return false
        } else {
          if (Number(_obj.startDate) > Number(_obj.endDate)) {
            let _tpl = ''
            _tpl = _obj.startDate
            _obj.startDate = _obj.endDate
            _obj.endDate = _tpl
          }

          if (this.containerStepList.length === 0) {
            return true
          } else {
            const _dateRange = this.containerStepList.map((item, index) => {
              if (item.containerType === _obj.containerType && index !== _index) {
                if (Number(item.startDate) > Number(_obj.endDate) || Number(item.endDate) < Number(_obj.startDate)) {
                  return true
                } else {
                  return false
                }
              }
              return true
            })
            return _dateRange.every(item => item === true)
          }
        }
      },
      // 按照箱型，时间范围排序
      sortTable() {
        this.containerStepList.sort((item1, item2) =>
            item1.startDate - item2.startDate
          ).sort((item1, item2) => {
          if (item1.containerType < item2.containerType) {
            return -1
          } else if (item1.containerType > item2.containerType) {
            return 1
          } else {
            return 0
          }
        })
      },
      // 检查时间范围连续性
      checkTableContinuity() {
        const _length = this.containerStepList.length - 1
        let _isValid = true
        for (let [i, item] of new Map(this.containerStepList.map((item, i) => [i, item]))) {
          let _nextItem = null
          if (i < _length) {
            _nextItem = this.containerStepList[i + 1]
            if (item.containerType === _nextItem.containerType) {
              const _res = Number(_nextItem.startDate) - Number(item.endDate)
              if (_res === 1) {
                continue
              } else {
                _isValid = false
                break
              }
            } else {
              if (!!item.containerType && !!item.startDate && !!item.endDate && !!item.charge && Number(item.startDate) < Number(item.endDate)) {
                continue
              } else {
                _isValid = false
                break
              }
            }
          } else {
            if (!!item.containerType && !!item.startDate && !!item.endDate && !!item.charge && Number(item.startDate) < Number(item.endDate)) {
              continue
            } else {
              _isValid = false
              break
            }
          }
        }
        return _isValid
      },
      // 保存最终输出的列表
      setFinalTable(rateObj, _index) {
        if (this.orderContainerCharges[_index]) {
          this.orderContainerCharges[_index].containerType = rateObj.containerType
          this.orderContainerCharges[_index].startDate = rateObj.startDate
          this.orderContainerCharges[_index].endDate = rateObj.endDate
          this.orderContainerCharges[_index].charge = rateObj.charge
        } else {
          this.orderContainerCharges.push({
            containerType: rateObj.containerType,
            startDate: rateObj.startDate,
            endDate: rateObj.endDate,
            charge: rateObj.charge
          })
        }
      },
      modifyContainer(_index) {
        if (this.checkSaveStatus()) {
          this.containerStepList[_index].isModify = true
        }
      },
      cancelContainer(_index) {
        this.$confirm(this.$t('containerManager.orderDetail.dropWarnningTips'), this.$t('common.warnningText'), {
          confirmButtonText: this.$t('common.confirmBtn'),
          cancelButtonText: this.$t('common.cancelBtn'),
          type: 'warning'
        }).then(() => {
          this.tableErrorMessage = ''
          this.tableDataError = false
          if (this.containerStepList[_index].hasSaved) {
            // 取消已有行的编辑数据
            this.containerStepList[_index].isModify = false
            this.containerStepList[_index].containerType = this.orderContainerCharges[_index].containerType
            this.containerStepList[_index].startDate = this.orderContainerCharges[_index].startDate
            this.containerStepList[_index].endDate = this.orderContainerCharges[_index].endDate
            this.containerStepList[_index].charge = this.orderContainerCharges[_index].charge
          } else {
            // 取消未保存的行
            this.containerStepList.splice(_index, 1)
          }
        }).catch(() => {})
      },
      validateTableInfo() {
        if (this.orderContainerCharges.length === 0) {
          this.tableErrorMessage = this.$t('containerManager.orderDetail.rateEmptyInvalid')
          this.tableDataError = true
          return false
        } else if (!this.checkTableContinuity()) {
          this.tableErrorMessage = this.$t('containerManager.orderDetail.rateRangeInvalid')
          this.tableDataError = true
          return false
        } else {
          return this.checkSaveStatus()
        }
      }
    },
    created() {
    },
    mounted() {
      // 更新阶梯费率的箱型列表
      Bus.$on('updateContainerTypeArr', (arr, oldType, newType) => {
        // 已有箱型变更，更新对应数据
        if (oldType !== '' && oldType !== newType) {
          this.containerStepList.forEach((item, index) => {
            if (item.containerType === oldType) {
              item.containerType = newType
              this.orderContainerCharges[index].containerType = newType
            }
          })
        }

        this.containerTypeList = arr.map(item => {
          let _data = {
            value: item,
            label: item
          }
          return _data
        })
      })
    }
  }
</script>
<style scoped lang="scss">
  .info-wrapper{
    .form-wrap{
      width: 100%!important;
    }
  }
  .form-space{
    height: 90px;
  }
  .line-info-wrap{
    padding-left: 20px;
  }
  .required-header-text{
    color: red;
  }
  .line-type-box{
    padding-left: 20px;
  }
  .el-table{
    input{
      border: 1px solid #ccc;
      width: 100%;
      height: 24px;
      line-height: 24px;
      border-radius: 2px;
      outline: 0 none;
      &:focus{
        border: 1px solid #83D4EF;
      }
    }
    &.task-table {
      width: 100%
    }
    &.invalidated {
      border: 1px solid red;
    }
  }
  .error-tips{
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    color: red;
  }
</style>
