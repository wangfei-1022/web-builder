<template>
  <div class="app" v-loading="loading">
    <div>
      <div class="form-module-title ">
        <span>{{ $t('air.packageDeliveryPlan') }}</span>
      </div>
      <div class="form-module-item">
        <div class="item">
          <label>{{ $t('air.planNo') }}</label>
          <span>{{ confirmationDetail.planNo }}</span>
        </div>
        <div class="item">
          <label>{{ $t('air.requester') }} </label>
          <span> {{ confirmationDetail.customerName }}</span>
        </div>
        <div class="item">
          <label>{{ $t('air.timeliness') }} </label>
          <span> {{ confirmationDetail.timeliness }}</span>
        </div>
        <div class="item">
          <label>{{ $t('air.etd') }}</label>
          <span> {{ confirmationDetail.etd2 }} ({{ confirmationDetail.etdDayWeek }}) </span>
        </div>
        <div class="item">
          <label>{{ $t('air.orderQuantity') }}</label>
          <span> {{ confirmationDetail.orderQuantity }}</span>
        </div>
        <div class="item">
          <label>{{ $t('air.orderGrossWeight') }}</label>
          <span>{{ confirmationDetail.orderGrossWeight }} KGS</span>
        </div>

        <div class="item">
          <label> {{ $t('air.orderVolume') }}</label>
          <span> {{ confirmationDetail.orderVolume }} CBM</span>
        </div>
        <div class="item">
          <label>{{ $t('air.entrustedChargingWeight') }} </label>
          <span>{{ confirmationDetail.orderChargeableWeight }} M/T</span>
        </div>
        <div class="item">
          <label> {{ $t('air.pol') }} </label>
          <span>{{ confirmationDetail.pol }} / {{ confirmationDetail.polCode }} </span>
        </div>
        <div class="item">
          <label> {{ $t('air.pod2') }} </label>
          <span> {{ confirmationDetail.pod }} / {{ confirmationDetail.podCode }}</span>
        </div>
        <div class="item">
          <label> {{ $t('air.receipt') }} </label>
          <span> {{ confirmationDetail.receipt }} / {{ confirmationDetail.receiptCode }}</span>
        </div>
        <div class="item">
          <label> {{ $t('air.remarks') }} </label>
          <span style="color:red"> {{ confirmationDetail.bookingRemark }}</span>
        </div>

      </div>
      <div style="margin-bottom: 20px;">
        <el-button size="mini" type="primary" @click="addTab(editableTabsValue)" style="margin-left:10px">
          {{ $t('air.addOrder') }}
        </el-button>
      </div>

      <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="clickTab">
        <el-tab-pane v-for="(item) in editableTabs" :key="item.name" :label="item.title" :name="item.name">
          <el-form ref="orderForm" :model="item.order" :rules="orderRules" label-width="95px" label-position="left"
            class="page-form">
            <!-- 订单信息 -->
            <div class="form-module-title">{{ $t('air.orderInformation') }}</div>
            <div class="form-module-item">
              <!-- 委托件数 -->
              <el-form-item :label="$t('air.orderQuantity')" prop="orderQuantity">
                <el-input v-model="item.order.orderQuantity" class="job-no-input" size="mini" :disabled="editStatus(item)"
                  v-input-limit="[-10, 4]" @change="calcFn()" />
              </el-form-item>
              <!-- 委托毛重 -->
              <el-form-item :label="$t('air.orderGrossWeight')" prop="orderGrossWeight">
                <el-input v-model="item.order.orderGrossWeight" class="job-no-input" size="mini"
                  :disabled="editStatus(item)" v-input-limit="[-10, 4]" @change="calcFn()">
                  <template slot="append">KGS</template>
                </el-input>
              </el-form-item>
              <!-- 委托体积 -->
              <el-form-item :label="$t('air.orderVolume')" prop="orderVolume">
                <el-input v-model="item.order.orderVolume" :disabled="editStatus(item)" class="job-no-input" size="mini"
                  v-input-limit="[-10, 4]" @change="calcFn()">
                  <template slot="append">CBM</template>
                </el-input>
              </el-form-item>
              <!-- 委托计费重 -->
              <el-form-item :label="$t('air.entrustedChargingWeight')" prop="orderChargeableWeight">
                <el-input v-model="item.order.orderChargeableWeight" disabled class="job-no-input" size="mini"
                  v-input-limit="[-10, 4]" />
              </el-form-item>

              <!-- 装货港 -->
              <el-form-item :label="$t('air.pol')" prop="polCode">
                <el-row>
                  <el-col :span="10">
                    <type-select v-model="item.order.polCode" type="airport" :disabled="editStatus(item)"
                      @selected="selectedPol" />
                  </el-col>
                  <el-col :span="14" style="padding-left: 10px;">
                    <el-input v-model="item.order.pol" class="job-no-input" size="mini" disabled />
                  </el-col>
                </el-row>
              </el-form-item>
              <!-- 中转港 -->
              <el-form-item :label="$t('air.transitPort')" prop="potCode">
                <el-row>
                  <el-col :span="10">
                    <type-select v-model="item.order.potCode" :disabled="editStatus(item)" type="airport"
                      @selected="selectedPot" />
                  </el-col>
                  <el-col :span="14" style="padding-left: 10px;">
                    <el-input v-model="item.order.pot" class="job-no-input" size="mini" disabled />
                  </el-col>
                </el-row>
              </el-form-item>
              <!-- 目的地 -->
              <el-form-item :label="$t('air.pod2')" prop="podCode">
                <el-row>
                  <el-col :span="10">
                    <type-select v-model="item.order.podCode" :disabled="editStatus(item)" type="airport"
                      @selected="selectedPod" />
                  </el-col>
                  <el-col :span="14" style="padding-left: 10px;">
                    <el-input v-model="item.order.pod" class="job-no-input" size="mini" disabled />
                  </el-col>
                </el-row>
              </el-form-item>
              <!-- 交货地 -->
              <el-form-item :label="$t('air.receipt')" prop="receiptCode">
                <el-row>
                  <el-col :span="10">
                    <type-select v-model="item.order.receiptCode" :disabled="editStatus(item)" type="airport"
                      @selected="selectedRec" />
                  </el-col>
                  <el-col :span="14" style="padding-left: 10px;">
                    <el-input v-model="item.order.receipt" class="job-no-input" size="mini" disabled />
                  </el-col>
                </el-row>
              </el-form-item>
            </div>

            <!-- 舱位信息 -->
            <div class="form-module-title">{{ $t('air.shippingSpecialist') }}</div>
            <div class="form-module-item">
              <!-- 舱位类型 -->
              <el-form-item :label="$t('air.shippingSpaceTypeDesc')" prop="shippingSpaceType">
                <el-select v-model="item.order.shippingSpaceType" :disabled="editStatus(item)"
                  :placeholder="$t('air.placeholder')" size="mini">
                  <el-option :label="$t('air.ownShippingSpace')" :value="2"></el-option>
                  <el-option :label="$t('air.agentShippingSpace')" :value="3"></el-option>
                </el-select>
              </el-form-item>
              <!-- 产品航线 -->
              <el-form-item :label="$t('air.productLine')" prop="productAirlineId" size="mini"
                :rules="[{ required: Number(item.order.shippingSpaceType) === 2, message: $t('air.requiredProductAirLine'), trigger: 'change' }]">
                <el-select filterable clearable v-model="item.order.productAirlineId" :placeholder="$t('air.placeholder')"
                  @change="selectProductAirLine" :disabled="editStatus(item)">
                  <el-option v-for="(item, index) in productAirlineNameList" :label="item.productName" :value="item.id"
                    :key="index">
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- 航空公司 -->
              <el-form-item :label="$t('air.airlineName')" prop="airlineId"
                :rules="[{ required: Number(item.order.shippingSpaceType) === 2, message: $t('air.requiredAirline'), trigger: 'change' }]">
                <!-- <cargo-limited-select :disabled="editStatus(item)" :placeholder="$t('air.placeholder')"
                  :method="airCustomerMethod" :select-label="item.order.airlineName"
                  :select-value="item.order.airlineId" type="customer" style="width: 100%;" @set="setAirCustomerInfo" /> -->

                <type-select :placeholder="$t('air.placeholder')" v-model="item.order.airlineName" type="airLine"
                  style="width: 100%;" @selected="setAirCustomerInfo" :disabled="editStatus(item)" />
              </el-form-item>
              <!-- 订舱代理 -->
              <el-form-item :label="$t('air.bookingAgentPort')" prop="bookingAgentId"
                :rules="[{ required: Number(item.order.shippingSpaceType) === 3, message: $t('air.requiredBookingAgentPort'), trigger: 'change' }]">
                <!-- <cargo-limited-select :disabled="editStatus(item)" :select-label="item.order.bookingAgentName"
                  :select-value="item.order.bookingAgentId" :method-params="{ range: ['b_booking_agent'] }"
                  type="customer" style="width: 100%;" @set="setBookingAgentInfo" /> -->

                <type-select :disabled="editStatus(item)" v-model="item.order.bookingAgentName" type="supplier"
                  style="width: 100%;" :request-params="{ 'partnerRole': 14014, 'businessType': 'AIR_EXPORT' }"
                  @selected="setBookingAgentInfo" />
              </el-form-item>
              <!-- 航班时间 -->
              <el-form-item :label="$t('air.etd')" prop="etd">
                <CommonPicker :disabled="editStatus(item)" v-model="item.order.etd" pikcer-type="datetime"
                  pickerFormat="yyyy-MM-dd HH:mm" size="mini" />
              </el-form-item>
              <!-- 订舱备注 -->
              <el-form-item :label="$t('air.productNote')" style="width: 75%;">
                <el-input :disabled="editStatus(item)" v-model="item.order.productRemark" class="job-no-input" size="mini"
                  type="textarea" rows="3" />
              </el-form-item>
            </div>
          </el-form>

          <!-- 产品成本 -->
          <div class="form-module-title">{{ $t('air.productCosts') }}</div>

          <div class="company" style="margin: 10px;">
            <el-form label-width="95px" label-position="left">
              <el-row>
                <el-col :span="6">
                  <el-form-item :label="$t('air.associatedCostPrice')" prop="associatedCostPrice">
                    <el-input v-model="item.order.associatedCostPrice" :disabled="editStatus(item)" class="job-no-input"
                      size="mini" v-input-limit="[-10, 4]" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>

          <el-form ref="chargeForm" class="order-air-item" :model="item.order.chargeForm" label-position="left">
            <el-table size="mini" :border="true" :data="item.order.chargeForm.charges" style="width: 100%; " row-key="id">
              <el-table-column prop="feeItemName" :label="$t('receiveFms.charge_name')">
                <template slot-scope="{row, $index}">
                  <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
                    :prop="`charges[${$index}].feeItemName`">
                    <!-- :method="dmnBusinessApi" -->
                    <type-select v-model="row.feeItemName" type="businessFee" :disabled="editStatus(item)"
                      :requestParams="{ businessTypeCode: 'AIR_EXPORT' }" @selected="selectedFee($event, $index)" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="unitName1" :label="$t('receiveFms.unit_name')">
                <template slot-scope="{row, $index}">
                  <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
                    :prop="`charges[${$index}].unit1`">
                    <el-select v-model="row.unit1" size="mini" :disabled="editStatus(item)">
                      <el-option v-for="(item, index) in unitList" :key="index" :label="item.name" :value="item.code" />
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="currency" :label="$t('receiveFms.currency')">
                <template slot-scope="{row, $index}">
                  <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
                    :prop="`charges[${$index}].currency`">
                    <el-select v-model="row.currency" size="mini" :disabled="editStatus(item)">
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
                    <el-input v-model="row.price" size="mini" v-input-limit="[-9, 2]"
                      :disabled="editStatus(item)"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="remark" :label="$t('air.remark')">
                <template slot-scope="{row, $index}">
                  <el-form-item :prop="`charges[${$index}].remark`">
                    <el-input v-model='row.remark' size="mini" :disabled="editStatus(item)"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>


              <el-table-column prop="oper" :label="$t('receiveFms.operation')" width="60">
                <template slot-scope="{$index }">
                  <i class="iconfont icon-minus-circle"
                    v-if="item.order.chargeForm.charges.length > 1 && !editStatus(item)" @click="deleteFn($index)"></i>
                  <i class="iconfont icon-add-circle" v-if="$index === 0 && !editStatus(item)" @click="addFn($index)"></i>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <div class="operation-btn">
        <el-button type="primary" @click="addOrder">{{ $t('air.save') }}</el-button>
        <el-button @click="cancel">{{ $t('air.cancel') }}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { getAirLineList, getAirConfirmationManagementDetail, getAirConfirmationManagementAffirm, getAirConfirmationManagementDel, getAirOrderChargeableWeight } from '@/api/airExport'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'
