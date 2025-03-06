<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="getList" :resetFun="reset">
			<template slot="multipleSearch">
				<div class="multiple-form-wrap">
					<el-form ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
						<el-form-item :label="$t('customerManage.business_type')" prop="businessType">
							<base-select type="businessType" v-model="formData.businessType" addALL @selected="getList" />
						</el-form-item>
						<el-form-item :label="$t('customerManage.sales_names')" prop="sellerId">
              <base-select type="sale" v-model="formData.sellerId" filterable clearable @selected="getList" />
						</el-form-item>

						<el-form-item :label="$t('customerManage.customer_type')" prop="directCustomerType">
							<el-select v-model="formData.directCustomerType" size="mini" @change="getList">
								<el-option :label="$t('customerManage.ALL')" value="" />
								<el-option v-for="(item, index) in customerTypeList" :key="index" :label="item.name" :value="item.code" />
							</el-select>
						</el-form-item>
						<el-form-item :label="$t('customerManage.create_by_name')" prop="createBy">
							<type-select v-model="formData.createBy" type="user" @selected="getList" />
						</el-form-item>
            <el-form-item :label="$t('customerManage.customerSourceTypeName')" prop="customerSourceType">
              <el-select v-model="formData.customerSourceType" size="mini" @change="getList">
                <el-option :label="$t('contract.ALL')" value="" />
                <el-option v-for="(item, index) in customerSourceTypeList" :key="index" :label="item.name" :value="item.code"/>
              </el-select>
            </el-form-item>
            <el-form-item :label='$t("customerManage.customer_abbreviation")' prop="name">
							<el-input class='customer-input' v-model="formData.name" type="text" :placeholder="$t('customerManage.please_enter_customer_abbreviation')" size="mini" clearable @keyup.enter.native="getList" />
						</el-form-item>
						<el-form-item :label="$t('customerManage.create_time')" prop="createTime">
							<search-date-picker v-model="formData.createTime" @change="getList" clearable></search-date-picker>
						</el-form-item>
					</el-form>
				</div>
			</template>
		</top-search-items-slot>
		<div class="">
			<div class="top-btn-wrap mb-10 mt-10">
				<el-button type="primary" size="mini" icon="el-icon-plus" @click="addMember" v-permission="['mem:customer:add']">{{ $t("customerManage.add") }}</el-button>
				<el-button type="primary" size="mini" @click="exportFn">{{ $t("customerManage.export") }}</el-button>
			</div>
			<ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="dataList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :pagination="false"
        :pagination-auto-page-size="false"
        :grid-ready="onReady"
        :style="gridHeight"
        class="ag-theme-balham" />
			<pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList" />
		</div>

		<el-dialog :visible.sync="addVisible" :close-on-click-modal="false" width="500px" :title="$t('customerManage.new_customer')">
			<el-form ref="addPreDataForm" :model="addPreData" :rules="addPreDataRule" label-width="150px" size="mini" class="member-form">
				<el-form-item :label="$t('customerManage.member_type')" prop="type">
					<el-select v-model="addPreData.type" :placeholder="$t('customerManage.please_select')" disabled style="width: 100%">
						<el-option key="1" :label="$t('customerManage.memberType.company')" :value="2"></el-option>
						<el-option key="2" :label="$t('customerManage.memberType.personal')" :value="1"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item :label="$t('customerManage.register_country')" prop="country">
          <base-select type="country" v-model="addPreData.country" filterable @selected="countryChange" style="width: 100%" />
				</el-form-item>

				<el-form-item :label="$t('customerManage.customer_name')" prop="customerName">
					<company-select v-model="addPreData.customerName" :isCN="addPreData.isCN" @change="coustomerChange"></company-select>
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
import { getCustomerListApi, getCustomerTypeListApi, checkCustomerIsUniqueApi, getBusinessTypeListApi, getSalesListApi, exportCustomerListApi, getCustomerSourceTypeApi } from "@/api/partner/customerManage";
import { AgGridVue } from "ag-grid-vue";
import { getCountryListApi } from "@/api/country";
import optionBtn from "./optionBtn";
import { parseTime, formatNumberToThousands } from "@/utils/index";

