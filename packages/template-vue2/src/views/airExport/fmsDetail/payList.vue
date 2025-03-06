<template>
  <div class="sys-right-inner-wrap" v-loading="loading">
    <top-search-items-slot :searchFun="topSearch" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="115px"
        size="mini" @submit.native.prevent>
        <el-form-item :label="`${$t('air.serialNumber')}: `">
          <el-input v-model.trim="multipleForm.confirmationNo" maxlength="50" placeholder="" size="mini" clearable
            @keyup.enter.native="topSearch" />
        </el-form-item>
        <el-form-item :label="`${$t('air.entityNo')}: `" prop="entityNo">
          <el-input v-trim v-model="multipleForm.entityNo" type="text" :placeholder="$t('common.placeholder')" size="mini"
            clearable @keyup.enter.native="topSearch" />
        </el-form-item>
        <el-form-item :label="`${$t('air.mblNoName')}: `">
          <el-input v-model.trim="multipleForm.mblNo" maxlength="50" placeholder="" size="mini" clearable
            @keyup.enter.native="topSearch" />
        </el-form-item>
        <el-form-item :label="`${$t('air.hblNoName')}: `">
          <el-input v-model.trim="multipleForm.hblNo" placeholder="" size="mini" clearable
            @keyup.enter.native="topSearch" />
        </el-form-item>
        <el-form-item :label="`${$t('air.billNumber')}: `" prop="billNo">
          <el-input v-trim v-model="multipleForm.billNo" type="text" :placeholder="$t('common.placeholder')" size="mini"
            clearable @keyup.enter.native="topSearch" />
        </el-form-item>
        <!--结算单位  -->
        <el-form-item :label="$t('receiveFms.settlement_company_name')" prop="settlementCompanyId">
          <type-select v-model="multipleForm.settlementCompanyId" type="settlementCompany" clearable
            @selected="topSearch" />
        </el-form-item>

        <el-form-item :label="$t('air.pol')" prop="polCode">
          <type-select v-model="multipleForm.polCode" type="airport" clearable @selected="topSearch" />
        </el-form-item>
        <el-form-item :label="$t('air.pod2')" prop="podCode">
          <type-select v-model="multipleForm.podCode" type="airport" clearable @selected="topSearch" />
        </el-form-item>
        <el-form-item :label="`${$t('air.entityTypeName')}: `" prop="entityType">
          <el-select size="mini" v-model="multipleForm.entityType" @change="topSearch" clearable>
            <el-option :label="$t('air.entityType.airOrder')" :value="1101"></el-option>
            <el-option :label="$t('air.entityType.2cBagOrder')" :value="1102"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('air.ownedSales')}: `" prop="sellerName">
          <el-select filterable clearable v-model="multipleForm.responsiblePersonId" size="mini" @change="topSearch">
            <el-option v-for="(item, index) in salesList" :key="index" :label="item.chineseName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('air.etd')" prop="period">
          <!-- <common-picker pikcerType="daterange" :defaultTime="['00:00:00', '23:59:59']" v-model="multipleForm.period"
            @change="topSearch" clearable></common-picker> -->
          <el-date-picker v-model="multipleForm.period" value-format="timestamp" type="daterange" range-separator="-"
            start-placeholder="" end-placeholder="" @change="topSearch" style="width: 176px">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('air.flightNo')">
          <el-input v-model.trim="multipleForm.flightNo" maxlength="50" placeholder="" size="mini" clearable
            @keyup.enter.native="topSearch" />
        </el-form-item>
        <el-form-item :label="`${$t('air.billStatus')}: `" prop="entryState">
          <el-select v-model="multipleForm.entryState" size="mini" filterable clearable @change="topSearch">
            <el-option :label="$t('air.all')" value=""></el-option>
            <el-option v-for="item in billStatusOps" :key="item.name" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <!--        收票状态-->
        <el-form-item :label="`${$t('air.invoiceState')}: `" prop="invoiceStateName">
          <el-select v-model="multipleForm.invoiceState" size="mini" filterable clearable @change="topSearch">
            <el-option :label="$t('air.all')" value=""></el-option>
            <el-option v-for="item in invoiceApplyStateOps" :key="item.name" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('air.writeOffStatus')}: `" prop="clearState">
          <el-select v-model="multipleForm.clearState" size="mini" filterable clearable @change="topSearch">
            <el-option :label="$t('air.all')" value=""></el-option>
            <el-option v-for="item in writeOffStatusOps" :key="item.name" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('payableFms.instructionStateNamePayable')" prop="instructionState">
          <fms-select v-model="multipleForm.instructionState" type="applyClearState"  @selected="topSearch" addAll></fms-select>
        </el-form-item>
        <el-form-item :label="$t('air.confirmTime')" prop="confirmTimePeriod">
          <el-date-picker v-model="multipleForm.confirmTimePeriod" value-format="timestamp" type="daterange"
            range-separator="-" start-placeholder="" end-placeholder="" @change="topSearch" style="width: 176px">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="container-wrap table-wrap">
      <div class="top-btn-wrap mb-10">
        <el-button type="primary" v-permission="['air:fmsDetail:pay:allRecorded']" size="mini" class="ml-10"
          @click="allRecordedBtn">{{ $t('air.allRecorded') }}
        </el-button>
        <el-button slot="reference" v-permission="['air:fmsDetail:pay:selectPosting']" type="primary" size="mini"
          @click="selectPostingBtn">{{ $t('air.selectPosting') }}
        </el-button>
        <!-- <el-button slot="reference" v-permission="['air:fmsDetail:pay:export']" type="primary" size="mini"
          @click="exportBtn">{{ $t('air.export') }}</el-button> -->
          <!-- 申请付款 -->
          <el-button size="mini" type="primary" v-permission="['air:fmsDetail:pay:apply:payment']" @click="applyPayment()" >{{ $t('receiveFms.applyPayment') }}</el-button>
          <!-- 申请核销 -->
        <el-button size="mini" type="primary" v-permission="['air:fmsDetail:pay:apply:clear']"  @click="applyOrHedgeClear(false)">{{$t('receiveFms.applyClear')}}</el-button>

        <el-popover placement="bottom" trigger="click" ref="popoverRef" v-permission="['air:fmsDetail:pay:export']"
          style="margin-left:10px">
          <el-button slot="reference" size="mini" type="primary">{{ $t('air.export') }}<i
              class="el-icon-arrow-down el-icon--right"></i></el-button>
          <template>
            <div v-for="item in exportTemplates" :key="item.code" style="margin-bottom: 6px;">
              <el-link type="primary" @click="exportExcel(item.code)">{{ item.chineseName }}</el-link>
            </div>
          </template>
        </el-popover>


        <div style="display: inline-block" v-if="multipleFormValuable">
          <div class="total-payable" style="display: flex">
            {{ $t('air.totalPayable') }} ：
            <div v-for="(val, index) in totalPayable" :key="index" style="margin-right: 20px">
              <span>{{ val.currency }}</span>
              <span>{{ formatNumberToThousands(val.value) }}</span>
            </div>
          </div>
        </div>

      </div>
      <ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptionsRight" :side-bar="sideBarDefs"
        :column-defs="columnDefsRight" :row-data="tableData.list" :enable-col-resize="true" :enable-sorting="true"
        :grid-ready="onReady" :style="gridHeight" class="ag-theme-balham" />
      <Pagination :total="pageTotal" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum"
        @pagination="getList" />
    </div>
    <div v-show="showEntryPool" class="container-pool-wrap">
      <entryPools :pools="selectedItems" @deleteNo="deleteSelectedItems" @passValidation="passValidation" type="pay"
        @closeWindow="closePool"></entryPools>
    </div>
    <!--    入账-->
    <ExpenseEntry :expenseEntryDialog.sync="expenseEntryDialog" v-if="expenseEntryDialog"
      :initialData="expenseEntryMultipleForm" :multipleForm="expenseEntryMultipleForm" :entryType="expenseEntryType"
      :detailedType="true" name="expenseEntryDialog" @submit="expenseEntrySuc"></ExpenseEntry>
    <AllRecordedDialog :allRecordedType="false" :allRecordedDialog.sync="allRecordedDialog" v-if="allRecordedDialog"
      :allRecordedDialogData="allRecordedDialogData" @filterNextStep="filterNextStep"></AllRecordedDialog>


    <apply-payment-dialog ref="applyPaymentDialogRef" origin="CHARGE" toPath="AirApplyForPayment"/>
    <apply-payable-clear-dialog ref="applyPayableClearDialogRef" origin="CHARGE" toPath="AirPayApplyClearPage"/>

  </div>
