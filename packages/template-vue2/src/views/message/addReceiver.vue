<template>
  <el-dialog
    :title="$t('receiverManage.receiver')"
    :visible.sync="addModalVisible"
    width="400px"
    :center="true"
    :close-on-click-modal="false"
    :before-close="handleClose"
    append-to-body
  >
    <el-form ref="receiverForm" :model="form" :rules="rules" label-width="80px">
      <el-form-item :label="$t('receiverManage.name')" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item :label="$t('receiverManage.mobile')" prop="mobile">
        <el-input v-model="form.mobile" />
      </el-form-item>
      <el-form-item :label="$t('receiverManage.email')" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="addModalVisible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" size="mini" @click="addReceiverFn">{{ $t('common.confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { addReceiverApi, editReceiverApi } from '@/api/middleware/message'
import { validateEmail, validateMobile } from "@/utils/validate";
export default {
  name: 'AddReceiver',
  props: {
    form: {
      type: Object,
      default: function() {
        return {
          id: '',
          name: '',
          mobile: '',
          email: ''
        }
      }
    }
  },

  data() {
    const validateMobileFn = async(rule, value, callback) => {
      if (value && !validateMobile(value)) {
        callback(new Error(this.$t('receiverManage.mobileRegFalse')))
      } else {
        callback()
      }
    }

    const validateEmailFn = async(rule, value, callback) => {
      if (value && !validateEmail(value)) {
        callback(new Error(this.$t('receiverManage.emailRegFalse')))
      } else {
        callback()
      }
    }
    return {
      rules: {
        name: [
          { required: true, message: this.$t('receiverManage.isNeedName') }
        ],
        mobile: [
          { validator: validateMobileFn, trigger: 'blur' }
        ],
        email: [
          { validator: validateEmailFn, trigger: 'blur' }
        ]
      },
      addModalVisible: false
    }
  },
  methods: {
    show() {
      this.addModalVisible = true
    },
    handleClose() {
      this.addModalVisible = false
    },
    addReceiverFn() {
      this.$refs.receiverForm.validate(valid => {
        if (valid) {
          if (!this.form.mobile && !this.form.email) {
            this.$message({
              type: 'error',
              message: this.$t('receiverManage.mobileOrEmailNeedOne')
            })
            return
          }
          this.addModalVisible = false

          if (this.form.id) {
            editReceiverApi(this.form).then(res => {
              if (res && res.ok) {
                this.$message({
                  type: 'success',
                  message: this.$t('receiverManage.editSuccess')
                })
                this.$emit('add-success', res.content)
              }
            })
          } else {
            addReceiverApi(this.form).then(res => {
              if (res && res.ok) {
                this.$message({
                  type: 'success',
                  message: this.$t('receiverManage.addSuccess')
                })
                this.$emit('add-success', res.content)
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style>

</style>
