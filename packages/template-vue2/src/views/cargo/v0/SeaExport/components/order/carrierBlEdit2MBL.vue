<template>
  <div class="box" v-loading="loading">
    <el-form :inline="true" :model="customerBlForm" @submit.native.prevent ref="customerBlForm" label-position="top">
      <!--      提单信息-->
      <div class="box_title">{{$t('sea.billInformation')}}</div>
      <div class="box_child">
        <div class="flex-bet" style="width: 100%; padding: 0 7%">
          <div style="width: 47.5%" class="block">
            <div style="position: relative">
              <el-form-item :label="$t('sea.contact')" prop="shipperAddress" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'},
             { validator: (rule, value, callback)=>validateCharacterWrap(rule, value, callback,35,5), trigger: 'change' } ]">
                <el-input class="textareaH" style="height: 131px;" type="textarea" :placeholder="$t('sea.pleaseEnter')"v-model="customerBlForm.shipperAddress" maxlength="179"
                          @input="descInput('shipperAddress',35,5)"  @keydown.native="descKey($event)" v-input-auto="'upperCase'"></el-input>
                <el-button @click="Eshipping" type="primary" size="mini" style="position: absolute; top: -37px;right: 0;">Eshipping</el-button>
              </el-form-item>
              <el-tooltip class="item" effect="dark" :content="$t('sea.shipperToCarrier')" placement="top-start">
                <el-form-item :label="$t('sea.signatureAuthorized')" prop="principalSignature" style="position: absolute; top: 0px;left: 150px;display: flex" class="signatureAuthorized">
                  <el-input :placeholder="$t('sea.pleaseEnter')" v-model="customerBlForm.principalSignature" size="mini"></el-input>
                </el-form-item>
              </el-tooltip>
            </div>
            <el-form-item :label="$t('sea.consignee')" prop="consigneeAddress" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'}
            ,{ validator: (rule, value, callback)=>validateCharacterWrap(rule, value, callback,35,5), trigger: 'change' }]">
              <el-input class="textareaH" style="height: 131px;" type="textarea" :placeholder="$t('sea.pleaseEnter')" v-model="customerBlForm.consigneeAddress" maxlength="179"
                        @input="descInput('consigneeAddress',35,5)"  @keydown.native="descKey($event)" v-input-auto="'upperCase'"></el-input>
            </el-form-item>
            <div v-if="podCode === 'IN'" style="display: flex; justify-content: space-between;flex-wrap: wrap;">
              <el-form-item :label="$t('sea.indian24PermanentAccountNumber')" prop="combinedVessel" style="width: 47.5%; display: inline-block" >
                <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.consigneeIndianInfo.consigneeIndian24Account" ></el-input>
              </el-form-item>
              <el-form-item :label="$t('sea.importerExporterCode')" prop="combinedVessel" style="width: 47.5%; display: inline-block" >
                <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.consigneeIndianInfo.consigneeIndian24Code" ></el-input>
              </el-form-item>
              <el-form-item :label="$t('sea.messageID')" prop="combinedVessel" style="width: 47.5%; display: inline-block" >
                <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.consigneeIndianInfo.consigneeIndian24MailId" ></el-input>
              </el-form-item>
              <el-form-item :label="$t('sea.salesTaxIDNo')" prop="combinedVessel" style="width: 47.5%; display: inline-block" >
                <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.consigneeIndianInfo.consigneeIndian24TaxId" ></el-input>
              </el-form-item>
            </div>

<!--            通知方-->
            <el-form-item :label="$t('sea.notifyingParty')" prop="notifyAddress" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'}
            ,{ validator: (rule, value, callback)=>validateCharacterWrap(rule, value, callback,35,5), trigger: 'change' }]">
              <el-input class="textareaH" style="height: 119px;" type="textarea" placeholder="(It is agreed that no responsibility shall attach
