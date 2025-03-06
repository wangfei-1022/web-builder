<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px" size="mini" @submit.native.prevent>
        <el-form-item :label="$t('packageWarehouse.chineseName')" prop="memberId">
          <RemoteSearchSelector v-model="multipleForm.memberId" :placeholder="$t('charteredBoat.memberPlaceholder')" :remote-api="getMemberApi" @selectorChange="getData" />
        </el-form-item>
        <el-form-item :label="$t('packageWarehouse.productName')" prop="productId">
          <el-select v-model="multipleForm.productId"
            :placeholder="$t('common.placeholder')"
            filterable
            clearable
            @clear="resetProductId"
            @change="getData" >
            <el-option
              v-for="item in productList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="table-wrap">
      <div class="top-btn-wrap mb-10">
        <el-button type="primary" size="mini" @click="showCreateDialog = true">{{$t('common.createBtn')}}</el-button>
        <el-button type="danger" size="mini" @click="checkSelected">{{$t('common.deleteBtn')}}</el-button>
      </div>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="dataList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :animate-rows="false"
        :style="gridHeight"
        class="ag-theme-balham"
      />
      <Pagination :total="totalData" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getData" :pageSizes="[200, 500, 1000, 2000]" />
    </div>
    <CreateBulkyCustomerDialog :visible.sync="showCreateDialog" @refreshData="getData" />
    <!-- <ImportReport :dialogTitle="$t('packageWarehouse.importAgent')" :title="$t('packageWarehouse.importAgent')" :showImgImport="false" :visible.sync="showUploadDialog"  :excel-file-name="$t('packageWarehouse.agentExcelFileName')" @uploadSuccess="getData" :submitType="'agentParcel'" :limit="10" /> -->
  </div>
</template>
<script>
import {
  getProductListApi,
  getBubbleListApi,
  deleteBubbleApi,
  createBubbleApi,
  getBubbleDetailApi
} from '@/api/packageWarehouse'
import { getRemoteMemberApi } from '@/api/user'
import RemoteSearchSelector from '@/components/Cargo/Common/RemoteSearchSelector'
import BulkyCustomerOpreationBtn from './components/BulkyCustomerOpreationBtn'
import CreateBulkyCustomerDialog from './components/CreateBulkyCustomerDialog'
export default {
  name: 'FreeBulkyCustomer',
  components: {
    RemoteSearchSelector,
    BulkyCustomerOpreationBtn,
    CreateBulkyCustomerDialog
  },
  filters: {},
  data() {
    return {
      showCreateDialog: false,
      loading: false,
      totalData: 0,
      multipleForm: {
        memberId: '',
        productId: null,
        pageSize: 200,
        pageNum: 1
      },
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      dataList: [],
      productList: [],
      selectedIds: []
    }
  },
  computed: {
    getMemberApi: function() {
      return getRemoteMemberApi
    }
  },
  watch: {},
  methods: {
    // AG GRID
    onReady(params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
    },
    clearSearchForm() {
      this.$refs.multipleForm.resetFields()
      this.getData()
    },
    // 渠道下拉
    async getProductList() {
      const res = await getProductListApi()
      this.productList = [
        {
          value: null,
          label: this.$t('common.all')
        }
      ]
      if (res.ok && res.content) {
        res.content.forEach(item => {
          this.productList.push({
            value: item.id,
            label: item.productName
          })
        })
      }
    },
    async getData() {
      this.loading = true
      const res = await getBubbleListApi(this.multipleForm)
      this.dataList = []
      if (res && res.ok && res.content) {
        if (res.content.list) {
          this.dataList = res.content.list
        }
        this.totalData = parseInt(res.content.total, 10)
      } else {
        this.dataList = []
        this.totalData = 0
      }
      this.loading = false
    },
    // 检查勾选
    checkSelected() {
      this.selectedIds = this.gridApi.getSelectedRows().map(item => item.id)
      if (this.selectedIds.length === 0) {
        this.$message.warning(this.$t('packageWarehouse.batchDeleteEmpty'))
        return
      } else {
        this.$confirm(this.$t('common.deleteWarnningTips'), this.$t('common.warnningText'), {
          confirmButtonText: this.$t('common.deleteBtn'),
          confirmButtonClass: 'el-button--danger',
          cancelButtonText: this.$t('packageWarehouse.cancelDrop'),
          type: 'warning'
        })
        .then(async() => {
          this.batchDelete()
        }).catch(err => {})
      }
    },
    // 批量删除
    async batchDelete() {
      const res = await deleteBubbleApi({ids: this.selectedIds})
      if (res && res.ok) {
        this.$message.success(this.$t('packageWarehouse.batchDeleteSuccess'))
        this.getData()
      }
    },
    resetProductId() {
      this.multipleForm.productId = null
      this.getData()
    }
  },
  created() {
    this.gridOptions = {
      context: {
        componentParent: this
      },
      rowSelection: 'multiple', // 设置多行可选
      enableRangeSelection: true, // 启用范围选择
      rowMultiSelectWithClick: true, // 允许多行同时被选中 - checkbox可多选
      suppressRowClickSelection: true // 点击行不触发行选中 - 只选中当前单元格
    }
    this.columnFields = [
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        minWidth: 55,
        maxWidth: 55
      },
      {
        field: 'abbreviation',
        headerName: this.$t('packageWarehouse.shortName'),
        minWidth: 120
      },
      {
        field: 'chineseName',
        headerName: this.$t('packageWarehouse.fullname'),
        minWidth: 240
      },
      {
        field: 'productCode',
        headerName: this.$t('packageWarehouse.productCodeText'),
        minWidth: 120
      },
      {
        field: 'productName',
        headerName: this.$t('packageWarehouse.deliveryName'),
        minWidth: 200
      },
      {
        field: 'id',
        headerName: this.$t('common.operation'),
        minWidth: 100,
        cellRendererFramework: 'BulkyCustomerOpreationBtn',
        cellRendererParams: {refreshData: this.getData}
      }
    ]

    this.getData()
    this.getProductList()
  },
  mounted() { }
}
</script>
<style lang="scss" scoped>
@import "./mixin/highlight";
.el-form-item__content .el-input-group{
  display: inline-table!important;
}
</style>
