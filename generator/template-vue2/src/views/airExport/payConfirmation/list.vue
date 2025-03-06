<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="list" :resetFun="reset">
      <el-form slot="multipleSearch" ref="formData" :inline="true" :model="formData" label-width="115px" size="mini">
        <!-- <el-form-item label="流水号:" prop="confirmationNo">
          <el-input v-model.trim="formData.confirmationNo" maxlength="50" placeholder="" size="mini" clearable
            @keyup.enter.native="list" />
        </el-form-item> -->
        <el-form-item :label="`${$t('air.entityNo')}: `" prop="entityNo">
          <el-input v-trim v-model="formData.entityNo" type="text" :placeholder="$t('common.placeholder')" size="mini"
            clearable @keyup.enter.native="list" />
        </el-form-item>
        <el-form-item :label="$t('air.pol')" prop="polCode">
          <type-select v-model="formData.polCode" type="airport" clearable @selected="list" />
        </el-form-item>
        <el-form-item :label="$t('air.pod2')" prop="podCode">
          <type-select v-model="formData.podCode" type="airport" clearable @selected="list" />
        </el-form-item>
        <el-form-item :label="$t('receiveFms.settlement_company_name')" prop="settlementCompanyId">
          <type-select v-model="formData.settlementCompanyId" type="settlementCompany" @selected="list" />
        </el-form-item>
        <el-form-item :label="`${$t('air.mblNoName')}: `" prop="mblNo">
          <el-input v-model="formData.mblNo" type="text" size="mini" clearable @keyup.enter.native="list" />
        </el-form-item>
        <el-form-item :label="$t('air.etd')" prop="period">
          <el-date-picker v-model="formData.period" value-format="timestamp" type="daterange" range-separator="-"
            start-placeholder="" end-placeholder="" @change="list" style="width: 176px">
          </el-date-picker>
          <!-- <common-picker pikcerType="daterange" :defaultTime="['00:00:00', '23:59:59']" v-model="formData.period"
            @change="list" clearable></common-picker> -->
        </el-form-item>
        <el-form-item :label="$t('air.flightNo')" prop="flightNo">
          <el-input v-model="formData.flightNo" type="text" size="mini" clearable @keyup.enter.native="list" />
        </el-form-item>
        <el-form-item :label="`${$t('air.entityTypeName')}: `" prop="entityType">
          <el-select size="mini" v-model="formData.entityType" @change="list" clearable>
            <el-option :label="$t('air.entityType.airOrder')" :value="1101"></el-option>
            <el-option :label="$t('air.entityType.2cBagOrder')" :value="1102"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('payableFms.instructionStateNamePayable')" prop="instructionState">
          <fms-select v-model="formData.instructionState" type="applyClearState"  @selected="list" addAll></fms-select>
        </el-form-item>
        <el-form-item :label="$t('receiveFms.clear_status')" prop="clearState" class="multipleClearState">
          <fms-select v-model="formData.clearState" type="clearState" @selected="list"></fms-select>
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="table-wrap">
      <div class="top-btn-wrap mb-10">
        <el-button size="mini" type="primary" @click="exportFn()" v-permission="['air:confirm:pay:export']">
          {{ $t('air.export') }}
        </el-button>
        <el-button size="mini" type="primary" @click="createBill()" v-permission="['air:confirm:pay:bill']">
          {{ $t('receiveFms.create_bill') }}</el-button>
          <!-- 申请付款 -->
        <el-button size="mini" type="primary"  v-permission="['air:confirm:pay:apply:payment']" @click="applyPayment()" >
        {{ $t('receiveFms.applyPayment') }}</el-button>
         <!--申请核销-->
        <el-button size="mini" v-permission="['air:confirm:pay:apply:clear']"  type="primary" @click="applyOrHedgeClear(false)">{{$t('receiveFms.applyClear')}}</el-button>

      </div>
      <ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs"
        :column-defs="columnFields" :row-data="dataList" :enable-col-resize="true" :enable-sorting="true"
        :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight"
        class="ag-theme-balham" />
      <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="list" />
    </div>

    <report-list-dialog v-if="reportDialog.isShow" :is-show="reportDialog.isShow" :print-data="reportDialog.data"
      :type-code="reportDialog.typeCode" @closeDialog="reportDialog.isShow = false" />
    <create-bill-success ref="createBillSuccessRef" :billInfo="billInfo" :type="payType"></create-bill-success>

    <apply-payment-dialog ref="applyPaymentDialogRef" origin="CONFIRMATION" toPath="AirApplyForPayment"/>
    <apply-payable-clear-dialog ref="applyPayableClearDialogRef" origin="CONFIRMATION" toPath="AirPayApplyClearPage"/>

  </div>
</template>

