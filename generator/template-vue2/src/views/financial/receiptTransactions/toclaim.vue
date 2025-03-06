<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="getList" :resetFun="reset">
			<template slot="multipleSearch">
				<div class="multiple-form-wrap">
					<el-form ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
						<el-form-item :label='$t("fmsReceiptTransactions.transactions_no")' prop="transactionsNo">
							<el-input v-model="formData.transactionsNo" type="text" size="mini" clearable @keyup.enter.native="getList" />
						</el-form-item>
						<el-form-item :label="$t('fmsReceiptTransactions.pay_type')" prop="payType">
							<el-select v-model="formData.payType" size="mini" @change="getList">
								<el-option :label="$t('customerManage.ALL')" value="" />
								<el-option v-for="(item, index) in payTypeList" :key="index" :label="item.name" :value="item.code" />
							</el-select>
						</el-form-item>
						<el-form-item :label="$t('fmsReceiptTransactions.payer_company')" prop="payerName">
							<!-- <el-input v-model="formData.payerName" type="text" size="mini" clearable @keyup.enter.native="getList" /> -->
              <type-autocomplete v-model="formData.payerName" type="member" size="mini" clearable @selected="payerNameSelected" />
						</el-form-item>
						<el-form-item :label="$t('fmsReceiptTransactions.account_collect')" prop="accountCollectCategory" v-if="false">
							<el-cascader v-model="formData.accountCollectCategory" :options="YHTAccountAllList" size="mini" clearable @change="getList"></el-cascader>
						</el-form-item>
						<el-form-item :label="$t('fmsReceiptTransactions.transactions_date')" prop="transactionsDatePeriod">
							<search-date-picker v-model="formData.transactionsDatePeriod" @change="getList" clearable></search-date-picker>
						</el-form-item>
						<el-form-item :label="$t('fmsReceiptTransactions.record_by')" prop="recordById">
							<type-select v-model="formData.recordById" type="user" @selected="getList" />
						</el-form-item>
						<el-form-item :label="$t('fmsReceiptTransactions.record_date')" prop="recordDatePeriod">
							<search-date-picker v-model="formData.recordDatePeriod" @change="getList" clearable></search-date-picker>
						</el-form-item>
						<el-form-item :label="$t('fmsReceiptTransactions.settlement_office')" prop="settlementOfficeId" v-if="false">
							<el-select v-model="formData.settlementOfficeId" size="mini" @change="getList">
								<el-option :label="$t('common.ALL')" value="" />
								<el-option v-for="item in YHTList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</div>
			</template>
		</top-search-items-slot>
		<div class="">
			<div class="top-btn-wrap mb-10 mt-10">
				<el-button type="primary" size="mini" icon="el-icon-plus" @click="addFn" v-if="role === 'FINANCE'">{{$t('fmsReceiptTransactions.record_transactions')}}</el-button>
				<el-button type="primary" size="mini" @click="exportFn" v-if="role === 'FINANCE'">{{$t('fmsReceiptTransactions.import_transactions')}}</el-button>
        <el-button type="primary" size="mini" @click="batchClaimFn()" v-if="role === 'BUSINESS'">{{$t('fmsReceiptTransactions.batch_claim')}}</el-button>
			</div>
			<ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs" :column-defs="columnFields" :row-data="userList" :enable-col-resize="true" :enable-sorting="true" :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight" class="ag-theme-balham" />

      <div class="page-total">
				<span class="page-total-item">
					<span>{{$t('fmsReceiptTransactions.un_claimed_amount')}}：</span>
					<span>
						<span class="value-item" v-for="(item, index) in unClaimAmountTotal" :key='index'>
							<span class='value'>{{item.currency}}</span>
							<span>{{item.value | numberToThousands}}</span>
						</span>
					</span>
				</span>
			</div>

      <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList" />
		</div>

		<el-dialog :visible.sync="detailVisible" :close-on-click-modal="false" width="900px" title="查看详情">
			<div class="record-container">
				<div class="title">
					<svg-icon className="clear-module-icon" iconClass="icon-shoukuandan" />
					{{$t('fmsReceiptTransactions.transactions_no')}}
          <span style="margin-left:15px;">{{detailItem.transactionsNo}}</span>
				</div>
				<div class="record-container-content">
					<div class="record-item title-important-item"><label>{{$t('fmsReceiptTransactions.transactions_amount_currcny')}}：</label>
						<span>
							{{detailItem.transactionsCurrency}}&nbsp;&nbsp;{{detailItem.transactionsAmount | numberToThousands}}
						</span>
					</div>
					<div class="record-item title-important-item"><label>{{$t('fmsReceiptTransactions.claimed_amount')}}：</label><span>{{detailItem.claimedAmount | numberToThousands}}</span></div>
					<div class="record-item title-important-item"><label>{{$t('fmsReceiptTransactions.un_claim_amount')}}：</label><span>{{detailItem.unClaimAmount | numberToThousands}}</span></div>
				</div>
				<div class="record-container-content">
					<div class="record-item" style="width:100%">
						<label>{{$t('fmsReceiptTransactions.pay_type')}}：</label>
						<span>
							{{detailItem.payTypeName}}
							<span style="margin-left:10px;">{{detailItem.thirdPartyName}}</span>
							<span v-if="detailItem.payingAgentFlag">
								<el-checkbox v-model="detailItem.payingAgentFlag" disabled class="person-flag"></el-checkbox>个人代付
							</span>
						</span>
					</div>
          <div class="record-item"><label>{{$t("fmsReceiptTransactions.payer_name")}}：</label><span>{{detailItem.payerName}}</span></div>
          <div class="record-item"><label>{{$t("fmsReceiptTransactions.member_account_no")}}：</label><span>{{detailItem.accountPayAccountNo}}</span></div>
          <div class="record-item"><label>{{$t("fmsReceiptTransactions.member_account_name")}}：</label><span>{{detailItem.accountPayName}}</span></div>
          <div class="record-item"><label>{{$t("fmsReceiptTransactions.settlement_office")}}：</label><span>{{detailItem.settlementOfficeName}}</span></div>
          <div class="record-item"><label>{{$t("fmsReceiptTransactions.account_collect")}}：</label><span>{{detailItem.accountCollectName}}</span></div>
          <div class="record-item"><label>{{$t("fmsReceiptTransactions.account_collect_no")}}：</label><span>{{detailItem.accountCollectAccountNo}}({{detailItem.transactionsCurrency}})</span></div>
          <div class="record-item"><label>{{$t("fmsReceiptTransactions.transactions_date")}}：</label><span>{{detailItem.transactionsDate | parseTime}}</span></div>
          <div class="record-item"><label>{{$t("fmsReceiptTransactions.transactions_remark")}}：</label><span>{{detailItem.remark}}</span></div>
          <div class="record-item"><label>{{$t("fmsReceiptTransactions.certificate_files")}}：</label>
						<span>
							<div class="file-show">
								<div v-for="(item,index) in detailItem.certificateFiles" :key="index">
									<a :href="item.url" target="_blank">{{item.originFileName}}</a>
								</div>
							</div>
						</span>
					</div>
				</div>
			</div>
			<div slot="footer" class="option-btn-wrap">
				<el-button size="mini" type="primary" plain @click="detailVisible = false">{{ $t("common.close")}}</el-button>
			</div>
		</el-dialog>

		<el-dialog v-if="claimerVisible" :visible.sync="claimerVisible" :close-on-click-modal="false" width="900px" title="认领">
			<div class="record-container">
				<div class="title">
					<svg-icon className="clear-module-icon" iconClass="icon-shoukuandan" />
					{{$t('fmsReceiptTransactions.transactions_no')}}
          <span style="margin-left:15px;">{{detailItem.transactionsNo}}</span>
				</div>
				<div class="record-container-content">
					<div class="record-item title-important-item"><label>{{$t('fmsReceiptTransactions.transactions_amount_currcny')}}：</label>
						<span>
							{{detailItem.transactionsCurrency}}&nbsp;&nbsp;{{detailItem.transactionsAmount | numberToThousands}}
						</span>
					</div>
					<div class="record-item title-important-item"><label>{{$t('fmsReceiptTransactions.claimed_amount')}}：</label><span>{{detailItem.claimedAmount | numberToThousands}}</span></div>
					<div class="record-item title-important-item"><label>{{$t('fmsReceiptTransactions.un_claim_amount')}}：</label><span>{{detailItem.unClaimAmount | numberToThousands}}</span></div>
				</div>
				<div class="record-container-content">
					<div class="record-item" style="width:100%">
						<label>{{$t('fmsReceiptTransactions.pay_type')}}：</label>
						<span>
							{{detailItem.payTypeName}}
							<span style="margin-left:10px;">{{detailItem.thirdPartyName}}</span>
							<span v-if="detailItem.payingAgentFlag">
								<el-checkbox v-model="detailItem.payingAgentFlag" disabled class="person-flag"></el-checkbox>
                {{$t('fmsReceiptTransactions.paying_agent')}}
							</span>
						</span>
					</div>
          <div class="record-item"><label>{{$t("fmsReceiptTransactions.payer_name")}}：</label><span>{{detailItem.payerName}}</span></div>
          <div class="record-item"><label>{{$t("fmsReceiptTransactions.member_account_no")}}：</label><span>{{detailItem.accountPayAccountNo}}</span></div>
          <div class="record-item"><label>{{$t("fmsReceiptTransactions.member_account_name")}}：</label><span>{{detailItem.accountPayName}}</span></div>
          <div class="record-item"><label>{{$t("fmsReceiptTransactions.settlement_office")}}：</label><span>{{detailItem.settlementOfficeName}}</span></div>
          <div class="record-item"><label>{{$t("fmsReceiptTransactions.account_collect")}}：</label><span>{{detailItem.accountCollectName}}</span></div>
          <div class="record-item"><label>{{$t("fmsReceiptTransactions.account_collect_no")}}：</label><span>{{detailItem.accountCollectAccountNo}}({{detailItem.transactionsCurrency}})</span></div>
          <div class="record-item"><label>{{$t("fmsReceiptTransactions.transactions_date")}}：</label><span>{{detailItem.transactionsDate | parseTime}}</span></div>
          <div class="record-item"><label>{{$t("fmsReceiptTransactions.transactions_remark")}}：</label><span>{{detailItem.remark}}</span></div>
          <div class="record-item"><label>{{$t("fmsReceiptTransactions.certificate_files")}}：</label>
						<span>
							<div class="file-show">
								<div v-for="(item,index) in detailItem.certificateFiles" :key="index">
									<a :href="item.url" target="_blank">{{item.originFileName}}</a>
								</div>
							</div>
						</span>
					</div>
				</div>

				<div class="record-container-content" style="border-top: 1px dashed #999;padding-top: 20px;">
					<div class="record-item"><label>{{$t("fmsReceiptTransactions.remain_un_claim_amount")}}：</label><span>{{detailItem.unClaimAmount | numberToThousands}}</span></div>
				</div>
				<el-form ref="claimerDataForm" :model="claimerData" :rules="claimerDataRule" label-width="120px" size="mini" class="claimerDataForm">
					<el-form-item :label='$t("fmsReceiptTransactions.settlement_company")' prop="settlementCompanyId">
						<type-select v-model="claimerData.settlementCompanyId" type="settlementCompany" :disabled="claimerData.settlementCompanyIdDis" :defaultDisplay="claimerData.settlementCompanyName" />
					</el-form-item>
					<el-form-item :label='$t("fmsReceiptTransactions.transactions_type")' prop="transactionsReceiptType">
						<el-select v-model="claimerData.transactionsReceiptType" style="width: 100%" size="mini">
							<el-option v-for="item in transactionsReceiptTypeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label='$t("fmsReceiptTransactions.business_type")' prop="businessTypes">
						<el-select v-model="claimerData.businessTypes" style="width: 100%" size="mini" multiple>
							<el-option v-for="item in businessTypeList" :key="item.code" :label="item.chineseName" :value="item.code"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label='$t("fmsReceiptTransactions.current_claim_amount")' prop="claimAmount">
						<el-input v-model="claimerData.claimAmount" type="text" size="mini" clearable oninput="value=value.replace(/[^\d.-]/g,'')" />
					</el-form-item>
					<el-form-item :label='$t("fmsReceiptTransactions.claim_remark")' prop="claimRemark" class="full">
						<el-input v-model="claimerData.claimRemark" type="text" size="mini" clearable />
					</el-form-item>
					<el-form-item :label='$t("fmsReceiptTransactions.claim_files")' prop="claimFiles" class="full">
						<upload-file v-model="claimerData.claimFiles" multiple></upload-file>
					</el-form-item>
				</el-form>

			</div>
			<div slot="footer" class="option-btn-wrap">
				<el-button size="mini" @click="claimerVisible = false">{{ $t("customerManage.cancel")}}</el-button>
				<el-button size="mini" type="primary" :loading="claimerLoading" @click="claimerConfirmFn">{{ $t("customerManage.confirm") }}</el-button>
			</div>
		</el-dialog>

		<el-dialog v-if="batchClaimerVisible" :visible.sync="batchClaimerVisible" :close-on-click-modal="false" width="900px" title="认领">
			<div class="record-container">
        <div class="title">
					<svg-icon className="clear-module-icon" iconClass="icon-shoukuandan" />
					{{$t("fmsReceiptTransactions.batch_claim_transactions")}}
				</div>
        <div class="record-container-content">
          <el-table :data="batchSelectArr" style="width: 100%" max-height="200">
            <el-table-column prop="payTypeName" :label='$t("fmsReceiptTransactions.pay_type")'> </el-table-column>
            <el-table-column prop="payerName" :label='$t("fmsReceiptTransactions.payer_name")' ></el-table-column>
            <el-table-column prop="transactionsNo" :label='$t("fmsReceiptTransactions.transactions_no")' ></el-table-column>
            <el-table-column prop="date" :label='$t("fmsReceiptTransactions.transactions_amount_currcny")' >
               <template slot-scope="{row}">
                <span>{{row.transactionsCurrency}}{{row.transactionsAmount | numberToThousands}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="date" :label='$t("fmsReceiptTransactions.claimed_amount")' >
               <template slot-scope="{row}">
                <span>{{row.claimedAmount | numberToThousands}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="date" :label='$t("fmsReceiptTransactions.un_claim_amount")' >
               <template slot-scope="{row}">
                <span>{{row.unClaimAmount | numberToThousands}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

				<div class="record-container-content" style="padding-top: 20px;">
					<div class="record-item">
            <label>{{$t("fmsReceiptTransactions.remain_un_claim_amount")}}：</label>
            <span>
              <span style="margin-right: 10px;" v-for="(item, index) in batchUnClaimAmount" :key="index">{{item.currency}}{{item.value | numberToThousands}}</span>
            </span>
          </div>
				</div>
				<el-form ref="claimerDataForm" :model="claimerData" :rules="claimerDataRule" label-width="120px" size="mini" class="claimerDataForm">
					<el-form-item :label='$t("fmsReceiptTransactions.settlement_company")' prop="settlementCompanyId">
						<type-select v-model="claimerData.settlementCompanyId" type="settlementCompany" :disabled="claimerData.settlementCompanyIdDis" :defaultDisplay="claimerData.settlementCompanyName" />
					</el-form-item>
					<el-form-item :label='$t("fmsReceiptTransactions.transactions_type")' prop="transactionsReceiptType">
						<el-select v-model="claimerData.transactionsReceiptType" style="width: 100%" size="mini">
							<el-option v-for="item in transactionsReceiptTypeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label='$t("fmsReceiptTransactions.business_type")' prop="businessTypes">
						<el-select v-model="claimerData.businessTypes" style="width: 100%" size="mini" multiple>
							<el-option v-for="item in businessTypeList" :key="item.code" :label="item.chineseName" :value="item.code"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label='$t("fmsReceiptTransactions.current_claim_amount")'  class="full">
						<span style="margin-right: 10px;" v-for="(item, index) in batchUnClaimAmount" :key="index">{{item.currency}}{{item.value | numberToThousands}}</span>
					</el-form-item>
					<el-form-item  :label='$t("fmsReceiptTransactions.claim_remark")'  prop="claimRemark" class="full">
						<el-input v-model="claimerData.claimRemark" type="text" size="mini" clearable />
					</el-form-item>
					<el-form-item :label='$t("fmsReceiptTransactions.claim_files")'  prop="claimFiles" class="full">
						<upload-file v-model="claimerData.claimFiles" multiple></upload-file>
					</el-form-item>
				</el-form>

			</div>
			<div slot="footer" class="option-btn-wrap">
				<el-button size="mini" @click="batchClaimerVisible = false">{{ $t("common.cancel")}}</el-button>
				<el-button size="mini" type="primary" :loading="batchClaimerLoading" @click="batchClaimerConfirmFn">{{ $t("common.confirm") }}</el-button>
			</div>
		</el-dialog>

		<record-modal ref="recordModalRef" :currencyList="currencyList" :payTypeList="payTypeList" :YHTList="YHTList" @success="getList" />
		<export-transactions ref="exportModalRef" @success="getList" />
	</div>
</template>

<script>
import {
  getTransactionsReceiptListToclaimApi,
  getTransactionsReceiptListToclaimTotalApi,
  getYHTReceiptAccountApi,
  getThirdPartyPaymentApi,
  getYHTReceiptCategoryAllApi,
  transactionReceiptCancelApi,
  getTransactionReceiptDetailApi,
  transactionReceiptClaimApi,
  walletTransactionImportApi,
  getSettlementInfoByName,
  getTransactionInfoArrApi,
  submitTransactionInfoArrApi
} from "@/api/financial/fmsReceiptTransactions";
import { AgGridVue } from "ag-grid-vue";
import toclaimOperationBtn from "./toclaimOperationBtn";
import recordModal from "./components/recordModal";
import exportTransactions from "./components/exportTransactions";
import { parseTime, formatNumberToThousands } from "@/utils/index";
import { getYHTListApi, getCurrenciesListApi, getBusinessTypeListApi } from "@/api/common";
import { getDictDataApi } from "@/api/financial/fmsReceive";

export default {
	name: "ReceiptTransactionsToclaim",
	components: {
		AgGridVue,
		toclaimOperationBtn,
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
				settlementOfficeId: "",
				transactionsNo: "",
				payType: "",
				payerName: "",
				payerMemberId: "",
        payerMemberName: '',
        payerMemberEnglishName: '',
				recordById: "",
				transactionsDatePeriod: [],
        recordDatePeriod: [],
				accountCollectCategory: []
			},
			pageSize: 50,
			pageNum: 1,
			total: 0,
			userList: [],
			columnFields: [
				{
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
        }, {
					field: "transactionsNo",
					headerName: this.$t("fmsReceiptTransactions.transactions_no"),
					minWidth: 120
				},
				{
					field: "payTypeName",
					headerName: this.$t("fmsReceiptTransactions.pay_type"),
					minWidth: 100
				},
				{
					field: "payerName",
					headerName: this.$t("fmsReceiptTransactions.payer_company"),
					minWidth: 130
				},
        {
					field: "payerMemberName",
					headerName: this.$t("fmsReceiptTransactions.member_name"),
					minWidth: 200
				},
				{
					field: "settlementOfficeName",
					headerName: this.$t("fmsReceiptTransactions.settlement_office"),
					minWidth: 200
				},
				{
					field: "accountCollectName",
					headerName: this.$t("fmsReceiptTransactions.account_collect"),
					minWidth: 130
				},
				{
					field: "transactionsAmountStr",
					headerName: this.$t("fmsReceiptTransactions.transactions_amount_currcny"),
					minWidth: 150,
					type: "numericColumn"
				},
        {
					field: "unClaimTotalAmount",
					headerName: this.$t("fmsReceiptTransactions.un_claimed_amount"),
					minWidth: 100,
					type: "numericColumn"
				},
				{
					field: "transactionsDate",
					headerName: this.$t("fmsReceiptTransactions.transactions_date"),
					minWidth: 150
				},
				{
					field: "remark",
					headerName: this.$t("fmsReceiptTransactions.transactions_remark"),
					minWidth: 150
				},
				{
					field: "recordByName",
					headerName: this.$t("fmsReceiptTransactions.record_by"),
					minWidth: 90
				},
				{
					field: "recordDate",
					headerName: this.$t("fmsReceiptTransactions.record_date"),
					minWidth: 150
				},
				{
					field: "id",
					headerName: this.$t("fmsReceiptTransactions.operation"),
					cellRendererFramework: "toclaimOperationBtn",
					minWidth: 100,
					pinned: "right"
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
      gridApi: {},
			loading: false,
			businessTypeList: [],
			YHTAccountAllList: [],
			YHTList: [], // 分公司
			YHTAccountList: [], // 分公司收款账户
			currencyList: [], // 币种
			thirdPartyCodeList: [], // 第三方下拉列表
			payTypeList: [], // 付款来源类型
			transactionsReceiptTypeList: [], // 收款类型

			// 详情
			detailVisible: false,
			detailItem: {},

			// 认领
			claimerVisible: false,
      claimerLoading: false,
			claimerData: {},
			claimerDataRule: {
				transactionsReceiptType: [{ required: true, message: this.$t("common.cannot_be_null"), trigger: "blur" }],
				businessTypes: [{ required: true, message: this.$t("common.cannot_be_null"), trigger: "blur" }],
				settlementCompanyId: [{ required: true, message: this.$t("common.cannot_be_null"), trigger: "blur" }],
				claimAmount: [{ required: true, message: this.$t("common.cannot_be_null"), trigger: "blur" }]
			},

      // 批量认领
      batchClaimerVisible: false,
      batchClaimerLoading: false,
      batchSelectArr: [],
      batchUnClaimAmount: [],

      // 待认领金额合计
      unClaimAmountTotal: []
		};
	},
	created() {
		this.getList();
		this.getBaseDataFn();
    this.claimerDataInit()
	},
	methods: {
		onReady(params) {
      this.gridApi = params.api
			params.api.sizeColumnsToFit();
			window.addEventListener("resize", function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit();
				});
			});
		},
    claimerDataInit() {
      this.claimerData = {
				transactionsReceiptType: "", // 收款类型
				businessTypes: [], // 业务类型
				settlementCompanyId: "", // 结算单位id
        settlementCompanyName: '',
				settlementCompanyIdDis: false,
				claimAmount: "", // 认领金额
				claimRemark: "", // 认领备注
				claimFiles: [] // 认领凭证
			}
    },
		getBaseDataFn() {
			Promise.all([getYHTListApi(), getCurrenciesListApi(), getDictDataApi(22), getDictDataApi(23), getBusinessTypeListApi(), getYHTReceiptCategoryAllApi()]).then(results => {
				const yhtRes = results[0];
				const currencyRes = results[1];
				const payTypeRes = results[2];
				const transactionsReceiptTypeRes = results[3];
				const businessTypeRes = results[4];
				const YHTAccountAllRes = results[5];
				if (yhtRes.ok) {
					this.YHTList = yhtRes.content;
				}
				if (currencyRes.ok) {
					this.currencyList = currencyRes.content;
				}
				if (payTypeRes.ok) {
					this.payTypeList = payTypeRes.content;
				}
				if (transactionsReceiptTypeRes.ok) {
					this.transactionsReceiptTypeList = transactionsReceiptTypeRes.content;
				}
				if (businessTypeRes.ok) {
					this.businessTypeList = businessTypeRes.content;
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
			if (params.recordDatePeriod.length) {
				params.recordDateStart = this.formData.recordDatePeriod[0];
				params.recordDateEnd = this.formData.recordDatePeriod[1];
			}
			if (params.accountCollectCategory.length > 1) {
				params.settlementOfficeId = params.accountCollectCategory[0];
				params.accountCollectCategory = params.accountCollectCategory[1];
			} else if (params.accountCollectCategory.length > 0) {
				params.settlementOfficeId = params.accountCollectCategory[0];
			}

			delete params.transactionsDatePeriod;
			delete params.recordDatePeriod;
			if (params.payerMemberId) {
				delete params.payerName
			} else {
				delete params.payerMemberId
			}
			const res = await getTransactionsReceiptListToclaimApi(params);
			if (res.ok) {
				res.content.list.forEach(v => {
					v.role = this.role;
					v.transactionsDate = parseTime(v.transactionsDate, "{y}-{m}-{d} {h}:{i}:{s}");
					v.recordDate = parseTime(v.recordDate, "{y}-{m}-{d} {h}:{i}:{s}");
					v.transactionsAmountStr = v.transactionsCurrency + " " + formatNumberToThousands(v.transactionsAmount);
          v.unClaimTotalAmount = formatNumberToThousands(v.unClaimTotalAmount);
				});
				this.total = parseInt(res.content.total, 10);
				this.userList = res.content.list;
			} else {
				this.total = 0;
				this.userList = [];
			}
			this.loading = false;

      this.unClaimAmountTotal = []
      getTransactionsReceiptListToclaimTotalApi(params).then(res => {
        if (res.ok) {
          if (res.content && res.content.length) {
            res.content.forEach(v => {
              if (v.amountName === "unClaimAmount") {
                this.unClaimAmountTotal = v.amounts;
              }
            })
          }
        }
      })
		},
		// 登记收款
		addFn() {
			this.$refs.recordModalRef.show();
		},
		// 查看
		viewFn(item) {
			getTransactionReceiptDetailApi(item.transactionsId).then(res => {
				if (res.ok) {
					this.detailItem = res.content || {};
					this.detailVisible = true;
				}
			});
		},
		// 删除
		deleteFn(item) {
			this.$confirm(this.$t("fmsReceiptTransactions.confirm_delete"), this.$t("common.mention"), {
				confirmButtonText: this.$t("common.confirm"),
				cancelButtonText: this.$t("common.cancel"),
				type: "warning"
			})
				.then(() => {
					transactionReceiptCancelApi({ transactionsIds: [item.transactionsId] }).then(res => {
						if (res.ok) {
							this.$message.success(this.$t("fmsReceiptTransactions.delete_success"));
							this.getList();
						}
					});
				})
				.catch(() => {});
		},
    // 批量认领
    batchClaimFn() {
      // 认领之前init data
      this.claimerDataInit()
      let selectedRows = this.gridApi.getSelectedRows();
			if (selectedRows.length <= 0) {
				this.$message.error(this.$t("common.please_select_one_data"));
				return;
			}
      let ids = []
      selectedRows.forEach(v => {
        ids.push(v.transactionsId)
      })
      getTransactionInfoArrApi(ids).then(res => {
        if (res.ok) {
          this.batchClaimerVisible = true
          this.batchSelectArr = res.content

          let currencyMap = {}
          res.content.forEach(v => {
            currencyMap[v.transactionsCurrency] = Number(currencyMap[v.transactionsCurrency] || 0) + Number(v.unClaimAmount)
          })
          let batchUnClaimAmount = []
          Object.keys(currencyMap).forEach(v => {
            batchUnClaimAmount.push({
              value: Number(currencyMap[v]).toFixed(2),
              currency: v
            })
          })
          this.batchUnClaimAmount = batchUnClaimAmount

          // 通过接口去获取
          getSettlementInfoByName({name: res.content[0].payerName}).then(res => {
            if (res.ok && res.content) {
              this.claimerData.settlementCompanyId = res.content.memberId;
              this.claimerData.settlementCompanyName = res.content.memberName;
              this.claimerData.settlementCompanyIdDis = true;
            }
          })
        }
      })
    },
    // 确认批量认领
    batchClaimerConfirmFn() {
      this.$refs.claimerDataForm.validate(valid => {
				if (valid) {
					let data = []
          this.batchSelectArr.forEach(v => {
            data.push({
              transactionsId: v.id,
              ...this.claimerData,
              claimAmount: v.unClaimAmount
            })
          })
          this.batchClaimerLoading = true
					submitTransactionInfoArrApi({ claims: data }).then(res => {
						if (res.ok) {
							this.batchClaimerVisible = false;
							this.$message.success(this.$t("fmsReceiptTransactions.batch_claim_success"));
              this.getList();
						}
            this.batchClaimerLoading = false
					}).catch(() => {
            this.batchClaimerLoading = false
          });
				}
			});
    },
		// 认领
		claimerFn(item) {
      // 认领之前init data
			this.claimerDataInit()
			getTransactionReceiptDetailApi(item.transactionsId).then(res => {
				if (res.ok) {
					// 有结算单位 且不是个人代付
					if (res.content.settlementCompanyId && !res.content.payingAgentFlag) {
						this.claimerData.settlementCompanyId = res.content.settlementCompanyId;
            this.claimerData.settlementCompanyName = res.content.settlementCompanyName;
						this.claimerData.settlementCompanyIdDis = true;
					} else {
            // 银行转账  且不是个人代付
           if (res.content.payType === 2 && !res.content.payingAgentFlag) {
             // 通过接口去获取
             getSettlementInfoByName({name: res.content.payerName}).then(res => {
                if (res.ok && res.content) {
                  this.claimerData.settlementCompanyId = res.content.memberId;
                  this.claimerData.settlementCompanyName = res.content.memberName;
                  this.claimerData.settlementCompanyIdDis = true;
                }
             })
           }
          }
          this.claimerData.claimAmount = res.content.unClaimAmount;
					res.content.transactionsId = res.content.id;
					this.detailItem = res.content || {};
					this.claimerVisible = true;
				}
			});
		},
		// 确认认领
		claimerConfirmFn() {
			this.$refs.claimerDataForm.validate(valid => {
				if (valid) {
					if (Number(this.claimerData.claimAmount) > Number(this.detailItem.unClaimAmount)) {
						// 本次认领金额超出剩余未认领金额！
            this.$message.error(this.$t("fmsReceiptTransactions.claim_info"));
						return;
					}
					let data = {
						transactionsId: this.detailItem.transactionsId,
						...this.claimerData
					};
          this.claimerLoading = true
					transactionReceiptClaimApi({ claims: [data] }).then(res => {
						if (res.ok) {
							this.claimerVisible = false;
							this.$message.success(this.$t("fmsReceiptTransactions.claim_success"));
              this.getList();
						}
            this.claimerLoading = false
					}).catch(() => {
            this.claimerLoading = false
          });
				}
			});
		},
		// 导入收款
		exportFn() {
			this.$refs.exportModalRef.show();
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
		line-height: 50px;
		border-bottom: 1px solid #eee;
	}
	.m-icon {
		font-size: 26px;
		line-height: 26px;
		color: #1890ff;
		margin-right: 10px;
		float: left;
		margin-top: 7px;
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

		.title-important-item.record-item {
			width: 33%;
			label {
				font-weight: 600 !important;
			}
			span {
				font-weight: 600 !important;
			}
		}
	}
}

.claimerDataForm {
	overflow: hidden;

	::v-deep .el-form-item {
		width: 50%;
		float: left;
	}
	.full {
		width: 100%;
	}
}

.file-show {
	color: #108ee9;
	font-size: 14px;
}
.person-flag {
	float: none !important;
	width: auto !important;
	min-width: auto !important;
	display: inline-block !important;
	margin-left: 10px !important;
	margin-bottom: 0 !important;
}
</style>
