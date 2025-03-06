<template>
  <div class="app" v-loading="loading">
    <div style="margin-top: 14px;">
      <div class="form-module-title " v-if="orderDetail.baseDTO.orderState === 4">
        <span style="color:red">{{ $t('air.refusingBookSpace') }}</span>
      </div>
      <div class="form-module-item" v-if="orderDetail.baseDTO.orderState === 4">
        <div class="item">
          <span style="color:red">
            {{ orderDetail.affirmRemark }}</span>
        </div>
      </div>

      <div class="form-module-title ">
        <span>{{ $t('air.customerMandateInformation') }}</span>
      </div>
      <div class="form-module-item">
        <div class="item">
          <label>{{ $t('air.orderNumber') }}</label>
          <span>{{ orderDetail.baseDTO.orderNo }}</span>
        </div>
        <div class="item">
          <label>{{ $t('air.requester') }} </label>
          <span> {{ orderDetail.baseDTO.customerName }}</span>
        </div>
        <div class="item">
          <label>{{ $t('air.ownedSales') }} </label>
          <span> {{ orderDetail.baseDTO.sellerName }}</span>
        </div>
        <div class="item">
          <label>{{ $t('air.cargoType') }} </label>
          <span> {{ orderDetail.cargoDTO.cargoTypeDesc }}</span>
        </div>

        <div class="item">
          <label>{{ $t('air.orderQuantity') }}</label>
          <span> {{ orderDetail.cargoDTO.orderQuantity }}</span>
        </div>
        <div class="item">
          <label>{{ $t('air.orderGrossWeight') }}</label>
          <span>{{ orderDetail.cargoDTO.orderGrossWeight }} KGS</span>
        </div>

        <div class="item">
          <label> {{ $t('air.orderVolume') }}</label>
          <span> {{ orderDetail.cargoDTO.orderVolume }} CBM</span>
        </div>
        <div class="item">
          <label>{{ $t('air.entrustedChargingWeight') }} </label>
          <span>{{ orderDetail.cargoDTO.orderChargeableWeight }} M/T</span>
        </div>
        <div class="item">
          <label> {{ $t('air.delivery') }} </label>
          <span>{{ orderDetail.spaceDTO.delivery }} / {{ orderDetail.spaceDTO.deliveryCode }} </span>
        </div>
        <div class="item">
          <label> {{ $t('air.pol') }} </label>
          <span>{{ orderDetail.spaceDTO.pol }} / {{ orderDetail.spaceDTO.polCode }} </span>
        </div>
        <div class="item">
          <label> {{ $t('air.pod2') }} </label>
          <span> {{ orderDetail.spaceDTO.pod }} / {{ orderDetail.spaceDTO.podCode }}</span>
        </div>
        <div class="item">
          <label> {{ $t('air.receipt') }} </label>
          <span> {{ orderDetail.spaceDTO.receipt }} / {{ orderDetail.spaceDTO.receiptCode }}</span>
        </div>
        <!-- 货型比例 -->
        <div class="item">
          <label> {{ $t('air.typeRatio') }} </label>
          <span style="color:red"> {{ orderDetail.cargoTypeRatio }}</span>
        </div>
        <div class="item">
          <label> {{ $t('air.etd') }} </label>
          <span> {{ parseTime(orderDetail.spaceDTO.etd) }} （{{ orderDetail.spaceDTO.etdWeek }}）</span>
        </div>
        <div class="item">
          <label>{{ $t('air.tradeTerms') }}</label>
          <span> {{ orderDetail.spaceDTO.tradeTerm }} </span>
        </div>
        <div class="item">
          <label> {{ $t('air.cargoCnName') }} </label>
          <span> {{ orderDetail.cargoDTO.cargoCnName }}</span>
        </div>
        <div class="item">
          <label> {{ $t('air.palletSizes') }} </label>
          <span> {{ orderDetail.cargoDTO.palletSizes }}</span>
        </div>

        <div class="item">
          <label> {{ $t('air.customerSplitBubbleHead') }} </label>
          <span> {{ orderDetail.firstVolumetric }}</span>
        </div>
        <div class="item">
          <label> {{ $t('air.customerSplitBubbleTrail') }} </label>
          <span> {{ orderDetail.lastVolumetric }}</span>
        </div>

        <div class="item" style="width:100%">
          <label> {{ $t('air.remarks') }} </label>
          <span style="color:red"> {{ orderDetail.spaceDTO.bookingRemark }}</span>
        </div>
        <div class="item" style="width:100%">
          <label> {{ $t('air.salesQuotation') }} </label>
          <span style="color:red"> {{ orderDetail.salesQuotation }}</span>
        </div>
        <div class="item" style="width:100%">
          <label> {{ $t('air.clientOrder') }} </label>
          <span v-for="item in orderDetail.fileList" :key="item.id">
            <span @click="downloadElectronicFile(item)" v-if="item.documentTypeCode === 'customer_power_attorney'"
              style="color:dodgerblue;margin-left:10px;cursor:pointer;">
              {{ item.fileName }}
            </span>
          </span>
        </div>
        <div class="item" style="width:100%">
          <label> {{ $t('air.applicationForSpecialPrice') }} </label>
          <span v-for="item in orderDetail.fileList" :key="item.id">
            <span @click="downloadElectronicFile(item)" v-if="item.documentTypeCode === 'special_offer_application_doc'"
              style="color:dodgerblue;margin-left:10px;cursor:pointer;">
              {{ item.fileName }}
            </span>
          </span>
        </div>
      </div>

      <!-- 舱位信息 -->
      <div class="form-module-title">{{ $t('air.shippingSpecialist') }}</div>
      <div class="form-module-item">
        <el-form ref="makingCargoMode" :model="makingCargoMode" :rules="shippingSpaceRules" label-width="95px"
          label-position="left" class="shippingSpaceForm">
          <!-- 舱位类型 -->
          <el-form-item :label="$t('air.shippingSpaceTypeDesc')" prop="shippingSpaceType" size="mini">
            <el-select v-model="makingCargoMode.shippingSpaceType" :placeholder="$t('air.placeholder')"
              @change="selectedShippingSpaceType">
              <el-option :label="$t('air.ownShippingSpace')" :value="2"></el-option>
              <el-option :label="$t('air.agentShippingSpace')" :value="3"></el-option>
              <el-option :label="$t('air.bellyholdService')" :value="4"></el-option>
            </el-select>
          </el-form-item>
          <!-- 产品航线 -->
          <el-form-item :label="$t('air.productAirlineName')" prop="productAirlineId" size="mini"
            :rules="[{ required: Number(makingCargoMode.shippingSpaceType) === 2, message: $t('air.requiredProductAirLine'), trigger: 'change' }]">
            <el-select filterable clearable v-model="makingCargoMode.productAirlineId"
              :placeholder="$t('air.placeholder')" @change="selectProductAirLine"
              :disabled="Number(makingCargoMode.shippingSpaceType) === 3 || Number(makingCargoMode.shippingSpaceType) === 4"
              size="mini">
              <el-option v-for="(item, index) in productAirlineNameList" :label="item.productName" :value="item.id"
                :key="index">
              </el-option>
            </el-select>
            <div style="font-size: 13px;margin-left: -60px;height: 0px;color:coral" v-if="airLineWarmVisible">
              {{ $t('air.airLineWarm') }} </div>
          </el-form-item>
          <!-- 航空公司 -->
          <el-form-item :label="$t('air.airline')" prop="airlineId" size="mini"
            :rules="[{ required: Number(makingCargoMode.shippingSpaceType) === 2 || Number(makingCargoMode.shippingSpaceType) === 4, message: $t('air.requiredAirline'), trigger: 'change' }]">
            <!-- <cargo-limited-select :placeholder="$t('air.placeholder')" :method="airCustomerMethod"
              :select-label="makingCargoMode.airlineName" :select-value="makingCargoMode.airlineId" type="customer"
              style="width: 100%;" @set="setAirCustomerInfo" :disabled="makingCargoMode.shippingSpaceType == 2" /> -->

            <type-select :placeholder="$t('air.placeholder')" v-model="makingCargoMode.airlineName" type="airLine"
              style="width: 100%;" @selected="setAirCustomerInfo"
              :disabled="Number(makingCargoMode.shippingSpaceType) === 2" />
          </el-form-item>

          <!-- 订舱代理 -->
          <el-form-item :label="$t('air.bookingAgentPort')" prop="bookingAgentId" size="mini"
            :rules="[{ required: Number(makingCargoMode.shippingSpaceType) === 3, message: $t('air.requiredBookingAgentPort'), trigger: 'change' }]">
            <!-- <cargo-limited-select :select-label="makingCargoMode.bookingAgentName"
              :select-value="makingCargoMode.bookingAgentId" :method-params="{ range: ['b_booking_agent'] }"
              type="customer" style="width: 100%;" @set="setBookingAgentInfo" /> -->

            <type-select v-model="makingCargoMode.bookingAgentName" type="supplier" style="width: 100%;"
              :request-params="{ 'partnerRole': 14014, 'businessType': 'AIR_EXPORT' }" @selected="setBookingAgentInfo" />
          </el-form-item>

          <!-- 目的港代理 -->
          <el-form-item :label="$t('air.destinationAgentName')" prop="destinationAgentName" :rules="[{
            required: (orderDetail.spaceDTO.tradeTerm === 'EXW' || orderDetail.spaceDTO.tradeTerm === 'DDU'
              || orderDetail.spaceDTO.tradeTerm === 'DDP' || orderDetail.spaceDTO.tradeTerm === 'DAP'),
            message: $t('air.pleaseSelectData'), trigger: 'change'
          }]" size="mini">
            <type-select v-model="makingCargoMode.destinationAgentName" type="supplier" :requestParams="partnerRoleParams"
              clearable @selected="setDestinationAgentInfo" />

          </el-form-item>

          <!-- 截止入仓时间 -->
          <el-form-item :label="$t('air.inboundDeadline')" prop="inboundDeadline">
            <CommonPicker v-model="makingCargoMode.inboundDeadline" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm"
              size="mini" />
          </el-form-item>

          <!-- 中转港 -->
          <el-form-item :label="$t('air.transitPort')" prop="potCode">
            <el-row>
              <el-col :span="10">
                <type-select v-model="makingCargoMode.potCode" type="airport" @selected="selectedPot" size="mini" />
              </el-col>
              <el-col :span="14" style="padding-left: 10px;">
                <el-input v-model="makingCargoMode.pot" class="job-no-input" size="mini" disabled />
              </el-col>
            </el-row>
          </el-form-item>
          <!-- 目的地 -->
          <el-form-item :label="$t('air.pod2')" prop="podCode">
            <el-row>
              <el-col :span="10">
                <type-select v-model="makingCargoMode.podCode" type="airport" @selected="selectedPod" size="mini" />
              </el-col>
              <el-col :span="14" style="padding-left: 10px;">
                <el-input v-model="makingCargoMode.pod" class="job-no-input" size="mini" disabled />
              </el-col>
            </el-row>
          </el-form-item>

          <!-- 产品分泡(头程) -->
          <el-form-item :label="$t('air.headPartOfTheBubble')" prop="firstProductVolumetric">
            <el-select v-model="makingCargoMode.firstProductVolumetric" size="mini" clearable>
              <el-option v-for="item in customerSplitList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <!-- 尾程分泡比(尾程) -->
          <el-form-item :label="$t('air.tailSeparationBubble')" prop="lastProductVolumetric">
            <el-select v-model="makingCargoMode.lastProductVolumetric" size="mini" clearable>
              <el-option v-for="item in customerSplitList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <!-- 产品备注 -->
          <el-form-item :label="$t('air.productNote')" prop="productRemark" style="width:50%">
            <el-input v-model.trim="makingCargoMode.productRemark" class="job-no-input" size="mini" />
          </el-form-item>
        </el-form>
      </div>
      <!-- 报价信息 -->
      <div class="form-module-title">{{ $t('air.quotationInformation') }}</div>

      <div class="company" style="margin: 10px;">
        <el-form ref="editForm" :model="makingCargoMode" label-width="95px" label-position="left">
          <el-row style="margin-top: -4px;">
            <el-col :span="6">
              <el-form-item :label="$t('air.associatedCostPrice')" prop="priceCardName">
                <el-input v-model="makingCargoMode.priceCardName" :disabled="editStatus()" class="job-no-input"
                  size="mini" v-input-limit="[-10, 4]" />
              </el-form-item>
            </el-col>
            <el-col :span="24" style="margin-top: -15px;color: #606266;font-size: 13px;">
              {{ $t('air.salesQuotation') }}：<span style="color:red"> {{ orderDetail.salesQuotation }}</span>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <el-form ref="chargeForm" class="order-air-item" :model="makingCargoMode.chargeForm" label-position="left">
        <el-table size="mini" :border="true" :data="makingCargoMode.chargeForm.charges" style="width: 100%; "
          row-key="id">
          <el-table-column prop="feeItemName" :label="$t('receiveFms.charge_name')">
            <template slot-scope="{row, $index}">
              <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
                :prop="`charges[${$index}].feeItemName`">
                <!-- :method="dmnBusinessApi" -->
                <type-select v-model="row.feeItemName" type="businessFee" :disabled="editStatus()"
                  :requestParams="{ businessTypeCode: 'AIR_EXPORT' }" @selected="selectedFee($event, $index)" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="unitName1" :label="$t('receiveFms.unit_name')">
            <template slot-scope="{row, $index}">
              <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
                :prop="`charges[${$index}].unit1`">
                <el-select v-model="row.unit1" size="mini" :disabled="editStatus()">
                  <el-option v-for="(item, index) in unitList" :key="index" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="currency" :label="$t('receiveFms.currency')">
            <template slot-scope="{row, $index}">
              <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
                :prop="`charges[${$index}].currency`">
                <el-select v-model="row.currency" size="mini" :disabled="editStatus()">
                  <el-option v-for="item in currencyList" :key="item.code" :label="item.code" :value="item.code" />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="price" :label="$t('receiveFms.price')">
            <template slot-scope="{row, $index}">
              <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
                :prop="`charges[${$index}].price`">
                <!-- oninput="value=value.replace(/[^\d.]/g,'')" -->
                <el-input v-model="row.price" size="mini" v-input-limit="[-9, 2]" :disabled="editStatus()"></el-input>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column prop="remark" :label="$t('air.remark')">
            <template slot-scope="{row, $index}">
              <el-form-item :prop="`charges[${$index}].remark`">
                <el-input v-model='row.remark' size="mini" :disabled="editStatus()"></el-input>
              </el-form-item>
            </template>
          </el-table-column>


          <el-table-column prop="oper" :label="$t('receiveFms.operation')" width="60">
            <template slot-scope="{$index }">
              <i class="iconfont icon-minus-circle" v-if="makingCargoMode.chargeForm.charges.length > 1 && !editStatus()"
                @click="deleteFn($index)"></i>
              <i class="iconfont icon-add-circle" v-if="$index === 0 && !editStatus()" @click="addFn($index)"></i>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <ElImageViewer v-show="fileimageShow" :on-close="fileimageClose" :url-list="filepaths" />

      <div class="operation-btn">
        <el-button type="danger" @click="cancellationOfOrder">{{
          $t('air.refuse')
        }}</el-button>
        <el-button type="primary" @click="addOrder">{{ $t('air.save') }}</el-button>
        <el-button @click="cancel">{{ $t('air.cancel') }}</el-button>
      </div>
    </div>
    <el-dialog :title="$t('air.refusalReasons')" :visible.sync="cancellationOfOrderVisible" width="400px">
      <div>
        <div class="el-form-item">
          <!-- 拒绝理由 -->
          <div>{{ $t('air.refusalReasons') }}</div>
          <el-input v-model="affirmRemark" :rows="7" type="textarea" wrap="off" />
          <span style="color:red" v-if="refusalReasonFlag">{{ $t('air.refusalReasonsWarning') }} </span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancellationOfOrderVisible = false" size="mini">{{ $t('air.cancel') }}</el-button>
        <el-button type="primary" @click="submitCancellationOfOrderFn" size="mini">{{ $t('air.determine') }}</el-button>
      </div>
    </el-dialog>


    <el-dialog :title="$t('air.verify')" :visible.sync="checkProductVisible" width="400px">
      <div>
        <div class="el-form-item">
          <el-row>
            <el-col :span="20" :style="{ color: colorType.airFreight, 'margin-bottom': '10px' }">
              {{ $t('air.salesQuotation') }}：
              {{ $t('air.productQuotation') }}
            </el-col>
            <el-col :span="4" :style="{ color: colorType.airFreight, 'margin-bottom': '10px' }">
              {{ checkProduct.airFreight }}
            </el-col>

            <el-col :span="20" :style="{ color: colorType.firstVolumetric, 'margin-bottom': '10px' }">
              {{ $t('air.customerSplitBubbleHead') }}：
              {{ $t('air.productSeparationBubbleFirst') }}
            </el-col>
            <el-col :span="4" :style="{ color: colorType.firstVolumetric, 'margin-bottom': '10px' }">
              {{ checkProduct.firstVolumetric }}
            </el-col>

            <el-col :span="20" :style="{ color: colorType.lastVolumetric, 'margin-bottom': '10px' }">
              {{ $t('air.customerSplitBubbleTrail') }}：
              {{ $t('air.productSeparationBubbleTail') }}
            </el-col>
            <el-col :span="4" :style="{ color: colorType.lastVolumetric, 'margin-bottom': '10px' }"> {{
              checkProduct.lastVolumetric
            }}</el-col>
          </el-row>

          <span style="color:red;margin-top: 10px;">{{ $t('air.verifyFlase') }} </span>

        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="checkProductVisible = false" size="mini">{{ $t('air.cancel') }}</el-button>
        <el-button type="primary" @click="submitcheckProductFn" size="mini">{{ $t('air.determine') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { downloadElectronicFileApi } from '@/api/seaExport'

import { getAirExportOrderDetailApi, addAirOrderAffirm, airOrderAffirmRefused, getAirLineList, airFlightPlanQueryByEtdMonth } from '@/api/airExport'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'
import { airLineListApi, airportListApi } from '@/api/common'
import { getDictDataApi } from '@/api/fmsReceiveAir'
import {
  getCustomerDropDownListApi, getTaxRateListApi
} from '@/api/common'
import { getCurrenciesListApi } from "@/api/common"
import { getYHTListApi } from '@/api/partner/base'

import { parseTime } from '@/utils/index'
import AirExcelUpload from '../components/airExcelUpload'
import ElImageViewer from "element-ui/packages/image/src/image-viewer"

export default {
  name: 'AirQuotationManagementQuote',
  components: {
    cargoLimitedSelect, AirExcelUpload, ElImageViewer
  },

  data () {

    return {
      colorType: {
        airFreight: "green",
        firstVolumetric: "green",
        lastVolumetric: "green"
      },
      checkProductVisible: false,
      checkProduct: {
        airFreight: "",
        firstVolumetric: "",
        lastVolumetric: ""
      },
      airFreight: 0,
      refusalReasonFlag: false,
      affirmRemark: "",
      partnerRoleParams: {
        partnerRole: 14012
      },
      airLineWarmVisible: false,
      airCustomerMethod: airLineListApi,
      makingCargoMode: {
        id: "",
        shippingSpaceType: '',
        productAirlineName: '',
        productAirlineId: '',
        airlineId: '',
        airlineName: '',
        airlineScacCode: '',
        bookingAgentId: '',
        bookingAgentName: '',
        destinationAgentId: "",
        destinationAgentName: "",
        inboundDeadline: '',
        podCode: '', // 卸货港
        pod: '',
        polCode: '', // 装货港
        pol: '',
        pot: '',
        potCode: '',
        productRemark: "",
        firstProductVolumetric: "",
        lastProductVolumetric: "",
        priceCardName: "", // 关联成本价
        airOrderExportChargeDtoList: {},
        chargeForm: {
          charges: [{}]
        }
      },
      shippingSpaceRules: {
        "shippingSpaceType": [{ required: true, message: this.$t('air.requiredShippingSpaceType'), trigger: 'change' }],
        "podCode": [{ required: true, message: this.$t('air.requiredPod'), trigger: 'blur' }]
      },
      productAirlineNameList: [],
      cancellationOfOrderVisible: false,
      customerSplitList: [{
        code: 0.1,
        value: '10%',
        label: '10%'
      }, {
        code: 0.2,
        value: '20%',
        label: '20%'
      }, {
        code: 0.3,
        value: '30%',
        label: '30%'
      }, {
        code: 0.4,
        value: '40%',
        label: '40%'
      }, {
        code: 0.5,
        value: '50%',
        label: '50%'
      }, {
        code: 0.6,
        value: '60%',
        label: '60%'
      }, {
        code: 0.7,
        value: '70%',
        label: '70%'
      }, {
        code: 0.8,
        value: '80%',
        label: '80%'
      }, {
        code: 0.9,
        value: '90%',
        label: '90%'
      }, {
        code: 0.333,
        value: '1/3',
        label: '1/3'
      }, {
        code: 0.666,
        value: '2/3',
        label: '2/3'
      }],
      canBeUpload: false, // 托书
      fileimageShow: false,
      filepaths: [],
      styleText: {
        width: '30%',
        'margin-left': 0
        // display: 'inline-block'
      },
      loading: false,
      unitList: [],
      currencyList: [],
      orderDetail: {
        spaceDTO: {},
        addressDTO: {},
        cargoDTO: {},
        baseDTO: {}
      }

    }
  },

  watch: {
  },

  created () {
    this.getDetail()

    this.init()
  },

  methods: {
    selectedPot (port) {
      this.makingCargoMode.pot = port.englishName
    },
    selectedPod (port) {
      this.makingCargoMode.pod = port.englishName
    },
    setDestinationAgentInfo (customer) {
      this.makingCargoMode.destinationAgentName = customer.chineseName
      this.makingCargoMode.destinationAgentId = customer.id
    },
    setAirCustomerInfo (customer) {
      this.makingCargoMode.airlineId = customer.id
      this.makingCargoMode.airlineName = customer.chineseName
      this.makingCargoMode.airlineScacCode = customer.scacCode
    },
    setBookingAgentInfo (customer) {
      this.makingCargoMode.bookingAgentName = customer.chineseName
      this.makingCargoMode.bookingAgentId = customer.id
    },
    selectedShippingSpaceType (item) {
      this.airLineWarmVisible = false
      if (item === 3 || item === 4) {
        this.makingCargoMode.airlineId = ""
        this.makingCargoMode.airlineName = ""
        this.makingCargoMode.airlineScacCode = ""
        this.makingCargoMode.productAirlineName = ""
        this.makingCargoMode.productAirlineId = ""

        this.makingCargoMode.polCode = this.orderDetail.spaceDTO.polCode
        this.makingCargoMode.pol = this.orderDetail.spaceDTO.pol
        this.airLineSplit = []
      }
    },
    selectProductAirLine (airLineId, flightPlanId) {
      this.airLineWarmVisible = false
      this.planAirlineNameList = []
      this.computeStowageVisible = false
      this.makingCargoMode.productAirlineName = ""
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

          let airLine = this.productAirlineNameList.find(item => item.id === airLineId).productName
          this.airLineSplit = airLine.split("-")
          console.log("airLineSplit", this.airLineSplit)
          if (this.airLineSplit[1] !== this.orderDetail.spaceDTO.polCode || this.airLineSplit[2] !== this.orderDetail.spaceDTO.podCode) {
            this.airLineWarmVisible = true
          } else {
            this.airLineWarmVisible = false
          }
          this.makingCargoMode.productAirlineName = airLine
          // 航空公司 正则中文去除
          airLineListApi({
            "code": this.airLineSplit[0].replace(/[\u4e00-\u9fa5]/g, "")
          }).then(res => {
            this.makingCargoMode.airlineId = res.content.list[0].id
            this.makingCargoMode.airlineName = res.content.list[0].chineseName
            this.makingCargoMode.airlineScacCode = res.content.list[0].scacCode
          })
          // 起运港
          // airportListApi({
          //   "code": this.airLineSplit[1]
          // }).then(res => {
          //   if (res && res.ok && res.content.list.length > 0) {
          //     this.makingCargoMode.polCode = res.content.list[0].code3 // 装货港
          //     this.makingCargoMode.pol = res.content.list[0].englishName // 装货港
          //   }
          // })
          //  产品航线目的港值跟订单目的港不一致时，将值带入中转港
          if (this.makingCargoMode.podCode && this.makingCargoMode.podCode !== this.airLineSplit[2]) {
            airportListApi({
              "code": this.airLineSplit[2]
            }).then(res => {
              if (res && res.ok && res.content.list.length > 0) {
                this.makingCargoMode.potCode = res.content.list[0].code3 // 中转港
                this.makingCargoMode.pot = res.content.list[0].englishName // 中转港
              }
            })
          }

          // airportListApi({
          //   "code": this.airLineSplit[2]
          // }).then(res => {
          //   if (res && res.ok && res.content.list.length > 0) {
          //     this.makingCargoMode.podCode = res.content.list[0].code3 // 卸货港
          //     this.makingCargoMode.pod = res.content.list[0].englishName // 卸货港
          //   }

          // })
        })
      }
    },

    parseTime (value) {
      return parseTime(value, '{y}-{m}-{d} {h}:{i}')
    },

    getDetail () {
      let id = this.$route.query.id
      this.loading = true;
      getAirExportOrderDetailApi(id).then(res => {
        if (res.content) {

          let salesQuotation = ""
          res.content.airOrderExportChargeDtoList.forEach(v => {
            try {
              // 应收
              if (v.arAp === 1) {
                // 销售空运费
                if (v.feeItemCode === "AF") {
                  this.airFreight += v.price
                }
                let chargeUnit = ""
                if (v.unit1 === 1101) {
                  chargeUnit = this.$t('air.kg')
                } else if (v.unit1 === 2004) {
                  chargeUnit = this.$t('air.ticket')
                }
                salesQuotation += v.feeItemName + "：" + v.price + "/" + chargeUnit
                if (v.remark) {
                  salesQuotation += "(" + v.remark + ")"
                }
                salesQuotation += "，"
              }

            } catch (e) {
              console.log(e)
            }
          })
          res.content.salesQuotation = salesQuotation.substring(0, salesQuotation.length - 1)
          this.orderDetail = res.content

          // this.makingCargoMode.firstVolumetric = res.content.firstVolumetric // 头程分泡值
          // this.makingCargoMode.lastVolumetric = res.content.lastVolumetric // 尾程分泡值

          this.makingCargoMode.shippingSpaceType = res.content.spaceDTO.shippingSpaceType
          this.makingCargoMode.productAirlineName = res.content.spaceDTO.productAirlineName
          this.makingCargoMode.productAirlineId = res.content.spaceDTO.productAirlineId
          this.makingCargoMode.airlineId = res.content.spaceDTO.airlineId
          this.makingCargoMode.airlineName = res.content.spaceDTO.airlineName
          this.makingCargoMode.airlineScacCode = res.content.spaceDTO.airlineScacCode
          this.makingCargoMode.bookingAgentId = res.content.spaceDTO.bookingAgentId
          this.makingCargoMode.bookingAgentName = res.content.spaceDTO.bookingAgentName
          this.makingCargoMode.destinationAgentId = res.content.spaceDTO.destinationAgentId
          this.makingCargoMode.destinationAgentName = res.content.spaceDTO.destinationAgentName
          this.makingCargoMode.inboundDeadline = res.content.spaceDTO.inboundDeadline
          this.makingCargoMode.podCode = res.content.spaceDTO.podCode
          this.makingCargoMode.pod = res.content.spaceDTO.pod
          this.makingCargoMode.polCode = res.content.spaceDTO.polCode
          this.makingCargoMode.pol = res.content.spaceDTO.pol
          this.makingCargoMode.potCode = res.content.spaceDTO.potCode
          this.makingCargoMode.pot = res.content.spaceDTO.pot
          this.makingCargoMode.productRemark = res.content.productRemark
          this.makingCargoMode.priceCardName = res.content.priceCardName
          this.makingCargoMode.chargeForm.charges = []

          // 起运港=PVG，30，=CAN，50，=NTG，20
          let polPrice = ""
          if (res.content.spaceDTO.polCode === 'PVG') {
            polPrice = 30
          } else if (res.content.spaceDTO.polCode === 'CAN') {
            polPrice = 50
          } else if (res.content.spaceDTO.polCode === 'NTG') {
            polPrice = 20
          }
          if (res.content.airOrderExportChargeDtoList.length > 0) {
            res.content.airOrderExportChargeDtoList.forEach(v => {
              try {
                if (v.arAp === 1) {
                  if (v.feeItemCode === "DOC") {
                    v.price = 50
                  } else if (v.feeItemCode === "OEDI") {
                    v.price = polPrice
                  } else {
                    v.price = ""
                  }

                  v.remark = ""
                  this.makingCargoMode.chargeForm.charges.push(v)
                }
              } catch (e) {
                console.log(e)
              }
            })
          } else {

            this.makingCargoMode.chargeForm = {
              charges: [{
                "currency": "CNY",
                "unit1": 1101,
                "feeItemName": this.$t('air.airFreight'),
                "feeItemCode": "AF"
              }, {
                "currency": "CNY",
                "unit1": 2004,
                "feeItemName": this.$t('air.documentCharge'),
                "price": 50,
                "feeItemCode": "DOC"
              }, {
                "currency": "CNY",
                "unit1": 2004,
                "feeItemName": this.$t('air.CustomsTransmissionServiceCharge'),
                "price": polPrice,
                "feeItemCode": "OEDI"
              }]
            }
          }
        }
        this.loading = false;
      })
    },
    downloadElectronicFile (obj) {
      downloadElectronicFileApi(obj.id).then(res => {
        if (res.ok) {
          // res.content.fileName = obj.fileName
          this.onPreview(res.content)
        }
      })
    },
    cancellationOfOrder () {
      this.cancellationOfOrderVisible = true;
    },
    submitCancellationOfOrderFn () {

      if (!this.affirmRemark) {
        this.refusalReasonFlag = true
        return
      } else {
        this.refusalReasonFlag = false
      }
      let data = {
        id: this.$route.query.id,
        affirmRemark: this.affirmRemark
      }
      // 取消接口
      airOrderAffirmRefused(data).then(res => {
        if (res && res.ok) {
          this.$message.success(this.$t('air.cancelSuccess'));
          this.cancellationOfOrderVisible = false;
          this.backList()
        }
      });
    },
    backList () {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: `AirConfirmationManagementToB` })
    },
    // 订单状态为
    editStatus (item) {
      return false

    },
    // 保存
    addOrder () {

      // this.loading = true
      let vb = false; let ve = false;
      this.$refs.makingCargoMode.validate(valid => {
        if (valid) {
          vb = valid
        }
      })
      this.$refs.chargeForm.validate(valid => {
        if (valid) {
          ve = valid
        }
      })

      if (ve && vb) {
        this.loading = true
        this.makingCargoMode.id = this.$route.query.id
        this.makingCargoMode.airOrderExportChargeDtoList = this.makingCargoMode.chargeForm.charges
        // 校验【空运费】【分泡比例(头程)】【分泡比例(尾程)
        let checkProductFlag = false
        let airFreightProduct = 0
        this.makingCargoMode.airOrderExportChargeDtoList.forEach(v => {
          // 产品空运费
          if (v.feeItemCode === "AF") {
            airFreightProduct += v.price
          }
        });
        this.colorType = {
          airFreight: "green",
          firstVolumetric: "green",
          lastVolumetric: "green"
        }
        if (this.airFreight > airFreightProduct) {
          this.checkProduct.airFreight = this.$t('air.greaterThan')
        } else if (this.airFreight === airFreightProduct) {
          this.checkProduct.airFreight = this.$t('air.equalTo')
        } else if (this.airFreight < airFreightProduct) {
          this.checkProduct.airFreight = this.$t('air.lessThan')
          this.colorType.airFreight = 'red'
          checkProductFlag = true
        }

        let firstVolumetric = 0
        if (this.orderDetail.firstVolumetric) {
          firstVolumetric = this.customerSplitList.find(item => item.value === this.orderDetail.firstVolumetric).code
        }
        let lastVolumetric = 0
        if (this.orderDetail.lastVolumetric) {
          lastVolumetric = this.customerSplitList.find(item => item.value === this.orderDetail.lastVolumetric).code
        }
        let firstProductVolumetric = 0
        if (this.makingCargoMode.firstProductVolumetric) {
          firstProductVolumetric = this.customerSplitList.find(item => item.value === this.makingCargoMode.firstProductVolumetric).code
        }
        let lastProductVolumetric = 0
        if (this.makingCargoMode.lastProductVolumetric) {
          lastProductVolumetric = this.customerSplitList.find(item => item.value === this.makingCargoMode.lastProductVolumetric).code

        }

        if (firstVolumetric > firstProductVolumetric) {
          this.checkProduct.firstVolumetric = this.$t('air.greaterThan')
        } else if (firstVolumetric === firstProductVolumetric) {
          this.checkProduct.firstVolumetric = this.$t('air.equalTo')
        } else if (firstVolumetric < firstProductVolumetric) {
          this.checkProduct.firstVolumetric = this.$t('air.lessThan')
          this.colorType.firstVolumetric = 'red'
          checkProductFlag = true
        }
        if (lastVolumetric > lastProductVolumetric) {
          this.checkProduct.lastVolumetric = this.$t('air.greaterThan')
        } else if (lastVolumetric === lastProductVolumetric) {
          this.checkProduct.lastVolumetric = this.$t('air.equalTo')
        } else if (lastVolumetric < lastProductVolumetric) {
          this.checkProduct.lastVolumetric = this.$t('air.lessThan')
          this.colorType.lastVolumetric = 'red'
          checkProductFlag = true
        }
        if (checkProductFlag) {
          console.log("this.checkProduct", this.checkProduct)
          this.checkProductVisible = true
          this.loading = false
          return
        }

        addAirOrderAffirm(this.makingCargoMode).then(res => {
          if (res && res.ok) {
            this.$message.success(this.$t('air.successSaved'))
            this.backList()
          }
          this.loading = false
        })
      }

    },
    submitcheckProductFn () {
      this.loading = true
      addAirOrderAffirm(this.makingCargoMode).then(res => {
        if (res && res.ok) {
          this.$message.success(this.$t('air.successSaved'))
          this.backList()
        }
        this.loading = false
      })
    },
    cancel () {
      this.$confirm(this.$t('air.cancelTip'), this.$t('air.tips'), {
        confirmButtonText: this.$t('air.determine'),
        cancelButtonText: this.$t('air.cancel'),
        type: 'warning'
      }).then(() => {
        this.backList()
      }).catch(() => {
      })
    },

    init () {
      Promise.all([getDictDataApi(8), getTaxRateListApi(), getCurrenciesListApi(), getAirLineList()]).then(results => {
        const unitRes = results[0]
        const taxRateRes = results[1]
        const currencyRes = results[2]
        const productAirlineRes = results[3]

        if (unitRes.ok) {
          let unit = [];
          unitRes.content.forEach(v => {
            if (v.code === 1101 || v.code === 2004) {
              unit.push(v)
            }
          })
          this.unitList = unit
        }
        if (taxRateRes.ok) {
          this.taxRateList = taxRateRes.content
        }
        if (currencyRes.ok) {
          this.currencyList = currencyRes.content
        }
        if (productAirlineRes.ok) {
          this.productAirlineNameList = productAirlineRes.content
        }
      })

    },
    deleteFn (index) {
      this.makingCargoMode.chargeForm.charges.splice(index, 1)
    },
    addFn () {
      this.makingCargoMode.chargeForm.charges.unshift({
        "currency": "CNY"
      })
    },
    selectedFee (charge, index) {
      let item = this.makingCargoMode.chargeForm.charges[index]
      item.feeItemName = charge.chineseName
      item.feeItemCode = charge.code
      this.$set(this.makingCargoMode.chargeForm.charges, index, item)
    },
    // 上传托书
    uploadFile () {
      if (!this.canBeUpload) {
        this.$message({
          type: 'warning',
          message: '请选择一个文件'
        })
        return false
      }
      this.loading = true
      this.$refs.excelUpload.submit()
    },
    uploadSuccess (res) {
      this.loading = false
      this.canBeUpload = false
      // res.content.name = res.content.originFileName
      // this.makingCargoMode.fileList.push(res)
      this.makingCargoMode.fileList = res
    },
    uploadError (message) {
      this.loading = false
      this.$message({
        type: 'error',
        message: message
      })
      this.clearUploadFiles()
      this.canBeUpload = false
    },

    setUploadStatus (val) {
      this.canBeUpload = val
    },
    removeFile (file) {
      // cloudFileName
      let index = this.makingCargoMode.fileList.findIndex(item => item.uid === file.uid || item.cloudFileName === file.cloudFileName)
      if (index !== -1) {
        this.makingCargoMode.fileList.splice(index, 1)
      }
    },
    async onPreview (file) {
      const jpg = ["jpg", "jpeg", "png", "JPG", "JPEG", "PNG"]
      let cloudFileName, url
      if (file.url) {
        cloudFileName = file.cloudFileName
        url = file.url
      } else {
        if (file.id) {
          this.downloadElectronicFile(file)
          return
        }
      }
      const fileSuffix = cloudFileName.substring(cloudFileName.lastIndexOf(".") + 1)
      if (jpg.indexOf(fileSuffix) > -1) {
        // 是图片
        this.filepaths = []
        this.fileimageShow = true
        this.filepaths.push(url)
      } else {
        window.open(url)
      }
    },
    fileimageClose () {
      this.fileimageShow = false
    }
  }
}
</script>

