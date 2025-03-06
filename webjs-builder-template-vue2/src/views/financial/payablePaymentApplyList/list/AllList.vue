
<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="getList" :resetFun="reset">
			<template slot="multipleSearch">
				<div class="multiple-form-wrap">
					<el-form ref="formData" :inline="true" :model="formData" label-width="100px" size="mini" >
						<el-form-item :label="$t('fmsPayablePayment.instructionNo')" prop="instructionNo">
							<el-input v-model="formData.instructionNo" type="text" clearable @keyup.enter.native="getList" />
						</el-form-item>
						<el-form-item :label="$t('fmsPayablePayment.transactionsNo')" prop="transactionsNo">
							<el-input v-model="formData.transactionsNo" type="text" clearable @keyup.enter.native="getList" />
						</el-form-item>
						<el-form-item :label="$t('fmsPayablePayment.businessType')" prop="businessType">
							<base-select v-model="formData.businessType" type="businessType"  @selected="getList" addAll></base-select>
						</el-form-item>
						<el-form-item :label="$t('fmsPayablePayment.settlementCompany')" prop="settlementCompanyId">
							<type-select v-model="formData.settlementCompanyId" type="member" @selected="getList" />
						</el-form-item>
						<el-form-item :label="$t('fmsPayablePayment.settlementOffice')" prop="settlementOfficeId">
							<base-select v-model="formData.settlementOfficeId" type="settlementOffice" @selected="getList" addAll></base-select>
						</el-form-item>
						<el-form-item :label="$t('fmsPayablePayment.submitByName')" prop="submitById" v-if="role === 'BUSINESS'">
							<type-select v-model="formData.submitById" type="user" @selected="getList" />
						</el-form-item>
						<el-form-item :label="$t('fmsPayablePayment.submitDate')" prop="submitDatePeriod" v-if="role === 'BUSINESS'">
							<search-date-picker v-model="formData.submitDatePeriod" @change="getList" clearable></search-date-picker>
						</el-form-item>
						<el-form-item :label="$t('fmsPayablePayment.paymentState')" prop="paymentState">
							<fms-select v-model="formData.paymentState" type="paymentState"  @selected="getList" addAll />
						</el-form-item>
						<el-form-item :label="$t('fmsPayablePayment.paymentType')" prop="paymentType">
							<fms-select v-model="formData.paymentType" type="paymentType"  @selected="getList" addAll />
						</el-form-item>
            <el-form-item :label="$t('fmsPayablePayment.paymentDueDate')" prop="paymentDueDatePeriod">
							<search-date-picker v-model="formData.paymentDueDatePeriod" @change="getList" clearable></search-date-picker>
						</el-form-item>
						<el-form-item :label="$t('fmsPayablePayment.localServicePaymentType')" prop="localServicePaymentTypes">
							<fms-select v-model="formData.localServicePaymentTypes" type="localServicePaymentType"  @selected="getList" multiple collapse-tags />
						</el-form-item>
					</el-form>
				</div>
			</template>
		</top-search-items-slot>
		<div class="">
			<div class="top-btn-wrap mb-10 mt-10">
        <el-button size="mini" type="primary" @click="batchDownloadFn" v-if="role === 'FINANCE'">{{$t('fmsPayablePayment.download')}}</el-button>
        <el-button size="mini" type="primary" @click="recalForRepushFn" v-permission="['fms:manage:payable:payment:apply:list:repush']" v-if="role === 'FINANCE'">{{$t('fmsPayablePayment.recalForRepush')}}</el-button>
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
      <div class="page-total">
        <span class="page-total-item">
          <span>{{$t('fmsPayablePayment.applyPaymentTotal')}}：</span>
          <span>
            <span class="value-item" v-for="(item, index) in applyPaymentTotal" :key='index'>
              <span class='value'>{{item.currency}}</span>
              <span>{{item.value | numberToThousands}}</span>
            </span>
          </span>
        </span>

        <span class="page-total-item">
					<span>{{$t('fmsPayablePayment.unPaymentTotal')}}：</span>
					<span>
						<span class="value-item" v-for="(item, index) in unPaymentTotal" :key='index'>
							<span class='value'>{{item.currency}}</span>
							<span>{{item.value | numberToThousands}}</span>
						</span>
					</span>
				</span>
			</div>
			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList" />
		</div>

    <download-file-dialog ref="downloadFileDialogRef" />
    <batch-download-file-dialog ref="batchDownloadFileDialogRef" />
	</div>
</template>

<script>
import { getApplyClearListApi, getApplyClearListToclearApi, receiptApplyClearCancelApi } from "@/api/financial/fmsReceiptClear";
import { parseTime, formatNumberToThousands } from "@/utils/index";
import { getDictDataApi } from "@/api/financial/fmsReceive";
import {
  getPayablePaymentAllFinanceApi,
  getPayablePaymentAllApplyApi,
  getPayablePaymentAllFinanceTotalApi,
  getPayablePaymentAllApplyTotalApi
} from "@/api/financial/fmsPayablePayment";
import mixins from './mixins'

