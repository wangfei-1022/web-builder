<template>
  <!--批量下载文件-->
  <el-dialog :title='$t("fmsPayablePayment.downloadFile")' :visible.sync="batchDownloadFileVisible" width="400px">
    <div style="margin-bottom: 10px;">
      <el-form ref="batchDownloadFileRef" :model="batchDownloadFileForm" :rules="batchDownloadFileFormRules" label-width="0px" label-position="right">
        <el-form-item label="" prop="instructionFileTypes">
          <el-checkbox-group v-model="batchDownloadFileForm.instructionFileTypes" size="mini">
            <div v-for="item in batchDownloadFileList" :key="item.fileTypeCode">
              <el-checkbox :label="item.fileTypeCode">{{item.fileTypeName}}</el-checkbox>
            </div>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="batchDownloadFileVisible = false" size="mini">{{$t("common.cancel")}}</el-button>
      <el-button type="primary" @click="batchDownloadFileConfirmFn" size="mini" :loading="batchDownloadFileLoading">{{$t("common.confirm")}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getDownloadFileBatchByIdsFileTypeApi, downloadFileBatchByIdsApi } from "@/api/financial/fmsPayablePayment";
// 税控发票列表
export default {
  name: "FmsTaxIncoiceListComponent",
  data() {
    return {
      // 批量下载文件
      batchDownloadFileVisible: false,
      batchDownloadFileLoading: false,
      batchDownloadFileForm: {
        instructionFileTypes: []
      },
      batchDownloadFileFormRules: {
        instructionFileTypes: [{ required: true, message: this.$t('fmsPayablePayment.can_not_be_null'), trigger: 'blur' }]
      },
      batchDownloadFileList: [],
      rows: []
    }
  },
  created() {
    getDownloadFileBatchByIdsFileTypeApi().then(res => {
      if(res.ok) {
        this.batchDownloadFileList = res.content
      }
    })
  },
  methods: {
     // 批量下载文件
    show(rows) {
      this.rows = rows
      let instructionFileTypes = []
      this.batchDownloadFileList.forEach(v => {
        instructionFileTypes.push(v.fileTypeCode)
      })
      this.batchDownloadFileForm.instructionFileTypes = instructionFileTypes
      this.batchDownloadFileVisible = true
    },
    batchDownloadFileConfirmFn() {
      let data = {
        instructionIds: [],
        ...this.batchDownloadFileForm
      }
      let invoiceType = ''
      this.rows.forEach(v => {
        invoiceType = v.invoiceType
        data.instructionIds.push(v.id)
      })
      this.$refs.batchDownloadFileRef.validate(valid => {
        if (valid) {
          this.batchDownloadFileLoading = true
          downloadFileBatchByIdsApi(data).then(res => {
            if (res.ok) {
              this.batchDownloadFileVisible = false
              window.location.href = res.content.url
            }
            this.batchDownloadFileLoading = false
          })
        }
      })
    }
  }
}   
</script>

<style lang='scss' scoped>
</style>