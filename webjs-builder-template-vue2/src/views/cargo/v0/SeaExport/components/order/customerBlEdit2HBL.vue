<template>
  <div class="box" v-loading="loading">
    <el-form :inline="true" :model="customerBlForm" @submit.native.prevent ref="customerBlForm" label-position="top">
      <!--      提单信息-->
      <div class="box_title">{{$t('sea.billInformation')}}</div>
      <div class="box_child">
        <div class="flex-bet" style="width: 100%; padding: 0 7%">
          <div style="width: 47.5%" class="block">
            <el-form-item label="1.Shipper Insert Name Address and Phone/Fax" prop="shipperAddress" style="position: relative" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'},
            { validator: (rule, value, callback)=>validateCharacterWrap(rule, value, callback,35,5), trigger: 'blur' } ]">
              <el-input class="textareaH" style="height: 131px;" type="textarea" :placeholder="$t('sea.pleaseEnter')"
                        v-model="customerBlForm.shipperAddress" maxlength="3000" show-word-limit v-input-auto="'upperCase'"></el-input>

              <el-button @click="Eshipping" type="primary" size="mini" style="position: absolute; top: -37px;right: 0;">Eshipping</el-button>
            </el-form-item>
            <el-form-item label="2.Consignee Insert Name Address and Phone/fax" prop="consigneeAddress" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'}
            ,{ validator: (rule, value, callback)=>validateCharacterWrap(rule, value, callback,35,5), trigger: 'blur' } ]">
              <el-input class="textareaH" style="height: 131px;" type="textarea" :placeholder="$t('sea.pleaseEnter')"
                        v-model="customerBlForm.consigneeAddress" maxlength="3000" show-word-limit v-input-auto="'upperCase'"></el-input>
            </el-form-item>
            <el-form-item label="3.Notify Party Insert Name Address and Phone/Fax" prop="notifyAddress" style="position: relative" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'}
            ,{ validator: (rule, value, callback)=>validateCharacterWrap(rule, value, callback,35,5), trigger: 'blur' } ]">
              <el-input class="textareaH" style="height: 119px;" type="textarea" placeholder="(It is agreed that no responsibility shall attach
