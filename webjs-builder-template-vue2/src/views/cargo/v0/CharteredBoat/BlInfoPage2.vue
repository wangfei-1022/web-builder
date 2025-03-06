<template>
  <div class="box" v-loading="loading">
    <el-form :inline="true" :model="customerBlForm" @submit.native.prevent ref="customerBlForm" label-position="top">
      <!--      提单信息-->
      <div class="box_title">{{ customerBlForm.blNo }}</div>
      <div class="box_child">
        <div class="flex-bet" style="width: 100%; padding: 0 7%">
          <div style="width: 47.5%" class="block">
            <el-form-item label="1.Shipper Insert Name Address and Phone/Fax" prop="shipperAddress" style="position: relative" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'} ]">
              <el-input class="textareaH" style="height: 98px;" type="textarea" :placeholder="$t('sea.pleaseEnter')" v-input-auto="'upperCase'" v-model="customerBlForm.shipperAddress" maxlength="1000" show-word-limit></el-input>
              <div style="position: absolute; top: -37px;right: 0;">
                {{$t('blInfo.referenceBillOfLading')}}
                <el-input v-model="otherBookingVal" :placeholder="$t('blInfo.placeholder')"  class="other-input" style="width: 150px;" @blur="otherBookingBlur" size="mini"/>
              </div>
            </el-form-item>
            <el-form-item label="2.Consignee Insert Name Address and Phone/fax" prop="consigneeAddress" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'} ]">
              <el-input class="textareaH" style="height: 98px;" type="textarea" :placeholder="$t('sea.pleaseEnter')" v-input-auto="'upperCase'" v-model="customerBlForm.consigneeAddress" maxlength="1000" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="3.Notify Party Insert Name Address and Phone/Fax" prop="notifyAddress" style="position: relative" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'} ]">
              <el-input class="textareaH" style="height: 98px;" type="textarea" placeholder="(It is agreed that no responsibility shall attach
