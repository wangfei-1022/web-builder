<template>
  <div class="box" v-loading="loading">
    <el-form :inline="true" :model="customerBlForm" @submit.native.prevent ref="customerBlForm" label-position="top">
      <!--      提单信息-->
      <div class="box_title">{{$t('sea.billInformation')}}</div>
      <div class="box_child">
        <div class="flex-bet" style="width: 100%; padding: 0 7%">
          <div style="width: 47.5%" class="block">
            <el-form-item label="1.Shipper Insert Name Address and Phone/Fax" prop="shipperAddress" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'},
             { validator: (rule, value, callback)=>validateCharacterWrap(rule, value, callback,35,5), trigger: 'blur' } ]">
              <el-input class="textareaH" style="height: 131px;" type="textarea" :placeholder="$t('sea.pleaseEnter')" v-input-auto="'EN_num_symbol'" v-model="customerBlForm.shipperAddress" maxlength="179"
                        @input="descInput('shipperAddress',35,5)"  @keydown.native="descKey($event)"></el-input>
              <el-button @click="Eshipping" type="primary" size="mini" style="position: absolute; top: -37px;right: 0;">Eshipping</el-button>
            </el-form-item>
            <el-form-item label="2.Consignee Insert Name Address and Phone/fax" prop="consigneeAddress" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'}
            ,{ validator: (rule, value, callback)=>validateCharacterWrap(rule, value, callback,35,5), trigger: 'blur' }]">
              <el-input class="textareaH" style="height: 131px;" type="textarea" :placeholder="$t('sea.pleaseEnter')" v-input-auto="'EN_num_symbol'" v-model="customerBlForm.consigneeAddress" maxlength="179"
                        @input="descInput('consigneeAddress',35,5)"  @keydown.native="descKey($event)"></el-input>
            </el-form-item>
            <el-form-item label="3.Notify Party Insert Name Address and Phone/Fax" prop="notifyAddress" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'}
            ,{ validator: (rule, value, callback)=>validateCharacterWrap(rule, value, callback,35,5), trigger: 'blur' }]">
              <el-input class="textareaH" style="height: 119px;" type="textarea" placeholder="(It is agreed that no responsibility shall attach