to the Carrier or his agents for failure to notify)" v-model="customerBlForm.notifyAddress" maxlength="3000" show-word-limit v-input-auto="'upperCase'"></el-input>
              <el-button @click="SAMEASCONSIGNEE" type="primary" size="mini" style="position: absolute; top: -37px;right: 0;">SAME AS CONSIGNEE</el-button>

            </el-form-item>
          </div>
          <div style="width: 47.5%;">
            <el-form-item label="Booking No." prop="bookingNos" style="width: 33%;" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'} ]">
              <div style="width: 200px; max-height: 200px; overflow: auto">
                <div v-for="item in customerBlForm.bookingNos" :key="item">
                  {{item}}
                </div>
              </div>
            </el-form-item>
            <el-form-item label="" prop="showSoFlag" style="width: 20%;" >
              <el-checkbox v-model="customerBlForm.showSoFlag">Show So</el-checkbox>
            </el-form-item>
            <el-form-item label="Bill of Lading No." style="width: 38%;" >
              {{ customerBlForm.blNo }}
            </el-form-item>
            <el-form-item label="Export References Carrier Rate Reference Number:" prop="rateReferenceNo" style="width: 100%;" >
              <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.rateReferenceNo" ></el-input>
            </el-form-item>

            <el-form-item label="Forwarding Agent and References FMC/CHB No." prop="fmcNo" style="width: 100%;" >
              <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.fmcNo"/>
            </el-form-item>
            <el-form-item label="Point and Country of Origin" style="width: 100%;" prop="originCountry" >
              <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.originCountry"></el-input>
            </el-form-item>
            <el-form-item prop="secondNotifyAddress" :rules="[ { required: customerBlForm.blSignType !==1,message:$t('sea.pleaseEnter'),trigger: 'change'} ]" :label="customerBlForm.blSignType ===1 ? 'Also Notify Party-routing & Instructions' : 'For delivery of goods please apply to' " style="width: 100%;" >
              <el-input type="textarea" v-input-auto="'EN_num_symbol'" v-model="customerBlForm.secondNotifyAddress" maxlength="1000" show-word-limit rows="5" ></el-input>
              <el-button @click="SPEEDIER" type="primary" size="mini" style="position: absolute; top: -37px;right: 0;">SPEEDIER</el-button>
            </el-form-item>
          </div>
        </div>
        <div class="flex-bet" style="width: 100%; padding: 0 7%">
          <el-form-item label="4. Combined Transport* Pre-Carriage by" prop="combinedVessel" style="width: 21%;" >
            <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.combinedVessel" ></el-input>
          </el-form-item>
          <el-form-item label="5. Combined Transport* Place of Receipt" prop="receiptCode" style="width: 21%;" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'},
           { validator:validateLength,message:``, trigger: 'change' } ]" >
            <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.receiptCode" maxlength="250" show-word-limit class="padding-limit"></el-input>
          </el-form-item>
          <el-form-item label="Service Contract No." style="width: 21%;" prop="serviceContractNo" >
            <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.serviceContractNo" ></el-input>
          </el-form-item>
          <el-form-item label="Doc Form No." style="width: 21%;" prop="docFormNo">
            <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.docFormNo" ></el-input>
          </el-form-item>

          <el-form-item label="6. Ocean Vessel Voy. No." style="width: 21%;" prop="vesselVoyageFormat" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'} ]">
            <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.vesselVoyageFormat"  maxlength="250"></el-input>
          </el-form-item>
          <el-form-item label="7.Port of Loading" style="width: 21%;" prop="pol" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'},
           { validator:validateLength,message:``, trigger: 'change' } ]" >
            <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.pol" maxlength="250" show-word-limit class="padding-limit"></el-input>
          </el-form-item>
          <el-form-item label="Type of Movement" style="width: 21%;" prop="typeOfMovement" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'} ]">
            <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.typeOfMovement"></el-input>
          </el-form-item>
          <el-form-item style="width: 21%;" >
          </el-form-item>
          <el-form-item label="8.Port of Discharge" style="width: 21%;" prop="pod" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'},
           { validator:validateLength,message:``, trigger: 'change' } ]">
            <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.pod"  maxlength="250" show-word-limit class="padding-limit"></el-input>
          </el-form-item>
          <el-form-item label="9. Combined Transport* Place of Delivery" prop="destinationCode" style="width: 21%;" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'},
           { validator:validateLength,message:``, trigger: 'change' } ]" >
            <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.destinationCode"  maxlength="250" show-word-limit class="padding-limit"></el-input>
          </el-form-item>
          <el-form-item style="width: 21%;" ></el-form-item>
          <el-form-item style="width: 21%;" ></el-form-item>

          <el-form-item label="Marks & Nos." style="width: 21%;" prop="marks" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'},
           { validator: (rule, value, callback)=>validateCharacterWrap(rule, value, callback,15,200), trigger: 'blur' }]">
            <el-checkbox v-model="customerBlForm.marksAttachedFlag" style="position: absolute; top: -37px;right: 0;">Show Attached</el-checkbox>
            <el-input type="textarea" v-input-auto="'upperCase'" v-model="customerBlForm.marks" maxlength="3000" class="textareaH" style="height: 205px"
                      show-word-limit></el-input>
          </el-form-item>
          <div style="width: 21%;">
            <el-form-item label="Quantity No. of Container of Packages" style="width: 100%;" >
              {{ customerBlForm.quantity }} {{ customerBlForm.packageType }}
            </el-form-item>
            <el-form-item label="Container No. & Seal No." style="width: 100%;" >
              <div style="max-height: 117px; overflow: auto">
                <div v-for="(item,index) in customerBlForm.containerDTOList" :key="index">{{item.containerNo}} / {{item.sealNo}} / {{item.containerType}}</div>
              </div>
            </el-form-item>
          </div>
          <div style="width: 47%; display: flex;justify-content: space-between;flex-wrap: wrap;">
            <el-form-item label="Gross Weight" style="width: 44%;" >
              {{customerBlForm.grossWeight}}
            </el-form-item>
            <el-form-item label="Measurement" style="width: 44%;" >
              {{customerBlForm.volume}}
            </el-form-item>
            <el-form-item label="Description of Goods" style="width: 100%;" prop="goodsDesc" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'},
             , { validator: (rule, value, callback)=>validateCharacterWrap(rule, value, callback,30,100),message:`${$t('sea.atMost5TextsCanBeAddedA')} 30 X 100  ${$t('sea.atMost5TextsCanBeAddedB')}`, trigger: 'blur' }]" >
              <el-input type="textarea" v-input-auto="'upperCase'" v-model="customerBlForm.goodsDesc" maxlength="3000"  rows="5" show-word-limit></el-input>
              <el-checkbox v-model="customerBlForm.attachedFlag" style="position: absolute; top: -37px;right: 0;">Show Attached</el-checkbox>
            </el-form-item>
          </div>

        </div>

        <div class="flex-bet" style="width: 100%; padding: 0 7%">
          <div style="width: 47.5%" class="block">
            <el-form-item label="10.Total Number of Containers and/or Packages (in words)" style="width: 100%; margin-bottom: 0" >
            </el-form-item>
            <el-form-item label="" style="width: 100%;">
              <el-radio-group v-model="customerBlForm.packageRule" @change="packageRuleChange">
                <el-radio :label="1">Containers</el-radio>
                <el-radio :label="2" style="padding-left: 10px">Packages</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="" style="width: 100%;" >
              <el-input v-model="customerBlForm.totalUmber" maxlength="1000" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div style="width: 47.5%" class="block">
            <el-form-item label="" prop="isCharge" style="margin-top: 113px" v-if="Number(editableTabsValue) === 4" >
              <el-checkbox v-model="customerBlForm.isCharge" :label="2">{{ $t('sea.showFee') }}</el-checkbox>
            </el-form-item>
          </div>
        </div>
        <div v-if="Number(editableTabsValue) === 4 && customerBlForm.isCharge" class="flex-bet" style="width: 100%; padding: 0 7%"  >
          <el-table class="case-data-table" :data="customerBlForm.chargeList" >
            <el-table-column>
              <template slot="header">
                <span class="red">*</span>11. Freight & Charges
              </template>
              <template slot-scope="{row,$index}">
                <el-form-item label="" :prop="'chargeList.' + $index + '.chargeName'" :rules="[{ required: true, message: $t('BLInfo.placeholder'), trigger: 'change'},]">
                  <span v-if="!row.isEdit">{{row.chargeName}}</span>
                  <el-input v-else v-trim v-model="row.chargeName" v-input-auto="'EN_num_symbol'" type="text" maxlength="1000" size="mini" ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="Revenue Tons">
              <template slot-scope="{row,$index}">
                <el-form-item label="" :prop="'chargeList.' + $index + '.revenueOns'">
                  <span v-if="!row.isEdit">{{row.revenueOns}}</span>
                  <el-input v-else v-model="row.revenueOns" v-input-limit="[6,3]" maxlength="1000" type="text" size="mini"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header">
                <span class="red">*</span>Rate
              </template>
              <template slot-scope="{row,$index}">
                <el-form-item label="" :prop="'chargeList.' + $index + '.rate'" :rules="[{ required: true, message: $t('BLInfo.placeholder'), trigger: 'change'},]">
                  <span v-if="!row.isEdit">{{row.rate}}</span>
                  <el-input v-else v-model="row.rate" v-input-limit="[6,2]" maxlength="10" type="text" size="mini"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header">
                <span class="red">*</span>Per
              </template>
              <template slot-scope="{row,$index}">
                <el-form-item label="" :prop="'chargeList.' + $index + '.per'" :rules="[{ required: true, message: $t('BLInfo.placeholder'), trigger: 'change'},]">
                  <span v-if="!row.isEdit">{{row.per}}</span>
                  <el-input v-else v-trim v-model="row.per" maxlength="1000" type="text" size="mini"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header">
                <span class="red">*</span>Currency
              </template>
              <template slot-scope="{row,$index}">
                <el-form-item label="" :prop="'chargeList.' + $index + '.currency'" :rules="[{ required: true, message: $t('BLInfo.placeholder'), trigger: 'change'},]">
                  <span v-if="!row.isEdit">{{row.currency}}</span>
                  <el-input v-else v-trim v-model="row.currency" v-input-auto="'EN_num_symbol'" maxlength="1000" type="text" size="mini"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header">
                <span class="red">*</span>Amount
              </template>
              <template slot-scope="{row,$index}">
                <el-form-item label="" :prop="'chargeList.' + $index + '.amount'" :rules="[{ required: true, message: $t('BLInfo.placeholder'), trigger: 'change'},]">
                  <span v-if="!row.isEdit">{{row.amount}}</span>
                  <el-input v-else v-trim v-model="row.amount" v-input-limit="[9,2]" maxlength="1000" type="text" size="mini"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header">
                <span class="red">*</span>Prepaid Collect
              </template>
              <template slot-scope="{row,$index}">
                <el-form-item label="" :prop="'chargeList.' + $index + '.payMode'" :rules="[{ required: true, message: $t('BLInfo.placeholder'), trigger: 'change'},]">
                  <el-radio-group v-model="row.payMode">
                    <el-radio label="PREPAID"></el-radio>
                    <el-radio label="COLLECT" style="padding-left: 10px"></el-radio>
                  </el-radio-group>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="{row,$index}">
                <template>
                  <el-button v-if="!row.isEdit" type="text" size="medium" :disabled="isEdit"  @click="editCost(row,$index)" icon="el-icon-edit" class="icon blue"></el-button>
                  <el-button v-if="row.isEdit" type="text" size="medium"  @click="editSave(row,$index)" icon="el-icon-circle-check" class="icon blue"></el-button>
                  <el-button v-if="row.isEdit" type="text" size="medium"  @click="editClose(row,$index)" icon="el-icon-circle-close" class="icon blue"></el-button>

                  <el-button v-if="!row.isEdit" type="text" size="medium" :disabled="isEdit"  @click="addCost($index)" icon="el-icon-circle-plus" class="icon blue"> </el-button>
                  <el-button v-if="!row.isEdit && customerBlForm.chargeList.length>1" type="text" size="medium" :disabled="isEdit" @click="delCost($index)" icon="el-icon-remove" class="icon red"></el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div  v-if="Number(editableTabsValue) === 4"  class="flex-bet" style="width: 100%; padding: 0 7%" >
          <!--        支付方信息-->
          <el-form-item v-if="customerBlForm.isCharge" label="Freight & Charges Payable at / by" style="width: 47.5%; margin-top: 10px" >
            <el-input type="text" v-input-auto="'upperCase'" v-model="customerBlForm.freightInfo" maxlength="1000"></el-input>
          </el-form-item>
        </div>
        <div class="flex-bet" style="width: 100%; padding: 0 7%">
          <div style="width: 21%">
            <el-form-item :label="$t('sea.issuingMethod')" style="width: 100%;" >
              <el-input type="text" v-model="customerBlForm.releaseMode" maxlength="1000" size="mini" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="Date Laden on Board" style="width: 100%;" >
              <CommonPicker
                v-model="customerBlForm.onboardDate"
                parent-class="w178"
                size="mini"
                picker-format="yyyy-MM-dd"
                pikcer-type="date"
                :clearable="false"
                :placeholder="$t('sea.placeholder')"
              />
            </el-form-item>
            <el-form-item label="The Vessel By" style="width: 100%;" >
              <el-input type="text" v-input-auto="'upperCase'" v-model="customerBlForm.theVesselBy" maxlength="1000" size="mini"></el-input>
            </el-form-item>
          </div>
          <div style="width: 21%">
            <el-form-item label="No.of Original B/L(s)" prop="a" style="width: 100%" >
              <el-input v-model="customerBlForm.originalNum" :disabled="true" v-input-auto="'int'" type="text" maxlength="1000" size="mini" ></el-input>
            </el-form-item>
            <el-form-item label="Date of Issue" prop="a"  style="width: 100%">
              <CommonPicker
                v-model="customerBlForm.issueDate"
                parent-class="w178"
                size="mini"
                picker-format="yyyy-MM-dd"
                pikcer-type="date"
                :clearable="false"
                :placeholder="$t('sea.placeholder')"
              />
            </el-form-item>
            <el-form-item label="Place of Issue" prop="a"  style="width: 100%">
              <el-input v-trim v-input-auto="'upperCase'" v-model="customerBlForm.issuePlace" type="text" maxlength="1000" size="mini" ></el-input>
            </el-form-item>
          </div>
          <div style="width: 47%;">
            <el-form-item label="Signed for the carrier"   >
              ESHIPPING GLOBAL SUPPLY CHAIN MANAGEMENT (SHENZHEN)COMPANY LIMITED
            </el-form-item>
            <el-form-item v-if="!customerBlForm.carrierBlId" label="" prop="isCharge" style="margin-top: 128px" >
              <el-checkbox v-model="isSaveCreate" >{{ $t('sea.saveCreate') }}</el-checkbox>
            </el-form-item>
          </div>

        </div>
      </div>
    </el-form>
    <div class="btn_box" :style="{width: `calc(100% - ${withoutAnimation ? 180 :54}px)`}">
      <!--      v-if="[30].indexOf(orderDetailsData.orderState)>-1"-->
      <el-button  type="primary" size="mini" @click="returnBillDetails">{{ $t('sea.returnBillDetails') }}</el-button>
      <el-button v-if="[30,40,50,80].indexOf(orderDetailsData.orderState)>-1" :disabled="isEdit" type="primary" @click="save" size="mini">{{ $t('sea.save') }}</el-button>
      <el-button :disabled="isEdit" type="primary" @click="prev" size="mini">{{ $t('sea.prev') }}</el-button>
      <el-button v-if="blId" :disabled="isEdit" type="primary" @click="printSample(blId)" size="mini">{{ $t('sea.printSample') }}</el-button>
      <!--      <el-button type="danger" @click="exitCustoms">{{ $t('sea.exitCustoms') }}</el-button>-->
    </div>
    <reportListDialog v-if="reportDialog.isShow" :is-show="reportDialog.isShow" :print-data="reportDialog.data" :type-code="reportDialog.typeCode" @closeDialog="reportDialog.isShow=false" />

  </div>
