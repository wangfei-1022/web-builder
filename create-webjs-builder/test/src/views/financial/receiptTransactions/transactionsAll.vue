<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="getList" :resetFun="reset">
			<template slot="multipleSearch">
				<div class="multiple-form-wrap">
					<el-form ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
						<el-form-item :label='$t("fmsReceiptTransactions.transactions_no")' prop="transactionsNo">
							<el-input v-model="formData.transactionsNo" type="text" size="mini" clearable @keyup.enter.native="getList" />
						</el-form-item>
						<el-form-item :label="$t('fmsReceiptTransactions.business_type')" prop="businessType">
							<el-select v-model="formData.businessType" size="mini" @change="getList">
								<el-option :label="$t('common.ALL')" value="" />
								<el-option v-for="(item, index) in businessTypeList" :key="index" :label="item.chineseName" :value="item.code" />
							</el-select>
						</el-form-item>
						<el-form-item :label="$t('fmsReceiptTransactions.payer_company')" prop="payerName">
							<!-- <el-input v-model="formData.payerName" type="text" size="mini" clearable @keyup.enter.native="getList" /> -->
              <type-autocomplete v-model="formData.payerName" type="member" size="mini" clearable @selected="payerNameSelected" />
						</el-form-item>
						<el-form-item :label="$t('fmsReceiptTransactions.settlement_company')" prop="settlementCompanyId">
							<type-select v-model="formData.settlementCompanyId" type="settlementCompany" @selected="getList" />
						</el-form-item>
						<el-form-item :label="$t('fmsReceiptTransactions.transactions_date')" prop="transactionsDatePeriod">
							<search-date-picker v-model="formData.transactionsDatePeriod" @change="getList" clearable></search-date-picker>
						</el-form-item>
						<el-form-item :label="$t('fmsReceiptTransactions.settlement_office')" prop="settlementOfficeId" v-if="false">
							<el-select v-model="formData.settlementOfficeId" size="mini" @change="getList">
								<el-option :label="$t('common.ALL')" value="" />
								<el-option v-for="item in YHTList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item :label="$t('fmsReceiptTransactions.transactions_type')" prop="transactionsType">
							<el-select v-model="formData.transactionsType" size="mini" @change="getList">
								<el-option :label="$t('common.ALL')" value="" />
								<el-option v-for="item in transactionsTypeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item :label="$t('fmsReceiptTransactions.account_collect')" prop="accountCollectCategory">
							<el-cascader v-model="formData.accountCollectCategory" :options="YHTAccountAllList" size="mini" clearable @change="getList"></el-cascader>
						</el-form-item>
						<el-form-item :label="$t('fmsReceiptTransactions.claim_state')" prop="claimState">
							<el-select v-model="formData.claimState" size="mini" @change="getList">
								<el-option :label="$t('common.ALL')" value="" />
								<el-option v-for="item in claimStateList" :key="item.code" :label="item.name" :value="item.code"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item :label="$t('fmsReceiptTransactions.instruction_state')" prop="instructionState">
							<el-select v-model="formData.instructionState" size="mini" @change="getList">
								<el-option :label="$t('common.ALL')" value="" />
								<el-option v-for="item in instructionStateList" :key="item.code" :label="item.name" :value="item.code"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item :label="$t('fmsReceiptTransactions.clear_state')" prop="clearState">
							<el-select v-model="formData.clearState" size="mini" @change="getList">
								<el-option :label="$t('common.ALL')" value="" />
								<el-option v-for="item in clearStateList" :key="item.code" :label="item.name" :value="item.code"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item :label="$t('fmsReceiptTransactions.record_by')" prop="recordById">
							<type-select v-model="formData.recordById" type="user" @selected="getList" />
						</el-form-item>
						<el-form-item :label="$t('fmsReceiptTransactions.record_date')" prop="recordDatePeriod">
							<search-date-picker v-model="formData.recordDatePeriod" @change="getList" clearable></search-date-picker>
						</el-form-item>
						<el-form-item :label="$t('fmsReceiptTransactions.claim_by')" prop="claimById">
							<type-select v-model="formData.claimById" type="user" @selected="getList" />
						</el-form-item>
					</el-form>
				</div>
			</template>
		</top-search-items-slot>
		<div class="">
			<div class="top-btn-wrap mb-10 mt-10">
				<el-button type="primary" size="mini" icon="el-icon-plus" @click="addFn" v-if="role == 'FINANCE'">{{$t('fmsReceiptTransactions.record_transactions')}}</el-button>
				<el-button type="primary" size="mini" @click="importFn" v-if="role == 'FINANCE'">{{$t('fmsReceiptTransactions.export_transaction')}}</el-button>
				<el-button type="primary" size="mini" @click="exportFn">{{$t('fmsReceiptTransactions.export')}}</el-button>
			</div>
			<ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs" :column-defs="columnFields" :row-data="userList" :enable-col-resize="true" :enable-sorting="true" :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight" class="ag-theme-balham" />
			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList" />
		</div>

		<record-modal ref="recordModalRef" :currencyList="currencyList" :payTypeList="payTypeList" :YHTList="YHTList" @success="getList" />
		<export-transactions ref="exportModalRef" @success="getList" />
	</div>
