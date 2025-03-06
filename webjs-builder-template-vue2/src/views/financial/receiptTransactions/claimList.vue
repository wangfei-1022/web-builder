<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="getList" :resetFun="reset">
			<template slot="multipleSearch">
				<div class="multiple-form-wrap">
					<el-form ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
						<el-form-item :label="$t('fmsReceiptTransactions.transactions_no')" prop="transactionsNo">
							<el-input v-model="formData.transactionsNo" type="text" size="mini" clearable @keyup.enter.native="getList" />
						</el-form-item>
						<el-form-item :label="$t('fmsReceiptTransactions.business_type')" prop="businessType">
							<el-select v-model="formData.businessType" size="mini" @change="getList">
								<el-option :label="$t('customerManage.ALL')" value="" />
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
						<el-form-item :label="$t('fmsReceiptTransactions.claim_by')" prop="claimById" v-if="role == 'BUSINESS' && type== 'ALL'">
							<type-select v-model="formData.claimById" type="user" @selected="getList" />
						</el-form-item>
						<el-form-item :label="$t('fmsReceiptTransactions.claim_date')" prop="claimDatePeriod" v-if="role == 'BUSINESS' && type== 'ALL'">
							<search-date-picker v-model="formData.claimDatePeriod" @change="getList" clearable></search-date-picker>
						</el-form-item>
					</el-form>
				</div>
			</template>
		</top-search-items-slot>
		<div class="">
			<div class="top-btn-wrap mb-10 mt-10">
        <el-button size="mini" type="primary" @click="exportFn" v-if="role == 'BUSINESS' && type== 'ALL'">{{$t('fmsReceiptTransactions.export')}}</el-button>
			</div>
			<ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs" :column-defs="columnFields" :row-data="userList" :enable-col-resize="true" :enable-sorting="true" :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight" class="ag-theme-balham" />
			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList" />
		</div>

		<el-dialog :visible.sync="cancelVisible" :close-on-click-modal="false" width="400px" title="撤回">
			<div class="record-container">
				<div class="record-container-content">
					<div class="record-item"><label>{{$t('fmsReceiptTransactions.transactions_no')}}：</label><span>{{detailItem.transactionsNo}}</span></div>
					<div class="record-item"><label>{{$t('fmsReceiptTransactions.claim_no')}}：</label><span>{{detailItem.claimNo}}</span></div>
					<div class="record-item"><label>{{$t('fmsReceiptTransactions.transactions_amount')}}：</label><span>{{detailItem.transactionsAmount | numberToThousands}}</span></div>
					<div class="record-item"><label>{{$t('fmsReceiptTransactions.claim_no')}}：</label><span>{{detailItem.claimAmount | numberToThousands}}</span></div>
					<div>{{$t('fmsReceiptTransactions.confirm_recall_desc')}}</div>
				</div>
			</div>
			<div slot="footer" class="option-btn-wrap">
				<el-button size="mini" @click="cancelVisible = false">{{ $t("common.cancel")}}</el-button>
				<el-button size="mini" type="primary" :loading="confirmLoading" @click="cancelConfirmFn">{{$t('fmsReceiptTransactions.confirm_recall')}}</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { getTransactionsReceiptMyListApi, getTransactionsReceiptListAllApi, transactionReceiptCancelClaimApi, getYHTReceiptCategoryAllApi, exportClaimListAllApi } from "@/api/financial/fmsReceiptTransactions";
import { AgGridVue } from "ag-grid-vue";
import claimOperationBtn from "./claimOperationBtn";
import { parseTime, formatNumberToThousands } from "@/utils/index";
import { getYHTListApi, getCurrenciesListApi, getBusinessTypeListApi } from "@/api/common";
import { getDictDataApi } from "@/api/financial/fmsReceive";

