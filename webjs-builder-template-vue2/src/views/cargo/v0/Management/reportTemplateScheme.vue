<template>
  <div class="app-main-inner">
    <div class="app-main-inner-row">
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptionsRight"
        :side-bar="sideBarDefs"
        :column-defs="columnDefsRight"
        :row-data="dataList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReadyRight"
        style="width:100%;height:calc(100vh - 180px)"
        class="ag-theme-balham"
      />
      <el-dialog :visible.sync="dialog.visible" :title="dialog.title" width="550px">
        <el-form v-if="dialog.visible" ref="formData" label-width="90px" label-position="left" :model="formData" :rules="rules">
          <el-form-item label="中文名称" prop="chineseName" maxlength="2">
            <el-input v-model.trim="formData.chineseName" size="mini" />
          </el-form-item>
          <el-form-item label="英文名称" prop="englishName" maxlength="50">
            <el-input v-model.trim="formData.englishName" size="mini" />
          </el-form-item>
          <el-form-item label="编号" prop="code" maxlength="30">
            <el-input v-model.trim="formData.code" size="mini" />
          </el-form-item>
          <el-form-item label="示例数据" prop="demoData">
            <el-input
              v-model.trim="formData.demoData"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 8 }"
            />
          </el-form-item>
          <el-form-item label="数据源地址" maxlength="100">
            <el-input
              v-model.trim="formData.dataSource"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 8 }"
              size="mini"
            />
          </el-form-item>

          <el-form-item label="实体类型" maxlength="100">
            <el-input
              v-model.trim="formData.entityType"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 8 }"
              size="mini"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="saveForm('formData')"> 确定 </el-button>
          <el-button size="mini" @click="dialog.visible = false"> 取消 </el-button>
        </span>
      </el-dialog>
    </div>
    <Pagination v-show="total>50" :total="total" :limit.sync="query.pageSize" :page.sync="query.pageNum" @pagination="list" />
  </div>
</template>

<script>
import schemeOptBtn from './components/schemeOptBtn'
import { schemeDataList, saveSchemeData, delSchemeData, detailScheme } from '@/api/report'
export default {
  name: 'ReportTemplateScheme',
  components: { schemeOptBtn },
  data() {
    const defaultForm = {
      chineseName: '',
      code: '',
      dataSource: '',
      demoData: '',
      englishName: '',
      entityType: '',
      id: null
    }
    return {
      total: 0,
      query: {
        pageNum: 1,
        pageSize: 50
      },
      defaultForm: defaultForm,
      formData: this.$extends({}, defaultForm),
      loading: false,
      dataList: [],
      gridOptionsRight: {},
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnDefsRight: [
        {
          headerName: '中文名',
          field: 'chineseName'
        }, {
          headerName: '英文名',
          field: 'englishName'
        }, {
          headerName: '实体类型',
          field: 'entityType'
        }, {
          headerName: '数据源',
          field: 'dataSource'
        }, {
          headerName: '操作', pinned: 'right', field: `id`, width: 80,
          cellRendererFramework: 'schemeOptBtn'
        }],
      rules: {
        chineseName: [{ required: true, message: '请输入中文名称', trigger: 'change' }],
        demoData: [{ required: true, message: '请输入测试数据', trigger: 'change' }],
        code: [
          { required: true, message: '请输入编号', trigger: 'change' },
          { validator: this.$validators.validUpperCase, message: '请输入大写英文', trigger: 'change' }
        ],
        englishName: [
          { required: true, message: '请输入英文名称', trigger: 'change' }
        ]

      }
    }
  },
  created() {
    this.gridOptionsRight = {
      context: {
        componentParent: this
      }
    }
    this.list()
  },
  methods: {
    /**
     * 获取列表数据
     */
    list: function() {
      this.loading = true
      schemeDataList(this.query).then(res => {
        if(res.ok) {
          this.dataList = res.content.list || []
          this.total = Number(res.content.total)
        }
        this.loading = false
      })
    },
    /**
     * 新增编辑
     */
    edit(id) {
      if (!id) {
        this.dialog.title = '数据源新增'
        this.formData = this.$extends({}, this.defaultForm)
      } else {
        this.dialog.title = '数据源编辑'
        this.detail(id)
      }
      this.$nextTick(() => {
        this.dialog.visible = true
      })
    },
    /**
     * 删除数据
     */
    del(id) {
      this.$confirm('删除数据不可恢复，是否确定？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSchemeData(id).then(res => {
          this.$message.success('删除成功')
          this.list()
        })
      })
    },
    /**
     * 保存记录
     */
    saveForm: function(refName) {
      this.$refs[refName].validate((valid) => {
        if (!valid) {
          return false
        }
        saveSchemeData(this.formData, this.formData.id).then(res => {
          this.$message.success('保存成功')
          this.dialog.visible = false
          this.list()
        })
      })
    },
    /**
     *获取详情数据
     */
    detail(id) {
      detailScheme(id).then(res => {
        if(res.ok) {
          this.$copyProps(this.formData, res.content)
        }
      })
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
    }
  }

}
</script>

<style>

</style>