export default {
	name: "CRMCustomerList",
	components: {
		AgGridVue,
		optionBtn
	},
	data() {
		const validateCompany = (rule, value, callback) => {
			if (value) {
				if (!this.addPreData.country) {
					callback();
					return;
				}
				checkCustomerIsUniqueApi({ countryCode: this.addPreData.country, customerName: value }).then(res => {
					if (res && res.ok && res.content) {
						callback(this.$t("customerManage.customer_name_cannot_be_repeat"));
					} else {
						callback();
					}
				});
			}
		};

		return {
			formData: {
				directCustomerType: "",
				businessType: "",
				sellerId: "",
				name: "",
				createBy: "",
        customerSourceType: "",
				createTime: []
			},

			addVisible: false,
			addPreData: {
				type: 2,
				country: "",
				isCN: true,
				customerName: ""
			},
			addPreDataRule: {
				type: [
					{
						required: true,
						message: this.$t("customerManage.member_type_cannot_be_null"),
						trigger: "change"
					}
				],
				country: [
					{
						required: true,
						message: this.$t("customerManage.register_country_cannot_be_null"),
						trigger: "change"
					}
				],
				customerName: [
					{
						required: true,
						message: this.$t("customerManage.customer_name_cannot_be_null"),
						trigger: "blur"
					},
					{
						validator: validateCompany,
						trigger: "change"
					}
				]
			},
			pageSize: 50,
			pageNum: 0,
			total: 0,
			dataList: [],
			columnFields: [
				{
					field: "no",
					headerName: this.$t("customerManage.member_no"),
					minWidth: 100
				},
				{
					field: "shortName",
					headerName: this.$t("customerManage.customer_abbreviation"),
					minWidth: 100
				},
				{
					field: "chineseName",
					headerName: this.$t("customerManage.chinese_name"),
					minWidth: 200
				},
				{
					field: "englishName",
					headerName: this.$t("customerManage.english_name"),
					minWidth: 200
				},
				{
					field: "directCustomerTypeName",
					headerName: this.$t("customerManage.customer_type"),
					minWidth: 100
				},
				{
					field: "businessTypeStr",
					headerName: this.$t("customerManage.business_type"),
					minWidth: 200
				},
				{
					field: "sellerName",
					headerName: this.$t("customerManage.sales_names"),
					minWidth: 100
				},
				{
					field: "customerSourceTypeName",
					headerName: this.$t("customerManage.customerSourceTypeName"),
					minWidth: 100
				},
				{
					field: "createTime",
					headerName: this.$t("customerManage.create_time"),
					minWidth: 150
				},
				{
					field: "createByName",
					headerName: this.$t("customerManage.create_by_name"),
					minWidth: 100
				},
				{
					field: "id",
					headerName: this.$t("customerManage.operation"),
					cellRendererFramework: "optionBtn",
					minWidth: 100
				}
			],
			sideBarDefs: { toolPanels: ["columns", "filter"], visible: false },
			gridOptions: {
				rowSelection: "single", // 设置多行可选
				animateRows: true,
				suppressRowClickSelection: true // 选中单元格后可以复制内容
			},
			loading: false,
			customerTypeList: [],
      customerSourceTypeList: []
		};
	},
	activated() {
		this.getList();
	},
	created() {
		this.getList();
		this.getBaseDataFn();
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getCustomerTypeListApi(), getCustomerSourceTypeApi()]).then(results => {
				const customerTypeRes = results[0];
				const customerSourceTypeRes = results[1];
				if (customerTypeRes.ok) {
					this.customerTypeList = customerTypeRes.content;
				}
				if (customerSourceTypeRes.ok) {
					this.customerSourceTypeList = customerSourceTypeRes.content;
				}
			});
		},
		addPreConfirm() {
			this.$refs.addPreDataForm.validate(valid => {
				if (valid) {
					this.$router.push({
						name: "CRMCustomerAdd",
						query: {
							country: this.addPreData.country,
							name: this.addPreData.customerName
						}
					});
					this.addVisible = false;
				}
			});
		},
		addMember() {
			this.addVisible = true;
			this.addPreData.customerName = "";
			this.addPreData.country = "";
		},
		countryChange() {
			this.addPreData.isCN = this.addPreData.country === "CN";
		},
		coustomerChange(customer) {
			this.addPreData.customerName = customer.id || customer.value;
		},
		onReady(params) {
			params.api.sizeColumnsToFit();
			window.addEventListener("resize", function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit();
				});
			});
		},
		exportFn() {
			const params = {
				...this.formData
			};
			if (params.createTime.length) {
				params.createTimeStart = this.formData.createTime[0];
				params.createTimeEnd = this.formData.createTime[1];
			}
			delete params.createTime;
			exportCustomerListApi(params).then(res => {
				if (res.ok) {
					this.downloadFile({
						fileName: res.content.originFileName,
						url: res.content.url
					});
				}
			});
		},
		async getList() {
			this.loading = true;
			const params = {
				...this.formData,
				pageSize: this.pageSize,
				pageNum: this.pageNum
			};
			if (params.createTime.length) {
				params.createTimeStart = this.formData.createTime[0];
				params.createTimeEnd = this.formData.createTime[1];
			}
			delete params.createTime;
			const res = await getCustomerListApi(params);
			if (res.ok) {
				res.content.list.forEach(function (v) {
					let businessTypeStr = [];
					v.businessTypes.forEach(x => {
						businessTypeStr.push(x.businessTypeName);
					});
					v.businessTypeStr = businessTypeStr.join("、");
					v.createTime = parseTime(v.createTime, "{y}-{m}-{d} {h}:{i}:{s}");
				});
				this.total = parseInt(res.content.total, 10);
				this.dataList = res.content.list;
			} else {
				this.total = 0;
				this.dataList = [];
			}
			this.loading = false;
		},
		reset() {
			this.$refs.formData.resetFields();
			this.getList();
		}
	}
};
</script>
<style lang="scss" scoped>
.pagination-container {
	margin-top: 0px;
}
.customer-input {
	width: 230px;
}
</style>
