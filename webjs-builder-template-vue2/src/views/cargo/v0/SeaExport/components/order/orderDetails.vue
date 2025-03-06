<template>
  <!--  ULL COMMENT '订单状态:1o-草稿,2o-待订舱, 3o-待制单, 4o-待补料, 5o-待签发，60-已签发，80订单处理中 100-已取消'，LLCOMMENT'提交时间·,-->
  <div class="box" v-loading="loading">
    <el-form :inline="true" :model="customerInformationForm" @submit.native.prevent ref="customerInformationForm">
      <!--      客户信息-->
      <div class="box_title">
        <span>{{$t('sea.customerInformation')}}</span>
        <div class="operate-buttons-left">
          <!--          应收/应付费用费用状态为”未维护“时可见-->
          <el-button v-if="orderDetailsData.isUnlocked && customerInformationForm.payableType === 0 && customerInformationForm.receivableType === 0" type="primary" size="mini" @click="changeEntrustingUnit">{{$t('sea.change')}}</el-button>
        </div>
      </div>
      <div class="box_child">
        <div class="flex-bet" style="justify-content: start">
          <div style="width: 30%">
            <el-form-item :label="$t('sea.requester')" prop="customerId">{{customerInformationForm.customerName}}</el-form-item>
            <!--          <el-form-item :label="$t('sea.salesperson')" prop="contactCnName2" class="box25">{{customerInformationForm.customerRate2}}</el-form-item>-->
            <el-form-item :label="$t('sea.customerLevel')" prop="customerRate" >{{customerInformationForm.customerRate}}</el-form-item>
<!--            <el-form-item :label="$t('sea.settlementMethod')" prop="settlementMode">{{customerInformationForm.settlementModeName}}</el-form-item>-->
          </div>
          <div>
            <el-form-item :label="$t('sea.customerContact')" prop="customerContact">{{customerInformationForm.customerContact}}</el-form-item>
            <el-form-item :label="$t('sea.email')" prop="customerEmail">{{customerInformationForm.customerEmail}}</el-form-item>
            <el-form-item :label="$t('sea.phone')" prop="customerTel">{{customerInformationForm.customerTel}}</el-form-item>
          </div>
        </div>

      </div>
      <!--      委托信息-->
      <div class="box_title">
        <span>{{$t('sea.entrustmentInformation')}}</span>
        <div class="operate-buttons-left">
          <!--{{ dynamicHeightFactor }}, {{ isShowingMoreSearchCondition }}, {{ searchItemHeight }}-->
          <el-button v-if="orderDetailsData.isUnlocked && customerInformationForm.orderState <= 20" type="primary" size="mini" @click="clientEdit">{{$t('sea.edit')}}</el-button>
          <el-button v-if="orderDetailsData.isUnlocked && customerInformationForm.orderState <= 20" type="primary" size="mini" @click="clientBooking">{{$t('sea.booking')}}</el-button>
          <el-button v-if="orderDetailsData.isUnlocked && customerInformationForm.orderState != 60 && customerInformationForm.orderState != 70 && customerInformationForm.orderState != 100" type="danger"  size="mini" @click="clientCcancel">{{$t('sea.cancel')}}</el-button>
          <el-button v-if="customerInformationForm.orderState != 100" type="primary"  size="mini" @click="clientUploadEntrustment">{{$t('sea.uploadEntrustment')}}</el-button>
        </div>
      </div>
      <div class="box_child">
        <div class="flex-bet" style="justify-content: start; position: relative">
          <div class="bookingStatus" v-if="businessTagVal.length>1" :class="businessTagVal.length>1 ? 'businessTagBox' : ''" style="border: 2px solid #1890ff; color: #1890ff;">
            <div v-if="customerInformationForm.businessTag.ovlFirstLegFlag">{{ $t('sea.overseasPosition') }}</div> 
            <div v-if="customerInformationForm.businessTag.fbaFbwFlag">FBA&FBW</div> 
            <div v-if="customerInformationForm.businessTag.seaCollectionFlag">{{ $t('sea.seaCollection') }}</div> 
            <div v-if="customerInformationForm.businessTag.fullLinkFlag">{{ $t('sea.fullLink') }}</div> 
            <div v-if="customerInformationForm.businessTag.lclFlag">{{ $t('sea.lcl') }}</div> 
            <div v-if="customerInformationForm.businessTag.onlyPodServiceFlag">
              <div style="line-height: 50px;">{{ $t('sea.destinationServiceOnly') }}</div>
              <div style="font-size: 21px;line-height: 34px;">
                {{customerInformationForm.businessTag.customsClearanceFlag ? $t('sea.customsClearance') : '' }}
                {{customerInformationForm.businessTag.customsClearanceFlag && customerInformationForm.businessTag.trailerFlag? '+' : '' }}
                {{customerInformationForm.businessTag.trailerFlag ? $t('sea.trailer') : '' }}
              </div>
            </div> 
          </div>
          <!-- <div v-else-if="customerInformationForm.businessTag.fbaFbwFlag" class="bookingStatus" style="border: 2px solid #1890ff; color: #1890ff;">FBA&FBW</div> -->
          <!-- <div v-else-if="customerInformationForm.businessTag.seaCollectionFlag" class="bookingStatus" style="border: 2px solid #1890ff; color: #1890ff;">{{ $t('sea.seaCollection') }}</div> -->
          <!-- <div v-else-if="customerInformationForm.businessTag.fullLinkFlag" class="bookingStatus" style="border: 2px solid #1890ff; color: #1890ff;">{{ $t('sea.fullLink') }}</div> -->
          <!-- <div v-else-if="customerInformationForm.businessTag.lclFlag" class="bookingStatus" style="border: 2px solid #1890ff; color: #1890ff;">{{ $t('sea.lcl') }}</div> -->
          <!-- <div v-else-if="customerInformationForm.businessTag.onlyPodServiceFlag" class="bookingStatus" style="border: 2px solid #1890ff; color: #1890ff;width: 245px; height: 90px;">
            
          </div> -->
          <div  style="width: 25%">
            <!--              收货地-->
            <el-form-item :label="$t('sea.placeOfReceipt')" prop="receiptCode" size="mini">{{customerInformationForm.receiptCode}}</el-form-item>
            <el-form-item :label="$t('sea.pol')" prop="polCode" >{{customerInformationForm.pol}}</el-form-item>
            <el-form-item :label="$t('sea.pod')" prop="podCode">{{customerInformationForm.pod}}</el-form-item>
            <!--              交货地-->
            <el-form-item :label="$t('sea.placeOfDelivery')" prop="contactCnName" size="mini">{{customerInformationForm.destinationCode}}</el-form-item>
            <!--              运输条款-->
