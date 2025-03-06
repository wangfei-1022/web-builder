<template>
	<div class="right-main-wrapper" v-loading="loading">
    <el-tabs v-model="searchActiveName" class="top-tabs">
			<el-tab-pane :label='$t("uexpressFmsCharge.otherSearch")' name="BASE_SEARCH"></el-tab-pane>
			<el-tab-pane :label='$t("uexpressFmsCharge.noSearch")' name="NO_SEARCH"></el-tab-pane>
		</el-tabs>

    <top-search-items-slot :searchFun="getList" :resetFun="reset" :visible="searchActiveName === 'NO_SEARCH'">
      <template slot="multipleSearch">
        <div class="multiple-no-wrap">
          <el-form ref="formDataRef" :inline="true" :model="formData" label-width="100px" size="mini">
            <el-form-item :label='$t("uexpressOrder.no")' prop="queryType" style="minWidth: 100px;float: left;"></el-form-item>
            <el-form-item label='' prop="nos" class="multiple-no-item">
              <el-input v-model="formData.nos" type="textarea" rows="3" size="mini" resize="none" clearable :placeholder="$t('uexpressOrder.noPlaceholder')" />
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>

		<top-search-items-slot :searchFun="getList" :resetFun="reset" v-if="searchActiveName === 'BASE_SEARCH'">
			<el-form slot="multipleSearch" ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
				<el-form-item label='' prop="searchNo">
          <template slot="label">
            <el-select v-model="formData.noType">
              <el-option :label="$t('uexpressFmsCharge.orderNo')" :value="1" />
              <el-option :label="$t('uexpressFmsCharge.channelOrderNo')" :value="2" />
              <el-option :label="$t('uexpressFmsCharge.memberOrderNo')" :value="3" />
            </el-select>
          </template>
          <el-input v-model="formData.searchNo" type="text" size="mini"  clearable  />
        </el-form-item>
        <el-form-item :label="$t('uexpressFmsCharge.customer_name')" prop="memberId">
					<type-select v-model="formData.memberId" type="customer" @selected="getList" :requestParams="{businessType: 'INTERNATIONAL_LINE'}"/>
				</el-form-item>
        <el-form-item :label="$t('uexpressFmsCharge.productName')" prop="productCode">
					<uexpress-type-select v-model="formData.productCode" type="productSales" filterable @selected="getList" />
				</el-form-item>
        <el-form-item :label="$t('uexpressOrder.channelCode')" prop="channelCode">
          <uexpress-type-select v-model="formData.channelCode" type="channel" filterable @selected="getList" />
        </el-form-item>
        <el-form-item :label="$t('uexpressFmsCharge.countryCode')" prop="countryCode">
					<base-select v-model="formData.countryCode" type="country" filterable clearable @selected="getList" />
				</el-form-item>
        <el-form-item :label="$t('uexpressFmsCharge.bill_status')" prop="entryState">
					<fms-select v-model="formData.entryState" type="entryState" addAll @selected="getList" />
				</el-form-item>
        <el-form-item :label="$t('uexpressFmsCharge.confirmationType')" prop="confirmationType">
					<uexpress-select v-model="formData.confirmationType" type="confirmationType" addAll @selected="getList" />
				</el-form-item>
				<el-form-item :label="$t('uexpressFmsCharge.sales_names')" prop="salesId">
					<base-select v-model="formData.salesId" type="sale" filterable clearable @selected="getList" />
				</el-form-item>
        <el-form-item :label="$t('uexpressFmsCharge.confirmation_state')" prop="confirmationState">
					<fms-select v-model="formData.confirmationState" type="confirmationState" addAll @selected="getList" />
				</el-form-item>
				<el-form-item :label="$t('uexpressFmsCharge.verification_status')" prop="clearState">
					<fms-select v-model="formData.clearState" type="clearState" addAll @selected="getList" />
				</el-form-item>
        <el-form-item :label="$t('uexpressFmsCharge.settlement_mode')" prop="settlementMode">
					<base-select v-model="formData.settlementMode" type="settlementMode" addAll @selected="getList" />
				</el-form-item>
        <el-form-item :label="$t('uexpressFmsCharge.productType')" prop="productType">
					<uexpress-select v-model="formData.productType" type="productType" addAll @selected="getList" />
				</el-form-item>

				<el-form-item :label="$t('uexpressFmsCharge.invoice_status')" prop="invoiceState" v-if="false">
					<fms-select v-model="formData.invoiceState" type="invoiceState" addAll @selected="getList" />
				</el-form-item>
				<el-form-item :label="$t('uexpressFmsCharge.apply_clear_status')" prop="instructionState" v-if="false">
					<fms-select v-model="formData.instructionState" type="applyClearState" addAll @selected="getList" />
				</el-form-item>

        <el-form-item :label="$t('uexpressFmsCharge.billNo')" prop="billNo">
					<el-input v-model="formData.billNo"  type="text" size="mini"  clearable />
				</el-form-item>
        <el-form-item :label="$t('receiveFms.profit_state')" prop="profitState">
					<fms-select v-model="formData.profitState" type="profitState" addAll />
				</el-form-item>
        <el-form-item :label="$t('receiveFms.profit_and_loss_period')" prop="profitPeriod">
          <el-date-picker v-model="formData.profitPeriod" type="month" value-format="yyyyMM"></el-date-picker>
				</el-form-item>
        <el-form-item>
          <template slot="label">
            <el-select v-model="formData.timeType">
              <el-option :label="$t('uexpressFmsCharge.inboundTime')" :value="1" />
              <el-option :label="$t('uexpressFmsCharge.outboundTime')" :value="2" />
              <el-option :label="$t('uexpressFmsCharge.offsetTime')" :value="3" />
            </el-select>
          </template>
					<search-date-picker v-model="formData.datePeriod" @change="getList" clearable></search-date-picker>
				</el-form-item>
        <el-form-item :label="$t('uexpressFmsCharge.orderTime')" prop="orderTimePeriod">
					<search-date-picker v-model="formData.orderTimePeriod" @change="getList" clearable></search-date-picker>
				</el-form-item>
        <el-form-item :label="$t('uexpressFmsCharge.lastMileCollectDateTime')" prop="lastMileCollectDateTimePeriod">
					<search-date-picker v-model="formData.lastMileCollectDateTimePeriod" @change="getList" clearable></search-date-picker>
				</el-form-item>
				<el-form-item :label="$t('receiveFms.profit_date')" prop="profitAuditDatePeriod">
					<search-date-picker v-model="formData.profitAuditDatePeriod" clearable></search-date-picker>
				</el-form-item>
			</el-form>
		</top-search-items-slot>
		<div class="">
			<div class="top-btn-wrap mb-10 mt-10">
        <!-- 导出 -->
        <el-button size="mini" type="primary" @click="exportFn">{{$t('uexpressFmsCharge.export')}}</el-button>
			</div>
			<ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="dataList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :pagination="false"
        :pagination-auto-page-size="false"
        :grid-ready="onReady"
        :style="gridHeight"
        class="ag-theme-balham"
        />
			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList" />
		</div>
  </div>
