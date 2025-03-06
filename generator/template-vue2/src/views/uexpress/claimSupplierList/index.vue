<template>
	<div class="right-main-wrapper" v-loading="loading">
    <el-tabs v-model="searchActiveName" class="top-tabs">
			<el-tab-pane :label='$t("uexpressClaim.otherSearch")' name="BASE_SEARCH"></el-tab-pane>
			<el-tab-pane :label='$t("uexpressClaim.noSearch")' name="NO_SEARCH"></el-tab-pane>
		</el-tabs>

    <top-search-items-slot :searchFun="getList" :resetFun="reset" :visible="searchActiveName === 'NO_SEARCH'">
      <template slot="multipleSearch">
        <div class="multiple-no-wrap">
          <el-form ref="formDataRef" :inline="true" :model="formData" label-width="100px" size="mini">
            <el-form-item :label='$t("uexpressOrder.no")' prop="queryType" style="width: 100px;float: left;"></el-form-item>
            <el-form-item label='' prop="nos" class="multiple-no-item">
              <el-input v-model="formData.nos" type="textarea" rows="3" size="mini" resize="none" clearable :placeholder="$t('uexpressOrder.noPlaceholder')" />
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>

		<top-search-items-slot :searchFun="getList" :resetFun="reset" v-if="searchActiveName === 'BASE_SEARCH'">
			<template slot="multipleSearch">
				<div class="multiple-form-wrap">
					<el-form ref="formData" :inline="true" :model="formData" label-width="100px">
						<el-form-item :label='$t("uexpressClaim.chancel_order_no")' prop="chancelOrderNo">
							<el-input v-model="formData.chancelOrderNo" type="text" size="mini"  clearable @keyup.enter.native="getList"></el-input>
						</el-form-item>
            <el-form-item :label='$t("uexpressClaim.sales_order_no")' prop="salesOrderNo">
							<el-input v-model="formData.salesOrderNo" type="text" size="mini"  clearable @keyup.enter.native="getList"></el-input>
						</el-form-item>
            <el-form-item :label='$t("uexpressClaim.import_claim_date")' prop="importClaimDatePeriod">
              <search-date-picker v-model="formData.importClaimDatePeriod" @change="getList" clearable></search-date-picker>
            </el-form-item>
						<el-form-item :label='$t("uexpressClaim.state")' prop="claimState">
							<el-select v-model="formData.claimState" size="mini" @change="getList">
								<el-option :label="$t('common.ALL')" value="" />
								<el-option v-for="(item, index) in claimStateList" :key="index" :label="item.name" :value="item.code" />
							</el-select>
            </el-form-item>
            <el-form-item :label='$t("uexpressClaim.customer")' prop="customerId">
							<type-select v-model="formData.customerId" type="customer" @selected="getList" :requestParams="{businessType: 'INTERNATIONAL_LINE'}"></type-select>
						</el-form-item>
            <el-form-item :label='$t("uexpressClaim.claim_date")' prop="claimDatePeriod">
              <search-date-picker v-model="formData.claimDatePeriod" @change="getList" clearable></search-date-picker>
            </el-form-item>
            <el-form-item :label='$t("uexpressClaim.claim_reason")' prop="claimReason">
              <el-select v-model="formData.claimReason" size="mini" @change="getList">
								<el-option :label="$t('common.ALL')" value="" />
								<el-option v-for="(item, index) in claimReasonList" :key="index" :label="item.name" :value="item.code" />
							</el-select>
            </el-form-item>
					</el-form>
				</div>
			</template>
		</top-search-items-slot>

		<div class="">
			<div class="top-btn-wrap mb-10 mt-10">
        <el-button type="primary" size="mini" @click="batchImportFn">{{$t("uexpressClaim.batch_import")}}</el-button>
        <el-button type="primary" size="mini" @click="exportFn">{{$t("uexpressClaim.export")}}</el-button>
			</div>
			<ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs" :column-defs="columnFields" :row-data="dataList" :enable-col-resize="true" :enable-sorting="true" :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight" class="ag-theme-balham" />
			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList" />
		</div>

    <el-dialog :visible.sync="batchImportVisible" :close-on-click-modal="false" width="500px" :title='$t("uexpressClaim.supplier_batch_import_claim")'>
      <el-form class="contact-form" ref="batchImportRef" :model="importForm" :rules="importFormRule" label-width="100px" size="mini">
        <div style="text-align: center;margin-bottom: 20px;">
          <el-button size="mini" type="primary" icon="el-icon-download" @click="downloadTemplateFn">{{$t("uexpressClaim.supplier_claim_import_template")}}</el-button>
        </div>
        <el-form-item label='excel' prop="claimFile">
          <upload-file v-model="importForm.claimFile" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="batchImportVisible = false">{{ $t("common.cancel") }}</el-button>
        <el-button size="mini" type="primary" @click="batchImportConfirmFn">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>
	</div>