to the Carrier or his agents for failure to notify)" v-model="customerBlForm.notifyAddress" maxlength="179"
                        @input="descInput('notifyAddress',35,5)" @keydown.native="descKey($event)" v-input-auto="'upperCase'"></el-input>
              <el-button @click="SAMEASCONSIGNEE" type="primary" size="mini" style="position: absolute; top: -37px;right: 0;">SAME AS CONSIGNEE</el-button>
            </el-form-item>
            <div style="display: flex; justify-content: space-between;flex-wrap: wrap;">
              <template v-if="podCode === 'IN'">
                <el-form-item :label="$t('sea.indian24PermanentAccountNumber')" prop="consigneeIndian24Account" style="width: 47.5%; display: inline-block" >
                  <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.notifyPartyIndianInfo.notifyPartyIndian24Account" ></el-input>
                </el-form-item>
                <el-form-item :label="$t('sea.importerExporterCode')" prop="consigneeIndian24Code" style="width: 47.5%; display: inline-block" >
                  <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.notifyPartyIndianInfo.notifyPartyIndian24Code" ></el-input>
                </el-form-item>
                <el-form-item :label="$t('sea.messageID')" prop="consigneeIndian24MailId" style="width: 47.5%; display: inline-block" >
                  <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.notifyPartyIndianInfo.notifyPartyIndian24MailId" ></el-input>
                </el-form-item>
                <el-form-item :label="$t('sea.salesTaxIDNo')" prop="consigneeIndian24TaxId" style="width: 47.5%; display: inline-block" >
                  <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.notifyPartyIndianInfo.notifyPartyIndian24TaxId" ></el-input>
                </el-form-item>
              </template>

              <!--          头程船-->
              <el-form-item :label="$t('sea.firstVoyageShip')" prop="combinedVessel" style="width: 47.5%;" >
                <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.combinedVessel" ></el-input>
              </el-form-item>
              <!--          收货地-->
              <el-form-item :label="$t('sea.placeOfReceipt')" prop="receiptCode"  style="width: 47.5%;" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'},
           { validator:validateLength,message:``, trigger: 'change' }]" >
                <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.receiptCode" :maxlength="customerBlForm.blSignType ===1? 22 : 250" show-word-limit  class="padding-limit"></el-input>
              </el-form-item>
              <!--          船名、航次以及航向-->
              <el-form-item :label="$t('sea.shipNameVoyageAndCourse')"  style="width: 47.5%;" prop="vesselVoyageFormat" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'} ]">
                <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.vesselVoyageFormat" maxlength="250"></el-input>
              </el-form-item>
              <!--          装货港-->
              <el-form-item :label="$t('sea.pol2')"  style="width: 47.5%;" prop="pol" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'},
           { validator:validateLength,message:``, trigger: 'change' } ]" >
                <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.pol" :maxlength="customerBlForm.blSignType ===1? 22 : 250" show-word-limit  class="padding-limit"></el-input>
              </el-form-item>
              <el-form-item :label="$t('sea.pod')"  style="width: 47.5%;" prop="pod" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'},
           { validator:validateLength,message:``, trigger: 'change' } ]">
                <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.pod" :maxlength="customerBlForm.blSignType ===1? 22 : 250" show-word-limit  class="padding-limit"></el-input>
              </el-form-item>
              <!--          最终目的地-->
              <el-form-item :label="$t('sea.finalDestination')" prop="destinationCode"  style="width: 47.5%;" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'},
           { validator:validateLength,message:``, trigger: 'change' } ]" >
                <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.destinationCode" :maxlength="customerBlForm.blSignType ===1? 22 : 250" show-word-limit  class="padding-limit"></el-input>
              </el-form-item>
              <!--          唛头及号码-->
              <el-form-item :label="$t('sea.marksNumbers')"  style="width: 47.5%;" prop="marks" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'}
          , { validator: (rule, value, callback)=>validateCharacterWrap(rule, value, callback,30,200),message:`${$t('sea.atMost5TextsCanBeAddedA')} 15 X 200  ${$t('sea.atMost5TextsCanBeAddedB')}`, trigger: 'change' }]">
                <el-input type="textarea" v-model="customerBlForm.marks" maxlength="4000" rows="5" class="textareaH"
                          @input="descInput('marks',30,200)"  @keydown.native="descKey($event)" v-input-auto="'upperCase'"></el-input>
              </el-form-item>
              <!--            货物描述摘要-->
              <el-form-item :label="$t('sea.cargoDescriptionSummary')" style="width: 47.5%;" prop="goodsDesc" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'}
            , { validator: (rule, value, callback)=>validateCharacterWrap(rule, value, callback,30,134), trigger: 'change' }]" >
                <!--                message:`${$t('sea.atMost5TextsCanBeAddedA')} 30 X 100  ${$t('sea.atMost5TextsCanBeAddedB')}`,-->
                <el-input type="textarea"  v-model="customerBlForm.goodsDesc" maxlength="4000"  rows="5" show-word-limit
                          @input="descInput('goodsDesc',30,134)" @keydown.native="descKey($event)" v-input-auto="'upperCase'"></el-input>
              </el-form-item>

            </div>

            <div class="flex-bet" style="width: 100%;">


            </div>

          </div>
          <div style="width: 47.5%;">
            <el-form-item :label="$t('sea.SO')" prop="bookingNos" style="width: 40%;" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'} ]">
              <div style="width: 200px; max-height: 200px; overflow: auto">
                <div v-for="item in customerBlForm.bookingNos" :key="item">
                  {{item}}
                </div>
              </div>
