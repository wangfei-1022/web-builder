<template>
  <div class="app-main-inner">
    <div class="app-main-inner-row">
      <div class="btn-group-left">
        <!--<el-button type="primary" size="mini">新建</el-button>-->
        <!--<el-button type="danger" size="mini">删除</el-button>-->
      </div>
      <div class="btn-group-right">
        <!--<el-button type="warning" size="mini">启用/停用</el-button>-->
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
import { getCurrencyList } from '@/api/currency'

export default {
  name: 'Currency',
  components: { AgGridVue },
  data() {
    return {
      gridOptions: {},
      columnDefs: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'] },
      rowData: [{
        a: 1, b: 0, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8
      }]
    }
  },
  created() {
    this.columnDefs = [{
      headerName: '启用',
      field: 'bActive',
      cellRenderer: params => {
        // const iconName = !params.data.bActive ? 'grid-icon-enabled' : 'grid-icon-disabled'
        // const color = params.data.bActive ? '#67c23a' : '#e6a23c'
        // return `<svg class="svg-icon" fill="${color}" aria-hidden="true" style="height:1.1em;width:1.1em;">
        //         <use xlink:href="#icon-${iconName}"></use>
        //       </svg>`
        const iconName = !params.data.bActive ? 'icon-zanting' : 'icon-bofang'
        const color = params.data.bActive ? '#67c23a' : '#e6a23c'
        return `<i class="iconfont ${iconName}" style="color: ${color}; font-size: 12px;"></i>`
      }
    },
    // return params.value ? `<svg class="svg-icon" aria-hidden="true" style="height:1em;width:1em;">
    //         <use xlink:href="#icon-right"></use>
    //       </svg>` : ''
    {
      headerName: '币种代码',
      field: 'code',
      cellRenderer: (param) => {
        return param.value ? `<svg class="icon" aria-hidden="true" style="height:1em;width:1em;vertical-align: -0.08em;font-size:14px;"><use xlink:href="#icon-${param.value}"></use></svg> ${param.value}` : ''
        // return param.value ? `<svg class="svg-icon" aria-hidden="true" style="height:1em;width:1em;"><use xlink:href="#icon-huilv-${param.value}"/></svg> ` + param.value : ''
      }
    }, {
      headerName: '货币符号',
      field: 'sign',
      cellRenderer: (param) => {
        return param.value ? param.value : ''
        // return param.value ? `<svg class="svg-icon" aria-hidden="true" style="height:1em;width:1em;"><use xlink:href="#icon-huilv-${param.value}"/></svg> ` + param.value : ''
      }
    }, {
      headerName: '创建人',
      field: 'createByName',
      hide: true
    }, {
      headerName: '备注',
      field: 'remark'
    }]
  },
  beforeMount() {
    this.fetchCurrencyList()
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
    },
    fetchCurrencyList() {
      const self = this
      getCurrencyList({}).then(res => {
        if(res.ok) {
          self.rowData = res.content.list
        }
      })
    }
  }
}
</script>
<style scoped>
  .icon-and-text-buttons {
    display: inline-block;
    width: 68px;
    /*border: 1px solid red;*/
  }
  .icon-and-text-buttons .icon-wrapper, .icon-and-text-buttons .text-wrapper{
    text-align: center;
  }
  .icon-and-text-buttons .icon-wrapper{
    font-size: 40px;
  }
</style>
