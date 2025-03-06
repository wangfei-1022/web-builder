<template>
  <div v-loading="loading" class="pd-16">
    <TopSearchItemsSlot :searchFun="list" :resetFun="reset" class="mb-10">
      <template slot="multipleSearch">
        <el-form ref="formData" :inline="true" :model="formData" class="search-form" label-width="120px">
          <el-form-item :label="getZH('entityNo')" prop="entityNo">
            <el-input v-model="formData.entityNo" size="mini" :placeholder="inputZH('orderNo')" clearable  />
          </el-form-item>
          <el-form-item :label="getZH('mblNo')" prop="extendInfo13">
            <el-input v-model="formData.extendInfo13" size="mini" :placeholder="inputZH('mblNo')" clearable  />
          </el-form-item>
          <el-form-item :label="getZH('customer')" prop="memberId" v-if="type === 'AR'">
             <type-select v-model="formData.memberId" type="customer"  />
          </el-form-item>
          <el-form-item :label="getZH('supplier')" prop="confirmationIdExtendInfo1" v-if="type === 'AP'">
             <type-select v-model="formData.confirmationIdExtendInfo1" type="supplier"  />
          </el-form-item>
          <el-form-item :label="getZH(type === 'AR' ? 'collectionACSet' : 'paymentACSet')" prop="settlementOfficeId">
            <el-select v-model="formData.settlementOfficeId" size="mini" >
              <el-option v-for="(item, index) in YHTList" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item :label="getZH('confirmationTicketStatus')" prop="confirmationState">
            <FmsSelect addAll v-model="formData.confirmationState" size="mini" type="confirmationState" />
          </el-form-item>
          <el-form-item :label="getZH('billingStatus')" prop="invoiceApplyState" v-if="type === 'AR'">
            <FmsSelect addAll v-model="formData.invoiceApplyState" size="mini" type="invoiceApplyState" />
          </el-form-item>
          <el-form-item :label="getZH('invoiceStatus')" prop="invoiceState" v-if="type === 'AR'">
            <FmsSelect addAll v-model="formData.invoiceState" size="mini" type="invoiceState" />
          </el-form-item>
          <el-form-item  :label="type==='AR' ? getZH('applyVerificationStatus') : getZH('instructionStateNamePayable')" prop="instructionState">
            <FmsSelect addAll v-model="formData.instructionState" size="mini" type="applyClearState" />
          </el-form-item>
          <el-form-item :label="getZH('verificationStatus')" prop="clearState">
            <FmsSelect addAll v-model="formData.clearState" size="mini" type="clearState" />
          </el-form-item>
          <el-form-item :label="getZH('billStatus')" prop="entryState">
            <FmsSelect addAll v-model="formData.entryState" size="mini" type="entryState" />
          </el-form-item>
          <el-form-item :label="getZH('profitStateName')" prop="profitState">
            <FmsSelect addAll v-model="formData.profitState" size="mini" type="profitState" />
          </el-form-item>
          <el-form-item :label="getZH('businessDate')" prop="bussinessDateRange">
            <common-picker pikcerType="daterange" :defaultTime="['00:00:00', '23:59:59']" v-model="formData.bussinessDateRange"  clearable></common-picker>
          </el-form-item>
         </el-form>
      </template>
    </TopSearchItemsSlot>
    <div class="mb-10 top-btn-wrap">
      <el-button size="mini" type="primary" @click="batchConfirm()">{{getZH('expenseRecognition')}}</el-button>
      <el-button size="mini" type="primary" v-if="type === 'AR'" @click="applyInvoice()">{{getZH('applyBilling')}}</el-button>
      <el-button size="mini" type="primary" v-if="type === 'AP'" @click="applyPayment()">{{getZH('applyPayment')}}</el-button>
      <el-button size="mini" type="primary" v-if="type === 'AR'" @click="applyOrHedgeClear()" >{{getZH('applyCancellation')}}</el-button>
      <el-button size="mini" type="primary" v-if="type === 'AP'" @click="applyOrHedgeClearAp()" >{{getZH('applyCancellation')}}</el-button>
    </div>
    <ag-grid-vue
      :locale-text-func="_i18nGridLocalText"
      :grid-options="gridOptionsRight"
      :side-bar="sideBarDefs"
      :column-defs="columnDefsRight"
      :row-data="dataList"
      :enable-col-resize="true"
      :enable-sorting="true"
      :grid-ready="onReadyRight"
      :style="gridHeight"
      class="ag-theme-balham"
    />
    <Pagination :total="total" :limit.sync="formData.pageSize" :page.sync="formData.pageNum" @pagination="list" />
    <apply-invoice-dialog ref="applyInvoiceDialogRef" :businessType="businessTypeOpt" origin="CONFIRMATION" :ids="selectedIds" :isSpecifyInvoiceType="true"  toPath='ThkOrderManagementApplyForInvoice'></apply-invoice-dialog>
    <apply-payment-dialog ref="applyPaymentDialogRef" origin="CONFIRMATION" toPath="ThkApplyForPayment"/>
    <apply-payable-clear-dialog ref="applyPayableClearDialogRef" origin="CONFIRMATION" toPath="ThkFmsApplyPayClearPage"/>
  </div>