to the Carrier or his agents for failure to notify)" v-input-auto="'upperCase'" v-model="customerBlForm.notifyAddress" maxlength="1000" show-word-limit></el-input>
              <el-button @click="SAMEASCONSIGNEE" type="primary" size="mini" style="position: absolute; top: -37px;right: 0;">SAME AS CONSIGNEE</el-button>

            </el-form-item>
          </div>
          <div style="width: 47.5%;">
            <el-form-item label="Booking No." prop="bookingNos" style="width: 40%;" >
              <!--              <el-select v-model="customerBlForm.bookingNos" :placeholder="$t('sea.pleaseEnter')" filterable>-->
              <!--                <el-option v-for="(item) in customerBlForm.soNoSet" :label="item" :value="item" :key="item"></el-option>-->
              <!--              </el-select>-->
              <div style="width: 200px; height: 98px; overflow: auto">
                <div v-for="item in customerBlForm.bookingNos" :key="item">
                  {{item}}
                </div>
              </div>

              <!--              <el-autocomplete-->
              <!--                class="inline-input"-->
              <!--                v-model="customerBlForm.bookingNos"-->
              <!--                :fetch-suggestions="querySearchContractNo"-->
              <!--                :placeholder="$t('sea.pleaseEnter')"-->
              <!--                @select="handleSelect"-->
              <!--              ></el-autocomplete>-->
            </el-form-item>
            <el-form-item label="Bill of Lading No." style="width: 40%;" >
              {{ customerBlForm.blNo }}
            </el-form-item>

            <el-form-item prop="agentInfo" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'} ]" label="For delivery of goods please apply to" style="width: 100%;" >
              <el-input type="textarea" v-input-auto="'upperCase'" class="textareaH" style="height: 98px;" v-model="customerBlForm.agentInfo" maxlength="1000" show-word-limit rows="5" ></el-input>
            </el-form-item>

            <el-form-item label="Description of Goods" style="width: 100%;" prop="blDesc" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'} ]" >
              <el-input type="textarea" v-input-auto="'upperCase'" class="textareaH" style="height: 98px;" v-model="customerBlForm.blDesc" maxlength="1000" show-word-limit rows="5"></el-input>
              <el-checkbox v-model="customerBlForm.attachedFlag" style="position: absolute; top: -37px;right: 0;">Show Attached</el-checkbox>
            </el-form-item>

          </div>

          <div class="flex-bet" style="width: 47.5%;">
            <el-form-item label="4. Combined Transport* Pre-Carriage by" prop="combinedVessel" style="width: 45%;" >
              <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.combinedVessel" ></el-input>
            </el-form-item>
            <el-form-item label="5. Combined Transport* Place of Receipt" prop="receipt" style="width: 45%;" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'} ]" >
              <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.receipt" ></el-input>
              <!--            <cargo-advance-select-->
              <!--              ref="polCodeSelect"-->
              <!--              :url="url.qf.seaport"-->
              <!--              :default-value="customerBlForm.receipt"-->
              <!--              :headers="['英文名称','五字码','中文名称']"-->
              <!--              :fields="['englishName','code5','chineseName']"-->
              <!--              tag-value="code5"-->
              <!--              tag-name="enPortName"-->
              <!--              :placeholder="$t('sea.polHold')"-->
              <!--              remote-->
              <!--              @parentCallBack="(data)=>{-->
              <!--                    customerBlForm.receiptCode=data.code5-->
              <!--                    customerBlForm.receipt=data.englishName-->
              <!--                  }"-->
              <!--            />-->
            </el-form-item>
            <el-form-item label="6. Ocean Vessel Voy. No." style="width: 45%;" prop="vesselVoyageFormat" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'} ]">
              <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.vesselVoyageFormat"></el-input>
            </el-form-item>
            <el-form-item label="7.Port of Loading" style="width: 45%;" prop="pol" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'} ]" >
              <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.pol"></el-input>
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
            <el-form-item label="8.Port of Discharge" style="width: 45%;" prop="pod" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'} ]">
              <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.pod"></el-input>
            </el-form-item>
            <el-form-item label="9. Combined Transport* Place of Delivery" prop="destination" style="width: 45%;" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'} ]" >
              <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.destination"></el-input>
              <!--            <cargo-advance-select-->
              <!--              ref="polCodeSelect"-->
              <!--              :url="url.qf.seaport"-->
              <!--              :default-value="customerBlForm.destinationCode"-->
              <!--              :headers="['英文名称','五字码','中文名称']"-->
              <!--              :fields="['englishName','code5','chineseName']"-->
              <!--              tag-value="code5"-->
              <!--              tag-name="enPortName"-->
              <!--              :placeholder="$t('sea.polHold')"-->
              <!--              remote-->
              <!--              @parentCallBack="(data)=>{-->
              <!--                    customerBlForm.destinationCode=data.code5-->
              <!--                    customerBlForm.destination=data.englishName-->
              <!--                  }"-->
              <!--            />-->
            </el-form-item>


          </div>
          <div class="flex-bet" style="width: 47.5%;">
            <el-form-item label="Marks & Nos." style="width:100%;" prop="marks" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'} ]">
              <el-checkbox v-model="customerBlForm.marksAttachedFlag" style="position: absolute; top: -37px;right: 0;">Show Attached</el-checkbox>
              <el-input type="textarea" v-input-auto="'upperCase'" v-model="customerBlForm.marks" maxlength="1000" show-word-limit rows="5" class="textareaH" style="height: 132px"></el-input>
            </el-form-item>
            <el-form-item label="Type of Movement" style="width: 100%;" prop="typeOfMovement" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'} ]">
              <el-input type="text" placeholder="" v-trim v-input-auto="'upperCase'" v-model="customerBlForm.typeOfMovement"></el-input>
            </el-form-item>
          </div>

        </div>

        <div class="flex-bet" style="width: 100%; padding: 0 7%">

          <div class="flex-bet" style="width: 47.5%;">
            <el-form-item label="Container No. & Seal No." style="width: 44%;" >
              <div style="height: 117px; overflow: auto; border: #ccc 1px solid; border-radius: 5px; padding: 0 10px">
                <div v-for="(item,index) in containerList" :key="index">{{item.containerNo}} / {{item.sealNo}} / {{item.containerType}}</div>
              </div>
            </el-form-item>
            <el-form-item label="Quantity No. of Container of Packages" style="width: 44%;" >
              <el-input type="text" v-model="customerBlForm.sumQuantity" :disabled="true" style="width: 100px;"/>
              <el-input type="text" v-model="customerBlForm.packageType" :disabled="true" style="width: 120px;"/>
            </el-form-item>

          </div>
          <div class="flex-bet" style="width: 47.5%;">
            <el-form-item label="Gross Weight" style="width:  44%;" >
              <el-input type="text" v-model="customerBlForm.sumGrossWeight" :disabled="true"/>
            </el-form-item>
            <el-form-item label="Measurement" style="width:  44%;" >
              <el-input type="text" v-model="customerBlForm.sumVolume" :disabled="true"/>
            </el-form-item>

            <el-form-item label="Issue Type" style="width:  44%;" prop="blType" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'} ]">
              <!--              Issue Type 1 正本 2 电放-->
              <el-radio-group v-model="customerBlForm.blType">
                <el-radio :label="1">ORIGINAL</el-radio>
                <el-radio :label="2">TELEX RELEASE</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Payment Type" style="width:  44%;" prop="paymentMode" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'} ]">
              <el-radio-group v-model="customerBlForm.paymentMode">
                <el-radio :label="1">Prepaid</el-radio>
                <el-radio :label="2">Collect</el-radio>
              </el-radio-group>
            </el-form-item>


          </div>


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
              <el-input v-model="customerBlForm.totalNumber" maxlength="1000" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div style="width: 47.5%" class="block">
            <el-form-item label="BL Type" style="width:  44%;" prop="blSignType" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'} ]">
              <el-radio-group v-model="customerBlForm.blSignType">
                <el-radio :label="1">MBL</el-radio>
                <el-radio :label="2">MBL+HBL</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="" prop="chargeFlag" style="margin-top: 0px" >
              <el-checkbox v-model="customerBlForm.chargeFlag" @change="chargeFlagChange">Show Freight</el-checkbox>
            </el-form-item>
          </div>
        </div>
        <div v-if="customerBlForm.chargeFlag" class="flex-bet" style="width: 100%; padding: 0 7%"  >
          <el-table class="case-data-table" :data="customerBlForm.chargeDTOS" max-height="300" >
            <el-table-column width="200">
              <template slot="header">
                <span class="red">*</span>11. Freight & Charges
              </template>
              <template slot-scope="{row,$index}">
                <el-form-item label="" :prop="'chargeDTOS.' + $index + '.chargeName'" :rules="[{ required: true, message: $t('sea.placeholder'), trigger: 'change'},]">
                  <span v-if="!row.isEdit">{{row.chargeName}}</span>
                  <el-input v-else v-trim v-model="row.chargeName" v-input-auto="'EN_num_symbol'" type="text" maxlength="1000" size="mini" ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="Revenue Tons">
              <template slot-scope="{row,$index}">
                <el-form-item label="" :prop="'chargeDTOS.' + $index + '.revenueOns'">
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
                <el-form-item label="" :prop="'chargeDTOS.' + $index + '.rate'" :rules="[{ required: true, message: $t('blInfo.placeholder'), trigger: 'change'},]">
                  <span v-if="!row.isEdit">{{row.rate}}</span>
                  <el-input v-else v-model="row.rate" v-input-limit="[6,2]" @change="amountCalc(row)" maxlength="10" type="text" size="mini"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header">
                <span class="red">*</span>Per
              </template>
              <template slot-scope="{row,$index}">
                <el-form-item label="" :prop="'chargeDTOS.' + $index + '.per'" :rules="[{ required: true, message: $t('blInfo.placeholder'), trigger: 'change'},]">
                  <span v-if="!row.isEdit">{{row.per}}</span>
                  <el-select v-else v-model="row.per" :placeholder="$t('sea.pleaseEnter')" filterable  @change="amountCalc(row)" size="mini">
                    <el-option  label="1/CONTAINER" value="1/CONTAINER"></el-option>
                    <el-option v-for="(item,key) in customerBlForm.containerSizeTypeQtyArr" :label="`1/${key}`" :value="`1/${key}`" :key="key"></el-option>
                    <el-option  label="1" :value="1" ></el-option>
                  </el-select>
                  <!--                  <el-input v-else v-trim v-model="row.per" maxlength="1000" type="text" size="mini"></el-input>-->
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header">
                <span class="red">*</span>Currency
              </template>
              <template slot-scope="{row,$index}">
                <el-form-item label="" :prop="'chargeDTOS.' + $index + '.currency'" :rules="[{ required: true, message: $t('blInfo.placeholder'), trigger: 'change'},]">
                  <span v-if="!row.isEdit">{{row.currency}}</span>
                  <cargo-limited-select
                    v-else
                    :select-value="row.currency"
                    type="currency"
                    style="width: 100%;"
                    @set="row.currency = $event"
                  />
                  <!--                  <el-input v-else v-trim v-model="row.currency" v-input-auto="'EN_num_symbol'" maxlength="1000" type="text" size="mini"></el-input>-->
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header">
                <span class="red">*</span>Amount
              </template>
              <template slot-scope="{row,$index}">
                <el-form-item label="" :prop="'chargeDTOS.' + $index + '.amount'" :rules="[{ required: true, message: $t('blInfo.placeholder'), trigger: 'change'},]">
                  <span v-if="!row.isEdit">{{row.amount}}</span>
                  <el-input v-else v-trim v-model="row.amount" :disabled="true" v-input-limit="[9,2]" maxlength="1000" type="text" size="mini"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width="150">
              <template slot="header">
                <span class="red">*</span>Prepaid Collect
              </template>
              <template slot-scope="{row,$index}">
                <el-form-item label="" :prop="'chargeDTOS.' + $index + '.payMode'" :rules="[{ required: true, message: $t('blInfo.placeholder'), trigger: 'change'},]">
                  <el-radio-group v-model="row.payMode">
                    <el-radio label="PREPAID" style="padding-left: 25px"></el-radio>
                    <el-radio label="COLLECT" style="padding-left: 12px"></el-radio>
                  </el-radio-group>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width="150">
              <template slot="header">
                <span class="red">*</span>MBL <span style="padding-left: 4px">HBL</span>
              </template>
              <template slot-scope="{row,$index}">
                <el-form-item label="" :prop="'chargeDTOS.' + $index + '.blType'" :rules="[{ required: true, message: $t('blInfo.placeholder'), trigger: 'change'},]">
                  <el-radio-group v-model="row.blType">
                    <el-radio label="MBL" style="padding-left: 10px"></el-radio>
                    <el-radio label="HBL"></el-radio>
                  </el-radio-group>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width="150">
              <template slot-scope="{row,$index}">
                <template>
                  <el-button v-if="!row.isEdit" type="text" size="medium" :disabled="isEdit"  @click="editCost(row,$index)" icon="el-icon-edit" class="icon blue"></el-button>
                  <el-button v-if="row.isEdit" type="text" size="medium"  @click="editSave(row,$index)" icon="el-icon-circle-check" class="icon blue"></el-button>
                  <el-button v-if="row.isEdit" type="text" size="medium"  @click="editClose(row,$index)" icon="el-icon-circle-close" class="icon blue"></el-button>
                  <el-button v-if="!row.isEdit" type="text" size="medium" :disabled="isEdit"  @click="addCost(row,$index)" icon="el-icon-circle-plus" class="icon blue"> </el-button>
                  <el-button v-if="!row.isEdit && customerBlForm.chargeDTOS.length>1" type="text" size="medium" :disabled="isEdit" @click="delCost($index)" icon="el-icon-remove" class="icon red"></el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--        <div   class="flex-bet" style="width: 100%; padding: 0 7%" >-->
        <!--          &lt;!&ndash;        支付方信息&ndash;&gt;-->
        <!--          <el-form-item v-if="customerBlForm.chargeFlag" label="Freight & Charges Payable at / by" prop="freightInfo" style="width: 47.5%; margin-top: 10px" >-->
        <!--            <el-input type="text" v-input-auto="'upperCase'" v-model="customerBlForm.freightInfo" maxlength="1000"></el-input>-->
        <!--          </el-form-item>-->
        <!--        </div>-->
        <div class="flex-bet" style="width: 100%; padding: 0 7%">
          <!--        支付方信息-->
          <div class="flex-bet" style="width: 47%;">
            <el-form-item v-if="customerBlForm.chargeFlag" label="Freight & Charges Payable at / by" prop="freightInfo" style="width: 100%; margin-top: 10px" >
              <el-input type="text" v-input-auto="'upperCase'" v-model="customerBlForm.freightInfo" maxlength="1000" size="mini"></el-input>
            </el-form-item>
            <div style="width: 47%">
              <el-form-item label="No.of Original B/L(s)" prop="a" style="width: 100%" >
                <el-input v-model="customerBlForm.originalNum" :disabled="true" v-input-auto="'int'" type="text" maxlength="1000" size="mini" ></el-input>
              </el-form-item>
              <el-form-item label="Date Laden on Board" style="width: 100%;" prop="onboardDate" >
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
              <el-form-item label="The Vessel By" style="width: 100%;" prop="theVesselBy">
                <el-input type="text" v-input-auto="'upperCase'" v-model="customerBlForm.theVesselBy" maxlength="1000" size="mini"></el-input>
              </el-form-item>
            </div>
            <div style="width: 47%">

              <el-form-item label="Date of Issue" prop="issueDateArtificial"  style="width: 100%">
                <CommonPicker
                  v-model="customerBlForm.issueDateArtificial"
                  parent-class="w178"
                  size="mini"
                  picker-format="yyyy-MM-dd"
                  pikcer-type="date"
                  :clearable="false"
                  :placeholder="$t('sea.placeholder')"
                />
              </el-form-item>
              <el-radio-group v-model="issuePlaceQuick" @change="issuePlaceQuickChange" class="issuePlaceQuick" >
                <el-radio label="QINGDAO">{{$t('blInfo.QINGDAO')}}</el-radio>
                <el-radio label="SHANGHAI">{{$t('blInfo.SHANGHAI')}}</el-radio>
                <el-radio label="NINGBO">{{$t('blInfo.NINGBO')}}</el-radio>
                <el-radio label="XIAMEN">{{$t('blInfo.XIAMEN')}}</el-radio>
                <el-radio label="SHENZHEN">{{$t('blInfo.SHENZHEN')}}</el-radio>
                <el-radio label="GUANGZHOU">{{$t('blInfo.GUANGZHOU')}}</el-radio>
              </el-radio-group>
              <el-form-item label="Place of Issue" prop="issuePlace"  style="width: 100%">
                <el-input v-trim v-input-auto="'upperCase'" v-model="customerBlForm.issuePlace" type="text" maxlength="1000" size="mini" ></el-input>
              </el-form-item>
            </div>
          </div>
          <div style="width: 47%;">
            <!--            v-if="isBrazil"-->
            <el-form-item v-if="isBrazil" label="Demurrage Tarif At Brazil" prop="demurrage" style="width: 100%;" >
              <el-input  v-input-auto="'upperCase'" v-model="customerBlForm.demurrage" type="textarea" maxlength="1000" size="mini" rows="5" class="textareaH" style="height: 129px" ></el-input>
            </el-form-item>
            <el-form-item label="Signed for the carrier" prop="issueBy" style="width: 100%;" >
              <el-input v-trim v-input-auto="'upperCase'" v-model="customerBlForm.issueBy" :disabled="true" type="text" maxlength="1000" size="mini" ></el-input>
            </el-form-item>
            <el-form-item label="Consignee or Notify Party Email" style="width: 100%;" prop="notifyEmail" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change'},{ validator: validateEmail, trigger: 'blur' }]" >
              <el-input v-trim v-input-auto="'upperCase'" v-model="customerBlForm.notifyEmail" type="text" maxlength="1000" size="mini" ></el-input>
            </el-form-item>
          </div>

        </div>

      </div>
    </el-form>
  </div>
