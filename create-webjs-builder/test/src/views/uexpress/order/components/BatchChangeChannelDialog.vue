<template>
  <el-dialog :visible.sync="batchChangeChannelVisible" :close-on-click-modal="false" width="550px" :title='$t("uexpressOrder.batchChangeChannel")'>
    <el-form ref="changeChannelFormRef" :model="changeChannelForm" :rules="changeChannelFormRule" label-width="100px" size="mini">
      <div style="text-align: center;margin-bottom: 20px;">
        <el-button size="mini" type="primary" icon="el-icon-download" @click="downloadTemplateFn(25)">{{$t("uexpressOrder.batchChangeChannelTemplate")}}</el-button>
      </div>
      <el-form-item label='excel' prop="orderSalesExcel">
        <upload-file v-model="changeChannelForm.orderSalesExcel" accept=".xls,.xlsx" />
      </el-form-item>
      <div style="color: red;padding-left: 50px;">{{$t("uexpressOrder.batchChangeChannelInfo")}}</div>
    </el-form>
    <div slot="footer" class="option-btn-wrap">
      <el-button size="mini" @click="batchChangeChannelVisible = false">{{ $t("common.cancel") }}</el-button>
      <el-button size="mini" type="primary" @click="batchChangeChannelConfirmFn" :loading="batchChangeChannelLoading">{{ $t("common.confirm") }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { batchChangeChannelApi } from '@/api/uexpress/orderManager'
import { getTemplateFileApi } from '@/api/uexpress/base'
export default {
	name: "BatchChangeProductDialog",
	data() {
		return {
      // 批量换渠道
      batchChangeChannelVisible: false,
      batchChangeChannelLoading: false,
      changeChannelForm: {
        orderSalesExcel: []
      },
      changeChannelFormRule: {
        orderSalesExcel: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      },
    };
	},
  methods: {
    downloadTemplateFn(type) {
      getTemplateFileApi(type).then(res => {
        if (res.ok && res.content && res.content.url) {
          window.location.href = res.content.url
        }
      })
    },
    // 批量换渠道
    show() {
      this.changeChannelForm.orderSalesExcel = []
      this.batchChangeChannelVisible = true
    },
    batchChangeChannelConfirmFn() {
      this.$refs.changeChannelFormRef.validate(valid => {
        if (valid) {
          let data = {
            ...this.changeChannelForm
          }
          data.orderSalesExcel = data.orderSalesExcel[0]
          this.batchChangeChannelLoading = true
          batchChangeChannelApi(data).then(res => {
            if (res.ok) {
              this.batchChangeChannelVisible = false
              this.$message.success(this.$t('uexpressOrder.import_oper_success'))
            }
            this.batchChangeChannelLoading = false
          })
        }
      })
    },
  }
};
</script>
<style lang="scss" scoped>

</style>

