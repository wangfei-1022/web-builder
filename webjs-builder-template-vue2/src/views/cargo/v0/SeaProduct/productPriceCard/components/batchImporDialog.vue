<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" :title="$t('seaProduct.priceCardbatchImport')" width="550px"
      :close-on-click-modal="false">
      <div class="dialog-content">
        <el-form label-width="120px" label-position="left" :model="formData" ref="formData" v-if="dialogVisible"
          v-loading="loading">
          <el-form-item :label="$t('seaProduct.COSCOUSATemplateUpl')" required>
            <UploadFile :accept="'.xlsx'" :showFileList="true" :limit="10" @success="() => { loading = false }"
              v-model="fileList" :on-progress="handletProgress">
              <div slot="upload">
                <el-button size="mini" type="primary" class="ml-10" :loading="loading">
                  {{ $t("seaProduct.uploadFile") }}
                </el-button>
              </div>
            </UploadFile>
          </el-form-item>

          <el-form-item :label="$t('seaProduct.agencyContractTemplateUpl')" required>
            <UploadFile :accept="'.xlsx'" :showFileList="true" :limit="10" @success="() => { loading = false }"
              v-model="agencyContractFileList" :on-progress="handletProgress">
              <div slot="upload">
                <el-button size="mini" type="primary" class="ml-10" :loading="loading">
                  {{ $t("seaProduct.uploadFile") }}
                </el-button>
              </div>
            </UploadFile>
          </el-form-item>
        </el-form>
        <span>{{ $t("common.upload.uploadXlsx") }}</span>
        <span class="fc-blue ml-10 pointer" @click="downloadExcel($t('seaProduct.productPriceCardExcel'))">{{
          $t("seaProduct.COSCOUSATemplateExcel") }}</span>
        <div class="fc-blue ml-10 pointer" style="margin-left: 124px;" @click="downloadExcel($t('seaProduct.agencyContractTemplateExcel'))">{{
          $t("seaProduct.agencyContractTemplate") }}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" @click="saveForm">
          {{ $t("common.confirmBtn") }}
        </el-button>
        <el-button size="mini" @click="dialogVisible = false">{{
          $t("common.cancelBtn") }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  importPriceCardApi
} from "@/api/seaProduct";

export default {
  name: 'BatchImportDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogVisible: false,
      fileList: [],
      agencyContractFileList: [],
      loading: false,
      formData: {}
    }
  },

  methods: {
    async saveForm () {
      let seaProductPriceCardImportDTOList = []
      if (this.$isNotEmpty(this.agencyContractFileList)) {
        let agencyContractSaveForm = {"cloudFileVOList": this.agencyContractFileList, dataSource: 30 }
        seaProductPriceCardImportDTOList.push(agencyContractSaveForm)
      }

      if (this.$isNotEmpty(this.fileList)) {
        let cosSaveForm = {"cloudFileVOList": this.fileList, dataSource: 20 }
        seaProductPriceCardImportDTOList.push(cosSaveForm)
      }

      if (this.$isEmpty(seaProductPriceCardImportDTOList)) {
        this.$message.error(this.$t('common.upload.pleaseUploadFile'))
        return
      }

      let param = {
        "seaProductPriceCardImportDTOList": seaProductPriceCardImportDTOList
      }

      this.loading = true
      let res = await importPriceCardApi(param)
      if (res.ok) {
        this.loading = false
        this.dialogVisible = false
        this.$alert(`<div><span class="fc-red fs-16">${this.$t('common.handlerTime')}</span><span class="fs-16">,${this.$t('common.handlerRes')}</span></div>`, this.$t('common.handlerImportTips'), {
          dangerouslyUseHTMLString: true,
          confirmButtonText: this.$t('common.theKnow'),
          callback: () => {
            this.loading = false
          }
        })
      } else {
        this.loading = false
      }
    },
    /**
     * 上传时
     */
    handletProgress () {
      this.loading = true
    }
  },
  watch: {
    dialogVisible (val) {
      this.$emit('update:visible', val)
    },
    visible (val) {
      if (val) {
        this.fileList = []
        this.agencyContractFileList = []
      }
      this.dialogVisible = val
    }
  }

}
</script>

<style></style>
