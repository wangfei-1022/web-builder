
<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="getList" :resetFun="reset">
			<template slot="multipleSearch">
				<div class="multiple-form-wrap">
					<el-form ref="formData" :inline="true" :model="formData" label-width="100px" size="mini" >
						<el-form-item :label="$t('fmsProfit.profitApplyNo')" prop="profitApplyNo">
							<el-input v-model="formData.profitApplyNo" type="text" clearable @keyup.enter.native="getList" />
						</el-form-item>
            <el-form-item :label="$t('fmsProfit.orderNo')" prop="orderNo">
							<el-input v-model="formData.orderNo" type="text" clearable @keyup.enter.native="getList" />
						</el-form-item>
            <el-form-item :label="$t('fmsProfit.memberName')" prop="memberId">
							<type-select v-model="formData.memberId" type="member" @selected="getList" />
						</el-form-item>
						<el-form-item :label="$t('fmsProfit.sales')" prop="memberPrincipalId">
							<base-select v-model="formData.memberPrincipalId" type="sale" @selected="getList" filterable></base-select>
						</el-form-item>
            <el-form-item :label="$t('fmsProfit.businessType')" prop="businessType">
							<base-select v-model="formData.businessType" type="businessType"  @selected="getList" addAll></base-select>
						</el-form-item>
            <el-form-item :label="$t('fmsProfit.businessDate')" prop="businessDatePeriod">
							<search-date-picker v-model="formData.businessDatePeriod" @change="getList" clearable></search-date-picker>
						</el-form-item>
						<el-form-item :label="$t('fmsProfit.submitById')" prop="submitById">
							<base-select v-model="formData.submitById" type="user" filterable @selected="getList"></base-select>
						</el-form-item>
            <el-form-item :label="$t('fmsProfit.submitDate')" prop="submitDatePeriod">
							<search-date-picker v-model="formData.submitDatePeriod" @change="getList" clearable></search-date-picker>
						</el-form-item>
            <el-form-item :label="$t('fmsProfit.profitApplyTypeName')" prop="profitApplyType">
							<fms-select v-model="formData.profitApplyType" type="profitApplyType" @selected="getList" addAll />
						</el-form-item>
            <el-form-item :label="$t('fmsProfit.profitApplyStateName')" prop="profitApplyState">
							<fms-select v-model="formData.profitApplyState" type="profitApplyState" @selected="getList" addAll />
						</el-form-item>
            <el-form-item :label="$t('fmsProfit.profitPeriod')" prop="profitPeriod">
							<el-date-picker v-model="formData.profitPeriod" type="month" value-format="yyyyMM"></el-date-picker>
						</el-form-item>
					</el-form>
				</div>
			</template>
		</top-search-items-slot>
		<div class="">
			<div class="top-btn-wrap mb-10 mt-10">
        <el-button type="primary" @click="batchRecallFn" v-if="role === 'BUSINESS'" size="mini">{{$t('fmsProfit.batchRecall')}}</el-button>
        <el-button type="primary" @click="batchAgreeFn" v-if="role === 'SETTLEMENT'" size="mini">{{$t('fmsProfit.batchAgree')}}</el-button>
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

    <download-file-dialog ref="downloadFileDialogRef" />
    <batch-oper-dialog ref="batchOperDialogRef" @success="getList"/>
    <profit-apply-audit-dialog ref="profitApplyAuditDialogRef" batchable @audit="submitAuditEmit"/>
	</div>
</template>

<script>
import { getProfitApplyListApi } from "@/api/financial/fmsProfitApply";
import { getProfitAuditListApi } from "@/api/financial/fmsProfitAudit";
import ProfitApplyAuditDialog from "../components/ProfitApplyAuditDialog";
import mixins from '../mixins'

export default {
	name: "ReceiptClearListUn",
  mixins: [mixins],
  components: {
    ProfitApplyAuditDialog
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
          field: 'index',
          headerNameKey: '',
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
					field: "profitApplyNo",
					headerName: this.$t('fmsProfit.profitApplyNo'),
					minWidth: 140
				},
				{
					field: "orderNo",
					headerName: this.$t('fmsProfit.orderNo'),
					minWidth: 150
				},
				{
					field: "businessTypeName",
					headerName: this.$t('fmsProfit.businessType'),
					minWidth: 110
				},
				{
					field: "memberName",
					headerName: this.$t('fmsProfit.memberName'),
					minWidth: 180
				},
				{
					field: "businessDate",
					headerName: this.$t('fmsProfit.businessDate'),
					minWidth: 150
				},
				{
					field: "memberPrincipalName",
					headerName: this.$t('fmsProfit.sales'),
					minWidth: 110
				},
        {
					field: "totalAmountAr",
					headerName: this.$t('fmsProfit.totalAmountAr'),
					minWidth: 130
				},
        {
					field: "totalAmountAp",
					headerName: this.$t('fmsProfit.totalAmountAp'),
					minWidth: 130
				},
        {
					field: "totalAmountGrossProfit",
					headerName: this.$t('fmsProfit.totalAmountGrossProfit'),
					minWidth: 130
				},
        {
					field: "historyAmountProfitRate",
					headerName: this.$t('fmsProfit.historyAmountProfitRate'),
					minWidth: 130
				},
        {
					field: "orderAmountProfitRate",
					headerName: this.$t('fmsProfit.orderAmountProfitRate'),
					minWidth: 150
				},
        {
					field: "submitAmountProfitRate",
					headerName: this.$t('fmsProfit.submitAmountProfitRate'),
					minWidth: 150
				},
        {
					field: "profitApplyTypeName",
					headerName: this.$t('fmsProfit.profitApplyTypeName'),
					minWidth: 100
				},
        {
					field: "submitByName",
					headerName: this.$t('fmsProfit.submitById'),
					minWidth: 100
				},
        {
					field: "submitDate",
					headerName: this.$t('fmsProfit.submitDate'),
					minWidth: 150
				},
        {
					field: "confirmRemark",
					headerName: this.$t('fmsProfit.rejectReason'),
					minWidth: 130
				},
        {
					field: "confirmDate", // 盈亏时间
					headerName: this.$t('fmsProfit.confirmDate'),
					minWidth: 150
				},
        {
					field: "profitApplyStateName",
					headerName: this.$t('fmsProfit.profitApplyStateName'),
					minWidth: 100
				},
        {
					field: "profitPeriod", // 盈亏月份
					headerName: this.$t('fmsProfit.profitPeriod'),
					minWidth: 100
				},
				{
					field: "operation",
					headerName: this.$t("fmsProfit.operation"),
					cellRendererFramework: "OperationBtn",
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
			let fn = this.role === 'SETTLEMENT' ? getProfitAuditListApi : getProfitApplyListApi;
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
		}
	}
};
</script>
<style lang="scss" scoped>
.pagination-container {
	margin-top: 0px;
}
</style>
