<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px"  size="mini" @submit.native.prevent>
        <el-form-item :label="`${$t('planManager.containerNo')}: `" prop="numberVague">
          <el-input :placeholder="$t('common.placeholder')" v-model="multipleForm.numberVague" clearable @clear="getData" @keyup.enter.native="getData">
          </el-input>
        </el-form-item>
        <el-form-item :label="`${$t('planManager.warehouseId')}: `" prop="boxWarehouseId">
          <el-select v-model="multipleForm.boxWarehouseId"
            :placeholder="$t('common.placeholder')"
            filterable
            @change="getData">
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
        <el-button type="primary" size="mini" @click="exportInfo">{{$t('packageWarehouse.exportInfo')}}</el-button>
        <el-button type="primary" size="mini" @click="showBindContainer = true">{{$t('packageWarehouse.batchManager.bindContainer')}}</el-button>
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
    <BatchBindContainerDialog :visible.sync="showBindContainer" :loading.sync="loading" @refreshData="getData" />
  </div>
</template>
<script>
import { getBatchBoxListApi } from '@/api/planManager'
import { getWarehouseListApi, exportBoxApi } from '@/api/packageWarehouse'
import BatchBoxOpreatorBtn from './components/BatchBoxOpreatorBtn'
import RedirectBatchOrderList from './components/RedirectBatchOrderList'
import BatchBindContainerDialog from './components/BatchBindContainerDialog'
export default {
  name: 'BatchBoxList',
  components: {
    RedirectBatchOrderList,
    BatchBoxOpreatorBtn,
    BatchBindContainerDialog
  },
  filters: {},
  data() {
    return {
      loading: false,
      totalData: 0,
      dataList: [],
      warehouseList: [],
      multipleForm: {
        batchId: '',
        boxWarehouseId: null,
        numberVague: '',
        pageSize: 200,
        pageNum: 1
      },
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      showBindContainer: false
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
      this.resetHeight()
      // window.addEventListener('resize', () => {
      //   this.throttle(this.calcHeight, 200, 300)
      //   setTimeout(() => {
      //     params.api.sizeColumnsToFit()
      //   })
      // })
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
      this.multipleForm.numberVague = this.multipleForm.numberVague.trim()
      const res = await getBatchBoxListApi(this.multipleForm)
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
      return true
    },
    clearSearchForm() {
      if (this.$refs.singleForm) {
        this.$refs.singleForm.resetFields()
      }

      if (this.$refs.multipleForm) {
        this.$refs.multipleForm.resetFields()
      }
      this.opreatorTime = []
      this.getData()
    },
    async exportInfo() {
      this.loading = true
      const _selectedRows = this.gridApi.getSelectedRows()
      const data = {...this.multipleForm, ...{ids: _selectedRows.map(item => item.id)}}
      const res = await exportBoxApi(data)
      if (res && res.ok) {
        if (res.content) {
          this.downloadFile({
            fileName: `boxInfo_${this.$moment().format('YYYYMMDDHHMM')}`,
            url: res.content
          })
        } else {
          this.$message.error(this.$t('packageWarehouse.emptyUrl'))
        }
      } else {
        this.$message.error(res.errors.message)
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
      rowMultiSelectWithClick: true, // 允许多行同时被选中 - checkbox可多选
      suppressRowClickSelection: true // 点击行不触发行选中 - 只选中当前单元格
    }
    this.columnFields = [
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        minWidth: 55,
        maxWidth: 55,
        pinned: 'left'
      },
      {
        field: 'boxNo',
        headerName: this.$t('planManager.containerNo'),
        minWidth: 200,
        pinned: 'left',
        cellRendererFramework: 'RedirectBatchOrderList'
      },
      {
        field: 'batchNo',
        headerName: this.$t('planManager.batchNo'),
        minWidth: 200,
        pinned: 'left'
      },
      {
        field: 'billNo',
        headerName: this.$t('planManager.billNo'),
        minWidth: 120
      },
      {
        field: 'countryName',
        headerName: this.$t('planManager.countryName'),
        minWidth: 120
      },
      {
        field: 'id',
        headerName: this.$t('planManager.size'),
        minWidth: 120,
        cellRenderer: params => `${params.data.boxLength}*${params.data.boxWidth}*${params.data.boxHeight}`
      },
      {
        field: 'boxWeight',
        headerName: this.$t('planManager.totalWeight'),
        minWidth: 120
      },
      {
        field: 'boxDensity',
        headerName: this.$t('planManager.density'),
        minWidth: 120
      },
      {
        field: 'quantity',
        headerName: this.$t('planManager.orderQuantity'),
        minWidth: 120
      },
      {
        field: 'boxWarehouseName',
        headerName: this.$t('planManager.warehouseName'),
        minWidth: 120
      },
      {
        field: 'boxParcelType',
        headerName: this.$t('planManager.cargoType'),
        minWidth: 120,
        cellRenderer: params => params.value === 0 ? this.$t('planManager.unElectricProduct') : params.value === 1 ? this.$t('planManager.electricProduct') : this.$t('planManager.mixinProduct')
      },
      {
        field: 'id',
        headerName: this.$t('common.operation'),
        pinned: 'right',
        minWidth: 100,
        cellRendererFramework: 'BatchBoxOpreatorBtn',
        cellRendererParams: {
          refresh: this.getData
        }
      }
    ]

    this.getData()
    this.getWarehouseList()
  },
  mounted() {
    if (this.$route.params.batchId) {
      this.multipleForm.batchId = this.$route.params.batchId
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
