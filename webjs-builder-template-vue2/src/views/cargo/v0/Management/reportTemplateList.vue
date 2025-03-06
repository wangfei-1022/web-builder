<template>
  <div class="app-main-inner">
    <div class="flex-box pl-16 mt-10">
      <div class="left-width flex-between">
        <div />
      </div>
      <div class="right-width">
        <div class="flex-box  ">
          <span>名称：</span>
          <el-input
            v-model.trim="filterText"
            class="w-150"
            size="mini"
            @change="getReportTemplateList(currentReportTypeRowData.code)"
            @keydown.enter="getReportTemplateList(currentReportTypeRowData.code)"
          />
        </div>
      </div>
    </div>
    <div class="app-main-inner-row" @click="handleMenu(reportTypeList)">
      <div style="width:320px;height:calc(100vh - 200px);border: 2px solid gainsboro;overflow:auto;">
        <el-tree :data="reportTypeList" :props="defaultProps" :highlight-current="1===1" accordion @node-click="handleLeftNodeClick">
          <template slot-scope="scope">
            <span style="position:relative" @click="handleMenu(reportTypeList)">
              <!-- <svg-icon :icon-class="scope.node.childNodes.length>0 ? 'report-template-category-icon' : 'report-template-icon'" /> -->
              <i :class="['iconfont', scope.node.childNodes.length>0 ? 'icon-wenjianjia' : 'icon-wenjian']" style="color: #00C4FF;" />
              <span class="tree-label" @contextmenu.prevent.stop="showSettingsMenu($event,scope.data)"> {{ scope.data.chineseName }}</span>
              <div v-if="scope.data.showMenu" class="showMenu" :style="{top:menuPage.y,left:menuPage.x}" :class="scope.data.isLast ? 'top': ''">
                <div v-if="scope.node.level==1" v-permission="['cfg:template:type:add']" class="btn-item" @click.prevent.stop="addNode(null,false)">
                  <i class="el-icon-circle-plus mr-4" />
                  新增
                </div>
                <div v-if="scope.node.level==1" v-permission="['cfg:template:type:add']" class="btn-item" @click.prevent.stop="addNode(scope,false)">
                  <i class="el-icon-circle-plus mr-4" />
                  新增子项
                </div>
                <div v-permission="['cfg:template:type:update']" class="btn-item" type="text" size="mini" @click.prevent.stop="addNode(scope,true)">
                  <i class="el-icon-edit mr-4" />
                  编辑</div>
                <div v-permission="['cfg:template:type:del']" class="btn-item" type="text" size="mini" @click.prevent.stop="del(scope)">
                  <i class="el-icon-delete mr-4" />
                  删除</div>
              </div>
            </span>
          </template>
        </el-tree>
      </div>
      <div style="width:calc(100% - 320px);height:calc(100vh - 130px)">
        <ag-grid-vue
          :locale-text-func="_i18nGridLocalText"
          :grid-options="gridOptionsRight"
          :side-bar="sideBarDefsRight"
          :column-defs="columnDefsRight"
          :row-data="rowDataRight"
          :enable-col-resize="true"
          :enable-sorting="true"
          :grid-ready="onReadyRight"
          style="width:100%;height:calc(100vh - 200px)"
          class="ag-theme-balham"
        />
      </div>

    </div>
    <el-dialog :visible.sync="isShowReportDialog" title="编辑/新增模板" width="550px">
      <el-form v-if="isShowReportDialog" ref="formData" label-width="90px" label-position="left" :rules="rules" :model="oneReport">
        <el-form-item label="类型">
          <el-input v-model="currentReportTypeRowData.chineseName" disabled />
        </el-form-item>
        <el-form-item label="中文名" prop="chineseName">
          <el-input v-model="oneReport.chineseName" maxlength="50" />
        </el-form-item>
        <el-form-item label="英文名" prop="englishName">
          <el-input v-model="oneReport.englishName" maxlength="50" />
        </el-form-item>
        <el-form-item label="编号" prop="code">
          <el-input v-model.trim="oneReport.code" maxlength="30" :disabled="$isNotEmpty(oneReport.id)" />
        </el-form-item>
        <el-form-item label="会员名称">
          <el-select v-model.trim="oneReport.memberId" placeholder="请选择会员名称" class="w-full" :disabled="$isNotEmpty(oneReport.id)">
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.chineseName"
              :value="item.id"
            />
          </el-select></el-form-item>
        <el-form-item label="备注">
          <el-input v-model="oneReport.remark" type="textarea" rows="3" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-permission="['cfg:template:update']" type="primary" size="mini" :disabled="loading" @click="doneSubmitReport"> 确定 </el-button>
        <el-button size="mini" @click="isShowReportDialog = false"> 取消 </el-button>
      </span>
    </el-dialog>
    <ReportTypeDialog :id="id" :parent="parent" :visible.sync="dialogVisible" @saved="fetchPageData" />

  </div>
