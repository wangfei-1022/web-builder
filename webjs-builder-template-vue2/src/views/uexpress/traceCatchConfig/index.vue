<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="list" :resetFun="reset">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
            <el-form-item :label='$t("uexpressTrace.supplierName")' prop="supplierId">
              <type-select
                v-model="formData.supplierId"
                type="supplier"
                :requestParams="{partnerRole: 17011}" >
              </type-select>
            </el-form-item>
            <el-form-item :label='$t("uexpressTrace.channelCode")' prop="channelCode">
              <uexpress-type-select type="traceChannel" v-model="formData.channelCode" clearable filterable />
            </el-form-item>
            <el-form-item :label='$t("uexpressTrace.customerName")' prop="customerId">
              <type-select v-model="formData.customerId" type="customer" />
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>
    <div class="">
      <div class="top-btn-wrap mb-10 mt-10">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="createTrace">{{$t("common.addBtn")}}</el-button>
      </div>
      <ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs" :column-defs="columnFields" :row-data="dataList" :enable-col-resize="true" :enable-sorting="true" :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight" class="ag-theme-balham" />
      <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="list" />
    </div>
    <modify-dialog ref="modifyCatch" :visible.sync="showModifyDialog" :loading.sync="loading" @refreshData="list" />
  </div>
</template>

<script>
import { getTraceCatchApi } from "@/api/uexpress/traceLine"
import { AgGridVue } from "ag-grid-vue"
import OptionBtn from "./OptionBtn"
import ModifyDialog from "./ModifyDialog"

export default {
  name: "TraceCatchConfig",
  components: {
    AgGridVue,
    OptionBtn,
    ModifyDialog
  },
  data() {
    return {
      formData: {
        supplierId: null,
        channelCode: null,
        customerId: null
      },
      pageSize: 50,
      pageNum: 1,
      total: 0,
      dataList: [],
      columnFields: [],
      sideBarDefs: { toolPanels: ["columns", "filter"], visible: false },
      gridOptions: {
        rowSelection: "multiple", // 设置多行可选
        animateRows: true,
        suppressRowClickSelection: true, // 选中单元格后可以复制内容
        context: {
          componentParent: this
        }
      },
      showModifyDialog: false,
      loading: false
    }
  },
  created() {
    this.columnFields = [
      {
        field: 'routeId',
        headerName: this.$t("uexpressTrace.seqNo"),
        minWidth: 80,
        cellRenderer: params => params.node ? Number(params.node.rowIndex) + 1 : ''
      },
      {
        field: "supplierName",
        headerName: this.$t("uexpressTrace.deliverySupplier"),
        minWidth: 200
      },
      {
        field: "productDtos",
        headerName: this.$t("uexpressTrace.productOfSupplier"),
        minWidth: 200,
        cellRenderer: params => {
          let str = ''
          if (params.value && params.value.length > 0) {
            params.value.map(item => {
              str += item.productName + ',\r'
            })
          }
          return str
        }
      },
      {
        field: "customers",
        headerName: this.$t("uexpressTrace.customerName"),
        minWidth: 200,
        cellRenderer: params => {
          let str = ''
          if (params.value && params.value.length > 0) {
            params.value.map(item => {
              str += item.memberName + ',\r'
            })
          }
          return str
        }
      },
      {
        field: "channelCode",
        headerName: this.$t("uexpressTrace.channelCode"),
        minWidth: 200
      },
      {
        field: "channelName",
        headerName: this.$t("uexpressTrace.channelName"),
        minWidth: 200
      },
      {
        field: "remarks",
        headerName: this.$t("common.remark"),
        minWidth: 300
      },
      {
        field: "updateTime",
        headerName: this.$t("uexpressTrace.updateTime"),
        minWidth: 300,
        cellRenderer: params => params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss') : ""
      },
      {
        field: "updateByName",
        headerName: this.$t("uexpressTrace.updateByName"),
        minWidth: 200
      },
      {
        field: "routeId",
        pinned: 'right',
        headerName: this.$t("common.operation"),
        cellRendererFramework: "OptionBtn",
        cellRendererParams: {
          refreshData: this.list,
          modifyCatch: this.modifyCatch
        },
        minWidth: 100
      }
    ]
    this.list()
  },
  methods: {
    onReady(params) {
      params.api.sizeColumnsToFit()
      window.addEventListener("resize", function () {
        setTimeout(function () {
          params.api.sizeColumnsToFit()
        })
      })
    },
    async list() {
      this.loading = true
      const params = {
        ...this.formData,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }
      const res = await getTraceCatchApi(params)
      if (res.ok) {
        this.total = parseInt(res.content.total, 10)
        this.dataList = res.content.list
      } else {
        this.total = 0
        this.dataList = []
      }
      this.loading = false
    },
    // exportList() {
    //   console.log('Export list')
    // },
    createTrace() {
      this.$refs.modifyCatch.init(null)
      this.showModifyDialog = true
    },
    modifyCatch(item) {
      this.$refs.modifyCatch.init(item)
      this.showModifyDialog = true
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
