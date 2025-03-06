
<template>
  <div>
    <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisible" :title="formData.id?'编辑模板类型':'新增模板类型'" width="550px">
      <el-form v-if="dialogVisible" ref="formData" label-width="90px" label-position="left" :rules="rules" :model="formData">
        <el-form-item label="中文名称" prop="chineseName">
          <el-input v-model.trim="formData.chineseName	" maxlength="50" />
        </el-form-item>
        <el-form-item label="英文名称" prop="englishName">
          <el-input v-model.trim="formData.englishName" maxlength="50" />
        </el-form-item>
        <el-form-item label="编号" prop="code">
          <el-input v-model.trim="formData.code" maxlength="30" />
        </el-form-item>
        <el-form-item v-if="parent.parentCode!='0' && formData.parentCode!='0'" label="数据源" prop="schemeCode">
          <el-select v-model.trim="formData.schemeCode" class="w-full" placeholder="请选择数据源">
            <el-option
              v-for="item in schemeList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>

        </el-form-item>
        <el-form-item label="排序号" prop="seqNo">
          <el-input v-model.trim="formData.seqNo" maxlength="10" />
        </el-form-item>
        <el-form-item label="文件类型">
          <el-input
            v-model.trim="formData.documentTypeCode"
            maxlength="100"
          />
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            v-model.trim="formData.remark"
            maxlength="200"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 8 }"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- v-permission="['cfg:template:update']" -->
        <el-button type="primary" @click="saveForm('formData')">确定 </el-button>
        <el-button @click="dialogVisible = false"> 取消 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { saveReportType, detailReportType, getSchemeList } from '@/api/report'
export default {
  name: 'ReportTypeDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    parent: {
      type: Object,
      default: () => {
        return {
          parentName: '根节点',
          parentCode: '0'
        }
      }
    },
    id: String
  },
  data() {
    const defaultForm = {
      id: null,
      chineseName: '',
      code: '',
      documentTypeCode: '',
      englishName: '',
      parentCode: '',
      remark: '',
      schemeCode: '',
      seqNo: null
    }
    return {
      defaultForm: defaultForm,
      schemeList: [],
      dialogVisible: false,
      formData: this.$extends({}, defaultForm),
      rules: {
        chineseName: [{ required: true, message: '请输入中文名称', trigger: 'change' }],
        englishName: [{ required: true, message: '请输入英文名称', trigger: 'change' }],
        code: [
          { required: true, message: '请输入编号', trigger: 'change' },
          { validator: this.$validators.validUpperCase, message: '请输入大写英文', trigger: 'change' }
        ],
        seqNo: [
          { validator: this.$validators.pInt },
          { required: true, message: '请输入排序号', trigger: 'change' }
        ],
        schemeCode: [{ required: true, message: '请选择数据源', trigger: 'change' }]
      }
    }
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.formData = this.$extends({}, this.defaultForm)
        this.$emit('update:visible', false)
      }
    },
    visible(val) {
      if (val) {
        this.getSchemeList()
        if (this.id) {
          // 获取详情数据
          detailReportType(this.id).then(res => {
            if (res) {
              this.$copyProps(this.formData, res.content)
            }
          })
        }
      }
      this.dialogVisible = val
    }
  },

  methods: {
    /**
     * 保存记录
     */
    saveForm: function(refName) {
      this.$refs[refName].validate((valid) => {
        if (!valid) {
          return false
        }
        if (!this.formData.id) {
          this.formData.parentCode = this.parent.parentCode
        }
        saveReportType(this.formData, this.formData.id).then(res => {
          this.$message.success('保存成功')
          this.$emit('saved')
          this.dialogVisible = false
        }).catch(() => {
        })
      })
    },
    /**
     * 获取数据源列表
     */
    getSchemeList() {
      getSchemeList().then(res => {
        this.schemeList = res.content || []
      })
    }
  }

}
</script>

<style>

</style>
