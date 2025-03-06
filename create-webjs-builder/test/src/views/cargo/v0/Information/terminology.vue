<template>
  <div class="app-main-inner">
    <div class="app-main-inner-row">
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptionsLeft"
        :side-bar="sideBarDefsLeft"
        :column-defs="columnDefsLeft"
        :row-clicked="onRowCLicked"
        :row-data="rowDataLeft"
        :enable-sorting="true"
        :grid-ready="onReadyLeft"
        style="width:350px;min-width:350px;height:calc(100vh - 200px)"
        class="ag-theme-balham"
      />
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptionsRight"
        :side-bar="sideBarDefsRight"
        :column-defs="columnDefsRight"
        :row-data="rowDataRight"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReadyRight"
        style="width:calc(100% - 350px);height:calc(100vh - 200px)"
        class="ag-theme-balham"
      />
    </div>
    <el-dialog :visible.sync="isShowingTerminologyForm" title="行业术语表单" width="600px" top="10vh">
      <el-form :model="oneTerminology" label-width="90px" label-position="left">
        <div v-show="1===2" style="display: flex;justify-content: space-between;">
          <div style="width: 50%;">
            <el-form-item label="序号">
              <el-input-number v-model="oneTerminology.seqNo" :min="1" size="mini" controls-position="right" />
            </el-form-item>
          </div>
          <div style="width:calc(50% + 10px);padding-left:10px;">
            <el-form-item label="" style="margin-left: -90px;">
              <el-checkbox v-model="oneTerminology.beActive" size="mini">启用</el-checkbox>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="业务类别">
          <el-input v-model="currentTypeCodeDesc" disabled size="mini" />
        </el-form-item>
        <el-form-item label="code">
          <el-input v-model="oneTerminology.code" size="mini" />
        </el-form-item>
        <el-form-item label="项值(中文)">
          <el-input v-model="oneTerminology.chineseName" size="mini" />
        </el-form-item>
        <el-form-item label="项值(英文)">
          <el-input v-model="oneTerminology.englishName" size="mini" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="oneTerminology.remark" rows="3" size="mini" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-permission="['mdm:term:update']" size="mini" type="primary" @click="submitTerminology">保存</el-button>
        <el-button size="mini" @click="isShowingTerminologyForm = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue'
import { getTerminologyListByType, getTerminologyById, getTerminologyTypeList, switchTerminologyStatus, saveTerminology, delTerminology } from '@/api/terminology'
import terminologyOptBtn from './CellRendererFramework/terminologyOptBtn'

