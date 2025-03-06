<template>
  <div class="app-main-inner">
    <el-dialog :visible.sync="showEdiContentDialog" title="EDI结果" width="600px" top="10vh">
      <el-input
        v-model="ediContent"
        :rows="8"
        type="textarea"
      />
    </el-dialog>
    <div class="app-main-inner-row">
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptionsLeft"
        :side-bar="sideBarDefsLeft"
        :column-defs="columnDefsLeft"
        :row-clicked="onLeftRowCLick"
        :row-data="rowDataLeft"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReadyLeft"
        style="width:15%;min-width:120px;height:calc(100vh - 200px)"
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
        style="width:85%;height:calc(100vh - 200px)"
        class="ag-theme-balham"
      />
    </div>
    <edi-dialog v-if="isShowEdiViewOrDesignDialog" ref="ediDialog" :params="ediViewOrDesignDialog.params" :is-show="isShowEdiViewOrDesignDialog" @close="closeEdiViewOrDesignDialog" />
    <el-dialog :visible.sync="isShowEdiDialog" title="编辑/新增EDI" width="550px">
      <el-form label-width="90px" label-position="left">
        <el-form-item label="类型">
          <el-input v-model="currentEdiTypeData.chineseName" size="mini" disabled />
        </el-form-item>
        <!--<el-form-item label="模板文件名">-->
        <!--<el-input v-model="oneEdi.templateFileName" size="mini" disabled />-->
        <!--</el-form-item>-->
        <!--<el-form-item label="模板文件路径">-->
        <!--<el-input v-model="oneEdi.templateFilePath" size="mini" disabled />-->
        <!--</el-form-item>-->
        <el-form-item label="渠道名称">
          <el-select
            v-model="oneEdi.typeChannelId"
            size="mini"
          >
            <el-option
              v-for="item in ediDialog.channelList"
              :key="item.typeChannelId"
              :label="item.chineseName"
              :value="item.typeChannelId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="模板性质">
          <el-select
            v-model="oneEdi.templateMode"
            size="mini"
          >
            <el-option
              v-for="item in ediDialog.modeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="中文名">
          <el-input v-model="oneEdi.chineseName" size="mini" />
        </el-form-item>
        <el-form-item label="英文名">
          <el-input v-model="oneEdi.englishName" size="mini" />
        </el-form-item>
        <el-form-item label="报文后缀">
          <el-select
            v-model="oneEdi.ediFileSuffix"
            size="mini"
            filterable
            allow-create
            default-first-option
          >
            <el-option label="TXT" value="txt" />
            <el-option label="XML" value="xml" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="oneEdi.remark" type="textarea" rows="3" size="mini" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-permission="['sys:editemplate:update']" type="primary" size="mini" @click="doneSubmitEdi"> 确定 </el-button>
        <el-button size="mini" @click="isShowEdiDialog = false"> 取消 </el-button>
      </span>
    </el-dialog>

  </div>

