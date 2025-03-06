<template>
	<div class="right-main-wrapper product-line-container" v-loading="loading">
     <el-tabs v-model="searchActiveName" class="top-tabs">
			<el-tab-pane :label='$t("uexpressOrder.otherSearch")' name="BASE_SEARCH"></el-tab-pane>
			<el-tab-pane :label='$t("uexpressOrder.noSearch")' name="NO_SEARCH"></el-tab-pane>
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

    <top-search-items-slot :searchFun="getList" :resetFun="reset" :visible="searchActiveName === 'BASE_SEARCH'">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formData" :inline="true" :model="formData" label-width="100px" size="mini" class="base-search">
            <el-form-item :label='$t("uexpressFmsCharge.billOrderStateName")' prop="billOrderState">
              <el-select v-model="formData.billOrderState">
                <el-option :label="$t('common.ALL')" value=""></el-option>
                <el-option v-for="item in billOrderStateList" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label='$t("uexpressFmsCharge.billName")' prop="billName">
              <el-input v-model="formData.billName" type="text" />
            </el-form-item>
            <el-form-item :label='$t("uexpressFmsCharge.diffFlag")' prop="diffFlag">
              <el-select v-model="formData.diffFlag">
                <el-option :label="$t('common.all')" value="" />
                <el-option :label="$t('common.falseText')" :value="false" />
                <el-option :label="$t('common.trueText')" :value="true" />
              </el-select>
            </el-form-item>
            <el-form-item :label='$t("uexpressFmsCharge.adjustFlag")' prop="adjustFlag">
              <el-select v-model="formData.adjustFlag">
                <el-option :label="$t('common.all')" value="" />
                <el-option :label="$t('common.falseText')" :value="false" />
                <el-option :label="$t('common.trueText')" :value="true" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>

    <div class="mt-20">
      <div class="top-btn-wrap mb-10 mt-10">
        <el-button type="primary" size="mini" @click="batchConfirmFn">{{ $t("uexpressFmsCharge.batchConfirm") }}</el-button>
        <el-button type="primary" size="mini" @click="exportDiffFn">{{ $t("uexpressFmsCharge.exportDiff") }}</el-button>
        <el-dropdown size="mini" @command="batchAdjustFn" style="margin-left: 10px;">
          <el-button type="primary" size="mini">{{$t("uexpressFmsCharge.batchAdjust")}}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="1">{{$t("uexpressFmsCharge.adjustCharge")}}</el-dropdown-item>
            <el-dropdown-item :command="2">{{$t("uexpressFmsCharge.adjustOrder")}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown size="mini" @command="exportDiffFn" style="margin-left: 10px;" v-if="false">
          <el-button type="primary" size="mini">{{$t("uexpressFmsCharge.exportDiff")}}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="1">{{$t("uexpressFmsCharge.diffCharge")}}</el-dropdown-item>
            <el-dropdown-item :command="2">{{$t("uexpressFmsCharge.diffOrder")}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
			</div>
			<ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs" :column-defs="columnFields" :row-data="dataList" :enable-col-resize="true" :enable-sorting="true" :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight" class="ag-theme-balham" />
			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList" />
		</div>

    <el-dialog :visible.sync="batchAdjustChargeVisible" :close-on-click-modal="false" width="500px" :title='$t("uexpressFmsCharge.adjustCharge")'>
      <el-form class="contact-form" ref="batchAdjustChargeRef" :model="batchAdjustChargeForm" :rules="batchAdjustChargeFormRule" label-width="100px" size="mini">
        <div style="text-align: center;margin-bottom: 20px;">
          <el-button size="mini" type="primary" icon="el-icon-download" @click="downloadTemplateFn(24)">{{$t("uexpressFmsCharge.adjustChargeTemplate")}}</el-button>
        </div>
        <el-form-item label='excel' prop="excelFile">
          <upload-file v-model="batchAdjustChargeForm.excelFile" accept=".xls,.xlsx" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="batchAdjustChargeVisible = false">{{ $t("common.cancel") }}</el-button>
        <el-button size="mini" type="primary" @click="batchAdjustChargeConfirmFn" :loading="batchAdjustChargeLoading">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="batchAdjustOrderVisible" :close-on-click-modal="false" width="500px" :title='$t("uexpressFmsCharge.adjustOrder")'>
      <el-form class="contact-form" ref="batchAdjustOrderRef" :model="batchAdjustOrderForm" :rules="batchAdjustOrderFormRule" label-width="100px" size="mini">
        <div style="text-align: center;margin-bottom: 20px;">
          <el-button size="mini" type="primary" icon="el-icon-download" @click="downloadTemplateFn(23)">{{$t("uexpressFmsCharge.adjustOrderTemplate")}}</el-button>
        </div>
        <el-form-item label='excel' prop="excelFile">
          <upload-file v-model="batchAdjustOrderForm.excelFile" accept=".xls,.xlsx" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="batchAdjustOrderVisible = false">{{ $t("common.cancel") }}</el-button>
        <el-button size="mini" type="primary" @click="batchAdjustOrderConfirmFn" :loading="batchAdjustOrderLoading">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>
	</div>
</template>

<script>
import {
  getPayableChargeListApi,
  getPayableChargeListByNosApi,
  batchAdjustChargeApi,
  batchAdjustOrderApi,
  batchConfirmChargeApi,
  confirmChargeApi,
  exportPayableChargeByIdsApi,
  exportPayableChargeByConditionsApi,
  exportPayableChargeByNosApi
 } from "@/api/uexpress/payableFmsCharge";
import { getDictListApi, getChargeCategoryListApi, getTemplateFileApi } from "@/api/uexpress/base";
import { AgGridVue } from "ag-grid-vue";
import OptionBtn from "./optionBtn";
import { parseTime, formatNumberToThousands } from "@/utils/index";

export default {
	name: "UExpressPayableFmsChargeList",
	components: {
		AgGridVue,
    OptionBtn
	},
	data() {
		return {
      searchActiveName: 'BASE_SEARCH',
			formData: {
        nos: '',
        billOrderState: '',
        billName: '',
        diffFlag: '',
        adjustFlag: ''
			},
			pageSize: 50,
			pageNum: 1,
			total: 0,
			dataList: [],
      billOrderStateList: [],
			columnFields: [{
        field: 'selected',
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
					field: "orderNo",
					headerName: this.$t("uexpressFmsCharge.orderNo"),
					minWidth: 160
				}, {
					field: "channelOrderNo",
					headerName: this.$t("uexpressFmsCharge.channelOrderNo"),
					minWidth: 120
				}, {
					field: "billOrderTypeName",
					headerName: this.$t("uexpressFmsCharge.billOrderTypeName"),
					minWidth: 100
				}, {
					field: "childProductTypeName",
					headerName: this.$t("uexpressFmsCharge.childProductTypeName"),
					minWidth: 100
				}, {
					field: "supplierName",
					headerName: this.$t("uexpressFmsCharge.supplierName"),
					minWidth: 150
				}, {
					field: "outboundTime",
					headerName: this.$t("uexpressFmsCharge.outboundTime"),
					minWidth: 150
				}, {
					field: "billName",
					headerName: this.$t("uexpressFmsCharge.billName"),
					minWidth: 130
				}, {
					field: "preWeight",
					headerName: this.$t("uexpressFmsCharge.preWeight"),
					minWidth: 120
				}, {
					field: "preDimensionDesc",
					headerName: this.$t("uexpressFmsCharge.preDimensionDesc"),
					minWidth: 120
				}, {
					field: "inboundWeight",
					headerName: this.$t("uexpressFmsCharge.inboundWeight"),
					minWidth: 120
				}, {
					field: "inboundDimensionDesc",
					headerName: this.$t("uexpressFmsCharge.inboundDimensionDesc"),
					minWidth: 120
				}, {
					field: "chargeDimensionDesc",
					headerName: this.$t("uexpressFmsCharge.chargeDimensionDesc"),
					minWidth: 120
				}, {
					field: "chargeWeight",
					headerName: this.$t("uexpressFmsCharge.chargeWeight"),
					minWidth: 120
				}, {
					field: "billWeight",
					headerName: this.$t("uexpressFmsCharge.billWeight"),
					minWidth: 130
				}, {
					field: "billDimensionDesc",
					headerName: this.$t("uexpressFmsCharge.billDimensionDesc"),
					minWidth: 130
				}, {
					field: "currency",
					headerName: this.$t("uexpressFmsCharge.currency"),
					minWidth: 110
				}, {
					field: "freightAmount",
					headerName: this.$t("uexpressFmsCharge.freightAmount"),
					minWidth: 110,
          type: 'numericColumn',
          cellRenderer: params => formatNumberToThousands(params.value)
				}, {
					field: "billFreightAmount",
					headerName: this.$t("uexpressFmsCharge.billFreightAmount"),
					minWidth: 110,
          type: 'numericColumn',
          cellRenderer: params => formatNumberToThousands(params.value)
				}, {
					field: "diffFreightAmount",
					headerName: this.$t("uexpressFmsCharge.diffFreightAmount"),
					minWidth: 110,
          type: 'numericColumn',
          cellRenderer: params => formatNumberToThousands(params.value)
				}, {
					field: "addOnAmount",
					headerName: this.$t("uexpressFmsCharge.addOnAmount"),
					minWidth: 110,
          type: 'numericColumn',
          cellRenderer: params => formatNumberToThousands(params.value)
				}, {
					field: "billAddOnAmount",
					headerName: this.$t("uexpressFmsCharge.billAddOnAmount"),
					minWidth: 120,
          type: 'numericColumn',
          cellRenderer: params => formatNumberToThousands(params.value)
				}, {
					field: "diffAddOnAmount",
					headerName: this.$t("uexpressFmsCharge.diffAddOnAmount"),
					minWidth: 120,
          type: 'numericColumn',
          cellRenderer: params => formatNumberToThousands(params.value)
				}, {
					field: "fuelAmount",
					headerName: this.$t("uexpressFmsCharge.fuelAmount"),
					minWidth: 110,
          type: 'numericColumn',
          cellRenderer: params => formatNumberToThousands(params.value)
				}, {
					field: "billFuelAmount",
					headerName: this.$t("uexpressFmsCharge.billFuelAmount"),
					minWidth: 120,
          type: 'numericColumn',
          cellRenderer: params => formatNumberToThousands(params.value)
				}, {
					field: "diffFuelAmount",
					headerName: this.$t("uexpressFmsCharge.diffFuelAmount"),
					minWidth: 120,
          type: 'numericColumn',
          cellRenderer: params => formatNumberToThousands(params.value)
				},  {
					field: "redeliveredAmount",
					headerName: this.$t("uexpressFmsCharge.redeliveredAmount"),
					minWidth: 110,
          type: 'numericColumn',
          cellRenderer: params => formatNumberToThousands(params.value)
				}, {
					field: "billRedeliveredAmount",
					headerName: this.$t("uexpressFmsCharge.billRedeliveredAmount"),
					minWidth: 120,
          type: 'numericColumn',
          cellRenderer: params => formatNumberToThousands(params.value)
				}, {
					field: "diffRedeliveredAmount",
					headerName: this.$t("uexpressFmsCharge.diffRedeliveredAmount"),
					minWidth: 120,
          type: 'numericColumn',
          cellRenderer: params => formatNumberToThousands(params.value)
				}, {
					field: "totalAmount",
					headerName: this.$t("uexpressFmsCharge.totalAmount"),
					minWidth: 120,
          type: 'numericColumn',
          cellRenderer: params => formatNumberToThousands(params.value)
				}, {
					field: "billTotalAmount",
					headerName: this.$t("uexpressFmsCharge.billTotalAmount"),
					minWidth: 120,
          type: 'numericColumn',
          cellRenderer: params => formatNumberToThousands(params.value)
				}, {
					field: "diffTotalAmount",
					headerName: this.$t("uexpressFmsCharge.diffTotalAmount"),
					minWidth: 150,
          type: 'numericColumn',
          cellRenderer: params => formatNumberToThousands(params.value)
				}, {
					field: "billOrderStateName",
					headerName: this.$t("uexpressFmsCharge.billOrderStateName"),
					minWidth: 100
				}, {
          field: "optionBtn",
          headerName: this.$t("uexpressFmsCharge.operation"),
          cellRendererFramework: "OptionBtn",
          pinned: 'right',
          minWidth: 150
        }],
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
			loading: false,

      // 批量调整-费用
      batchAdjustChargeVisible: false,
      batchAdjustChargeLoading: false,
      batchAdjustChargeForm: {
        excelFile: []
      },
      batchAdjustChargeFormRule: {
        excelFile: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      },

      // 批量调整-订单
      batchAdjustOrderVisible: false,
      batchAdjustOrderLoading: false,
      batchAdjustOrderForm: {
        excelFile: []
      },
      batchAdjustOrderFormRule: {
        excelFile: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      }
		};
	},
	created() {
		this.getList();
		this.getBaseDataFn();
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getDictListApi(42)]).then(results => {
				const stateRes = results[0];
        if (stateRes.ok) {
					this.billOrderStateList = stateRes.content;
				}
			});
		},
		onReady(params) {
			params.api.sizeColumnsToFit();
      this.gridApi = params.api
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
      if (this.searchActiveName === 'BASE_SEARCH') {
        params = {
          ...params,
          ...this.formData
        }
      } else {
        params.nos = this.formData.nos ? this.formData.nos.split(/,|，|\s+/) : []
      }
      return params
    },
		async getList() {
      this.dataList = [];
			let params = this.getParams()
      let fn = null
      if (this.searchActiveName === 'BASE_SEARCH') {
        fn = getPayableChargeListApi
      } else {
        fn = getPayableChargeListByNosApi
      }
      this.loading = true;
			const res = await fn(params);
			if (res.ok) {
				res.content.list.forEach(function (item, index) {
          item.index = index + 1
          item.outboundTime = parseTime(item.outboundTime, "{y}-{m}-{d} {h}:{i}:{s}")
				});
				this.total = parseInt(res.content.total, 10);
				this.dataList = res.content.list;
			} else {
				this.total = 0;
				this.dataList = [];
			}
			this.loading = false;
		},
    downloadTemplateFn(type) {
      getTemplateFileApi(type).then(res => {
        if (res.ok && res.content && res.content.url) {
          window.location.href = res.content.url
        }
      })
    },
    batchConfirmFn() {
      let ids = []
      let selRows = this.gridApi.getSelectedRows();
      if (selRows.length === 0) {
        this.$message.error(this.$t('uexpressFmsCharge.leastOne'))
        return
      }
      let VALID = true
      selRows.forEach(v => {
        ids.push({
          billOrderId: v.id,
          orderSk: v.orderSk
        })
        if (!v.billName) {
          VALID = false
        }
      })
      if (!VALID) {
        this.$message.error(this.$t('uexpressFmsCharge.batchConfirmError'))
        return
      }
      this.$confirm(this.$t('uexpressFmsCharge.batchConfirmInfo', { count: ids.length }), this.$t('common.mention'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.loading = true
        batchConfirmChargeApi({confirmOrderCmdList: ids}).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('uexpressFmsCharge.operSuccess'))
            this.getList()
          }
          this.loading = false
        })
      }).catch(() => {})
    },
    batchAdjustFn(type) {
      switch (type) {
        case 1:
          this.batchAdjustChargeFn()
          break;
        case 2:
          this.batchAdjustOrderFn()
          break;
        default:
          break;
      }
    },
    batchAdjustChargeFn() {
      this.batchAdjustChargeForm.excelFile = []
      this.batchAdjustChargeVisible = true
    },
    batchAdjustChargeConfirmFn() {
      this.$refs.batchAdjustChargeRef.validate(valid => {
        if (valid) {
          let data = {
            ...this.batchAdjustChargeForm
          }
          data.excelFile = data.excelFile[0]
          this.batchAdjustChargeLoading = true
          batchAdjustChargeApi(data).then(res => {
            if (res.ok) {
              this.batchAdjustChargeVisible = false
              this.$message.success(this.$t('uexpressFmsCharge.importOperSuccess'))
            }
            this.batchAdjustChargeLoading = false
          })
        }
      })
    },
    batchAdjustOrderFn() {
      this.batchAdjustOrderForm.excelFile = []
      this.batchAdjustOrderVisible = true
    },
    batchAdjustOrderConfirmFn() {
      this.$refs.batchAdjustOrderRef.validate(valid => {
        if (valid) {
          let data = {
            ...this.batchAdjustOrderForm
          }
          data.excelFile = data.excelFile[0]
          this.batchAdjustOrderLoading = true
          batchAdjustOrderApi(data).then(res => {
            if (res.ok) {
              this.batchAdjustOrderVisible = false
              this.$message.success(this.$t('uexpressFmsCharge.importOperSuccess'))
            }
            this.batchAdjustOrderLoading = false
          })
        }
      })
    },
    async exportDiffFn() {
      let ids = []
      let selRows = this.gridApi.getSelectedRows();
      let params = this.getParams()
      selRows.forEach(v => {
        ids.push({
          id: v.id,
          orderSk: v.orderSk
        })
      })
      let res = null
      if (ids.length) {
        res = await exportPayableChargeByIdsApi({orderIdList: ids})
      } else if (this.searchActiveName === 'NO_SEARCH') {
        res = await exportPayableChargeByNosApi({noList: params.nos})
      } else {
        res = await exportPayableChargeByConditionsApi(params)
      }
      if (res.ok) {
        this.$message.success(this.$t('uexpressFmsCharge.emportOperSuccess'))
      }
    },
    viewFn(row) {
      this.$router.push({
        name: 'UexpressPayableFmsChargeDetail',
        query: {
          id: row.id,
          orderSk: row.orderSk
        }
      })
    },
    confirmFn(row) {
      let data = {
        billOrderId: row.id,
        orderSk: row.orderSk
      }
      this.loading = true
      confirmChargeApi(data).then(res => {
        if (res.ok) {
          this.getList()
          this.$message.success(this.$t('uexpressFmsCharge.operSuccess'))
        }
        this.loading = false
      })
    },
    adjustFn(row) {
      this.$router.push({
        name: 'UexpressPayableFmsChargeAdjust',
        query: {
          id: row.id,
          orderSk: row.orderSk
        }
      })
    },
		reset() {
			this.$refs.formData.resetFields();
      this.$refs.formDataRef.resetFields();
			this.getList();
		}
	}
};
</script>
<style lang="scss" scoped>
.pagination-container {
	margin-top: 0px;
}
.base-search .el-input {
  width: 180px;
}
.right-main-wrapper {
  padding: 0 20px;
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
