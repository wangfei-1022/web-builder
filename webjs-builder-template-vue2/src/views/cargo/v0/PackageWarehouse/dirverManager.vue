<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="singleForm" :inline="true" :model="multipleForm" label-width="80px"  size="mini" @submit.native.prevent style="max-width: 1000px;">
        <el-form-item :label="`${$t('packageWarehouse.driverManager.area')}: `" prop="area">
          <el-input :placeholder="$t('common.placeholder')" v-model="multipleForm.area" clearable >
          </el-input>
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.driverManager.driver')}: `" prop="driver">
          <el-input :placeholder="$t('common.placeholder')" v-model="multipleForm.driver" clearable >
          </el-input>
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="table-wrap">
      <div class="top-btn-wrap mb-10">
        <el-button type="primary" size="mini" @click="createDriver">{{$t('packageWarehouse.driverManager.createBtn')}}</el-button>
        <el-button type="primary" size="mini" @click="showImportDialog = true">{{$t('common.importBtn')}}</el-button>
      </div>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="dirverList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :animate-rows="false"
        :style="gridHeight"
        class="ag-theme-balham"
      />
      <Pagination :total="totalData" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getData" :pageSizes="[200, 500, 1000, 2000]" />
    </div>
    <DriverEditDialog ref="driverEditDialog" :title="$t('packageWarehouse.driverManager.editDriverTitle')" :visible.sync="showEditDialog" :parentLoading.sync="loading" @refreshData="getData" />
    <DriverImportDialog ref="driverImportDialog" :visible.sync="showImportDialog" :parentLoading.sync="loading" @refreshData="getData" />
  </div>
</template>
<script>
import { getDirverListApi, createDriverApi, modifyDriverApi, deleteDriverInfoApi } from '@/api/packageWarehouse'
import DriverOpreationBtn from './components/DriverOpreationBtn'
import DriverEditDialog from './components/DriverEditDialog'
import DriverImportDialog from './components/DriverImportDialog'
export default {
  name: 'DirverManager',
  components: {
    DriverOpreationBtn,
    DriverEditDialog,
    DriverImportDialog
  },
  filters: {},
  data() {
    return {
      loading: false,
      totalData: 0,
      multipleForm: {
        area: '',
        driver: '',
        pageSize: 200,
        pageNum: 1
      },
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      dirverList: [],
      showEditDialog: false,
      showImportDialog: false,
      editId: null
    }
  },
  computed: {},
  watch: {},
  methods: {
    // AG GRID
    onReady(params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
      // window.addEventListener('resize', function() {
      //   setTimeout(function() {
      //     params.api.sizeColumnsToFit()
      //   })
      // })
    },
    async getData() {
      this.loading = true
      const res = await getDirverListApi(this.multipleForm)
      this.dirverList = []
      if (res && res.ok && res.content) {
        this.dirverList = res.content.list
        this.totalData = parseInt(res.content.total, 10)
      } else {
        this.dirverList = []
        this.totalData = 0
      }
      this.loading = false
      return true
    },
    clearSearchForm() {
      if (this.$refs.singleForm) {
        this.$refs.singleForm.resetFields()
      }
      this.getData()
    },
    createDriver() {
      this.showEditDialog = true
    },
    modifyDriver(obj) {
      this.$refs.driverEditDialog.setUploadForm(obj)
      this.showEditDialog = true
    },
    checkDelete(id) {
      this.$confirm(this.$t('packageWarehouse.driverManager.deleteConfirm'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.deleteBtn'),
        cancelButtonText: this.$t('common.cancelBtn'),
        confirmButtonClass: 'el-button--danger',
        type: 'warning'
      }).then(() => {
        this.deleteDriver(id)
      }).catch(() => {})
    },
    async deleteDriver(id) {
      this.loading = true
      const res = await deleteDriverInfoApi(id)
      if (res && res.ok) {
        this.$message.success(this.$t('packageWarehouse.driverManager.deleteSuccess'))
        this.getData()
      }
      this.loading = false
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
        field: 'area',
        headerName: this.$t('packageWarehouse.driverManager.area'),
        minWidth: 120
      },
      {
        field: 'chineseName',
        headerName: this.$t('packageWarehouse.driverManager.supplier'),
        minWidth: 120
      },
      {
        field: 'plateNo',
        headerName: this.$t('packageWarehouse.driverManager.plateNo'),
        minWidth: 120
      },
      {
        field: 'driver',
        headerName: this.$t('packageWarehouse.driverManager.driver'),
        minWidth: 120
      },
      {
        field: 'driverPhone',
        headerName: this.$t('packageWarehouse.driverManager.driverPhone'),
        minWidth: 120
      },
      {
        field: 'carModel',
        headerName: this.$t('packageWarehouse.driverManager.carModel'),
        minWidth: 120
      },
      {
        field: 'remark',
        headerName: this.$t('packageWarehouse.driverManager.remark'),
        minWidth: 200,
        tooltip: params => params.value
      },
      {
        field: 'id',
        headerName: this.$t('common.operation'),
        minWidth: 80,
        cellRendererFramework: 'DriverOpreationBtn',
        cellRendererParams: {
          refresh: this.getData,
          modifyDriver: this.modifyDriver,
          deleteDriver: this.checkDelete
        }
      }
    ]
    this.getData()
  },
  mounted() { }
}
</script>
<style lang="scss" scoped>
  @import "./mixin/highlight";
</style>
