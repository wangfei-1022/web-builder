<template>
  <div class="box" v-loading="loading" style="margin-bottom: 60px">
    <el-form :inline="true" :model="shippingInformationForm" @submit.native.prevent ref="shippingInformationForm">
      <!--      船期信息-->
      <div class="box_title">{{$t('sea.shippingInformation')}}</div>
      <div class="box_child shippingInformation" style="position: relative; min-width: 1335px; overflow: auto">
        <el-form-item v-if="shippingInformationForm.serialFlag" :label="$t('sea.serialNumber')" prop="thirdSerialNo"
                      :rules="[{ required: true, message: $t('sea.serialNumberIsIncorrect'), trigger: 'blur' },
                      {validator:checkRepeatSerial,trigger: 'blur'},
                      {message: $t('sea.serialNumberIsIncorrect'),validator:checkSerialNumber,trigger: 'blur'}]">
          <el-input :disabled="isDisabled" class="w178" v-trim v-model="shippingInformationForm.thirdSerialNo" v-input-auto="'EN_num'" maxlength="12" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>
        </el-form-item>
        <el-form-item v-else label="SO" prop="soNo" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'blur' },{validator:checkRepeatSoNo,trigger: 'blur'},]">
          <el-input :disabled="isEditSoNo" class="w178" v-trim v-model="shippingInformationForm.soNo" v-input-auto="'EN_num'" maxlength="30" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>
        </el-form-item>
        <!--        收货地-->
        <el-form-item :label="$t('sea.placeOfReceipt')" prop="receiptCode" :rules="[{ required: shippingInformationForm.polTransportTermCode === 'DOOR', message: $t('sea.pleaseEnter'), trigger: 'blur' },]">
          <SeaCitySelect :disabled="is304050" v-model="shippingInformationForm.receiptCode" class="w178"></SeaCitySelect>
        </el-form-item>
        <!--            船司-->
        <el-form-item :label="$t('sea.shipBoss')"  prop="carrierId" :rules="[ { required: true, message: $t('sea.shipBossHold'), trigger: 'blur' } ]">
          <cargo-advance-select
            :url="url.omc.shippingCompanylist"
            :default-value="shippingInformationForm.carrierName"
            tag-value="id"
            tag-name="chineseName"
            :headers="['中文简称','英文简称',]"
            :fields="['chineseShortname','englishShortname']"
            :options-width="'400px'"
            remote
            :disabled="isDisabled"
            style="width: 178px"
            :clearable="false"
            :placeholder="$t('sea.shipBossHold')"
            @parentCallBack="data=>{
                    shippingInformationForm.carrierId=data.id
                    shippingInformationForm.carrierName=data.englishShortname
                  }"
          />
        </el-form-item>
        <!--        订舱网点-->
        <el-form-item :label="$t('sea.orderWebsite')" prop="orderWebsite">
          <SeaCitySelect :disabled="isDisabled" v-model="shippingInformationForm.orderWebsite" class="w178"></SeaCitySelect>
        </el-form-item>

        <!--        分单号 此控件在目前业务场景下，暂时用不到，先隐藏，后期业务场景需要再放出 shippingInformationForm.carrierName === 'COSCO'-->
        <el-form-item v-if="shippingInformationForm.carrierName === 'COSCO' && Number(shippingInformationForm.bookingChannel) === 1" label="" prop="serialFlag">
          <el-checkbox :disabled="isDisabled" v-model="shippingInformationForm.serialFlag" @change="serialFlagChange" style="margin-left: 100px">{{$t('sea.serialNumberQueryBooking')}}</el-checkbox>
        </el-form-item>
        <el-form-item v-else label="" prop="soNoAdd"></el-form-item>
        <!--        <el-form-item :label="$t('sea.soNoSon')" prop="soNoAdd">-->
        <!--          <el-input :disabled="isDisabled" class="w178" v-trim v-model="soNoAdd" v-input-auto="'EN_num'" maxlength="30" size="mini" :placeholder="$t('sea.pleaseEnter')">-->
        <!--          </el-input>-->
        <!--          <i v-if="!isDisabled" class="icon el-icon-circle-plus blue soNoAdd" @click="soNoAddFun"></i>-->
        <!--        </el-form-item>-->
        <!--          装货港-->
        <el-form-item :label="$t('sea.pol2')" prop="polCode" :rules="[{ required: true, message: $t('sea.placeholder'), trigger: 'change',trigger: 'blur' },]">
          <cargo-advance-select
            ref="polCodeSelect"
            :url="url.qf.seaport"
            :default-value="shippingInformationForm.pol"
            :headers="['英文名称','五字码','中文名称']"
            :fields="['englishName','code5','chineseName']"
            tag-value="code5"
            tag-name="enPortName"
            :disabled="is304050"
            :placeholder="$t('sea.pleaseEnter')"
            remote
            @parentCallBack="(data)=>{
                  shippingInformationForm.polCode=data.code5
                  shippingInformationForm.pol=data.englishName
                }"
          />
        </el-form-item>
        <el-form-item :label="$t('sea.polTransportTerm')" prop="polTransportTermCode" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
          <el-select :disabled="isDisabled" v-model="shippingInformationForm.polTransportTermCode" :placeholder="$t('sea.placeholder')" filterable @change="polTransportTermChange" size="mini">
            <el-option v-for="(item, index) in transportTermList" :label="item.name" :value="item.code" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <!--        船名-->
        <span v-if="!shippingInformationForm.serialFlag" >
          <el-form-item  style="position: relative" :label="$t('sea.shipName')" prop="vessel" size="mini" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
            <el-input :disabled="is304050 || shippingInformationForm.TBA" class="w178" v-trim v-model="shippingInformationForm.vessel" v-input-auto="'EN_num_symbol'" maxlength="1000" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>
            <el-checkbox v-model="shippingInformationForm.TBA" @change="TBAChange" style="position: absolute; right: -65px; top: 0">TBA</el-checkbox>
          </el-form-item>
        </span>
        <el-form-item v-else label=""></el-form-item>


        <!--        订舱代理-->
        <span v-if="shippingInformationForm.serialFlag" >
        <el-form-item :label="$t('sea.bookingAgentPort')" prop="bookingAgentPort" size="mini" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
          <el-select :disabled="isDisabled" v-model="shippingInformationForm.bookingAgentPort" :placeholder="$t('sea.placeholder')" filterable @change="polTransportTermChange" size="mini">
            <el-option v-for="item in bookingAgentArr" :label="item" :value="item" :key="item"></el-option>
          </el-select>
        </el-form-item>
        </span>
        <el-form-item v-else label=""></el-form-item>

        <!--        <el-form-item label=""></el-form-item>-->
        <!--        分单号 此控件在目前业务场景下，暂时用不到，先隐藏，后期业务场景需要再放出-->
        <!--        <el-form-item label=" " prop="soNoSon" size="mini" style="position: absolute; left: 30px; top: 120px">-->
        <!--          <el-card class="box-card">-->
        <!--            <div v-for="(item,index) in shippingInformationForm.soNoSon" :key="item" class="text item">-->
        <!--              {{item }}-->
        <!--              <i v-if="!isDisabled" class="el-icon-circle-close" @click="soNoSonDel(index)"></i>-->
        <!--            </div>-->
        <!--          </el-card>-->
        <!--        </el-form-item>-->
        <!--          卸货港-->
        <el-form-item :label="$t('sea.pod')" prop="podCode" :rules="[{ required: true, message: $t('sea.placeholder'), trigger: 'change',trigger: 'blur' },]">
          <cargo-advance-select
            ref="podCodeSelect"
            :url="url.qf.seaport"
            :headers="['英文名称','五字码','中文名称']"
            :default-value="shippingInformationForm.pod"
            :fields="['englishName','code5','chineseName']"
            tag-value="code5"
            tag-name="enPortName"
            :disabled="is304050"
            :placeholder="$t('sea.pleaseEnter')"
            remote
            @parentCallBack="(data)=>{
                  shippingInformationForm.podCode=data.code5
                  shippingInformationForm.pod=data.englishName
                }"
          />
        </el-form-item>
        <el-form-item :label="$t('sea.polTransportTerm')" prop="podTransportTermCode" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
          <el-select :disabled="isDisabled" v-model="shippingInformationForm.podTransportTermCode" :placeholder="$t('sea.placeholder')" filterable @change="podTransportTermChange" size="mini">
            <el-option v-for="(item, index) in transportTermList" :label="item.name" :value="item.code" :key="index"></el-option>
          </el-select>
        </el-form-item>

        <!--        航次-->
        <span v-if="!shippingInformationForm.serialFlag">
          <el-form-item  :label="$t('sea.voyage')" prop="voyage" size="mini" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
            <el-input :disabled="is304050 || shippingInformationForm.TBA" class="w178" v-trim v-model="shippingInformationForm.voyage" v-input-auto="'EN_num_symbol'" maxlength="1000" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>
          </el-form-item>
        </span>
        <el-form-item v-else label=""></el-form-item>
        <el-form-item label=""></el-form-item>
        <!--        交货地-->
        <el-form-item :label="$t('sea.placeOfDelivery')" prop="destinationCode"  :rules="[{ required: shippingInformationForm.podTransportTermCode === 'DOOR', message: $t('sea.pleaseEnter'), trigger: 'change' },]">
          <SeaCitySelect :disabled="is304050" v-model="shippingInformationForm.destinationCode" :type="2" class="w178"></SeaCitySelect>
        </el-form-item>
      </div>

      <!--      货运方信息-->
      <div class="box_title">{{$t('sea.shipperInformation')}}</div>
      <div class="box_child shipperInformation" style="position: relative;">
        <el-form-item :label="$t('sea.contact')" prop="contact" >
          <!--          <el-input v-trim v-model="shippingInformationForm.orderShipperAddress.contact" v-input-auto="'en_num_symbol'" maxlength="1000" size="mini" style=" width: 500px" :placeholder="$t('sea.contactHold')"></el-input>-->
          <el-autocomplete
            v-input-auto="'en_num_symbol'"
            v-model="shippingInformationForm.orderShipperAddress.contact"
            :fetch-suggestions="((queryString,cb)=>{querySearch(queryString,cb,'orderShipperAddress')})"
            :placeholder="$t('sea.contactHold')" size="mini"
            @change="onChangeCompanyName($event,'orderShipperAddress')"
            @select="querySearchChange($event,'orderShipperAddress')"
            :disabled="isDisabled"
            style=" width: 500px" >
            <template slot-scope="{ item }">
              <span class="addr">{{ item.contact }}</span>
            </template>
          </el-autocomplete>
          <el-button @click="Eshipping" type="primary" size="mini" style="margin-left: 100px">Eshipping</el-button>
        </el-form-item>
        <el-form-item :label="$t('sea.street')" prop="street" >
          <el-input :disabled="isDisabled" v-trim v-model="shippingInformationForm.orderShipperAddress.street" v-input-auto="'en_num_symbol'" maxlength="1000" size="mini" style=" width: 500px" :placeholder="$t('sea.streetHold')"></el-input>
        </el-form-item>

        <el-form-item :label="$t('sea.city')" prop="city">
          <el-row :gutter="10" type="flex">
            <el-col :span="4">
              <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderShipperAddress.city" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.pleaseEnterCity')" />
            </el-col>
            <el-col :span="4">
              <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderShipperAddress.county" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.countyAndDistrict')" />
            </el-col>
            <el-col :span="4">
              <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderShipperAddress.province" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.provinceState')" />
            </el-col>
            <el-col :span="4">
              <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderShipperAddress.country" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.countries')" />
            </el-col>
            <el-col :span="4">
              <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderShipperAddress.postCode" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.zipCode')" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="$t('sea.contacts')">
          <el-row :gutter="10" type="flex">
            <el-col :span="4">
              <el-form-item label="" prop="lastName">
                <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderShipperAddress.lastName" v-input-auto="'en_num_symbol'" maxlength="100" :placeholder="$t('sea.surname')" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="" prop="firstName">
                <el-input :disabled="isDisabled" size="mini" :placeholder="$t('sea.name')" v-trim v-model="shippingInformationForm.orderShipperAddress.firstName" v-input-auto="'en_num_symbol'" maxlength="100" />
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item :label="$t('sea.contactPhone')" prop="contactPhone">
                <el-row :gutter="10" type="flex">
                  <el-col :span="6">
                    <el-input :disabled="isDisabled" size="mini" placeholder="" v-trim v-model="shippingInformationForm.orderShipperAddress.contactPhone" v-input-auto="'num'" />
                  </el-col>
                  <el-col :span="1">
                    -
                  </el-col>
                  <el-col :span="6">
                    <el-input :disabled="isDisabled" size="mini" placeholder="" v-trim v-model="shippingInformationForm.orderShipperAddress.contactPhone2" v-input-auto="'num'" />
                  </el-col>
                  <el-col :span="1">
                    -
                  </el-col>
                  <el-col :span="8">
                    <el-input :disabled="isDisabled" size="mini" placeholder="" v-trim v-model="shippingInformationForm.orderShipperAddress.contactPhone3" v-input-auto="'num'" />
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>


        <div class="more-info-link" @click="cahngeScrollStatus">
          {{ $t('sea.moreInfo') }}
          <span :class="[moreInfoScrollDown ? 'el-icon-arrow-down' : 'el-icon-arrow-right']"></span>
        </div>
        <div :class="['more-info-content', {'scorll-down-content': moreInfoScrollDown}]">
          <!--          货代-->
          <el-form-item :label="$t('sea.freightForwarder')" prop="orderNotifyAddress.contact">
            <!--            <el-input v-trim v-model="shippingInformationForm.orderForwardersAddress.contact" v-input-auto="'en_num_symbol'" maxlength="1000" size="mini" style=" width: 500px" :placeholder="$t('sea.contactHold')"></el-input>-->
            <el-autocomplete
              v-input-auto="'en_num_symbol'"
              v-model="shippingInformationForm.orderForwardersAddress.contact"
              :fetch-suggestions="((queryString,cb)=>{querySearch(queryString,cb,'orderForwardersAddress')})"
              :placeholder="$t('sea.contactHold')" size="mini"
              @change="onChangeCompanyName($event,'orderForwardersAddress')"
              @select="querySearchChange($event,'orderForwardersAddress')"
              :disabled="isDisabled"
              style=" width: 500px" >
              <template slot-scope="{ item }">
                <span class="addr">{{ item.contact }}</span>
              </template>
            </el-autocomplete>
          </el-form-item>
          <el-form-item :label="$t('sea.street')" prop="street" >
            <el-input :disabled="isDisabled" v-trim v-model="shippingInformationForm.orderForwardersAddress.street" v-input-auto="'en_num_symbol'" maxlength="1000" size="mini" style=" width: 500px" :placeholder="$t('sea.streetHold')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('sea.city')" prop="city">
            <el-row :gutter="10" type="flex">
              <el-col :span="4">
                <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderForwardersAddress.city" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.pleaseEnterCity')" />
              </el-col>
              <el-col :span="4">
                <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderForwardersAddress.county" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.countyAndDistrict')" />
              </el-col>
              <el-col :span="4">
                <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderForwardersAddress.province" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.provinceState')" />
              </el-col>
              <el-col :span="4">
                <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderForwardersAddress.country" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.countries')" />
              </el-col>
              <el-col :span="4">
                <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderForwardersAddress.postCode" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.zipCode')" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item :label="$t('sea.contacts')">
            <el-row :gutter="10" type="flex">
              <el-col :span="4">
                <el-form-item label="" prop="lastName">
                  <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderForwardersAddress.lastName" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.surname')" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="" prop="firstName" >
                  <el-input :disabled="isDisabled" size="mini" :placeholder="$t('sea.name')" v-trim v-model="shippingInformationForm.orderForwardersAddress.firstName" v-input-auto="'en_num_symbol'" maxlength="1000" />
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item :label="$t('sea.contactPhone')" prop="contactPhone">
                  <el-row :gutter="10" type="flex">
                    <el-col :span="6">
                      <el-input :disabled="isDisabled" size="mini" placeholder="" v-trim v-model="shippingInformationForm.orderForwardersAddress.contactPhone" v-input-auto="'num'"  maxlength="100" />
                    </el-col>
                    <el-col :span="1">
                      -
                    </el-col>
                    <el-col :span="6">
                      <el-input :disabled="isDisabled" size="mini" placeholder="" v-trim v-model="shippingInformationForm.orderForwardersAddress.contactPhone2" v-input-auto="'num'"  maxlength="100" />
                    </el-col>
                    <el-col :span="1">
                      -
                    </el-col>
                    <el-col :span="8">
                      <el-input :disabled="isDisabled" size="mini" placeholder="" v-trim v-model="shippingInformationForm.orderForwardersAddress.contactPhone3" v-input-auto="'num'"  maxlength="100" />
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <!--          货代end-->
          <!--        收货人-->
          <el-form-item :label="$t('sea.consignee')" prop="orderConsigneeAddress.contact">
            <!--            <el-input v-trim v-model="shippingInformationForm.orderConsigneeAddress.contact" v-input-auto="'en_num_symbol'" maxlength="1000" size="mini" style=" width: 500px" :placeholder="$t('sea.contactHold')"></el-input>-->
            <el-autocomplete
              v-input-auto="'en_num_symbol'"
              v-model="shippingInformationForm.orderConsigneeAddress.contact"
              :fetch-suggestions="((queryString,cb)=>{querySearch(queryString,cb,'orderConsigneeAddress')})"
              :placeholder="$t('sea.contactHold')" size="mini"
              @change="onChangeCompanyName($event,'orderConsigneeAddress')"
              @select="querySearchChange($event,'orderConsigneeAddress')"
              :disabled="isDisabled"
              style=" width: 500px" >
              <template slot-scope="{ item }">
                <span class="addr">{{ item.contact }}</span>
              </template>
            </el-autocomplete>

          </el-form-item>
          <el-form-item :label="$t('sea.street')" prop="street" >
            <el-input :disabled="isDisabled" v-trim v-model="shippingInformationForm.orderConsigneeAddress.street" v-input-auto="'en_num_symbol'" maxlength="1000" size="mini" style=" width: 500px" :placeholder="$t('sea.streetHold')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('sea.city')" prop="city">
            <el-row :gutter="10" type="flex">
              <el-col :span="4">
                <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderConsigneeAddress.city" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.pleaseEnterCity')" />
              </el-col>
              <el-col :span="4">
                <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderConsigneeAddress.county" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.countyAndDistrict')" />
              </el-col>
              <el-col :span="4">
                <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderConsigneeAddress.province" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.provinceState')" />
              </el-col>
              <el-col :span="4">
                <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderConsigneeAddress.country" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.countries')" />
              </el-col>
              <el-col :span="4">
                <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderConsigneeAddress.postCode" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.zipCode')" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item :label="$t('sea.contacts')">
            <el-row :gutter="10" type="flex">
              <el-col :span="4">
                <el-form-item label="" prop="lastName">
                  <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderConsigneeAddress.lastName" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.surname')" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="" prop="firstName" >
                  <el-input :disabled="isDisabled" size="mini" :placeholder="$t('sea.name')" v-trim v-model="shippingInformationForm.orderConsigneeAddress.firstName" v-input-auto="'en_num_symbol'" maxlength="1000" />
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item :label="$t('sea.contactPhone')" prop="contactPhone">
                  <el-row :gutter="10" type="flex">
                    <el-col :span="6">
                      <el-input :disabled="isDisabled" size="mini" placeholder="" v-trim v-model="shippingInformationForm.orderConsigneeAddress.contactPhone" v-input-auto="'num'"  maxlength="100"/>
                    </el-col>
                    <el-col :span="1">
                      -
                    </el-col>
                    <el-col :span="6">
                      <el-input :disabled="isDisabled" size="mini" placeholder="" v-trim v-model="shippingInformationForm.orderConsigneeAddress.contactPhone2" v-input-auto="'num'"  maxlength="100"/>
                    </el-col>
                    <el-col :span="1">
                      -
                    </el-col>
                    <el-col :span="8">
                      <el-input :disabled="isDisabled" size="mini" placeholder="" v-trim v-model="shippingInformationForm.orderConsigneeAddress.contactPhone3" v-input-auto="'num'"  maxlength="100"/>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <!--          通知人-->
          <el-form-item :label="$t('sea.alertOthers')" prop="orderNotifyAddress.contact">
            <!--            <el-input v-trim v-model="shippingInformationForm.orderNotifyAddress.contact"  v-input-auto="'en_num_symbol'" maxlength="1000" size="mini" style=" width: 500px" :placeholder="$t('sea.contactHold')"></el-input>-->
            <el-autocomplete
              v-input-auto="'en_num_symbol'"
              v-model="shippingInformationForm.orderNotifyAddress.contact"
              :fetch-suggestions="((queryString,cb)=>{querySearch(queryString,cb,'orderNotifyAddress')})"
              :placeholder="$t('sea.contactHold')" size="mini"
              @change="onChangeCompanyName($event,'orderNotifyAddress')"
              @select="querySearchChange($event,'orderNotifyAddress')"
              style=" width: 500px" >
              <template slot-scope="{ item }">
                <span class="addr">{{ item.contact }}</span>
              </template>
            </el-autocomplete>
            <el-button @click="sameConsigneeInformation" type="primary" size="mini" style="margin-left: 100px">{{ $t('sea.sameConsigneeInformation') }}</el-button>
          </el-form-item>
          <el-form-item :label="$t('sea.street')" prop="street" >
            <el-input :disabled="isDisabled" v-trim v-model="shippingInformationForm.orderNotifyAddress.street"  v-input-auto="'en_num_symbol'" maxlength="1000" size="mini" style=" width: 500px" :placeholder="$t('sea.streetHold')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('sea.city')" prop="city">
            <el-row :gutter="10" type="flex">
              <el-col :span="4">
                <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderNotifyAddress.city"  v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.pleaseEnterCity')" />
              </el-col>
              <el-col :span="4">
                <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderNotifyAddress.county"  v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.countyAndDistrict')" />
              </el-col>
              <el-col :span="4">
                <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderNotifyAddress.province"  v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.provinceState')" />
              </el-col>
              <el-col :span="4">
                <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderNotifyAddress.country"  v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.countries')" />
              </el-col>
              <el-col :span="4">
                <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderNotifyAddress.postCode"  v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.zipCode')" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item :label="$t('sea.contacts')">
            <el-row :gutter="10" type="flex">
              <el-col :span="4">
                <el-form-item label="" prop="lastName">
                  <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderNotifyAddress.lastName"  v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.surname')" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="" prop="firstName" >
                  <el-input :disabled="isDisabled" size="mini" :placeholder="$t('sea.name')" v-trim v-model="shippingInformationForm.orderNotifyAddress.firstName"  v-input-auto="'en_num_symbol'" maxlength="1000" />
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item :label="$t('sea.contactPhone')" prop="contactPhone">
                  <el-row :gutter="10" type="flex">
                    <el-col :span="6">
                      <el-input :disabled="isDisabled" size="mini" placeholder="" v-trim v-model="shippingInformationForm.orderNotifyAddress.contactPhone" v-input-auto="'num'"  maxlength="100" />
                    </el-col>
                    <el-col :span="1">
                      -
                    </el-col>
                    <el-col :span="6">
                      <el-input :disabled="isDisabled" size="mini" placeholder="" v-trim v-model="shippingInformationForm.orderNotifyAddress.contactPhone2" v-input-auto="'num'"  maxlength="100" />
                    </el-col>
                    <el-col :span="1">
                      -
                    </el-col>
                    <el-col :span="8">
                      <el-input :disabled="isDisabled" size="mini" placeholder="" v-trim v-model="shippingInformationForm.orderNotifyAddress.contactPhone3" v-input-auto="'num'"  maxlength="100" />
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <!--     通知人     end-->

        </div>
      </div>

      <!--      货物信息-->
      <div class="box_title">{{$t('sea.cargoInformation')}}</div>
      <div class="box_child cargoInformation">
        <!--        货物类型-->
        <el-form-item :label="$t('sea.cargoType')" prop="goodsTypeCode" :rules="[{ required: true, message: $t('sea.placeholder'), trigger: 'change' },]">
          <GoodsType :disabled="isDisabled" v-model="shippingInformationForm.goodsTypeCode" @change="goodsTypeCodeChange"></GoodsType>
        </el-form-item>
        <el-form-item :label="$t('sea.marks')" prop="goodsDesc" :rules="[{ required: true, message: $t('sea.placeholder'), trigger: 'change' },]" class="marks">
          <el-input :disabled="isDisabled" type="textarea" v-model="shippingInformationForm.goodsDesc" v-input-auto="'en_num_symbol'" maxlength="200" show-word-limit size="mini" style="width: 500px;" :placeholder="$t('sea.pleaseEnter')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('sea.CAS')" prop="cas">
          <el-input :disabled="isDisabled" class="w178" v-model="shippingInformationForm.cas" v-input-auto="'en_num_symbol'" maxlength="1000" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>
        </el-form-item>
      </div>

      <!--      集装箱信息-->
      <div class="box_title">{{$t('sea.containerInformation')}}</div>
      <div class="box_child cargoInformation">
        <div v-for="(item,index) in shippingInformationForm.containerList" :key="index" class="container_list">
          <el-form-item :label="$t('sea.box')" :prop="'containerList.' + index + '.typeCode'" size="mini" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
            <ContainerSelect :disabled="is3040 || !!bookingJobId" :itemObj="item" @change="containerTypesChange($event,item,index)"></ContainerSelect>
          </el-form-item>
          <el-form-item :label="$t('sea.quantity')" :prop="'containerList.' + index + '.ctnrNum'" size="mini" style="" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
            <el-input :disabled="is3040 || !!bookingJobId" v-model="item.ctnrNum" oninput="if(value){value=value.replace(/[^\d]/g,'')} if(value<=0){value=''} if(value>299){value=299}" ></el-input>
          </el-form-item>
          <el-form-item :label="$t('sea.weight')" :prop="'containerList.' + index + '.weight'" size="mini" style=""  :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },{message: $t('sea.doNotExceed30000'),validator:checkNumber,}]">
            <el-input :disabled="is3040 || !!bookingJobId" v-trim v-model="item.weight"  v-input-limit="[5,0]" placeholder="KGS/箱"></el-input>
          </el-form-item>
          <el-form-item :label="$t('sea.isSoc')" :prop="'containerList.' + index + '.ownerType'" size="mini" class="soc">
            <el-checkbox :disabled="is3040 || !!bookingJobId" v-model="isOwnerType" @change="item.ownerType = isOwnerType? 1 : 2"></el-checkbox>
          </el-form-item>
          <el-button :disabled="is3040 || !!bookingJobId" type="text" icon="el-icon-circle-plus" class="icon blue"  @click="addContainerType"  style="margin-right: 20px"></el-button>
          <el-button :disabled="is3040 || !!bookingJobId" type="text" icon="el-icon-remove" class="icon red"  @click="delContainerType(index)"></el-button>
          <!--          <i v-show="shippingInformationForm.containerList.length<5" class="icon el-icon-circle-plus blue" @click="addContainerType" style="margin-right: 20px"></i>-->
          <!--          <i v-show="shippingInformationForm.containerList.length >1" class="icon el-icon-remove red" @click="delContainerType(index)"></i>-->
        </div>
      </div>
      <!--      费率信息-->
      <div class="box_title">{{$t('sea.rateInformation')}}</div>
      <div class="box_child cargoInformation">
        <!--        约号/价卡号-->
        <el-form-item :label="$t('sea.priceCardNumber')" prop="contractNo" v-input-auto="'EN_num_symbol'" :rules="[{ required: shippingInformationForm.serialFlag?false:true, message: $t('sea.pleaseEnter'), trigger: 'change'}]">
          <el-autocomplete
            class="inline-input w178"
            size="mini"
            v-trim
            v-model="shippingInformationForm.contractNo"
            :fetch-suggestions="querySearchContractNo"
            :placeholder="$t('sea.pleaseEnter')"
            @select="handleSelect"
            :disabled="shippingInformationForm.serialFlag && bookingJobId"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item :label="$t('sea.payMethod')" prop="freightTermCode" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
          <FreightTerm :disabled="isDisabled" :code="shippingInformationForm.freightTermCode" @change="freightTermChange"></FreightTerm>
        </el-form-item>
        <div v-for="(item,index) in shippingInformationForm.userReferenceList" :key="index">
          <!--          用户参考类型-->
          <el-form-item :label="$t('sea.userReferenceType')" :prop="'userReferenceList.' + index + '.userReferenceType'" >
            <el-select :disabled="isDisabled" class="w178" v-model="item.userReferenceType" :placeholder="$t('sea.placeholder')" filterable  size="mini">
              <el-option v-for="item in userReferenceTypeOptions" :label="item" :value="item" :key="item"></el-option>
            </el-select>
          </el-form-item>
          <!--            用户参考号码-->
          <el-form-item :label="$t('sea.userReferenceNumber')" :prop="'userReferenceList.' + index + '.userReferenceNo'" >
            <el-input :disabled="isDisabled" class="w178" v-model="item.userReferenceNo"  v-input-auto="'en_num_symbol'" maxlength="200" show-word-limit size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>
          </el-form-item>
          <el-button :disabled="is3040 || !!bookingJobId" type="text" icon="el-icon-circle-plus" class="icon blue"  @click="addRateInformation"  style="margin-right: 10px"></el-button>
          <el-button :disabled="isDisabled" v-show="shippingInformationForm.userReferenceList.length >1" type="text" icon="el-icon-remove" class="icon red"  @click="delRateInformation(index)"></el-button>
        </div>
      </div>
      <!--      其他信息-->
      <div class="box_title">{{$t('sea.otherInformation')}}</div>
      <div class="box_child cargoInformation">
        <div>
          <el-form-item :label="$t('sea.remarks')" prop="remarks">
            <el-input :disabled="isDisabled" type="textarea" v-model="shippingInformationForm.remarks" v-input-auto="'en_num_symbol'" maxlength="200" size="mini" show-word-limit :placeholder="$t('sea.pleaseEnter')" style="width: 475px"></el-input>
          </el-form-item>
        </div>
        <el-form-item :label="$t('sea.confirmationLetterSentByEmail')" prop="bookingConfirmEmail" :rules="[{ required: false, message: this.$t('sea.pleaseEnter'), trigger: 'blur' }, { validator: validateEmail, trigger: 'blur' }]">
          <el-input :disabled="isDisabled" v-model="shippingInformationForm.bookingConfirmEmail" maxlength="1000" size="mini" :placeholder="$t('sea.pleaseEnter')" style="width: 475px"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div class="btn_box" :style="{width: `calc(100% - ${withoutAnimation ? 180 :54}px)`}">
      <el-button v-if="orderDetailsData.isUnlocked && ([20,30,40,50].indexOf(customerInformationForm.orderState)>-1 || [3].indexOf(shippingInformationForm.jobState)>-1)" type="primary" size="mini" @click="save">{{ $t('sea.save') }}</el-button>
      <el-button v-if="orderDetailsData.isUnlocked && (([30].indexOf(customerInformationForm.orderState)>-1 && $isEmpty(packingDataList.containerList))  || [3].indexOf(shippingInformationForm.jobState)>-1)" type="danger" size="mini" @click="cancel">{{ $t('sea.cancelBooking') }}</el-button>
      <el-button v-if="orderDetailsData.isUnlocked && isShowBookingExit" type="danger" size="mini" @click="bookingExitCustoms">{{ $t('sea.exitCustoms') }}</el-button>

      <!--      <el-button type="danger" size="mini" @click="exitCustoms">{{ $t('sea.exitCustoms') }}</el-button>-->
    </div>
    <JobShutOut v-if="JobShutOutDialog"
    :orderDetailsData="orderDetailsData"
                :JobShutOutDialog.sync="JobShutOutDialog"
                :bookingJobId="bookingJobId"
                :containerListDataProp="packingDataList"
                @exitSuccessfully="exitSuccessfully"></JobShutOut>
  </div>
