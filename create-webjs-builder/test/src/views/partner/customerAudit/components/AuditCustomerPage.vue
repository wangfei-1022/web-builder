<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="list" :resetFun="reset">
			<template slot="multipleSearch">
				<div class="multiple-form-wrap">
					<el-form ref="formData" :inline="true" :model="formData" label-width="100px">
						<el-form-item :label='$t("customerManage.searchName")' prop="keyword">
							<el-input v-model="formData.keyword" type="text" :placeholder="$t('customerManage.searchNamePlace')" size="mini" clearable @keyup.enter.native="list" />
						</el-form-item>
						<el-form-item :label="$t('customerManage.business_type')" prop="businessType" v-if="!businessType">
							<el-select v-model="formData.businessType" size="mini" @change="list">
								<el-option :label="$t('customerManage.ALL')" value="" />
								<el-option v-for="(item, index) in businessTypeList" :key="index" :label="item.chineseName" :value="item.code" />
							</el-select>
						</el-form-item>
						<el-form-item :label="$t('customerManage.submitTime')" prop="timePeriod">
							<search-date-picker v-model="formData.timePeriod" @change="list" clearable></search-date-picker>
						</el-form-item>
					</el-form>
				</div>
			</template>
		</top-search-items-slot>
		<div class="">
			<div class="top-btn-wrap mb-10 mt-10"></div>
			<ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs" :column-defs="columnFields" :row-data="userList" :enable-col-resize="true" :enable-sorting="true" :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight" class="ag-theme-balham" />
			<pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="list" />
		</div>
	</div>
</template>

<script>
import { getCustomerAuditListApi } from "@/api/partner/customerAudit";
import { getBusinessTypeListApi } from "@/api/partner/customerManage";

import { AgGridVue } from "ag-grid-vue";
import { getCountryListApi } from "@/api/country";
import optionBtn from "./optionBtn";
import { parseTime, formatNumberToThousands } from "@/utils/index";

export default {
	name: "AuditCustomerPage",
	components: {
		AgGridVue,
		optionBtn
	},
  props: {
    status: {
      type: [String, Number],
      default: ''
    },
    signStatus: {
      type: [String, Number],
      default: ''
    },
    businessType: {
      type: [String, Number],
      default: ''
    },
    origin: {
      type: [String],
      default: ''
    }
  },
	data() {
		return {
			formData: {
				businessType: "",
				keyword: "",
				timePeriod: []
			},
			statusList: [],
			salesList: [],
			countryList: [],
			addVisible: false,
			pageSize: 50,
			pageNum: 0,
			total: 0,
			userList: [],
			columnFields: [
				{
					field: "memberNo",
					headerName: this.$t("customerManage.customerId"),
					minWidth: 100
				},
				{
					field: "memberName",
					headerName: this.$t("customerManage.chinese_name"),
					minWidth: 150
				},
				{
					field: "memberEnName",
					headerName: this.$t("customerManage.english_name"),
					minWidth: 150
				},
				{
					field: "memberTypeName",
					headerName: this.$t("customerManage.customer_type"),
					minWidth: 100
				},
        {
					field: "businessTypeName",
					headerName: this.$t("customerManage.applyBusinessTypeName"),
					minWidth: 120
				},
        {
					field: "memberMobile",
					headerName: this.$t("customerManage.mobile"),
					minWidth: 100
				},
        {
					field: "memberEmail",
					headerName: this.$t("customerManage.email"),
					minWidth: 100
				},
				{
					field: "auditSubmitTime",
					headerName: this.$t('customerManage.submitTime'),
					minWidth: 150
				},
				{
					field: "operation",
					headerName: this.$t("customerManage.operation"),
					cellRendererFramework: "optionBtn",
          pinned: 'right',
					minWidth: 120
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
			customerTypeList: [],
			businessTypeList: []
		};
	},
	activated() {
		this.list();
	},
	created() {
		this.list();
		this.getBaseDataFn();
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getBusinessTypeListApi()]).then(results => {
				const businessTypeRes = results[0];
				if (businessTypeRes.ok) {
					this.businessTypeList = businessTypeRes.content;
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
		async list() {
			this.loading = true;
			const params = {
				...this.formData,
				pageSize: this.pageSize,
				pageNum: this.pageNum,
        status: this.status,
        signStatus: this.signStatus,
        businessType: this.businessType
			};
			if (params.timePeriod.length) {
				params.startTime = this.formData.timePeriod[0];
				params.endTime = this.formData.timePeriod[1];
			}
			delete params.createTime;
			const res = await getCustomerAuditListApi(params);
			if (res.ok) {
				res.content.list.forEach(function (v) {
					v.auditSubmitTime = parseTime(v.auditSubmitTime, "{y}-{m}-{d} {h}:{i}:{s}");
				});
				this.total = parseInt(res.content.total, 10);
				this.userList = res.content.list;
			} else {
				this.total = 0;
				this.userList = [];
			}
			this.loading = false;
		},
		handleSizeChange(size) {
			this.pageSize = size;
			this.list();
		},
		handleCurrentChange(page) {
			this.pageNum = page;
			this.list();
		},
		reset() {
			this.$refs.formData.resetFields();
			this.list();
		},
    detail(item) {
			this.$router.push({
				name: "CRMCustomerAuditDetail",
				query: {
					id: item.id,
          origin: this.origin
				}
			});
		},
		audit(item) {
			this.$router.push({
				name: "CRMCustomerAuditAudit",
				query: {
					id: item.id,
          origin: this.origin
				}
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.pagination-container {
	margin-top: 0px;
}
</style>
