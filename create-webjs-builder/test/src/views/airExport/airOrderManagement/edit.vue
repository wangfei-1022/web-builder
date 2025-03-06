<template>
  <div class="app-main-inner" v-loading="loading">
    <el-form ref="orderForm" :model="order" :rules="orderRules" label-width="95px" label-position="left"
      class="page-form">
      <!-- 客户信息 -->
      <div class="form-module-title ">{{ $t('air.customerInformation') }}</div>
      <div class="form-module-item">
        <!-- 委托单位 -->
        <el-form-item :label="$t('air.requester')" prop="baseDTO.customerId">
          <type-select v-model="order.baseDTO.customerName" type="customer" @selected="setCustomerInfo" />
          <div v-if="showAirCustomerTitle" style="margin-top: -10px;height: 10px;color:coral"> {{
            $t('air.voidContractWarning2')
          }} </div>
        </el-form-item>
        <!-- 贸易条款 -->
        <el-form-item :label="$t('air.tradeTerms')" prop="baseDTO.tradeTerm">
          <type-select v-model="order.baseDTO.tradeTerm" type="trade" termCode="TRADEMODE" />
        </el-form-item>
        <div class="customer-info" style="clear: both">
          <!-- 客户联系人  -->
          <el-form-item :label="$t('air.customerContact')" prop="baseDTO.contactCnName" size="mini">
            <el-select filterable allow-create clearable v-model="order.baseDTO.contactCnName"
              :placeholder="$t('air.placeholder')" @change="contactChange">
              <el-option v-for="(item, index) in contactList" :label="item.contact" :value="item.id" :key="index">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 联系电话 -->
          <el-form-item :label="$t('air.phone')" prop="baseDTO.contactMobile" size="mini">
            <el-input v-model="order.baseDTO.contactMobile" :placeholder="$t('air.pleaseEnterArrivalContactTel')">
            </el-input>
          </el-form-item>
          <!-- 联系邮箱 -->
          <el-form-item :label="$t('air.email')" prop="baseDTO.contactEmail" size="mini">
            <el-input v-model="order.baseDTO.contactEmail" :placeholder="$t('air.contactEmailPlaceholder')"
              maxlength="500" show-word-limit>
            </el-input>
          </el-form-item>
          <!-- 客户类型 -->
          <el-form-item :label="$t('air.customerType')" size="mini">
            <span>{{ order.baseDTO.signDesc }}</span>
          </el-form-item>
          <!-- 结算方式  -->
          <el-form-item :label="$t('air.settlementMethod')" size="mini">
            <span>{{ order.baseDTO.settlementModeDesc }}</span>
          </el-form-item>
        </div>
      </div>
      <!-- 货物信息 -->
      <div class="form-module-title">{{ $t('air.cargoInformation') }}</div>
      <div class="form-module-item">
        <!-- 委托件数 -->
        <el-form-item :label="$t('air.orderQuantity')" prop="cargoDTO.orderQuantity">
          <el-input v-model="order.cargoDTO.orderQuantity" class="job-no-input" size="mini" v-input-limit="[-10, 4]" />
        </el-form-item>
        <!-- 委托毛重 -->
        <el-form-item :label="$t('air.orderGrossWeight')" prop="cargoDTO.orderGrossWeight">
          <el-input v-model="order.cargoDTO.orderGrossWeight" class="job-no-input" size="mini" v-input-limit="[-10, 4]">
            <template slot="append">KGS</template>
          </el-input>
        </el-form-item>
        <!-- 委托体积 -->
        <el-form-item :label="$t('air.orderVolume')" prop="cargoDTO.orderVolume">
          <el-input v-model="order.cargoDTO.orderVolume" class="job-no-input" size="mini" v-input-limit="[-10, 4]">
            <template slot="append">CBM</template>
          </el-input>
        </el-form-item>
        <!-- 货物英文品名 -->
        <el-form-item :label="$t('air.cargoEnName')">
          <el-input v-model="order.cargoDTO.cargoEnName" class="job-no-input" size="mini" type="textarea" rows="3" />
        </el-form-item>
        <!-- 货物中文品名 -->
        <el-form-item :label="$t('air.cargoCnName')">
          <el-input v-model="order.cargoDTO.cargoCnName" class="job-no-input" size="mini" type="textarea" rows="3" />
        </el-form-item>
        <!-- 托盘尺寸 -->
        <el-form-item :label="$t('air.palletSizes')">
          <el-input v-model="order.cargoDTO.palletSizes" class="job-no-input" size="mini" type="textarea" rows="3" />
        </el-form-item>
        <!-- 货物类型 -->
        <el-form-item :label="$t('air.cargoType')" prop="cargoDTO.cargoType">
          <el-select v-model="order.cargoDTO.cargoType" :placeholder="$t('air.placeholder')" size="mini">
            <el-option :label="$t('air.generalCargo')" value="0"></el-option>
            <el-option :label="$t('air.dangerousGoods')" value="1"></el-option>
            <el-option :label="$t('air.refrigeratedGoods')" value="2"></el-option>
            <el-option :label="$t('air.overweightCargo')" value="3"></el-option>
            <el-option :label="$t('air.hangGarment')" value="4"></el-option>
          </el-select>
        </el-form-item>
        <!-- 包装类型 -->
        <el-form-item :label="$t('air.packType2')" prop="cargoDTO.packType">
          <type-select v-model="order.cargoDTO.packType" type="trade" termCode="PACKTYPE" />
        </el-form-item>
        <!-- 托书价格 -->
        <!-- <el-form-item :label="$t('air.joeBookPrices')" prop="baseDTO.bookingReceivable">
          <el-input v-model="order.baseDTO.bookingReceivable" class="job-no-input" size="mini" maxlength="100"
            show-word-limit>
          </el-input>
        </el-form-item> -->
      </div>
      <!-- 配舱信息 -->
      <div class="form-module-title">{{ $t('air.stowageInformation') }}</div>
      <div class="form-module-item">
        <!-- 操作模式 -->
        <!-- <el-form-item :label="$t('air.blModeDesc')" prop="spaceDTO.blMode">
          <el-select v-model="order.spaceDTO.blMode" :placeholder="$t('air.placeholder')" :disabled="isInitMasterOrder"
            size="mini">
            <el-option :label="$t('air.straightSingle')" :value="1"></el-option>
            <el-option :label="$t('air.noStraightSingle')" :value="0"></el-option>
          </el-select>
        </el-form-item> -->
        <!-- 航空公司 -->
        <!-- <el-form-item :label="$t('air.airlineName')" prop="spaceDTO.airlineId">
          <cargo-limited-select :disabled="isInitMasterOrder" :placeholder="$t('air.placeholder')"
            :method="airCustomerMethod" :select-label="order.spaceDTO.airlineName"
            :select-value="order.spaceDTO.airlineId" type="customer" style="width: 100%;" @set="setAirCustomerInfo" />
        </el-form-item> -->
        <!-- 收货地 -->
        <!-- <el-form-item :label="$t('air.delivery')" prop="spaceDTO.deliveryCode">
          <el-row>
            <el-col :span="8">
              <type-select v-model="order.spaceDTO.deliveryCode" type="airport" @selected="selectedDelivery"
                :disabled="isInitMasterOrder" />
            </el-col>
            <el-col :span="16" style="padding-left: 10px;">
              <el-input v-model="order.spaceDTO.delivery" class="job-no-input" size="mini" disabled />
            </el-col>
          </el-row>
        </el-form-item> -->
        <!-- 舱位类型 -->
        <!-- <el-form-item :label="$t('air.shippingSpaceTypeDesc')" prop="spaceDTO.shippingSpaceType">
          <el-select v-model="order.spaceDTO.shippingSpaceType" :placeholder="$t('air.placeholder')"
            :disabled="isInitMasterOrder" @change="shippingChange" size="mini">
            <el-option :label="$t('air.ownShippingSpace')" :value="2"></el-option>
            <el-option :label="$t('air.agentShippingSpace')" :value="3"></el-option>
          </el-select>
        </el-form-item> -->
        <!-- 订舱代理 -->
        <!-- <el-form-item :label="$t('air.bookingAgentPort')" prop="spaceDTO.bookingAgentId">
          <cargo-limited-select :disabled="isInitMasterOrder" :select-label="order.spaceDTO.bookingAgentName"
            :select-value="order.spaceDTO.bookingAgentId" :method-params="{ range: ['b_booking_agent'] }"
            type="customer" style="width: 100%;" @set="setBookingAgentInfo" />
        </el-form-item> -->
        <!-- 装货港 -->
        <el-form-item :label="$t('air.pol')" prop="spaceDTO.polCode">
          <el-row>
            <el-col :span="8">
              <type-select v-model="order.spaceDTO.polCode" type="airport" @selected="selectedPol"
                :disabled="isInitMasterOrder" />
            </el-col>
            <el-col :span="16" style="padding-left: 10px;">
              <el-input v-model="order.spaceDTO.pol" class="job-no-input" size="mini" disabled />
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 产品航线 -->
        <!-- <el-form-item :label="$t('air.productLine')" prop="spaceDTO.productAirlineId" size="mini">
          <el-select filterable clearable v-model="order.spaceDTO.productAirlineId" :placeholder="$t('air.placeholder')"
            @change="selectProductAirLine">
            <el-option v-for="(item, index) in productAirlineNameList" :label="item.productName" :value="item.id"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item> -->


        <!-- 目的地 -->
        <el-form-item :label="$t('air.pod2')" prop="spaceDTO.podCode">
          <el-row>
            <el-col :span="8">
              <type-select v-model="order.spaceDTO.podCode" type="airport" @selected="selectedPod"
                :disabled="isInitMasterOrder" />
            </el-col>
            <el-col :span="16" style="padding-left: 10px;">
              <el-input v-model="order.spaceDTO.pod" class="job-no-input" size="mini" disabled />
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 预计航班时间 -->
        <el-form-item :label="$t('air.etd2')" prop="spaceDTO.etd">
          <CommonPicker :disabled="isInitMasterOrder" v-model="order.spaceDTO.etd" pikcer-type="datetime"
            pickerFormat="yyyy-MM-dd HH:mm" size="mini" />
        </el-form-item>
        <!-- 交货地 -->
        <!-- <el-form-item :label="$t('air.receipt')" prop="spaceDTO.receiptCode">
          <el-row>
            <el-col :span="8">
              <type-select v-model="order.spaceDTO.receiptCode" type="airport" @selected="selectedRec"
                :disabled="isInitMasterOrder" />
            </el-col>
            <el-col :span="16" style="padding-left: 10px;">
              <el-input v-model="order.spaceDTO.receipt" class="job-no-input" size="mini" disabled />
            </el-col>
          </el-row>
        </el-form-item> -->
        <!-- 中转港 -->
        <el-form-item :label="$t('air.transitPort')" prop="spaceDTO.potCode">
          <el-row>
            <el-col :span="8">
              <type-select v-model="order.spaceDTO.potCode" type="airport" @selected="selectedPot"
                :disabled="isInitMasterOrder" />
            </el-col>
            <el-col :span="16" style="padding-left: 10px;">
              <el-input v-model="order.spaceDTO.pot" class="job-no-input" size="mini" disabled />
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 货好时间 -->
        <el-form-item :label="$t('air.erd2')" prop="spaceDTO.erd">
          <CommonPicker v-model="order.spaceDTO.erd" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm" size="mini" />
        </el-form-item>
        <!-- 航班号 -->
        <!-- <el-form-item :label="$t('air.flightNo')" prop="spaceDTO.flightNo">
          <el-input v-model="order.spaceDTO.flightNo" class="job-no-input" size="mini" :disabled="isInitMasterOrder" />
        </el-form-item> -->


        <!-- 订舱备注 -->
        <el-form-item :label="$t('air.remarks')" style="width: 66%;">
          <el-input v-model="order.spaceDTO.bookingRemark" class="job-no-input" size="mini" type="textarea" rows="3" />
        </el-form-item>

      </div>

      <!-- 附件信息 -->
      <div class="form-module-title">{{ $t('air.attachmentInformation') }}</div>
      <div class="form-module-item">
        <div class="el-form-item">
          <el-checkbox v-model="attorneyFlag">{{ $t('air.uploadEntrustment') }}</el-checkbox>
          <AirExcelUpload ref="excelUpload" :can-be-upload="canBeUpload" @uploadSuccess="uploadSuccess"
            @uploadError="uploadError" @setUploadStatus="setUploadStatus" @removeFile="removeFile" @onPreview="onPreview"
            :fileList="fileList" :btnText="$t('air.uploadEntrustment')" :styleText="styleText" :autoUpload="true" />
        </div>

      </div>
      <!-- 收发通信息 -->
      <div class="form-module-title">{{ $t('air.sendingAndReceivingMessages') }}</div>
      <div class="form-module-item">
        <div class="el-form-item">
          <!-- 委托托运人 -->
          <div>{{ $t('air.orderShipperAddress') }}</div>
          <el-input v-model="order.addressDTO.orderShipperAddress" :rows="7" type="textarea" wrap="off" />
        </div>
        <div class="el-form-item">
          <!-- 委托收货人 -->
          <div>{{ $t('air.orderConsigneeAddress') }}</div>
          <el-input v-model="order.addressDTO.orderConsigneeAddress" :rows="7" type="textarea" wrap="off" />
        </div>
        <div class="el-form-item">
          <!-- 委托通知人 -->
          <div>{{ $t('air.orderNotifyAddress') }}</div>
          <el-input v-model="order.addressDTO.orderNotifyAddress" :rows="7" type="textarea" wrap="off" />
        </div>
      </div>
      <div class="operation-btn">
        <el-button type="primary" @click="addOrder">{{ $t('air.save') }}</el-button>
        <el-button @click="cancel">{{ $t('air.cancel') }}</el-button>
      </div>
    </el-form>
    <ElImageViewer v-show="fileimageShow" :on-close="fileimageClose" :url-list="filepaths" />

  </div>
