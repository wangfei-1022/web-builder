<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="list" :resetFun="reset">
			<template slot="multipleSearch">
				<div class="multiple-form-wrap">
					<el-form ref="formData" :inline="true" :model="formData" label-width="100px">
						<el-form-item :label='$t("uexpressClaim.chancel_order_no")' prop="chancelOrderNo">
							<el-input v-model="formData.chancelOrderNo" type="text" size="mini"  clearable @keyup.enter.native="list" />
						</el-form-item>
						<el-form-item :label='$t("uexpressClaim.sales_order_no")' prop="salesOrderNo">
							<el-input v-model="formData.salesOrderNo" type="text" size="mini"  clearable @keyup.enter.native="list" />
						</el-form-item>
						<el-form-item :label='$t("uexpressClaim.insurance_no")' prop="insuranceNo">
							<el-input v-model="formData.insuranceNo" type="text" size="mini"  clearable @keyup.enter.native="list" />
						</el-form-item>
            <el-form-item :label='$t("uexpressClaim.outbound_time")' prop="outboundTimePeriod">
              <search-date-picker v-model="formData.outboundTimePeriod" @change="list" clearable></search-date-picker>
            </el-form-item>
            <el-form-item :label='$t("uexpressClaim.insurance_date")' prop="insuranceDatePeriod">
              <search-date-picker v-model="formData.insuranceDatePeriod" @change="list" clearable></search-date-picker>
            </el-form-item>
						<el-form-item :label='$t("uexpressClaim.insurance_state")' prop="insuranceState">
							<el-select v-model="formData.insuranceState" size="mini" @change="list">
								<el-option :label="$t('customerManage.ALL')" value="" />
								<el-option v-for="(item, index) in insuranceStateList" :key="index" :label="item.name" :value="item.code" />
							</el-select>
            </el-form-item>
            <el-form-item :label='$t("uexpressClaim.customer")' prop="customerId">
							<type-select v-model="formData.customerId" type="customer" @selected="list" :requestParams="{businessType: 'INTERNATIONAL_LINE'}"></type-select>
						</el-form-item>
					</el-form>
				</div>
			</template>
		</top-search-items-slot>
		<div class="">
			<div class="top-btn-wrap mb-10 mt-10">
			</div>
			<ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs" :column-defs="columnFields" :row-data="dataList" :enable-col-resize="true" :enable-sorting="true" :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight" class="ag-theme-balham" />
			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="list" />
		</div>
	</div>
</template>

<script>
import { getInsuranceListApi } from "@/api/uexpress/insuranceList";
import { getDictListApi } from "@/api/uexpress/base";
import { AgGridVue } from "ag-grid-vue";
import { parseTime, formatNumberToThousands } from "@/utils/index";

export default {
	name: "UExpressInsuranceList",
	components: {
		AgGridVue
	},
	data() {
		return {
			formData: {
        customerId: '',
        salesOrderNo: '',
        chancelOrderNo: '',
        insuranceNo: '',
        outboundTimePeriod: [],
        insuranceDatePeriod: [],
        insuranceState: ''
			},
			insuranceStateList: [],
			pageSize: 50,
			pageNum: 1,
			total: 0,
			dataList: [],
			columnFields: [
				{
					field: "insuranceNo",
					headerName: this.$t("uexpressClaim.insurance_no"),
					minWidth: 150
				},
				{
					field: "salesOrderNo",
					headerName: this.$t("uexpressClaim.sales_order_no"),
					minWidth: 150
				},
				{
					field: "chancelOrderNo",
					headerName: this.$t("uexpressClaim.chancel_order_no"),
					minWidth: 150
				},
				{
					field: "outboundTime",
					headerName: this.$t("uexpressClaim.outbound_time"),
					minWidth: 150
				},
				{
					field: "insuranceDate",
					headerName: this.$t("uexpressClaim.insurance_date"),
					minWidth: 150
				},
				{
					field: "customerName",
					headerName: this.$t("uexpressClaim.customer"),
					minWidth: 150
				},
				{
					field: "insuranceStateName",
					headerName: this.$t("uexpressClaim.insurance_state"),
					minWidth: 100
				},
				{
					field: "declareAmount",
					headerName: this.$t("uexpressClaim.customer_declare_amount"),
					minWidth: 120,
          type: 'numericColumn'
				},
				{
					field: "declareCurrency",
					headerName: this.$t("uexpressClaim.currency"),
					minWidth: 100
				},
				{
					field: "insuranceExchangeRate",
					headerName: this.$t("uexpressClaim.insurance_exchange_rate"),
					minWidth: 100
				},
				{
					field: "insureAmount",
					headerName: this.$t("uexpressClaim.insure_amount") + '(CNY)',
					minWidth: 150,
          type: 'numericColumn'
				},
				{
					field: "premiumAmount",
					headerName: this.$t("uexpressClaim.premium_amount") + '(CNY)',
					minWidth: 150,
          type: 'numericColumn'
				},
				{
					field: "insurancePushFailMessage",
					headerName: this.$t("uexpressClaim.insurance_push_fail_message"),
					minWidth: 150
				}
			],
			sideBarDefs: { toolPanels: ["columns", "filter"], visible: false },
			gridOptions: {
				rowSelection: "multiple", // 设置多行可选
				animateRows: true,
				suppressRowClickSelection: true, // 选中单元格后可以复制内容
        context: {
					componentParent: this
				}
			},
			loading: false
		};
	},
	created() {
		this.list();
		this.getBaseDataFn();
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getDictListApi(23)]).then(results => {
				const insuranceStateRes = results[0];
				if (insuranceStateRes.ok) {
					this.insuranceStateList = insuranceStateRes.content;
				}
			});
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
				pageNum: this.pageNum
			};
      if (this.formData.outboundTimePeriod.length) {
				params.outboundTimeStart = this.formData.outboundTimePeriod[0] || "";
				params.outboundTimeEnd = this.formData.outboundTimePeriod[1] || "";
			}
      if (this.formData.insuranceDatePeriod.length) {
				params.insuranceDateStart = this.formData.insuranceDatePeriod[0] || "";
				params.insuranceDateEnd = this.formData.insuranceDatePeriod[1] || "";
			}

      delete params.outboundTimePeriod
      delete params.insuranceDatePeriod

			const res = await getInsuranceListApi(params);
			if (res.ok) {
				res.content.list.forEach(function (v) {
					v.outboundTime = parseTime(v.outboundTime, "{y}-{m}-{d} {h}:{i}:{s}");
					v.insuranceDate = parseTime(v.insuranceDate, "{y}-{m}-{d} {h}:{i}:{s}");
          v.declareAmount = formatNumberToThousands(v.declareAmount)
          v.insureAmount = formatNumberToThousands(v.insureAmount)
          v.premiumAmount = formatNumberToThousands(v.premiumAmount)
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
			this.list();
		}
	}
};
</script>
<style lang="scss" scoped>
.pagination-container {
	margin-top: 0px;
}
</style>