<script>
import { getCustomerListApi, getCustomerTypeListApi, checkCustomerIsUniqueApi, getBusinessTypeListApi, getSalesListApi } from "@/api/partner/customerManage"
import {
  getAirfmsConfirmationPayListApi, batchConfirmAirfmsConfirmationPay
} from "@/api/airExport";
import { getDictDataApi, getReceiveConfirmationListApi, getReceiveConfirmationListTotalApi, receiveConfirmationConfirmApi, receiveConfirmationCreateBillAPApi } from "@/api/fmsReceiveAir"
import optionBtn from "./optionBtn"
import createBillSuccess from "../components/createBillSuccess"
import { AgGridVue } from "ag-grid-vue"
import { getYHTListApi } from '@/api/partner/base'
import { getWarehouseSelectionsApi } from '@/api/OverseasWarehouse/warehousePriceCard'
import { parseTime, formatNumberToThousands } from '@/utils/index'
import reportListDialog from '@/components/Cargo/Report/reportListDialog'
import applyPaymentDialog from "@/views/financial/components/ApplyPaymentDialog";
import applyPayableClearDialog from "@/views/financial/components/ApplyPayableClearDialog";

export default {
  name: "AirPayConfirmation",
  components: {
    AgGridVue,
    optionBtn,
    createBillSuccess,
    reportListDialog,
    applyPaymentDialog,
    applyPayableClearDialog
  },
  data () {
    return {
      payType: "pay",
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
        polCode: '', // 装货港
        podCode: '', // 卸货港
        mblNo: '', // MblNo
        flightNo: '', // flightNo
        settlementCompanyId: '',
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
      salesList: [],
      YHTList: [],
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
      addType: '',
      selectedIds: []

    }
  },
  created () {
    this.list()
    this.getBaseDataFn()
  },
  methods: {
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
        field: "hblNo",
        headerName: this.$t('air.hblNoName'),
        minWidth: 100
      }, {
        field: "settlementCompanyName",
        headerName: this.$t("receiveFms.settlement_company_name"),
        minWidth: 150
      }, {
        field: "settlementOfficeName",
        headerName: this.$t("receiveFms.settlement_office_name"),
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
        // cellRenderer: params => this.formatDate(params.value),
        minWidth: 120
      }, {
        headerName: this.$t('air.entityTypeName'), // 单据类型
        field: 'entityTypeName',
        minWidth: 140
      }, {
        field: "entryStateName",
        headerName: this.$t("receiveFms.bill_status"),
        minWidth: 100
      }, {
        field: "invoiceApplyStateName",
        headerName: this.$t("receiveFms.invoice_status"),
        minWidth: 100
      }, {
        field: "clearStateName",
        headerName: this.$t("receiveFms.verification_status"),
        minWidth: 100
      }, {
        field: "confirmationStateName",
        headerName: this.$t("receiveFms.confirmation_state"),
        minWidth: 130
      }, {
				headerName: this.$t('air.instructionStateNamePayable'), // 申请核销/付款状态
				field: 'instructionStateName',
				minWidth: 130
			}, {
        field: "id",
        headerName: this.$t("receiveFms.operation"),
        cellRendererFramework: "optionBtn",
        pinned: 'right',
        minWidth: 150
      }]
    },
    getBaseDataFn () {
      Promise.all([getYHTListApi(), getDictDataApi(1), getDictDataApi(3), getDictDataApi(4), getDictDataApi(5), getSalesListApi(), getBusinessTypeListApi()]).then(results => {
        const YHTRes = results[0]
        const entryStateRes = results[1]
        const invoiceStateRes = results[2]
        const clearStateRes = results[3]
        const confirmationStateRes = results[4]
        const salesRes = results[5]
        const businessTypeRes = results[6]

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
        _params.etdStart = this.formData.period[0];
        _params.etdEnd = this.formData.period[1]
      } else {
        _params.etdStart = "";
        _params.etdEnd = "";
      }
      console.log("_params", _params)
      const res = await getAirfmsConfirmationPayListApi(_params)
      if (res.ok) {
        this.total = parseInt(res.content.total, 10)
        // let currencyArr = []
        res.content.list.forEach(v => {
          res.content.list.forEach(v => {
            try {
              v.atd = parseTime(v.atd, '{y}-{m}-{d}')
            } catch (e) {
              console.log(e)
            }
          })
        })
        let arr = this.getFields()

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
        let ids = []
        ids.push(item.confirmationId)
        batchConfirmAirfmsConfirmationPay({ "ids": ids }).then(res => {
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
      console.log(111, item)
      this.$router.push({ name: `AirFmsPayableConfirmationDetail`, query: { id: item.confirmationId, origin: 'AirPayConfirmation' } })
    },
    // 生成账单
    createBill () {
      let selectedRows = this.gridApi.getSelectedRows()
      console.log("selectedRows", selectedRows)
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
        ids.push(v.confirmationId)
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
      receiveConfirmationCreateBillAPApi({ confirmationIds: ids }).then(res => {
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
        ids.push(v.confirmationId);
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
        // 只有确认状态为已确认才能进行操作
        if (v.confirmationState !== 2) {
          MSG = this.$t("air.clear_desc_6")
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
        ids.push(item.confirmationId);
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

        // 只有确认状态为已确认才能进行操作
        if (item.confirmationState !== 2) {
          this.$message.error(this.$t("air.clear_desc_6"));
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
      console.log(entityTypeMapping, ids)
      // ids, 业务类型, 订单类型
      this.$refs.applyPaymentDialogRef.show(ids, "AIR_EXPORT", entityTypeMapping);
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
