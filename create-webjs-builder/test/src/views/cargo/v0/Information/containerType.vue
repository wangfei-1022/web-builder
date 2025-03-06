<template>
  <div class="app-main-inner">
    <div style="padding: 10px; ">
      <div class="search-bar" style="background-color: #f5f7f7;display: flex; justify-content: space-between;height:40px;">
        <div class="search-bar-left" style="padding-top: 6px;padding-left:20px;" />
        <div class="search-bar-right" style="display: flex;padding-top: 6px;">
          <div>
            <el-button size="mini" @click="isShowingMoreSearchCondition=!isShowingMoreSearchCondition">更多条件<i :class="isShowingMoreSearchCondition?'el-icon-arrow-up el-icon--right':'el-icon-arrow-down el-icon--right'" /></el-button>
          </div>
        </div>
      </div>
    </div>
    <div v-show="isShowingMoreSearchCondition" class="app-main-inner-row" style="padding-bottom: 10px;">
      <div class="filters">
        <el-form :inline="true" label-width="90px" label-position="left">
          <div class="el-form-item-wrapper">
            <el-form-item label="尺寸"><el-input v-model="searchConditions.sizeCode" size="mini" /></el-form-item>
            <el-form-item label="箱型代码"><el-input v-model="searchConditions.typeCode" size="mini" /></el-form-item>
          </div>
        </el-form>
      </div>
      <div class="triggers">
        <div><el-button size="mini" style="width:100%" @click="toQuery">查询</el-button></div>
        <!--<div style="margin: 6px 0"><el-button size="mini">追加查询</el-button></div>-->
        <!--<div style="display:flex;justify-content:space-around;font-size:21px;color:#b2b5bc;">-->
        <!--<svg-icon icon-class="chaxun-peizhi" />-->
        <!--<svg-icon icon-class="chaxun-qingchu" />-->
        <!--<svg-icon icon-class="chaxun-shousuo" />-->
        <!--</div>-->
      </div>
    </div>
    <div style="padding: 10px;display: none">
      <div class="search-bar" style="background-color: #f5f7f7;display: flex; justify-content: space-between;height:40px;">
        <div class="search-bar-left" style="padding-top: 6px;padding-left:20px;">
          <el-button type="primary" size="mini">新建</el-button>
          <el-button type="success" size="mini">保存</el-button>
          <el-button type="danger" size="mini">删除</el-button>
        </div>
        <div class="search-bar-right" style="padding-top: 6px;">
          <el-button type="primary" size="mini">导入</el-button>
          <el-button type="primary" size="mini">导出</el-button>
        </div>
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
        :first-data-rendered="onFirstDataRendered"
        :pagination="true"
        :pagination-auto-page-size="true"
        style="width: 100%;height:calc(100vh - 320px);"
        class="ag-theme-balham"
      />
    </div>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import { getContainerTypeList, switchContainerTypeStatus } from '@/api/containerType'
import containerTypeOperateButton from './CellRendererFramework/containerTypeOperateButton'

