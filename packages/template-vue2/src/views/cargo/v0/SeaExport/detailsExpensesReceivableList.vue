<template>
  <div class="sys-right-inner-wrap" v-loading="loading">
    <top-search-items-slot :searchFun="topSearch" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="90px" size="mini" @submit.native.prevent>
        <el-form-item :label="`${$t('sea.businessNo')}: `" prop="entityNo">
          <el-input v-trim v-model="multipleForm.entityNo" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="topSearch" />
        </el-form-item>
        <el-form-item :label="`${$t('sea.masterOrderNumber')}: `" prop="entityNo">
          <el-input v-trim v-model="multipleForm.masterNo" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="topSearch" />
        </el-form-item>
        <el-form-item :label="`${$t('sea.billNumber')}: `" prop="entityNo">
          <el-input v-trim v-model="multipleForm.billNo" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="topSearch" />
        </el-form-item>
        <el-form-item :label="`${$t('sea.customerName')}: `" prop="soNo">
          <!--              <cargo-limited-select  ref="memberId" :placeholder="$t('sea.requesterHold')" :select-label="multipleForm.memberName" :select-value="multipleForm.memberId" type="customer" style="width: 100%;" @set="setCustomerInfo"/>-->
          <TypeSelect v-model="multipleForm.memberId"  type="settlementCompany" :requestParams="{businessType: 'SEA_EXPORT'}" @selected="topSearch" />
        </el-form-item>
        <el-form-item :label="`${$t('sea.settlementUnit')}: `" prop="settlementCompanyId">
          <TypeSelect v-model="multipleForm.settlementCompanyId"  type="settlementCompany" :requestParams="{businessType: 'SEA_EXPORT'}"  @selected="topSearch" />
        </el-form-item>
        <el-form-item :label="`${$t('sea.collectionACSet')}: `" prop="settlementOfficeId">
          <el-select v-model="multipleForm.settlementOfficeId" size="mini" filterable clearable @change="topSearch">
            <el-option v-for="item in settlementOfficeOps" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('sea.ownedSales')}: `" prop="responsiblePersonId">
          <el-select filterable clearable v-model="multipleForm.responsiblePersonId" size="mini" @change="topSearch">
            <el-option v-for="(item, index) in salesList" :key="index" :label="item.chineseName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('sea.settlementMethod')}: `" prop="settlementMode">
          <el-select v-model="multipleForm.settlementMode" size="mini" filterable clearable @change="topSearch">
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
        <el-form-item :label="`${$t('sea.billStatus')}: `" prop="entryState">
          <el-select v-model="multipleForm.entryState" size="mini" filterable clearable @change="topSearch">
            <el-option :label="$t('sea.all')" value=""></el-option>
            <el-option v-for="item in billStatusOps" :key="item.name" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('sea.invoicingApplicationStatus')}: `" prop="invoiceApplyState">
          <el-select v-model="multipleForm.invoiceApplyState" size="mini" filterable clearable @change="topSearch">
            <el-option :label="$t('sea.all')" value=""></el-option>
            <el-option v-for="item in invoiceStateOps" :key="item.name" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <!--        收票状态-->
        <el-form-item :label="`${$t('sea.invoiceState')}: `" prop="invoiceStateName">
          <el-select v-model="multipleForm.invoiceState" size="mini" filterable clearable @change="topSearch">
            <el-option :label="$t('sea.all')" value=""></el-option>
            <el-option v-for="item in invoiceApplyStateOps" :key="item.name" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('sea.currency')}: `" prop="currency">
          <el-select v-model="multipleForm.currency" size="mini" filterable clearable @change="topSearch">
            <el-option :label="$t('sea.all')" value=""></el-option>
            <el-option v-for="item in currenciesOps" :key="item.code" :label="item.code" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('sea.writeOffStatus')}: `" prop="multipleClearState">
          <el-select v-model="multipleForm.multipleClearState" size="mini" multiple filterable clearable @change="topSearch">
            <el-option v-for="item in writeOffStatusOps" :key="item.name" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('receiveFms.apply_clear_status')" prop="instructionState">
          <el-select v-model="multipleForm.instructionState" size="mini" @change="topSearch">
            <el-option :label="$t('receiveFms.ALL')" value="" />
            <el-option v-for="(item, index) in applyClearStateList" :key="index" :label="item.name" :value="item.code" />
          </el-select>
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
        <el-button v-permission="['sea:charge:detail:invoiceapply']" size="mini" type="primary" @click="applyInvoice()" >{{ $t('sea.applyForInvoicing') }}</el-button>
        <el-button v-permission="['sea:charge:detail:instruction_apply']" size="mini" type="primary" @click="applyOrHedgeClear">{{ $t('sea.applyForWriteOff') }}</el-button>
        <div class="page-total"  v-if="multipleFormValuable" style="margin-top: 10px">
          <span class="page-total-item">
            <span>{{$t('receiveFms.receive_sum')}}：</span>
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
                  :entryType="expenseEntryType" :detailedType="false" name="expenseEntryDialog" @submit="expenseEntrySuc"></ExpenseEntry>

    <AllRecordedDialog :allRecordedType="false" :allRecordedDialog.sync="allRecordedDialog" v-if="allRecordedDialog" :allRecordedDialogData="allRecordedDialogData" @filterNextStep="filterNextStep"></AllRecordedDialog>
    <apply-invoice-dialog ref="applyInvoiceDialogRef" origin="CHARGE" :ids="selectedIds" :isSpecifyInvoiceType="true" businessType="SEA_EXPORT" toPath='FmsSeaApplyForInvoiceCharge'></apply-invoice-dialog>

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
  chargeDetailExportApi, chargeEntryConditionApi,
  detailPagesListApi, detailPagesListChargeApi, detailPagesTotalApi, detailPagesTotalChargeApi,
  dictListApi, payDetailExportApi,
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
import AllRecordedDialog from "./components/allRecordedDialog"
import { getSalesListApi } from "@/api/partner/customerManage";
import URL from "@/api/urlTranslator";
import {getCurrenciesListApi} from "@/api/common";
import applyInvoiceDialog from "@/views/financial/components/ApplyInvoiceDialog";
export default {
  name: 'DetailsExpensesReceivableList',
  components: {
    SplitOrderSelector, cargoAdvanceSelect, PreManifestListOperationBtn, ExpensesCostDetails, cargoLimitedSelect, reportListDialog,
    entryPools, ExpenseEntry, AllRecordedDialog,applyInvoiceDialog,
    goBillDetail: {
      template: `<el-button v-if="params.data.billId" type="text" size="mini" @click="params.context.componentParent.goBillDetail(params.data.billId)">{{params.value}}</el-button>`,
      methods: {}
    }
  },
  data() {
    const defaultFilter = {
      memberId: '',
      settlementCompanyId: '',
      settlementOfficeId: '',
      vessel: '',
      voyage: '',
      entityNo: '',
      settlementMode: '',
      invoiceState: '',
      pageSize: 50,
      pageNum: 1,
      multipleClearState: [],
      masterNo: '',
      billNo: '',
      salesId: '',
      polCode: '',
      podCode: '',
      entryState: '',
      etdStart: '',
      etdEnd: '',
      ETD: [new Date().getTime() - 30 * 24 * 60 * 60 * 1000, new Date().getTime()]
    }
    return {
      url: URL,
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
        minWidth: 140,
        cellRendererFramework: 'goBillDetail'
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
        headerName: this.$t('sea.customerName'), // 客户名称
        field: 'memberName',
        minWidth: 140
      }, {
        headerName: this.$t('sea.settlementUnit'), // 结算单位
        field: 'settlementCompanyName',
        minWidth: 140
      }, {
        headerName: this.$t('sea.ownedSales'), // 所属产品
        field: 'responsiblePersonName',
        minWidth: 120
      }, {
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
      },{
        headerName: this.$t('sea.invoicingApplicationStatus'), // 账单状态
        field: 'invoiceApplyStateName',
        minWidth: 120,
        pinned: 'right'
      }, {
        headerName: this.$t('sea.billStatus'), // 账单状态
        field: 'entryStateName',
        minWidth: 90,
        pinned: 'right'
      }, {
        headerName: this.$t('sea.invoiceState'), // 收票状态
        field: 'invoiceStateName',
        minWidth: 90,
        pinned: 'right'
      }, {
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
      applyClearStateList: [], // 核销状态
      totalPayable: null,
      expenseEntryDialog: false,
      expenseEntryMultipleForm: {},
      allRecordedDialog: false,
      allRecordedDialogData: [],
      expenseEntryType: true,
      currenciesOps:[],
      selectedIds: [],
      invoiceStateList: [],
      amountTotal: [], // 应收应付统计
      unClearedAmountTotal: [], // 未销合计
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.topSearch()
    })
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
      dictListApi(25).then(res => {
        if (res.ok) {
          this.applyClearStateList = res.content
        }
      })
      dictListApi(1).then(res => {
        if (res.ok) {
          this.billStatusOps = res.content
        }
      })
      const currenciesList = getCurrenciesListApi().then(res => {
        if (res.ok) {
          this.currenciesOps = res.content
        }
      })
      dictListApi(2).then(res => {
        if (res.ok) {
          this.invoiceStateOps = res.content
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
    async getList() {
      if (this.$isNotEmpty(this.multipleForm.ETD)) {
        this.multipleForm.etdStart = this.multipleForm.ETD[0]
        this.multipleForm.etdEnd = this.multipleForm.ETD[1]
      } else {
        this.multipleForm.etdStart = ''
        this.multipleForm.etdEnd = ''
      }
      const data = lodash.cloneDeep(this.multipleForm)
      delete data.ETD
      if (this.multipleFormValuable) {
        detailPagesTotalChargeApi(data).then(res => {
          this.totalPayable = res.content

          res.content = res.content || []
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
      const res = await detailPagesListChargeApi(data)
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
      const res = await chargeEntryConditionApi(this.multipleForm)
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
        const res = await detailPagesTotalChargeApi(multipleFormCopy2)
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
        totalPayable: totalPayable
      }
      this.expenseEntryType = false
      this.expenseEntryDialog = true
    },
    async exportBtn() {
      this.loading = true
      const res = await chargeDetailExportApi(this.multipleForm)
      this.loading = false
      if (res.ok) {
        window.location = res.content
      }
    },
    // 申请核销
    applyOrHedgeClear() {
      let selectedRows = this.gridApi.getSelectedRows();
      if (selectedRows.length <= 0) {
        this.$message.error(this.$t("receiveFms.please_select_one_then_bill"));
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
        if (v.clearState != 1 && v.clearState != 2) {
          MSG = "只有核销状态为未核销或者部分核销才能进行核销操作";
        }
        if (v.instructionState != 1 && v.instructionState != 2) {
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
        name: 'SeaFmsApplyClearPage',
        query: {
          ids: ids.join(","),
          origin: "CHARGE",
          back: "DetailsExpensesReceivableList"
        }
      });
    },
    formatNumberToThousands(value) {
      return formatNumberToThousands(value)
    },
    goBillDetail(id) {
      this.$router.push({ name: 'FmsReceiveBillDetail', query: { id: id } })
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
      let businessTypes = []
      let isPass = true // 账单状态已对账 且 开票状态为部分开票 或者 未开票
      let isPiecePass = true
      selectedRows.forEach(v => {
        if (settlementCompanyIds.indexOf(v.settlementCompanyId) < 0) {
          settlementCompanyIds.push(v.settlementCompanyId)
        }
        if (settlementOfficeIds.indexOf(v.settlementOfficeId) < 0) {
          settlementOfficeIds.push(v.settlementOfficeId)
        }
        // 票结费用需要费用确认单已确认
        // if (v.settlementMode == 1) {
        //  if (v.confirmationState != 2) {
        // isPiecePass = false
        //  }
        // } else {
        // 其他账期 -> 未开票 部分开票 已对账
        if ((v.invoiceState == 1 || v.invoiceState == 2) && (v.invoiceApplyState == 1 || v.invoiceApplyState == 2) && v.settlementMode == 1) {
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
      // if (!isPiecePass) {
      //   this.$message.error(this.$t("receiveFms.invoicing_confirmed"))
      //   return
      // }
      this.selectedIds = ids
      this.$refs.applyInvoiceDialogRef.show()
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
</style>

