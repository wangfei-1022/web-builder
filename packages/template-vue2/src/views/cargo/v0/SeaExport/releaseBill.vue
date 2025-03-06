<template>
  <div class="app-main-inner release-bill" style="padding: 10px;background-color: #f5f7f7;">
    <search-item
      ref="searchItem"
      source-page="seReleaseBill"
      :sim-url="url.act.releaseSe"
      :adv-url="url.act.releaseSeAdv"
      search-item-code="放单查询"
      search-item-mode="querydata"
      style="margin-left: 10px;margin-right: 10px;"
      config-module="101"
      @queryDataCallBack="getQueryDataCallBack"
    >
      <span slot="search-right" />
    </search-item>
    <div class="app-main-inner-row operate-buttons" style="display: flex; justify-content: space-between; background-color: #f5f7f7; padding: 8px;border-bottom:5px solid #fff">
      <div class="operate-buttons-left">
        <el-button v-permission="['se:release:release']" size="mini" type="primary" @click="onPassRelease">放单</el-button>
      </div>
      <div class="operate-buttons-right" />
    </div>
    <ag-grid-vue
      :locale-text-func="_i18nGridLocalText"
      :grid-options="allowRelease.gridOptions"
      :column-defs="allowRelease.columnDefs"
      :row-data="allowRelease.rowData"
      :enable-col-resize="true"
      :enable-sorting="true"
      :animate-rows="true"
      :grid-ready="onAllowReleaseReady"
      style="width:100%;height:calc(100vh - 200px)"
      class="ag-theme-balham"
    />

  </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue'
import searchItem from '@/components/Cargo/Dmn/searchItem'
import { getGridSelectedIds } from '@/utils/gridChoose'
import URL from '@/api/urlTranslator'
import { passRelease } from '@/api/release'
import checkPermission from '@/utils/permission'

export default {
  name: 'SeReleaseBill',
  components: { AgGridVue, searchItem },
  data() {
    return {
      allowRelease: {
        rowData: [],
        columnDefs: [],
        gridOptions: {}
      }
    }
  },
  computed: {
    url() {
      return URL
    }
  },
  created() {
    this.setGridOptions()
    this.setColumnDefs()
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    onAllowReleaseReady(params) {
      const self = this
      // params.api.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          self.onFirstDataRendered(self.allowRelease.gridOptions)
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
    fetchData() {
      this.$refs.searchItem.getSimQueryResult({})
    },
    onPassRelease() {
      getGridSelectedIds(this.allowRelease.gridOptions, 'blId').then(ids => passRelease(ids)).then(res => {
        this.fetchData()
      }).catch(err => {
        this.$message.error(err)
      })
    },
    getQueryDataCallBack(data) {
      console.log('==========data', data)
      this.allowRelease.rowData = data.list
    },
    setGridOptions() {
      this.allowRelease.gridOptions = {
        rowClassRules: {
          'grid-row-zebra-even': function(params) {
            return !(params.rowIndex % 2)
          },
          'grid-row-zebra-odd': function(params) {
            return params.rowIndex % 2
          }
        },
        suppressRowClickSelection: true,
        treeData: true,
        getDataPath: data => data.path.split(','),
        groupDefaultExpanded: -1,
        autoGroupColumnDef: {
          headerCheckboxSelection: true,
          headerName: '提单号',
          width: 240,
          suppressSizeToFit: true,
          cellRendererParams: {
            suppressCount: true,
            checkbox: params => {
              if (params.data.parentId === '0') {
                return true
              } else {
                return false
              }
            },
            innerRenderer: params => {
              if (params.data.parentId === '0') {
                return params.data.blNo
              } else {
                return ''
              }
            }
          }
        },
        sideBar: { toolPanels: ['columns', 'filter'], visible: false },
        rowSelection: 'multiple',
        rowMultiSelectWithClick: true
      }
    },
    setColumnDefs() {
      this.allowRelease.columnDefs = [
        {
          headerName: '放单状态',
          field: 'blReleaseStateDesc'
        }, {
          headerName: '提单类型',
          field: 'blTypeDesc'
        }, {
          headerName: '提单号',
          field: 'blNo'
        }, {
          headerName: '工作号',
          field: 'jobNo'
        }, {
          headerName: '开航日期',
          field: 'etd'
        }, {
          headerName: '箱型箱量',
          field: 'containerInfo'
        }, {
          headerName: '起运港/POL',
          field: 'polCode'
        }, {
          headerName: '目的港',
          field: 'podCode'
        }, {
          headerName: '船名',
          field: 'vessel'
        }, {
          headerName: '航次',
          field: 'voyage'
        }, {
          headerName: '距今天数',
          field: 'dayGap'
        }, {
          headerName: '操作人员',
          field: 'saleByName'
        }, {
          headerName: '销售人员',
          field: 'opByName'
        }
      ]
    },
    hasPermission(permissionArr) {
      return checkPermission(permissionArr)
    }
  }
}
</script>
<style scoped>
</style>
