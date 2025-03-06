<template>
  <el-dialog :visible.sync="showDialog" :title="$t('planManager.createBatchDialogTitle')" :close-on-click-modal="false" :before-close="closeModify" width="440px">
    <el-form label-width="80px" :model="uploadForm" :rules="uploadFormRule" ref="uploadForm" size="mini" :inline="true">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item :label="`${$t('packageWarehouse.applicationManager.appName')}: `" prop="appCode">
            <el-select v-model="uploadForm.appCode"
              :placeholder="$t('common.selectPlaceholder')" >
              <el-option
                v-for="item in dropdownList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item :label="`${$t('packageWarehouse.applicationManager.version')}: `" prop="appVersion">
            <NumberInput
              v-model.trim="uploadForm.appVersion"
              limitType="decimal"
              size="mini"
              :limitRange="{digits: 5, decimal: 1}" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item :label="`${$t('packageWarehouse.applicationManager.remark')}: `" prop="remark">
            <el-input type="textarea" v-model="uploadForm.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="" label-width="0" prop="fileDTO">
            <UploadFile
              ref="uploadFile"
              style="margin-left: 80px;"
              @error="onError"
              @remove="onRemove"
              @success="uploadFile"
              :limit="1"
              :maxSize="50"
              :accept="'.exe,.apk,.rar,.zip,.7z'">
              <template slot="upload">
                <el-button size="mini" type="primary">{{$t('packageWarehouse.girdConfig.importBtn')}}</el-button>
              </template>
              <div slot="tip" class="el-upload__tip">{{$t('packageWarehouse.applicationManager.allowType')}}</div>
            </UploadFile>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="text-align: right;">
      <el-button type="primary" :loading="loading" size="mini" @click="validateForm">{{$t('common.submitBtn')}}</el-button>
      <el-button size="mini" :loading="loading" @click="closeModify">{{$t('common.cancelBtn')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { uploadApplicationApi } from '@/api/packageWarehouse'
import NumberInput from '@/components/Cargo/NumberInput/NumberInput'
export default {
  name: 'GirdBindWarehouseDialog',
  components: {
    NumberInput
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    appTypeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      dropdownList: [],
      uploadForm: {
        appCode: 0,
        appVersion: '',
        fileDTO: null,
        remark: ''
      },
      uploadFormRule: {
        appCode: [
          {required: true, message: this.$t('packageWarehouse.applicationManager.appTypeInvalid'), trigger: 'change'}
        ],
        appVersion: [
          {required: true, message: this.$t('packageWarehouse.applicationManager.versionInvalid'), trigger: 'blur'}
        ],
        fileDTO: [
          {required: true, message: this.$t('packageWarehouse.applicationManager.fileDTOInvalid'), trigger: 'change'}
        ]
      }
    }
  },
  computed: {
    showDialog: {
      get: function() {
        return this.visible
      },
      set: function(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    /**
     * 文件超出个数限制时的钩子
     */
    onExceed() {
      this.$alert(this.$t('containerManager.uploadDuplicateWarnning'), {
        confirmButtonText: this.$t('containerManager.known')
      })
    },
    /**
     * 文件上传失败时钩子
     */
    onError() {
      this.loading = false
    },
    /**
     * 文件上传时钩子
     */
    onProgress() {
      this.loading = true
    },
    uploadFile(res) {
      this.uploadForm.fileDTO = res
      this.loading = false
    },
    onRemove() {
      this.uploadForm.fileDTO = null
    },
    validateForm() {
      this.$refs.uploadForm.validate(valid => {
        if (valid) {
          if (!this.uploadForm.fileDTO) {
            this.$message.error(this.$t('packageWarehouse.applicationManager.fileInvalid'))
          } else {
            this.submitApp()
          }
        }
      })
    },
    closeModify() {
      this.showDialog = false
      this.$refs.uploadForm.resetFields()
    },
    async submitApp() {
      const res = await uploadApplicationApi(this.uploadForm)
      if (res && res.ok) {
        this.$message.success(this.$t('packageWarehouse.applicationManager.uploadSuccess'))
        this.closeModify()
        this.$emit('refreshData')
        this.$refs.uploadForm.resetFields()
        this.uploadForm.fileDTO = null
        this.$refs.uploadFile.fileList = []
      }
    }
  },
  mounted() {
    // 请除下拉选项”全部“
    this.dropdownList = JSON.parse(JSON.stringify(this.appTypeList))
    this.dropdownList.shift()
  }
}

</script>