export default {
  name: 'ContainerType',
  components: { AgGridVue, containerTypeOperateButton },
  data() {
    return {
      searchConditions: {
        sizeCode: '',
        typeCode: ''
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
    const self = this
    this.gridOptions = {
      rowClassRules: {
        'grid-row-zebra-even': function(params) {
          return !(params.rowIndex % 2)
        },
        'grid-row-zebra-odd': function(params) {
          return (params.rowIndex % 2)
        }
      },
      rowSelection: 'single',
      suppressRowClickSelection: true,
      context: {
        componentParent: self
      }
    }
    this.columnDefs = [{
      headerName: '是否启用',
      field: 'bActive',
      cellRenderer: params => {
        const iconName = !params.data.bActive ? 'icon-zanting' : 'icon-bofang'
        const color = params.data.bActive ? '#67c23a' : '#e6a23c'
        return `<i class="iconfont ${iconName}" style="color: ${color}; font-size: 12px;"></i>`
        // const iconName = !params.data.bActive ? 'grid-icon-enabled' : 'grid-icon-disabled'
        // const color = params.data.bActive ? '#67c23a' : '#e6a23c'
        // return `<svg class="svg-icon" fill="${color}" aria-hidden="true" style="height:1.1em;width:1.1em;">
        //         <use xlink:href="#icon-${iconName}"></use>
        //       </svg>`
      }
    }, {
      headerName: '中文简称',
      field: 'chineseName'
    }, {
      headerName: '英文简称',
      field: 'englishName'
    }, {
      headerName: '高_英制',
      field: 'heightBritish',
      hide: true
    }, {
      headerName: '高_公制',
      field: 'heightMetric',
      hide: true
    }, {
      headerName: '长_英制',
      field: 'lengthBritish',
      hide: true
    }, {
      headerName: '长_公制',
      field: 'lengthMetric',
      hide: true
    }, {
      headerName: '最大重量',
      field: 'maxWeight',
      hide: true
    }, {
      headerName: '最大体积',
      field: 'maxVolumn',
      hide: true
    }, {
      headerName: '尺寸代码',
      field: 'sizeCode',
      hide: true
    }, {
      headerName: 'TEU', // 拆算20箱量
      field: 'teu',
      hide: true
    }, {
      headerName: 'FEU', // 拆算40箱量
      field: 'feu',
      hide: true
    }, {
      headerName: '箱型中文名',
      field: 'typeChineseName',
      hide: true
    }, {
      headerName: '箱型代码',
      field: 'typeCode',
      hide: true
    }, {
      headerName: '箱型英文名',
      field: 'htypeEnglishName',
      hide: true
    }, {
      headerName: '可装票数',
      field: 'jobNumber',
      hide: true
    }, {
      headerName: 'ISO代码/95码',
      field: 'isoCode'
    }, {
      headerName: '皮重',
      field: 'weight',
      hide: true
    }, {
      headerName: '宽_英制',
      field: 'widthBritish',
      hide: true
    }, {
      headerName: '宽_公制',
      field: 'widthMetric',
      hide: true
    }, {
      headerName: '创建人',
      field: 'createBy',
      hide: true
    }, {
      headerName: '创建日期',
      field: 'createTime',
      hide: true
    }, {
      headerName: '更新人',
      field: 'updateBy',
      hide: true
    }, {
      headerName: '更新日期',
      field: 'updateTime',
      hide: true
    }, {
      headerName: '备注',
      field: 'remark'
    }, {
      headerName: '操作', pinned: 'right', field: `bActive`, width: 400,
      cellRendererFramework: 'containerTypeOperateButton'
    }]
  },
  mounted() {

  },
  beforeMount() {
    this.fetchContainerTypeList()
  },
  methods: {
    onReady(params) {
      const self = this
      window.addEventListener('resize', function() {
        setTimeout(function() {
          self.onFirstDataRendered()
        })
      })
    },
    onFirstDataRendered() {
      const self = this
      const allColumnIds = []
      self.gridOptions.columnApi.getAllColumns().forEach(function(column) {
        allColumnIds.push(column.colId)
      })
      setTimeout(function() {
        self.gridOptions.columnApi.autoSizeColumns(allColumnIds)
      })
    },
    fetchContainerTypeList() {
      getContainerTypeList(this.searchConditions).then(res => {
        if(res.ok) {
          this.rowData = res.content.list
        }
      })
    },
    switchContainerTypeStatus(id, bActive) {
      switchContainerTypeStatus(id, bActive).then(res => {
        if(res.ok) {
          this.fetchContainerTypeList()
          this.$message.success('集装箱型状态变更成功')
        }
      })
    },
    toQuery() {
      this.fetchContainerTypeList()
    }
  }

}
</script>
<style>

</style>
