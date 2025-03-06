<template>
  <el-dialog :visible.sync="showDialog" :title="$t('packageWarehouse.driverManager.importDriverTitle')" :close-on-click-modal="false" :before-close="closeModify" width="440px">
    <UploadFile
      ref="uploadFile"
      @error="onError"
      @remove="onRemove"
      @success="uploadFile"
      :limit="1"
      :maxSize="5"
      :accept="'.xls,.xlsx'">
      <template slot="upload">
        <el-button size="mini" type="primary">{{$t('packageWarehouse.girdConfig.importBtn')}}</el-button>
      </template>
      <div slot="tip" class="el-upload__tip">{{$t('packageWarehouse.clickHere')}}<span class="download-text" @click="downloadExcel">{{$t('packageWarehouse.downloadTemplate')}}</span></div>
    </UploadFile>
    <div style="text-align: right;">
      <el-button type="primary" :loading="loading" size="mini" @click="submitForm">{{$t('common.submitBtn')}}</el-button>
      <el-button size="mini" :loading="loading" @click="closeModify">{{$t('common.cancelBtn')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { importDriverInfoApi } from '@/api/packageWarehouse'
import { getToken } from '@/utils/auth'
export default {
  name: 'DriverImportDialog',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    parentLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileObj: null
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
    },
    loading: {
      get: function() {
        return this.parentLoading
      },
      set: function(val) {
        this.$emit('update:parentLoading', val)
      }
    }
  },
  methods: {
    /**
     * 下载模板
     */
    downloadExcel() {
      this.downloadFile({ fileName: this.$t('packageWarehouse.driverManager.tplFileName'), url: encodeURI(`${process.env.VUE_APP_BASE_API}/api/mdm-service/template/excel/download?templateName=${this.$t('packageWarehouse.driverManager.tplFileName')}&Authorization=${getToken()}`) })
    },
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
      this.fileObj = res
      this.loading = false
    },
    onRemove() {
      this.fileObj = null
    },
    closeModify() {
      this.showDialog = false
      this.fileObj = null
      this.$refs.uploadFile.fileList = []
    },
    async submitForm() {
      if (!this.fileObj) {
        this.$message.error(this.$t('packageWarehouse.driverManager.noneFileUploadMessage'))
        return
      }
      const res = await importDriverInfoApi(this.fileObj)
      if (res && res.ok) {
        this.$message.success(this.$t('packageWarehouse.driverManager.uploadSuccess'))
        this.closeModify()
        this.$emit('refreshData')
      }
    }
  },
  mounted() {}
}
</script>
<style lang="scss" scoped="">
.download-text {
  color: #108efd;
  cursor: pointer;
  height: 30px;
  line-height: 30px;
}
</style>
