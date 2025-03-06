<template>
  <div class="sys-right-inner-wrap" v-loading="loading">
    <top-search-items-slot :searchFun="topSearch" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="formData" :inline="true" :model="formData" label-width="115px"
        size="mini" >
        <el-form-item :label="getZH('entityNo')" prop="orderNo">
          <el-input v-trim v-model="formData.orderNo" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable  />
        </el-form-item>
        <el-form-item :label="getZH('mblNo')" prop="mblNo">
          <el-input v-model.trim="formData.mblNo" maxlength="50" :placeholder="$t('common.placeholder')" size="mini" clearable   />
        </el-form-item>
        <el-form-item :label="getZH('customer')" prop="memberId" v-if="type === 'AR'">
          <type-select v-model="formData.memberId" type="customer"  />
        </el-form-item>
        <el-form-item :label="getZH(type === 'AR' ? 'collectionACSet' : 'paymentACSet')" prop="settlementOfficeId">
          <el-select v-model="formData.settlementOfficeId" size="mini" >
            <el-option v-for="(item, index) in YHTList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="getZH('businessType')" prop="businessType">
          <el-select v-model="formData.businessType" :placeholder="selectZH('businessType')" size="mini"  class="w-full">
            <el-option :label="getZH('all','common')"  value=""> </el-option>
            <el-option
              v-for="item in businessTypeList"
              :key="item.code"
              :label="item.chineseName"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <!--结算单位  -->
        <el-form-item :label="getZH('settlementCompanyName')" prop="settlementCompanyId">
          <type-select v-model="formData.settlementCompanyId" type="settlementCompany" clearable />
        </el-form-item>
        <el-form-item :label="getZH('billingStatus')" prop="invoiceApplyState" v-if="type === 'AR'">
          <FmsSelect addAll v-model="formData.invoiceApplyState" size="mini" type="invoiceApplyState" />
        </el-form-item>
        <!--开票状态-->
        <el-form-item :label="getZH('invoiceStatus')" prop="invoiceState" v-if="type === 'AR'">
          <FmsSelect addAll v-model="formData.invoiceState" size="mini" type="invoiceState" />
        </el-form-item>
        <el-form-item :label="type==='AR' ? getZH('applyVerificationStatus') : getZH('instructionStateNamePayable')" prop="instructionState">
          <FmsSelect addAll v-model="formData.instructionState" size="mini" type="applyClearState" />
        </el-form-item>
        <el-form-item :label="getZH('verificationStatus')" prop="clearState">
          <FmsSelect addAll v-model="formData.clearState" size="mini" type="clearState" />
        </el-form-item>
        <el-form-item :label="getZH('profitStateName')" prop="profitState">
          <FmsSelect addAll v-model="formData.profitState" size="mini" type="profitState" />
        </el-form-item>
         <el-form-item :label="getZH('billStatus')" prop="entryState">
          <FmsSelect addAll v-model="formData.entryState" size="mini" type="entryState" />
        </el-form-item>
        <el-form-item :label="getZH('businessDate')" prop="bussinessDateRange">
          <common-picker pikcerType="daterange" :defaultTime="['00:00:00', '23:59:59']" v-model="formData.bussinessDateRange"  clearable></common-picker>
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="container-wrap table-wrap">
      <div class="top-btn-wrap mb-10">
        <el-button  type="primary" size="mini" @click="selectPostingBtn">{{ $t('air.selectPosting') }}</el-button>
         <!-- 申请开票 -->
        <el-button size="mini" type="primary" @ v-if="type === 'AR'" @click="applyInvoice()">{{ $t('thirdKindOrder.applyBilling') }}</el-button>
        <!-- 申请付款 -->
        <el-button size="mini" type="primary"  v-if="type === 'AP'" @click="applyPayment()">{{ $t('receiveFms.applyPayment') }}</el-button>
        <!-- 申请核销 -->
        <el-button size="mini" type="primary"  @click="applyOrHedgeClear()" v-if="type === 'AR'">{{$t('receiveFms.applyClear')}}</el-button>
        <el-button size="mini" type="primary"  @click="applyOrHedgeClearAp()" v-if="type === 'AP'">{{$t('receiveFms.applyClear')}}</el-button>
      </div>
      <ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptionsRight" :side-bar="sideBarDefs"
        :column-defs="columnDefsRight" :row-data="tableData.list" :enable-col-resize="true" :enable-sorting="true"
        :grid-ready="onReady" :style="gridHeight" class="ag-theme-balham" />
      <Pagination :total="pageTotal" :limit.sync="formData.pageSize" :page.sync="formData.pageNum" @pagination="list" />
    </div>
    <div v-show="showEntryPool" class="container-pool-wrap">
      <entryPools :pools="selectedItems" @deleteNo="deleteSelectedItems" @passValidation="passValidation" type="pay" @closeWindow="closePool"></entryPools>
    </div>
    <!--    入账-->
    <ExpenseEntry :expenseEntryDialog.sync="expenseEntryDialog" v-if="expenseEntryDialog" :initialData="expenseEntryMultipleForm" :formData="expenseEntryMultipleForm" :entryType="expenseEntryType"
      :detailedType="type === 'AP' " name="expenseEntryDialog" @submit="expenseEntrySuc"></ExpenseEntry>
    <apply-payment-dialog ref="applyPaymentDialogRef" origin="CHARGE" toPath="ThkApplyForPayment" />
    <apply-payable-clear-dialog ref="applyPayableClearDialogRef" origin="CHARGE" toPath="ThkFmsApplyPayClearPage"/>
    <apply-invoice-dialog ref="applyInvoiceDialogRef" :businessType="businessTypeOpt" origin="CHARGE" :ids="selectedIds" :isSpecifyInvoiceType="true"  toPath='ThkOrderManagementApplyForInvoice'></apply-invoice-dialog>
  </div>