<style scoped lang="less">
.app {
  width: 100%;

  // min-width: 1450px;
}

.app-main-inner {
  width: 100%;
  background: #f5f7fa;
}

.page-form {
  width: 100%;
  // max-width: 1200px;
  padding: 20px 10px;
  background: #f5f7fa;
}

.form-module-title {
  margin-left: 10px;
  font-size: 15px;
  margin-bottom: 10px;
  display: block;
  color: #1890ff;
  padding-left: 10px;
  border-left: 2px solid #1890ff;
  height: 28px;
  line-height: 28px;
}

.form-module-item {
  overflow: hidden;
  padding: 20px 20px 15px 20px;
  background: #fff;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px 0 #efefef, 0 0 6px 0 #efefef;

  .item {
    width: 25%;
    float: left;
    padding: 0 20px;
    margin-bottom: 10px;

    label {
      font-size: 14px;
      margin-right: 20px;
    }

    span {
      font-size: 12px;
    }
  }


  ::v-deep .el-form-item {
    width: 25%;
    float: left;
    padding: 0 20px;
    min-height: 37px;
  }

  ::v-deep .el-select {
    width: 100%;
  }

  ::v-deep .el-form-item__label {
    text-align: right;
  }
}

.charge-list-data {
  margin: 20px 0;
}

.operation-btn {
  padding: 20px;
  text-align: right;
  background: #fff;
}

.order-btn {
  margin-left: 12px;
}

.shipping-info .item label {
  display: block;
  margin-bottom: 8px;
}

.shipping-info .item span {
  display: inline-block;
  min-height: 200px;
  width: 100%;
  border-radius: 5px;

  ::v-deep .el-textarea.is-disabled .el-textarea__inner {
    background-color: #fff;
    font-size: 12px;
    color: #000;
  }
}

.dialog-footer {
  text-align: center;
}

.order-air-item {
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px 0 #eee, 0 0 6px 0 #eee;
  margin-bottom: 20px;
  margin: 10px;

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

.shippingSpaceForm {
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
