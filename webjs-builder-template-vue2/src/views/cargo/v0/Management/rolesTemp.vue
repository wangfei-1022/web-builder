<template>
  <div style="padding: 0 5px;">
    <ag-grid-vue
      :locale-text-func="_i18nGridLocalText"
      :grid-options="gridOptions"
      :column-defs="columnDefs"
      :row-data="rowData"
      :enable-col-resize="true"
      :enable-sorting="true"
      :grid-ready="onReady"
      style="width:100%; height:600px;"
      class="ag-theme-balham"
    />
  </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue'
export default {
  name: 'RolesTemp',
  components: { AgGridVue },
  data() {
    return {
      columnDefs: null,
      rowData: null,
      gridOptions: null
    }
  },
  beforeMount() {
    this.columnDefs = [{
      headerName: '模块',
      field: 'a',
      rowGroup: true,
      hide: true
    }, {
      headerName: '功能',
      field: 'b',
      rowGroup: true,
      hide: true
    }, {
      headerName: '界面',
      field: 'c',
      hide: true
    }, {
      headerName: '描述',
      field: 'd'
    }, {
      headerName: '可用',
      field: 'granted'
    }]
    this.rowData = [
      { a: '海运出口', b: null, c: '列表', d: '具体页面-1', granted: false },
      { a: '海运出口', b: '工作号', c: '订舱', d: '具体页面-2', granted: true },
      { a: '海运出口', b: '工作号', c: '提单', d: '具体页面-3', granted: true },
      { a: '海运出口', b: '工作号', c: '报关', d: '具体页面-4', granted: false },
      { a: '财务结算', b: null, c: '对账管理', d: '具体页面-1', granted: false },
      { a: '财务结算', b: null, c: '发票管理', d: '具体页面-2', granted: false }
    ]
    this.gridOptions = {
      rowClassRules: {
        'grid-row-zebra-even': function(params) {
          return !(params.rowIndex % 2)
        },
        'grid-row-zebra-odd': function(params) {
          return (params.rowIndex % 2)
        }
      },
      rowSelection: 'multiple',
      groupDefaultExpanded: -1,
      groupSelectsChildren: true,
      suppressRowClickSelection: true,
      onSelectionChanged: this.onSelectionChanged,
      autoGroupColumnDef: {
        headerName: '功能点',
        field: 'c',
        cellRendererParams: {
          suppressCount: true,
          checkbox: true
        }
      }
    }
  },
  methods: {
    onReady(params) {
      this.gridApi = params.api
      params.api.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          params.api.sizeColumnsToFit()
        })
      })
      params.api.forEachNode(node => {
        node.setSelected(!node.group && node.data.granted)
      }) // 非group行、且granted的记录设为selected
    },
    onSelectionChanged(event) {
      this.gridApi.forEachNode(node => {
        if (!node.group) {
          node.setDataValue('granted', node.isSelected())
        }
      })
    }
  }
}
</script>