</template>
<script>
import { AgGridVue } from 'ag-grid-vue'
import { getEdiTemplateListByType, getEdiTypeList, saveEdi, delEdi, getEdiChannelListByType, getEdiModeListByChannel } from '@/api/edi'
import ediOptBtn from './CellRendererFramework/ediOptBtn'
import ediDialog from '@/components/Cargo/Edi/ediDialog'
export default {
  name: 'EdiTemplateList',
  components: { AgGridVue, ediOptBtn, ediDialog },
  data() {
    return {
      isShowEdiViewOrDesignDialog: false,
      isShowEdiDialog: false,
      ediViewOrDesignDialog: {
        params: {
          templateId: '',
          action: '',
          entityIdList: [],
          entityList: [],
          jobId: ''
        }
      },
      currentEdiTypeData: {},
      ediDialog: {
        channelList: [],
        modeList: []
      },
      oneEdi: {
        channelName: '',
        id: '',
        bSystem: false,
        chineseName: '',
        ediFileSuffix: '',
        code: '',
        englishName: '',
        templateMode: '',
        templateModeDesc: '',
        typeChannelId: '',
        typeName: ''
      },
      initOneEdi: {},
      ediContent: '',
      showEdiContentDialog: false,
      repDialogVisible: false,
      gridOptionsLeft: {},
      gridApiLeft: {},
      gridOptionsRight: {},
      columnDefsLeft: null,
      columnDefsRight: null,
      sideBarDefsLeft: false,
      sideBarDefsRight: false,
      rowDataLeft: [],
      rowDataRight: []
    }
  },
  created() {
    const self = this
    self.initOneEdi = { ...(self.oneEdi) }
    self.gridOptionsRight = {
      suppressRowClickSelection: true,
      context: {
        componentParent: self
      }
    }
    this.columnDefsLeft = [
      {
        headerName: 'EDI类型',
        field: 'chineseName',
        cellRenderer: params => {
          const typeCode = params.data.code
          return `<svg class="svg-icon" aria-hidden="true" style="height:1.1em;width:1.1em;">
                <use xlink:href="#icon-EDI-${typeCode}"></use>
              </svg> ${params.value}`
        }
      }]

    this.columnDefsRight = [
      {
        headerName: 'ID',
        field: 'id',
        hide: true
      }, {
        headerName: '渠道名称',
        field: 'channelName'
      }, {
        headerName: '中文名',
        field: 'chineseName'
      }, {
        headerName: '英文名',
        field: 'englishName'
      }, {
        headerName: '模板性质',
        field: 'templateModeDesc'
      }, {
        headerName: '模板文件名',
        field: 'templateFileName',
        hide: true
      }, {
        headerName: '报文后缀',
        field: 'ediFileSuffix'
      }, {
        headerName: '备注',
        field: 'remark'
      }, {
        headerName: '操作', pinned: 'right', field: `id`, width: 400,
        cellRendererFramework: 'ediOptBtn'
      }]
  },
  beforeMount() {
    this.fetchPageData()
  },
  methods: {
    onReadyLeft(params) {
      // this.gridApiLeft = params.api
      params.api.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          params.api.sizeColumnsToFit()
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
    fetchPageData() {
      this.getEdiTemplateType()
      getEdiModeListByChannel().then(res => {
        if (res.ok) {
          this.ediDialog.modeList = res.content
        } else {
          return Promise.reject(res.message)
        }
      }).catch((err) => {
        this.$message.error(err)
      })
    },
    getEdiTemplateType() {
      const self = this
      getEdiTypeList().then(res => {
        if (res.ok) {
          self.rowDataLeft = res.content
          this.currentEdiTypeData = { ...self.rowDataLeft[0] }
          this.getEdiTemplateListByType(this.currentEdiTypeData.code, this.currentEdiTypeData)
        } else {
          return Promise.reject(res.message)
        }
      }).catch((err) => {
        this.$message.error(err)
      })
    },
    getEdiTemplateListByType(code, typeData) {
      getEdiTemplateListByType(code).then(res => {
        if (res.ok) {
          if (res.content.list.length <= 0) {
            this.rowDataRight = [{ ...this.initOneEdi }]
          } else {
            this.rowDataRight = res.content.list
          }
          if (typeData) {
            this.currentEdiTypeData = { ...typeData }
          }
        } else {
          return Promise.reject(res.message)
        }
      }).catch((err) => {
        this.$message.error(err)
      })
    },
    onLeftRowCLick(params) {
      this.getEdiTemplateListByType(params.data.code, params.data)
    },
    initEdiDialogData() {
      return getEdiChannelListByType(this.currentEdiTypeData.code).then(res => {
        this.ediDialog.channelList = res.content
      }).catch(err => {
        return Promise.reject(err)
      })
    },
    popAddEdiFormDialog(templateTypeCode) {
      this.initEdiDialogData().then(() => {
        templateTypeCode = templateTypeCode || this.currentEdiTypeData.code
        this.oneEdi = { ...this.initOneEdi, templateTypeCode }
        this.isShowEdiDialog = true
      }).catch(err => {
        return this.$message.error(err)
      })
    },
    popCopyEdiFormDialog(data) {
      this.initEdiDialogData().then(() => {
        this.oneEdi = { ...data, id: '' }
        this.isShowEdiDialog = true
      }).catch(err => {
        this.$message.error(err)
      })
    },
    popEditEdiFormDialog(data) {
      this.initEdiDialogData().then(() => {
        this.oneEdi = { ...data }
        this.isShowEdiDialog = true
      }).catch(err => {
        this.$message.error(err)
      })
    },
    delEdi(id) {
      return delEdi(id).then(res => {
        this.$message.success('删除成功')
      }).then(() => {
        this.getEdiTemplateListByType(this.currentEdiTypeData.code)
      }).catch((err) => {
        this.$message.error(err)
      })
    },
    submitEdi() {
      if (this.oneEdi.id) {
        return saveEdi(this.oneEdi, this.oneEdi.id)
      } else {
        return saveEdi(this.oneEdi)
      }
    },
    doneSubmitEdi() {
      this.submitEdi().then(res => {
        this.isShowEdiDialog = false
        this.$message.success('操作成功')
        this.getEdiTemplateListByType(this.currentEdiTypeData.code)
      }).catch(err => {
        this.$message.error(err)
      })
    },
    toShowEdi(templateId, action) {
      this.isShowEdiViewOrDesignDialog = true
      this.ediViewOrDesignDialog.params = { ...this.ediViewOrDesignDialog.params, templateId, action }
    },
    toDesignEdi(templateId, action) {
      this.isShowEdiViewOrDesignDialog = true
      this.ediViewOrDesignDialog.params = { ...this.ediViewOrDesignDialog.params, templateId, action }
    },
    closeEdiViewOrDesignDialog() {
      this.isShowEdiViewOrDesignDialog = false
    }
  }
}
</script>
<style scoped>
</style>