</template>
<script>
import PreManifestListOperationBtn from "@/views/cargo/v0/CharteredBoat/components/PreManifestListOperationBtn"
import { getChargeArPagesApi, getChargeApPagesApi, getThikBusinessTypeListApi } from "@/api/thirdKind"
import entryPools from "./entryPools"
import ExpenseEntry from "./expenseEntry"
import applyPaymentDialog from "@/views/financial/components/ApplyPaymentDialog"
import applyPayableClearDialog from "@/views/financial/components/ApplyPayableClearDialog"
import ApplyInvoiceDialog from "@/views/financial/components/ApplyInvoiceDialog"
import getZHMixin from '../../components/getZHMixin.js'
import { parseTime, formatNumberToThousands } from "@/utils"
import { getYHTListApi } from '@/api/partner/base'
export default {
	name: 'ExpenseDetail',
	mixins: [getZHMixin],
	props: {
		type: {
			type: String,
			default: 'AR'
		}
	},
	components: {
		PreManifestListOperationBtn,
		entryPools, ExpenseEntry, applyPaymentDialog, applyPayableClearDialog, ApplyInvoiceDialog,
		goBillDetail: {
			template: `<el-button v-if="params.data.billId" type="text" size="mini" @click="params.context.componentParent.goBillDetail(params.data.billId)">{{params.value}}</el-button>`,
			methods: {}
		}
	},
	data() {
		const defaultFilter = {
			orderNo: '',
			mblNo: '',
			memberId: '',
			settlementOfficeId: '',
			businessType: '',
			settlementCompanyId: '',
			invoiceApplyState: '',
			invoiceState: '',
			instructionState: '',
			clearState: '',
			profitState: '',
			entryState: '',
			bussinessDateRange: '',
			businessDateStart: '',
			businessDateEnd: '',
			pageSize: 50,
			pageNum: 1
		}
		return {
			selectedIds: [],
			loading: false,
			pageSizeList: [10, 20, 30, 40],
			tableData: {},
			selectedItems: [], // 列表选择
			pagination: {
				pageNum: 1,
				pageSize: 50
			},
			pageTotal: 0,
			defaultFilter: defaultFilter,
			formData: this.$extends({}, defaultFilter),
			gridApi: null,
			columnApi: null,
			businessTypeOpt: null,
			columnDefsRight: [{
				colId: 'visibleCol',
				headerName: '',
				pinned: 'left',
				field: '',
				hide: true,
				width: 300
			}, {
				headerName: '',
				width: 40,
				pinned: 'left',
				suppressSorting: true,
				checkboxSelection: true,
				headerCheckboxSelection: true,
				suppressMenu: true,
				suppressSizeToFit: true,
				suppressResize: true
			}, {
				headerName: this.getZH('chargeNo'), // 费用ID
				field: 'id',
				minWidth: 160
			}, {
				headerName: this.getZH('confirmationNo'), // 确认单编号
				field: 'confirmationNo',
				minWidth: 140
			},
			{
				headerName: this.getZH('mblNo'), // 订单号
				field: 'masterNo',
				minWidth: 140
			},
			{
				headerName: this.getZH('entityNo'), // 业务编号
				field: 'entityNo',
				minWidth: 140
			}, {
				headerName: this.getZH('businessType'), // 项目类型
				field: 'businessTypeName',
				minWidth: 140
			}, {
				headerName: this.getZH('chargeName'), // 费用名称
				field: 'feeItemName',
				minWidth: 140
			}, {
				headerName: this.getZH('chargeUnit'), // 计费方式
				field: 'unitName1',
				minWidth: 140
			}, {
				headerName: this.getZH('currency'), // 币种
				field: 'currency',
				minWidth: 140
			}, {
				headerName: this.getZH('price'), // 单价
				field: 'price',
				cellStyle: { textAlign: 'right' },
				cellRenderer: params => `<span>${formatNumberToThousands(params.value)}`,
				minWidth: 110
			}, {
				headerName: this.getZH('quantity'), // 数量
				field: 'chargeQuantity1',
				minWidth: 140
			}, {
				headerName: this.getZH('taxRate'), // 税率
				field: 'invoiceTaxRateName',
				minWidth: 110
			}, {
				headerName: this.getZH('taxFee'), // 税额
				field: 'taxAmount',
				cellStyle: { textAlign: 'right' },
				cellRenderer: params => `<span>${formatNumberToThousands(params.value)}`,
				minWidth: 110
			}, {
				headerName: this.getZH('amountExcludingTax'), // 不含税金额
				field: 'excludeTaxAmount',
				cellStyle: { textAlign: 'right' },
				cellRenderer: params => `<span >${formatNumberToThousands(params.value)}`,
				minWidth: 110
			}, {
				headerName: this.getZH('expenseAmount'), // 费用金额
				field: 'amount',
				cellStyle: { textAlign: 'right' },
				cellRenderer: params => `<span>${formatNumberToThousands(params.value)}`,
				minWidth: 110
			},
			{
				headerName: this.getZH('customer'), // 供应商名称
				field: 'memberName', // 目前先取与结算单位同值 memberName
				minWidth: 140,
				hide: this.type === 'AP'
			},
			{
				headerName: this.getZH('supplier'), // 供应商名称
				field: 'settlementCompanyName', // 目前先取与结算单位同值 memberName
				minWidth: 140,
				hide: this.type === 'AR'
			},
			{
				headerName: this.getZH('settlementCompanyName'), // 结算单位
				field: 'settlementCompanyName',
				minWidth: 140
			}, {
				headerName: this.getZH(this.type === 'AR' ? 'collectionACSet' : 'paymentACSet'), // 收款账套
				field: 'settlementOfficeName',
				minWidth: 120
			},
			{
				headerName: this.getZH('settlementMethod'), // 结算方式
				field: 'settlementModeName',
				minWidth: 120
			},
			{
				headerName: this.getZH('ownedSales'), // 所属销售
				field: 'responsiblePersonName',
				minWidth: 110
			},
			{
				headerName: this.getZH('polCode'),
				field: 'polCode',
				minWidth: 110
			},
			{
				headerName: this.getZH('podCode'),
				field: 'podCode',
				minWidth: 110
			},
			{
				headerName: this.getZH('businessDate'),
				field: 'bussinessDate',
				minWidth: 140,
				cellRenderer: params => `<span>${this.formatDate(params.value, 'YYYY-MM-DD HH:mm')}</span > `
			},
			{
				headerName: this.type === 'AR' ? this.getZH('applyVerificationStatus') : this.getZH('instructionStateNamePayable'),
				field: 'instructionStateName',
				minWidth: this.type === 'AR' ? 120 : 150,
				pinned: 'right',
				cellRenderer: params => {
					if (params.data.instructionState === 1) {
						return `<div class= 'fc-grey'>${params.value || ''}</div > `
					} else if (params.data.instructionState === 2) {
						return `<div class= 'fc-green'>${params.value || ''}</div > `
					} else {
						return `<div class= 'fc-yellow'>${params.value || ''}</div > `
					}
				}
			},
			{
				headerName: this.getZH('verificationStatus'),
				field: 'clearStateName',
				minWidth: 100,
				pinned: 'right',
				cellRenderer: params => {
					if (params.data.clearState === 1) {
						return `<div class= 'fc-grey'>${params.value || ''}</div > `
					} else if (params.data.clearState === 2) {
						return `<div class= 'fc-blue'>${params.value || ''}</div > `
					} else {
						return `<div class= 'fc-green'>${params.value || ''}</div > `
					}
				}
			},
			{
				headerName: this.getZH('billStatus'),
				field: 'entryStateName',
				minWidth: 100,
				pinned: 'right',
				cellRenderer: params => {
					if (params.data.entryState === 1) {
						return `<div class= 'fc-grey'>${params.value || ''}</div > `
					} else if (params.data.entryState === 2) {
						return `<div class= 'fc-blue'>${params.value || ''}</div > `
					} else if (params.data.entryState === 10) {
						return `<div class= 'fc-red'>${params.value || ''}</div > `
					} else if (params.data.entryState === 3 || params.data.entryState === 11) {
						return `<div class= 'fc-yellow'>${params.value || ''}</div > `
					} else {
						return `<div class= 'fc-green'>${params.value || ''}</div > `
					}
				}
			},
			{
				headerName: this.getZH('billingStatus'),
				field: 'invoiceApplyStateName',
				pinned: 'right',
				hide: this.type === 'AP',
				minWidth: 130,
				cellRenderer: params => {
					if (params.data.invoiceApplyState === 1) {
						return `<div class= 'fc-grey'>${params.value || ''}</div > `
					} else if (params.data.invoiceApplyState === 2) {
						return `<div class= 'fc-blue'>${params.value || ''}</div > `
					} else {
						return `<div class= 'fc-green'>${params.value || ''}</div > `
					}
				}
			},
			{
				headerName: this.getZH('invoiceStatus'),
				field: 'invoiceStateName',
				hide: this.type === 'AP',
				minWidth: 100,
				pinned: 'right',
				cellRenderer: params => {
					if (params.data.invoiceState === 1) {
						return `<div class= 'fc-grey'>${params.value || ''}</div > `
					} else if (params.data.invoiceState === 2) {
						return `<div class= 'fc-blue'>${params.value || ''}</div > `
					} else {
						return `<div class= 'fc-green'>${params.value || ''}</div > `
					}
				}
			},
			{
				headerName: this.getZH('profitStateName'),
				field: 'profitStateName',
				minWidth: 100,
				pinned: 'right',
				cellRenderer: params => {
					if (params.data.profitState === 1) {
						return `<div class= 'fc-grey'>${params.value || ''}</div > `
					} else if (params.data.profitState === 2) {
						return `<div class= 'fc-blue'>${params.value || ''}</div > `
					} else {
						return `<div class= 'fc-green'>${params.value || ''}</div > `
					}
				}
			}
			],
			gridOptionsRight: {
				rowSelection: 'multiple',
				rowMultiSelectWithClick: true,
				suppressRowClickSelection: true, // 选中单元格后可以复制内容
				context: {
					componentParent: this
				},
				onRowSelected: selectorObj => {
					if (selectorObj.node.selected) {
						this.selectedItems.push(selectorObj.data)
					} else {
						const _data = selectorObj.data
						const _id = this.selectedItems.findIndex(item => item.id === _data.id)
						this.selectedItems.splice(_id, 1)
					}
				}
			},
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
			showEntryPool: false,
			totalPayable: null,
			expenseEntryDialog: false,
			expenseEntryMultipleForm: {},
			allRecordedDialog: false,
			allRecordedDialogData: [],
			expenseEntryType: true,
			businessTypeList: [],
			YHTList: []
		}
	},
	computed: {
	},

	methods: {
		/**
		 * 初始化数据
		 */
		async init() {
			let res = await getThikBusinessTypeListApi()
			if (res.ok) {
				this.businessTypeList = res.content || []
			}
			let rs = await getYHTListApi()
			if (rs.ok) {
				this.YHTList = rs.content
			}
		},
		goBillDetail(id) {
			this.$router.push({ name: `AirFmsPayableBillDetail`, query: { id: id, origin: 'AirPayDetailList' } })
		},
		// 申请核销
		applyOrHedgeClear() {
			let selectedRows = this.gridApi.getSelectedRows();
			if (selectedRows.length <= 0) {
				this.$message.error(this.$t("sea.checkAtLeastOnePieceOfData"));
				return;
			}
			let selectedSettlementId = [];
			let ids = [];
			let MSG = "";
			selectedRows.forEach(v => {
				ids.push(v.id);
				if (selectedSettlementId.indexOf(v.settlementCompanyId) < 0) {
					selectedSettlementId.push(v.settlementCompanyId);
				}
				// if (v.entryState != 4) {
				//   MSG = "只有账单状态为已对账才能进行核销操作";
				// }
				if (v.confirmationState !== 2) {
					MSG = "只有确认状态为已确认才能进行核销操作";
				}
				if (v.clearState !== 1 && v.clearState !== 2) {
					MSG = "只有核销状态为未核销或者部分核销才能进行核销操作";
				}
				if (v.instructionState !== 1 && v.instructionState !== 2) {
					MSG = "只有申请核销状态为未申请或者部分申请才能进行核销操作";
				}
			});
			if (selectedSettlementId.length > 1) {
				this.$message.error("不是同一家结算单位的不支持一起发送账单！");
				return;
			}
			if (MSG) {
				this.$message.error(MSG);
				return;
			}
			this.$router.push({
				name: 'ThkFmsApplyClearPage',
				query: {
					ids: ids.join(","),
					origin: "CHARGE",
					originType: this.type,
					back: this.type === 'AR' ? 'ExpenseReceivableDetail' : "ExpensePayableDetail"
				}
			});
		},
		// 申请核销
		applyOrHedgeClearAp() {
			let selectedRows = this.gridApi.getSelectedRows()
			if (selectedRows.length <= 0) {
				this.$message.error(this.$t("common.please_select_one_data"));
				return
			}
			let selectedSettlementId = []
			let ids = []
			let MSG = ""
			let businessTypeMap = []
			selectedRows.forEach(v => {
				ids.push(v.id)
				businessTypeMap[v.businessType] = v.businessType

				if (selectedSettlementId.indexOf(v.settlementCompanyId) < 0) {
					selectedSettlementId.push(v.settlementCompanyId)
				}
				// 只有核销状态为未核销或者部分核销才能进行核销操作
				if (v.clearState !== 1 && v.clearState !== 2) {
					MSG = this.$t("receiveFms.clear_desc_1")
				}
				// 只有申请核销状态为未申请或者部分申请才能进行核销操作
				if (v.instructionState !== 1 && v.instructionState !== 2) {
					MSG = this.$t("receiveFms.clear_desc_2")
				}
				// 只有确认状态为已确认才能进行操作
				if (v.confirmationState !== 2) {
					MSG = this.$t("air.clear_desc_6")
				}

			})
			if (selectedSettlementId.length > 1) {
				// 不是同一家结算单位的不支持一起申请核销！
				this.$message.error(this.$t("receiveFms.clear_desc_3"));
				return;
			}
			if (MSG) {
				this.$message.error(MSG);
				return;
			}
			// 不是y类型的不支持一起操作！
			// if (Object.keys(businessTypeMap).length > 1) {
			// 	this.$message.error(this.$t("不是同一种业务类型的不支持一起操作！"));
			// 	return
			// }
			// ids, 业务类型
			this.$refs.applyPayableClearDialogRef.show(ids, 'THIRD_ORDER')
		},
		// 申请付款
		applyPayment() {
			let selectedRows = this.gridApi.getSelectedRows()
			if (selectedRows.length <= 0) {
				this.$message.error(this.$t("common.please_select_one_data"));
				return;
			}
			let selectedSettlementId = [];
			let ids = [];
			for (let index = 0, len = selectedRows.length; index < len; index++) {
				let item = selectedRows[index]
				ids.push(item.id);
				if (selectedSettlementId.indexOf(item.settlementCompanyId) < 0) {
					selectedSettlementId.push(item.settlementCompanyId)
				}
				// 不是同一家结算单位的不支持一起操作！
				if (selectedSettlementId.length > 1) {
					this.$message.error(this.$t("receiveFms.clear_desc_3"));
					return;
				}
				// 只有部分核销或者未核销才能进行操作
				if (item.clearState !== 1 && item.clearState !== 2) {
					this.$message.error(this.$t("receiveFms.clear_desc_1"));
					return;
				}
				// 只有部分申请或者未申请才能进行操作
				if (item.instructionState !== 1 && item.instructionState !== 2) {
					this.$message.error(this.$t("receiveFms.clear_desc_2"));
					return;
				}
			}
			this.$refs.applyPaymentDialogRef.show(ids, 'THIRD_ORDER');
		},
		// 申请开票
		applyInvoice() {
			let selectedRows = this.gridApi.getSelectedRows()
			if (selectedRows.length <= 0) {
				this.$message.error(this.$t("receiveFms.please_select_one_then_bill"))
				return
			}
			let ids = []
			let settlementCompanyIds = []
			let settlementOfficeIds = []
			let isPass = true // 账单状态已对账 且 开票状态为部分开票 或者 未开票
			let isPiecePass = true
			let businessTypeMap = []
			selectedRows.forEach(v => {
				businessTypeMap[v.businessType] = v.businessType
				if (settlementCompanyIds.indexOf(v.settlementCompanyId) < 0) {
					settlementCompanyIds.push(v.settlementCompanyId)
				}
				if (settlementOfficeIds.indexOf(v.settlementOfficeId) < 0) {
					settlementOfficeIds.push(v.settlementOfficeId)
				}
				// 票结费用需要费用确认单已确认
				// if (v.settlementMode == 1) {
				if (v.confirmationState !== 2) {
					isPiecePass = false
				}
				// } else {
				// 其他账期 -> 未开票 部分开票 已对账
				if ((v.invoiceState === 1 || v.invoiceState === 2) && (v.invoiceApplyState === 1 || v.invoiceApplyState === 2) && v.settlementMode === 1) {
					// 通过校验
				} else {
					isPass = false
				}
				// }
				ids.push(v.id)
			})
			if (settlementCompanyIds.length > 1) {
				this.$message.error(this.$t("receiveFms.need_same_settlement_company"))
				return
			}
			// 同样的收款账套之后 结算方式肯定相同
			if (settlementOfficeIds.length > 1) {
				this.$message.error(this.$t("receiveFms.need_same_settlement_officeIds"))
				return
			}
			// 其他账期 -> 未开票 部分开票 已对账 票结费用需要费用确认单已确认
			if (!isPass) {
				this.$message.error(this.$t("receiveFms.need_un_invoice_and_bill_check_sea"))
				return
			}
			// 其他账期 -> 未开票 部分开票 已对账 票结费用需要费用确认单已确认
			if (!isPiecePass) {
				this.$message.error(this.$t("receiveFms.invoicing_confirmed"))
				return
			}
			// 不是同一种业务类型的不支持一起操作！
			if (Object.keys(businessTypeMap).length > 1) {
				this.$message.error(this.$t("不是同一种业务类型的不支持一起操作！"));
				return
			}
			this.businessTypeOpt = selectedRows[0].businessType
			this.selectedIds = ids
			this.$refs.applyInvoiceDialogRef.show()
		},
		async list() {
			let formData = this.$extends({}, this.formData)
			formData.businessDateStart = this.$isEmpty(formData.bussinessDateRange) ? null : formData.bussinessDateRange[0]
			formData.businessDateEnd = this.$isEmpty(formData.bussinessDateRange) ? null : formData.bussinessDateRange[1]
			delete formData.bussinessDateRange
			this.selectedItems = []
			this.loading = true
			let fn = this.type === 'AR' ? getChargeArPagesApi : getChargeApPagesApi
			const res = await fn(formData)
			this.loading = false
			if (res.ok) {
				res.content.list.forEach(v => {
					try {
						v.atd = parseTime(v.atd, '{y}-{m}-{d}')
						v.confirmTime = parseTime(v.confirmTime, '{y}-{m}-{d}')
					} catch (e) {
						console.log(e)
					}
				})
				this.tableData = res.content
				this.pageTotal = Number(res.content.total)
			} else {
				this.pageTotal = 0
				this.tableData = []
			}
		},
		formatNumberToThousands(value) {
			return formatNumberToThousands(value)
		},
		topSearch() {
			this.currPage = 1
			this.list()
		},
		clearSearchForm() { // 搜索重置
			this.$refs.formData.resetFields()
			this.topSearch()
		},
		onReady(params) {
			this.gridApi = params.api
			this.columnApi = params.columnApi
			this.gridApi.sizeColumnsToFit()
			this.resetHeight()
			// window.addEventListener('resize', function() {
			//   setTimeout(function() {
			//     params.api.sizeColumnsToFit()
			//   })
			// })
		},
		// 选择入账
		selectPostingBtn() {
			this.selectedItems = this.gridApi.getSelectedRows()
			this.columnApi.setColumnVisible('visibleCol', true)
			this.showEntryPool = true
		},
		expenseEntrySuc() {
			this.topSearch()
			this.closePool()
		},
		// 删除选中的箱号
		deleteSelectedItems(_obj) {
			// 根据删除的箱号删除列表重对应的选中状态
			this.gridApi.forEachNode(node => {
				if (node.data.id === _obj.id) {
					node.setSelected(false)
				}
			})
		},
		// 关闭浮窗
		closePool() {
			this.selectedItems = []
			this.showEntryPool = false
			this.gridApi.deselectAll()
			this.columnApi.setColumnVisible('visibleCol', false)
		},
		// 打开拆合编辑页
		passValidation() {
			let selectedItems = this.gridApi.getSelectedRows()
			const totalPayable = []
			selectedItems.map(val => {
				const isSame = totalPayable.some(item => {
					if (val.currency === item.currency) {
						item.value += val.amount
						return true
					}
				})
				if (!isSame) {
					totalPayable.push({
						currency: val.currency,
						value: val.amount
					})
				}
			})
			this.expenseEntryMultipleForm = {
				ids: selectedItems.map(val => val.id),
				memberId: selectedItems[0].memberId,
				memberName: selectedItems[0].memberName,
				settlementMode: selectedItems[0].settlementMode,
				settlementModeName: selectedItems[0].settlementModeName,
				settlementCompanyId: selectedItems[0].settlementCompanyId,
				settlementCompanyName: selectedItems[0].settlementCompanyName,
				totalPayable: totalPayable,
				businessType: selectedItems[0].businessType
			}
			this.expenseEntryType = false
			this.expenseEntryDialog = true
			// this.$router.push({path: '/SeaExport/ExpenseEntry'})
		}
	},
	async created() {
		this.init()
	},
	mounted() {
		this.list()
		window.addEventListener('resize', this.throttle(this.resetHeight, 200, 300))
	}
}

