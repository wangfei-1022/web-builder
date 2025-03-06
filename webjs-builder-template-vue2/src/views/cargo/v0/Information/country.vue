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
            <el-form-item label="国家代码"><el-input size="mini" /></el-form-item>
            <el-form-item label="国家名称"><el-input size="mini" /></el-form-item>
          </div>
        </el-form>
      </div>
      <div class="triggers">
        <div><el-button size="mini" style="width:100%">查询</el-button></div>
        <div style="margin: 6px 0"><el-button size="mini">追加查询</el-button></div>
        <div style="display:flex;justify-content:space-around;font-size:21px;color:#b2b5bc;">
          <svg-icon icon-class="chaxun-peizhi" />
          <svg-icon icon-class="chaxun-qingchu" />
          <svg-icon icon-class="chaxun-shousuo" />
        </div>
      </div>
    </div>
    <div style="padding: 10px;">
      <div v-if="isShowSearchBar" class="search-bar" style="background-color: #f5f7f7;display: flex; justify-content: space-between;height:40px;">
        <div class="search-bar-left" style="padding-top: 6px;padding-left:20px;">
          <el-button type="primary" size="mini">新建</el-button>
          <el-button type="warning" size="mini">删除</el-button>
          <el-button type="success" size="mini">导入</el-button>
          <el-button type="success" size="mini">导出</el-button>
        </div>
        <div class="search-bar-right" style="">
          <el-button type="primary" size="mini">打印</el-button>
        </div>
      </div>
    </div>
    <div class="app-main-inner-row">
      <div style="width:15%;min-width:190px;height:600px;border:1px solid #ccc;display: flex;flex-direction: column;cursor: pointer">
        <div v-for="country in countryList" :key="country" :class="{'country-bg':currentCountrycode===country.code2}" @click="getDivisionByCountry(country.code2)">{{ country.chineseName }}</div>
      </div>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnDefs"
        :row-data="rowData"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        style="width: 85%;height:600px"
        class="ag-theme-balham"
      />
    </div>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import { getCountryList } from '@/api/country'
// getDivisionById
import { getDivisionByCountry, getAllDivisionList, loadDetailInitInfo, switchDivisionStatus, saveDivision, delDivision } from '@/api/division'
import divisionManagementOperateButtonCellRendererFramework from './CellRendererFramework/divisionOperateButtonCellRendererFramework'
export default {
  name: 'Country',
  components: { AgGridVue, divisionManagementOperateButtonCellRendererFramework },
  data() {
    return {
      currentCountrycode: '',
      countryList: [],
      isShowSearchBar: false,
      gridOptions: {},
      columnDefs: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      rowData: [],
      isShowingMoreSearchCondition: false,
      isShowingDivisionForm: false,
      oneDivision: { id: '', chineseName: '', code: '', countryCode: '', divisionCode: '', englishName: '', level: '', parentId: '', remark: '' },
      initOneDivision: { id: '' }
    }
  },
  computed: {

  },
  created() {
    const self = this
    self.initOneDivision = { ...(self.oneDivision) }
    self.gridOptions = { ...(self.gridOptions),
      ...{
        rowClassRules: {
          'grid-row-zebra-even': function(params) {
            return !(params.rowIndex % 2)
          },
          'grid-row-zebra-odd': function(params) {
            return (params.rowIndex % 2)
          }
        },
        context: {
          componentParent: self
        },
        suppressRowClickSelection: true,
        animateRows: true,
        enableRangeSelection: true,
        enableSorting: true,
        groupDefaultExpanded: -1,
        groupMultiAutoColumn: true
        // rowGroupPanelShow: 'always'
      }}
    this.columnDefs = [{
      headerName: '名称',
      field: 'chineseName'
    }, {
      headerName: '国家代码',
      field: 'code'
    }, {
      headerName: '名称(英)',
      field: 'englishName'
    }, {
      headerName: '创建人',
      field: 'createBy'
    }, {
      headerName: '创建日期',
      field: 'createTime'
    }, {
      headerName: '更新人',
      field: 'updateBy'
    }, {
      headerName: '更新日期',
      field: 'updateTime'
    }, {
      headerName: '操作', pinned: 'right', field: `bActive`, width: 400,
      cellRendererFramework: 'divisionManagementOperateButtonCellRendererFramework'
    }]
  },
  mounted() {

  },
  beforeMount() {
    const self = this
    Promise.all([getCountryList(), getAllDivisionList()]).then(results => {
      self.countryList = results[0].data.content.list
      self.rowData = results[1].data.content
    })
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
    getDivisionByCountry(countryCode) {
      const self = this
      self.currentCountrycode = countryCode
      getDivisionByCountry(countryCode).then(res => {
        if(res.ok) {
          self.rowData = res.content
        }
      })
    },
    fetchDivisionList() {
      const self = this
      getAllDivisionList().then(res => {
        if(res.ok) {
          self.rowData = res.content.list
        }
      })
    },
    delDivision(id) {
      const self = this
      delDivision(id).then(res => {
        self.$message({ type: 'info', message: '删除成功' })
      }).then(() => {
        this.fetchDivisionList()
      })
    },
    popDivisionFormDialog(id, opt) {
      const self = this
      loadDetailInitInfo().then(res => {
        if (opt === 'add') {
          self.$message.success('add')
        } else if (opt === 'edit') {
          self.$message.success('edit')
        }
      })
    },
    addDivision() {
      return saveDivision(this.oneDivision).then(res => {
        if (res.ok) {
          this.isShowingDivisionForm = false
          this.$message({ message: '保存费用项信息成功', type: 'success' })
        }
      }).then(() => {
        this.fetchDivisionList()
      })
    },
    editDivision() {
      const id = this.oneDivision.id
      return saveDivision(this.oneDivision, id).then(res => {
        if (res.ok) {
          this.isShowingDivisionForm = false
          this.$message({ message: '编辑费用信息成功', type: 'success' })
        }
      }).then(() => {
        this.fetchDivisionList()
      })
    },
    submitDivision() {
      if (this.oneDivision.id) {
        return this.editDivision()
      } else {
        return this.addDivision()
      }
    },
    switchDivisionStatus(id, bActive) {
      const self = this
      switchDivisionStatus(id, bActive).then(res => {
        if (res.ok) {
          self.fetchDivisionList()
        } else {
          self.$message.warning('费用项状态变更失败')
        }
      })
    }
  }

}
</script>
<style scoped>
  .country-bg{
    background: #d8d8d8;
  }
</style>