</template>
<script>
import URL from '@/api/urlTranslator'
import {getDmnTermItemList} from "@/api/seaExport"
import {
  seaBlEditSaveApi,
  seaBlSaveApi, seaCarrierBlEditApi, seaCarrierBlSaveApi,
  seaOrderDetailApi
} from "@/api/seaExportOrder"
import lodash from 'lodash'
import cargoAdvanceSelect from "@/components/Cargo/Common/cargoAdvanceSelect"
import reportListDialog from "@/components/Cargo/Report/reportListDialog"
import {deepCloneMethod} from "@/utils"
import {validEmail} from "@/utils/validate";
import orderMixin from "./orderMixin"

export default {
  name: 'CustomerBlEdit',
  mixins: [orderMixin],
  props: {
    uploadRadioType: { type: String, default: null },
    orderDetailsData: { type: Object, default: () => {} },
    dataForm: { type: Object, default: () => {} },
    blId: { type: String, default: null },
    cargoIds: { type: Array, default: () => [] },
    editableTabsValue: { type: String, default: '4' }
  },
  components: {cargoAdvanceSelect, reportListDialog},
  data() {
    return {
      vm: this,
      loading: false,
      id: this.$route.query.id,
      bookingJobId: this.$route.query.bookingJobId,
      freightTermList: [],
      customerInformationForm: {},
      isEdit: false,
      copyRow: {},
      customerBlForm: {
        cargoList: [],
        originalNum: 3,
        fmcNo:null
      },
      newOrderDetailsData: {},
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
      batchPrintMultipleForm: {}, // 批量打印用的条件
      contractNoList: [],
      enter:null,
      isSaveCreate: false, // 是否创建船司提单
    }
  },
  filters: {

  },
  computed: {
    url() {
      return URL
    },
    withoutAnimation () {
      return this.$store.state.app.sidebar.opened // 需要监听的数据
    }
  },
  watch: {
    // dataForm(val) {
    //   this.customerBlForm = val
    //   console.log('customerBlForm:', this.customerBlForm)
    // }
  },
  created() {
    if (!this.id) {
      this.id = this.orderDetailsData.id
    }
    if (!this.dataForm.originalNum) {
      if(this.dataForm.releaseModeCode === 'SWB'){
        this.dataForm.originalNum = 1
      }else{
        this.dataForm.originalNum = 3
      }
    }
    if(this.dataForm.atd){
      this.dataForm.onboardDate = this.dataForm.atd
      this.dataForm.issueDate = this.dataForm.atd
    }
    this.customerBlForm = this.dataForm
    // console.log('this.customerBlForm,', this.customerBlForm)
    if (!this.customerBlForm.typeOfMovement) {
      this.$set(this.customerBlForm, 'typeOfMovement', 'FCL/FCL')
    }
    if (!this.customerBlForm.packageRule) {
      this.$set(this.customerBlForm, 'packageRule', 1)
    }
    if (!this.customerBlForm.marks) {
      this.$set(this.customerBlForm, 'marks', 'N/M')
    }
    if (!this.customerBlForm.chargeList || this.$isEmpty(this.customerBlForm.chargeList)) {
      const chargeList = [{
        chargeCode: null,
        chargeName: 'OCEAN FREIGHT',
        revenueOns: null,
        rate: null,
        per: null,
        currency: 'USD', // 'USD',
        amount: null,
        payMode: 'PREPAID'
      }]
      this.$set(this.customerBlForm, 'chargeList', chargeList)
    }
    this.packageRuleChange(this.customerBlForm.packageRule)
    if (this.$isNotEmpty(this.customerBlForm.soNoSet)) {
      // this.$set(this.customerBlForm, 'bookingNos', this.customerBlForm.soNoSet[0])
      this.customerBlForm.soNoSet.map(item => {
        this.contractNoList.push({
          value: item
        })
      })
    }

    // this.customerBlForm = this.orderDetailsData
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.customerBlForm.validate(valid => {})
    })
  },
  methods: {
    validateCharacterWrap(rule, value, callback,characterNum,rowNum) {
      if (value) {
        const reg = /[^\a-zA-Z0-9\s*\!\@\#\%\,\.\/\s\-\(\)\_\:\;\$\\\+\'\"\&]/
        if(reg.test(value)){
          callback(new Error(this.$t('sea.containsSpecialCharacters')))
        }else {
          callback()
        }
      } else {
        callback(new Error(this.$t('sea.pleaseEnter')))
      }
    },
    validateLength(rule, value, callback){
      if(value.length >250){
        callback(new Error(' '))
      }else{
        callback()
      }
    },
    descKey(ev) {
      if (ev.keyCode === 13) {
        this.enter = true
      }
      else this.enter = false
    },
    descInput(val,characterNum=35,rowNUm=5) {
      // if (this.enter) return
      // //把多行文本换行进行转译分割为数组
      // let textArr = this.customerBlForm[val].replace(/\r?\n/g, "<br />").split("<br />")
      // var maxarr = []
      // //遍历数组对长度10以上的进行切割
      // textArr.forEach(item => {
      //   for (var i = 0; i < item.length; i += characterNum) {
      //     maxarr.push(item.slice(i, i + characterNum));
      //   }
      //
      // })
      // if (maxarr.filter(item => item.length > 0).length > rowNUm) {
      //   this.customerBlForm[val] = maxarr.filter(item => item.length > 0).slice(0,characterNum).join("\n")
      // }
      // else {
      //   this.customerBlForm[val] = maxarr.filter(item => item.length > 0 ).join("\n")
      // }
    },
    // 约号/价卡号
    querySearchContractNo(queryString, cb) {
      let restaurants = this.contractNoList
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return restaurant => restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1
    },
    handleSelect(item) {
      console.log(item)
    },
    Eshipping() {
      this.$set(this.customerBlForm, 'shipperAddress', `ESHIPPING GLOBAL SUPPLY CHAIN
MANAGEMENT (SHENZHEN) CO.,LTD.
16F,AREA A,ANLIAN PLAZA NO.4018,
JINTIAN ROAD,FUTIAN DISTRICT,
SHENZHEN`)
    },
    SAMEASCONSIGNEE() {
      this.$set(this.customerBlForm, 'notifyAddress', `SAME AS CONSIGNEE`)
    },
    SPEEDIER() {
      this.$set(this.customerBlForm, 'secondNotifyAddress', `SPEEDIER LOGISTIC INC.
175-01 ROCKAWAY BLVD STE 305
JAMAICA, NY 11434
TEL: 718-373-5400 FAX: 607-590-3237
ESHIPPINGDOC@SPEEDIER-NYC.COM`)
    },
    packageRuleChange(val) {
      console.log(this.customerBlForm)
      if (val === 1 && this.customerBlForm.count) {
        if (this.customerBlForm.count === 1) {
          if (this.customerBlForm.partOfContainer) {
            this.$set(this.customerBlForm, 'totalUmber', 'PART OF ONE CONTAINER')
          } else {
            this.$set(this.customerBlForm, 'totalUmber', 'SAY ONE CONTAINER ONLY')
          }
        } else {
          this.$set(this.customerBlForm, 'totalUmber', `SAY ${this.customerBlForm.count.toString().toEnglish().toUpperCase()} ${this.customerBlForm.count > 1 ? 'CONTAINERS' : 'CONTAINER'} ONLY`)
        }
      } else if (val === 2 && this.customerBlForm.quantity) {
        this.$set(this.customerBlForm, 'totalUmber', `SAY ${this.customerBlForm.quantity.toString().toEnglish().toUpperCase()} ${this.customerBlForm.packageType} ONLY.`)
      }
    },
    editCost(row, i) {
      this.copyRow = lodash.cloneDeep(row)
      this.$set(row, 'isEdit', true)
      this.isEdit = true
    },
    editSave(row, $index) {
      // 'chargeList.' + $index + '.amount'
      let fieldName = [
        'chargeList.' + $index + '.chargeName',
        'chargeList.' + $index + '.rate',
        'chargeList.' + $index + '.per',
        'chargeList.' + $index + '.currency',
        'chargeList.' + $index + '.amount',
        'chargeList.' + $index + '.payMode'
      ]
      let flag = true
      this.$refs.customerBlForm.validateField(fieldName, valid => {
        if (valid !== '') {
          flag = false

        }
      })
      if (flag) {
        this.$set(row, 'isEdit', false)
        this.isEdit = false
      }
    },
    editClose(row, i) {
      row.isEdit = false
      this.$set(this.customerBlForm.chargeList, i, this.copyRow)
      this.isEdit = false
    },
    addCost(i) {
      this.customerBlForm.chargeList.push({
        chargeCode: null,
        chargeName: 'OCEAN FREIGHT',
        revenueOns: null,
        rate: null,
        per: null,
        currency: 'USD',
        amount: null,
        payMode: 'PREPAID'
      })
    },
    delCost(i) {
      this.customerBlForm.chargeList.splice(i, 1)
    },
    async getSeaOrderDetail(id) {
      this.loading = true
      const res = await seaOrderDetailApi(id)
      this.loading = false
      if (res.ok) {
        this.newOrderDetailsData = res.content
      }
    },
    async save() {
      await this.getSeaOrderDetail(this.id)
      if ([30, 40, 50,80].indexOf(this.newOrderDetailsData.orderState) === -1) {
        this.$message.warning(this.$t('sea.orderStatusHasChanged'))
        return
      }
      // 必填项映射 chargeList
      let requiredMap = {
        shipperAddress: 'Shipper Insert Name Address and Phone/Fax',
        consigneeAddress: 'Consignee Insert Name Address and Phone/fax',
        notifyAddress: 'Notify Party Insert Name Address and Phone/Fax',
        bookingNos: 'Booking No.',
        secondNotifyAddress: 'For delivery of goods please apply to',
        receiptCode: 'Combined Transport* Place of Receipt',
        vessel: 'Ocean Vessel Voy. No',
        polCode: 'Port of Loading',
        podCode: 'Port of Discharge',
        destinationCode: 'Combined Transport* Place of Delivery',
        goodsDesc: 'Description of Goods'
      }
      let ids = this.customerBlForm.cargoList.map(item => item.id)
      // 新增客户提单 或编辑 // 未关联船司提单
      if (!this.blId || this.blId && !this.customerBlForm.carrierBlId) {
        // 先提交
        const res = await this.saveApi()
        if (res) {
          this.$refs.customerBlForm.validate((valid, obj) => {
            // 如果有箱货信息
            if (this.$isNotEmpty(ids)) {
              // 且所有其他必填项都有值
              if (valid) {
                this.$message.success(this.$t('sea.successSaved'))
              } else { // 但其他任意必填项没值
                let str = ''
                let isFreight
                for (let key in obj) {
                  let keyArr = key.split('.')[0]
                  if (keyArr === 'chargeList') {
                    isFreight = true
                  }
                  if (requiredMap[key]) {
                    str += `<br/>&nbsp;&nbsp;${requiredMap[key]}`
                  }
                }
                if (isFreight) {
                  str += `<br/>&nbsp;&nbsp;Freight & Charges Revenue Tons chargeList`
                }

                this.$message({
                  duration: 5000,
                  dangerouslyUseHTMLString: true,
                  message: `${this.$t('sea.followingFields')}${str}`,
                  type: 'warning'
                })
              }

            } else { // 如果没有箱货信息 ，不论其他任意必填项有没有值，生成客户提单
              this.$message({
                duration: 3000,
                dangerouslyUseHTMLString: true,
                message: this.$t('sea.missingBoxInformation'),
                type: 'warning'
              })

            }
          })
          if (this.isSaveCreate) {
            const select= [{id:res.content.id || this.customerBlForm.blId}]
            this.$emit('tabPaneChange', '5', true, 'carrierCreate', select)
          }else{
            this.$emit('returnBillDetails')
          }
        }
      } else { // 编辑
        if (this.customerBlForm.carrierBlId) {
          // 已关联船司提单
            if (lodash.isEqual(this.cargoIds, ids)) { // 无箱货信息变更
              this.$confirm(this.$t('sea.unpackedInformationChange'), this.$t('sea.tips'), {
                confirmButtonText: this.$t('sea.determine'),
                cancelButtonText: this.$t('sea.cancel'),
                type: 'warning'
              }).then(async() => {
                const res=await this.saveApi()
                if(res.ok){
                  this.$emit('returnBillDetails')
                }
              })
            } else { // 有箱货信息变更
              this.$confirm(this.$t('sea.thereIsAChangeInTheCargoInformation'), this.$t('sea.tips'), {
                confirmButtonText: this.$t('sea.determine'),
                cancelButtonText: this.$t('sea.cancel'),
                type: 'warning'
              }).then(async() => {
                const res=await this.saveApi()
                if(res.ok){
                  this.$emit('returnBillDetails')
                }
              })
            }

        } else { // 未关联船司提单
          console.log('未关联船司提单')
        }

      }
    },
    async saveApi() {
      this.customerBlForm.orderId = this.id
      this.loading = true
      let res
      // let cargoIds = this.customerBlForm.cargoList.map(item => item.id)
      // this.customerBlForm.cargoIds = cargoIds

      let seaBlJobCargoDTOList = this.customerBlForm.cargoList.map(item =>  {
        return {
          cargoId: item.id,
        }
      })
      this.customerBlForm.seaBlJobCargoDTOList = seaBlJobCargoDTOList

      if (this.blId) {
        this.customerBlForm.blId = this.blId
        res = await seaBlEditSaveApi(this.customerBlForm)
      } else {
        res = await seaBlSaveApi(this.customerBlForm)
        if(res.ok &&  res.content && Number(res.content.code) !== 0){
          this.$message.warning(this.$t(`sea.adjustExpensesAsNeededCode${res.content.code}`))
        }
      }
      this.loading = false
      return res
      // if (res.ok) {
      //   if (this.blId ) {
      //     this.$emit('returnBillDetails')
      //   }else{
      //     const select= [{id:res.content.id}]
      //     this.$emit('tabPaneChange', '5', true, 'carrierCreate', select)
      //   }
      //   return res
      // } else {
      //   return false
      // }
    },
    returnBillDetails() {
      this.$confirm(this.$t('sea.notYetSaved'), this.$t('sea.tips'), {
        confirmButtonText: this.$t('sea.determine'),
        cancelButtonText: this.$t('sea.cancel'),
        type: 'warning'
      }).then(() => {
        this.$emit('returnBillDetails')
      })
    },
    prev() {
      this.$emit('changePage', 1)
    },
    closeDialog() {
      this.dialogShow = false
    },
    // * 打印
    printSample(id) {
      //  const { blNo = null, blStatus = null, containerNo = null, hsCode = null, memberId = null, sealNo = null, vessel = null, voyage = null, declareStatus = null, declareMethod = null, polCode = null, podCode = null } = this.batchPrintMultipleForm
      //  const queryConditionJson = { blNo, blStatus, containerNo, hsCode, memberId, sealNo, vessel, voyage, declareStatus, declareMethod, polCode, podCode }
      this.reportDialog.typeCode = 'CUSTOMER_BL'
      const entityIdList = [id]
      this.reportDialog.data = { jobId: '', entityIdList }
      this.reportDialog.isShow = true
    }
  }
}
</script>
<style lang="scss" scoped>
.flex-bet{ display: flex; align-items:flex-start ; justify-content: space-between;flex-wrap:wrap;}
.box_title{ border-left: solid 3px rgb(24,144,255);font-size: 18px; color: #199ED8; padding-left: 8px; height: 28px; line-height: 28px; margin:5px 0 8px 0; display: flex;
  .operate-buttons-left{ margin-left: 20px}
}
.box{ background-color: #f5f7f7; padding: 8px;
  ::v-deep .el-form-item{ margin-right: 0}
  ::v-deep .el-form-item--medium{
    .el-form-item__content{ line-height: 28px}
    .el-form-item__label{ line-height: 28px}
  }
}
.box_child{border: solid 1px rgba(121, 121, 121, 1); padding: 20px 30px; background: #fff; margin-bottom: 15px;
  .box25{ width: 20%}
}
.block ::v-deep  .el-form-item{ display: block}
::v-deep .icon{ width: auto; height: auto}
.icon{ font-size: 24px; transition: all 0.2s ease 0s; cursor: pointer;user-select: none;
  &:hover{ transform: scale(1.1)}
}
.blue{ color: #1890ff}
::v-deep.el-button.is-disabled{
  &.blue,&.red{color: #C0C4CC;}
}
.red{color: #ff4949}
//**
.oneToOne{font-size: 28px; font-weight: 500; transform: rotate(25deg); padding: 8px 12px; border-radius: 15px; margin-top: 30px;}
.unmatched{ border:4px solid rgb(255,204,102); color:rgb(255,204,102)  }
.matched{ border:4px solid rgb(255,255,255); color:rgb(255,255,255) }
.btn_box{ position: fixed; bottom: 0px; right: 0; text-align: right; background: #fff; padding: 15px 50px 15px 0}
.textareaH{
  ::v-deep .el-textarea__inner{height: 100%}
}
::v-deep .el-textarea__inner{resize: none;}
.case-data-table{
  width: 100%;
  ::v-deep .el-form-item{ margin: 8px 0}
  ::v-deep .el-form-item__error{ display: none}
  ::v-deep .el-radio__label{ display: none;}
}
.padding-limit{
  ::v-deep .el-input__inner{ padding-right: 57px}
}
</style>
