<template>
  <div>
    <el-dialog :visible.sync="batchImportVisible" :close-on-click-modal="false" width="500px" :title='$t("thirdKindOrder.importOrder")'>
      <el-form ref="batchImportRef" :model="importForm" :rules="importFormRule" label-width="150px" size="mini">
        <div style="text-align: center;margin-bottom: 20px;">
          <el-button size="mini" type="primary" icon="el-icon-download" @click="downloadTemplateFn(10)">{{$t("thirdKindOrder.batchImportTemplate")}}</el-button>
        </div>
        <el-form-item  :label='$t("thirdKindOrder.batchImportOrder")' prop="file">
          <upload-file v-model="importForm.file" accept=".xls,.xlsx" :limit="1"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="batchImportVisible = false">{{ $t("common.cancel") }}</el-button>
        <el-button size="mini" type="primary" @click="batchImportConfirmFn" :loading="batchImportLoading">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { importThikOrderApi } from '@/api/thirdKind'
export default {
    name: 'ThirdKindImportOrder',
    data() {
        return {
            // 批量导入
            batchImportVisible: false,
            batchImportLoading: false,
            importForm: {
                file: []
            },
            importFormRule: {
                file: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
            },
        };
    },
    created() {

    },
    methods: {
        show() {
            this.importForm.file = []
            this.batchImportVisible = true
        },
        downloadTemplateFn() {
            this.downloadExcel('订单导入模版_第三类订单_海外仓.xlsx')
        },
        batchImportConfirmFn() {
            this.$refs.batchImportRef.validate(valid => {
                if (valid) {
                let data = {
                    ...this.importForm,
                    businessType: 'OVERSEAS_WAREHOUSE'
                }
                data.file = data.file[0]
                this.batchImportLoading = true
                importThikOrderApi(data).then(res => {
                    if (res.ok) {
                        this.batchImportVisible = false
                        this.$emit('success')
                        this.$message.success(this.$t('thirdKindOrder.importOperSuccess'))
                    }
                    this.batchImportLoading = false
                })
                }
            })
        },
    }
};
</script>

<style scoped lang="scss">

</style>


