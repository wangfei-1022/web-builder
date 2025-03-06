<template>
  <div class="app-main-inner">
    <div style="padding: 10px;display: none">
      <div class="search-bar" style="background-color: #f5f7f7;display: flex; justify-content: space-between;height:40px;">
        <div class="search-bar-left" style="padding-top: 6px;padding-left:20px;" />
        <div class="search-bar-right" style="" />
      </div>
    </div>
    <div class="app-main-inner-row">
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnDefs"
        :row-data="rowData"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :pagination="true"
        :pagination-auto-page-size="true"
        style="width: 100%;height:calc(100vh - 200px)"
        class="ag-theme-balham"
      />
    </div>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import { getCompanyCodeList } from '@/api/companyCode'
export default {
  name: 'CustomerCodeType',
  components: { AgGridVue },
  data() {
    return {
      gridOptions: {},
      columnDefs: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      rowData: [],
      isShowingMoreSearchCondition: false
    }
  },
  computed: {

  },
  created() {
    this.columnDefs = [
      {
        headerName: '选择', width: 55, checkboxSelection: true, pinned: 'left',
        suppressSorting: true, suppressMenu: true, suppressSizeToFit: true, suppressResize: true
      }, {
        headerName: '企业代码类型',
        field: 'enterpriseCodeType'
      }, {
        headerName: '国家中文名',
        field: 'countryChineseName'
      }, {
        headerName: '国家英文名',
        field: 'countryEnglishName'
      }, {
        headerName: '国家代码',
        field: 'countryCode'
      }, {
        headerName: '备注',
        field: 'remark'
      }, {
        headerName: '创建人',
        field: 'createBy'
      }, {
        headerName: '创建日期',
        field: 'createTime'
      }]
  },
  mounted() {
    this.fetchPageData()
  },
  methods: {
    onReady(params) {
      const self = this
      // params.api.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          self.onFirstDataRendered(self.gridOptions)
        })
      })
    },
    onFirstDataRendered(gridOptions) {
      const allColumnIds = []
      gridOptions.columnApi.getAllColumns().forEach(function(column) {
        allColumnIds.push(column.colId)
      })
      setTimeout(function() {
        gridOptions.columnApi.autoSizeColumns(allColumnIds)
      })
    },
    fetchPageData() {
      getCompanyCodeList().then(res => {
        if (res.ok) {
          this.rowData = res.content.list
        }
      })
    }
  }

}
</script>
<style>

</style>
