<template>
  <div class="sys-right-inner-wrap" v-loading="loading">
    <top-search-items-slot :searchFun="topSearch" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="90px" size="mini" @submit.native.prevent>
        <el-form-item :label="`${$t('sea.businessNo')}: `" prop="entityNo">
          <el-input v-trim v-model="multipleForm.entityNo" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="topSearch" />
        </el-form-item>
        <el-form-item :label="`${$t('sea.customerName')}: `" prop="soNo">
<!--              <cargo-limited-select  ref="memberId" :placeholder="$t('sea.requesterHold')" :select-label="multipleForm.memberName" :select-value="multipleForm.memberId" type="customer" style="width: 100%;" @set="setCustomerInfo"/>-->
          <TypeSelect v-model="multipleForm.memberId"  type="customer" @selected="topSearch" />

        </el-form-item>
        <el-form-item :label="`${$t('sea.settlementUnit')}: `" prop="settlementCompanyId">
          <TypeSelect v-model="multipleForm.settlementCompanyId"  type="settlementCompany" :requestParams="{businessType: 'SEA_EXPORT'}"  @selected="topSearch" />
        </el-form-item>
        <el-form-item :label="`${$t('sea.collectionACSet')}: `" prop="settlementOfficeId">
          <el-select v-model="multipleForm.settlementOfficeId" size="mini" filterable clearable @change="topSearch">
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
          <el-select v-model="multipleForm.settlementMode" size="mini" filterable clearable @change="topSearch">
            <el-option :label="$t('sea.all')" value=""></el-option>
            <el-option v-for="item in settlementModeOps" :key="item.name" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('sea.sendStatus')}: `" prop="sendStatus">
          <el-select v-model="multipleForm.sendStatus" size="mini" filterable clearable @change="topSearch">
            <el-option :label="$t('sea.all')" value=""></el-option>
            <el-option :label="$t('sea.emptySent')" value="SEND"></el-option>
            <el-option :label="$t('sea.notSent')" value="UN"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('sea.invoicingApplicationStatus')}: `" prop="invoiceApplyState">
          <el-select v-model="multipleForm.invoiceApplyState" size="mini" filterable clearable @change="topSearch">
            <el-option :label="$t('sea.all')" value=""></el-option>
            <el-option v-for="item in invoiceStateOps" :key="item.name" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('receiveFms.invoice_status')}: `" prop="invoiceState" >
          <el-select v-model="multipleForm.invoiceState" size="mini"  @change="topSearch">
            <el-option :label="$t('receiveFms.ALL')" value="" />
            <el-option v-for="(item, index) in invoiceStateList" :key="index" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>

        <el-form-item :label="`${$t('sea.confirmStatus')}: `" prop="confirmationState">
          <el-select v-model="multipleForm.confirmationState" size="mini" filterable clearable @change="topSearch">
            <el-option :label="$t('sea.all')" value=""></el-option>
            <el-option v-for="item in confirmationStateOps" :key="item.name" :label="item.name" :value="item.code"></el-option>
          </el-select>
<!--              <el-select v-model="multipleForm.confirmationState" size="mini" @change="topSearch" clearable>-->
<!--                <el-option :value="null" :label="$t('common.all')" />-->
<!--                <el-option value="1" :label="$t('sea.toBeConfirmed')" />-->
<!--                <el-option value="2" :label="$t('sea.confirmed')" />-->
<!--                <el-option value="3" :label="$t('sea.rejected')" />-->
<!--              </el-select>-->
        </el-form-item>
        <el-form-item :label="$t('receiveFms.bill_status')" prop="entryState">
          <el-select v-model="multipleForm.entryState" size="mini" @change="topSearch">
            <el-option :label="$t('receiveFms.ALL')" value="" />
            <el-option v-for="(item, index) in entryStateList" :key="index" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('receiveFms.verification_status')" prop="clearState">
          <el-select v-model="multipleForm.clearState" size="mini" @change="topSearch">
            <el-option :label="$t('receiveFms.ALL')" value="" />
            <el-option v-for="(item, index) in clearStateList" :key="index" :label="item.name" :value="item.code" />
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
        <el-form-item :label="`${$t('sea.drawer')}: `" prop="soNo">
          <TypeSelect v-model="multipleForm.createBy"  type="user" @selected="topSearch" />
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="container-wrap table-wrap">
      <div class="top-btn-wrap mb-10">
        <el-button type="primary" size="mini" class="ml-10" @click="sendToCustomer">{{ $t('sea.sendToCustomer') }}</el-button>
        <el-button slot="reference" type="primary" size="mini" @click="chargeConfirm">{{ $t('sea.expenseConfirmation') }}</el-button>
        <el-button v-permission="['sea:confirmation:charge:invoiceapply']" size="mini" type="primary" @click="applyInvoice()" >{{ $t('sea.applyForInvoicing') }}</el-button>
<!--         <el-button type="primary" size="mini" @click="sendToCustomer">{{ $t('sea.applyForInvoicing') }}</el-button>-->
        <el-button v-permission="['sea:confirmation:charge:instruction_apply']" size="mini" type="primary" @click="applyOrHedgeClear">{{ $t('sea.applyForWriteOff') }}</el-button>
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
<!--      style="height:calc(100vh - 460px)"-->

      <Pagination :total="pageTotal" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getList" />
    </div>
<!--    发送费用确认单至客户-->
    <el-dialog :visible.sync="sendExpenseDialog" v-if="sendExpenseDialog" :title="$t('sea.sendExpenseConfirmationToCustomer')" width="1100px" :before-close="closeSendExpenseDialog" v-loading="loading">
      <el-form ref="sendExpenseForm" :model="sendExpenseForm" style="margin-top: 10px;">
        <div style="display: flex;">
          <el-form-item  label="" prop="" size="mini" style="margin-right: 20px">
            <el-checkbox v-model="sendExpenseForm.useTheSameReceivingMailbox">{{ $t('sea.useTheSameReceivingMailbox') }}</el-checkbox>
          </el-form-item>
          <el-form-item  label="" prop="" size="mini">
            <el-checkbox v-model="sendExpenseForm.useSameMailNotes">{{ $t('sea.useSameMailNotes') }}</el-checkbox>
          </el-form-item>
        </div>
        <el-table class="case-data-table" :data="sendExpenseForm.cargoList">
          <el-table-column prop="entityNoDisplay" :label="$t('sea.businessNo')" align="center" width="170" ></el-table-column>
          <el-table-column prop="memberName" :label="$t('sea.customerName')" align="center" ></el-table-column>
          <el-table-column prop="settlementCompanyName" :label="$t('sea.settlementUnit')" align="center"  ></el-table-column>
          <el-table-column prop="name" align="center" >
            <template slot="header">
              <span class="red">*</span>{{$t('sea.receivingMailbox')}}
            </template>
            <template slot-scope="{row,$index}">
              <el-form-item  label="" :prop="`cargoList.${$index}.receiveEmails`" size="mini" :rules="[{ required: true, message: $t('blInfo.emailError'), trigger: 'blur' },{ validator: validateEmail, trigger: 'blur' }]" style="margin-bottom: 0;">
                <el-input v-model="row.receiveEmails" @change="receiveEmailsChange($event,row.memberId)" size="mini">{{ $t('sea.useSameMailNotes') }}</el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('sea.mailNotes')" prop="name" align="center" >
            <template slot-scope="{row}">
              <el-form-item  label="" prop="emailRemark" size="mini"  style="margin-bottom: 0;">
                <el-input v-model="row.emailRemark"  @change="emailRemarkChange($event,row.memberId)" size="mini">{{ $t('sea.useSameMailNotes') }}</el-input>
              </el-form-item>
            </template>

          </el-table-column>
        </el-table>

      </el-form>
      <div class="footer-btn">
        <el-button type="primary" size="small" @click="submitSendExpense">{{ $t('common.confirm') }}</el-button>
        <el-button size="small" @click="closeSendExpenseDialog">{{ $t('common.cancel') }}</el-button>
      </div>
    </el-dialog>
<!--    费用迁移-->
    <feeMigration name="feeMigrationList" :feeMigrationDialog.sync="feeMigrationDialog" v-if="feeMigrationDialog" :row="row" :userInfo="userInfo" @submit="submitFeeMigration"></feeMigration>

    <el-dialog :visible.sync="editExpenseConfirmationDialog" v-if="editExpenseConfirmationDialog" :title="$t('sea.editExpenseConfirmation')" width="1200px" :before-close="closeeditExpenseConfirmation" v-loading="loading">
      <div style="max-height: 550px; overflow: auto">
        <ExpensesCostDetails :orderDetailsData="orderDetailsData" :confirmationId="confirmationId" :viewBy="viewBy" :isSpecificUsers="isSpecificUsers"
                             @changePage="editExpenseCancel" :entityId="entityId" :entityType="entityType"></ExpensesCostDetails>
      </div>

    </el-dialog>
    <reportListDialog v-if="reportDialog.isShow" :is-show="reportDialog.isShow" :print-data="reportDialog.data" :type-code="reportDialog.typeCode" @closeDialog="reportDialog.isShow=false" />

    <apply-invoice-dialog ref="applyInvoiceDialogRef" origin="CONFIRMATION" :ids="selectedIds" :isSpecifyInvoiceType="true" businessType="SEA_EXPORT" toPath='FmsSeaApplyForInvoice' originType="sea"></apply-invoice-dialog>

  </div>
</template>
<script>
import { mapState } from 'vuex'
import SplitOrderSelector from "@/views/cargo/v0/CharteredBoat/components/SplitOrderSelector"
import cargoAdvanceSelect from "@/components/Cargo/Common/cargoAdvanceSelect"
import PreManifestListOperationBtn from "@/views/cargo/v0/CharteredBoat/components/PreManifestListOperationBtn"
import {validEmail} from "@/utils/validate"
import ExpensesCostDetails from "./components/order/expensesCostDetails"
import FeeMigration from "./components/order/feeMigration"
import {
  chargeConfirmApi, chargeConfirmOneApi,
  chargeSendToCustomerApi,
  confirmationChargeDeleteApi,
  confirmationChargePageListApi, confirmationSpecialDeleteApi,
  dictListApi,
  rechargeModeApi,
  settlementOfficeListApi
} from "@/api/seaExportOrder"
import cargoLimitedSelect from "@/components/Cargo/Common/cargoLimitedSelect"
import {getGridSelected} from "@/utils/gridChoose"
import lodash from 'lodash'
import {getUserInfo} from "@/api/login"
import reportListDialog from "@/components/Cargo/Report/reportListDialog"
import {formatNumberToThousands} from "@/utils"
import applyInvoiceDialog from "@/views/financial/components/ApplyInvoiceDialog";
import {getDictDataApi} from "@/api/financial/fmsReceive";

// <el-tooltip class="item" effect="dark" :content="$t('sea.edit')" placement="top">
//   <el-button v-if="params.data.confirmationState === 1 || params.data.confirmationState === 11" icon="el-icon-edit" type="text" size="mini" @click="params.context.componentParent.editRow(params.data,true)"></el-button>
//   <el-button v-else-if="params.data.confirmationState === 2" v-permission="['sea:confirmation:charge:list:update_special']" icon="el-icon-edit" type="text" size="mini" @click="params.context.componentParent.editRow(params.data,true)"></el-button>
//   </el-tooltip>
export default {
  name: 'ExpensesReceivableList',
  components: { SplitOrderSelector, cargoAdvanceSelect, PreManifestListOperationBtn, ExpensesCostDetails, cargoLimitedSelect, FeeMigration, reportListDialog,applyInvoiceDialog,
    'incomeComponent': {
      template: `<div style="font-size: 14px">
          <el-tooltip class="item" effect="dark" :content="$t('sea.details')" placement="top">
            <el-button icon="el-icon-view" type="text" size="mini" @click="params.context.componentParent.editRow(params.data,false)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('sea.download')" placement="top">
            <el-button icon="el-icon-download" type="text" size="mini" @click="params.context.componentParent.printSample(params.data.confirmationId)"></el-button>
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
      memberId: '',
      settlementCompanyId: '',
      settlementOfficeId: '',
      vessel: '',
      voyage: '',
      entityNo: '',
      settlementMode: '',
      invoiceState: '',
      confirmationState: '',
      invoiceApplyState: '',
      sendStatus: '',
      ETD: [new Date().getTime() - 30 * 24 * 60 * 60 * 1000, new Date().getTime()],
      pageSize: 50,
      pageNum: 1
  }
    return {
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
        headerName: this.$t('sea.customerName'),
        field: 'memberName',
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
        headerName: this.$t('sea.sendStatus'), // 已发送客户
        field: 'sendStatusName',
        minWidth: 140
      }, {
        headerName: this.$t('receiveFms.clear_status'), // 核销状态
        field: 'clearStateName',
        minWidth: 140
      }, {
        headerName: this.$t('sea.profitStateName'), // 盈亏状态
        field: 'profitStateName',
        minWidth: 90,
      }, {
        headerName: this.$t('receiveFms.bill_status'), // 开票申请状态
        field: 'entryStateName',
        minWidth: 140
      },{
        headerName: this.$t('sea.invoicingApplicationStatus'), // 开票申请状态
        field: 'invoiceApplyStateName',
        minWidth: 140
      }, {
        headerName: this.$t('sea.invoiceState'), // 开票状态
        field: 'invoiceStateName',
        minWidth: 140
      },{
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
      sendExpenseDialog: false, // 发送费用确认单至客户
      sendExpenseForm: {},
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
      reportDialog: { // 打印报表对话框
        isShow: false,
        typeCode: '',
        data: {
          jobId: '',
          assistInfo: '',
          definedInfo: '',
          entityIdList: [],
          remark: ''
        }
      },
      batchPrintMultipleForm: {}, // 批量打印用的条件
      isSpecificUsers: false, // 是否是特定用户
      selectedIds: [],
      invoiceStateList: [],
      clearStateList: [],
      applyClearStateList: [],
      entryStateList: [],
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
    }
  },
  watch: {
    'multipleForm.ETD'(newVal) {
      if (this.$isEmpty(newVal)) {
        this.multipleForm.etdStart = ''
        this.multipleForm.etdEnd = ''
      } else {
        this.multipleForm.etdStart = newVal[0]
        this.multipleForm.etdEnd = newVal[1]
      }
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
      this.multipleForm.etdStart = this.multipleForm.ETD[0]
      this.multipleForm.etdEnd = this.multipleForm.ETD[1]
      getDictDataApi(1).then(res=>{
        if (res.ok) {
          this.entryStateList = res.content;
        }
      })
      getDictDataApi(3).then(res=>{
        if (res.ok) {
          this.invoiceStateList = res.content
        }
      })
      getDictDataApi(4).then(res=>{
        if (res.ok) {
          this.clearStateList = res.content;
        }
      })
      getDictDataApi(25).then(res=>{
        if (res.ok) {
          this.applyClearStateList = res.content;
        }
      })

    },
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
    async getList() {
      this.loading = true
      const res = await confirmationChargePageListApi(this.multipleForm)
      this.loading = false
      if (res.ok) {
        res.content.list.map(item => {
          let str = ''
          item.amounts.map(item => {
            str += `<span style="margin-right: 7px;">${item.currency} ${formatNumberToThousands(item.value)} </span> `
          })
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
      let sameConfirmationState = selectedList.some(item => (item.confirmationState !== 1 && item.confirmationState !== 11))
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
      const res = await chargeConfirmOneApi(confirmationId)
      this.loading = false
      if (res.ok) {
        this.$message.success(this.$t('sea.submittedSuccessfully'))
        this.getList()
      }
    },
    async chargePopConfirm(selectedList) {
      this.loading = true
      let ids = selectedList.map(val => val.confirmationId)
      const res = await chargeConfirmApi({ids: ids})
      this.loading = false
      if (res.ok) {
        this.$message.success(this.$t('sea.submittedSuccessfully'))
        this.getList()
      }
    },
    // 发送费用确认单至客户
    sendToCustomer() {
      const selectedList = getGridSelected(this.gridOptionsRight)
      if (this.$isEmpty(selectedList)) {
        this.$message.error(this.$t('sea.checkAtLeastOnePieceOfData'))
        return
      }
      const selectedListCopy = lodash.cloneDeep(selectedList)
      this.$set(this.sendExpenseForm, 'useSameMailNotes', true)
      this.$set(this.sendExpenseForm, 'useTheSameReceivingMailbox', true)
      this.$set(this.sendExpenseForm, 'cargoList', selectedListCopy)
      this.sendExpenseDialog = true
    },
    submitSendExpense() {
      this.$refs.sendExpenseForm.validate(async valid => {
        if (valid) {
          this.loading = true
          const promiseAll = []
          this.sendExpenseForm.cargoList.map((item, index) => {
            const data = {
              receiveEmails: item.receiveEmails,
              emailRemark: item.emailRemark
            }
             promiseAll[index] = chargeSendToCustomerApi(data, item.confirmationId).then(res => {
              if (res.ok) {
                console.log('发送成功')
              }
            })
          })
          await Promise.all(promiseAll)
          this.getList()
          this.closeSendExpenseDialog()
        }
      })
    },
    closeSendExpenseDialog() {
      this.sendExpenseDialog = false
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
      // 1 未开票 未申请：开票金额 invoiceApplyState
      // 2 部分开票 ：开票金额<>费用金额且开票金额<>0
      // 3 已开票：开票金额=费用金额
      // 特定用户 confirmationState 1待确认 2已确认
      if (this.userInfo.privilegeCodeList.indexOf('sea:confirmation:charge:list:view_special') > -1) {
        this.isSpecificUsers = true
        // if (row.invoiceApplyState === 1) {
          this.entityId = row.entityId
          this.entityType = row.entityType
          this.editExpenseConfirmationDialog = true
        // }
        // else {
        //   this.$message.warning(this.$t('sea.relevantExpensesHaveBeenInvoiced'))
        // }

      } else { // 普通用户
        this.isSpecificUsers = false
        if (row.confirmationState === 1 && row.invoiceApplyState === 1) { // 待确认、未申请：打开编辑窗口
          this.entityId = row.entityId
          this.entityType = row.entityType
          this.editExpenseConfirmationDialog = true
        } else if (row.confirmationState === 2 && row.invoiceApplyState === 1) { // 已确认、未申请
          this.$message.warning(this.$t('sea.reconciliationStatusChanged'))
        } else if (row.invoiceApplyState !== 1) {
          this.$message.warning(this.$t('sea.relevantExpensesHaveBeenInvoiced'))
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
    // 费用迁移
    async feeMigrationFun(row) {
      this.row = row
      console.log(this.userInfo)
      if (this.userInfo.privilegeCodeList.indexOf('sea:confirmation:charge:list:move_special') > -1) { // 特定用户
        if (row.invoiceApplyState === 1) {
          this.feeMigrationDialog = true
        } else {
          this.$message.warning(this.$t('sea.relevantExpensesHaveBeenInvoiced'))
        }
      } else { // 普通用户
        if (row.confirmationState === 1 && row.invoiceApplyState === 1) { // 待确认、未申请：打开编辑窗口
          this.feeMigrationDialog = true
        } else if (row.confirmationState === 2 && row.invoiceApplyState === 1) { // 已确认、未申请
          this.$message.warning(this.$t('sea.reconciliationStatusChanged'))
        } if (row.invoiceApplyState !== 1) {
          this.$message.warning(this.$t('sea.relevantExpensesHaveBeenInvoiced'))
        }
      }


    },
    submitFeeMigration() {
      this.getList()
    },
    // 删除订单
    async deleteOrder(row) {

      let url
      if (this.userInfo.privilegeCodeList.indexOf('sea:confirmation:charge:list:delete_special') > -1) { // 特定用户
        url = confirmationSpecialDeleteApi
        if (row.invoiceApplyState === 1) {
          this.$confirm(this.$t('sea.canTBeRecoveredAfterDeletion'), this.$t('sea.tips'), {
            confirmButtonText: this.$t('sea.determine'),
            cancelButtonText: this.$t('sea.cancel'),
            type: 'warning'
          }).then(async() => {
            this.deleteOrderApi(row, url)
          })
        } else {
          this.$message.warning(this.$t('sea.relevantExpensesHaveBeenInvoiced'))
        }
      } else { // 普通用户
        url = confirmationChargeDeleteApi
        if (row.confirmationState === 1 && row.invoiceApplyState === 1) { // 待确认、未申请：打开编辑窗口
          this.$confirm(this.$t('sea.canTBeRecoveredAfterDeletion'), this.$t('sea.tips'), {
            confirmButtonText: this.$t('sea.determine'),
            cancelButtonText: this.$t('sea.cancel'),
            type: 'warning'
          }).then(async() => {
            this.deleteOrderApi(row, url)
          })
        } else if (row.confirmationState === 2 && row.invoiceApplyState === 1) { // 已确认、未申请
          this.$message.warning(this.$t('sea.reconciliationStatusChanged'))
        } if (row.invoiceApplyState !== 1) {
          this.$message.warning(this.$t('sea.relevantExpensesHaveBeenInvoiced'))
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
    // * 打印
    printSample(id) {
      this.reportDialog.typeCode = 'SEA_DEBIT_NOTED' // 'SEA_MBL' 打印客户提单 EB_PACKING_INFORMATION 导出装箱数据
      const entityIdList = [id]
      this.reportDialog.data = { jobId: '', entityIdList }
      this.reportDialog.isShow = true
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
          if (v.confirmationState != 2) {
            isPiecePass = false
          }
        // } else {
          // 其他账期 -> 未开票 部分开票 已对账
          if ((v.invoiceState == 1 || v.invoiceState == 2) && (v.invoiceApplyState == 1 || v.invoiceApplyState == 2) && v.settlementMode == 1) {
            // 通过校验
          } else {
            isPass = false
          }
        // }
        ids.push(v.confirmationId)
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
      this.selectedIds = ids
      this.$refs.applyInvoiceDialogRef.show()
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
        ids.push(v.confirmationId);
        if (selectedSettlementId.indexOf(v.settlementCompanyId) < 0) {
          selectedSettlementId.push(v.settlementCompanyId);
        }
        // if (v.entryState != 4) {
        //   MSG = "只有账单状态为已对账才能进行核销操作";
        // }
        if (v.confirmationState != 2) {
          MSG = "只有确认状态为已确认才能进行核销操作";
        }
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
          origin: "CONFIRMATION",
          back: "ExpensesReceivableList"
        }
      });
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
//.list-operating ::v-deep .el-button{ margin-left: 0;}
</style>

