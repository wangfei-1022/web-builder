<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="list" :resetFun="reset">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formData"  :inline="true"  :model="formData"  label-width="100px" size="mini">
            <el-form-item :label='$t("customerManage.supplier_abbreviation")' prop="name">
              <el-input
                class='customer-input'
                v-model="formData.name"
                type="text"
                :placeholder="$t('customerManage.please_enter_supplier_abbreviation')"
                clearable
                @keyup.enter.native="list"
              />
            </el-form-item>
            <el-form-item :label="$t('customerManage.business_type')" prop="businessType">
              <el-select v-model="formData.businessType" size="mini"  @change="list">
                <el-option :label="$t('customerManage.ALL')" value="" />
                <el-option v-for="(item, index) in businessTypeList" :key="index" :label="item.chineseName" :value="item.code"/>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('customerManage.product_name')" prop="principleId">
              <el-select filterable clearable v-model="formData.principleId" size="mini" @change="list">
                <el-option v-for="(item, index) in productList" :key="index" :label="item.chineseName" :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('customerManage.supplier_type')" prop="partnerRole">
              <el-cascader
                clearable
                v-model="formData.partnerRole"
                :options="supplierTypeList"
                :props="{ value: 'code', label: 'name' }"
                @change="list">
              </el-cascader>
            </el-form-item>
            <el-form-item :label="$t('customerManage.supplier_level')" prop="scoreLevelType">
              <el-select v-model="formData.scoreLevelType" size="mini" @change="list">
                <el-option :label="$t('customerManage.ALL')" value="" />
                <el-option v-for="(item, index) in scoreLevelTypeList" :key="index" :label="item.name" :value="item.code"/>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('customerManage.create_by_name')" prop="createBy">
              <type-select v-model="formData.createBy" type="user" @selected="list" />
            </el-form-item>
            <el-form-item :label="$t('customerManage.create_time')" prop="createTime">
              <search-date-picker v-model="formData.createTime"	@change="list" clearable></search-date-picker>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>
    <div class="">
      <div class="top-btn-wrap mb-10 mt-10">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="addMember" v-permission="['scm:supplier:save']">{{ $t("customerManage.add") }}</el-button>
        <el-button type="primary" size="mini" @click="exportFn" v-permission="['scm:supplier:export']">{{ $t("customerManage.export") }}</el-button>
      </div>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="userList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :pagination="false"
        :pagination-auto-page-size="false"
        :grid-ready="onReady"
        :style="gridHeight"
        class="ag-theme-balham"
      />
      <pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="list"/>
    </div>

    <el-dialog v-if="addVisible" :visible.sync="addVisible" :close-on-click-modal="false" width="1180px" :title="addTitle">
      <el-form ref="addPreDataForm" :model="addPreData" :rules="addPreDataRule" label-width="150px" size="mini" class="member-form">
        <div class="de-title" v-if="!addType">
          <!--会员信息-->
          {{$t('customerManage.memberInfo')}}
        </div>
        <el-form-item :label="$t('customerManage.member_type')" prop="type" v-if="!addType">
          <el-select v-model="addPreData.type" :placeholder="$t('customerManage.please_select')" disabled style="width: 100%">
            <el-option key="1" :label="$t('customerManage.memberType.company')" :value="2"></el-option>
            <el-option key="2" :label="$t('customerManage.memberType.personal')" :value="1" ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('customerManage.register_country')" prop="country" v-if="!addType">
          <el-select v-model="addPreData.country" size="mini" filterable :placeholder="$t('customerManage.please_select')" @change="countryChange" style="width: 100%">
            <el-option v-for="item in countryList" :key="item.code2" :label="item.chineseName" :value="item.code2"/>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('customerManage.supplier_name')" prop="supplierName" v-if="!addType">
          <company-select v-model="addPreData.supplierName" :isCN="addPreData.isCN" @change="coustomerChange"></company-select>
        </el-form-item>

        <div class="de-title">{{$t('customerManage.supplier_type')}}</div>
        <el-checkbox-group v-model="addPreData.supplierType" class="supplier-checkbox">
          <div v-for="item in supplierTypeList" :key="item.code" class="supplier-line">
            <span class="supplier-title">{{item.name}}</span>
            <el-checkbox v-for="v in item.children" :label="v.code" :key="v.code">{{v.name}}</el-checkbox>
          </div>
        </el-checkbox-group>

        <el-form-item :label="$t('customerManage.deliveryCompany')" prop="deliveryCompanyId" v-if="addPreData.supplierType.indexOf(12012) >= 0">
          <type-select v-model="addPreData.deliveryCompanyId" type='deliveryCompany' :defaultDisplay="addPreData.deliveryCompanyName" @selected="deliveryCompanyChange"></type-select>
        </el-form-item>
        <el-form-item :label="$t('customerManage.shippingCompany')" prop="shippingCompanyId" v-if="addPreData.supplierType.indexOf(12013) >= 0">
          <type-select v-model="addPreData.shippingCompanyId" type='shippingCompany' :defaultDisplay="addPreData.shippingCompanyName" @selected="shippingCompanyChange"></type-select>
        </el-form-item>
        <el-form-item :label="$t('customerManage.airCompany')" prop="airCompanyId" v-if="addPreData.supplierType.indexOf(12015) >= 0">
          <type-select v-model="addPreData.airCompanyId" type='airLine' :defaultDisplay="addPreData.airCompanyName" @selected="airCompanyChange"></type-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="addVisible = false">{{ $t("customerManage.cancel")}}</el-button>
        <el-button size="mini" type="primary" @click="addPreConfirm">{{ $t("customerManage.confirm") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCustomerListApi, getCustomerTypeListApi, checkCustomerIsUniqueApi, getBusinessTypeListApi, getSalesListApi } from "@/api/partner/customerManage"
import { getSupplierListApi, getSupplierTypeApi, updateSupplierTypeApi, getSupplierRoleApi, getScoreLevelTypeApi, checkSupplierIsUniqueApi, exportSupplierListApi } from "@/api/supplierManage"
import { getProductApi, getSalesApi } from "@/api/partner/base"
import optionBtn from "./optionBtn"
import { AgGridVue } from "ag-grid-vue"
import { getCountryListApi } from "@/api/country"
import { parseTime, formatNumberToThousands } from '@/utils/index'

export default {
	name: "CRMSupplierList",
	components: {
		AgGridVue,
		optionBtn
	},
	data() {
		const validateCompany = (rule, value, callback) => {
			if (value) {
				if (!this.addPreData.country) {
					callback()
					return
				}
				checkSupplierIsUniqueApi({ countryCode: this.addPreData.country, name: value }).then(
					res => {
						if (res && res.ok && res.content) {
							callback(this.$t("customerManage.supplier_name_cannot_be_repeat"))
						} else {
							callback()
						}
					}
				)
			}
		}

		return {
			formData: {
				partnerRole: [],
				scoreLevelType: '',
				businessType: '',
				principleId: '',
				name: '',
				createBy: '',
				createTime: []
			},
			statusList: [],
			productList: [],
			countryList: [],
			scoreLevelTypeList: [],
			addVisible: false,
			addTitle: '',
			addType: '',
			addPreData: {
				id: '',
				type: 2,
				country: "",
				isCN: true,
				supplierName: "",
				supplierType: [],

				deliveryCompanyId: '',
				deliveryCompanyName: '',
				shippingCompanyId: '',
				shippingCompanyName: '',
				airCompanyId: '',
				airCompanyName: ''
			},
			addPreDataRule: {
				type: [{
					required: true,
					message: this.$t("customerManage.member_type_cannot_be_null"),
					trigger: "change"
				}],
				country: [{
					required: true,
					message: this.$t("customerManage.register_country_cannot_be_null"),
					trigger: "change"
				}],
				supplierName: [{
					required: true,
					message: this.$t("customerManage.customer_name_cannot_be_null"),
					trigger: "blur"
				}, {
					validator: validateCompany,
					trigger: "change"
				}]
			},
			pageSize: 50,
			pageNum: 1,
			total: 0,
			userList: [],
			columnFields: [{
				field: "no",
				headerName: this.$t("customerManage.member_no")
			}, {
				field: "shortName",
				headerName: this.$t("customerManage.supplier_abbreviation")
			}, {
				field: "chineseName",
				headerName: this.$t("customerManage.supplier_chinese_name")
			}, {
				field: "englishName",
				headerName: this.$t("customerManage.supplier_english_name")
			}, {
				field: "partnerRolesStr",
				headerName: this.$t("customerManage.supplier_type"),
				cellRenderer(params) {
					return `<span title="${params.value}">${params.value}</span>`
				}
			}, {
				field: "businessTypeStr",
				headerName: this.$t("customerManage.business_type"),
				cellRenderer(params) {
					return `<span title="${params.value}">${params.value}</span>`
				}
			}, {
				field: "scoreLevelTypeName",
				headerName: this.$t("customerManage.supplier_level")
			}, {
				field: "principleName",
				headerName: this.$t("customerManage.product_name")
			}, {
				field: "createTime",
				headerName: this.$t("customerManage.create_time")
			}, {
				field: "createByName",
				headerName: this.$t("customerManage.create_by_name")
			}, {
				field: "id",
				headerName: this.$t("customerManage.operation"),
				cellRendererFramework: "optionBtn",
				minWidth: 280
			}
			],
			sideBarDefs: { toolPanels: ["columns", "filter"], visible: false },
			gridOptions: {
				rowSelection: "single", // 设置多行可选
				animateRows: true,
				suppressRowClickSelection: true, // 选中单元格后可以复制内容
				context: {
					componentParent: this
				}
			},
			loading: false,
			businessTypeList: [],
			supplierTypeList: []
		}
	},
	activated() {
		this.list()
	},
	created() {
		this.list()
		this.getBaseDataFn()
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getCountryListApi(), getBusinessTypeListApi(), getProductApi(), getSupplierTypeApi(), getScoreLevelTypeApi()]).then(results => {
				const countryRes = results[0]
				const businessTypeRes = results[1]
				const productRes = results[2]
				const supplierTypeRes = results[3]
				const scoreLevelTypeRes = results[4]
				if (countryRes.ok) {
					this.countryList = countryRes.content
				}
				if (businessTypeRes.ok) {
					this.businessTypeList = businessTypeRes.content
				}
				if (productRes.ok) {
					this.productList = productRes.content
				}
				if (supplierTypeRes.ok) {
					this.supplierTypeList = supplierTypeRes.content
				}
				if (scoreLevelTypeRes.ok) {
					this.scoreLevelTypeList = scoreLevelTypeRes.content
				}
			})
		},
		addPreConfirm() {
			this.$refs.addPreDataForm.validate(valid => {
				if (valid) {
					if (this.addPreData.supplierType.length === 0) {
            // 请先选择一个供应商类型！
						this.$message.error(this.$t("customerManage.please_select_supplier_type"))
						return
					}
					// 更新供应商类型操作
					if (this.addType === 'ADD_TYPE') {
						let data = {
							id: this.addPreData.id,
							partnerRoles: []
						}
						this.addPreData.supplierType.forEach(v => {
							this.supplierTypeList.forEach(item => {
								item.children.forEach(x => {
									if (x.code === v) {
										let target = {
											partnerRole: x.code,
											partnerRoleName: x.name
										}
										// 关联快递公司
										if (v === 12012) {
											target.relatedId = this.addPreData.deliveryCompanyId
											target.relatedName = this.addPreData.deliveryCompanyName
											target.relatedType = 'delivery_company'
										}
										// 关联船公司
										if (v === 12013) {
											target.relatedId = this.addPreData.shippingCompanyId
											target.relatedName = this.addPreData.shippingCompanyName
											target.relatedType = 'shipping_company' // 关联的类型shipping_company, airline_company, delivery__company
										}
										// 关联航空公司
										if (v === 12015) {
											target.relatedId = this.addPreData.airCompanyId
											target.relatedName = this.addPreData.airCompanyName
											target.relatedType = 'airline_company' // 关联的类型shipping_company, airline_company, delivery__company
										}
										data.partnerRoles.push(target)
									}
								})
							})
						})
						updateSupplierTypeApi(data).then(res => {
							if (res.ok) {
								this.$message.success(this.$t("customerManage.supplierTypeUpdateSuccess"))
								this.list()
							}
						})
					} else {
						this.$router.push({
							name: "CRMSupplierAdd",
							query: {
								...this.addPreData,
								supplierType: JSON.stringify(this.addPreData.supplierType)
							}
						})
					}
					this.addVisible = false
				}
			})
		},
		addMember() {
			this.addTitle = this.$t("customerManage.add")
			this.addType = ''
			this.addVisible = true
			this.addPreData.supplierName = ""
			this.addPreData.country = ""
		},
		// 新增类型
		addTypeFn(item) {
			getSupplierRoleApi(item.id).then(res => {
				if (res.ok) {
					this.addType = 'ADD_TYPE'
					this.addVisible = true
					this.addTitle = this.$t("customerManage.add_supplier_type")
					let arr = []
					res.content.forEach(v => {
						arr.push(v.partnerRole)
						// 关联快递公司
						if (v.partnerRole === 12012) {
							this.addPreData.deliveryCompanyId = v.relatedId
							this.addPreData.deliveryCompanyName = v.relatedName
						}
						// 关联船公司
						if (v.partnerRole === 12013) {
							this.addPreData.shippingCompanyId = v.relatedId
							this.addPreData.shippingCompanyName = v.relatedName
						}
						// 关联航空公司
						if (v.partnerRole === 12015) {
							this.addPreData.airCompanyId = v.relatedId
							this.addPreData.airCompanyName = v.relatedName
						}
					})
					this.addPreData.id = item.id
					this.addPreData.supplierType = arr
				}
			})
		},
		countryChange() {
			this.addPreData.isCN = this.addPreData.country === 'CN'
		},
		coustomerChange(customer) {
			this.addPreData.supplierName = customer.id || customer.value
		},
		shippingCompanyChange(item) {
			this.addPreData.shippingCompanyName = item.chineseName
		},
		deliveryCompanyChange(item) {
			this.addPreData.deliveryCompanyName = item.chineseName
		},
		airCompanyChange(item) {
			this.addPreData.airCompanyName = item.chineseName
		},
		onReady(params) {
			this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
		},
		exportFn() {
			const params = this.getParams()
			exportSupplierListApi(params).then(res => {
				if (res.ok) {
					this.downloadFile({
						fileName: res.content.originFileName,
						url: res.content.url
					})
				}
			})
		},
    getParams() {
      let params = {
				...this.formData,
				pageSize: this.pageSize,
				pageNum: this.pageNum
			}
			if (this.formData.partnerRole.length > 0) {
				params.partnerRole = this.formData.partnerRole[1]
			}
			if (params.createTime.length) {
				params.createTimeStart = this.formData.createTime[0]
				params.createTimeEnd = this.formData.createTime[1]
			}
			delete params.createTime
      return params
    },
		async list() {
			this.loading = true
			const params = this.getParams()
			const res = await getSupplierListApi(params)
			if (res.ok) {
				res.content.list.forEach(function (v) {
					let businessTypeStr = []
					v.businessTypes.forEach(x => {
						businessTypeStr.push(x.businessTypeName)
					})
					v.businessTypeStr = businessTypeStr.join('、')
					v.createTime = parseTime(v.createTime, '{y}-{m}-{d} {h}:{i}:{s}')

					let partnerRolesStr = []
					v.partnerRoles.forEach(v => {
						partnerRolesStr.push(v.partnerRoleName)
					})
					v.partnerRolesStr = partnerRolesStr.join('、')
				})
				this.total = parseInt(res.content.total, 10)
				this.userList = res.content.list
			} else {
				this.total = 0
				this.userList = []
			}
			this.loading = false
		},
		reset() {
			this.$refs.formData.resetFields()
			this.list()
		}
	},
	mounted() {}
}
</script>
<style lang="scss" scoped>
.pagination-container {
	margin-top: 0px;
}
.customer-input {
	width: 225px;
}

.supplier-line {
	margin-bottom: 15px;

	.supplier-title {
		font-size: 14px;
		margin-right: 13px;
		width: 70px;
		display: inline-block;
		text-align: right;
	}
}
.supplier-checkbox {
	::v-deep .el-checkbox {
		width: 150px;
		padding: 0;
		margin: 0;
	}
}
.de-title {
	font-size: 18px;
	margin-bottom: 15px;
	font-weight: 600;
	border-left: 5px solid rgba(24, 144, 255, 1);
	padding-left: 15px;
}
</style>
