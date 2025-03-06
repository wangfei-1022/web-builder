<template>
  <div>
    <el-dialog ref="formData" :visible.sync="dialogVisible" :title="dialogTitle" width="550px" :close-on-click-modal="false">
      <div v-loading="loading">
        <el-row v-if="dialogVisible" :gutter="20">
          <el-col :span="12">
            <div>
              <div class="mb-10">
                {{title}}
              </div>
              <UploadFile
                @error="onError"
                @remove="removeFile"
                @success="uploadFile"
                :beforeUploadLimit="beforeUpload"
                :limit="limit"
                :maxSize="5"
                :accept="'.xls,.xlsx'">
                <template slot="upload">
                  <el-button size="mini" type="primary">{{$t('packageWarehouse.importExcel')}}</el-button>
                </template>
                <div slot="tip" class="el-upload__tip">{{$t('packageWarehouse.clickHere')}}<span class="download-text" @click="downloadExcel">{{$t('packageWarehouse.downloadTemplate')}}</span></div>
                <div class="el-upload__tip">{{$t('packageWarehouse.tenFoldersLimited')}}</div>
              </UploadFile>
            </div>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" :disabled="goodsPicCloudFileVoList.length === 0" @click="saveForm">{{$t('packageWarehouse.submitUpload')}}</el-button>
        <el-button size="mini" :loading="loading" @click="dialogVisible = false">{{$t('common.cancelBtn')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { uploadReportApi, importAgentParcelRecivedApi, updateChannelApi } from '@/api/packageWarehouse'
import { getToken } from '@/utils/auth'
export default {
  name: 'UploadDyniamic',
  props: {
    dialogTitle: {
      type: String,
      default: ''
    },
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
    },
    submitType: {
      typs: String,
      default: 'order'
    },
    limit: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      dialogVisible: false,
      fileList: [],
      disabledSubmit: false,
      loading: false,
      isEnd: false,
      tips: {
        isEnd: false,
        content: ''
      },
      goodsPicCloudFileVoList: [],
      goodsInfoExcelCloudFileVo: {}
    }
  },
  computed: {},
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
    // 是否重复上传
    beforeUpload(file) {
      const index = this.goodsPicCloudFileVoList.findIndex(item => item.originFileName === file.name)
      if (index !== -1) {
        this.$message.warning(this.$t('packageWarehouse.uploadDuplicate'))
        return false
      } else if (this.goodsPicCloudFileVoList.lenght >= this.limit) {
        this.$message.error(this.$t('packageWarehouse.filesLimited'))
        return false
      } else {
        return true
      }
    },
    // 上传成功
    uploadFile(res) {
      this.goodsPicCloudFileVoList.push(res)
      this.loading = false
    },
    /**
     * 删除已上传的文件
     */
    removeFile(file) {
      const index = this.goodsPicCloudFileVoList.findIndex(item => item.originFileName === file.name)
      if (index !== -1) {
        this.goodsPicCloudFileVoList.splice(index, 1)
      }
    },
    /**
     * 文件上传失败时钩子
     */
    onError() {
      this.loading = false
    },
    /**
     * 保存数据
     */
    saveForm() {
      this.loading = true
      const _list = this.getSubmitList()
      Promise.all(_list).then(res => {
        this.dialogVisible = false
        this.$emit('uploadSuccess')
      })
      this.loading = false
    },
    // 循环提交文件
    getSubmitList() {
      const promiseList = []
      this.goodsPicCloudFileVoList.forEach(v => {
        const p = new Promise(async (resolve, reject) => {
          if (this.submitType === 'agentParcel') {
            const res = await importAgentParcelRecivedApi(v)
          }

          if (this.submitType === 'order') {
            const res = await uploadReportApi(v)
          }

          if (this.submitType === 'updateChannel') {
            const res = await updateChannelApi(v)
          }
          resolve('ok')
        })
        promiseList.push(p)
      })
      return promiseList
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
</style>
