<template>
  <div class="page-edit-container full-page" v-loading="loading">
    <div class="page-edit-content">
      <top-search-items-slot :searchFun="getList" :resetFun="reset" >
        <template slot="multipleSearch">
          <div class="multiple-no-wrap">
            <el-form ref="formDataRef" :inline="true" :model="formData" label-width="100px" size="mini">
              <el-form-item :label='$t("uexpressOrder.no")' prop="queryType" style="width: 100px;float: left; margin-right: 0px;"></el-form-item>
              <el-form-item label='' prop="search" class="multiple-no-item">
                <el-input v-model="formData.search" type="textarea" rows="3" size="mini" resize="none" clearable :placeholder="$t('uexpressOrder.noPlaceholder')" />
              </el-form-item>
              <el-form-item :label="$t('uexpressOrder.orderHandleState')" prop="orderHandleState">
                <el-select v-model="formData.orderHandleState">
                  <el-option :label="$t('common.ALL')" value="" />
                  <el-option v-for="item in statusList" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </template>
      </top-search-items-slot>

      <div class="">
        <div class="top-btn-wrap mb-10 mt-10">
          <el-button type="primary" size="mini" @click="repushFn" v-if="billImportState !== 230">{{ $t("uexpressOrder.repush") }}</el-button>
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
    </div>
    <div class="page-edit-footer">
      <el-button type="primary" size="mini" plain @click="backList()">{{ $t('common.close') }}</el-button>
    </div>
  </div>

</template>
<script>
import { getBillLastMileImportDetailApi, getBillLastMileOrderStateListApi, repushBillLastMileImportApi } from "@/api/uexpress/fmsBill"
import { parseTime, formatNumberToThousands } from '@/utils/index'
import OrderNoComponent from "@/views/uexpress/order/components/OrderNo";
import MemberOrderNoComponent from "@/views/uexpress/order/components/MemberOrderNo";
import OrderChannelNoComponent from "@/views/uexpress/order/components/OrderChannelNo";

export default {
	name: "UexpressFmsBillLastMileImportDetail",
  components: {
    OrderNoComponent,
    MemberOrderNoComponent,
    OrderChannelNoComponent
	},
	data() {
		return {
      billImportState: '',
			id: '',
			tableData: [],
			loading: false,
			pageSize: 50,
			pageNum: 1,
			total: '',

      statusList: [],
      formData: {
        search: '',
        orderHandleState: ''
      },

      gridHeight: {
        height: 'calc(100vh - 180px)'
      },
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
          headerName: this.$t("uexpressOrder.orderNo"),
          minWidth: 160,
          cellRendererFramework: "OrderNoComponent"
        },
        {
          field: "channelOrderNo",
          headerName: this.$t("uexpressOrder.orderChannelNo"),
          minWidth: 140,
          cellRendererFramework: "OrderChannelNoComponent"
        },
        {
          field: "memberOrderNo",
          headerName: this.$t("uexpressOrder.memberOrderNo"),
          minWidth: 160,
          cellRendererFramework: "MemberOrderNoComponent"
        },
        {
          field: "productTypeName",
          headerName: this.$t("uexpressOrder.business_type"),
          minWidth: 120
        },
        {
          field: "orderHandleStateName",
          headerName: this.$t("uexpressOrder.orderHandleState"),
          minWidth: 120
        },
        {
          field: "failReason",
          headerName: this.$t("uexpressOrder.failReason"),
          minWidth: 120
        },
        {
          field: "handleFailMessage",
          headerName: this.$t("uexpressOrder.handleFailMessage"),
          minWidth: 120
        },
        {
          field: "supplierProductName",
          headerName: this.$t("uexpressOrder.supplierProductName"),
          minWidth: 120
        },
        {
          field: "changeableWeight",
          headerName: this.$t("uexpressOrder.changeableWeight"),
          minWidth: 120
        },
        {
          field: "weightUnitType",
          headerName: this.$t("uexpressOrder.weightUnitType"),
          minWidth: 120
        },
        {
          field: "length",
          headerName: this.$t("uexpressOrder.length"),
          minWidth: 120
        },
        {
          field: "width",
          headerName: this.$t("uexpressOrder.width"),
          minWidth: 120
        },
        {
          field: "height",
          headerName: this.$t("uexpressOrder.height"),
          minWidth: 120
        },
        {
          field: "lengthUnitType",
          headerName: this.$t("uexpressOrder.sizeUnitType"),
          minWidth: 120
        },
        {
          field: "volume",
          headerName: this.$t("uexpressOrder.volume"),
          minWidth: 120
        },
        {
          field: "largeAmount",
          headerName: this.$t("uexpressOrder.largeAmount"),
          minWidth: 120,
          type: 'numericColumn'
        },
        {
          field: "returnAmount",
          headerName: this.$t("uexpressOrder.returnAmount"),
          minWidth: 120,
          type: 'numericColumn'
        },
        {
          field: "manualAmount",
          headerName: this.$t("uexpressOrder.manualAmount"),
          minWidth: 120,
          type: 'numericColumn'
        },
        {
          field: "currency",
          headerName: this.$t("uexpressOrder.currency"),
          minWidth: 120
        }
      ],
      gridApi: null,
      columnApi: null,
      gridOptions: {
        context: {
          componentParent: this
        },
        rowSelection: 'multiple', // 设置多行可选
        enableRangeSelection: true, // 启用范围选择
        rowMultiSelectWithClick: true, // 允许多行同时被选中 - checkbox可多选
        suppressRowClickSelection: true // 点击行不触发行选中 - 只选中当前单元格
      },
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false }
		}
	},
	created() {
		this.id = this.$route.query.id
    this.billImportState = Number(this.$route.query.billImportState)
		this.getList()
    this.init()
	},
	methods: {
    onReady(params) {
			this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
		},
    init() {
      getBillLastMileOrderStateListApi().then(res => {
        if (res.ok) {
          this.statusList = res.content
        }
      })
    },
    repushFn() {
      let data = {
        billImportLogId: this.id,
        arAp: 1
      }
      repushBillLastMileImportApi(data).then(res => {
        if (res.ok) {
          this.$message.success(this.$t('uexpressOrder.repushSuccess'))
        }
      })
    },
		getList() {
      const params = {
				...this.formData,
        billLogId: this.id,
				pageSize: this.pageSize,
				pageNum: this.pageNum
			}
			getBillLastMileImportDetailApi(params).then(res => {
				if (res.ok) {
          res.content.list.forEach(function (v, index) {
            v.importTime = parseTime(v.importTime, '{y}-{m}-{d} {h}:{i}:{s}')
            v.freightAmount = formatNumberToThousands(v.freightAmount)
            v.largeAmount = formatNumberToThousands(v.largeAmount)
            v.returnAmount = formatNumberToThousands(v.returnAmount)
            v.manualAmount = formatNumberToThousands(v.manualAmount)
            v.otherSurchargesAmount = formatNumberToThousands(v.otherSurchargesAmount)
          })
          this.total = parseInt(res.content.total, 10)
          this.dataList = res.content.list
        } else {
          this.total = 0
          this.dataList = []
        }
			})
		},
		backList() {
			this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: 'UexpressBillLastMileImport' })
		},
    reset() {
			this.$refs.formDataRef.resetFields()
			this.list()
		}
	}
}
</script>
<style lang="scss" scoped>
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
.page-edit-content {
  background: #fff;
}
::v-deep .search-wrap .search-box-wrap{
  display: block;
}
</style>

