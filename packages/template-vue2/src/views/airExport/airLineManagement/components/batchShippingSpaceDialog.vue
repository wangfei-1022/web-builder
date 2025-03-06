<template>
  <!-- 舱位批量改配 -->
  <el-dialog :title="$t('air.batchShippingSpaceToMatch')" :visible.sync="visible" width="900px"
    :close-on-click-modal="false" v-loading="loading">
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
        :rules="[{ required: shippingSpaceModel.shippingSpaceType === 2 || shippingSpaceModel.shippingSpaceType === 4, message: $t('air.requiredAirline'), trigger: 'change' }]">
        <type-select :placeholder="$t('air.placeholder')" v-model="shippingSpaceModel.airlineName" type="airLine"
          style="width: 100%;" @selected="setAirCustomerInfo"
          :disabled="shippingSpaceModel.shippingSpaceType === 2 || shippingSpaceModel.shippingSpaceType === 4" />
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
        :rules="[{ required: shippingSpaceModel.shippingSpaceType === 2, message: $t('air.requiredProductAirLine'), trigger: 'change' }]">
        <el-select filterable clearable v-model="shippingSpaceModel.productAirlineId" :placeholder="$t('air.placeholder')"
          @change="selectProductAirLine"
          :disabled="shippingSpaceModel.shippingSpaceType === 3 || shippingSpaceModel.shippingSpaceType === 4">
          <el-option v-for="(item, index) in productAirlineNameList" :label="item.productName" :value="item.id"
            :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 订舱代理 -->
      <el-form-item :label="$t('air.bookingAgentPort')" prop="bookingAgentId"
        :rules="[{ required: shippingSpaceModel.shippingSpaceType === 3, message: $t('air.requiredBookingAgentPort'), trigger: 'change' }]">
        <type-select v-model="shippingSpaceModel.bookingAgentName" type="supplier" style="width: 100%;"
          :request-params="{ 'partnerRole': 14014, 'businessType': 'AIR_EXPORT' }" @selected="setBookingAgentInfo" />
      </el-form-item>
      <!-- 装货港 -->
      <el-form-item :label="$t('air.pol')" prop="polCode">
        <el-row>
          <el-col :span="10">
            <type-select v-model="shippingSpaceModel.polCode" type="airport" @selected="selectedPol"
              :disabled="shippingSpaceModel.shippingSpaceType === 2" />
          </el-col>
          <el-col :span="14" style="padding-left: 10px;">
            <el-input v-model="shippingSpaceModel.pol" class="job-no-input" size="mini" disabled />
          </el-col>
        </el-row>
      </el-form-item>

      <!-- 航线计划 -->
      <el-form-item :label="$t('air.routePlan')" prop="flightPlanId" size="mini"
        :rules="[{ required: shippingSpaceModel.shippingSpaceType === 2, message: $t('air.requiredRoutePlan'), trigger: 'change' }]">
        <el-select filterable @change="selectplanAirlineNameList" clearable v-model="shippingSpaceModel.flightPlanId"
          :placeholder="$t('air.placeholder')"
          :disabled="shippingSpaceModel.shippingSpaceType === 3 || shippingSpaceModel.shippingSpaceType === 4">
          <el-option v-for="(item, index) in planAirlineNameList" :label="parseTime2(item.etd) + '-' + item.flightNo"
            :value="item.id" :key="index">
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
            <type-select v-model="shippingSpaceModel.potCode" type="airport" @selected="selectedPot" size="mini" />
          </el-col>
          <el-col :span="14" style="padding-left: 10px;">
            <el-input v-model="shippingSpaceModel.pot" class="job-no-input" size="mini" disabled />
          </el-col>
        </el-row>
      </el-form-item>

      <!-- 预计航班时间 -->
      <el-form-item :label="$t('air.etd2')" prop="etd">
        <CommonPicker v-model="shippingSpaceModel.etd" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm"
          size="mini" />
      </el-form-item>
      <!-- 目的港代理 -->
      <el-form-item :label="$t('air.destinationAgentName')" prop="destinationAgentId">
        <type-select v-model="shippingSpaceModel.destinationAgentName" type="supplier" :requestParams="partnerRoleParams"
          clearable @selected="setDestinationAgentInfo" />
      </el-form-item>

      <!-- 卸货港 -->
      <el-form-item :label="$t('air.pod2')" prop="podCode">
        <el-row>
          <el-col :span="10">
            <type-select v-model="shippingSpaceModel.podCode" type="airport" @selected="selectedPod"
              :disabled="shippingSpaceModel.shippingSpaceType === 2" />
          </el-col>
          <el-col :span="14" style="padding-left: 10px;">
            <el-input v-model="shippingSpaceModel.pod" class="job-no-input" size="mini" disabled />
          </el-col>
        </el-row>
      </el-form-item>


      <!-- 航班号 -->
      <el-form-item :label="$t('air.flightNo')" prop="flightNo">
        <el-input v-model.trim="shippingSpaceModel.flightNo" class="job-no-input" size="mini"
          :disabled="shippingSpaceModel.shippingSpaceType === 2" />
      </el-form-item>

      <!-- 预计到港时间 -->
      <el-form-item :label="$t('air.eta2')" prop="eta">
        <CommonPicker v-model="shippingSpaceModel.eta" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm" size="mini"
          :disabled="shippingSpaceModel.shippingSpaceType === 2" />
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
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeFn" size="mini">{{ $t('air.cancel') }}</el-button>
      <el-button type="primary" @click="submitBaseInfo" size="mini">{{ $t('air.determine') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { airOrderExportBatchOrderSpaceInfo, getAirLineList, airFlightPlanQueryByEtdMonth } from '@/api/airExport'
import { getTerminologyListByTypeApi, airLineListApi, airportListApi } from '@/api/common'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'
import { parseTime, formatNumberToThousands } from '@/utils/index'

export default {
  name: 'BatchShippingSpaceDialog',
  components: {
    cargoLimitedSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orderIds: {
      type: Array,
      default: () => []
    },
    spaceDTO: {
      type: Object,
      default: function () {
        return {
          pol: "",
          polCode: "",
          podCode: "",
          pod: ""
        }
      }
    }
  },
  data () {
    return {
      partnerRoleParams: {
        partnerRole: 14012
      },
      planAirlineNameList: [],
      loading: false,
      productAirlineNameList: [],
      airCustomerMethod: airLineListApi,
      shippingSpaceModel: {},
      shippingSpaceRules: {
        // "blMode": [{ required: true, message: '请选择操作模式', trigger: 'change' }],
        "shippingSpaceType": [{ required: true, message: this.$t('air.requiredShippingSpaceType'), trigger: 'change' }],
        "polCode": [{ required: true, message: this.$t('air.requiredPol'), trigger: 'change' }],
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
        this.shippingSpaceModel = {
          shippingSpaceType: '',
          productAirlineName: '', // 产品航线
          productAirlineId: "",
          airlineId: '',
          airlineName: '',
          airlineScacCode: '',
          delivery: '', // 收货地
          deliveryCode: '', // 收货地港代码
          pol: this.spaceDTO.pol,
          polCode: this.spaceDTO.polCode,
          pod: this.spaceDTO.pod,
          podCode: this.spaceDTO.podCode,
          pot: "",
          potCode: "",
          bookingAgentId: '',
          bookingAgentName: '',
          etd: '',
          loadingAgentId: '',
          loadingAgentName: '',
          receiptCode: '',
          receipt: '',
          eta: '',
          destinationAgentId: '',
          destinationAgentName: '',
          flightNo: '',
          flightPlanId: ""

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
    initBasicData () {
      // 产品航线列表
      getAirLineList().then(res => {
        this.productAirlineNameList = res.content
      })
      getTerminologyListByTypeApi('FREIGHTTERM').then(res => {
        if (res && res.ok) {
          this.freightTermList = res.content
        }
      })
    },
    closeFn () {
      this.$emit('close')
    },
    submitBaseInfo () {

      let data = this.shippingSpaceModel
      data.orderIds = this.orderIds
      let fn = airOrderExportBatchOrderSpaceInfo

      this.$refs.shippingSpaceFormRef.validate(valid => {
        if (valid) {
          this.loading = true
          fn(data).then(res => {
            if (res && res.ok) {
              this.$emit('refresh')
              this.$message.success(this.$t('air.batchMatchSuccessfully'))
              this.closeFn()
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
            if (v.planStatus === 1 || v.planStatus === 2) {
              this.planAirlineNameList.push(v)
            }
          })
          if (flightPlanId) {
            this.shippingSpaceModel.flightPlanId = flightPlanId
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
