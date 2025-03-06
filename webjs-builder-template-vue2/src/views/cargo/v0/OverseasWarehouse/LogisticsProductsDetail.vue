<template>
<div class="page-edit-container bg-white">
  <div class="page-edit-content">
    <el-form
      ref="formData"
      v-loading="loading"
      label-width="115px"
      label-position="left"
      :rules="rules"
      :model="formData"
    >
      <div>
        <div class="content-title">{{ $t("logisticsProduct.base_info") }}</div>
        <div class="pd-16">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                :label="$t('logisticsProduct.product_type')"
                prop="productType"
              >
                <el-select
                  v-model="formData.productType"
                  size="mini"
                  :placeholder="
                    $t('logisticsProduct.please_select_product_type')
                  "
                  class="w-full"
                  :disabled="isDisabled"
                  @change="getCompanyList"
                >
                  <el-option
                    :label="
                      $t('logisticsProduct.transportMode.express_elivery')
                    "
                    :value="1"
                  />
                  <el-option
                    :label="$t('logisticsProduct.transportMode.truck')"
                    :value="2"
                  />
                  <el-option
                    :label="$t('logisticsProduct.transportMode.railway')"
                    :value="3"
                  />
                  <el-option
                    :label="$t('logisticsProduct.transportMode.trailer')"
                    :value="4"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('logisticsProduct.product_code')"
                prop="productCode"
              >
                <el-input
                  v-model="formData.productCode"
                  :maxlength="100"
                  size="mini"
                  :disabled="isDisabled"
                  :placeholder="
                    $t('logisticsProduct.please_select_product_code')
                  "
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                :label="$t('logisticsProduct.product_name')"
                prop="productName"
              >
                <el-input
                  v-model="formData.productName"
                  :maxlength="100"
                  :disabled="isDisabled"
                  size="mini"
                  :placeholder="
                    $t('logisticsProduct.please_enter_product_name')
                  "
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('logisticsProduct.logistics_company')"
                prop="carrierId"
              >
                <SelectFilter
                  v-if="!isDisabled"
                  v-model="formData.carrierId"
                  size="mini"
                  :placeholder="
                    $t('logisticsProduct.please_select_logistics_company')
                  "
                  name-key="shortname"
                  value-key="id"
                  :options="companyList"
                  :filter-keys="[
                    'scacCode',
                    'shortname',
                    'chineseName',
                    'englishName',
                  ]"
                />
                <el-input
                  v-else
                  size="mini"
                  disabled
                  v-model="formData.logisticsCompanyName"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                :label="$t('logisticsProduct.product_country')"
                prop="countryCode"
              >
                <NationalGroupSelect
                  v-model="formData.countryCode"
                  v-if="!isDisabled"
                />
                <el-input
                  v-else
                  size="mini"
                  disabled
                  v-model="formData.countryName"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('logisticsProduct.timeliness')"
                prop="aging"
                style="height: 37px"
              >
                <el-input
                  v-model="formData.aging"
                  :disabled="isDisabled"
                  class="w-full"
                  maxlength="10"
                  size="mini"
                  :placeholder="$t('logisticsProduct.please_enter_timeliness')"
                >
                  <template slot="append">{{
                    $t("logisticsProduct.day")
                  }}</template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12" v-if="formData.productType === 1">
              <el-form-item :label="$t('logisticsProduct.mergePackageFlag')" required>
                <el-select class="w-full" v-model="formData.mergePackageFlag" size="mini" :disabled="isDisabled">
                  <el-option :label="$t('common.YES')" :value="true"></el-option>
                  <el-option :label="$t('common.NO')" :value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
          </el-row>
        </div>
        <div class="content-title">
          {{ $t("logisticsProduct.restrictive_condition") }}
          <el-tooltip class="item" effect="dark" :content='$t("logisticsProduct.restrictive_condition_tips")' placement="bottom">
            <span class="el-icon-warning fc-yellow fs-16"></span>
          </el-tooltip>
        </div>
        <div class="pd-16">
          <div v-if="$isNotEmpty(formData.conditionList)">
            <div
              v-for="(item, index) in formData.conditionList"
              :key="index"
              class="flex"
            >
              <div
                v-if="!isDetail || isEdit"
                class="el-icon-remove-outline removeIcon"
                @click="removeLimit(index)"
              />
              <div>
                <div class="mb-10 flex-box">
                  <el-form-item
                    label=""
                    label-width="0px"
                    class="mb-0"
                    :prop="`conditionList[${index}].conditionTypeCode`"
                    :rules="[
                      {
                        required: index === 0,
                        message: $t(
                          'logisticsProduct.please_select_restrictive_condition'
                        ),
                      },
                    ]"
                  >
                    <el-select
                      v-model="item.conditionTypeCode"
                      :disabled="(isDisabled && !isEdit)"
                      size="mini"
                      :placeholder="
                        $t(
                          'logisticsProduct.please_select_restrictive_condition'
                        )
                      "
                      @change="fieldCodeChange(item)"
                    >
                      <el-option
                        v-for="(data, key) in limitingConditionsType"
                        :key="key"
                        :label="data.name"
                        :value="Number(key)"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label=""
                    label-width="0px"
                    class="mb-0 ml-10"
                    :prop="`conditionList[${index}].fieldCode`"
                    :rules="[
                      {
                        required:
                          index === 0 || $isNotEmpty(item.conditionTypeCode),
                        message: $t(
                          'logisticsProduct.please_select_restrictive_dto'
                        ),
                      },
                    ]"
                  >
                    <el-select
                      v-model="item.fieldCode"
                      :disabled="(isDisabled && !isEdit)"
                      size="mini"
                      @change="item.unit=''"
                      :placeholder="
                        $t('logisticsProduct.please_select_restrictive_dto')
                      "
                    >
                      <el-option
                        v-for="data in filterTypes(item)"
                        :key="data.value"
                        :label="data.name"
                        :value="data.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label=""
                    label-width="0px"
                    class="mb-0 ml-10"
                    :prop="`conditionList[${index}][${
                      item.conditionTypeCode != 4 ? 'unit' : 'countryCodeList'
                    }]`"
                    :rules="[
                      {
                        required:
                          index === 0 || $isNotEmpty(item.conditionTypeCode),
                        message:
                          item.conditionTypeCode != 4
                            ? $t('logisticsProduct.please_select_unit')
                            : $t('logisticsProduct.please_select_country'),
                      },
                    ]"
                  >

                    <el-select
                      v-if="item.conditionTypeCode != 4"
                      v-model="item.unit"
                      :disabled="(isDisabled && !isEdit)"
                      size="mini"
                      :placeholder="$t('logisticsProduct.please_select_unit')"
                    >
                      <el-option
                        v-for="unitItem in filterUnits(item.conditionTypeCode,item.fieldCode)"
                        :key="unitItem.value"
                        :label="unitItem.name"
                        :value="unitItem.value"
                      />
                    </el-select>
                    <NationalGroupSelect
                      v-else
                      v-model="item.countryCodeList"
                      :disabled="(isDisabled && !isEdit)"
                      multiple
                    />
                  </el-form-item>
                </div>
                <div v-if="item.conditionTypeCode != 4">
                  <div
                    v-for="(child, childIndex) in item.children"
                    :key="childIndex"
                    class="mb-10 flex-box"
                  >
                    <div class="w-180 h-28 inlineBlock" />
                    <el-form-item
                      label=""
                      label-width="0px"
                      class="mb-0 ml-10"
                      :prop="`conditionList[${index}].children[${childIndex}].operator`"
                      :rules="[
                        {
                          required:
                            (index === 0 ||
                              $isNotEmpty(item.conditionTypeCode)) &&
                            childIndex === 0,
                          message: $t(
                            'logisticsProduct.please_select_comparison_operators'
                          ),
                        },
                      ]"
                    >
                      <el-select
                        v-model="child.operator"
                        :disabled="
                          $isEmpty(item.conditionTypeCode) ||
                          $isEmpty(item.fieldCode) ||
                          (isDisabled && !isEdit)
                        "
                        size="mini"
                        :placeholder="
                          $t(
                            'logisticsProduct.please_select_comparison_operators'
                          )
                        "
                        clearable
                      >
                        <el-option
                          v-for="operatorItem in filterOperators(item, child)"
                          :key="operatorItem.value"
                          :label="operatorItem.name"
                          :value="operatorItem.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label=""
                      label-width="0px"
                      class="mb-0 ml-10"
                      :prop="`conditionList[${index}].children[${childIndex}].referenceValue`"
                      :rules="[
                        {
                          required:
                            (index === 0 ||
                              $isNotEmpty(item.conditionTypeCode)) &&
                            (childIndex === 0 || $isNotEmpty(child.operator)),
                          message: $t('logisticsProduct.please_enter_number'),
                        },
                        { validator: checkDecima4 },
                      ]"
                    >
                      <el-input
                        v-model="child.referenceValue"
                        :disabled="$isEmpty(child.operator) || (isDisabled && !isEdit)"
                        class="w-180"
                        size="mini"
                        clearable
                        :placeholder="
                          $t('logisticsProduct.please_enter_number')
                        "
                      />
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="!isDetail || isEdit" class="pointer" @click="addLimit()" >
            <span class="el-icon-circle-plus-outline" />
            {{ $t("logisticsProduct.add_restrictive_condition") }}
          </div>
        </div>
        <div class="content-title mb-10">
          {{ $t("logisticsProduct.additional_service") }}
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              :label="$t('logisticsProduct.sign')"
              prop="signServiceFlag"
            >
              <el-select
                class="w-full"
                v-model="formData.signServiceFlag"
                size="mini"
                v-if="!isDisabled"
              >
                <el-option
                  :label="item.name"
                  v-for="item in signServiceList"
                  :value="item.code"
                  :key="item.code"
                >
                </el-option>
              </el-select>
              <el-input
                v-else
                size="mini"
                disabled
                v-model="formData.signServiceFlagName"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('logisticsProduct.insurance')"
              prop="insuranceSupportType"
            >
              <el-select
                class="w-full"
                v-model="formData.insuranceSupportType"
                size="mini"
                v-if="!isDisabled"
              >
                <el-option
                  :label="item.name"
                  v-for="item in insuranceSupportList"
                  :value="item.code"
                  :key="item.code"
                >
                </el-option>
              </el-select>
              <el-input
                v-else
                size="mini"
                disabled
                v-model="formData.insuranceSupportTypeName"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12" v-if="formData.productType === 2">
            <el-form-item
              :label="$t('logisticsProduct.lift_gate')"
              prop="liftGateSupportType"
            >
              <el-select
                class="w-full"
                v-model="formData.liftGateSupportType"
                size="mini"
                v-if="!isDisabled"
              >
                <el-option
                  :label="item.name"
                  v-for="item in liftGateSupportTypeList"
                  :value="item.code"
                  :key="item.code"
                >
                </el-option>
              </el-select>
              <el-input
                v-else
                size="mini"
                disabled
                v-model="formData.liftGateSupportTypeName"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="!isDetail">
          <div class="content-title mb-10">
            {{ $t("logisticsProduct.peakSeasonTime") }}
          </div>
          <peakSeasonTimeEdit :data="formData" :type="1" />
          <div class="content-title mb-10">
            {{ $t("logisticsProduct.fuelRate") }}
          </div>
          <fuelRateEdit :data="formData" />
        </div>
        <div class="content-title mb-10">
          {{ $t("logisticsProduct.partitionSet") }}
        </div>
        <partitionSet :isDetail="isDetail" :data="formData" />
        <div class="content-title mb-10">
          {{ $t("logisticsProduct.remoteSettings") }}
        </div>
        <remoteSettings :isDetail="isDetail" :data="formData" />
      </div>
    </el-form>
  </div>
  <div class="page-edit-footer">
     <el-button size="mini" @click="backList()">
        {{ $t("logisticsProduct.cancel") }}
      </el-button>
      <el-button
        v-if="!isDetail || isEdit"
        type="primary"
        size="mini"
        :disabled="loading"
        @click="isEdit ? saveCondition() : saveForm('formData')"
      >
        {{ $t("logisticsProduct.confirm") }}
      </el-button>

  </div>
  </div>
</template>

<script>
import { detailProductApi, saveProductApi, getSignGroupApi, getInsuranceGroupApi, getLiftGateGroupApi, saveLimitConditionApi } from '@/api/OverseasWarehouse/overseasWarehouseManager'
import NationalGroupSelect from './components/NationalGroupSelect.vue'
import { getCompanyListApi } from '@/api/OverseasWarehouse/overseasWarehouseManager'
import limitingConditionsType from './components/limitingConditionsType'
import { validEnglishNumbers, checkDecima4 } from '@/utils/validate'
import peakSeasonTimeEdit from './components/peakSeasonTimeEdit'
import fuelRateEdit from './components/fuelRateEdit'
import partitionSet from './components/partitionSet'
import remoteSettings from './components/remoteSettings'
export default {
	name: 'LogisticsProductsDetail',
	components: { NationalGroupSelect, peakSeasonTimeEdit, fuelRateEdit, partitionSet, remoteSettings },
	data() {
		const defaultForm = {
			id: null,
			productType: null,
			carrierId: null,
			countryCode: '',
			countryName: '',
			productCode: '',
			productName: '',
			remoteAreaType: '',
			aging: null,
			signServiceFlag: 0,
			signServiceFlagName: '',
			conditionList: [],
			insuranceSupportType: 0,
			logisticsCompanyName: '',
			insuranceSupportTypeName: '',
			liftGateSupportTypeName: this.$t('logisticsProduct.noService'),
			liftGateSupportType: 1,
			haveRemoteAreaFlag: null,
			remoteAreaList: [],
			normalAreaList: [],
			singleAreaFlag: null
			// mergePackageFlag: false,
		}
		return {
			checkDecima4,
			dialogVisible: false,
			defaultForm: defaultForm,
			loading: false,
			title: '',
			limitingConditionsType,
			signServiceList: [],
			liftGateSupportTypeList: [],
			insuranceSupportList: [],
			isDetail: '',
			isEdit: false,
			id: null,
			operators: [{
				name: this.$t('logisticsProduct.equal'),
				value: 10
			},
			{
				name: this.$t('logisticsProduct.less_than'),
				value: 13
			},
			{
				name: this.$t('logisticsProduct.greater_than'),
				value: 12
			},
			{
				name: this.$t('logisticsProduct.equal_or_greater_than'),
				value: 14
			},
			{
				name: this.$t('logisticsProduct.equal_or_less_than'),
				value: 15
			},
			{
				name: this.$t('logisticsProduct.not_equal'),
				value: 11
			}],
			types: [
				{
					name: this.$t('logisticsProduct.weight_restrictions'),
					value: 1,
					children: [
					]
				},
				{
					name: this.$t('logisticsProduct.size_restrictions'),
					value: 2
				}
			],
			rules: {
				productType: [{ required: true, message: this.$t('logisticsProduct.please_select_product_type'), trigger: 'change' }],
				carrierId: [{ required: true, message: this.$t('logisticsProduct.please_select_logistics_company'), trigger: 'change' }],
				countryCode: [{ required: true, message: this.$t('logisticsProduct.please_select_product_country'), trigger: 'change' }],
				productCode: [{ required: true, message: this.$t('logisticsProduct.please_select_product_code'), trigger: 'change' }, { validator: validEnglishNumbers }],
				productName: [{ required: true, message: this.$t('logisticsProduct.please_enter_product_name'), trigger: 'change' }],
				aging: [{ validator: this.$validators.isNumber }],
				signServiceFlag: [{ required: true, message: this.$t('logisticsProduct.please_select_sign') }],
				liftGateSupportType: [{ required: true, message: this.$t('logisticsProduct.please_select_lift_gate') }],
				insuranceSupportType: [{ required: true, message: this.$t('logisticsProduct.please_select_insurance') }],
				remoteAreaType: [{ required: true, message: this.$t('logisticsProduct.please_select_type_area') }]
			},
			companyList: [],
			formData: this.$extends({}, defaultForm)
		}
	},
	async created() {
		this.id = this.$route.query.id
		this.isDetail = this.$isNotEmpty(this.$route.query.type)
		this.isEdit = Number(this.$route.query.type) === 0
		if (this.$isNotEmpty(this.id)) {
			const res = await detailProductApi(this.id)
			if (res.ok) {
				if (res.content.singleAreaFlag) {
					res.content.normalAreaList = []
				}
				this.$copyProps(this.formData, res.content, 'conditionList')
				// 将后端给的数据条件展现成前端支持的结构
				const conditionList = []
				if (this.$isNotEmpty(res.content.conditionList)) {
					res.content.conditionList.forEach(item => {
						const data = conditionList.find(fieldItem => fieldItem.conditionTypeCode === item.conditionTypeCode && fieldItem.fieldCode === item.fieldCode)
						// 如果主数据已经存在
						if (this.$isNotEmpty(data)) {
							const data2 = {
								operator: item.operator,
								referenceValue: item.referenceValue
							}
							data.children.push(data2)
						} else {
							const data1 = {
								fieldCode: item.fieldCode,
								conditionTypeCode: item.conditionTypeCode,
								unit: item.unit,
								countryCodeList: item.countryCodeList,
								children: [{
									operator: item.operator,
									referenceValue: item.referenceValue
								}]
							}
							conditionList.push(data1)
						}
					})
					if (!this.isDetail || this.isEdit) {
						// 增加空数据
						conditionList.forEach(item => {
							if (item.children.length === 1) {
								const data3 = {
									operator: '',
									referenceValue: ''
								}
								item.children.push(data3)
							}
						})
					}
				}
				this.formData.conditionList = conditionList
			}
		} else {
			this.formData = this.$extends(true, {}, this.defaultForm)
		}
		if (!this.isDetail) {
			await this.init()
		}
	},
	computed: {
		isDisabled() {
			return this.$isNotEmpty(this.id) || this.isDetail
		}
	},
	watch: {
	},
	methods: {
		/**
		 *获取国家基础数据
		 */
		async init() {
			const res1 = await getSignGroupApi()
			if (res1.ok) {
				this.signServiceList = res1.content || []
			}
			const res2 = await getInsuranceGroupApi()
			if (res2.ok) {
				this.insuranceSupportList = res2.content || []
			}
			const res3 = await getLiftGateGroupApi()
			if (res3.ok) {
				this.liftGateSupportTypeList = res3.content || []
			}
		},
		/**
		 * 根据运输方式获取物流公司
		 */
		async getCompanyList(val) {
			const data = await getCompanyListApi({
				pageSize: 500,
				transportMode: this.formData.productType,
				pageNum: 1
			})
			if (data.ok) {
				this.companyList = data.content.list
				// 如果已选中的物流公司不在下拉中 删除
				const selectData = this.companyList.find(item => item.id === this.formData.carrierId)
				if (this.$isEmpty(selectData)) {
					this.formData.carrierId = null
				}
			}
			// if (val !== 1) {
			// 	this.formData.mergePackageFlag = false
			// }
		},
		/**
		 * 保存数据
		 */
		saveForm(refName) {
			this.$refs[refName].validate(valid => {
				if (valid) {
					const saveForm = this.$extends(true, {}, this.formData)
					saveForm.conditionList = this.handlerCondition()
					if (this.$isNotEmpty(saveForm.peakSeasonTimeChargeDetailDTOList)) {
						saveForm.peakSeasonTimeChargeDetailDTOList.forEach(item => {
							delete item.isBusySeason
							if (this.$isNotEmpty(item.peakSeasonTimeDetailDTOList)) {
								item.peakSeasonTimeDetailDTOList = item.peakSeasonTimeDetailDTOList.filter(data => this.$isNotEmpty(data.rangTime) && !data.endTimeFlag || data.endTimeFlag && this.$isNotEmpty(data.startTime))
								item.peakSeasonTimeDetailDTOList.forEach((itemDate, index) => {
									if (!itemDate.endTimeFlag) {
										itemDate.startTime = itemDate.rangTime[0]
										itemDate.endTime = itemDate.rangTime[1]
										delete itemDate.rangTime
										itemDate.serial = index + 1
										item.channelPriceList = []
									} else {
										itemDate.endTime = null
										delete itemDate.rangTime
										itemDate.serial = index + 1
										item.channelPriceList = []
									}
								})
							}
						})
					}
					if (this.$isNotEmpty(saveForm.fuelRateDetailDTOList)) {
						saveForm.fuelRateDetailDTOList.forEach((itemDate, index) => {
							if (!itemDate.endTimeFlag) {
								itemDate.startTime = Number(itemDate.rangTime[0])
								itemDate.endTime = Number(itemDate.rangTime[1])
								delete itemDate.rangTime
								itemDate.serial = index + 1
							} else {
								itemDate.endTime = null
								delete itemDate.rangTime
								itemDate.serial = index + 1
							}
						})
					}
					this.loading = true
					saveProductApi(saveForm, saveForm.id).then(res => {
						if (res.ok) {
							this.loading = false
							this.$message.success(this.$t('TipsMessage.saveMessage'))
							this.removeTag()
						} else {
							this.loading = false
						}
					}).catch(() => {
						this.loading = false
					})
				} else {
					this.loading = false
					this.mixinsFormScrollIntoView()
					return false
				}
			})
		},
		// 保存限制条件
		async saveCondition() {
			let saveData = {
				id: this.formData.id,
				conditionList: this.handlerCondition()
			}
			this.loading = true
			let res = await saveLimitConditionApi(saveData)
			if (res.ok) {
				this.loading = false
				this.$message.success(this.$t('TipsMessage.saveMessage'))
				this.removeTag()
			} else {
				this.loading = false
			}
		},
		// 组装限制条件
		handlerCondition() {
			const conditionList = []
			const arr = this.$extends([], this.formData.conditionList)
			if (this.$isNotEmpty(arr)) {
				console.log(arr)
				arr.forEach(item => {
					if (this.$isNotEmpty(item.conditionTypeCode)) {
						// 将限制条件平铺
						const data1 = {
							fieldCode: item.fieldCode,
							conditionTypeCode: item.conditionTypeCode,
							unit: item.unit,
							countryCodeList: item.countryCodeList,
							operator: item.children ? item.children[0].operator : null,
							referenceValue: item.children ? item.children[0].referenceValue : null
						}
						conditionList.push(data1)
						// 如果第二条数据存在则增加第二条数据
						if (item.children && item.children.length === 2 && this.$isNotEmpty(item.children[1].operator) && this.$isNotEmpty(item.children[1].referenceValue)) {
							const data2 = {
								fieldCode: item.fieldCode,
								conditionTypeCode: item.conditionTypeCode,
								unit: item.unit,
								operator: item.children[1].operator,
								referenceValue: item.children[1].referenceValue
							}
							conditionList.push(data2)
						}
					}
				})
			}
			return conditionList
		},
		/**
		 *增加限制条件
		 */
		addLimit() {
			const data = {
				fieldCode: '',
				conditionTypeCode: '',
				unit: '',
				countryCodeList: [],
				children: [{
					operator: '',
					referenceValue: ''
				},
				{
					operator: '',
					referenceValue: ''
				}]
			}
			this.formData.conditionList.push(data)
		},
		/**
		 * 减少限制条件
		 */
		removeLimit(index) {
			this.formData.conditionList.splice(index, 1)
		},
		/**
		 * 过滤限制分类
		 */
		filterTypes(key) {
			if (this.$isEmpty(key.conditionTypeCode)) {
				return []
			}
			let arr = this.limitingConditionsType[key.conditionTypeCode].types
			if (this.$isEmpty(arr)) {
				return []
			}
			const currentIndex = this.formData.conditionList.indexOf(key)
			arr = arr.filter(item => this.$isEmpty(this.formData.conditionList.find((condition, index) => condition.fieldCode === item.value && index !== currentIndex)))
			return arr
		},
		/**
		 * 获取单位
		 */
		filterUnits(key, childKey) {
			if (this.$isEmpty(key)) {
				return []
			}
			let arr = []
			let childArr = this.limitingConditionsType[key]
			if (this.$isNotEmpty(childKey)) {
				let childItem = childArr.types.find(item => item.value === childKey)
				if (childItem.units) {
					arr = childItem.units
				} else {
					arr = childArr.units
				}
			} else {
				arr = childArr.units
			}
			return arr
		},
		/**
		 * 获取限制条件
		 */
		filterOperators(data, childItem) {
			let arr = this.operators
			// 排除当前条
			const currentIndex = data.children.indexOf(childItem)
			arr = arr.filter(item => this.$isEmpty(data.children.find((child, index) => item.value === child.operator && index !== currentIndex)))
			return arr
		},
		/**
		 * 删除当前路由
		 */
		removeTag() {
			this.$store.dispatch('tagsView/delView', this.$route)
			this.$router.push({ name: 'LogisticsProducts', query: { time: new Date().getTime() } })
			this.loading = false
		},
		/**
		 * 返回列表
		 */
		backList() {
			if (this.isDetail || this.isEdit) {
				this.removeTag()
				return
			}
			this.$confirm(this.$t('logisticsProduct.tips'), this.$t('logisticsProduct.tipsTitle'), {
				confirmButtonText: this.$t('common.confirm'),
				cancelButtonText: this.$t('common.cancel'),
				type: 'warning'
			}).then(() => {
				this.removeTag()
			}).catch(() => {

			})
		},
		/**
		 * 限制条件变更
		 */
		fieldCodeChange(item) {
			item.fieldCode = ''
			item.unit = ''
			item.countryCodeList = []
			item.children[0].operator = ''
			item.children[0].referenceValue = ''
			item.children[1].operator = ''
			item.children[1].referenceValue = ''
		}
	}
}
</script>

<style lang="less" scoped>
::v-deep.el-form-item__error {
	padding-top: 0px;
}
.dialog-content {
	min-height: 500px;
}
.removeIcon {
	margin-top: 10px;
	margin-right: 5px;
}
</style>