<!--            <el-form-item :label="$t('sea.polTransportTerm')" prop="transportTermCode" size="mini" class="shipping_method">-->
<!--              {{customerInformationForm.transportTerm}}-->
<!--              {{customerInformationForm.nonShippingServiceFlag ? $t('sea.nonShippingServiceFlag'): ''}}-->
<!--            </el-form-item>-->

            <el-form-item :label="$t('sea.polTransportTerm')" prop="transportTermCode" size="mini"  class="shipping_method">

              <el-select v-if="customerInformationForm.isTransportTermEdit" v-model="customerInformationForm.transportTermCode" @change="transportTermChange" style="width: 178px">
                <el-option v-for="(item, index) in transportTermList" :label="item.englishName" :value="item.code" :key="index"></el-option>
              </el-select>
              <span v-else>
                {{customerInformationForm.transportTerm}}
                {{customerInformationForm.nonShippingServiceFlag ? $t('sea.nonShippingServiceFlag'): ''}}
              </span>
              <template v-if="customerInformationForm.isTransportTermEdit">
                <i class="icon el-icon-folder-checked blue" @click="saveTransportTerm" style="margin-right: 10px"></i>
                <i class="icon el-icon-folder-delete red"  @click="noSaveTransportTerm"></i>
              </template>
              <template v-else>
                <el-button  type="text" icon="el-icon-edit-outline"  v-if="orderDetailsData.isUnlocked" class="icon blue"  @click="transportTermEdit"></el-button>
              </template>
              <el-checkbox v-if="customerInformationForm.isTransportTermEdit && customerInformationForm.transportTermCode.indexOf('DOOR') > -1" style="display: block"
                           v-model="customerInformationForm.nonShippingServiceFlag">{{ $t('sea.nonShippingServiceFlag') }}
              </el-checkbox>

            </el-form-item>


            <el-form-item :label="$t('sea.transshipmentInBatches')" prop="contactCnName" size="mini" class="shipping_method">{{customerInformationForm.batchFlag? '是': '否'}}/{{customerInformationForm.transitFlag? '是': '否'}}</el-form-item>
          </div>
          <!--            船司-->
          <div  style="width: 25%">
            <el-form-item :label="$t('sea.shipBoss')"  prop="carrierName">{{customerInformationForm.carrierName}}</el-form-item>
            <!--              开航日期-->
            <el-form-item :label="$t('sea.sailingDate')" prop="etd">{{formatDate(customerInformationForm.etd, 'YYYY-MM-DD') }}</el-form-item>
            <el-form-item :label="$t('sea.eta')" prop="eta">{{formatDate(customerInformationForm.eta, 'YYYY-MM-DD HH:mm') }}</el-form-item>
            <el-form-item :label="$t('sea.shipName')" prop="vessel" size="mini">{{customerInformationForm.vessel}}</el-form-item>
            <el-form-item :label="$t('sea.voyage')" prop="voyage" size="mini">{{customerInformationForm.voyage}}</el-form-item>
            <el-form-item :label="$t('sea.cargoType')" prop="goodsType" size="mini">{{customerInformationForm.goodsType}}</el-form-item>
            <el-form-item :label="$t('sea.remarks')" prop="remarks" size="mini" class="issuing_method">
              <el-input  v-if="customerInformationForm.isRemarksEdit" v-model="customerInformationForm.remarks" size="mini" style="width: 180px" />
              <span v-else>{{customerInformationForm.remarks}}</span>
              <template v-if="customerInformationForm.isRemarksEdit">
                <i class="icon el-icon-folder-checked blue" @click="saveRemarks" style="margin-right: 10px"></i>
                <i class="icon el-icon-folder-delete red"  @click="noSaveRemarks"></i>
              </template>
              <template v-else>
                <el-button  type="text" icon="el-icon-edit-outline"  v-if="orderDetailsData.isUnlocked" class="icon blue"  @click="remarksEdit"></el-button>
              </template>
            </el-form-item>
          </div>
          <!--            箱型/箱量/毛重-->
          <div   style="width: 25%">
            <div class="flex-bet">
              <div>
                <el-form-item :label="$t('sea.boxTypeArr')">
                  <div v-for="(item,index) in customerInformationForm.containerList" :key="index">
                    {{item.englishName}} * {{item.ctnrNum}} {{ownerType[item.ownerType]}} {{item.weight}} KGS/箱
                  </div>
                </el-form-item>
              </div>

            </div>
            <div>
              <el-form-item :label="$t('sea.shippingMethod')" prop="blSignType" size="mini" class="shipping_method">
                {{customerInformationForm.transportModeName}}
              </el-form-item>
              <el-form-item :label="$t('sea.billType')" prop="blSignType" size="mini" class="shipping_method">
                <span v-if="customerInformationForm.blSignType === 1">MBL</span>
                <span v-else>HBL</span>
              </el-form-item>
              <!--                付款方式-->
              <el-form-item :label="$t('sea.payMethod')" prop="freightTermCode" size="mini" class="shipping_method">{{customerInformationForm.freightTermCode}}</el-form-item>
            </div>
            <!--                签发方式-->
            <el-form-item :label="$t('sea.issuingMethod')" prop="releaseModeCode" size="mini" class="issuing_method">{{customerInformationForm.releaseModeCode}}</el-form-item>

            <el-form-item :label="$t('sea.marks')" prop="goodsDesc" size="mini" class="issuing_method">{{customerInformationForm.goodsDesc}}</el-form-item>

          </div>
          <div style="width:25%">
              <!--                增值服务-->
            <el-form-item :label="$t('sea.valueAddedServices')" prop="contactCnName" size="mini" style="max-height: 200px; overflow: auto">
              <span v-for="item in customerInformationForm.exportServiceList" :key="item.serviceCode">{{item.serviceChineseName}}</span>
            </el-form-item>

            <!--              贸易条款-->
            <el-form-item :label="$t('sea.tradeTerms')" prop="tradeTermCode" size="mini">
              <el-select  v-if="customerInformationForm.isTradeTermEdit" v-model="customerInformationForm.tradeTermCode"
                          :placeholder="$t('sea.placeholder')" filterable @change="tradeTermChange" size="mini" style="width: 180px">
                <el-option v-for="item in tradeTermsList" :label="item.englishName" :value="item.code" :key="item.id"></el-option>
              </el-select>
              <span v-else>{{customerInformationForm.tradeTermCode}}</span>
              <template v-if="customerInformationForm.isTradeTermEdit">
                <i class="icon el-icon-folder-checked blue" @click="saveTradeTerm" style="margin-right: 10px"></i>
                <i class="icon el-icon-folder-delete red"  @click="noSaveTradeTerm"></i>
              </template>
              <template v-else>
                <el-button  type="text" icon="el-icon-edit-outline"  v-if="orderDetailsData.isUnlocked" class="icon blue"  @click="tradeTermEdit"></el-button>
              </template>
            </el-form-item>
            <!--            派送地址 -->
            <el-form-item v-if="showDeliveryAddress" :label="$t('sea.deliveryAddress')" prop="deliveryAddress"  :rules="[required]">
              <el-input v-if="customerInformationForm.isTradeTermEdit || customerInformationForm.isBusinessTagEdit" v-model="customerInformationForm.deliveryAddress" size="mini" maxlength="1000" style="width: 180px"/>
              <span v-else>{{customerInformationForm.deliveryAddress}}</span>
            </el-form-item>
            <!--                业务标签-->
            <el-form-item :label="$t('sea.businessTag')" prop="tradeTermCode" size="mini">
              <div v-if="customerInformationForm.isBusinessTagEdit" style="display: inline-block; vertical-align: middle;">
                <el-checkbox-group v-model="businessTagVal" class="businessTag" @change="businessTagChange" style="width:150px">
                  <el-checkbox label="ovlFirstLegFlag" :disabled="businessTagVal.length > 0 && !businessTagVal.includes('ovlFirstLegFlag')">{{ $t('sea.overseasPosition') }}</el-checkbox>
                  <el-checkbox label="fullLinkFlag"  :disabled="businessTagVal.length > 0 && !businessTagVal.includes('fullLinkFlag')">{{ $t('sea.fullLink') }}</el-checkbox>
                  <el-checkbox label="fbaFbwFlag"  :disabled="businessTagVal.length > 0 && !businessTagVal.includes('fbaFbwFlag')">FBA&FBW</el-checkbox>
                  <el-checkbox label="seaCollectionFlag" :disabled="businessTagVal.length > 0 && !businessTagVal.includes('seaCollectionFlag')">{{ $t('sea.seaCollection') }}</el-checkbox>
                  <el-checkbox label="onlyPodServiceFlag" :disabled="businessTagVal.length > 0 && !businessTagVal.includes('onlyPodServiceFlag')">{{ $t('sea.destinationServiceOnly') }}</el-checkbox>
                </el-checkbox-group>
                <div v-if="businessTagVal.includes('onlyPodServiceFlag')">
                  <el-checkbox v-model="customerInformationForm.businessTag.customsClearanceFlag">{{ $t('sea.customsClearance') }}</el-checkbox>
                  <el-checkbox v-model="customerInformationForm.businessTag.trailerFlag">{{ $t('sea.trailer') }}</el-checkbox>
                </div>
              </div>
              <span v-else>{{ getBusinessTagName}}</span>
              <div v-if="customerInformationForm.isBusinessTagEdit" style="display: inline-block; vertical-align: middle;">
                <i class="icon el-icon-folder-checked blue" @click="saveBusinessTag" style="margin-right: 10px"></i>
                <i class="icon el-icon-folder-delete red"  @click="noBusinessTag"></i>
              </div>
              <template v-else>
                <el-button  type="text" icon="el-icon-edit-outline"  v-if="orderDetailsData.isUnlocked" class="icon blue"  @click="businessTagEdit"></el-button>
              </template>
            </el-form-item>
          </div>
        </div>
      </div>

      <!--      订舱信息-->
      <div class="box_title" v-if="[0,1,2,3,10].indexOf(customerInformationForm.jobState)>-1 && customerInformationForm.orderState!==100">
        <span>{{$t('sea.bookingInformation')}}</span>
        <div class="operate-buttons-left">
          <span v-if="customerInformationForm.jobState === 2" style="color: #000; margin-right: 10px; font-size: 16px">{{ $t('sea.bookingSerialNumber') }}:{{bookingDataForm.thirdSerialNo}}</span>
          <span v-if="customerInformationForm.jobState === 0" style="color: #000; margin-right: 10px; font-size: 16px">SO:{{bookingDataForm.soNo}}</span>
          <span v-if="customerInformationForm.jobState === 3 && bookingDataForm.thirdSerialNo " style="color: #000; margin-right: 10px; font-size: 16px">{{ $t('sea.bookingSerialNumber') }}:{{bookingDataForm.thirdSerialNo}}</span>
          <el-button v-if="orderDetailsData.isUnlocked && ([30,40,50,80].indexOf(customerInformationForm.orderState)>-1 || [1,3].indexOf(customerInformationForm.jobState)>-1)" type="primary" size="mini" @click="bookingEdit()">{{$t('sea.edit')}}</el-button>
          <!--          提交订舱 订单状态“待订舱” 待发送”/“订舱失败-->
          <el-button v-if="orderDetailsData.isUnlocked && customerInformationForm.orderState === 20 && [1,3].indexOf(customerInformationForm.jobState)>-1" type="primary" size="mini" @click="submitBooking">{{$t('sea.submitBooking')}}</el-button>
          <!--          调整箱型箱量-->
          <el-button v-if="orderDetailsData.isUnlocked && [30,40,50,80].indexOf(customerInformationForm.orderState)>-1" type="primary" size="mini" @click="adjustBoxTypeAndVolume">{{$t('sea.adjustBoxTypeAndVolume')}}</el-button>
          <el-button v-if="orderDetailsData.isUnlocked && (customerInformationForm.orderState === 20 || customerInformationForm.orderState === 25) && [1,3].indexOf(customerInformationForm.jobState)>-1" type="danger" size="mini" @click="deleteBooking">{{$t('sea.delete')}}</el-button>

          <el-button v-if="orderDetailsData.isUnlocked && [30,40,50,60,80].indexOf(customerInformationForm.orderState)>-1" type="primary" size="mini" @click="maintainTime">{{$t('sea.maintainTime')}}</el-button>
          <!--          待制单，且无任何装箱信息的情况下可见-->
          <el-button v-if="orderDetailsData.isUnlocked && [30].indexOf(customerInformationForm.orderState)>-1 && $isEmpty(packingDataList.containerList)" type="danger"  size="mini" @click="bookingCancel">{{$t('sea.cancel')}}</el-button>
          <!--          退关-->
          <el-button v-if="orderDetailsData.isUnlocked && isShowBookingExit" type="danger"  size="mini" @click="bookingExitCustoms">{{$t('sea.exitCustoms')}}</el-button>
          <el-button v-if="customerInformationForm.orderState != 100" type="primary"  size="mini" @click="uploadBookingReceipt">{{$t('sea.uploadBookingReceipt')}}</el-button>
          <span v-if="!polTime &&customerInformationForm.orderState != 100" style="margin-left: 15px; color: red; font-size: 12px">{{ $t('sea.bookingBeCareful') }}</span>
        </div>
      </div>
      <div class="box_child" v-if="[0,1,2,3,10].indexOf(customerInformationForm.jobState)>-1 && customerInformationForm.orderState!==100">
        <div class="flex-bet" style="justify-content: start; position: relative">
          <div class="bookingStatus" :class="'bookingStatus'+customerInformationForm.jobState">{{ jobStateName[customerInformationForm.jobState] }}</div>
          <div style="width: 30%">
            <!--              船名/航次-->
            <div>
              <el-form-item :label="`${$t('sea.shipName')}/${$t('sea.voyage')}`" prop="vessel" size="mini">{{bookingDataForm.vessel}}<span v-if="bookingDataForm.voyage">/</span>{{bookingDataForm.voyage}}</el-form-item>
              <el-form-item :label="$t('sea.priceCardNumber')" prop="contractNo" size="mini">{{bookingDataForm.contractNo}}</el-form-item>
            </div>
            <!--            发货人-->
            <el-form-item :label="$t('sea.contact')" prop="contact" size="mini">{{bookingDataForm.orderShipperAddress.contact}}</el-form-item>
            <el-form-item :label="$t('sea.consignee')" prop="contact" size="mini">{{bookingDataForm.orderConsigneeAddress.contact}}</el-form-item>
            <el-form-item :label="$t('sea.alertOthers')" prop="contact" size="mini">{{bookingDataForm.orderNotifyAddress.contact}}</el-form-item>
            <!--            货代-->
            <el-form-item :label="$t('sea.freightForwarder')" prop="contractNo" size="mini">{{bookingDataForm.orderForwardersAddress.contact}}</el-form-item>
            <el-form-item :label="$t('sea.cargoType')" prop="goodsType" size="mini">{{bookingDataForm.goodsType}}</el-form-item>
            <!--            货物描述-->
            <el-form-item :label="$t('sea.marks')" prop="goodsDesc" size="mini">{{bookingDataForm.goodsDesc}}</el-form-item>
            <el-form-item v-if="bookingDataForm.jobState === 3" :label="$t('sea.reasonForFailure')" prop="bookingFailedReason" size="mini" style="color: red;">{{bookingDataForm.bookingFailedReason}}</el-form-item>
          </div>

          <div>
            <div>
              <el-form-item :label="$t('sea.boxTypeArr')">
                <div v-for="(item,index) in bookingDataForm.containerList" :key="index">
                  {{item.englishName}} * {{item.ctnrNum}} {{ownerType[item.ownerType]}} {{item.weight}}KGS/箱
                </div>
              </el-form-item>
            </div>
            <div>
              <el-form-item :label="$t('sea.pol2')" prop="pol" size="mini">{{bookingDataForm.pol}}</el-form-item>
              <el-form-item label="ETD" prop="pol" size="mini">{{formatDate(bookingDataForm.etd)}}</el-form-item>
              <el-form-item label="ATD" prop="pol" size="mini">{{formatDate(bookingDataForm.atd)}}</el-form-item>
            </div>
            <el-form-item label="CY CUT" prop="pod" size="mini">{{formatDate(bookingDataForm.cyCut)}}</el-form-item>
            <el-form-item label="CUS CUT" prop="pod" size="mini">{{formatDate(bookingDataForm.cusCut)}}</el-form-item>
            <el-form-item label="SI CUT" prop="pod" size="mini">{{formatDate(bookingDataForm.siCut)}}</el-form-item>
            <el-form-item label="VGM CUT" prop="pod" size="mini">{{formatDate(bookingDataForm.vgmCut)}}</el-form-item>
          </div>
          <div>

            <el-form-item :label="$t('sea.pod')" prop="pod" size="mini">{{bookingDataForm.pod}}</el-form-item>
            <el-form-item label="ETA" prop="pod" size="mini">{{formatDate(bookingDataForm.eta)}}</el-form-item>
            <el-form-item label="ATA" prop="pod" size="mini">{{formatDate(bookingDataForm.ata)}}</el-form-item>

          </div>

        </div>
      </div>

      <!--      装箱信息-->
      <div class="box_title" v-if="customerInformationForm.orderState>=30 && customerInformationForm.orderState!==100">
        <span>{{$t('sea.packingInformation')}}</span>
        <div class="operate-buttons-left">
          <el-button v-if="orderDetailsData.isUnlocked && [30,40,80].indexOf(customerInformationForm.orderState)>-1" type="primary" size="mini" @click="packingEdit()">{{$t('sea.edit')}}</el-button>
          <el-button v-if="customerInformationForm.orderState != 100" type="primary" size="mini" @click="uploadPackingList">{{$t('sea.uploadPackingList')}}</el-button>
          <el-button v-if="customerInformationForm.orderState != 100" type="primary"  size="mini" @click="uploadVGMData">{{$t('sea.uploadVGMData')}}</el-button>
          <el-button v-if="customerInformationForm.orderState != 100" type="primary"  size="mini" @click="uploadWarehouseInformation">{{$t('sea.uploadWarehouseInformation')}}</el-button>
          <span v-if="packingDataList.unboxed>0 && customerInformationForm.orderState != 100" style="margin-left: 15px; color: red; font-size: 12px">{{ $t('sea.packingInformationNote') }}</span>
        </div>
      </div>
      <div class="box_child" v-if="customerInformationForm.orderState>=30 && customerInformationForm.orderState!==100">
        <div class="flex-bet" style=" flex-wrap:nowrap;justify-content: space-around;">
          <el-form-item label="SO" prop="customerRate" class="box25">{{packingDataList.soList.join(',')}} </el-form-item>
          <el-form-item :label="$t('sea.sumCount')" prop="sumContainer" class="box25">
            {{packingDataList.sumContainerStr}}
          </el-form-item>
          <el-form-item :label="$t('sea.unboxed')" prop="customerRate" class="box25">{{packingDataList.unboxedContainerStr}}</el-form-item>
        </div>
        <el-table :data="packingDataList.containerList" style="width: 100%; margin: 10px 0;" max-height="250" >
          <el-table-column prop="soNo" label="SO" header-align="center" align="center" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="containerNo" :label="$t('sea.containerNo')" header-align="center" align="center"></el-table-column>
          <el-table-column prop="sealNo" :label="$t('sea.sealNo')" header-align="center" align="center"></el-table-column>
          <el-table-column prop="containerType" :label="$t('sea.box')" header-align="center" align="center"></el-table-column>
          <el-table-column prop="ownerType" label="SOC" header-align="center" align="center">
            <template slot-scope="{row}">
              {{row.ownerType | ownerTypeF(vm)}}
            </template>
          </el-table-column>

          <el-table-column prop="sumQuantity" :label="$t('sea.number')" header-align="center" align="center"></el-table-column>
          <el-table-column prop="sumGrossWeight" :label="$t('sea.grossWeight')" header-align="center" align="center"></el-table-column>
          <el-table-column prop="sumVolume" :label="$t('sea.volume')" header-align="center" align="center"></el-table-column>
          <el-table-column prop="vgmWeight" :label="$t('sea.vgmWeight')" width="180px" header-align="center" align="center"></el-table-column>
          <el-table-column prop="vgmMode" :label="$t('sea.vgmMode')" header-align="center" align="center">
            <template slot-scope="{row}">
              {{row.vgmMode | vgmModeF(vm)}}
            </template>
          </el-table-column>

        </el-table>

      </div>

      <!--      客户提单-->
      <div class="box_title" v-if="customerInformationForm.orderState>=30 && customerInformationForm.orderState!==100">
        <span>{{$t('sea.memberBlNo')}}</span>
        <div class="operate-buttons-left">
          <!--          v-if="[30,40].indexOf(customerInformationForm.orderState)>-1"-->
          <el-button  type="primary" size="mini" @click="goBillDetails('4')">{{$t('sea.billDetails')}}</el-button>
          <el-button v-if="orderDetailsData.isUnlocked && customerInformationForm.orderState != 100" type="primary" size="mini" @click="addBill">{{$t('sea.addBill')}}</el-button>
          <!--          <el-button :disabled="true" v-if="customerInformationForm.orderState != 100" type="primary"  size="mini" @click="uploadVGMData">{{$t('sea.invitationSingle')}}</el-button>-->
          <el-button v-if="orderDetailsData.isUnlocked && customerInformationForm.orderState != 100" type="primary"  size="mini" @click="generateShippingBill">{{$t('sea.generateShippingBill')}}</el-button>
          <el-button v-if="customerInformationForm.orderState != 100" type="primary"  size="mini" @click="uploadBill">{{$t('sea.uploadBill')}}</el-button>
        </div>
      </div>
      <div class="box_child" v-if="customerInformationForm.orderState>=30 && customerInformationForm.orderState!==100">
        <BillDetailTable :dataList="customBlList" :type="1" ref="customBlTable" @editBl="editBl" @delCustomerBl="delCustomerBl" @batchPrint="batchPrint" :orderDetailsData="orderDetailsData"></BillDetailTable>
      </div>
      <!--      船司提单-->
      <div class="box_title" v-if="customerInformationForm.orderState>=40 && customerInformationForm.orderState!==100">
        <span>{{$t('sea.carrierBlNo')}}</span>
        <div class="operate-buttons-left">
          <!--          v-if="[30,40].indexOf(customerInformationForm.orderState)>-1"-->
          <el-button  type="primary" size="mini" @click="goBillDetails('5')" @restOrderData="restOrderData">{{$t('sea.billDetails')}}</el-button>
        </div>
      </div>
      <div class="box_child" v-if="customerInformationForm.orderState>=40 && customerInformationForm.orderState!==100">
        <BillDetailTable :dataList="shipBossBlList" :orderDetailsData="orderDetailsData" :type="2" @editBl="editShipBl" @uploadCarrierBill="uploadCarrierBill" @batchPrint="batchPrint"></BillDetailTable>
      </div>
    </el-form>
    <!--    变更委托单位-->
    <el-dialog :title="$t('sea.changeTheEntrustingUnit')" :visible.sync="changeEntrustingUnitDialog" :close-on-click-modal="false" :before-close="closeChangeUnitFormDialog" width="800px" class="dialog-box">
      <el-form :inline="true" :model="changeUnitForm" @submit.native.prevent ref="changeUnitForm" style="display: flex" class="changeUnitForm">
        <div class="flex-bet changeUnit-form" style="width: 800px">
            <el-form-item :label="$t('sea.requester')" prop="customerId" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