</template>
<script>
import reportOptBtn from './CellRendererFramework/reportOptBtn'
import { getReportTemplateTypeList, getReportTemplateList, saveReport, delReport, delReportType } from '@/api/report'
import companySelect from '@/components/Cargo/Sys/companySelect'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'
import ReportTypeDialog from './components/reportTypeDialog'
import { getAuthListApi } from '@/api/partner/member'
export default {
  name: 'ReportTemplateList',
  components: { reportOptBtn, companySelect, cargoLimitedSelect, ReportTypeDialog },
  data() {
    return {
      loading: false,
      id: null,
      dialogVisible: false,
      reportTypeList: [],
      filterText: '',
      defaultProps: {
        children: 'childNodes',
        label: 'chineseName'
      },
      currentReportTypeRowData: {},
      isShowReportDialog: false,
      gridOptionsRight: {},
      columnDefsRight: null,
      sideBarDefsRight: false,
      rowDataRight: [],
      oneReport: {
        chineseName: '',
        englishName: '',
        id: '',
        templateTypeCode: '',
        code: '',
        memberName: '',
        memberId: null
      },
      initReport: {},
      rowTree: {},
      parent: {},
      userList: [],
      rules: {
        chineseName: [{ required: true, message: '请输入中文名称', trigger: 'change' }],
        englishName: [{ required: true, message: '请输入英文名称', trigger: 'change' }],
        code: [
          { required: true, message: '请输入编号', trigger: 'change' },
          { validator: this.$validators.validUpperCase, message: '请输入大写英文', trigger: 'change' }
        ]
      },
      menuPage: {
        x: 0,
        y: 0
      }
    }
  },
  created() {
    const self = this
    self.initOneReport = { ...(self.oneReport) }
    self.gridOptionsRight = {
      suppressRowClickSelection: true,
      context: {
        componentParent: self
      }
    }
    this.columnDefsRight = [
      {
        headerName: 'ID',
        field: 'id',
        hide: true
      }, {
        headerName: '中文名',
        field: 'chineseName'
      }, {
        headerName: '英文名',
        field: 'englishName'
      }, {
        headerName: '模板文件名',
        field: 'templateFileName',
        hide: true
      }, {
        headerName: '备注',
        field: 'remark'
      }, {
        headerName: '操作', pinned: 'right', field: `id`, width: 400,
        cellRendererFramework: 'reportOptBtn'
      }]
  },
  beforeMount() {
    this.fetchPageData()
  },
  methods: {
    showSettingsMenu(event, data) {
      this.menuPage.x = (event.pageX - event.offsetX + 10) + 'px'
      this.menuPage.y = (event.pageY - event.offsetY + 15) + 'px'
      // 处理边界问题
      // if (data.isLast && data.isPNode) {
      //   this.menuPage.y = (event.pageY - event.offsetY - 100) + 'px'
      // } else {
      //   this.menuPage.y = (event.pageY - event.offsetY + 15) + 'px'
      // }
      this.handleMenu(this.reportTypeList)
      event.preventDefault()
      data.showMenu = true
    },
    /**
     * 新增类型
     */
    addNode(node, isEdit) {
      if (node) {
        this.parent = {
          parentName: node.data.chineseName,
          parentCode: node.data.code
        }
        if (isEdit) {
          this.id = node.data.id
        } else {
          this.id = null
        }
      } else {
        this.id = null
        this.parent = {
          parentName: '根节点',
          parentCode: '0'
        }
      }
      this.dialogVisible = true
    },
    /**
     * 删除子类型
     */
    async del(row) {
      this.$confirm('删除数据不可恢复，是否确定？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delReportType(row.data.id).then(res => {
          this.fetchPageData()
          this.$message.success('删除成功')
        })
      })
    },
    /**
     * 获取会员列表
     */
    async getUsers() {
      const _params = {
        pageSize: 10000,
        pageNum: 1,
        auditingStatus: 2
      }
      const res = await getAuthListApi(_params)
      if (res.ok) {
        this.userList = res.content.list || []
      } else {
        // this.$message({
        //   type: 'warning',
        //   message: this.$t('authorization.listEmpty')
        // })
        this.userList = []
      }
    },
    onReadyRight(params) {
      // const self = this
      params.api.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          params.api.sizeColumnsToFit()
          // self.onFirstDataRendered()
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
      const self = this
      getReportTemplateTypeList().then(res => {
        if (res.ok) {
          this.handleMenu(res.content)
          self.reportTypeList = res.content
        }
      })
    },
    /**
     * 处理右击菜单
     */
    handleMenu(list) {
      if (this.$isNotEmpty(list)) {
        list.forEach((item, pIndex) => {
          item.showMenu = false
          item.isPNode = true
          item.isLast = list.length - 3 < pIndex && list.length > 3
          if (this.$isNotEmpty(item.childNodes)) {
            item.childNodes.forEach((child, index) => {
              child.showMenu = false
              child.isLast = item.childNodes.length - 3 < index
            })
          }
        })
      }
    },
    getReportTemplateList(type, nodeData) {
      getReportTemplateList(type, this.filterText).then(res => {
        if (res.ok) {
          if (res.content.length <= 0) {
            this.rowDataRight = [{ ...this.initOneReport }]
          } else {
            this.rowDataRight = res.content
          }
          if (nodeData) {
            this.currentReportTypeRowData = { ...nodeData }
          }
        }
      })
    },
    handleLeftNodeClick(data) {
      if (!data.childNodes || data.childNodes.length === 0) {
        const type = data.code
        this.filterText = ''
        this.getReportTemplateList(type, data)
      }
    },
    popAddReportFormDialog(templateTypeCode) {
      templateTypeCode = templateTypeCode || this.currentReportTypeRowData.code
      this.oneReport = { ...this.initOneReport, templateTypeCode }
      this.getUsers()
      this.isShowReportDialog = true
    },
    popCopyReportFormDialog(data) {
      this.oneReport = { ...data, id: '' }
      this.getUsers()
      this.isShowReportDialog = true
    },
    popEditReportFormDialog(data) {
      this.oneReport = { ...data }
      this.getUsers()
      this.isShowReportDialog = true
    },
    delReport(id) {
      return delReport(id).then(res => {
        if (res.ok) {
          this.$message.success('删除成功')
          this.getReportTemplateList(this.currentReportTypeRowData.code)
        } else {
          return Promise.reject(res.message)
        }
      }).catch(() => {
        // this.$message.error(err)
      })
    },
    submitReport() {
      if (this.oneReport.id) {
        return saveReport(this.oneReport, this.oneReport.id)
      } else {
        return saveReport(this.oneReport)
      }
    },
    doneSubmitReport() {
      this.loading = true
      this.$refs['formData'].validate((valid) => {
        if (!valid) {
          this.loading = false
          return false
        }
        this.submitReport().then(res => {
          if (res.ok) {
            this.isShowReportDialog = false
            this.$message.success('操作成功')
            this.getReportTemplateList(this.currentReportTypeRowData.code)
          }
          this.loading = false
        })
      })
    },
    toShowReport(templateId, action) {
      const time = new Date().getTime() + ''
      // document.querySelector('#ifmReport1Div').innerHTML = '<iframe id="ifmReport1" ref="ifmReport1" style="width:100%;height: 90vh" name="ifmReport1"/>'
      this.$router.replace({ name: `ReportPageView`, query: { templateId, action, time }})
    },
    toDesignReport(templateId, action) {
      const time = new Date().getTime() + ''
      this.$router.replace({ name: `ReportPageView`, query: { templateId, action, time }})
    }
  }
}
</script>
<style scoped lang="scss">
.showMenu {
  position: fixed;
  // left: 28px;
  // top: 15px;
  z-index: 4;
  width: 100px;
  border: 1px solid rgb(189, 195, 199);
  background: #fff;
  padding: 4px 0px;
  &.top{
    //  top: -54px;
  }
  .btn-item {
    padding: 0 4px;
    height: 26px;
    line-height: 26px;
    text-align: left;
    &:hover{
      background: #ECF0F1
    }
  }

}
.left-width{
  width: 320px;
}
.ml-45 {
  margin-left: 45px;
}
.right-width{
  width:calc(100% - 320px)
}
.tree-label {
  display: inline-block;
  width: 120px;
  /* overflow: hidden; */
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 19px;
  position: relative;
  font-size: 12px;
}
</style>
