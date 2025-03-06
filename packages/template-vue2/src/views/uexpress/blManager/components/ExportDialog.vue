<template>
  <!--制作清关数据-->
  <el-dialog :visible.sync="importVisible" :close-on-click-modal="false" width="500px" :title="$t('uexpressBL.exportClearanceBtn')">
    <el-form ref="importRef" :model="importForm" :rules="importFormRule" label-width="100px" size="mini">
      <el-form-item :label="$t('uexpressBL.manifestTemplate')" prop="manifestTemplateCode">
        <el-select v-model="importForm.manifestTemplateCode" filterable @change="changeItemFn">
          <el-option v-for="item in templateList" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('uexpressBL.uploadFile')" prop="attachmentFiles" v-if="selectItem.needUploadFile">
        <upload-file v-model="importForm.attachmentFiles" :multiple="true" class="supporting-files"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="option-btn-wrap">
      <el-button size="mini" @click="importVisible = false">{{ $t("common.cancel") }}</el-button>

      <!--当为10 的时候是实际发送 变更状态的导出-->
      <!--当为20/30 的时候是只是单纯的导出不变更状态-->
      <el-button size="mini" type="primary" @click="sendFn('EXPORT')" :loading="sendLoading" v-if="selectItem.manifestMode === 10">{{ $t("uexpressBL.export") }}</el-button>
      <el-button size="mini" type="primary" @click="importConfirmFn" :loading="exportLoading" v-if="selectItem.manifestMode === 20 || selectItem.manifestMode === 30">{{ $t("uexpressBL.export") }}</el-button>

      <el-button size="mini" type="primary" @click="sendFn('SEND')" :loading="sendLoading" v-if="selectItem.manifestMode === 20">{{ $t("uexpressBL.sendEmail") }}</el-button>
      <el-button size="mini" type="primary" @click="sendFn('PUSH')" :loading="sendLoading" v-if="selectItem.manifestMode === 30">{{ $t("uexpressBL.push") }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { exportManifestDataApi, sendEmailManifestDataApi, pushManifestDataApi } from '@/api/uexpress/blManager'

export default {
  name: 'ExportDialog',
  props: {
    templateList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectItem: {},
      importVisible: false,
      bolIds: [],
      importForm: {
        manifestTemplateCode: '',
        attachmentFiles: []
      },
      importFormRule: {
        manifestTemplateCode: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        attachmentFiles: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      },
      sendLoading: false,
      exportLoading: false
    }
  },
  methods: {
    show(list) {
      this.importForm = {
         manifestTemplateCode: '',
         attachmentFiles: []
      }
      this.importVisible = true
      let bolIds = []
      list.forEach(v => {
        bolIds.push(v.id)
      })
      this.bolIds = bolIds
    },
    changeItemFn() {
      this.selectItem = {}
      this.templateList.forEach(v => {
        if (v.code === this.importForm.manifestTemplateCode) {
          this.selectItem = v
        }
      })
    },
    importConfirmFn() {
      this.$refs.importRef.validate(valid => {
        if (valid) {
          let data = {
            bolIds: this.bolIds,
            ...this.importForm
          }
          this.exportLoading = true
          exportManifestDataApi(data).then(res => {
            if (res.ok) {
              this.$message.success(this.$t('uexpressBL.exportSuccess'))
              this.importVisible = false
            }
            this.exportLoading = false
          })
        }
      })
    },
    sendFn(type) {
      let msg = ''
      if (type === 'EXPORT') {
        msg = this.$t('uexpressBL.exportSuccess')
      } else if (type === 'SEND') {
        msg = this.$t('uexpressBL.sendEmailSuccess')
      } else if (type === 'PUSH') {
        msg = this.$t('uexpressBL.pushSuccess')
      }
      this.$refs.importRef.validate(valid => {
        if (valid) {
          let data = {
            bolIds: this.bolIds,
            ...this.importForm
          }
          this.sendLoading = true
          sendEmailManifestDataApi(data).then(res => {
            if (res.ok) {
              this.$message.success(msg)
              this.importVisible = false
            }
            this.sendLoading = false
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
