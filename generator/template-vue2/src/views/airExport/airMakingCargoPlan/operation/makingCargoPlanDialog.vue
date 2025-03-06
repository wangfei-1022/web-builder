<template>
  <!-- 配舱 -->
  <el-dialog :title="$t('air.makingCargoPlan')" :visible.sync="visible" width="1200px" @close="closeFn"
    v-loading="loading">

    <div class="form-module-item">
      <div class="item">
        <!--订单编号    -->
        <label>{{ $t('air.orderNumber') }}</label>
        <span>{{ order.baseDTO.orderNo }}</span>

      </div>
      <div class="item">
        <!--委托单位   -->
        <label>{{ $t('air.requester') }}</label>
        <span v-if="orderType === '2C'">{{ $t('air.smallBusiness') }}</span>
        <span v-else>{{ order.baseDTO.customerName }}</span>
      </div>
      <div class="item">
        <!--所属销售  -->
        <label>{{ $t('air.ownedSales') }}</label>
        <span>{{ order.baseDTO.sellerName }}</span>
      </div>
      <div class="item">
        <!--货物类型 -->
        <label> {{ $t('air.cargoType') }} </label>
        <span>{{ order.cargoDTO.cargoTypeDesc }}</span>
      </div>
      <div class="item">
        <!--委托件数 -->
        <label> {{ $t('air.orderQuantity') }} </label>
        <span>{{ order.cargoDTO.orderQuantity }}</span>
      </div>
      <div class="item">
        <!--委托毛重 -->
        <label> {{ $t('air.orderGrossWeight') }}</label>
        <span>{{ order.cargoDTO.orderGrossWeight }}</span>
      </div>
      <div class="item">
        <!--委托体积 -->
        <label>{{ $t('air.orderVolume') }}</label>
        <span>{{ order.cargoDTO.orderVolume }}</span>
      </div>
      <div class="item">
        <!-- 委托计费重  -->
        <label>{{ $t('air.entrustedChargingWeight') }}</label>
        <span>{{ order.cargoDTO.orderChargeableWeight }}</span>
      </div>
      <div class="item">
        <!-- 航班日期  -->
        <label>{{ $t('air.etd') }}</label>
        <span>
          <span v-if="order.spaceDTO.atd">{{ parseTime(order.spaceDTO.atd) }}（{{ $t('air.actual') }}）</span>
          <span v-else-if="order.spaceDTO.etd">{{ parseTime(order.spaceDTO.etd) }}（{{ $t('air.predict') }}）</span>
        </span>
      </div>
      <div class="item">
        <!-- 贸易条款  -->
        <label>{{ $t('air.tradeTerms') }}</label>
        <span> {{ order.baseDTO.tradeTerm }} </span>
      </div>
      <div class="item">
        <!-- 托盘尺寸  -->
        <label>{{ $t('air.palletSizes') }}</label>
        <span>{{ order.cargoDTO.palletSizes }}</span>
      </div>
      <div class="item">
        <!-- 托书价格  -->
        <label>{{ $t('air.joeBookPrices') }}</label>
        <span>{{ order.baseDTO.bookingReceivable }}</span>
      </div>

      <div class="item">
        <!-- 收货地  -->
        <label>{{ $t('air.delivery') }}</label>
        <span>{{ order.spaceDTO.delivery || '--' }} / {{ order.spaceDTO.deliveryCode || '--' }}</span>
      </div>
      <div class="item">
        <!-- 装货港  -->
        <label>{{ $t('air.pol') }}</label>
        <span>{{ order.spaceDTO.pol || '--' }} / {{ order.spaceDTO.polCode || '--' }}</span>

      </div>
      <div class="item">
        <!-- 卸货港  -->
        <label>{{ $t('air.pod2') }}</label>
        <span>{{ order.spaceDTO.pod || '--' }} / {{ order.spaceDTO.podCode || '--' }}</span>

      </div>
      <div class="item">
        <!-- 交货地  -->
        <label>{{ $t('air.receipt') }}</label>
        <span>{{ order.spaceDTO.receipt || '--' }} / {{ order.spaceDTO.receiptCode || '--' }}</span>

      </div>
      <div class="item">
        <!-- 货物中文品名  -->
        <label>{{ $t('air.cargoCnName') }}</label>
        <span>{{ order.cargoDTO.cargoCnName }}</span>
      </div>
      <div class="item">
        <!-- 订舱备注  -->
        <label>{{ $t('air.remarks') }}</label>
        <span style="color:red">{{ order.spaceDTO.bookingRemark }}</span>
      </div>
    </div>

    <el-form ref="bookingConfirmationFormRef" :model="makingCargoPlanMode" :rules="shippingSpaceRules" label-width="95px"
      label-position="left" class="shippingSpaceForm" @close="closeFn">
      <!-- 舱位类型 -->
      <el-form-item :label="$t('air.shippingSpaceTypeDesc')" prop="shippingSpaceType" size="mini">
        <el-select v-model="makingCargoPlanMode.shippingSpaceType" :placeholder="$t('air.placeholder')"
          @change="selectedShippingSpaceType" disabled>
          <el-option :label="$t('air.ownShippingSpace')" :value="2"></el-option>
          <el-option :label="$t('air.agentShippingSpace')" :value="3"></el-option>
          <el-option :label="$t('air.bellyholdService')" :value="4"></el-option>
        </el-select>
      </el-form-item>


      <!-- 航空公司 -->
      <el-form-item :label="$t('air.airline')" prop="airlineId" size="mini"
        :rules="[{ required: makingCargoPlanMode.shippingSpaceType === 2, message: $t('air.requiredAirline'), trigger: 'change' }]">
        <type-select :placeholder="$t('air.placeholder')" v-model="makingCargoPlanMode.airlineName" type="airLine"
          style="width: 100%;" @selected="setAirCustomerInfo" disabled />
      </el-form-item>
      <!-- 订舱代理 -->
      <el-form-item :label="$t('air.bookingAgentPort')" prop="bookingAgentId" size="mini"
        :rules="[{ required: makingCargoPlanMode.shippingSpaceType === 3, message: $t('air.requiredBookingAgentPort'), trigger: 'change' }]">
        <type-select v-model="makingCargoPlanMode.bookingAgentName" type="supplier" style="width: 100%;"
          :request-params="{ 'partnerRole': 14014, 'businessType': 'AIR_EXPORT' }" @selected="setBookingAgentInfo"
          disabled />
      </el-form-item>
      <!-- 产品航线 -->
      <el-form-item :label="$t('air.productAirlineName')" prop="productAirlineId" size="mini"
        :rules="[{ required: makingCargoPlanMode.shippingSpaceType === 2, message: $t('air.requiredProductAirLine'), trigger: 'change' }]">
        <el-select filterable clearable v-model="makingCargoPlanMode.productAirlineId"
          :placeholder="$t('air.placeholder')" @change="selectProductAirLine" disabled style="width:99%">
          <el-option v-for="(item, index) in productAirlineNameList" :label="item.productName" :value="item.id"
            :key="index">
          </el-option>
        </el-select>
        <div style="font-size: 13px;margin-left: -60px;height: 10px;color:coral" v-if="airLineWarmVisible">
          {{ $t('air.airLineWarm') }} </div>
      </el-form-item>

      <!-- 目的港代理 -->
      <el-form-item :label="$t('air.destinationAgentName')" prop="destinationAgentName" size="mini" :rules="[{
        required: (order.spaceDTO.tradeTerm === 'EXW' || order.spaceDTO.tradeTerm === 'DDU'
          || order.spaceDTO.tradeTerm === 'DDP' || order.spaceDTO.tradeTerm === 'DAP'),
        message: $t('air.pleaseSelectData'), trigger: 'change'
      }]">
        <type-select v-model="makingCargoPlanMode.destinationAgentName" type="supplier" :requestParams="partnerRoleParams"
          clearable @selected="setDestinationAgentInfo" disabled style="width:90%" />

      </el-form-item>
      <!-- 入仓编号 -->
      <!-- <el-form-item :label="$t('air.inboundNo')" prop="inboundNo">
        <el-input v-model.trim="makingCargoPlanMode.inboundNo" class="job-no-input" size="mini" />
      </el-form-item> -->
      <!-- 截止入仓时间 -->
      <el-form-item :label="$t('air.inboundDeadline')" prop="inboundDeadline" size="mini">
        <CommonPicker v-model="makingCargoPlanMode.inboundDeadline" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm"
          size="mini" disabled />
      </el-form-item>
      <!-- 中转港 -->
      <el-form-item :label="$t('air.transitPort')" prop="potCode">
        <el-row>
          <el-col :span="10">
            <type-select v-model="makingCargoPlanMode.potCode" type="airport" @selected="selectedPot" disabled />
          </el-col>
          <el-col :span="14" style="padding-left: 10px;">
            <el-input v-model="makingCargoPlanMode.pot" class="job-no-input" size="mini" disabled />
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 目的地 -->
      <el-form-item :label="$t('air.pod2')" prop="podCode">
        <el-row>
          <el-col :span="10">
            <type-select v-model="makingCargoPlanMode.podCode" type="airport" @selected="selectedPod" disabled />
          </el-col>
          <el-col :span="14" style="padding-left: 10px;">
            <el-input v-model="makingCargoPlanMode.pod" class="job-no-input" size="mini" disabled />
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 航线计划 -->
      <el-form-item :label="$t('air.routePlan')" prop="flightPlanId" size="mini"
        :rules="[{ required: makingCargoPlanMode.shippingSpaceType === 2, message: $t('air.requiredRoutePlan'), trigger: 'change' }]">
        <el-select filterable clearable v-model="makingCargoPlanMode.flightPlanId" :placeholder="$t('air.placeholder')"
          @change="selectplanAirlineNameList"
          :disabled="makingCargoPlanMode.shippingSpaceType === 3 || makingCargoPlanMode.shippingSpaceType === 4">
          <el-option v-for="(item, index) in planAirlineNameList" :label="item.flightNo + '-' + parseTime2(item.etd)"
            :value="item.id" :key="index">
          </el-option>
        </el-select>
        <div style="font-size: 13px;margin-left: -60px;height: 10px;color:coral;margin-top: 8px;"
          v-if="planAirlineWarmVisible">
          {{ $t('air.planAirlineWarm') }}</div>
      </el-form-item>
      <!-- 主单号 -->
      <el-form-item :label="$t('air.mblNoName')"
        :rules="[{ required: makingCargoPlanMode.shippingSpaceType === 2 || makingCargoPlanMode.shippingSpaceType === 4 }]">
        <el-row>
          <el-col :span="8">
            <el-form-item prop="mblNo1" style="width: 100%"
              :rules="[{ required: makingCargoPlanMode.shippingSpaceType === 2 || makingCargoPlanMode.shippingSpaceType === 4 || makingCargoPlanMode.mblNo2, message: $t('air.pleaseEnter'), trigger: 'change' }]">
              <el-input v-model.trim="makingCargoPlanMode.mblNo1" class="job-no-input" size="mini" @input="checkMblNo"
                maxlength="3" v-input-limit="[-9, 2]" />
            </el-form-item>
          </el-col>
          <el-col :span="1">-</el-col>
          <el-col :span="15">
            <el-form-item prop="mblNo2" style="width: 100%"
              :rules="[{ required: makingCargoPlanMode.shippingSpaceType === 2 || makingCargoPlanMode.shippingSpaceType === 4 || makingCargoPlanMode.mblNo1, message: $t('air.requiredMblNo'), trigger: 'change' }]">
              <el-input v-model.trim="makingCargoPlanMode.mblNo2" class="job-no-input" size="mini" @input="checkMblNo"
                maxlength="8" v-input-limit="[-9, 2]" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-input v-model.trim="makingCargoPlanMode.mblNo" class="job-no-input" size="mini" @input="checkMblNo" /> -->
        <div style="font-size: 13px;margin-top: -10px;height: 10px;color:coral" v-if="existsByMblNoVisible">
          {{ $t('air.existMblNo') }} </div>
      </el-form-item>
      <!-- 航班号 -->
      <el-form-item :label="$t('air.flightNo')" prop="flightNo"
        :rules="[{ required: makingCargoPlanMode.shippingSpaceType === 2 || makingCargoPlanMode.shippingSpaceType === 4, message: $t('air.requiredFlightNo'), trigger: 'change' }]">
        <el-input v-model.trim="makingCargoPlanMode.flightNo" class="job-no-input" size="mini"
          :disabled="makingCargoPlanMode.shippingSpaceType === 2" />
      </el-form-item>
      <!-- 航班时间 -->
      <el-form-item :label="$t('air.etd')" prop="etd">
        <el-row>
          <el-col :span="19">
            <CommonPicker v-model="makingCargoPlanMode.etd" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm"
              size="mini" @change="etdChange" :parentOption="setDateRange"
              :disabled="makingCargoPlanMode.shippingSpaceType === 2" />
          </el-col>
          <el-col :span="5">{{ week }}</el-col>
        </el-row>
      </el-form-item>

      <!-- 产品备注 -->
      <el-form-item :label="$t('air.productNote')" prop="inboundNo" style="width:100%">
        <el-input v-model.trim="makingCargoPlanMode.productRemark" class="job-no-input" size="mini" disabled />

        <div
          style="font-size: 13px;margin-left: -60px;height: 10px;color: red;font-weight: bold;margin-top: 18px;margin-bottom: 18px;">
          {{ $t('air.bookingLine') }} <span v-if="order.spaceDTO.polCode"> {{ order.spaceDTO.polCode }}</span>
          <span v-if="order.spaceDTO.potCode"> - {{ order.spaceDTO.potCode }}</span>
          <span v-if="order.spaceDTO.podCode"> - {{ order.spaceDTO.podCode }}</span>
        </div>
      </el-form-item>

    </el-form>

    <div v-if="computeStowageVisible">
      <div class="describe-item">
        <el-row>
          <el-col :span="3" class="label">
            {{ $t('air.BSAShippingSpaceStatus') }}
          </el-col>
          <el-col :span="21" class="span">
            <!-- 考核基重  剩余装载基重 体积-->
            {{ $t('air.assessmentBasisWeight') }} ：{{ computeStowage.assessWeight }}，
            {{ $t('air.surplusAssessWeight') }}：{{ computeStowage.surplusAssessWeight }}kg，{{ $t('air.volume2') }}：{{
              computeStowage.theoryVolume
            }}cbm
          </el-col>
        </el-row>
      </div>

      <div class="describe-item">
        <el-row>
          <el-col :span="3" class="label">
            <!-- 配载后舱位情况： -->
            {{ $t('air.conditionOfStowageRearCabin') }}：
          </el-col>
          <el-col :span="21" class="span">
            <!-- 剩余装载基重： 体积： -->
            {{ $t('air.surplusAssessWeight') }}： {{ computeStowage.computeSurplusAssessWeight }}kg，{{
              $t('air.volume2')
            }}：
            {{ computeStowage.computeTheoryVolume }}cbm
          </el-col>
        </el-row>
      </div>
    </div>


    <div slot="footer" class="dialog-footer">
      <el-button @click="closeFn" size="mini">{{ $t('air.cancel') }}</el-button>
      <el-button type="primary" @click="submitBaseInfo" size="mini"
        v-if="makingCargoPlanMode.shippingSpaceType === 3 || makingCargoPlanMode.shippingSpaceType === 4">{{
          $t('air.makingCargoPlan')
        }}</el-button>
      <el-button type="primary" @click="submitBaseInfo" size="mini" v-if="makingCargoPlanMode.shippingSpaceType === 2">{{
        $t('air.putTank')
      }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { putAirExportOrderCargoPlanApi, getAirLineList, existsByMblNo, airFlightPlanQueryByEtdMonth, airFlightPlanDetail } from '@/api/airExport'
import { airLineListApi, airportListApi } from '@/api/common'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'
import { parseTime, formatNumberToThousands } from '@/utils/index'
import { logServiceName, airLogBusinessType, logOrigin } from '@/utils/constant'

export default {
  name: 'ShippingSpaceForm',
  components: {
    cargoLimitedSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orderType: {
      type: String,
      default: ""
    },

    order: {
      type: Object,
      default: function () {
        return {
          spaceDTO: {},
          addressDTO: {},
          cargoDTO: {},
          baseDTO: {}
        }
      }
    }
  },
  data () {
    return {
      partnerRoleParams: {
        partnerRole: 14012
      },
      planAirlineWarmVisible: false,
      airLineWarmVisible: false,
      existsByMblNoVisible: false,
      loading: false,
      weekList: [this.$t('air.SUN'), this.$t('air.MON'), this.$t('air.TUE'), this.$t('air.WED'), this.$t('air.THUR'), this.$t('air.FRI'), this.$t('air.SAT')],
      week: "",
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
      productAirlineNameList: [],
      planAirlineNameList: [],
      airCustomerMethod: airLineListApi,
      makingCargoPlanMode: {
        etd: "",
        shippingSpaceType: '',
        flightPlanId: "",
        productAirlineName: '',
        productAirlineId: '',
        airlineId: '',
        airlineName: '',
        airlineScacCode: '',
        bookingAgentId: '',
        bookingAgentName: '',
        mblNo: '',
        mblNo1: '',
        mblNo2: '',
        // loadingAgentId: '',
        // loadingAgentName: '',
        flightNo: '',
        inboundNo: '',
        inboundDeadline: '',
        podCode: '', // 卸货港
        pod: '',
        polCode: '', // 装货港
        pol: '',
        orderState: "", // 10、待配舱[配舱] 30、待入仓[放舱]
        productRemark: ""

      },
      computeStowageVisible: false,
      computeStowage: {
        assessWeight: 0,
        surplusAssessWeight: 0,
        theoryVolume: 0,
        computeSurplusAssessWeight: 0,
        computeTheoryVolume: 0
      },
      shippingSpaceRules: {
        "shippingSpaceType": [{ required: true, message: this.$t('air.requiredShippingSpaceType'), trigger: 'change' }],
        // "receiptCode": [{ required: true, message: this.$t('air.requiredReceiptCode'), trigger: 'change' }],
        "podCode": [{ required: true, message: this.$t('air.requiredPod'), trigger: 'blur' }],

        "etd": [{ required: true, message: this.$t('air.requiredEtd'), trigger: 'blur' }]

        // "mblNo1": [{ required: true, message: this.$t('air.pleaseEnter'), trigger: 'blur' }],
        // "mblNo2": [{ required: true, message: this.$t('air.requiredMblNo'), trigger: 'blur' }],
        // "flightNo": [{ required: true, message: this.$t('air.requiredFlightNo'), trigger: 'blur' }]
      },
      freightTermList: [],
      airLineSplit: []
    }
  },
  watch: {
    visible (val) {
      this.planAirlineWarmVisible = false
      this.airLineWarmVisible = false
      if (val) {
        // 产品航线列表
        getAirLineList().then(res => {
          this.productAirlineNameList = res.content
        })
        console.log("this.order", this.order)
        let config = this.order
        this.makingCargoPlanMode = {
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
          // loadingAgentId: config.spaceDTO.loadingAgentId, // 进仓代理
          // loadingAgentName: config.spaceDTO.loadingAgentName, // 进仓代理名称
          destinationAgentId: config.spaceDTO.destinationAgentId,
          destinationAgentName: config.spaceDTO.destinationAgentName,
          productAirlineName: config.spaceDTO.productAirlineName, // 产品航线
          productAirlineId: config.spaceDTO.productAirlineId, // 产品航线id
          inboundNo: config.spaceDTO.inboundNo, // 入仓编号
          inboundDeadline: config.spaceDTO.inboundDeadline, // 截止入仓时间
          podCode: config.spaceDTO.podCode, // 目的港
          pod: config.spaceDTO.pod,
          polCode: config.spaceDTO.polCode, // 起运港
          pot: config.spaceDTO.pot,
          potCode: config.spaceDTO.potCode, // 中转港
          pol: config.spaceDTO.pol,
          flightPlanId: config.flightPlanId,
          etd: config.spaceDTO.etd,
          productRemark: config.productRemark,
          receiptCode: config.spaceDTO.receiptCode,
          receipt: config.spaceDTO.receipt
        }
        if (config.spaceDTO.airlineScacCode === 'CZ') {
          this.makingCargoPlanMode.mblNo1 = '784'
        }

        if (config.spaceDTO.etd) {
          // this.makingCargoPlanMode.etd = parseTime(config.spaceDTO.etd, '{y}-{m}-{d}')
          this.etdChange(Number(config.spaceDTO.etd))
        }

        if (this.makingCargoPlanMode.productAirlineId) {
          this.selectProductAirLine(this.makingCargoPlanMode.productAirlineId, config.flightPlanId)
        }
      }
    }
  },
  created () {

  },
  methods: {
    setDestinationAgentInfo (customer) {
      this.makingCargoPlanMode.destinationAgentName = customer.chineseName
      this.makingCargoPlanMode.destinationAgentId = customer.id
    },
    selectedShippingSpaceType (item) {
      this.planAirlineWarmVisible = false
      this.airLineWarmVisible = false
      if (item === 3 || item === 4) {
        this.makingCargoPlanMode.airlineId = ""
        this.makingCargoPlanMode.airlineName = ""
        this.makingCargoPlanMode.airlineScacCode = ""
        this.makingCargoPlanMode.productAirlineName = ""
        this.makingCargoPlanMode.productAirlineId = ""
        this.makingCargoPlanMode.flightPlanId = ""
        // this.makingCargoPlanMode.podCode = ""
        // this.makingCargoPlanMode.pod = ""
        // this.makingCargoPlanMode.polCode = ""
        // this.makingCargoPlanMode.pol = ""
        this.airLineSplit = []
        this.planAirlineNameList = []
      }
    },
    selectedPot (port) {
      this.makingCargoPlanMode.pot = port.englishName
    },
    selectedPod (port) {
      this.makingCargoPlanMode.pod = port.englishName
    },
    parseTime (value) {
      return parseTime(value, '{y}-{m}-{d} {h}:{i}')
    },
    parseTime2 (value) {
      return parseTime(value, '{m}-{d}')

    },
    checkMblNo () {
      if (this.makingCargoPlanMode.mblNo1 && this.makingCargoPlanMode.mblNo2) {
        let data = {
          "mblNo": this.makingCargoPlanMode.mblNo1 + "-" + this.makingCargoPlanMode.mblNo2,
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
    // setLoadingAgentInfo (customer) {
    //   if (customer.id) {
    //     this.makingCargoPlanMode.loadingAgentId = customer.id
    //     this.makingCargoPlanMode.loadingAgentName = customer.chineseName
    //   } else {
    //     this.makingCargoPlanMode.loadingAgentId = ""
    //     this.makingCargoPlanMode.loadingAgentName = ""
    //   }
    // },
    etdChange (item) {
      if (item) {
        this.week = "(" + this.weekList[new Date(item).getDay()] + ")";
      } else {
        this.week = ""
      }

    },
    closeFn () {
      this.$emit('close')
    },
    submitBaseInfo () {
      let data = this.makingCargoPlanMode
      if (this.makingCargoPlanMode.shippingSpaceType === 3) {
        data.orderState = 10 // 10、待外配[配舱]
      }
      if (this.makingCargoPlanMode.shippingSpaceType === 2 || this.makingCargoPlanMode.shippingSpaceType === 4) {
        data.orderState = 30 // 30、待入仓[放舱]
      }
      if (this.makingCargoPlanMode.mblNo1 && this.makingCargoPlanMode.mblNo2) {
        if (this.makingCargoPlanMode.mblNo2.length !== 8) {
          this.$message.error(this.$t('air.existMblNo2Error'))
          return
        }
        data.mblNo = this.makingCargoPlanMode.mblNo1 + "-" + this.makingCargoPlanMode.mblNo2
      }
      // if (this.makingCargoPlanMode.productAirlineName) {
      // data.podCode = ""
      // data.pod = ""
      // data.polCode = ""
      // data.pol = ""
      // }

      this.$refs.bookingConfirmationFormRef.validate(valid => {
        if (valid) {
          this.loading = true
          // this.airLineSplit = this.makingCargoPlanMode.productAirlineName.split("-")

          if (this.airLineSplit.length > 2) {
            // 添加日志 记录数据
            this.logBtnSend({
              origin: logOrigin.LOGISTICS_LINKS,
              logCode: airLogBusinessType.MAKING_CARGO_PLAN,
              serviceName: logServiceName.AIR_SERVICE,
              businessType: airLogBusinessType.MAKING_CARGO_PLAN,
              content: {
                "orderId": this.order.id,
                ...data
              }
            })
            putAirExportOrderCargoPlanApi(this.order.id, data).then(res => {
              if (res && res.ok) {
                this.$emit('refresh')
                if (this.makingCargoPlanMode.shippingSpaceType === 3 || this.makingCargoPlanMode.shippingSpaceType === 4) {
                  this.$message.success(this.$t('air.makingCargoPlanSuccess'))
                }
                if (this.makingCargoPlanMode.shippingSpaceType === 2) {
                  this.$message.success(this.$t('air.putTankSuccess'))
                }
                this.closeFn()
              }
              this.loading = false
            })
            // 装货港
            // airportListApi({
            //   "code": this.airLineSplit[1]
            // }).then(res => {
            //   if (res && res.ok && res.content.list.length > 0) {
            //     this.makingCargoPlanMode.polCode = res.content.list[0].code3 // 装货港
            //     this.makingCargoPlanMode.pol = res.content.list[0].englishName // 装货港
            //   }

            // 卸货港
            // airportListApi({
            //   "code": this.airLineSplit[2]
            // }).then(res => {
            //   if (res && res.ok && res.content.list.length > 0) {
            //     this.makingCargoPlanMode.podCode = res.content.list[0].code3 // 卸货港
            //     this.makingCargoPlanMode.pod = res.content.list[0].englishName // 卸货港
            //   }
            //   console.log("data2:", data)

            // })
            // })
          } else {
            // 添加日志 记录数据
            this.logBtnSend({
              origin: logOrigin.LOGISTICS_LINKS,
              logCode: airLogBusinessType.MAKING_CARGO_PLAN,
              serviceName: logServiceName.AIR_SERVICE,
              businessType: airLogBusinessType.MAKING_CARGO_PLAN,
              content: {
                "orderId": this.order.id,
                ...data
              }
            })
            console.log("data3:", data)
            putAirExportOrderCargoPlanApi(this.order.id, data).then(res => {
              if (res && res.ok) {
                this.$emit('refresh')
                if (this.makingCargoPlanMode.shippingSpaceType === 3 || this.makingCargoPlanMode.shippingSpaceType === 4) {
                  this.$message.success(this.$t('air.makingCargoPlanSuccess'))
                }
                if (this.makingCargoPlanMode.shippingSpaceType === 2) {
                  this.$message.success(this.$t('air.putTankSuccess'))
                }
                this.closeFn()
              }
              this.loading = false
            })
          }

        }
      })
    },
    setAirCustomerInfo (customer) {
      if (customer.scacCode === 'CZ') {
        this.makingCargoPlanMode.mblNo1 = '784'
      }

      this.makingCargoPlanMode.airlineId = customer.id
      this.makingCargoPlanMode.airlineName = customer.chineseName
      this.makingCargoPlanMode.airlineScacCode = customer.scacCode
    },
    setBookingAgentInfo (customer) {
      this.makingCargoPlanMode.bookingAgentName = customer.chineseName
      this.makingCargoPlanMode.bookingAgentId = customer.id
    },

    selectProductAirLine (airLineId, flightPlanId) {
      this.airLineWarmVisible = false
      this.planAirlineWarmVisible = false
      this.makingCargoPlanMode.flightPlanId = ""
      this.planAirlineNameList = []
      this.computeStowageVisible = false
      this.makingCargoPlanMode.productAirlineName = ""
      // 用户选择的产品航线为【CZ包板-PVG-AMS】时，CZ为跟航司code匹配；PVG为装货港三字码，AMS为卸货港三字码
      if (airLineId) {
        // 航线计划列表
        airFlightPlanQueryByEtdMonth({
          "productAirlineId": airLineId
        }).then(res => {
          console.log("11", res.content)
          this.planAirlineNameList = [];
          res.content.forEach(v => {
            if (v.planStatus === 1 || v.planStatus === 2) {
              this.planAirlineNameList.push(v)
            }
          })
          if (flightPlanId) {
            this.makingCargoPlanMode.flightPlanId = flightPlanId
          }
          console.log(this.planAirlineNameList, this.makingCargoPlanMode.flightPlanId)

          let airLine = this.productAirlineNameList.find(item => item.id === airLineId).productName
          this.airLineSplit = airLine.split("-")
          console.log("airLineSplit", this.airLineSplit)
          if (this.airLineSplit[1] !== this.order.spaceDTO.polCode || this.airLineSplit[2] !== this.order.spaceDTO.podCode) {
            this.airLineWarmVisible = true
          } else {
            this.airLineWarmVisible = false
          }
          this.makingCargoPlanMode.productAirlineName = airLine
          // 航空公司 正则中文去除
          airLineListApi({
            "code": this.airLineSplit[0].replace(/[\u4e00-\u9fa5]/g, "")
          }).then(res => {
            // 航空公司
            if (res.content.list[0].scacCode === 'CZ') {
              this.makingCargoPlanMode.mblNo1 = '784'
            } else {
              this.makingCargoPlanMode.mblNo1 = ''
            }
            this.makingCargoPlanMode.airlineId = res.content.list[0].id
            this.makingCargoPlanMode.airlineName = res.content.list[0].chineseName
            this.makingCargoPlanMode.airlineScacCode = res.content.list[0].scacCode
          })

          //  卸货港
          // airportListApi({
          //   "code": this.airLineSplit[2]
          // }).then(res => {
          //   if (res && res.ok && res.content.list.length > 0) {
          //     this.makingCargoPlanMode.podCode = res.content.list[0].code3 // 卸货港
          //     this.makingCargoPlanMode.pod = res.content.list[0].englishName // 卸货港
          //   }

          // })
        })
      }
    },

    selectplanAirlineNameList (planAirLineId) {
      this.planAirlineWarmVisible = false
      if (planAirLineId) {

        let planAirline = this.planAirlineNameList.find(item => item.id === planAirLineId)
        console.log("productAir:", planAirline)
        if (planAirline) {
          this.makingCargoPlanMode.etd = planAirline.etd
          this.makingCargoPlanMode.flightNo = planAirline.flightNo
          this.etdChange(Number(planAirline.etd))
          if (planAirline.etd !== this.order.spaceDTO.etd) {
            this.planAirlineWarmVisible = true
          } else {
            this.planAirlineWarmVisible = false
          }
        }

        airFlightPlanDetail(planAirLineId).then(res => {
          // 考核基重：3500kg，剩余装载基重：400kg，体积：6.0cbm
          this.computeStowage.assessWeight = res.content.assessWeight === null ? 0 : res.content.assessWeight
          this.computeStowage.surplusAssessWeight = res.content.surplusAssessWeight === null ? 0 : res.content.surplusAssessWeight
          this.computeStowage.theoryVolume = res.content.theoryVolume === null ? 0 : res.content.theoryVolume
          this.computeStowage.computeSurplusAssessWeight = this.computeStowage.surplusAssessWeight - this.order.cargoDTO.orderGrossWeight
          this.computeStowage.computeTheoryVolume = this.computeStowage.theoryVolume - this.order.cargoDTO.orderVolume
          this.computeStowageVisible = true
        })
      } else {
        this.computeStowageVisible = false

      }

    }

  }
}
</script>

<style scoped lang="less">
.form-module-item {
  overflow: hidden;
  padding: 20px;
  background: #fff;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px 0 #efefef, 0 0 6px 0 #efefef;

  .item {
    width: 25%;
    float: left;
    padding: 0 10px;
    margin-bottom: 15px;

    label {
      font-size: 14px;
      margin-right: 20px;
    }

    span {
      font-size: 12px;
    }
  }
}

.shippingSpaceForm {
  overflow: hidden;

  ::v-deep .el-form-item {
    width: 25%;
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

.describe-item {
  margin-bottom: 15px;

  .label {
    font-size: 14px;
    color: #e3011f;
  }

  .span {
    font-size: 12px;
    color: #e9344c;

  }
}
</style>
