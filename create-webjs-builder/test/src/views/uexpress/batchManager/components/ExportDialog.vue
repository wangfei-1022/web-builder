<template>
  <el-dialog :visible.sync="importVisible" :close-on-click-modal="false" width="500px" title='导出报关数据'>
    <el-form ref="importRef" :model="importForm" :rules="importFormRule" label-width="100px" size="mini">
      <el-form-item label='报关模板' prop="manifestTemplateCode">
        <el-select v-model="importForm.manifestTemplateCode" filterable>
          <el-option v-for="item in templateList" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="option-btn-wrap">
      <el-button size="mini" @click="importVisible = false">{{ $t("common.cancel") }}</el-button>
      <el-button size="mini" type="primary" @click="importConfirmFn">{{ $t("common.confirm") }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { exportManifestDataApi } from '@/api/uexpress/batchManager'

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
      importVisible: false,
      outboundIds: [],
      importForm: {
        manifestTemplateCode: ''
      },
      importFormRule: {
        manifestTemplateCode: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      }
    }
  },
  methods: {
    show(list) {
      this.importForm = {
         manifestTemplateCode: ''
      }
      this.importVisible = true
      let outboundIds = []
      list.forEach(v => {
        outboundIds.push(v.id)
      })
      this.outboundIds = outboundIds
    },
    importConfirmFn() {
      this.$refs.importRef.validate(valid => {
        if (valid) {
          let data = {
            outboundIds: this.outboundIds,
            manifestTemplateCode: this.importForm.manifestTemplateCode
          }
          exportManifestDataApi(data).then(res => {
            if (res.ok) {
              this.$message.success('导出操作成功')
              this.importVisible = false
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
