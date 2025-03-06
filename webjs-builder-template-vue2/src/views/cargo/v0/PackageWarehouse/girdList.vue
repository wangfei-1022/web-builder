<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="100px"  size="mini" @submit.native.prevent>
        <el-form-item :label="$t('packageWarehouse.girdConfig.girdName')" prop="girdName">
          <el-input v-trim :placeholder="$t('common.placeholder')" v-model="multipleForm.girdName" clearable>
          </el-input>
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.girdConfig.warehouse')}: `" prop="warehouseId">
          <el-select v-model="multipleForm.warehouseId"
            :placeholder="$t('common.placeholder')"
            filterable>
            <el-option
              v-for="item in warehouseList"
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
        <el-button type="primary" size="mini" @click="createGird">{{$t('packageWarehouse.girdConfig.createGird')}}</el-button>
      </div>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="gridList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :animate-rows="false"
        :style="gridHeight"
        class="ag-theme-balham"
      />
      <Pagination :total="totalData" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getData" :pageSizes="[200, 500, 1000, 2000]" />
    </div>
    <GirdBindWarehouseDialog ref="GirdBindWarehouseDialog" @refreshData="getData" :warehouseList="warehouseList" />
  </div>
</template>
<script>
import {
  getWarehouseListApi,
  getGirdListApi
} from '@/api/packageWarehouse'
import GirdListOpreatorBtn from './components/GirdListOpreatorBtn'
import GirdBindWarehouseDialog from './components/GirdBindWarehouseDialog'
export default {
  name: 'GirdList',
  components: {
    GirdListOpreatorBtn,
    GirdBindWarehouseDialog
  },
  filters: {},
  data() {
    return {
      loading: false,
      gridList: [],
      warehouseList: [],
      multipleForm: {
        girdName: '',
        warehouseId: null,
        pageSize: 200,
        pageNum: 1
      },
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      totalData: 0
    }
  },
  computed: {
  },
  watch: {
    "$route.query": function(query) {
      if (query && query.refresh) {
        this.getData()
      }
    }
  },
  methods: {
    // AG GRID
    onReady(params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
    },
    async getWarehouseList() {
      const res = await getWarehouseListApi({pageNum: 1, pageSize: 100})
      if (res && res.ok && res.content) {
        this.warehouseList = [
          {
            label: this.$t('packageWarehouse.statusAll'),
            value: null
          }
        ]

        res.content.list.forEach(item => {
          this.warehouseList.push({
            label: item.name,
            value: item.id
          })
        })
      }
    },
    async getData() {
      this.loading = true
      const res = await getGirdListApi(this.multipleForm)
      this.gridList = []
      if (res && res.ok && res.content) {
        if (res.content.list) {
          this.gridList = res.content.list
        }
        this.totalData = parseInt(res.content.total, 10)
      } else {
        this.gridList = []
        this.totalData = 0
      }
      this.loading = false
      return true
    },
    clearSearchForm() {
      if (this.$refs.singleForm) {
        this.$refs.singleForm.resetFields()
      }

      if (this.$refs.multipleForm) {
        this.$refs.multipleForm.resetFields()
      }
      this.getData()
    },
    showBindDialog(obj) {
      this.$refs.GirdBindWarehouseDialog.showBindDialog(obj)
    },
    createGird() {
      this.$router.push({name: 'GirdDetail', params: {operator: 'create'}})
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
        field: 'girdName',
        headerName: this.$t('packageWarehouse.girdConfig.girdName'),
        minWidth: 200
      },
      {
        field: 'warehouseName',
        headerName: this.$t('packageWarehouse.girdConfig.warehouse'),
        minWidth: 200
      },
      {
        field: 'id',
        headerName: this.$t('common.operation'),
        minWidth: 100,
        maxWidth: 300,
        cellRendererFramework: 'GirdListOpreatorBtn',
        cellRendererParams: {
          refreshData: this.getData,
          showBindDialog: this.showBindDialog
        }
      }
    ]
    this.getData()
    this.getWarehouseList()
  },
  mounted() { }
}
</script>
<style lang="scss" scoped>
@import "./mixin/highlight";
::v-deep .el-button{
  margin-right: 10px;
  margin-left: 0;
}
</style>
