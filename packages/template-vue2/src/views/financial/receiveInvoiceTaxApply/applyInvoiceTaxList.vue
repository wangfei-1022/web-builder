<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="getList" :resetFun="reset">
			<el-form slot="multipleSearch" ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
				<el-form-item :label="$t('fmsReceiveInvoice.invoice_no')" prop="invoiceNo">
					<el-input v-model="formData.invoiceNo" type="text" :placeholder="$t('fmsReceiveInvoice.please_enter')" size="mini" clearable @keyup.enter.native="getList" />
				</el-form-item>
				<el-form-item :label="$t('fmsReceiveInvoice.apply_no')" prop="applyNo">
					<el-input v-model="formData.applyNo" type="text" :placeholder="$t('fmsReceiveInvoice.please_enter')" size="mini" clearable @keyup.enter.native="getList" />
				</el-form-item>
				<el-form-item :label="$t('fmsReceiveInvoice.business_type_name')" prop="businessType">
					<el-select v-model="formData.businessType" size="mini" @change="getList">
						<el-option :label="$t('fmsReceiveInvoice.ALL')" value="" />
						<el-option v-for="item in businessTypeList" :key="item.code" :label="item.chineseName" :value="item.code" />
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('fmsReceiveInvoice.settlement_company_name')" prop="settlementCompanyId">
					<type-select v-model="formData.settlementCompanyId" type="settlementCompany" @selected="getList" />
				</el-form-item>
				<el-form-item :label="$t('fmsReceiveInvoice.settlement_office_name')" prop="settlementOfficeId">
					<el-select v-model="formData.settlementOfficeId" size="mini" @change="getList">
						<el-option :label="$t('fmsReceiveInvoice.ALL')" value="" />
						<el-option v-for="(item, index) in YHTList" :key="index" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('fmsReceiveInvoice.invoice_type_name')" prop="invoiceType" v-if="invoiceType != invoiceTypeMap.COMMERCIAL_INVOICE">
					<el-select v-model="formData.invoiceType" size="mini" @change="getList">
						<el-option :label="$t('fmsReceiveInvoice.ALL')" value="" />
						<el-option v-for="(item, index) in taxInvoiceTypeList" :key="index" :label="item.name" :value="item.code" />
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('fmsReceiveInvoice.invoice_medium_name')" prop="invoiceMedium">
					<el-select v-model="formData.invoiceMedium" size="mini" @change="getList">
						<el-option :label="$t('fmsReceiveInvoice.ALL')" value="" />
						<el-option v-for="(item, index) in invoiceMaterialTypeList" :key="index" :label="item.name" :value="item.code" />
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('fmsReceiveInvoice.invoice_by_name')" prop="drawerId">
					<type-select v-model="formData.drawerId" type="user" @selected="getList" />
				</el-form-item>
				<el-form-item :label="$t('fmsReceiveInvoice.invoice_date')" prop="invoiceDatePeriod">
					<common-picker pikcerType="daterange" :defaultTime="['00:00:00', '23:59:59']" v-model="formData.invoiceDatePeriod" @change="getList" clearable></common-picker>
				</el-form-item>
				<el-form-item :label="$t('fmsReceiveInvoice.invoice_state_name')" prop="taxInvoiceState">
					<el-select v-model="formData.taxInvoiceState" size="mini" @change="getList">
						<el-option :label="$t('fmsReceiveInvoice.ALL')" value="" />
						<el-option v-for="(item, index) in taxInvoiceStateTypeList" :key="index" :label="item.name" :value="item.code" />
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('fmsReceiveInvoice.notify_state_name')" prop="notifyState">
					<el-select v-model="formData.notifyState" size="mini" @change="getList">
						<el-option :label="$t('fmsReceiveInvoice.ALL')" value="" />
						<el-option v-for="(item, index) in notifyStateList" :key="index" :label="item.name" :value="item.code" />
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('fmsReceiveInvoice.express_state_name')" prop="expressState">
					<el-select v-model="formData.expressState" size="mini" @change="getList">
						<el-option :label="$t('fmsReceiveInvoice.ALL')" value="" />
						<el-option v-for="(item, index) in expressStateList" :key="index" :label="item.name" :value="item.code" />
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('fmsReceiveInvoice.clear_state_name')" prop="clearState">
					<el-select v-model="formData.clearState" size="mini" @change="getList">
						<el-option :label="$t('fmsReceiveInvoice.ALL')" value="" />
						<el-option v-for="(item, index) in clearStateList" :key="index" :label="item.name" :value="item.code" />
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('fmsReceiveInvoice.instruction_state_name')" prop="instructionState">
					<el-select v-model="formData.instructionState" size="mini" @change="getList">
						<el-option :label="$t('fmsReceiveInvoice.ALL')" value="" />
						<el-option v-for="(item, index) in applyClearStateList" :key="index" :label="item.name" :value="item.code" />
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('fmsReceiveInvoice.express_no')" prop="expressNo">
					<el-input v-model="formData.expressNo" type="text" :placeholder="$t('fmsReceiveInvoice.please_enter')" size="mini" clearable @keyup.enter.native="getList" />
				</el-form-item>
        <el-form-item :label="$t('fmsReceiveInvoice.apply_by_name')" prop="applyById">
					<type-select v-model="formData.applyById" type="user" @selected="getList" />
				</el-form-item>
				<el-form-item :label="$t('fmsReceiveInvoice.apply_time')" prop="applyTimePeriod">
					<common-picker pikcerType="daterange" :defaultTime="['00:00:00', '23:59:59']" v-model="formData.applyTimePeriod" @change="getList" clearable></common-picker>
				</el-form-item>
			</el-form>
		</top-search-items-slot>
		<div class="">
			<div class="top-btn-wrap mb-10 mt-10">
				<el-button size="mini" type="primary" @click="invoiceDownloadFn()" v-if="invoiceType != 3 && invoiceState == 'INVOICED'">{{$t('fmsReceiveInvoice.download_invoice_file')}}</el-button>
				<el-button size="mini" type="primary" @click="applyOrHedgeClear(false)">{{$t('fmsReceiveInvoice.apply_clear')}}</el-button>
				<el-button size="mini" type="primary" @click="applyOrHedgeClear(true)">{{$t('fmsReceiveInvoice.offset_clear')}}</el-button>
			</div>

			<ag-grid-vue-pro :data="dataList" :style-grid="gridHeight" :column-fields-default="columnFields" :grid-ready="onReady" :is-no-oper="!(invoiceType != 3 && invoiceState == 'INVOICED')" />

			<div class="page-total">
				<span>{{$t('fmsReceiveInvoice.total')}}：</span>
				<span>
					<span class="value-item" v-for="(item, index) in amountTotal" :key='index'>
						<span class='value'>{{item.currency}}</span>
						<span>{{item.value}}</span>
					</span>
				</span>
			</div>

			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList" />
		</div>
	</div>
