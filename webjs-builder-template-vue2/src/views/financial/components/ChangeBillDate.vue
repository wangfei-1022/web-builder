<template>
  <el-dialog :title='$t("receiveFms.changeEstimateEntryDate")' :visible.sync="visible" width="500px">
    <el-form ref="formRef" :inline="true" :model="form" :rules="formRules" label-width="100px" size="mini">
      <el-form-item :label='$t("receiveFms.estimateEntryDate")' prop="entryDate">
        <common-picker v-model="form.entryDate" pikcer-type="date" pickerFormat="yyyy-MM-dd" size="mini" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" size="mini">{{$t('common.cancel')}}</el-button>
      <el-button type="primary" :loading="loading" @click="submitFn" size="mini">{{$t('common.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
// 变更预计入账时间

import { setEstimateEntryBillDate } from "@/api/financial/fmsReceiptCharge"

export default {
	name: "ChangeBillDate",
	props: {
		arap: {
			type: String,
			default: ''
		}
	},

	data() {
		return {
      // 移出账单
      visible: false,
      loading: false,
      form: {
        entryDate: ''
      },
      formRules: {
        entryDate: [{ required: true, message: this.$t('common.cannot_be_null'), trigger: 'change'}]
      },
      keepChargeIds: []
		}
	},
	created() {

	},
	methods: {
    show(selectedList) {
      let keepChargeIds = []
      selectedList.forEach(v => {
        keepChargeIds.push(v.id)
      })
      this.form.entryDate = null
      this.keepChargeIds = keepChargeIds
      this.visible = true
      this.$nextTick(() => {
        this.$refs.formRef.clearValidate()
      })
    },
    submitFn() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          let data = {
            keepChargeIds: this.keepChargeIds,
            entryDate: this.form.entryDate
          }
          this.loading = true
          setEstimateEntryBillDate(data).then(res => {
            if (res.ok) {
              // 设置预计入账时间成功
              this.$message.success(this.$t("receiveFms.changeEstimateEntryDateSuccess"));
              this.visible = false
              this.$emit('success')
            }
            this.loading = false
          }).catch(() => {
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
