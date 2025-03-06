<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="getList" :resetFun="reset">
			<el-form slot="multipleSearch" ref="formData" :inline="true" :model="formData" label-width="100px" size="mini" class="fms-search-form">
				<el-form-item :label='$t("receiveFms.entity_no")' prop="entityNo">
					<el-input v-model="formData.entityNo" type="text" size="mini" clearable />
				</el-form-item>
				<el-form-item :label='$t("receiveFms.business_no")' prop="extendInfo11">
					<el-input v-model="formData.extendInfo11" type="text" size="mini" clearable />
				</el-form-item>
				<el-form-item :label='$t("receiveFms.MBL")' prop="extendInfo13" v-if="type === 'AR'">
					<el-input v-model="formData.extendInfo13" type="text" size="mini" clearable />
				</el-form-item>
				<el-form-item :label='$t("receiveFms.HBL")' prop="extendInfo14" v-if="type === 'AR'">
					<el-input v-model="formData.extendInfo14" type="text" size="mini" clearable />
				</el-form-item>
				<el-form-item :label='$t("receiveFms.bill_no")' prop="billNo" v-if="type === 'AR'">
					<el-input v-model="formData.billNo" type="text" size="mini" clearable />
				</el-form-item>
				<el-form-item :label='$t("receiveFms.confirmation_no")' prop="confirmationNo" v-if="false">
					<el-input v-model="formData.confirmationNo" type="text" size="mini" clearable />
				</el-form-item>
				<el-form-item :label="$t('receiveFms.business_type')" prop="businessTypeList">
					<base-select v-model="formData.businessTypeList" type="businessType" collapse-tags @selected="businessTypeChange" multiple></base-select>
				</el-form-item>
        <el-form-item :label="$t('receiveFms.entityTypeName')" prop="entityTypeList" v-if="formData.businessTypeList.length">
					<el-select v-model="formData.entityTypeList" size="mini" collapse-tags multiple>
						<el-option v-for="item in entityTypeList" :key="item.code" :label="item.name" :value="item.code" />
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('receiveFms.settlement_company_name')" prop="settlementCompanyId">
					<type-select v-model="formData.settlementCompanyId" type="settlementCompany" />
				</el-form-item>
				<el-form-item :label="$t('receiveFms.settlement_office_name')" prop="settlementOfficeId">
          <base-select v-model="formData.settlementOfficeId" type="settlementOffice" addAll></base-select>
				</el-form-item>
				<el-form-item :label="$t('receiveFms.settlement_mode')" prop="settlementMode">
					<base-select v-model="formData.settlementMode" type="settlementMode" addAll></base-select>
				</el-form-item>
				<el-form-item :label="$t('receiveFms.sales_names')" prop="responsiblePersonId" v-if="type === 'AR'">
          <base-select v-model="formData.responsiblePersonId" type="sale" filterable clearable ></base-select>
				</el-form-item>
				<el-form-item :label="$t('payableFms.product_names')" prop="responsiblePersonId" v-if="type === 'AP'">
					<base-select v-model="formData.responsiblePersonId" type="sale" filterable clearable ></base-select>
				</el-form-item>
				<el-form-item :label="$t('receiveFms.bill_status')" prop="entryState">
          <fms-select v-model="formData.entryState" type="entryState"   addAll></fms-select>
				</el-form-item>
				<el-form-item :label="$t('receiveFms.invoice_status')" prop="invoiceState" v-if="type === 'AR'">
          <fms-select v-model="formData.invoiceState" type="invoiceState" addAll></fms-select>
				</el-form-item>
				<el-form-item :label="$t('receiveFms.verification_status')" prop="clearState">
					<fms-select v-model="formData.clearState" type="clearState" addAll></fms-select>
				</el-form-item>
				<el-form-item :label="$t('receiveFms.apply_clear_status')" prop="instructionState">
          <fms-select v-model="formData.instructionState" type="applyClearState" addAll></fms-select>
				</el-form-item>
				<el-form-item :label="$t('receiveFms.confirmation_state')" prop="confirmationState">
          <fms-select v-model="formData.confirmationState" type="confirmationState" addAll></fms-select>
				</el-form-item>
	      <el-form-item :label="$t('receiveFms.profit_state')" prop="profitState">
					<fms-select v-model="formData.profitState" type="profitState" addAll />
				</el-form-item>
			</el-form>
		</top-search-items-slot>
		<div class="">
			<div class="top-btn-wrap mb-10 mt-10">
				<el-button size="mini" type="primary" @click="createBill()" v-permission="['fms:receive:confirmation:create:bill']">{{$t('receiveFms.create_bill')}}</el-button>
				<el-button size="mini" type="primary" @click="receiveInvoice()" v-if="type === 'AR' && false">{{$t('receiveFms.receive_invoice')}}</el-button>
        <el-button size="mini" type="primary" @click="applyInvoice()" v-if="type === 'AR'">{{$t('receiveFms.applyInvoice')}}</el-button>
				<el-button size="mini" type="primary" @click="applyOrHedgeClear(false)">{{$t('receiveFms.applyClear')}}</el-button>

				<el-button size="mini" type="primary" @click="applyOrHedgeClear(true)" v-if="type === 'AR'">{{$t('receiveFms.hedgeClear')}}</el-button>
        <el-button size="mini" type="primary" @click="changeConfirmSettlementFn()" v-if="type === 'AR'">{{$t('receiveFms.changePrincipalType')}}</el-button>

        <el-button size="mini" type="primary" @click="receiveCleared()" v-if="type === 'AP'">{{$t('receiveFms.receive_cleared')}}</el-button>
        <el-button size="mini" type="primary" @click="applyPayment()" v-if="type === 'AP'">{{$t('receiveFms.applyPayment')}}</el-button>

      </div>
			<ag-grid-vue-pro :data="dataList" :style-grid="gridHeight" :column-fields-default="columnFields" :grid-ready="onReady" />

			<div class="page-total">
				<span>{{type === 'AR' ? $t('receiveFms.receive_sum'): $t('payableFms.payable_sum')}}：</span>
				<span>
					<span class="value-item" v-for="(item, index) in amountTotal" :key='index'>
						<span class='value'>{{item.currency}}</span>
						<span>{{item.value}}</span>
					</span>
				</span>
			</div>

			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList" />
		</div>

		<apply-invoice-dialog ref="applyInvoiceDialogRef" origin="CONFIRMATION" :ids="selectedIds" toPath='FmsApplyForInvoice'></apply-invoice-dialog>
		<create-bill-success ref="createBillSuccessRef" type="CONFIRMATION" :arap="type" :createBillInfo='createBillInfo' @success="getList"></create-bill-success>
		<receive-invoice ref="receiveInvoiceRef" :info='selectedInvoiceInfo' type='CONFIRMATION' @success="getList"></receive-invoice>
		<receive-cleard ref="receiveCleardRef" :info='selectedInvoiceInfo' type='CONFIRMATION' :arap="type" @success="getList"></receive-cleard>
    <change-confirm-settlement ref="changeConfirmSettlementRef" @success="getList" type="CONFIRMATION"></change-confirm-settlement>
    <apply-payment-dialog ref="applyPaymentDialogRef" origin="CONFIRMATION" toPath="FmsPayableApplyPayment"/>
  </div>
