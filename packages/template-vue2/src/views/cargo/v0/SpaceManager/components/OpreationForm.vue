<template>
  <div class="form-wrap">
    <el-form :model="opreationForm" :inline="true" ref="opreationForm" size="mini" style="padding-left: 16px;">
      <!-- <el-row>
        <el-col :span="12">
          <el-form-item
            label="请求策略"
            label-width="100"
            prop="requestStrategy"
            :rules="[
              {required: true, message: '请选择策略类型', trigger: 'change'}
            ]">
            <el-select v-model="opreationForm.requestStrategy" disabled>
              <el-option
                v-for="item in requestStrategyList"
                :key="item.value"
                :value="item.value"
                :label="item.label">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row type="flex">
        <el-col :span="12">
          <el-form-item
            :label="$t('spaceRule.opreationForm.startDate')"
            label-width="100"
            prop="beginTime"
            :rules="[
              {required: true, message: $t('spaceRule.opreationForm.startDateInvalid'), trigger: 'change'}
            ]">
            <CommonPicker
              v-if="ruleType === 1"
              v-model="beginTime"
              :parent-date="beginTime"
              parentOption="followingDependence"
              :dependenceDate="currDate"
              pikcer-type="date"
              clearable>
            </CommonPicker>
            <CommonPicker
              v-else
              v-model="beginTime"
              :parent-date="beginTime"
              parentOption="followingDependence"
              :dependenceDate="currDate"
              pikcer-type="datetime"
              pickerFormat="yyyy-MM-dd HH:mm"
              clearable>
            </CommonPicker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-show="ruleType === 1" :label="$t('spaceRule.opreationForm.purchaseTime')" required>
            <el-row :gutter="10" type="flex">
              <el-col :span="10">
                <el-form-item label="" prop="startTimeVal"
                  :rules="[
                    {required: true, message: $t('spaceRule.opreationForm.startTimePointer'), trigger: 'change'}
                  ]">
                  <el-time-picker
                    v-model="opreationForm.startTimeVal"
                    :placeholder="$t('spaceRule.opreationForm.startTime')"
                    value-format="HH:mm:ss"
                    :picker-options="startTimePickerObj"
                    style="width: 120px;"
                    @change="handleStartTimeChange"
                    @focus="setStartTimeOption">
                  </el-time-picker>
                </el-form-item>
              </el-col>
              <el-col :span="1">-</el-col>
              <el-col :span="10">
                <el-form-item label="" prop="endTimeVal"
                  :rules="[
                    {required: true, message: $t('spaceRule.opreationForm.endTimePointer'), trigger: 'change'}
                  ]">
                  <el-time-picker
                    v-model="opreationForm.endTimeVal"
                    :placeholder="$t('spaceRule.opreationForm.endTime')"
                    value-format="HH:mm:ss"
                    :picker-options="endTimePickerObj"
                    style="width: 120px;">
                  </el-time-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item
            v-show="ruleType === 2"
            :label="$t('spaceRule.opreationForm.endDate')"
            label-width="100"
            prop="endTime"
            :rules="[
              {required: true, message: $t('spaceRule.opreationForm.endTimePointer'), trigger: 'change'}
            ]">
            <!-- <CommonPicker
              v-else
              v-model="beginTime"
              :parent-date="beginTime"
              parentOption="followingDependence"
              :dependenceDate="currDate"
              pikcer-type="datetime"
              pickerFormat="yyyy-MM-dd HH:mm"
              clearable>
            </CommonPicker> -->
            <CommonPicker
              v-model="opreationForm.endTime"
              :parent-date="opreationForm.endTime"
              :startDependence="beginTime"
              :endDependence="after7Days"
              parentOption="betweenDependence"
              pikcer-type="datetime"
              pickerFormat="yyyy-MM-dd HH:mm"
              clearable>
            </CommonPicker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="12">
          <el-form-item :label="$t('spaceRule.opreationForm.sendMethods')" props="notifyModeList" required>
            <el-checkbox-group
              v-model="opreationForm.notifyModeList"
              :min="1">
              <el-checkbox :label="3" :key="3">{{$t('common.email')}}</el-checkbox>
              <el-checkbox :label="1" :key="1">{{$t('common.siteMessage')}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t('spaceRule.opreationForm.sendTarget')"
            label-width="100"
            prop="notifyUserIdList"
            :rules="[
              {type: 'array', required: true, message: $t('spaceRule.opreationForm.sendTargetInvalid'), trigger: 'change' }
            ]">
            <el-cascader
              ref="userInfoList"
              style="width: 280px;"
              size="mini"
              v-model="opreationForm.notifyUserIdList"
              :options="departmentList"
              :props="{multiple: true, expandTrigger: 'hover', emitPath: false}"
              :show-all-levels="false"
              filterable
              clearable>
            </el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="$t('spaceRule.opreationForm.sendTrigger')" props="notifyNodeList" required>
        <el-checkbox-group
          v-model="opreationForm.notifyNodeList"
          :min="1">
          <el-checkbox :label="1" :key="1">{{$t('spaceRule.opreationForm.ruleMatch')}}</el-checkbox>
          <el-checkbox :label="2" :key="2">{{$t('spaceRule.opreationForm.ruleLose')}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { getEmployeeListApi } from '@/api/spaceManager'
  export default {
    name: 'OpreationForm',
    props: {
      ruleType: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        after7Days: null,
        // requestStrategyList: [
        //   {
        //     value: 1,
        //     label: '并行-单行'
        //   }
        // ],
        // opreationFrequencyList: [],
        // frequencyUnitList: [],
        departmentList: [],
        sendProps: {multiple: true},
        startTimePickerObj: {
          selectableRange: "00:00:00-23:59:59"
        },
        endTimePickerObj: {
          selectableRange: "00:00:00-23:59:59"
        },
        beginTime: null,
        opreationForm: {
          // requestStrategy: 1,
          // opreationFrequency: 1,
          // opreationFrequencyUnit: 'sec',
          notifyModeList: [3, 1],
          notifyNodeList: [1, 2],
          beginTime: null,
          endTime: null,
          startTimeVal: null,
          endTimeVal: null,
          notifyUserIdList: [],
          userInfoList: []
        }
      }
    },
    watch: {
      'beginTime': function(val) {
        if (val) {
          // 设置开始日期
          this.opreationForm.beginTime = val

          // 设置结束日期范围
          this.after7Days = this.$moment(val).add(7, 'd').valueOf()

          // 重置时间点
          this.opreationForm.startTimeVal = null
          this.opreationForm.endTimeVal = null

          // 重置结束日期
          this.opreationForm.endTime = null
        }
      }
    },
    computed: {
      currDate() {
        return this.$moment({ hour: 0, minute: 0, second: 0 }).valueOf()
      }
    },
    methods: {
      setFormInfo(formObj) {
        const _beginTime = Number(formObj.beginTime)
        const _endTime = Number(formObj.endTime)
        this.beginTime = _beginTime
        this.opreationForm = {...this.opreationForm, ...formObj}
        console.log(this.opreationForm.notifyUserIdList)
        setTimeout(() => {
          this.opreationForm.beginTime = _beginTime
          this.opreationForm.endTime = _endTime
          // this.opreationForm.notifyUserIdList = this.opreationForm.userInfoList.map(item => item.userId)
          if (this.ruleType === 1) {
            this.opreationForm.startTimeVal = this.$moment(_beginTime).format('HH:mm:ss')
            this.opreationForm.endTimeVal = this.$moment(_endTime).format('HH:mm:ss')
          }
        }, 200)
      },
      validateForm() {
        let validateItems = [
          // "requestStrategy",
          // "opreationFrequency",
          // "opreationFrequencyUnit",
          "beginTime",
          "notifyUserIdList"
        ]
        if (this.ruleType === 2) {
          validateItems.push("endTime")
        } else {
          validateItems = validateItems.concat("startTimeVal", "endTimeVal")
        }

        let promiseList = []
        validateItems.forEach(item => {
          const promiseItem = new Promise(resolve => {
            this.$refs.opreationForm.validateField(item, error => {
              if (!error) {
                resolve(true)
              } else {
                resolve(false)
              }
            })
          })
          promiseList.push(promiseItem)
        })

        return new Promise((resolve, reject) => {
          Promise.all(promiseList).then(valid => {
            if (valid.indexOf(false) === -1) {
              if (this.ruleType === 1) {
                const _beginTime = this.$moment(this.beginTime).format('YYYY-MM-DD')
                const _startTime = _beginTime + " " + this.opreationForm.startTimeVal
                const _endTime = _beginTime + " " + this.opreationForm.endTimeVal
                this.opreationForm.beginTime = this.$moment(_startTime).valueOf()
                this.opreationForm.endTime = this.$moment(_endTime).valueOf()
              }
              this.selectorUser()
              resolve(this.opreationForm)
            }
            reject('opreationForm')
          })
        })
      },
      setStartTimeOption() {
        const _selectedDay = this.$moment(this.beginTime)
        const _today = this.$moment({hour: 0, minute: 0})
        // const _currTime = this.$moment().add(1,'h').format('HH:mm:ss')
        const _currTime = this.$moment().add(1, 's').format('HH:mm:ss')
        if (_selectedDay.isSame(_today, 'day')) {
          // 选择当天，则开始时间要大于当前时间
          this.startTimePickerObj.selectableRange = `${_currTime}-23:59:59`
        } else {
          this.startTimePickerObj.selectableRange = `00:00:00-23:59:59`
        }
      },
      handleStartTimeChange(val) {
        if (val) {
          const _beginTime = this.beginTime ? this.$moment(this.beginTime).format('YYYY-MM-DD') : this.$moment().format('YYYY-MM-DD')
          const _startTime = _beginTime + ' ' + val
          const _endTime = this.$moment(_startTime).add(1, 'h').format('HH:mm:ss')
          this.endTimePickerObj.selectableRange = `${val}-${_endTime}`
        } else {
          this.endTimePickerObj.selectableRange = '00:00:00-23:59:59'
        }
        this.opreationForm.endTimeVal = null
      },
      selectorUser(val) {
        const _node = this.$refs.userInfoList.getCheckedNodes()
        const _items = []
        _node.forEach(item => {
          if (item.level === 2 && item.checked) {
            _items.push({
              userId: item.value,
              userName: item.label
            })
          }
        })
        this.opreationForm.userInfoList = _items
      },
      async setEmployeeList() {
        const res = await getEmployeeListApi()
        if (res.ok) {
          this.departmentList = []
          res.content.forEach(item => {
            const departmentItems = {
              label: item.departmentName,
              value: item.departmentId,
              children: []
            }
            if (item.userVoList) {
              item.userVoList.forEach(user => {
                departmentItems.children.push({
                  label: user.userName,
                  value: user.userId
                })
              })
            }
            this.departmentList.push(departmentItems)
          })
        }
      }
    },
    mounted() {
    },
    created() {
      this.setEmployeeList()
    }
  }
</script>
<style scoped lang="scss">
  .form-space{
    padding-left: 20px;
  }
</style>