</template>
<script>
import URL from '@/api/urlTranslator'
import {billDetailByBlNo, checkMblNoApi} from "@/api/bl";
import lodash from 'lodash'
import {validEmail} from "@/utils/validate";
import cargoLimitedSelect from "@/components/Cargo/Common/cargoLimitedSelect";
import expenseDefaults from "@/views/cargo/v0/CharteredBoat/data/expenseDefaults";
export default {
  name: 'BlInfoPage2',
  components: {cargoLimitedSelect},
  props: {
    initialValue: { type: Object, default: () => {} },
    containerList: { type: Array, default: () => [] }
  },
  data() {
    return {
      loading: false,
      query: this.$route.query,
      customerBlForm: {
        originalNum: 3,
        issueBy: 'ESHIPPING GLOBAL SUPPLY CHAIN MANAGEMENT (SHENZHEN)COMPANY LIMITED'
      },
      isEdit: false,
      otherBookingVal: null,
      issuePlaceQuick: '',
      chargeFlagChangeFirst: true
    }
  },
  computed: {
    url() {
      return URL
    },
    totalVolume() {
      let sum = 0
      Object.keys(this.customerBlForm.containerSizeTypeQtyArr).map(key => {
        sum += this.customerBlForm.containerSizeTypeQtyArr[key]
      })
      return sum
    },
    isBrazil() {
      if (this.customerBlForm.destination) {
        return this.customerBlForm.destination.toUpperCase().indexOf('BRAZIL') > -1
      } else {
        return false
      }
    }
  },
  watch: {
    initialValue(val) {
      this.customerBlForm = val
      this.init()
    }
  },
  created() {
    this.customerBlForm = lodash.cloneDeep(this.initialValue)
    this.init()
    if (!this.customerBlForm.chargeDTOS || this.$isEmpty(this.customerBlForm.chargeDTOS)) {
      const chargeDTOS = [{
        chargeCode: null,
        chargeName: 'OCEAN FREIGHT',
        revenueOns: null,
        rate: null,
        per: null,
        currency: 'USD', // 'USD',
        amount: null,
        payMode: 'PREPAID',
        isEdit: false
      }]
      this.$set(this.customerBlForm, 'chargeDTOS', chargeDTOS)
    }
  },
  methods: {
    init() {
      if (!this.customerBlForm.originalNum) {
        this.$set(this.customerBlForm, 'originalNum', 3)
      }
      if (!this.customerBlForm.issueBy) {
        this.$set(this.customerBlForm, 'issueBy', 'ESHIPPING GLOBAL SUPPLY CHAIN MANAGEMENT (SHENZHEN)COMPANY LIMITED')
      }
      if (!this.customerBlForm.typeOfMovement) {
        this.$set(this.customerBlForm, 'typeOfMovement', 'FCL/FCL')
      }

    },
    validateEmail(rule, value, callback) {
      if (!validEmail(value) && value) {
        callback(new Error(this.$t('blInfo.emailError')))
      } else {
        callback()
      }
    },
    chargeFlagChange(val) {
      if (val && (this.query.type === 'create' || this.query.type === 'mergeFlag' || this.query.type === 'edit')) {
        if (!this.chargeFlagChangeFirst && this.query.type === 'edit') {return}
        this.chargeFlagChangeFirst = false
        const expenseDefaultsCopy = lodash.cloneDeep(expenseDefaults)
        let fistKey = null;
        for (let key in this.customerBlForm.containerSizeTypeQtyArr) {
          fistKey = key;
          break;
        }
        let per = `1/${fistKey}`
        expenseDefaultsCopy[0].per = per
        expenseDefaultsCopy[1].per = per
        this.$set(this.customerBlForm, 'chargeDTOS', expenseDefaultsCopy)
      } else if (!val && this.query.type === 'edit') {
        this.chargeFlagChangeFirst = false
      }
    },
    // 计算费用项 amount
    amountCalc(row) {
      if (row.rate && row.per) {
        if (row.per === '1/CONTAINER') { // RATE*总箱量
          let amount = row.rate * this.totalVolume
          this.$set(row, 'amount', amount)
        } else if (Number(row.per) === 1) { // RATE值就等于AMOUNT
          this.$set(row, 'amount', row.rate)
        } else { // RATE*对应箱型的数量得出AMOUNT
          let boxQuantity = this.customerBlForm.containerSizeTypeQtyArr[row.per.split('/')[1]]
          let amount
          if (boxQuantity) {
            amount = row.rate * boxQuantity
          }
          this.$set(row, 'amount', amount)
        }
      } else {
        this.$set(row, 'amount', null)
      }
    },
    otherBookingBlur() { // 填写其他提单收发通
      if (!this.otherBookingVal) {
        return
      }
      this.fullscreenLoading = true
      billDetailByBlNo(this.otherBookingVal).then(res => {
        this.fullscreenLoading = false
        if (res.ok && res.content) {
          this.customerBlForm.blType = res.content.blType
          this.customerBlForm.paymentMode = res.content.paymentMode
          this.customerBlForm.shipperAddress = res.content.shipperAddress
          this.customerBlForm.consigneeAddress = res.content.consigneeAddress
          this.customerBlForm.notifyAddress = res.content.notifyAddress
          this.customerBlForm.notifyEmail = res.content.notifyEmail
          this.customerBlForm.marks = res.content.marks
          this.customerBlForm.blDesc = res.content.blDesc
        }
      })
    },
    issuePlaceQuickChange(val) {
      this.$set(this.customerBlForm, 'issuePlace', val)
    },
    retCustomerBlForm() {
      this.$refs.customerBlForm.validate(async (valid, obj) => {
        if (valid) {
          this.$emit('retCustomerBlForm', this.customerBlForm, true)
        } else {
          let isShargeDTOS = Object.keys(obj).every(key => key.indexOf('chargeDTOS') > -1)
          if (isShargeDTOS) {
            this.$message.warning(this.$t('sea.pleaseSupplementTheExpenseInformation'))
          }
          this.$emit('retCustomerBlForm', this.customerBlForm, false)
          setTimeout(() => {
            const isError = document.getElementsByClassName('is-error')
            isError[0].scrollIntoView({block: 'center', behavior: 'smooth'})
          }, 100)
          return false
        }
      })
    },
    // /////////////////////=========================
    SAMEASCONSIGNEE() {
      this.$set(this.customerBlForm, 'notifyAddress', `SAME AS CONSIGNEE`)
    },
    packageRuleChange(val) {
      console.log(this.customerBlForm, this.containerList)
      if (val === 1 && this.customerBlForm.count) {
        if (this.customerBlForm.count === 1) {
          this.$set(this.customerBlForm, 'totalNumber', 'SAY ONE CONTAINER ONLY')
        } else {
          this.$set(this.customerBlForm, 'totalNumber', `SAY ${this.customerBlForm.count.toString().toEnglish().toUpperCase()} ${this.customerBlForm.count > 1 ? 'CONTAINERS' : 'CONTAINER'} ONLY`)
        }
      } else if (val === 2 && (this.customerBlForm.quantity || this.customerBlForm.sumQuantity)) {
        let quantity = this.customerBlForm.quantity || this.customerBlForm.sumQuantity
        this.$set(this.customerBlForm, 'totalNumber', `SAY ${quantity.toString().toEnglish().toUpperCase()} ${this.customerBlForm.packageType} ONLY.`)
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
        'chargeDTOS.' + $index + '.chargeName',
        'chargeDTOS.' + $index + '.rate',
        'chargeDTOS.' + $index + '.per',
        'chargeDTOS.' + $index + '.currency',
        'chargeDTOS.' + $index + '.amount',
        'chargeDTOS.' + $index + '.payMode',
        'chargeDTOS.' + $index + '.blType'
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
      this.$set(this.customerBlForm.chargeDTOS, i, this.copyRow)
      this.isEdit = false
    },
    addCost(row, i) {
      let rowCopy = lodash.cloneDeep(row)
      rowCopy.isEdit = false
      delete rowCopy.id
      this.customerBlForm.chargeDTOS.push(rowCopy)
    },
    delCost(i) {
      this.customerBlForm.chargeDTOS.splice(i, 1)
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
  ::v-deep .el-textarea__inner{height: 100% !important;}
}
::v-deep .el-textarea__inner{resize: none;}
.case-data-table{
  width: 100%;
  ::v-deep .el-form-item{ margin: 8px 0}
  ::v-deep .el-form-item__error{ display: none}
  ::v-deep .el-radio__label{ display: none;}
}
.issuePlaceQuick{ width: 100%;margin-top: 20px;
  ::v-deep .el-radio{ margin:18px 40px 0 0 ;}
}
</style>
