<template>
  <div v-loading="loading">
    <div style="margin-bottom: 10px;">
      <el-button type="primary" size="mini" @click="save" v-if="order.isUnlocked && (state !== 95 && state !== 100 && state !== 99)">{{
        $t('air.save')
      }}
      </el-button>
      <el-button type="primary" size="mini" @click="printFn">{{ $t('air.print') }}</el-button>
    </div>
    <div class="mawb">
      <el-form :model="booking" label-position="top">
        <el-row>
          <el-col :span="12">
            <el-row>
              <el-col :span="12">
                <el-form-item label="MAWB NO." v-if="type === 'MAWB'">
                  <el-input v-model="booking.mblNo" disabled class="job-no-input" size="mini" />
                </el-form-item>
                <el-form-item label="HAWB NO." v-if="type !== 'MAWB'">
                  <el-input v-model="booking.hblNo" class="job-no-input" size="mini" maxlength="300" show-word-limit />
                </el-form-item>
                <el-form-item label="Shipper">
                  <el-input v-model="booking.shipperCode" class="job-no-input" size="mini" />
                </el-form-item>
              </el-col>

              <el-button type="primary" size="mini" style="float: right; margin-top: 88px; margin-right: 12px;"
                @click="clearShipper" v-if="state !== 95 && state !== 100">{{ $t('air.clear') }}</el-button>
            </el-row>

            <el-form-item label="">
              <el-input v-model="booking.shipperAddress" class="job-no-input" size="mini" type="textarea" rows="7" />
            </el-form-item>

            <el-row>
              <el-col :span="12">
                <el-form-item label="Consignee">
                  <el-input v-model="booking.consigneeCode" class="job-no-input" size="mini" />
                </el-form-item>
              </el-col>
              <el-button type="primary" size="mini" style="float: right; margin-top: 30px; margin-right: 12px;"
                @click="clearConsignee" v-if="state !== 95 && state !== 100">{{ $t('air.clear') }}</el-button>
            </el-row>

            <el-form-item label="">
              <el-input v-model="booking.consigneeAddress" class="job-no-input" size="mini" type="textarea" rows="7" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="MAWB NO." v-if="type !== 'MAWB'">
              <el-input v-model="booking.mblNo" class="job-no-input" size="mini" disabled />
            </el-form-item>
            <el-form-item :label="$t('air.createdBy')">
              <el-input v-model="booking.createByName" class="job-no-input" size="mini" disabled />
            </el-form-item>
            <el-form-item :label="$t('air.createTime')">
              <CommonPicker v-model="booking.createTime" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm:ss"
                size="mini" disabled />
            </el-form-item>
            <el-form-item :label="$t('air.updateByName2')">
              <el-input v-model="booking.updateByName" class="job-no-input" size="mini" disabled />
            </el-form-item>
            <el-form-item :label="$t('air.updateTime2')">
              <CommonPicker v-model="booking.updateTime" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm:ss"
                size="mini" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-row>
              <el-form-item label="Issuing Carrier's Agent Name and City">
                <el-input v-model="booking.icanCity" class="job-no-input" size="mini" />
              </el-form-item>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="Agent IATA Code">
                  <el-input v-model="booking.agentIataCode" class="job-no-input" size="mini" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Account No">
                  <el-input v-model="booking.accountNo" class="job-no-input" size="mini" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="AirPort of Departure">
                <el-input v-model="booking.airportOfDeparture" class="job-no-input" size="mini" disabled />
              </el-form-item>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Accounting Information">
              <el-input v-model="booking.accountingInformation" class="job-no-input" size="mini" type="textarea"
                rows="8" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <el-form-item label="TO">
              <el-input v-model="booking.podTo1st" class="job-no-input" size="mini" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="By First Carrier">
              <el-input v-model="booking.podBy1stName" class="job-no-input" size="mini" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="TO">
              <el-input v-model="booking.podTo2nd" class="job-no-input" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="By">
              <el-input v-model="booking.podBy2ndName" class="job-no-input" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="TO">
              <el-input v-model="booking.podTo3rd" class="job-no-input" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="By">
              <el-input v-model="booking.podBy3rdName" class="job-no-input" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="Currency">
              <el-select v-model="booking.currency" :placeholder="$t('air.placeholder')" size="mini">
                <el-option key="CNY" label="CNY" value="CNY"></el-option>
                <el-option key="USD" label="USD" value="USD"></el-option>
                <el-option key="HKD" label="HKD" value="HKD"></el-option>
                <el-option key="EUR" label="EUR" value="EUR"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="WT/VAL">
              <el-select v-model="booking.wtVal" :placeholder="$t('air.placeholder')" size="mini" @change="wtValChange">
                <el-option key="PP" label="PP" value="PP"></el-option>
                <el-option key="CC" label="CC" value="CC"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="Other">
              <el-select v-model="booking.other" :placeholder="$t('air.placeholder')" size="mini" @change="otherChange">
                <el-option key="PP" label="PP" value="PP"></el-option>
                <el-option key="CC" label="CC" value="CC"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="D.V.Carrier">
              <el-input v-model="booking.dvCarrier" class="job-no-input" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="D.V. for Customs">
              <el-input v-model="booking.dvForCustoms" class="job-no-input" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="Airport of Destination">
              <el-input v-model="booking.airportDestination" class="job-no-input" size="mini" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Flight/Date">
              <el-input v-model="booking.flightAndDate" class="job-no-input" size="mini" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Amount of Insureance">
              <el-input v-model="booking.amountOfInsureance" class="job-no-input" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="Handing Info">
            <el-input v-model="booking.handingInfo" class="job-no-input" size="mini" type="textarea" rows="4" />
          </el-form-item>
        </el-row>

        <el-row>
          <el-col :span="16">
            <el-row>
              <el-col :span="3">
                <el-form-item label="Pieces">
                  <el-input v-model="booking.pieces" class="job-no-input" size="mini" />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="Gross Weight">
                  <el-input v-model="booking.grossWeight" class="job-no-input" size="mini" @change="calcCWeight" />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="KG-LB">
                  <el-select v-model="booking.kgLb" :placeholder="$t('air.placeholder')" size="mini">
                    <el-option key="K" label="K" value="K"></el-option>
                    <el-option key="L" label="L" value="L"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="Rate Class">
                  <el-select v-model="booking.rateClass" :placeholder="$t('air.placeholder')" size="mini">
                    <el-option key="M" label="M" value="M"></el-option>
                    <el-option key="N" label="N" value="N"></el-option>
                    <el-option key="Q" label="Q" value="Q"></el-option>
                    <el-option key="S" label="S" value="S"></el-option>
                    <el-option key="C" label="C" value="C"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="C.Weight">
                  <el-input v-model="booking.cweight" class="job-no-input" size="mini" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="Rate Charge">
                  <el-input v-model="booking.rateCharge" class="job-no-input" size="mini" @change="calcTotalValue" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="Total">
                  <el-input v-model="booking.total" class="job-no-input" size="mini" @change="totalInputChange"
                    disabled />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="remark">
                <el-input v-model="booking.remark" class="job-no-input" size="mini" type="textarea" rows="6" />
              </el-form-item>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Nature and Quantity of Goods">
              <el-input v-model="booking.natureAndQuantityGoods" class="job-no-input" size="mini" type="textarea"
                rows="2" />
            </el-form-item>
            <el-form-item label="Dimension">
              <el-input v-model="booking.dimension" class="job-no-input" size="mini" type="textarea" rows="2" />
            </el-form-item>
            <el-form-item label="Volume">
              <el-input v-model="booking.volume" class="job-no-input" size="mini" @change="calcCWeight" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-row class="pay-item">
              <div style="text-align: center">
                <span style="float: left">Prepaid</span>
                <span>Weight Charge</span>
                <span style="float: right">Collect</span>
              </div>
              <el-col :span="12">
                <el-form-item label="">
                  <el-input v-model="booking.ppWeightCharge" class="job-no-input" size="mini" @change="changeTotal"
                    disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="">
                  <el-input v-model="booking.ccWeightCharge" class="job-no-input" size="mini" @change="changeTotal"
                    disabled />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="pay-item">
              <div style="text-align: center">Valuation</div>
              <el-col :span="12">
                <el-form-item label="">
                  <el-input v-model="booking.ppValuation" class="job-no-input" size="mini" @change="changeTotal"
                    :disabled="booking.wtVal == 'CC'" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="">
                  <el-input v-model="booking.ccValuation" class="job-no-input" size="mini" @change="changeTotal"
                    :disabled="booking.wtVal == 'PP'" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="pay-item">
              <div style="text-align: center">Tax</div>
              <el-col :span="12">
                <el-form-item label="">
                  <el-input v-model="booking.ppTax" class="job-no-input" size="mini" @change="changeTotal"
                    :disabled="booking.wtVal == 'CC'" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="">
                  <el-input v-model="booking.ccTax" class="job-no-input" size="mini" @change="changeTotal"
                    :disabled="booking.wtVal == 'PP'" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="14">
            <el-form-item label="Other Charge">
              <el-input v-model="booking.otherCharge" class="job-no-input" size="mini" type="textarea" rows="9" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-row>
              <div style="text-align: center;">Total other Charges Due Agent</div>
              <el-col :span="12">
                <el-form-item label="">
                  <el-input v-model="booking.ppTotalAgent" class="job-no-input" size="mini" @change="changeTotal"
                    :disabled="booking.other == 'CC'" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="">
                  <el-input v-model="booking.ccTotalAgent" class="job-no-input" size="mini" @change="changeTotal"
                    :disabled="booking.other == 'PP'" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="14">
            <el-form-item label="Signature of Shipper of his Agent">
              <el-input v-model="booking.signByShipper" class="job-no-input" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-row>
              <div style="text-align: center;">Total other Charges Due Carrier</div>
              <el-col :span="12">
                <el-form-item label="">
                  <el-input v-model="booking.ppTotalCarrier" class="job-no-input" size="mini" @change="changeTotal" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="">
                  <el-input v-model="booking.ccTotalCarrier" class="job-no-input" size="mini" @change="changeTotal" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="14">
            <el-form-item label="Signature of lssuing Carrier of its Agent">
              <el-input v-model="booking.signByCarrier" class="job-no-input" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5">
            <el-form-item label="Total Prepaid">
              <el-input v-model="booking.ppTotal" class="job-no-input" size="mini" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="Total Collect">
              <el-input v-model="booking.ccTotal" class="job-no-input" size="mini" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="Executed on (date)">
              <CommonPicker v-model="booking.signDateBl" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm"
                size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="at(place)">
              <el-input v-model="booking.signPlaceBl" class="job-no-input" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </div>

    <report-list-dialog v-if="reportDialog.isShow" :is-show="reportDialog.isShow" :print-data="reportDialog.data"
      :type-code="reportDialog.typeCode" @closeDialog="reportDialog.isShow = false" />

  </div>
