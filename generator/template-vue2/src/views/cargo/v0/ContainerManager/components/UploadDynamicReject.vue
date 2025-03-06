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
                @error="onError"
                @remove="onRemove"
                @success="uploadFile"
                :limit="1"
                :maxSize="5"
                :accept="'.xls,.xlsx'">
                <template slot="upload">
                  <el-button size="mini" type="primary">{{$t('containerManager.importExcel')}}</el-button>
                </template>
              </UploadFile>
            </div>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" :disabled="$isEmpty(goodsInfoExcelCloudFileVo)" @click="saveForm">{{$t('containerManager.confirmBtn')}}</el-button>
        <el-button size="mini" :loading="loading" @click="dialogVisible = false">{{$t('common.cancelBtn')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { importDynamicRejectApi } from '@/api/containerDynamic'
import { getToken } from '@/utils/auth'
export default {
  name: 'UploadDynamicReject',
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
      goodsInfoExcelCloudFileVo: {}
    }
  },
  computed: {
    ...mapState({
      uploadToken: state => state.user.token
    }),
    fileUploadUrl() {
      return `${process.env.VUE_APP_BASE_API}/api/mdp-service/web/upload/file`
    },
    uploadHeads() {
      return {
        Authorization: this.uploadToken
      }
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
      this.downloadFile({fileName: this.excelFileName, url: encodeURI(`${process.env.VUE_APP_BASE_API}/api/mdp-service/template/excel/download?templateName=${this.excelFileName}&Authorization=${getToken()}`)})
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
    /**
     * 保存数据
     */
    async saveForm() {
      this.loading = true
      const res = await importDynamicRejectApi(this.goodsInfoExcelCloudFileVo)
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
      .content{
        line-height: 22px;
      }
    }
    &.warning {
      border: 1px solid #edc28c;
      background-color: #fef5ec;
      .icon{
        background: #ef9027;
      }
    }
  }

</style>