</template>
<script>
import { mapState } from 'vuex'
import SplitOrderSelector from "@/views/cargo/v0/CharteredBoat/components/SplitOrderSelector"
import cargoAdvanceSelect from "@/components/Cargo/Common/cargoAdvanceSelect"
import PreManifestListOperationBtn from "@/views/cargo/v0/CharteredBoat/components/PreManifestListOperationBtn"
import {
  dictListApi
} from "@/api/seaExportOrder"

import {
  getAirfmsPayListApi, exportAirfmsPayApi, detailPagesTotalApi, payEntryConditionApi, payExportByTemplateCode
} from "@/api/airExport";
import { getBusinessReportTemplateList } from '@/api/report'
import cargoLimitedSelect from "@/components/Cargo/Common/cargoLimitedSelect"
import { getGridSelected } from "@/utils/gridChoose"
import lodash from 'lodash'
import { getUserInfo } from "@/api/login"
import reportListDialog from "@/components/Cargo/Report/reportListDialog"
import { parseTime, formatNumberToThousands, mergeMethod } from "@/utils"
import entryPools from "./components/entryPools"
import ExpenseEntry from "./components/expenseEntry"
import { getSalesListApi } from "@/api/partner/customerManage";
import URL from "@/api/urlTranslator";
import { exportBL } from "@/api/bl";
import AllRecordedDialog from "@/views/cargo/v0/SeaExport/components/allRecordedDialog";
import applyPaymentDialog from "@/views/financial/components/ApplyPaymentDialog";
import applyPayableClearDialog from "@/views/financial/components/ApplyPayableClearDialog";

