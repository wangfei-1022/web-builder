
<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="getList" :resetFun="reset">
			<template slot="multipleSearch">
				<div class="multiple-form-wrap">
					<el-form ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
						<el-form-item :label="$t('fmsReceiveClear.clearNo')" prop="clearNo">
							<el-input v-model="formData.clearNo" type="text" size="mini" clearable @keyup.enter.native="getList" />
						</el-form-item>
						<el-form-item :label="$t('fmsReceiveClear.instructionNo')" prop="instructionNo">
							<el-input v-model="formData.instructionNo" type="text" clearable @keyup.enter.native="getList" />
						</el-form-item>
						<el-form-item :label="$t('fmsReceiveClear.businessType')" prop="businessType">
							<base-select v-model="formData.businessType" type="businessType"  @selected="getList" addAll></base-select>
						</el-form-item>
						<el-form-item :label="$t('fmsReceiveClear.settlementCompany')" prop="settlementCompanyId">
							<type-select v-model="formData.settlementCompanyId" type="settlementCompany" @selected="getList" />
						</el-form-item>
						<el-form-item :label="$t('fmsReceiveClear.settlementOffice')" prop="settlementOfficeId">
							<base-select v-model="formData.settlementOfficeId" type="settlementOffice" @selected="getList" addAll></base-select>
						</el-form-item>
						<el-form-item :label="$t('fmsReceiveClear.clearState')" prop="clearState">
							<fms-select v-model="formData.clearState" type="clearState" @selected="getList" addAll></fms-select>
						</el-form-item>
						<el-form-item :label="$t('fmsReceiveClear.settlementOffice')" prop="clearBy">
							<type-select v-model="formData.clearById" type="user" @selected="getList" />
						</el-form-item>
						<el-form-item :label="$t('fmsReceiveClear.clearDate')" prop="clearDatePeriod">
							<search-date-picker v-model="formData.clearDatePeriod" @change="getList" clearable></search-date-picker>
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
	</div>
</template>

<script>
import { getClearListAllOffsetApi, getClearListAllToclearOffsetApi, receiptClearOffsetCancelApi, receiptApplyClearCancelApi } from "@/api/financial/fmsReceiptClear";
import { AgGridVue } from "ag-grid-vue";
import OperationBtn from "./operationBtn";
import { parseTime, formatNumberToThousands } from "@/utils/index";

