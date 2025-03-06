<template>
	<el-dialog :visible.sync="batchChangeProductVisible" :close-on-click-modal="false" width="550px" :title='$t("uexpressOrder.batchChangeProduct")'>
    <el-form ref="changeProductFormRef" :model="changeProductForm" :rules="changeProductFormRule" label-width="100px" size="mini">
      <div style="text-align: center;margin-bottom: 20px;">
        <el-button size="mini" type="primary" icon="el-icon-download" @click="downloadTemplateFn(27)">{{$t("uexpressOrder.batchChangeProductTemplate")}}</el-button>
      </div>
      <el-form-item label='excel' prop="orderSalesExcel">
        <upload-file v-model="changeProductForm.orderSalesExcel" accept=".xls,.xlsx"/>
      </el-form-item>
      <div style="color: red;padding-left: 50px;">{{$t("uexpressOrder.batchChangeProductInfo")}}</div>
    </el-form>
    <div slot="footer" class="option-btn-wrap">
      <el-button size="mini" @click="batchChangeProductVisible = false">{{ $t("common.cancel") }}</el-button>
      <el-button size="mini" type="primary" @click="batchChangeProductConfirmFn" :loading="batchChangeProductLoading">{{ $t("common.confirm") }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { batchChangeProductApi } from '@/api/uexpress/orderManager'
import { getTemplateFileApi } from '@/api/uexpress/base'
export default {
	name: "BatchChangeProductDialog",
	data() {
		return {
      // 批量换产品
      batchChangeProductVisible: false,
      batchChangeProductLoading: false,
      changeProductForm: {
        orderSalesExcel: []
      },
      changeProductFormRule: {
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
    // 批量换产品
    show() {
      this.changeProductForm.orderSalesExcel = []
      this.batchChangeProductVisible = true
    },
    batchChangeProductConfirmFn() {
      this.$refs.changeProductFormRef.validate(valid => {
        if (valid) {
          let data = {
            ...this.changeProductForm
          }
          data.orderSalesExcel = data.orderSalesExcel[0]
          this.batchChangeProductLoading = true
          batchChangeProductApi(data).then(res => {
            if (res.ok) {
              this.batchChangeProductVisible = false
              this.$message.success(this.$t('uexpressOrder.import_oper_success'))
            }
            this.batchChangeProductLoading = false
          })
        }
      })
    },
  }
};
</script>
<style lang="scss" scoped>

</style>