to the Carrier or his agents for failure to notify)" v-input-auto="'EN_num_symbol'" v-model="customerBlForm.notifyAddress" maxlength="179"
                        @input="descInput('notifyAddress',35,5)" @keydown.native="descKey($event)"></el-input>
              <el-button @click="SAMEASCONSIGNEE" type="primary" size="mini" style="position: absolute; top: -37px;right: 0;">SAME AS CONSIGNEE</el-button>
            </el-form-item>
          </div>
          <div style="width: 47.5%;">
            <el-form-item label="Booking No." prop="bookingNo" style="width: 40%;" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'} ]">
              <el-autocomplete
                class="inline-input"
                v-model="customerBlForm.bookingNo"
                :fetch-suggestions="querySearchContractNo"
                :placeholder="$t('sea.pleaseEnter')"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item label="Bill of Lading No." style="width: 40%;" >
              {{ customerBlForm.blNo }}
            </el-form-item>
            <el-form-item label="Export References Carrier Rate Reference Number:" prop="rateReferenceNo" style="width: 100%;" >
              <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.rateReferenceNo" ></el-input>
            </el-form-item>
            <div class="userReferenceList">
              <div v-for="(item,index) in customerBlForm.userReferenceList" :key="index">
                <!--          用户参考类型-->
                <el-form-item :label="$t('sea.userReferenceType')" :prop="'userReferenceList.' + index + '.userReferenceType'" >
                  <el-select  class="w178" v-model="item.userReferenceType" :placeholder="$t('sea.placeholder')" filterable  size="mini">
                    <el-option v-for="item in userReferenceTypeOptions" :label="item" :value="item" :key="item"></el-option>
                  </el-select>
                </el-form-item>
                <!--            用户参考号码-->
                <el-form-item :label="$t('sea.userReferenceNumber')" :prop="'userReferenceList.' + index + '.userReferenceNo'" >
                  <el-input  class="w178" v-model="item.userReferenceNo"  v-input-auto="'en_num_symbol'" maxlength="200" show-word-limit size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>
                </el-form-item>
                <el-button  type="text" icon="el-icon-circle-plus" class="icon blue userReferenceBtn"  @click="addRateInformation"></el-button>
                <el-button   v-show="customerBlForm.userReferenceList.length >1" type="text" icon="el-icon-remove" class="icon red userReferenceBtn"  @click="delRateInformation(index)"></el-button>
              </div>
            </div>
            <el-form-item label="Forwarding Agent and References FMC/CHB No." prop="fmcNo" style="width: 100%;" >
              <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.fmcNo"></el-input>
            </el-form-item>
            <el-form-item label="Point and Country of Origin" style="width: 100%;" prop="originCountry" >
              <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.originCountry"></el-input>
            </el-form-item>
            <el-form-item prop="secondNotifyAddress" :rules="[ { required: customerBlForm.blSignType !==1,message:$t('sea.pleaseEnter'),trigger: 'change'} ]" :label="customerBlForm.blSignType ===1 ? 'Also Notify Party-routing & Instructions' : 'For delivery of goods please apply to' " style="width: 100%;" >
              <el-input type="textarea" v-input-auto="'EN_num_symbol'" v-model="customerBlForm.secondNotifyAddress" maxlength="1000" show-word-limit rows="5" ></el-input>
              <el-button v-if="customerBlForm.blSignType ===2" @click="SPEEDIER" type="primary" size="mini" style="position: absolute; top: -37px;right: 0;">SPEEDIER</el-button>
            </el-form-item>
          </div>
        </div>
        <div class="flex-bet" style="width: 100%; padding: 0 7%">
          <el-form-item label="4. Combined Transport* Pre-Carriage by" prop="combinedVessel" style="width: 21%;" >
            <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.combinedVessel" ></el-input>
          </el-form-item>
          <el-form-item label="5. Combined Transport* Place of Receipt" prop="receiptCode" style="width: 21%;" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'},
           { validator:validateLength,message:``, trigger: 'change' }]" >
            <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.receiptCode" :maxlength="customerBlForm.blSignType ===1? 22 : 250" show-word-limit  class="padding-limit"></el-input>
          </el-form-item>
          <el-form-item label="Service Contract No." style="width: 21%;" prop="serviceContractNo" >
            <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.serviceContractNo" ></el-input>
          </el-form-item>
          <el-form-item label="Doc Form No." style="width: 21%;" prop="docFormNo">
            <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.docFormNo" ></el-input>
          </el-form-item>

          <el-form-item label="6. Ocean Vessel Voy. No." style="width: 21%;" prop="vesselVoyageFormat" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'} ]">
            <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.vesselVoyageFormat" maxlength="250"></el-input>
          </el-form-item>
          <el-form-item label="7.Port of Loading" style="width: 21%;" prop="pol" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'},
           { validator:validateLength,message:``, trigger: 'change' } ]" >
            <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.pol" :maxlength="customerBlForm.blSignType ===1? 22 : 250" show-word-limit  class="padding-limit"></el-input>
            <!--            <cargo-advance-select-->
            <!--              ref="polCodeSelect"-->
            <!--              :url="url.qf.seaport"-->
            <!--              :default-value="customerBlForm.polCode"-->
            <!--              :headers="['英文名称','五字码','中文名称']"-->
            <!--              :fields="['englishName','code5','chineseName']"-->
            <!--              tag-value="code5"-->
            <!--              tag-name="enPortName"-->
            <!--              :placeholder="$t('sea.polHold')"-->
            <!--              remote-->
            <!--              @parentCallBack="(data)=>{-->
            <!--                    customerBlForm.polCode=data.code5-->
            <!--                    customerBlForm.pol=data.englishName-->
            <!--                  }"-->
            <!--            />-->
          </el-form-item>
          <el-form-item label="Type of Movement" style="width: 21%;" prop="typeOfMovement" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'} ]">
            <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.typeOfMovement"></el-input>
          </el-form-item>
          <el-form-item style="width: 21%;" >
          </el-form-item>
          <el-form-item label="8.Port of Discharge" style="width: 21%;" prop="pod" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'},
           { validator:validateLength,message:``, trigger: 'change' } ]">
            <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.pod" :maxlength="customerBlForm.blSignType ===1? 22 : 250" show-word-limit  class="padding-limit"></el-input>
          </el-form-item>
          <el-form-item label="9. Combined Transport* Place of Delivery" prop="destinationCode" style="width: 21%;" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'},
           { validator:validateLength,message:``, trigger: 'change' } ]" >
            <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.destinationCode" :maxlength="customerBlForm.blSignType ===1? 22 : 250" show-word-limit  class="padding-limit"></el-input>
          </el-form-item>
          <el-form-item style="width: 21%;" ></el-form-item>
          <el-form-item style="width: 21%;" ></el-form-item>

          <el-form-item label="Marks & Nos." style="width: 21%;" prop="marks" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'}
          , { validator: (rule, value, callback)=>validateCharacterWrap(rule, value, callback,15,200),message:`${$t('sea.atMost5TextsCanBeAddedA')} 15 X 200  ${$t('sea.atMost5TextsCanBeAddedB')}`, trigger: 'blur' }]">
            <el-input type="textarea" v-input-auto="'EN_num_symbol'" v-model="customerBlForm.marks" maxlength="3199" rows="5" class="textareaH" style="height: 205px"
                      @input="descInput('marks',15,200)"  @keydown.native="descKey($event)"></el-input>
          </el-form-item>
          <div style="width: 21%;">
            <el-form-item label="Quantity No. of Container of Packages" style="width: 100%;" >
              {{ customerBlForm.quantity }} {{ customerBlForm.packageType }}
            </el-form-item>
            <el-form-item label="Container No. & Seal No." style="width: 100%;" >
              <div style="max-height: 117px; overflow: auto">
                <div v-for="(item,index) in customerBlForm.containerDTOList" :key="index">{{item.containerNo}} / {{item.sealNo}}</div>
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
            <el-form-item label="Description of Goods" style="width: 100%;" prop="goodsDesc" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'}
            , { validator: (rule, value, callback)=>validateCharacterWrap(rule, value, callback,30,100),message:`${$t('sea.atMost5TextsCanBeAddedA')} 30 X 100  ${$t('sea.atMost5TextsCanBeAddedB')}`, trigger: 'blur' }]" >
              <el-input type="textarea" v-input-auto="'EN_num_symbol'" v-model="customerBlForm.goodsDesc" maxlength="3099"  rows="5"
                        @input="descInput('goodsDesc',30,100)" @keydown.native="descKey($event)"></el-input>
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
                <span class="red">*</span>11. Freight & Charges Revenue Tons
              </template>
              <template slot-scope="{row,$index}">
                <el-form-item label="" :prop="'chargeList.' + $index + '.chargeName'" :rules="[{ required: true, message: $t('BLInfo.placeholder'), trigger: 'change'},]">
                  <span v-if="!row.isEdit">{{row.chargeName}}</span>
                  <el-input v-else v-trim v-model="row.chargeName" v-input-auto="'EN_num_symbol'" type="text" maxlength="1000" size="mini" ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column>
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
                <span class="red">*</span>Amount
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
                <span class="red">*</span>
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
            <el-input type="text"  v-input-auto="'upperCase'" v-model="customerBlForm.freightInfo" maxlength="1000"></el-input>
          </el-form-item>
        </div>
        <div class="flex-bet" style="width: 100%; padding: 0 7%">
          <div style="width: 21%">
            <el-form-item :label="$t('sea.issuingMethod')" style="width: 100%;" >
              <el-input type="text" v-model="customerBlForm.releaseMode" maxlength="1000" :disabled="true"></el-input>
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
          <el-form-item label="Signed for the carrier" style="width: 47%;"  >
            COSCO SHIPPING LINES CO.,LTD.
          </el-form-item>
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
import userReferenceTypeOptions from "@/views/cargo/v0/SeaExport/components/order/json/userReferenceTypeList";
import orderMixin from "./orderMixin"