import { airLineListApi, airportListApi } from '@/api/common'
import { getDictDataApi } from '@/api/fmsReceiveAir'
import {
  getCustomerDropDownListApi, getTaxRateListApi
} from '@/api/common'
import { getCurrenciesListApi } from "@/api/common"
import { getYHTListApi } from '@/api/partner/base'

import { parseTime } from '@/utils/index'

export default {
  name: 'AirOrderConfirmation',
  components: {
    cargoLimitedSelect
  },

  data () {
    const defaultEditableTabs = [{
      title: this.$t('air.order') + ' 1',
      name: '1',
      order: {
        orderGrossWeight: '', // 委托毛重
        orderQuantity: '', // 委托件数
        orderVolume: '', // 委托体积
        orderChargeableWeight: "",

        pod: '', // 卸货港/pod描述
        podCode: '', // 卸货港/pod代码
        pol: '', // 起运港描述
        polCode: '', // 起运港代码
        receipt: '', // 交货地
        receiptCode: '', // 交货地代码
        potCode: "",
        pot: "",

        shippingSpaceType: '', // 舱位类型;1-统配;2-自由舱位;3-代理舱位
        airlineId: '', // 航空公司Id
        airlineName: '', // 航空公司名称
        airlineScacCode: '', // 航空公司Code
        bookingAgentId: '', // 订舱代理id
        bookingAgentName: '', // 订舱代理名称
        productRemark: '', // 产品备注
        productAirlineName: "", // 产品航线名称
        productAirlineId: "", // 产品航线id
        etd: "", // 航班日期

        associatedCostPrice: "", // 关联成本价

        chargeForm: {
          charges: [{
            "currency": "CNY",
            "unit1": 1101,
            "feeItemName": this.$t('air.airFreight'),
            "feeItemCode": "AF"
          }, {
            "currency": "CNY",
            "unit1": 2004,
            "feeItemName": this.$t('air.documentCharge'),
            "feeItemCode": "DOC"
          }, {
            "currency": "CNY",
            "unit1": 2004,
            "feeItemName": this.$t('air.CustomsTransmissionServiceCharge'),
            "feeItemCode": "OEDI"
          }]
        }
      }
    }];
    return {
      defaultEditableTabs: defaultEditableTabs,
      loading: false,
      unitList: [],
      currencyList: [],
      airCustomerMethod: airLineListApi,
      productAirlineNameList: [],
      inboundVisible: false,
      confirmationDetail: {
        orderGrossWeight: 0, // 委托毛重
        orderQuantity: 0, // 委托件数
        orderVolume: 0 // 委托体积
      },
      editableTabsValue: '1',
      editableTabs: [{
        title: this.$t('air.order') + ' 1',
        name: '1',
        order: {
          orderGrossWeight: '', // 委托毛重
          orderQuantity: '', // 委托件数
          orderVolume: '', // 委托体积
          orderChargeableWeight: "",

          pod: '', // 卸货港/pod描述
          podCode: '', // 卸货港/pod代码
          pol: '', // 起运港描述
          polCode: '', // 起运港代码
          receipt: '', // 交货地
          receiptCode: '', // 交货地代码
          potCode: "",
          pot: "",

          shippingSpaceType: '', // 舱位类型;1-统配;2-自由舱位;3-代理舱位
          airlineId: '', // 航空公司Id
          airlineName: '', // 航空公司名称
          airlineScacCode: '', // 航空公司Code
          bookingAgentId: '', // 订舱代理id
          bookingAgentName: '', // 订舱代理名称
          productRemark: '', // 产品备注
          productAirlineName: "", // 产品航线名称
          productAirlineId: "", // 产品航线id
          etd: "", // 航班日期

          associatedCostPrice: "", // 关联成本价

          chargeForm: {
            charges: [{}]
          }
        }
      }],
      tabIndex: 1,
      orderRules: {

        "orderQuantity": [{ required: true, message: this.$t('air.requiredOrderQuantity'), trigger: 'blur' }],
        "orderGrossWeight": [{ required: true, message: this.$t('air.requiredOrderGrossWeight'), trigger: 'blur' }],
        "orderVolume": [{ required: true, message: this.$t('air.requiredOrderVolume'), trigger: 'blur' }],
        "orderChargeableWeight": [{ required: true, message: this.$t('air.pleaseEnter'), trigger: 'blur' }],
        "polCode": [{ required: true, message: this.$t('air.requiredPol'), trigger: 'blur' }],
        "podCode": [{ required: true, message: this.$t('air.requiredPod'), trigger: 'blur' }],
        "shippingSpaceType": [{ required: true, message: this.$t('air.requiredShippingSpaceType'), trigger: 'blur' }],
        "etd": [{ required: true, message: this.$t('air.requiredEtd'), trigger: 'blur' }]
      }
    }
  },
  watch: {
  },

  created () {

    this.loading = true
    getAirConfirmationManagementDetail(this.$route.query.id).then(res => {
      this.loading = false
      this.confirmationDetail = res.content
      this.editableTabs = []
      if (res.content.airBagOrderDTOList.length > 0) {
        res.content.airBagOrderDTOList.forEach((element, index) => {
          this.tabIndex = index + 1
          let editableTab = {
            title: element.orderNo,
            name: index + 1 + "",
            order: element
          }
          if (element.airOrderExportChargeDtoList.length > 0) {
            editableTab.order.chargeForm = {
              charges: element.airOrderExportChargeDtoList
            }
          } else {
            editableTab.order.chargeForm = {
              charges: [{
                "currency": "CNY",
                "unit1": 1101,
                "feeItemName": this.$t('air.airFreight'),
                "feeItemCode": "AF"
              }, {
                "currency": "CNY",
                "unit1": 2004,
                "feeItemName": this.$t('air.documentCharge'),
                "feeItemCode": "DOC"
              }, {
                "currency": "CNY",
                "unit1": 2004,
                "feeItemName": this.$t('air.CustomsTransmissionServiceCharge'),
                "feeItemCode": "OEDI"
              }]
            }
          }

          this.editableTabs.push(editableTab)

        });
      } else {
        this.editableTabs = this.defaultEditableTabs
        this.editableTabs[0].order.orderGrossWeight = res.content.orderGrossWeight
        this.editableTabs[0].order.orderQuantity = res.content.orderQuantity
        this.editableTabs[0].order.orderVolume = res.content.orderVolume
        this.editableTabs[0].order.pod = res.content.pod
        this.editableTabs[0].order.podCode = res.content.podCode
        this.editableTabs[0].order.pol = res.content.pol
        this.editableTabs[0].order.polCode = res.content.polCode
        this.editableTabs[0].order.receipt = res.content.receipt
        this.editableTabs[0].order.receiptCode = res.content.receiptCode
        this.editableTabs[0].order.potCode = res.content.potCode
        this.editableTabs[0].order.pot = res.content.pot
        this.editableTabs[0].order.etd = res.content.etd
        console.log(111, res.content.etd)
        if (res.content.orderGrossWeight && res.content.orderVolume) {
          getAirOrderChargeableWeight({
            orderGrossWeight: res.content.orderGrossWeight,
            orderVolume: res.content.orderVolume
          }).then(chargeableWeightRes => {
            if (chargeableWeightRes && chargeableWeightRes.ok) {
              this.editableTabs[0].order.orderChargeableWeight = chargeableWeightRes.content
            }
          })
        } else {
          this.editableTabs[0].order.orderChargeableWeight = 0
          // this.editableTabs = this.defaultEditableTabs
          // this.editableTabs[0].order.orderGrossWeight = res.content.orderGrossWeight
          // this.editableTabs[0].order.orderQuantity = res.content.orderQuantity
          // this.editableTabs[0].order.orderVolume = res.content.orderVolume
          // this.editableTabs[0].order.pod = res.content.pod
          // this.editableTabs[0].order.podCode = res.content.podCode
          // this.editableTabs[0].order.pol = res.content.pol
          // this.editableTabs[0].order.polCode = res.content.polCode
          // this.editableTabs[0].order.receipt = res.content.receipt
          // this.editableTabs[0].order.receiptCode = res.content.receiptCode
          // this.editableTabs[0].order.potCode = res.content.potCode
          // this.editableTabs[0].order.pot = res.content.pot
        }


      }

      try {
        res.content.etd2 = parseTime(res.content.etd, '{y}-{m}-{d} {h}:{i}')
      } catch (e) {
        console.log(e)
      }
    })
    this.init()
  },

  methods: {
    // 订单状态为 5 【待配舱】10【待外配】 30 【待入仓】40 【待起飞】时允许用户对订单进行修改
    editStatus (item) {
      if (item.order.orderState) {
        if (item.order.orderState === 5 || item.order.orderState === 10 || item.order.orderState === 30 || item.order.orderState === 40) {
          return false
        } else {
          return true
        }
      }
      return false

    },
    // 计算计费重
    calcFn () {
      let activeName = this.editableTabsValue;
      let obj = this.editableTabs.findIndex(item => item.name === activeName)
      console.log(this.editableTabs[obj].order.orderGrossWeight, this.editableTabs[obj].order.orderQuantity, this.editableTabs[obj].order.orderVolume)

      if (this.editableTabs[obj].order.orderGrossWeight && this.editableTabs[obj].order.orderVolume) {
        getAirOrderChargeableWeight({
          orderGrossWeight: this.editableTabs[obj].order.orderGrossWeight,
          orderVolume: this.editableTabs[obj].order.orderVolume
        }).then(res => {
          if (res && res.ok) {
            this.editableTabs[obj].order.orderChargeableWeight = res.content
          }
        })
      }
    },
    checkWQV () {
      let orderGrossWeightSum = 0 // 委托毛重
      let orderQuantitySum = 0 // 委托件数
      let orderVolumeSum = 0 // 委托体积
      this.editableTabs.forEach(function (v) {
        let orderGrossWeight = Number(v.order.orderGrossWeight) || 0
        let orderQuantity = Number(v.order.orderQuantity) || 0
        let orderVolume = Number(v.order.orderVolume) || 0
        orderGrossWeightSum += orderGrossWeight
        orderQuantitySum += orderQuantity
        orderVolumeSum += orderVolume
      })

      if (orderGrossWeightSum > this.confirmationDetail.orderGrossWeight || orderQuantitySum > this.confirmationDetail.orderQuantity || orderVolumeSum > this.confirmationDetail.orderVolume) {
        return true
      }
    },
    addTab () {
      if (this.checkWQV()) {
        this.$message.warning(this.$t('air.addWQVWarming'))
        return
      }
      // 计算出运计划件毛体剩下值
      let orderGrossWeightSum = 0 // 委托毛重
      let orderQuantitySum = 0 // 委托件数
      let orderVolumeSum = 0 // 委托体积
      this.editableTabs.forEach(function (v) {
        let orderGrossWeight = Number(v.order.orderGrossWeight) || 0
        let orderQuantity = Number(v.order.orderQuantity) || 0
        let orderVolume = Number(v.order.orderVolume) || 0
        orderGrossWeightSum += orderGrossWeight
        orderQuantitySum += orderQuantity
        orderVolumeSum += orderVolume
      })
      let orderGrossWeightRest = (this.confirmationDetail.orderGrossWeight - orderGrossWeightSum).toFixed(3)
      let orderQuantityRest = this.confirmationDetail.orderQuantity - orderQuantitySum
      let orderVolumeRest = (this.confirmationDetail.orderVolume - orderVolumeSum).toFixed(3)

      if (orderGrossWeightRest === 0 || orderQuantityRest === 0 || orderVolumeRest === 0) {
        this.$message.warning(this.$t('air.addWQVWarming'))
        return
      }

      let newTabName = ++this.tabIndex + '';
      let orderChargeableWeight = 0

      let editableTabsAdd = {
        title: this.$t('air.order') + this.tabIndex,
        name: newTabName,
        order: {
          orderGrossWeight: orderGrossWeightRest, // 委托毛重
          orderQuantity: orderQuantityRest, // 委托件数
          orderVolume: orderVolumeRest, // 委托体积
          orderChargeableWeight: orderChargeableWeight,

          pod: this.confirmationDetail.pod, // 卸货港/pod描述
          podCode: this.confirmationDetail.podCode, // 卸货港/pod代码
          pol: this.confirmationDetail.pol, // 起运港描述
          polCode: this.confirmationDetail.polCode, // 起运港代码
          receipt: this.confirmationDetail.receipt, // 交货地
          receiptCode: this.confirmationDetail.receiptCode, // 交货地代码
          potCode: this.confirmationDetail.potCode,
          pot: this.confirmationDetail.pot,

          shippingSpaceType: '', // 舱位类型;1-统配;2-自由舱位;3-代理舱位
          airlineId: '', // 航空公司Id
          airlineName: '', // 航空公司名称
          airlineScacCode: '', // 航空公司Code
          bookingAgentId: '', // 订舱代理id
          bookingAgentName: '', // 订舱代理名称
          productRemark: '', // 产品备注
          productAirlineName: "", // 产品航线名称
          productAirlineId: "", // 产品航线id
          etd: this.confirmationDetail.etd, // 航班日期

          associatedCostPrice: "", // 关联成本价
          chargeForm: {
            charges: [{
              "currency": "CNY",
              "unit1": 1101,
              "feeItemName": this.$t('air.airFreight'),
              "feeItemCode": "AF"
            }, {
              "currency": "CNY",
              "unit1": 2004,
              "feeItemName": this.$t('air.documentCharge'),
              "feeItemCode": "DOC"
            }, {
              "currency": "CNY",
              "unit1": 2004,
              "feeItemName": this.$t('air.CustomsTransmissionServiceCharge'),
              "feeItemCode": "OEDI"
            }]
          }
        }
      }
      console.log(111, this.confirmationDetail.etd)
      if (orderGrossWeightRest && orderVolumeRest) {
        //  计算计费重
        getAirOrderChargeableWeight({
          orderGrossWeight: orderGrossWeightRest,
          orderVolume: orderVolumeRest
        }).then(res => {
          if (res && res.ok) {
            orderChargeableWeight = res.content
            editableTabsAdd.order.orderChargeableWeight = orderChargeableWeight
            this.editableTabs.push(editableTabsAdd);
            this.editableTabsValue = newTabName;
          }
        })
      } else {
        this.editableTabs.push(editableTabsAdd);
        this.editableTabsValue = newTabName;
      }

    },
    removeTab (targetName) {
      this.loading = true

      let flagState = false
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {

          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      let obj = this.editableTabs.findIndex(item => item.name === targetName)
      // 只允许删除订单状态为【待配舱】的订单业务
      if (tabs[obj].order.orderState && tabs[obj].order.orderState !== 5) {
        flagState = true
      }
      if (flagState) {
        this.$message.warning(this.$t('air.delBagPlanWarming'))
        this.loading = false
        return
      }
      if (tabs[obj].order.id) {
        getAirConfirmationManagementDel({
          id: this.$route.query.id,
          orderId: tabs[obj].order.id
        }).then(res => {
          if (res && res.ok) {
            this.$message.success(this.$t("air.successfullyDeleted"));
            this.editableTabsValue = activeName;
            this.editableTabs = tabs.filter(tab => tab.name !== targetName);
          }
          this.loading = false
        })
      } else {
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        this.loading = false
      }
    },
    clickTab (targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
    },
    // 保存
    addOrder () {
      this.loading = true
      let flag = false
      if (this.editableTabs.length === 0) {

        this.$message.warning(this.$t('air.informationIsNotCompletePleaseImprove'))
        this.loading = false
        return

      }
      this.editableTabs.forEach(function (v) {
        if (!v.order.orderGrossWeight || !v.order.orderQuantity || !v.order.orderVolume || !v.order.orderChargeableWeight) {
          flag = true
        }
        if (!v.order.pol || !v.order.polCode || !v.order.podCode || !v.order.pod || !v.order.shippingSpaceType || !v.order.etd) {
          flag = true
        }
        if (Number(v.order.shippingSpaceType) === 2) {
          if (!v.order.productAirlineId || !v.order.airlineId) {
            flag = true
          }
        } else if (Number(v.order.shippingSpaceType) === 3) {
          if (!v.order.bookingAgentId) {
            flag = true
          }
        }
        v.order.chargeForm.charges.forEach(item => {
          if (!item.feeItemName || !item.feeItemCode || !item.unit1 || !item.currency || !item.price) {
            flag = true
          }
        });

      })
      if (flag) {
        this.$message.warning(this.$t('air.informationIsNotCompletePleaseImprove'))
        this.loading = false
        return
      }
      if (this.checkWQV()) {
        this.$message.warning(this.$t('air.saveWQVWarming'))
        this.loading = false
        return
      }

      let airBagOrderDTOList = []
      this.editableTabs.forEach(element => {
        element.order.airOrderExportChargeDtoList = element.order.chargeForm.charges
        airBagOrderDTOList.push(element.order)
      });

      getAirConfirmationManagementAffirm({
        bagPlanId: this.$route.query.id,
        airBagOrderDTOList: airBagOrderDTOList
      }).then(res => {
        if (res && res.ok) {
          this.$message.success(this.$t("air.successSaved"));
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
    backList () {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: `AirConfirmationManagement` })
    },
    init () {
      Promise.all([getDictDataApi(8), getTaxRateListApi(), getCurrenciesListApi(), getAirLineList()]).then(results => {
        let activeName = this.editableTabsValue;
        // let obj = this.editableTabs.findIndex(item => item.name == activeName)

        const unitRes = results[0]
        const taxRateRes = results[1]
        const currencyRes = results[2]
        const airLineListRes = results[3]

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

          // this.editableTabs[obj].order.chargeForm.charges = [{
          //   "currency": "CNY",
          //   "unit1": 1101,
          //   "feeItemName": this.$t('air.airFreight'),
          //   "feeItemCode": "AF"
          // }, {
          //   "currency": "CNY",
          //   "unit1": 2004,
          //   "feeItemName": this.$t('air.documentCharge'),
          //   "feeItemCode": "DOC"
          // }, {
          //   "currency": "CNY",
          //   "unit1": 2004,
          //   "feeItemName": this.$t('air.CustomsTransmissionServiceCharge'),
          //   "feeItemCode": "OEDI"
          // }]

        }
        // 产品航线列表
        if (airLineListRes.ok) {
          this.productAirlineNameList = airLineListRes.content
        }
      })

    },
    deleteFn (index) {
      let activeName = this.editableTabsValue;
      let obj = this.editableTabs.findIndex(item => item.name === activeName)
      this.editableTabs[obj].order.chargeForm.charges.splice(index, 1)
    },
    addFn () {
      let activeName = this.editableTabsValue;
      let obj = this.editableTabs.findIndex(item => item.name === activeName)
      this.editableTabs[obj].order.chargeForm.charges.unshift({
        "currency": "CNY"
      })
    },
    selectedFee (charge, index) {
      let activeName = this.editableTabsValue;
      let obj = this.editableTabs.findIndex(item => item.name === activeName)
      let item = this.editableTabs[obj].order.chargeForm.charges[index]
      item.feeItemName = charge.chineseName
      item.feeItemCode = charge.code
      this.$set(this.editableTabs[obj].order.chargeForm.charges, index, item)
    },
    selectProductAirLine (airLineId) {
      if (this.$isEmpty(airLineId)) {
        return
      }
      let activeName = this.editableTabsValue;
      let obj = this.editableTabs.findIndex(item => item.name === activeName)
      let airLine = this.productAirlineNameList.find(item => item.id === airLineId).productName
      this.editableTabs[obj].order.productAirlineName = airLine
      // 用户选择的产品航线为【CZ包板-PVG-AMS】时，CZ为跟航司code匹配；PVG为装货港三字码，AMS为卸货港三字码
      if (airLine) {
        let list = airLine.split("-");
        console.log(list[0], list[1], list[2])

        // 航空公司 正则中文去除
        airLineListApi({
          "code": list[0].replace(/[\u4e00-\u9fa5]/g, "")
        }).then(res => {
          // 航空公司
          this.editableTabs[obj].order.airlineId = res.content.list[0].id
          this.editableTabs[obj].order.airlineName = res.content.list[0].chineseName
          this.editableTabs[obj].order.airlineScacCode = res.content.list[0].scacCode
        })
        // 装货港
        airportListApi({
          "code": list[1]
        }).then(res => {
          this.editableTabs[obj].order.polCode = res.content.list[0].code3 // 装货港
          this.editableTabs[obj].order.pol = res.content.list[0].englishName // 装货港
        })
        // 卸货港
        airportListApi({
          "code": list[2]
        }).then(res => {
          this.editableTabs[obj].order.podCode = res.content.list[0].code3 // 卸货港
          this.editableTabs[obj].order.pod = res.content.list[0].englishName // 卸货港

          this.editableTabs[obj].order.receiptCode = res.content.list[0].code3 // 交货地
          this.editableTabs[obj].order.receipt = res.content.list[0].englishName // 交货地

        })

      }

    },
    setAirCustomerInfo (customer) {
      let activeName = this.editableTabsValue;
      let obj = this.editableTabs.findIndex(item => item.name === activeName)
      // 航空公司 正则中文去除
      this.editableTabs[obj].order.airlineId = customer.id
      this.editableTabs[obj].order.airlineName = customer.chineseName
      this.editableTabs[obj].order.airlineScacCode = customer.scacCode
      console.log(556, this.editableTabs[obj])
    },
    setBookingAgentInfo (customer) {
      let activeName = this.editableTabsValue;
      let obj = this.editableTabs.findIndex(item => item.name === activeName)
      this.editableTabs[obj].order.bookingAgentName = customer.chineseName
      this.editableTabs[obj].order.bookingAgentId = customer.id
    },
    // 收货地
    selectedRec (port) {
      let activeName = this.editableTabsValue;
      let obj = this.editableTabs.findIndex(item => item.name === activeName)
      this.editableTabs[obj].order.receipt = port.englishName
    },
    // 交货港
    selectedDelivery (port) {
      let activeName = this.editableTabsValue;
      let obj = this.editableTabs.findIndex(item => item.name === activeName)
      this.editableTabs[obj].order.delivery = port.englishName
    },

    selectedPol (port) {
      let activeName = this.editableTabsValue;
      let obj = this.editableTabs.findIndex(item => item.name === activeName)
      this.editableTabs[obj].order.pol = port.englishName
    },
    selectedPod (port) {
      let activeName = this.editableTabsValue;
      let obj = this.editableTabs.findIndex(item => item.name === activeName)
      this.editableTabs[obj].order.pod = port.englishName

      if (!this.editableTabs[obj].order.receiptCode) {
        this.editableTabs[obj].order.receiptCode = port.code3 // 交货地
        this.editableTabs[obj].order.receipt = port.englishName // 交货地
      }

    },

    selectedPot (port) {
      let activeName = this.editableTabsValue;
      let obj = this.editableTabs.findIndex(item => item.name === activeName)

      this.editableTabs[obj].order.pot = port.englishName
      if (!this.editableTabs[obj].order.potCode) {
        this.editableTabs[obj].order.potCode = port.code3 // 交货地
        this.editableTabs[obj].order.pot = port.englishName // 交货地
      }

    }
  }
}
</script>

<style scoped lang="less">
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
  padding: 20px;
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
</style>
