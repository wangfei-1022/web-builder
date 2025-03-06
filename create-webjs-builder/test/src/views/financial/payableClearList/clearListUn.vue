
<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="getList" :resetFun="reset">
			<template slot="multipleSearch">
				<div class="multiple-form-wrap">
					<el-form ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
						<el-form-item :label="$t('fmsPayableClear.instructionNo')" prop="instructionNo">
							<el-input v-model="formData.instructionNo" type="text" size="mini" clearable @keyup.enter.native="getList" />
						</el-form-item>
						<el-form-item :label="$t('fmsPayableClear.businessType')" prop="businessType">
							<base-select v-model="formData.businessType" type="businessType"  @selected="getList" addAll></base-select>
						</el-form-item>
						<el-form-item :label="$t('fmsPayableClear.settlementCompany')" prop="settlementCompanyId">
							<type-select v-model="formData.settlementCompanyId" type="settlementCompany" @selected="getList" />
						</el-form-item>
						<el-form-item :label="$t('fmsPayableClear.settlementOffice')" prop="settlementOfficeId">
							<base-select v-model="formData.settlementOfficeId" type="settlementOffice" @selected="getList" addAll></base-select>
						</el-form-item>
						<el-form-item :label="$t('fmsPayableClear.submitByName')" prop="submitById" v-if="role === 'BUSINESS'">
							<type-select v-model="formData.submitById" type="user" @selected="getList" />
						</el-form-item>
						<el-form-item :label="$t('fmsPayableClear.submitDate')" prop="submitDatePeriod" v-if="role === 'BUSINESS'">
							<search-date-picker v-model="formData.submitDatePeriod" @change="getList" clearable></search-date-picker>
						</el-form-item>
						<el-form-item :label="$t('fmsPayableClear.localServicePaymentType')" prop="localServicePaymentTypes">
							<fms-select v-model="formData.localServicePaymentTypes" type="localServicePaymentType"  @selected="getList" multiple collapse-tags />
						</el-form-item>
					</el-form>
				</div>
			</template>
		</top-search-items-slot>
		<div class="">
			<div class="top-btn-wrap mb-10 mt-10">
			</div>
			<ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs" :column-defs="columnFields" :row-data="userList" :enable-col-resize="true" :enable-sorting="true" :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight" class="ag-theme-balham" />
			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList" />
		</div>
    <download-file-dialog ref="downloadFileDialogRef" />
	</div>
</template>

<script>
import { getPayableApplyClearListOperatorUnClearApi, getPayableApplyClearListBusinessUnClearApi, payableApplyClearCancelApi } from "@/api/financial/fmsPayableClear";
import { AgGridVue } from "ag-grid-vue";
import OperationBtn from "./operationBtn";
import InstructionNo from './instructionNo';
import { parseTime, formatNumberToThousands } from "@/utils/index";
import { getYHTListApi, getCurrenciesListApi, getBusinessTypeListApi } from "@/api/common";
import { getDictDataApi } from "@/api/financial/fmsReceive";
import DownloadFileDialog from "@/views/financial/components/DownloadFileDialog";

