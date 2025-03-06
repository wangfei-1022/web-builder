<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="getList" :resetFun="reset">
			<el-form slot="multipleSearch" ref="formData" :inline="true" :model="formData" label-width="100px" size="mini" class="fms-search-form">
				<el-form-item :label='$t("receiveFms.bill_no")' prop="billNo">
					<el-input v-model="formData.billNo" type="text" :placeholder="$t('receiveFms.please_enter')" size="mini" clearable @keyup.enter.native="getList" />
				</el-form-item>
        <el-form-item :label="$t('receiveFms.business_type')" prop="businessTypeList">
          <base-select v-model="formData.businessTypeList" type="businessType" collapse-tags multiple @selected="businessTypeChange"></base-select>
				</el-form-item>
        <el-form-item :label="$t('receiveFms.entityTypeName')" prop="entityTypeList" v-if="formData.businessTypeList.length">
          <el-select v-model="formData.entityTypeList" size="mini" multiple collapse-tags>
            <el-option v-for="item in entityTypeList" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
				<el-form-item :label="$t('receiveFms.settlement_company_name')" prop="settlementCompanyId">
					<type-select v-model="formData.settlementCompanyId" type="settlementCompany"  />
				</el-form-item>
				<el-form-item :label="$t('receiveFms.settlement_office_name')" prop="settlementOfficeId">
          <base-select v-model="formData.settlementOfficeId" type="settlementOffice" addAll></base-select>
				</el-form-item>
				<el-form-item :label="$t('receiveFms.bill_status')" prop="billState" v-if="!billState">
          <fms-select v-model="formData.billState" type="billState" addAll />
				</el-form-item>
				<el-form-item :label="$t('receiveFms.invoice_status')" prop="invoiceState" v-if="type === 'AR'">
					<fms-select v-model="formData.invoiceState" type="invoiceState" addAll />
				</el-form-item>
				<!--预留收票状态-->
				<el-form-item :label="$t('receiveFms.invoice_status')" prop="invoiceState" v-if="type === 'AP' && false">
          <fms-select v-model="formData.invoiceState" type="invoiceState" addAll />
				</el-form-item>
				<el-form-item :label="$t('receiveFms.verification_status')" prop="clearState">
					<fms-select v-model="formData.clearState" type="clearState" addAll />
				</el-form-item>
				<el-form-item :label="$t('receiveFms.apply_clear_status')" prop="instructionState">
					<fms-select v-model="formData.instructionState" type="applyClearState" addAll />
				</el-form-item>
				<el-form-item :label="$t('receiveFms.confirm_by_name')" prop="confirmBy">
					<type-select v-model="formData.confirmBy" type="operation" clearable  />
				</el-form-item>
				<el-form-item :label="$t('receiveFms.create_by_name')" prop="createBy">
					<type-select v-model="formData.createBy" type="operation" clearable  />
				</el-form-item>
        <el-form-item :label="$t('receiveFms.sales_names')" prop="saleId">
          <base-select v-model="formData.saleId" type="sale"   filterable></base-select>
        </el-form-item>
        <el-form-item :label="$t('receiveFms.period')" prop="periodName">
					<el-input v-model="formData.periodName" type="text"  size="mini" clearable />
				</el-form-item>
        <el-form-item :label="$t('receiveFms.pushEmailStateName')" prop="pushEmailState" v-if="!pushEmailState">
					<fms-select v-model="formData.pushEmailState" type="pushEmailState" addAll  />
				</el-form-item>

        <el-form-item :label="$t('receiveFms.bill_date_estimate')" prop="billDateEstimatePeriod" v-if="type === 'AR'">
					<search-date-picker v-model="formData.billDateEstimatePeriod" @change="getList" clearable></search-date-picker>
				</el-form-item>
				<el-form-item :label="$t('receiveFms.bill_date_actual')" prop="billDateActualPeriod">
					<search-date-picker v-model="formData.billDateActualPeriod" @change="getList" clearable></search-date-picker>
				</el-form-item>
				<el-form-item :label="$t('receiveFms.confirm_date_estimate')" prop="confirmDateEstimatePeriod" v-if="type === 'AR'">
					<search-date-picker v-model="formData.confirmDateEstimatePeriod" @change="getList" clearable></search-date-picker>
				</el-form-item>
				<el-form-item :label="$t('receiveFms.confirm_date_actual')" prop="confirmDateActualPeriod">
					<search-date-picker v-model="formData.confirmDateActualPeriod" @change="getList" clearable></search-date-picker>
				</el-form-item>
			</el-form>
		</top-search-items-slot>
		<div class="">
			<div class="top-btn-wrap mb-10 mt-10">
				<el-button size="mini" type="primary" @click="applyOrHedgeClear(false)" v-if="!pushEmailState">{{$t('receiveFms.applyClear')}}</el-button>
        <el-button size="mini" type="primary" @click="receiveCleared()" v-if="type === 'AP'">{{$t('receiveFms.receive_cleared')}}</el-button>
        <el-button size="mini" type="primary" @click="applyPayment()" v-if="type === 'AP' && !pushEmailState">{{$t('receiveFms.applyPayment')}}</el-button>
        <el-button size="mini" type="primary" @click="sendBillAP()" v-if="type === 'AP'">{{$t('receiveFms.sendBill')}}</el-button>

        <el-popover placement="bottom" trigger="click" ref="popoverRef">
					<el-button slot="reference" size="mini" type="primary" @click="exportExcelCheck()" style="margin-left: 10px;">
            {{$t('receiveFms.export_excel')}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
					<template>
						<div v-for="item in exportTemplates" :key="item.code" style="margin-bottom: 6px;">
							<el-link type="primary" @click="exportExcel(item.code)">{{item.chineseName}}</el-link>
						</div>
					</template>
				</el-popover>
			</div>

			<ag-grid-vue-pro :data="dataList" :style-grid="gridHeight" :column-fields-default="columnFields" :grid-ready="onReady" :enabled="!pushEmailState"/>

			<div class="page-total" v-if="!pushEmailState">
        <span class="page-total-item">
          <span>{{type === 'AR' ? $t('receiveFms.receive_sum'): $t('payableFms.payable_sum')}}：</span>
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

			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList" />
		</div>

		<receive-invoice ref="receiveInvoiceRef" :info='selectedInvoiceInfo' type='BILL' @success="getList"></receive-invoice>
		<receive-cleard ref="receiveCleardRef" :info='selectedInvoiceInfo' type='BILL' @success="getList" :arap="type"></receive-cleard>
		<send-bill-dialog ref="sendBillDialogRef" :ids="selectedIds" :arap="type"></send-bill-dialog>
    <recall-bill-inner-confirm ref="recallBillInnerConfirmRef" @success="getList" :arap="type"></recall-bill-inner-confirm>
    <apply-payment-dialog ref="applyPaymentDialogRef" origin="BILL" toPath="FmsPayableApplyPayment"/>
	</div>
</template>

<script>
import payableTable from "./payableTable";
import { apBillExportMap } from "../components/constants";
import mixins from '@/views/financial/receiptBill/mixins'

export default {
	name: "FmsPayableBillComponent",
  mixins: [mixins],
	data() {
		return {

		};
	},
	created() {
		this.columnFields = payableTable;
    this.billExportMap = apBillExportMap;
	},
	methods: {

	}
};
</script>
<style lang="scss" scoped>
.right-main-wrapper {
	padding: 5px 20px;
	height: 100%;
	overflow: hidden;
}

.pagination-container {
	margin-top: 0px;
}
.fms-search-form {
  ::v-deep .el-input,
  ::v-deep .el-select {
     width: 207px;
  }
}

</style>
