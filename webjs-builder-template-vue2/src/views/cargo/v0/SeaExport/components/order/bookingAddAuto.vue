<template>
  <div class="box page-edit-container" v-loading="loading" style="margin-bottom: 60px">
    <div class="page-edit-content">
      <el-form :inline="true" :model="shippingInformationForm" @submit.native.prevent ref="shippingInformationForm">
        <!--      船期信息-->
        <div class="box_title">{{$t('sea.shippingInformation')}}</div>
        <div class="box_child shippingInformation" style="position: relative; min-width: 1335px; overflow: auto">
          <el-form-item label="SO" prop="soNo">
            <el-input class="w178" :disabled="isEditSoNo" v-trim v-model="shippingInformationForm.soNo" v-input-auto="'EN_num'" maxlength="30" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>
          </el-form-item>
          <!--        收货地-->
          <el-form-item :label="$t('sea.placeOfReceipt')" prop="receiptCode" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
            <SeaCitySelect :disabled="is304050" class="w178" v-model="shippingInformationForm.receiptCode"></SeaCitySelect>
          </el-form-item>
          <!--            船司-->
          <el-form-item :label="$t('sea.shipBoss')" prop="carrierId" :rules="[ { required: true, message: $t('sea.shipBossHold'), trigger: 'blur' } ]">
            <cargo-advance-select
              :url="url.omc.shippingCompanylist"
              :default-value="shippingInformationForm.carrierName"
              tag-value="id"
              tag-name="englishShortname"
              :headers="['中文简称','英文简称',]"
              :fields="['chineseShortname','englishShortname']"
              :options-width="'400px'"
              remote
              style="width: 178px"
              :disabled="isDisabled"
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
            <span v-if="shippingInformationForm.EBI">{{shippingInformationForm.orderWebsite}}</span>
            <SeaCitySelect v-else :disabled="isDisabled" v-model="shippingInformationForm.orderWebsite" class="w178"></SeaCitySelect>
            <el-checkbox  v-model="shippingInformationForm.EBI" @change="ebiChange" style="margin-left: 5px">EBI</el-checkbox>
          </el-form-item>
          <!--        分单号-->
          <el-form-item label=" " prop="soNoAdd"></el-form-item>
          <!--          装货港-->
          <el-form-item :label="$t('sea.pol2')" prop="polCode" :rules="[{ required: true, message: $t('sea.placeholder'), trigger: 'change',trigger: 'blur' },]">
            <cargo-advance-select
              :disabled="is304050"
              ref="polCodeSelect"
              :url="url.qf.seaport"
              :default-value="shippingInformationForm.polCode"
              :headers="['英文名称','五字码','中文名称']"
              :fields="['englishName','code5','chineseName']"
              tag-value="code5"
              tag-name="enPortName"
              :placeholder="$t('sea.pleaseEnter')"
              remote
              @parentCallBack="(data)=>{
                  shippingInformationForm.polCode=data.code5
                  shippingInformationForm.pol=data.englishName
                  restShipChoose()
                }"
            />
          </el-form-item>
          <el-form-item :label="$t('sea.polTransportTerm')" prop="polTransportTermCode" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
            <el-select :disabled="isDisabled" v-model="shippingInformationForm.polTransportTermCode" :placeholder="$t('sea.placeholder')" filterable @change="polTransportTermChange" size="mini">
              <el-option v-for="(item, index) in transportTermList" :label="item.name" :value="item.code" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <!--        订舱代理-->
          <el-form-item :label="$t('sea.bookingAgentPort')" prop="bookingAgentPort" size="mini" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
            <el-select :disabled="isDisabled" v-model="shippingInformationForm.bookingAgentPort" :placeholder="$t('sea.placeholder')" filterable @change="polTransportTermChange" size="mini">
              <el-option v-for="item in bookingAgentArr" :label="item" :value="item" :key="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label=""></el-form-item>
          <!--          卸货港-->
          <el-form-item :label="$t('sea.pod')" prop="podCode" :rules="[{ required: true, message: $t('sea.placeholder'), trigger: 'change',trigger: 'blur' },]">
            <cargo-advance-select
              :disabled="is304050"
              ref="podCodeSelect"
              :url="url.qf.seaport"
              :headers="['英文名称','五字码','中文名称']"
              :default-value="shippingInformationForm.podCode"
              :fields="['englishName','code5','chineseName']"
              tag-value="code5"
              tag-name="enPortName"
              :placeholder="$t('sea.pleaseEnter')"
              remote
              @parentCallBack="(data)=>{
                  shippingInformationForm.podCode=data.code5
                  shippingInformationForm.pod=data.englishName
                  restShipChoose()
                }"
            />
          </el-form-item>
          <el-form-item :label="$t('sea.polTransportTerm')" prop="podTransportTermCode" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
            <el-select :disabled="isDisabled" v-model="shippingInformationForm.podTransportTermCode" :placeholder="$t('sea.placeholder')" filterable @change="podTransportTermChange" size="mini">
              <el-option v-for="(item, index) in transportTermList" :label="item.name" :value="item.code" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="voyage" size="mini"></el-form-item>


          <el-form-item label=""></el-form-item>
          <!--        交货地-->
          <el-form-item :label="$t('sea.placeOfDelivery')" prop="destinationCode" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
            <SeaCitySelect :disabled="is304050" v-model="shippingInformationForm.destinationCode" :type="2" class="w178"></SeaCitySelect>
          </el-form-item>
          <div style=" width: 100%;display: flex; position: relative">
            <!--        船期选择 -->
            <el-form-item :label="$t('sea.shipChooseType')" prop="shipChooseType" size="mini" style="" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
              <el-radio-group :disabled="isDisabled" v-model="shippingInformationForm.shipChooseType" @change="shipChooseTypeChange" size="mini">
                <el-radio :label="1" style="display: block;margin-bottom: 5px;">{{$t('sea.shipScheduleInquiry')}}</el-radio>
                <el-radio :label="2" style="display: block;margin-bottom: 5px;">{{$t('sea.estimatedVoyage')}}</el-radio>
                <el-radio :label="3" style="display: block">{{$t('sea.departureTimeDeparturePort')}}</el-radio>
              </el-radio-group>
            </el-form-item>

            <div v-if="shippingInformationForm.shipChooseType === 1" style="width: 24%; position: relative ">
              <!--            起运时间-->
              <el-form-item :label="$t('sea.departureTime')" prop="etdTimeSearch" :rules="[ { required: true, message:$t('sea.placeholder'), trigger: 'change'} ]" style="width: 100%">
                <CommonPicker
                  :disabled="isDisabled"
                  v-model="shippingInformationForm.etdTimeSearch"
                  parent-class="w178"
                  size="mini"
                  picker-format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  pikcer-type="date"
                  parentOption="followingDate"
                  :clearable="false"
                  :placeholder="$t('sea.placeholder')"
                  @change="restShipChoose"
                />
              </el-form-item>
              <el-form-item label="" prop="timeQuantum" size="mini" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]" style="position: absolute; top: 0; left:282px; width: 110px">
                <el-select :disabled="isDisabled" v-model="shippingInformationForm.timeQuantum"  filterable size="mini" @change="restShipChoose">
                  <el-option v-for="opt in andBeyondArr" :key="opt" :label="$t('sea.andBeyond')+opt+$t('sea.withinWeek')" :value="$t('sea.andBeyond')+opt+$t('sea.withinWeek')" />
                </el-select>
              </el-form-item>
              <!--              注释以后备用-->
              <!--              <div style="display: flex">-->
              <!--                <el-button :disabled="isDisabled||!shippingInformationForm.polCode||!shippingInformationForm.podCode||!shippingInformationForm.etdTimeSearch||!shippingInformationForm.timeQuantum"-->
              <!--                           type="primary" size="mini" @click="shipScheduleInquiry" style=" margin: 0 auto; display: block; width: 160px">{{$t('sea.shipScheduleInquiry')}}-->
              <!--                </el-button>-->
              <!--                <el-button :disabled="isDisabled||!shippingInformationForm.polCode||!shippingInformationForm.podCode||!shippingInformationForm.etdTimeSearch||!shippingInformationForm.timeQuantum"-->
              <!--                           type="primary" size="mini" @click="showShipScheduleInquiry = true" style=" margin: 0 auto; display: block; width: 160px">{{$t('sea.enterTheShipNameAndVoyageDirectly')}}-->
              <!--                </el-button>-->
              <!--              </div>-->
              <!--              注释以后备用end-->
              <template v-if="shippingInformationForm.shipChooseType === 1 && showShipScheduleInquiry">
                <el-form-item :label="$t('sea.direct')+'/'+$t('sea.transship')" prop="transitFlag" :rules="[ { required: true, message:$t('sea.placeholder'), trigger: 'change'} ]" style="width: 100%">
                  <el-radio-group :disabled="isDisabled" v-model="shippingInformationForm.transitFlag" size="mini" @change="transitFlagChange">
                    <el-radio :label="false" style="margin-right: 10px;">{{$t('sea.direct')}}</el-radio>
                    <el-radio :label="true">{{$t('sea.transship')}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <!--            航线代码-->
                <!--            <el-form-item v-if="shippingInformationForm.transitFlag === false" :label="$t('sea.routeCode')" prop="routeCode" :rules="[ { required: true, message:$t('sea.placeholder'), trigger: 'blur'} ]" style="width: 100%">-->
                <!--              <el-input class="inputWidth" v-trim v-model="shippingInformationForm.routeCode" v-input-auto="'EN_num'" maxlength="1000" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>-->
                <!--            </el-form-item>-->
                <!--        船名-->
                <el-form-item v-if="shippingInformationForm.transitFlag === false" style="width: 100%; position: relative" :label="$t('sea.shipName')" prop="vessel" size="mini" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
                  <el-input :disabled="is304050" class="inputWidth" v-trim v-model="shippingInformationForm.vessel" v-input-auto="'EN_num_symbol'" maxlength="1000" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>
                </el-form-item>

                <!--        航次-->
                <el-form-item v-if="shippingInformationForm.transitFlag === false" style="width: 100%" :label="$t('sea.voyage')" prop="voyage" size="mini" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
                  <el-input :disabled="is304050" class="inputWidth"  v-trim v-model="shippingInformationForm.voyage" v-input-auto="'EN_num_symbol'" maxlength="1000" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>
                </el-form-item>
                <!--            头程船名-->
                <el-form-item v-if="shippingInformationForm.transitFlag" style="width: 100%; position: relative" :label="$t('sea.headWayshipName')" prop="vessel" size="mini" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
                  <el-input class="inputWidth" v-trim v-model="shippingInformationForm.vessel" :disabled="is304050||shippingInformationForm.TBA1" v-input-auto="'EN_num_symbol'" maxlength="1000" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>
                  <el-checkbox :disabled="is304050" v-model="shippingInformationForm.TBA1" @change="(val)=>TBAChange(val,1)" style="position: absolute; right: -65px;top: 0">TBA</el-checkbox>
                </el-form-item>
                <el-form-item v-if="shippingInformationForm.transitFlag" style="width: 100%" :label="$t('sea.firstVoyage')" prop="voyage" size="mini" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
                  <el-input class="inputWidth"  v-trim v-model="shippingInformationForm.voyage" :disabled="is304050||shippingInformationForm.TBA1"  v-input-auto="'EN_num_symbol'" maxlength="1000" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>
                </el-form-item>
              </template>
              <!--              <el-form-item v-if="shippingInformationForm.transitFlag" :label="$t('sea.firstLane')" prop="firstLane" :rules="[ { required: true, message:$t('sea.placeholder'), trigger: 'blur'} ]" style="width: 100%">-->
              <!--                <el-input class="inputWidth" v-trim v-model="shippingInformationForm.firstLane" v-input-auto="'EN_num_symbol'" maxlength="1000" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>-->
              <!--              </el-form-item>-->
              <!--              <el-form-item v-if="shippingInformationForm.transitFlag" :label="$t('sea.secondLane')" prop="secondLane" :rules="[ { required: true, message:$t('sea.placeholder'), trigger: 'blur'} ]" style="width: 100%">-->
              <!--                <el-select v-model="shippingInformationForm.secondLane"  filterable size="mini">-->
              <!--                  <el-option label="CY" value="CY" />-->
              <!--                  <el-option label="DOOR" value="DOOR" />-->
              <!--                </el-select>-->
              <!--              </el-form-item>-->
            </div>
            <div v-if="shippingInformationForm.shipChooseType === 1 && showShipScheduleInquiry" style="width: 24%; padding-top: 99px ">
              <!--            二程船名-->
              <el-form-item v-if="shippingInformationForm.transitFlag" style="width: 100%; position: relative" :label="$t('sea.secondShipName')" prop="secVessel" size="mini" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
                <el-input :disabled="is304050 || shippingInformationForm.TBA2"  class="inputWidth" v-trim v-model="shippingInformationForm.secVessel" v-input-auto="'EN_num_symbol'" maxlength="1000" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>
                <el-checkbox v-model="shippingInformationForm.TBA2" @change="(val)=>TBAChange(val,2)" style="position: absolute; right: -65px;top: 0">TBA</el-checkbox>
              </el-form-item>
              <el-form-item v-if="shippingInformationForm.transitFlag" style="width: 100%" :label="$t('sea.secondVoyage')" prop="secVoyage" size="mini" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
                <el-input :disabled="is304050 || shippingInformationForm.TBA2" class="inputWidth"  v-trim v-model="shippingInformationForm.secVoyage"  v-input-auto="'EN_num_symbol'" maxlength="1000" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>
              </el-form-item>
            </div>
            <div v-if="shippingInformationForm.shipChooseType === 2" style="width: 24%; ">
              <!--        船名-->
              <el-form-item style="width: 100%" :label="$t('sea.shipName')" prop="vessel" size="mini" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
                <el-input :disabled="is304050" class="inputWidth" v-trim v-model="shippingInformationForm.vessel" v-input-auto="'EN_num_symbol'" maxlength="1000" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>
              </el-form-item>
              <!--        航次-->
              <el-form-item style="width: 100%" :label="$t('sea.voyage')" prop="voyage" size="mini" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
                <el-input :disabled="is304050" class="inputWidth"  v-trim v-model="shippingInformationForm.voyage" v-input-auto="'EN_num_symbol'" maxlength="1000" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>
              </el-form-item>
            </div>
            <div v-if="shippingInformationForm.shipChooseType === 3" style="width: 24%; ">
              <el-form-item label="ETD" prop="etdTimeSearch" :rules="[ { required: true, message:$t('sea.placeholder'), trigger: 'change'} ]" style="width: 100%">
                <CommonPicker
                  :disabled="isDisabled"
                  v-model="shippingInformationForm.etdTimeSearch"
                  parent-class="w178"
                  size="mini"
                  picker-format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  pikcer-type="date"
                  parentOption="followingDate"
                  :clearable="false"
                  :placeholder="$t('sea.placeholder')"
                />
              </el-form-item>
            </div>
          </div>
          <div v-if="shippingInformationForm.shipChooseType === 1 && $isNotEmpty(shipChooseData)" style="display: flex;justify-content: space-around; width: 85%; min-width: 1000px; margin-top: 20px">
            <div>
              <div>
                <img src="@/assets/spear.png"> <span class="placeName">{{ shippingInformationForm.pol }}</span>
              </div>

              <p>ETD {{ shippingInformationForm.etdFormat }} {{ $moment(shippingInformationForm.etdFormat).format('dddd') }}</p>
              <p>{{ $t('sea.weightCuttingCabinet') }} {{$moment(shippingInformationForm.etdFormat,"YYYYMMDD").subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss')}} {{$moment(shippingInformationForm.etdFormat,"YYYYMMDD").subtract(2, 'days').format('dddd')}}</p>
            </div>
            <div>
              <img src="@/assets/arrow.png">
              <p>{{ shippingInformationForm.vessel }}</p>
              <p>{{ shippingInformationForm.voyage }}</p>
              <p>{{ shippingInformationForm.routeCode }}</p>
            </div>
            <!--            2中转港-->
            <template  v-if="shippingInformationForm.transit ">
              <div>
                <div>
                  <img src="@/assets/spear.png"> <span class="placeName">{{ shippingInformationForm.transit }}</span>
                </div>
                <!--                <p>ETA  2022-04-17  周日</p>-->
                <!--                <p>ETD  2022-04-15  周五</p>-->
              </div>
              <div style="text-align: center">
                <img src="@/assets/arrow.png">
                <p>{{ shippingInformationForm.secVessel }}</p>
                <p>{{ shippingInformationForm.secVoyage }}</p>
                <p>{{ shippingInformationForm.secRouteCode }}</p>
              </div>
            </template>
            <!--            第3次中转港-->
            <template  v-if="shippingInformationForm.thirdPortCode">
              <div>
                <div>
                  <img src="@/assets/spear.png"> <span class="placeName">{{shippingInformationForm.thirdPortName || shippingInformationForm.thirdPortCode }}</span>
                </div>
                <!--                <p>ETA  2022-04-17  周日</p>-->
                <!--                <p>ETD  2022-04-15  周五</p>-->
              </div>
              <div style="text-align: center">
                <img src="@/assets/arrow.png">
                <p>{{ shippingInformationForm.thirdVessel }}</p>
                <p>{{ shippingInformationForm.thirdVoyage }}</p>
                <p>{{ shippingInformationForm.thirdRouteCode }}</p>
              </div>
            </template>
            <!--            第4次中转港-->
            <template  v-if="shippingInformationForm.fourPortCode">
              <div>
                <div>
                  <img src="@/assets/spear.png"> <span class="placeName">{{shippingInformationForm.fourPortName || shippingInformationForm.fourPortCode }}</span>
                </div>
                <!--                <p>ETA  2022-04-17  周日</p>-->
                <!--                <p>ETD  2022-04-15  周五</p>-->
              </div>
              <div style="text-align: center">
                <img src="@/assets/arrow.png">
                <p>{{ shippingInformationForm.fourVessel }}</p>
                <p>{{ shippingInformationForm.fourVoyage }}</p>
                <p>{{ shippingInformationForm.fourRouteCode }}</p>
              </div>
            </template>
            <div>
              <div>
                <img src="@/assets/spear.png"> <span class="placeName">{{ shippingInformationForm.pod }}</span>
              </div>
              <p>ETA {{ shippingInformationForm.etaFormat }} {{ $moment(shippingInformationForm.etaFormat).format('dddd') }}</p>
            </div>
          </div>
        </div>

        <!--      货运方信息-->
        <div class="box_title">{{$t('sea.shipperInformation')}}</div>
        <div class="box_child shipperInformation" style="position: relative;">
          <el-form-item :label="$t('sea.contact')" prop="orderShipperAddress.contact" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
            <el-autocomplete
              :disabled="isDisabled"
              v-input-auto="'en_num_symbol'"
              v-model="shippingInformationForm.orderShipperAddress.contact"
              :fetch-suggestions="((queryString,cb)=>{querySearch(queryString,cb,'orderShipperAddress')})"
              :placeholder="$t('sea.contactHold')" size="mini"
              @change="onChangeCompanyName($event,'orderShipperAddress')"
              @select="querySearchChange($event,'orderShipperAddress')"
              :maxlength="70"
              style=" width: 500px" >
              <template slot-scope="{ item }">
                <span class="addr">{{ item.contact }}</span>
              </template>
            </el-autocomplete>
            <el-button @click="Eshipping" type="primary" size="mini" style="margin-left: 100px">Eshipping</el-button>
          </el-form-item>
          <el-form-item :label="$t('sea.street')" prop="orderShipperAddress.street" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
            <el-input :disabled="isDisabled" v-trim v-model="shippingInformationForm.orderShipperAddress.street" v-input-auto="'en_num_symbol'" maxlength="100" size="mini" style=" width: 500px" :placeholder="$t('sea.streetHold')"></el-input>
          </el-form-item>
          <div style="display: flex;flex-wrap: wrap;">
            <el-form-item :label="$t('sea.city')" prop="orderShipperAddress.city" style="width: 275px;" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
              <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderShipperAddress.city" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.pleaseEnterCity')" />
            </el-form-item>
            <el-form-item label="" prop="orderShipperAddress.county" style="width: 150px;">
              <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderShipperAddress.county" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.countyAndDistrict')" />
            </el-form-item>
            <el-form-item label="" prop="orderShipperAddress.province" style="width: 150px;">
              <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderShipperAddress.province" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.provinceState')" />
            </el-form-item>
            <el-form-item label="" prop="orderShipperAddress.country" style="width: 150px;" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
              <Country :disabled="isDisabled" v-model="shippingInformationForm.orderShipperAddress.country"></Country>
            </el-form-item>
            <el-form-item label="" prop="orderShipperAddress.postCode" style="width: 150px;">
              <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderShipperAddress.postCode" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.zipCode')" />
            </el-form-item>
          </div>

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
          <!--        收货人-->
          <!--          <div class="more-info-link" @click="cahngeScrollStatus">-->
          <!--            {{ $t('sea.moreInfo') }}-->
          <!--            <span :class="[moreInfoScrollDown ? 'el-icon-arrow-down' : 'el-icon-arrow-right']"></span>-->
          <!--          </div>-->
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
            <div style="display: flex;flex-wrap: wrap;">
              <el-form-item :label="$t('sea.city')" prop="orderForwardersAddress.city" style="width: 275px;" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
                <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderForwardersAddress.city" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.pleaseEnterCity')" />
              </el-form-item>
              <el-form-item label="" prop="orderForwardersAddress.county" style="width: 150px;">
                <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderForwardersAddress.county" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.countyAndDistrict')" />
              </el-form-item>
              <el-form-item label="" prop="orderForwardersAddress.province" style="width: 150px;">
                <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderForwardersAddress.province" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.provinceState')" />
              </el-form-item>
              <el-form-item label="" prop="orderForwardersAddress.country" style="width: 150px;" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
                <Country :disabled="isDisabled" v-model="shippingInformationForm.orderForwardersAddress.country"></Country>
              </el-form-item>
              <el-form-item label="" prop="orderForwardersAddress.postCode" style="width: 150px;">
                <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderForwardersAddress.postCode" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.zipCode')" />
              </el-form-item>
            </div>
            <!--            <el-form-item :label="$t('sea.city')" prop="city">-->
            <!--              <el-row :gutter="10" type="flex">-->
            <!--                <el-col :span="4">-->
            <!--                  <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderForwardersAddress.city" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.pleaseEnterCity')" />-->
            <!--                </el-col>-->
            <!--                <el-col :span="4">-->
            <!--                  <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderForwardersAddress.county" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.countyAndDistrict')" />-->
            <!--                </el-col>-->
            <!--                <el-col :span="4">-->
            <!--                  <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderForwardersAddress.province" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.provinceState')" />-->
            <!--                </el-col>-->
            <!--                <el-col :span="4">-->
            <!--                  <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderForwardersAddress.country" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.countries')" />-->
            <!--                </el-col>-->
            <!--                <el-col :span="4">-->
            <!--                  <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderForwardersAddress.postCode" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.zipCode')" />-->
            <!--                </el-col>-->
            <!--              </el-row>-->
            <!--            </el-form-item>-->
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
            <el-form-item :label="$t('sea.consignee')" prop="orderConsigneeAddress.contact" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
              <el-autocomplete
                :disabled="isDisabled"
                v-input-auto="'en_num_symbol'"
                v-model="shippingInformationForm.orderConsigneeAddress.contact"
                :fetch-suggestions="((queryString,cb)=>{querySearch(queryString,cb,'orderConsigneeAddress')})"
                :placeholder="$t('sea.contactHold')" size="mini"
                @change="onChangeCompanyName($event,'orderConsigneeAddress')"
                @select="querySearchChange($event,'orderConsigneeAddress')"
                :maxlength="70"
                style=" width: 500px" >
                <template slot-scope="{ item }">
                  <span class="addr">{{ item.contact }}</span>
                </template>
              </el-autocomplete>
            </el-form-item>
            <el-form-item :label="$t('sea.street')" prop="orderConsigneeAddress.street" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
              <el-input :disabled="isDisabled" v-trim v-model="shippingInformationForm.orderConsigneeAddress.street" v-input-auto="'en_num_symbol'" maxlength="100" size="mini" style=" width: 500px" :placeholder="$t('sea.streetHold')"></el-input>
            </el-form-item>
            <div style="display: flex;flex-wrap: wrap;">
              <el-form-item :label="$t('sea.city')" prop="orderConsigneeAddress.city" style="width: 275px;" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
                <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderConsigneeAddress.city" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.pleaseEnterCity')" />
              </el-form-item>
              <el-form-item label="" prop="orderConsigneeAddress.county" style="width: 150px;">
                <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderConsigneeAddress.county" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.countyAndDistrict')" />
              </el-form-item>
              <el-form-item label="" prop="orderConsigneeAddress.province" style="width: 150px;">
                <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderConsigneeAddress.province" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.provinceState')" />
              </el-form-item>
              <el-form-item label="" prop="orderConsigneeAddress.country" style="width: 150px;" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
                <!--              <el-input size="mini" v-trim v-model="shippingInformationForm.orderConsigneeAddress.country" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.countries')" />-->
                <Country :disabled="isDisabled" v-model="shippingInformationForm.orderConsigneeAddress.country"></Country>
              </el-form-item>
              <el-form-item label="" prop="orderConsigneeAddress.postCode" style="width: 150px;">
                <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderConsigneeAddress.postCode" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.zipCode')" />
              </el-form-item>
            </div>
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
            <el-form-item :label="$t('sea.alertOthers')" prop="orderNotifyAddress.contact" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
              <el-autocomplete
                :disabled="isDisabled"
                v-input-auto="'en_num_symbol'"
                v-model="shippingInformationForm.orderNotifyAddress.contact"
                :fetch-suggestions="((queryString,cb)=>{querySearch(queryString,cb,'orderNotifyAddress')})"
                :placeholder="$t('sea.contactHold')" size="mini"
                @change="onChangeCompanyName($event,'orderNotifyAddress')"
                @select="querySearchChange($event,'orderNotifyAddress')"
                :maxlength="70"
                style=" width: 500px" >
                <template slot-scope="{ item }">
                  <span class="addr">{{ item.contact }}</span>
                </template>
              </el-autocomplete>
              <el-button @click="sameConsigneeInformation" type="primary" size="mini" style="margin-left: 100px">{{ $t('sea.sameConsigneeInformation') }}</el-button>
            </el-form-item>
            <el-form-item :label="$t('sea.street')" prop="orderNotifyAddress.street"  :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]" >
              <el-input :disabled="isDisabled" v-trim v-model="shippingInformationForm.orderNotifyAddress.street"  v-input-auto="'en_num_symbol'" maxlength="100" size="mini" style=" width: 500px" :placeholder="$t('sea.streetHold')"></el-input>
            </el-form-item>
            <div style="display: flex;flex-wrap: wrap;">
              <el-form-item :label="$t('sea.city')" prop="orderNotifyAddress.city" style="width: 275px;" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
                <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderNotifyAddress.city" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.pleaseEnterCity')" />
              </el-form-item>
              <el-form-item label="" prop="orderNotifyAddress.county" style="width: 150px;">
                <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderNotifyAddress.county" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.countyAndDistrict')" />
              </el-form-item>
              <el-form-item label="" prop="orderNotifyAddress.province" style="width: 150px;">
                <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderNotifyAddress.province" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.provinceState')" />
              </el-form-item>
              <el-form-item label="" prop="orderNotifyAddress.country" style="width: 150px;" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
                <!--              <el-input size="mini" v-trim v-model="shippingInformationForm.orderNotifyAddress.country" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.countries')" />-->
                <Country v-model="shippingInformationForm.orderNotifyAddress.country"></Country>
              </el-form-item>
              <el-form-item label="" prop="orderNotifyAddress.postCode" style="width: 150px;">
                <el-input :disabled="isDisabled" size="mini" v-trim v-model="shippingInformationForm.orderNotifyAddress.postCode" v-input-auto="'en_num_symbol'" maxlength="1000" :placeholder="$t('sea.zipCode')" />
              </el-form-item>
            </div>

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
          <el-form-item :label="$t('sea.cargoType')" prop="goodsTypeCode" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
            <!--        <GoodsType v-model="shippingInformationForm.goodsTypeCode" @change="goodsTypeCodeChange"></GoodsType>-->
            <el-input :disabled="true" class="w178" v-model="shippingInformationForm.goodsTypeCode" maxlength="1000" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>

          </el-form-item>
          <el-form-item :label="$t('sea.marks')" prop="goodsDesc" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]" class="marks">
            <el-input :disabled="isDisabled" type="textarea" style="width: 500px" v-model="shippingInformationForm.goodsDesc" show-word-limit v-input-auto="'en_num_symbol'" maxlength="60" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>
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
              <!--            <el-select v-model="item.typeCode" :filter-method="dataFilter" filterable size="mini" @change="ContainerTypesChange" style="width: 85px">-->
              <!--              <el-option v-for="(opt,index) in cntrOpts2" :key="index" :label="opt.englishName" :value="opt.isoCode" />-->
              <!--            </el-select>-->
              <ContainerSelect :disabled="is3040 || !!bookingJobId" @change="containerTypesChange($event,item,index)" :itemObj="item" class="w178"></ContainerSelect>
            </el-form-item>
            <el-form-item :label="$t('sea.quantity')" :prop="'containerList.' + index + '.ctnrNum'" size="mini" style="" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
              <el-input :disabled="is3040 || !!bookingJobId" v-model="item.ctnrNum" v-input-limit="[2,0]" ></el-input>
            </el-form-item>
            <el-form-item :label="$t('sea.weight')" :prop="'containerList.' + index + '.weight'" size="mini" style=""  :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },{message: $t('sea.doNotExceed30000'),validator:checkNumber,}]">
              <el-input :disabled="is3040 || !!bookingJobId" v-trim v-model="item.weight"  v-input-limit="[5,0]" placeholder="KGS/箱"></el-input>
            </el-form-item>
            <el-form-item :label="$t('sea.isSoc')" :prop="'containerList.' + index + '.ownerType'" size="mini" class="soc">
              <el-checkbox :disabled="is3040 || !!bookingJobId" v-model="isOwnerType" @change="item.ownerType = isOwnerType? 1 : 2"></el-checkbox>
            </el-form-item>
            <el-button :disabled="is3040 || !!bookingJobId" type="text" icon="el-icon-circle-plus" class="icon blue"  @click="addContainerType"  style="margin-right: 20px"></el-button>
            <el-button :disabled="isDisabled || !!bookingJobId" v-show="shippingInformationForm.containerList.length >1" type="text" icon="el-icon-remove" class="icon red"  @click="delContainerType(index)"></el-button>
            <!--            <i v-show="shippingInformationForm.containerList.length<5" class="icon el-icon-circle-plus blue" @click="addContainerType" style="margin-right: 20px"></i>-->
            <!--            <i v-show="shippingInformationForm.containerList.length >1" class="icon el-icon-remove red" @click="delContainerType(index)"></i>-->
          </div>
        </div>
        <!--      费率信息-->
        <div class="box_title">{{$t('sea.rateInformation')}}</div>
        <div class="box_child cargoInformation">
          <el-form-item :label="$t('sea.priceCardNumber')"  prop="contractNo" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },{ validator: validateContractNo, trigger: 'blur' }]">
            <el-autocomplete
              v-trim
              :disabled="isDisabled"
              class="inline-input w178"
              size="mini"
              v-model="shippingInformationForm.contractNo"
              :fetch-suggestions="querySearchContractNo"
              :placeholder="$t('sea.pleaseEnter')"
              @select="handleSelect"
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
            <el-button :disabled="is3040 || !!bookingJobId" type="text" icon="el-icon-circle-plus" class="icon blue"  @click="addRateInformation"  style="margin-right: 20px"></el-button>
            <el-button :disabled="isDisabled" v-show="shippingInformationForm.userReferenceList.length >1" type="text" icon="el-icon-remove" class="icon red"  @click="delRateInformation(index)"></el-button>
          </div>
        </div>
        <!--      其他信息-->
        <div class="box_title">{{$t('sea.otherInformation')}}</div>
        <div class="box_child cargoInformation">
          <div>
            <el-form-item :label="$t('sea.remarks')" prop="remarks">
              <el-input :disabled="isDisabled" type="textarea" v-model="shippingInformationForm.remarks" v-input-auto="'en_num_symbol'" show-word-limit maxlength="200" size="mini" :placeholder="$t('sea.pleaseEnter')" style="width: 475px"></el-input>
            </el-form-item>
          </div>
          <el-form-item :label="$t('sea.confirmationLetterSentByEmail')" prop="bookingConfirmEmail" :rules="[{ required: false, message: this.$t('sea.pleaseEnter'), trigger: 'blur' }, { validator: this.validateEmail, trigger: 'blur' }]">
            <el-input :disabled="isDisabled" v-model="shippingInformationForm.bookingConfirmEmail" maxlength="1000" size="mini" :placeholder="$t('sea.pleaseEnter')" style="width: 475px"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!--    <div class="btn_box" :style="{width: `calc(100% - ${withoutAnimation ? 180 :54}px)`}">-->
    <!--      -->
    <!--&lt;!&ndash;      <el-button type="danger" size="mini" @click="exitCustoms">{{ $t('sea.exitCustoms') }}</el-button>&ndash;&gt;-->
    <!--    </div>-->

    <div class="page-edit-footer">
      <el-button v-if="[30,40,50].indexOf(customerInformationForm.orderState)>-1" type="primary" size="mini" @click="save">{{ $t('sea.save') }}</el-button>
      <!--      发送订舱 新建订舱单，或订舱单“待发送”/"订舱失败"状态下可见-->
      <el-button v-if="orderDetailsData.isUnlocked && ([20].indexOf(customerInformationForm.orderState)>-1 || [1,3].indexOf(customerInformationForm.jobState)>-1)" type="primary" size="mini" @click="sendBooking">{{ $t('sea.sendBooking') }}</el-button>
      <!--      保存草稿-->
      <el-button v-if="orderDetailsData.isUnlocked && ([20].indexOf(customerInformationForm.orderState)>-1 || [1].indexOf(customerInformationForm.jobState)>-1)" type="primary" size="mini" @click="saveDraft">{{ $t('sea.saveDraft') }}</el-button>

      <el-button v-if="orderDetailsData.isUnlocked && [30].indexOf(customerInformationForm.orderState)>-1 && $isEmpty(packingDataList.containerList)" type="danger" size="mini" @click="cancel">{{ $t('sea.cancelBooking') }}</el-button>
      <el-button v-if="orderDetailsData.isUnlocked && isShowBookingExit" type="danger" size="mini" @click="bookingExitCustoms">{{ $t('sea.exitCustoms') }}</el-button>
      <el-button type="danger" size="mini" @click="close">{{ $t('sea.close') }}</el-button>
    </div>

    <JobShutOut v-if="JobShutOutDialog"
    :orderDetailsData="orderDetailsData"
                :JobShutOutDialog.sync="JobShutOutDialog"
                :bookingJobId="bookingJobId"
                :containerListDataProp="packingDataList"
                @exitSuccessfully="exitSuccessfully"></JobShutOut>
    <DialogShipChooseType v-if="shipChooseTypeDialog" :shipChooseTypeDialog.sync="shipChooseTypeDialog" :showShipScheduleInquiry.sync="showShipScheduleInquiry"  :polCode="shippingInformationForm.polCode" :podCode="shippingInformationForm.podCode"
                          :etdTimeSearch="shippingInformationForm.etdTimeSearch" :timeQuantum="shippingInformationForm.timeQuantum" :destinationCode="shippingInformationForm.destinationCode"
                          :receiptCode="shippingInformationForm.receiptCode" @shipChooseSubmit="shipChooseSubmit"
    >
    </DialogShipChooseType>

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
import DialogShipChooseType from "./dialogShipChooseType"
import Country from "./country"
import lodash from 'lodash'
import {
	containerListApi, seaAutoBookingSaveBookingApi, seaAutoBookingSaveDraftApi, seaAutoBookingSendBookingApi,
	seaBookingAddApi,
	seaBookingCancelApi,
	seaBookingContractNoApi,
	seaBookingDetailApi, seaBookingInitApi,
	seaScnHistoryApi, seaSoNoEditApi
} from "@/api/seaExportOrder"
import { validEmail } from "@/utils/validate"
import SeaCitySelect from "@/views/cargo/v0/SeaExport/components/order/seaCitySelect"
import orderMixin from "./orderMixin";