</template>
<script>
import URL from '@/api/urlTranslator'
import Receipt from './receipt'
import GoodsType from './goodsType'
import ContainerSelect from './containerSelect'
import FreightTerm from './freightTerm'
import cargoAdvanceSelect from "@/components/Cargo/Common/cargoAdvanceSelect"
import JobShutOut from "./jobShutOut"
import SeaCitySelect from "./seaCitySelect"
import userReferenceTypeOptions from "./json/userReferenceTypeList"
import {
	containerListApi, repeatCheckSoApi, repeatCheckThirdSerialNoApi,
	seaBookingAddApi,
	seaBookingCancelApi,
	seaBookingContractNoApi,
	seaBookingDetailApi, seaBookingEditApi, seaBookingInitApi, seaCityListApi,
	seaScnHistoryApi, seaSoNoEditApi
} from "@/api/seaExportOrder"
import { validEmail } from "@/utils/validate"
import lodash from 'lodash'
import orderMixin from "./orderMixin";

export default {
	name: 'BookingAdd',
	components: { cargoAdvanceSelect, Receipt, GoodsType, ContainerSelect, FreightTerm, JobShutOut, SeaCitySelect },
  mixins: [orderMixin],
	props: {
		uploadRadioType: { type: String, default: null },
		orderDetailsData: {
			type: Object, default: () => {
        return {}
			}
		}
	},
	data() {
		const shipperObj = {
			contact: null,
			street: null,
			city: null,
			county: null,
			province: null,
			country: null,
			postCode: null,
			firstName: null,
			lastName: null,
			contactPhone: null,
			contactPhone2: null,
			contactPhone3: null
		}
		return {
			loading: false,
			id: this.$route.query.id,
			bookingJobId: this.$route.query.bookingJobId,
      copyBookingJobId: this.$route.query.copyBookingJobId,
			shippingInformationForm: {
				// bookingId: this.$route.query.bookingJobId,
				soNo: null,
				soNoSon: [],
				receiptCode: null,
				carrierId: null,
				carrierName: null,
				orderWebsite: null, // 订舱网点
				polCode: null,
				pol: null,
				polTransportTermCode: null, // 装货港运输条款
				polTransportTerm: null,
				podCode: null,
				pod: null,
				podTransportTermCode: null, // 卸货港运输条款
				podTransportTerm: null,
				vessel: null,
				voyage: null,
				orderShipperAddress: this.$extends({}, shipperObj), // 发货人
				orderConsigneeAddress: this.$extends({}, shipperObj), // 收货人
				orderNotifyAddress: this.$extends({}, shipperObj), // 通知人
				orderForwardersAddress: this.$extends({}, shipperObj),
				goodsTypeCode: null, // 货物类型
				goodsType: null,
				goodsDesc: null, // 货物描述
				cas: null, // cas号
				containerList: [{
					typeCode: null, // 箱型代码
					englishName: null,
					chineseName: null,
					ctnrNum: null,
					weight: null,
					ownerType: null
				}],
				contractNo: null, // 约号/价卡号
				freightTermCode: null, // 付款方式
				freightTerm: null,
				remarks: null // 备注
			},
			soNoAdd: null,
			transportTermList: [{
				code: 'CY',
				name: 'CY'
			}, {
				code: 'DOOR',
				name: 'DOOR'
			}],
			moreInfoScrollDown: false,
			contractNoList: [], // 价卡号
			customerInformationForm: {},
			isOwnerType: false,
			contactList: // 联系人列表 scnType
			{
				data: [],
				orderShipperAddress: {
					data: []
				},
				orderConsigneeAddress: {
					data: []
				},
				orderNotifyAddress: {
					data: []
				},
				orderForwardersAddress: {
					data: []
				}
			},
			isGetSeaScnHistoryApi: false,
			packingDataList: {}, // 装箱数据
			JobShutOutDialog: false, // 订舱退关弹窗
			isDisabled: false,
			isEditSoNo: false,
			bookingAgentArr: [
				'深圳',
				'上海',
				'宁波',
				'厦门',
				'广州',
				'青岛',
				'天津',
				'大连'
			]
		}
	},
	computed: {
		url() {
			return URL
		},
		userReferenceTypeOptions() {
			return userReferenceTypeOptions
		},
		withoutAnimation() {
			return this.$store.state.app.sidebar.opened // 需要监听的数据
		},
		isShowBookingExit() {
			if (this.customerInformationForm.orderState === 30 && this.$isNotEmpty(this.packingDataList.containerList)) {
				return true
			}
			return [40, 50,80].indexOf(this.customerInformationForm.orderState) > -1
		},
		// 待制单/待补料
		is3040() {
			if ([30, 40,80].indexOf(this.customerInformationForm.orderState) > -1) {
				return false
			} else {
				return this.isDisabled
			}
		},
		// 待签发可编辑字段
		is304050() {
			if ([30, 40, 50,80].indexOf(this.customerInformationForm.orderState) > -1) {
				return false
			} else {
				return this.isDisabled
			}
		}

	},
	watch: {
		orderDetailsData(newVal) {
			this.customerInformationForm = newVal
			if (!this.bookingJobId && this.customerInformationForm.bookingJobId) {
				this.bookingJobId = this.customerInformationForm.bookingJobId
				this.getSeaBookingDetail(this.bookingJobId)
				this.getSeaOrderSailingApi()
				this.getSeaScnHistoryApi(1)
				this.getContainerList(this.bookingJobId)
			}
		}
		// 'shippingInformationForm.orderShipperAddress.contactPhone'(val) {
		//   this.toComputeContactPhone('orderShipperAddress')
		// },
		// 'shippingInformationForm.orderShipperAddress.contactPhone2'(val) {
		//   this.toComputeContactPhone('orderShipperAddress')
		// },
		// 'shippingInformationForm.orderShipperAddress.contactPhone3'(val) {
		//   this.toComputeContactPhone('orderShipperAddress')
		// },
		// 'shippingInformationForm.orderConsigneeAddress.contactPhone'(val) {
		//   this.toComputeContactPhone('orderConsigneeAddress')
		// },
		// 'shippingInformationForm.orderConsigneeAddress.contactPhone2'(val) {
		//   this.toComputeContactPhone('orderConsigneeAddress')
		// },
		// 'shippingInformationForm.orderConsigneeAddress.contactPhone3'(val) {
		//   this.toComputeContactPhone('orderConsigneeAddress')
		// },
		// 'shippingInformationForm.orderNotifyAddress.contactPhone'(val) {
		//   this.toComputeContactPhone('orderNotifyAddress')
		// },
		// 'shippingInformationForm.orderNotifyAddress.contactPhone2'(val) {
		//   this.toComputeContactPhone('orderNotifyAddress')
		// },
		// 'shippingInformationForm.orderNotifyAddress.contactPhone3'(val) {
		//   this.toComputeContactPhone('orderNotifyAddress')
		// }
	},
	beforeRouteLeave(to, from, next) {
		const answer = window.confirm("当前页面数据未保存，确定要离开？")
		if (answer) {
			next()
		} else {
			next(false)
		}
	},
	async created() {
		this.customerInformationForm = this.orderDetailsData
		if (this.customerInformationForm.bookingJobId) {
			this.bookingJobId = this.customerInformationForm.bookingJobId
		}
		this.getSeaScnHistoryApi(1)
		await this.getSeaOrderSailingApi()

    if (this.bookingJobId ) { // 全量复制
      await this.getSeaBookingDetail(this.bookingJobId)
      this.getContainerList(this.bookingJobId) // 获取装箱信息
      const res = await seaSoNoEditApi(this.bookingJobId)
      if (res.ok) {
        this.isEditSoNo = !res.content
      }
    } else if (this.customerInformationForm.orderState === 20) { // 待订舱 订舱初始化
      this.getSeaBookingInitApi(this.id)
    }

		if (Number(this.customerInformationForm.orderState) >= 30) {
			this.isDisabled = true
		}
	},
	methods: {
		// validateContractNo(rule, value, callback) {
		//   if (value.length !== 8 && value) {
		//     callback(new Error(this.$t('sea.characters8')))
		//   } else {
		//     callback()
		//   }
		// },
		validateEmail(rule, value, callback) {
			if (!validEmail(value) && value) {
				callback(new Error(this.$t('blInfo.emailError')))
			} else {
				callback()
			}
		},
		// 发货人信息处增加一个按钮“Eshipping”，点击后在发货人信息栏位中固定填入
		Eshipping() {
			this.$set(this.shippingInformationForm.orderShipperAddress, 'contact', 'Eshipping Global Supply Chain Management (Shenzhen)Company Limited')
			this.$set(this.shippingInformationForm.orderShipperAddress, 'street', '16F, Area A, Anlian Plaza No.4018,Shenzhen Guangdong 518000')
			this.$set(this.shippingInformationForm.orderShipperAddress, 'city', 'Shenzhen')
			this.$set(this.shippingInformationForm.orderShipperAddress, 'county', 'Shenzhen')
			this.$set(this.shippingInformationForm.orderShipperAddress, 'province', 'Guangdong')
			this.$set(this.shippingInformationForm.orderShipperAddress, 'country', 'China')
			this.$set(this.shippingInformationForm.orderShipperAddress, 'postCode', '518000')
		},
		sameConsigneeInformation() {
			let form = this.shippingInformationForm
			this.$set(form.orderNotifyAddress, 'contact', form.orderConsigneeAddress.contact)
			this.$set(form.orderNotifyAddress, 'street', form.orderConsigneeAddress.street)
			this.$set(form.orderNotifyAddress, 'city', form.orderConsigneeAddress.city)
			this.$set(form.orderNotifyAddress, 'county', form.orderConsigneeAddress.county)
			this.$set(form.orderNotifyAddress, 'province', form.orderConsigneeAddress.province)
			this.$set(form.orderNotifyAddress, 'country', form.orderConsigneeAddress.country)
			this.$set(form.orderNotifyAddress, 'postCode', form.orderConsigneeAddress.postCode)
			this.$set(form.orderNotifyAddress, 'lastName', form.orderConsigneeAddress.lastName)
			this.$set(form.orderNotifyAddress, 'firstName', form.orderConsigneeAddress.firstName)
			this.$set(form.orderNotifyAddress, 'contactPhone', form.orderConsigneeAddress.contactPhone)
			this.$set(form.orderNotifyAddress, 'contactPhone2', form.orderConsigneeAddress.contactPhone2)
			this.$set(form.orderNotifyAddress, 'contactPhone3', form.orderConsigneeAddress.contactPhone3)
		},
		// 订舱初始化
		async getSeaBookingInitApi(id) {
			this.loading = true
      let resCopyJob,res
      res = await seaBookingInitApi(id)
      if(this.copyBookingJobId){
         resCopyJob = await seaBookingDetailApi(this.copyBookingJobId)
        // res = lodash.assign(resCopyJob,res)
        res = lodash.mergeWith(
          resCopyJob, res,
          (a, b) => !b  ? a : undefined
        )
      }
			if (res.ok) {
				res.content.bookingChannel = this.orderDetailsData.bookingChannel || this.$route.query.bookingChannel
				res.content.bookingJobMethod = this.orderDetailsData.bookingJobMethod || this.$route.query.bookingJobMethod
				this.bookingInit(res)
				this.$nextTick(() => {
					this.$refs.shippingInformationForm.clearValidate()
				})
			}
			this.loading = false
		},
		bookingInit(res) {
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
				res.content.orderForwardersAddress.contact = 'Eshipping Global Supply Chain Management (Shenzhen)Company Limited'
				res.content.orderForwardersAddress.street = '16F, Area A, Anlian Plaza No.4018, Jintian Road, Futian District'
				res.content.orderForwardersAddress.city = 'Shenzhen'
				res.content.orderForwardersAddress.county = 'Shenzhen'
				res.content.orderForwardersAddress.province = 'GuangDong'
				res.content.orderForwardersAddress.country = 'China'
				res.content.orderForwardersAddress.postCode = '518000'
			}
			if (this.$isEmpty(res.content.soNoSon)) {
				res.content.soNoSon = []
			}
			if (!res.content.polTransportTermCode) {
				res.content.polTransportTermCode = 'CY'
				res.content.polTransportTerm = 'CY'
			}
			if (!res.content.podTransportTermCode) {
				res.content.podTransportTermCode = 'CY'
				res.content.podTransportTerm = 'CY'
			}
			if (!res.content.userReferenceList || this.$isEmpty(res.content.userReferenceList)) {
				res.content.userReferenceList = [{
					userReferenceNo: null,
					userReferenceType: null
				}]
			}
			if(this.copyBookingJobId && !this.bookingJobId){
        res.content.soNo = null
        delete res.content.id
        res.content.containerList.map(item=>{
          delete item.id
        })
      }
			this.shippingInformationForm = res.content
			if (this.$isNotEmpty(res.content.containerList)) {
				this.isOwnerType = res.content.containerList[0].ownerType === 1
			} else {
				res.content.containerList.push({
					typeCode: null, // 箱型代码
					englishName: null,
					chineseName: null,
					ctnrNum: null,
					weight: null,
					ownerType: 2
				})
			}

		},
		// 获取装箱信息
		async getContainerList(id) {
			this.loading = true
			const res = await containerListApi(id)
			this.loading = false
			if (res.ok) {
				this.packingDataList = res.content
			}
		},
		// 流水号
		serialFlagChange() {
			this.$set(this.shippingInformationForm, 'vessel', null)
			this.$set(this.shippingInformationForm, 'voyage', null)
			this.$set(this.shippingInformationForm, 'thirdSerialNo', null)
			this.$set(this.shippingInformationForm, 'soNo', null)
		},
		// 退关成功
		exitSuccessfully() {
			this.getSeaBookingDetail(this.bookingJobId)
			this.getContainerList(this.bookingJobId)
		},
		async getSeaScnHistoryApi(type) {
			this.loading = true
			const res = await seaScnHistoryApi(this.id, type)
			this.loading = false
			if (res.ok) {
				if (type === 1) {
					this.$set(this.contactList.orderShipperAddress, 'data', res.content)
					// this.$nextTick(() => {
					//   this.initPhone4SFT('orderShipperAddress')
					// })
				} else if (type === 2) {
					this.$set(this.contactList.orderConsigneeAddress, 'data', res.content)
					// this.$nextTick(() => {
					//   this.initPhone4SFT('orderConsigneeAddress')
					// })
				} else if (type === 3) {
					this.$set(this.contactList.orderNotifyAddress, 'data', res.content)
					// this.$nextTick(() => {
					//   this.initPhone4SFT('orderNotifyAddress')
					// })
				} else if (type === 4) {
					this.$set(this.contactList.orderForwardersAddress, 'data', res.content)
					// this.$nextTick(() => {
					//   this.initPhone4SFT('orderForwardersAddress')
					// })
				}
			}
		},
		async getSeaOrderSailingApi() {
			const res = await seaBookingContractNoApi(this.id)
			if (res) {
				res.content.map(item => {
					this.contractNoList.push({
						value: item
					})
				})
			}
		},
		// 获取订舱详情
		async getSeaBookingDetail(id) {
			this.loading = true
			const res = await seaBookingDetailApi(id)
			this.loading = false
			res.content.bookingChannel = this.orderDetailsData.bookingChannel || this.$route.query.bookingChannel
			if (res) {
				this.bookingInit(res)
			}
		},
		clientEdit() {
			this.$router.push({ name: 'SeaExportOrderCreate', query: { id: this.id } })
		},
		// 添加分单号
		soNoAddFun() {
			if (this.soNoAdd) {
				this.shippingInformationForm.soNoSon.push(this.soNoAdd)
				this.soNoAdd = null
			}
		},
		soNoSonDel(i) {
			this.shippingInformationForm.soNoSon.splice(i, 1)
		},
		cahngeScrollStatus() {
			this.moreInfoScrollDown = !this.moreInfoScrollDown
			if (this.moreInfoScrollDown && !this.isGetSeaScnHistoryApi) {
				[2, 3, 4].map(item => {
					this.getSeaScnHistoryApi(item)
				})
				this.isGetSeaScnHistoryApi = true
			}
		},
		polTransportTermChange(code) {
			this.transportTermList.map(item => {
				if (item.code === code) {
					this.shippingInformationForm.polTransportTerm = item.name
				}
			})
		},
		podTransportTermChange(code) {
			this.transportTermList.map(item => {
				if (item.code === code) {
					this.shippingInformationForm.podTransportTerm = item.name
				}
			})
		},
		// 货物类型
		goodsTypeCodeChange(val) {
			this.shippingInformationForm.goodsType = val
		},
		containerTypesChange(val, item, index) {
			item.chineseName = val.chineseName
			item.englishName = val.englishName
			item.typeCode = val.typeCode
			this.$set(this.shippingInformationForm.containerList, index, item)
		},
		// 联系人电话
		// toComputeContactPhone(type) {
		//   this.shippingInformationForm[type].contactPhone = `${this.shippingInformationForm[type].contactPhone}-${this.shippingInformationForm[type].contactPhone2}-${this.shippingInformationForm[type].contactPhone3}`
		// },
		// initPhone4SFT(type) {
		//   console.log(type, this.contactList.orderShipperAddress, this.shippingInformationForm[type].contactPhone)
		//   if (this.shippingInformationForm[type].contactPhone) {
		//     const phones = this.shippingInformationForm[type].contactPhone.split('-')
		//     this.$set(this.shippingInformationForm[type], 'contactPhone', phones[0] || '')
		//     this.$set(this.shippingInformationForm[type], 'contactPhone2', phones[1] || '')
		//     this.$set(this.shippingInformationForm[type], 'contactPhone3', phones[2] || '')
		//   }
		// },
		// 箱型箱量 add
		addContainerType() {
			this.shippingInformationForm.containerList.push({
				typeCode: null,
				englishName: null,
				chineseName: null,
				ctnrNum: null,
				weight: null,
				isOwnerType: false,
				ownerType: 2
			})
		},
		// del
		delContainerType(index) {
			this.shippingInformationForm.containerList.splice(index, 1)
		},
		// 费率信息ADD
		addRateInformation() {
			this.shippingInformationForm.userReferenceList.push({
				userReferenceNo: null,
				userReferenceType: null
			})
		},
		delRateInformation(index) {
			this.shippingInformationForm.userReferenceList.splice(index, 1)
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
		freightTermChange(val) {
			this.shippingInformationForm.freightTerm = val.freightTerm
			this.shippingInformationForm.freightTermCode = val.freightTermCode
		},
		async save() {
			this.$refs.shippingInformationForm.validate(async valid => {
				if (valid) {
					const typeCodeArr = this.shippingInformationForm.containerList.map(item => item.englishName)
					if (new Set(typeCodeArr).size !== typeCodeArr.length) {
						this.$message.warning(this.$t('sea.sameBoxTypeIsSelected'))
						return false
					}
          if(this.copyBookingJobId){
            delete this.shippingInformationForm.atd
          }
					this.loading = true
					let res
					if (!this.bookingJobId) { // 新建
						this.shippingInformationForm.orderId = this.id
						res = await seaBookingAddApi(this.shippingInformationForm)
					} else {
						res = await seaBookingEditApi(this.shippingInformationForm)
					}
					this.loading = false
					if (res.ok) {
						this.$message.success(this.$t('sea.submittedSuccessfully'))

						this.$emit('change', '1', true)
					}
				} else {
					this.mixinsFormScrollIntoView()
					return false
				}
			})
		},
		async cancel() {

			this.$confirm(this.$t('sea.bookingCancel'), this.$t('sea.tips'), {
				confirmButtonText: this.$t('sea.determine'),
				cancelButtonText: this.$t('sea.cancel'),
				type: 'warning'
			}).then(async () => {
				this.loading = true
				const res = await seaBookingCancelApi(this.bookingJobId)
				this.loading = false
				if (res.ok) {
					this.$message.success(this.$t('sea.submittedSuccessfully'))
					this.$emit('change', '1', true)
				}
			})
		},
		// 退关
		bookingExitCustoms() {
			this.JobShutOutDialog = true
		},
		checkSerialNumber(rule, val, callback, source) {
			if (val) {
				if (val.slice(0, 2) !== 'CC' && val.slice(0, 2) !== 'cc') {
					callback(new Error())
				} else {
					callback()
				}
			} else {
				callback()
			}
		},
		// 流水号去重
		async checkRepeatSerial(rule, val, callback) {
			const params = {
				id: this.bookingJobId,
				thirdSerialNo: val
			}
			const res = await repeatCheckThirdSerialNoApi(params)
			if (res.ok) {
				if (Number(res.code) === 0) {
					callback()
				} else {
					callback(new Error(res.errors[0].message))
				}
			} else {
				callback(new Error(res.errors[0].message))
			}
		},
		// so号去重
		async checkRepeatSoNo(rule, val, callback) {
			this.loading = true
			const params = {
				id: this.bookingJobId,
				soNo: val
			}
			const res = await repeatCheckSoApi(params)
			this.loading = false
			if (res.ok) {
				if (Number(res.code) === 0) {
					callback()
				} else {
					callback(new Error(res.errors[0].message))
				}
			} else {
				callback(new Error(res.errors[0].message))
			}
		},
		checkNumber(rule, val, callback, source) {
			if (!Number(val) > 0) {
				// this.message = this.$message.error(this.$t('booking.pleaseEnterGreaterThan0'))
				callback(new Error())
			} else if (Number(val) > 30000) {
				// this.message = this.$message.error('预估单箱货重请勿超过30000KGS')
				callback(new Error())
			} else {
				callback()
			}
		},
		querySearch(queryString, cb, index) {
			const restaurants = this.contactList[index].data
			let results = queryString ? restaurants.filter(this.createFilter2(queryString)) : restaurants
			// 调用 callback 返回建议列表的数据
			cb(results)
		},
		createFilter2(queryString) {
			return restaurant => restaurant.contact.toLowerCase().indexOf(queryString.toLowerCase()) > -1
		},

		// querySearch(key, cb) {
		//   const arr = this.contactList.shipper.data
		//   cb(arr)
		// },
		// querySearch1(key, cb) {
		//   const arr = this.contactList.consignee.data
		//   cb(arr)
		// },
		// querySearch2(key, cb) {
		//   const arr = this.contactList.notify.data
		//   cb(arr)
		// },
		querySearchChange(val, key) {
			this.shippingInformationForm[key].contact = val.contact
			this.onChangeCompanyName(val.contact, key)
		},
		onChangeCompanyName(val, source) {
			const findOne = this.contactList[source].data.find(item => item.contact === val)
			if (findOne) { // 后台数据中查到的  && findOne.id
				// const phones = findOne.contactPhone.split('-')
				this.shippingInformationForm[source] = findOne // { ...findOne, contactPhone: phones[0] || '', contactPhone2: phones[1] || '', contactPhone3: phones[2] || '' }
			} else {
				this.shippingInformationForm[source].id = 0
			}
		},
		TBAChange(val) {
			if (val) {
				this.$set(this.shippingInformationForm, 'vessel', 'TBA')
				this.$set(this.shippingInformationForm, 'voyage', '---')
			} else {
				this.$set(this.shippingInformationForm, 'vessel', '')
				this.$set(this.shippingInformationForm, 'voyage', '')
			}
		}
		// 退关
		// async exitCustoms() {
		//   this.loading = true
		//   const res = await seaBookingCancelApi(this.shippingInformationForm.bookingId)
		//   this.loading = false
		//   if (res.ok) {
		//     this.$message('退关成功！')
		//     this.$emit('change', '1')
		//   }
		// }
	}
}
</script>
<style lang="scss" scoped>
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
	transition: height 0.5s ease;
	.box25 {
		width: 20%;
	}
}
.icon {
	font-size: 28px;
	transition: all 0.2s ease 0s;
	cursor: pointer;
	user-select: none;
	position: relative;
	top: -10px;
	&:hover {
		transform: scale(1.1);
	}
}
.el-icon-circle-close {
	font-size: 14px;
	transition: all 0.2s ease 0s;
	cursor: pointer;
	user-select: none;
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
::v-deep .el-form-item__label {
	width: 101px;
	text-align: right;
}
.shippingInformation {
	::v-deep {
		.el-form-item {
			width: 24%;
		}
		.el-form-item__content {
			width: 50%;
		}
	}
}
.shipperInformation ::v-deep .el-form-item {
	width: 100%;
}
.w178 {
	width: 178px;
}
//**
.soNoAdd {
	position: absolute;
	right: -40px;
}
.box-card {
	width: 178px;
	max-height: 100px;
	min-height: 80px;
	overflow: auto;
	::v-deep .el-card__body {
		padding: 8px 12px;
	}
}
.more-info-link {
	margin-top: 10px;
	font-size: 14px;
	color: rgb(67, 91, 137);
	cursor: pointer;
}
.more-info-content {
	display: block;
	margin-top: 20px;
	height: 0;
	overflow: hidden;
	transition: height 0.5s ease;
	&.scorll-down-content {
		height: auto;
	}
}
.connector {
	color: #999;
	margin-right: 10px;
	position: relative;
	top: -5px;
}
.soc {
	margin-right: 30px;
}
.btn_box {
	text-align: right;
}
::v-deep .el-textarea .el-input__count {
	bottom: 1px;
}
.marks {
	::v-deep .el-textarea__inner {
		height: 30px;
	}
}
</style>
