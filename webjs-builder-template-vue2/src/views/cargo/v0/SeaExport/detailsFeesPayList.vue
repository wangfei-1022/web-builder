<template>
  <div class="sys-right-inner-wrap" v-loading="loading">

    <el-tabs v-model="activeName" class="top-tabs">
      <el-tab-pane :label='$t("uexpressOrder.otherSearch")' name="BASE_SEARCH"></el-tab-pane>
      <el-tab-pane :label='$t("uexpressOrder.noSearch")' name="NO_SEARCH"></el-tab-pane>
    </el-tabs>

    <top-search-items-slot :searchFun="topSearch" :resetFun="clearSearchForm" :visible="activeName === 'NO_SEARCH'">
      <template slot="multipleSearch">
        <div class="multiple-no-wrap">
          <el-form ref="multipleForm" :inline="true" :model="multipleForm" label-width="120px" size="mini">
            <el-form-item :label='$t("uexpressOrder.no")' prop="queryType" style="width: 120px;float: left;"></el-form-item>
            <el-form-item label='' prop="entityNoList" class="multiple-no-item">
              <el-input v-model="multipleForm.entityNoList" type="textarea" rows="3" size="mini" resize="none" clearable :placeholder="$t('uexpressOrder.noPlaceholder')" />
            </el-form-item>
            <el-form-item :label="`${$t('sea.settlementUnit')}: `" prop="settlementCompanyId">
              <TypeSelect v-model="multipleForm.settlementCompanyId"  type="settlementCompany" :requestParams="{businessType: 'SEA_EXPORT'}" />
            </el-form-item>
            <el-form-item label="ETA: " prop="ETA">
              <el-date-picker
                v-model="multipleForm.ETA"
                value-format="timestamp"
                type="daterange"
                range-separator="-"
                start-placeholder=""
                end-placeholder=""
                @keydown.native.enter.prevent="topSearch"
                style="width: 178px">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="`${$t('sea.billStatus')}: `" prop="entryStates">
              <el-select v-model="multipleForm.entryStates" size="mini" filterable multiple collapse-tags>
                <el-option v-for="item in billStatusOps" :key="item.name" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('payableFms.instructionStateNamePayable')" prop="instructionStateList">
              <fms-select v-model="multipleForm.instructionStateList" type="applyClearState" multiple collapse-tags ></fms-select>
            </el-form-item>
            <el-form-item :label="$t('receiveFms.clear_status')" prop="clearStateList" class="multipleClearState">
              <fms-select v-model="multipleForm.clearStateList" type="clearState" multiple collapse-tags ></fms-select>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>

    <top-search-items-slot :searchFun="topSearch" :resetFun="clearSearchForm" :visible="activeName === 'BASE_SEARCH'">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="120px" size="mini" @submit.native.prevent>
        <el-form-item :label="`${$t('sea.businessNo')}: `" prop="entityNo">
          <el-input v-trim v-model="multipleForm.entityNo" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="topSearch" />
        </el-form-item>
        <el-form-item :label="`${$t('sea.masterOrderNumber')}: `" prop="entityNo">
          <el-input v-trim v-model="multipleForm.masterNo" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="topSearch" />
        </el-form-item>
        <el-form-item :label="`${$t('sea.billNumber')}: `" prop="entityNo">
          <el-input v-trim v-model="multipleForm.billNo" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="topSearch" />
        </el-form-item>
        <!--先隐藏-->
        <el-form-item :label="`${$t('sea.supplierName')}: `" prop="soNo" v-if="false">