<!--              <remoteSearchSelector v-model="changeUnitForm.customerId" @selectorChange="setCustomerInfo"/>-->
              <type-select v-model="changeUnitForm.customerId" type="customer" clearable :defaultDisplay="changeUnitForm.customerName"
                           @selected="setCustomerInfo" :requestParams="{businessType:'SEA_EXPORT'}"/>
            </el-form-item>
            <!--            销售人员-->
            <el-form-item :label="$t('sea.customerContact')" prop="contactCnName" size="mini">
              <el-select v-model="changeUnitForm.customerContact" :placeholder="$t('sea.placeholder')" @change="contactChange">
                <el-option v-for="(item, index) in contactList" :label="item.contact" :value="item.id" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('sea.customerLevel')" prop="customerRate" size="mini" class="box25">{{changeUnitForm.customerRate}}</el-form-item>
            <el-form-item :label="$t('sea.settlementMethod')" prop="settlementMode" size="mini" class="box25">{{changeUnitForm.settlementMode}}</el-form-item>
            <el-form-item :label="$t('sea.email')" prop="customerEmail" size="mini" class="box25">{{changeUnitForm.customerEmail}}</el-form-item>
            <el-form-item :label="$t('sea.phone')" prop="customerTel" size="mini" class="box25">{{changeUnitForm.customerTel}}</el-form-item>
        </div>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="submitChangeUnitForm">{{$t('sea.save')}}</el-button>
        <el-button size="mini" @click="closeChangeUnitFormDialog">{{$t('sea.cancel')}}</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="$t('sea.maintainTime')" :visible.sync="maintainTimeDialog" :close-on-click-modal="false" :before-close="closeMaintainTimeDialog" width="1100px" class="dialog-box">
      <el-form :inline="true" :model="maintainTimeDialogForm" @submit.native.prevent ref="maintainTimeDialogForm" style="display: flex" class="maintainTimeDialogForm">
        <div>
          <el-form-item label="SO" prop="SO">{{bookingDataForm.soNo}}</el-form-item>
          <el-form-item :label="`${$t('sea.shipName')}/${$t('sea.voyage')}`">{{bookingDataForm.vessel}}/{{bookingDataForm.voyage}}</el-form-item>
          <el-form-item :label="$t('sea.pol2')">{{bookingDataForm.pol}}</el-form-item>
          <el-form-item label="ETD" prop="etd" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'blur' },]">
            <el-date-picker :disabled="maintainTimeDialogForm.etdLockFlag || disabledMaintainTimeDate" v-model="maintainTimeDialogForm.etd" value-format="timestamp" size="mini" type="datetime" :placeholder="$t('sea.selectDate')"></el-date-picker>
          </el-form-item>
          <el-form-item label="ATD" prop="atd">
            <el-date-picker v-model="maintainTimeDialogForm.atd" value-format="timestamp" size="mini" type="datetime" :placeholder="$t('sea.selectDate')" :disabled="disabledMaintainTimeDate"></el-date-picker>
          </el-form-item>
          <el-form-item label="CY CUT" prop="cyCut">
            <el-date-picker v-model="maintainTimeDialogForm.cyCut" value-format="timestamp" size="mini" type="datetime" :placeholder="$t('sea.selectDate')" :disabled="disabledMaintainTimeDate"></el-date-picker>
          </el-form-item>
          <el-form-item label="CUS CUT" prop="cusCut">
            <el-date-picker v-model="maintainTimeDialogForm.cusCut" value-format="timestamp" size="mini" type="datetime" :placeholder="$t('sea.selectDate')" :disabled="disabledMaintainTimeDate"></el-date-picker>
          </el-form-item>
          <el-form-item label="SI CUT" prop="siCut">
            <el-date-picker v-model="maintainTimeDialogForm.siCut" value-format="timestamp" size="mini" type="datetime" :placeholder="$t('sea.selectDate')" :disabled="disabledMaintainTimeDate"></el-date-picker>
          </el-form-item>
          <el-form-item label="VGM CUT" prop="vgmCut">
            <el-date-picker v-model="maintainTimeDialogForm.vgmCut" value-format="timestamp" size="mini" type="datetime" :placeholder="$t('sea.selectDate')" :disabled="disabledMaintainTimeDate"></el-date-picker>
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('sea.transfer')">
            <el-checkbox v-model="maintainTimeDialogForm.transitFlag"></el-checkbox>
          </el-form-item>
          <template v-if="maintainTimeDialogForm.transitFlag">
            <div style="display: flex">
              <el-form-item :label="$t('sea.secondVesselVoyage')" prop="secVessel" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'blur' },]">
                <el-input v-model="maintainTimeDialogForm.secVessel" style="width: 100px"  v-input-auto="'EN_num'" maxlength="100" size="mini" :placeholder="$t('sea.TransferVessel')"></el-input>
              </el-form-item>
              <el-form-item label="" prop="secVoyage" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'blur' },]">
                <el-input v-model="maintainTimeDialogForm.secVoyage" style="width: 100px" v-input-auto="'EN_num'" maxlength="100" size="mini" :placeholder="$t('sea.TransferVoyage')"></el-input>
              </el-form-item>
            </div>
            <el-form-item :label="$t('sea.transitPort')" prop="transitCode" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'blur' },]">
              <cargo-advance-select style=" width: 220px;"
                                    ref="polCodeSelect"
                                    :default-value="maintainTimeDialogForm.transitCode"
                                    :url="url.qf.seaport"
                                    :headers="['英文名称','五字码','中文名称']"
                                    :fields="['englishName','code5','chineseName']"
                                    tag-value="code5"
                                    tag-name="enPortName"
                                    :placeholder="$t('sea.transitPort')"
                                    remote
                                    size="mini"
                                    @parentCallBack="(data)=>{
                  maintainTimeDialogForm.transitCode=data.code5
                  maintainTimeDialogForm.transit=data.englishName
                }"
              />
            </el-form-item>
            <el-form-item label="ETA" prop="transitEta" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'blur' },]">
              <el-date-picker v-model="maintainTimeDialogForm.transitEta" size="mini" type="datetime" value-format="timestamp" :placeholder="`${$t('sea.transitPort')}ETA`"></el-date-picker>
            </el-form-item>
            <el-form-item label="ATA" prop="transitAta">
              <el-date-picker v-model="maintainTimeDialogForm.transitAta" size="mini" type="datetime" value-format="timestamp" :placeholder="`${$t('sea.transitPort')}ATA`"></el-date-picker>
            </el-form-item>
            <el-form-item label="ETD" prop="transitEtd" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'blur' },]">
              <el-date-picker v-model="maintainTimeDialogForm.transitEtd" size="mini" type="datetime" value-format="timestamp" :placeholder="`${$t('sea.transitPort')}ETD`"></el-date-picker>
            </el-form-item>
            <el-form-item label="ATD" prop="transitAtd">
              <el-date-picker v-model="maintainTimeDialogForm.transitAtd" size="mini" type="datetime" value-format="timestamp" :placeholder="`${$t('sea.transitPort')}ATD`"></el-date-picker>
            </el-form-item>
          </template>

        </div>
        <div>
          <el-form-item :label="$t('sea.pod')" prop="pod">{{bookingDataForm.pod}}</el-form-item>
          <el-form-item label="ETA" prop="eta" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'blur' },]">
            <el-date-picker v-model="maintainTimeDialogForm.eta" value-format="timestamp" size="mini" type="datetime" :placeholder="$t('sea.selectDate')"></el-date-picker>
          </el-form-item>
          <el-form-item label="ATA" prop="eta">
            <el-date-picker v-model="maintainTimeDialogForm.ata" value-format="timestamp" size="mini" type="datetime" :placeholder="$t('sea.selectDate')"></el-date-picker>
          </el-form-item>
        </div>

      </el-form>
      <div style="color: red; font-size: 12px; text-align: right">{{$t('sea.maintainTimeDialogCareful')}}</div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="submitMaintainTime">{{$t('sea.save')}}</el-button>
        <el-button size="mini" @click="closeMaintainTimeDialog">{{$t('sea.cancel')}}</el-button>
      </span>
    </el-dialog>
    <!--    $t('sea.uploadEntrustment')-->
    <DataImport :btnText="updateMsg.btnText" :code="updateMsg.code" :name="updateMsg.name" :showDataImportDialog.sync="showDataImportDialog" @close="colseDialog"
                :downLoadFileName="downLoadFileName"
                :isDownloadExcel.sync="isDownloadExcel">
    </DataImport>

    <reportListDialog v-if="reportDialog.isShow" :is-show="reportDialog.isShow" :print-data="reportDialog.data" :type-code="reportDialog.typeCode" @closeDialog="reportDialog.isShow=false" />

    <JobShutOut v-if="JobShutOutDialog"
    :orderDetailsData="orderDetailsData"
                :JobShutOutDialog.sync="JobShutOutDialog"
                :bookingJobId="bookingJobId"
                :containerListDataProp="packingDataList"
                @exitSuccessfully="exitSuccessfully"></JobShutOut>
    <BookingConfirm v-if="bookingDialog" :bookingDialog.sync="bookingDialog" :goodsTypeCode="customerInformationForm.goodsTypeCode" @bookingConfirmCallBack="bookingConfirmCallBack"></BookingConfirm>

    <AdjustBoxTypeAndVolume v-if="adjustBoxTypeAndVolumeDialog" :showDialog.sync="adjustBoxTypeAndVolumeDialog" :bookingJobId="customerInformationForm.bookingJobId" @submitCallBack="adjustBoxTypeVolumeSubmit"></AdjustBoxTypeAndVolume>

  </div>
