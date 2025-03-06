<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="list" :resetFun="reset">
			<template slot="multipleSearch">
				<div class="multiple-form-wrap">
					<el-form ref="formData" :inline="true" :model="formData" label-width="100px">
						<el-form-item :label='$t("uexpressClaim.chancel_order_no")' prop="chancelOrderNo">
							<el-input v-model="formData.chancelOrderNo" type="text" size="mini"  clearable @keyup.enter.native="list"></el-input>
						</el-form-item>
            <el-form-item :label='$t("uexpressClaim.sales_order_no")' prop="salesOrderNo">
							<el-input v-model="formData.salesOrderNo" type="text" size="mini"  clearable @keyup.enter.native="list"></el-input>
						</el-form-item>
            <el-form-item :label='$t("uexpressClaim.order_outbound_time")' prop="outboundTimePeriod">
              <search-date-picker v-model="formData.outboundTimePeriod" @change="list" clearable ></search-date-picker>
            </el-form-item>
            <el-form-item :label='$t("uexpressClaim.claim_timer_sp")' prop="claimDatePeriod">
              <search-date-picker v-model="formData.claimDatePeriod" @change="list" clearable ></search-date-picker>
            </el-form-item>
            <el-form-item :label='$t("uexpressClaim.customer")' prop="customerId">
							<type-select v-model="formData.customerId" type="customer" @selected="list" :requestParams="{businessType: 'INTERNATIONAL_LINE'}"></type-select>
						</el-form-item>
            <el-form-item :label='$t("uexpressClaim.claim_reason")' prop="claimReason">
              <el-select v-model="formData.claimReason" size="mini" @change="list">
								<el-option :label="$t('common.ALL')" value="" />
								<el-option v-for="(item, index) in claimReasonList" :key="index" :label="item.name" :value="item.code" />
							</el-select>
            </el-form-item>
            <el-form-item :label='$t("uexpressClaim.claim_type")' prop="claimType">
              <el-select v-model="formData.claimType" size="mini" @change="list">
								<el-option :label="$t('common.ALL')" value="" />
								<el-option v-for="(item, index) in claimTypeList" :key="index" :label="item.name" :value="item.code" />
							</el-select>
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
import { getClaimSummaryListApi } from "@/api/uexpress/claimSummaryList";
import { getDictListApi } from "@/api/uexpress/base";
import { AgGridVue } from "ag-grid-vue";
import { parseTime, formatNumberToThousands, addFloatNum } from "@/utils/index";
import OrderNoComponent from "@/views/uexpress/order/components/OrderNo";
import MemberOrderNoComponent from "@/views/uexpress/order/components/MemberOrderNo";
import OrderChannelNoComponent from "@/views/uexpress/order/components/OrderChannelNo";

