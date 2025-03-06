<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px"  size="mini" @submit.native.prevent>
        <el-form-item :label="`${$t('planManager.orderNo')}: `" prop="numberVague">
          <el-input :placeholder="$t('common.placeholder')" v-model="multipleForm.numberVague" clearable @clear="getData" @keyup.enter.native="getData">
          </el-input>
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="table-wrap">
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
  </div>
</template>
<script>
import { getBatchOrderListApi } from '@/api/planManager'
export default {
  name: 'BatchOrderList',
  components: {},
  filters: {},
  data() {
    return {
      loading: false,
      totalData: 0,
      dataList: [],
      warehouseList: [],
      multipleForm: {
        boxId: '',
        numberVague: '',
        pageSize: 200,
        pageNum: 1
      },
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: []
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
      // window.addEventListener('resize', () => {
      //   this.throttle(this.calcHeight, 200, 300)
      //   setTimeout(() => {
      //     params.api.sizeColumnsToFit()
      //   })
      // })
    },
    async getData() {
      this.loading = true
      this.multipleForm.numberVague = this.multipleForm.numberVague.trim()
      const res = await getBatchOrderListApi(this.multipleForm)
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
        field: 'batchNo',
        headerName: this.$t('planManager.batchNo'),
        minWidth: 200,
        pinned: 'left'
      },
      {
        field: 'billNo',
        headerName: this.$t('planManager.billNo'),
        minWidth: 200,
        pinned: 'left'
      },
      {
        field: 'boxNo',
        headerName: this.$t('planManager.containerNo'),
        minWidth: 200
      },
      {
        field: 'orderNo',
        headerName: this.$t('planManager.orderNo'),
        minWidth: 200
      },
      {
        field: 'customerRefNo',
        headerName: this.$t('planManager.customerRefNo'),
        minWidth: 120
      },
      {
        field: 'countryName',
        headerName: this.$t('planManager.countryName'),
        minWidth: 120
      },
      {
        field: 'inboundWeight',
        headerName: this.$t('planManager.inboundWeight'),
        minWidth: 120
      }
    ]

    this.getData()
  },
  mounted() {
    if (this.$route.params.boxId) {
      this.multipleForm.boxId = this.$route.params.boxId
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