</template>

<script>
import { batchConfirmApApi, batchConfirmArApi, getThirdConfirmationApListApi, getThirdConfirmationArListApi } from '@/api/thirdKind'
import operationBtn from './operationBtn'
import getZHMixin from '../../components/getZHMixin.js'
import FmsSelect from '@/components/Form/FmsSelect.vue'
import ApplyInvoiceDialog from "@/views/financial/components/ApplyInvoiceDialog"
import applyPaymentDialog from "@/views/financial/components/ApplyPaymentDialog"
import applyPayableClearDialog from "@/views/financial/components/ApplyPayableClearDialog";
import { formatNumberToThousands } from "@/utils"
import { getYHTListApi } from '@/api/partner/base'
export default {
	name: 'ExpenseConfirmation',
	mixins: [getZHMixin],
	components: { operationBtn, FmsSelect, ApplyInvoiceDialog, applyPaymentDialog, applyPayableClearDialog },
	props: {
		type: {
			type: String,
			default: 'AR'
		}
	},
	data() {
		return {
			formData: {
				entityNo: '',
				extendInfo13: '',
				confirmationIdExtendInfo1: '',
				confirmationState: '',
				invoiceState: '',
				invoiceApplyState: '',
				instructionState: '',
				clearState: '',
				entryState: '',
				profitState: '',
				memberId: null,
				settlementOfficeId: null,
				bussinessDateRange: null,
				businessDateStart: null,
				businessDateEnd: null,
				settlementCompanyId: null,
				pageSize: 50,
				pageNum: 1
			},
			total: 0,
			dataList: [],
			selectedIds: [],
			businessTypeOpt: null,
			columnDefsRight: [
				{
					headerName: '',
					width: 55,
					pinned: 'left',
					suppressSorting: true,
					checkboxSelection: true,
					headerCheckboxSelection: true,
					suppressMenu: true,
					suppressSizeToFit: true,
					suppressResize: true
				},
				{
					headerName: this.getZH('confirmationNo'),
					field: 'confirmationNo',
					minWidth: 140,
					cellRenderer: params => `<span class="fc-blue">${params.value || ''}</span>`,
					pinned: 'left'
					// hide: true
				},
				{
					headerName: this.getZH('mblNo'),
					field: 'extendInfo13',
					minWidth: 120,
					cellRenderer: params => `<span class="fc-blue">${params.value || ''}</span>`,
					pinned: 'left'
				},
				{
					headerName: this.getZH('entityNo'),
					field: 'entityNo',
					minWidth: 120,
					cellRenderer: params => `<span class="fc-blue">${params.value || ''}</span>`,
					pinned: 'left'
				},

				{
					headerName: this.getZH('businessType'),
					field: 'businessTypeName',
					minWidth: 120
				},
				{
					headerName: this.getZH('customer'),
					field: 'memberName',
					minWidth: 120,
					hide: this.type === 'AP'
				},
				{
					headerName: this.getZH('supplier'),
					field: 'scmSupplierName',
					minWidth: 120,
					hide: this.type === 'AR'
				},
				{
					headerName: this.getZH('settlementCompanyName'),
					field: 'settlementCompanyName',
					minWidth: 120
				},
				{
					headerName: this.getZH(this.type === 'AR' ? 'collectionACSet' : 'paymentACSet'),
					field: 'settlementOfficeName',
					minWidth: 120
				},
				{
					headerName: this.getZH('settlementMethod'),
					field: 'settlementModeName',
					minWidth: 120
				},
				{
					headerName: this.getZH('ownedSales'),
					field: 'responsiblePersonName',
					minWidth: 120
				},
				{
					headerName: this.getZH('polCode'),
					field: 'extendInfo3',
					minWidth: 120
				},
				{
					headerName: this.getZH('podCode'),
					field: 'extendInfo4',
					minWidth: 120
				},
				{
					headerName: this.getZH('businessDate'),
					field: 'bussinessDate',
					minWidth: 140,
					cellRenderer: params => `<span>${this.formatDate(params.value, 'YYYY-MM-DD HH:mm')}</span > `
				},
				{
					headerName: this.getZH('confirmationTicketStatus'),
					field: 'confirmationStateName',
					minWidth: 120,
					cellRenderer: params => {
						if (params.data.confirmationState === 1) {
							return `<div class= 'fc-grey'>${params.value || ''}</div > `
						} else if (params.data.confirmationState === 2) {
							return `<div class= 'fc-green'>${params.value || ''}</div > `
						} else {
							return `<div class= 'fc-yellow'>${params.value || ''}</div > `
						}
					}
				},
				{
					headerName: this.type === 'AR' ? this.getZH('applyVerificationStatus') : this.getZH('instructionStateNamePayable'),
					field: 'instructionStateName',
					minWidth: this.type === 'AR' ? 120 : 160,
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
					minWidth: 120,
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
					minWidth: 120,
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
					minWidth: 120,
					hide: this.type === 'AP',
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
					minWidth: 120,
					hide: this.type === 'AP',
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
					minWidth: 120,
					cellRenderer: params => {
						if (params.data.profitState === 1) {
							return `<div class= 'fc-grey'>${params.value || ''}</div > `
						} else if (params.data.profitState === 2) {
							return `<div class= 'fc-blue'>${params.value || ''}</div > `
						} else {
							return `<div class= 'fc-green'>${params.value || ''}</div > `
						}
					}
				},
				{
					headerName: this.getZH('totalExpenses'),
					field: 'amountsStr',
					minWidth: 120
				},
				{
					headerName: this.getZH('submitByName'),
					field: 'confirmByName',
					minWidth: 120
				},
				{
					headerName: this.getZH('submitTime'),
					field: 'confirmTime',
					minWidth: 140,
					cellRenderer: params => `<span >${this.formatDate(params.value, 'YYYY-MM-DD HH:mm:ss')}</span > `
				},
				{
					headerName: this.$t('common.operation'), pinned: 'right', field: `id`, minWidth: 100,
					cellRendererFramework: 'operationBtn'
				}],
			gridOptionsRight: {},
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
			loading: false,
			gridApi: null,
			YHTList: []
		}
	},
	created() {
		this.gridOptionsRight = {
			rowSelection: 'multiple',
			rowMultiSelectWithClick: true,
			suppressRowClickSelection: true, // 选中单元格后可以复制内容
			context: {
				componentParent: this
			}
		}
		this.init()
		this.list()

	},
	mounted() {

	},

	methods: {
		/**
		 * 初始化数据
		 */
		async init() {
			let rs = await getYHTListApi()
			if (rs.ok) {
				this.YHTList = rs.content
			}
		},
		onReadyRight(params) {
			this.gridApi = params.api
			this.columnApi = params.columnApi
			this.gridApi.sizeColumnsToFit()
			window.addEventListener('resize', function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit()
				})
			})
		},
		getCheckedData() {
			return this.gridApi.getSelectedRows()
		},
		// 批量确认
		batchConfirm() {
			const selectedList = this.getCheckedData()
			if (this.$isEmpty(selectedList)) {
				this.$message.warning(this.$t('sea.checkAtLeastOnePieceOfData'))
				return
			}
			let sameConfirmationState = selectedList.some(item => item.confirmationState !== 1 && item.confirmationState !== 11)
			if (sameConfirmationState) {
				this.$message.warning(this.$t('sea.selectExpensesToBeConfirmed'))
				return
			}
			this.$confirm(this.$t('sea.cannotBeChangedAfterConfirmationConfirmationSheetInformation'), this.$t('common.tips'), {
				confirmButtonText: this.$t('common.confirmBtn'),
				cancelButtonText: this.$t('common.cancelBtn'),
				type: 'warning'
			}).then(() => {
				let ids = []
				selectedList.forEach(item => {
					ids.push(item.id)
				})
				let fn = this.type === 'AR' ? batchConfirmArApi : batchConfirmApApi
				this.loading = true
				fn({ ids }).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.confirmSuccess'))
						this.list()
					}
					this.loading = false
				})
			})
		},
		// 申请开票
		applyInvoice() {
			let selectedRows = this.getCheckedData()
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
		// 申请核销
		applyOrHedgeClear() {
			let selectedRows = this.getCheckedData();
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
					origin: "CONFIRMATION",
					originType: this.type,
					back: this.type === 'AR' ? 'ConfirmationExpenseReceivable' : "ConfirmationExpensesPayable"
				}
			});
		},
		// 申请核销
		applyOrHedgeClearAp() {
			let selectedRows = this.getCheckedData();
			if (selectedRows.length <= 0) {
				this.$message.error(this.$t("common.please_select_one_data"));
				return;
			}
			let selectedSettlementId = [];
			let ids = [];
			let MSG = "";
			let businessTypeMap = []
			selectedRows.forEach(v => {
				ids.push(v.id);
				businessTypeMap[v.businessType] = v.businessType

				if (selectedSettlementId.indexOf(v.settlementCompanyId) < 0) {
					selectedSettlementId.push(v.settlementCompanyId);
				}
				// 只有核销状态为未核销或者部分核销才能进行核销操作
				if (v.clearState !== 1 && v.clearState !== 2) {
					MSG = this.$t("receiveFms.clear_desc_1");
				}
				// 只有申请核销状态为未申请或者部分申请才能进行核销操作
				if (v.instructionState !== 1 && v.instructionState !== 2) {
					MSG = this.$t("receiveFms.clear_desc_2");
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
			let selectedRows = this.getCheckedData();
			if (selectedRows.length <= 0) {
				this.$message.error(this.$t("common.please_select_one_data"));
				return
			}
			let selectedSettlementId = []
			let ids = []
			for (let index = 0, len = selectedRows.length; index < len; index++) {
				let item = selectedRows[index]
				ids.push(item.id)
				if (selectedSettlementId.indexOf(item.settlementCompanyId) < 0) {
					selectedSettlementId.push(item.settlementCompanyId)
				}
				// 不是同一家结算单位的不支持一起操作！
				if (selectedSettlementId.length > 1) {
					this.$message.error(this.$t("receiveFms.clear_desc_3"));
					return
				}
				// 非票结的只有账单状态为已对账才能进行操作
				// if (item.settlementMode !== 1 && item.entryState !== 4) {
				//   this.$message.error(this.$t("receiveFms.clear_desc_5"));
				//   return;
				// }
				// 只有部分核销或者未核销才能进行操作
				if (item.clearState !== 1 && item.clearState !== 2) {
					this.$message.error(this.$t("receiveFms.clear_desc_1"));
					return
				}
				// 只有部分申请或者未申请才能进行操作
				if (item.instructionState !== 1 && item.instructionState !== 2) {
					this.$message.error(this.$t("receiveFms.clear_desc_2"));
					return
				}
				// 只有确认状态为已确认才能进行操作
				if (item.confirmationState !== 2) {
					this.$message.error(this.$t("air.clear_desc_6"));
					return
				}
			}
			this.$refs.applyPaymentDialogRef.show(ids, 'THIRD_ORDER');
		},
		/**
		 * 获取列表
		 */
		async list() {
			this.loading = true
			let fn = this.type === 'AR' ? getThirdConfirmationArListApi : getThirdConfirmationApListApi
			let formData = this.$extends({}, this.formData)
			formData.businessDateStart = this.$isEmpty(formData.bussinessDateRange) ? null : formData.bussinessDateRange[0]
			formData.businessDateEnd = this.$isEmpty(formData.bussinessDateRange) ? null : formData.bussinessDateRange[1]
			delete formData.bussinessDateRange
			const res = await fn(formData).catch(res => {
				this.loading = false
			})
			if (res.ok) {
				res.content.list.map(data => {
					let str = ''
					data.currencyAmounts.map((item, index) => {
						str += `${item.currency} ${formatNumberToThousands(item.value)}${index === data.currencyAmounts.length - 1 ? '' : '、'}`
					})
					data.amountsStr = str
					let scmSupplierDto = this.$isNotEmpty(data.confirmationExtendInfo5) ? JSON.parse(data.confirmationExtendInfo5) : {}
					data.scmSupplierName = scmSupplierDto.chineseName
				})
				this.dataList = res.content.list || []
				this.total = Number(res.content.total)
				this.loading = false
			} else {
				this.loading = false
			}
		},
		/**
		 * 查看
		 */
		detail(operation, id) {
			let name = this.type === 'AR' ? 'ConfirmationExpenseReceivableDetail' : 'ConfirmationExpensesPayableDetail'
			let back = this.type === 'AR' ? 'ConfirmationExpenseReceivable' : 'ConfirmationExpensesPayable'
			this.$router.push({ name: name, query: { id: id, origin: back } })
		},
		/**
		 * 重置搜索条件
		 */
		reset() {
			this.$refs.formData.resetFields()
			this.list()
		}
	}
}
</script>

<style scoped lang="scss">
.container-wrap {
	margin-top: 20px;
	padding: 10px 20px;
	background: #fff;
}
::v-deep.status-wrap {
	width: 100%;
	height: 100%;
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-start;
	align-items: center;
	.status-dot {
		display: block;
		width: 6px;
		height: 6px;
		border-radius: 6px;
		background: #ccc;
		margin-right: 4px;
		&.processing {
			background: #e6a23c;
		}
		&.successed {
			background: #67c23a;
		}
		&.rejected {
			background: #f56c6c;
		}
	}
}
</style>