</template>

<script>
import mixin from "@/views/financial/receiveInvoiceTaxManage/mixin";
import applyInvoiceTaxListTable from "./table/applyInvoiceTaxListTable";
import { parseTime, formatNumberToThousands, downloadFile } from '@/utils/index'
import { getTaxInvoicedListByOperatorApi, getTaxInvoicedTotalByOperatorApi, getTaxInvoicedListByBusinessApi, getTaxInvoicedTotalByBusinessApi } from "@/api/financial/fmsReceiveInvoice"

// 税控发票列表-申请人
export default {
	name: "FmsTaxIncoiceListApplyComponent",
	mixins: [mixin],
	data() {
		return {
			formData: {
				invoiceNo: "",
				applyNo: "",
				businessType: "",
				settlementCompanyId: "",
				settlementOfficeId: "",
				invoiceType: "",

				drawerId: "",
				billState: "",
				invoiceState: "",
				clearState: "",
				expressNo: "",
				invoiceDatePeriod: []
			},
			pageSizeRange: [10, 20, 30, 50],
			pageSize: 50,
			pageNum: 1,
			total: 0,
			dataList: [],
			amountTotal: [], // 统计
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
			loading: false
		};
	},
	created() {
		this.getList();
		this.getBaseDataFn();
		this.columnFields = applyInvoiceTaxListTable;
	},
	methods: {
		reset() {
			this.$refs.formData.resetFields();
			this.getList();
		},
    async getList() {
      // 税票发票
      let listFn = getTaxInvoicedListByOperatorApi
      let totalFn = getTaxInvoicedTotalByOperatorApi

      // 商务看到的是 全部税票
      if (this.role === 'BUSINESS') {
        listFn = getTaxInvoicedListByBusinessApi
        totalFn = getTaxInvoicedTotalByBusinessApi
      }
      let params = this.getParams()
      const res = await listFn(params)
      if (res.ok) {
        res.content.list = res.content.list || []
        this.total = parseInt(res.content.total, 10)
        this.dataList = this.formatListData(res.content.list)
      } else {
        this.total = 0
        this.dataList = []
      }
      this.loading = false

      totalFn(params).then(res => {
        if (res.ok) {
          res.content.forEach(v => {
            if (v.amountName === 'invoiceAmount') {
                v.amounts.forEach(v => {
                  v.value = formatNumberToThousands(v.value)
                })
                this.amountTotal = v.amounts
              }
          })
        }
      })
    }
	}
};
</script>
<style lang="scss" scoped>
.right-main-wrapper {
	padding: 5px 20px;
	height: 100%;
	overflow: hidden;
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
</style>
