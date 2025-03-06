<template>
  <!--发送尾程预报邮件-->
  <el-dialog :visible.sync="importVisible" :close-on-click-modal="false" width="500px" :title="$t('uexpressBL.sendMinifestLastMail')">
    <el-form ref="importRef" :model="importForm" :rules="importFormRule" label-width="100px" size="mini">
      <div style="color: red;padding-left: 15px;line-height: 20px;">
        {{$t('uexpressBL.sendMinifestLastMailInfo')}}
      </div>
      <el-form-item :label="$t('uexpressBL.uploadFile')" prop="supportingFiles">
        <upload-file v-model="importForm.supportingFiles" :multiple="true" class="supporting-files"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="option-btn-wrap">
      <el-button size="mini" @click="importVisible = false">{{ $t("common.cancel") }}</el-button>
      <el-button size="mini" type="primary" @click="sendFn" :loading="sendLoading">{{ $t("uexpressBL.sendLastEmail") }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { exportManifestDataApi, sendManifestLastMileApi, pushManifestDataApi } from '@/api/uexpress/blManager'

export default {
  name: 'SendManifestLastMail',
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
        supportingFiles: []
      },
      importFormRule: {
        // supportingFiles: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      },
      sendLoading: false
    }
  },
  methods: {
    show(list) {
      this.importForm = {
         supportingFiles: []
      }
      this.importVisible = true
      let bolIds = []
      list.forEach(v => {
        bolIds.push(v.id)
      })
      this.bolIds = bolIds
    },
    sendFn(type) {
      this.$refs.importRef.validate(valid => {
        if (valid) {
          let data = {
            bolIds: this.bolIds,
            ...this.importForm
          }
          this.sendLoading = true
          sendManifestLastMileApi(data).then(res => {
            if (res.ok) {
              this.$message.success(this.$t('uexpressBL.sendEmailSuccess'))
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
