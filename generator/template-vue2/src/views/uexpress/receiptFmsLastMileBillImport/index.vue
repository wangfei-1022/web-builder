<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="getList" :resetFun="reset">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formData"  :inline="true"  :model="formData"  label-width="100px" size="mini">
            <el-form-item :label='$t("uexpressFmsBill.bill_name")' prop="billName">
              <el-input v-model="formData.billName" type="text" size="mini" clearable @keyup.enter.native="getList" />
            </el-form-item>
            <el-form-item :label="$t('uexpressFmsBill.productName')" prop="productCode">
              <uexpress-type-select v-model="formData.productCode" @selected="productSelected" type="productSales" filterable />
            </el-form-item>
            <el-form-item :label="$t('uexpressFmsBill.supplierName')" prop="supplierId">
              <type-select v-model="formData.supplierId"  type="supplier" :requestParams="{partnerRole: '17011'}"/>
            </el-form-item>
            <el-form-item :label="$t('uexpressFmsBill.status')" prop="billImportState">
              <el-select v-model="formData.billImportState">
                <el-option :label="$t('common.ALL')" value="" />
                <el-option v-for="item in statusList" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('uexpressFmsBill.importTime')" prop="importTimePeriod">
              <search-date-picker v-model="formData.importTimePeriod" @change="getList" clearable></search-date-picker>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>
    <div class="">
      <div class="top-btn-wrap mb-10 mt-10">
        <el-button type="primary" size="mini" @click="importFn">{{ $t("uexpressFmsBill.import") }}</el-button>
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
      <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList"/>
    </div>

    <el-dialog :visible.sync="batchImportVisible" :close-on-click-modal="false" width="500px" :title='$t("uexpressOrder.import")'>
      <el-form class="contact-form" ref="batchImportRef" :model="importForm" :rules="importFormRule" label-width="100px" size="mini">
        <div style="text-align: center;margin-bottom: 20px;">
          <el-button size="mini" type="primary" icon="el-icon-download" @click="downloadTemplateFn(19)">{{$t("uexpressOrder.importTemplate")}}</el-button>
        </div>
        <el-form-item :label="$t('uexpressFmsBill.productName')" prop="productCode">
          <uexpress-type-select v-model="importForm.productCode" type="productSales" filterable @selected="productImportSelected" />
        </el-form-item>
        <el-form-item :label="$t('uexpressFmsBill.supplierName')" prop="supplierId">
          <type-select v-model="importForm.supplierId"  type="supplier" :requestParams="{partnerRole: '17011'}"/>
        </el-form-item>
        <el-form-item label='excel' prop="billExcelFile">
          <upload-file v-model="importForm.billExcelFile" accept=".xls,.xlsx" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="batchImportVisible = false">{{ $t("common.cancel") }}</el-button>
        <el-button size="mini" type="primary" @click="batchImportConfirmFn" :loading="batchImportLoading">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getTemplateFileApi } from "@/api/uexpress/base"
import { getBillLastMileImportListApi, billLastMileImportOperApi, getBillLastMileStateListApi } from "@/api/uexpress/fmsBill"
import optionBtn from "./optionBtn"
import { parseTime, formatNumberToThousands } from '@/utils/index'