</template>

<script>
import { getTransactionsReceiptListApi, transactionReceiptCancelApi, getYHTReceiptCategoryAllApi, walletTransactionExportApi } from "@/api/financial/fmsReceiptTransactions";
import { AgGridVue } from "ag-grid-vue";
import transactionsOperationBtn from "./transactionsOperationBtn";
import { parseTime, formatNumberToThousands } from "@/utils/index";
import { getYHTListApi, getCurrenciesListApi, getBusinessTypeListApi } from "@/api/common";
import { getDictDataApi } from "@/api/financial/fmsReceive";
import recordModal from "./components/recordModal";
import exportTransactions from "./components/exportTransactions";

export default {
	name: "ReceiptTransactionsAll",
	components: {
		AgGridVue,
		transactionsOperationBtn,
		recordModal,
		exportTransactions
	},
	props: {
		role: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
			formData: {
				transactionsNo: "",
				payerName: "",
				payerMemberId: "",
        payerMemberName: '',
        payerMemberEnglishName: '',
				businessType: "", // 缺一个业务类型
				settlementCompanyId: "",
				transactionsDatePeriod: [],
				settlementOfficeId: "",
				transactionsType: "",
				claimState: "",
				instructionState: "",
				clearState: "",
				recordById: "",
				recordDatePeriod: [],
				claimById: "",
				accountCollectCategory: []
			},
			pageSize: 50,
			pageNum: 1,
			total: 0,
			userList: [],
			columnFields: [
				{
					field: "transactionsNo",
					headerName: this.$t('fmsReceiptTransactions.transactions_no'),
					minWidth: 120
				},
        {
					field: "payerName",
					headerName: this.$t('fmsReceiptTransactions.payer_company'),
					minWidth: 130
				},
				{
					field: "businessTypeNames",
					headerName: this.$t('fmsReceiptTransactions.business_type'),
					minWidth: 100,
					cellRenderer: params => params.value.join(",")
				},
				{
					field: "settlementCompanyName",
					headerName: this.$t('fmsReceiptTransactions.settlement_company'),
					minWidth: 200
				},
				{
					field: "settlementOfficeName",
					headerName: this.$t('fmsReceiptTransactions.settlement_office'),
					minWidth: 200
				},
				{
					field: "transactionsTypeNames",
					headerName: this.$t('fmsReceiptTransactions.transactions_type'),
					minWidth: 90
				},
				{
					field: "accountCollectName",
					headerName: this.$t('fmsReceiptTransactions.account_collect'),
					minWidth: 130
				},
				{
					field: "transactionsAmountStr",
					headerName: this.$t('fmsReceiptTransactions.transactions_amount_currcny'),
					minWidth: 130,
					type: "numericColumn"
				},
				{
					field: "claimedAmount",
					headerName: this.$t('fmsReceiptTransactions.claimed_amount'),
					minWidth: 100,
					type: "numericColumn"
				},
				{
					field: "unClaimAmount",
					headerName: this.$t('fmsReceiptTransactions.un_claim_amount'),
					minWidth: 100,
					type: "numericColumn"
				},
				{
					field: "transactionsDate",
					headerName: this.$t('fmsReceiptTransactions.transactions_date'),
					minWidth: 150
				},
				{
					field: "remark",
					headerName: this.$t('fmsReceiptTransactions.transactions_remark'),
					minWidth: 100
				},
				{
					field: "recordByName",
					headerName: this.$t('fmsReceiptTransactions.record_by'),
					minWidth: 100
				},
				{
					field: "recordDate",
					headerName: this.$t('fmsReceiptTransactions.record_date'),
					minWidth: 150
				},
				{
					field: "claimByName",
					headerName: this.$t('fmsReceiptTransactions.claim_by'),
					minWidth: 100
				},
				{
					field: "claimDate",
					headerName: this.$t('fmsReceiptTransactions.claim_date'),
					minWidth: 150
				},
				{
					field: "claimRemark",
					headerName: this.$t('fmsReceiptTransactions.claim_remark'),
					minWidth: 100
				},
				{
					field: "claimStateName",
					headerName: this.$t('fmsReceiptTransactions.claim_state'),
					minWidth: 100
				},
				{
					field: "instructionStateName",
					headerName: this.$t('fmsReceiptTransactions.instruction_state'),
					minWidth: 90,
					cellRenderer: params => `<span style="color: #1890ff;">${params.value}</span>`
				},
				{
					field: "clearStateName",
					headerName: this.$t('fmsReceiptTransactions.clear_state'),
					minWidth: 90,
					cellRenderer: params => `<span style="color: #1890ff;">${params.value}</span>`
				},
				{
					field: "id",
					headerName: this.$t("fmsReceiptTransactions.operation"),
					cellRendererFramework: "transactionsOperationBtn",
					minWidth: 100,
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
			loading: false,
			businessTypeList: [],
			YHTAccountAllList: [],
			YHTList: [], // 分公司
			YHTAccountList: [], // 分公司收款账户
			currencyList: [], // 币种
			thirdPartyCodeList: [], // 第三方下拉列表
			payTypeList: [], // 付款来源类型
			transactionsTypeList: [], // 收款类型
			claimStateList: [], // 认领状态
			instructionStateList: [], // 申请核销状态
			clearStateList: [] // 核销状态
		};
	},
	created() {
		this.getList();
		this.getBaseDataFn();
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
		getBaseDataFn() {
			Promise.all([getYHTListApi(), getCurrenciesListApi(), getDictDataApi(22), getDictDataApi(23), getBusinessTypeListApi(), getDictDataApi(25), getDictDataApi(26), getDictDataApi(4), getYHTReceiptCategoryAllApi()]).then(results => {
				const yhtRes = results[0];
				const currencyRes = results[1];
				const payTypeRes = results[2];
				const transactionsTypeRes = results[3];
				const businessTypeRes = results[4];
				const instructionStateRes = results[5];
				const claimStateRes = results[6];
				const clearStateRes = results[7];
				const YHTAccountAllRes = results[8];

				if (yhtRes.ok) {
					this.YHTList = yhtRes.content;
				}
				if (currencyRes.ok) {
					this.currencyList = currencyRes.content;
				}
				if (payTypeRes.ok) {
					this.payTypeList = payTypeRes.content;
				}
				if (transactionsTypeRes.ok) {
					this.transactionsTypeList = transactionsTypeRes.content;
				}
				if (businessTypeRes.ok) {
					this.businessTypeList = businessTypeRes.content;
				}
				if (instructionStateRes.ok) {
					this.instructionStateList = instructionStateRes.content;
				}
				if (claimStateRes.ok) {
					this.claimStateList = claimStateRes.content;
				}
				if (clearStateRes.ok) {
					this.clearStateList = clearStateRes.content;
				}
				if (YHTAccountAllRes.ok) {
					let arr = [];
					YHTAccountAllRes.content.forEach(office => {
						let officeItem = {
							value: office.officeId,
							label: office.officeName,
							children: []
						};
						office.categorys.forEach(account => {
							let categoryItem = {
								value: account.category,
								label: account.category
							};
							officeItem.children.push(categoryItem);
						});
						arr.push(officeItem);
					});
					this.YHTAccountAllList = arr;
				}
			});
		},
		payerNameSelected(item) {
			this.formData.payerMemberId = item.id
      this.formData.payerMemberName = item.chineseName
      this.formData.payerMemberEnglishName = item.englishName
			if (item.id) {
				this.getList()
			}
		},

    forMatData() {
      let params = {
        ...this.formData
      }
      if (params.transactionsDatePeriod.length) {
				params.transactionsDateStart = this.formData.transactionsDatePeriod[0];
				params.transactionsDateEnd = this.formData.transactionsDatePeriod[1];
			}

			if (params.recordDatePeriod.length) {
				params.recordDateStart = this.formData.recordDatePeriod[0];
				params.recordDateEnd = this.formData.recordDatePeriod[1];
			}

			if (params.accountCollectCategory.length > 1) {
				params.settlementOfficeId = params.accountCollectCategory[0];
				params.accountCollectCategory = params.accountCollectCategory[1];
			} else if (params.accountCollectCategory.length > 0) {
				params.settlementOfficeId = params.accountCollectCategory[0];
        delete params.accountCollectCategory
			} else {
        delete params.accountCollectCategory
      }
			delete params.recordDatePeriod;
			delete params.transactionsDatePeriod;

			if (params.payerMemberId) {
				delete params.payerName
			} else {
				delete params.payerMemberId
			}

      return params
    },
		async getList() {
			this.loading = true;
      let getData = this.forMatData()
			const params = {
				...getData,
				pageSize: this.pageSize,
				pageNum: this.pageNum
			};

			const res = await getTransactionsReceiptListApi(params);
			if (res.ok) {
				res.content.list.forEach(v => {
					v.role = this.role;
					v.transactionsDate = parseTime(v.transactionsDate, "{y}-{m}-{d} {h}:{i}:{s}");
					v.recordDate = parseTime(v.recordDate, "{y}-{m}-{d} {h}:{i}:{s}");
					v.claimDate = parseTime(v.claimDate, "{y}-{m}-{d} {h}:{i}:{s}");
					v.transactionsAmountStr = v.transactionsCurrency + " " + formatNumberToThousands(v.transactionsAmount);
					v.claimedAmount = formatNumberToThousands(v.claimedAmount);
					v.unClaimAmount = formatNumberToThousands(v.unClaimAmount);
				});
				this.total = parseInt(res.content.total, 10);
				this.userList = res.content.list;
			} else {
				this.total = 0;
				this.userList = [];
			}
			this.loading = false;
		},
		// 登记收款
		addFn() {
			this.$refs.recordModalRef.show();
		},
    // 导入
		importFn() {
			this.$refs.exportModalRef.show();
		},
    // 导出
    exportFn() {
      let getData = this.forMatData()
      let data = {
        transactionsQuery: {
          ...getData
        }
      }
      walletTransactionExportApi(data).then(res => {
        if (res.ok) {
          this.$message.success(this.$t("fmsReceiptTransactions.exportSuccess"));
        }
      })
    },
		// 查看
		viewFn(item) {
			this.$router.push({
				name: "TransactionsReceiptDetail",
				query: {
					id: item.id,
					backPath: this.$route.name
				}
			});
		},
		// 撤回
		deleteFn(item) {
			this.$confirm(this.$t("fmsReceiptTransactions.confirm_delete"), this.$t("common.mention"), {
				confirmButtonText: this.$t("common.confirm"),
				cancelButtonText: this.$t("common.cancel"),
				type: "warning"
			})
				.then(() => {
					transactionReceiptCancelApi({ transactionsIds: [item.id] }).then(res => {
						if (res.ok) {
							this.$message.success(this.$t("fmsReceiptTransactions.delete_success"));
							this.getList();
						}
					});
				})
				.catch(() => {});
		},
		reset() {
			this.formData.payerMemberId = ''
      this.formData.payerMemberName = ''
      this.formData.payerMemberEnglishName = ''
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
