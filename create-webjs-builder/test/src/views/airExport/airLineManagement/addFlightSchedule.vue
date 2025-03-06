<template>
  <div class="order-air-item" v-loading="loading">

    <div class="company">
      <el-form ref="editForm" :model="editForm" label-width="95px" label-position="left">
        <el-row>
          <el-col :span="6">
            <!-- 产品航线 -->
            <el-form-item :label="$t('air.productAirlineName')" prop="productAirlineId" size="mini"
              :rules="[{ required: true, message: $t('air.requiredProductAirLine'), trigger: 'change' }]">
              <el-select filterable clearable v-model="editForm.productAirlineId" :placeholder="$t('air.placeholder')"
                @change="changeByEtdMonth">
                <el-option v-for="(item, index) in productAirlineNameList" :label="item.productName" :value="item.id"
                  :key="index">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- 计划月份 -->
            <el-form-item :label="$t('air.planIn')" size="mini"
              :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]" prop="planInMonth">
              <!-- <CommonPicker type="month" v-model="editForm.planInMonth" clearable pickerFormat="yyyy-MM"
                :placeholder="$t('air.placeholder')" :pickerOptions="Date.now()" @change="changeByEtdMonth" /> -->

              <el-date-picker v-model="editForm.planInMonth" type="month" value-format="yyyy-MM" placeholder="请选择"
                :picker-options="setDateRange" clearable @change="changeByEtdMonth" />
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
    </div>
    <el-form ref="chargeForm" :model="chargeForm" label-position="left">
      <el-table size="mini" :data="chargeForm.charges" style="width: 100%; " row-key="id" :border="true">
        <el-table-column prop="flightNo" :label="$t('air.flightNo')">
          <template slot-scope="{row, $index}">
            <el-form-item :rules="[{ required: true, message: $t('air.requiredFlightNo') }]"
              :prop="`charges[${$index}].flightNo`">
              <el-input v-model.trim="row.flightNo" class="job-no-input" size="mini"
                oninput="value=value.replace(/[^0-9A-Z]/g,'')" :disabled="editStatus(row)" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="etd" :label="$t('air.date')">
          <template slot-scope="{row, $index}">
            <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
              :prop="`charges[${$index}].etd`">
              <!-- <CommonPicker type="datetime" v-model="row.etd" clearable :parentOption="setDateRange2"
                pickerFormat="yyyy-MM-dd HH:mm" @change="etdChange($index)" :disabled="row.id!==null"
                 /> -->
              <el-date-picker v-model="row.etd2" type="datetime" :picker-options="setDateRange2" clearable size="mini"
                v-if="row.id" :disabled="editStatus(row)" :default-value="row.timeDefaultShow" format="yyyy-MM-dd HH:mm"
                style="width:100%" />
              <el-date-picker v-model="row.etd" type="datetime" :picker-options="setDateRange2" clearable size="mini"
                @change="etdChange($index)" v-else :disabled="editStatus(row)" :default-value="row.timeDefaultShow"
                style="width:100%" format="yyyy-MM-dd HH:mm" />

            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="etdDayWeek" :label="$t('air.week')">
          <template slot-scope="{row, $index}">
            <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
              :prop="`charges[${$index}].etdDayWeek`">
              <el-input v-model.trim="row.etdDayWeek" class="job-no-input" size="mini" disabled />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="palletSide" :label="$t('air.palletSide')">
          <template slot-scope="{row, $index}">
            <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
              :prop="`charges[${$index}].palletSide`">
              <el-select v-model="row.palletSide" size="mini" :disabled="editStatus(row)">
                <el-option v-for="item in palletSideList" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="boardModel" :label="$t('air.plateCut')">
          <template slot-scope="{row, $index}">
            <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
              :prop="`charges[${$index}].boardModel`">
              <el-input v-model="row.boardModel" size="mini" :disabled="editStatus(row)"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="assessWeight" :label="$t('air.assessmentBasisWeight')">
          <template slot-scope="{row, $index}">
            <el-form-item :prop="`charges[${$index}].assessWeight`">
              <el-input v-model="row.assessWeight" size="mini" v-input-limit="[-9, 2]" :disabled="editStatus(row)">
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="theoryVolume" :label="$t('air.theoreticalVolume')">
          <template slot-scope="{row, $index}">
            <el-form-item :prop="`charges[${$index}].theoryVolume`">
              <el-input v-model='row.theoryVolume' size="mini" v-input-limit="[-9, 2]" :disabled="editStatus(row)">
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="remark" :label="$t('air.remark')">
          <template slot-scope="{row, $index}">
            <el-form-item :prop="`charges[${$index}].remark`">
              <el-input v-model='row.remark' size="mini" :disabled="editStatus(row)"></el-input>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="oper" :label="$t('receiveFms.operation')" width="60">
          <template slot-scope="{row, $index }">
            <i class="iconfont icon-minus-circle" v-if="chargeForm.charges.length > 1 && !row.id"
              @click="deleteFn($index)"></i>
            <i class="iconfont icon-add-circle" v-if="$index === 0" @click="addFn($index)"></i>
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <div style="text-align: center;margin: 30px 0;">
      <el-button type="primary" size="mini" @click="saveFn">{{ $t('air.save') }}</el-button>
      <el-button type="primary" size="mini" @click="cancelFn">{{ $t('air.cancel') }}</el-button>
    </div>
  </div>
