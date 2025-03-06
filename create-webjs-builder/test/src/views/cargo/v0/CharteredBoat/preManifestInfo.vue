<template>
  <div class="sys-right-inner-wrap" v-loading="loading">
    <el-form :inline="true" :model="dataForm" @submit.native.prevent ref="dataForm">
      <!--        基本信息-->
      <div class="title">{{ $t('preManifest.essentialInformation') }}</div>
      <el-form-item :label="$t('preManifest.mainWithdrawalNo')" prop="soNo" :rules="[{ required: true, message: `${$t('common.placeholder')}${$t('preManifest.mainWithdrawalNo')}`, trigger: 'blur' },]">
        <el-input v-model="dataForm.soNo" :disabled="essentialHide" :placeholder="`${$t('common.placeholder')}${$t('preManifest.mainWithdrawalNo')}`"></el-input>
      </el-form-item>
      <el-form-item :label="$t('charteredBoat.vesselName')" prop="vessel" :rules="[{ required: true, message: `${$t('common.placeholder')}${$t('charteredBoat.vesselName')}`, trigger: 'blur' },]">
        <el-input v-model="dataForm.vessel" :disabled="essentialHide" :placeholder="`${$t('common.placeholder')}${$t('preManifest.mainWithdrawalNo')}`"></el-input>
      </el-form-item>
      <el-form-item :label="$t('charteredBoat.voyageNo')" prop="voyage" :rules="[{ required: true, message: `${$t('common.placeholder')}${$t('charteredBoat.voyageNo')}`, trigger: 'blur' },]">
        <el-input v-model="dataForm.voyage" :disabled="essentialHide" :placeholder="`${$t('common.placeholder')}${$t('charteredBoat.voyageNo')}`"></el-input>
      </el-form-item>
      <el-form-item :label="$t('preManifest.podName')" prop="podName" :rules="[{ required: true, message: `${$t('common.placeholder')}${$t('preManifest.podName')}`, trigger: 'blur' },]">
        <el-input v-model="dataForm.podName" :disabled="essentialHide" :placeholder="`${$t('common.placeholder')}${$t('preManifest.podName')}`"></el-input>
      </el-form-item>
      <el-form-item :label="$t('charteredBoat.paymentMethod')" prop="paymentMode"  :rules="[{ required: true, message: `${$t('common.placeholder')}${$t('charteredBoat.paymentMethod')}`, trigger: 'blur' },]" class="blinfo-type-group">
        <el-radio-group v-model="dataForm.paymentMode" :disabled="preview">
          <el-radio :label="2">{{$t('charteredBoat.toPay')}}</el-radio>
          <el-radio :label="1">{{$t('charteredBoat.prepaid')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!--        明细品名及数据-->
      <div class="title" style="margin: 4px 50px 0 0">{{ $t('preManifest.detailedData') }}</div>
      <div v-for="(item,index) in dataForm.houseDTOList" :key="index">
        <div style="display: flex; margin-top: 30px">
          <div style="margin: 6px 50px 0 0 ;font-size: 14px">{{ $t('preManifest.customsWithdrawalNo') }}</div>
          <div style="margin: 6px 50px 0 0 ;font-size: 14px">{{item.hblNo}}</div>
          <!--            YHTDCB00001<template>{{ (index + 10).toString(36).toUpperCase() }}</template>-->
          <!--            <template v-if="index>25">{{ (index-26 + 10).toString(36).toUpperCase() }}</template>-->
          <!--            <template v-if="index>51">{{ (index-52 + 10).toString(36).toUpperCase() }}</template>-->
          <div class="features-btn">
            <el-button type="primary" @click="addSplit(index)" :disabled="preview" size="mini">{{$t('preManifest.addSplit')}}</el-button>
            <el-button type="primary" @click="deleteSplit(index)" :disabled="dataForm.houseDTOList.length === 1 || preview" size="mini" style="margin-right: 50px">{{$t('preManifest.deleteSplit')}}</el-button>

            <el-button type="primary" size="mini" @click="getBoxNumber(index)" :disabled="preview">{{$t('preManifest.getBoxNumber')}}</el-button>
            <el-button type="primary" @click="addCargoDetails(index)" :disabled="preview" size="mini">{{$t('preManifest.addCargoDetails')}}</el-button>
            <el-button type="primary" @click="deleteDetails(index)"  :disabled="item.containerCargoDTOList.length === 1 || preview" size="mini">{{$t('common.deleteBtn')}}</el-button>
            <el-button type="primary" @click="copy(index)" :disabled="preview" size="mini">{{$t('common.copyBtn')}}</el-button>
            <el-button type="primary" size="mini" :disabled="preview" slot="reference" @click="empty(index)">{{$t('common.clearBtn')}}</el-button>
<!--            <el-popconfirm-->
<!--              placement="top"-->
<!--              width="260"-->
<!--              v-model="popoverVisible"-->
<!--              title="是否清空当前分单的全部明细，清空后无法恢复，是否继续？"-->
<!--              style="margin-left: 10px"-->
<!--              @confirm="empty(index)"-->
<!--            >-->
<!--              <el-button type="primary" size="mini" :disabled="preview" slot="reference">{{$t('preManifest.empty')}}</el-button>-->

<!--            </el-popconfirm>-->
          </div>
        </div>
        <el-table class="dataTable" :data="item.containerCargoDTOList" @selection-change="(val)=>handleSelectionChange(val,index)" ref="conatinerTable">
          <el-table-column type="selection" width="55" fixed></el-table-column>
          <el-table-column prop="containerNo" align="center"  width="150">
            <template slot="header"><span class="required">*</span><span>{{ $t('charteredBoat.containerNo') }}</span></template>
            <template slot-scope="{row,$index}">
              <el-form-item label-width="0px" :prop="'houseDTOList.'+index+'.containerCargoDTOList.'+$index + '.containerNo'"  :rules="row.containerType?validateContainerNo(row.containerType): []">
                <el-input v-model="row.containerNo" :disabled="preview" size="mini" @change="getMaterialDetails(row,index,$index)"  @blur="implementValidateContainerNo(row.containerType,'houseDTOList.'+index+'.containerCargoDTOList.'+$index + '.containerNo')" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="sealNo" align="center"  width="150">
            <template slot="header"><span class="required">*</span><span>{{ $t('preManifest.sealNo') }}</span></template>
            <template slot-scope="{row,$index}">
              <el-form-item label-width="0px" :prop="'houseDTOList.'+index+'.containerCargoDTOList.'+$index + '.sealNo'" :rules="[ { required: true, message: `${$t('common.placeholder')}`, trigger: 'blur' }, ]">
                <el-input v-model="row.sealNo" :disabled="preview" size="mini" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="a" align="center"  width="150">  <!--箱型-->
            <template slot="header"><span class="required">*</span><span>{{ $t('charteredBoat.containerType') }}</span></template>
            <template slot-scope="{row,$index}">
              <el-form-item label-width="0px" :prop="'houseDTOList.'+index+'.containerCargoDTOList.'+$index + '.containerType'" :rules="[ { required: true, message: `${$t('common.placeholder')}`, trigger: 'blur' }, ]">
                <el-select filterable v-model="row.containerType" :disabled="row.containerTypeDisabled || preview " @change="containerTypeChange('houseDTOList.'+index+'.containerCargoDTOList.'+$index + '.containerNo')" :placeholder="$t('common.placeholder')" style="width: 100px" size="mini" >
                  <el-option
                    v-for="item in containerTypeList"
                    :key="item.englishName"
                    :label="item.englishName"
                    :value="item.englishName">
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="a" align="center"  width="150">
            <template slot="header"><span class="required">*</span><span>{{ $t('preManifest.stuffingTyep') }}</span></template>
            <template slot-scope="{row,$index}">
              <el-form-item label-width="0px" :prop="'houseDTOList.'+index+'.containerCargoDTOList.'+$index + '.isFull'" :rules="[ { required: true, message: $t('preManifest.stuffingTyepEmptyInvalid'), trigger: 'blur' }, ]">
                <el-select filterable v-model="row.isFull" :disabled="preview" :placeholder="$t('common.placeholder')" style="width: 100px" size="mini" >
                  <el-option :label="$t('preManifest.wholeStuffing')" :value="true"> </el-option>
                  <el-option :label="$t('preManifest.mixedStuffing')" :value="false"> </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="a" align="center"  width="150">
            <template slot="header"><span class="required">*</span><span>{{$t('charteredBoat.hsCode')}}</span></template>
            <template slot-scope="{row,$index}">
              <el-form-item label-width="0px" :prop="'houseDTOList.'+index+'.containerCargoDTOList.'+$index + '.hsCode'" :rules="[ { required: true, message: `${$t('preManifest.hsCodeEmptyInvalid')}`, trigger: 'blur' }, ]">
                <el-input v-model="row.hsCode" :disabled="preview" size="mini" oninput="value=value.replace(/[^\d.]/g,'')"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="a" align="center"  width="150">
            <template slot="header"><span class="required">*</span>
              <span v-if="dataForm.polCode === 'CNDGG'">{{ $t('preManifest.productNameChinese') }}</span>
              <span v-else>{{ $t('preManifest.productNameEnglish') }}</span>
            </template>
            <template slot-scope="{row,$index}">
              <el-form-item label-width="0px" :prop="'houseDTOList.'+index+'.containerCargoDTOList.'+$index + '.cargoDesc'" :rules="[ { required: true, message: `${$t('common.placeholder')}`, trigger: 'blur' }, ]">
                <el-input v-if="dataForm.polCode === 'CNDGG'" v-model="row.cargoDesc" :disabled="preview" size="mini" maxlength="1000"/>
                <el-input v-else v-model="row.cargoDesc" :disabled="preview" size="mini" maxlength="1000" onblur="value=value.replace(/[^\x00-\xff]/g, '').toUpperCase()"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="a" align="center"  width="150">
            <template slot="header"><span class="required">*</span><span>{{ $t('preManifest.productQuantity') }}</span></template>
            <template slot-scope="{row,$index}">
              <el-form-item label-width="0px" :prop="'houseDTOList.'+index+'.containerCargoDTOList.'+$index + '.quantity'" :rules="[ { required: true, message: $t('preManifest.productQuantityEmptyInvalid'), trigger: 'blur' }, ]">
                <el-input v-model="row.quantity" :disabled="preview" size="mini" oninput="value=value.replace(/[^\d]/g,'')" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="a" align="center"  width="150">
            <template slot="header"><span class="required">*</span><span>{{ $t('preManifest.packagingUnit') }}</span></template>
            <template slot-scope="{row,$index}">
              <el-form-item label-width="0px" :prop="'houseDTOList.'+index+'.containerCargoDTOList.'+$index + '.packageType'" :rules="[ { required: true, message: $t('preManifest.packagingUnitEmptyInvalid'), trigger: 'blur' }, ]">
                <el-select filterable v-model="row.packageType" :disabled="preview" :placeholder="$t('common.placeholder')" size="mini">
                  <el-option
                    v-for="item in packageTypeOption"
                    :key="item.englishName"
                    :label="item.englishName"
                    :value="item.englishName">
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="a" align="center"  width="150">
            <template slot="header"><span class="required">*</span><span>{{ $t('charteredBoat.grossWeight') }}</span></template>
            <template slot-scope="{row,$index}">
              <el-form-item label-width="0px"  :prop="'houseDTOList.'+index+'.containerCargoDTOList.'+$index + '.weight'" :rules="[ { required: true, message: $t('common.placeholder'), trigger: 'blur' }, ]">
                <el-input v-model="row.weight" :disabled="preview" size="mini" v-input-limit=[5,3] />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="a" align="center"  width="150">
            <template slot="header"><span class="required">*</span><span>{{ $t('charteredBoat.volume') }}</span></template>
            <template slot-scope="{row,$index}">
              <el-form-item label-width="0px" :prop="'houseDTOList.'+index+'.containerCargoDTOList.'+$index + '.volume'" :rules="[ { required: true, message: $t('common.placeholder'), trigger: 'blur' }, ]">
                <el-input v-model="row.volume" :disabled="preview" size="mini" v-input-limit=[3,3] />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="a" align="center"  width="150">
            <template slot="header"><span class="required">*</span><span>{{ $t('preManifest.mark') }}</span></template>
            <template slot-scope="{row,$index}">
              <el-form-item label-width="0px" :prop="'houseDTOList.'+index+'.containerCargoDTOList.'+$index + '.marks'" :rules="[ { required: true, message: $t('common.placeholder'), trigger: 'blur' }, ]">
                <el-input v-model="row.marks" :disabled="preview" size="mini" onblur="value=value.replace(/[^\x00-\xff]/g, '')"/>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--        收发通信息-->
      <div class="title" style="margin: 40px 50px 0 0">{{ $t('preManifest.transceiver') }}</div>
      <!--        发货人-->
      <div class="billForm">
        <ul style="width: 100%">
          <li class="title"><span>*</span>{{ $t('preManifest.shipper') }}</li>
          <li>
            <el-form-item :label="$t('preManifest.countryCode')" prop="shipper.countryCode" label-width="100px" :rules="[{ required: true, message: $t('common.placeholder'), trigger: 'change' },]">
              <el-select filterable v-model="dataForm.shipper.countryCode" :disabled="preview" :placeholder="$t('common.selectPlaceholder')" style="width: 100px" @change="countryCodeChange('shipper')">
                <el-option
                  v-for="(item,index) in countryOptions"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('preManifest.code')" prop="shipper.memberCode" label-width="50px" :rules="[{ required: true, message: $t('common.placeholder'), trigger: 'change' },]">
              <el-select filterable v-model="dataForm.shipper.memberCode" :disabled="preview" :placeholder="$t('common.placeholder')" style="width: 100px" >
                <el-option
                  v-for="(item,index) in customerOptions[dataForm.shipper.countryCode]"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="shipper.memberText" label-width="100px" :rules="[{ required: true, message: $t('common.placeholder'), trigger: 'blur' },]">
              <el-input v-model="dataForm.shipper.memberText" :disabled="preview" maxlength="255" style="width: 180px"></el-input>
            </el-form-item>
          </li>
          <li>
            <el-form-item :label="$t('preManifest.name')" prop="shipper.contact" label-width="100px" :rules="[{ required: true, message: $t('common.placeholder'), trigger: 'blur' },]">
              <el-input v-model="dataForm.shipper.contact" :disabled="preview" @blur="contact($event,'shipper','contact')" maxlength="200" :placeholder="$t('preManifest.companyNamePlaceholder')" style="width: 800px"></el-input>
            </el-form-item>

          </li>
          <li>
            <el-form-item :label="$t('preManifest.address')" prop="shipper.street" label-width="100px" :rules="[{ required: true, message: $t('common.placeholder'), trigger: 'blur' },]">
              <el-input v-model="dataForm.shipper.street" :disabled="preview" @blur="contact($event,'shipper','street')" min maxlength="200" :placeholder="$t('common.placeholder')" style="width: 800px"></el-input>
            </el-form-item>
          </li>
          <li>
            <!--            :rules="[ {validator: this.validateEmail, trigger: 'blur'}]"-->
            <el-form-item :label="$t('preManifest.email')" prop="shipper.email" label-width="100px" >
              <el-input v-model="dataForm.shipper.email" :disabled="preview" :placeholder="$t('preManifest.emailPlaceholder')" class="phone" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item :label="$t('preManifest.phone')" prop="shipper.contactPhone" label-width="100px" :rules="[{ required: true, message: $t('common.placeholder'), trigger: 'blur' }]">
              <el-input v-model="dataForm.shipper.contactPhone" :disabled="preview" oninput="value=value.replace(/[^\d]/g,'')" :placeholder="$t('preManifest.phonePlaceholder')" class="phone" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item :label="$t('preManifest.fax')" prop="shipper.telex" label-width="100px">
              <el-input v-model="dataForm.shipper.telex" :disabled="preview" oninput="value=value.replace(/[^\d]/g,'')" :placeholder="$t('preManifest.faxPlaceholder')" class="phone" style="width: 200px"></el-input>
            </el-form-item>
          </li>
        </ul>
      </div>
      <!--        收货人-->
      <div class="billForm">
        <ul style="width: 100%">
          <li class="title"><span>*</span>{{ $t('preManifest.consignee') }}</li>
          <li>
            <el-form-item :label="$t('preManifest.countryCode')" prop="consignee.countryCode" label-width="100px" :rules="[{ required: true, message: $t('common.placeholder'), trigger: 'change' },]">
              <el-select filterable v-model="dataForm.consignee.countryCode" :disabled="preview" :placeholder="$t('common.placeholder')" style="width: 100px" @change="countryCodeChange('consignee')">
                <el-option
                  v-for="(item,index) in countryOptions"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('preManifest.code')" prop="consignee.memberCode" label-width="50px" :rules="[{ required: true, message: $t('common.placeholder'), trigger: 'change' },]">
              <el-select filterable v-model="dataForm.consignee.memberCode" :disabled="preview" :placeholder="$t('common.placeholder')" style="width: 100px" >
                <el-option
                  v-for="(item,index) in customerOptions[dataForm.consignee.countryCode]"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="consignee.memberText" label-width="100px" :rules="[{ required: true, message: $t('common.placeholder'), trigger: 'blur' },]">
              <el-input v-model="dataForm.consignee.memberText" :disabled="preview" maxlength="255" style="width: 180px"></el-input>
            </el-form-item>
          </li>
          <li>
            <el-form-item :label="$t('preManifest.name')" prop="consignee.contact" label-width="100px" :rules="[{ required: true, message: $t('common.placeholder'), trigger: 'blur' },]">
              <el-input v-model="dataForm.consignee.contact" :disabled="preview" @blur="contact($event,'consignee','contact')" maxlength="200" :placeholder="$t('preManifest.companyNamePlaceholder')" style="width: 800px"></el-input>
            </el-form-item>

          </li>
          <li>
            <el-form-item :label="$t('preManifest.address')" prop="consignee.street" label-width="100px" :rules="[{ required: true, message: $t('common.placeholder'), trigger: 'blur' },]">
              <el-input v-model="dataForm.consignee.street" :disabled="preview" @blur="contact($event,'consignee','street')" min maxlength="200" :placeholder="$t('preManifest.addressPlaceholder')" style="width: 800px"></el-input>
            </el-form-item>
          </li>
          <li>
            <!--            :rules="[{ required: true, message: this.$t('common.placeholder'), trigger: 'blur' }, {validator: this.validateEmail, trigger: 'blur'}]"-->
            <el-form-item :label="$t('preManifest.email')" prop="consignee.email" label-width="100px" >
              <el-input v-model="dataForm.consignee.email" :disabled="preview" :placeholder="$t('preManifest.emailPlaceholder')" class="phone" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item :label="$t('preManifest.phone')" prop="consignee.contactPhone" label-width="100px" :rules="[{ required: true, message: this.$t('common.placeholder'), trigger: 'blur' }]">
              <el-input v-model="dataForm.consignee.contactPhone" :disabled="preview" oninput="value=value.replace(/[^\d]/g,'')" :placeholder="$t('preManifest.phonePlaceholder')" class="phone" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item :label="$t('preManifest.fax')" prop="consignee.telex" label-width="100px">
              <el-input v-model="dataForm.consignee.telex" :disabled="preview" oninput="value=value.replace(/[^\d]/g,'')" :placeholder="$t('preManifest.faxPlaceholder')" class="phone" style="width: 200px"></el-input>
            </el-form-item>
          </li>
          <li>
            <el-form-item :label="$t('preManifest.specificContact')" prop="consignee.realContact" label-width="100px" :rules="[{ required: true, message: $t('common.placeholder'), trigger: 'blur' },]">
              <el-input v-model="dataForm.consignee.realContact" :disabled="preview" :placeholder="$t('preManifest.specificContactPlaceholder')" class="phone" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item :label="$t('preManifest.contactEmail')" prop="consignee.realEmail" label-width="100px" >
              <el-input v-model="dataForm.consignee.realEmail" :disabled="preview"  :placeholder="$t('preManifest.contactEmailPlaceholder')" class="phone" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item :label="$t('preManifest.contactTelephone')" prop="consignee.realContactPhone" label-width="100px" :rules="[{ required: true, message: this.$t('common.placeholder'), trigger: 'blur' }]">
              <el-input v-model="dataForm.consignee.realContactPhone" :disabled="preview" oninput="value=value.replace(/[^\d]/g,'')" :placeholder="$t('preManifest.contactTelephonePlaceholder')" class="phone" style="width: 200px"></el-input>
            </el-form-item>
          </li>
        </ul>
      </div>
      <!--        通知人-->
      <div class="billForm">
        <ul style="width: 100%">
          <li class="title">
            <span>*</span>{{ $t('preManifest.notifier') }}
            <el-button size="small" @click="copyConsignee" :disabled="preview">{{ $t('preManifest.copyConsignee') }}</el-button>
          </li>
          <li>
            <el-form-item :label="$t('preManifest.countryCode')" prop="notify.countryCode" label-width="100px" :rules="[{ required: true, message: $t('common.placeholder'), trigger: 'change' },]">
              <el-select filterable v-model="dataForm.notify.countryCode" :disabled="preview" :placeholder="$t('common.placeholder')" style="width: 100px" @change="countryCodeChange('notify')">
                <el-option
                  v-for="(item,index) in countryOptions"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('preManifest.code')" prop="notify.memberCode" label-width="50px" :rules="[{ required: true, message: $t('common.placeholder'), trigger: 'change' },]">
              <el-select filterable v-model="dataForm.notify.memberCode" :disabled="preview" :placeholder="$t('common.placeholder')" style="width: 100px" >
                <el-option
                  v-for="(item,index) in customerOptions[dataForm.notify.countryCode]"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="notify.memberText" label-width="100px" :rules="[{ required: true, message: $t('common.placeholder'), trigger: 'blur' },]">
              <el-input v-model="dataForm.notify.memberText" :disabled="preview" maxlength="255" style="width: 180px"></el-input>
            </el-form-item>
          </li>
          <li>
            <el-form-item :label="$t('preManifest.name')" prop="notify.contact" label-width="100px" :rules="[{ required: true, message: $t('common.placeholder'), trigger: 'blur' },]">
              <el-input v-model="dataForm.notify.contact" :disabled="preview" @blur="contact($event,'notify','contact')" maxlength="200" :placeholder="$t('preManifest.companyNamePlaceholder')" style="width: 800px"></el-input>
            </el-form-item>

          </li>
          <li>
            <el-form-item :label="$t('preManifest.address')" prop="notify.street" label-width="100px" :rules="[{ required: true, message: $t('common.placeholder'), trigger: 'blur' },]">
              <el-input v-model="dataForm.notify.street" :disabled="preview" @blur="contact($event,'notify','street')" min maxlength="200" :placeholder="$t('preManifest.addressPlaceholder')" style="width: 800px"></el-input>
            </el-form-item>
          </li>
          <li>
            <el-form-item :label="$t('preManifest.email')" prop="notify.email" label-width="100px" >
              <el-input v-model="dataForm.notify.email" :disabled="preview" :placeholder="$t('preManifest.emailPlaceholder')" class="phone" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item :label="$t('preManifest.phone')" prop="notify.contactPhone" label-width="100px" :rules="[{ required: true, message: this.$t('common.placeholder'), trigger: 'blur' }]">
              <el-input v-model="dataForm.notify.contactPhone" :disabled="preview" oninput="value=value.replace(/[^\d]/g,'')" :placeholder="$t('preManifest.phonePlaceholder')" class="phone" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item :label="$t('preManifest.fax')" prop="notify.telex" label-width="100px">
              <el-input v-model="dataForm.notify.telex" :disabled="preview" oninput="value=value.replace(/[^\d]/g,'')" :placeholder="$t('preManifest.faxPlaceholder')" class="phone" style="width: 200px"></el-input>
            </el-form-item>
          </li>
        </ul>
      </div>
    </el-form>
    <div class="footer">
      <el-button @click="golsit">返回列表</el-button>
      <el-button type="primary" @click="saveHouseBl()" :disabled="preview">提交</el-button>
    </div>
    <el-dialog :title="$t('preManifest.getBoxNumber')" :visible.sync="dialogVisible" :close-on-click-modal="false" :before-close="cancel" width="30%">
      <el-form :inline="true" :model="caseNumberAcquisition" @submit.native.prevent ref="caseNumberAcquisition" class="tree">
        <el-form-item :label="$t('preManifest.boxNumberSelection')" prop="email">
          <!--            :default-expand-all="true"-->
          <el-tree
            style="height: 300px; width: 300px; overflow: auto"
            ref="tree"
            :data="treeData"
            node-key="value"
            :props="defaultProps"
            :default-checked-keys="defaultKeys"
BlList
            show-checkbox
            @check-change="handleCheckChange"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirm">{{$t('common.confirmBtn')}}</el-button>
          <el-button @click="cancel">{{$t('common.cancelBtn')}}</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import lodash from 'lodash'
import {validContainerNo, validContainerNo53HC, validEmail} from "@/utils/validate"
import {
  manifestContainerCargoListApi,
  manifestContainersListApi, manifestDetailApi, manifestIsFullApi,
  manifestOrderInfoListApi, saveManifestApi, updateManifestApi
} from "@/api/charteredBoat/preManifest"
import { getContainerTypeList } from '@/api/seaExport'
import {getDropdownlistApi} from "@/api/OverseasWarehouse/goodsManager"

export default {
  name: 'PreManifestInfo',
  data() {
    return {
      loading: true,
      inviteLoading: false,
      id: this.$route.query.id,
      type: this.$route.query.type,
      preview: !!this.$route.query.type,
      multipleSelection: {},
      dialogVisible: false,
      caseNumberAcquisition: {},
      packageTypeOption: [], // 包装技术数据
      memberId: this.$route.query.memberId,
      dataForm: {
        soNo: this.$route.query.soNo,
        memberId: this.$route.query.memberId,
        vessel: null,
        voyage: null,
        podName: null,
        polCode: null,
        paymentMode: null,
        houseDTOList: [
          {
            hblNo: null,
            containerCargoDTOList: [
              {
                containerNo: null,
                sealNo: null,
                containerType: null,
                isFull: null,
                hsCode: null,
                cargoDesc: null,
                quantity: null,
                packageType: null,
                weight: null,
                volume: null,
                marks: null,
                containerTypeDisabled: false
              }
            ]
          }
        ],
        shipper: {
          countryCode: 'CN'
        }, // 发货人
        consignee: {}, // 收货人
        notify: { } // 通知方

      },
      treeData: [],
      defaultProps: {
        children: 'containers',
        label: 'label'
      },
      defaultKeys: [],
      treeNowIndex: null,
      countryOptions: ['CN', 'US', 'GB', 'BE', 'DE', 'MX', 'BR', 'AE', 'NL', 'PL', 'HK', 'CL', 'EC'],
      customerOptions: {'CN': ['USCI', 'OC', 'ID', 'PASSPORT', '8888', '9999'],
        'US': ['ENI', 'CIK', 'ID', 'PASSPORT', '8888', '9999'],
        'GB': ['COMPANY NUMBER', 'VAT NUMBER', 'ID', 'PASSPORT', '8888', '9999'],
        'BE': ['EUROPEAN VAT NUMBER', 'BELGIAN COMPANY NUMBER', 'ID', 'PASSPORT', '8888', '9999'],
        'DE': ['EUROPEAN VAT NUMBER', 'UST-IDNR.', 'ID', 'PASSPORT', '8888', '9999'],
        'MX': ['RFC', 'CIK', 'ID', 'PASSPORT', '8888', '9999'],
        'BR': ['CNPJ', 'NIRE', 'ID', 'PASSPORT', '8888', '9999'],
        'AE': ['COMMERCIAL REGISTER NUMBER', 'CHAMBER OF COMMERCE NUMBER', 'ID', 'PASSPORT', '8888', '9999'],
        'NL': ['EUROPEAN VAT NUMBER', 'COC-NUMBER', 'ID', 'PASSPORT', '8888', '9999'],
        'PL': ['NCR NUMBER', 'REGON NUMBER'],
        'HK': ['TRADE REGISTER NUMBER'],
        'CL': ['RUT'],
        'EC': ['RUC']
      },
      vm: this,
      VUE_APP_BASE_API: '',
      dataFormRule: {
        issueBlFlag: [{ required: true, message: this.$t('preManifest.whetherCommissionPlaceholder'), trigger: 'change' }]
      },
      essentialHide: true,
      containerTypeList: [],
      popoverVisible: false

    }
  },
  async created() {
    this.loading = true
    getDropdownlistApi({termCode: 'PACKTYPE'}).then(res => {
      this.fullscreenLoading = false
      if (res.ok) {
        this.packageTypeOption = res.content
      }
    })
    let sailingId
    if (this.dataForm.soNo) {
      const resOrderInfo = await manifestOrderInfoListApi({soNo: this.dataForm.soNo})
      if (resOrderInfo.ok) {
        this.dataForm.houseDTOList[0].hblNo = this.dataForm.soNo
        sailingId = resOrderInfo.content.sailingId;
        ({vessel: this.dataForm.vessel, voyage: this.dataForm.voyage, podName: this.dataForm.podName,
          podId: this.dataForm.podId, polId: this.dataForm.polId, sailingId: this.dataForm.sailingId, polCode: this.dataForm.polCode
        } = resOrderInfo.content)
      }
    }
    if (this.id) {
      const resDetail = await manifestDetailApi(this.id)
      if (resDetail.ok) {
        sailingId = resDetail.content.sailingId
        this.dataForm = resDetail.content
        console.log(this.dataForm)
        this.$set(this.dataForm, 'consignee', JSON.parse(resDetail.content.consignee))
        this.$set(this.dataForm, 'notify', JSON.parse(resDetail.content.notify))
        this.$set(this.dataForm, 'shipper', JSON.parse(resDetail.content.shipper))
        this.dataForm.memberId = this.$route.query.memberId
      }
    }

    const resContainers = await manifestContainersListApi({sailingId: sailingId, memberId: this.memberId})
    if (resContainers.ok) {
      this.treeData = resContainers.content
    }
    const resConDrop = await getContainerTypeList()
    if (resConDrop && resConDrop.ok) {
      this.containerTypeList = resConDrop.content
    }

    this.loading = false

  },
  computed: {
    ...mapState({
      memberInfo: state => state.user.memberInfo
    })
  },
  methods: {
    countryCodeChange(val) {
      this.$set(this.dataForm[val], 'memberCode', '')
    },
    validateEmail(rule, value, callback) {
      if (!validEmail(value)) {
        callback(new Error(this.$t('preManifest.emailError')))
      } else {
        callback()
      }
    },
    validateContainerNo(item) { // 验证箱号
      let activeRules = [
        { required: true, message: this.$t('common.placeholder'), trigger: 'blur' },
        {
        validator: (rule, value, callback) => {
          if (item === '53HC' ? !validContainerNo53HC(value) : !validContainerNo(value)) {
            callback(new Error(this.$t('preManifest.containerNoError')))
          } else {
            callback()
          }
        }
        }]
      return activeRules
    },
    containerTypeChange(prop) {
      this.$nextTick(() => {
        this.$refs.dataForm.validateField(prop)
      })
    },
    implementValidateContainerNo(type, prop) {
      if (type) {
        this.containerTypeChange(prop)
      }
    },
    handleSelectionChange(val, index) {
      this.$set(this.multipleSelection, index, val)
    },
    contact(e, val1, val2) {
      // eslint-disable-next-line no-control-regex
      const val = e.target.value.replace(/[^\x00-\xff]/g, '').toUpperCase()
      this.$set(this.dataForm[val1], val2, val)
    },
    addSplit() { // 添加分单
      const index = this.dataForm.houseDTOList.length
      let strArr = []
      for (let i = parseInt(index / 26) + 1; i > 0 ; i--) {
        if (parseInt(index / 26) > 0 && i !== parseInt(index / 26) + 1) {
          strArr[i - 1] = 'A'
        } else {
          strArr[i - 1] = `${(index % 26 + 10).toString(36).toUpperCase()}`
        }
      }
      if (index === 1) {
        this.dataForm.houseDTOList[0].hblNo = `${this.dataForm.soNo}A`
      }
      let hblNo = `${this.dataForm.soNo}${strArr.join('')}`
      this.dataForm.houseDTOList.push({
        hblNo: hblNo,
        containerCargoDTOList: [
          {
            containerNo: null,
            sealNo: null,
            containerType: null,
            isFull: null,
            hsCode: null,
            cargoDesc: null,
            quantity: null,
            packageType: null,
            weight: null,
            volume: null,
            marks: null,
            containerTypeDisabled: false
          }
        ]
      })
    },
    deleteSplit(n) {
      this.dataForm.houseDTOList.splice(n, 1)
      if (this.dataForm.houseDTOList.length === 1) {
        this.dataForm.houseDTOList[0].hblNo = this.dataForm.soNo
        return
      }
      this.dataForm.houseDTOList.forEach((item, index) => {
        let strArr = []
        for (let i = parseInt(index / 26) + 1; i > 0 ; i--) {
          if (parseInt(index / 26) > 0 && i !== parseInt(index / 26) + 1) {
            strArr[i - 1] = 'A'
          } else {
            strArr[i - 1] = `${(index % 26 + 10).toString(36).toUpperCase()}`
          }
        }
        let hblNo = `${this.dataForm.soNo}${strArr.join('')}`
        item.hblNo = hblNo
      })
    },
    addCargoDetails(index) { // 添加明细
      this.dataForm.houseDTOList[index].containerCargoDTOList.push({})
    },
    deleteDetails(index) { // 删除物料
      if (this.multipleSelection[index].length === this.dataForm.houseDTOList[index].containerCargoDTOList.length) {
        this.$message.warning('请至少保留一条物料信息！')
        return
      }
      if (this.multipleSelection[index]) {
        this.multipleSelection[index].forEach((item, k) => {
          this.dataForm.houseDTOList[index].containerCargoDTOList.forEach((itemI, indexI) => {
            if (item === itemI) {
              this.dataForm.houseDTOList[index].containerCargoDTOList.splice(indexI, 1)
            }
          })
        })
      }
      this.$set(this.multipleSelection, index, [])
    },
    copy(index) {
      let arr = lodash.cloneDeep(this.multipleSelection[index])
      this.dataForm.houseDTOList[index].containerCargoDTOList.push(...arr)
    },
    empty(index) { // 清空
      this.$confirm('是否清空当前分单的全部明细，清空后无法恢复，是否继续？')
        .then(_ => {
          // done();
          this.dataForm.houseDTOList[index].containerCargoDTOList.forEach((item, k) => {
            Object.keys(item).forEach(val => {
              item[val] = ''
            })
          })
        })
        .catch(_ => {})
    },
    getBoxNumber(index) {
      this.dialogVisible = true
      this.treeNowIndex = index
    },
    handleCheckChange(data, checked, indeterminate) {
      // console.log(this.$refs.tree.getCheckedKeys())
      // console.log(this.$refs.tree.getHalfCheckedKeys())
      // if (data.supportId) {
      //   data.releaseFlag = checked
      // }
    },
    copyConsignee() {
      this.dataForm.notify = lodash.cloneDeep(this.dataForm.consignee)
    },
    async getMaterialDetails(row, index, $index) { // 手输箱号 获取详情 row.containerNo
      if (row.containerNo) {
        let arr = Object.values(row).filter(function(item) {
          return item
        })
        if (arr.length === 1) {
          this.getManifestContainerCargoListApi(row.containerNo, this.dataForm.sailingId, 'manual', index, $index, row)
        } else {
          this.loading = true
          const paramsIsFull = {containerNo: row.containerNo, sailingId: this.dataForm.sailingId, id: this.id, memberId: this.memberId}
          const isFull = await manifestIsFullApi(paramsIsFull)
          this.loading = false
          if (isFull.ok && isFull.isFull === false) {
            row.isFull = isFull.content
          }
          this.$nextTick(() => {
            this.containerNoRepeat()
          })
        }
      }
    },
    async confirm() { // 查询箱子的物料信息
      const treeChecked = lodash.compact(this.$refs.tree.getCheckedKeys())
      let empty = 0
      this.dataForm.houseDTOList[this.treeNowIndex].containerCargoDTOList.some((val, index) => {
        console.log(index)
        let arr = Object.values(val).filter(function(item) {
          return item
        })
        if (arr.length === 0) {
          empty++
        } else {
          return true
        }
      })
      if (empty > 0) {
        this.dataForm.houseDTOList[this.treeNowIndex].containerCargoDTOList.splice(0, empty)
      }
      if (treeChecked.length > 0) {
        this.getManifestContainerCargoListApi(treeChecked.join(','), this.dataForm.sailingId)
      }
      this.cancel()
    },
    async getManifestContainerCargoListApi(containerNo, sailingId, type, index, $index, row) { // 查询箱子的物料信息
      this.loading = true
      const params = {containerNos: containerNo, sailingId: this.dataForm.sailingId, id: this.id, memberId: this.memberId}
      const res = await manifestContainerCargoListApi(params)
      this.loading = false
      if (res.ok) {
        if (res.content.length === 0 && type === 'manual') { // 手输箱号 并且没有物料信息 去查询是否拼单
          this.loading = true
          const paramsIsFull = {containerNo: containerNo, sailingId: this.dataForm.sailingId, id: this.id, memberId: this.memberId}
          const isFull = await manifestIsFullApi(paramsIsFull)
          this.loading = false
          if (isFull.ok && isFull.content === false) {
            this.$set(row, 'isFull', isFull.content)
          }
          this.containerNoRepeat()
          return
        }
        let cargoList = []
        let rowArr = {}
        res.content.map((item, index) => {
          rowArr = {
            containerNo: item.containerNo,
            sealNo: item.sealNo,
            containerType: item.containerType,
            isFull: item.isFull,
            hsCode: item.hsCode,
            cargoDesc: item.cargoDesc,
            quantity: item.quantity,
            packageType: item.packageType,
            weight: item.weight,
            volume: item.volume,
            marks: item.marks,
            containerTypeDisabled: !!item.containerType
          }
          cargoList.push(rowArr)
        })
        if (type === 'manual') {
          this.$set(this.dataForm.houseDTOList[index].containerCargoDTOList, $index, rowArr)
          this.dataForm.houseDTOList[index].containerCargoDTOList.splice($index, 1, ...cargoList)
        } else {
          this.dataForm.houseDTOList[this.treeNowIndex].containerCargoDTOList.push(...cargoList)
        }
        this.containerNoRepeat()
      }
    },
    containerNoRepeat() { // 判断当前箱号是否重复
      let containerNoArr = {}
      this.dataForm.houseDTOList.map((value, i) => {
        value.containerCargoDTOList.map((item, k) => {
          if (lodash.isArray(containerNoArr[item.containerNo])) {
            if (containerNoArr[item.containerNo].indexOf(i) === -1) {
              containerNoArr[item.containerNo].push(i)
            }
          } else {
            containerNoArr[item.containerNo] = [i]
          }
        })
      })
      Object.keys(containerNoArr).map(key => {
        this.dataForm.houseDTOList.map(value => {
          value.containerCargoDTOList.map(item => {
            if (containerNoArr[key].length > 1 && item.containerNo === key) {
              this.$set(item, 'isFull', false)
            }
          })
        })
      })
    },
    cancel() {
      this.$refs.tree.setCheckedKeys([])
      this.dialogVisible = false
    },
    golsit() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({name: 'PreManifestList'})
    },
    saveHouseBl() {
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          let containerNo = {}
          this.dataForm.houseDTOList.forEach(item => {
            item.containerCargoDTOList.forEach(val => {
              if (typeof containerNo[val.containerNo] == 'undefined') {
                containerNo[val.containerNo] = []
                containerNo[val.containerNo].push(val.containerType)
              } else {
                if (containerNo[val.containerNo][0] != val.containerType) {
                  containerNo[val.containerNo].push(val.containerType)
                }
              }
            })
          })
          let errorContainerNo = []
          Object.keys(containerNo).forEach(key => {
            if (containerNo[key].length > 1) {
              errorContainerNo.push(key)
            }
          })
          if (errorContainerNo.length > 0) {
            this.$message.error(`箱号 ${errorContainerNo.join(',')} 在当前页面中存在多种不同的箱型，请确认后再提交！`)
            return
          }
          this.loading = true
          const res = this.id ? await updateManifestApi(this.dataForm, this.id) : await saveManifestApi(this.dataForm)
          this.loading = false
          if (res.ok) {
            this.golsit()
          }
        } else {
          this.mixinsFormScrollIntoView()
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sys-right-inner-wrap{ padding: 20px; background: #fff}
.title{ font-family: 'Arial Negreta', 'Arial'; font-weight: 700; font-size: 18px; color: #333333; margin-bottom: 20px;}
.required{ color: red}
.dataTable{ margin-top: 20px;
  ::v-deep .el-form-item{ margin: 0}
}
.billForm {
  display: flex; flex-wrap: wrap;
  .title{
    font-family: 'Arial Negreta', 'Arial';
    font-weight: 700;
    font-size: 18px;
    color: #333333;
    margin-bottom: 20px;
    span{ color: red}
  }
  .phoneCon{
    display: flex; justify-content: space-between;
  }
  .phone{ width: 30%;}
}
.footer{line-height: 36px; justify-content: space-between; width: 90%; margin-top: 30px; text-align: right}
.sys-right-inner-wrap ::v-deep .el-table .cell{ overflow: initial;height: 50px;}
.tree ::v-deep .el-tree__empty-text{ top: 0;left: 0; top: 0; transform: translate(0,0); width: 100px;}
</style>
