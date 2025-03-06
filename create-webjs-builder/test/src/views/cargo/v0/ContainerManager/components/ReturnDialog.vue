<template>
  <div>
    <el-dialog ref="formData" :visible.sync="dialogVisible" title="导入退租" width="550px" :close-on-click-modal="false">
      <div v-loading="loading">
        <div class="mb-10">
          {{$t('containerManager.returnDialog.importExcelReturnTitle')}}
          <!-- <span class="fc-red">*</span> -->
        </div>
        <UploadFile
          @error="onError"
          @remove="onRemove"
          @success="uploadFile"
          :limit="1"
          :maxSize="5"
          :accept="'.xls,.xlsx'">
          <template slot="upload">
            <el-button size="mini" type="primary">{{$t('containerManager.importExcel')}}</el-button>
          </template>
          <div slot="tip" class="el-upload__tip">{{$t('containerManager.supportiveExte')}},{{$t('common.clickHere')}}<span class="download-text" @click="downloadExcel">{{$t('containerManager.downloadTemplete')}}</span></div>
        </UploadFile>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" :disabled="$isEmpty(goodsInfoExcelCloudFileVo)" @click="saveForm">{{$t('containerManager.confirmBtn')}}</el-button>
        <el-button size="mini" :loading="loading" @click="dialogVisible = false">{{$t('common.cancelBtn')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { batchUploadOffHireApi } from '@/api/containerManager'
import { getToken } from '@/utils/auth'
export default {
  name: 'ContainerReturnDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    excelFileName: {
      type: String,
      default: ''
    },
    orderType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      dialogVisible: false,
      fileList: [],
      loading: false,
      isEnd: false,
      tips: {
        isEnd: false,
        content: ''
      },
      goodsInfoExcelCloudFileVo: {}
    }
  },
  computed: {
    confirmMesage() {
      return this.orderType === 3 ? this.$t('containerManager.returnDialog.returnLoan') : this.$t('containerManager.returnDialog.returnLease')
    }
  },
  watch: {
    dialogVisible(val) {
      this.fileList = []
      this.$emit('update:visible', val)
    },
    visible(val) {
      this.dialogVisible = val
      if (val) {
        this.goodsPicCloudFileVoList = []
        this.goodsInfoExcelCloudFileVo = {}
      }
    }
  },
  methods: {
    /**
     * 下载模板
     */
    downloadExcel() {
      this.downloadFile({ fileName: this.excelFileName, url: encodeURI(`${process.env.VUE_APP_BASE_API}/api/mdm-service/template/excel/download?templateName=${this.excelFileName}&Authorization=${getToken()}`) })
      // const _fileName = this.excelFileName
      // const link = document.createElement('a')
      // link.download = _fileName
      // link.href = encodeURI(`${process.env.VUE_APP_BASE_API}/api/mdm-service/template/excel/download?templateName=${_fileName}&Authorization=${getToken()}`)
      // document.body.appendChild(link)
      // link.click()
      // document.body.removeChild(link)
    },
    /**
     * 删除已上传的文件
     */
    removeFile(file) {
      const index = this.goodsPicCloudFileVoList.findIndex(item => item.uid === file.uid)
      if (index !== -1) {
        this.goodsPicCloudFileVoList.splice(index, 1)
      }
    },
    onExceed() {
      this.$alert(this.$t('containerManager.uploadDuplicateWarnning'), {
        confirmButtonText: this.$t('containerManager.known')
      })
    },
    onRemove() {
      this.goodsInfoExcelCloudFileVo = {}
    },
    uploadFile(res) {
      this.goodsInfoExcelCloudFileVo = res
      this.loading = false
    },
    /**
     * 文件上传时钩子
     */
    onProgress() {
      this.loading = true
    },
    /**
     * 文件上传失败时钩子
     */
    onError() {
      this.loading = false
    },
    successUpload(data) {
      this.goodsPicCloudFileVoList.push(data)
      this.loading = false
    },
    /**
     * 保存数据
     */
    saveForm() {
      this.$confirm(this.confirmMesage, this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirmBtn'),
        cancelButtonText: this.$t('common.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.submitForm()
      }).catch(() => { })
    },
    async submitForm() {
      this.loading = true
      const saveData = {
        containerPicCloudFileVoList: this.$isEmpty(this.goodsPicCloudFileVoList) ? null : this.goodsPicCloudFileVoList,
        containerInfoExcelCloudFileVo: this.$isEmpty(this.goodsInfoExcelCloudFileVo) ? null : this.goodsInfoExcelCloudFileVo,
        orderType: this.orderType
      }
      const res = await batchUploadOffHireApi(saveData).catch(() => {
        this.loading = false
      })
      if (res.ok) {
        this.dialogVisible = false
        this.$emit('uploadSuccess')
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="scss">
.download-text {
  color: #108efd;
  cursor: pointer;
}
</style>
