<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px"  size="mini" @submit.native.prevent>
        <el-form-item :label="`${$t('planManager.billNo')}: `" prop="billNo">
          <el-input :placeholder="$t('common.placeholder')" v-model="multipleForm.billNo" clearable @keyup.enter.native="getData">
          </el-input>
        </el-form-item>
        <el-form-item :label="`${$t('planManager.polCode')}: `" prop="polCode">
          <el-input :placeholder="$t('common.placeholder')" v-model="multipleForm.polCode" clearable @keyup.enter.native="getData">
          </el-input>
          <!-- <cargo-advance-select
            ref="polCodeSelect"
            :url="url.qf.seaport"
            :headers="[$t('common.englishName'),$t('common.fiveCharCode'),$t('common.chineseName')]"
            :fields="['englishName','code5','chineseName']"
            tag-value="code5"
            tag-name="enPortName"
            remote
            @parentCallBack="(data)=>{
              multipleForm.polCode=data.code5
            }" /> -->
        </el-form-item>
        <el-form-item :label="`${$t('planManager.podCode')}: `" prop="podCode">
          <el-input :placeholder="$t('common.placeholder')" v-model="multipleForm.podCode" clearable @keyup.enter.native="getData">
          </el-input>
          <!-- <cargo-advance-select
            ref="podCodeSelect"
            :url="url.qf.seaport"
            :headers="[$t('common.englishName'),$t('common.fiveCharCode'),$t('common.chineseName')]"
            :fields="['englishName','code5','chineseName']"
            tag-value="code5"
            tag-name="enPortName"
            remote
            @parentCallBack="(data)=>{
              multipleForm.podCode=data.code5
            }" /> -->
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="table-wrap">
      <div class="top-btn-wrap mb-10">
        <el-button type="primary" size="mini" @click="bindHandler" v-show="batchId != ''">{{$t('planManager.billList.bindBatchToBill')}}</el-button>
      </div>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="billList"
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
import { getBillListApi, batchBindBillApi } from '@/api/planManager'
import BillListOpreatorBtn from './components/BillListOpreatorBtn'
import RedirectBatchList from './components/RedirectBatchList'
export default {
  name: 'BillList',
  components: {
    BillListOpreatorBtn,
    RedirectBatchList
  },
  filters: {},
  data() {
    return {
      loading: false,
      totalData: 0,
      multipleForm: {
        billNo: '',
        podCode: '',
        polCode: '',
        pageSize: 200,
        pageNum: 1
      },
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      billList: []
    }
  },
  watch: {
    "$route.query": function(query) {
      if (query && query.refresh) {
        this.getData()
      }
    }
  },
  computed: {
    batchId() {
      if (this.$route.query && this.$route.query.batchId) {
        return this.$route.query.batchId
      } else {
        return ''
      }
    }
  },
  methods: {
    // AG GRID
    onReady(params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
      // window.addEventListener('resize', () => {
      //   setTimeout(() => {
      //     params.api.sizeColumnsToFit()
      //   })
      // })
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
    async getData() {
      this.loading = true
      // this.multipleForm.numbers = this.multipleForm.numbers.trim()
      const res = await getBillListApi(this.multipleForm)
      this.billList = []
      if (res && res.ok && res.content) {
        if (res.content.list) {
          this.billList = res.content.list
        }
        this.totalData = parseInt(res.content.total, 10)
      } else {
        this.billList = []
        this.totalData = 0
      }
      this.loading = false
      return true
    },
    bindHandler() {
      const _selectedRows = this.gridApi.getSelectedRows()
      if (_selectedRows.length === 0) {
        this.$message.warning(this.$t('planManager.selectedIdEmptyWarning'))
        return false
      } else if (_selectedRows.length > 1) {
        this.$message.warning(this.$t('planManager.selectedIdLimitWarning'))
        return false
      } else {
        this.bindBatchToBill(_selectedRows[0].id)
      }
    },
    async bindBatchToBill(billId) {
      this.loading = true
      const res = await batchBindBillApi({batchId: this.batchId, planBillId: billId})
      if (res && res.ok) {
        this.$message.success(this.$t('planManager.billList.bindBatchSuccess'))
      }
      this.loading = false
      this.$router.push({name: 'BatchManager', query: {opreator: 'refresh'}})
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
        maxWidth: 55,
        pinned: 'left'
      },
      {
        field: 'billNo',
        headerName: this.$t('planManager.billList.billNo'),
        minWidth: 200,
        pinned: 'left',
        tooltip: params => params.value,
        cellRendererFramework: 'RedirectBatchList'
      },
      {
        field: 'planNo',
        headerName: this.$t('planManager.planNo'),
        minWidth: 200,
        tooltip: params => params.value
      },
      {
        field: 'billOriginName',
        headerName: this.$t('planManager.billOrigin'),
        minWidth: 120,
        cellRenderer: params => params.value ? params.value : ''
      },
      {
        field: 'totalQuantity',
        headerName: this.$t('planManager.billList.totalQuantity'),
        minWidth: 100,
        cellRenderer: params => params.value ? params.value : ''
      },
      {
        field: 'totalWeight',
        headerName: this.$t('planManager.billList.totalWeight'),
        minWidth: 100,
        cellRenderer: params => params.value ? params.value : ''
      },
      {
        field: 'totalVolume',
        headerName: this.$t('planManager.billList.totalVolume'),
        minWidth: 100,
        cellRenderer: params => params.value ? params.value : ''
      },
      {
        field: 'batchTotalQuantity',
        headerName: this.$t('planManager.billList.batchTotalQuantity'),
        minWidth: 100,
        cellRenderer: params => params.value ? params.value : ''
      },
      {
        field: 'batchTotalWeight',
        headerName: this.$t('planManager.billList.batchTotalWeight'),
        minWidth: 100,
        cellRenderer: params => params.value ? params.value : ''
      },
      {
        field: 'batchTotalVolume',
        headerName: this.$t('planManager.billList.batchTotalVolume'),
        minWidth: 100,
        cellRenderer: params => params.value ? params.value : ''
      },
      {
        field: 'bookingAgent',
        headerName: this.$t('planManager.billList.bookingAgent'),
        minWidth: 200,
        cellRenderer: params => params.value ? params.value : '',
        tooltip: params => params.value ? params.value : ''
      },
      {
        field: 'bulkyCargoPercentage',
        headerName: this.$t('planManager.billList.bulkyCargoPercentage'),
        minWidth: 120,
        cellRenderer: params => params.value ? params.value : ''
      },
      {
        field: 'totalCost',
        headerName: this.$t('planManager.billList.totalCost'),
        minWidth: 120
      },
      {
        field: 'airlines',
        headerName: this.$t('planManager.billList.airlines'),
        minWidth: 200,
        tooltip: params => params.value ? params.value : ''
      },
      {
        field: 'etd',
        headerName: this.$t('planManager.billList.etd'),
        minWidth: 180,
        cellRenderer: params => params.value ? `${this.$moment(Number(params.value)).format('YYYY-MM-DD')}` : ''
      },
      {
        field: 'flightNo',
        headerName: this.$t('planManager.billList.flightNo'),
        minWidth: 180,
        tooltip: params => params.value ? params.value : ''
      },
      {
        field: 'polCode',
        headerName: this.$t('planManager.billList.polCode'),
        minWidth: 120,
        cellRenderer: params => params.value ? params.value : ''
      },
      {
        field: 'podCode',
        headerName: this.$t('planManager.billList.podCode'),
        minWidth: 120,
        cellRenderer: params => params.value ? params.value : ''
      },
      {
        field: 'id',
        headerName: this.$t('common.operation'),
        pinned: 'right',
        minWidth: 120,
        cellRendererFramework: 'BillListOpreatorBtn',
        cellRendererParams: { refreshData: this.getData }
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
