<template>
  <div v-loading="loading" style="padding: 10px;" class="app-main-inner">
    <div class="operate-buttons" :class="fixed == true ? 'fixedBtn' :''" :style="{width:btnWidth+ 'px'}">
      <div class="operate-buttons-left">
        <el-button type="primary" plain size="small" @click="returnToList">{{ $t('sea.returnList') }}</el-button>
        <el-button v-if="isCopyAll" type="primary" size="small" @click="submit">{{ $t('sea.next') }}</el-button>
        <el-button v-else type="primary" size="small" @click="submit">{{ $t('sea.save') }}</el-button>
        <el-button plain size="small" @click="cancel">{{ $t('sea.cancel') }}</el-button>
        <span v-if="isValid" style="font-size: 14px; color: red; margin-left: 50px">
          {{ $t('sea.promptRequiredFields') }} {{ errorField.join('、') }} {{ $t('sea.promptRequiredFields2') }}
        </span>
      </div>
    </div>
    <el-form :inline="true" :model="dataForm" @submit.native.prevent ref="dataForm">
      <div class="box">
        <div class="box_title">{{ $t('sea.customerInformation') }}</div>
        <div class="box_child">
          <div class="flex-bet" style="width: 1000px">
            <el-form-item :label="$t('sea.requester')" prop="customerId" :rules="[{ required: true, message: $t('sea.placeholder')+$t('sea.requester'), trigger: 'blur' },]">
              <type-select v-model="dataForm.customerId" type="customer" clearable :defaultDisplay="dataForm.customerName" :disabled="isCopyAll" @selected="setCustomerInfo" :requestParams="{businessType:'SEA_EXPORT'}"/>
            </el-form-item>
            <el-form-item :label="$t('sea.customerLevel')" prop="customerRate" size="mini" class="box25">
              {{ dataForm.customerRate }}
            </el-form-item>
            <el-form-item label="" prop="" size="mini" class="box25">
            </el-form-item>
          </div>
          <div class="flex-bet" style="width:  1000px">
            <el-form-item :label="$t('sea.customerContact')" prop="contactCnName" size="mini">
              <el-select v-model="dataForm.customerContact" :placeholder="$t('sea.placeholder')" @change="contactChange" :disabled="isCopyAll">
                <el-option v-for="(item, index) in contactList" :label="item.contact" :value="item.id" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('sea.email')" prop="customerEmail" size="mini" class="box25">
              {{ dataForm.customerEmail }}
            </el-form-item>
            <el-form-item :label="$t('sea.phone')" prop="customerTel" size="mini" class="box25">
              {{ dataForm.customerTel }}
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="box">
        <div class="box_title">{{ $t('sea.entrustmentInformation') }}</div>
        <div class="box_child" style="overflow: auto;">
          <div class="flex-bet" style=" flex-wrap:nowrap;justify-content: space-around;">
            <div style="width: 430px">
              <!--              收货地-->
              <el-form-item :label="$t('sea.placeOfReceipt')" prop="receiptCode" size="mini">
                <SeaCitySelect class="w178" v-model="dataForm.receiptCode"></SeaCitySelect>
              </el-form-item>
              <el-form-item :label="$t('sea.pol')" prop="polCode" :rules="[{ required: true, message: $t('sea.placeholder')+$t('sea.pol'), trigger: 'change' },]">
                <cargo-advance-select
                  ref="polCodeSelect"
                  :url="url.qf.seaport"
                  :default-value="dataForm.pol"
                  :headers="['英文名称','五字码','中文名称']"
                  :fields="['englishName','code5','chineseName']"
                  tag-value="code5"
                  tag-name="enPortName"
                  :placeholder="$t('sea.polHold')"
                  remote
                  @parentCallBack="(data)=>{
                    dataForm.polCode = data.code5
                    dataForm.pol = data.englishName
                  }"
                />
              </el-form-item>
              <el-form-item :label="$t('sea.pod')" prop="podCode" :rules="[{ required: true, message: $t('sea.placeholder')+$t('sea.pod'), trigger: 'change' },]">
                <cargo-advance-select
                  ref="podCodeSelect"
                  :url="url.qf.seaport"
                  :default-value="dataForm.pod"
                  :headers="['英文名称','五字码','中文名称']"
                  :fields="['englishName','code5','chineseName']"
                  tag-value="code5"
                  tag-name="enPortName"
                  :placeholder="$t('sea.podHold')"
                  remote
                  @parentCallBack="(data)=>{
                  dataForm.podCode=data.code5
                  dataForm.pod=data.englishName
                }"
                />
              </el-form-item>
              <!--              交货地-->
              <el-form-item :label="$t('sea.placeOfDelivery')" prop="destinationCode" size="mini">
                <SeaCitySelect v-model="dataForm.destinationCode" :type="2" class="w178"></SeaCitySelect>
              </el-form-item>
              <!--              运输条款-->
              <el-form-item :label="$t('sea.polTransportTerm')" prop="transportTermCode" size="mini">
                <el-select v-model="dataForm.transportTermCode" @change="transportTermChange" style="width: 178px">
                  <el-option v-for="(item, index) in transportTermList" :label="item.englishName" :value="item.code" :key="index"></el-option>
                </el-select>
                <el-checkbox v-if="dataForm.transportTermCode.indexOf('DOOR') > -1" style="display: block" v-model="dataForm.nonShippingServiceFlag">{{ $t('sea.nonShippingServiceFlag') }}
                </el-checkbox>
              </el-form-item>
              <el-form-item :label="$t('sea.transshipmentInBatches')" prop="contactCnName" size="mini">
                <el-checkbox v-model="dataForm.batchFlag">{{ $t('sea.acceptBatches') }}
                </el-checkbox>
                <el-checkbox v-model="dataForm.transitFlag" style="margin-left: 10px">
                  {{ $t('sea.acceptTransshipment') }}
                </el-checkbox>
              </el-form-item>
              <!--                增值服务-->
              <el-form-item :label="$t('sea.valueAddedServices')" class="valueAddedServices" prop="contactCnName"
                            size="mini" style="max-height: 200px; overflow: auto">
                <el-checkbox-group v-model="exportServiceListCode" class="added_services"
                                   @change="exportServiceListChange">
                  <el-checkbox v-for="item in dmnTermItemList" :key="item.code" :label="item.code">{{
                      item.chineseName
                    }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
            <!--            船司-->
            <div style="width: 430px">
              <el-form-item :label="$t('sea.shipBoss')" prop="carrierId"
                            :rules="[ { required: true, message: $t('sea.placeholder')+$t('sea.shipBoss'), trigger: 'blur' } ]">
                <cargo-advance-select
                  :url="url.omc.shippingCompanylist"
                  :default-value="dataForm.carrierName"
                  tag-value="id"
                  tag-name="chineseName"
                  :headers="['中文简称','英文简称',]"
                  :fields="['chineseShortname','englishShortname']"
                  :options-width="'400px'"
                  remote
                  style="width: 178px"
                  :clearable="false"
                  :placeholder="$t('sea.shipBossHold')"
                  @parentCallBack="data=>{
                    dataForm.carrierId=data.id
                    dataForm.carrierName=data.englishShortname
                    selected(data)
                  }"
                />
              </el-form-item>
              <!--              开航日期-->
              <el-form-item :label="$t('sea.sailingDate')" prop="etd"
                            :rules="[ { required: true, message:$t('sea.placeholder')+$t('sea.sailingDate')} ]">
                <!--                <el-date-picker v-model="dataForm.etd" size="mini" type="date" :picker-options="pickerOptions" :placeholder="$t('sea.SelectSailingDateHold')"/>-->
                <CommonPicker
                  v-model="dataForm.etd"
                  parent-class="w178"
                  size="mini"
                  picker-format="yyyy-MM-dd"
                  pikcer-type="date"
                  :clearable="false"
                  :placeholder="$t('sea.SelectSailingDateHold')"
                />
              </el-form-item>
              <!-- ETA-->
              <el-form-item :label="$t('sea.eta')" prop="eta" :rules="[ { required: true, message:$t('sea.placeholder')+$t('sea.eta')} ]">
                <CommonPicker
                  v-model="dataForm.eta"
                  parent-class="w178"
                  size="mini"
                  picker-format="yyyy-MM-dd"
                  pikcer-type="date"
                  :clearable="false"
                />
              </el-form-item>
              <el-form-item :label="$t('sea.shipName')" prop="vessel" size="mini" style="position:relative;"
                            :rules="[ { required: true,message:$t('sea.pleaseEnter')+$t('sea.shipName'),trigger: 'change'} ]">
                <el-autocomplete
                  v-trim
                  class="w178"
                  v-model="dataForm.vessel"
                  :fetch-suggestions="querySearch"
                  :placeholder="$t('sea.shipNameHold')"
                  @select="handleSelect"
                  :disabled="dataForm.TBA"
                ></el-autocomplete>
                <el-checkbox v-model="dataForm.TBA" @change="TBAChange"
                             style="position: absolute; right: -65px; top: 0">TBA
                </el-checkbox>
              </el-form-item>
              <el-form-item :label="$t('sea.voyage')" prop="voyage" size="mini">
                <el-input :disabled="dataForm.TBA" v-model="dataForm.voyage" v-trim
                          :placeholder="$t('sea.placeholder')" class="w178"></el-input>

              </el-form-item>
              <el-form-item :label="$t('sea.cargoType')" prop="goodsTypeCode" size="mini"
                            :rules="[ { required: true,message:$t('sea.placeholder')+$t('sea.cargoType'),trigger: 'change'} ]">
                <el-select v-model="dataForm.goodsTypeCode" :placeholder="$t('sea.placeholder')"
                           filterable @change="dataForm.goodsType = dataForm.goodsTypeCode">
                  <el-option v-for="(item, index) in cargoTypeList" :label="item" :value="item"
                             :key="index"></el-option>
                </el-select>
              </el-form-item>
              <!--              贸易条款-->
              <el-form-item :label="$t('sea.tradeTerms')" prop="tradeTermCode" size="mini">
                <el-select v-model="dataForm.tradeTermCode" :placeholder="$t('sea.placeholder')"
                           filterable @change="tradeTermChange">
                  <el-option v-for="item in tradeTermsList" :label="item.englishName" :value="item.code"
                             :key="item.id"></el-option>
                </el-select>
              </el-form-item>
              <!--            派送地址-->
              <el-form-item v-if="dataForm.tradeTermCode === 'DDP' || (dataForm.businessTag.fullLinkFlag || dataForm.businessTag.fbaFbwFlag || dataForm.businessTag.trailerFlag)" :label="$t('sea.deliveryAddress')" prop="deliveryAddress"  :rules="[required]">
                <el-input v-model="dataForm.deliveryAddress" size="mini" maxlength="1000" style="width: 180px"/>
              </el-form-item>

              <el-form-item :label="$t('sea.businessTag')" prop="ovlFirstLegFlag" size="mini" class="businessTag">
                <div style="width: 330px" class="businessTagVal">
                  <!--  -->
                  <el-checkbox-group v-model="businessTagVal" @change="businessTagChange">
                    <el-checkbox label="ovlFirstLegFlag" style="margin-top: 7px;"  :disabled="businessTagVal.length > 0 && !businessTagVal.includes('ovlFirstLegFlag')">{{ $t('sea.overseasPosition') }}</el-checkbox>
                    <el-checkbox label="fullLinkFlag"  :disabled="businessTagVal.length > 0 && !businessTagVal.includes('fullLinkFlag')">{{ $t('sea.fullLink') }}</el-checkbox>
                    <el-checkbox label="fbaFbwFlag"  :disabled="businessTagVal.length > 0 && !businessTagVal.includes('fbaFbwFlag')">FBA&FBW</el-checkbox>
                    <el-checkbox label="seaCollectionFlag"  :disabled="businessTagVal.length > 0 && !businessTagVal.includes('seaCollectionFlag')">{{ $t('sea.seaCollection') }}</el-checkbox>
                    <el-checkbox label="onlyPodServiceFlag"  :disabled="businessTagVal.length > 0 && !businessTagVal.includes('onlyPodServiceFlag')">{{ $t('sea.destinationServiceOnly') }}</el-checkbox>
                  </el-checkbox-group>
                  <div>
                    <el-checkbox v-if="businessTagVal.includes('onlyPodServiceFlag') " v-model="dataForm.businessTag.customsClearanceFlag">{{ $t('sea.customsClearance') }}
                    </el-checkbox>
                    <el-checkbox v-if="businessTagVal.includes('onlyPodServiceFlag')" v-model="dataForm.businessTag.trailerFlag">{{ $t('sea.trailer') }}</el-checkbox>
                  </div>
                </div>

              </el-form-item>
            </div>
            <!--            箱型/箱量/毛重-->
            <div>
              <div class="flex-bet">
                  <div v-for="(item,index) in dataForm.containerList" :key="index" class="container_list">
                    <el-form-item :label="$t('sea.boxTypeArr')" :prop="'containerList.' + index + '.typeCode'"
                                  size="mini"
                                  :rules="[{ required: true, message: $t('sea.placeholder')+$t('sea.boxTypeArr'), trigger: 'change' },]">
                      <!--                      <el-select v-model="item.typeCode" :filter-method="dataFilter" filterable size="mini" @change="ContainerTypesChange($event,item)" style="width: 85px">-->
                      <!--                        <el-option v-for="(opt,index) in cntrOpts2" :key="index" :label="opt.englishName" :value="opt.englishName" />-->
                      <!--                      </el-select>-->

                      <ContainerSelect @change="ContainerTypesChange($event,item,index)" :itemObj="item"
                                       style="width: 85px"></ContainerSelect>

                    </el-form-item>
                    <span class="connector">X</span>
                    <el-form-item label="" :prop="'containerList.' + index + '.ctnrNum'" size="mini" style="width: 80px"
                                  :rules="[{ required: true, message:  $t('sea.placeholder')+$t('sea.boxTypeArr'), trigger: 'change' },]">
                      <el-input v-trim v-model="item.ctnrNum" oninput="if(value){value=value.replace(/[^\d]/g,'')} if(value<=0){value=''} if(value>299){value=299}" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="SOC" :prop="'containerList.' + index + '.ownerType'" size="mini" class="soc">
                      <el-checkbox v-model="isOwnerType" @change="item.ownerType = isOwnerType? 1 : 2"></el-checkbox>
                    </el-form-item>
                    <el-form-item label="" :prop="'containerList.' + index + '.weight'" size="mini" style="width: 56px"
                                  :rules="[{ required: true, message:  $t('sea.placeholder')+$t('sea.boxTypeArr'), trigger: 'change' },{validator:checkNumber,}]">
                      <el-input v-trim v-model="item.weight" v-input-limit="[5,0]" placeholder="KGS"
                                style="width: 67px"></el-input>
                    </el-form-item>
                    <i v-show="dataForm.containerList.length<5" class="icon el-icon-circle-plus blue"
                       @click="addContainerType"></i>
                    <i v-show="dataForm.containerList.length >1" class="icon el-icon-remove red"
                       @click="delContainerType(index)"></i>
                  </div>
              </div>
