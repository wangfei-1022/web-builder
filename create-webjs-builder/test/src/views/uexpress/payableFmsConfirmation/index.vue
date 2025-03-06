<template>
	<div class="right-main-wrapper product-line-container" v-loading="loading">
    <top-search-items-slot :searchFun="getList" :resetFun="reset" >
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
            <el-form-item :label='$t("uexpressFmsCharge.orderNo")' prop="orderNo">
              <el-input v-model="formData.orderNo" type="text" />
            </el-form-item>
            <el-form-item :label='$t("uexpressFmsCharge.billName")' prop="billName">
              <el-input v-model="formData.billName" type="text" />
            </el-form-item>
            <el-form-item :label='$t("uexpressFmsCharge.confirmationStateName")' prop="confirmationState">
              <fms-select v-model="formData.confirmationState" type="confirmationState" addAll />
            </el-form-item>
            <el-form-item :label='$t("uexpressFmsCharge.entryStateName")' prop="entryState">
              <fms-select v-model="formData.entryState" type="entryState" addAll />
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>

    <div class="mt-20">
      <div class="top-btn-wrap mb-10 mt-10">

			</div>
			<ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs" :column-defs="columnFields" :row-data="dataList" :enable-col-resize="true" :enable-sorting="true" :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight" class="ag-theme-balham" />
			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList" />
		</div>
	</div>
</template>

<script>
import { getPayableConfirmationListApi } from "@/api/uexpress/payableFmsBill";
import { getDictListApi, getChargeCategoryListApi } from "@/api/uexpress/base";
import { AgGridVue } from "ag-grid-vue";
import OptionBtn from "./optionBtn";
import { parseTime, formatNumberToThousands } from "@/utils/index";

export default {
	name: "UExpressPayableFmsConfirmationList",
	components: {
		AgGridVue,
    OptionBtn
	},
	data() {
		return {
			formData: {
        categoryCode: '',
        feeItemCode: ''
			},
			pageSize: 50,
			pageNum: 1,
			total: 0,
			dataList: [],
      categoryList: [],
			columnFields: [{
					field: "confirmationNo",
					headerName: this.$t("uexpressFmsCharge.confirmationNo"),
					minWidth: 150
				}, {
					field: "orderNo",
					headerName: this.$t("uexpressFmsCharge.orderNo"),
					minWidth: 180
				}, {
					field: "channelOrderNo",
					headerName: this.$t("uexpressFmsCharge.channelOrderNo"),
					minWidth: 150
				}, {
					field: "supplierBillName",
					headerName: this.$t("uexpressFmsCharge.billName"),
					minWidth: 150
				}, {
					field: "supplierProductName",
					headerName: this.$t("uexpressFmsCharge.supplierProductName"),
					minWidth: 150
				}, {
					field: "supplierName",
					headerName: this.$t("uexpressFmsCharge.supplierName"),
					minWidth: 150
				}, {
					field: "outboundTime",
					headerName: this.$t("uexpressFmsCharge.outboundTime"),
					minWidth: 150
				}, {
					field: "weight",
					headerName: this.$t("uexpressFmsCharge.actWeight"),
					minWidth: 120
				}, {
					field: "dimension",
					headerName: this.$t("uexpressFmsCharge.actDimension"),
					minWidth: 120
				}, {
					field: "currencyAmountsStr",
					headerName: this.$t("uexpressFmsCharge.totalAmount"),
					minWidth: 120
				}, {
					field: "confirmationStateName",
					headerName: this.$t("uexpressFmsCharge.confirmationStateName"),
					minWidth: 100
				}, {
					field: "entryStateName",
					headerName: this.$t("uexpressFmsCharge.entryStateName"),
					minWidth: 100
				}, {
          field: "optionBtn",
          headerName: this.$t("uexpressFmsCharge.operation"),
          cellRendererFramework: "OptionBtn",
          pinned: 'right',
          minWidth: 100
        }],
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
		this.getList();
		this.getBaseDataFn();
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getChargeCategoryListApi(), getDictListApi(42)]).then(results => {
				const countryRes = results[0];
        if (countryRes.ok) {
					this.categoryList = countryRes.content;
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
		async getList() {
			this.loading = true;
			const params = {
				...this.formData,
				pageSize: this.pageSize,
				pageNum: this.pageNum
			};
			const res = await getPayableConfirmationListApi(params);
			if (res.ok) {
				res.content.list.forEach(function (item, index) {
          item.index = index + 1
          item.outboundTime = parseTime(item.outboundTime, "{y}-{m}-{d} {h}:{i}:{s}")
          item.currencyAmountsStr = ''
          item.currencyAmounts.forEach(v => {
						item.currencyAmountsStr += formatNumberToThousands(v.value) + v.currency
					})
				});
				this.total = parseInt(res.content.total, 10);
				this.dataList = res.content.list;
			} else {
				this.total = 0;
				this.dataList = [];
			}
			this.loading = false;
		},
    viewFn(row) {
      this.$router.push({
        name: 'UexpressPayableFmsConfirmationDetail',
        query: {
          confirmationId: row.confirmationId,
          orderId: row.orderId
        }
      })
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
</style>
