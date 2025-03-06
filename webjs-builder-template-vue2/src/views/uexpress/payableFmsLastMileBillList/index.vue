<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="getList" :resetFun="reset">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formData"  :inline="true"  :model="formData"  label-width="100px" size="mini">
            <el-form-item :label='$t("uexpressFmsBill.bill_name")' prop="billName">
              <el-input v-model="formData.billName" type="text" size="mini" clearable @keyup.enter.native="getList" />
            </el-form-item>
            <el-form-item :label="$t('uexpressFmsBill.supplierName')" prop="supplierId">
              <type-select v-model="formData.supplierId"  type="supplier" :requestParams="{partnerRole: '17011'}"/>
            </el-form-item>
            <el-form-item :label="$t('uexpressFmsBill.status')" prop="billState">
              <el-select v-model="formData.billState">
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

  </div>
</template>

<script>
import { getTemplateFileApi } from "@/api/uexpress/base"
import { getBillLastMileListApi, beginCheckBillLastMileApi, confirmBillLastMileApi, createBillLastMileApi } from "@/api/uexpress/payableFmsBill"
import optionBtn from "./optionBtn"
import { parseTime, formatNumberToThousands } from '@/utils/index'
import { getDictListApi, getChargeCategoryListApi } from "@/api/uexpress/base";

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
        billState: '',
				createBy: '',
        importTimePeriod: []
			},
      statusList: [],
			pageSize: 50,
			pageNum: 1,
			total: 0,
			userList: [],

			columnFields: [{
				field: "billName",
				headerName: this.$t("uexpressFmsBill.bill_name"),
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
				field: "billStateName",
				headerName: this.$t("uexpressFmsBill.status"),
				minWidth: 100
			}, {
				field: "createBillMessage",
				headerName: this.$t("uexpressFmsBill.createBillMessage"),
				minWidth: 140
			}, {
				field: "billOriginalAmountStr",
				headerName: this.$t("uexpressFmsBill.billOriginalAmount"),
				minWidth: 140,
        type: 'numericColumn'
			}, {
				field: "billAdjustAfterAmountStr",
				headerName: this.$t("uexpressFmsBill.billAdjustAfterAmount"),
				minWidth: 140,
        type: 'numericColumn'
			}, {
				field: "operation",
				headerName: this.$t("uexpressFmsBill.operation"),
				minWidth: 180,
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
		this.getList()
    getDictListApi(44).then(res => {
      if(res.ok) {
        this.statusList = res.content 
      }
    })
	},
	methods: {
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
        name: `UexpressPayableFmsBillLastMileListDetail`,
        query: {
          id: item.id,
          billState: item.billState
        }
      });
    },
    getParams() {
      const params = {
				...this.formData,
				pageSize: this.pageSize,
				pageNum: this.pageNum
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
			const res = await getBillLastMileListApi(params)
			if (res.ok) {
				res.content.list.forEach(function (item, index) {
          item.index = index + 1
					item.importTime = parseTime(item.importTime, '{y}-{m}-{d} {h}:{i}:{s}')
          item.billOriginalAmountStr = ''
          item.billOriginalAmount.forEach(v => {
						item.billOriginalAmountStr += formatNumberToThousands(v.value, false) + ' ' + v.currency
					})
          item.billAdjustAfterAmountStr = ''
          item.billAdjustAfterAmount.forEach(v => {
						item.billAdjustAfterAmountStr += formatNumberToThousands(v.value, false) + ' ' + v.currency
					})
				})
				this.total = parseInt(res.content.total, 10)
				this.userList = res.content.list
			} else {
				this.total = 0
				this.userList = []
			}
			this.loading = false
		},
    startFn(row) {
      this.$confirm(this.$t('uexpressFmsBill.startInfo'), this.$t('common.mention'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        beginCheckBillLastMileApi({billId: row.id}).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('uexpressFmsBill.operSuccess'))
            this.getList()
          }
        })
      }).catch(() => {})
    },
    confirmFn(row) {
      this.$confirm(this.$t('uexpressFmsBill.confirmInfo'), this.$t('common.mention'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.loading = true
        confirmBillLastMileApi({billId: row.id}).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('uexpressFmsBill.operSuccess'))
            this.getList()
          }
          this.loading = false
        })
      }).catch(() => {})
    },
    createBillFn(row) {
      this.$confirm(this.$t('uexpressFmsBill.createBillInfo'), this.$t('common.mention'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.loading = true
        createBillLastMileApi({billId: row.id}).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('uexpressFmsBill.operSuccess'))
            this.getList()
          }
          this.loading = false
        })
      }).catch(() => {})
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