<!--              运输方式-->
              <el-form-item :label="$t('sea.shippingMethod')" prop="transportMode" size="mini" class="shipping_method" :rules="[ { required: true,message:$t('sea.placeholder')+$t('sea.shippingMethod'),trigger: 'change'} ]">
                <el-select v-model="dataForm.transportMode">
                  <el-option label="FCL" :value="1"></el-option>
                  <el-option label="LCL" :value="2"></el-option>
                </el-select>
              </el-form-item>
              <!--                付款方式-->
              <el-form-item :label="$t('sea.payMethod')" prop="freightTermCode" size="mini"
                            :rules="[ { required: true,message:$t('sea.placeholder')+$t('sea.payMethod'),trigger: 'change'} ]"
                            class="shipping_method">
                <el-radio-group v-model="dataForm.freightTermCode" @change="freightTermChange">
                  <el-radio v-for="(item, index) in freightTermList" :label="item.code" :key="index">
                    {{ item.englishName }}
                  </el-radio>
                  <!--                    <el-radio label="PREPAID">PREPAID</el-radio>-->
                  <!--                    <el-radio label="COLLECT">COLLECT</el-radio>-->
                </el-radio-group>
              </el-form-item>
              <div>
                <el-form-item :label="$t('sea.billType')" prop="blSignType" size="mini"
                              :rules="[ { required: true,message:$t('sea.placeholder')+$t('sea.billType'),trigger: 'change'} ]"
                              class="shipping_method">
                  <el-radio-group v-model="dataForm.blSignType">
                    <el-radio :label="1">MBL</el-radio>
                    <el-radio :label="2" style="padding-left: 10px">HBL</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <!--                签发方式-->
              <el-form-item :label="$t('sea.issuingMethod')" prop="releaseModeCode" size="mini"
                            :rules="[ { required: true,message:$t('sea.placeholder')+$t('sea.issuingMethod'),trigger: 'change'} ]"
                            class="issuing_method">
                <el-radio-group v-model="dataForm.releaseModeCode"
                                @change="releaseModeCodeChange">
                  <el-radio label="ORIGINAL">ORIGINAL</el-radio>
                  <el-radio label="SWB" v-if="dataForm.blSignType === 1">SWB</el-radio>
                  <el-radio label="TELEX RELEASE">TELEX RELEASE</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item :label="$t('sea.marks')" prop="goodsDesc" size="mini"
                            :rules="[ { required: true,message:$t('sea.pleaseEnter')+$t('sea.marks'),trigger: 'change'} ]"
                            class="issuing_method">
                <el-input v-trim v-model="dataForm.goodsDesc" maxlength="60" show-word-limit
                          :placeholder="$t('sea.marksHold')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('sea.orderRemarks')" prop="orderRemark" size="mini" class="issuing_method">
                <el-input v-trim v-model="dataForm.remarks"></el-input>
              </el-form-item>
            </div>

          </div>
        </div>
      </div>
      <div style="margin-bottom: 50px">
        <SeaExcelUpload
          ref="excelUpload"
          :can-be-upload="canBeUpload"
          @uploadSuccess="uploadSuccess"
          @uploadError="uploadError"
          @setUploadStatus="setUploadStatus"
          @removeFile="removeFile"
          @onPreview="onPreview"
          :fileList="fileList"
          :btnText="$t('sea.uploadEntrustment')"
          :styleText="styleText"
          :autoUpload="true"
        />
      </div>
    </el-form>
    <ElImageViewer v-show="fileimageShow" :on-close="fileimageClose" :url-list="filepaths"/>
  </div>

