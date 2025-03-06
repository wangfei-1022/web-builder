<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="list" :resetFun="reset">
      <el-form slot="multipleSearch" ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
        <!-- <el-form-item label="流水号:" prop="confirmationNo">
          <el-input v-model.trim="formData.confirmationNo" type="text" maxlength="50" placeholder="" size="mini"
            clearable @keyup.enter.native="list" />
        </el-form-item> -->
        <el-form-item :label="`${$t('air.entityNo')}: `" prop="entityNo">
          <el-input v-trim v-model="formData.entityNo" type="text" :placeholder="$t('common.placeholder')" size="mini"
            clearable @keyup.enter.native="list" />
        </el-form-item>
        <el-form-item :label="$t('air.pol')" prop="extendInfo2">
          <type-select v-model="formData.extendInfo2" type="airport" clearable @selected="list" />
        </el-form-item>
        <el-form-item :label="$t('air.pod2')" prop="extendInfo1">
          <type-select v-model="formData.extendInfo1" type="airport" clearable @selected="list" />
        </el-form-item>
        <el-form-item :label="$t('receiveFms.settlement_company_name')" prop="settlementCompanyId">
          <type-select v-model="formData.settlementCompanyId" type="settlementCompany" @selected="list" />
        </el-form-item>

        <!--<el-form-item :label="$t('receiveFms.settlement_office_name')" prop="settlementOfficeId">-->
        <!--<el-select v-model="formData.settlementOfficeId" size="mini" @change="list">-->
        <!--<el-option :label="$t('contract.ALL')" value="" />-->
        <!--<el-option v-for="(item, index) in YHTList" :key="index" :label="item.label" :value="item.value"/>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="$t('receiveFms.sales_names')" prop="responsiblePersonId">-->
        <!--<el-select filterable clearable v-model="formData.responsiblePersonId" size="mini" @change="list">-->
        <!--<el-option v-for="(item, index) in salesList" :key="index" :label="item.userName" :value="item.id"/>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="$t('receiveFms.bill_status')" prop="entryState">-->
        <!--<el-select v-model="formData.entryState" size="mini"  @change="list">-->
        <!--<el-option :label="$t('receiveFms.ALL')" value="" />-->
        <!--<el-option v-for="(item, index) in entryStateList" :key="index" :label="item.messageKey" :value="item.code"/>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="$t('receiveFms.invoice_status')" prop="invoiceState">-->
        <!--<el-select v-model="formData.invoiceState" size="mini"  @change="list">-->
        <!--<el-option :label="$t('receiveFms.ALL')" value="" />-->
        <!--<el-option v-for="(item, index) in invoiceStateList" :key="index" :label="item.messageKey" :value="item.code"/>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="$t('receiveFms.verification_status')" prop="clearState">-->
        <!--<el-select v-model="formData.clearState" size="mini"  @change="list">-->
        <!--<el-option :label="$t('receiveFms.ALL')" value="" />-->
        <!--<el-option v-for="(item, index) in clearStateList" :key="index" :label="item.messageKey" :value="item.code"/>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="$t('receiveFms.confirmation_state')" prop="confirmationState">-->
        <!--<el-select v-model="formData.confirmationState" size="mini"  @change="list">-->
        <!--<el-option :label="$t('receiveFms.ALL')" value="" />-->
        <!--<el-option v-for="(item, index) in confirmationStateList" :key="index" :label="item.messageKey" :value="item.code"/>-->
        <!--</el-select>-->
        <!--</el-form-item>-->

        <el-form-item :label="`${$t('air.mblNoName')}: `" prop="extendInfo13">
          <el-input v-model="formData.extendInfo13" type="text" size="mini" clearable @keyup.enter.native="list" />
        </el-form-item>
        <el-form-item :label="$t('air.etd')" prop="period">
          <!-- <common-picker pikcerType="daterange" :defaultTime="['00:00:00', '23:59:59']" v-model="formData.period"
            @change="list" clearable></common-picker> -->
          <el-date-picker v-model="formData.period" value-format="timestamp" type="daterange" range-separator="-"
            start-placeholder="" end-placeholder="" @change="list" style="width: 176px">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('air.flightNo')" prop="extendInfo4">
          <el-input v-model="formData.extendInfo4" type="text" size="mini" clearable @keyup.enter.native="list" />
        </el-form-item>

        <el-form-item :label="`${$t('sea.settlementMethod')}: `" prop="settlementMode">
          <el-select v-model="formData.settlementMode" size="mini" filterable clearable @change="list">
            <el-option :label="$t('sea.all')" value=""></el-option>
            <el-option v-for="item in settlementModeOps" :key="item.name" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="`${$t('sea.invoicingApplicationStatus')}: `" prop="invoiceApplyState">
          <el-select v-model="formData.invoiceApplyState" size="mini" filterable clearable @change="list">
            <el-option :label="$t('sea.all')" value=""></el-option>
            <el-option v-for="item in invoiceStateOps" :key="item.name" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('receiveFms.invoice_status')" prop="invoiceState">
          <el-select v-model="formData.invoiceState" size="mini" @change="list">
            <el-option :label="$t('receiveFms.ALL')" value="" />
            <el-option v-for="(item, index) in invoiceStateList" :key="index" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>

        <el-form-item :label="`${$t('sea.confirmStatus')}: `" prop="confirmationState">
          <el-select v-model="formData.confirmationState" size="mini" filterable clearable @change="list">
            <el-option :label="$t('sea.all')" value=""></el-option>
            <el-option v-for="item in confirmationStateOps" :key="item.name" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('sea.drawer')}: `" prop="soNo">
          <TypeSelect v-model="formData.createBy" type="user" @selected="list" />
        </el-form-item>
        <el-form-item :label="$t('receiveFms.bill_status')" prop="entryState">
          <el-select v-model="formData.entryState" size="mini" @change="list">
            <el-option :label="$t('receiveFms.ALL')" value="" />
            <el-option v-for="(item, index) in entryStateList" :key="index" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('receiveFms.verification_status')" prop="clearState">
          <el-select v-model="formData.clearState" size="mini" @change="list">
            <el-option :label="$t('receiveFms.ALL')" value="" />
            <el-option v-for="(item, index) in clearStateList" :key="index" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('receiveFms.apply_clear_status')" prop="instructionState">
          <el-select v-model="formData.instructionState" size="mini" @change="list">
            <el-option :label="$t('receiveFms.ALL')" value="" />
            <el-option v-for="(item, index) in applyClearStateList" :key="index" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="table-wrap">
      <div class="top-btn-wrap mb-10">
        <el-button size="mini" type="primary" @click="exportFn()" v-permission="['air:confirm:receive:export']">
          {{ $t('air.export') }}</el-button>
        <el-button size="mini" type="primary" @click="createBill()" v-permission="['air:confirm:receive:bill']">
          {{ $t('receiveFms.create_bill') }}</el-button>
        <el-button size="mini" type="primary" @click="applyInvoice()"
          v-permission="['air:confirm:receive:applyInvoice']">{{ $t('air.applyForInvoice') }}</el-button>
        <!-- 申请核销 -->
        <el-button size="mini" v-permission="['air:confirm:receive:applicationWriteOff']" type="primary"
          @click="applyOrHedgeClear(false)">{{ $t('air.applicationWriteOff') }}
        </el-button>
        <!-- <el-button size="mini" type="primary" @click="applyOrHedgeClear(true)" v-if="type == 'AR'">对冲核销</el-button> -->
      </div>
      <ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs"
        :column-defs="columnFields" :row-data="dataList" :enable-col-resize="true" :enable-sorting="true"
        :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight"
        class="ag-theme-balham" />

      <!--<div class="total">-->
      <!--<span>{{$t('receiveFms.receive_sum')}}：</span>-->
      <!--<span>-->
      <!--<span class="value-item" v-for="(item, index) in amountTotal" :key='index'>-->
      <!--<span class='value'>{{item.currency}}</span>-->
      <!--<span>{{item.value}}</span>-->
      <!--</span>-->
      <!--</span>-->
      <!--</div>-->

      <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="list" />
    </div>

    <report-list-dialog v-if="reportDialog.isShow" :is-show="reportDialog.isShow" :print-data="reportDialog.data"
      :type-code="reportDialog.typeCode" @closeDialog="reportDialog.isShow = false" />
    <create-bill-success ref="createBillSuccessRef" :billInfo="billInfo"></create-bill-success>

    <!-- <apply-invoice-dialog ref="applyInvoiceDialogRef" origin="CONFIRMATION" toPath="AirReceiveConfirmation" originType="air"
      :ids="selectedIds"></apply-invoice-dialog> -->
    <apply-invoice-dialog ref="applyInvoiceDialogRef" origin="CONFIRMATION" :ids="selectedIds" businessType="AIR_EXPORT"
      toPath='FmsAirApplyForInvoice' originType="air"></apply-invoice-dialog>

  </div>
</template>

<script>
import { getCustomerListApi, getCustomerTypeListApi, checkCustomerIsUniqueApi, getBusinessTypeListApi, getSalesListApi } from "@/api/partner/customerManage"
import { getDictDataApi, getReceiveConfirmationListApi, getReceiveConfirmationListTotalApi, receiveConfirmationConfirmApi, receiveConfirmationCreateBillArApi } from "@/api/fmsReceiveAir"
import { dictListApi, rechargeModeApi } from "@/api/seaExportOrder"
import optionBtn from "./optionBtn"
import createBillSuccess from "../components/createBillSuccess"
import { AgGridVue } from "ag-grid-vue"
import { getYHTListApi } from '@/api/partner/base'
import { getWarehouseSelectionsApi } from '@/api/OverseasWarehouse/warehousePriceCard'
import { parseTime, formatNumberToThousands } from '@/utils/index'
import reportListDialog from '@/components/Cargo/Report/reportListDialog'
import applyInvoiceDialog from "@/views/financial/components/ApplyInvoiceDialog";

export default {
  name: "AirReceiveConfirmation",
  components: {
    AgGridVue,
    optionBtn,
    createBillSuccess,
    reportListDialog,
    applyInvoiceDialog
  },
  data () {
    return {
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
      formData: {
        confirmationNo: '',
        entityNo: '',
        extendInfo1: '', // 装货港
        extendInfo2: '', // 卸货港
        extendInfo13: '', // MblNo
        extendInfo4: '', // flightNo
        settlementCompanyId: '',
        settlementOfficeId: '', // 一海通结算公司
        businessType: '',
        entryState: '',
        invoiceState: '',
        clearState: '',
        confirmationState: '',
        responsiblePersonId: '',
        period: []
      },
      currentItem: '', // 当前选中行的id
      orderItem: {}, // 当前选中的行的实体订单数据
      billInfo: {}, // 调整费用选中的那一行的订单号
      entryStateList: [],
      businessTypeList: [],
      clearStateList: [],
      invoiceStateList: [],
      confirmationStateList: [],
      applyClearStateList: [],
      salesList: [],
      YHTList: [],
      settlementModeOps: [],
      invoiceStateOps: [],
      confirmationStateOps: [],
      pageSizeRange: [10, 20, 30, 50],
      pageSize: 50,
      pageNum: 1,
      total: 0,
      dataList: [],
      amountTotal: [], // 统计
      //
      // 仓库取哪个字段
      // 缺少客户名称字段 memberName
      // 缺少结算公司名称 settlementOfficeName
      // 缺少费用名称字段 feeItemName
      // 数量是使用哪个字段 chargeQuantity1
      // 入账金额 是不是使用amount
      // 流水号取的哪个字段
      columnFields: [],
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
      addType: '', //
      selectedIds: []
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.name === 'AirReceiveConfirmation') {
        this.list();
      }
    }
  },
  created () {
    this.list()
    this.getBaseDataFn()
  },
  methods: {
    // 申请核销 或者 对冲
    applyOrHedgeClear (isHedge) {
      let selectedRows = this.gridApi.getSelectedRows();
      if (selectedRows.length <= 0) {
        this.$message.error(this.$t("receiveFms.please_select_one_then_bill"));
        return;
      }
      let selectedSettlementId = [];
      let ids = [];
      let MSG = "";
      console.log("selectedRows", selectedRows)
      selectedRows.forEach(v => {
        ids.push(v.id);
        console.log("selectedRows", v.entryState, v.clearState, v.instructionState)
        if (selectedSettlementId.indexOf(v.settlementCompanyId) < 0) {
          selectedSettlementId.push(v.settlementCompanyId);
        }
        // if (v.entryState != 4) {
        //   MSG = "只有账单状态为已对账才能进行核销操作";
        // }
        if (v.confirmationState !== 2) {
          // MSG = "只有费用确认单确认状态为已确认才能进行核销操作";
          MSG = this.$t("air.confirmationStateWarm");
        }
        if (v.clearState !== 1 && v.clearState !== 2) {
          // MSG = "只有核销状态为未核销或者部分核销才能进行核销操作";
          MSG = this.$t("air.clearStateWarm");
        }
        if (v.instructionState !== 1 && v.instructionState !== 2) {
          // MSG = "只有申请核销状态为未申请或者部分申请才能进行核销操作";
          MSG = this.$t("air.instructionStateWarm");
        }
      });
      if (selectedSettlementId.length > 1) {
        this.$message.error(this.$t("air.selectedSettlementWarm"));
        return;
      }
      if (MSG) {
        this.$message.error(MSG);
        return;
      }
      // 未核销 已对账
      // let name = isHedge ? "FmsOffsetClearPage" : "FmsApplyClearPage";
      this.$router.push({
        name: "AirFmsApplyClearPage",
        query: {
          ids: ids.join(","),
          origin: "CONFIRMATION",
          back: "AirReceiveConfirmation"
        }
      });
    },
    // 申请开票
    applyInvoice () {
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
        if (v.settlementMode === 1) {
          if (v.confirmationState !== 2) {
            isPiecePass = false
          }
        } else {
          // 其他账期 -> 未开票 部分开票 已对账
          if ((v.invoiceState === 1 || v.invoiceState === 2) && (v.invoiceApplyState === 1 || v.invoiceApplyState === 2) && v.settlementMode === 1) {
            // 通过校验
          } else {
            isPass = false
          }
        }
        ids.push(v.id)
      })
      if (settlementCompanyIds.length > 1) {
        this.$message.error(this.$t("receiveFms.need_same_settlement_company"))
        return
      }
      if (businessTypes.length > 1) {
        this.$message.error(this.$t("receiveFms.need_same_business_type"))
        return
      }
      // 同样的业务类型之后 结算方式肯定相同
      // 票结费用需要费用确认单已确认
      if (!isPiecePass) {
        this.$message.error(this.$t("receiveFms.piece_need_confirm"))
        return
      }
      // 其他账期 -> 未开票 部分开票 已对账
      if (!isPass) {
        this.$message.error(this.$t("receiveFms.need_un_invoice_and_bill_check_sea"))
        return
      }
      this.selectedIds = ids
      console.log("ids", this.selectedIds)
      this.$refs.applyInvoiceDialogRef.show(ids)
    },

    exportFn () {
      let ids = []
      let rows = this.gridApi.getSelectedRows()
      rows.forEach(v => {
        ids.push(v.id)
      })
      if (!ids.length) {
        this.$message.error(this.$t('air.leastOneLineToExport'))
        return
      }
      // 根据查询条件进行批量打印
      this.reportDialog.typeCode = 'AIR_DEBIT_NOTE'
      this.reportDialog.data = { jobId: null, entityIdList: ids }
      // this.reportDialog.data = { queryConditionJson: JSON.stringify(queryConditionJson) }
      this.reportDialog.isShow = true
    },
    getFields () {
      return [{
        headerName: '', width: 40, pinned: 'left',
        suppressSorting: true, checkboxSelection: true,
        suppressMenu: true, suppressSizeToFit: true, suppressResize: true,
        headerCheckboxSelection: true
      }, {
        field: "confirmationNo",
        headerName: this.$t("receiveFms.serial_no"),
        minWidth: 150
      },
      {
        field: "entityNo",
        headerName: this.$t("air.entityNo"),
        minWidth: 100
      },
      {
        field: "mblNo",
        headerName: this.$t('air.mblNoName'),
        minWidth: 100
      }, {
        field: "extendInfo14",
        headerName: this.$t('air.hblNoName'),
        minWidth: 100
      }, {
        field: "memberName",
        headerName: this.$t('air.customerName2'), // 客户名称
        minWidth: 140
      }, {
        field: "settlementModeName",
        headerName: this.$t('air.settlementMethod'), // 结算方式
        minWidth: 100
      }, {
        field: "settlementCompanyName",
        headerName: this.$t("receiveFms.settlement_company_name"),
        minWidth: 150
      }, {
        field: "settlementOfficeName",
        headerName: this.$t("air.collectionACSet"),
        minWidth: 150
      }, {
        field: "polCode",
        headerName: this.$t("air.pol2"),
        minWidth: 80,
        cellRenderer (params) {
          return params.value
        }
      }, {
        field: "podCode",
        headerName: this.$t("air.pod"),
        minWidth: 80,
        cellRenderer (params) {
          return params.value
        }
      }, {
        field: "flightNo",
        headerName: this.$t("air.flightNo"),
        minWidth: 100
      }, {
        field: "atd",
        headerName: this.$t("air.atd"),
        minWidth: 120
      }, {
        field: "entryStateName",
        headerName: this.$t("receiveFms.bill_status"),
        minWidth: 100
      }, {
        field: "invoiceStateName",
        headerName: this.$t("receiveFms.invoice_status"),
        minWidth: 100
      }, {
        field: "invoiceApplyStateName",
        headerName: this.$t('air.invoicingApplicationStatus'), // 开票申请状态
        minWidth: 120
      }, {
        field: "clearStateName",
        headerName: this.$t("receiveFms.verification_status"),
        minWidth: 100
      }, {
        headerName: this.$t('air.applyClearStatus'), // 核销申请状态
        field: 'instructionStateName',
        minWidth: 120
      }, {
        field: "confirmationStateName",
        headerName: this.$t("receiveFms.confirmation_state"),
        minWidth: 130
      },
      {
        field: "createByName",
        headerName: this.$t('air.drawer'), // 开单人
        minWidth: 100
      }, {
        field: "createTime",
        headerName: this.$t('air.drawerTime'), // 开单时间
        minWidth: 100
      }, {
        field: "id",
        headerName: this.$t("receiveFms.operation"),
        cellRendererFramework: "optionBtn",
        pinned: 'right',
        minWidth: 150
      }]
    },
    getBaseDataFn () {
      Promise.all([getYHTListApi(), getDictDataApi(1), getDictDataApi(3), getDictDataApi(4), getDictDataApi(5),
      getSalesListApi(), getBusinessTypeListApi(), rechargeModeApi(), dictListApi(2), dictListApi(5), getDictDataApi(25)]).then(results => {
        const YHTRes = results[0]
        const entryStateRes = results[1]
        const invoiceStateRes = results[2]
        const clearStateRes = results[3]
        const confirmationStateRes = results[4]
        const salesRes = results[5]
        const businessTypeRes = results[6]
        const settlementModeOpsRes = results[7]
        const invoiceStateOpsRes = results[8]
        const confirmationStateOpsRes = results[9]
        const applyClearStateRes = results[10];

        if (YHTRes.ok) {
          this.YHTList = YHTRes.content
        }
        if (entryStateRes.ok) {
          this.entryStateList = entryStateRes.content
        }
        if (invoiceStateRes.ok) {
          this.invoiceStateList = invoiceStateRes.content
        }
        if (clearStateRes.ok) {
          this.clearStateList = clearStateRes.content
        }
        if (confirmationStateRes.ok) {
          this.confirmationStateList = confirmationStateRes.content
        }
        if (salesRes.ok) {
          this.salesList = salesRes.content
        }
        if (businessTypeRes.ok) {
          this.businessTypeList = businessTypeRes.content
        }
        if (settlementModeOpsRes.ok) {
          this.settlementModeOps = settlementModeOpsRes.content
        }
        if (invoiceStateOpsRes.ok) {
          this.invoiceStateOps = invoiceStateOpsRes.content
        }
        if (confirmationStateOpsRes.ok) {
          this.confirmationStateOps = confirmationStateOpsRes.content
        }
        if (applyClearStateRes.ok) {
          this.applyClearStateList = applyClearStateRes.content;
        }
      })
    },
    onReady (params) {
      this.gridApi = params.api
      params.api.sizeColumnsToFit()
      window.addEventListener("resize", function () {
        setTimeout(function () {
          params.api.sizeColumnsToFit()
        })
      })
    },
    async list () {
      this.loading = true
      const _params = {
        ...this.formData,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }
      if (this.$isNotEmpty(this.formData.period)) {
        _params.startDateExtendInfo1 = this.formData.period[0];
        _params.endDateExtendInfo1 = this.formData.period[1]
      } else {
        _params.startDateExtendInfo1 = "";
        _params.endDateExtendInfo1 = "";
      }
      // getReceiveConfirmationListTotalApi(_params).then(res => {
      //   if(res.ok){
      //      res.content.forEach(v => {
      //       if(v.amountName == 'amount'){
      //         v.amounts.forEach(v => {
      //           v.value = formatNumberToThousands(v.value)
      //         })
      //         this.amountTotal = v.amounts
      //       }
      //     })
      //   }
      // })
      const res = await getReceiveConfirmationListApi(_params)
      if (res.ok) {
        this.total = parseInt(res.content.total, 10)
        let currencyArr = []
        res.content.list.forEach(v => {
          let currency = v.currencyAmounts
          currency.forEach(c => {
            v[c.currency] = formatNumberToThousands(c.value)
            if (c.currency && currencyArr.indexOf(c.currency) < 0) {
              currencyArr.push(c.currency)
            }
          })
          try {
            let entity = JSON.parse(v.entityContentJson)
            v.pol = entity.pol || ''
            v.polCode = entity.polCode || ''
            v.pod = entity.pod || ''
            v.podCode = entity.podCode || ''
            v.flightNo = entity.flightNo || ''
            v.mblNo = entity.mblNo || ''
            v.atd = parseTime(v.dateExtendInfo1, '{y}-{m}-{d}')
            v.createTime = parseTime(v.createTime, '{y}-{m}-{d}')
          } catch (e) {
            console.log(e)
          }
        })
        let arr = this.getFields()
        currencyArr.forEach(v => {
          arr.splice(9, 0, {
            field: v,
            headerName: v,
            minWidth: 100,
            cellRenderer (params) {
              return `<div style='text-align: right'>${params.value || ''}</div>`
            }
          })
        })
        this.columnFields = arr
        this.dataList = res.content.list

        // 触发resize
        let ev = document.createEvent('Event')
        ev.initEvent('resize', true, true)
        window.dispatchEvent(ev)
      } else {
        this.total = 0
        this.dataList = []
      }
      this.loading = false
    },
    handleSizeChange (size) {
      this.pageSize = size
      this.list()
    },
    handleCurrentChange (page) {
      this.pageNum = page
      this.list()
    },
    reset () {
      this.$refs.formData.resetFields()
      this.list()
    },
    // 费用确认
    confirmCharge (item) {
      this.$confirm(this.$t('receiveFms.charge_confirm_des'), this.$t('receiveFms.mention'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.loading = true
        receiveConfirmationConfirmApi(item.id).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('receiveFms.charge_confirm_success'))
            this.list()
          }
          this.loading = false
        })
      }).catch(() => {
      })
    },
    // 查看
    view (item) {
      this.$router.push({ name: `AirFmsReceiveConfirmationDetail`, query: { id: item.id, origin: 'AirReceiveConfirmation' } })
    },
    // 生成账单
    createBill () {
      let selectedRows = this.gridApi.getSelectedRows()
      if (selectedRows.length <= 0) {
        this.$message.error(this.$t("receiveFms.please_select_one_then_bill"))
        return
      }
      let ids = []
      let settlementCompanyIds = []
      let businessTypes = []
      let isUnConfirm = false
      let isHasEntry = false
      selectedRows.forEach(v => {
        if (settlementCompanyIds.indexOf(v.settlementCompanyId) < 0) {
          settlementCompanyIds.push(v.settlementCompanyId)
        }
        if (businessTypes.indexOf(v.businessType) < 0) {
          businessTypes.push(v.businessType)
        }
        // 鉴定是否有未确认的
        if (v.confirmationState === 1) {
          isUnConfirm = true
        }
        // 并且已入账的
        if (v.entryState > 1) {
          isHasEntry = true
        }
        ids.push(v.id)
      })
      if (isUnConfirm) {
        this.$message.error(this.$t("receiveFms.this_confirm_un_confirm"))
        return
      }
      if (isHasEntry) {
        this.$message.error(this.$t("receiveFms.this_confirm_has_entry"))
        return
      }
      if (settlementCompanyIds.length > 1) {
        this.$message.error(this.$t("receiveFms.need_same_settlement_company"))
        return
      }
      if (businessTypes.length > 1) {
        this.$message.error(this.$t("receiveFms.need_same_business_type"))
        return
      }
      receiveConfirmationCreateBillArApi({ confirmationIds: ids }).then(res => {
        if (res.ok) {
          let bill = res.content[0] || {}
          this.billInfo = {
            id: bill.id,
            billNo: bill.billNo
          }
          this.list()
          this.$refs.createBillSuccessRef.show()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.right-main-wrapper {
  overflow: auto;
  padding: 20px 20px 0 20px;
}

.total {
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
</style>