export default {
  name: 'CarrierBlEdit2HBL',
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
      contractNoList: []
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
        let textArr = value.replace(/\r?\n/g, "<br />").split("<br />")
        // var maxarr = []
        //遍历数组对长度10以上的进行切割
        // textArr.forEach(item => {
        //   for (var i = 0; i < item.length; i += characterNum) {
        //     maxarr.push(item.slice(i, i + characterNum));
        //   }
        // })
        // if (maxarr.filter(item => item.length > 0).length > rowNum) {
        if (textArr.length > rowNum) {
          callback(new Error(`${this.$t('sea.atMost5TextsCanBeAdded')} ${characterNum} X ${rowNum}  ${this.$t('sea.atMost5TextsCanBeAdded2')}`))
        }else{
          callback()
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

      // let reg=new RegExp("(.{"+rowNum+"})","g");
      // //先除回车换行符的字符串，不去除影响字符个数计算
      // let result = this.customerBlForm[val].replace(/[\r\n]/g,'').replace(reg, "$1\n");
      // //获取colNum行
      // console.log(result)
      // let arr = result.split("\n").slice(0,colNum);
      //   this.customerBlForm[val] = arr.join("\n");
      console.log('enter,t,',this.enter)
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
    async save() {
      // 客户提单
      if (Number(this.editableTabsValue) === 4) {
        this.save1()
      } else if (Number(this.editableTabsValue) === 5) {
        this.save2()
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
          } else if (this.customerBlForm.blSignType === 2) { // HBL
            console.log(this.cargoIds, ids, lodash.isEqual(this.cargoIds, ids))
            if (lodash.isEqual(this.cargoIds, ids)) { // 无箱货信息变更
              this.$confirm(this.$t('sea.unpackedInformationChange'), this.$t('sea.tips'), {
                confirmButtonText: this.$t('sea.determine'),
                cancelButtonText: this.$t('sea.cancel'),
                type: 'warning'
              }).then(async() => {
                this.saveApi()
              })
            } else { // 有箱货信息变更
              this.$confirm(this.$t('sea.thereIsAChangeInTheCargoInformation'), this.$t('sea.tips'), {
                confirmButtonText: this.$t('sea.determine'),
                cancelButtonText: this.$t('sea.cancel'),
                type: 'warning'
              }).then(async() => {
                this.saveApi()
              })
            }
          }

        } else { // 未关联船司提单
          console.log('未关联船司提单')
        }

      }
    },
    async save2() {
      this.$refs.customerBlForm.validate(valid => {
        if (valid) {
          this.saveApi()
        } else {
          this.mixinsFormScrollIntoView()
        }
      })
    },
    async saveApi() {
      this.customerBlForm.orderId = this.id
      this.loading = true
      let res
      let seaBlJobCargoDTOList = this.customerBlForm.cargoList.map(item =>  {
        return {
          cargoId: item.id,
        }
      })
      this.customerBlForm.seaBlJobCargoDTOList = seaBlJobCargoDTOList
      if (Number(this.editableTabsValue) === 4) {
        if (this.blId) {
          this.customerBlForm.blId = this.blId
          res = await seaBlEditSaveApi(this.customerBlForm)
        } else {
          res = await seaBlSaveApi(this.customerBlForm)
        }
      } else {
        if (this.blId) {
          this.customerBlForm.blId = this.blId
          res = await seaCarrierBlEditApi(this.customerBlForm)
        } else {
          res = await seaCarrierBlSaveApi(this.customerBlForm)
          if(res.ok &&  res.content && Number(res.content) !== 0){
            this.$message.warning(this.$t(`sea.adjustExpensesAsNeededCode${res.content}`))
          }
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
    closeDialog() {
      this.dialogShow = false
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
      this.$set(this.customerBlForm, 'notifyAddress', `SAME AS CONSIGNEE`)
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
.userReferenceList{ overflow: auto; max-height: 150px;
  ::v-deep {
    .el-form-item__content{ display: inline-block;margin: 0 10px;}
  }
}
.userReferenceBtn{ padding: 0}
.padding-limit{
  ::v-deep .el-input__inner{ padding-right: 57px}
}
</style>
