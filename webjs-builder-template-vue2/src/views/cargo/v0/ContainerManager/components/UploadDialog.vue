<template>
  <div>
    <el-dialog ref="formData" :visible.sync="dialogVisible" :title="$t('common.multipleUpload')" width="550px" :close-on-click-modal="false">
      <div v-loading="loading">
        <el-row v-if="dialogVisible" :gutter="20">
          <el-col :span="12">
            <div>
              <div class="mb-10">
                {{title}}
              </div>
              <UploadFile
                ref="uploadImg"
                @error="onError"
                @remove="onRemove"
                @success="uploadFile"
                :limit="1"
                :accept="'.xls,.xlsx'">
                <template slot="upload">
                  <el-button size="mini" type="primary">{{$t('containerManager.importExcel')}}</el-button>
                  <div slot="tip" class="el-upload__tip">{{$t('containerManager.supportiveExte')}},{{$t('common.clickHere')}}<span class="download-text" @click="downloadExcel">{{$t('containerManager.downloadTemplete')}}</span></div>
                </template>
              </UploadFile>
            </div>
          </el-col>
          <el-col :span="12">
            <div v-if="showImgImport">
              <div class="mb-10">
                {{$t('containerManager.uploadDialog.importImage')}}
              </div>
              <UploadFile
                ref="uploadImg"
                @error="onError"
                @remove="removeFile"
                @success="successUpload"
                :beforeUploadLimit="beforeUpload"
                :webkitdirectory="true"
                :limit="9999"
                :maxSize="5"
                :multiple="true"
                :accept="'.png,.jpg,.jpeg'">
                <template slot="upload">
                  <el-button size="mini" type="primary">{{$t('containerManager.fileUpload.importImages')}}</el-button>
                  <div slot="tip" class="el-upload__tip">{{$t('containerManager.fileUpload.exteJPGPNGJPEG')}}</div>
                </template>
              </UploadFile>
            </div>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" :disabled="saveBtnDisabled" @click="saveForm">{{$t('containerManager.confirmBtn')}}</el-button>
        <el-button size="mini" :loading="loading" @click="dialogVisible = false">{{$t('common.cancelBtn')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { uploadFileBacthApi } from '@/api/containerManager'
import { getToken } from '@/utils/auth'
export default {
  name: 'ContainerUploadDialog',
  props: {
    title: {
      type: String,
      default: ''
    },
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
    },
    showImgImport: {
      type: Boolean,
      default: true
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
      goodsPicCloudFileVoList: [],
      goodsInfoExcelCloudFileVo: {},
      isErr: false,
      tempList: []
    }
  },
  computed: {
    saveBtnDisabled() {
      return this.$isEmpty(this.goodsInfoExcelCloudFileVo)
    }
  },
  watch: {
    dialogVisible(val) {
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
      this.$alert('请勿重复上传数据', {
        confirmButtonText: '知道了'
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
    /**
     * 文件目录上传之前钩子
     */
    beforeUpload(file) {
      const arr = file.webkitRelativePath.split('/')
      const isFormat = arr.length === 3
      if (!isFormat) {
        if (!this.isErr) {
          this.$message.warning(this.$t('containerManager.fileUpload.folderLevelErr'))
          this.isErr = true
          setTimeout(() => {
            this.isErr = false
          }, 1000)
        }
        return false
      }
      arr.shift()
      file.entityType = arr[0]
      this.tempList.push(file)
      return true
    },
    /**
     * 文件目录上传成功钩子
     */
    successUpload(res) {
      const currentData = this.tempList.find(item => item.uid === res.uid)
      if (this.$isNotEmpty(currentData)) {
        const data = {
          cloudFileName: res.cloudFileName,
          originFileName: currentData.name,
          fileSize: res.fileSize,
          url: res.url,
          uid: res.uid,
          entityType: currentData.entityType
        }
        this.isErr = false
        this.goodsPicCloudFileVoList.push(data)
        this.loading = false
      }
    },
    // successUpload(data) {
    //  this.goodsPicCloudFileVoList.push(data)
    //  this.loading = false
    // },
    /**
     * 保存数据
     */
    async saveForm() {
      this.loading = true
      const saveData = {
        containerPicCloudFileVoList: this.$isEmpty(this.goodsPicCloudFileVoList) ? null : this.goodsPicCloudFileVoList,
        containerInfoExcelCloudFileVo: this.$isEmpty(this.goodsInfoExcelCloudFileVo) ? null : this.goodsInfoExcelCloudFileVo,
        orderType: this.orderType
      }
      const res = await uploadFileBacthApi(saveData)
      if (res.ok) {
        this.dialogVisible = false
        this.$emit('uploadSuccess')
      }
      this.loading = false
    }
  },
  mounted() {
  }
}
</script>

<style scoped lang="scss">
.download-text {
  color: #108efd;
  cursor: pointer;
}
.tips {
  width: 100%;
  min-height: 50px;
  padding: 10px;
  border: 1px solid #b3e2ff;
  background-color: #e6f7ff;
  margin-top: 10px;
  .tips-title {
    margin-bottom: 4px;
    .icon {
      font-size: 12px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #108efd;
      color: #fff;
      margin-right: 6px;
    }
    .title {
      font-size: 14px;
      font-weight: 500;
    }
  }
  .tips-content {
    padding-left: 20px;
    .content {
      line-height: 22px;
    }
  }
  &.warning {
    border: 1px solid #edc28c;
    background-color: #fef5ec;
    .icon {
      background: #ef9027;
    }
  }
}
::v-deep .el-upload-list {
  max-height: 160px;
  overflow: auto;
}
</style>