<!--              <cargo-limited-select  ref="memberId" :placeholder="$t('sea.requesterHold')" :select-label="multipleForm.memberName" :select-value="multipleForm.memberId" type="customer" style="width: 100%;" @set="setCustomerInfo"/>-->
          <TypeSelect v-model="multipleForm.memberId" type="settlementCompany" :requestParams="{businessType: 'SEA_EXPORT'}"/>
        </el-form-item>
        <el-form-item :label="`${$t('sea.settlementUnit')}: `" prop="settlementCompanyId">
          <TypeSelect v-model="multipleForm.settlementCompanyId"  type="settlementCompany" :requestParams="{businessType: 'SEA_EXPORT'}"  />
        </el-form-item>
        <el-form-item :label="`${$t('sea.paymentACSet')}: `" prop="settlementOfficeId">
          <el-select v-model="multipleForm.settlementOfficeId" size="mini" filterable clearable >
            <el-option :label="$t('sea.all')" value=""></el-option>
            <el-option v-for="item in settlementOfficeOps" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item :label="`${$t('sea.ownedSales')}: `" prop="entityNo">-->
          <!--<el-select filterable clearable v-model="multipleForm.salesId" size="mini" @change="topSearch">-->
            <!--<el-option v-for="(item, index) in salesList" :key="index" :label="item.userName" :value="item.id"/>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item :label="`${$t('sea.settlementMethod')}: `" prop="settlementMode">
          <el-select v-model="multipleForm.settlementMode" size="mini" filterable clearable>
            <el-option :label="$t('sea.all')" value=""></el-option>
            <el-option v-for="item in settlementModeOps" :key="item.name" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('sea.shipName')}: `" prop="vessel">
          <el-input v-model="multipleForm.vessel" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="topSearch" />
        </el-form-item>
        <el-form-item :label="`${$t('charteredBoat.voyageNo')}: `" prop="voyage">
          <el-input v-model="multipleForm.voyage" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="topSearch" />
        </el-form-item>
        <el-form-item :label="`${$t('charteredBoat.polCode')}: `" prop="polCode">
          <cargo-advance-select
            ref="polCodeSelect"
            :url="url.qf.seaport"
            :headers="[$t('common.englishName'),$t('common.fiveCharCode'),$t('common.chineseName')]"
            :fields="['englishName','code5','chineseName']"
            tag-value="code5"
            tag-name="enPortName"
            remote
            @parentCallBack="(data)=>{
              multipleForm.polCode=data.code5
              list()
            }"
          />
        </el-form-item>
        <el-form-item :label="`${$t('charteredBoat.podCode')}: `" prop="podCode">
          <cargo-advance-select
            ref="podCodeSelect"
            :url="url.qf.seaport"
            :headers="[$t('common.englishName'),$t('common.fiveCharCode'),$t('common.chineseName')]"
            :fields="['englishName','code5','chineseName']"
            tag-value="code5"
            tag-name="enPortName"
            remote
            @parentCallBack="(data)=>{
              multipleForm.podCode=data.code5
              list()
            }"
          />
        </el-form-item>

        <el-form-item :label="`${$t('sea.billStatus')}: `" prop="entryState">
          <el-select v-model="multipleForm.entryState" size="mini" filterable clearable >
            <el-option :label="$t('sea.all')" value=""></el-option>
            <el-option v-for="item in billStatusOps" :key="item.name" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <!--        收票状态-->
        <el-form-item :label="`${$t('sea.invoiceStateName')}: `" prop="invoiceState" v-if="false">
          <el-select v-model="multipleForm.invoiceState" size="mini" filterable clearable >
            <el-option :label="$t('sea.all')" value=""></el-option>
            <el-option v-for="item in invoiceApplyStateOps" :key="item.name" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="ETD: " prop="ETD">
          <el-date-picker
            v-model="multipleForm.ETD"
            value-format="timestamp"
            type="daterange"
            range-separator="-"
            start-placeholder=""
            end-placeholder=""
            @keydown.native.enter.prevent="topSearch"
            style="width: 178px">
          </el-date-picker>
        </el-form-item>
<!--        <el-form-item :label="`${$t('sea.writeOffStatus')}: `" prop="clearState">-->
<!--          <el-select v-model="multipleForm.clearState" size="mini" filterable clearable @change="topSearch">-->
<!--            <el-option :label="$t('sea.all')" value=""></el-option>-->
<!--            <el-option v-for="item in writeOffStatusOps" :key="item.name" :label="item.name" :value="item.code"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->

        <el-form-item :label="$t('sea.instructionStateNamePayable')" prop="instructionStateList">
          <fms-select v-model="multipleForm.instructionStateList" multiple type="applyClearState"></fms-select>
        </el-form-item>
        <el-form-item :label="$t('receiveFms.clear_status')" prop="clearStateList" class="clearState">
          <fms-select v-model="multipleForm.clearStateList" type="clearState" multiple></fms-select>
        </el-form-item>
        <el-form-item :label="$t('sea.profitStateName')" prop="profitState">
					<fms-select v-model="multipleForm.profitState" type="profitState" addAll />
				</el-form-item>

      </el-form>
    </top-search-items-slot>
    <div class="container-wrap table-wrap">
      <div class="top-btn-wrap mb-10">
        <el-button type="primary" size="mini" class="ml-10" @click="allRecordedBtn">{{ $t('sea.allRecorded') }}</el-button>
        <el-button slot="reference" type="primary" size="mini" @click="selectPostingBtn">{{ $t('sea.selectPosting') }}</el-button>
        <el-button slot="reference" type="primary" size="mini" @click="exportBtn">{{ $t('sea.export') }}</el-button>

        <el-button size="mini" type="primary" @click="applyPayment()" v-permission="['sea:charge:ap:payment_apply']">{{$t('receiveFms.applyPayment')}}</el-button>
        <!--申请核销-->
        <el-button size="mini" type="primary" @click="applyOrHedgeClear(false)" v-permission="['sea:charge:ap:clear_apply']">{{$t('receiveFms.applyClear')}}</el-button>

        <div class="page-total"  v-if="multipleFormValuable" style="margin-top: 10px">
          <span class="page-total-item">
            <span>{{$t('receiveFms.payable_sum')}}：</span>
            <span>
              <span class="value-item" v-for="(item, index) in amountTotal" :key='index'>
                <span class='value'>{{item.currency}}</span>
                <span>{{item.value}}</span>
              </span>
            </span>
          </span>

          <span class="page-total-item">
            <span>{{$t('receiveFms.un_clear_amount_total')}}：</span>
            <span>
              <span class="value-item" v-for="(item, index) in unClearedAmountTotal" :key='index'>
                <span class='value'>{{item.currency}}</span>
                <span>{{item.value}}</span>
              </span>
            </span>
          </span>
        </div>

      </div>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptionsRight"
        :side-bar="sideBarDefs"

        :column-defs="columnDefsRight"
        :row-data="tableData.list"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :style="gridHeight"
        class="ag-theme-balham"
      />
      <Pagination :total="pageTotal" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getList" />
    </div>
    <div v-show="showEntryPool" class="container-pool-wrap">
      <entryPools :pools="selectedItems" @deleteNo="deleteSelectedItems" @passValidation="passValidation" @closeWindow="closePool"></entryPools>
    </div>
<!--    入账-->
    <ExpenseEntry :expenseEntryDialog.sync="expenseEntryDialog" v-if="expenseEntryDialog" :initialData="expenseEntryMultipleForm" :multipleForm="expenseEntryMultipleForm"
                  :entryType="expenseEntryType" :detailedType="true" name="expenseEntryDialog" @submit="expenseEntrySuc"></ExpenseEntry>
    <AllRecordedDialog :allRecordedType="false" :allRecordedDialog.sync="allRecordedDialog" v-if="allRecordedDialog" :allRecordedDialogData="allRecordedDialogData" @filterNextStep="filterNextStep"></AllRecordedDialog>
    <apply-payment-dialog ref="applyPaymentDialogRef" origin="CHARGE" toPath="SeaApplyForPayment" />
    <apply-payable-clear-dialog ref="applyPayableClearDialogRef" origin="CHARGE" toPath="SeaPayApplyClearPage" />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import SplitOrderSelector from "@/views/cargo/v0/CharteredBoat/components/SplitOrderSelector"
import cargoAdvanceSelect from "@/components/Cargo/Common/cargoAdvanceSelect"
import PreManifestListOperationBtn from "@/views/cargo/v0/CharteredBoat/components/PreManifestListOperationBtn"
import { validEmail } from "@/utils/validate"
import ExpensesCostDetails from "./components/order/expensesCostDetails"
import {
  chargeEntryConditionApi,
  detailPagesListApi, detailPagesNosListApi, detailPagesNosTotalApi, detailPagesTotalApi, detailPagesTotalChargeApi,
  dictListApi, payDetailExportApi, payEntryConditionApi,
  rechargeModeApi,
  settlementOfficeListApi
} from "@/api/seaExportOrder"
import cargoLimitedSelect from "@/components/Cargo/Common/cargoLimitedSelect"
import { getGridSelected } from "@/utils/gridChoose"
import lodash from 'lodash'
import { getUserInfo } from "@/api/login"
import reportListDialog from "@/components/Cargo/Report/reportListDialog"
import { formatNumberToThousands, mergeMethod } from "@/utils"
import entryPools from "./components/entryPools"
import ExpenseEntry from "./components/expenseEntry"
import { getSalesListApi } from "@/api/partner/customerManage";
import URL from "@/api/urlTranslator";
import { exportBL } from "@/api/bl";
import AllRecordedDialog from "@/views/cargo/v0/SeaExport/components/allRecordedDialog";
import mixins from "@/views/financial/receiptCharge/mixins";
import ApplyPaymentDialog from "@/views/financial/components/ApplyPaymentDialog";
import ApplyPayableClearDialog from "@/views/financial/components/ApplyPayableClearDialog";
import {getOrderListApi, getOrderListByNosApi} from "@/api/uexpress/orderManager";
import { parseTime } from '@/utils/index'

export default {
	name: 'DetailsFeesPayList',
  // mixins: [mixins],
	components: {
		SplitOrderSelector, cargoAdvanceSelect, PreManifestListOperationBtn, ExpensesCostDetails, cargoLimitedSelect, reportListDialog,
		entryPools, ExpenseEntry, AllRecordedDialog,ApplyPaymentDialog,
    ApplyPayableClearDialog
	},
	data() {
		const defaultFilter = {
			memberId: '',
			settlementCompanyId: '',
			settlementOfficeId: '',
			vessel: '',
			voyage: '',
			entityNo: '',
      entityNoList: '',
			invoiceState: '',
      instructionStateList: [],
			clearState: '',
      clearStateList: [],
			entryState: '',
			pageSize: 50,
			pageNum: 1,
			ETD: [new Date().getTime() - 30 * 24 * 60 * 60 * 1000, new Date().getTime()],
      ETA: [],
      entryStates: [],
		}
		return {
			url: URL,
			loading: false,
      activeName:'BASE_SEARCH',
			pageSizeList: [10, 20, 30, 40],
			tableData: {},
			selectedItems: [], // 列表选择
			pagination: {
				pageNum: 1,
				pageSize: 50
			},
			pageTotal: 0,
			defaultFilter: defaultFilter,
			multipleForm: this.$extends({}, defaultFilter),
			vm: this,
			VUE_APP_BASE_API: '',
			soNoList: [],
			gridApi: null,
			columnApi: null,
			columnDefsRight: [{
				colId: 'visibleCol',
				headerName: '',
				pinned: 'left',
				field: '',
				hide: true,
				width: 300
			}, {
				headerName: '',
				width: 55,
				pinned: 'left',
				suppressSorting: true,
				checkboxSelection: true,
				headerCheckboxSelection: true,
				suppressMenu: true,
				suppressSizeToFit: true,
				suppressResize: true
			}, {
				headerName: this.$t('sea.businessNo'),
				field: 'entityNoDisplay',
				minWidth: 140
			}, {
				headerName: this.$t('sea.masterNo'), // 主单号
				field: 'masterNo',
				minWidth: 140
			}, {
				headerName: this.$t('sea.billNumber'), // 账单编号
				field: 'billNo',
				minWidth: 140
			}, {
				headerName: this.$t('sea.feeName'), // 费用名称
				field: 'feeItemName',
				minWidth: 140
			}, {
				headerName: this.$t('sea.billingMethod'), // 计费方式
				field: 'unitName1',
				minWidth: 140
			}, {
				headerName: this.$t('sea.currency'), // 币种
				field: 'currency',
				minWidth: 140
			}, {
				headerName: this.$t('sea.unitPrice'), // 单价
				field: 'price',
				cellRenderer: params => `<span>${formatNumberToThousands(params.value)}`,
				minWidth: 140
			}, {
				headerName: this.$t('sea.quantity'), // 数量
				field: 'chargeQuantity1',
				minWidth: 140
			}, {
				headerName: this.$t('sea.taxRate'), // 税率
				field: 'invoiceTaxRateName',
				minWidth: 140
			}, {
				headerName: this.$t('sea.taxAmount'), // 税额
				field: 'taxAmount',
				cellRenderer: params => `<span>${formatNumberToThousands(params.value)}`,
				minWidth: 140
			}, {
				headerName: this.$t('sea.amountExcludingTax'), // 不含税金额
				field: 'excludeTaxAmount',
				cellRenderer: params => `<span>${formatNumberToThousands(params.value)}`,
				minWidth: 140
			}, {
				headerName: this.$t('sea.expenseAmount'), // 费用金额
				field: 'amount',
				cellRenderer: params => `<span>${formatNumberToThousands(params.value)}`,
				minWidth: 140
			}, {
				headerName: this.$t('sea.supplierName'), // 供应商名称
				field: 'settlementCompanyName', // 目前先取与结算单位同值 memberName
				minWidth: 140
			}, {
				headerName: this.$t('sea.settlementUnit'), // 结算单位
				field: 'settlementCompanyName',
				minWidth: 140
			},
			//   {
			//   headerName: this.$t('sea.product'), // 所属产品
			//   field: 'responsiblePersonName',
			//   minWidth: 120
			// },
			{
				headerName: this.$t('sea.paymentACSet'), // 付款账套
				field: 'settlementOfficeName',
				minWidth: 120
			}, {
				headerName: this.$t('sea.settlementMethod'), // 结算方式
				field: 'settlementModeName',
				minWidth: 120
			}, {
				headerName: this.$t('sea.vesselVoyage'), // 船名/航次
				field: 'vessel',
				cellRenderer: params => `<span>${params.data.vessel} / ${params.data.voyage}</span>`,
				minWidth: 140
			}, {
				headerName: this.$t('sea.pol'), // 起运港
				field: 'pol',
				tooltipField: 'pol',
				minWidth: 140
			}, {
				headerName: this.$t('sea.pod'), // 起运港
				field: 'pod',
				tooltipField: 'pod',
				minWidth: 140
			}, {
				headerName: this.$t('sea.containerDesc'), // 箱型箱量
				field: 'containerDesc',
				minWidth: 140
			}, {
				headerName: 'ETD', //
				field: 'etd',
				minWidth: 140,
				cellRenderer: params => this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss')
			}, {
        headerName: "ETA",
        field: 'eta',
        cellRenderer: params => parseTime(params.data.eta),
        minWidth: 150
      },{
				headerName: this.$t('sea.billStatus'), // 账单状态
				field: 'entryStateName',
				minWidth: 90,
				pinned: 'right'
			},
      // {
			// 	headerName: this.$t('sea.invoiceStateName'), // 收票状态
			// 	field: 'invoiceStateName',
			// 	minWidth: 90,
			// 	pinned: 'right'
			// },
      {
				headerName: this.$t('sea.instructionStateNamePayable'), // 申请核销/付款状态
				field: 'instructionStateName',
				minWidth: 90,
				pinned: 'right'
			},
      {
				headerName: this.$t('sea.writeOffStatus'), // 核销状态
				field: 'clearStateName',
				minWidth: 90,
				pinned: 'right'
			}, {
        headerName: this.$t('sea.profitStateName'), // 盈亏状态
        field: 'profitStateName',
        minWidth: 90,
        pinned: 'right'
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
			settlementOfficeOps: [],
			settlementModeOps: [],
			invoiceStateOps: [],
			showEntryPool: false,
			salesList: [],
			billStatusOps: [], // 账单状态
			invoiceApplyStateOps: [], // 收票
			writeOffStatusOps: [], // 核销状态
			totalPayable: null,
			expenseEntryDialog: false,
			expenseEntryMultipleForm: {},
			allRecordedDialog: false,
			allRecordedDialogData: [],
			expenseEntryType: true,
      amountTotal: [], // 应收应付统计
      unClearedAmountTotal: [], // 未销合计

		}
	},
	computed: {
		...mapState({
			memberInfo: state => state.user.memberInfo
		}),
		multipleFormValuable() {
			for (let key in this.multipleForm) {
				if (this.multipleForm[key] && key !== 'pageSize' && key !== 'pageNum') { return true; }
			}
			return false
		}
	},
	filters: {
		filterSoc(socFlag, vm) {
			return socFlag ? vm.$t('containerList.socFlagYes') : vm.$t('containerList.socFlagFalse')
		},
		filterBLClass(_status) {
			const classList = [
				'',
				'status-text info-text',
				'status-text warning-text',
				'status-text success-text',
				'status-text danger-text',
				'status-text primary-text'
			]
			return classList[_status]
		},
		filterDeclareClass(_status) {
			const classList = [
				'status-text info-text',
				'status-text warning-text',
				'status-text warning-text',
				'status-text success-text',
				'status-text danger-text',
				'status-text primary-text'
			]
			return classList[_status]
		},
		filterFullInTime(timestamp, vm) {
			if (!timestamp) {
				return ''
			}
			return vm.$moment(Number(timestamp)).format('YYYY-MM-DD HH:mm:ss')
		},
		isHouseBill(_status) {
			if (_status === true) {
				return this.$t('common.trueText')
			} else if (_status === false) {
				return this.$t('common.falseText')
			}
		}
	},
	methods: {
		async init() {
			dictListApi(3).then(res => {
				if (res.ok) {
					this.invoiceApplyStateOps = res.content
				}
			})
			dictListApi(4).then(res => {
				if (res.ok) {
					this.writeOffStatusOps = res.content
				}
			})
			dictListApi(1).then(res => {
				if (res.ok) {
					this.billStatusOps = res.content
				}
			})

			let res = await getSalesListApi()
			if (res.ok) {
				this.salesList = res.content || []
			}
		},
		validateEmail(rule, value, callback) {
			if (value) {
				let emailArr = value.split(';')
				let isSome = emailArr.some(item => {
					if (!validEmail(item)) {
						callback(new Error(item + this.$t('blInfo.emailError')))
						return true
					}
				})
				if (!isSome) {
					callback()
				}
			} else {
				callback()
			}
		},
    getParams() {
      let params = {
        pageSize: this.multipleForm.pageSize,
        pageNum: this.multipleForm.pageNum
      };
      if (this.activeName === 'NO_SEARCH') {
        params.entityNoList = this.multipleForm.entityNoList ? this.multipleForm.entityNoList.split(/,|，|\s+/) : []
        params.settlementCompanyId = this.multipleForm.settlementCompanyId
        params.instructionStateList = this.multipleForm.instructionStateList
        params.clearStateList = this.multipleForm.clearStateList
        params.ETA = this.multipleForm.ETA
        params.entryStates = this.multipleForm.entryStates
      } else {
        params = {
          ...params,
          ...this.multipleForm
        }
        if (params.ETD && params.ETD.length) {
          params.etdStart = params.ETD[0]
          params.etdEnd = params.ETD[1]
        }
        delete params.entityNoList
      }
      if (params.ETA && params.ETA.length) {
        params.etaStart = params.ETA[0]
        params.etaEnd = params.ETA[1]
      }
      delete params.ETD
      delete params.ETA
      return params
    },
		async getList() {
      const data = this.getParams()
      if (this.activeName === 'NO_SEARCH' && this.$isEmpty(data.entityNoList)) {
        this.$message.error('请输入单号')
        return
      }
      if (this.multipleFormValuable) {
        detailPagesTotalApi(data).then(res => {
          res.content = res.content || []
          this.totalPayable = res.content
          res.content.forEach(v => {
            if (v.amountName == 'amount') {
              v.amounts.forEach(v => {
                v.value = formatNumberToThousands(v.value)
              })
              this.amountTotal = v.amounts
            }
            if (v.amountName == 'unClearedAmount') {
              v.amounts.forEach(v => {
                v.value = formatNumberToThousands(v.value)
              })
              this.unClearedAmountTotal = v.amounts
            }
          })
				})
			}
			this.selectedItems = []
			this.loading = true
			const res = await detailPagesListApi(data)
			this.loading = false
			if (res.ok) {
				this.tableData = res.content
				this.pageTotal = Number(res.content.total)
			} else {
				this.pageTotal = 0
				this.tableData = []
			}
		},
		topSearch() {
			this.currPage = 1
			this.getList()
		},
		selBlStatusrChange(data, val) { // 下拉框
			this.multipleForm[val] = data
			this.getList()
		},
		selTrailerStatusChange(data) {
			this.multipleForm.trailerStatus = data
			this.getList()
		},
		clearSearchForm() { // 搜索重置
			this.$refs.multipleForm.resetFields()
			this.multipleForm = this.$extends({}, this.defaultFilter)
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
		/** 选中装货港 */
		getItemFromChild(val, key) {
			this.multipleForm[key] = val.code5
			if (val.code5) {
				this.getList()
			}
		},
		async allRecordedBtn() {
			const isVal = Object.keys(this.multipleForm).some(key => {
				if (this.multipleForm[key] && this.multipleForm[key] !== 'all' && key !== 'pageSize' && key !== 'pageNum') {
					console.log('this.multipleForm[key],', key, this.multipleForm[key])
					return true
				}
			})
			if (!isVal) {
				this.$message.warning(this.$t('sea.pleaseFillInAtLeastOneSearchCondition'))
				return false
			}
			// 非待入账
			if (this.multipleForm.entryState && this.multipleForm.entryState !== 1) {
				this.$message.warning(this.$t('sea.theSearchConditionMustBeToBePosted'))
				return false
			}
			this.loading = true
      const data = this.getParams()
			const res = await payEntryConditionApi(data)
			this.loading = false
			if (res.ok) {
				this.allRecordedDialogData = res.content
				this.allRecordedDialog = true
			}
		},
		async filterNextStep(val) {
			this.allRecordedDialog = false
			this.expenseEntryType = true
			if (this.$isNotEmpty(val)) {
				const multipleFormCopy = lodash.cloneDeep(this.multipleForm)
				const multipleFormCopy2 = mergeMethod(multipleFormCopy, val, true)
				multipleFormCopy2.entryState = 1
				this.loading = true
				const res = await detailPagesTotalApi(multipleFormCopy2)
				this.loading = false
				if (res.ok) {
					val.totalPayable = res.content
					this.expenseEntryMultipleForm = {
            ...this.multipleForm,
            ...val
          }
					this.expenseEntryDialog = true
				}
			}
		},
		// 选择入账
		selectPostingBtn() {
			this.columnApi.setColumnVisible('visibleCol', true)
			this.selectedItems = this.gridApi.getSelectedRows()
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
				if (node.data.id === _obj.id) { node.setSelected(false) }
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
			}
			this.expenseEntryType = false
			this.expenseEntryDialog = true
		},
		async exportBtn() {
			this.loading = true
      const data = this.getParams()
			const res = await payDetailExportApi(data)
			this.loading = false
			if (res.ok) {
				window.location = res.content
			}
		},
		formatNumberToThousands(value) {
			return formatNumberToThousands(value)
		},
    // 申请核销
    applyOrHedgeClear() {
      let selectedRows = this.gridApi.getSelectedRows();
      if (selectedRows.length <= 0) {
        this.$message.error(this.$t("common.please_select_one_data"));
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
        // 	MSG = "只有账单状态为已对账才能进行核销操作";
        // }

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
      if (MSG) {
        this.$message.error(MSG);
        return;
      }
      this.$refs.applyPayableClearDialogRef.show(ids, 'SEA_EXPORT')
    },
    // 申请付款
    applyPayment() {
      let selectedRows = this.gridApi.getSelectedRows();
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
          selectedSettlementId.push(item.settlementCompanyId);
        }
        // 不是同一家结算单位的不支持一起操作！
        if (selectedSettlementId.length > 1) {
          this.$message.error(this.$t("receiveFms.clear_desc_3"));
          return;
        }
        // 非票结的只有账单状态为已对账才能进行操作
        // if (item.settlementMode !== 1 && item.entryState !== 4) {
        //   this.$message.error(this.$t("receiveFms.clear_desc_5"));
        //   return;
        // }
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
      this.$refs.applyPaymentDialogRef.show(ids, 'SEA_EXPORT');
    },
	},
	async created() {
		this.VUE_APP_BASE_API = process.env.VUE_APP_BASE_API
		this.userInfo = await getUserInfo()
		await this.init()
		this.getList()
		// 收款账套
		settlementOfficeListApi().then(res => {
			if (res.ok) {
				this.settlementOfficeOps = res.content
			}
		})
		rechargeModeApi().then(res => {
			if (res.ok) {
				this.settlementModeOps = res.content
			}
		})
		dictListApi(2).then(res => {
			if (res.ok) {
				this.invoiceStateOps = res.content
			}
		})
	}
}

</script>
<style lang='scss' scoped>
.sys-right-inner-wrap {
   padding: 0 20px 20px 20px;
//   height: 100%;
//   overflow: hidden;
//   overflow-y: auto;
 }

.container-wrap {
	margin-top: 20px;
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
.total-payable {
  font-size: 18px;
  color: #1890ff;
  margin-left: 50px;
}
.page-total {
  background: rgba(16, 142, 233, 0.1);
  color: #108ee9;
  font-family: "PingFangSC-Regular", "PingFang SC";
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  min-height: 30px;
  line-height: 30px;
  padding: 5px 10px;

  .page-total-item {
    display: inline-block;
  }

  .value-item {
    display: inline-block;
    margin-right: 30px;
    .value {
      display: inline-block;
      margin-right: 5px;
    }
  }
}
 .multiple-no-wrap{
   width: 100%;
   overflow:hidden;
 }
 .multiple-no-item {
   width: calc(100% - 150px);
   float: left;

   ::v-deep .el-form-item__content {
     width: 100%;
   }
   .el-select {
     float: left;
     width: 80px;
   }
   .el-textarea {
     width: 100%;
     float: left;
   }
 }
</style>

