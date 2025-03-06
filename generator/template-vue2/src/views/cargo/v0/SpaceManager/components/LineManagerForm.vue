<template>
  <div class="form-wrap">
    <!-- <div class="form-space">
      <el-form :model="lineManagerForm" ref="lineManagerForm" :rules="lineManagerFormRules" label-width="80px" size="mini" style="width: 400px;">
        <el-form-item label="维度信息" prop="dimensionInfo">
          <el-radio v-model="lineManagerForm.dimensionInfo" :label="1" @change="switchDimension">指定港口</el-radio>
          <el-radio v-model="lineManagerForm.dimensionInfo" :label="2" @change="switchDimension">指定航线</el-radio>
        </el-form-item>
        <el-form-item label="航线代码" prop="lineCode" v-show="lineManagerForm.dimensionInfo === 2">
          <el-select v-model="lineManagerForm.lineCode" filterable :placeholder="$t('common.placeholder')" clearable>
            <el-option
              v-for="item in lineCodeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div> -->
    <div class="line-type-box">
      <el-form>
        <el-form-item :label="$t('spaceRule.lineManagerForm.purchaseType')">
          <el-radio v-model="lineManagerForm.lineType" :label="1">{{$t('spaceRule.lineManagerForm.normalLine')}}</el-radio>
          <el-radio v-model="lineManagerForm.lineType" :label="2">{{$t('spaceRule.lineManagerForm.popularLine')}}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('spaceRule.lineManagerForm.insuranceService')" prop="includeInsurance">
          <el-checkbox v-model="lineManagerForm.includeInsurance"></el-checkbox>
        </el-form-item>
      </el-form>
    </div>
    <div class="line-info-wrap">
      <el-table :data="lineManagerForm.containerPolicyList" :class="['task-table', {'invalidated': tableDataError}]">
        <el-table-column type="index" width="50" fixed></el-table-column>
        <el-table-column v-for="(v, i) in infoTableFileds" :key="`item-${i}`" :prop="v.field" :width="v.width" header-align="center" align="center">
          <template slot="header">
            <span class="required-header-text" v-if="v.required">*</span>
            <span>{{v.title}}</span>
          </template>
          <template slot-scope="scope">
            <template v-if="scope.row.isModify">
              <template v-if="v.field === 'polCode'">
                <el-select
                  v-model="scope.row[v.field]"
                  filterable
                  remote
                  reserve-keyword
                  :remote-method="remotePortList"
                  :loading="remoteLoading"
                  size="mini"
                  @change="handleSelectPol">
                  <el-option
                    v-for="item in remoteList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
              <template v-else-if="v.field === 'podCode'">
                <el-select
                  v-model="scope.row[v.field]"
                  filterable
                  remote
                  reserve-keyword
                  :remote-method="remotePortList"
                  :loading="remoteLoading"
                  @change="handleSelectPod"
                  size="mini"
                  value-key="value">
                  <el-option
                    v-for="item in remoteList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
              <template v-else-if="v.field === 'etd'">
                <CommonPicker
                  v-model="scope.row[v.field]"
                  :parent-date="scope.row[v.field]"
                  pikcer-type="date"
                  clearable>
                </CommonPicker>
              </template>
              <template v-else-if="v.field === 'eta'">
                <CommonPicker
                  v-model="scope.row[v.field]"
                  :dependenceDate="scope.row.etd"
                  parentOption="followingDependence"
                  :parent-date="scope.row[v.field]"
                  pikcer-type="date"
                  clearable>
                </CommonPicker>
              </template>
              <template v-else-if="v.field === 'containerType'">
                <el-select
                  size="mini"
                  v-model="scope.row[v.field]"
                  :placeholder="$t('common.placeholder')">
                  <el-option
                    v-for="item in containerTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
              <template v-else-if="v.field === 'containerQuantity'">
                <el-input
                  v-model="scope.row[v.field]"
                  size="mini"
                  maxlength="2"
                  :placeholder="$t('common.placeholder')"
                  :disabled="ruleType === 2"
                  oninput="value=value.replace(/[^\d]/g,'')"
                />
              </template>
              <template v-else-if="v.field === 'vessel' || v.field === 'voyage'">
                <el-input
                  v-model="scope.row[v.field]"
                  size="mini"
                  :placeholder="$t('common.placeholder')"
                  oninput="value=value.toUpperCase()"
                />
              </template>
              <template v-else-if="v.field === 'priceRange'">
                <div class="price-wrap">
                  <el-row :gutter="2" type="flex">
                    <el-col :span="11">
                      <el-input size="mini" v-model="scope.row.lowerPrice"
                        oninput="value=value.replace(/[^\d]/g,'')" maxlength="5"></el-input>
                    </el-col>
                    <el-col :span="2">~</el-col>
                    <el-col :span="11">
                      <el-input size="mini" v-model="scope.row.highestPrice"
                        oninput="value=value.replace(/[^\d]/g,'')" maxlength="5"></el-input>
                    </el-col>
                  </el-row>
                </div>
              </template>
              <template v-else>
                <el-input
                  size="mini"
                  v-model="scope.row[v.field]"
                  type="text" />
              </template>
            </template>
            <template v-else>
              <span v-if="v.field === 'etd' || v.field === 'eta'">
                {{ scope.row[v.field] | filterDate(vm)}}
              </span>
              <span v-else-if="v.field === 'polCode'">
                {{ scope.row.porCityName }}
              </span>
              <span v-else-if="v.field === 'podCode'">
                {{ scope.row.fndCityName }}
              </span>
              <span v-else>{{scope.row[v.field]}}</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.operation')" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="removeLine(scope.$index)" v-show="!scope.row.isModify">{{$t('common.removeBtn')}}</el-button>
            <el-button type="text" @click="saveLine(scope.row)" v-show="scope.row.isModify">{{$t('common.saveBtn')}}</el-button>
            <el-button type="text" @click="removeLine(scope.$index)" v-show="scope.row.isModify">{{$t('common.cancelBtn')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="error-tips" v-show="tableDataError">
        {{tableErrorMessage}}
      </div>
      <el-button type="text" @click="createNewInfo">+添加航线舱位</el-button>
    </div>
  </div>
</template>
<script>
  import { getPortInfoApi } from '@/api/spaceManager'
  export default {
    name: 'LineManagerForm',
    props: {
      ruleType: {
        type: Number,
        default: 1
      }
    },
    data() {
      const valiadteLineCode = async (rule, value, callback) => {
        if (!value) {
          if (this.lineManagerForm.dimensionInfo === 2) {
            return callback(new Error(this.$t('spaceRule.ruleSetter.ruleNameEmptyInvalid')))
          }
          callback()
        } else {
          callback()
        }
      }
      return {
        vm: this,
        currEditIndex: 0,
        lineInfoReady: false,
        remoteLoading: false,
        remoteList: [],
        // lineCodeList: [],
        lineManagerForm: {
          // dimensionInfo: 1,
          // lineCode: '',
          includeInsurance: false,
          lineType: 1,
          containerPolicyList: []
        },
        lineManagerFormRules: {
          // lineCode: [
          //   {validator: valiadteLineCode, trigger: 'change'}
          // ]
        },
        tableErrorMessage: '',
        tableDataError: false,
        infoTableFileds: [
          {field: 'polCode', title: this.$t('spaceRule.polCode'), width: 220, required: true},
          {field: 'podCode', title: this.$t('spaceRule.podCode'), width: 220, required: true},
          {field: 'containerType', title: this.$t('spaceRule.containerType'), width: 120, required: true},
          {field: 'containerQuantity', title: this.$t('spaceRule.containerRequireQuantity'), width: 120, required: true},
          {field: 'etd', title: this.$t('spaceRule.etd'), width: 180, required: true},
          {field: 'eta', title: this.$t('spaceRule.eta'), width: 180, required: false},
          {field: 'vessel', title: this.$t('spaceRule.vesselName'), width: 120, required: false},
          {field: 'voyage', title: this.$t('spaceRule.voyageNo'), width: 120, required: false},
          {field: 'priceRange', title: this.$t('spaceRule.lineManagerForm.priceRangeUSD'), width: 200, required: false}
        ],
        containerTypeList: [
          {
            value: '20GP',
            label: '20GP'
          },
          {
            value: '40GP',
            label: '40GP'
          },
          {
            value: '40HQ',
            label: '40HQ'
          }
        ],
        timeout: null
      }
    },
    filters: {
      filterDate(val, vm) {
        if (!val) {
          return ''
        }
        return vm.$moment(Number(val)).format('YYYY-MM-DD HH:mm')
      }
    },
    watch: {
      // 切换规则类型的处理
      ruleType(newVal, oldVal) {
        if (newVal === 2) {
          this.lineManagerForm.containerPolicyList.forEach(item => {
            item.containerQuantity = '1'
          })
        } else {
          if (this.lineManagerForm.containerPolicyList.length > 0) {
            this.$confirm(this.$t('spaceRule.lineManagerForm.saveWarningTips'), this.$t('common.warnningText'), {
              confirmButtonText: this.$t('spaceRule.lineManagerForm.confirmModify'),
              cancelButtonText: this.$t('common.cancelBtn'),
              type: 'warning'
            }).then(() => {
              this.lineManagerForm.containerPolicyList = []
            }).catch(() => {
              this.$emit('cancelRuleType', oldVal)
            })
          }
        }
      }
    },
    computed: {},
    methods: {
      setFormInfo(formObj) {
        this.lineManagerForm.lineType = formObj.lineType
        this.lineManagerForm.containerPolicyList = formObj.containerPolicyList
        this.lineManagerForm.includeInsurance = formObj.includeInsurance
        this.lineManagerForm.containerPolicyList.forEach(item => {
          this.setPriceRange(item)
        })
      },
      switchDimension(val) {
        // 切换维度信息需要重新添加航线信息
        if (this.lineManagerForm.containerPolicyList.length > 0) {
          this.$confirm(this.$t('spaceRule.lineManagerForm.saveWarningTips'), this.$t('common.warnningText'), {
            confirmButtonText: this.$t('spaceRule.lineManagerForm.confirmModify'),
            cancelButtonText: this.$t('common.cancelBtn'),
            type: 'warning'
          }).then(() => {
            this.lineManagerForm.containerPolicyList = []
            if (val === 1) {
              this.lineManagerForm.lineCode = ''
              this.$refs.lineManagerForm.resetFields()
            }
          }).catch(() => {
            this.lineManagerForm.dimensionInfo = val === 1 ? 2 : 1
          })
        } else {
          if (val === 1) {
            this.lineManagerForm.lineCode = ''
            this.$refs.lineManagerForm.resetFields()
          }
        }
      },
      createNewInfo() {
        // 新建航线信息
        // if (this.lineManagerForm.dimensionInfo === 2 && this.lineManagerForm.lineCode === '') {
        //   this.$message({
        //     type: 'warning',
        //     message: '请先选择航线代码'
        //   })
        //   return false
        // }

        if (this.lineManagerForm.containerPolicyList.length >= 5) {
          this.$message({
            type: 'warning',
            message: this.$t('spaceRule.lineManagerForm.ruleLimit')
          })

          return false
        }
        const hasEdit = this.lineManagerForm.containerPolicyList.filter(v => v.isModify === true)
        if (hasEdit.length > 0) {
          this.$message({
            type: 'warning',
            message: this.$t('common.saveTips')
          })
          return false
        }

        this.lineManagerForm.containerPolicyList.push({
          polCode: '',
          podCode: '',
          porCityId: '',
          porCityName: '',
          fndCityId: '',
          fndCityName: '',
          containerType: '',
          containerQuantity: this.ruleType === 2 ? '1' : '',
          etd: null,
          eta: null,
          vessel: '',
          voyage: '',
          lowerPrice: '',
          highestPrice: '',
          priceRange: '',
          isModify: true
        })

        this.currEditIndex = this.lineManagerForm.containerPolicyList.length - 1
      },
      saveLine(lineObj) {
        // 点击保存，验证单行数据
        let isValidate = true
        if (lineObj.polCode.trim().length === 0) {
          this.$message({
            type: 'error',
            message: this.$t('spaceRule.lineManagerForm.polCodeEmptyInvalid')
          })
          return false
        } else if (lineObj.podCode.trim().length === 0) {
          this.$message({
            type: 'error',
            message: this.$t('spaceRule.lineManagerForm.podCodeEmptyInvalid')
          })
          return false
        } else if (lineObj.containerType.trim().length === 0) {
          this.$message({
            type: 'error',
            message: this.$t('spaceRule.lineManagerForm.containerTypeInvalid')
          })
          return false
        } else if (lineObj.containerQuantity.trim().length === 0) {
          this.$message({
            type: 'error',
            message: this.$t('spaceRule.lineManagerForm.amountEmptyInvalid')
          })
          return false
        } else if (!lineObj.etd) {
          this.$message({
            type: 'error',
            message: this.$t('spaceRule.lineManagerForm.etdEmptyInvalid')
          })
          return false
        } else { // 判断价格区间
          this.setPriceRange(lineObj)
        }
        // 船名航次去首尾空格
        lineObj.vessel = lineObj.vessel.trim()
        lineObj.voyage = lineObj.voyage.trim()

        this.tableDataError = false
        lineObj.isModify = false
      },
      setPriceRange(lineObj) {
        let _min = parseInt(lineObj.lowerPrice, 10)
        let _max = parseInt(lineObj.highestPrice, 10)

        if (!!lineObj.lowerPrice && !!lineObj.highestPrice) {
          if (_min > _max) {
            const tpl = _min
            _min = _max
            _max = tpl
            lineObj.priceRange = `${_min} ~ ${_max}`
            lineObj.lowerPrice = _min
            lineObj.highestPrice = _max
          } else if (_min === 0 && _max === 0) {
            lineObj.priceRange = this.$t('spaceRule.unLimited')
          } else {
            lineObj.priceRange = `${_min} ~ ${_max}`
          }
        } else if (!!lineObj.lowerPrice && _min > 0) {
          lineObj.priceRange = `${this.$t('spaceRule.moreThan')}${_min}`
        } else if (!!lineObj.highestPrice && _max > 0) {
          lineObj.priceRange = `${this.$t('spaceRule.lessThan')}${_max}`
        } else {
          lineObj.priceRange = this.$t('spaceRule.unLimited')
        }
      },
      removeLine(_index) {
        // 移除一条航线信息
        this.$confirm(this.$t('spaceRule.lineManagerForm.subTaskWarnning'), this.$t('common.warnningText'), {
          confirmButtonText: this.$t('common.confirmBtn'),
          cancelButtonText: this.$t('common.cancelBtn'),
          type: 'warning'
        }).then(() => {
          this.tableErrorMessage = ''
          this.tableDataError = false
          this.lineManagerForm.containerPolicyList.splice(_index, 1)
        }).catch(() => {})
      },
      async remotePortList(queryString) {
        this.remoteLoading = true
        if (queryString.trim().length >= 2) {
          const res = await getPortInfoApi(queryString)
          if (res.ok) {
            this.remoteList = res.content.map(item => ({
                label: `${item.cityFullNameCn}-${item.cityFullNameEn}`,
                value: item.id
              }))
          } else {
            this.remoteList = []
          }
          this.remoteLoading = false
        }
      },
      handleSelectPol(_val) {
        const _item = this.remoteList.filter(item => item.value == _val)
        this.lineManagerForm.containerPolicyList[this.currEditIndex].porCityId = _item[0].value
        this.lineManagerForm.containerPolicyList[this.currEditIndex].porCityName = _item[0].label
      },
      handleSelectPod(_val) {
        const _item = this.remoteList.filter(item => item.value == _val)
        this.lineManagerForm.containerPolicyList[this.currEditIndex].fndCityId = _item[0].value
        this.lineManagerForm.containerPolicyList[this.currEditIndex].fndCityName = _item[0].label
      },
      validateForm() {
        return new Promise((resolve, reject) => {
          this.tableDataError = false
          if (this.lineManagerForm.containerPolicyList.length === 0) {
            this.tableErrorMessage = this.$t('spaceRule.lineManagerForm.lineSpaceEmptyInvalid')
            this.tableDataError = true
            reject('lineManagerForm')
          } else if (this.lineManagerForm.containerPolicyList.some(v => v.isModify)) {
            this.tableErrorMessage = this.$t('spaceRule.lineManagerForm.saveLineInvalid')
            this.tableDataError = true
            reject('lineManagerForm')
          } else {
            resolve(this.lineManagerForm)
          }
          // this.$refs.lineManagerForm.validate(valid => {
          //   if (!valid) {
          //     reject('lineManagerForm')
          //   } else {
          //     if (this.lineManagerForm.containerPolicyList.length === 0) {
          //       this.tableErrorMessage = '缺少航线舱位信息'
          //       this.tableDataError = true
          //       reject('lineManagerForm')
          //     } else if (this.lineManagerForm.containerPolicyList.some(v => v.isModify)) {
          //       this.tableErrorMessage = '请先保存航线舱位信息'
          //       this.tableDataError = true
          //       reject('lineManagerForm')
          //     } else {
          //       resolve({routeSpaceInfoDTO: this.lineManagerForm})
          //     }
          //   }
          // })
        })
      }
    },
    created() {
    },
    mounted() {}
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
