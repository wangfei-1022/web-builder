<template>
  <div style="width: 750px;padding-top: 30px;">
    <el-form class="contact-form" ref="batchImportRef" :model="importForm" :rules="importFormRule" label-width="100px" size="mini">
      <el-form-item label='excel' prop="nosFile">
        <upload-file v-model="importForm.nosFile" accept=".xls,.xlsx" drag type="SINGLE_FILE_PREVIEW" />
      </el-form-item>
    </el-form>
    <div style="font-size: 14px; padding-left: 50px;">
      <div style="float: left;">{{$t("uexpressOrder.des")}}</div>
      <div style="padding-left: 50px;">
        <p>{{$t("uexpressOrder.des1")}}</p>
        <p>{{$t("uexpressOrder.des2")}}</p>
        <p>{{$t("uexpressOrder.des3")}}<i @click="downloadTemplateFn" class="el-icon-download" /></p>
        <p>{{$t("uexpressOrder.des4")}}</p>
      </div>
    </div>
    <div style="text-align: right;" class="option-btn-wrap">
      <el-dropdown size="mini" @command="batchImportConfirmFn">
        <el-button type="primary" size="mini">{{$t("uexpressOrder.export")}}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="1">{{$t("uexpressOrder.exportOrder")}}</el-dropdown-item>
          <el-dropdown-item :command="2">{{$t("uexpressOrder.exportTrack")}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { exportOrderExcelApi } from '@/api/uexpress/orderManager'
import { getTemplateFileApi } from '@/api/uexpress/base'

export default {
  name: 'UexpressOrderExcelExport',
  components: {

  },
  data() {
    return {
      batchImportVisible: false,
      importForm: {
        nosFile: []
      },
      importFormRule: {
        nosFile: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      }
    }
  },
  computed: {},
  filters: {},
  methods: {
    downloadTemplateFn() {
      getTemplateFileApi(11).then(res => {
        if (res.ok && res.content && res.content.url) {
          window.location.href = res.content.url
        }
      })
    },
    batchImportConfirmFn(exportExcelType) {
        this.$refs.batchImportRef.validate(valid => {
        if (valid) {
          let data = {
            exportExcelType: exportExcelType,
            ...this.importForm
          }
          data.nosFile = data.nosFile[0]
          exportOrderExcelApi(data).then(res => {
            if (res.ok) {
              this.batchImportVisible = false
              this.$message.success(this.$t('uexpressOrder.import_oper_success'))
            }
          })
        }
      })
    }
  },
  mounted() {
  },
  created() {}
}
</script>
<style lang="scss" scoped>
.el-icon-download{
  color: #1890ff;
  cursor: pointer;
  font-weight: 700;
}
</style>