</template>
<script>
import { getHBLDetailApi, updateHBLDetailApi, getMBLDetailApi, updateMBLDetailApi } from '@/api/airExport'
import reportListDialog from '@/components/Cargo/Report/reportListDialog'
import orderMixin from './orderMixin'

export default {
  name: 'BL',
  mixins: [orderMixin],
  components: {
    reportListDialog
  },
  props: {
    order: {
      type: Object,
      default () {
        return {
          spaceDTO: {},
          addressDTO: {},
          cargoDTO: {},
          baseDTO: {}
        }
      }
    },
    tabPane: {
      type: String,
      default () {
        return ""
      }
    },
    type: {
      type: String,
      default: 'MAWB'
    },
    id: {
      type: [String, Number],
      default: ''
    },
    state: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      loading: false,
      reportDialog: { // 打印报表对话框
        isShow: false,
        typeCode: '',
        data: {
          jobId: '',
          assistInfo: '',
          definedInfo: '',
          entityIdList: [],
          remark: ''
        }
      },
      booking: {
        accountNo: '', // 航空公司的帐号
        accountingInformation: '', // 结算信息
        agentIataCode: '', // 代理IATA代码
        airportDestination: '', // 目的港
        airportOfDeparture: '', // 起运港
        amountOfInsureance: 'NIL', // 货物的投保金额
        blType: '', // 提单类型;1-mbl;2-hbl
        ccTax: '', // 到付税金
        ccTotal: '', //
        ccTotalAgent: '', //
        ccTotalCarrier: '', //
        ccValuation: '', // 到付运费价（体积）
        ccWeightCharge: '', // 到付运费价（重量）
        consigneeAddress: '', // 收货人信息
        consigneeCode: '', // 收货人代码
        consigneeId: '', // 收货人id
        currency: '', // 币种
        cweight: '', //
        dimension: '', // 包装
        dvCarrier: 'NVD', // 货物的运输声明价值
        dvForCustoms: 'NCV', // 货物的通关申报价值
        flightAndDate: '', // flightAndDate
        flightNo: '', // 第一程航班信息
        grossWeight: '', // 毛重
        handingInfo: '', // 货物的操作信息和注意事项等
        hblNo: '', // hbl提单号
        icanCity: '', // 出具承运人的代理名称和城市
        id: '',
        issuedBy: '', // 签发人
        jobId: '', //
        kgLb: '', // 签发人
        mblNo: '', // mbl单号
        natureAndQuantityGoods: '', // 货物的性质和数量
        orderId: '', // 空出订单id
        otherCharge: '', // 除运费以外的其他费用预付/到付
        other: '', // 除运费以外的其他费用预付/到付
        pieces: '', // 件数
        podBy1stName: '', // 头程航司
        podBy2ndName: '', // 二程航司
        podBy3rdName: '', // 三程航司
        podTo1st: '', // 头程目的港
        podTo2nd: '', // 二程中转港
        podTo3rd: '', // 三程中转港
        ppTax: '', // 到付税金
        ppTotal: '', //
        ppTotalAgent: '', //
        ppTotalCarrier: '', //
        ppValuation: '', // 预付运费价（体积）
        ppWeightCharge: '', // 预付运费价（重量）
        rateCharge: '', // 单价
        rateClass: '', // 运价等级代码
        remark: '', // 备注
        shipperAddress: '', // 发货人信息
        shipperCode: '', // 发货人代码
        shipperId: '', // 发货人ID
        signByCarrier: '', //
        signByShipper: '', //
        signDateBl: '', // 签发日期
        signPlaceBl: '', // 签发地点
        total: '', // 运费总额
        volume: '', // 体积
        wtVal: '', // 运费预付/到付
        createByName: '', //
        createTime: '', //
        updateTime: '', //
        updateByName: '' //
      }
    }
  },
  watch: {
    tabPane (newV) {
      if (newV === "MAWB" || newV === "HAWB") {
        console.log("H/MAWB", newV)
        this.getDetail()
      }
    }
  },
  mounted () {
    this.getDetail()
  },
  methods: {
    NumFilt (val) {
      return val === 0 ? "" : val;
    },
    clearShipper () {
      this.booking.shipperAddress = ''
    },
    clearConsignee () {
      this.booking.consigneeAddress = ''
    },
    printFn () {
      // 测试代码
      let jsontest = { test: 123, d: 123 }
      let queryConditionJson = { jobId: this.booking.jobId, entityIdList: [this.booking.id], ...jsontest }
      // 根据查询条件进行批量打印
      if (this.type === 'MAWB') {
        this.reportDialog.typeCode = this.type === 'MAWB' ? 'AIR_MAWB' : 'AIR_HAWB'
        this.reportDialog.data = queryConditionJson
      } else {
        this.reportDialog.typeCode = this.type === 'MAWB' ? 'AIR_MAWB' : 'AIR_HAWB'
        this.reportDialog.data = queryConditionJson
      }
      // this.reportDialog.data = { queryConditionJson: JSON.stringify(queryConditionJson) }
      this.reportDialog.isShow = true
    },
    getBit (value, bit = 2) {
      let str = value.toString();
      let strIndex = str.indexOf('.');
      if (strIndex === -1) {
        return str;
      }
      str = str.substring(strIndex + 1, strIndex + 2);
      return str;
    },

    calcCWeight () {
      let c = Number(this.booking.volume * 166.66667).toFixed(3)

      if (c > Number(this.booking.grossWeight)) {
        this.booking.cweight = c
      } else {
        this.booking.cweight = Number(this.booking.grossWeight).toFixed(3)
      }
      let cweight = this.getBit(this.booking.cweight)
      console.log(this.booking.cweight, cweight)
      // (体积*166.66667)小于0.5的统一算0.5，大于等于0.5的，统一算1
      if (cweight < 5) {
        this.booking.cweight = parseInt(this.booking.cweight, 10) + 0.5
      } else {
        this.booking.cweight = Math.round(this.booking.cweight);
      }
      this.calcTotalValue()
    },
    calcTotalValue () {
      if (this.booking.rateCharge && this.booking.cweight) {
        this.booking.total = Number(this.booking.rateCharge) * Number(this.booking.cweight)
        this.booking.total = this.booking.total.toFixed(3)
      } else {
        this.booking.total = ''
      }
      this.totalInputChange()
    },
    totalInputChange () {
      this.booking.ppWeightCharge = this.booking.total
      this.booking.ccWeightCharge = this.booking.total
      this.changeTotal()
    },
    wtValChange () {
      if (this.booking.wtVal === 'PP') {
        this.booking.ppWeightCharge = this.booking.ccWeightCharge
        this.booking.ppValuation = this.booking.ccValuation
        this.booking.ppTax = this.booking.ccTax

        this.booking.ccWeightCharge = 0
        this.booking.ccValuation = 0
        this.booking.ccTax = 0
      } else {
        this.booking.ccWeightCharge = this.booking.ppWeightCharge
        this.booking.ccValuation = this.booking.ppValuation
        this.booking.ccTax = this.booking.ppTax

        this.booking.ppWeightCharge = 0
        this.booking.ppValuation = 0
        this.booking.ppTax = 0
      }
      this.changeTotal()
    },
    otherChange () {
      if (this.booking.wtVal === 'PP') {
        this.booking.ppTotalAgent = this.booking.ccTotalAgent
        this.booking.ccTotalAgent = 0
      } else {
        this.booking.ccTotalAgent = this.booking.ppTotalAgent
        this.booking.ppTotalAgent = 0
      }
      this.changeTotal()
    },
    changeTotal () {
      let ppTotal = 0
      let ccTotal = 0
      if (this.booking.ppWeightCharge) {
        ppTotal += Number(this.booking.ppWeightCharge)
      }
      if (this.booking.ccWeightCharge) {
        ccTotal += Number(this.booking.ccWeightCharge)
      }
      if (this.booking.ppValuation) {
        ppTotal += Number(this.booking.ppValuation)
      }
      if (this.booking.ccValuation) {
        ccTotal += Number(this.booking.ccValuation)
      }
      if (this.booking.ppTax) {
        ppTotal += Number(this.booking.ppTax)
      }
      if (this.booking.ccTax) {
        ccTotal += Number(this.booking.ccTax)
      }
      if (this.booking.ppTotalAgent) {
        ppTotal += Number(this.booking.ppTotalAgent)
      }
      if (this.booking.ccTotalAgent) {
        ccTotal += Number(this.booking.ccTotalAgent)
      }
      if (this.booking.ppTotalCarrier) {
        ppTotal += Number(this.booking.ppTotalCarrier)
      }
      if (this.booking.ccTotalCarrier) {
        ccTotal += Number(this.booking.ccTotalCarrier)
      }
      this.booking.ppTotal = ppTotal.toFixed(3)
      this.booking.ccTotal = ccTotal.toFixed(3)
    },
    getDetail () {
      if (this.id) {
        this.loading = true
        let fn = this.type === 'MAWB' ? getMBLDetailApi : getHBLDetailApi
        fn(this.id).then(res => {
          if (res && res.ok && res.content) {
            this.booking = res.content
            this.booking.ppWeightCharge === 0 ? this.booking.ppWeightCharge = "" : ""
            this.booking.ppValuation === 0 ? this.booking.ppValuation = "" : ""
            this.booking.ppTax === 0 ? this.booking.ppTax = "" : ""
            this.booking.ccWeightCharge === 0 ? this.booking.ccWeightCharge = "" : ""
            this.booking.ccValuation === 0 ? this.booking.ccValuation = "" : ""
            this.booking.ccTax === 0 ? this.booking.ccTax = "" : ""
            this.booking.ppTotalAgent === 0 ? this.booking.ppTotalAgent = "" : ""
            this.booking.ccTotalAgent === 0 ? this.booking.ccTotalAgent = "" : ""
            this.booking.ppTotalCarrier === 0 ? this.booking.ppTotalCarrier = "" : ""
            this.booking.ccTotalCarrier === 0 ? this.booking.ccTotalCarrier = "" : ""
            this.booking.ccTotal === 0 ? this.booking.ccTotal = "" : ""
            this.booking.ppTotal === 0 ? this.booking.ppTotal = "" : ""

          }
        })
        this.loading = false
      }
    },
    save () {
      this.loading = true
      let fn = this.type === 'MAWB' ? updateMBLDetailApi : updateHBLDetailApi
      fn(this.booking).then(res => {
        if (res && res.ok) {
          this.$message.success(this.$t('air.successSaved'))
          this.getDetail()
          this.adjustConfirmFn(this.order)
        }
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="less">
.mawb {
  background: #fff;
  margin-bottom: 20px;
  padding-bottom: 20px;
  font-size: 12px;
  color: #606266;

  ::v-deep .el-col {
    margin-top: 6px !important;
  }

  .pay-item {
    margin-top: 6px;

    ::v-deep .el-col {
      margin-top: 0px !important;
    }
  }

  ::v-deep .el-form--label-top .el-form-item__label {
    padding: 0;
    line-height: 20px !important;
  }

  ::v-deep .el-form-item {
    margin-bottom: 0px;
    padding: 0 10px;
  }
}
</style>
