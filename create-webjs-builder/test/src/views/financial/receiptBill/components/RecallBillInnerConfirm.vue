<template>
    <el-dialog :title="$t('receiveFms.bill_recall_bill_confirm')" :visible.sync="visible" width="500px">
      <div>{{$t('receiveFms.bill_recall_confirm_info')}}</div>
      <el-form ref="formRef" :model="formData" :rules="formRules" size="mini" label-position="right" @submit.native.prevent>
        <el-form-item label="" prop="remark">
          <el-input v-model="formData.remark" type="text"  size="mini" clearable />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false" size="mini">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="submitFn" size="mini" :loading="loading">{{$t('common.confirm')}}</el-button>
      </span>
    </el-dialog>
</template>

<script>
import { recallBillInnerConfirmApi } from "@/api/financial/fmsReceive"

// 待内部确认 撤回确认
export default {
	name: "RecallBillInnerConfirm",
	props: {

	},
	watch: {

	},
	data() {
		return {
      loading: false,
			visible: false,
      billId: '',
			formData: {
				remark: ''
			},
			formRules: {
				"remark": [{ required: true, message: this.$t('receiveFms.can_not_be_null'), trigger: 'blur' }]
			}
		}
	},
	created() {
	},
	methods: {
		show(item) {
      this.formData.remark = ''
      this.billId = item.id
			this.visible = true
		},
		submitFn() {
			this.$refs.formRef.validate(valid => {
				if (valid) {
          let data = {
            billId: this.billId,
            remark: this.formData.remark
          }
          this.loading = true
					recallBillInnerConfirmApi(data).then(res => {
            if (res.ok) {
              this.visible = false
              this.$emit('success')
              this.$message.success(this.$t('receiveFms.bill_recall_confirm_success'))
            }
            this.loading = false
          })
				}
			})
		}
	}
}
</script>
<style lang="scss" scoped>

</style>
