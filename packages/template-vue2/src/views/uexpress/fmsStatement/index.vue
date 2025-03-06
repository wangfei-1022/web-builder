<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="list" :resetFun="reset">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formData"  :inline="true"  :model="formData"  label-width="100px" size="mini">
            <el-form-item :label="$t('uexpressFmsConfirmation.customer_name')" prop="memberId">
              <type-select v-model="formData.memberId" type="customer" :requestParams="{businessType: 'INTERNATIONAL_LINE'}"/>
            </el-form-item>
            <el-form-item :label="$t('uexpressFmsStatement.happeningTime')" prop="happeningTimePeriod">
              <search-date-picker v-model="formData.happeningTimePeriod" @change="list" clearable></search-date-picker>
            </el-form-item>
            <el-form-item :label="$t('uexpressFmsStatement.currency')" prop="currency">
              <base-select v-model="formData.currency" type="currency" addAll />
            </el-form-item>
            <el-form-item :label="$t('uexpressFmsStatement.arApName')" prop="arAp">
              <fms-select v-model="formData.arAp" type="payType" addAll />
            </el-form-item>
            <el-form-item :label="$t('uexpressFmsStatement.changeReasonName')" prop="changeReason">
              <fms-select v-model="formData.changeReason" type="accountLogType" addAll />
            </el-form-item>
            <el-form-item :label='$t("uexpressFmsStatement.businessNo")' prop="businessNo">
              <el-input v-model="formData.businessNo" type="text" size="mini" clearable @keyup.enter.native="list" />
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>
    <div class="">
      <div class="top-btn-wrap mb-10 mt-10">
        <el-button type="primary" size="mini" @click="exportFn">{{ $t("uexpressFmsStatement.export") }}</el-button>
      </div>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="userList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :pagination="false"
        :pagination-auto-page-size="false"
        :grid-ready="onReady"
        :style="gridHeight"
        class="ag-theme-balham"
      />
      <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="list"/>
    </div>

  </div>
</template>

<script>
import { getStatementListApi, exportStatementListApi } from "@/api/uexpress/fmsStatement"
import optionBtn from "./optionBtn"
import { AgGridVue } from "ag-grid-vue"
import { parseTime, formatNumberToThousands } from '@/utils/index'

export default {
	name: "UexpressFmsStatement",
	components: {
		AgGridVue,
		optionBtn
	},
	data() {
		return {
			formData: {
				memberId: '',
				businessType: '',
				createBy: '',
        happeningTimePeriod: []
			},
			pageSize: 50,
			pageNum: 1,
			total: 0,
			userList: [],
			columnFields: [{
				field: "index",
				headerName: this.$t("uexpressFmsStatement.indexNo"),
        minWidth: 80
			}, {
				field: "memberCode",
				headerName: this.$t("uexpressFmsStatement.memberCode"),
        minWidth: 100
			}, {
				field: "memberName",
				headerName: this.$t("uexpressFmsStatement.memberName"),
        minWidth: 150
			}, {
				field: "arApName",
				headerName: this.$t("uexpressFmsStatement.arApName"),
        minWidth: 100
			}, {
				field: "changeReasonName",
				headerName: this.$t("uexpressFmsStatement.changeReasonName"),
        minWidth: 100
			}, {
				field: "businessNo",
				headerName: this.$t("uexpressFmsStatement.businessNo"),
				minWidth: 150
			}, {
				field: "amount",
				headerName: this.$t("uexpressFmsStatement.amount"),
        type: 'numericColumn',
				minWidth: 100,
        cellRenderer: params => (params.data.arAp === 2 ? '-' : '+') + params.data.amount
			}, {
				field: "amountAvailable",
				headerName: this.$t("uexpressFmsStatement.amountAvailable"),
        type: 'numericColumn',
				minWidth: 100
			}, {
				field: "amountSum",
				headerName: this.$t("uexpressFmsStatement.amountSum"),
        type: 'numericColumn',
				minWidth: 100
			}, {
				field: "currency",
				headerName: this.$t("uexpressFmsStatement.currency"),
				minWidth: 80
			}, {
				field: "happeningTime",
				headerName: this.$t("uexpressFmsStatement.happeningTime"),
				minWidth: 150
			}, {
				field: "description",
				headerName: this.$t("uexpressFmsStatement.description"),
				minWidth: 150
			}],
			sideBarDefs: { toolPanels: ["columns", "filter"], visible: false },
			gridOptions: {
				rowSelection: "single", // 设置多行可选
				animateRows: true,
				suppressRowClickSelection: true, // 选中单元格后可以复制内容
				context: {
					componentParent: this
				}
			},
			loading: false,
			businessTypeList: []
		}
	},
	methods: {
		onReady(params) {
			this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
		},
    getParams() {
      const params = {
				...this.formData,
				pageSize: this.pageSize,
				pageNum: this.pageNum
			}
      if (this.formData.happeningTimePeriod.length) {
				params.happeningTimeStart = this.formData.happeningTimePeriod[0];
				params.happeningTimeEnd = this.formData.happeningTimePeriod[1];
			}
      return params
    },
		async list() {
			this.loading = true
      let params = this.getParams();
			const res = await getStatementListApi(params)
			if (res.ok) {
				res.content.list.forEach(function (v, index) {
          v.index = index + 1
					v.happeningTime = parseTime(v.happeningTime, '{y}-{m}-{d} {h}:{i}:{s}')
					v.amount = formatNumberToThousands(v.amount)
					v.amountAvailable = formatNumberToThousands(v.amountAvailable)
					v.amountSum = formatNumberToThousands(v.amountSum)
				})
				this.total = parseInt(res.content.total, 10)
				this.userList = res.content.list
			} else {
				this.total = 0
				this.userList = []
			}
			this.loading = false
		},
     exportFn(exportExcelType) {
      let params = this.getParams();
      this.loading = true
      exportStatementListApi(params).then(res => {
        if (res.ok) {
          window.location.href = res.content
        }
        this.loading = false
      })
    },
		reset() {
			this.$refs.formData.resetFields()
			this.list()
		}
	}
}
</script>
<style lang="scss" scoped>
.pagination-container {
	margin-top: 0px;
}
</style>
