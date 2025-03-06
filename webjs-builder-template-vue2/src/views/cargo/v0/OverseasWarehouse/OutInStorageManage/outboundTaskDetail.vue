<template>
    <div class="page-edit-container bg-white full-page" v-loading="loading">
      <div class="page-edit-content">
        <OutboundTaskBaseInfo :detailContent="detailContent" :title="getTitle"></OutboundTaskBaseInfo>
        <el-form ref="formData" :model="formData" label-width="120px" label-position="right" :rules="rules" v-if='initEnd' >
          <!--运营确认 -->
          <div v-if="isConfirm">
            <div class="info-title">{{ getZH("outBoundSelect") }}</div>
            <el-row :gutter="20">
              <!-- <el-col :span="8">
                <el-form-item :label="`${getZH('customsClearanceType')}：`" prop="clearanceType">
                  <el-select v-model="formData.clearanceType" size="mini" v-if="isConfirm" class="w-full" :placeholder="selectZH('customsClearanceType')">
                    <el-option label="BONDED" value="BONDED"></el-option>
                    <el-option label="FREE" value="FREE"></el-option>
                  </el-select>
                  <span v-else>{{formData.clearanceType || '-'}}</span>
                </el-form-item>
              </el-col> -->
              <el-col :span="8">
                <el-form-item :label="`${getZH('customsClearanceState')}：`" prop="clearanceStatus">
                  <el-select v-model="formData.clearanceStatus" size="mini" v-if="isConfirm" class="w-full" :placeholder="selectZH('customsClearanceState')" @change="pickupChange">
                    <el-option label="NORMAL" value="NORMAL"></el-option>
                    <el-option label="FISCAL" value="FISCAL"></el-option>
                    <el-option label="EXPORT" value="EXPORT"></el-option>
                  </el-select>
                  <span v-else>{{ formData.clearanceStatus || '-'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`${getZH('loadingPlanTime')}：`" prop="planLoadingTime">
                  <CommonPicker v-model="formData.planLoadingTime" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm:ss" size="mini" v-if="isConfirm" />
                  <span v-else>{{ formData.planLoadingTime | formatDate('YYYY-MM-DD','-')}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="timeSlot">
                  <el-select v-model="formData.warehouseTimeSlot" size="mini" v-if="isConfirm" class="w-full">
                    <el-option :label="item.showVal" :value="item.indexVal" v-for="item in warehouseTimeSlotList" :key="item.indexVal" ></el-option>
                  </el-select>
                  <span v-else>{{ formData.warehouseTimeSlot || '-' }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`${getZH('customsClearanceAgent')}：`" prop="clearanceAgent">
                  <el-select v-model="formData.clearanceAgent" class="w-full" :placeholder="selectZH('customsClearanceAgent')" size="mini" v-if="isConfirm">
                    <el-option label="Eutraco" value="Eutraco" />
                    <el-option label="wispex" value="wispex" />
                    <el-option label="客户自清" value="客户自清" />
                  </el-select>
                  <span v-else>{{ formData.clearanceAgent }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`${getZH('customsClearancePerson')}：`" prop="clearanceCustoms">
                  <el-select v-model="formData.clearanceCustoms" class="w-full" :placeholder="selectZH('customsClearancePerson')" size="mini" v-if="isConfirm">
                    <el-option label="LONGI" value="LONGI" />
                    <el-option label="Customer" value="Customer" />
                  </el-select>
                  <span v-else>{{ formData.clearanceCustoms }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`${getZH('customsClearanceCompletionDate')}：`" prop="clearanceCompleteTime">
                  <CommonPicker v-model="formData.clearanceCompleteTime" pikcer-type="date" pickerFormat="yyyy-MM-dd" size="mini" v-if="isConfirm" />
                  <span v-else>{{ formData.clearanceCompleteTime | formatDate('YYYY-MM-DD','-') }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`${getZH('expectedDeliveryTime')}：`" prop="expectDeliveryTime">
                  <CommonPicker v-model="formData.expectDeliveryTime" pikcer-type="date" pickerFormat="yyyy-MM-dd" size="mini" v-if="isConfirm" />
                  <span v-else>{{formData.expectDeliveryTime | formatDate('YYYY-MM-DD','-')}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!-- 新增 非自提 -->
          <div v-if="isAdd && !formData.pickup">
            <OutBoundSelectInfo :detailContent="formData"></OutBoundSelectInfo>
          </div>
          <div v-if="isAdd">
            <el-row :gutter="20" >
              <el-col :span="8">
                <el-form-item :label="`${getZH('consigneePhoneno')}：`" prop="arrivalContact">
                  <el-input v-model="formData.arrivalContact" size="mini"  maxlength="100" :placeholder="inputZH('consigneePhoneno')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`${getZH('consigneeTel')}：`" prop="arrivalContactTel">
                  <el-input v-model="formData.arrivalContactTel" size="mini"  :placeholder="inputZH('consigneeTel')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`${getZH('arrivalNormalized')}：`" prop="arrivalAddress">
                  <el-input v-model="formData.arrivalAddress" size="mini" :placeholder="inputZH('arrivalNormalized')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`${getZH('deliveryAddressCountry')}：`" prop="arrivalCountry">
                  <el-select v-model="formData.arrivalCountry" size="mini"  v-if='$isNotEmpty(countryList)' @change="countrySelect">
                    <el-option v-for="(item, index) in countryList" :key="index" :label="item.englishName" :value="item.code2" />
                  </el-select>
                  <NationalGroupSelect v-model="formData.arrivalCountry" labelKey="englishName"  @change="countryChange" @selected="selectCountry" v-else />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`${getZH('deliveryAddressProvince')}：`" prop="arrivalProvince">
                  <el-select v-if="$isNotEmpty(filteredOptions)"  v-model="formData.arrivalProvince"  filterable size="mini" :filter-method="selectFilter" @change="selectProvince" class="w-full" :placeholder="$t('outInStorageManage.pleaseEnterArrivalProvince')">
                    <el-option v-for="item in filteredOptions" :key="item.code" :label="item.englishName" :value="item.code">
                      <div class="flex-between">
                        <span >{{ item.englishName }}</span>
                        <span >{{ item.chineseName }}</span>
                        <span style=" color: #8492a6; font-size: 13px">{{ item.code }}</span>
                      </div>
                    </el-option>
                  </el-select>
                  <el-input v-model="formData.arrivalProvince" size="mini" @change="(val)=>{formData.arrivalProvinceEnName = val;formData.arrivalProvinceName = val}" :placeholder="$t('outInStorageManage.pleaseEnterArrivalProvince')" v-else ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`${getZH('deliveryArrivalCity')}：`" prop="arrivalCity">
                  <el-input v-model="formData.arrivalCity" size="mini" :placeholder="inputZH('deliveryArrivalCity')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`${getZH('deliveryAddressZipCode')}：`" prop="arrivalZipcode">
                  <el-input v-model="formData.arrivalZipcode" size="mini" :placeholder="inputZH('deliveryAddressZipCode')"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="info-title" v-if="showLastProduct">{{ getZH("outBoundSelect") }}</div>
            <el-row :gutter="20"  v-if="showLastProduct">
              <el-col :span="24">
                <OutBoundProduct ref="outBoundProduct" :list="productList" :disabled="operate !== 'add'" :productId="formData.productId"
                @change="getCountryByProduct"></OutBoundProduct>
              </el-col>
            </el-row>
            <el-row :gutter="20" v-if="!formData.pickup">
              <el-col :span="16">
                <el-form-item :label="`${getZH('remark')}：`" label-width="80px" prop="remarks" >
                  <el-input v-model="formData.remarks" size="mini" maxlength="200" type="textarea" show-word-limit :placeholder="inputZH('remark')"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
            <!-- 新增 自提 -->
          <div v-if="isAdd && formData.pickup">
            <div class="info-title">{{ getZH("outBoundSelect") }}</div>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item :label="`${getZH('carrier')}：`" prop="carrierName">
                  <el-input v-model="formData.carrierName" :placeholder="inputZH('carrier')" size="mini" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`${getZH('carNo')}：`" prop="carNo">
                  <el-input v-model="formData.carNo" :placeholder="inputZH('carNo')" size="mini"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
             <el-row :gutter="20" v-if="isAdd">
              <el-col :span="16">
                <el-form-item :label="`${getZH('remark')}：`"  prop="remarks" >
                  <el-input v-model="formData.remarks" size="mini" maxlength="200" type="textarea" show-word-limit :placeholder="inputZH('remark')"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!-- 运营确认 非自提新增 -->
          <!--  || (isAdd && !formData.pickup)" -->
          <div v-if="isConfirm">
            <OutBoundInfo :detailContent="detailContent">
               <div class="mr-20 flex-box" slot="totalNetWeight">
                <span><span class="fc-red">*</span>{{getZH('netWeightTotal')}}（KG）：</span>
                <el-form-item label="" label-width="0px" class="mb-0" prop="totalNetWeight" v-if="isConfirm">
                  <el-input v-model="formData.totalNetWeight" size="mini" class="w-100" :placeholder="getZH('netWeightTotal')"></el-input>
                </el-form-item>
                <span v-else>{{formData.totalNetWeight || '-'}}</span>
              </div>
            </OutBoundInfo>
          </div>
          <div v-else>
            <outboundGoodsSelect :data="detailContent" :formData="formData"></outboundGoodsSelect>
          </div>
          <!-- 自提新增 -->
          <!-- <div v-else>
            <OutboundGoodsInfo :data="detailContent" :formData="formData"></OutboundGoodsInfo>
          </div> -->
        </el-form>
      </div>
      <div class="page-edit-footer">
        <el-button type="default" size="mini" @click="backToList()">{{getZH('backList','common')}}</el-button>
        <el-button type="primary" size="mini" @click="saveDraftForm('formData')" v-if="operate === 'confirm'">{{getZH('draftFn')}}</el-button>
        <el-button type="success" size="mini" @click="confirmForm('formData')" v-if="operate === 'confirm'">{{getZH('confirmBtns','common')}}</el-button>
        <el-button type="primary" size="mini" @click="saveOutboundForm('formData')" v-if="operate === 'add'">{{getZH('confirmBtns','common')}}</el-button>
        <el-button type="danger" size="mini" @click="handlerResult(0)" v-if="operate === 'cancel'">{{getZH('reject','common')}}</el-button>
        <el-button type="primary" size="mini" @click="handlerResult(1)" v-if="operate === 'cancel'">{{getZH('refuse','common')}}</el-button>
      </div>
    </div>
</template>

<script>
import getZHMixin from './components/getZHMixin'
import { detailOutboundTaskApi, detailCreateOutboundTaskApi, confirmOutboundTaskApi, cancelOutboundTaskApi, rejectOutboundTaskApi, getCountryByProductApi, exportDetailOutboundTaskApi, getLastServiceApi, saveDraftOutboundTaskApi, getWarehouseTimeSlotApi, saveTaskOutboundApi } from '@/api/OverseasWarehouse/outInStorageManage.js'
import NationalGroupSelect from '@/views/cargo/v0/OverseasWarehouse/components/NationalGroupSelect'
import { getReginInfoApi } from '@/api/partner/member.js'
import { validateZipCode } from '@/utils/validate'
import OutBoundProduct from './components/outBoundProduct'
import OutboundTaskBaseInfo from './components/outboundTaskBaseInfo'
import OutBoundSelectInfo from './components/outBoundSelectInfo'
import OutboundGoodsInfo from './components/outboundGoodsInfo'
import OutBoundInfo from './components/outBoundInfo'
import outboundGoodsSelect from './components/outboundGoodsSelect'
import { logServiceName, pointOvl, logOrigin } from '@/utils/constant'
import { getByteLength } from '@/utils/index'
export default {
	name: 'OutboundTaskDetail',
	mixins: [getZHMixin],
	components: { NationalGroupSelect, OutBoundProduct, OutboundTaskBaseInfo, OutBoundSelectInfo, OutboundGoodsInfo, OutBoundInfo, outboundGoodsSelect },
	data() {
		const validateZipCodeFn = (rule, value, callback) => {
			if (value && !validateZipCode(this.formData.arrivalCountry, value)) {
				callback(new Error(this.getZH('deliveryAddressZipCodeError')))
			} else {
				callback()
			}
		}
        const validLen = (length) => {
            return (rule, value, callback) => {
                if (value && getByteLength(value) > length) {
                    callback(new Error(`最多输入${length}个字节`))
                } else {
                    callback()
                }
            }
        }
		return {
			loading: false,
			initEnd: false,
			operate: null,
			filterText: null,
			detailContent: {},
			lastLegServiceListMap: {},
			provinceOptions: [],
			countryList: [],
			productList: [],
			rules: {
                planLoadingTime: [{ required: true, message: this.$t('common.cannot_be_null') }],
				arrivalCountry: [{ required: true, message: this.selectZH('deliveryAddressCountry') }],
				arrivalProvince: [{ required: true, message: this.selectZH('deliveryAddressProvince') },  { validator: validLen(50) }],
				pickup: [{ required: true, message: this.selectZH('isPickup') }],
				arrivalCity: [{ required: true, message: this.selectZH('deliveryArrivalCity') }, { validator: validLen(35) }],
				arrivalContact: [{ required: false, message: this.selectZH('consigneePhoneno') }, { validator: validLen(70) }],
                arrivalContactTel: [{ required: false, message: this.selectZH('consigneeTel') }, { validator: validLen(20) }],
                arrivalAddress: [{ required: false, message: this.selectZH('arrivalNormalized') }, { validator: validLen(50) }],
				totalNetWeight: [{ required: true, message: this.selectZH('netWeightTotal') }],
				clearanceStatus: [{ required: true, message: this.inputZH('customsClearanceState') }],
				clearanceType: [{ required: true, message: this.selectZH('customsClearanceType') }],
				arrivalZipcode: [{ required: true, message: this.inputZH('deliveryAddressZipCode') }, { validator: validateZipCodeFn },  { validator: validLen(10) }]
			},
			formData: {
				id: null,
				clearanceType: null,
				clearanceStatus: null,
				planLoadingTime: null,
				clearanceAgent: null,
				clearanceCustoms: null,
				clearanceCompleteTime: null,
				carrierName: null,
				expectDeliveryTime: null,
				warehouseTimeSlot: null,
				timeSlotStartTime: null,
				timeSlotEndTime: null,
				carNo: null,
				arrivalAddress: null,
				arrivalCity: null,
				arrivalContact: null,
				arrivalContactTel: null,
				arrivalCountry: null,
				arrivalCountryEnName: null,
				arrivalCountryName: null,
				arrivalDistrict: null,
				arrivalProvince: null,
				arrivalProvinceEnName: null,
				arrivalProvinceName: null,
				arrivalZipcode: null,
				pickup: null,
				productCode: null,
				productId: null,
				productName: null,
				serviceList: [],
				totalNetWeight: null,
				remarks: null,
				outboundGoodsList: [],
				outboundTaskDetailIds: []
			},
			warehouseTimeSlotList: []
		};
	},
	created() {
		this.operate = this.$route.query.operate
		if (this.$isNotEmpty(this.$route.query.id)) {
			this.getDetail(this.$route.query.id)
		}
	},
	computed: {
		// 前端过滤省郡
		filteredOptions() {
			let arr = this.provinceOptions || []
			let filterText = this.filterText
			if (this.$isEmpty(filterText)) {
				return arr
			}
			filterText = filterText.toLowerCase()
			arr = arr.filter(item => {
				let label = item.chineseName.toLowerCase()
				let value = item.code.toLowerCase()
				let englishName = item.englishName.toLowerCase()
				return label.indexOf(filterText) > -1 || value.indexOf(filterText) > -1 || englishName.indexOf(filterText) > -1
			})
			return arr
		},
		getTitle() {
			let title = ''
			switch (this.operate) {
				case 'confirm':
					title = this.getZH('confirmOutbound')
					break
				case 'add':
					title = this.getZH('createOutbound')
					break
				default:
					title = this.getZH('detailOutbound')
					break
			}
			return title
		},
		isConfirm() {
			return this.operate === 'confirm'
		},
		isAdd() {
			return this.operate === 'add'
		},
		showLastProduct() {
			return !this.formData.pickup && this.isAdd
		}

	},
	methods: {
		async getDetail(id) {
			this.initEnd = false
			this.loading = true
			let fn = this.isAdd ? detailCreateOutboundTaskApi : detailOutboundTaskApi
			let res = await fn(id)
			if (res.ok) {
				this.formData.id = res.content.id
				let lastLegServiceListMap = {}
				if (this.$isNotEmpty(res.content.serviceList)) {
					res.content.serviceList.forEach(v => {
						let json = JSON.parse(v.serviceContentJson)
						v.value = json.values[0]
						lastLegServiceListMap[v.serviceCode] = v
					})
					this.lastLegServiceListMap = lastLegServiceListMap
				}
				this.detailContent = res.content
				if (this.$isEmpty(res.content.arrivalAddress)) {
					res.content.arrivalAddress = res.content.address
				}
				if (this.$isNotEmpty(res.content.arrivalCountry)) {
					this.countryChange(res.content.arrivalCountry, true)
				}
				if (this.$isEmpty(res.content.pickup) && this.$isNotEmpty(res.content.term)) {
					// 'FCA', 'EXW' 默认为 TRUE
					res.content.pickup = ['FCA', 'EXW'].includes(res.content.term)
				}
				// 如果是新增非自提
				// if (!res.content.outboundTaskDetails.pickup && this.isAdd) {
				// 	let outboundGoodsList = []
				// 	res.content.outboundTaskDetails.forEach(item => {
				// 		let itemData = {
				// 			productCode: null,
				// 			specifications: null,
				// 			quantity: null,
				// 			palletQuantity: null,
				// 			totalNetWeight: res.content.totalNetWeight,
				// 		}
				// 		this.$copyProps(itemData, item)
				// 		outboundGoodsList.push(itemData)
				// 	})
				// 	res.content.outboundGoodsList = outboundGoodsList
				// 	console.log(res.content.outboundGoodsList)
				// }

				// res.content.lastLegServiceListMap = lastLegServiceListMap
				this.pickupChange(res.content.pickup, true)
				this.$copyProps(this.formData, res.content)
				this.getWarehouseTimeSlot(this.detailContent.warehouseId)
			}
			this.loading = false
			this.initEnd = true

		},
		/**
		 * 获取物流产品的限制国家
		 */
		async getCountryByProduct(productId, isInit) {
			if (this.$isEmpty(productId)) {
				return
			}
			this.formData.productId = productId
			let res = await getCountryByProductApi({ productId })
			if (res.ok) {
				this.countryList = res.content || []
				let index = this.countryList.findIndex(item => item.code2 === this.formData.arrivalCountry)
				// 物流产品配置销售国家且不在限制国家中 将原来清空 否则不处理
				if (!isInit && this.$isNotEmpty(this.countryList) && index === -1) {
					// 清空省 国家选中
					this.selectCountry()
					this.selectProvince()
				}
			}

		},
		/**
		 * 获取仓库配置timeSlot
		 */
		async getWarehouseTimeSlot(id) {
			if (id) {
				let res = await getWarehouseTimeSlotApi(id)
				if (res.ok) {
					res.content.forEach((item, index) => {
						item.showVal = `${this.formatDate(item.timeSlotStartTime, 'HH:mm')}-${this.formatDate(item.timeSlotEndTime, 'HH:mm')}`
						item.indexVal = index
					})
					this.warehouseTimeSlotList = res.content
					this.setTimeSlotEndTime()
				}
			}
		},
		/**
		 * 设置timeSlot回显
		 */
		setTimeSlotEndTime() {
			if (this.$isNotEmpty(this.formData.timeSlotStartTime) && this.$isNotEmpty(this.formData.timeSlotEndTime) && this.$isNotEmpty(this.warehouseTimeSlotList)) {
				let showVal = `${this.formatDate(this.formData.timeSlotStartTime, 'HH:mm')}-${this.formatDate(this.formData.timeSlotEndTime, 'HH:mm')}`
				let showIndex = this.warehouseTimeSlotList.findIndex(item => item.showVal === showVal)
				this.formData.warehouseTimeSlot = showIndex
			}
		},

		/**
		 * 设置产品信息
		 */
		setProductInfo(productId) {
			if (this.$isNotEmpty(productId)) {
				let product = this.productList.find(item => item.id === productId)
				if (this.$isNotEmpty(product)) {
					this.formData.productName = product.productName
					this.formData.productCode = product.productCode
				}
				if (this.showLastProduct) {
					let data = this.$refs.outBoundProduct.getValue()
					this.formData.serviceList = data.serviceList
				}
			}
		},
		/**
		 * 是否自提变更
		 */
		pickupChange(val, isInit) {
			if (!val) {
				this.getProducts(isInit)
			} else {
				this.formData.productId = null
			}
		},
		/**
		 * 获取物流产品
		 */

		getProducts(isInit) {
			if (this.$isEmpty(this.detailContent.warehouseId)) {
				return
			}
			let data = {
				customerId: this.detailContent.customerId,
				warehouseId: this.detailContent.warehouseId,
				transportMode: 2
			}
			// 通过仓库id和运输方式获取物流产品
			getLastServiceApi(data).then(res => {
				if (res.ok) {
					res.content.forEach(v => {
						if (v.id === this.formData.productId) {
							v.services.forEach(service => {
								service.defaultVal = this.lastLegServiceListMap[service.code] ? this.lastLegServiceListMap[service.code].value : service.childrenServices[0].code
							})
						} else {
							v.services.forEach(service => {
								service.defaultVal = service.childrenServices[0].code
							})
						}
					})
					this.productList = res.content
					if (this.productList.length === 1) {
						let data = this.productList[0]
						if (!isInit) {
							this.formData.productId = data.id
						}
						this.getCountryByProduct(this.formData.productId, isInit)
					}
				} else {
					this.productList = []
				}
			})
		},
		/**
		 * 选中国家
		 */
		selectCountry(countryData) {
			if (this.$isNotEmpty(countryData)) {
				this.formData.arrivalCountryName = countryData.chineseName
				this.formData.arrivalCountryEnName = countryData.englishName
			} else {
				this.formData.arrivalCountryName = null
				this.formData.arrivalCountryEnName = null
			}
		},
		/**
		 * 选中省份
		 */
		selectProvince(val) {
			let provinceData = this.provinceOptions.find(item => item.code === val)
			if (this.$isNotEmpty(provinceData)) {
				this.formData.arrivalProvinceEnName = provinceData.chineseName
				this.formData.arrivalProvinceName = provinceData.englishName
			} else {
				this.formData.arrivalProvinceEnName = null
				this.formData.arrivalProvinceName = null
				this.formData.arrivalProvince = null
			}

		},
		// 前端过滤
		selectFilter(filterText) {
			this.filterText = filterText
		},
		countrySelect(val) {
			this.countryChange(val)
			let countryData = this.countryList.find(item => item.code2 === val)
			this.selectCountry(countryData)
		},
		/**
		 * 获取二级省
		 */
		async countryChange(val, init) {
			let data = {
				areaLevel: 1,
				countryCode: val
			}
			let res = await getReginInfoApi(data)
			if (res.ok) {
				this.provinceOptions = res.content.list || []
				if (!init) {
					// 清空省
					this.selectProvince()
				}
			}
		},
		/**
		 * 保存草稿
		 */
		saveDraftForm() {
			this.loading = true
			this.setProductInfo(this.formData.productId)
			this.formData.timeSlotStartTime = this.$isNotEmpty(this.formData.warehouseTimeSlot) ? this.warehouseTimeSlotList[this.formData.warehouseTimeSlot].timeSlotStartTime : null
			this.formData.timeSlotEndTime = this.$isNotEmpty(this.formData.warehouseTimeSlot) ? this.warehouseTimeSlotList[this.formData.warehouseTimeSlot].timeSlotEndTime : null
			saveDraftOutboundTaskApi(this.formData).then(res => {
				if (res.ok) {
					// 添加日志 记录数据
					this.logBtnSend({
						origin: logOrigin.SYSTEM_OPERATION,
						logCode: pointOvl.OVL_OUTBOUND_TASK_SAVE_DRAFT,
						serviceName: logServiceName.OVL_SERVICE,
						businessType: pointOvl.OVL_OUTBOUND_TASK_SAVE_DRAFT,
						content: {
							...this.formData
						}
					})
					this.$message.success(this.getZH('draftSuccess'))
					this.backToList()
				}
				this.loading = false
			})
		},
		/**
		 * 确认
		 */
		confirmForm(refName) {
			this.$refs[refName].validate(valid => {
				if (!valid) {
					this.mixinsFormScrollIntoView()
					return false
				}
				this.confirmTips(this.getZH('publicConfirmTip', 'common')).then(() => {
					if (this.showLastProduct && !this.$refs.outBoundProduct.validate()) {
						return
					}
					this.loading = true
					this.setProductInfo(this.formData.productId)
					this.formData.timeSlotStartTime = this.$isNotEmpty(this.formData.warehouseTimeSlot) ? this.warehouseTimeSlotList[this.formData.warehouseTimeSlot].timeSlotStartTime : null
					this.formData.timeSlotEndTime = this.$isNotEmpty(this.formData.warehouseTimeSlot) ? this.warehouseTimeSlotList[this.formData.warehouseTimeSlot].timeSlotEndTime : null
					confirmOutboundTaskApi(this.formData).then(res => {
						if (res.ok) {
							// 添加日志 记录数据
							this.logBtnSend({
								origin: logOrigin.SYSTEM_OPERATION,
								logCode: pointOvl.OVL_OUTBOUND_TASK_VERIFY,
								serviceName: logServiceName.OVL_SERVICE,
								businessType: pointOvl.OVL_OUTBOUND_TASK_VERIFY,
								content: {
									...this.formData
								}
							})
							this.$message.success(this.getZH('confirmSuccess', 'common'))
							this.backToList()
						}
						this.loading = false
					})
				}).catch(() => { })
			})

		},
		/**
		 * 确认
		 */
		saveOutboundForm(refName) {
			this.$refs[refName].validate(valid => {
				if (!valid) {
					this.mixinsFormScrollIntoView()
					return false
				}
				if (this.showLastProduct && !this.$refs.outBoundProduct.validate()) {
					return
				}
				// if (this.formData.pickup) {
				// if (this.$isEmpty(this.formData.outboundTaskDetailIds)) {
				// 	this.$message.error(this.getZH('outBoundGoodsEmptyError'))
				// 	return
				// }
				// 	let filterData = this.formData.outboundGoodsList.find(item => item.isEdit)
				// 	if (this.$isNotEmpty(filterData)) {
				// 		this.$message.error(this.getZH('outBoundGoodsSaveError'))
				// 		return
				// 	}
				// }
				if (this.$isEmpty(this.formData.outboundTaskDetailIds)) {
					this.$message.error(this.getZH('outBoundGoodsEmptyError'))
					return
				}
				this.loading = true
				this.setProductInfo(this.formData.productId)
				// this.formData.clearanceType =
				this.formData.timeSlotStartTime = this.$isNotEmpty(this.formData.warehouseTimeSlot) ? this.warehouseTimeSlotList[this.formData.warehouseTimeSlot].timeSlotStartTime : null
				this.formData.timeSlotEndTime = this.$isNotEmpty(this.formData.warehouseTimeSlot) ? this.warehouseTimeSlotList[this.formData.warehouseTimeSlot].timeSlotEndTime : null
				saveTaskOutboundApi(this.formData).then(res => {
					if (res.ok) {
						this.$message.success(this.getZH('saveSuccess', 'common'))
						this.backToList()
					}
					this.loading = false
				})
			})

		},
		/**
		 * 处理结果 type  1同意 0拒绝
		 */
		async handlerResult(type) {
			this.confirmTips(this.getZH('publicConfirmTip', 'common')).then(() => {
				let fn = type ? cancelOutboundTaskApi : rejectOutboundTaskApi
				this.loading = true
				fn(this.detailContent.id).then(res => {
					if (res.ok) {
						this.$message.success(this.getZH('handlerSuccess'))
						this.backToList()
					}
					this.loading = false
				})
			}).catch(() => { })
		},
		/**
		 * 导出明细
		 */
		async exportDetail() {
			this.loading = true
			let res = await exportDetailOutboundTaskApi(this.detailContent.id)
			if (res.ok) {
				this.$alert(`<div><span class="fc-red fs-16">${this.getZH('handlerTime')}</span><span class="fs-16">,${this.getZH('handlerRes')}</span></div>`, this.getZH('handlerTips'), {
					dangerouslyUseHTMLString: true,
					confirmButtonText: this.getZH('theKnow', 'common'),
					callback: () => {
						// this.$router.push({ name: `TaskList`, query: { time: new Date().getTime() } })
						this.loading = false
					}
				})
				this.loading = false
			} else {
				this.loading = false
			}
		},
		// 返回列表
		backToList() {
			this.$store.dispatch('tagsView/delView', this.$route)
			this.$router.push({ name: `OutboundTask` })
		}

	}
};
</script>

<style scoped lang="less">
.top-box {
	height: 40px;
	border-bottom: 1px solid #999;
	margin-bottom: 20px;
}
.page-content {
	color: #606266;
	font-size: 14px;
	flex-wrap: wrap;
	& > div {
		white-space: nowrap;
		margin-bottom: 22px;
		min-width: 300px;
	}
}
</style>