</template>
<script>
import {
  addAirExportOriginMasterApi, addAirExportApi, addAirExportInitApi,
  getCustomerContactAirExportJobApi, getAirLineList, crmCustomerLinkman, airRechargeModeCurrentTimeList,
  airCustomerTitleList
} from '@/api/airExport'
import { airLineListApi, getCustomerDropDownListByJob, airportListApi } from '@/api/common'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'
import ElectronicFile from '../components/electronicFile'
import { validEmail } from "@/utils/validate"
import AirExcelUpload from '../components/airExcelUpload'
import ElImageViewer from "element-ui/packages/image/src/image-viewer"

export default {
  name: 'AirOrderManagementEdit',
  components: { cargoLimitedSelect, ElectronicFile, ElImageViewer, AirExcelUpload },
  props: {},
  data () {
    return {
      showAirCustomerTitle: false,
      attorneyFlag: true, // 上传托书
      canBeUpload: false, // 托书
      fileList: [],
      fileimageShow: false,
      filepaths: [],
      styleText: {
        width: '100%',
        'margin-left': 0
      },

      loading: false,
      jobId: null,
      type: null,
      isInitMasterOrder: false,
      customerMethod: getCustomerDropDownListByJob,
      airCustomerMethod: airLineListApi,
      customerMethodParams: {
        billType: '1'
      },
      productAirlineNameList: [],
      contactList: [],
      order: {
        fileList: [],
        baseDTO: {
          customerId: '',
          customerName: '',
          customerLevel: '',
          signDesc: '',
          settlementMode: '',
          settlementModeDesc: '',
          contactCnName: '',
          contactMobile: '',
          contactEmail: '',
          // bookingReceivable: "", // 托书价格
          tradeTerm: ""
        },
        cargoDTO: {
          cargoCnName: '', // 货品中文名
          cargoEnName: '', // 货品英文名
          cargoType: '', // 货物类型;1-普货;2-危险品;3-温控货品;4-超大件
          orderGrossWeight: '', // 委托毛重
          orderQuantity: '', // 委托件数
          orderVolume: '', // 委托体积
          packType: '', // 包装类型
          palletSizes: '' // 托盘尺寸
        },
        spaceDTO: {
          blMode: 1, // 订单操作模式;1-直单;0-非直单
          erd: '', // 货好日期
          etd: '', // 预计开航日期
          // shippingSpaceType: '', // 舱位类型;1-统配;2-自由舱位;3-代理舱位
          // airlineId: '', // 航空公司Id
          // airlineName: '', // 航空公司名称
          // airlineScacCode: '', // 航空公司Code
          // bookingAgentId: '', // 订舱代理id
          // bookingAgentName: '', // 订舱代理名称
          // flightNo: '', // 航班
          pod: '', // 卸货港/pod描述
          podCode: '', // 卸货港/pod代码
          pol: '', // 起运港描述
          polCode: '', // 起运港代码
          receipt: '', // 交货地
          receiptCode: '', // 交货地代码
          delivery: '', // 收货地
          deliveryCode: '', // 收货地港代码
          potCode: "",
          pot: "",
          bookingRemark: '' // 订舱备注
          // productAirlineName: "", // 产品航线名称
          // productAirlineId: ""// 产品航线id
        },
        addressDTO: {
          orderConsigneeAddress: '', // 委托收货人
          orderConsigneeCode: '', // 123
          orderNotifyAddress: '', // 委托通知人
          orderNotifyCode: '', // 123
          orderShipperAddress: '', // 委托发货人
          orderShipperCode: '' // 123
        }
      },
      orderRules: {

        "baseDTO.tradeTerm": [{ required: true, message: this.$t('air.pleaseSelectData'), trigger: 'change' }],
        "baseDTO.customerId": [{ required: true, message: this.$t('air.requesterHold'), trigger: 'change' }],
        "cargoDTO.orderQuantity": [{ required: true, message: this.$t('air.requiredOrderQuantity'), trigger: 'blur' }],
        "cargoDTO.orderGrossWeight": [{ required: true, message: this.$t('air.requiredOrderGrossWeight'), trigger: 'blur' }],
        "cargoDTO.orderVolume": [{ required: true, message: this.$t('air.requiredOrderVolume'), trigger: 'blur' }],
        "spaceDTO.airlineId": [{ required: false, message: this.$t('air.requiredAirline'), trigger: 'blur' }],
        "spaceDTO.bookingAgentId": [{ required: false, message: this.$t('air.requiredBookingAgentPort'), trigger: 'blur' }],
        // "spaceDTO.blMode": [{ required: true, message: this.$t('air.requiredBlMode'), trigger: 'blur' }],
        // "spaceDTO.shippingSpaceType": [{ required: true, message: '请选择舱位类型', trigger: 'blur' }],
        "spaceDTO.polCode": [{ required: true, message: this.$t('air.requiredPol'), trigger: 'blur' }],
        "spaceDTO.podCode": [{ required: true, message: this.$t('air.requiredPod'), trigger: 'blur' }],
        "spaceDTO.etd": [{ required: true, message: this.$t('air.requiredEtd'), trigger: 'blur' }],
        // "spaceDTO.flightNo": [{ required: true, message: '请选择航班号', trigger: 'blur' }],
        "cargoDTO.cargoType": [{ required: true, message: this.$t('air.requiredCargoType'), trigger: 'blur' }],
        "baseDTO.contactEmail": [{ message: this.$t('air.contactEmailPlaceholder'), trigger: 'change' }, { validator: this.validateEmail, trigger: 'blur' }]
        // "baseDTO.bookingReceivable": [{ required: true, message: this.$t('air.pleaseEnter'), trigger: 'blur' }]

      }
    }
  },

  created () {
    // 产品航线列表
    // getAirLineList().then(res => {
    //   this.productAirlineNameList = res.content
    // })


    if (this.$route.query.id) {
      this.jobId = this.$route.query.id
      this.type = this.$route.query.type
      this.init()
    }
  },
  mounted () {

  },
  methods: {
    validateEmail (rule, value, callback) {
      if (value) {
        let emailArr = value.split(';')
        let isSome = emailArr.some(item => {
          if (!validEmail(item)) {
            callback(new Error(item + this.$t('blInfo.emailError')))
            return true
          }
        })
        if (!isSome) {
          callback()
        }
      } else {
        callback()
      }
    },
    shippingChange () {
      if (this.order.spaceDTO.shippingSpaceType === 2) {
        this.$refs.orderForm.rules['spaceDTO.airlineId'][0].required = true
        this.$refs.orderForm.rules['spaceDTO.bookingAgentId'][0].required = false
      } else if (this.order.spaceDTO.shippingSpaceType === 3) {
        this.$refs.orderForm.rules['spaceDTO.airlineId'][0].required = false
        this.$refs.orderForm.rules['spaceDTO.bookingAgentId'][0].required = true
      } else {
        this.$refs.orderForm.rules['spaceDTO.airlineId'][0].required = false
        this.$refs.orderForm.rules['spaceDTO.bookingAgentId'][0].required = false
      }
    },
    init () {
      // this.isInitMasterOrder = true
      addAirExportInitApi(this.jobId).then(res => {
        let order = res.content
        if (this.type === 'copy') {
          // 委托单位
          this.setCustomerInfo({
            "id": order.customerId,
            "chineseName": order.customerName
          })

          this.order.cargoDTO.cargoType = order.cargoType + "" // 货物类型
          this.order.cargoDTO.cargoEnName = order.cargoEnName // 货物英文品名
          this.order.cargoDTO.cargoCnName = order.cargoCnName // 货物中文品名
          // this.order.spaceDTO.blMode = order.spaceDTO.blMode // 操作模式
          this.order.spaceDTO.polCode = order.spaceDTO.polCode // 装货港
          this.order.spaceDTO.pol = order.spaceDTO.pol // 装货港
          this.order.spaceDTO.podCode = order.spaceDTO.podCode // 卸货港
          this.order.spaceDTO.pod = order.spaceDTO.pod // 卸货港
          this.order.spaceDTO.etd = order.spaceDTO.etd // 预计航班时间

          // this.order.spaceDTO.receiptCode = order.spaceDTO.receiptCode // 交货地
          // this.order.spaceDTO.receipt = order.spaceDTO.receipt // 交货地
          // this.order.spaceDTO.shippingSpaceType = order.spaceDTO.shippingSpaceType// 舱位类型

          // 航空公司
          // this.order.spaceDTO.airlineId = order.spaceDTO.airlineId
          // this.order.spaceDTO.airlineName = order.spaceDTO.airlineName
          // this.order.spaceDTO.airlineScacCode = order.spaceDTO.airlineScacCode
          // 订舱代理
          // this.order.spaceDTO.bookingAgentId = order.spaceDTO.bookingAgentId
          // this.order.spaceDTO.bookingAgentName = order.spaceDTO.bookingAgentName

          // this.order.spaceDTO.flightNo = order.spaceDTO.flightNo
          // this.order.spaceDTO.productAirlineName = order.spaceDTO.productAirlineName
          // this.order.spaceDTO.productAirlineId = order.spaceDTO.productAirlineId
        }

      })


    },
    setCustomerInfo (customer) {
      this.order.baseDTO.customerId = customer.id
      this.order.baseDTO.customerName = customer.chineseName
      if (customer.id) {
        crmCustomerLinkman(customer.id).then(res => {
          this.order.baseDTO.signDesc = res.content.directCustomerTypeDesc
          this.order.baseDTO.customerLevel = res.content.directCustomerType
          console.log("res", res)
          if (res.content && res.content.customerLinkManDTOList.length) {
            this.contactList = res.content.customerLinkManDTOList
            this.order.baseDTO.contactCnName = res.content.customerLinkManDTOList[0].contact
            this.order.baseDTO.contactMobile = res.content.customerLinkManDTOList[0].tel
            this.order.baseDTO.contactEmail = res.content.customerLinkManDTOList[0].email
          }
        })

        airCustomerTitleList({
          businessTime: new Date().getTime(),
          businessType: 'AIR_EXPORT',
          memberId: customer.id
        }).then(res => {
          if (res && res.ok) {
            if (res.content.length > 0) {
              this.showAirCustomerTitle = false
            } else {
              this.showAirCustomerTitle = true
            }
          }
        })
        // 结算单位
        // airRechargeModeCurrentTimeList({ "memberId": customer.id }).then(res => {
        //   if (res && res.ok) {
        //     let settlementMode = res.content
        //     if (settlementMode.code !== null) {
        //       this.order.baseDTO.settlementMode = settlementMode.code
        //       this.order.baseDTO.settlementModeDesc = settlementMode.name
        //     }
        //   }
        // });
      } else {
        this.contactList = []
        this.order.baseDTO.customerLevel = ''
        this.order.baseDTO.signDesc = ''
        this.order.baseDTO.settlementMode = ''
        this.order.baseDTO.settlementModeDesc = ''
        this.order.baseDTO.contactCnName = ''
        this.order.baseDTO.contactMobile = ''
        this.order.baseDTO.contactEmail = ''
      }
    },
    contactChange (id) {
      let index = this.contactList.findIndex(item => item.id === id)
      this.order.baseDTO.contactCnName = this.contactList[index].contact
      this.order.baseDTO.contactMobile = this.contactList[index].tel
      this.order.baseDTO.contactEmail = this.contactList[index].email
    },
    setAirCustomerInfo (customer) {
      this.order.spaceDTO.airlineId = customer.id
      this.order.spaceDTO.airlineName = customer.chineseName
      this.order.spaceDTO.airlineScacCode = customer.scacCode
    },
    setBookingAgentInfo (customer) {
      this.order.spaceDTO.bookingAgentName = customer.chineseName
      this.order.spaceDTO.bookingAgentId = customer.id
    },
    // 收货地
    selectedRec (port) {
      this.order.spaceDTO.receipt = port.englishName
    },
    // 交货港
    selectedDelivery (port) {
      this.order.spaceDTO.delivery = port.englishName
    },

    selectedPol (port) {
      this.order.spaceDTO.pol = port.englishName
    },
    selectedPod (port) {
      this.order.spaceDTO.pod = port.englishName

      if (!this.order.spaceDTO.receiptCode) {
        this.order.spaceDTO.receiptCode = port.code3 // 交货地
        this.order.spaceDTO.receipt = port.englishName // 交货地
      }

    },

    selectedPot (port) {
      this.order.spaceDTO.pot = port.englishName

      if (!this.order.spaceDTO.potCode) {
        this.order.spaceDTO.potCode = port.code3 // 交货地
        this.order.spaceDTO.pot = port.englishName // 交货地
      }

    },
    selectProductAirLine (airLineId) {

      let airLine = this.productAirlineNameList.find(item => item.id === airLineId).productName
      this.order.spaceDTO.productAirlineName = airLine
      // 用户选择的产品航线为【CZ包板-PVG-AMS】时，CZ为跟航司code匹配；PVG为装货港三字码，AMS为卸货港三字码
      if (airLine) {
        let list = airLine.split("-");
        console.log(list[0], list[1], list[2])
        // 航空公司 正则中文去除
        airLineListApi({
          "code": list[0].replace(/[\u4e00-\u9fa5]/g, "")
        }).then(res => {
          // 航空公司
          this.order.spaceDTO.airlineId = res.content.list[0].id
          this.order.spaceDTO.airlineName = res.content.list[0].chineseName
          this.order.spaceDTO.airlineScacCode = res.content.list[0].scacCode
        })
        // 装货港
        airportListApi({
          "code": list[1]
        }).then(res => {
          this.order.spaceDTO.polCode = res.content.list[0].code3 // 装货港
          this.order.spaceDTO.pol = res.content.list[0].englishName // 装货港
        })
        // 卸货港
        airportListApi({
          "code": list[2]
        }).then(res => {
          this.order.spaceDTO.podCode = res.content.list[0].code3 // 卸货港
          this.order.spaceDTO.pod = res.content.list[0].englishName // 卸货港

          this.order.spaceDTO.receiptCode = res.content.list[0].code3 // 交货地
          this.order.spaceDTO.receipt = res.content.list[0].englishName // 交货地

        })

      }

    },
    addOrder () {
      if (this.attorneyFlag) {
        if (this.order.fileList.length === 0) {
          this.$message.warning(this.$t('air.uploadEntrustmentWarning'))
          return
        }

      }
      this.$refs.orderForm.validate(valid => {
        if (valid) {
          this.loading = true
          let data = this.order
          let fn = addAirExportApi
          if (this.jobId && this.type !== "copy") {
            fn = addAirExportOriginMasterApi
            data.jobId = this.jobId
          }
          airCustomerTitleList({
            businessTime: this.order.spaceDTO.etd,
            businessType: 'AIR_EXPORT',
            memberId: this.order.baseDTO.customerId
          }).then(res => {
            if (res && res.ok) {
              console.log(222, res.content.length)
              if (res.content.length > 0) {
                fn(data).then(res2 => {
                  if (res2 && res2.ok) {
                    this.$message.success(this.$t('air.newSuccess'))
                    this.backList()
                  }
                })
              } else {
                this.$message.warning(this.$t('air.voidContractWarning'))
              }
              this.loading = false
            }
          })

        }
      })
    },
    backList () {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: `AirOrderManagement` })
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
      // this.order.fileList.push(res)
      this.order.fileList = res
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
      let index = this.order.fileList.findIndex(item => item.uid === file.uid || item.cloudFileName === file.cloudFileName)
      if (index !== -1) {
        this.order.fileList.splice(index, 1)
      }
    },
    async onPreview (file) {
      console.log("file", file)
      const jpg = ["jpg", "jpeg", "png", "JPG", "JPEG", "PNG"]
      // let cloudFileName, url
      // if (file.url) {
      //   cloudFileName = file.cloudFileName
      //   url = file.url

      // } else {
      //   cloudFileName = file.content.cloudFileName
      //   url = file.content.url
      // }
      let fileContent = this.order.fileList.find(item => item.uid === file.uid || item.cloudFileName === file.cloudFileName)
      const fileSuffix = fileContent.cloudFileName.substring(fileContent.cloudFileName.lastIndexOf(".") + 1)
      if (jpg.indexOf(fileSuffix) > -1) {
        // 是图片
        this.filepaths = []
        this.fileimageShow = true
        this.filepaths.push(fileContent.url)
      } else {
        window.open(fileContent.url)
      }
    },
    fileimageClose () {
      this.fileimageShow = false
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
  max-width: 1200px;
  padding: 20px 20px;
}

.form-module-title {
  font-size: 16px;
  margin-bottom: 10px;
  display: block;
  color: #1890ff;
  padding-left: 10px;
  border-left: 2px solid #1890ff;
}

.form-module-item-file {
  overflow: hidden;
  padding: 20px;
  background: #fff;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px 0 #eee, 0 0 6px 0 #eee;
}

.form-module-item {
  overflow: hidden;
  padding: 20px;
  background: #fff;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px 0 #eee, 0 0 6px 0 #eee;

  ::v-deep .el-form-item {
    width: 33%;
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

.customer-info {
  // padding-left: 50px;
}

.customer-info .item {
  width: 20%;
  float: left;
  margin-left: 5%;

  label {
    margin-right: 15px;
  }
}
</style>