export default {
	name: "ReceiptOffsetClearListAll",
	components: {
		AgGridVue,
		OperationBtn
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
				instructionNo: "",
				clearNo: "",
				businessType: "", // 缺一个业务类型
				settlementCompanyId: "",
				transactionsDatePeriod: [],
				settlementOfficeId: "",
				transactionsReceiptType: "",
				claimState: "",
				instructionState: "",
				clearState: "",
				clearById: "",
				clearDatePeriod: [],
				claimById: ""
			},
			pageSize: 50,
			pageNum: 1,
			total: 0,
			userList: [],
			columnFields: [
				{
					field: "clearNo",
					headerName: this.$t('fmsReceiveClear.clearNo'),
					minWidth: 150
				},
				{
					field: "instructionNo",
					headerName: this.$t('fmsReceiveClear.instructionNo'),
					minWidth: 150
				},
				{
					field: "businessTypeNames",
					headerName: this.$t('fmsReceiveClear.businessType'),
					minWidth: 100,
					cellRenderer: params => params.value.join(" 、")
				},
				{
					field: "settlementCompanyName",
					headerName: this.$t('fmsReceiveClear.settlementCompanyName'),
					minWidth: 100
				},
				{
					field: "settlementOfficeName",
					headerName: this.$t('fmsReceiveClear.settlementOfficeName'),
					minWidth: 200
				},
				{
					field: "arChargeTotalAmounts",
					headerName: this.$t('fmsReceiveClear.arChargeTotalAmounts'),
					type: "numericColumn",
					minWidth: 200,
					cellRenderer: params => {
						let str = "";
						params.value.forEach(v => {
							str += v.currency + formatNumberToThousands(v.value) + " ";
						});
						return str;
					}
				},
				{
					field: "apChargeTotalAmounts",
					headerName: this.$t('fmsReceiveClear.apChargeTotalAmounts'),
					type: "numericColumn",
					minWidth: 200,
					cellRenderer: params => {
						let str = "";
						params.value.forEach(v => {
							str += v.currency + formatNumberToThousands(v.value) + " ";
						});
						return str;
					}
				},
				{
					field: "submitByName",
					headerName: this.$t('fmsReceiveClear.submitByName'),
					minWidth: 100
				},
				{
					field: "submitDate",
					headerName: this.$t('fmsReceiveClear.submitDate'),
					minWidth: 150
				},
				{
					field: "remark",
					headerName: this.$t('fmsReceiveClear.applyRemark'),
					minWidth: 200
				},
				{
					field: "clearByName",
					headerName: this.$t('fmsReceiveClear.clearByName'),
					minWidth: 100
				},
				{
					field: "clearDate",
					headerName: this.$t('fmsReceiveClear.clearDate'),
					minWidth: 150
				},
				{
					field: "instructionStateName",
					headerName: this.$t('fmsReceiveClear.instructionStateName'),
					minWidth: 100
				},
				{
					field: "clearStateName",
					headerName: this.$t('fmsReceiveClear.clearStateName'),
					minWidth: 100
				},
				{
					field: "operation",
					headerName: this.$t("fmsReceiveClear.operation"),
					cellRendererFramework: "OperationBtn",
					minWidth: this.role === "BUSINESS" ? 180 : 80,
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

			if (params.clearDatePeriod.length) {
				params.clearDateStart = this.formData.clearDatePeriod[0];
				params.clearDateEnd = this.formData.clearDatePeriod[1];
			}
			delete params.clearDatePeriod;
			delete params.transactionsDatePeriod;
			let fn = null;
			if (this.role === "BUSINESS") {
				fn = getClearListAllToclearOffsetApi;
			} else {
				fn = getClearListAllOffsetApi;
			}
			const res = await fn(params);
			if (res.ok) {
				res.content.list.forEach(v => {
					v.role = this.role;
					v.clearState = parseTime(v.clearState, "{y}-{m}-{d} {h}:{i}:{s}");
          v.submitDate = parseTime(v.submitDate, "{y}-{m}-{d} {h}:{i}:{s}");
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
				name: "FmsPayableOffsetClearDetail",
				query: {
					id: item.id,
					origin: this.origin,
					operation: "DETAIL"
				}
			});
		},
		applyClearCancelFn(item) {
			this.$confirm(this.$t('fmsReceiveClear.recallApplyInfo'), this.$t("receiveFms.mention"), {
				confirmButtonText: this.$t("common.confirm"),
				cancelButtonText: this.$t("common.cancel"),
				type: "warning"
			})
				.then(() => {
          this.loading = true
					receiptApplyClearCancelApi({ instructionId: item.id }).then(res => {
						if (res.ok) {
							this.getList();
							this.$message.success(this.$t('fmsReceiveClear.recallApplySuccess'));
						}
            this.loading = false
					});
				})
				.catch(() => {});
		},
		clearCancelFn(item) {
			this.$confirm(this.$t('fmsReceiveClear.recallClearInfo'), this.$t("receiveFms.mention"), {
				confirmButtonText: this.$t("common.confirm"),
				cancelButtonText: this.$t("common.cancel"),
				type: "warning"
			})
				.then(() => {
          this.loading = true
					receiptClearOffsetCancelApi({ clearId: item.clearId }).then(res => {
						if (res.ok) {
							this.getList();
							this.$message.success(this.$t('fmsReceiveClear.recallClearSuccess'));
						}
            this.loading = false
					});
				})
				.catch(() => {});
		},
		clearFn(item) {
			this.$router.push({
				name: "FmsPayableOffsetClearDetail",
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