export default {
	name: 'BookingAddAuto',
	components: { cargoAdvanceSelect, Receipt, GoodsType, ContainerSelect, FreightTerm, JobShutOut, DialogShipChooseType, Country, SeaCitySelect },
	props: {
		uploadRadioType: { type: String, default: null },
		orderDetailsData: {
			type: Object, default: () => {
			}
		}
	},
  mixins: [orderMixin],
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
			bookingJobId: null,
			shippingInformationForm: {
				// bookingId: null,
				soNo: null,
				soNoSon: [],
				receiptCode: null,
				carrierId: 5,
				carrierName: 'COSCO',
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
				goodsTypeCode: 'General', // 货物类型
				goodsType: 'General',
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
				userReferenceList: [{
					userReferenceNo: null,
					userReferenceType: null
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
			moreInfoScrollDown: true,
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
			shipChooseTypeDialog: false, // 船期选择
			showShipScheduleInquiry: true,
			userReferenceTypeOptions: [
				'AES Number',
				'AQSIQ',
				'B/L Reference Number',
				'BK Sales ID',
				'Bill Of Entry Date',
				'Bill Of Entry Number',
				'Carcommit Due Date',
				'Carcommit Due Number',
				'Charge quoted by SA',
				'Collect Date',
				'Contract Number',
				'Customer Reference Number',
				'Customer Site ID',
				'Customs Status Information',
				'Declarant CR Number',
				'Demurrage Collected',
				'Department Number',
				'Door date',
				'EEI---Electronic Export Information',
				'Egypt ACID Number',
				'Egypt Exporter Registration Number',
				'Egypt Importer VAT Number',
				'Electronic Custom Clearance Number (AUS)',
				'Empty P/U Location',
				'FEIN number (for shipper)',
				'First Carrier B/L Number (HKG)',
				'Forwarder Reference',
				'HK RO NO',
				'Hot Delivery Service',
				'House B/L',
				'Inbound Customer Reference',
				'Invoice Number',
				'Letter of Credit',
				'Master Booking Number',
				'Merchant haulage vendor',
				'Pattern Booking Number',
				'Pre Booking Number',
				'Proof of Report for ACI',
				'Purchase Order Number',
				'Quotation Number',
				'Reference Of Item',
				'ReleaseDate',
				'Repetitive Pattern Code',
				'Reserved (Inbound Split B/L)',
				'Reserved (Memo B/L)',
				'S/O Number',
				'SC Commodity Group',
				'SCAC code',
				'Shipper Reference',
				'Shippers Identity For Shipment (SID)',
				'Shipping Instruction Reference',
				'Storage Paid Until',
				'T/S Agreement for US',
				'Time Volume Rate',
				'VAT number (for consignee)',
				'VGM Reference Number',
				'Warranty Registration Number',
				'XTN---External Transaction Number'
			],
			bookingAgentArr: [
				'深圳',
				'上海',
				'宁波',
				'厦门',
				'广州',
				'青岛',
				'天津',
				'大连'
			],
			andBeyondArr: ['二', '三', '四', '五', '六', '七', '八'],
			isDisabled: false,
			shipChooseData: {},
			isEditSoNo: true
		}
	},
	computed: {
		url() {
			return URL
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
		// orderDetailsData(newVal) {
		//   this.customerInformationForm = newVal
		//   if (!this.bookingJobId && this.customerInformationForm.bookingJobId) {
		//     this.bookingJobId = this.customerInformationForm.bookingJobId
		//     this.getSeaBookingDetail()
		//     this.getSeaOrderSailingApi()
		//     this.getContainerList(this.bookingJobId)
		//   }
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
		if (this.$isNotEmpty(this.customerInformationForm)) {
			this.bookingJobId = this.customerInformationForm.bookingJobId
		}
		[1, 2, 3, 4].map(item => {
			this.getSeaScnHistoryApi(item)
		})
		await this.getSeaOrderSailingApi()
		if (this.bookingJobId && [0, 1, 2, 3].indexOf(this.customerInformationForm.jobState) > -1) {
			await this.getSeaBookingDetail()
			this.getContainerList(this.bookingJobId) // 获取装箱信息
		} else if (this.customerInformationForm.orderState === 20) { // 待订舱 订舱初始化
			await this.getSeaBookingInitApi(this.id)
		}
		if (this.bookingJobId) {
			const res = await seaSoNoEditApi(this.bookingJobId)
			if (res.ok) {
				this.isEditSoNo = !res.content
			}
		}
		if (!this.shippingInformationForm.orderShipperAddress.country) {
			this.$set(this.shippingInformationForm.orderShipperAddress, 'country', 'China')
		}
		if (!this.shippingInformationForm.timeQuantum) {
			this.$set(this.shippingInformationForm, 'timeQuantum', '及后二周内')
		}
		if (!this.shippingInformationForm.shipChooseType) {
			this.$set(this.shippingInformationForm, 'shipChooseType', 1)
		}
		if (!this.shippingInformationForm.etdTimeSearch) {
			this.$set(this.shippingInformationForm, 'etdTimeSearch', this.$moment().add(1, 'days').format('YYYY-MM-DD'))
		}


		this.$nextTick(() => {
			this.$refs.shippingInformationForm.clearValidate()
		})
		// 订舱处理中
		if (Number(this.customerInformationForm.jobState) === 2) {
			this.isDisabled = true
		}
		if (Number(this.customerInformationForm.orderState) >= 30) {
			this.isDisabled = true
		}
	},
	methods: {
		validateContractNo(rule, value, callback) {
			if (value.length !== 8 && value) {
				callback(new Error(this.$t('sea.characters8')))
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
		validateEmail(rule, value, callback) {
			if (!validEmail(value) && value) {
				callback(new Error(this.$t('blInfo.emailError')))
			} else {
				callback()
			}
		},
		// 订舱初始化
		async getSeaBookingInitApi(id) {
			this.loading = true
			const res = await seaBookingInitApi(id)
			if (res.ok) {
				res.content.bookingChannel = this.orderDetailsData.bookingChannel || this.$route.query.bookingChannel
				res.content.bookingJobMethod = this.orderDetailsData.bookingJobMethod || this.$route.query.bookingJobMethod
				delete res.content.id
				if (res.content.vessel === 'TBA') {
					res.content.vessel = null
					res.content.voyage = null
				}
				this.bookingInit(res)
				this.$nextTick(() => {
					this.$refs.shippingInformationForm.clearValidate()
				})

			}
			this.loading = false
		},
		bookingInit(res) {

			if (this.$isEmpty(res.content.orderShipperAddress)) {
				res.content.orderShipperAddress = {
					country: 'China'
				}
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
			if (res.content.vessel === 'TBA') {
				res.content.TBA1 = true
			}
			if (res.content.secVessel === 'TBA') {
				res.content.TBA2 = true
			}
			res.content.containerList.map(item => {
				if (!item.ownerType) {
					item.ownerType = 2
				}
			})
			if (res.content.sailingQueryFlag) {
				this.shipChooseData = lodash.cloneDeep(res.content)
			} else if (res.content.shipChooseType === 1) {
				this.showShipScheduleInquiry = true
			}
			// IS EBI this.$set(this.shippingInformationForm, 'orderWebsite', 'E-Business International(EBI)')
			if (res.content.orderWebsite === 'EBI') {
				res.content.EBI = true
			}
			if (!res.content.userReferenceList || this.$isEmpty(res.content.userReferenceList)) {
				res.content.userReferenceList = [{
					userReferenceNo: null,
					userReferenceType: null
				}]
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
			console.log('this.shippingInformationForm', this.shippingInformationForm)
		},
		// 获取装箱信息
		async getContainerList(id) {
			this.loading = true
			const res = await containerListApi(id)
			this.loading = false
			if (res.ok) {
				this.containerListData = res.content
			}
		},
		// 退关成功
		exitSuccessfully() {
			this.getSeaBookingDetail()
			this.getContainerList(this.bookingJobId)
		},
		async getSeaScnHistoryApi(type) {
			this.loading = true
			const res = await seaScnHistoryApi(this.id, type)
			this.loading = false
			if (res.ok) {
				if (type === 1) {
					this.$set(this.contactList.orderShipperAddress, 'data', res.content)
				} else if (type === 2) {
					this.$set(this.contactList.orderConsigneeAddress, 'data', res.content)

				} else if (type === 3) {
					this.$set(this.contactList.orderNotifyAddress, 'data', res.content)

				} else if (type === 4) {
					this.$set(this.contactList.orderForwardersAddress, 'data', res.content)
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
		async getSeaBookingDetail() {
			this.loading = true
			const res = await seaBookingDetailApi(this.bookingJobId)
			this.loading = false
			if (res) {
				this.bookingInit(res)
			}
		},
		clientEdit() {
			this.$router.push({ name: 'SeaExportOrderCreate', query: { id: this.id } })
		},
		cahngeScrollStatus() {
			// this.moreInfoScrollDown = !this.moreInfoScrollDown
			// if (this.bookingJobId) {
			//   if (this.moreInfoScrollDown && !this.isGetSeaScnHistoryApi) {
			//     [2, 3, 4].map(item => {
			//       this.getSeaScnHistoryApi(item)
			//     })
			//     this.isGetSeaScnHistoryApi = true
			//   }
			// }

		},
		TBAChange(val, type) {
			if (val) {
				if (type === 1) {
					if (this.shippingInformationForm.TBA2) {
						this.$set(this.shippingInformationForm, 'TBA2', false)
						this.$set(this.shippingInformationForm, 'secVessel', '')
						this.$set(this.shippingInformationForm, 'secVoyage', '')
					}
					this.$set(this.shippingInformationForm, 'vessel', 'TBA')
					this.$set(this.shippingInformationForm, 'voyage', '---')
				} else if (type === 2) {
					if (this.shippingInformationForm.TBA1) {
						this.$set(this.shippingInformationForm, 'TBA1', false)
						this.$set(this.shippingInformationForm, 'vessel', '')
						this.$set(this.shippingInformationForm, 'voyage', '')
					}
					this.$set(this.shippingInformationForm, 'secVessel', 'TBA')
					this.$set(this.shippingInformationForm, 'secVoyage', '---')
				}
			} else {
				if (type === 1) {
					this.$set(this.shippingInformationForm, 'vessel', null)
					this.$set(this.shippingInformationForm, 'voyage', null)
				} else if (type === 2) {
					this.$set(this.shippingInformationForm, 'secVessel', null)
					this.$set(this.shippingInformationForm, 'secVoyage', null)
				}
			}
		},
		transitFlagChange(val) {
			this.$set(this.shippingInformationForm, 'vessel', null)
			this.$set(this.shippingInformationForm, 'voyage', null)
			this.$set(this.shippingInformationForm, 'TBA1', false)
			this.$set(this.shippingInformationForm, 'TBA2', false)
			this.$set(this.shippingInformationForm, 'TBA3', false)
			this.$set(this.shippingInformationForm, 'secVoyage', null)
			this.$set(this.shippingInformationForm, 'secVessel', null)

			// if (val && !this.shippingInformationForm.secondLane) {
			//   // this.$set(this.shippingInformationForm, 'secondLane', 'CY')
			// }
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
			console.log(index)
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
					if (!this.shippingInformationForm.orderId) {
						this.shippingInformationForm.orderId = this.id
					}
					if (this.$isNotEmpty(this.shipChooseData)) {
						this.shippingInformationForm.sailingQueryFlag = true
					} else {
						this.shippingInformationForm.sailingQueryFlag = false
					}
					this.loading = true
					const res = await seaAutoBookingSaveBookingApi(this.shippingInformationForm)
					this.loading = false
					if (res.ok) {
						this.$message.success(this.$t('sea.submittedSuccessfully'))
						this.$emit('change', '1', true)
						this.shippingInformationForm.confirmUpdate = false
					} else {
						this.saveConfirm(res)
					}
				} else {
					this.mixinsFormScrollIntoView()
					return false
				}
			})
		},
		async saveConfirm(res) {
			this.$confirm(res.message, this.$t('common.tips'), {
				confirmButtonText: this.$t('common.confirmBtn'),
				cancelButtonText: this.$t('common.cancelBtn'),
				type: 'warning'
			}).then(() => {
				this.shippingInformationForm.confirmUpdate = true
				this.save()
			}).catch(() => {
				this.shippingInformationForm.confirmUpdate = false
			})
		},
		sendBooking() {
			this.bookingDraft(2)
		},
		async saveDraft() {
			this.bookingDraft(1)
		},
		bookingDraft(type) {
			this.$refs.shippingInformationForm.validate(async valid => {
				if (valid) {
					const typeCodeArr = this.shippingInformationForm.containerList.map(item => item.englishName)
					if (new Set(typeCodeArr).size !== typeCodeArr.length) {
						this.$message.warning(this.$t('sea.sameBoxTypeIsSelected'))
						return false
					}
					if (this.$isNotEmpty(this.shipChooseData)) {
						this.shippingInformationForm.sailingQueryFlag = true
					} else {
						this.shippingInformationForm.sailingQueryFlag = false
					}
					this.loading = true
					if (!this.shippingInformationForm.orderId) {
						this.shippingInformationForm.orderId = this.id
					}
					let res
					if (type === 1) {
						res = await seaAutoBookingSaveDraftApi(this.shippingInformationForm)
					} else if (type === 2) {
						res = await seaAutoBookingSendBookingApi(this.shippingInformationForm)
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
		close() {
			this.$emit('change', '1', true)
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
			console.log(this.contactList[index], index)
			const restaurants = lodash.cloneDeep(this.contactList[index].data)
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
			const findOne = this.contactList[key].data.find(item => item.contact === val.contact)
			if (findOne) { // 后台数据中查到的  && findOne.id
				this.shippingInformationForm[key].contact = lodash.cloneDeep(findOne.contact)
				this.onChangeCompanyName(findOne, key)
			}
		},
		onChangeCompanyName(val, source) {
			const findOne = this.contactList[source].data.find(item => item.contact === val.contact)
			if (findOne) { // 后台数据中查到的  && findOne.id
				this.shippingInformationForm[source] = lodash.cloneDeep(findOne)
			} else {
				this.shippingInformationForm[source].id = 0
			}
		},
		shipChooseSubmit(val) {
			this.shipChooseData = val
			lodash.merge(this.shippingInformationForm, val)
			console.log(this.shippingInformationForm, val)
			// this.$set(this.shippingInformationForm, 'transitFlag', Number(this.shipChooseData.isTransit) === 1)
			// this.$set(this.shippingInformationForm, 'vessel', this.shipChooseData.vessel)
			// this.$set(this.shippingInformationForm, 'voyage', this.shipChooseData.voyage)
			// if (Number(this.shipChooseData.isTransit) === 1) {
			//   this.$set(this.shippingInformationForm, 'secVessel', this.shipChooseData.vesselAfterTransit)
			//   this.$set(this.shippingInformationForm, 'secVoyage', this.shipChooseData.voyageAfterTransit)
			// }
		},
		// 船期查询按钮 打开弹窗
		shipScheduleInquiry() {
			this.shipChooseTypeDialog = true
			this.showShipScheduleInquiry = false
			this.shipChooseData = {}
		},
		shipChooseTypeChange() {
			this.shipChooseData = {}
		},
		restShipChoose() {
			if (this.$isNotEmpty(this.shipChooseData)) {
				this.showShipScheduleInquiry = false
				this.shipChooseData = {}
				this.$set(this.shippingInformationForm, 'vessel', null)
				this.$set(this.shippingInformationForm, 'voyage', null)
				this.$set(this.shippingInformationForm, 'secVessel', null)
				this.$set(this.shippingInformationForm, 'secVoyage', null)
			}

		},
		// EBI
		ebiChange(val) {
			if (val) {
				this.$set(this.shippingInformationForm, 'orderWebsite', 'EBI')
			} else {
				this.$set(this.shippingInformationForm, 'orderWebsite', null)
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
	::v-deep .el-form-item {
		width: 24%;
		box-sizing: border-box;
		margin-right: 0;
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
.inputWidth ::v-deep .el-input__inner {
	padding-right: 30px;
}

.page-edit-content,
.page-edit-footer {
	width: auto;
}
.placeName {
	font-weight: bold;
	position: relative;
	top: -5px;
}
p {
	margin: 0;
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
