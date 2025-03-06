<template>
  <!-- 舱位改配 -->
  <el-dialog :title="$t('air.shippingSpaceToMatch')" :visible.sync="visible" width="900px" @close="closeFn"
    v-loading="loading">
    <el-form ref="shippingSpaceFormRef" :model="shippingSpaceModel" :rules="shippingSpaceRules" label-width="95px"
      label-position="left" class="shippingSpaceForm" @close="closeFn">
      <!-- 舱位类型 -->
      <el-form-item :label="$t('air.shippingSpaceTypeDesc')" prop="shippingSpaceType" size="mini">
        <el-select v-model="shippingSpaceModel.shippingSpaceType" :placeholder="$t('air.placeholder')"
          @change="selectedShippingSpaceType">
          <el-option :label="$t('air.ownShippingSpace')" :value="2"></el-option>
          <el-option :label="$t('air.agentShippingSpace')" :value="3"></el-option>
          <el-option :label="$t('air.bellyholdService')" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <!-- 航空公司 -->
      <el-form-item :label="$t('air.airline')" prop="airlineId"
        :rules="[{ required: Number(shippingSpaceModel.shippingSpaceType) === 2 || Number(shippingSpaceModel.shippingSpaceType) === 4, message: $t('air.requiredAirline'), trigger: 'change' }]">
        <!-- <cargo-limited-select :placeholder="$t('air.placeholder')" :method="airCustomerMethod"
          :disabled="shippingSpaceModel.shippingSpaceType == 2" :select-label="shippingSpaceModel.airlineName"
          :select-value="shippingSpaceModel.airlineId" type="customer" style="width: 100%;" @set="setAirCustomerInfo" /> -->

        <type-select :placeholder="$t('air.placeholder')" v-model="shippingSpaceModel.airlineName" type="airLine"
          style="width: 100%;" @selected="setAirCustomerInfo"
          :disabled="Number(shippingSpaceModel.shippingSpaceType) === 2" />
      </el-form-item>
      <!-- 收货地 -->
      <el-form-item :label="$t('air.delivery')" prop="deliveryCode">
        <el-row>
          <el-col :span="10">
            <type-select v-model="shippingSpaceModel.deliveryCode" type="airport" @selected="selectedDelivery" />
          </el-col>
          <el-col :span="14" style="padding-left: 10px;">
            <el-input v-model="shippingSpaceModel.delivery" class="job-no-input" size="mini" disabled />
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 产品航线 -->
      <el-form-item :label="$t('air.productLine')" prop="productAirlineId" size="mini"
        :rules="[{ required: Number(shippingSpaceModel.shippingSpaceType) === 2, message: $t('air.requiredProductAirLine'), trigger: 'change' }]">
        <el-select filterable clearable v-model="shippingSpaceModel.productAirlineId" :placeholder="$t('air.placeholder')"
          @change="selectProductAirLine"
          :disabled="Number(shippingSpaceModel.shippingSpaceType) === 3 || Number(shippingSpaceModel.shippingSpaceType) === 4">
          <el-option v-for="(item, index) in productAirlineNameList" :label="item.productName" :value="item.id"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 订舱代理 -->
      <el-form-item :label="$t('air.bookingAgentPort')" prop="bookingAgentId"
        :rules="[{ required: Number(shippingSpaceModel.shippingSpaceType) === 3, message: $t('air.requiredBookingAgentPort'), trigger: 'change' }]">
        <!-- <cargo-limited-select :select-label="shippingSpaceModel.bookingAgentName"
          :select-value="shippingSpaceModel.bookingAgentId" :method-params="{ range: ['b_booking_agent'] }"
          type="customer" style="width: 100%;" @set="setBookingAgentInfo" /> -->

        <type-select v-model="shippingSpaceModel.bookingAgentName" type="supplier" style="width: 100%;"
          :request-params="{ 'partnerRole': 14014, 'businessType': 'AIR_EXPORT' }" @selected="setBookingAgentInfo" />
      </el-form-item>


      <!-- 装货港 -->
      <el-form-item :label="$t('air.pol')" prop="polCode">
        <el-row>
          <el-col :span="10">
            <type-select v-model="shippingSpaceModel.polCode" type="airport" @selected="selectedPol"
              :disabled="Number(shippingSpaceModel.shippingSpaceType) === 2" />
          </el-col>
          <el-col :span="14" style="padding-left: 10px;">
            <el-input v-model="shippingSpaceModel.pol" class="job-no-input" size="mini" disabled />
          </el-col>
        </el-row>
      </el-form-item>

      <!-- <el-form-item :label="$t('air.mblNoName')" prop="mblNo">
        <el-input v-model.trim="shippingSpaceModel.mblNo" class="job-no-input" size="mini" @input="checkMblNo" />
        <div style="font-size: 13px;margin-top: -10px;height: 10px;color:coral" v-if="existsByMblNoVisible">主单号重复</div>
      </el-form-item> -->
      <!-- 航线计划 -->
      <el-form-item :label="$t('air.routePlan')" prop="planAirlineName" size="mini"
        :rules="[{ required: Number(shippingSpaceModel.shippingSpaceType) === 2, message: $t('air.requiredRoutePlan'), trigger: 'change' }]">
        <el-select filterable @change="selectplanAirlineNameList" clearable v-model="shippingSpaceModel.planAirlineName"
          :placeholder="$t('air.placeholder')"
          :disabled="Number(shippingSpaceModel.shippingSpaceType) === 3 || Number(shippingSpaceModel.shippingSpaceType) === 4">
          <el-option v-for="(item, index) in planAirlineNameList" :label="item.planAirlineName" :value="item.id"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 进仓代理 -->
      <el-form-item :label="$t('air.loadingAgentName')" prop="loadingAgentId">
        <type-select v-model="shippingSpaceModel.loadingAgentName" type="member" @selected="setLoadingAgentInfo" />
      </el-form-item>
      <!-- 中转港 -->
      <el-form-item :label="$t('air.transitPort')" prop="potCode">
        <el-row>
          <el-col :span="10">
            <!-- :disabled="shippingSpaceModel.shippingSpaceType == 2" -->
            <type-select v-model="shippingSpaceModel.potCode" type="airport" @selected="selectedPot" />
          </el-col>
          <el-col :span="14" style="padding-left: 10px;">
            <el-input v-model="shippingSpaceModel.pot" class="job-no-input" size="mini" disabled />
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 主单号 -->
      <el-form-item :label="$t('air.mblNoName')" :rules="[{ required: true }]">
        <el-row>
          <el-col :span="8">
            <el-form-item prop="mblNo1" style="width: 100%">
              <el-input v-model.trim="shippingSpaceModel.mblNo1" class="job-no-input" size="mini" @input="checkMblNo"
                maxlength="3" v-input-limit="[-9, 2]" />
            </el-form-item>
          </el-col>
          <el-col :span="1">-</el-col>
          <el-col :span="15">
            <el-form-item prop="mblNo2" style="width: 100%">
              <el-input v-model.trim="shippingSpaceModel.mblNo2" class="job-no-input" size="mini" @input="checkMblNo"
                maxlength="8" v-input-limit="[-9, 2]" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-input v-model.trim="bookingConfirmationMode.mblNo" class="job-no-input" size="mini" @input="checkMblNo" /> -->
        <div style="font-size: 13px;margin-top: -10px;height: 10px;color:coral" v-if="existsByMblNoVisible">
          {{ $t('air.existMblNo') }} </div>
      </el-form-item>


      <!-- 目的港代理 -->
      <el-form-item :label="$t('air.destinationAgentName')" prop="destinationAgentName" :rules="[{
        required: (order.spaceDTO.tradeTerm === 'EXW' || order.spaceDTO.tradeTerm === 'DDU'
          || order.spaceDTO.tradeTerm === 'DDP' || order.spaceDTO.tradeTerm === 'DAP'),
        message: $t('air.pleaseSelectData'), trigger: 'change'
      }]">

        <!-- <cargo-limited-select :select-label="shippingSpaceModel.destinationAgentName"
          :select-value="shippingSpaceModel.destinationAgentId" :method-params="{ range: ['b_booking_agent'] }"
          type="customer" style="width: 100%;" @set="setDestinationAgentInfo" /> -->
        <type-select v-model="shippingSpaceModel.destinationAgentName" type="supplier" :requestParams="partnerRoleParams"
          clearable @selected="setDestinationAgentInfo" />

      </el-form-item>

      <!-- 目的港 -->
      <el-form-item :label="$t('air.pod2')" prop="podCode">
        <el-row>
          <el-col :span="10">
            <type-select v-model="shippingSpaceModel.podCode" type="airport" @selected="selectedPod"
              :disabled="Number(shippingSpaceModel.shippingSpaceType) === 2" />
          </el-col>
          <el-col :span="14" style="padding-left: 10px;">
            <el-input v-model="shippingSpaceModel.pod" class="job-no-input" size="mini" disabled />
          </el-col>
        </el-row>
      </el-form-item>

      <!-- 预计航班时间 -->
      <el-form-item :label="$t('air.etd2')" prop="etd">
        <CommonPicker v-model="shippingSpaceModel.etd" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm" size="mini"
          :disabled="Number(shippingSpaceModel.shippingSpaceType) === 2" />
      </el-form-item>
      <!-- 航班号 -->
      <el-form-item :label="$t('air.flightNo')" prop="flightNo">
        <el-input v-model.trim="shippingSpaceModel.flightNo" class="job-no-input" size="mini"
          :disabled="Number(shippingSpaceModel.shippingSpaceType) === 2" />
      </el-form-item>
      <!-- 交货地 -->
      <el-form-item :label="$t('air.receipt')" prop="receiptCode">
        <el-row>
          <el-col :span="10">
            <type-select v-model="shippingSpaceModel.receiptCode" type="airport" @selected="selectedReceipt" />
          </el-col>
          <el-col :span="14" style="padding-left: 10px;">
            <el-input v-model="shippingSpaceModel.receipt" class="job-no-input" size="mini" disabled />
          </el-col>
        </el-row>
      </el-form-item>

      <!-- 预计到港时间 -->
      <el-form-item :label="$t('air.eta2')" prop="eta">
        <CommonPicker v-model="shippingSpaceModel.eta" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm"
          size="mini" />
      </el-form-item>


    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeFn" size="mini">{{ $t('air.cancel') }}</el-button>
      <el-button type="primary" @click="submitBaseInfo" size="mini">{{ $t('air.determine') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { updateAirExportOrderShippingSpaceApi, updateAirExportJobShippingSpaceApi, getAirLineList, existsByMblNo, airFlightPlanQueryByEtdMonth } from '@/api/airExport'
import { getTerminologyListByTypeApi, airLineListApi, airportListApi } from '@/api/common'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'
import { parseTime, formatNumberToThousands } from '@/utils/index'
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
      partnerRoleParams: {
        partnerRole: 14012
      },
      planAirlineNameList: [],
      existsByMblNoVisible: false,
      loading: false,
      productAirlineNameList: [],
      airCustomerMethod: airLineListApi,
      shippingSpaceModel: {
        shippingSpaceType: '',
        productAirlineName: '', // 产品航线
        productAirlineId: "",
        airlineId: '',
        airlineName: '',
        airlineScacCode: '',
        delivery: '', // 收货地
        deliveryCode: '', // 收货地港代码
        pol: '',
        polCode: '',
        blMode: '',
        mblNo: '',
        mblNo1: '',
        mblNo2: '',
        bookingAgentId: '',
        bookingAgentName: '',
        podCode: '',
        pod: '',
        etd: '',
        loadingAgentId: '',
        loadingAgentName: '',
        receiptCode: '',
        receipt: '',
        eta: '',
        destinationAgentId: '',
        destinationAgentName: '',
        flightNo: '',
        flightPlanId: "",
        potCode: "",
        pot: ""
      },
      shippingSpaceRules: {
        // "blMode": [{ required: true, message: '请选择操作模式', trigger: 'change' }],
        "shippingSpaceType": [{ required: true, message: this.$t('air.requiredShippingSpaceType'), trigger: 'change' }],
        "polCode": [{ required: true, message: this.$t('air.requiredPol'), trigger: 'change' }],
        "mblNo": [{ required: true, message: this.$t('air.requiredMblNo'), trigger: 'blur' }],
        "mblNo1": [{ required: true, message: this.$t('air.pleaseEnter'), trigger: 'blur' }],
        "mblNo2": [{ required: true, message: this.$t('air.requiredMblNo'), trigger: 'blur' }],
        "podCode": [{ required: true, message: this.$t('air.requiredPod'), trigger: 'change' }],
        // "mblFreightTerm": [{ required: true, message: '请选择主单运费条款', trigger: 'change' }],
        "receiptCode": [{ required: true, message: this.$t('air.requiredReceiptCode'), trigger: 'change' }],
        // "tradeTerm": [{ required: true, message: '请选择贸易条款', trigger: 'change' }],
        "flightNo": [{ required: true, message: this.$t('air.requiredFlightNo'), trigger: 'blur' }],
        "receipt": [{ required: true, message: this.$t('air.requiredReceiptCode'), trigger: 'blur' }],
        "etd": [{ required: true, message: this.$t('air.requiredEtd2'), trigger: 'blur' }]
      },
      freightTermList: []
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.initBasicData()
        let config = this.order.id ? this.order : this.job
        this.shippingSpaceModel = {
          blMode: config.spaceDTO.blMode,
          shippingSpaceType: config.spaceDTO.shippingSpaceType,
          productAirlineName: config.spaceDTO.productAirlineName,
          productAirlineId: config.spaceDTO.productAirlineId,
          pol: config.spaceDTO.pol,
          polCode: config.spaceDTO.polCode,
          mblNo: config.baseDTO.mblNo,
          mblNo1: config.baseDTO.mblNo.split("-")[0],
          mblNo2: config.baseDTO.mblNo.split("-")[1],
          airlineId: config.spaceDTO.airlineId,
          airlineName: config.spaceDTO.airlineName,
          airlineScacCode: config.spaceDTO.airlineScacCode,
          podCode: config.spaceDTO.podCode,
          pod: config.spaceDTO.pod,
          pot: config.spaceDTO.pot,
          potCode: config.spaceDTO.potCode,
          delivery: config.spaceDTO.delivery,
          deliveryCode: config.spaceDTO.deliveryCode,
          receiptCode: config.spaceDTO.receiptCode,
          receipt: config.spaceDTO.receipt,
          bookingAgentId: config.spaceDTO.bookingAgentId,
          bookingAgentName: config.spaceDTO.bookingAgentName,
          loadingAgentId: config.spaceDTO.loadingAgentId,
          loadingAgentName: config.spaceDTO.loadingAgentName,
          destinationAgentId: config.spaceDTO.destinationAgentId,
          destinationAgentName: config.spaceDTO.destinationAgentName,
          flightNo: config.spaceDTO.flightNo,
          etd: config.spaceDTO.etd,
          eta: config.spaceDTO.eta,
          flightPlanId: config.flightPlanId,
          planAirlineName: ""
        }
        if (this.shippingSpaceModel.productAirlineId) {
          this.selectProductAirLine(this.shippingSpaceModel.productAirlineId, config.flightPlanId)
        }


      }
    }
  },
  created () {

  },
  methods: {
    selectedShippingSpaceType (item) {
      if (item === 3 || item === 4) {
        this.shippingSpaceModel.airlineId = ""
        this.shippingSpaceModel.airlineName = ""
        this.shippingSpaceModel.airlineScacCode = ""
        this.shippingSpaceModel.productAirlineName = ""
        this.shippingSpaceModel.productAirlineId = ""
        this.shippingSpaceModel.flightPlanId = ""
        this.shippingSpaceModel.planAirlineName = ""
        this.planAirlineNameList = []
      }
    },
    selectplanAirlineNameList (planAirLineId) {
      console.log(planAirLineId)
      if (planAirLineId) {
        console.log("this.planAirlineNameList", this.planAirlineNameList, planAirLineId)
        this.shippingSpaceModel.flightPlanId = planAirLineId
        let planAirline = this.planAirlineNameList.find(item => item.id === planAirLineId)
        console.log("productAir:", planAirline)
        if (planAirline) {
          this.shippingSpaceModel.etd = planAirline.etd
          this.shippingSpaceModel.flightNo = planAirline.flightNo
        }
      }
    },
    parseTime2 (value) {
      return parseTime(value, '{m}-{d}')

    },
    checkMblNo () {
      if (this.shippingSpaceModel.mblNo1 && this.shippingSpaceModel.mblNo2) {
        let data = {
          "mblNo": this.shippingSpaceModel.mblNo1 + "-" + this.shippingSpaceModel.mblNo2,
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
    initBasicData () {
      Promise.all([getAirLineList(), getTerminologyListByTypeApi('FREIGHTTERM')]).then(results => {
        // 产品航线列表
        const productAirlineRes = results[0]
        const freightTermListRes = results[1]

        if (productAirlineRes.ok) {

          this.productAirlineNameList = productAirlineRes.content
          console.log("productAirlineRes", productAirlineRes, this.productAirlineNameList)
        }
        if (freightTermListRes.ok) {
          this.freightTermList = freightTermListRes.content
        }

      })
    },
    closeFn () {
      this.$emit('close')
    },
    submitBaseInfo () {
      if (this.shippingSpaceModel.mblNo1 && this.shippingSpaceModel.mblNo2) {
        if (this.shippingSpaceModel.mblNo2.length !== 8) {
          this.$message.error(this.$t('air.existMblNo2Error'))
          return
        }
        this.shippingSpaceModel.mblNo = this.shippingSpaceModel.mblNo1 + "-" + this.shippingSpaceModel.mblNo2
      }
      let data = this.shippingSpaceModel
      data.orderId = this.order.id
      let fn = updateAirExportOrderShippingSpaceApi
      if (this.job && this.job.id) {
        fn = updateAirExportJobShippingSpaceApi
        data.jobId = this.job.id
      }

      this.$refs.shippingSpaceFormRef.validate(valid => {
        if (valid) {
          this.loading = true
          // 添加日志 记录数据
          this.logBtnSend({
            origin: logOrigin.SYSTEM_OPERATION,
            logCode: airLogBusinessType.TO_MATCH,
            serviceName: logServiceName.AIR_SERVICE,
            businessType: airLogBusinessType.TO_MATCH,
            content: {
              ...data
            }
          })
          fn(data).then(res => {
            if (res && res.ok) {
              this.$emit('refresh')
              this.$message.success(this.$t('air.matchSuccessfully'))
              this.closeFn()
              this.adjustConfirmFn(this.order)
            }
            this.loading = false
          })
        }
      })
    },
    setAirCustomerInfo (customer) {
      this.shippingSpaceModel.airlineId = customer.id
      this.shippingSpaceModel.airlineName = customer.chineseName
      this.shippingSpaceModel.airlineScacCode = customer.scacCode
    },
    setBookingAgentInfo (customer) {
      this.shippingSpaceModel.bookingAgentName = customer.chineseName
      this.shippingSpaceModel.bookingAgentId = customer.id
    },
    setLoadingAgentInfo (customer) {
      if (customer.id) {
        this.shippingSpaceModel.loadingAgentId = customer.id
        this.shippingSpaceModel.loadingAgentName = customer.chineseName
      } else {
        this.shippingSpaceModel.loadingAgentId = ""
        this.shippingSpaceModel.loadingAgentName = ""
      }
    },
    setDestinationAgentInfo (customer) {
      this.shippingSpaceModel.destinationAgentName = customer.chineseName
      this.shippingSpaceModel.destinationAgentId = customer.id
    },
    selectedPol (port) {
      this.shippingSpaceModel.pol = port.englishName
    },
    selectedPod (port) {
      this.shippingSpaceModel.pod = port.englishName
    },
    selectedReceipt (port) {
      this.shippingSpaceModel.receipt = port.englishName
    },
    selectedPot (port) {
      this.shippingSpaceModel.pot = port.englishName
    },
    // 交货港
    selectedDelivery (port) {
      this.shippingSpaceModel.delivery = port.englishName
    },
    selectProductAirLine (airLineId, flightPlanId) {
      this.shippingSpaceModel.flightPlanId = ""
      this.planAirlineNameList = []
      // 用户选择的产品航线为【CZ包板-PVG-AMS】时，CZ为跟航司code匹配；PVG为装货港三字码，AMS为卸货港三字码
      if (airLineId) {
        // 航线计划列表
        airFlightPlanQueryByEtdMonth({
          "productAirlineId": airLineId
        }).then(res => {
          this.planAirlineNameList = [];
          res.content.forEach(v => {
            v.planAirlineName = this.parseTime2(v.etd) + '-' + v.flightNo
            // 航线计划下拉框显示中文
            if (flightPlanId && flightPlanId === v.id) {
              this.shippingSpaceModel.planAirlineName = v.planAirlineName
            }
            if (v.planStatus === 1 || v.planStatus === 2) {
              this.planAirlineNameList.push(v)
            }
          })
          if (flightPlanId) {
            this.shippingSpaceModel.flightPlanId = flightPlanId
            // let airlineName = this.planAirlineNameList.find(item => item.id == flightPlanId + "").planAirlineName
          }
          console.log(this.planAirlineNameList, this.shippingSpaceModel.flightPlanId)

        })
        let airLine = this.productAirlineNameList.find(item => item.id === airLineId).productName
        this.shippingSpaceModel.productAirlineName = airLine
        let list = airLine.split("-");
        console.log(list[0], list[1], list[2])
        // 航空公司 正则中文去除
        airLineListApi({
          "code": list[0].replace(/[\u4e00-\u9fa5]/g, "")
        }).then(res => {
          // 航空公司
          this.shippingSpaceModel.airlineId = res.content.list[0].id
          this.shippingSpaceModel.airlineName = res.content.list[0].chineseName
          this.shippingSpaceModel.airlineScacCode = res.content.list[0].scacCode
        })
        //  产品航线目的港值跟订单目的港不一致时，将值带入中转港
        if (this.shippingSpaceModel.podCode && this.shippingSpaceModel.podCode !== list[2]) {
          airportListApi({
            "code": list[2]
          }).then(res => {
            if (res && res.ok && res.content.list.length > 0) {
              this.shippingSpaceModel.potCode = res.content.list[0].code3 // 中转港
              this.shippingSpaceModel.pot = res.content.list[0].englishName // 中转港
            }
          })
        }
        // 装货港
        // airportListApi({
        //   "code": list[1]
        // }).then(res => {
        //   this.shippingSpaceModel.polCode = res.content.list[0].code3 // 装货港
        //   this.shippingSpaceModel.pol = res.content.list[0].englishName // 装货港
        // })
        // 卸货港
        // airportListApi({
        //   "code": list[2]
        // }).then(res => {
        //   this.shippingSpaceModel.podCode = res.content.list[0].code3 // 卸货港
        //   this.shippingSpaceModel.pod = res.content.list[0].englishName // 卸货港

        //   this.shippingSpaceModel.receiptCode = res.content.list[0].code3 // 交货地
        //   this.shippingSpaceModel.receipt = res.content.list[0].englishName // 交货地

        // })

      }

    }
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
