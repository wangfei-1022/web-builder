<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="getList" :resetFun="reset">
			<el-form slot="multipleSearch" ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
				<el-form-item :label="$t('fmsReceiveInvoice.invoice_no')" prop="invoiceNo">
					<el-input v-model="formData.invoiceNo" type="text" :placeholder="$t('receiveFms.please_enter')" size="mini" clearable @keyup.enter.native="getList" />
				</el-form-item>
				<el-form-item :label="$t('fmsReceiveInvoice.apply_no')" prop="applyNo">
					<el-input v-model="formData.applyNo" type="text" :placeholder="$t('receiveFms.please_enter')" size="mini" clearable @keyup.enter.native="getList" />
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
				<el-form-item :label="$t('fmsReceiveInvoice.invoice_medium_name')" prop="invoiceMedium">
					<el-select v-model="formData.invoiceMedium" size="mini" @change="getList">
						<el-option :label="$t('receiveFms.ALL')" value="" />
						<el-option v-for="(item, index) in invoiceMaterialTypeList" :key="index" :label="item.name" :value="item.code" />
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('fmsReceiveInvoice.invoice_by_name')" prop="drawerId">
					<type-select v-model="formData.drawerId" type="user" @selected="getList" />
				</el-form-item>
				<el-form-item :label="$t('fmsReceiveInvoice.invoice_date')" prop="invoiceDatePeriod">
					<common-picker pikcerType="daterange" :defaultTime="['00:00:00', '23:59:59']" v-model="formData.invoiceDatePeriod" @change="getList" clearable></common-picker>
				</el-form-item>
				<el-form-item :label="$t('fmsReceiveInvoice.invoice_state_name')" prop="commercialInvoiceState">
					<el-select v-model="formData.commercialInvoiceState" size="mini" @change="getList">
						<el-option :label="$t('fmsReceiveInvoice.ALL')" value="" />
						<el-option v-for="(item, index) in commercialInvoiceStateTypeList" :key="index" :label="item.name" :value="item.code" />
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
					<el-input v-model="formData.expressNo" type="text" :placeholder="$t('receiveFms.please_enter')" size="mini" clearable @keyup.enter.native="getList" />
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
				<el-button size="mini" type="primary" @click="invoiceDownloadFn()">{{$t('fmsReceiveInvoice.invoiceDownload')}}</el-button>
				<el-button size="mini" type="primary" @click="applyOrHedgeClear(false)">{{$t('fmsReceiveInvoice.applyClear')}}</el-button>
				<el-button size="mini" type="primary" @click="applyOrHedgeClear(true)">{{$t('fmsReceiveInvoice.hedgeClear')}}</el-button>
			</div>

			<ag-grid-vue-pro :data="dataList" :style-grid="gridHeight" :column-fields-default="columnFields" :grid-ready="onReady" />

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
import { parseTime, formatNumberToThousands } from "@/utils/index";
import mixin from "@/views/financial/receiveInvoiceTaxManage/mixin";
import applyInvoiceCommercialListTable from "./table/applyInvoiceCommercialListTable";
import { getCommercialInvoicedListByOperatorApi, getCommercialInvoicedTotalByOperatorApi, getCommercialInvoicedListByBusinessApi, getCommercialInvoicedTotalByBusinessApi } from "@/api/financial/fmsReceiveInvoice"

// 形式发票列表-申请人
export default {
	name: "FmsApplyInvoiceCommercialListComponent",
	mixins: [mixin],
	data() {
		return {
			columnFields: []
		};
	},
	created() {
		this.columnFields = applyInvoiceCommercialListTable;
	},
	methods: {
		async getList() {
      let listFn = getCommercialInvoicedListByOperatorApi
      let totalFn = getCommercialInvoicedTotalByOperatorApi

      // 商务看到的是 全部形票
      if (this.role === 'BUSINESS') {
        listFn = getCommercialInvoicedListByBusinessApi
        totalFn = getCommercialInvoicedTotalByBusinessApi
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
            if (v.amountName === 'sourceAmount') {
                v.amounts.forEach(v => {
                  v.value = formatNumberToThousands(v.value)
                })
                this.amountTotal = v.amounts
              }
          })
        }
      })
    },
		reset() {
			this.$refs.formData.resetFields();
			this.getList();
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