<!--              <el-autocomplete-->
<!--                class="inline-input"-->
<!--                v-model="customerBlForm.bookingNo"-->
<!--                :fetch-suggestions="querySearchContractNo"-->
<!--                :placeholder="$t('sea.pleaseEnter')"-->
<!--                @select="handleSelect"-->
<!--              ></el-autocomplete>-->
            </el-form-item>
            <el-form-item :label="$t('sea.billNo')" style="width: 40%;" >
              {{ customerBlForm.blNo }}
            </el-form-item>
<!--           费率类型 费率参考号码-->
            <div class="userReferenceList">
              <el-form-item :label="$t('sea.rateType')" prop="rateReferenceNo" >
                <el-select  class="w178" v-model="customerBlForm.rateType" :placeholder="$t('sea.placeholder')" filterable  size="mini" style="width: 165px">
                  <el-option label="CSO/Agreement Number" value="CSO/Agreement Number"></el-option>
                  <el-option label="Service Contract Number" value="Service Contract Number"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('sea.rateReferenceNumber')" prop="rateReferenceNo" >
                <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.rateReferenceNo" :disabled="true" size="mini"></el-input>
              </el-form-item>
            </div>

            <div class="userReferenceList">
              <div v-for="(item,index) in customerBlForm.userReferenceList" :key="index">
                <!--          用户参考类型-->
                <el-form-item :label="$t('sea.userReferenceType')" :prop="'userReferenceList.' + index + '.userReferenceType'" >
                  <el-select  class="w178" v-model="item.userReferenceType" :placeholder="$t('sea.placeholder')" filterable  size="mini" style="width: 165px">
                    <el-option v-for="item in userReferenceTypeOptions" :label="item" :value="item" :key="item"></el-option>
                  </el-select>
                </el-form-item>
                <!--            用户参考号码-->
                <el-form-item :label="$t('sea.userReferenceNumber')" :prop="'userReferenceList.' + index + '.userReferenceNo'" >
                  <el-input  class="w178" v-model="item.userReferenceNo"  v-input-auto="'en_num_symbol'" maxlength="200" show-word-limit size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>
                </el-form-item>
                <el-button  type="text" icon="el-icon-circle-plus" class="icon blue userReferenceBtn"  @click="addRateInformation"></el-button>
                <el-button   v-show="customerBlForm.userReferenceList.length >1" type="text" icon="el-icon-remove" class="icon red userReferenceBtn"  @click="delRateInformation(index)"></el-button>
                <div style="text-align: right; width: 100%; margin-bottom: 10px">
                  <el-checkbox v-model="item.disPlayFlag" style="margin-right:20%">{{ $t('sea.showOnBillOfLading') }}</el-checkbox>
                </div>
              </div>
            </div>
