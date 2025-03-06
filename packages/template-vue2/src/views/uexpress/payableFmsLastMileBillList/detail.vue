<template>
  <div class="page-edit-container full-page" v-loading="loading">
    <div class="page-edit-content">
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
        <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList" />
      </div>
    </div>
    <div class="page-edit-footer">
      <el-button type="primary" size="mini" plain @click="backList()">{{ $t('common.close') }}</el-button>
    </div>
  </div>

</template>
<script>
import { getBillLastMileListDetailApi } from "@/api/uexpress/payableFmsBill"
import { parseTime, formatNumberToThousands } from '@/utils/index'
import OrderNoComponent from "@/views/uexpress/order/components/OrderNo";
import MemberOrderNoComponent from "@/views/uexpress/order/components/MemberOrderNo";
import OrderChannelNoComponent from "@/views/uexpress/order/components/OrderChannelNo";

export default {
	name: "UexpressPayableFmsBillLastMileListDetail",
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
        height: 'calc(100vh - 300px)'
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
          field: "billingPeriod",
          headerName: this.$t("uexpressOrder.billingPeriod"),
          minWidth: 160
        },
        {
          field: "childProductTypeName",
          headerName: this.$t("uexpressOrder.business_type"),
          minWidth: 120
        },
        {
          field: "billOrderTypeName",
          headerName: this.$t("uexpressOrder.billOrderType"),
          minWidth: 120
        },
        {
          field: "chargeWeight",
          headerName: this.$t("uexpressOrder.changeableWeight"),
          minWidth: 120
        },
        {
          field: "weightUnitTypeName",
          headerName: this.$t("uexpressOrder.weightUnitType"),
          minWidth: 120
        },
        {
          field: "chargeDimensionDesc",
          headerName: this.$t("uexpressFmsCharge.chargeDimensionDesc"),
          minWidth: 120
        },
        {
          field: "lengthUnitTypeName",
          headerName: this.$t("uexpressOrder.sizeUnitType"),
          minWidth: 120
        },
        {
          field: "freightAmount",
          headerName: this.$t("uexpressOrder.freightAmount"),
          minWidth: 120,
          type: 'numericColumn'
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
          field: "otherSurchargesAmount",
          headerName: this.$t("uexpressOrder.otherAddOnAmount"),
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
	},
	methods: {
    onReady(params) {
			this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
		},
		getList() {
      const params = {
        billId: this.id,
				pageSize: this.pageSize,
				pageNum: this.pageNum
			}
			getBillLastMileListDetailApi(params).then(res => {
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
      this.$router.push({ name: 'UexpressPayableFmsBillLastMileList' })
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

