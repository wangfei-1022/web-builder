<template>
  <div class="box" v-loading="loading">
    <el-form :inline="true" :model="packingDataList" @submit.native.prevent ref="customerInformationForm">
      <!--      船期信息-->
      <!--      提单信息-->
      <div class="box_title">
        {{$t('sea.billInformation')}}
        <div class="operate-buttons-left" v-if="Number(editableTabsValue) === 5">
          <el-button v-if="packingDataList.memberBlSignType !== 1" type="primary" size="mini" @click="getPackingInformation()">{{$t('sea.adjustCustomerBill')}}</el-button>
        </div>
      </div>
      <div class="box_child">
        <div class="flex-bet" style="flex-wrap:nowrap;justify-content: flex-start">
          <!--            style="min-width: 430px"-->
          <div  style="min-width: 430px; margin-right:6%">
            <el-form-item :label="$t('sea.billType')" prop="blSignType" size="mini"  :rules="[ { required: true,message:$t('sea.placeholder'),trigger: 'change'} ]" class="shipping_method">
              <!--                <el-radio-group v-model="packingDataList.blSignType" :disabled="Number(editableTabsValue) === 4 && !!packingDataList.carrierBlId">-->
              <el-radio-group v-model="packingDataList.blSignType">
                <el-radio :label="1">MBL</el-radio>
                <el-radio :label="2" style="padding-left: 10px">HBL</el-radio>
              </el-radio-group>
            </el-form-item>
            <!--                签发方式-->
            <el-form-item :label="$t('sea.issuingMethod')" prop="releaseModeCode" size="mini"  :rules="[ { required: true,message:$t('sea.placeholder'),trigger: 'change'} ]" class="issuing_method">
              <el-radio-group v-model="packingDataList.releaseModeCode" @change="releaseModeCodeChange">
                <el-radio label="ORIGINAL">ORIGINAL</el-radio>
                <el-radio label="SWB">SWB</el-radio>
                <el-radio label="TELEX RELEASE">TELEX RELEASE</el-radio>
              </el-radio-group>
            </el-form-item>
            <!--                付款方式-->
            <el-form-item :label="$t('sea.payMethod')" prop="freightTermCode" size="mini"  :rules="[ { required: true,message:$t('sea.placeholder'),trigger: 'change'} ]" class="shipping_method">
              <el-radio-group v-model="packingDataList.freightTermCode" @change="freightTermChange">
                <el-radio v-for="(item, index) in freightTermList" :label="item.code" :key="index">{{item.englishName}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <!--            订舱号-->
          <el-form-item v-if="packingDataList.blSignType === 1" :label="$t('sea.SO')" prop="bookingNos" :rules="[ { required: true,message:$t('sea.placeholder'),trigger: 'change'} ]" style="width: 325px; margin-right:6%">
            <el-card class="box-card">
              <div v-for="(item,index) in packingDataList.bookingNos" :key="item" class="text item">
                {{item }}
                <i v-if="packingDataList.bookingNos.length>1" class="el-icon-circle-close" @click="bookingNosDel(item,index)"></i>
              </div>
            </el-card>
            <el-button type="text" size="medium" @click="getPackingInformation" icon="el-icon-circle-plus" class="icon soNoAdd blue"></el-button>
          </el-form-item>
          <!--            指定提单号-->
          <el-form-item v-if="packingDataList.blSignType === 1" key="mblNo" :label="$t('sea.specifyTheBillNumber')" prop="mblNo" :rules="[{ required: true,message:$t('sea.placeholder'),trigger: 'change'},{ validator: validateBillNo, trigger: 'blur' }]">
            <el-input type="text" v-model="packingDataList.mblNo" size="mini" :placeholder="$t('sea.placeholder')" ></el-input>
          </el-form-item>
          <!--            提单号-->
          <el-form-item v-if="packingDataList.blSignType === 2" :label="$t('sea.billNo')" prop="blNo" >
            <el-input type="text" v-trim v-model="packingDataList.blNo" :disabled="true" :placeholder="$t('sea.automaticallyGeneratedAfterSaving')"></el-input>
          </el-form-item>
        </div>
      </div>
      <!--      R24 反恐申报信息-->
      <R24  v-if="packingDataList.blSignType === 1" name="customer" :packingDataList="packingDataList" @declareBlFlagChange="declareBlFlagChange" @seaBlJobR24SaveDTOListChange="seaBlJobR24SaveDTOListChange" ref="R24"></R24>

      <!--   箱货信息   装箱信息-->
      <!--      v-if="customerInformationForm.orderState>=30 && customerInformationForm.orderState!==100"-->
      <div class="box_title" >

        <span>{{$t('sea.packingInformation')}}</span>
        <div class="operate-buttons-left" v-if="Number(editableTabsValue) === 4">
          <!--          v-if="[30,40].indexOf(customerInformationForm.orderState)>-1"-->
          <el-button v-if="packingDataList.blSignType === 2" type="primary" size="mini" @click="getPackingInformation()">{{$t('sea.getPackingInformation')}}</el-button>
          <span v-if="$isEmpty(packingDataList.cargoList)" style="margin-left: 15px; color: red; font-size: 12px">{{ $t('sea.packingInformationNote2') }}</span>
        </div>
      </div>
      <!--      v-if="customerInformationForm.orderState>=30 && customerInformationForm.orderState!==100"-->
      <div class="box_child" >
        <div class="flex-bet" style=" flex-wrap:nowrap">
          <el-form-item :label="$t('sea.sumCount')" prop="customerRate" class="box25"><div v-html="packingDataList.sumCount"></div></el-form-item>
          <el-form-item :label="$t('sea.sumQuantity')" prop="customerRate" class="box25"><span class="red">{{packingDataList.quantity}}</span> {{PACKAGES}}</el-form-item>
          <el-form-item :label="$t('sea.sumGrossWeight')" prop="customerRate" class="box25"><span class="red">{{packingDataList.weight || 0}}</span> KGS</el-form-item>
          <el-form-item :label="$t('sea.sumVolume')" prop="customerRate" class="box25"><span class="red">{{packingDataList.volume || 0}}</span> CBM</el-form-item>
        </div>
        <el-table :data="packingDataList.cargoList" header-row-class-name="el-grid-header el-grid-header-required " class="cargoList" style="width: 100%; margin: 10px 0;">
          <el-table-column prop="soNo" label="SO" class-name="not-required"></el-table-column>
          <el-table-column prop="containerNo" :label="$t('sea.containerNo')" class-name="not-required"></el-table-column>
          <el-table-column prop="hscode" label="HS CODE" class-name="not-required"></el-table-column>
          <el-table-column prop="quantity" :label="$t('sea.number')" class-name="not-required" width="80"></el-table-column>

          <el-table-column prop="packageType" :label="$t('sea.packageType')" class-name="not-required"></el-table-column>
          <el-table-column prop="grossWeight" :label="$t('sea.grossWeight')" class-name="not-required" width="100"></el-table-column>
          <el-table-column prop="volume" :label="$t('sea.volume')" class-name="not-required"></el-table-column>
          <el-table-column prop="cargoDesc" :label="$t('sea.marks')" class-name="not-required"></el-table-column>
          <el-table-column v-if="declareBlFlag" prop="nvoccHblNo" :label="$t('sea.nvoccFreightForwarderBillOfLadingNumber')">
            <template slot-scope="{row,$index}">
              <el-form-item label="" :prop="'cargoList.' + $index + '.nvoccHblNo'" size="mini" :rules="[ { required: true,message:$t('sea.placeholder'),trigger: 'change'} ]">
                <el-select v-model="row.nvoccHblNo" size="mini">
                  <el-option v-for="(item,i) in nvoccHblNoList" :label="item" :value="item" :key="i"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column  v-if="Number(editableTabsValue) === 4">
            <template slot-scope="{row,$index}">
              <el-button v-if="packingDataList.blSignType === 1 && packingDataList.cargoList.length> 1 || packingDataList.blSignType === 2" type="text" size="mini" @click="delCargo($index)">
                <i  class="icon el-icon-remove red" ></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
      <!--      装箱信息end-->
      <!--      提单处理说明-->
      <div class="box_title" v-if="packingDataList.blSignType === 1">
        <span>{{$t('sea.billProcessingInstructions')}}</span>
      </div>
      <div class="box_child" v-if="packingDataList.blSignType === 1">
        <!--        提单分发-->
        <div v-if="Number(orderDetailsData.carrierId) === 5">
          <div v-if="packingDataList.releaseModeCode === 'SWB'" class="requiredIcon">{{$t('sea.seaBillDistribution')}}</div>
          <div v-else class="requiredIcon">{{$t('sea.distributionOfOriginalBillOfLading')}}</div>
        </div>
        <div v-else class="requiredIcon">{{$t('sea.billDistribution')}}</div>
        <div class="billDistribution">
          <ul style="display: flex; justify-content: space-between; width: 1100px;">
            <!--            订舱方-->
            <li>
              <div style="text-align: center">{{$t('sea.bookingParty')}}</div>
              <div style="display: flex">
                <div class="originalBox">
                  <div>{{$t('sea.original')}}</div>
                  <el-form-item label="" prop="billNo" class="original">
                    <el-input type="text" v-trim v-model="packingDataList.bookingPartyOriginal" :disabled="noSwbDisabled.bookingPartyOriginal" @change="val=>distributionChange(val,'bookingPartyOriginal')" v-input-limit="[1,0]" size="mini" style="width: 50px"></el-input>
                  </el-form-item>
                </div>
                <div class="originalBox">
                  <div>{{$t('sea.duplicate')}}</div>
                  <el-form-item label="" prop="billNo" class="original">
                    <el-input type="text" v-trim v-model="packingDataList.bookingPartyCopy" @change="billCopySun" v-input-limit="[1,0]" size="mini" style="width: 50px"></el-input>
                  </el-form-item>
                </div>
              </div>
            </li>
            <!--            发货人-->
            <li>
              <div style="text-align: center">{{$t('sea.contact')}}</div>
              <div style="display: flex">
                <div class="originalBox">
                  <div>{{$t('sea.original')}}</div>
                  <el-form-item label="" prop="billNo" class="original">
                    <el-input type="text" v-trim v-model="packingDataList.shipperOriginal" :disabled="noSwbDisabled.shipperOriginal" @change="val=>distributionChange(val,'shipperOriginal')" v-input-limit="[1,0]" size="mini" style="width: 50px"></el-input>
                  </el-form-item>
                </div>
                <div class="originalBox">
                  <div>{{$t('sea.duplicate')}}</div>
                  <el-form-item label="" prop="billNo" class="original">
                    <el-input type="text" v-trim v-model="packingDataList.shipperCopy" @change="billCopySun" v-input-limit="[1,0]" size="mini" style="width: 50px"></el-input>
                  </el-form-item>
                </div>
              </div>
            </li>
            <!--            货代-->
            <li>
              <div style="text-align: center">{{$t('sea.freightForwarding')}}</div>
              <div style="display: flex">
                <div class="originalBox">
                  <div>{{$t('sea.original')}}</div>
                  <el-form-item label="" prop="billNo" class="original">
                    <el-input type="text" v-trim v-model="packingDataList.freightForwarderOriginal" :disabled="noSwbDisabled.freightForwarderOriginal" @change="val=>distributionChange(val,'freightForwarderOriginal')" v-input-limit="[1,0]" size="mini" style="width: 50px"></el-input>
                  </el-form-item>
                </div>
                <div class="originalBox">
                  <div>{{$t('sea.duplicate')}}</div>
                  <el-form-item label="" prop="billNo" class="original">
                    <el-input type="text" v-trim v-model="packingDataList.freightForwarderCopy" @change="billCopySun" v-input-limit="[1,0]" size="mini" style="width: 50px"></el-input>
                  </el-form-item>
                </div>
              </div>
            </li>
            <!--            收货人-->
            <li>
              <div style="text-align: center">{{$t('sea.consignee')}}</div>
              <div style="display: flex">
                <div class="originalBox">
                  <div>{{$t('sea.original')}}</div>
                  <el-form-item label="" prop="billNo" class="original">
                    <el-input type="text" v-trim v-model="packingDataList.consigneeOriginal" :disabled="noSwbDisabled.consigneeOriginal" @change="val=>distributionChange(val,'consigneeOriginal')" v-input-limit="[1,0]" size="mini" style="width: 50px"></el-input>
                  </el-form-item>
                </div>
                <div class="originalBox">
                  <div>{{$t('sea.duplicate')}}</div>
                  <el-form-item label="" prop="billNo" class="original">
                    <el-input type="text" v-trim v-model="packingDataList.consigneeCopy" @change="billCopySun" v-input-limit="[1,0]" size="mini" style="width: 50px"></el-input>
                  </el-form-item>
                </div>
              </div>
            </li>
            <!--            通知方-->
            <li>
              <div style="text-align: center">{{$t('sea.notifyingParty')}}</div>
              <div style="display: flex">
                <div class="originalBox">
                  <div>{{$t('sea.original')}}</div>
                  <el-form-item label="" prop="billNo" class="original">
                    <el-input type="text" v-trim v-model="packingDataList.notifyOriginal" :disabled="noSwbDisabled.notifyOriginal" @change="val=>distributionChange(val,'notifyOriginal')" v-input-limit="[1,0]" size="mini" style="width: 50px"></el-input>
                  </el-form-item>
                </div>
                <div class="originalBox">
                  <div>{{$t('sea.duplicate')}}</div>
                  <el-form-item label="" prop="billNo" class="original">
                    <el-input type="text" v-trim v-model="packingDataList.notifyCopy" @change="billCopySun" v-input-limit="[1,0]" size="mini" style="width: 50px"></el-input>
                  </el-form-item>
                </div>
              </div>
            </li>
            <!--            第二通知方-->
            <li>
              <div style="text-align: center">{{$t('sea.secondNotifyingParty')}}</div>
              <div style="display: flex">
                <div v-if="Number(orderDetailsData.carrierId) !== 5" class="originalBox">
                  <div>{{$t('sea.original')}}</div>
                  <el-form-item label="" prop="secondNotifyOriginal" class="original" key="secondNotifyOriginal">
                    <el-input type="text" v-trim v-model="packingDataList.secondNotifyOriginal" v-input-limit="[1,0]" size="mini" style="width: 50px" @change="secondNotifyingPartyChange('secondNotifyCopy')"></el-input>
                  </el-form-item>
                </div>
                <div class="originalBox">
                  <div>{{$t('sea.duplicate')}}</div>
                  <el-form-item label="" prop="secondNotifyCopy" class="original" key="secondNotifyCopy">
                    <el-input type="text" v-trim v-model="packingDataList.secondNotifyCopy" v-input-limit="[1,0]" size="mini" style="width: 50px" @change="secondNotifyingPartyChange('secondNotifyOriginal')"></el-input>
                  </el-form-item>
                </div>
              </div>
            </li>

          </ul>
        </div>

        <div style="display: flex; width: 100%; justify-content: space-between; margin-top: 10px">
          <!--          海运费-->
          <div style="width: 49%">
            <div>{{$t('sea.shippingFee')}}</div>
            <div class="shippingFee" >
              <!--              付款地点-->
              <el-form-item  :label="$t('sea.whereToPay')" prop="oceanPlace" >
                <el-input type="text" v-trim v-input-auto="'upperCase'" v-model="packingDataList.oceanPlace" style="width: 467px" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>
              </el-form-item>
              <div style="display: flex">
                <el-form-item  :label="$t('sea.currency')" prop="oceanCurrency" >
                  <el-select v-model="packingDataList.oceanCurrency" filterable size="mini">
                    <el-option v-for="opt in currencyOpts" :key="opt" :label="opt" :value="opt" />
                  </el-select>
                </el-form-item>
                <div>
                  <!--                付款方-->
                  <el-form-item  :label="$t('sea.payer')" prop="oceanPayer" >
                    <el-select v-model="packingDataList.oceanPayer" filterable size="mini">
                      <el-option v-for="opt in payerOpts" :key="opt" :label="opt" :value="opt" />
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="packingDataList.oceanPayer === 'Other'" :label="$t('sea.remark')" prop="oceanPayerDesc">
                    <el-input v-model="packingDataList.oceanPayerDesc" size="mini" :placeholder="$t('sea.ifThereAreOtherCases')"></el-input>
                  </el-form-item>
                </div>
              </div>


            </div>
          </div>
          <!--          制单处理请求-->
          <div style="width: 49%">
            <div>{{$t('sea.orderProcessingRequest')}}</div>
            <div class="shippingFee voucherPreparation">
              <div style="display: flex">
                <el-form-item  :label="$t('sea.requestItem')" prop="documentationRequestTerm" >
                  <el-select v-model="processingObj.documentationRequestTerm" filterable size="mini" style="width: 90%" >
                    <el-option v-for="opt in requestItemOpts" :key="opt" :label="opt" :value="opt" />
                  </el-select>
                </el-form-item>
                <el-form-item  :label="$t('sea.requestItemRemarks')" prop="documentationRequestRemark" >
                  <el-input type="text" v-trim v-input-auto="'upperCase'" v-model="processingObj.documentationRequestRemark"  style="width: 90%" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>
                </el-form-item>
                <el-button  type="text" icon="el-icon-circle-plus" class="icon blue userReferenceBtn"  @click="addProcessing" style=" margin-top: -6px;"></el-button>
              </div>
              <div v-for="(item,i) in packingDataList.seaBlJobDocumentationRequestDTOList" :key="i" style="display: flex">
                <div style="width: 36%;margin-right: 5.5%;">{{item.documentationRequestTerm}}</div>
                <div style="width: 36%">{{item.documentationRequestRemark}}</div>
                <el-button  type="text" icon="el-icon-remove" class="icon red userReferenceBtn"  @click="delProcessing(i)" style="margin-top: -10px"></el-button>
              </div>
            </div>


          </div>
        </div>
        <!--        付款指示-->
        <div class="content_box payment_instructions" style="display: block">
          <div>{{$t('sea.paymentInstructions')}}</div>
          <div class="billDistribution " style="display: flex">
            <el-form-item  :label="$t('sea.surchargeType')">
              <el-select  v-model="paymentInstr.surchargeType" size="mini" :placeholder="$t('sea.pleaseEnter')">
                <el-option label="Origin Surcharge" value="Origin Surcharge"></el-option>
                <el-option label="Destination Surcharge" value="Destination Surcharge"></el-option>
                <el-option label="Other Surcharge" value="Other Surcharge"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item  :label="$t('sea.paymentMethod')">
              <el-select v-model="paymentInstr.surchargePaymentType" size="mini" :placeholder="$t('sea.pleaseEnter')">
                <el-option label="PREPAID" value="PREPAID"></el-option>
                <el-option label="COLLECT" value="COLLECT"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item  :label="$t('sea.placeOfPayment')" style="width: 250px">
              <el-input v-model="paymentInstr.surchargePlace" size="mini" :placeholder="$t('sea.pleaseEnter')" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item  :label="$t('sea.currency')">
              <el-select v-model="paymentInstr.surchargeCurrency" size="mini" :placeholder="$t('sea.pleaseEnter')">
                <el-option v-for="item in currenciesOps" :key="item.code" :label="item.code" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item  :label="$t('sea.payer')">
              <el-select v-model="paymentInstr.surchargeParty" size="mini" :placeholder="$t('sea.pleaseEnter')" @change="surchargePartyChange">
                <el-option v-for="opt in payerOpts" :key="opt" :label="opt" :value="opt" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="paymentInstr.surchargeParty === 'Other'" :label="$t('sea.remark')" prop="otherDesc">
              <el-input v-model="paymentInstr.otherDesc" size="mini" :placeholder="$t('sea.ifThereAreOtherCases')"></el-input>
            </el-form-item>
            <el-button  type="text" icon="el-icon-circle-plus" class="icon blue userReferenceBtn"  @click="addPaymentInstructions" style="margin-top: 16px"></el-button>
            <!--            <el-button   v-show="paymentInstr.userReferenceList.length >1" type="text" icon="el-icon-remove" class="icon red userReferenceBtn"  @click="delRateInformation(index)"></el-button>-->
          </div>
          <div v-for="(item,i) in packingDataList.seaBlJobSurchargeSaveDTOList" :key="i" class="seaBlJobSurchargeSaveDTOList" style="display: flex" >
            <div>{{item.surchargeType}}</div>
            <div>{{item.surchargePaymentType}}</div>
            <div style="width: 250px;word-break: break-all;">{{item.surchargePlace}}</div>
            <div>{{item.surchargeCurrency}}</div>
            <div>{{item.surchargeParty}}</div>
            <div>{{item.otherDesc}}</div>
            <el-button  type="text" icon="el-icon-remove" class="icon red userReferenceBtn"  @click="delPaymentInstructions(i)" style="margin-top: -2px;"></el-button>
          </div>
        </div>

        <div class="showOnBL" style="display: flex; width: 100%; justify-content: space-between; margin-top: 10px; flex-wrap: wrap">
          <el-form-item  :label="$t('sea.showOnBL')" prop="blRemark" style="width: 49%; margin: 10px 0 0 0" >
            <el-input class="textareaH" style=" width: 100%" type="textarea" :placeholder="$t('sea.pleaseEnter')" rows="4"
                      v-model="packingDataList.blRemark" v-input-auto="'upperCase'" maxlength="1000" show-word-limit>
            </el-input>
          </el-form-item>
          <el-form-item  :label="$t('sea.doesNotShowOnBL')" prop="otherBlRemark" style="width: 49%; margin: 10px 0 0 0" >
            <el-input class="textareaH" style="width: 100%" type="textarea" :placeholder="$t('sea.pleaseEnter')" rows="4"
                      v-model="packingDataList.otherBlRemark" v-input-auto="'upperCase'" maxlength="1000" show-word-limit>
            </el-input>
          </el-form-item>
          <!--          回执副本接收邮箱-->
          <el-form-item  :label="$t('sea.receiptCopyReceiptEmail')" prop="emails" style="width: 49%; margin: 10px 0 0 0" :rules="[{ validator: validateEmail, trigger: 'change' }]">
            <el-select v-model="packingDataList.emails" multiple filterable allow-create default-first-option :placeholder="$t('sea.pleaseEnter')" style="width: 100%">
              <el-option v-for="item in emailArr" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
      <!--      提单处理说明end-->
    </el-form>
    <div class="btn_box" :style="{width: `calc(100% - ${withoutAnimation ? 180 :54}px)`}">
      <el-button  type="primary" size="mini" @click="returnBillDetails">{{ $t('sea.returnBillDetails') }}</el-button>
      <el-button v-if="!blId && packingDataList.blSignType === 1" type="primary" @click="replenishmentCompleted" size="mini">{{ $t('sea.replenishmentCompleted') }}</el-button>
      <el-button  type="primary" size="mini" @click="next">{{ $t('sea.next') }}</el-button>
      <!--      <el-button type="danger" size="mini" @click="exitCustoms">{{ $t('sea.exitCustoms') }}</el-button>-->
    </div>
    <el-dialog :title="Number(editableTabsValue) === 4 ? $t('sea.getPackingInformation'): $t('sea.adjustCustomerBill')" :visible.sync="dialogShow" :close-on-click-modal="false" :before-close="closeDialog" width="600px" class="dialog-box">
      <!--      <el-form :inline="true" :model="dialogForm" @submit.native.prevent ref="dialogForm" style="display: flex" class="dialogForm">-->

      <!--      </el-form>-->
      <el-tree :data="treeData" :props="defaultProps" node-key="value" @node-click="handleNodeClick" ref="tree" show-checkbox style="max-height: 400px; overflow: auto"></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="submitDialog">{{$t('sea.save')}}</el-button>
        <el-button size="mini" @click="closeDialog">{{$t('sea.cancel')}}</el-button>
      </span>
    </el-dialog>
    <replenishmentAccountNo v-if="replenishmentAccountNoDialog" :showDialog.sync="replenishmentAccountNoDialog"  @submitCallBack="replenishmentAccountNoCallBack"></replenishmentAccountNo>

  </div>
</template>
<script>
import URL from '@/api/urlTranslator'
import { getDmnTermItemList } from "@/api/seaExport"
import {
  blSupplementaryCompletedApi,
  customerAndBlNoListApi,
  seaCarrierContainerInfoListApi,
  seaContainerCalculateApi,
  seaContainerInfoListApi, seaCustomerAndBlNoListApi, seaEmailHistoryApi,
  seaSoAndContainerListApi, supplementaryCompletedApi, supplementaryCompletedUpdateApi
} from "@/api/seaExportOrder"
import lodash from 'lodash'
import { validEmail } from "@/utils/validate"
import currencyArr from "./json/currency"
import R24 from "@/views/cargo/v0/SeaExport/components/order/R24";
import {getCurrenciesListApi} from "@/api/common";
import replenishmentAccountNo from "@/views/cargo/v0/SeaExport/components/order/Popup/replenishmentAccountNo";
import orderMixin from "./orderMixin"

export default {
  name: 'CustomerBlEditA',
  mixins: [orderMixin],
  props: {
    uploadRadioType: { type: String, default: null },
    orderDetailsData: { type: Object, default: () => {} },
    dataForm: { type: Object, default: () => {} },
    editableTabsValue: { type: String, default: '4' },
    blId: { type: String, default: null },
  },
  components:{R24,replenishmentAccountNo},
  data() {
    return {
      vm: this,
      loading: false,
      id: this.$route.query.id,
      bookingJobId: this.$route.query.bookingJobId,
      // dataForm: {
      //   receipt: null
      // },
      freightTermList: [],
      customerInformationForm: {},
      packingDataList: {
        blNo: null,
        cargoList: [],
        soList: [],
        sumCount: null,
        unboxed: null
      },
      dialogShow: false,
      dialogForm: {},
      defaultProps: {
        children: 'containers',
        label: 'label'
      },
      treeData: [],
      PACKAGES: 'PACKAGES',
      payerOpts: [
        "Shipper",
        "Forwarder",
        "Consignee",
        "Notify Party",
        "Other"
      ],
      requestItemOpts: [
        "Show destination agent in BL",
        "Show Cargo Weight_Volume By Container in BL"
      ],
      emailArr: [],
      currenciesOps:[],
      processingObj:{},
      processingObjCopy:{
        documentationRequestTerm:null,
        documentationRequestRemark:null
      },
      paymentInstr:{
      },
      paymentInstrCopy:{
        surchargeType:null,
        surchargePaymentType:null,
        surchargePlace:null,
        surchargeCurrency:null,
        surchargeParty:null,
      },
      declareBlFlag:null,
      nvoccHblNoList:[],
      noSwbDisabled:{
        bookingPartyOriginal:false,
        bookingPartyCopy:false,
        shipperOriginal:false,
        shipperCopy:false,
        freightForwarderOriginal:false,
        freightForwarderCopy:false,
        consigneeOriginal:false,
        consigneeCopy:false,
        notifyOriginal:false,
        notifyCopy:false,
        secondNotifyOriginal:false,
        secondNotifyCopy:false,
      },
      blDistributionError:null,
      replenishmentAccountNoDialog:false,
      firstCal:true
    }
  },
  filters: {
    ownerTypeF(type, vm) {
      if (type === 1) {
        return vm.$t('sea.true')
      } else if (type === 2) {
        return vm.$t('sea.false')
      }
    }
  },
  computed: {
    url() {
      return URL
    },
    currencyOpts() {
      return currencyArr
    },
    withoutAnimation () {
      return this.$store.state.app.sidebar.opened // 需要监听的数据
    },
    isR24(){
      return ['CA','US','TR','JP'].indexOf(this.packingDataList.podCode.toUpperCase().substr(0,2))>-1
    }
  },
  watch: {
    'packingDataList.cargoList'(val) {
      let change = true
      if (this.packingDataList.id && this.firstCal) {
          change = false
      }
      this.calculate(val,change)
    }
  },
  created() {
    if (!this.id) {
      this.id = this.orderDetailsData.id
    }
    this.packingDataList = this.dataForm
    if(!this.packingDataList.seaBlJobSurchargeSaveDTOList){
      this.packingDataList.seaBlJobSurchargeSaveDTOList =[]
    }
    if(!this.packingDataList.seaBlJobDocumentationRequestDTOList){
      this.packingDataList.seaBlJobDocumentationRequestDTOList =[]
    }
    if(this.isR24){
      if(this.$isNotEmpty(this.packingDataList.seaBlJobR24SaveDTOList) && this.packingDataList.podCode.toUpperCase().substr(0,2) !==  'JP'){
        this.declareBlFlag = this.packingDataList.seaBlJobR24SaveDTOList[0].declareBlFlag
      }
    }
    if(this.declareBlFlag && this.$isNotEmpty(this.packingDataList.seaBlJobR24SaveDTOList)){
      this.nvoccHblNoListCal(this.packingDataList.seaBlJobR24SaveDTOList)
    }

    // 贸易条款
    getDmnTermItemList({ termCode: 'PAYMODE' }).then(res => {
      this.freightTermList = res.content
    })
    this.getSeaEmailHistoryApi()
    // let change = true
    // if (this.packingDataList.id) {
    //   change = false
    // }
    // this.calculate(this.packingDataList.cargoList,change)
    const currenciesList = getCurrenciesListApi().then(res => {
      if (res.ok) {
        this.currenciesOps = res.content
      }
    })
    this.paymentInstr = lodash.cloneDeep(this.paymentInstrCopy)
    this.processingObj = lodash.cloneDeep(this.processingObjCopy)
    // console.log('orderDetailsData:', this.orderDetailsData)
    // this.dataForm = this.orderDetailsData
  },
  mounted() {
    if (this.packingDataList.mblNo) {
      this.$nextTick(() => {
        this.secondNotifyingPartyChange('mblNo')
      })
    }
  },
  methods: {
    // 指定提单号判断
    async validateBillNo(rule, value, callback) {
      if (value) {
        this.loading = true
        const res = await customerAndBlNoListApi({id: this.packingDataList.id, blNo: value })
        this.loading = false
        if (res.content) {
          callback()
        } else {
          callback(new Error(this.$t('sea.thisBillOfLadingNumberAlreadyExists')))
        }
      }
      callback()
    },
    validateSecondNotifyOriginal(rule, value, callback) {
      if (!this.packingDataList.secondNotifyCopy && !this.packingDataList.secondNotifyOriginal && this.packingDataList.secondNotifyCopy !== 0 && this.packingDataList.secondNotifyOriginal !== 0) {
        callback(new Error(' '))
      }
      callback()
    },
    validateEmail(rule, value, callback) {
      if (this.$isNotEmpty(value)) {
        let isSome = value.some(item => !item || !validEmail(item))
        if (isSome) {
          callback(new Error(this.$t('blInfo.emailError')))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    secondNotifyingPartyChange(val) {
      this.$refs.customerInformationForm.validateField([val])
    },
    calculate(val,change = true) {
      let sumCountContainer = {}
      let sumQuantity = 0
      let sumGrossWeight = 0
      let sumVolume = 0
      let bookingNosArr = []
      val.map(item => {
        sumCountContainer[item.containerNo] = item.containerType
        sumQuantity += item.quantity
        sumGrossWeight += item.grossWeight
        sumVolume += item.volume
        bookingNosArr.push(item.soNo)
      })
      this.$set(this.packingDataList, 'bookingNos', lodash.uniq(bookingNosArr))
      // 如果存在多个订舱号，则按照后四位尾号最小的那个填入
      const bookingNos4 = this.packingDataList.bookingNos.map(item=> Number(item.substr(-4).replace(/[a-zA-Z]+/g,"") ))
      let minArr =bookingNos4.indexOf(Math.min(...bookingNos4))
      if(change){
        this.$set(this.packingDataList,'mblNo',this.packingDataList.bookingNos[minArr])
      }
      this.firstCal = false
      if (this.$isEmpty(val)) {
        this.packingDataList.sumCount = ''
        this.packingDataList.quantity = sumQuantity
        this.packingDataList.weight = sumGrossWeight
        this.packingDataList.volume = sumVolume
        this.PACKAGES = ''
        return
      }
      let packageTypeOne = val[0].packageType
      const isSame = val.some(item => item.packageType !== packageTypeOne)
      if (isSame) {
        this.PACKAGES = 'PACKAGES'
      } else {
        this.PACKAGES = packageTypeOne
      }
      this.packingDataList.quantity = sumQuantity
      this.packingDataList.weight = sumGrossWeight.toFixed(3)
      this.packingDataList.volume = sumVolume.toFixed(3)
      let sumCountContainerType = {}
      for (let key in sumCountContainer) {
        if (!sumCountContainerType[sumCountContainer[key]]) {
          sumCountContainerType[sumCountContainer[key]] = 1
        } else {
          sumCountContainerType[sumCountContainer[key]]++
        }
      }
      let str = ''
      for (let key in sumCountContainerType) {
        str += `<span style="color: red">${sumCountContainerType[key]}</span> * ${key} `
      }
      this.packingDataList.sumCount = str
    },
    handleNodeClick(data) {
      console.log(data)
    },
    async getPackingInformation() {
      this.dialogShow = true
      this.loading = true
      let url, id
      if (Number(this.editableTabsValue) === 4) {
        url = seaSoAndContainerListApi
        id = this.orderDetailsData.bookingJobId
      } else {
        url = seaCustomerAndBlNoListApi
        id = this.packingDataList.hblIds[0]
      }
      const res = await url(id)
      this.loading = false
      if (res.ok) {
        if (Number(this.editableTabsValue) === 5) {
          res.content.map(item => {
            item.containers = item.blNos
          })
        }
        this.treeData = res.content
      }
    },
    // 选择付款方式
    freightTermChange(freightTermCode) {
      this.freightTermList.map(item => {
        if (item.code === freightTermCode) {
          this.dataForm.freightTerm = item.englishName
        }
      })
    },
    async delCargo(i) {
      this.packingDataList.cargoList.splice(i, 1)
    },
    // 历史邮箱
    async getSeaEmailHistoryApi() {
      this.loading = true
      const res = await seaEmailHistoryApi()
      this.loading = false
      if (res) {
        this.emailArr = res.content
      }
    },
    async submitDialog() {
      const treeChecked = lodash.compact(this.$refs.tree.getCheckedKeys())
      console.log('treeChecked,', treeChecked)
      if (this.$isEmpty(treeChecked)) {
        this.$message.warning(this.$t('sea.pleaseSelectData'))
        return
      }

      this.loading = true
      let res
      if (Number(this.editableTabsValue) === 4) {
        res = await seaContainerInfoListApi({containerIds: treeChecked.join(',')})
      } else {
        res = await seaCarrierContainerInfoListApi({idList: treeChecked.join(',')})
      }
      this.loading = false
      if (res.ok) {
        res.content.map(item => {
          let isSame = this.packingDataList.cargoList.some(item2 => item.id === item2.id)
          if (!isSame) {
            this.packingDataList.cargoList.push(item)
          }
          if (Number(this.editableTabsValue) === 5) {
            let hblIds = [...this.packingDataList.hblIds, ...treeChecked]
            this.packingDataList.hblIds = lodash.uniq(hblIds)
          }
        })
        this.closeDialog()
      }
    },
    closeDialog() {
      this.dialogShow = false
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
    // 添加分单号
    soNoAddFun() {

    },
    // 删除订舱号
    bookingNosDel(soNo, i) {
      this.packingDataList.bookingNos.splice(i, 1)
      this.packingDataList.cargoList.map((item, index) => {
        if (soNo === item.soNo) {
          this.packingDataList.cargoList.splice(index, 1)
        }
      })
    },

    releaseModeCodeChange(val) {
      this.dataForm.releaseMode = val
      if(Number(this.orderDetailsData.carrierId) === 5){
        this.$set(this.packingDataList,'bookingPartyOriginal',null)
        this.$set(this.packingDataList,'bookingPartyCopy',null)
        this.$set(this.packingDataList,'shipperOriginal',null)
        this.$set(this.packingDataList,'shipperCopy',null)
        this.$set(this.packingDataList,'freightForwarderOriginal',null)
        this.$set(this.packingDataList,'freightForwarderCopy',null)
        this.$set(this.packingDataList,'consigneeOriginal',null)
        this.$set(this.packingDataList,'consigneeCopy',null)
        this.$set(this.packingDataList,'notifyOriginal',null)
        this.$set(this.packingDataList,'notifyCopy',null)
        Object.keys(this.noSwbDisabled).map(key=>{
          this.$set(this.noSwbDisabled, key , false)
        })
        this.blDistributionError = null
      }
    },
    distributionChange(val,name){ // blDistributionError
      if(Number(this.orderDetailsData.carrierId) === 5){ // cocos
        if(this.packingDataList.releaseModeCode === 'SWB'){
          let sum = Number(this.packingDataList.bookingPartyOriginal) + Number(this.packingDataList.shipperOriginal) +Number(this.packingDataList.freightForwarderOriginal) +
            Number(this.packingDataList.consigneeOriginal) +Number(this.packingDataList.notifyOriginal)
          if(sum> 3){
            this.blDistributionError = this.$t('sea.blDistributionError1')
            this.$message.error(this.blDistributionError)
          }else{
            this.blDistributionError = null
          }
        }else{
          if(val){
            Object.keys(this.noSwbDisabled).map(key=>{
              if(name !== key){
                this.$set(this.noSwbDisabled, key , true)
              }
            })
            if(val> 3){
              this.blDistributionError = this.$t('sea.blDistributionError2')
              this.$message.error(this.blDistributionError)
              return
            }else{
              this.blDistributionError = null
            }
          }else {
            Object.keys(this.noSwbDisabled).map(key=>{
              this.$set(this.noSwbDisabled, key , false)
            })
          }
        }
      }
    },
    billCopySun(){
      let sum = Number(this.packingDataList.bookingPartyCopy) +Number(this.packingDataList.shipperCopy) +Number(this.packingDataList.freightForwarderCopy) +
        Number(this.packingDataList.consigneeCopy) +Number(this.packingDataList.notifyCopy) + Number(this.packingDataList.secondNotifyCopy)
      if(sum>9){
        this.blDistributionError = this.$t('sea.blDistributionError3')
      }else{
        this.blDistributionError = null
      }
    },
    calculateBillOfLadingDistribution(){
      if(this.packingDataList.releaseModeCode !== 'SWB'){
        return true
      }
      let total = Number(this.packingDataList.bookingPartyOriginal) + Number(this.packingDataList.bookingPartyCopy) +
        Number(this.packingDataList.shipperOriginal) + Number(this.packingDataList.shipperCopy) +
          Number( this.packingDataList.freightForwarderOriginal) + Number(this.packingDataList.freightForwarderCopy) +
            Number(this.packingDataList.consigneeOriginal) + Number(this.packingDataList.consigneeCopy) +
              Number(this.packingDataList.notifyOriginal )+ Number(this.packingDataList.notifyCopy) +
                Number(this.packingDataList.secondNotifyOriginal) + Number(this.packingDataList.secondNotifyCopy)
      return total <= 3
    },
    checkDistributionBlLading(){
      return this.packingDataList.blSignType === 1 && !(this.packingDataList.bookingPartyOriginal || this.packingDataList.bookingPartyCopy ||
        this.packingDataList.shipperOriginal || this.packingDataList.shipperCopy ||
        this.packingDataList.freightForwarderOriginal || this.packingDataList.freightForwarderCopy ||
        this.packingDataList.consigneeOriginal || this.packingDataList.consigneeCopy ||
        this.packingDataList.notifyOriginal || this.packingDataList.notifyCopy ||
        this.packingDataList.secondNotifyOriginal || this.packingDataList.secondNotifyCopy)
    },
    async next() {
      this.$refs.customerInformationForm.validate(async valid => {
        if (valid) {
          if (this.checkDistributionBlLading()) {
            this.$message.error(this.$t('sea.distributionIsAtLeastRequired'))
            return
          }
          if(Number(this.orderDetailsData.carrierId) === 5){
            if(this.blDistributionError){
              this.$message.error(this.blDistributionError)
              return
            }
          }
          if(!this.calculateBillOfLadingDistribution()){

            this.$message.warning(this.$t('sea.distributionIsAtSumCannotBeGreaterThan3'))
            return
          }
          let ids = []
          ids = this.packingDataList.cargoList.map(item => item.id)
          if (this.$isNotEmpty(ids)) {
            this.loading = true
            const res = await seaContainerCalculateApi({ids: ids.join(',')})
            this.loading = false
            if (res.ok) {
              this.packingDataList.count = res.content.count
              this.packingDataList.grossWeight = res.content.grossWeight
              this.packingDataList.packageType = res.content.packageType
              this.packingDataList.quantity = res.content.quantity
              this.packingDataList.volume = res.content.volume
              this.packingDataList.containerDTOList = res.content.containerDTOList
              this.packingDataList.soNoSet = res.content.soNoSet
              this.packingDataList.partOfContainer = res.content.partOfContainer

              this.$emit('updateForm', this.packingDataList)
              this.$emit('changePage', 2)
            }
          } else {
            this.$emit('updateForm', this.packingDataList)
            this.$emit('changePage', 2)
          }
        } else {
          this.mixinsFormScrollIntoView()
          return false
        }
      })
    },
    addProcessing(){
      let isNull = Object.values(this.processingObj).some(val => !val)
      if(isNull){
        this.$message.warning(this.$t('sea.pleaseEnterCompleteData'))
      }else{
        this.packingDataList.seaBlJobDocumentationRequestDTOList.push(lodash.cloneDeep(this.processingObj))
        this.processingObj = lodash.cloneDeep(this.processingObjCopy)
      }
    },
    delProcessing(i){
      this.packingDataList.seaBlJobDocumentationRequestDTOList.splice(i,1)
      this.$forceUpdate()
    },
    addPaymentInstructions(){
      let isNull = Object.values(this.paymentInstr).some(val => !val)
      if(isNull){
        this.$message.warning(this.$t('sea.pleaseEnterCompleteData'))
      }else{
        this.packingDataList.seaBlJobSurchargeSaveDTOList.push(lodash.cloneDeep(this.paymentInstr))
        this.paymentInstr = lodash.cloneDeep(this.paymentInstrCopy)
      }
    },
    delPaymentInstructions(i){
      this.packingDataList.seaBlJobSurchargeSaveDTOList.splice(i,1)
      this.$forceUpdate()
    },
    // 勾选r24是否申报
    declareBlFlagChange(val){
      if(this.packingDataList.podCode.toUpperCase().substr(0,2) !==  'JP'){
        this.declareBlFlag = val
      }
      if(!val){
        this.nvoccHblNoList = []
        this.packingDataList.cargoList.map(item=>{
          item.nvoccHblNo = null
        })
      }
    },
    nvoccHblNoListCal(val){
      this.nvoccHblNoList = []
      val.map(item=>{
        item.seaBlJobR24HblSaveDTOList.map(item2=>{
          this.nvoccHblNoList.push(item2.nvoccHblNo)
        })
      })
      if(this.declareBlFlag){
        this.packingDataList.cargoList.map(item=>{
          let has = this.nvoccHblNoList.indexOf(item.nvoccHblNo) > -1
          if(!has){
            item.nvoccHblNo = null
          }
        })
      }
    },
    seaBlJobR24SaveDTOListChange(val){
      this.nvoccHblNoListCal(val)
      this.$set(this.packingDataList,'seaBlJobR24SaveDTOList',val)
    },
    surchargePartyChange(val){
      if(val === 'Other'){
        this.$set(this.paymentInstr,'otherDesc',null)
      }else{
        delete this.paymentInstr.otherDesc
      }
    },
    // 补料完成
    replenishmentCompleted(){
      this.$refs.customerInformationForm.validate(async (valid, obj) => {
        if (valid) {
          this.replenishmentAccountNoDialog = true
        }
      })
    },
    async assemblyData(){
      this.packingDataList.orderId = this.id
      let seaBlJobCargoDTOList = this.packingDataList.cargoList.map(item =>  {
        return {
          cargoId: item.id,
          nvoccHblNo: item.nvoccHblNo
        }
      })
      this.packingDataList.seaBlJobCargoDTOList = seaBlJobCargoDTOList
      if (this.blId) {
        this.packingDataList.blId = this.blId
      }
      let ShipperAddress = this.packingDataList.consigneeAddress.toUpperCase()
      if(ShipperAddress.indexOf('To Order of Bank'.toUpperCase())>-1){
        this.packingDataList.seaBlJobR24SaveDTOList.map(item=>{
          item.taxType = 'To Order Of Bank'
        })
      }else if(ShipperAddress.indexOf('TO ORDER')>-1){
        this.packingDataList.seaBlJobR24SaveDTOList.map(item=>{
          item.taxType = 'Notify Party'
        })
      }else {
        this.packingDataList.seaBlJobR24SaveDTOList.map(item => {
          item.taxType = 'Consignee'
        })
      }
      return lodash.cloneDeep(this.packingDataList)
    },
    async replenishmentAccountNoCallBack(val){
      let data = await this.assemblyData()
      if(this.checkDistributionBlLading()){
        data.bookingPartyOriginal = 3
        data.bookingPartyCopy = 3
      }
      if(!data.shipperAddress){
        data.shipperAddress = 'SI COMPLETE'
      }
      if(!data.consigneeAddress){
        data.consigneeAddress = 'SI COMPLETE'
      }
      if(!data.notifyAddress){
        data.notifyAddress = 'SI COMPLETE'
      }

      if (!data.typeOfMovement) {
        data.typeOfMovement = 'FCL/FCL'
      }
      if (!data.marks) {
        data.marks = 'N/M'
      }

      data.comFileEditRequest=val
      this.loading = true
      let url
      console.log(data.id)
      if(data.id){
        url = supplementaryCompletedUpdateApi
      }else{
        url = blSupplementaryCompletedApi
      }
      let res = await url(data)
      this.loading = false
      if(res.ok){
        this.$message.success(this.$t('sea.submittedSuccessfully'))
        this.$emit('returnBillDetails')
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
  ::v-deep .el-form-item--medium{
    .el-form-item__content{ line-height: 28px}
    .el-form-item__label{ line-height: 28px}
  }
}
.box_child{border: solid 1px rgba(121, 121, 121, 1); padding: 20px 30px; background: #fff; margin-bottom: 15px;
  .box25{ width: 20%}
}
::v-deep .el-form--inline .el-form-item{ display: block}
.icon{ font-size: 28px; transition: all 0.2s ease 0s; cursor: pointer;user-select: none;
  &:hover{ transform: scale(1.1)}
}
.blue{ color: #1890ff}
.red{color: #ff4949}
//**
.oneToOne{font-size: 28px; font-weight: 500; transform: rotate(25deg); padding: 8px 12px; border-radius: 15px; margin-top: 30px;}
.unmatched{ border:4px solid rgb(255,204,102); color:rgb(255,204,102)  }
.matched{ border:4px solid rgb(255,255,255); color:rgb(255,255,255) }
.btn_box{ position: fixed; z-index: 9; bottom: 0px; right: 0; text-align: right; background: #fff; padding: 15px 50px 15px 0}
.box-card {  width: 220px; max-height: 100px; min-height: 80px; overflow: auto;
  ::v-deep .el-card__body{ padding: 8px 12px;}
}
.soNoAdd{ position: absolute; right: -40px;top: -12px}
.requiredIcon{
  &:before{ content: "*"; color: red}
}
.originalBox{ text-align: center; margin: 0 5px}
.original{ margin-right: 0}
.billDistribution{background: rgb(242,242,242);  padding: 10px 0;}
.shippingFee{background: rgb(242,242,242); padding: 20px 20px 0 6px; overflow: auto; height: 180px}
::v-deep .el-form-item__label{ width: 85px; text-align: right}
.showOnBL ::v-deep {
  .el-form-item__label{width: 100%; text-align: left;}
  .el-form-item__content{ width: 100%}
}
.content_box{display: flex; width: 100%; justify-content: space-between; margin-top: 10px}
.font16{ font-size: 16px;font-weight: 700;    font-family: 'Microsoft Tai Le Bold', 'Microsoft Tai Le';}
.payment_instructions ::v-deep {
  .el-form-item{ margin-left: 50px; width: 10%; margin-bottom: 0}
  .el-form-item__label{ display: block; text-align: left;}
}
.voucherPreparation  {
  //display: flex;
  ::v-deep {
    .el-form-item{ width: 40%}
    .el-form-item__label{ display: block; text-align: left;}
    .el-form-item__content{ width: 100%}
  }
}

.seaBlJobSurchargeSaveDTOList{     background: #f2f2f2;
  div { width: 20%; margin:5px 10px 0  50px ; width: 10%}
}

::v-deep .el-grid-header-required  {
  th:not(.not-required){
    div:before {
      content: '*';
      font-size: 20px;
      position: absolute;
      top: 3px;
      width: 20px;
      margin-left: -10px;
      display: inline-block;
      height: 50%;
      color: red
    }
  }
}
.cargoList{
  ::v-deep .el-form-item{ margin: 10px 0px}
}
</style>
