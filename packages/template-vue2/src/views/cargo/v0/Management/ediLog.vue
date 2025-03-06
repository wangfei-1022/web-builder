<template>
  <div class="app-main-inner">
    <search-item
      ref="searchItem"
      :is-simple-ui="1===1"
      :allow-sim-query="1===2"
      :margin-r="10"
      search-item-code="EDI日志查询"
      config-module="110"
      @simSearchItemCallBack="getSimSearchItemCallBack"
    >
      <span slot="search-right">&nbsp;</span>
      <template slot="triggers">
        <div class="triggers">
          <div><el-button size="mini" style="width:100%" @click="toAdvQuery()">查询</el-button></div>
        </div>
      </template>
    </search-item>
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
        style="width: 100%;height:calc(100vh - 130px)"
        class="ag-theme-balham"
      />
    </div>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import { getEdiLogList } from '@/api/ediLog'
import searchItem from '@/components/Cargo/Dmn/searchItem'
export default {
  name: 'EdiLog',
  components: { AgGridVue, searchItem },
  data() {
    return {
      searchConditions: {
        searchItemList: []
      },
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
        hide: true,
        headerName: 'ID',
        field: 'id'
      }, {
        headerName: '接收方名称',
        field: 'receiverName'
      }, {
        headerName: 'EDI类型',
        field: 'ediTypeDesc'
      }, {
        headerName: '工作号',
        field: 'jobNo'
      }, {
        headerName: '委托单位',
        field: 'customerName'
      }, {
        headerName: '委托单位简称',
        field: 'customerAbbreviation'
      }, {
        headerName: '承运人简称',
        field: 'carrierCode'
      }, {
        headerName: 'MB/L编号',
        field: 'mblNo'
      }, {
        headerName: '关单号',
        field: 'soNo'
      }, {
        headerName: '开航日期',
        field: 'etd'
      }, {
        headerName: '船名',
        field: 'vessel'
      }, {
        headerName: '航次',
        field: 'voyage'
      }, {
        headerName: '发送人',
        field: 'sendBy'
      }, {
        headerName: '发送时间',
        field: 'sendTime'
      }, {
        headerName: '完成时间',
        field: 'finishSendTime'
      }, {
        headerName: '收发状态',
        field: 'sendStateDesc'
      }, {
        headerName: '受理状态',
        field: 'createBy'
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
      getEdiLogList(this.searchConditions.searchItemList).then(res => {
        if (res.ok) {
          this.rowData = res.content.list
        } else {
          return Promise.reject(res.message)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    getSimSearchItemCallBack(data) {
      console.log('getSimSearchItem', data)
    },
    toAdvQuery() {
      this.searchConditions.searchItemList = this.$refs.searchItem.getAdvRequestData()
      this.fetchPageData()
    }
  }

}
</script>
<style>

</style>
