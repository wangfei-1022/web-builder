<template>
  <div class="sys-right-inner-wrap right-main-wrapper" v-loading="loading">
    <el-tabs v-model="activeName" class="top-tabs">
      <el-tab-pane :label='$t("uexpressOrder.otherSearch")' name="BASE_SEARCH"></el-tab-pane>
      <el-tab-pane :label='$t("uexpressOrder.noSearch")' name="NO_SEARCH"></el-tab-pane>
    </el-tabs>

    <top-search-items-slot :searchFun="topSearch" :resetFun="clearSearchForm" :visible="activeName === 'NO_SEARCH'">
      <template slot="multipleSearch">
        <div class="multiple-no-wrap">
          <el-form ref="multipleForm" class="multipleNoSearch fms-search-form" :inline="true" :model="multipleForm" label-width="120px" size="mini">
            <el-form-item label="" prop="multipleNos" class='multiple-no-item'>
              <template slot="label">
                <el-select v-model="multipleForm.queryType" style="width: 120px;">
                  <el-option :label="$t('sea.orderNo')" value="4"/>
                  <el-option :label="$t('sea.containerNoDes')" value="8" />
                </el-select>
              </template>
              <el-input v-model="multipleForm.entityNoList" type="textarea" rows="3" resize="none" clearable :placeholder="$t('receiveFms.multipleNosInfo')" />
            </el-form-item>
            <el-form-item :label="`${$t('sea.settlementUnit')}: `" prop="settlementCompanyId">
              <TypeSelect v-model="multipleForm.settlementCompanyId"  type="settlementCompany" :requestParams="{businessType: 'SEA_EXPORT'}" />
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
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form  ref="multipleForm" :inline="true" :model="multipleForm" label-width="120px" size="mini" @submit.native.prevent>
            <el-form-item :label="`${$t('sea.businessNo')}: `" prop="entityNo">
              <el-input v-trim v-model="multipleForm.entityNo" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="topSearch" />
            </el-form-item>
            <!--先隐藏-->
            <el-form-item :label="`${$t('sea.customerName')}: `" prop="soNo" v-if="false">
              <!--              <cargo-limited-select  ref="memberId" :placeholder="$t('sea.requesterHold')" :select-label="multipleForm.memberName" :select-value="multipleForm.memberId" type="customer" style="width: 100%;" @set="setCustomerInfo"/>-->
              <TypeSelect v-model="multipleForm.memberId"  type="customer"  />

            </el-form-item>
            <el-form-item :label="`${$t('sea.settlementUnit')}: `" prop="settlementCompanyId">
              <TypeSelect v-model="multipleForm.settlementCompanyId"  type="settlementCompany" :requestParams="{businessType: 'SEA_EXPORT'}" />
            </el-form-item>
            <el-form-item :label="`${$t('sea.collectionACSet')}: `" prop="settlementOfficeId">
              <el-select v-model="multipleForm.settlementOfficeId" size="mini" filterable clearable >
                <el-option v-for="item in settlementOfficeOps" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="`${$t('sea.shipName')}: `" prop="vessel">
              <el-input v-model="multipleForm.vessel" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="topSearch" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.voyageNo')}: `" prop="voyage">
              <el-input v-model="multipleForm.voyage" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="topSearch" />
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
            <el-form-item :label="`${$t('sea.settlementMethod')}: `" prop="settlementMode">
              <el-select v-model="multipleForm.settlementMode" size="mini" filterable clearable >
                <el-option :label="$t('sea.all')" value=""></el-option>
                <el-option v-for="item in settlementModeOps" :key="item.name" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="`${$t('sea.confirmStatus')}: `" prop="confirmationState">
              <el-select v-model="multipleForm.confirmationState" size="mini" filterable clearable >
                <el-option :label="$t('sea.all')" value=""></el-option>
                <el-option v-for="item in confirmationStateOps" :key="item.name" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="`${$t('sea.drawer')}: `" prop="soNo">
              <TypeSelect v-model="multipleForm.createBy"  type="user"  />
            </el-form-item>
            <el-form-item :label="$t('payableFms.instructionStateNamePayable')" prop="instructionStateList">
              <fms-select v-model="multipleForm.instructionStateList" type="applyClearState" multiple  ></fms-select>
            </el-form-item>
            <el-form-item :label="$t('receiveFms.clear_status')" prop="clearStateList" class="multipleClearState">
              <fms-select v-model="multipleForm.clearStateList" type="clearState" multiple  ></fms-select>
            </el-form-item>
            <el-form-item :label="$t('sea.profitStateName')" prop="profitState">
              <fms-select v-model="multipleForm.profitState" type="profitState" addAll />
            </el-form-item>
            <el-form-item :label="$t('fmsLock.lockOrderStateName')" prop="entityLockStates">
              <fms-select v-model="multipleForm.entityLockStates" type="lockOrderState" @selected="getList" multiple />
            </el-form-item>
          </el-form>

        </div>
      </template>
    </top-search-items-slot>

    <div class="mt-20">
      <div class="top-btn-wrap mb-10">
        <el-button slot="reference" type="primary" size="mini" @click="chargeConfirm">{{ $t('sea.expenseConfirmation') }}</el-button>