</template>

<script>
import { getCustomerListApi, getCustomerTypeListApi, checkCustomerIsUniqueApi, getSalesListApi } from "@/api/partner/customerManage";
import { getDictDataApi, getReceiveConfirmationListApi, getReceiveConfirmationListTotalApi, receiveConfirmationConfirmApi, receiveRecallConfirmationConfirmApi, receiveConfirmationCreateBillApi } from "@/api/financial/fmsReceive";
import OptionBtnConfirmation from "./optionBtn";
import CreateBillSuccess from "../components/CreateBillSuccess";
import ApplyInvoiceDialog from "../components/ApplyInvoiceDialog";
import { AgGridVue } from "ag-grid-vue";
import { getWarehouseSelectionsApi } from "@/api/OverseasWarehouse/warehousePriceCard";
import { parseTime, formatNumberToThousands } from "@/utils/index";
import { getPayableConfirmationListApi, getPayableConfirmationListTotalApi, payableConfirmationCreateBillApi } from "@/api/financial/fmsPayable";
import ReceiveInvoice from "../components/ReceiveInvoice";
import ReceiveCleard from "../components/ReceiveCleard";
import ApplyPaymentDialog from "../components/ApplyPaymentDialog";
import ChangeConfirmSettlement from "../components/ChangeConfirmSettlement"; // 变更责任主体
import receiveTable from "./table/receiveTable";
import payableTable from "./table/payableTable";
import { businessOrderMap } from "../components/constants";

