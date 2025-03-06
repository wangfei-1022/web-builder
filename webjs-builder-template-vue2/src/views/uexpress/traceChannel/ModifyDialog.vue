<template>
  <div>
    <el-dialog
    :visible.sync="visible"
    width="800px"
    :title="title"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true">
      <el-form ref="modifyForm" :model="modifyForm" :rules="modifyFormRule" size="mini" label-width="120px" label-position="right" style="width: 100%;" inline>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label='$t("uexpressTrace.channelCode")' prop="channelCode">
              <el-input v-model="modifyForm.channelCode" :disabled="isModify"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label='$t("uexpressTrace.channelName")' prop="channelName">
              <el-input v-model="modifyForm.channelName" :disabled="isModify"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label='$t("uexpressTrace.supplierName")' prop="supplierId">
              <type-select
                ref="supplierSelect"
                style="width: 240px;"
                v-model="modifyForm.supplierId"
                type="supplier"
                :requestParams="{ partnerRole: 17011}"
                :defaultDisplay="supplierDisplay" >
              </type-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label='$t("common.remark")' prop="remarks">
              <el-input type="textarea" rows="3" style="width: 570px;" v-model="modifyForm.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" @click="checkForm">{{$t('common.confirmBtn')}}</el-button>
        <el-button size="mini" :loading="loading" @click="closeDialog">{{$t('common.cancelBtn')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createTraceChannelApi, updateTraceChannelApi } from '@/api/uexpress/traceLine'
export default {
  name: "ModifyTraceDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  data() {
    return {
      title: '',
      modifyForm: {},
      modifyFormRule: {
        channelCode: [
          {required: true, message: this.$t('uexpressTrace.invalidChannelCode'), trigger: 'blur'}
        ],
        channelName: [
          {required: true, message: this.$t('uexpressTrace.invalidChannelName'), trigger: 'blur'}
        ],
        supplierId: [
          {required: true, message: this.$t('uexpressTrace.invalidSupplier'), trigger: 'change'}
        ]
      },
      isModify: false,
      supplierDisplay: []
    }
  },
  created() {},
  methods: {
    init(formData = null) {
      if (formData) {
        this.modifyForm = {...formData}
        this.modifyForm.trackingChannelId = this.modifyForm.channelId
        this.isModify = true
        this.title = this.$t('uexpressTrace.modifyChannel')
        this.supplierDisplay = [{
          id: this.modifyForm.supplierId,
          chineseName: this.modifyForm.supplierName
        }]
      } else {
        this.modifyForm = {
          channelCode: '',
          channelName: '',
          supplierId: null,
          remarks: ''
        }
        this.isModify = false
        this.title = this.$t('uexpressTrace.createChannel')
      }
      this.$nextTick(() => {
        this.$refs.modifyForm.clearValidate()
      })
    },
    checkForm() {
      this.$refs.modifyForm.validate(valid => {
        if (valid) {
          this.submitForm()
        }
      })
    },
    async submitForm() {
      this.$emit('update:loading', true)
      let res = null
      if (this.isModify) {
        res = await updateTraceChannelApi(this.modifyForm)
      } else {
        res = await createTraceChannelApi(this.modifyForm)
      }

      this.$emit('update:loading', false)

      if (res.ok) {
        this.$message.success(this.$t('uexpressTrace.modifySuccess'))
        this.closeDialog()
        this.$emit('refreshData')
      }
    },
    closeDialog() {
      this.$refs.modifyForm.resetFields()
      this.supplierDisplay = []
      this.$refs.supplierSelect.clearChildOption('supplier')
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-input.el-input--mini {
    width: 240px;
  }
</style>
