<template>
  <div class="form-wrap">
    <div class="line-info-wrap">
      <el-table id="containerBaseList" :data="containerList" :class="['task-table', {'invalidated': tableDataError}]">
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
              <template v-else>
                <NumberInput v-model="scope.row[v.field]" limitType="int" :limitRange="{digits: 5, decimal: 0}" @keyup.enter.native="saveContainer(scope.row, scope.$index)"></NumberInput>
              </template>
            </template>
            <template v-else>
              <span>{{scope.row[v.field]}}</span>
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
      <el-button type="text" @click="createNewInfo" v-show="!$parent.viewDetail">+{{$t('containerManager.orderDetail.createContainerType')}}</el-button>
    </div>
  </div>
</template>
<script>
  import Bus from '@/utils/eventBus.js'
  import { getContainerTypeListApi } from '@/api/containerManager'
  import NumberInput from '@/components/Cargo/NumberInput/NumberInput'
  export default {
    name: 'ContainerInfoForm',
    components: {
      NumberInput
    },
    data() {
      return {
        vm: this,
        isEdit: false,
        currEditIndex: 0,
        containerList: [],
        containerTypeInfos: [],
        tableErrorMessage: '',
        tableDataError: false,
        infoTableFileds: [
          {field: 'containerType', title: this.$t('containerManager.containerType'), width: 220, required: true},
          {field: 'containerQuantity', title: this.$t('common.quantity'), width: 220, required: true}
        ],
        containerTypeList: [],
        timeout: null
      }
    },
    watch: {
    },
    computed: {},
    methods: {
      setList(arr) {
        this.isEdit = true
        this.containerTypeInfos = arr
        this.setContainerTypeListForCharge()
        this.containerList = []
        arr.forEach(item => {
          this.containerList.push({
            ...item,
            isModify: false,
            hasSaved: true
          })
        })
      },
      async getContainerType() {
        const res = await getContainerTypeListApi()
        if (res.ok) {
          this.containerTypeList = res.content.map(item => {
            let _data = {
              label: item.englishName,
              value: item.englishName
            }
            return _data
          })
        }
      },
      createNewInfo() {
        if (this.checkSaveStatus()) {
          this.containerList.push({
            containerType: '',
            containerQuantity: '',
            isModify: true,
            hasSaved: false
          })

          this.currEditIndex = this.containerList.length - 1
        }
      },
      checkSaveStatus() {
        const hasEdit = this.containerList.filter(v => v.isModify === true)
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
      saveContainer(baseObj, _index) {
        // 点击保存，验证单行数据
        if (this.checkLineForm(baseObj, _index)) {
          this.tableDataError = false
          baseObj.isModify = false
          baseObj.hasSaved = true
          let oldContainerType = ''
          let newContainerType = ''
          if (this.containerTypeInfos[_index]) {
            oldContainerType = this.containerTypeInfos[_index].containerType
            newContainerType = baseObj.containerType
            this.containerTypeInfos[_index].containerType = baseObj.containerType
            this.containerTypeInfos[_index].containerQuantity = baseObj.containerQuantity
          } else {
            this.containerTypeInfos.push({
              containerType: baseObj.containerType,
              containerQuantity: baseObj.containerQuantity
            })
          }
          this.setContainerTypeListForCharge(oldContainerType, newContainerType)
        }
      },
      // 设置费率中的箱型下拉
      setContainerTypeListForCharge(oldContainerType = '', newContainerType = '') {
        // 整合箱型下拉列表
        const _typeList = this.containerTypeInfos.map(item => item.containerType)
        // 更新阶梯费率的箱型列表
        Bus.$emit('updateContainerTypeArr', _typeList, oldContainerType, newContainerType)
      },
      // 验证是否可以保存当前行
      checkLineForm(baseObj, _index) {
        if (baseObj.containerType.trim().length === 0) {
          this.tableErrorMessage = this.$t('containerManager.containerTypeInvalid')
          this.tableDataError = true
          return false
        } else if (baseObj.containerQuantity === '' || parseInt(baseObj.containerQuantity, 10) === 0) {
          this.tableErrorMessage = this.$t('containerManager.orderDetail.quantityInvalid')
          this.tableDataError = true
          return false
        } else if (this.checkDuplicatedBase(baseObj, _index).length > 0) {
          this.tableErrorMessage = this.$t('containerManager.orderDetail.containerTypeRepeatInvalid')
          this.tableDataError = true
          return false
        } else {
          return true
        }
      },
      checkDuplicatedBase(_obj, _index) {
        return this.containerTypeInfos.filter((item, i) => item.containerType === _obj.containerType && i !== _index)
      },
      modifyContainer(_index) {
        this.containerList[_index].isModify = true
      },
      cancelContainer(_index) {
        // 移除一条航线信息
        this.$confirm(this.$t('containerManager.orderDetail.dropWarnningTips'), this.$t('common.warnningText'), {
          confirmButtonText: this.$t('common.confirmBtn'),
          cancelButtonText: this.$t('common.cancelBtn'),
          type: 'warning'
        }).then(() => {
          this.tableErrorMessage = ''
          this.tableDataError = false
          if (this.containerList[_index].hasSaved) {
            this.containerList[_index].isModify = false
            this.containerList[_index].containerType = this.containerTypeInfos[_index].containerType
            this.containerList[_index].containerQuantity = this.containerTypeInfos[_index].containerQuantity
          } else {
            this.containerList.splice(_index, 1)
          }
        }).catch(() => {})
      },
      validateTableInfo() {
        if (this.containerTypeInfos.length === 0) {
          this.tableErrorMessage = this.$t('containerManager.orderDetail.infoEmptyInvalid')
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
      this.getContainerType()
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