<!--            原产地-->
            <el-form-item :label="$t('sea.countryOfOrigin')" style="width: 100%;" prop="originCountry" >
              <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.originCountry"></el-input>
            </el-form-item>
            <el-form-item prop="secondNotifyAddress" :rules="[ { required: customerBlForm.blSignType !==1,message:$t('sea.pleaseEnter'),trigger: 'change'},
             { validator: (rule, value, callback)=>validateCharacterWrap(rule, value, callback,35,5), trigger: 'change' } ]" :label="customerBlForm.blSignType ===1 ? $t('sea.secondNotifyingPartyInformation') :
             'For delivery of goods please apply to' " style="width: 100%;" >
              <el-input type="textarea"  v-model="customerBlForm.secondNotifyAddress"
                        @input="descInput('secondNotifyAddress',35,5)"  maxlength="179" show-word-limit rows="5" v-input-auto="'upperCase'"></el-input>
              <el-button v-if="customerBlForm.blSignType ===2" @click="SPEEDIER" type="primary" size="mini" style="position: absolute; top: -37px;right: 0;">SPEEDIER</el-button>
            </el-form-item>
            <!--            其他通知方信息-->
            <el-form-item prop="otherNotifyInfo"  :label="$t('sea.otherNotifyingPartyInformation')" style="width: 100%;"
                          :rules="[{ validator: (rule, value, callback)=>validateCharacterWrap(rule, value, callback,35,5), trigger: 'change' } ]">
              <el-input type="textarea"  v-model="customerBlForm.otherNotifyInfo" @input="descInput('otherNotifyInfo',35,5)"
                        maxlength="179" rows="5" v-input-auto="'upperCase'"></el-input>
            </el-form-item>
            <!--            在提单上显示货代信息-->
            <div>
              <el-checkbox v-model="customerBlForm.displayForwarderInfoFlag" @change="displayForwarderInfoFlagChange" style="margin-right:20%">{{ $t('sea.displayForwarderInformationOnBillOfLading') }}</el-checkbox>
            </div>
            <el-form-item prop="forwarderInfo"  label="" style="width: 100%;" :rules="[{ validator: (rule, value, callback)=>validateCharacterWrap(rule, value, callback,35,4), trigger: 'change' } ]">
              <el-input type="textarea" v-model="customerBlForm.forwarderInfo"  @input="descInput('forwarderInfo',35,4)"
                        maxlength="143" show-word-limit rows="5" v-input-auto="'upperCase'" ></el-input>
            </el-form-item>
            <div style="display: flex;justify-content: space-between">
              <!--            箱封号-->
              <el-form-item :label="$t('sea.caseSealNo')" style="width: 47.5%;" >
                <div style=" overflow: auto; border: #ccc 1px solid;height: 221px;
    padding: 5px 10px;">
                  <div v-for="(item,index) in customerBlForm.containerDTOList" :key="index">{{item.containerNo}} / {{item.sealNo}}</div>
                </div>
              </el-form-item>
              <div  style="width: 47.5%; ">
                <!--            件数及包装单位-->
                <el-form-item :label="$t('sea.numberOfPiecesAndPackagingUnit')" style="width: 100%;" >
                  {{ customerBlForm.quantity }} {{ customerBlForm.packageType }}
                </el-form-item>
                <!--            总毛重-->
                <el-form-item :label="$t('sea.sumGrossWeight')" style="width: 100%;"  >
                  <!--              {{customerBlForm.grossWeight}}-->
                  <el-input v-model="customerBlForm.grossWeight" :disabled="true"></el-input>
                </el-form-item>
                <!--            总体积-->
                <el-form-item :label="$t('sea.sumVolume')" style="width: 100%;"  >
                  <!--              {{customerBlForm.volume}}-->
                  <el-input v-model="customerBlForm.volume" :disabled="true"></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>


      </div>
    </el-form>
    <div  v-if="Number(orderDetailsData.carrierId) === 5" class="btn_box" :style="{width: `calc(100% - ${withoutAnimation ? 180 :54}px)`}">
      <!--      v-if="[30].indexOf(orderDetailsData.orderState)>-1"-->
      <el-button  type="primary" size="mini" @click="returnBillDetails">{{ $t('sea.returnBillDetails') }}</el-button>
      <el-button :disabled="isEdit" type="primary" @click="prev" size="mini">{{ $t('sea.prev') }}</el-button>
