
<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="getList" :resetFun="reset">
			<template slot="multipleSearch">
				<div class="multiple-form-wrap">
					<el-form ref="formData" :inline="true" :model="formData" label-width="100px" size="mini" >
						<el-form-item :label="$t('fmsPayablePayment.instructionNo')" prop="instructionNo">
							<el-input v-model="formData.instructionNo" type="text" clearable @keyup.enter.native="getList" />
						</el-form-item>
						<el-form-item :label="$t('fmsPayablePayment.businessType')" prop="businessType">
							<base-select v-model="formData.businessType" type="businessType"  @selected="getList" addAll></base-select>
						</el-form-item>
						<el-form-item :label="$t('fmsPayablePayment.settlementCompany')" prop="settlementCompanyId">
							<type-select v-model="formData.settlementCompanyId" type="settlementCompany" @selected="getList" />
						</el-form-item>
						<el-form-item :label="$t('fmsPayablePayment.settlementOffice')" prop="settlementOfficeId">
							<base-select v-model="formData.settlementOfficeId" type="settlementOffice" @selected="getList" addAll></base-select>
						</el-form-item>
						<el-form-item :label="$t('fmsPayablePayment.submitByName')" prop="submitById" >
							<type-select v-model="formData.submitById" type="user" @selected="getList" />
						</el-form-item>
						<el-form-item :label="$t('fmsPayablePayment.submitDate')" prop="submitDatePeriod">
							<search-date-picker v-model="formData.submitDatePeriod" @change="getList" clearable></search-date-picker>
						</el-form-item>
						<el-form-item :label="$t('fmsPayablePayment.paymentType')" prop="paymentType">
							<fms-select v-model="formData.paymentType" type="paymentType"  @selected="getList" addAll />
						</el-form-item>
            <el-form-item :label="$t('fmsPayablePayment.paymentDueDate')" prop="paymentDueDatePeriod">
							<search-date-picker v-model="formData.paymentDueDatePeriod" @change="getList" clearable></search-date-picker>
						</el-form-item>
            <el-form-item :label="$t('fmsPayablePayment.paymentApplyType')" prop="paymentApplyType">
							<fms-select v-model="formData.paymentApplyType" type="paymentApplyType"  @selected="getList" addAll />
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

      <page-total :applyPaymentTotal="applyPaymentTotal" :unPaymentTotal="unPaymentTotal" :applyClearTotal="applyClearTotal" :unClearTotal="unClearTotal" />
			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList" />

      <download-file-dialog ref="downloadFileDialogRef" />
    </div>
	</div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import { parseTime, formatNumberToThousands } from "@/utils/index";
import { getDictDataApi } from "@/api/financial/fmsReceive";
import ApprovalOperBtn from "../operationBtn";
import { getPayablePaymentApprovalRejectApi, getPayablePaymentApprovalRejectTotalApi } from "@/api/financial/fmsPayablePayment";
import mixins from '@/views/financial/payablePaymentApprovalList/list/mixins'

export default {
	name: "PayablePaymentApprovalRejectList",
  mixins: [mixins],
	components: {
		AgGridVue,
		ApprovalOperBtn
	},
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
			columnFields: [
				{
					field: "instructionNo",
					headerName: this.$t('fmsPayablePayment.instructionNo'),
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
					field: "paymentApplyTypeName",
					headerName: this.$t('fmsPayablePayment.paymentApplyType'),
					minWidth: 120
				},
				{
					field: "paymentDueDate",
					headerName: this.$t('fmsPayablePayment.paymentDueDate'),
					minWidth: 100
				},
				{
					field: "paymentTypeName",
					headerName: this.$t('fmsPayablePayment.paymentType'),
					minWidth: 100
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
					field: "settlementHandlerApprovalUserName",
					headerName: this.$t('fmsPayablePayment.settlementHandlerApprovalUserName'),
					minWidth: 100
				},
				{
					field: "settlementHandlerApprovalDate",
					headerName: this.$t('fmsPayablePayment.settlementHandlerApprovalDate'),
					minWidth: 150
				},
				{
					field: "currentApprovalLog.approvalTimeFormat",
					headerName: this.$t('fmsPayablePayment.rejectPayTime'),
					minWidth: 150
				},
				{
					field: "currentApprovalLog.approvalRemarks",
					headerName: this.$t('fmsPayablePayment.rejectPayRemark'),
					minWidth: 150
				},
				{
					field: "operation",
					headerName: this.$t("fmsPayablePayment.operation"),
					cellRendererFramework: "ApprovalOperBtn",
          minWidth: 100,
					pinned: "right"
				}
			]
		};
	},
	methods: {
		async getList() {
      let params = this.getParams()
			this.loading = true;
			getPayablePaymentApprovalRejectApi(params).then(res => {
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

      getPayablePaymentApprovalRejectTotalApi(params).then(res => {
        if (res.ok) {
          this.formatTotalRes(res)
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