<!--        申请付款-->
        <el-button size="mini" type="primary" @click="applyPayment()" v-permission="['sea:confirmation:ap:payment_apply']">{{$t('receiveFms.applyPayment')}}</el-button>
        <!--申请核销-->
        <el-button size="mini" type="primary" @click="applyOrHedgeClear(false)" v-permission="['sea:confirmation:ap:clear_apply']">{{$t('receiveFms.applyClear')}}</el-button>
        <el-button size="mini" type="primary" @click="exportFn">{{$t('sea.batchExport')}}</el-button>
<!--         <el-button type="primary" size="mini" @click="sendToCustomer">{{ $t('sea.applyForInvoicing') }}</el-button>-->
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
<!--      <ag-grid-vue-pro :data="tableData.list" :style-grid="gridHeight" :column-fields-default="columnDefsRight" :grid-ready="onReady" />-->
      <Pagination :total="pageTotal" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getList" />
    </div>
    <!--    费用迁移-->
    <feeMigration name="feeMigrationList" :feeMigrationType="false" :feeMigrationDialog.sync="feeMigrationDialog" v-if="feeMigrationDialog" :row="row" :userInfo="userInfo" @submit="submitFeeMigration"></feeMigration>

    <el-dialog :visible.sync="editExpenseConfirmationDialog" v-if="editExpenseConfirmationDialog" :title="$t('sea.editExpenseConfirmation')" width="1300px" :before-close="closeeditExpenseConfirmation" v-loading="loading">
      <div style="max-height: 550px; overflow: auto">
        <PayableCostDetails :orderDetailsData="orderDetailsData" :confirmationId="confirmationId" :viewBy="viewBy" :isSpecificUsers="isSpecificUsers"
                            @changePage="editExpenseCancel" :entityId="entityId" :entityType="entityType"></PayableCostDetails>
      </div>
    </el-dialog>
    <apply-payment-dialog ref="applyPaymentDialogRef" origin="CONFIRMATION" toPath="SeaApplyForPayment" />
    <apply-payable-clear-dialog ref="applyPayableClearDialogRef" origin="CONFIRMATION" toPath="SeaPayApplyClearPage" />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import SplitOrderSelector from "@/views/cargo/v0/CharteredBoat/components/SplitOrderSelector"