export default {
  name: 'Terminology',
  components: { AgGridVue, terminologyOptBtn },
  data() {
    return {
      seqNo: 1,
      currentTypeCode: '',
      currentTypeCodeDesc: '',
      gridOptionsLeft: { rowData: [] },
      gridApiLeft: {},
      gridOptionsRight: {},
      columnDefsLeft: null,
      columnDefsRight: null,
      sideBarDefsLeft: false,
      sideBarDefsRight: false,
      rowDataLeft: [],
      rowDataRight: [],
      isShowingTerminologyForm: false,
      oneTerminology: { id: '', termCode: '', seqNo: '', chineseName: '', englishName: '', beActive: '', remark: '', code: '' },
      initOneTerminology: {}
    }
  },
  created() {
    const self = this
    self.initOneTerminology = { ...(self.oneTerminology) }
    const autoGroupColumnDef = {
      headerName: '行业类别',
      width: 180,
      field: 'termTypeDesc',
      cellRendererParams: {
        innerRenderer: (params) => {
          let icon, color, text
          if (params.node.group) {
            text = params.node.key
          } else {
            // return params.data[params.colDef.field]
            text = ''
          }
          switch (text) {
            case '海运出口':
              icon = 'icon-ship-baochuan'
              color = '#1e87ff'
              break
            case '海运进口':
              icon = 'icon-ship-baochuan'
              color = '#228B22'
              break
            case '空运出口':
              icon = 'icon-kongyun'
              color = '#228B22'
              break
            case '空运进口':
              icon = 'icon-kongyun'
              color = '#FF1493'
              break
            case '财务结算':
              icon = 'icon-shuzihuobi'
              color = '#800080'
              break
            case '业务通用':
              icon = 'icon-contentleft'
              color = '#800080'
              break
          }
          const str = text ? `<i class="iconfont ${icon}" style="color: ${color}; font-size: 12px;"></i> ${text}` : ''
          // const str = text ? `<svg class="svg-icon" aria-hidden="true" fill="${color}" style="height:1em;width:1em;">
          //       <use xlink:href="#icon-${icon}"></use>
          //     </svg>${text}` : ''
          return str
        }
      }
      // headerCheckboxSelection: true
      // headerCheckboxSelectionFilteredOnly: true,
      // cellRenderer: 'agGroupCellRenderer',
      // cellRendererParams: {
      //   checkbox: true
      // }
    }
    self.gridOptionsLeft = {
      groupSelectsChildren: false,
      animateRows: true,
      enableRangeSelection: true,
      enableSorting: true,
      groupDefaultExpanded: -1,
      groupMultiAutoColumn: true,
      autoGroupColumnDef: autoGroupColumnDef
    }
    self.gridOptionsRight = {
      suppressRowClickSelection: true,
      context: {
        componentParent: self
      }
    }
    this.columnDefsLeft = [
      {
        headerName: '行业类别',
        field: 'termTypeDesc',
        rowGroup: true,
        hide: true,
        width: 150
      },
      {
        headerName: '行业术语项',
        field: 'chineseName',
        width: 150
      }]
    this.columnDefsRight = [
      // {
      //   headerName: '#', width: 55, pinned: 'left',
      //   suppressSorting: true, checkboxSelection: true,
      //   suppressMenu: true, suppressSizeToFit: true, suppressResize: true
      // },
      {
        headerName: '序号',
        field: 'seqNo',
        width: 80,
        valueGetter: params => {
          console.log('======params.===', params)
          return params.node.rowIndex + 1
        },
        hide: true
      }, {
        headerName: '是否启用',
        field: 'bActive',
        cellRenderer: params => {
          if (params.data.id) {
            // const iconName = !params.data.bActive ? 'grid-icon-enabled' : 'grid-icon-disabled'
            // const color = params.data.bActive ? '#67c23a' : '#e6a23c'
            // return `<svg class="svg-icon" fill="${color}" aria-hidden="true" style="height:1.1em;width:1.1em;">
            //     <use xlink:href="#icon-${iconName}"></use>
            //   </svg>`
            const iconName = !params.data.bActive ? 'icon-zanting' : 'icon-bofang'
            const color = params.data.bActive ? '#67c23a' : '#e6a23c'
            return `<i class="iconfont ${iconName}" style="color: ${color}; font-size: 12px;"></i>`
          } else {
            return ''
          }
        }
      }, {
        headerName: '不可编辑',
        field: 'bUserDefined',
        valueGetter: params => {
          if (params.data.id) {
            return params.data.bUserDefined ? '可编辑' : '不可编辑'
          }
          return ''
        }
      }, {
        headerName: '项值(中文)',
        field: 'chineseName'
      }, {
        headerName: '项值(英文)',
        field: 'englishName'
      }, {
        headerName: '备注',
        field: 'remark'
      }, {
        headerName: '操作', pinned: 'right', field: `bActive`, width: 400,
        cellRendererFramework: 'terminologyOptBtn'
      }]
  },
  beforeMount() {
    this.pageLoad()
  },
  methods: {
    onReadyLeft(params) {
      const self = this
      // this.gridApiLeft = params.api
      // params.api.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          self.onFirstDataRendered(self.gridOptionsLeft)
        })
      })
    },
    onReadyRight(params) {
      params.api.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          params.api.sizeColumnsToFit()
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
    pageLoad() {
      const self = this
      getTerminologyTypeList().then(res => {
        if(res.ok) {
          self.rowDataLeft = res.content
          if (self.rowDataLeft.length > 0) {
            const oneRowCode = self.rowDataLeft[0].code
            self.gridOptionsLeft.api.forEachNode(function(node) {
              console.log('node.data.code', node.data)
              if (node.data.code === oneRowCode) {
                node.setSelected(true, true)
                self.currentTypeCode = node.data.code
                self.currentTypeCodeDesc = node.data.termTypeDesc + '-' + node.data.chineseName
              }
            })
            self.fetchTerminologyListByType(oneRowCode)
          }
        }
      })
    },
    fetchTerminologyListByType(termCode) {
      const self = this
      return getTerminologyListByType(termCode || this.currentTypeCode).then(res => {
        console.log('===')
        if (res.ok) {
          console.log('res.content.length', res.content)

          if (res.content && res.content.length <= 0) {
            self.rowDataRight = [{ ...this.initOneTerminology }]
            console.log('self.rowDataRight', self.rowDataRight)
          } else {
            self.rowDataRight = res.content
          }
        }
      })
    },
    onRowCLicked(params) {
      const self = this
      console.log(params)
      this.fetchTerminologyListByType(params.data.code).then(res => {
        self.currentTypeCode = params.data.code
        self.currentTypeCodeDesc = params.data.termTypeDesc + '-' + params.data.chineseName
        params.node.setSelected(true, true)
      })
    },
    delTerminology(id) {
      const self = this
      delTerminology(id).then(res => {
        this.fetchTerminologyListByType(self.currentTypeCode)
      })
    },
    /**
     *
     * @param id rowData 的id
     * @param termCode 有值为添加，没有为编辑
     */
    popTerminologyFormDialog(id) {
      const self = this
      if (!id) {
        self.oneTerminology = { ...(self.initOneTerminology), ...{ termCode: this.currentTypeCode }}
        self.isShowingTerminologyForm = true
      } else {
        getTerminologyById(id).then(res => {
          if(res.ok) {
            self.oneTerminology = res.content
            self.isShowingTerminologyForm = true
          }
        })
      }
    },
    addTerminology() {
      return saveTerminology(this.oneTerminology).then(res => {
        this.isShowingTerminologyForm = false
        this.$message({ message: '保存成功', type: 'success' })
      }).then(() => {
        this.fetchTerminologyListByType(this.currentTypeCode)
      })
    },
    editTerminology() {
      const id = this.oneTerminology.id
      return saveTerminology(this.oneTerminology, id).then(res => {
        this.isShowingTerminologyForm = false
        this.$message({ message: '编辑成功', type: 'success' })
      }).then(() => {
        this.fetchTerminologyListByType(this.currentTypeCode)
      })
    },
    submitTerminology() {
      if (this.oneTerminology.id) {
        return this.editTerminology()
      } else {
        return this.addTerminology()
      }
    },
    switchTerminologyStatus(id, bActive) {
      const self = this
      switchTerminologyStatus(id, bActive).then(res => {
        if (res.ok) {
          this.fetchTerminologyListByType(self.currentTypeCode)
        } else {
          self.$message.warning('状态变更失败')
        }
      })
    }
  }
}
</script>
<style scoped>
</style>