<!--      发送补料 新建船司提单或提单状态为”草稿“、”提交失败“时可见-->
      <el-button v-if="[-1,20].indexOf(customerBlForm.jobState)>-1 || !blId" :disabled="isEdit" type="primary" @click="sendReplenishment" size="mini">{{ $t('sea.sendReplenishment') }}</el-button>
      <el-button v-if="([30,40,50,80].indexOf(orderDetailsData.orderState)>-1 && customerBlForm.jobState !==20 )|| [-1,30,40].indexOf(customerBlForm.jobState)>-1" :disabled="isEdit" type="primary" @click="save" size="mini">{{ $t('sea.save') }}</el-button>
<!--      补料完成 新建船司提单或提单状态为”草稿“、”处理中“、”提交失败“时可见-->
      <el-button v-if="[-1,10,20,30].indexOf(customerBlForm.jobState)>-1 || !blId" :disabled="isEdit" type="primary" @click="replenishmentCompleted" size="mini">{{ $t('sea.replenishmentCompleted') }}</el-button>

      <el-button v-if="blId" :disabled="isEdit" type="primary" @click="printSample(blId)" size="mini">{{ $t('sea.printSample') }}</el-button>
      <!--      <el-button type="danger" @click="exitCustoms">{{ $t('sea.exitCustoms') }}</el-button>-->
    </div>

    <div  v-else class="btn_box" :style="{width: `calc(100% - ${withoutAnimation ? 180 :54}px)`}">
      <!--      v-if="[30].indexOf(orderDetailsData.orderState)>-1"-->
      <el-button  type="primary" size="mini" @click="returnBillDetails">{{ $t('sea.returnBillDetails') }}</el-button>
      <el-button :disabled="isEdit" type="primary" @click="prev" size="mini">{{ $t('sea.prev') }}</el-button>
      <!--      发送补料 新建船司提单或提单状态为”草稿“、”提交失败“时可见-->
      <el-button v-if="([30,40,50,80].indexOf(orderDetailsData.orderState)>-1 && customerBlForm.jobState !==20 )|| [-1,40].indexOf(customerBlForm.jobState)>-1" :disabled="isEdit" type="primary" @click="save" size="mini">{{ $t('sea.save') }}</el-button>
      <!--      补料完成 新建船司提单或提单状态为”草稿“、”处理中“、”提交失败“时可见-->
      <el-button v-if="!blId || [-1].indexOf(customerBlForm.jobState)>-1" :disabled="isEdit" type="primary" @click="replenishmentCompleted" size="mini">{{ $t('sea.replenishmentCompleted') }}</el-button>
      <el-button v-if="blId" :disabled="isEdit" type="primary" @click="printSample(blId)" size="mini">{{ $t('sea.printSample') }}</el-button>
    </div>

    <reportListDialog v-if="reportDialog.isShow" :is-show="reportDialog.isShow" :print-data="reportDialog.data" :type-code="reportDialog.typeCode" @closeDialog="reportDialog.isShow=false" />
    <sendReplenishment v-if="sendReplenishmentDialog" :showDialog.sync="sendReplenishmentDialog"  @submitCallBack="sendReplenishmentCallBack"></sendReplenishment>
    <replenishmentAccountNo v-if="replenishmentAccountNoDialog" :showDialog.sync="replenishmentAccountNoDialog"  @submitCallBack="replenishmentAccountNoCallBack"></replenishmentAccountNo>
  </div>
</template>
<script>
import URL from '@/api/urlTranslator'
import {getDmnTermItemList} from "@/api/seaExport"
import {
  saveAndSendSupplementaryApi,
  seaBlEditSaveApi,
  seaBlSaveApi, seaCarrierBlEditApi, seaCarrierBlSaveApi,
  seaOrderDetailApi, supplementaryCompletedApi, supplementaryCompletedUpdateApi, updateAndSendSupplementary
} from "@/api/seaExportOrder"
import lodash from 'lodash'
import cargoAdvanceSelect from "@/components/Cargo/Common/cargoAdvanceSelect"
import reportListDialog from "@/components/Cargo/Report/reportListDialog"
import {deepCloneMethod} from "@/utils"
import userReferenceTypeOptions from "@/views/cargo/v0/SeaExport/components/order/json/userReferenceTypeList";
import sendReplenishment from "@/views/cargo/v0/SeaExport/components/order/Popup/sendReplenishment";
import replenishmentAccountNo from "@/views/cargo/v0/SeaExport/components/order/Popup/replenishmentAccountNo";
import orderMixin from "./orderMixin"