export default {
	name: "TransactionsListClaimer",
	components: {
		AgGridVue,
		claimOperationBtn
	},
	props: {
		type: {
			type: String,
			default: ""
		},
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
				businessType: "",
				settlementCompanyId: "",
				transactionsDatePeriod: [],
				settlementOfficeId: "",
				transactionsType: "",
				claimState: "",
				instructionState: "",
				clearState: "",
				recordById: "",
				recordDatePeriod: [],
        claimById: '',
        claimDatePeriod: [],
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
					field: "claimNo",
					headerName: this.$t('fmsReceiptTransactions.claim_no'),
					minWidth: 120
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
					field: "transactionsTypeName",
					headerName: this.$t('fmsReceiptTransactions.transactions_type'),
					minWidth: 100
				},
				{
					field: "accountCollectName",
					headerName: this.$t('fmsReceiptTransactions.account_collect'),
					minWidth: 130
				},
				{
					field: "transactionsAmountStr",
					headerName: this.$t('fmsReceiptTransactions.transactions_amount_currcny'),
					minWidth: 120,
					type: "numericColumn"
				},
        {
					field: "claimByName",
					headerName: this.$t('fmsReceiptTransactions.claim_by'),
					minWidth: 100
				},
				{
					field: "claimAmount",
					headerName: this.$t('fmsReceiptTransactions.claim_amount'),
					minWidth: 100,
					type: "numericColumn"
				},
				{
					field: "remainAmount",
					headerName: this.$t('fmsReceiptTransactions.remain_amount'),
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
					minWidth: 150
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
					field: "instructionStateName",
					headerName: this.$t('fmsReceiptTransactions.instruction_state'),
					minWidth: 120,
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
					cellRendererFramework: "claimOperationBtn",
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
			YHTList: [], // 分公司
			YHTAccountAllList: [], // 所有分公司收款账户
			YHTAccountList: [], // 分公司收款账户
			currencyList: [], // 币种
			thirdPartyCodeList: [], // 第三方下拉列表
			paySourceList: [], // 付款来源类型
			transactionsTypeList: [], // 收款类型
			instructionStateList: [], // 申请核销状态
			clearStateList: [], // 核销状态

			cancelVisible: false,
			confirmLoading: false,
			detailItem: {}
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
				const paySourceRes = results[2];
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
				if (paySourceRes.ok) {
					this.paySourceList = paySourceRes.content;
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
    getSearchParams() {
      const params = {
				...this.formData,
				pageSize: this.pageSize,
				pageNum: this.pageNum
			};
			if (params.transactionsDatePeriod.length) {
				params.transactionsDateStart = this.formData.transactionsDatePeriod[0];
				params.transactionsDateEnd = this.formData.transactionsDatePeriod[1];
			}

			if (params.recordDatePeriod.length) {
				params.recordDateStart = this.formData.recordDatePeriod[0];
				params.recordDateEnd = this.formData.recordDatePeriod[1];
			}

			if (params.claimDatePeriod.length) {
				params.claimDateStart = this.formData.claimDatePeriod[0];
				params.claimDateEnd = this.formData.claimDatePeriod[1];
			}

			if (params.accountCollectCategory.length > 1) {
				params.settlementOfficeId = params.accountCollectCategory[0];
				params.accountCollectCategory = params.accountCollectCategory[1];
			} else if (params.accountCollectCategory.length > 0) {
				params.settlementOfficeId = params.accountCollectCategory[0];
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
      let params = this.getSearchParams()
			let fn = this.type === "ALL" ? getTransactionsReceiptListAllApi : getTransactionsReceiptMyListApi;
			const res = await fn(params);
			if (res.ok) {
				res.content.list.forEach(v => {
					v.userType = this.type;
					v.role = this.role;
					v.transactionsDate = parseTime(v.transactionsDate, "{y}-{m}-{d} {h}:{i}:{s}");
					v.recordDate = parseTime(v.recordDate, "{y}-{m}-{d} {h}:{i}:{s}");
					v.claimDate = parseTime(v.claimDate, "{y}-{m}-{d} {h}:{i}:{s}");
					v.transactionsAmountStr = v.transactionsCurrency + " " + formatNumberToThousands(v.transactionsAmount);
					v.claimAmount = formatNumberToThousands(v.claimAmount);
					v.remainAmount = formatNumberToThousands(v.remainAmount);
				});
				this.total = parseInt(res.content.total, 10);
				this.userList = res.content.list;
			} else {
				this.total = 0;
				this.userList = [];
			}
			this.loading = false;
		},
    // 导出
    exportFn() {
      let params = this.getSearchParams()
      let data = {
        transactionsQuery: {
          ...params
        }
      }
      exportClaimListAllApi(data).then(res => {
        if (res.ok) {
          this.$message.success(this.$t("fmsReceiptTransactions.upload_file_success"));
        }
      })
    },
		// 查看
		viewFn(item) {
			this.$router.push({
				name: "TransactionsReceiptDetailClaimer",
				query: {
					id: item.id,
					backPath: this.$route.name
				}
			});
		},
		// 撤回认领
		cancelFn(item) {
			this.cancelVisible = true;
			this.detailItem = item;
		},
		cancelConfirmFn() {
			this.confirmLoading = true;
			transactionReceiptCancelClaimApi({ claimIds: [this.detailItem.id] })
				.then(res => {
					if (res.ok) {
						this.$message.success(this.$t("fmsReceiptTransactions.confirm_recall_success"));
						this.cancelVisible = false;
						this.getList();
					}
					this.confirmLoading = false;
				})
				.catch(() => {
					this.confirmLoading = false;
				});
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
.file-show {
	color: #108ee9;
	font-size: 14px;
}
.record-container-content {
	.record-item {
		line-height: 35px;
	}
}
</style>
