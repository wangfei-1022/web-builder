<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="getList" :resetFun="reset">
			<el-form slot="multipleSearch" ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
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
						<el-option v-for="(item, index) in invoiceTypeList" :key="index" :label="item.name" :value="item.code" />
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('fmsReceiveInvoice.invoice_medium_name')" prop="invoiceMedium">
					<el-select v-model="formData.invoiceMedium" size="mini" @change="getList">
						<el-option :label="$t('fmsReceiveInvoice.ALL')" value="" />
						<el-option v-for="(item, index) in invoiceMaterialTypeList" :key="index" :label="item.name" :value="item.code" />
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('fmsReceiveInvoice.invoice_group_type_name')" prop="invoiceGroupType">
					<el-select v-model="formData.invoiceGroupType" size="mini" @change="getList">
						<el-option :label="$t('fmsReceiveInvoice.ALL')" value="" />
						<el-option v-for="(item, index) in invoiceGroupTypeList" :key="index" :label="item.name" :value="item.code" />
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('fmsReceiveInvoice.apply_by_name')" prop="applyById" v-if="role == 'FINANCE' || role == 'BUSINESS'">
					<type-select v-model="formData.applyById" type="user" @selected="getList" />
				</el-form-item>
				<el-form-item :label="$t('fmsReceiveInvoice.apply_time')" prop="applyTimePeriod">
					<common-picker pikcerType="daterange" :defaultTime="['00:00:00', '23:59:59']" v-model="formData.applyTimePeriod" @change="getList" clearable></common-picker>
				</el-form-item>
				<el-form-item :label="$t('fmsReceiveInvoice.invoice_state_name_invoice')" prop="taxInvoiceState">
					<el-select v-model="formData.invoiceState" size="mini" @change="getList">
						<el-option :label="$t('fmsReceiveInvoice.ALL')" value="" />
						<el-option v-for="(item, index) in invoiceStateList" :key="index" :label="item.name" :value="item.code" />
					</el-select>
				</el-form-item>
			</el-form>
		</top-search-items-slot>
		<div class="">
			<div class="top-btn-wrap mb-10 mt-10">
				<!--形票的已申请可以作废 财务-->
				<el-button size="mini" type="primary" @click="nullifyApplyFn" v-if="invoiceType == 3 && applyState =='2' && role=='FINANCE'">作废申请</el-button>
			</div>

			<ag-grid-vue-pro :data="dataList" :style-grid="gridHeight" :column-fields-default="columnFields" :grid-ready="onReady" :is-no-oper="!(invoiceType == 3 && applyState =='2' && role=='FINANCE')" />

			<div class="page-total">
				<span>{{$t('fmsReceiveInvoice.apply_total')}}：</span>
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
import applyCommercialListTableOperator from "./table/applyCommercialListTableOperator";
import applyCommercialListTableFinance from "./table/applyCommercialListTableFinance";
import mixin from "./mixin";

export default {
	name: "FmsTaxApplyIncoiceList",
	mixins: [mixin],
	props: {
		applyState: {
			type: [String, Number],
			default: ""
		},
		invoiceType: {
			type: [String, Number],
			default: ""
		},
		role: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
			columnFields: []
		};
	},
	created() {
		if (this.role === "FINANCE") {
			this.columnFields = applyCommercialListTableFinance;
		} else {
			this.columnFields = applyCommercialListTableOperator;
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