export default {
  name: 'CarrierBlEdit2',
  mixins: [orderMixin],
  props: {
    uploadRadioType: { type: String, default: null },
    orderDetailsData: { type: Object, default: () => {} },
    dataForm: { type: Object, default: () => {} },
    blId: { type: String, default: null },
    cargoIds: { type: Array, default: () => [] },
    editableTabsValue: { type: String, default: '4' }
  },
  components: {cargoAdvanceSelect, reportListDialog,sendReplenishment,replenishmentAccountNo},
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
        originalNum: 3
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
      sendReplenishmentDialog:false,
      replenishmentAccountNoDialog:false,
    }
  },
  filters: {

  },
  computed: {
    url() {
      return URL
    },
    userReferenceTypeOptions() {
      return userReferenceTypeOptions
    },
    withoutAnimation () {
      return this.$store.state.app.sidebar.opened // 需要监听的数据
    },
    podCode(){
      if(this.dataForm.podCode){
        return this.dataForm.podCode.toUpperCase().substr(0,2)
      }
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
    if (!this.dataForm.userReferenceList || this.$isEmpty(this.dataForm.userReferenceList)) {
      this.dataForm.userReferenceList = [{userReferenceType: "", userReferenceNo: ""}]
    }
    if (!this.dataForm.originalNum) {
      if(this.dataForm.releaseModeCode === 'SWB'){
        this.dataForm.originalNum = 1
      }else{
        this.dataForm.originalNum = 3
      }
    }
    if(!this.dataForm.consigneeIndianInfo){
      this.$set(this.dataForm, 'consigneeIndianInfo', {})
    }
    if(!this.dataForm.notifyPartyIndianInfo){
      this.$set(this.dataForm, 'notifyPartyIndianInfo', {})
    }
    this.customerBlForm = this.dataForm
    if(this.customerBlForm.freightTermCode === 'PREPAID'){ // 预付
      this.$set(this.customerBlForm, 'rateType', 'Service Contract Number')
    }else{
      this.$set(this.customerBlForm, 'rateType', 'CSO/Agreement Number')
    }
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
      console.log('soNoSet', this.customerBlForm.soNoSet)
      this.$set(this.customerBlForm, 'bookingNo', this.customerBlForm.soNoSet[0])
      this.customerBlForm.soNoSet.map(item => {
        this.contractNoList.push({
          value: item
        })
      })
    }

    // this.customerBlForm = this.orderDetailsData
  },
  methods: {
    validateCharacterWrap(rule, value, callback,characterNum,rowNum) {
      if (value) {
        const reg = /[^\a-zA-Z0-9\s*\!\@\#\%\,\.\/\s\-\(\)\_\:\;\$\\\+\'\"\&]/
        if(reg.test(value)){
          callback(new Error(this.$t('sea.containsSpecialCharacters')))
        }else {
          let textArr = value.replace(/\r?\n/g, "<br />").split("<br />")

          if (textArr.length > rowNum) {
            callback(new Error(`${this.$t('sea.atMost5TextsCanBeAdded')} ${characterNum} X ${rowNum}  ${this.$t('sea.atMost5TextsCanBeAdded2')}`))
          } else {
            let isError = textArr.some(item => item.length > characterNum)
            if (isError) {
              callback(new Error(`${this.$t('sea.atMost5TextsCanBeAdded')} ${characterNum} X ${rowNum}  ${this.$t('sea.atMost5TextsCanBeAdded2')}`))
            } else {
              callback()
            }
          }
        }
      } else {
        callback()
      }
    },
    validateLength(rule, value, callback){
      let num
      if(this.customerBlForm.blSignType === 1){ // MBL
        num = 22
      }else{
        num = 250
      }
      if(value.length >num){
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
      if(val !='goodsDesc'){
        return
      }
      if (this.enter) return
      //把多行文本换行进行转译分割为数组
      let textArr = this.customerBlForm[val].replace(/\r?\n/g, "<br />").split("<br />")
      var maxarr = []
      //遍历数组对长度10以上的进行切割
      textArr.forEach(item => {
        for (var i = 0; i < item.length; i += characterNum) {
          maxarr.push(item.slice(i, i + characterNum));
        }

      })
      if (maxarr.filter(item => item.length > 0).length > rowNUm) {
        this.customerBlForm[val] = maxarr.filter(item => item.length > 0).slice(0,characterNum).join("\n")
      }
      else {
        this.customerBlForm[val] = maxarr.filter(item => item.length > 0 ).join("\n")
      }
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
    packageRuleChange(val) {
      console.log(this.customerBlForm)
      if (val === 1 && this.customerBlForm.count) {

        this.$set(this.customerBlForm, 'totalUmber', `SAY ${this.customerBlForm.count.toString().toEnglish().toUpperCase()} ${this.customerBlForm.count > 1 ? 'CONTAINERS' : 'CONTAINER'} ONLY`)
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
    async save1() {
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
        bookingNo: 'Booking No.',
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
          this.$emit('returnBillDetails')
        }
      } else { // 编辑
        if (this.customerBlForm.carrierBlId) {
          // 已关联船司提单
          if (this.customerBlForm.blSignType === 1) { // MBL
            this.$refs.customerBlForm.validate(async (valid, obj) => {
              if (valid) { // 如果必填项均有值则提示 changeShippingBl
                this.$confirm(this.$t('sea.changeShippingBl'), this.$t('sea.tips'), {
                  confirmButtonText: this.$t('sea.determine'),
                  cancelButtonText: this.$t('sea.cancel'),
                  type: 'warning'
                }).then(async() => {
                  this.saveApi()
                })
              } else { // 任意必填项为空则提示
                this.$message.error(this.$t('sea.hasShippingBl'))
              }
            })
          }

        } else { // 未关联船司提单
          console.log('未关联船司提单')
        }

      }
    },
    async save() {
      this.$refs.customerBlForm.validate(valid => {
        if (valid) {
          this.saveApi()
        } else {
          this.mixinsFormScrollIntoView()
        }
      })
    },
    async assemblyData(){
      this.customerBlForm.orderId = this.id
      let seaBlJobCargoDTOList = this.customerBlForm.cargoList.map(item =>  {
        return {
          cargoId: item.id,
          nvoccHblNo: item.nvoccHblNo
        }
      })
      this.customerBlForm.seaBlJobCargoDTOList = seaBlJobCargoDTOList
      if (this.blId) {
        this.customerBlForm.blId = this.blId
      }
      let ShipperAddress = this.customerBlForm.consigneeAddress.toUpperCase()
      if(ShipperAddress.indexOf('To Order of Bank'.toUpperCase())>-1){
        this.customerBlForm.seaBlJobR24SaveDTOList.map(item=>{
          item.taxType = 'To Order Of Bank'
        })
      }else if(ShipperAddress.indexOf('TO ORDER')>-1){
        this.customerBlForm.seaBlJobR24SaveDTOList.map(item=>{
          item.taxType = 'Notify Party'
        })
      }else{
        this.customerBlForm.seaBlJobR24SaveDTOList.map(item=>{
          item.taxType = 'Consignee'
        })
      }
      return this.customerBlForm
    },
    async saveApi() {
      let data = await this.assemblyData()
      this.loading = true
      let res
      if (this.blId) {
        res = await seaCarrierBlEditApi(data)
      } else {
        res = await seaCarrierBlSaveApi(data)
        if(res.ok &&  res.content && Number(res.content) !== 0){
          this.$message.warning(this.$t(`sea.adjustExpensesAsNeededCode${res.content}`))
        }
      }
      this.loading = false
      if (res.ok) {
        if (this.blId && this.customerBlForm.carrierBlId || Number(this.editableTabsValue) === 5) {
          this.$emit('returnBillDetails')
        }
        return true
      } else {
        return false
      }
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
    // 发送补料
    sendReplenishment(){
      this.$refs.customerBlForm.validate(async (valid, obj) => {
        if (valid) {
          this.sendReplenishmentDialog = true
        }
      })
    },
    async sendReplenishmentCallBack(val){
      let data = await this.assemblyData()
      data.supplementaryAccount=val.supplementaryAccount
      this.loading = true
      let res
      if(this.blId){
         res = await updateAndSendSupplementary(data,this.blId)
      }else{ // 新建
        res = await saveAndSendSupplementaryApi(data)
      }
      this.loading = false
      if(res.ok){
        this.$message.success(this.$t('sea.submittedSuccessfully'))
        this.$emit('returnBillDetails')
      }

    },
    // 补料完成
    replenishmentCompleted(){
      this.$refs.customerBlForm.validate(async (valid, obj) => {
        if (valid) {
          this.replenishmentAccountNoDialog = true
        }
      })
    },
    async replenishmentAccountNoCallBack(val){
      let data = await this.assemblyData()
      data.comFileEditRequest=val
      this.loading = true
      let url
      if(data.id){
        url = supplementaryCompletedUpdateApi
      }else{
        url = supplementaryCompletedApi
      }
      let res = await url(data)
      this.loading = false
      if(res.ok){
        this.$message.success(this.$t('sea.submittedSuccessfully'))
        this.$emit('returnBillDetails')
      }
    },
    // * 打印
    printSample(id) {
      //  const { blNo = null, blStatus = null, containerNo = null, hsCode = null, memberId = null, sealNo = null, vessel = null, voyage = null, declareStatus = null, declareMethod = null, polCode = null, podCode = null } = this.batchPrintMultipleForm
      //  const queryConditionJson = { blNo, blStatus, containerNo, hsCode, memberId, sealNo, vessel, voyage, declareStatus, declareMethod, polCode, podCode }
      this.reportDialog.typeCode = 'SEA_MBL'
      const entityIdList = [id]
      this.reportDialog.data = { jobId: '', entityIdList }
      this.reportDialog.isShow = true
    },
    Eshipping() {
      this.$set(this.customerBlForm, 'shipperAddress', `ESHIPPING GLOBAL SUPPLY CHAIN
MANAGEMENT (SHENZHEN) CO.,LTD.
16F,AREA A,ANLIAN PLAZA NO.4018,
JINTIAN ROAD,FUTIAN DISTRICT,
SHENZHEN`)
    },
    SAMEASCONSIGNEE() {
      this.$set(this.customerBlForm, 'notifyAddress', lodash.cloneDeep(this.customerBlForm.consigneeAddress))
    },
    SPEEDIER() {
      this.$set(this.customerBlForm, 'secondNotifyAddress', `SPEEDIER LOGISTIC INC.
175-01 ROCKAWAY BLVD STE 305
JAMAICA, NY 11434
TEL: 718-373-5400 FAX: 607-590-3237
ESHIPPINGDOC@SPEEDIER-NYC.COM`)
    },
    // 费率信息ADD
    addRateInformation() {
      this.customerBlForm.userReferenceList.push({
        userReferenceNo: null,
        userReferenceType: null
      })
    },
    delRateInformation(index) {
      this.customerBlForm.userReferenceList.splice(index, 1)
    },
    displayForwarderInfoFlagChange(val){
      if(val){
        this.$set(this.customerBlForm,'forwarderInfo',
          `Eshipping Global Supply Chain Management (Shenzhen)Company Limited
16F, Area A, Anlian Plaza No.4018,Shenzhen Guangdong 518000
Shenzhen, Shenzhen, Guangdong - 518000
China`)
      }
    },
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
.userReferenceList{ overflow: auto; max-height: 150px;
  ::v-deep {
    .el-form-item{margin-bottom: 0px;}
    .el-form-item__label{ width: 80px; text-align: right}
    .el-form-item__content{ display: inline-block;margin: 0 10px;}
  }
}
.userReferenceBtn{ padding: 0}
.padding-limit{
  ::v-deep .el-input__inner{ padding-right: 57px}
}
.signatureAuthorized{
  ::v-deep .el-form-item__content{ margin-left: 10px}
}
</style>