</script>
<style lang='scss' scoped>
// .sys-right-inner-wrap {
//   height: 100%;
//   overflow: hidden;
//   overflow-y: auto;
// }

.container-wrap {
	margin-top: 20px;
	padding: 10px 20px;
	background: #fff;
}

.pagination-wrap {
	margin-top: 20px;
	text-align: right;
}

.features-btn {
	margin-top: 15px;
}

.dataTable {
	margin-top: 15px;
}

.operating {
	display: flex;

	i {
		font-size: 16px;
		margin: 0 5px;
		cursor: pointer;

		&:hover {
			transform: scale(1.1);
			transition: all 0.2s ease 0s;
		}
	}
}

.status-text {
	&.info-text {
		color: #909399;
	}

	&.warning-text {
		color: #e6a23c;
	}

	&.success-text {
		color: #67c23a;
	}

	&.danger-text {
		color: #f56c6c;
	}

	&.primary-text {
		color: #409eff;
	}
}

.primary-text {
	color: #409eff;
}

.billForm {
	display: flex;
	flex-wrap: wrap;

	.title {
		font-family: "Arial Negreta", "Arial";
		font-weight: 700;
		font-size: 18px;
		color: #333333;
		margin-bottom: 20px;

		span {
			color: red;
		}
	}

	.phoneCon {
		display: flex;
		justify-content: space-between;
	}

	.phone {
		width: 30%;
	}
}