export default {
	name: "UExpressClaimSummaryList",
	components: {
		AgGridVue,
    OrderNoComponent,
    MemberOrderNoComponent,
    OrderChannelNoComponent
	},
	data() {
		return {
			formData: {
        customerId: '',
        salesOrderNo: '',
        chancelOrderNo: '',
        claimDatePeriod: [],
        outboundTimePeriod: [],
        claimType: '',
        claimReason: ''
			},
			claimReasonList: [],
      claimTypeList: [],
			pageSize: 50,
			pageNum: 1,
			total: 0,
			dataList: [],
			columnFields: [{
          field: 'index',
          headerName: '',
          width: 55,
          pinned: 'left',
          suppressSorting: true,
          checkboxSelection: true,
          suppressMenu: true,
          suppressSizeToFit: true,
          suppressResize: true,
          headerCheckboxSelection: true
        },
				{
					field: "salesOrderNo",
					headerName: this.$t("uexpressClaim.sales_order_no"),
					minWidth: 150,
          cellRendererFramework: "OrderNoComponent"
				},
				{
					field: "chancelOrderNo",
					headerName: this.$t("uexpressClaim.chancel_order_no"),
					minWidth: 150,
          cellRendererFramework: "OrderChannelNoComponent"
				},
				{
					field: "customerName",
					headerName: this.$t("uexpressClaim.customer_name"),
					minWidth: 150
				},
				{
					field: "outboundTime",
					headerName: this.$t("uexpressClaim.order_outbound_time"),
					minWidth: 150
				},
				{
					field: "claimDate",
					headerName: this.$t("uexpressClaim.claim_time"),
					minWidth: 150
				},
				{
					field: "claimReasonName",
					headerName: this.$t("uexpressClaim.claim_reason"),
					minWidth: 100
				},
				{
					field: "claimType",
					headerName: this.$t("uexpressClaim.claim_type"),
					minWidth: 100
				},
				{
					field: "claimAmountsAll",
					headerName: this.$t("uexpressClaim.claim_amount_all"),
					minWidth: 150,
          type: 'numericColumn'
				},
				{
					field: "premiumAmount",
					headerName: this.$t("uexpressClaim.premium_amount_pay"),
					minWidth: 100,
          type: 'numericColumn'
				},
				{
					field: "insurerClaimAmountsAll",
					headerName: this.$t("uexpressClaim.insurer_claim_amounts_all"),
					minWidth: 160,
          type: 'numericColumn'
				},
				{
					field: "supplierClaimAmountsAll",
					headerName: this.$t("uexpressClaim.supplier_claim_amounts_all"),
					minWidth: 160,
          type: 'numericColumn'
				},
				{
					field: "claimRemarks",
					headerName: this.$t("uexpressClaim.customer_claim_remark"),
					minWidth: 160
				},
				{
					field: "supplierClaimRemarks",
					headerName: this.$t("uexpressClaim.supplier_claim_remark"),
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
			loading: false,
      gridApi: {},

      // 批量导入
      batchImportVisible: false,
      importForm: {
        claimFile: []
      },
      importFormRule: {
        claimFile: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      }
		};
	},
	created() {
		this.list();
		this.getBaseDataFn();
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getDictListApi(20), getDictListApi(21)]).then(results => {
				const claimReasonRes = results[0];
        const claimTypeRes = results[1];
				if (claimReasonRes.ok) {
					this.claimReasonList = claimReasonRes.content;
				}
				if (claimTypeRes.ok) {
					this.claimTypeList = claimTypeRes.content;
				}
			});
		},

		onReady(params) {
      this.gridApi = params.api
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
      if (this.formData.claimDatePeriod.length) {
				params.claimDateStart = this.formData.claimDatePeriod[0] || "";
				params.claimDateEnd = this.formData.claimDatePeriod[1] || "";
			}

      delete params.outboundTimePeriod
      delete params.claimDatePeriod

			const res = await getClaimSummaryListApi(params);
			if (res.ok) {
				res.content.list.forEach(function (v) {
          v.claimDate = parseTime(v.claimDate, "{y}-{m}-{d} {h}:{i}:{s}");
					v.outboundTime = parseTime(v.outboundTime, "{y}-{m}-{d} {h}:{i}:{s}");

          let supplierClaimAmountsAll = 0
          v.supplierClaimAmounts.forEach(curreny => {
            supplierClaimAmountsAll = addFloatNum(supplierClaimAmountsAll, curreny.value)
          })
          v.supplierClaimAmountsAll = formatNumberToThousands(supplierClaimAmountsAll)

          let insurerClaimAmountsAll = 0
          v.insurerClaimAmounts.forEach(curreny => {
            insurerClaimAmountsAll = addFloatNum(insurerClaimAmountsAll, curreny.value)
          })
          v.insurerClaimAmountsAll = formatNumberToThousands(insurerClaimAmountsAll)

          let claimAmountsAll = 0
          v.claimAmounts.forEach(curreny => {
            claimAmountsAll = addFloatNum(claimAmountsAll, curreny.value)
          })
          v.claimAmountsAll = formatNumberToThousands(claimAmountsAll)
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
