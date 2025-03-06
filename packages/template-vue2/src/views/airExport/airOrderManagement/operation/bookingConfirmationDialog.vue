<template>
  <!-- 订舱确认 -->
  <el-dialog :title="$t('air.bookingConfirmation')" :visible.sync="visible" width="900px" @close="closeFn"
    v-loading="loading">
    <el-form ref="bookingConfirmationFormRef" :model="bookingConfirmationMode" :rules="shippingSpaceRules"
      label-width="95px" label-position="left" class="shippingSpaceForm" @close="closeFn">
      <!-- 舱位类型 -->
      <el-form-item :label="$t('air.shippingSpaceTypeDesc')" prop="shippingSpaceType" size="mini">
        <el-select v-model="bookingConfirmationMode.shippingSpaceType" :placeholder="$t('air.placeholder')" disabled>
          <el-option :label="$t('air.ownShippingSpace')" :value="2"></el-option>
          <el-option :label="$t('air.agentShippingSpace')" :value="3"></el-option>
          <el-option :label="$t('air.bellyholdService')" :value="4"></el-option>
        </el-select>
      </el-form-item>

      <!-- 产品航线 -->
      <!-- <el-form-item :label="$t('air.productAirlineName')" prop="productAirlineId" size="mini"
        :rules="[{ required: bookingConfirmationMode.shippingSpaceType == 2, message: $t('air.requiredProductAirLine'), trigger: 'change' }]">
        <el-select filterable clearable v-model="bookingConfirmationMode.productAirlineId"
          :placeholder="$t('air.placeholder')" @change="selectProductAirLine">
          <el-option v-for="(item, index) in productAirlineNameList" :label="item.productName" :value="item.id"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item> -->
      <!-- 订舱代理 -->
      <el-form-item :label="$t('air.bookingAgentPort')" prop="bookingAgentId"
        v-if="bookingConfirmationMode.shippingSpaceType === 3"
        :rules="[{ required: bookingConfirmationMode.shippingSpaceType === 3, message: $t('air.requiredBookingAgentPort'), trigger: 'change' }]">
        <!-- <cargo-limited-select :select-label="bookingConfirmationMode.bookingAgentName"
          :select-value="bookingConfirmationMode.bookingAgentId" :method-params="{ range: ['b_booking_agent'] }"
          type="customer" style="width: 100%;" @set="setBookingAgentInfo" /> -->

        <type-select v-model="bookingConfirmationMode.bookingAgentName" type="supplier" style="width: 100%;"
          :request-params="{ 'partnerRole': 14014, 'businessType': 'AIR_EXPORT' }" @selected="setBookingAgentInfo" />
      </el-form-item>
      <!-- 航空公司 -->
      <el-form-item :label="$t('air.airline')" prop="airlineId"
        :rules="[{ required: bookingConfirmationMode.shippingSpaceType === 2 || bookingConfirmationMode.shippingSpaceType === 4, message: $t('air.requiredAirline'), trigger: 'change' }]">
        <!-- <cargo-limited-select :placeholder="$t('air.placeholder')" :method="airCustomerMethod"
          :select-label="bookingConfirmationMode.airlineName" :select-value="bookingConfirmationMode.airlineId"
          type="customer" style="width: 100%;" @set="setAirCustomerInfo" /> -->

        <type-select :placeholder="$t('air.placeholder')" v-model="bookingConfirmationMode.airlineName" type="airLine"
          style="width: 100%;" @selected="setAirCustomerInfo" />
      </el-form-item>
      <!-- 航班号 -->
      <el-form-item :label="$t('air.flightNo')" prop="flightNo">
        <el-input v-model.trim="bookingConfirmationMode.flightNo" class="job-no-input" size="mini" />
      </el-form-item>

      <!-- 主单号 -->
      <el-form-item :label="$t('air.mblNoName')" :rules="[{ required: true }]">
        <el-row>
          <el-col :span="8">
            <el-form-item prop="mblNo1" style="width: 100%">
              <el-input v-model.trim="bookingConfirmationMode.mblNo1" class="job-no-input" size="mini" @input="checkMblNo"
                maxlength="3" v-input-limit="[-9, 2]" />
            </el-form-item>
          </el-col>
          <el-col :span="1">-</el-col>
          <el-col :span="15">
            <el-form-item prop="mblNo2" style="width: 100%">
              <el-input v-model.trim="bookingConfirmationMode.mblNo2" class="job-no-input" size="mini" @input="checkMblNo"
                maxlength="8" v-input-limit="[-9, 2]" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-input v-model.trim="bookingConfirmationMode.mblNo" class="job-no-input" size="mini" @input="checkMblNo" /> -->
        <div style="font-size: 13px;margin-top: -10px;height: 10px;color:coral" v-if="existsByMblNoVisible">
          {{ $t('air.existMblNo') }} </div>
      </el-form-item>


      <!-- <el-form-item :label="$t('air.mblNoName')" prop="mblNo">
        <el-input v-model.trim="bookingConfirmationMode.mblNo" class="job-no-input" size="mini" @input="checkMblNo" />
        <div style="font-size: 13px;margin-top: -10px;height: 10px;color:coral" v-if="existsByMblNoVisible">
          {{ $t('air.existMblNo') }} </div>
      </el-form-item> -->
      <!-- 进仓代理 -->
      <el-form-item :label="$t('air.loadingAgentName')" prop="loadingAgentId">
        <type-select v-model="bookingConfirmationMode.loadingAgentName" type="member" @selected="setLoadingAgentInfo" />
      </el-form-item>
      <!-- 入仓编号 -->
      <el-form-item :label="$t('air.inboundNo')" prop="inboundNo">
        <el-input v-model.trim="bookingConfirmationMode.inboundNo" class="job-no-input" size="mini" />
      </el-form-item>
      <!-- 截止入仓时间 -->
      <el-form-item :label="$t('air.inboundDeadline')" prop="inboundDeadline">
        <CommonPicker v-model="bookingConfirmationMode.inboundDeadline" pikcer-type="datetime"
          pickerFormat="yyyy-MM-dd HH:mm" size="mini" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeFn" size="mini">{{ $t('air.cancel') }}</el-button>
      <el-button type="primary" @click="submitBaseInfo" size="mini">{{ $t('air.determine') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { updateBookingInfo, getAirLineList, existsByMblNo } from '@/api/airExport'
import { airLineListApi, airportListApi } from '@/api/common'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'
import { logServiceName, airLogBusinessType, logOrigin } from '@/utils/constant'
import orderMixin from '../orderMixin'

export default {
  name: 'ShippingSpaceForm',
  components: {
    cargoLimitedSelect
  },
  mixins: [orderMixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    order: {
      type: Object,
      default: function () {
        return {}
      }
    },
    job: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      existsByMblNoVisible: false,
      loading: false,
      productAirlineNameList: [],
      airCustomerMethod: airLineListApi,
      bookingConfirmationMode: {
        shippingSpaceType: '',
        // productAirlineName: '',
        // productAirlineId: "",
        airlineId: '',
        airlineName: '',
        airlineScacCode: '',
        bookingAgentId: '',
        bookingAgentName: '',
        mblNo: '',
        mblNo1: '',
        mblNo2: "",
        loadingAgentId: '',
        loadingAgentName: '',
        flightNo: '',
        inboundNo: '',
        inboundDeadline: '',
        podCode: '', // 卸货港
        pod: '',
        polCode: '', // 装货港
        pol: ''

      },
      shippingSpaceRules: {
        "shippingSpaceType": [{ required: true, message: this.$t('air.requiredShippingSpaceType'), trigger: 'change' }],
        "mblNo": [{ required: true, message: this.$t('air.requiredMblNo'), trigger: 'blur' }],
        "mblNo1": [{ required: true, message: this.$t('air.pleaseEnter'), trigger: 'blur' }],
        "mblNo2": [{ required: true, message: this.$t('air.requiredMblNo'), trigger: 'blur' }],
        "flightNo": [{ required: true, message: this.$t('air.requiredFlightNo'), trigger: 'blur' }]
      },
      freightTermList: [],
      airLineSplit: []
    }
  },
  watch: {
    visible (val) {
      if (val) {
        // 产品航线列表
        // getAirLineList().then(res => {
        //   this.productAirlineNameList = res.content
        // })
        let config = this.order.id ? this.order : this.job

        console.log("mblNo1", config.baseDTO.mblNo.split("-")[0])
        console.log("mblNo2", config.baseDTO.mblNo.split("-")[1])
        this.bookingConfirmationMode = {
          shippingSpaceType: config.spaceDTO.shippingSpaceType,
          mblNo: config.baseDTO.mblNo,
          mblNo1: config.baseDTO.mblNo.split("-")[0],
          mblNo2: config.baseDTO.mblNo.split("-")[1],
          airlineId: config.spaceDTO.airlineId,
          airlineName: config.spaceDTO.airlineName,
          airlineScacCode: config.spaceDTO.airlineScacCode,
          bookingAgentId: config.spaceDTO.bookingAgentId,
          bookingAgentName: config.spaceDTO.bookingAgentName,
          flightNo: config.spaceDTO.flightNo,
          loadingAgentId: config.spaceDTO.loadingAgentId, // 进仓代理
          loadingAgentName: config.spaceDTO.loadingAgentName, // 进仓代理名称
          // productAirlineName: config.spaceDTO.productAirlineName, // 产品航线
          // productAirlineId: config.spaceDTO.productAirlineId, // 产品航线id
          inboundNo: config.spaceDTO.inboundNo, // 入仓编号
          inboundDeadline: config.spaceDTO.inboundDeadline, // 截止入仓时间
          podCode: config.spaceDTO.podCode, // 卸货港
          pod: config.spaceDTO.pod,
          polCode: config.spaceDTO.polCode, // 装货港
          pol: config.spaceDTO.pol
        }
      }
    }
  },
  created () {

  },
  methods: {
    checkMblNo () {
      if (this.bookingConfirmationMode.mblNo1 && this.bookingConfirmationMode.mblNo2) {
        let data = {
          "mblNo": this.bookingConfirmationMode.mblNo1 + "-" + this.bookingConfirmationMode.mblNo2,
          "orderNo": this.order.baseDTO.orderNo
        }
        existsByMblNo(data).then(res => {
          if (res.content) {
            this.existsByMblNoVisible = true
          } else {
            this.existsByMblNoVisible = false
          }
        })
      } else {
        this.existsByMblNoVisible = false
      }
    },
    setLoadingAgentInfo (customer) {
      if (customer.id) {
        this.bookingConfirmationMode.loadingAgentId = customer.id
        this.bookingConfirmationMode.loadingAgentName = customer.chineseName
      } else {
        this.bookingConfirmationMode.loadingAgentId = ""
        this.bookingConfirmationMode.loadingAgentName = ""
      }
    },
    closeFn () {
      this.$emit('close')
    },
    submitBaseInfo () {
      if (this.bookingConfirmationMode.mblNo1 && this.bookingConfirmationMode.mblNo2) {
        if (this.bookingConfirmationMode.mblNo2.length !== 8) {
          this.$message.error(this.$t('air.existMblNo2Error'))
          return
        }
        this.bookingConfirmationMode.mblNo = this.bookingConfirmationMode.mblNo1 + "-" + this.bookingConfirmationMode.mblNo2
      }
      let data = this.bookingConfirmationMode

      // if (data.shippingSpaceType == 3) {
      //   data.airlineId = ""
      //   data.airlineName = ""
      //   data.airlineScacCode = ""
      // }

      this.$refs.bookingConfirmationFormRef.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.airLineSplit.length > 2) {
            // 装货港
            airportListApi({
              "code": this.airLineSplit[1]
            }).then(res => {
              if (res && res.ok && res.content.list.length > 0) {
                this.bookingConfirmationMode.polCode = res.content.list[0].code3 // 装货港
                this.bookingConfirmationMode.pol = res.content.list[0].englishName // 装货港
              }
              // 卸货港
              airportListApi({
                "code": this.airLineSplit[2]
              }).then(res => {
                if (res && res.ok && res.content.list.length > 0) {
                  this.bookingConfirmationMode.podCode = res.content.list[0].code3 // 卸货港
                  this.bookingConfirmationMode.pod = res.content.list[0].englishName // 卸货港
                }
                console.log("data2:", data)
                // 添加日志 记录数据
                this.logBtnSend({
                  origin: logOrigin.LOGISTICS_LINKS,
                  logCode: airLogBusinessType.BOOKING_CONFIRMATION,
                  serviceName: logServiceName.AIR_SERVICE,
                  businessType: airLogBusinessType.BOOKING_CONFIRMATION,
                  content: {
                    "orderId": this.order.id,
                    ...data
                  }
                })
                updateBookingInfo(this.order.id, data).then(res => {
                  if (res && res.ok) {
                    this.$emit('refresh')
                    this.$message.success(this.$t('air.bookingConfirmationSuccessfulEnd'))
                    this.closeFn()
                    this.adjustConfirmFn(this.order)
                  }
                  this.loading = false
                })
              })
            })
          } else {
            console.log("data:", data)
            // 添加日志 记录数据
            this.logBtnSend({
              origin: logOrigin.LOGISTICS_LINKS,
              logCode: airLogBusinessType.BOOKING_CONFIRMATION,
              serviceName: logServiceName.AIR_SERVICE,
              businessType: airLogBusinessType.BOOKING_CONFIRMATION,
              content: {
                "orderId": this.order.id,
                ...data
              }
            })
            updateBookingInfo(this.order.id, data).then(res => {
              if (res && res.ok) {
                this.$emit('refresh')
                this.$message.success(this.$t('air.bookingConfirmationSuccessfulEnd'))
                this.closeFn()
                this.adjustConfirmFn(this.order)
              }
              this.loading = false
            })
          }

        }
      })
    },
    setAirCustomerInfo (customer) {
      this.bookingConfirmationMode.airlineId = customer.id
      this.bookingConfirmationMode.airlineName = customer.chineseName
      this.bookingConfirmationMode.airlineScacCode = customer.scacCode
    },
    setBookingAgentInfo (customer) {
      this.bookingConfirmationMode.bookingAgentName = customer.chineseName
      this.bookingConfirmationMode.bookingAgentId = customer.id
    }

    // selectProductAirLine (airLineId) {

    //   // 用户选择的产品航线为【CZ包板-PVG-AMS】时，CZ为跟航司code匹配；PVG为装货港三字码，AMS为卸货港三字码
    //   if (airLineId) {
    //     let airLine = this.productAirlineNameList.find(item => item.id == airLineId).productName
    //     this.bookingConfirmationMode.productAirlineName = airLine

    //     this.airLineSplit = airLine.split("-");
    //     console.log("airLineSplit", this.airLineSplit)
    //     // 航空公司  正则中文去除
    //     airLineListApi({
    //       "code": this.airLineSplit[0].replace(/[\u4e00-\u9fa5]/g, "")
    //     }).then(res => {
    //       // 航空公司
    //       this.bookingConfirmationMode.airlineId = res.content.list[0].id
    //       this.bookingConfirmationMode.airlineName = res.content.list[0].chineseName
    //       this.bookingConfirmationMode.airlineScacCode = res.content.list[0].scacCode
    //     })
    //   }

    // }

  }
}
</script>

<style scoped lang="less">
.shippingSpaceForm {
  overflow: hidden;

  ::v-deep .el-form-item {
    width: 33%;
    float: left;
  }

  ::v-deep .el-col {
    margin-top: 0px;
  }

  ::v-deep .el-form-item__label {
    text-align: right;
  }
}

.dialog-footer {
  text-align: center;
}
</style>
