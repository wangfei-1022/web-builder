
<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="getList" :resetFun="reset">
			<template slot="multipleSearch">
				<div class="multiple-form-wrap">
					<el-form ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
						<el-form-item :label="$t('fmsPayableClear.clearNo')" prop="clearNo">
							<el-input v-model="formData.clearNo" type="text" size="mini" clearable @keyup.enter.native="getList" />
						</el-form-item>
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
						<el-form-item :label="$t('fmsPayableClear.clearState')" prop="clearState">
							<fms-select v-model="formData.clearState" type="clearState" @selected="getList" addAll></fms-select>
						</el-form-item>
						<el-form-item :label="$t('fmsPayableClear.clearBy')" prop="clearById">
							<type-select v-model="formData.clearById" type="user" @selected="getList" />
						</el-form-item>
						<el-form-item :label="$t('fmsPayableClear.clearDate')" prop="clearDatePeriod">
							<search-date-picker v-model="formData.clearDatePeriod" @change="getList" clearable></search-date-picker>
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
        <!-- <el-button size="mini" type="primary" @click="agreeFn(false)" >{{$t('fmsPayableClear.approvalAgree')}}</el-button> -->
        <!-- <el-button size="mini" type="primary" @click="agreeFn(true)" >{{$t('fmsPayableClear.approvalAgreeLast')}}</el-button> -->
        <!-- <el-button size="mini" type="primary" @click="rejectFn()" >{{$t('fmsPayableClear.approvalReject')}}</el-button> -->
        <el-button size="mini" type="primary" @click="recalForRepushFn" v-permission="['fms:manage:payable:clear:list:repush']">{{$t('fmsPayableClear.recalForRepush')}}</el-button>
			</div>
			<ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs" :column-defs="columnFields" :row-data="dataList" :enable-col-resize="true" :enable-sorting="true" :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight" class="ag-theme-balham" />
			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList" />
		</div>
    <download-file-dialog ref="downloadFileDialogRef" />
	</div>
</template>

<script>
import {
  getPayableApplyClearListOperatorAllApi,
  getPayableApplyClearListBusinessAllApi,
  payableClearCancelApi,
  payableApplyClearCancelApi,
  payableApplyClearRecallApi, // 撤回核销申请-申请人
  payableApplyClearUrgingApi, // 催办-申请人
  payableClearApprovalRejectApi,
  payableClearApprovalAgreeApi,
  clearApprovalRepushApi
 } from "@/api/financial/fmsPayableClear";
import { AgGridVue } from "ag-grid-vue";
import OperationBtn from "./operationBtn";
import { parseTime, formatNumberToThousands } from "@/utils/index";
import DownloadFileDialog from "@/views/financial/components/DownloadFileDialog";

