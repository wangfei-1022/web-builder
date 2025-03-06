<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px" @submit.native.prevent>
        <el-form-item :label="$t('containerManager.orderNo')" prop="orderNo">
          <el-input v-model="multipleForm.orderNo" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="getData" @clear="getData" />
        </el-form-item>
        <el-form-item :label="$t('containerManager.contractNo')" prop="contractNo">
          <el-input v-model="multipleForm.contractNo" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="getData" @clear="getData" />
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="top-btn-wrap mt-20">
      <el-button type="primary" size="mini" v-permission="['ctn:order:add']" @click="createOrder">{{$t('containerManager.createText')}}</el-button>
    </div>
    <el-tabs v-model="tableType" @tab-click="getData" class="top-tabs">
      <el-tab-pane :label="$t('common.all')" name="all" />
      <el-tab-pane :label="$t('containerManager.newContainer')" name="1" />
      <el-tab-pane :label="$t('containerManager.rent')" name="2" />
      <el-tab-pane :label="$t('containerManager.loan')" name="3" />
    </el-tabs>
    <div class="table-wrap no-margin">
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="orderList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :animate-rows="false"
        :style="gridHeight"
        class="ag-theme-balham"
      />
      <Pagination :total="totalData" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getData" />
    </div>
  </div>
</template>
<script>
import { getOrderListApi } from '@/api/orderManager'
import OrderEditBtn from './components/OrderEditBtn'
export default {
  name: 'OrderList',
  components: {
    OrderEditBtn
  },
  filters: {},
  data() {
    return {
      loading: false,
      tableType: 'all',
      orderList: [],
      totalData: 0,
      multipleForm: {
        orderNo: '',
        contractNo: '',
        pageSize: 50,
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
  created() {
    this.gridOptions = {
      context: {
        componentParent: this
      },
      rowSelection: 'single', // 设置多行可选
      animateRows: true,
      suppressRowClickSelection: true // 选中单元格后可以复制内容
      // suppressCellSelection: true, //点击不选中单元格
    }
    this.columnFields = [
      {
        field: 'orderNo',
        headerName: this.$t('containerManager.orderNo'),
        minWidth: 160
      },
      {
        field: 'orderType',
        headerName: this.$t('containerManager.orderType'),
        minWidth: 120,
        cellRenderer: params => params.value === 1 ? this.$t('containerManager.newContainer') : params.value === 2 ? this.$t('containerManager.rent') : this.$t('containerManager.loan')
      },
      {
        field: 'contractNo',
        headerName: this.$t('containerManager.contractNo'),
        minWidth: 160
      },
      {
        field: 'currency',
        headerName: this.$t('containerManager.currency'),
        minWidth: 120
      },
      {
        field: 'quantity',
        headerName: this.$t('containerManager.orderList.quantityAndAmount'),
        minWidth: 160
      },
      {
        field: 'containerTypeQuantity',
        headerName: this.$t('containerManager.typeAndAmount'),
        minWidth: 120,
        tooltip: params => params.value
      },
      {
        field: 'memberName',
        headerName: this.$t('containerManager.orderList.memberName'),
        minWidth: 120,
        tooltip: params => params.value
      },
      {
        field: 'status',
        headerName: this.$t('containerManager.status'),
        minWidth: 120,
        cellRenderer: params => params.value === 1 ? this.$t('containerManager.orderList.valid') : this.$t('containerManager.orderList.invalid')
      },
      {
        field: 'createTime',
        headerName: this.$t('containerManager.orderList.createdTime'),
        minWidth: 120,
        cellRenderer: params => params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss') : ''
      },
      {
        field: 'id',
        headerName: this.$t('common.operation'),
        minWidth: 100,
        pinned: 'right',
        cellRendererFramework: 'OrderEditBtn'
      }
    ]

    this.getData()
  },
  mounted() {},
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
      let _searchForm = null
      if (this.tableType === 'all') {
        _searchForm = this.multipleForm
      } else {
        _searchForm = { ...this.multipleForm, ...{ orderType: parseInt(this.tableType, 10) }}
      }
      const res = await getOrderListApi(_searchForm)
      if (res.ok) {
        this.orderList = res.content.list
        this.totalData = parseInt(res.content.total, 10)
      } else {
        this.orderList = []
        this.totalData = 0
      }
      this.loading = false
    },
    clearSearchForm() {
      this.$refs.multipleForm.resetFields()
      this.getData()
    },
    createOrder() {
      this.$router.push({ name: 'OrderDetail' })
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.refresh) {
        vm.getData()
      }
    })
  }
}
</script>
<style lang="scss" scoped>

</style>