</template>
<script>
import { getAirLineList, airFlightPlanQueryByEtdMonth, addAirFlightPlan, airProductAirlineDetail } from '@/api/airExport'
import { parseTime } from '@/utils/index'
import moment from 'moment'
export default {
  name: 'AddFlightSchedule',
  components: {
  },
  props: {
    type: String,
    item: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },

  watch: {
  },
  data () {
    return {
      palletSideList: [{
        code: 1,
        name: this.$t('air.inThePlate')
      }, {
        code: 2,
        name: this.$t('air.offBoard')
      }],
      setDateRange2: this.disabledDate(),
      weekList: [this.$t('air.SUN'), this.$t('air.MON'), this.$t('air.TUE'), this.$t('air.WED'), this.$t('air.THUR'), this.$t('air.FRI'), this.$t('air.SAT')],
      month: "month",
      planInMonth: "",
      productAirlineNameList: [],
      setDateRange: {
        disabledDate: time =>
          // // 只能选择当前 1 年内的时间
          // const year = 365 * 24 * 3600 * 1000;
          // 只能选择当前 1 月的时间
          // const month = 30 * 24 * 3600 * 1000;
          // // 只能选择当前 1 周的时间
          // const week = 7 * 24 * 3600 * 1000;
          // // 返回小于当前日期并近【1年】【1月】【1周】内的日期
          // // 注意：这是从当前日期开始往前算，如果当前日期可选的话，不要写【-8.64e7】
          // return time.getTime() > Date.now() || time.getTime() < (Date.now() - 8.64e7) - year;
          // // 禁用今天之前的日期【当前天可选】
          // return time.getTime() < Date.now() - 8.64e7;
          //  // 禁用今天之前的日期【当前天不可选】
          // return time.getTime() < Date.now();
          // // 禁用今天之后的日期【当前天不可选】
          // return time.getTime() > Date.now() - 8.64e7;
          // // 禁用今天之后的日期【当前天可选】
          time.getTime() < Date.now()

      },

      productAirlineDetail: {},
      editForm: {
        planInMonth: "",
        productAirlineName: "",
        productAirlineId: ""
      },
      chargeForm: {
        charges: [{
          timeDefaultShow: new Date(),
          flightNo: "",
          etd: "",
          etdDayWeek: "",
          boardModel: "",
          assessWeight: "",
          theoryVolume: "",
          remark: ""
        }]
      },
      loading: false
    }
  },
  created () {
    this.init()
  },
  methods: {
    editStatus (row) {
      if (this.$isNotEmpty(row.id)) {
        return true
      } else {
        return false
      }
    },
    disabledDate () {
      let that = this;
      // disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
      return {
        disabledDate (date) {
          if (that.editForm.planInMonth) {
            return (
              date.getTime() <
              new Date(new Date(that.editForm.planInMonth) - 24 * 60 * 60 * 1000).getTime() ||
              date.getTime() >
              new Date(new Date(that.editForm.planInMonth).getFullYear(), new Date(that.editForm.planInMonth).getMonth() + 1, 0).getTime() + 24 * 60 * 60 * 1000 - 1 * 1000
            );
          }
        }
      };
    },
    parseTime (value) {
      return parseTime(value, '{y}{m}')
    },
    changeByEtdMonth (value) {
      let that = this
      console.log("value", value)
      if (this.editForm.productAirlineId) {
        airProductAirlineDetail(this.editForm.productAirlineId).then(res => {
          if (res && res.ok) {
            this.productAirlineDetail = res.content
          }
        });
      }

      if (this.editForm.planInMonth && this.editForm.productAirlineId) {
        airFlightPlanQueryByEtdMonth({
          etdYearMonth: this.parseTime(this.editForm.planInMonth),
          productAirlineId: this.editForm.productAirlineId
        }).then(res => {
          if (res && res.ok) {
            if (res.content.length > 0) {

              this.chargeForm.charges = res.content
              this.chargeForm.charges.forEach(v => {
                try {
                  v.etd2 = parseTime(v.etd, '{y}-{m}-{d} {h}:{i}')
                } catch (e) {
                  console.log(e)
                }
              })
            } else {
              this.chargeForm.charges = [{
                timeDefaultShow: new Date(that.editForm.planInMonth),
                flightNo: "",
                etd: "",
                palletSide: 1,
                etdDayWeek: "",
                boardModel: "",
                assessWeight: "",
                theoryVolume: "",
                remark: ""
              }]
            }
          }
        })
      }

    },
    init () {
      Promise.all([getAirLineList()]).then(results => {
        const productAirLine = results[0]
        if (productAirLine.ok) {
          this.productAirlineNameList = productAirLine.content
        }
      })
    },
    etdChange (index) {
      console.log("index", index)
      let item = this.chargeForm.charges[index]
      if (item.etd) {
        item.etdDayWeek = this.weekList[new Date(item.etd).getDay()]
        console.log(this.productAirlineDetail, new Date(item.etd).getDay())
        switch (new Date(item.etd).getDay()) {
          case 0:
            item.assessWeight = this.productAirlineDetail.sundayAssessWeight
            item.theoryVolume = this.productAirlineDetail.sundayTheoryVolume
            break;

          case 1:
            item.assessWeight = this.productAirlineDetail.mondayAssessWeight
            item.theoryVolume = this.productAirlineDetail.mondayTheoryVolume
            break;

          case 2:
            item.assessWeight = this.productAirlineDetail.tuesdayAssessWeight
            item.theoryVolume = this.productAirlineDetail.tuesdayTheoryVolume
            break;

          case 3:
            item.assessWeight = this.productAirlineDetail.wednesdayAssessWeight
            item.theoryVolume = this.productAirlineDetail.wednesdayTheoryVolume
            break;

          case 4:
            item.assessWeight = this.productAirlineDetail.thursdayAssessWeight
            item.theoryVolume = this.productAirlineDetail.thursdayTheoryVolume
            break;

          case 5:
            item.assessWeight = this.productAirlineDetail.fridayAssessWeight
            item.theoryVolume = this.productAirlineDetail.fridayTheoryVolume
            break;

          case 6:
            item.assessWeight = this.productAirlineDetail.saturdayAssessWeight
            item.theoryVolume = this.productAirlineDetail.saturdayTheoryVolume
            break;
          default:
            item.assessWeight = ""
            item.theoryVolume = ""
            break;
        }
      } else {
        item.etdDayWeek = ""
      }
      item.etd = new Date(item.etd).valueOf()
      console.log("item", item)

      this.$set(this.chargeForm.charges, index, item)
    },

    deleteFn (index) {
      this.chargeForm.charges.splice(index, 1)
    },
    addFn (index) {
      console.log("index", index)
      this.chargeForm.charges.unshift({
        timeDefaultShow: new Date(this.editForm.planInMonth),
        flightNo: "",
        etd: "",
        palletSide: 1,
        etdDayWeek: "",
        boardModel: "",
        assessWeight: "",
        theoryVolume: "",
        remark: ""
      })
    },
    saveFn () {
      let vb = false; let ve = false;
      this.$refs.chargeForm.validate(valid => {
        vb = valid
      })
      this.$refs.editForm.validate(valid => {
        ve = valid
      })
      if (ve && vb) {
        // this.loading = true
        let flightPlanInfoDTOList = []
        this.chargeForm.charges.forEach((i, index) => {
          if (!i.id) {
            flightPlanInfoDTOList.push(i)
          }
        })
        if (flightPlanInfoDTOList.length === 0) {
          this.$message.warning(this.$t("air.noNewContent"));
          return
        }
        console.log("c", flightPlanInfoDTOList)
        addAirFlightPlan({
          productAirlineName: this.productAirlineNameList.find(item => item.id === this.editForm.productAirlineId).productName,
          productAirlineId: this.editForm.productAirlineId,
          airFlightPlanInfoDTOList: flightPlanInfoDTOList
        }).then(res => {
          if (res && res.ok) {
            this.$message.success(this.$t("air.successSaved"));
            // this.changeByEtdMonth()
            this.backList()
          }
          // this.loading = false
        })
      }

    },

    backList () {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: `AirLineManagement` })
    },
    cancelFn () {
      this.$confirm(this.$t('air.cancelTip'), this.$t('air.tips'), {
        confirmButtonText: this.$t('air.determine'),
        cancelButtonText: this.$t('air.cancel'),
        type: 'warning'
      }).then(() => {
        this.backList()
      }).catch(() => {
      })
    }
  }
}
</script>

<style scoped lang="less">
.order-air-item {
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px 0 #eee, 0 0 6px 0 #eee;
  margin-bottom: 20px;
  padding: 10px;

  ::v-deep .el-form-item {
    margin-bottom: 0;
  }

  .title {
    font-weight: 600;
    line-height: 60px;
    padding: 0 20px;
    border-bottom: 1px solid #ccc;
  }

  .link {
    font-weight: 500;
    color: #1890ff;
  }

  .company {
    padding: 12px 20px;
    overflow: hidden;

    label {
      font-weight: 500;
      margin-right: 20px;
    }
  }
}

.add {
  padding: 70px;
  text-align: center;
  border: 1px dashed blue;
  box-shadow: 0 2px 4px 0 #eee, 0 0 6px 0 #eee;
}

.total {
  background: rgba(16, 142, 233, 0.1);
  color: #108ee9;
  font-family: "PingFangSC-Regular", "PingFang SC";
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  padding: 0px 10px;

  .value-item {
    display: inline-block;
    margin-right: 30px;

    .value {
      display: inline-block;
      margin-right: 5px;
    }
  }
}
</style>