export default {
	name: "ReceiptClearListAll",
	components: {
		AgGridVue,
		OperationBtn,
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
					field: "clearNo",
					headerName: this.$t('fmsPayableClear.clearNo'),
					minWidth: 150
				},
				{
					field: "instructionNo",
					headerName: this.$t('fmsPayableClear.instructionNo'),
					minWidth: 150
				},
				{
					field: "businessTypeNames",
					headerName: this.$t('fmsPayableClear.businessType'),
					minWidth: 100,
					cellRenderer: params => params.value.join(" 、")
				},
				{
					field: "settlementCompanyName",
					headerName: this.$t('fmsPayableClear.settlementCompany'),
					minWidth: 180
				},
				{
					field: "settlementOfficeName",
					headerName: this.$t('fmsPayableClear.settlementOffice'),
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
					minWidth: 200
				},
				{
					field: "unClearCurrencyAmountGroupStr",
					headerName: this.$t('fmsPayableClear.unClearCurrencyAmountGroupStr'),
					minWidth: 200
				},
				{
					field: "clearCurrencyAmountGroupStr",
					headerName: this.$t('fmsPayableClear.clearCurrencyAmountGroupStr'),
					minWidth: 200
				},
				{
					field: "paymentTypeName",
					headerName: this.$t('fmsPayableClear.payTypeName'),
					minWidth: 100
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
					field: "clearByName",
					headerName: this.$t('fmsPayableClear.clearBy'),
					minWidth: 100
				},
				{
					field: "clearDate",
					headerName: this.$t('fmsPayableClear.clearDate'),
					minWidth: 150
				},
				{
					field: "instructionStateName",
					headerName: this.$t('fmsPayableClear.instructionStateName'),
					minWidth: 100
				},
				{
					field: "clearStateName",
					headerName: this.$t('fmsPayableClear.clearStateName'),
					minWidth: 100
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
      gridApi: {},
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
      this.gridApi = params.api
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
				fn = getPayableApplyClearListBusinessAllApi;
			} else {
				fn = getPayableApplyClearListOperatorAllApi;
			}
			const res = await fn(params);
			if (res.ok) {
				res.content.list.forEach(v => {
					v.role = this.role;
					v.submitDate = parseTime(v.submitDate, "{y}-{m}-{d} {h}:{i}:{s}");
					v.clearDate = parseTime(v.clearDate, "{y}-{m}-{d} {h}:{i}:{s}");

          // 申请核销币种金额
          v.applyClearCurrencyAmountGroupStr = ''
          v.chargeTotalAmounts.forEach(xx => {
            v.applyClearCurrencyAmountGroupStr += xx.sourceCurrency + formatNumberToThousands(xx.sourceValue) + ' '
          })

          // 付款币种金额
          v.paymentCurrencyAmountGroupStr = ''
          v.chargeTotalAmounts.forEach(xx => {
            v.paymentCurrencyAmountGroupStr += xx.currency + formatNumberToThousands(xx.value) + ' '
          })

          // 待销币种金额
          v.unClearCurrencyAmountGroupStr = ''
          v.unClearTotalAmounts.forEach(xx => {
            v.unClearCurrencyAmountGroupStr += xx.currency + formatNumberToThousands(xx.value) + ' '
          })

          // 已销币种金额
          v.clearCurrencyAmountGroupStr = ''
          v.clearTotalAmounts.forEach(xx => {
            v.clearCurrencyAmountGroupStr += xx.currency + formatNumberToThousands(xx.value) + ' '
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
    // 申请人撤回申请
    recallFn(item) {
			this.$confirm(this.$t('fmsPayableClear.recallApplyInfo'), this.$t("common.mention"), {
				confirmButtonText: this.$t("common.confirm"),
				cancelButtonText: this.$t("common.cancel"),
				type: "warning"
			})
				.then(() => {
          this.loading = true
					payableApplyClearRecallApi({ instructionId: item.id }).then(res => {
						if (res.ok) {
							this.getList();
							this.$message.success(this.$t('fmsPayableClear.recallApplySuccess'));
						}
            this.loading = false
					});
				})
				.catch(() => {});
		},
    // 申请人催办
    urgingFn(item) {
			this.$confirm(this.$t('fmsPayableClear.urgingInfo'), this.$t("common.mention"), {
				confirmButtonText: this.$t("common.confirm"),
				cancelButtonText: this.$t("common.cancel"),
				type: "warning"
			})
				.then(() => {
          this.loading = true
					payableApplyClearUrgingApi({ instructionId: item.id }).then(res => {
						if (res.ok) {
							this.getList();
							this.$message.success(this.$t('fmsPayableClear.urgingSuccess'));
						}
            this.loading = false
					});
				})
				.catch(() => {});
		},
    // 财务撤回申请
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
    // 撤回核销操作
		clearCancelFn(item) {
			this.$confirm(this.$t('fmsPayableClear.recallClearInfo'), this.$t("common.mention"), {
				confirmButtonText: this.$t("common.confirm"),
				cancelButtonText: this.$t("common.cancel"),
				type: "warning"
			})
				.then(() => {
          this.loading = true
					payableClearCancelApi({ clearId: item.clearId }).then(res => {
						if (res.ok) {
							this.getList();
							this.$message.success(this.$t('fmsPayableClear.recallClearSuccess'));
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
		},
    rejectFn() {
      let data = {
        instructionId: this.dataList[0].id,
        approvalNodeCode: 'approvalNodeCode',
        approvalNodeName: 'approvalNodeName',
        approvalByCode: 'approvalByCode',
        approvalBy: 'approvalBy',
        approvalTime: new Date().getTime(),
        approvalRemark: 'approvalRemark',
        lastNodeFlag: true
      }
      payableClearApprovalRejectApi(data).then(res => {
        if (res.ok) {
          this.$message.success(this.$t('fmsPayableClear.rejectSuccess'))
        }
      })
    },
    agreeFn(isLast) {
      let data = {
        instructionId: this.dataList[0].id,
        approvalNodeCode: 'approvalNodeCode',
        approvalNodeName: 'approvalNodeName',
        approvalByCode: 'approvalByCode',
        approvalBy: 'approvalBy',
        approvalTime: new Date().getTime(),
        approvalRemark: 'approvalRemark',
        lastNodeFlag: isLast
      }
      payableClearApprovalAgreeApi(data).then(res => {
        if (res.ok) {
          this.$message.success(this.$t('fmsPayableClear.approvalSuccess'))
        }
      })
    },
    recalForRepushFn() {
      let rows = this.gridApi.getSelectedRows()
      if (rows.length !== 1) {
        this.$message.error(this.$t('fmsPayableClear.pleaseSelectOne'))
        return
      }
      if (rows[0].instructionState === 20 || rows[0].instructionState === 30) {

      } else {
        this.$message.error(this.$t('fmsPayablePayment.recalForRepushError'))
        return
      }
      let row = rows[0]
      this.$confirm(this.$t('fmsPayableClear.recalForRepushInfo'), this.$t('fmsPayableClear.recalForRepush'), {
        cancelButtonText: this.$t('common.cancel'),
        confirmButtonText: this.$t('common.confirm')
      }).then(() => {
        this.loading = true
        clearApprovalRepushApi({ instructionId: row.id }).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('fmsPayableClear.recalForRepushSuccess'))
            this.getList()
          }
          this.loading = false
        })
      }).catch(() => {
        // 取消
      });
    },
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