</template>

<script>
import { 
  getReceiveChargeListApi, 
  getReceiveChargeListByNosApi,
  exportOrderSelectedApi,
  exportOrderConditionsApi,
  exportOrderNosApi
  } from "@/api/uexpress/fmsCharge";
import { parseTime, formatNumberToThousands } from "@/utils/index";

export default {
	name: "UExpressReceiveFmsChargeList",
	data() {
		return {
      searchActiveName: 'BASE_SEARCH',
			selectedIds: [],
			selectedInvoiceInfo: {},
			formData: {},
			createBillInfo: {}, // 生成账单所需信息
			entryStateList: [],
			businessTypeList: [],
			clearStateList: [],
			applyClearStateList: [],
			invoiceStateList: [],
			confirmationStateList: [],
			settlementModeList: [],
			salesList: [],
			YHTList: [],
			pageSizeRange: [10, 20, 30, 50],
			pageSize: 50,
			pageNum: 1,
			total: 0,
			dataList: [],
			amountTotal: [], // 统计

      sideBarDefs: { toolPanels: ["columns", "filter"], visible: false },
			gridOptions: {
				rowSelection: "multiple", // 设置多行可选
				animateRows: true,
				suppressRowClickSelection: true, // 选中单元格后可以复制内容
        context: {
					componentParent: this
				}
			},
			loading: false,
			columnFields: [{
        field: 'index',
        headerName: '',
        width: 55,
        pinned: 'left',
        suppressSorting: true,
        checkboxSelection: true,
        suppressMenu: true,
        suppressSizeToFit: true,
        suppressResize: true,
        headerCheckboxSelection: true
      }, {
        field: "confirmationNo",
        headerName: this.$t("uexpressFmsCharge.serial_no"),
        minWidth: 150
      }, {
        field: "orderNo",
        headerName: this.$t("uexpressFmsCharge.orderNo"),
        minWidth: 150
      }, {
        field: "channelOrderNo",
        headerName: this.$t("uexpressFmsCharge.channelOrderNo"),
        minWidth: 150
      }, {
        field: "memberOrderNo",
        headerName: this.$t("uexpressFmsCharge.memberOrderNo"),
        minWidth: 100
      }, {
        field: "memberName",
        headerName: this.$t("uexpressFmsCharge.customer_name"),
        minWidth: 130
      }, {
        field: "settlementModeName",
        headerName: this.$t("uexpressFmsCharge.settlement_mode"),
        minWidth: 100
      }, {
        field: "confirmationTypeName", // 确认单类型
        headerName: this.$t("uexpressFmsCharge.confirmationType"),
        minWidth: 100
      }, {
        field: "feeItemName", // 费用项名称
        headerName: this.$t("uexpressFmsCharge.feeItemName"),
        minWidth: 100
      },  {
        field: "unitPrice", // 单价
        headerName: this.$t("uexpressFmsCharge.unitPrice"),
        type: 'numericColumn',
        minWidth: 100
      },  {
        field: "quantity", // 数量
        headerName: this.$t("uexpressFmsCharge.quantity"),
        type: 'numericColumn',
        minWidth: 100
      },  {
        field: "taxRateStr", // 税率
        headerName: this.$t("uexpressFmsCharge.taxRate"),
        type: 'numericColumn',
        minWidth: 100
      },  {
        field: "taxAmount", // 税额
        headerName: this.$t("uexpressFmsCharge.taxAmount"),
        type: 'numericColumn',
        minWidth: 100
      }, {
        field: "amount", // 应收金额
        headerName: this.$t("uexpressFmsCharge.receiptAmount"),
        type: 'numericColumn',
        minWidth: 100
      }, {
        field: "currency", // 应收币种
        headerName: this.$t("uexpressFmsCharge.currency"),
        minWidth: 100
      }, {
        field: "entryStateName", // 账单状态
        headerName: this.$t("uexpressFmsCharge.bill_status"),
        minWidth: 100
      }, {
        field: "confirmationStateName", // 确认单状态
        headerName: this.$t("uexpressFmsCharge.confirmation_state"),
        minWidth: 130
      }, {
        field: "clearStateName", // 核销状态
        headerName: this.$t("uexpressFmsCharge.clear_status"),
        minWidth: 90
      },  {
        field: "profitStateName", // 盈亏状态
        headerName: this.$t("uexpressFmsCharge.profitStateName"),
        minWidth: 90
      },  {
        field: "profitPeriod", // 盈亏月份
        headerName: this.$t("uexpressFmsCharge.periodName"),
        minWidth: 90
      },  {
        field: "profitAuditDate", // 盈亏审核时间
        headerName: this.$t("uexpressFmsCharge.profitAuditDate"),
        minWidth: 150
      }, {
        field: "billNo", // 账单编号
        headerName: this.$t("uexpressFmsCharge.billNo"),
        minWidth: 90
      }, {
        field: "inboundTime", // 入库时间
        headerName: this.$t("uexpressFmsCharge.inboundTime"),
        minWidth: 150
      }, {
        field: "outboundTime", // 出库时间
        headerName: this.$t("uexpressFmsCharge.outboundTime"),
        minWidth: 150
      }, {
        field: "orderTime", // 下单时间
        headerName: this.$t("uexpressFmsCharge.orderTime"),
        minWidth: 150
      }, {
        field: "lastMileCollectDateTime", // 尾程已揽收时间
        headerName: this.$t("uexpressFmsCharge.lastMileCollectDateTime"),
        minWidth: 150
      }, {
        field: "payTime", // 赔付时间
        headerName: this.$t("uexpressFmsCharge.payTime"),
        minWidth: 150
      }, {
        field: "offsetTime", // 抵扣时间
        headerName: this.$t("uexpressFmsCharge.offsetTime"),
        minWidth: 150
      }, {
        field: "productName", // 产品名称
        headerName: this.$t("uexpressFmsCharge.productName"),
        minWidth: 150
      }, {
        field: "productTypeName", // 业务类型
        headerName: this.$t("uexpressFmsCharge.productType"),
        minWidth: 120
      }, {
        field: "channelName", // 渠道名称
        headerName: this.$t("uexpressFmsCharge.channelName"),
        minWidth: 120
      }, {
        field: "countryName", // 目的地
        headerName: this.$t("uexpressFmsCharge.countryCode"),
        minWidth: 120
      }, {
        field: "salesName", // 所属销售
        headerName: this.$t("uexpressFmsCharge.sales_names"),
        minWidth: 90
      }],
			gridApi: {},
			loading: false,
		};
	},
	created() {
		this.getList();
    this.formDataInit();
	},
	methods: {
    formDataInit() {
      this.formData = {
				nos: "",
        noType: 1,
				searchNo: "",
        memberId: "",
        productCode: "",
        channelCode: "",
        countryCode: "",
        entryState: "",
        confirmationType: "",
        salesId: "",
        confirmationState: "",
        clearState: "",
        settlementMode: "",
        productType: "",
        invoiceState: "",
        instructionState: "",
        billNo: "",
        profitState: "",
        profitPeriod: "",
        timeType: 1,
        datePeriod: [],
        orderTimePeriod: [],
        lastMileCollectDateTimePeriod: [],
        profitAuditDatePeriod: []
			}
    },
		onReady(params) {
			this.gridApi = params.api;
      params.api.sizeColumnsToFit();
			window.addEventListener("resize", function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit();
				});
			});
		},
    getParams() {
      let params = {
				pageSize: this.pageSize,
				pageNum: this.pageNum
			};
      if (this.searchActiveName === 'NO_SEARCH') {
        params.nos = this.formData.nos ? this.formData.nos.split(/,|，|\s+/) : []
      } else {
        params = {
          ...this.formData,
          ...params
        }
        if (params.noType === 1) {
          params.orderNo = params.searchNo
        } else if (params.noType === 2) {
          params.channelOrderNo = params.searchNo
        } else if (params.noType === 3) {
          params.memberOrderNo = params.searchNo
        }

        if (params.timeType === 1) {
          params.inboundTimeStart = params.datePeriod[0]
          params.inboundTimeEnd = params.datePeriod[1]
        } else if (params.timeType === 2) {
          params.outboundTimeStart = params.datePeriod[0]
          params.outboundTimeEnd = params.datePeriod[1]
        } else if (params.timeType === 3) {
          params.offsetTimeStart = params.datePeriod[0]
          params.offsetTimeEnd = params.datePeriod[1]
        }

        if (params.orderTimePeriod && params.orderTimePeriod.length) {
          params.orderTimeStart = params.orderTimePeriod[0]
          params.orderTimeEnd = params.orderTimePeriod[1]
        }
        if (params.lastMileCollectDateTimePeriod && params.lastMileCollectDateTimePeriod.length) {
          params.lastMileCollectDateTimeStart = params.lastMileCollectDateTimePeriod[0]
          params.lastMileCollectDateTimeEnd = params.lastMileCollectDateTimePeriod[1]
        }
        if (params.profitAuditDatePeriod && params.profitAuditDatePeriod.length) {
          params.profitAuditDateStart = params.profitAuditDatePeriod[0]
          params.profitAuditDateEnd = params.profitAuditDatePeriod[1]
        }
        delete params.profitAuditDatePeriod
        delete params.orderTimePeriod
        delete params.lastMileCollectDateTimeEnd
      }
      return params
    },
		async getList() {
			this.loading = true;
			const params = this.getParams()
			let listFn =  this.searchActiveName === 'NO_SEARCH' ? getReceiveChargeListByNosApi : getReceiveChargeListApi;
			const res = await listFn(params);
			if (res.ok) {
				this.total = parseInt(res.content.total, 10);
				let currencyArr = [];
				res.content.list.forEach(v => {
          v.lastMileCollectDateTime = parseTime(v.lastMileCollectDateTime, "{y}-{m}-{d} {h}:{i}:{s}");
          v.createTime = parseTime(v.createTime, "{y}-{m}-{d} {h}:{i}:{s}");
          v.orderTime = parseTime(v.orderTime, "{y}-{m}-{d} {h}:{i}:{s}");
					v.bussinessDate = parseTime(v.bussinessDate, "{y}-{m}-{d} {h}:{i}:{s}");
					v.confirmTime = parseTime(v.confirmTime, "{y}-{m}-{d} {h}:{i}:{s}");
					v.inboundTime = parseTime(v.inboundTime, "{y}-{m}-{d} {h}:{i}:{s}");
					v.outboundTime = parseTime(v.outboundTime, "{y}-{m}-{d} {h}:{i}:{s}");
					v.payTime = parseTime(v.payTime, "{y}-{m}-{d} {h}:{i}:{s}");
					v.offsetTime = parseTime(v.offsetTime, "{y}-{m}-{d} {h}:{i}:{s}");
          v.profitAuditDate = parseTime(v.profitAuditDate, "{y}-{m}-{d} {h}:{i}:{s}");
          v.confirmationType = Number(v.confirmationType); // 此处因为后端返回的code这会是string

          v.unitPrice = formatNumberToThousands(v.unitPrice)
          v.taxAmount = formatNumberToThousands(v.taxAmount)
          v.amount = formatNumberToThousands(v.amount)
				});
				this.dataList = res.content.list;
			} else {
				this.total = 0;
				this.dataList = [];
			}
			this.loading = false;
		},
		reset() {
			this.formDataInit();
			this.getList();
		},
    // 导出EXCEL 至任务列表
    exportFn() {
      let params = this.getParams();
      let selRows = this.gridApi.getSelectedRows();
      let fn = null
      if (selRows.length > 0) {
        fn = exportOrderSelectedApi
        params.ids = []
        selRows.forEach(v => {
          params.ids.push(v.id)
        })
      } else {
        if (this.activeName === 'NO_SEARCH') {
          fn = exportOrderNosApi
        } else {
          fn = exportOrderConditionsApi
        }
      }
      this.loading = true
      fn(params).then(res => {
        if (res.ok) {
          this.$message.success(this.$t('uexpressOrder.exportSuccess'))
        }
        this.loading = false
      })
    },
	}
};
</script>
<style lang="scss" scoped>
.right-main-wrapper {
	overflow: auto;
	padding: 0px 20px 0 20px;
}
::v-deep .el-date-editor.el-input, .el-date-editor.el-input__inner{
  width: 180px;
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

::v-deep .join-bill-form .el-form-item{
  margin-bottom: 0;
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