</template>
<script>
import URL from '@/api/urlTranslator'
import cargoAdvanceSelect from "@/components/Cargo/Common/cargoAdvanceSelect"
import {
	alterCustomerApi,
	alterCustomerValidApi,
	containerListApi,
	customerLinkmanMemberApi,
	deleteBookingApi,
	jobBookingContainersApi,
	orderCancelApi,
	putBusinessTagUpdateApi,
	putRemarksUpdateApi,
	putTransportTermUpdateApi,
	seaBlListApi,
	seaBookingCancelApi,
	seaBookingDetailApi,
	seaCarrierBlListApi,
	seaCarrierHblApi,
	seaCustomerBlDelApi,
	seaUpdateSailingApi,
	submitBookingApi,
	tradeTermUpdateApi,
} from "@/api/seaExportOrder"
import DataImport from "@/components/DataImport/index"
import BillDetailTable from "./billDetailTable"
import JobShutOut from "./jobShutOut"
import BookingConfirm from "./bookingConfirm"
import AdjustBoxTypeAndVolume from "./Popup/adjustBoxTypeAndVolume"
import lodash from 'lodash'
import reportListDialog from "@/components/Cargo/Report/reportListDialog"
import { deepCloneMethod } from "@/utils"
import { mapState } from "vuex"
import { getUserInfo } from "@/api/login"
import remoteSearchSelector from "@/views/cargo/v0/CharteredBoat/components/remoteSearchSelector";
import { getDmnTermItemList } from "@/api/seaExport";
import orderMixin from "./orderMixin";

