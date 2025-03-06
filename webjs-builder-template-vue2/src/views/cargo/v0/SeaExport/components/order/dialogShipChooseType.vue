<template>
  <el-dialog  :title="$t('sea.shipChooseType')" :visible.sync="shipChooseTypeDialog" :close-on-click-modal="false" :before-close="closeDialog" width="1290px" class="dialog-box">
    <el-form :inline="true" :model="dataForm" @submit.native.prevent ref="form">
      <div style="display: flex;justify-content: space-between;">
        <div>{{ receiptCode }}   > {{ destinationCode }}</div>
        <el-form-item :label="$t('sea.sailTime')" prop="shutType" style="width: 399px;">
          {{ etdTimeSearch }} {{ timeQuantum }}
        </el-form-item>
      </div>
      <div style="display: flex">
        <el-form-item :label="$t('sea.transportPath')" prop="transportationRoute">
          <el-select  v-model="dataForm.transportationRoute" :placeholder="$t('sea.placeholder')" filterable @change="transportPathChange" size="mini">
            <el-option :label="$t('sea.all')" :value="null"></el-option>
            <el-option :label="$t('sea.direct')" :value="0"></el-option>
            <el-option :label="$t('sea.transferOnce')" :value="1"></el-option>
            <el-option :label="$t('sea.multipleTransfers')" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('sea.outboundLiner')" prop="departureLiner">
          <el-checkbox-group v-model="dataForm.departureLiner" @change="transportPathChange">
            <div style="display: flex; width: 400px; flex-wrap: wrap;">
              <el-checkbox label="MON">{{ $t('sea.MON') }}</el-checkbox>
              <el-checkbox label="TUE">{{ $t('sea.TUE') }}</el-checkbox>
              <el-checkbox label="WED">{{ $t('sea.WED') }}</el-checkbox>
              <el-checkbox label="THU">{{ $t('sea.THUR') }}</el-checkbox>
              <el-checkbox label="FRI">{{ $t('sea.FRI') }}</el-checkbox>
              <el-checkbox label="SAT">{{ $t('sea.SAT') }}</el-checkbox>
              <el-checkbox label="SUN">{{ $t('sea.SUN') }}</el-checkbox>
            </div>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('sea.allSailingDates')" prop="shutType">
          {{ dataList.length }}
        </el-form-item>
        <el-form-item :label="$t('sea.shortestWay')" prop="shutType">
          {{shortestWay}}{{$t('sea.day')}}
        </el-form-item>
      </div>
      <el-table v-loading="loading"  class="dataTable" :data="dataList" ref="dataFrom" :height="$isEmpty(dataList)? '100px' : '300px'" @selection-change="dialogChange"  @select="dialogCheck" >
        <template slot="empty">
          {{$t('sea.noShipDateInformationCanBeFound')}}
          <el-button type="text" @click="getBookingJobScheduleListApi">{{ $t('sea.reQuery') }}</el-button>
          ，{{ $t('sea.or') }}<el-button type="text" @click="directEntry">{{ $t('sea.enterTheShipNameAndVoyageDirectly') }}</el-button>{{ $t('sea.booking') }}
        </template>
        <el-table-column type="selection" width="55" :selectable="handleDisable" :label="$t('sea.booking')"></el-table-column>
        <!--        <el-table-column prop="containerNo" :label="$t('sea.booking')" header-align="center"></el-table-column>-->
        <el-table-column prop="estimatedCutOffTime" :label="$t('sea.estimatedCutOffTime')">
          <template slot-scope="{row}">
            {{$moment(row.etdFormat,"YYYYMMDD").subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss')}}
            <el-tooltip v-if="$moment(row.etdFormat,'YYYYMMDD').subtract(2, 'days').diff($moment()) < 172800000"
                        class="item" effect="dark" :content="$t('sea.approachingEstimatedPortCutOffTime')" placement="top">
              <i class="el-icon-warning" style="color: red"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="etdFormat" :label="$t('sea.estimatedDeparture')"></el-table-column>
        <el-table-column prop="totalDuration" :label="$t('sea.onTheWay')" width="60"></el-table-column>
        <el-table-column prop="containerNo" :label="$t('sea.shipNameVoyageRoute')" width="600" header-align="center">
          <template slot-scope="{row}">
            <div style="display: flex; text-align: center">
              <div class="verticalCenter" style="width: 250px; ">
                <div>
                  <p>{{row.vessel}}</p>
                  <p>
                    {{row.voyage}} /{{row.routeCode}}
                  </p>
                </div>
                <template v-if="row.transitFlag">
                  <div v-if="row.secVessel" style="width: 100%">
                    <p>{{row.secVessel}}</p>
                    <p>
                      {{row.secVoyage}} <span v-if="row.secRouteCode">/ {{row.secRouteCode}}</span>
                    </p>
                  </div>
                  <div v-if="row.thirdVessel" style="width: 100%">
                    <p>{{row.thirdVessel}}</p>
                    <p>
                      {{row.thirdVoyage}} <span v-if="row.thirdRouteCode">/ {{row.thirdRouteCode}}</span>
                    </p>
                  </div>
                  <div v-if="row.fourVessel" style="width: 100%">
                    <p>{{row.fourVessel}}</p>
                    <p>
                      {{row.fourVoyage}} <span v-if="row.fourRouteCode">/ {{row.fourRouteCode}}</span>
                    </p>
                  </div>
                </template>

              </div>
              <div style="width: 300px">
                <p>{{row.pol}}</p>
                <i class="el-icon-arrow-down" style="color: #1890ff"></i>
                <!--                transitFlag false 直达-->
                <template v-if="row.transitFlag">
                  <template v-if="row.transitCode">
                    <p>{{row.transit}}</p>
                    <i class="el-icon-arrow-down" style="color: #1890ff"></i>
                  </template>
                  <template v-if="row.thirdPortName">
                    <p>{{row.thirdPortName}}</p>
                    <i class="el-icon-arrow-down" style="color: #1890ff"></i>
                  </template>
                  <template v-if="row.fourPortName">
                    <p>{{row.fourPortName}}</p>
                    <i class="el-icon-arrow-down" style="color: #1890ff"></i>
                  </template>
                </template>
                <p>{{row.pod}}</p>
              </div>
              <div style="width: 50px" class="verticalCenter">
                <span v-if="row.transitFlag">{{ $t('sea.transship') }}</span>
                <span v-else>{{ $t('sea.direct') }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="etaFormat" :label="$t('sea.expectedArrival')"></el-table-column>

      </el-table>
      <!--      <el-form v-if="showShippingInformationForm" :inline="true" :model="shippingInformationForm" @submit.native.prevent ref="shippingInformationForm"  height="250">-->
      <!--          <el-form-item :label="$t('sea.direct')+'/'+$t('sea.transship')" prop="transitFlag" :rules="[ { required: true, message:$t('sea.placeholder'), trigger: 'change'} ]" style="width: 100%">-->
      <!--            <el-radio-group v-model="shippingInformationForm.transitFlag" size="mini" @change="transitFlagChange">-->
      <!--              <el-radio :label="false" style="margin-right: 10px;">{{$t('sea.direct')}}</el-radio>-->
      <!--              <el-radio :label="true">{{$t('sea.transship')}}</el-radio>-->
      <!--            </el-radio-group>-->
      <!--          </el-form-item>-->
      <!--          &lt;!&ndash;            航线代码&ndash;&gt;-->
      <!--          &lt;!&ndash;            <el-form-item v-if="shippingInformationForm.transitFlag === false" :label="$t('sea.routeCode')" prop="routeCode" :rules="[ { required: true, message:$t('sea.placeholder'), trigger: 'blur'} ]" style="width: 100%">&ndash;&gt;-->
      <!--          &lt;!&ndash;              <el-input class="inputWidth" v-trim v-model="shippingInformationForm.routeCode" v-input-auto="'EN_num'" maxlength="1000" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>&ndash;&gt;-->
      <!--          &lt;!&ndash;            </el-form-item>&ndash;&gt;-->
      <!--          &lt;!&ndash;        船名&ndash;&gt;-->
      <!--          <el-form-item v-if="shippingInformationForm.transitFlag === false" style="width: 100%; position: relative" :label="$t('sea.shipName')" prop="vessel" size="mini" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">-->
      <!--            <el-input  class="inputWidth" v-trim v-model="shippingInformationForm.vessel" :disabled="shippingInformationForm.TBA3" v-input-auto="'EN_num_symbol'" maxlength="1000" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>-->
      <!--            <el-checkbox v-model="shippingInformationForm.TBA3" @change="(val)=>TBAChange(val,3)" style="position: absolute; right: -65px;top: 0;">TBA</el-checkbox>-->

      <!--          </el-form-item>-->

      <!--          &lt;!&ndash;        航次&ndash;&gt;-->
      <!--          <el-form-item v-if="shippingInformationForm.transitFlag === false" style="width: 100%" :label="$t('sea.voyage')" prop="voyage" size="mini" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">-->
      <!--            <el-input  class="inputWidth"  v-trim v-model="shippingInformationForm.voyage" :disabled="shippingInformationForm.TBA3" v-input-auto="'EN_num_symbol'" maxlength="1000" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>-->
      <!--          </el-form-item>-->
      <!--          &lt;!&ndash;            头程船名&ndash;&gt;-->
      <!--        <div style="display: flex">-->
      <!--          <div>-->
      <!--            <el-form-item v-if="shippingInformationForm.transitFlag" style="width: 100%; position: relative" :label="$t('sea.headWayshipName')" prop="vessel" size="mini" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">-->
      <!--              <el-input class="inputWidth" v-trim v-model="shippingInformationForm.vessel" :disabled="shippingInformationForm.TBA1" v-input-auto="'EN_num_symbol'" maxlength="1000" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>-->
      <!--              <el-checkbox  v-model="shippingInformationForm.TBA1" @change="(val)=>TBAChange(val,1)" style="position: absolute; right: -65px; top: 0;">TBA</el-checkbox>-->
      <!--            </el-form-item>-->
      <!--            <el-form-item v-if="shippingInformationForm.transitFlag" style="width: 100%" :label="$t('sea.firstVoyage')" prop="voyage" size="mini" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">-->
      <!--              <el-input class="inputWidth"  v-trim v-model="shippingInformationForm.voyage" :disabled="shippingInformationForm.TBA1"  v-input-auto="'EN_num_symbol'" maxlength="1000" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>-->
      <!--            </el-form-item>-->
      <!--          </div>-->
      <!--          <div style="margin-left: 50px">-->
      <!--            &lt;!&ndash;            二程船名&ndash;&gt;-->
      <!--            <el-form-item v-if="shippingInformationForm.transitFlag" style="width: 100%; position: relative" :label="$t('sea.secondShipName')" prop="secVessel" size="mini" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">-->
      <!--              <el-input :disabled="shippingInformationForm.TBA2"  class="inputWidth" v-trim v-model="shippingInformationForm.secVessel" v-input-auto="'EN_num_symbol'" maxlength="1000" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>-->
      <!--              <el-checkbox v-model="shippingInformationForm.TBA2" @change="(val)=>TBAChange(val,2)" style="position: absolute; right: -65px;top: 0;">TBA</el-checkbox>-->
      <!--            </el-form-item>-->
      <!--            <el-form-item v-if="shippingInformationForm.transitFlag" style="width: 100%" :label="$t('sea.secondVoyage')" prop="secVoyage" size="mini" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">-->
      <!--              <el-input :disabled="shippingInformationForm.TBA2" class="inputWidth"  v-trim v-model="shippingInformationForm.secVoyage"  v-input-auto="'EN_num_symbol'" maxlength="1000" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>-->
      <!--            </el-form-item>-->
      <!--          </div>-->
      <!--        </div>-->


      <!--      </el-form>-->

    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="submit" :disabled="submitDisabled">{{$t('sea.determine')}}</el-button>
        <el-button size="mini" @click="closeDialog">{{$t('sea.cancel')}}</el-button>
      </span>
  </el-dialog>
</template>
<script>
import lodash from 'lodash'
import {bookingJobScheduleListApi, exitCustomsContainerApi, seaShutOutApi} from "@/api/seaExportOrder"
export default {
  name: 'DialogShipChooseType',
  components: { },
  props: {
    // value: { type: String, default: null },
    shipChooseTypeDialog: { type: Boolean, default: true },
    showShipScheduleInquiry: { type: Boolean, default: false },
    bookingJobId: { type: String, default: null },
    containerListDataProp: { type: Object, default: () => {} },
    polCode: { type: String, default: null },
    podCode: { type: String, default: null },
    etdTimeSearch: { type: String, default: null },
    timeQuantum: { type: String, default: null },
    receiptCode: { type: String, default: null },
    destinationCode: { type: String, default: null }
  },
  computed: {
    shortestWay() {
      let totalDurationArr = []
      this.dataList.map(item => {
        totalDurationArr.push(item.totalDuration)
      })
      if (Math.min(...totalDurationArr) !== Infinity) {
        return Math.min(...totalDurationArr)
      } else {
        return 0
      }
    },
    submitDisabled() {
      if (this.$isNotEmpty(this.dataList) && this.$isEmpty(this.selectioned)) {
        return true
      } else {
        return false
      }
    }
  },
  data() {
    return {
      loading: false,
      dataForm: {
        departureLiner: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
        transportationRoute: null
      },
      dataList: [],
      containerListData: [],
      shippingInformationForm: {
        transitFlag: false
      },
      showShippingInformationForm: false,
      selectioned: null
    }
  },
  created() {
    this.getBookingJobScheduleListApi()
  },
  methods: {
    dialogCheck(selection, row) {
      this.$refs.dataFrom.clearSelection()
      if (selection.length === 0) { // 判断selection是否有值存在
        return
      }
      if (row) {
        this.selectioned = row
        this.$refs.dataFrom.toggleRowSelection(row, true)
      }
    },
    dialogChange(selection) {
      this.selectioned = selection[0]
    },
    handleDisable(row, index) {
      if (this.$moment(row.etd, 'YYYYMMDD').subtract(2, 'days').diff(this.$moment()) < 0) {
        return false
      } else {
        return true
      }
    },
    directEntry() {
      this.$emit('update:showShipScheduleInquiry', true)
      this.closeDialog()
    },
    TBAChange(val, type) {
      if (val) {
        if (type === 3) {
          this.$set(this.shippingInformationForm, 'vessel', 'TBA')
          this.$set(this.shippingInformationForm, 'voyage', '---')
          return
        }
        if (type === 1) {
          if (this.shippingInformationForm.TBA2) {
            this.$set(this.shippingInformationForm, 'TBA2', false)
            this.$set(this.shippingInformationForm, 'secVessel', '')
            this.$set(this.shippingInformationForm, 'secVoyage', '')
          }
          this.$set(this.shippingInformationForm, 'vessel', 'TBA')
          this.$set(this.shippingInformationForm, 'voyage', '---')
        } else if (type === 2) {
          if (this.shippingInformationForm.TBA1) {
            this.$set(this.shippingInformationForm, 'TBA1', false)
            this.$set(this.shippingInformationForm, 'vessel', '')
            this.$set(this.shippingInformationForm, 'voyage', '')
          }
          this.$set(this.shippingInformationForm, 'secVessel', 'TBA')
          this.$set(this.shippingInformationForm, 'secVoyage', '---')
        }
      } else {
        if (type === 1) {
          this.$set(this.shippingInformationForm, 'vessel', null)
          this.$set(this.shippingInformationForm, 'voyage', null)
        } else if (type === 2) {
          this.$set(this.shippingInformationForm, 'secVessel', null)
          this.$set(this.shippingInformationForm, 'secVoyage', null)
        }
      }
    },

    transportPathChange() {
      this.getBookingJobScheduleListApi()
    },
    async getBookingJobScheduleListApi() {
      this.loading = true
      const params = {
        polCode: this.polCode,
        podCode: this.podCode,
        etdTimeSearch: this.etdTimeSearch,
        timeQuantum: this.timeQuantum,
        transportationRoute: this.dataForm.transportationRoute,
        departureLiner: this.dataForm.departureLiner
      }
      const res = await bookingJobScheduleListApi(params)
      this.loading = false
      if (res.ok) {
        this.selectioned = {}
        this.showShippingInformationForm = false
        this.dataList = res.content || []
      }
    },
    async submit() {
      this.$emit('shipChooseSubmit', this.selectioned)
      this.closeDialog()
    },
    closeDialog() {
      this.$emit('update:shipChooseTypeDialog', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.icon{ font-size: 28px; transition: all 0.2s ease 0s; cursor: pointer;user-select: none;
  &:hover{ transform: scale(1.1)}
}
.blue{ color: #1890ff}
.red{color: #ff4949}
.flex-bet{ display: flex; align-items:flex-start ; justify-content: space-between;flex-wrap:wrap;}
.box_title{ border-left: solid 3px rgb(24,144,255);font-size: 18px; color: #199ED8; padding-left: 8px; height: 28px; line-height: 28px; margin:5px 0 8px 0; display: flex;
  .operate-buttons-left{ margin-left: 20px}
}
.box{ background-color: #f5f7f7; padding: 8px;
  ::v-deep .el-form-item--medium{
    .el-form-item__content{ line-height: 28px}
    .el-form-item__label{ line-height: 28px}
  }
}
.box_child{border: solid 1px rgba(121, 121, 121, 1); padding: 20px 30px; background: #fff; margin-bottom: 15px;
  .box25{ width: 20%}
}
::v-deep .el-form--inline .el-form-item{ display: block}
//**
.case-data-table{ width: 90%;
  ::v-deep {
    .el-form-item{ margin: 10px 0}
    .el-form-item__error{ display: none;}
  }
}

.el-input__inner.disabled {
  background-color: #F5F7FA;
  border-color: #dfe4ed;
  color: #606266 ;
  cursor: not-allowed;
}
::v-deep .el-checkbox{ display: block}
::v-deep .el-table__header .el-table-column--selection .cell  {
  .el-checkbox__input{ display: none}
  .el-checkbox:after{
    content: "订舱";color: #909399;
    font-weight: bold;
  }

}
p{ margin: 0}
.verticalCenter{display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;}
::v-deep .el-table .cell{ padding-top: 5px; padding-bottom: 5px}
</style>