export default {
  name: 'AirPayDetailList',
  components: {
    SplitOrderSelector, cargoAdvanceSelect, PreManifestListOperationBtn, cargoLimitedSelect, reportListDialog,
    entryPools, ExpenseEntry, AllRecordedDialog, applyPaymentDialog, applyPayableClearDialog,
    goBillDetail: {
      template: `<el-button v-if="params.data.billId" type="text" size="mini" @click="params.context.componentParent.goBillDetail(params.data.billId)">{{params.value}}</el-button>`,
      methods: {}
    }


  },
  data () {
    const defaultFilter = {
      confirmationNo: '',
      entityNo: '',
      mblNo: '',
      hblNo: '',
      billNo: '',
      settlementCompanyId: '',
      polCode: '',
      podCode: '',
      sellerName: '',
      flightNo: '',
      period: [],
      etdStart: "",
      etdEnd: "",
      confirmTimePeriod: [],
      confirmTimeStart: "",
      confirmTimeEnd: "",
      entryState: '',
      invoiceState: '',
      clearState: '',
      pageSize: 50,
      pageNum: 1
    }
    return {
      selectedIds: [],
      exportTemplates: [], // 导出的下拉
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
        width: 40,
        pinned: 'left',
        suppressSorting: true,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        suppressMenu: true,
        suppressSizeToFit: true,
        suppressResize: true
      }, {
        headerName: this.$t('air.chargeNo'), // 费用ID
        field: 'id',
        minWidth: 140
      }, {
        headerName: this.$t('air.serialNumber'), // 流水号
        field: 'confirmationNo',
        minWidth: 140
      }, {
        headerName: this.$t('air.entityNo'), // 业务单号
        field: 'entityNo',
        minWidth: 140
      }, {
        headerName: this.$t('air.mblNoName'), // MAWB NO
        field: 'mblNo',
        minWidth: 140
      }, {
        headerName: this.$t('air.hblNoName'), // HAWB NO
        field: 'hblNo',
        minWidth: 140
      }, {
        headerName: this.$t('air.billNumber'), // 账单编号
        field: 'billNo',
        minWidth: 140,
        cellRendererFramework: 'goBillDetail'
      }, {
        headerName: this.$t('air.feeName'), // 费用名称
        field: 'feeItemName',
        minWidth: 140
      }, {
        headerName: this.$t('air.billingMethod'), // 计费方式
        field: 'unitName1',
        minWidth: 140
      }, {
        headerName: this.$t('air.currency'), // 币种
        field: 'currency',
        minWidth: 140
      }, {
        headerName: this.$t('air.unitPrice'), // 单价
        field: 'price',
        cellRenderer: params => `<span>${formatNumberToThousands(params.value)}`,
        minWidth: 140
      }, {
        headerName: this.$t('air.quantity'), // 数量
        field: 'chargeQuantity1',
        minWidth: 140
      }, {
        headerName: this.$t('air.taxRate'), // 税率
        field: 'invoiceTaxRateName',
        minWidth: 140
      }, {
        headerName: this.$t('air.taxAmount'), // 税额
        field: 'taxAmount',
        cellRenderer: params => `<span>${formatNumberToThousands(params.value)}`,
        minWidth: 140
      }, {
        headerName: this.$t('air.amountExcludingTax'), // 不含税金额
        field: 'excludeTaxAmount',
        cellRenderer: params => `<span>${formatNumberToThousands(params.value)}`,
        minWidth: 140
      }, {
        headerName: this.$t('air.expenseAmount'), // 费用金额
        field: 'amount',
        cellRenderer: params => `<span>${formatNumberToThousands(params.value)}`,
        minWidth: 140
      },
      // {
      //   headerName: this.$t('air.supplierName'), // 供应商名称
      //   field: 'settlementCompanyName', // 目前先取与结算单位同值 memberName
      //   minWidth: 140
      // },
      {
        headerName: this.$t('air.settlementUnit'), // 结算单位
        field: 'settlementCompanyName',
        minWidth: 140
      }, {
        headerName: this.$t('air.clearingHouse'), // 结算公司
        field: 'settlementOfficeName',
        minWidth: 120
      },
      // {
      //   headerName: this.$t('air.ownedSales'), // 所属销售
      //   field: 'sellerName',
      //   minWidth: 120
      // },
      {
        headerName: this.$t('air.settlementMethod'), // 结算方式
        field: 'settlementModeName',
        minWidth: 120
      },
      {
        headerName: this.$t('air.confirmByInfo'), // 提交人
        field: 'confirmByName',
        minWidth: 120
      },
      {
        headerName: this.$t('air.confirmTime'), // 提交时间
        field: 'confirmTime',
        minWidth: 120
      },
      {
        headerName: this.$t('air.flightNo'), // 航班号
        field: 'flightNo',
        minWidth: 140
      }, {
        headerName: this.$t('air.pol'), // 装货港
        field: 'polCode',
        cellRenderer (params) {
          return params.value
        },
        minWidth: 80
      }, {
        headerName: this.$t('air.pod2'), // 卸货港
        field: 'podCode',
        cellRenderer (params) {
          return params.value
        },
        minWidth: 80
      }, {
        headerName: this.$t('air.receipt'), // 交货地
        field: 'receiptCode',
        cellRenderer (params) {
          return params.value
        },
        minWidth: 80
      },
      {
        headerName: this.$t('air.entityTypeName'), // 单据类型
        field: 'entityTypeName',
        minWidth: 140
      },
      {
        headerName: this.$t('air.atd'), // 实际航班日期
        field: 'atd',
        minWidth: 140
      },
      {
        headerName: this.$t('air.actualGrossWeight2'), // 实际毛重
        field: 'actualGrossWeight',
        minWidth: 140
      },
      {
        headerName: this.$t('air.actualVolume2'), // 实际体积
        field: 'actualVolume',
        minWidth: 140
      },
      {
        headerName: this.$t('air.actualChargeableWeight'), // 实际计费重
        field: 'actualChargeableWeight',
        minWidth: 140
      },

      {
        headerName: this.$t('air.billStatus'), // 账单状态
        field: 'entryStateName',
        minWidth: 90,
        pinned: 'right'
      }, {
        headerName: this.$t('air.invoiceStateName'), // 开票状态
        field: 'invoiceStateName',
        minWidth: 90,
        pinned: 'right'
      }, {
        headerName: this.$t('air.writeOffStatus'), // 核销状态
        field: 'clearStateName',
        minWidth: 90,
        pinned: 'right'
      }, {
				headerName: this.$t('air.instructionStateNamePayable'), // 申请核销/付款状态
				field: 'instructionStateName',
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
      expenseEntryType: true

    }
  },
  computed: {
    ...mapState({
      memberInfo: state => state.user.memberInfo
    }),
    multipleFormValuable () {
      for (let key in this.multipleForm) {
        if (this.multipleForm[key] && key !== 'pageSize' && key !== 'pageNum' && key !== 'period' && key !== 'confirmTimePeriod') {
          return true;
        }
      }
      return false
    }
  },

  methods: {
    goBillDetail (id) {
      this.$router.push({ name: `AirFmsPayableBillDetail`, query: { id: id, origin: 'AirPayDetailList' } })
    },
    async init () {
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
      // 导出下拉
      getBusinessReportTemplateList("CHARGE_ENTRY_AP_AIR_EXPORT").then(res => {
        if (res.ok) {
          this.exportTemplates = res.content
        }
      })
      let res = await getSalesListApi()
      if (res.ok) {
        console.log(1111, res)
        this.salesList = res.content || []
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
      let entityTypeMap = [];
      let entityType = "" // 订单类型

      selectedRows.forEach(v => {
        ids.push(v.id);
        entityTypeMap[v.entityType] = v.entityType

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
        entityType = v.entityType

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
      // 不是同一种单据类型的不支持一起操作！
      if (Object.keys(entityTypeMap).length > 1) {
        this.$message.error(this.$t("air.entityTypeTheSameWarning"));
        return;
      }
      let entityTypeMapping = ''
      switch (entityType) {
        case 'ORDER':
        entityTypeMapping = 1101
        break;
        case 'ORDER_2C':
        entityTypeMapping = 1102
        break;
        default:
        break;
      }
      if (this.$isEmpty(entityTypeMapping)) {
        this.$message.error(this.$t("air.entityTypeWarning"));
        return
      }
      // ids, 业务类型, 订单类型
      this.$refs.applyPayableClearDialogRef.show(ids, "AIR_EXPORT", entityTypeMapping);
    },
    // 申请付款
    applyPayment() {
      let selectedRows = this.gridApi.getSelectedRows();
			if (selectedRows.length <= 0) {
				this.$message.error(this.$t("common.please_select_one_data"));
				return;
			}
      let selectedSettlementIdMap = [];
      let entityTypeMap = [];
			let ids = [];
      let entityType = "" // 订单类型
			for (let index = 0, len = selectedRows.length; index < len; index++) {
        let item = selectedRows[index]
        ids.push(item.id);
        selectedSettlementIdMap[item.settlementCompanyId] = item.settlementCompanyId
        entityTypeMap[item.entityType] = item.entityType

        // 不是同一家结算单位的不支持一起操作！
        if (Object.keys(selectedSettlementIdMap).length > 1) {
          this.$message.error(this.$t("receiveFms.clear_desc_3"));
          return;
        }
        // 不是同一种单据类型的不支持一起操作！
        if (Object.keys(entityTypeMap).length > 1) {
          this.$message.error(this.$t("air.entityTypeTheSameWarning"));
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
        entityType = item.entityType
      }
      let entityTypeMapping = ''
      switch (entityType) {
        case 'ORDER':
        entityTypeMapping = 1101
        break;
        case 'ORDER_2C':
        entityTypeMapping = 1102
        break;
        default:
        break;
      }
      if (this.$isEmpty(entityTypeMapping)) {
        this.$message.error(this.$t("air.entityTypeWarning"));
        return
      }
      // ids, 业务类型, 订单类型
      this.$refs.applyPaymentDialogRef.show(ids, "AIR_EXPORT", entityTypeMapping);
    },
    // 导出Excel
    exportExcel (code) {
      if (this.$isNotEmpty(this.multipleForm.period)) {
        this.multipleForm.etdStart = this.multipleForm.period[0]
        this.multipleForm.etdEnd = this.multipleForm.period[1]
      }
      if (this.$isNotEmpty(this.multipleForm.confirmTimePeriod)) {
        this.multipleForm.confirmTimeStart = this.multipleForm.confirmTimePeriod[0]
        this.multipleForm.confirmTimeEnd = this.calculateDay(0, new Date(this.multipleForm.confirmTimePeriod[1]), 1)
      }
      // let fn = this.type == 'AR' ? receiveChargeExportExcelApi : payableChargeExportExcelApi
      let params = this.multipleForm
      let data = {
        templateCode: code,
        ...params
      }
      payExportByTemplateCode(data).then(res => {
        if (res.ok) {
          // 导出操作成功，请稍后去任务列表查看导出结果
          this.$message.success(this.$t('receiveFms.export_operate_success'))
          this.$refs.popoverRef.doToggle()
        }
      })
    },
    async getList () {
      if (this.$isNotEmpty(this.multipleForm.period)) {
        this.multipleForm.etdStart = this.multipleForm.period[0]
        this.multipleForm.etdEnd = this.multipleForm.period[1]
      }
      if (this.$isNotEmpty(this.multipleForm.confirmTimePeriod)) {
        this.multipleForm.confirmTimeStart = this.multipleForm.confirmTimePeriod[0]
        this.multipleForm.confirmTimeEnd = this.calculateDay(0, new Date(this.multipleForm.confirmTimePeriod[1]), 1)
      }
      if (this.multipleFormValuable) {
        detailPagesTotalApi(this.multipleForm).then(res => {
          this.totalPayable = res.content
        })
      }
      this.selectedItems = []
      this.loading = true
      const res = await getAirfmsPayListApi(this.multipleForm)
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
    topSearch () {
      this.currPage = 1
      this.getList()
    },


    clearSearchForm () { // 搜索重置
      this.$refs.multipleForm.resetFields()
      this.multipleForm = this.$extends({}, this.defaultFilter)
      this.topSearch()
    },
    onReady (params) {
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
    getItemFromChild (val, key) {
      this.multipleForm[key] = val.code5
      if (val.code5) {
        this.getList()
      }
    },
    async allRecordedBtn () {
      const isVal = Object.keys(this.multipleForm).some(key => {
        if (this.multipleForm[key] && this.multipleForm[key] !== 'all' && key !== 'pageSize' && key !== 'pageNum' && key !== 'period') {
          console.log('this.multipleForm[key],', key, this.multipleForm[key])
          return true
        }
      })
      if (!isVal) {
        this.$message.warning(this.$t('air.pleaseFillInAtLeastOneSearchCondition'))
        return false
      }
      // 非待入账
      if (this.multipleForm.entryState && this.multipleForm.entryState !== 1) {
        this.$message.warning(this.$t('air.theSearchConditionMustBeToBePosted'))
        return false
      }
      this.loading = true
      const res = await payEntryConditionApi(this.multipleForm)
      this.loading = false
      if (res.ok) {
        this.allRecordedDialogData = res.content
        console.log("this.allRecordedDialogData", this.allRecordedDialogData)
        this.allRecordedDialog = true
      }
    },
    async filterNextStep (val) {
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
    selectPostingBtn () {
      this.columnApi.setColumnVisible('visibleCol', true)
      this.selectedItems = this.gridApi.getSelectedRows()
      this.showEntryPool = true
    },
    expenseEntrySuc () {
      this.topSearch()
      this.closePool()
    },
    // 删除选中的箱号
    deleteSelectedItems (_obj) {
      // 根据删除的箱号删除列表重对应的选中状态
      this.gridApi.forEachNode(node => {
        if (node.data.id === _obj.id) {
          node.setSelected(false)
        }
      })
    },
    // 关闭浮窗
    closePool () {
      this.selectedItems = []
      this.showEntryPool = false
      this.gridApi.deselectAll()
      this.columnApi.setColumnVisible('visibleCol', false)
    },
    // 打开拆合编辑页
    passValidation () {
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
      // this.$router.push({path: '/SeaExport/ExpenseEntry'})
    },
    async exportBtn () {
      this.loading = true
      const res = await exportAirfmsPayApi(this.multipleForm)
      this.loading = false
      if (res.ok) {
        window.location = res.content
      }
    },
    formatNumberToThousands (value) {
      return formatNumberToThousands(value)
    },
    /**
     * @param {*} dayNumber 天数
     * @param {*} date 日期
     * @param {*} type 1加 2减
     */
    calculateDay (dayNumber, date, type) {
      let ms = dayNumber * (1000 * 60 * 60 * 24)
      let newDate
      if (type === 1) {
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), "23", "59", "59");
        newDate = new Date(date.getTime() + ms);
      } else {
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        newDate = new Date(date.getTime() - ms);
      }

      return newDate.valueOf();
    }

  },
  async created () {
    this.VUE_APP_BASE_API = process.env.VUE_APP_BASE_API
    this.userInfo = await getUserInfo()
    this.init()
    console.log('this.userInfo,', this.userInfo)
  },
  mounted () {
    this.getList()
    dictListApi(2).then(res => {
      if (res.ok) {
        this.invoiceStateOps = res.content
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
  display: flex;
  flex-wrap: wrap;

  .title {
    font-family: 'Arial Negreta', 'Arial';
    font-weight: 700;
    font-size: 18px;
    color: #333333;
    margin-bottom: 20px;

    span {
      color: red
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
    transform: scale(1.1)
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
  .el-table th>.cell:before {
    content: '*';
    color: red
  }
}

.red {
  color: red
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
  color: #1890FF;
  margin-left: 50px;
}
</style>