export default {
	name: 'OrderDetails',
  mixins: [orderMixin],
	props: {
		uploadRadioType: { type: String, default: null },
		orderDetailsData: {
			type: Object, default: () => {
			}
		}
	},
	components: { cargoAdvanceSelect, DataImport, BillDetailTable, reportListDialog, JobShutOut, BookingConfirm, AdjustBoxTypeAndVolume, remoteSearchSelector },
	data() {
		return {
			required: { required: true, message: this.$t('sea.pleaseEnter'), trigger: 'change' },
			loading: false,
			id: this.$route.query.id,
			bookingJobId: this.$route.query.bookingJobId,
			customerInformationForm: {},
			jobStateName: {
				0: '订舱成功',
				1: '待发送',
				2: '订舱处理中',
				3: '订舱失败',
				10: '退关',
				100: '已取消',
				110: '已删除'
			},
			packingData: {
				soList: []
			},
			packingDataList: {
				cargoList: [],
				soList: [],
				sumCount: null,
				unboxed: null
			},
			bookingDataForm: {
				orderShipperAddress: {},
				orderConsigneeAddress: {},
				orderNotifyAddress: {},
				orderForwardersAddress: {}
			},
			maintainTimeDialog: false,
			maintainTimeDialogForm: {},
			showDataImportDialog: false,
			ownerType: ['', 'SOC', 'COC'],
			vm: this,
			updateMsg: {
				btnText: '',
				code: '',
				name: ''
			},
			customBlList: [],
			shipBossBlList: [],
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
			JobShutOutDialog: false, // 订舱退关弹窗
			isDownloadExcel: false, // 是否显示下载模板链接
			downLoadFileName: null,
			// 订舱渠道确认
			bookingDialog: false,
			adjustBoxTypeAndVolumeDialog: false, // 调整箱型箱量
			AdjustBoxTypeAndVolumeData: [], // 调整箱型箱量数量,
			changeEntrustingUnitDialog: false,
			changeUnitForm: {},
			contactList: [], // 客户联系人
			tradeTermsList: [],
			businessTagVal: [],
			businessTagName: {
				ovlFirstLegFlag: this.$t('sea.overseasPosition'),
				fbaFirstLegFlag: this.$t('sea.fbaHead'),
				fullLinkFlag: this.$t('sea.fullLink'),
				fbaFbwFlag: 'FBA&FBW',
				seaCollectionFlag: this.$t('sea.seaCollection'),
				onlyPodServiceFlag: this.$t('sea.destinationServiceOnly'),
			},
			transportTermList: [],
			bussinessTagsArr: ['ovlFirstLegFlag', 'fbaFirstLegFlag', 'fullLinkFlag', 'onlyPodServiceFlag', 'fbaFbwFlag', 'seaCollectionFlag']
		}
	},
	watch: {
		orderDetailsData(newVal) {
			this.customerInformationForm = newVal
			let businessTagVal = []
			this.bussinessTagsArr.forEach(item => {
				if (this.customerInformationForm.businessTag[item]) {
					businessTagVal.push(item)
				}
			})
			this.businessTagVal = businessTagVal
			if (this.customerInformationForm.bookingJobId) {
				this.bookingJobId = this.customerInformationForm.bookingJobId
				this.getSeaBookingDetailApi(this.bookingJobId)
				this.getContainerList(this.bookingJobId)
			}
		}
	},
	filters: {
		ownerTypeF(type, vm) {
			if (type === 1) {
				return vm.$t('sea.true')
			} else if (type === 2) {
				return vm.$t('sea.false')
			}
		},
		vgmModeF(val, vm) {
			if (Number(val) === 1) {
				return vm.$t('sea.overall')
			} else if (Number(val) === 2) {
				return vm.$t('sea.cumulative')
			}
		}
	},
	computed: {
		...mapState({
			uploadToken: state => state.user.token
		}),
		url() {
			return URL
		},
		polTime() {
			if (this.bookingDataForm.etd && this.bookingDataForm.cyCut && this.bookingDataForm.cusCut && this.bookingDataForm.siCut && this.bookingDataForm.vgmCut) {
				return true
			} else { return false }

		},
    showDeliveryAddress() {
      return this.customerInformationForm.tradeTermCode === 'DDP' || 
      (this.customerInformationForm.businessTag.fullLinkFlag || 
      this.customerInformationForm.businessTag.fbaFbwFlag || 
      this.customerInformationForm.businessTag.trailerFlag)
    },
		getBusinessTagName() {
			let str = ''
			this.businessTagVal.forEach((item, index) => {
				str += `${this.businessTagName[item]}${index === this.businessTagVal.length - 1 ? '' : '、'}`
			})
			return str
		},
		isShowBookingExit() {
			if (this.customerInformationForm.orderState === 30 && this.$isNotEmpty(this.packingDataList.containerList)) {
				return true
			}
			return [40, 50, 80].indexOf(this.customerInformationForm.orderState) > -1
		},
		disabledMaintainTimeDate() {
			return this.customerInformationForm.orderState === 60
		}
	},
	created() {
		this.customerInformationForm = this.orderDetailsData
		let businessTagVal = []
		this.bussinessTagsArr.forEach(item => {
			if (this.customerInformationForm.businessTag[item]) {
				businessTagVal.push(item)
			}
		})
		this.businessTagVal = businessTagVal
		if (this.$isNotEmpty(this.customerInformationForm)) {
			this.bookingJobId = this.customerInformationForm.bookingJobId
		}
		if (this.bookingJobId && this.customerInformationForm.orderState != 100) {

			this.getSeaBookingDetailApi(this.bookingJobId)
			this.getContainerList(this.bookingJobId)
		}
		if (this.id) {
			this.getSeaBlListApi(this.id)
			this.getSeaCarrierBlListApi(this.id)
		}
		// 贸易条款
		getDmnTermItemList({ termCode: 'TRADEMODE' }).then(res => {
			this.tradeTermsList = res.content
		})
		// 运输方式
		getDmnTermItemList({ termCode: 'TRANSPORTITEM' }).then(res => {
			this.transportTermList = res.content
		})
	},
	methods: {
		// 选择贸易条款
		tradeTermChange(tradeTermCode) {
			let find = this.tradeTermsList.find(item => item.code === tradeTermCode)
			if (find) {
				this.customerInformationForm.tradeTerm = find.englishName
			}
		},
		// 编辑运输条款
		transportTermEdit() {
			let transportTermCodeCopy = lodash.cloneDeep(this.customerInformationForm.transportTermCode)
			this.$set(this.customerInformationForm, 'isTransportTermEdit', true)
			this.$set(this.customerInformationForm, 'transportTermCodeCopy', transportTermCodeCopy)
		},
		// 运输条款
		transportTermChange(transportTermCode) {
			this.transportTermList.map(item => {
				if (item.code === transportTermCode) {
					this.$set(this.customerInformationForm, 'transportTerm', item.englishName)
				}
			})
			if (this.customerInformationForm.transportTermCode.indexOf('DOOR') < 0) {
				this.$set(this.customerInformationForm, 'nonShippingServiceFlag', false)
			}
		},
		noSaveTransportTerm() {
			this.customerInformationForm.transportTermCode = this.customerInformationForm.transportTermCodeCopy
			this.customerInformationForm.isTransportTermEdit = false
		},
		async saveTransportTerm() {
			if (!this.customerInformationForm.transportTermCode) {
				return
			}
			this.loading = true
			let data = {
				id: this.id,
				transportTermCode: this.customerInformationForm.transportTermCode,
				transportTerm: this.customerInformationForm.transportTerm,
				nonShippingServiceFlag: this.customerInformationForm.nonShippingServiceFlag,
			}
			const res = await putTransportTermUpdateApi(data)
			this.loading = false
			if (res.ok) {
				this.customerInformationForm.isTransportTermEdit = false
			}
		},

		tradeTermEdit() {
			let tradeTermCodeCopy = lodash.cloneDeep(this.customerInformationForm.tradeTermCode)
			this.$set(this.customerInformationForm, 'isTradeTermEdit', true)
			this.$set(this.customerInformationForm, 'tradeTermCodeCopy', tradeTermCodeCopy)
		},
		noSaveTradeTerm() {
			this.customerInformationForm.tradeTermCode = this.customerInformationForm.tradeTermCodeCopy
			this.customerInformationForm.isTradeTermEdit = false
		},
		async saveTradeTerm() {
			let deliveryAddress = null
			let validate
			if (this.showDeliveryAddress) {
				this.$refs.customerInformationForm.validateField(['deliveryAddress'], valid => {
					if (!valid) {
						deliveryAddress = this.customerInformationForm.deliveryAddress
					} else {
						validate = true
					}
				})
			}

			if (validate) return
			this.loading = true
			let data = {
				tradeTermCode: this.customerInformationForm.tradeTermCode,
				tradeTerm: this.customerInformationForm.tradeTerm,
				deliveryAddress: deliveryAddress
			}
			const res = await tradeTermUpdateApi(this.id, data)
			this.loading = false
			if (res.ok) {
				this.customerInformationForm.isTradeTermEdit = false
			}
		},
		// 编辑订舱备注
		remarksEdit() {
			let remarksCopy = lodash.cloneDeep(this.customerInformationForm.remarks)
			this.$set(this.customerInformationForm, 'isRemarksEdit', true)
			this.$set(this.customerInformationForm, 'remarksCopy', remarksCopy)
		},
		async saveRemarks() {
			this.loading = true
			let data = {
				remarks: this.customerInformationForm.remarks
			}
			const res = await putRemarksUpdateApi(this.id, data)
			this.loading = false
			if (res.ok) {
				this.customerInformationForm.isRemarksEdit = false
			}
		},
		noSaveRemarks() {
			this.customerInformationForm.remarks = this.customerInformationForm.remarksCopy
			this.customerInformationForm.isRemarksEdit = false
		},
		// 业务标签编辑
		businessTagEdit() {
			let businessTagCopy = lodash.cloneDeep(this.businessTagVal)
			this.$set(this.customerInformationForm, 'isBusinessTagEdit', true)
			this.$set(this.customerInformationForm, 'businessTagCopy', businessTagCopy)
		},
		noBusinessTag() {
			this.businessTagVal = this.customerInformationForm.businessTagCopy
			this.businessTagChange(this.businessTagVal)
			this.customerInformationForm.isBusinessTagEdit = false
		},
		async saveBusinessTag() {
			let validate
			let deliveryAddress = null
			if (this.showDeliveryAddress) {
				this.$refs.customerInformationForm.validateField(['deliveryAddress'], valid => {
					if (!valid) {
						deliveryAddress = this.customerInformationForm.deliveryAddress
					} else {
						validate = true
					}
				})
			}
			if (validate) {
				return
			}
			this.loading = true
			let data = {
				id: this.id,
				deliveryAddress
			}
			// this.businessTagChange(this.businessTagVal)
			const arr = this.bussinessTagsArr.concat(['customsClearanceFlag', 'trailerFlag'])
			arr.map(key => {
				data[key] = this.customerInformationForm.businessTag[key]
			})
			const res = await putBusinessTagUpdateApi(data)
			this.loading = false
			if (res.ok) {
				this.customerInformationForm.isBusinessTagEdit = false
			}
		},
		// 编辑提单
		editBl(row) {
			this.$emit('change', '4', true, 'editBl', row)
		},
		async delCustomerBl(row) {
			// MBL：判断是否关联船司提单
			if (row.blSignType === 1) { // MBL
				if (row.carrierBlId) { // 关联
					this.$confirm(this.$t('sea.deleteCustomerShipBl'), this.$t('sea.tips'), {
						confirmButtonText: this.$t('sea.determine'),
						cancelButtonText: this.$t('sea.cancel'),
						type: 'warning'
					}).then(async () => {
						this.delCustomerBlAPI(row.id)
					})
				} else {// 未关联
					this.$confirm(this.$t('sea.canTBeRecoveredAfterDeletion'), this.$t('sea.tips'), {
						confirmButtonText: this.$t('sea.determine'),
						cancelButtonText: this.$t('sea.cancel'),
						type: 'warning'
					}).then(async () => {
						this.delCustomerBlAPI(row.id)
					})
				}
			} else if (row.blSignType === 2) { // HBL
				if (row.carrierBlId) { // 关联
					this.$confirm(this.$t('sea.billOfLadingAssociatedShippingCompany'), this.$t('sea.tips'), {
						confirmButtonText: this.$t('sea.determine'),
						cancelButtonText: this.$t('sea.cancel'),
						type: 'warning'
					}).then(async () => {
						this.delCustomerBlAPI(row.id)
					})
				} else {// 未关联
					this.$confirm(this.$t('sea.canTBeRecoveredAfterDeletion'), this.$t('sea.tips'), {
						confirmButtonText: this.$t('sea.determine'),
						cancelButtonText: this.$t('sea.cancel'),
						type: 'warning'
					}).then(async () => {
						this.delCustomerBlAPI(row.id)
					})
				}
			}

		},
		async delCustomerBlAPI(id, type) {
			this.loading = true
			const res = await seaCustomerBlDelApi(id)
			this.loading = false
			if (res.ok) {
				this.$message.success(this.$t('sea.successfullyDeleted'))
				this.getSeaBlListApi(this.id)
				this.getSeaCarrierBlListApi(this.id)
			}
		},
		editShipBl(row) {
			this.$emit('change', '5', true, 'editBl', row)
		},
		// 生成船司提单
		async generateShippingBill() {// carrierBlId
			const select = this.$refs.customBlTable.getSelect()
			const ids = select.map(item => item.id)
			let hasCarrierBlId = select.some(item => item.carrierBlId)
			if (this.$isEmpty(select) || hasCarrierBlId) {
				this.$message.warning(this.$t('sea.unrelatedShippingCompanyBillOfLading'))
				return
			}

			// let blType = select.every(item => item.blSignType === 1)
			// if (blType) { // MBL
			//   this.loading = true
			//   const res = await seaCarrierMblApi(ids)
			//   this.loading = false
			//   if (res.ok) {
			//     this.getSeaCarrierBlListApi(this.id)
			//     this.$message.success(this.$t('sea.generatedSuccessfully'))
			//   }
			//   return
			// }
			let blType2 = select.every(item => item.blSignType === 2)
			if (blType2) { // HBL
				this.loading = true
				const res = await seaCarrierHblApi({ ids: ids.join(',') })
				this.loading = false
				if (res.ok) {
					this.$emit('change', '5', true, 'carrierCreate', select)
				}
				return
			}
			this.$message.warning(this.$t('sea.typeTheSameCustomerBillOfLadingToOperate'))
		},
		async getSeaBlListApi(id) {
			this.loading = true
			const res = await seaBlListApi(id)
			this.loading = false
			if (res.ok) {
				this.customBlList = res.content
			}
		},
		async getSeaCarrierBlListApi(id) {
			this.loading = true
			const res = await seaCarrierBlListApi(id)
			this.loading = false
			if (res.ok) {
				this.shipBossBlList = res.content
				this.$emit('returnshipBossBlListLen', this.$isNotEmpty(this.shipBossBlList))
			}
		},

		async getSeaBookingDetailApi(id) {
			this.loading = true
			const res = await seaBookingDetailApi(id)
			this.loading = false
			if (res.ok) {
				if (this.$isEmpty(res.content.orderShipperAddress)) {
					res.content.orderShipperAddress = {}
				}
				if (this.$isEmpty(res.content.orderConsigneeAddress)) {
					res.content.orderConsigneeAddress = {}
				}
				if (this.$isEmpty(res.content.orderNotifyAddress)) {
					res.content.orderNotifyAddress = {}
				}
				if (this.$isEmpty(res.content.orderForwardersAddress)) {
					res.content.orderForwardersAddress = {}
				}
				this.bookingDataForm = res.content
				this.maintainTimeDialogForm = lodash.cloneDeep(res.content)
			}
		},
		async getContainerList(id) {
			this.loading = true
			const res = await containerListApi(id)
			this.loading = false
			if (res.ok) {
				if (this.$isNotEmpty(res.content.sumContainer)) {
					let str = ''
					for (let key in res.content.sumContainer) {
						str += `${key}*${res.content.sumContainer[key]} `
					}
					res.content.sumContainerStr = str
				}
				if (this.$isNotEmpty(res.content.unboxedContainer)) {
					let str = ''
					for (let key in res.content.unboxedContainer) {
						str += `${key}*${res.content.unboxedContainer[key]} `
					}
					res.content.unboxedContainerStr = str
				}
				this.packingDataList = res.content
			}
		},
		// 变更委托单位
		async changeEntrustingUnit() {
			this.loading = true
			const res = await alterCustomerValidApi(this.id)
			this.loading = false
			if (res.ok) {
				this.changeEntrustingUnitDialog = true
			}
		},
		setCustomerInfo(val, name) {
			this.changeUnitForm.customerName = name
			this.$set(this.changeUnitForm, 'customerRate', null)
			this.$set(this.changeUnitForm, 'settlementMode', null)
			this.$set(this.changeUnitForm, 'settlementModeName', null)
			this.$set(this.changeUnitForm, 'customerContactId', null)
			this.$set(this.changeUnitForm, 'customerContact', null)
			this.$set(this.changeUnitForm, 'customerEmail', null)
			this.$set(this.changeUnitForm, 'customerTel', null)
			if (val.id) {
				customerLinkmanMemberApi(val.id).then(res => {
					// this.changeUnitForm.customerRate = res.content.customerLevel // 客户等级\
					// this.$set(this.changeUnitForm, 'customerRate', res.content.customerLevel)
					// this.changeUnitForm.settlementMode = res.content.settlementMode // 结算方式
					// this.dataForm.settlementModeDesc = res.content.settlementModeDesc
					this.contactList = res.content
					if (this.$isNotEmpty(res.content) && !this.changeUnitForm.customerContactId) {
						this.changeUnitForm.customerContactId = res.content[0].id
						this.changeUnitForm.customerContact = res.content[0].contact
						this.changeUnitForm.customerEmail = res.content[0].email
						this.changeUnitForm.customerTel = res.content[0].tel
					}
				})
			} else {
				this.contactList = []
				this.changeUnitForm.customerRate = ''
				this.changeUnitForm.settlementMode = ''
				// this.dataForm.settlementModeDesc = ''
				this.changeUnitForm.contactCnName = ''
				this.changeUnitForm.contactMobile = ''
			}
		},
		contactChange(id) {
			let index = this.contactList.findIndex(item => item.id == id)
			this.changeUnitForm.customerContactId = this.contactList[index].id
			this.changeUnitForm.customerContact = this.contactList[index].contact
			this.changeUnitForm.customerEmail = this.contactList[index].email
			this.changeUnitForm.customerTel = this.contactList[index].tel

		},
		async submitChangeUnitForm() {
			this.$refs.changeUnitForm.validate(async valid => {
				if (valid) {
					this.loading = true
					const res = await alterCustomerApi(this.id, this.changeUnitForm)
					this.loading = false
					if (res.ok) {
						this.$emit('restOrderData')
						this.closeChangeUnitFormDialog()
					}
				}
			})

		},
		closeChangeUnitFormDialog() {
			this.changeEntrustingUnitDialog = false
			this.changeUnitForm = {}
			this.$refs.changeUnitForm.resetFields()
		},
		clientEdit() {
			this.$router.push({ name: 'SeaExportOrderCreate', query: { id: this.id } })
		},
		clientBooking() {
			if (!this.customerInformationForm.jobState) { // 订舱
				if (Number(this.customerInformationForm.carrierId) === 5) { // cosco 直接
					this.bookingDialog = true
				} else {
					const callBackVal = {
						bookingChannel: 3,
						bookingJobMethod: 1
					}
					this.$emit('bookingConfirmCallBack', callBackVal)
					this.$emit('change', '2')
				}

			} else {
				this.$emit('change', '2')
			}
		},
		// 订舱选择人工自动
		bookingConfirmCallBack(val) {
			this.$emit('bookingConfirmCallBack', val)
			this.$emit('change', '2')
		},
		async clientCcancel() {
			if (this.id) {
				this.$confirm(this.$t('sea.delegateCancellation'), this.$t('sea.tips'), {
					confirmButtonText: this.$t('sea.determine'),
					cancelButtonText: this.$t('sea.cancel'),
					type: 'warning'
				}).then(async () => {
					this.loading = true
					const res = await orderCancelApi(this.id)
					this.loading = false
					if (res.ok) {
						this.$emit('restOrderData')
						this.$message.success(this.$t('sea.cancelSuccess'))
					}
				})

			} else {
				this.$message.error(this.$t('sea.parameterMissing'))
			}
		},
		// 客户上传托书
		clientUploadEntrustment() {
			this.updateMsg = {
				btnText: this.$t('sea.uploadEntrustment'),
				code: 'SE_PROXY',
				name: '客户委托书'
			}
			this.showDataImportDialog = true
		},
		colseDialog() {
			this.updateMsg = {
				btnText: '',
				code: '',
				name: ''
			}
			this.showDataImportDialog = false
		},
		// 编辑订舱
		bookingEdit() {
			this.$emit('bookingEdit')
		},
		async submitBooking() {
			this.$confirm(this.$t('sea.submitBookingTips'), this.$t('sea.tips'), {
				confirmButtonText: this.$t('common.confirmBtn'),
				cancelButtonText: this.$t('common.cancelBtn'),
				type: 'warning'
			}).then(() => {
				this.getSubmitBooking()
			})
		},
		// 调整箱型箱量
		async adjustBoxTypeAndVolume() {
			this.adjustBoxTypeAndVolumeDialog = true
		},
		// 提交调整箱型箱量
		adjustBoxTypeVolumeSubmit() {
			this.getSeaBlListApi(this.id)
			this.getSeaCarrierBlListApi(this.id)
			this.$emit('restOrderData')
		},
		async getSubmitBooking() {
			this.loading = true
			const res = await submitBookingApi(this.customerInformationForm.bookingJobId)
			this.loading = false
			if (res.ok) {
				this.getSeaBookingDetailApi(this.bookingJobId)
				this.$emit('restOrderData')
				this.$message.success(this.$t('sea.submittedSuccessfully'))
			}

		},
		deleteBooking() {
			this.$confirm(this.$t('sea.delBookingTips'), this.$t('sea.tips'), {
				confirmButtonText: this.$t('common.confirmBtn'),
				cancelButtonText: this.$t('common.cancelBtn'),
				type: 'warning'
			}).then(() => {
				this.getdeleteBookingApi()
			})
		},
		async getdeleteBookingApi() {
			this.loading = true
			const res = await deleteBookingApi(this.customerInformationForm.bookingJobId)
			this.loading = false
			if (res.ok) {
				this.$message.success(this.$t('sea.successfullyDeleted'))
				this.$router.push({ name: 'SeaExportOrderView', query: { id: this.id, type: 'view', page: '1' } })
			}
		},
		// 维护船期时间
		maintainTime() {
			this.maintainTimeDialog = true
		},
		// 订舱取消
		async bookingCancel() {
			if (this.bookingJobId) {
				this.$confirm(this.$t('sea.bookingCancel'), this.$t('sea.tips'), {
					confirmButtonText: this.$t('sea.determine'),
					cancelButtonText: this.$t('sea.cancel'),
					type: 'warning'
				}).then(async () => {
					this.loading = true
					const res = await seaBookingCancelApi(this.bookingJobId)
					this.loading = false
					if (res.ok) {
						this.getSeaBookingDetailApi(this.bookingJobId)
						this.$emit('restOrderData')
						this.$message.success(this.$t('sea.cancelSuccess'))
					}
				})
			} else {
				this.$message.error(this.$t('sea.parameterMissing'))
			}
		},
		// 退关
		bookingExitCustoms() {
			this.JobShutOutDialog = true
		},
		// 退关成功
		exitSuccessfully() {
			this.getSeaBlListApi(this.id)
			this.getSeaCarrierBlListApi(this.id)
			this.getContainerList(this.bookingJobId)
			this.$emit('restOrderData')
			this.JobShutOutDialog = false
		},
		// 上传订舱回执
		uploadBookingReceipt() {
			this.updateMsg = {
				btnText: this.$t('sea.uploadBookingReceipt'),
				code: 'SE_BOOKING',
				name: '订舱单'
			}
			this.showDataImportDialog = true
		},
		closeMaintainTimeDialog() {
			this.$refs.maintainTimeDialogForm.resetFields()
			this.maintainTimeDialog = false
		},
		// 维护船期时间 sub
		submitMaintainTime() {
			this.$refs.maintainTimeDialogForm.validate(async valid => {
				if (valid) {
					this.loading = true
					const res = await seaUpdateSailingApi(this.maintainTimeDialogForm, this.bookingJobId)
					if (res.ok) {
						this.getSeaBookingDetailApi(this.bookingJobId)
						this.$message.success('保存成功！')
						this.closeMaintainTimeDialog()
					} else {
						this.loading = false
					}
				}
			})
		},

		// 装箱信息
		packingEdit() {
			this.$emit('change', '3')
		},
		goBillDetails(page) {
			this.$emit('change', page, true, 'billList')
		},
		addBill() {
			this.$emit('change', '4', true, 'addCustomBl')
		},
		// 上传装箱单
		uploadPackingList() {
			this.updateMsg = {
				btnText: this.$t('sea.uploadPackingList'),
				code: 'SE_CONTAINER',
				name: '订舱单'
			}
			this.showDataImportDialog = true
		},
		uploadVGMData() {
			this.updateMsg = {
				btnText: this.$t('sea.uploadVGMData'),
				code: 'SE_VGM',
				name: 'VGM资料'
			}
			// this.downLoadFileName = 'vgm申报模板.xls'
			// this.isDownloadExcel = true
			this.showDataImportDialog = true
		},
		uploadWarehouseInformation() {
			this.updateMsg = {
				btnText: this.$t('sea.uploadWarehouseInformation'),
				code: 'SE_MANIFEST',
				name: '预配仓单资料'
			}
			this.showDataImportDialog = true
		},
		uploadBill() {
			this.updateMsg = {
				btnText: this.$t('sea.uploadBill'),
				code: 'SE_MEMBER_BL',
				name: '客户提单'
			}
			this.showDataImportDialog = true
		},
		uploadCarrierBill() {
			this.updateMsg = {
				btnText: this.$t('sea.uploadBill'),
				code: 'SE_CARRIER_BL',
				name: '船司提单'
			}
			this.showDataImportDialog = true
		},
		// * 打印
		batchPrint(id, type) {
			//  const { blNo = null, blStatus = null, containerNo = null, hsCode = null, memberId = null, sealNo = null, vessel = null, voyage = null, declareStatus = null, declareMethod = null, polCode = null, podCode = null } = this.batchPrintMultipleForm
			//  const queryConditionJson = { blNo, blStatus, containerNo, hsCode, memberId, sealNo, vessel, voyage, declareStatus, declareMethod, polCode, podCode }
			this.reportDialog.typeCode = type || 'SEA_MBL' // 'SEA_MBL' 打印客户提单 EB_PACKING_INFORMATION 导出装箱数据
			// let queryConditionJson = deepCloneMethod(this.batchPrintMultipleForm)
			// delete queryConditionJson.pageNum
			// delete queryConditionJson.pageSize
			const entityIdList = [id]
			this.reportDialog.data = { jobId: '', entityIdList }
			// this.reportDialog.data = { queryConditionJson: JSON.stringify(queryConditionJson) }
			this.reportDialog.isShow = true
		},
		restOrderData() {
			this.$emit('restOrderData')
		},
		businessTagChange(val) {
			this.bussinessTagsArr.forEach(item => {
				if (val.includes(item)) {
					this.$set(this.customerInformationForm.businessTag, item, true)
				} else {
					this.$set(this.customerInformationForm.businessTag, item, false)
				}
			})
			if (val.includes('onlyPodServiceFlag')) {
				this.$set(this.customerInformationForm.businessTag, 'customsClearanceFlag', false)
				this.$set(this.customerInformationForm.businessTag, 'trailerFlag', false)
			}
		}
	}
}
</script>
<style lang="scss" scoped>
::v-deep .el-form-item__label {
	width: 100px;
	text-align: right;
}
.flex-bet {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	flex-wrap: wrap;
}
.box_title {
	border-left: solid 3px rgb(24, 144, 255);
	font-size: 18px;
	color: #199ed8;
	padding-left: 8px;
	height: 28px;
	line-height: 28px;
	margin: 5px 0 8px 0;
	display: flex;
	.operate-buttons-left {
		margin-left: 20px;
	}
}
.box {
	background-color: #f5f7f7;
	padding: 8px;
	::v-deep .el-form-item--medium {
		.el-form-item__content {
			line-height: 28px;
		}
		.el-form-item__label {
			line-height: 28px;
		}
	}
}
.box_child {
	border: solid 1px rgba(121, 121, 121, 1);
	padding: 20px 30px;
	background: #fff;
	margin-bottom: 15px;
	.box25 {
		width: 20%;
	}
}
::v-deep .el-form--inline .el-form-item {
	display: block;
}
.maintainTimeDialogForm {
	::v-deep .el-form-item__label {
		width: 100px;
		text-align: right;
	}
}
::v-deep .el-form-item__content {
	white-space: inherit;
	max-width: calc(100% - 100px);
	word-wrap: break-word;
	word-break: break-all;
}
.bookingStatus {
	position: absolute;
	width: 200px;
	height: 80px;
	line-height: 80px;
	transform: rotate(20deg);
	top: 100px;
	left: 0px;
	right: 0px;
	margin: auto;
	font-size: 34px;
	text-align: center;
	border-radius: 12px;
	pointer-events: none;
	&.businessTagBox {
		height: auto;
		padding: 15px;
		z-index: 99;
		div {
			line-height: 30px !important;
			font-size: 18px !important;
		}
	}
}
.changeUnit-form ::v-deep {
	.el-form-item {
		width: 310px;
	}
}
.bookingStatus0 {
	border: 2px solid #67c23a;
	color: #67c23a;
}
.bookingStatus1 {
	border: 2px solid #909399;
	color: #909399;
}
.bookingStatus2 {
	border: 2px solid #e6a23c;
	color: #e6a23c;
}
.bookingStatus3 {
	border: 2px solid red;
	color: red;
}
.bookingStatus10 {
	border: 2px solid red;
	color: red;
}
.bookingStatus100 {
	border: 2px solid red;
	color: red;
}
.bookingStatus110 {
	border: 2px solid red;
	color: red;
}

.status-text20 {
	color: #e6a23c;
}
.status-text30 {
	color: rgb(90, 156, 255);
}
.status-text40 {
	color: rgb(222, 90, 255);
}
.status-text50 {
	color: rgb(0, 0, 255);
}
.status-text60 {
	color: #67c23a;
}
.status-text100 {
	color: #f56c6c;
}
.icon {
	font-size: 20px;
	transition: all 0.2s ease 0s;
	cursor: pointer;
	user-select: none;
	padding: 0;
	&:hover {
		transform: scale(1.1);
	}
}
.blue {
	color: #1890ff;
}

.red {
	color: #ff4949;
}
.businessTag ::v-deep .el-radio {
	margin-bottom: 5px;
}
</style>