.go-ams {
	margin-right: 8px;
}

.el-icon-click,
.el-icon-edit,
.el-icon-download {
	cursor: pointer;
	transition: all 0.2s ease 0s;

	&:hover {
		transform: scale(1.1);
	}
}

.change-label-calss ::v-deep .el-form-item__label {
	width: 200px !important;
}

.billForm ::v-deep {
	.el-form-item--medium .el-form-item__content {
		width: 70%;
	}

	.el-form-item {
		width: 100%;
	}
}

::v-deep .el-table__expand-column {
	pointer-events: none;
}

::v-deep .el-table__expand-column .el-icon {
	visibility: hidden;
}

.list-operating {
	display: flex;
	justify-content: space-between;

	::v-deep .el-button {
		margin-left: 0;
	}
}

.receivingMailbox ::v-deep {
	.el-table th > .cell:before {
		content: "*";
		color: red;
	}
}

.red {
	color: red;
}

.footer-btn {
	margin-top: 30px;
	text-align: right;
}

.container-pool-wrap {
	position: fixed;
	top: 0;
	margin-left: 10px;
	margin-top: 310px;
	width: 290px;
	height: 300px;
	background: #fff;
	box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1);
	z-index: 1000;
	overflow: hidden;
	border-radius: 4px;
}

//.list-operating ::v-deep .el-button{ margin-left: 0;}
.total-payable {
	font-size: 18px;
	color: #1890ff;
	margin-left: 50px;
}
</style>