export default {
	name: "FmsConfirmationList",
	components: {
		AgGridVue,
		OptionBtnConfirmation,
		CreateBillSuccess,
		ReceiveInvoice,
		ReceiveCleard,
		ApplyInvoiceDialog,
    ChangeConfirmSettlement,
    ApplyPaymentDialog
	},
	props: {
		type: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
			selectedIds: [],
			selectedInvoiceInfo: {},
			formData: {
				extendInfo11: "",
				entityNo: "",
				confirmationNo: "",
				settlementCompanyId: "",
				settlementOfficeId: "", // 一海通结算公司
				businessType: "",
        businessTypeList: [],
        entityType: '',
        entityTypeList: [],
				feeId: "",
				entryState: "",
				invoiceState: "",
				clearState: "",
				instructionState: "",
				confirmationState: "",
				responsiblePersonId: ""
			},
			currentItem: "", // 当前选中行的id
			orderItem: {}, // 当前选中的行的实体订单数据
			createBillInfo: {}, // 生成账单所需信息
      entityTypeList: [],
      entityTypeListALL: [],

			pageSizeRange: [10, 20, 30, 50],
			pageSize: 50,
			pageNum: 1,
			total: 0,
			dataList: [],
			amountTotal: [], // 统计

			columnFields: [],
			gridApi: {},
			loading: false,
			addType: "" //
		};
	},
	created() {
		this.getBaseDataFn();
		if (this.type === "AP") {
			this.columnFields = payableTable;
		} else {
			this.columnFields = receiveTable;
		}
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getDictDataApi(35)]).then(results => {
				const entityTypeRes = results[0];
				if (entityTypeRes.ok) {
					this.entityTypeList = entityTypeRes.content;
					this.entityTypeListALL = entityTypeRes.content;
				}
			});
		},
		onReady(params) {
			this.gridApi = params.api;
		},
    businessTypeChange() {
      this.formData.entityTypeList = []
      if (this.formData.businessTypeList.length) {
        // 变更单据类型
        let arr = []
        this.formData.businessTypeList.forEach(v => {
          arr = arr.concat(businessOrderMap[v])
        })
        let entityTypeList = []
        arr.forEach(v => {
          let index = this.entityTypeListALL.findIndex(item => item.code === v)
          if (index >= 0) {
            entityTypeList.push(this.entityTypeListALL[index])
          }
        })
        this.entityTypeList = entityTypeList
      } else {
        this.entityTypeList = this.$extends({}, true, this.entityTypeListALL)
      }
    },
		async getList() {
			this.loading = true;
			const _params = {
				...this.formData,
				pageSize: this.pageSize,
				pageNum: this.pageNum
			};
			let totalFn = this.type === "AP" ? getPayableConfirmationListTotalApi : getReceiveConfirmationListTotalApi;
			let listFn = this.type === "AP" ? getPayableConfirmationListApi : getReceiveConfirmationListApi;
			totalFn(_params).then(res => {
				if (res.ok) {
					res.content.forEach(v => {
						if (v.amountName === "amount") {
							v.amounts.forEach(v => {
								v.value = formatNumberToThousands(v.value);
							});
							this.amountTotal = v.amounts;
						}
					});
				}
			});
			const res = await listFn(_params);
			if (res.ok) {
				this.total = parseInt(res.content.total, 10);
				let currencyArr = [];
				res.content.list.forEach(v => {
					v = v || {}; // 兼容null
					v.bussinessDate = parseTime(v.bussinessDate, "{y}-{m}-{d} {h}:{i}:{s}");
					v.confirmTime = parseTime(v.confirmTime, "{y}-{m}-{d} {h}:{i}:{s}");
					let currency = v.currencyAmounts;
					currency.forEach(c => {
						v[c.currency] = formatNumberToThousands(c.value);
						if (c.currency && currencyArr.indexOf(c.currency) < 0) {
							currencyArr.push(c.currency);
						}
					});
				});
				this.dataList = res.content.list;
			} else {
				this.total = 0;
				this.dataList = [];
			}
			this.loading = false;
		},
		handleSizeChange(size) {
			this.pageSize = size;
			this.getList();
		},
		handleCurrentChange(page) {
			this.pageNum = page;
			this.getList();
		},
		reset() {
			this.$refs.formData.resetFields();
			this.getList();
		},
		// 费用确认
		confirmCharge(item) {
			this.$confirm(this.$t("receiveFms.charge_confirm_des"), this.$t("receiveFms.mention"), {
				confirmButtonText: this.$t("common.confirm"),
				cancelButtonText: this.$t("common.cancel"),
				type: "warning"
			})
				.then(() => {
          this.loading = true
					receiveConfirmationConfirmApi(item.id).then(res => {
						if (res.ok) {
							this.$message.success(this.$t("receiveFms.charge_confirm_success"));
							this.getList();
						}
            this.loading = false
					});
				})
				.catch(() => {});
		},
		recallConfirmCharge(item) {
			this.$confirm(this.$t("receiveFms.recall_charge_confirm_des"), this.$t("receiveFms.mention"), {
				confirmButtonText: this.$t("common.confirm"),
				cancelButtonText: this.$t("common.cancel"),
				type: "warning"
			})
				.then(() => {
          this.loading = true
					receiveRecallConfirmationConfirmApi([item.id]).then(res => {
						if (res.ok) {
							this.$message.success(this.$t("receiveFms.recall_charge_confirm_success"));
							this.getList();
						}
            this.loading = false
					});
				})
				.catch(() => {});
		},
		// 开票
		receiveInvoice() {
			let ids = [];
			let totalAmount = {};
			let rows = this.gridApi.getSelectedRows();
			if (rows.length === 0) {
				this.$message.error(this.$t("receiveFms.please_select_one_data"));
				return;
			}
			let isInAdjust = false;
			rows.forEach(v => {
				ids.push(v.id);
				v.currencyAmounts.forEach(x => {
					totalAmount[x.currency] = Number(totalAmount[x.currency] || 0) + Number(x.value);
				});
				// 账单状态为调整中，不能进行该操作!
				if (v.entryState === 11) {
					isInAdjust = true;
				}
			});
			if (isInAdjust) {
				this.$message.error(this.$t("receiveFms.can_not_operation_in_adjust"));
				return;
			}
			this.selectedInvoiceInfo = {
				ids: ids,
				totalAmount: totalAmount
			};
			this.$refs.receiveInvoiceRef.show();
		},
		// 核销
		receiveCleared() {
			let ids = [];
			let totalAmount = {};
			let rows = this.gridApi.getSelectedRows();
			if (rows.length === 0) {
				this.$message.error(this.$t("receiveFms.please_select_one_data"));
				return;
			}
			let isInAdjust = false;
			let isCleared = false;
			rows.forEach(v => {
				ids.push(v.id);
				v.currencyAmounts.forEach(x => {
					totalAmount[x.currency] = Number(totalAmount[x.currency] || 0) + Number(x.value);
				});
				// 账单状态为调整中，不能进行该操作!
				if (v.entryState === 11) {
					isInAdjust = true;
				}
				// 核销状态为已核销，不能进行该操作!
				if (v.clearState === 3) {
					isCleared = true;
				}
			});
			if (isCleared) {
				this.$message.error(this.$t("receiveFms.can_not_operation_is_cleared"));
				return;
			}
			if (isInAdjust) {
				this.$message.error(this.$t("receiveFms.can_not_operation_in_adjust"));
				return;
			}
			this.selectedInvoiceInfo = {
				ids: ids,
				totalAmount: totalAmount
			};
			this.$refs.receiveCleardRef.show();
		},
		// 查看
		view(item) {
			let name = this.type === "AP" ? "FmsPayableConfirmationDetail" : "FmsReceiveConfirmationDetail";
			this.$router.push({ name: name, query: { id: item.id } });
		},
    // 变更对账主体
    changeConfirmSettlementFn() {
      let selectedRows = this.gridApi.getSelectedRows();
			if (selectedRows.length <= 0) {
				this.$message.error(this.$t("common.please_select_one_data"));
				return;
			}
      let ids = []
      selectedRows.forEach(v => {
        ids.push(v.id)
      })
      this.$refs.changeConfirmSettlementRef.show(ids);
    },
		// 申请开票
		applyInvoice() {
			let selectedRows = this.gridApi.getSelectedRows();
			if (selectedRows.length <= 0) {
				this.$message.error(this.$t("common.please_select_one_data"));
				return;
			}
			let ids = [];
			let settlementCompanyIds = [];
			let businessTypes = [];
			let isPass = true; // 账单状态已对账 且 开票状态为部分开票 或者 未开票
			let isPiecePass = true;
			selectedRows.forEach(v => {
				if (settlementCompanyIds.indexOf(v.settlementCompanyId) < 0) {
					settlementCompanyIds.push(v.settlementCompanyId);
				}
				if (businessTypes.indexOf(v.businessType) < 0) {
					businessTypes.push(v.businessType);
				}
				// 票结费用需要费用确认单已确认
				if (v.settlementMode === 1) {
					if (v.confirmationState !== 2) {
						isPiecePass = false;
					}
				} else {
					// 其他账期 -> 未开票 部分开票 已对账
					if ((v.invoiceState === 1 || v.invoiceState === 2) && v.entryState === 4) {
						// 通过校验
					} else {
						isPass = false;
					}
				}
				ids.push(v.id);
			});
			if (settlementCompanyIds.length > 1) {
				this.$message.error(this.$t("receiveFms.need_same_settlement_company"));
				return;
			}
			if (businessTypes.length > 1) {
				this.$message.error(this.$t("receiveFms.need_same_business_type"));
				return;
			}
			// 同样的业务类型之后 结算方式肯定相同
			// 票结费用需要费用确认单已确认
			if (!isPiecePass) {
				this.$message.error(this.$t("receiveFms.piece_need_confirm"));
				return;
			}
			// 其他账期 -> 未开票 部分开票 已对账
			if (!isPass) {
				this.$message.error(this.$t("receiveFms.need_un_invoice_and_bill_check"));
				return;
			}
			this.selectedIds = ids;
			this.$refs.applyInvoiceDialogRef.show(ids);
		},
		// 申请核销 或者 对冲
		applyOrHedgeClear(isHedge) {
			let selectedRows = this.gridApi.getSelectedRows();
			if (selectedRows.length <= 0) {
				this.$message.error(this.$t("common.please_select_one_data"));
				return;
			}
			let selectedSettlementId = [];
      let selectedOfficeId = []
			let ids = [];
			let MSG = "";
			selectedRows.forEach(v => {
				ids.push(v.id);
				if (selectedSettlementId.indexOf(v.settlementCompanyId) < 0) {
					selectedSettlementId.push(v.settlementCompanyId);
				}
        if (selectedOfficeId.indexOf(v.settlementOfficeId) < 0) {
          selectedOfficeId.push(v.settlementOfficeId);
        }
				// if (v.entryState != 4) {
				// 	MSG = "只有账单状态为已对账才能进行核销操作";
				// }
        // 只有费用确认单确认状态为已确认才能进行核销操作
				if (v.confirmationState !== 2) {
					MSG = this.$t("receiveFms.clear_desc_4")
				}
				// 只有核销状态为未核销或者部分核销才能进行核销操作
				if (v.clearState !== 1 && v.clearState !== 2) {
					MSG = this.$t("receiveFms.clear_desc_1");
				}
        // 只有申请核销状态为未申请或者部分申请才能进行核销操作
				if (v.instructionState !== 1 && v.instructionState !== 2) {
					MSG = this.$t("receiveFms.clear_desc_2");
				}
			});
			if (selectedSettlementId.length > 1) {
        // 不是同一家结算单位的不支持一起申请核销！
				this.$message.error(this.$t("receiveFms.clear_desc_3"));
				return;
			}
      if (selectedOfficeId.length > 1) {
        // 不是同一账套的不支持一起申请核销！
        this.$message.error(this.$t("receiveFms.clear_desc_7"));
        return;
      }
			if (MSG) {
				this.$message.error(MSG);
				return;
			}
			// 未核销 已对账
			let name = isHedge ? "FmsReceiptOffsetClearPage" : "FmsReceiptApplyClearPage";
      if (this.type === 'AP') {
        name = isHedge ? "FmsPayableOffsetClearPage" : "FmsPayableApplyClearPage";
      }
			this.$router.push({
				name: name,
				query: {
					ids: ids.join(","),
					origin: "CONFIRMATION",
					back: this.$route.name
				}
			});
		},
    // 申请付款
    applyPayment() {
      let selectedRows = this.gridApi.getSelectedRows();
			if (selectedRows.length <= 0) {
				this.$message.error(this.$t("common.please_select_one_data"));
				return;
			}
      let selectedSettlementIdMap = [];
			let ids = [];
			for (let index = 0, len = selectedRows.length; index < len; index++) {
        let item = selectedRows[index]
        ids.push(item.id);
        selectedSettlementIdMap[item.settlementCompanyId] = item.settlementCompanyId

        // 不是同一家结算单位的不支持一起操作！
        if (Object.keys(selectedSettlementIdMap).length > 1) {
          this.$message.error(this.$t("receiveFms.clear_desc_3"));
          return;
        }

        // 非票结的只有账单状态为已对账才能进行操作
        if (item.settlementMode !== 1 && item.entryState !== 4) {
          this.$message.error(this.$t("receiveFms.clear_desc_5"));
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
      this.$refs.applyPaymentDialogRef.show(ids);
    },
		// 生成账单
		createBill() {
			let selectedRows = this.gridApi.getSelectedRows();
			if (selectedRows.length <= 0) {
				this.$message.error(this.$t("common.please_select_one_data"));
				return;
			}
			let ids = [];
			let settlementCompanyIds = [];
			let businessTypes = [];
			let isUnConfirm = false;
			let isHasEntry = false;
			let settlementModeList = [];
      let MSG = ''
			selectedRows.forEach(v => {
				if (settlementModeList.indexOf(v.settlementMode) < 0) {
					settlementModeList.push(v.settlementMode);
				}
				if (settlementCompanyIds.indexOf(v.settlementCompanyId) < 0) {
					settlementCompanyIds.push(v.settlementCompanyId);
				}
				if (businessTypes.indexOf(v.businessType) < 0) {
					businessTypes.push(v.businessType);
				}
				// 鉴定是否有未确认的
				if (v.confirmationState === 1) {
					isUnConfirm = true;
				}
				// 并且已入账的
				if (v.entryState > 1) {
					isHasEntry = true;
				}
        if (v.businessType === "OVERSEAS_WAREHOUSE" && v.entityType !== 1614) {
          // 目前不支持在结算中心生成账单
          MSG = this.$t("receiveFms.unsupportCreateBill")
        }
				ids.push(v.id);
			});
      if (MSG) {
        this.$message.error(MSG);
        return;
      }
			if (isUnConfirm) {
				this.$message.error(this.$t("receiveFms.this_confirm_un_confirm"));
				return;
			}
			if (isHasEntry) {
				this.$message.error(this.$t("receiveFms.this_confirm_has_entry"));
				return;
			}
			if (settlementCompanyIds.length > 1) {
				this.$message.error(this.$t("receiveFms.need_same_settlement_company"));
				return;
			}
			if (businessTypes.length > 1) {
				this.$message.error(this.$t("receiveFms.need_same_business_type"));
				return;
			}
			if (settlementModeList.length > 1) {
				this.$message.error(this.$t("receiveFms.need_same_settlement_mode"));
				return;
			}
			this.createBillInfo = {
				ids: ids,
        businessType: businessTypes[0],
				settlementMode: settlementModeList[0],
				settlementCompanyId: settlementCompanyIds[0]
			};
			this.$refs.createBillSuccessRef.show();
		}
	}
};
</script>
<style lang="scss" scoped>
.right-main-wrapper {
	overflow: auto;
	padding: 20px 20px 0 20px;
}
.page-total {
	background: rgba(16, 142, 233, 0.1);
	color: #108ee9;
	font-family: "PingFangSC-Regular", "PingFang SC";
	font-weight: 400;
	font-style: normal;
	font-size: 14px;
	height: 40px;
	line-height: 40px;
	padding: 0px 10px;

	.value-item {
		display: inline-block;
		margin-right: 30px;
		.value {
			display: inline-block;
			margin-right: 5px;
		}
	}
}
.pagination-container {
	margin-top: 0px;
}
.fms-search-form {
  ::v-deep .el-input,
  ::v-deep .el-select {
    width: 207px;
  }
}
</style>