</template>

<script>
import {
  getClaimSupplierListApi,
  getClaimSupplierListByNosApi,
  importClaimSupplierApi,
  claimSupplierExportByIdsApi,
  claimSupplierExportByConditionsApi,
  claimSupplierExportByNosApi
} from "@/api/uexpress/claimSupplierList";
import { getDictListApi, getTemplateFileApi } from "@/api/uexpress/base";
import { AgGridVue } from "ag-grid-vue";
import { parseTime, formatNumberToThousands, addFloatNum } from "@/utils/index";
import OrderNoComponent from "@/views/uexpress/order/components/OrderNo";
import MemberOrderNoComponent from "@/views/uexpress/order/components/MemberOrderNo";
import OrderChannelNoComponent from "@/views/uexpress/order/components/OrderChannelNo";

export default {
	name: "UExpressClaimSupplierList",
	components: {
		AgGridVue,
    OrderNoComponent,
    MemberOrderNoComponent,
    OrderChannelNoComponent
	},
	data() {
		return {
      searchActiveName: 'BASE_SEARCH',
			formData: {
        customerId: '',
        salesOrderNo: '',
        chancelOrderNo: '',
        claimDatePeriod: [],
        importClaimDatePeriod: [],
        claimState: '',
        claimReason: ''
			},
			claimReasonList: [],
      claimStateList: [],
			pageSize: 50,
			pageNum: 1,
			total: 0,
			dataList: [],
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
					field: "salesOrderNo",
					headerName: this.$t("uexpressClaim.sales_order_no"),
					minWidth: 150,
          cellRendererFramework: "OrderNoComponent"
				},
				{
					field: "chancelOrderNo",
					headerName: this.$t("uexpressClaim.chancel_order_no"),
					minWidth: 150,
          cellRendererFramework: "OrderChannelNoComponent"
				},
				{
					field: "supplierName",
					headerName: this.$t("uexpressClaim.owner_supplier"),
					minWidth: 150
				},
				{
					field: "customerName",
					headerName: this.$t("uexpressClaim.customer_name"),
					minWidth: 150
				},
				{
					field: "claimStateName",
					headerName: this.$t("uexpressClaim.state"),
					minWidth: 100
				},
				{
					field: "applyClaimDate",
					headerName: this.$t("uexpressClaim.apply_claim_time"),
					minWidth: 150
				},
				{
					field: "claimDate",
					headerName: this.$t("uexpressClaim.claim_time"),
					minWidth: 150
				},
				{
					field: "claimReasonName",
					headerName: this.$t("uexpressClaim.claim_reason"),
					minWidth: 100
				},
				{
					field: "applyClaimAmounts",
					headerName: this.$t("uexpressClaim.apply_claim_amount"),
					minWidth: 100,
          cellRenderer: params => {
            let str = ''
            params.data.applyClaimAmounts.forEach(v => {
              str += formatNumberToThousands(v.value) + v.currency + ' '
            })
            return str
          }
				},
				{
					field: "claimAmounts",
					headerName: this.$t("uexpressClaim.claim_amount"),
					minWidth: 100,
          cellRenderer: params => {
            let str = ''
            params.data.claimAmounts.forEach(v => {
              str += formatNumberToThousands(v.value) + v.currency + ' '
            })
            return str
          }
				},
				{
					field: "remarks",
					headerName: this.$t("uexpressClaim.remarks"),
					minWidth: 100
				}
			],
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
      gridApi: {},

      // 批量导入
      batchImportVisible: false,
      importForm: {
        claimFile: []
      },
      importFormRule: {
        claimFile: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      }
		};
	},
	created() {
		this.getList();
		this.getBaseDataFn();
	},
	methods: {
    downloadTemplateFn() {
      getTemplateFileApi(2).then(res => {
        if (res.ok && res.content && res.content.url) {
          window.location.href = res.content.url
        }
      })
    },
		getBaseDataFn() {
			Promise.all([getDictListApi(20), getDictListApi(24)]).then(results => {
				const claimReasonRes = results[0];
        const claimStateRes = results[1];
				if (claimReasonRes.ok) {
					this.claimReasonList = claimReasonRes.content;
				}
				if (claimStateRes.ok) {
					this.claimStateList = claimStateRes.content;
				}
			});
		},

		onReady(params) {
      this.gridApi = params.api
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
          ...params,
          ...this.formData
        }
        if (this.formData.claimDatePeriod.length) {
          params.claimDateStart = this.formData.claimDatePeriod[0] || "";
          params.claimDateEnd = this.formData.claimDatePeriod[1] || "";
        }
        if (this.formData.importClaimDatePeriod.length) {
          params.applyClaimDateStart = this.formData.importClaimDatePeriod[0] || "";
          params.applyClaimDateEnd = this.formData.importClaimDatePeriod[1] || "";
        }
        delete params.claimDatePeriod
        delete params.importClaimDatePeriod
      }
      return params
    },
		async getList() {
			this.loading = true;
			const params = this.getParams()
      let fn = this.searchActiveName === 'NO_SEARCH' ? getClaimSupplierListByNosApi : getClaimSupplierListApi
			const res = await fn(params);
			if (res.ok) {
				res.content.list.forEach(function (v) {

        v.claimDate = parseTime(v.claimDate, "{y}-{m}-{d} {h}:{i}:{s}");
					v.acceptTime = parseTime(v.acceptTime, "{y}-{m}-{d} {h}:{i}:{s}");
					v.applyClaimDate = parseTime(v.applyClaimDate, "{y}-{m}-{d} {h}:{i}:{s}");
				});
				this.total = parseInt(res.content.total, 10);
				this.dataList = res.content.list;
			} else {
				this.total = 0;
				this.dataList = [];
			}
			this.loading = false;
		},
    batchImportFn() {
      this.batchImportVisible = true
    },
    batchImportConfirmFn() {
      this.$refs.batchImportRef.validate(valid => {
        if (valid) {
          let data = {
            ...this.importForm
          }
          data.claimFile = data.claimFile[0]
          importClaimSupplierApi(data).then(res => {
            if (res.ok) {
              this.batchImportVisible = false
              this.$message.success(this.$t("uexpressClaim.supplier_batch_import_success"))
            }
          })
        }
      })
    },
    exportFn() {
      let fn = null
      let arr = this.gridApi.getSelectedRows()
      let params = this.getParams()
      if (arr.length > 0) {
        fn = claimSupplierExportByIdsApi
        let ids = []
        arr.forEach(v => {
          ids.push({
            id: v.id,
            claimShardingKey: v.shardingKey
          })
        })
        params = {
          claimIdDtos: ids
        }
      } else if (this.searchActiveName === 'NO_SEARCH') {
        fn = claimSupplierExportByNosApi
      } else if (this.searchActiveName === 'BASE_SEARCH') {
        fn = claimSupplierExportByConditionsApi
      }
      fn(params).then(res => {
        if (res.ok) {
          this.$message.success(this.$t("uexpressOrder.exportSuccess"));
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
.pagination-container {
	margin-top: 0px;
}
.right-main-wrapper {
	overflow: auto;
	padding: 0px 20px 0 20px;
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