import cargoAdvanceSelect from "@/components/Cargo/Common/cargoAdvanceSelect"
import PreManifestListOperationBtn from "@/views/cargo/v0/CharteredBoat/components/PreManifestListOperationBtn"
import {validEmail} from "@/utils/validate"
import PayableCostDetails from "./components/order/payableCostDetails"
import FeeMigration from "./components/order/feeMigration"
import { parseTime } from '@/utils/index'
import {
  confirmationPayPageListApi,
  confirmationPayDeleteApi,
  dictListApi,
  rechargeModeApi,
  settlementOfficeListApi,
  payConfirmApi,
  confirmationSpecialPayDeleteApi,
  chargeConfirmOneApi,
  payConfirmOneApi,
  detailPagesNosListApi,
  detailPagesListApi,
  confirmationPayNosPageListApi,
  detailPagesNosTotalApi,
  detailPagesTotalApi,
  confirmationPayNosPagesTotalApi, confirmationPayPagesTotalApi,
  payableCostConfirmationListExportApi
} from "@/api/seaExportOrder"
import cargoLimitedSelect from "@/components/Cargo/Common/cargoLimitedSelect"
import {getGridSelected} from "@/utils/gridChoose"
import lodash from 'lodash'
import {getUserInfo} from "@/api/login"
import {formatNumberToThousands} from "@/utils"
import ApplyPaymentDialog from "@/views/financial/components/ApplyPaymentDialog";
import ApplyPayableClearDialog from "@/views/financial/components/ApplyPayableClearDialog";
// <el-tooltip class="item" effect="dark" :content="$t('sea.edit')" placement="top">
//   <el-button v-if="params.data.confirmationState === 1 || params.data.confirmationState === 11" icon="el-icon-edit" type="text" size="mini" @click="params.context.componentParent.editRow(params.data,true)"></el-button>
//   <el-button v-else-if="params.data.confirmationState === 2" v-permission="['sea:confirmation:pay:list:update_special']" icon="el-icon-edit" type="text" size="mini" @click="params.context.componentParent.editRow(params.data,true)"></el-button>
//   </el-tooltip>
export default {
  name: 'PayableCostConfirmationList',
  components: { SplitOrderSelector, cargoAdvanceSelect, PreManifestListOperationBtn, PayableCostDetails, cargoLimitedSelect, FeeMigration,ApplyPaymentDialog, ApplyPayableClearDialog,
    'incomeComponent': {
      template: `<div style="font-size: 14px">
          <el-tooltip class="item" effect="dark" :content="$t('sea.details')" placement="top">
            <el-button icon="el-icon-view" type="text" size="mini" @click="params.context.componentParent.editRow(params.data,false)"></el-button>
          </el-tooltip>

          <el-tooltip v-if="params.data.confirmationState === 1" class="item" effect="dark" :content="$t('sea.feeMigration')" placement="top">
            <el-button icon="el-icon-position" type="text" size="mini" @click="params.context.componentParent.feeMigrationFun(params.data)"></el-button>
          </el-tooltip>
          <el-tooltip v-if="params.data.confirmationState === 1" class="item" effect="dark" :content="$t('sea.delete')" placement="top">
            <el-button icon="el-icon-delete" type="text" size="mini" @click="params.context.componentParent.deleteOrder(params.data)"></el-button>
          </el-tooltip>
        </div>
      `,
      methods: {}
    },
    amountsStr: {
      template: `
          <el-tooltip class="item" effect="dark"  placement="top">
          <div slot="content" v-html="params.value">{{params.data.amountsStr}}</div>
          <div v-html="params.value"></div>
          </el-tooltip>`,
      methods: {}
    }
  },
  data() {
    const defaultFilter = {
      queryType: '4',
      memberId: '',
      settlementCompanyId: '',
      settlementOfficeId: '',
      vessel: '',
      voyage: '',
      entityNo: '',
      entityNoList: '',
      settlementMode: '',
      invoiceState: '',
      confirmationState: '',
      clearStateList:[],
      instructionStateList:[],
      entityLockStates: [],
      ETD: [new Date().getTime() - 30 * 24 * 60 * 60 * 1000, new Date().getTime()],
      ETA: [],
      entryStates: [],
      pageSize: 50,
      pageNum: 1
  }
    return {
      billStatusOps: [],
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
      columnDefsRight: [{
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
        headerName: this.$t('sea.confirmationNo'),
        field: 'confirmationNo',
        minWidth: 140
        // cellClass: 'status-text primary-text'
      }, {
        headerName: this.$t('sea.businessNo'),
        field: 'entityNoDisplay',
        minWidth: 140
      }, {
        headerName: this.$t('sea.containerNoDes'),
        field: 'containerNoDes',
        minWidth: 140
      },  {
        headerName: this.$t('sea.supplierName'),
        field: 'settlementCompanyName', // 目前先取与结算单位同值 memberName
        minWidth: 140
      }, {
        headerName: this.$t('sea.settlementUnit'), // 结算单位
        field: 'settlementCompanyName',
        minWidth: 140
      }, {
        headerName: this.$t('sea.collectionACSet'),
        field: 'settlementOfficeName',
        minWidth: 120
      }, {
        headerName: this.$t('sea.settlementMethod'), // 结算方式
        field: 'settlementModeName',
        minWidth: 120
      }, {
        headerName: this.$t('sea.confirmStatus'),
        field: 'confirmationStateName',
        minWidth: 90
      }, {
        headerName: this.$t('sea.vesselVoyage'),
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
        headerName: this.$t('sea.sailingDate'),
        field: 'stringBusinessDate',
        minWidth: 140
      }, {
        headerName: "ETD",
        field: 'etd',
        cellRenderer: params => parseTime(params.data.businessDate),
        minWidth: 150
      },{
        headerName: "ETA",
        field: 'eta',
        cellRenderer: params => parseTime(params.data.eta),
        minWidth: 150
      }, {
        headerName: this.$t('sea.currencyAmountJson'), // 费用总计
        field: 'amountsStr',
        cellRendererFramework: 'amountsStr',
        minWidth: 140
      }, {
        headerName: this.$t('sea.responsiblePersonName'), // 开单人name
        field: 'createByName',
        minWidth: 140
      }, {
        headerName: this.$t('sea.stringBusinessDate'),
        field: 'stringCreateTime',
        minWidth: 140
      },
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
			},
       {
        headerName: this.$t('sea.profitStateName'), // 盈亏状态
        field: 'profitStateName',
        minWidth: 90,
      }, 
 {
        headerName: this.$t('fmsLock.lockOrderStateName'), // 锁单状态
        field: 'entityLockStateName',
        minWidth: 90,
      }, 

      {
        headerName: this.$t('common.operation'), pinned: 'right', width: 150, suppressSizeToFit: true, suppressResize: true,
        cellRendererFramework: 'incomeComponent'
      }
      ],
      gridOptionsRight: {
        rowSelection: 'multiple',
        rowMultiSelectWithClick: true,
        suppressRowClickSelection: true, // 选中单元格后可以复制内容
        context: {
          componentParent: this
        }
      },
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      feeMigrationDialog: false,
      feeMigrationForm: {},
      editExpenseConfirmationDialog: false,
      entityId: null,
      entityType: null,
      editExpenseConfirmationForm: {},
      settlementOfficeOps: [],
      settlementModeOps: [],
      invoiceStateOps: [],
      confirmationStateOps: [],
      orderDetailsData: {},
      confirmationId: null,
      viewBy: true,
      multipleSelection: [],
      userInfo: {},
      amountTotal: [], // 应收应付统计
      isSpecificUsers: false // 是否是特定用户
    }
  },
  computed: {
    ...mapState({
      memberInfo: state => state.user.memberInfo
    }),
    multipleSelectionLength() {
      if (this.$isNotEmpty(this.multipleSelection) && this.feeMigrationForm.cargoList) {
        if (this.multipleSelection.length === this.feeMigrationForm.cargoList.length) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    multipleFormValuable() {
      for (let key in this.multipleForm) {
        if (this.multipleForm[key] && key !== 'pageSize' && key !== 'pageNum') { return true; }
      }
      return false
    }
  },
  watch: {
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
    validateEmail(rule, value, callback) {
      // if (!validEmail(value)) {
      //   callback(new Error(this.$t('blInfo.emailError')))
      // } else {
      //   callback()
      // }
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
        params.queryType = this.multipleForm.queryType
        params.entityNoList = this.multipleForm.entityNoList ? this.multipleForm.entityNoList.split(/,|，|\s+/) : []
        params.settlementCompanyId = this.multipleForm.settlementCompanyId
        params.instructionStateList = this.multipleForm.instructionStateList
        params.clearStateList = this.multipleForm.clearStateList
        params.ETA = this.multipleForm.ETA
        params.ETD = this.multipleForm.ETD
        params.entryStates = this.multipleForm.entryStates
      } else {
        params = {
          ...params,
          ...this.multipleForm
        }
        delete params.entityNoList
      }
      if (params.ETD && params.ETD.length) {
          params.etdStart = params.ETD[0]
          params.etdEnd = params.ETD[1]
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
      this.loading = true
      const data = this.getParams()
      if (this.activeName === 'NO_SEARCH' && this.$isEmpty(data.entityNoList)) {
        this.loading = false
        this.$message.error('请输入单号')
        return
      }
      if (this.multipleFormValuable) {
        confirmationPayPagesTotalApi(data).then(res => {
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
      const res = await confirmationPayPageListApi(data)
      this.loading = false
      if (res.ok) {
        res.content.list.map(item => {
          let str = ''
          item.amounts.map(item => {
            str += `<span style="margin-right: 7px;">${item.currency} ${formatNumberToThousands(item.value)} </span> `
          })
         // const tooltipStr = `<el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
         //      ${str}
         //  </el-tooltip>`
          item.amountsStr = str
        })
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
      this.gridApi.sizeColumnsToFit()
    },
    /** 选中装货港 */
    getItemFromChild(val, key) {
      this.multipleForm[key] = val.code5
      if (val.code5) {
        this.getList()
      }
    },
    // setCustomerInfo(customer) {
    //   this.multipleForm.memberId = customer.id
    //   this.multipleForm.memberName = customer.chineseName
    //   this.topSearch()
    // },
    chargeConfirm() {
      const selectedList = getGridSelected(this.gridOptionsRight)
      if (this.$isEmpty(selectedList)) {
        this.$message.warning(this.$t('sea.checkAtLeastOnePieceOfData'))
        return
      }
      let sameConfirmationState = selectedList.some(item =>  (item.confirmationState !== 1 && item.confirmationState !== 11))
      if (sameConfirmationState) {
        this.$message.warning(this.$t('sea.selectExpensesToBeConfirmed'))
        return
      }
      this.$confirm(this.$t('sea.cannotBeChangedAfterConfirmationConfirmationSheetInformation'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirmBtn'),
        cancelButtonText: this.$t('common.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.chargePopConfirm(selectedList)
      })
    },
    async chargeConfirmOne(confirmationId) { // 单个确认，后期舍弃
      this.loading = true
      const res = await payConfirmOneApi(confirmationId)
      this.loading = false
      if (res.ok) {
        this.$message.success(this.$t('sea.submittedSuccessfully'))
        this.getList()
      }
    },
    async chargePopConfirm(selectedList) {
      this.loading = true
      let ids = selectedList.map(val => val.confirmationId)
      const res = await payConfirmApi({ids: ids})
      this.loading = false
      if (res.ok) {
        this.$message.success(this.$t('sea.submittedSuccessfully'))
        this.getList()
      }
    },
    receiveEmailsChange(val, memberId) {
      if (this.sendExpenseForm.useTheSameReceivingMailbox) {
        this.sendExpenseForm.cargoList.map(item => {
          if (item.memberId === memberId) {
            this.$set(item, 'receiveEmails', val)
          }
        })
      }
    },
    emailRemarkChange(val, memberId) {
      if (this.sendExpenseForm.useSameMailNotes) {
        this.sendExpenseForm.cargoList.map(item => {
          if (item.memberId === memberId) {
            this.$set(item, 'emailRemark', val)
          }
        })
      }
    },
    // 发送费用至客户end
    editRow(row, viewBy) {
      this.orderDetailsData = {
        id: row.entityId,
        customerId: row.memberId
      }
      this.confirmationId = row.confirmationId
      this.viewBy = viewBy
      if (!viewBy) { // 预览
        this.entityId = row.entityId
        this.entityType = row.entityType
        this.editExpenseConfirmationDialog = true
        return
      }
      // 1 未开票 未申请：开票金额 invoiceApplyState
      // 2 部分开票 ：开票金额<>费用金额且开票金额<>0
      // 3 已开票：开票金额=费用金额
      // 特定用户 confirmationState 1待确认 2已确认
      if (this.userInfo.privilegeCodeList.indexOf('sea:confirmation:pay:list:view_special') > -1) {
        this.isSpecificUsers = true
          this.entityId = row.entityId
          this.entityType = row.entityType
          this.editExpenseConfirmationDialog = true
      } else { // 普通用户
        this.isSpecificUsers = false
        if (row.confirmationState === 1) { // 待确认、：打开编辑窗口
          this.entityId = row.entityId
          this.entityType = row.entityType
          this.editExpenseConfirmationDialog = true
        } else if (row.confirmationState === 2) { // 已确认
          this.$message.warning(this.$t('sea.reconciliationStatusChanged'))
        }
      }
    },
    editExpenseCancel(val) {
      if (val === 1) {
        this.closeeditExpenseConfirmation()
        this.getList()
      }
    },
    closeeditExpenseConfirmation() {
      this.editExpenseConfirmationDialog = false
      this.isSpecificUsers = false
      this.entityId = null
      this.entityType = null
    },
    expenseConfirmation(row) {
      this.$confirm(this.$t('sea.theFeeCannotBeModifiedAfterConfirmation'), this.$t('sea.tips'), {
        confirmButtonText: this.$t('sea.determine'),
        cancelButtonText: this.$t('sea.cancel'),
        type: 'warning'
      }).then(async() => {
        this.chargePopConfirm([row])
      })
    },
    // 费用迁移
    async feeMigrationFun(row) {
      this.row = row
      console.log(this.userInfo)
      if (this.userInfo.privilegeCodeList.indexOf('sea:confirmation:charge:list:move_special') > -1) { // 特定用户
          this.feeMigrationDialog = true
      } else { // 普通用户
        if (row.confirmationState === 1) { // 待确认、：打开编辑窗口
          this.feeMigrationDialog = true
        } else if (row.confirmationState === 2) { // 已确认、
          this.$message.warning(this.$t('sea.reconciliationStatusChanged'))
        }
      }
    },
    submitFeeMigration() {
      this.getList()
    },
    // 删除订单
    async deleteOrder(row) {
      let url
      if (this.userInfo.privilegeCodeList.indexOf('sea:confirmation:pay:list:delete_special') > -1) { // 特定用户
          url = confirmationSpecialPayDeleteApi
          this.$confirm(this.$t('sea.canTBeRecoveredAfterDeletion'), this.$t('sea.tips'), {
            confirmButtonText: this.$t('sea.determine'),
            cancelButtonText: this.$t('sea.cancel'),
            type: 'warning'
          }).then(async() => {
            this.deleteOrderApi(row, url)
          })
      } else { // 普通用户
        url = confirmationPayDeleteApi
        if (row.confirmationState === 1) { // 待确认
          this.$confirm(this.$t('sea.canTBeRecoveredAfterDeletion'), this.$t('sea.tips'), {
            confirmButtonText: this.$t('sea.determine'),
            cancelButtonText: this.$t('sea.cancel'),
            type: 'warning'
          }).then(async() => {
            this.deleteOrderApi(row, url)
          })
        } else if (row.confirmationState === 2) { // 已确认
          this.$message.warning(this.$t('sea.expensesHaveBeenConfirmedAndCannotBeDeleted'))
        }

      }

    },
    async deleteOrderApi(row, url) {
      this.loading = true
      const res = await url(row.confirmationId)
      this.loading = false
      if (res.ok) {
        this.$message.success(this.$t('sea.successfullyDeleted'))
        this.topSearch()
      }
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
        ids.push(v.confirmationId);
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
        // 只有确认状态为已确认才能进行操作
        if (v.confirmationState !== 2 ) {
          MSG = this.$t("receiveFms.clear_desc_6")
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
        ids.push(item.confirmationId);
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

        // 只有确认状态为已确认才能进行操作
        if (item.confirmationState !== 2 ) {
          this.$message.error(this.$t("receiveFms.clear_desc_6"));
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
      this.$refs.applyPaymentDialogRef.show(ids, 'SEA_EXPORT');
    },
    init() {
			dictListApi(1).then(res => {
				if (res.ok) {
					this.billStatusOps = res.content
				}
			})
		},
    exportFn() {
        let params = this.getParams()
        payableCostConfirmationListExportApi(params).then(res => {
            if(res.ok) {
                this.$message.success(this.$t("receiveFms.exportSuccess"))
                window.location.href = res.content 
            }
        })
    },
  },
  async created() {
    this.VUE_APP_BASE_API = process.env.VUE_APP_BASE_API
    this.userInfo = await getUserInfo()
    this.init()
  },
  mounted() {
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
     dictListApi(5).then(res => {
      if (res.ok) {
        this.confirmationStateOps = res.content
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
.operating { display: flex;
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
    color: #E6A23C;
  }

  &.success-text {
    color: #67C23A;
  }

  &.danger-text {
    color: #F56C6C;
  }

  &.primary-text {
    color: #409EFF;
  }
}
.primary-text {
  color: #409EFF;
}
.billForm {
  display: flex; flex-wrap: wrap;
  .title{
    font-family: 'Arial Negreta', 'Arial';
    font-weight: 700;
    font-size: 18px;
    color: #333333;
    margin-bottom: 20px;
    span{ color: red}
  }
  .phoneCon{
    display: flex; justify-content: space-between;
  }
  .phone{ width: 30%;}
}
.go-ams{  margin-right: 8px;}
.el-icon-click,.el-icon-edit,.el-icon-download{cursor: pointer; transition: all 0.2s ease 0s;
  &:hover{ transform: scale(1.1)}
}
.change-label-calss ::v-deep .el-form-item__label{
  width: 200px !important;
}

.billForm ::v-deep {
  .el-form-item--medium .el-form-item__content {
    width: 70% ;
  }
  .el-form-item{
    width: 100%;
  }
}
::v-deep .el-table__expand-column{
  pointer-events: none;
}
::v-deep .el-table__expand-column .el-icon{
  visibility:hidden;
}
.list-operating{
  display: flex; justify-content: space-between;
  ::v-deep .el-button{ margin-left: 0;}
}
.receivingMailbox ::v-deep{
  .el-table th>.cell:before{ content: '*'; color: red}
}
.red{ color: red}
.footer-btn{
  margin-top: 30px;
  text-align: right;
}
.multiple-no-wrap{
  width: 100%;
  overflow:hidden;
}
//.list-operating ::v-deep .el-button{ margin-left: 0;}
.multipleNoSearch {
	width: 100%;
	.multiple-no-item{
    width: 100%;
    ::v-deep .el-input{
     width: 120px;
    }
    ::v-deep .el-form-item__content{
      width: calc(100% - 120px);
    }
    ::v-deep .el-textarea{
      width: 100%;
    }
  }
}
</style>

