<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px" @submit.native.prevent>
        <el-form-item :label="`${$t('containerManager.operationYardCode')}: `" prop="operationYards">
          <el-input v-model="multipleForm.operationYards" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="getData" @clear="getData" />
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.port')}: `" prop="operationPorts">
          <el-input v-model="multipleForm.operationPorts" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="getData" @clear="getData" />
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="table-wrap">
      <div class="top-btn-wrap mb-10">
        <el-button type="primary" size="mini" v-permission="['ctn:order:add']" @click="exportList">{{$t('common.exportBtn')}}</el-button>
      </div>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="list"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :animate-rows="false"
        :style="gridHeight"
        class="ag-theme-balham"
      />
      <Pagination :total="totalData" :limit.sync="pageSize" :page.sync="pageNum" @pagination="paginationList" />
    </div>
  </div>
</template>
<script>
import { getContainerInfoListApi, exportOutsideListApi } from '@/api/containerDynamic'
import SubDetailBtn from './components/SubDetailBtn'
export default {
  name: 'OutsideYardList',
  filters: {},
  data() {
    return {
      loading: false,
      totalList: [],
      list: [],
      pageSize: 50,
      pageNum: 1,
      totalData: 0,
      multipleForm: {
        operationYards: '',
        operationPorts: '',
        type: 2
      },
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      selectedItems: []
    }
  },
  components: {SubDetailBtn},
  computed: {
    dataStartIndex() {
      return (this.pageNum - 1) * this.pageSize
    },
    dataEndIndex() {
      return this.pageSize * this.pageNum
    }
  },
  created() {
    this.gridOptions = {
      context: {
        componentParent: this
      },
      rowSelection: 'multiple', // 设置多行可选
      rowMultiSelectWithClick: true, // 点击及选择复选框
      suppressRowClickSelection: true // 选中单元格后可以复制内容
    }
    this.columnFields = [
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        width: 60
      },
      {
        field: 'operationCode',
        headerName: this.$t('containerManager.operationCode'),
        minWidth: 80
      },
      {
        field: 'operationYard',
        headerName: this.$t('containerManager.operationYard'),
        minWidth: 80,
        cellRenderer: params => params.value ? params.value : ''
      },
      {
        field: 'operationPort',
        headerName: this.$t('containerManager.operationPort'),
        minWidth: 80,
        cellRenderer: params => params.value ? params.value : ''
      },
      {
        field: 'total',
        headerName: this.$t('containerManager.totalAmount'),
        minWidth: 80
      },
      {
        field: 'gpFQuantity',
        headerName: this.$t('containerManager.gpFQuantity'),
        minWidth: 80,
        cellRenderer: params => Number(params.value) + Number(params.data.gpEQuantity)
      },
      {
        field: 'hcFQuantity',
        headerName: this.$t('containerManager.hcFQuantity'),
        minWidth: 80,
        cellRenderer: params => Number(params.value) + Number(params.data.hcEQuantity)
      },
      {
        field: 'rhFQuantity',
        headerName: this.$t('containerManager.rhFQuantity'),
        minWidth: 80,
        cellRenderer: params => Number(params.value) + Number(params.data.rhEQuantity)
      },
      {
        field: 'id',
        headerName: this.$t('common.operation'),
        minWidth: 80,
        cellRendererFramework: 'SubDetailBtn',
        cellRendererParams: {viewType: 2}
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
      this.pageNum = 1
      const res = await getContainerInfoListApi(this.multipleForm)
      if (res.ok) {
        this.totalList = res.content ? res.content : []
        this.totalData = this.totalList.length
        this.paginationList()
      } else {
        this.totalList = []
        this.list = []
        this.totalData = 0
      }
      this.loading = false
    },
    paginationList() {
      this.list = this.totalList.slice(this.dataStartIndex, this.dataEndIndex)
    },
    clearSearchForm() {
      this.$refs.multipleForm.resetFields()
      this.getData()
    },
    async exportList() {
      this.selectedItems = this.gridApi.getSelectedRows()
      let res = null
      if (this.selectedItems.length > 0) {
        res = await exportOutsideListApi({dataList: this.selectedItems})
      } else {
        res = await exportOutsideListApi(this.multipleForm)
      }

      if (res.ok) {
        this.downloadFile({fileName: '', url: res.content})
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