export default {
	name: "ReceiptClearListUn",
  mixins: [mixins],
	props: {
		role: {
			type: String,
			default: ""
		},
		origin: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
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
        },
				{
					field: "instructionNo",
					headerName: this.$t('fmsPayablePayment.instructionNo'),
					minWidth: 150
				},
				{
					field: "transactionsNo",
					headerName: this.$t('fmsPayablePayment.transactionsNo'),
					minWidth: 150
				},
				{
					field: "businessTypeNames",
					headerName: this.$t('fmsPayablePayment.businessType'),
					minWidth: 100,
					cellRenderer: params => params.value.join(" 、")
				},
				{
					field: "settlementCompanyName",
					headerName: this.$t('fmsPayablePayment.settlementCompanyName'),
					minWidth: 200
				},
				{
					field: "settlementOfficeName",
					headerName: this.$t('fmsPayablePayment.settlementOfficeName'),
					minWidth: 200
				},
				{
					field: "localServicePaymentTypeName",
					headerName: this.$t('fmsPayablePayment.localServicePaymentType'),
					minWidth: 200
				},
        {
					field: "applyCurrencyAmountGroupStr",
					headerName: this.$t('fmsPayablePayment.applyCurrencyAmountGroupStr'),
					minWidth: 130
				},
        {
					field: "unpayCurrencyAmountGroupStr",
					headerName: this.$t('fmsPayablePayment.unpayCurrencyAmountGroupStr'),
					minWidth: 130
				},
        {
					field: "payCurrencyAmountGroupStr",
					headerName: this.$t('fmsPayablePayment.payCurrencyAmountGroupStr'),
					minWidth: 130
				},
				{
					field: "paymentDueDate",
					headerName: this.$t('fmsPayablePayment.paymentDueDate'),
					minWidth: 150
				},
				{
					field: "paymentTypeName",
					headerName: this.$t('fmsPayablePayment.paymentType'),
					minWidth: 100
				},
				{
					field: "paymentStateName",
					headerName: this.$t('fmsPayablePayment.paymentState'),
					minWidth: 130
				},
				{
					field: "paymentDesc",
					headerName: this.$t('fmsPayablePayment.paymentDesc'),
					minWidth: 100
				},
				{
					field: "submitByName",
					headerName: this.$t('fmsPayablePayment.submitByName'),
					minWidth: 100
				},
				{
					field: "submitDate",
					headerName: this.$t('fmsPayablePayment.submitDate'),
					minWidth: 150
				},
				{
					field: "operation",
					headerName: this.$t("fmsPayablePayment.operation"),
					cellRendererFramework: "OperationBtn",
          minWidth: 160,
					pinned: "right"
				}
			]
		};
	},
	methods: {
		async getList() {
      let params = this.getParams()
			this.loading = true;
			let fn = this.role === 'FINANCE' ? getPayablePaymentAllFinanceApi : getPayablePaymentAllApplyApi;
			fn(params).then(res => {
        if (res.ok) {
          let arr = this.formDataList(res.content.list)
          this.total = parseInt(res.content.total, 10);
          this.dataList = arr;
        } else {
          this.total = 0;
          this.dataList = [];
        }
        this.loading = false;
      });
			let totalFn = this.role === 'FINANCE' ? getPayablePaymentAllFinanceTotalApi : getPayablePaymentAllApplyTotalApi
      totalFn(params).then(res => {
        if (res.ok) {
          res.content.forEach(v => {
            if (v.amountName === 'applyPayAmount') {
              this.applyPaymentTotal = v.amounts
            }
            if (v.amountName === 'unPayAmount') {
              this.unPaymentTotal = v.amounts
            }
          })
        }
      });
		}
	}
};
</script>
<style lang="scss" scoped>
.pagination-container {
	margin-top: 0px;
}
.record-container {
	.title {
		font-size: 18px;
		margin-bottom: 20px;
		font-weight: 600;
		padding-bottom: 12px;
		border-bottom: 1px solid #eee;
	}
	.record-container-content {
		overflow: hidden;
		.record-item {
			float: left;
			width: 50%;
			margin-bottom: 15px;
			display: flex;

			label {
				width: 120px;
				min-width: 120px;
				display: block;
				text-align: right;
				margin-bottom: 15px;
				font-weight: 500;
				font-size: 14px;
				float: left;
				margin-right: 6px;
			}
			span {
				font-weight: 500;
				font-size: 14px;
				display: inline;
				flex: 1;
			}
		}
	}
}
</style>