</template>

<script>
import URL from '@/api/urlTranslator'
import { downloadElectronicFileApi, getContainerTypeList, getDmnTermItemList, getJobNoList } from "@/api/seaExport"
import DataImport from '@/components/DataImport'
import cargoLimitedSelect from "@/components/Cargo/Common/cargoLimitedSelect"

import cargoAdvanceSelect from "@/components/Cargo/Common/cargoAdvanceSelect"
import lodash from 'lodash'
import {
	customerLinkmanMemberApi,
	exportAddApi,
	orderExportEditApi,
	seaOrderDetailApi,
	seaOrderSailingApi
} from "@/api/seaExportOrder"
import SeaExcelUpload from './components/order/seaExcelUpload'
import ElImageViewer from "element-ui/packages/image/src/image-viewer"
import { getToken } from "@/utils/auth"
import axios from "axios"
import SeaCitySelect from "@/views/cargo/v0/SeaExport/components/order/seaCitySelect"
import remoteSearchSelector from "@/views/cargo/v0/CharteredBoat/components/remoteSearchSelector"
import ContainerSelect from "@/views/cargo/v0/SeaExport/components/order/containerSelect";
import orderMixin from "./components/order/orderMixin";

export default {
	name: "SeaExportOrderCreate",
  mixins: [orderMixin],
	components: {
		cargoLimitedSelect,
		cargoAdvanceSelect,
		SeaExcelUpload,
		ElImageViewer,
		SeaCitySelect,
		remoteSearchSelector,
		ContainerSelect
	},
	data() {
		return {
			required: { required: true, message: this.$t('sea.pleaseEnter'), trigger: 'change' },
			loading: false,
			id: this.$route.query.id,
			type: this.$route.query.type,
			fixed: false,
			btnWidth: null,
			styleText: {
				width: '100%',
				'margin-left': 0
			},
			dataForm: {
				customerId: null,
				customerName: null,
				customerRate: null,
				settlementMode: null,
				customerContactId: null,
				customerContact: null,
				customerEmail: null,
				customerTel: null,
				receiptCode: null, // 收货地
				receipt: null, // 收货地描述
				polCode: null,
				podCode: null,
				destinationCode: null, // 交货地
				destination: null,
				transportTermCode: '',
				transportTerm: null,
				batchFlag: false, // 分批
				transitFlag: false, // 转船
				carrierId: null,
				carrierName: null,
				etd: '',
                eta: '',
				vessel: null,
				voyage: null,
				goodsTypeCode: 'GC', // 货物类型
				goodsType: 'GC',
				tradeTermCode: null, // 贸易条款
				tradeTerm: null,
				containerList: [{ // 箱信息
					typeCode: null, // 箱型代码
					englishName: null, // 英文简称
					chineseName: null, // 中文简称
					ctnrNum: null, // 箱量
					weight: null, // 毛重
					ownerType: 2 // 箱属类型：1 SOC 2 COC
				}], // 箱信息
				exportServiceList: [], // 增值服务
				blSignType: 1, // 提单类型
				freightTermCode: null, // 付款方式
				freightTerm: null,
				releaseModeCode: 'ORIGINAL', // 签发方式'
				releaseMode: 'ORIGINAL',
				goodsDesc: null, // 货物描述
				remarks: null, // 订舱备注
				files: [],
				businessTag: {}
			},
			receiptList: [{ receiptCode: 111, receipt: '收货地描述' }],
			destinationList: [{ receiptCode: 222, receipt: '交货地描述' }],
			contactList: [], // 客户联系人
			basicInfoModel: {},
			cntrOpts: [],
			cntrOpts2Copy: [],
			cntrOpts2: [
				//   {
				//   englishName: '20GP'
				// }, {
				//   englishName: '40HC'
				// }
			],
			dmnTermItemList: [], // 增值服务
			restaurantsVessel: [], // 船名匹配数据
			transportTermList: [], // 运输方式
			cargoTypeList: ['GC', 'RF', 'DG'], // 货物类型 默认选择GC
			tradeTermsList: ['EXW', 'FCA', 'FAS', 'FOB', 'CFR', 'CIF', 'CPT', 'CIP', 'DAT', 'DAP', 'DDP'], // 贸易条款
			freightTermList: [], // 付款方式,
			canBeUpload: false, // 托书
			exportServiceListCode: [],
			fileList: [],
			fileimageShow: false,
			filepaths: [],
			isOwnerType: false, // 箱属
			errorField: [], // 表单验证显示错误字段
			isValid: false,
			customerOptionsPorp: [],
			businessTagVal: []
		}
	},
	computed: {
		url() {
			return URL
		},
		isCopyAll() {
			return this.type === 'copyAll'
		}
	},
	watch: {
		dataForm: {
			deep: true,
			handler(val) {
				if (!this.isValid) {
					return
				}
				this.$refs.dataForm.validate(async (valid, object) => {
					if (!valid) {
						this.validateForm(object)
					}
				})
			}
		}
	},
	async created() {
		this.getSeaOrderSailingApi()
		if (this.id) {
			this.getSeaOrderDetail(this.id)
		} else {
			this.$set(this.dataForm, 'tradeTermCode', 'CFR')
		}
		this.getContainer()
		// 增值服务
		getDmnTermItemList({ termCode: 'SESERVICEITEM' }).then(res => {
			this.dmnTermItemList = res.content
		})
		// 运输方式
		getDmnTermItemList({ termCode: 'TRANSPORTITEM' }).then(res => {
			this.transportTermList = res.content
		})
		// 贸易条款
		getDmnTermItemList({ termCode: 'TRADEMODE' }).then(res => {
			this.tradeTermsList = res.content
		})
		// 付款方式
		getDmnTermItemList({ termCode: 'PAYMODE' }).then(res => {
			this.freightTermList = res.content
		})

	},

	mounted() {
		let dom = document.querySelector(".app-main")
		dom.addEventListener('scroll', e => this.fixedActiveBtn(e))
	},
	methods: {
		TBAChange(val) {
			if (val) {
				this.$set(this.dataForm, 'vessel', 'TBA')
				this.$set(this.dataForm, 'voyage', '---')
			} else {
				this.$set(this.dataForm, 'vessel', '')
				this.$set(this.dataForm, 'voyage', '')
			}
		},
		async getSeaOrderDetail(id) {
			this.loading = true
			const res = await seaOrderDetailApi(id)
			this.loading = false
			if (res.ok) {
				this.getcustomerLinkmanMemberApi(res.content.customerId)
				const exportServiceListArry = lodash.cloneDeep(res.content.exportServiceList)
				exportServiceListArry.map(item => {
					if (item.serviceCode) {
						this.exportServiceListCode.push(item.serviceCode)
					}
				})
				if (this.type === 'copy') {
					res.content.etd = null
					res.content.vessel = null
					res.content.voyage = null
					if (!res.content.tradeTermCode) {
						res.content.tradeTermCode = 'CFR'
					}
				}
				if (this.$isEmpty(res.content.files)) {
					res.content.files = []
				} else {
					res.content.files.map(item => {
						this.fileList.push({
							name: item.originFileName,
							cloudFileName: item.cloudFileName,
							url: item.url
						})
					})
				}
				if (res.content.vessel === 'TBA' && res.content.voyage === '---') {
					res.content.TBA = true
				}
				this.customerOptionsPorp.push({
					value: res.content.customerId,
					label: res.content.customerName
				})
				//  'lclFlag','fbaFirstLegFlag'
				const array = ['ovlFirstLegFlag', 'fbaFirstLegFlag', 'fullLinkFlag', 'onlyPodServiceFlag', 'fbaFbwFlag', 'seaCollectionFlag']
				let businessTagVal = []
				array.forEach(item => {
					if (res.content.businessTag[item]) {
						businessTagVal.push(item)
					}
				})
				this.businessTagVal = businessTagVal
				this.dataForm = res.content
				this.isOwnerType = res.content.containerList[0].ownerType === 1
			}
		},
		async getSeaOrderSailingApi() {
			const res = await seaOrderSailingApi()
			if (res) {
				res.content.map(item => {
					if (this.$isNotEmpty(item)) {
						this.restaurantsVessel.push({
							value: item.vessel,
							voyage: item.voyage
						})
					}

				})
			}
		},
		fixedActiveBtn(e) {
			let scrollTop = e.target.scrollTop
			scrollTop >= 80 ? this.fixed = true : this.fixed = false
			this.btnWidth = document.querySelector(".app-main").offsetWidth - 20
		},
		validateForm(object) {
			this.errorField = []
			let isContainerList
			for (let key in object) {
				if (object[key][0].field.indexOf('containerList') > -1) {
					if (!isContainerList) {
						this.errorField.push(object[key][0].message.slice(3))
					}
					isContainerList = true
				} else {
					this.errorField.push(object[key][0].message.slice(3))
				}
			}
			this.isValid = true
		},
		async submit() {
			this.$refs.dataForm.validate(async (valid, object) => {
				if (valid) {
					const typeCodeArr = this.dataForm.containerList.map(item => item.typeCode)
					if (new Set(typeCodeArr).size !== typeCodeArr.length) {
						this.$message.warning(this.$t('sea.sameBoxTypeIsSelected'))
						return false
					}
					this.loading = true
					let res
					let bookingJobId
					if (this.id && this.type !== 'copy' && !this.isCopyAll) {
						res = await orderExportEditApi(this.dataForm, this.id)
					} else {
						if (this.dataForm.id) {
							delete this.dataForm.id
						}
						if (this.dataForm.bookingJobId) {
							bookingJobId = lodash.cloneDeep(this.dataForm).bookingJobId
							delete this.dataForm.bookingJobId
						}
						res = await exportAddApi(this.dataForm)
					}
					this.loading = false
					if (res.ok) {
						this.$message.success(this.$t('sea.submittedSuccessfully'))
						this.$store.dispatch('tagsView/delView', this.$route)
						if (this.isCopyAll) { // 全量复制
							this.$router.push({
								name: 'SeaExportOrderView', query: {
									id: res.content, type: 'view', page: '2',
									bookingChannel: this.dataForm.bookingChannel, bookingJobMethod: 1, copyBookingJobId: bookingJobId
								}
							})
						} else {
							this.$router.push({ name: 'SeaExportOrderView', query: { id: res.content, type: 'view', page: '1' } })
						}
					}
				} else {
					this.validateForm(object)
				}
			})
		},
		returnToList() {
			this.$router.push({ name: 'SeaExportOrderList' })
		},
		cancel() {
			this.$store.dispatch('tagsView/delView', this.$route)
			this.$router.go(-1)
		},
		async list(data) {
			this.loading = true
			const res = await getJobNoList(this.filter)
			this.loading = false
			if (res.ok) {
				this.rowData = res.content.list
				this.total = Number(res.content.total)
			} else {
				this.rowData = []
				this.total = 0
				this.updateStepList()
			}
		},
		getcustomerLinkmanMemberApi(id) {
			customerLinkmanMemberApi(id).then(res => {
				// this.$set(this.dataForm, 'customerRate', res.content.customerLevel) //客户等级\
				// this.dataForm.settlementMode = res.content.settlementMode // 结算方式
				this.contactList = res.content
				if (this.$isNotEmpty(res.content) && !this.dataForm.customerContactId) {
					this.dataForm.customerContactId = res.content[0].id
					this.dataForm.customerContact = res.content[0].contact
					this.dataForm.customerEmail = res.content[0].email
					this.dataForm.customerTel = res.content[0].tel
				}
			})
		},
		// 选择客户
		setCustomerInfo(val) {
			this.dataForm.customerName = val.chineseName
			this.$set(this.dataForm, 'customerRate', null)
			this.$set(this.dataForm, 'settlementMode', null)
			this.$set(this.dataForm, 'settlementModeName', null)
			this.$set(this.dataForm, 'customerContactId', null)
			this.$set(this.dataForm, 'customerContact', null)
			this.$set(this.dataForm, 'customerEmail', null)
			this.$set(this.dataForm, 'customerTel', null)
			this.contactList = []
			if (val.id) {
				this.$set(this.dataForm, 'customerId', val.id)
				this.getcustomerLinkmanMemberApi(val.id)
			} else {
				this.contactList = []
				this.dataForm.customerRate = ''
				this.dataForm.settlementMode = ''
				// this.dataForm.settlementModeDesc = ''
				this.dataForm.contactCnName = ''
				this.dataForm.contactMobile = ''
			}
		},
		contactChange(id) {
			let index = this.contactList.findIndex(item => item.id == id)
			this.dataForm.customerContactId = this.contactList[index].id
			this.dataForm.customerContact = this.contactList[index].contact
			this.dataForm.customerEmail = this.contactList[index].email
			this.dataForm.customerTel = this.contactList[index].tel
		},
		// 选中收货地
		receiptChange(receiptCode) {
			this.receiptList.map(item => {
				if (item.receiptCode === receiptCode) {
					this.dataForm.receipt = item.receipt
				}
			})
		},
		destinationChange(destinationCode) {
			this.destinationList.map(item => {
				if (item.destinationCode === destinationCode) {
					this.dataForm.destination = item.destination
				}
			})
		},
		// 运输方式
		transportTermChange(transportTermCode) {
			this.transportTermList.map(item => {
				if (item.code === transportTermCode) {
					this.$set(this.dataForm, 'transportTerm', item.englishName)
				}
			})
			if (this.dataForm.transportTermCode.indexOf('DOOR') < 0) {
				this.$set(this.dataForm, 'nonShippingServiceFlag', false)
			}
		},
		// 选中船司
		selected(data) {
			console.log(data, this.dataForm.carrierId)
		},
		// 过滤船名
		querySearch(queryString, cb) {
			let restaurants = this.restaurantsVessel
			let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
			// 调用 callback 返回建议列表的数据
			cb(results)
		},
		createFilter(queryString) {
			return restaurant => restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1
		},
		// 选择贸易条款
		tradeTermChange(tradeTermCode) {
			this.tradeTermsList.map(item => {
				if (item.code === tradeTermCode) {
					this.dataForm.tradeTerm = item.englishName
				}
			})
			if (tradeTermCode !== 'DDP') {
				this.$set(this.dataForm, 'deliveryAddress', null)
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
		releaseModeCodeChange(val) {
			this.dataForm.releaseMode = val
		},
		handleSelect(item) {
			this.dataForm.voyage = item.voyage
		},
		// 获取集装箱型
		async getContainer() {
			const res = await getContainerTypeList()
			if (res.ok) {
				this.cntrOpts = res.content
				res.content.map(item => {
					if (item.englishName === "20GP" || item.englishName === "40HC") {
						this.cntrOpts2.push(item)
					}
				})
				this.cntrOpts2Copy = lodash.cloneDeep(this.cntrOpts2)
			}
		},
		dataFilter(val) {
			if (val) { // val存在
				// this.cntrOpts2 = this.optionsCopy;
				this.cntrOpts2 = this.cntrOpts.filter(item => {
					if (!!~item.englishName.indexOf(val) || !!~item.englishName.toUpperCase().indexOf(val.toUpperCase())) {
						return true
					}
				})
			} else { // val为空时，还原数组
				this.cntrOpts2 = this.cntrOpts2Copy
			}
		},
		// 箱型箱量
		addContainerType() {
			this.dataForm.containerList.push({
				typeCode: null,
				englishName: null,
				chineseName: null,
				ctnrNum: null,
				weight: null,
				ownerType: 2
			})
		},
		delContainerType(index) {
			this.dataForm.containerList.splice(index, 1)
		},
		// 选择箱型
		ContainerTypesChange(val, item, index) {
			// this.cntrOpts.some(opt => {
			//   if (val === opt.englishName) {
			//     item.chineseName = opt.chineseName
			//     item.englishName = opt.englishName
			//   }
			// })

			item.chineseName = val.chineseName
			item.englishName = val.englishName
			item.typeCode = val.typeCode
			// this.$set(this.shippingInformationForm.containerList, index, item)

		},
		// 选择增值服务
		exportServiceListChange(val) {
			this.dataForm.exportServiceList = []
			val.map(item => {
				this.dmnTermItemList.map(listVal => {
					if (item === listVal.code) {
						this.dataForm.exportServiceList.push({
							serviceCode: listVal.code,
							serviceChineseName: listVal.chineseName,
							serviceEnglishName: listVal.englishName
						})
					}
				})
			})
		},
		// 上传托书
		uploadFile() {
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
		uploadSuccess(res) {
			this.loading = false
			this.canBeUpload = false
			this.dataForm.files.push(res.content)
		},
		uploadError(message) {
			this.loading = false
			this.$message({
				type: 'error',
				message: message
			})
			this.clearUploadFiles()
			this.canBeUpload = false
		},

		setUploadStatus(val) {
			this.canBeUpload = val
		},
		removeFile(file) {
			// cloudFileName
			let index = this.dataForm.files.findIndex(item => item.uid === file.uid || item.cloudFileName === file.cloudFileName)
			if (index !== -1) {
				this.dataForm.files.splice(index, 1)
			}
		},
		async onPreview(file) {
			const jpg = ["jpg", "jpeg", "png", "JPG", "JPEG", "PNG"]
			let cloudFileName, url
			if (file.url) {
				cloudFileName = file.cloudFileName
				url = file.url

			} else {
				cloudFileName = file.response.content.cloudFileName
				url = file.response.content.url
			}
			const fileSuffix = cloudFileName.substring(cloudFileName.lastIndexOf(".") + 1)
			if (jpg.indexOf(fileSuffix) > -1) {
				// 是图片
				this.filepaths = []
				this.fileimageShow = true
				this.filepaths.push(url)
			} else {
				window.open(url)
			}

		},
		async downloadFile(fileUrl, fileName) {
			if (!fileUrl) {
				return
			}
			let res = await axios({
				method: "get",
				url: fileUrl,
				responseType: "blob"
			})
			let newUrl = window.URL.createObjectURL(res.data)
			let a = document.createElement("a")
			a.href = newUrl
			a.download = fileName
			a.click()
			a.remove()
			// 在资源下载完成后 可以人工清除createObjectURL 占用的缓存资源
			window.URL.revokeObjectURL(newUrl)
		},
		fileimageClose() {
			this.fileimageShow = false
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
		businessTagChange(val) {
			const array = ['ovlFirstLegFlag', 'fbaFirstLegFlag', 'fullLinkFlag', 'onlyPodServiceFlag', 'fbaFbwFlag', 'seaCollectionFlag']
			array.map(item => {
				if (val.includes(item)) {
					this.$set(this.dataForm.businessTag, item, true)
				} else {
					this.$set(this.dataForm.businessTag, item, false)
				}
			})
			if (!val.includes('onlyPodServiceFlag')) {
				this.$set(this.dataForm.businessTag, 'customsClearanceFlag', false)
				this.$set(this.dataForm.businessTag, 'trailerFlag', false)
			}
		}
	}
}
</script>
<style lang="scss" scoped>
.icon {
	font-size: 28px;
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
	width: 100px;
}

.flex-bet {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	flex-wrap: wrap;
}

.operate-buttons {
	display: flex;
	justify-content: space-between;
	background-color: #f5f7f7;
	padding: 8px;
	border-bottom: 5px solid #fff;
}

.box_title {
	border-left: solid 3px rgb(24, 144, 255);
	font-size: 18px;
	color: #199ed8;
	padding-left: 8px;
	height: 28px;
	line-height: 28px;
	margin-bottom: 8px;
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

	.box25 {
		width: 33%;

		::v-deep .el-form-item__content {
			width: calc(100% - 100px);
			word-break: break-all;
		}
	}
}

.soc {
	::v-deep .el-form-item__label {
		width: 30px;
	}
}

.added_services {
	width: 250px;
	::v-deep .el-checkbox {
		display: block;
	}
}

.connector {
	color: #999;
	margin-right: 10px;
	position: relative;
	top: -5px;
}

.container_list {
	width: 500px;

	::v-deep .el-form-item__error {
		display: none;
	}
}

.shipping_method {
	::v-deep .el-form-item__content {
		width: 310px;
	}

	::v-deep .el-radio {
		width: 50%;
		margin-right: 0;
	}
}

.issuing_method {
	display: block;

	::v-deep .el-form-item__content {
		width: 400px;
	}
}

//.shipping_method .el-radio{ margin-bottom: 5px}
.w178 {
	width: 178px;
}

.fixedBtn {
	position: fixed;
	top: 80px;
	right: 0;
	z-index: 200;
}

::v-deep .el-upload-list__item {
	width: 250px;
	margin: 5px auto;
}

.valueAddedServices ::v-deep {
	.el-checkbox-group {
		display: flex;
		flex-wrap: wrap;
	}

	.el-checkbox {
		margin-right: 10px;
	}
}

.businessTag {
	display: flex;
	flex-wrap: wrap;

	::v-deep .el-form-item__content {
		width: 250px;
	}
}
.businessTagVal {
	::v-deep .el-radio {
		display: block;
	}
}
</style>