export default {
	name: "ReceiptClearListUn",
	components: {
		AgGridVue,
		OperationBtn,
    InstructionNo,
    DownloadFileDialog
	},
	props: {
		role: {
			type: String,
			default: ""
		},
		origin: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
			formData: {
                localServicePaymentTypes: [],
				instructionNo: "",
				transactionsNo: "",
				businessType: "", // 缺一个业务类型
				settlementCompanyId: "",
				transactionsDatePeriod: [],
				settlementOfficeId: "",
				transactionsReceiptType: "",
				claimState: "",
				instructionState: "",
				clearState: "",
				submitById: "",
				submitDatePeriod: [],
				claimById: ""
			},
			pageSize: 50,
			pageNum: 1,
			total: 0,
			userList: [],
			columnFields: [
				{
					field: "instructionNo",
					headerName: this.$t('fmsPayableClear.instructionNo'),
					minWidth: 150,
          cellRendererFramework: "InstructionNo"
				},
				{
					field: "businessTypeNames",
					headerName: this.$t('fmsPayableClear.businessType'),
					minWidth: 100,
					cellRenderer: params => params.value.join(" 、")
				},
				{
					field: "settlementCompanyName",
					headerName: this.$t('fmsPayableClear.settlementCompanyName'),
					minWidth: 200
				},
				{
					field: "settlementOfficeName",
					headerName: this.$t('fmsPayableClear.settlementOfficeName'),
					minWidth: 200
				},
				{
					field: "localServicePaymentTypeName",
					headerName: this.$t('fmsPayableClear.localServicePaymentType'),
					minWidth: 200
				},
        {
					field: "applyClearCurrencyAmountGroupStr",
					headerName: this.$t('fmsPayableClear.applyClearCurrencyAmountGroupStr'),
					minWidth: 130
				},
        {
					field: "paymentCurrencyAmountGroupStr",
					headerName: this.$t('fmsPayableClear.paymentCurrencyAmountGroupStr'),
					minWidth: 130
				},
				{
					field: "submitByName",
					headerName: this.$t('fmsPayableClear.submitByName'),
					minWidth: 100
				},
				{
					field: "submitDate",
					headerName: this.$t('fmsPayableClear.submitDate'),
					minWidth: 150
				},
				{
					field: "operation",
					headerName: this.$t("fmsPayableClear.operation"),
					cellRendererFramework: "OperationBtn",
					minWidth: 180,
					pinned: "right"
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
			loading: false
		};
	},
	created() {
		this.getList();
	},
  activated() {
    if (this.$route.query.refresh === true) {
      this.getList()
    }
  },
	methods: {
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
			if (params.transactionsDatePeriod.length) {
				params.transactionsDateStart = this.formData.transactionsDatePeriod[0];
				params.transactionsDateEnd = this.formData.transactionsDatePeriod[1];
			}

			if (params.submitDatePeriod.length) {
				params.submitDateStart = this.formData.submitDatePeriod[0];
				params.submitDateEnd = this.formData.submitDatePeriod[1];
			}
			delete params.submitDatePeriod;
			delete params.transactionsDatePeriod;
			let fn = null;
			if (this.role === "BUSINESS") {
				fn = getPayableApplyClearListBusinessUnClearApi;
			} else {
				fn = getPayableApplyClearListOperatorUnClearApi;
			}
			const res = await fn(params);
			if (res.ok) {
				res.content.list.forEach(v => {
					v.role = this.role;
					v.submitDate = parseTime(v.submitDate, "{y}-{m}-{d} {h}:{i}:{s}");

          v.applyClearCurrencyAmountGroupStr = ''
          v.chargeTotalAmounts.forEach(xx => {
            v.applyClearCurrencyAmountGroupStr += xx.sourceCurrency + formatNumberToThousands(xx.sourceValue) + ' '
          })

          v.paymentCurrencyAmountGroupStr = ''
          v.useAmounts.forEach(xx => {
            v.paymentCurrencyAmountGroupStr += xx.currency + formatNumberToThousands(xx.value) + ' '
          })
				});
				this.total = parseInt(res.content.total, 10);
				this.userList = res.content.list;
			} else {
				this.total = 0;
				this.userList = [];
			}
			this.loading = false;
		},
		// 查看
		viewFn(item) {
			this.$router.push({
				name: "FmsPayableClearDetail",
				query: {
					id: item.id,
					origin: this.origin,
					operation: "DETAIL"
				}
			});
		},
    // 下载文件
    downloadFn(item) {
      this.$refs.downloadFileDialogRef.show(item.id, 'PAYABLE_CLEAR')
    },
		applyClearCancelFn(item) {
			this.$confirm(this.$t('fmsPayableClear.recallApplyInfo'), this.$t("common.mention"), {
				confirmButtonText: this.$t("common.confirm"),
				cancelButtonText: this.$t("common.cancel"),
				type: "warning"
			})
				.then(() => {
          this.loading = true
					payableApplyClearCancelApi({ instructionId: item.id }).then(res => {
						if (res.ok) {
							this.getList();
							this.$message.success(this.$t('fmsPayableClear.recallApplySuccess'));
						}
            this.loading = false
					});
				})
				.catch(() => {});
		},
		clearFn(item) {
			this.$router.push({
				name: "FmsPayableClearDetail",
				query: {
					id: item.id,
					origin: this.origin,
					operation: "CLEAR"
				}
			});
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
.record-container {
	.title {
		font-size: 18px;
		margin-bottom: 20px;
		font-weight: 600;
		padding-bottom: 12px;
		border-bottom: 1px solid #eee;
	}
	.record-container-content {
		overflow: hidden;
		.record-item {
			float: left;
			width: 50%;
			margin-bottom: 15px;
			display: flex;

			label {
				width: 120px;
				min-width: 120px;
				display: block;
				text-align: right;
				margin-bottom: 15px;
				font-weight: 500;
				font-size: 14px;
				float: left;
				margin-right: 6px;
			}
			span {
				font-weight: 500;
				font-size: 14px;
				display: inline;
				flex: 1;
			}
		}
	}
}
</style>