export default {
	name: "UexpressBillLastMileImport",
	components: {
		optionBtn
	},
	data() {
		return {
      selectItem: {},
			formData: {
				memberId: '',
        billName: '',
				businessType: '',
        billImportState: '',
				createBy: '',
        importTimePeriod: []
			},
      statusList: [],
			pageSize: 50,
			pageNum: 1,
			total: 0,
			userList: [],

      // 批量导入
      batchImportVisible: false,
      batchImportLoading: false,
      importForm: {
        id: '',
        supplierId: '',
        productId: '',
        productCode: '',
        billExcelFile: []
      },
      importFormRule: {
        supplierId: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        productCode: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        billExcelFile: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      },

			columnFields: [{
				field: "billName",
				headerName: this.$t("uexpressFmsBill.bill_name"),
        minWidth: 100
			}, {
				field: "productName",
				headerName: this.$t("uexpressFmsBill.productName"),
        minWidth: 150
			}, {
				field: "supplierName",
				headerName: this.$t("uexpressFmsBill.supplierName"),
        minWidth: 130
			}, {
				field: "importTime",
				headerName: this.$t("uexpressFmsBill.importTime"),
        minWidth: 150
			}, {
				field: "billImportStateName",
				headerName: this.$t("uexpressFmsBill.status"),
				minWidth: 100
			}, {
				field: "operation",
				headerName: this.$t("uexpressFmsBill.operation"),
				minWidth: 230,
        cellRendererFramework: "optionBtn",
        pinned: 'right'
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
	created() {
    this.init()
		this.getList()
	},
	methods: {
    init() {
      getBillLastMileStateListApi().then(res => {
        if (res.ok) {
          this.statusList = res.content
        }
      })
    },
    productSelected(item) {
      this.formData.productId = item.productId
      this.getList()
    },
    productImportSelected(item) {
      this.importForm.productId = item.productId
    },
		onReady(params) {
			this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
		},
    viewFn(item) {
      this.$router.push({
        name: `UexpressFmsBillLastMileImportDetail`,
        query: {
          id: item.id,
          billImportState: item.billImportState
        }
      });
    },
    getParams() {
      const params = {
				...this.formData,
				pageSize: this.pageSize,
				pageNum: this.pageNum,
        arAp: 1
			}
      if (this.formData.importTimePeriod.length) {
				params.importTimeStart = this.formData.importTimePeriod[0];
				params.importTimeEnd = this.formData.importTimePeriod[1];
			}
      return params
    },
		async getList() {
			this.loading = true
      let params = this.getParams();
			const res = await getBillLastMileImportListApi(params)
			if (res.ok) {
				res.content.list.forEach(function (v, index) {
          v.index = index + 1
					v.importTime = parseTime(v.importTime, '{y}-{m}-{d} {h}:{i}:{s}')
				})
				this.total = parseInt(res.content.total, 10)
				this.userList = res.content.list
			} else {
				this.total = 0
				this.userList = []
			}
			this.loading = false
		},
    downloadSourceFileFn(item) {
      if (item.sourceFileInfo && item.sourceFileInfo.url) {
        window.location.href = item.sourceFileInfo.url
      }
    },
    downloadResFileFn(item) {
      if (item.resultFileInfo && item.resultFileInfo.url) {
        window.location.href = item.resultFileInfo.url
      }
    },
    downloadTemplateFn(type) {
      getTemplateFileApi(type).then(res => {
        if (res.ok && res.content && res.content.url) {
          window.location.href = res.content.url
        }
      })
    },
    reImportFn(item) {
      this.selectItem = item
      this.importFn()
    },
    importFn() {
      this.importForm = {
        billExcelFile: []
      }
      this.batchImportVisible = true
    },
    batchImportConfirmFn() {
      this.$refs.batchImportRef.validate(valid => {
        if (valid) {
          let data = {
            ...this.importForm,
            arAp: 1
          }
          if (this.selectItem.id) {
            data.id = this.selectItem.id
          }
          data.billExcelFile = data.billExcelFile[0]
          this.batchImportLoading = true
          billLastMileImportOperApi(data).then(res => {
            if (res.ok) {
              this.getList()
              this.batchImportVisible = false
              this.$message.success(this.$t('uexpressFmsBill.importOperSuccess'))
            }
            this.batchImportLoading = false
          })
        }
      })
    },
		reset() {
			this.$refs.formData.resetFields()
			this.getList()
		}
	}
}
</script>
<style lang="scss" scoped>
.pagination-container {
	margin-top: 0px;
}
</style>
