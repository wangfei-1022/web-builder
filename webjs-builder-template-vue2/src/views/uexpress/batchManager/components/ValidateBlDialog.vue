<template>
  <div class="">
    <el-dialog
    :visible.sync="visible"
    width="400px"
    :title="$t('uexpressBatch.bindBlNoDialog.dialogTitle')"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true">
      <el-form :inline="true" :model="blForm" ref="blForm" label-width="100" :rules="blFormRule" size="mini">
        <el-form-item :label="`${$t('uexpressBatch.bindBlNoDialog.blNo')}: `" prop="blNo">
          <el-input v-model="blForm.blNo" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" :loading="loading" @click="validateBlForm">{{$t('uexpressBatch.bindBlNoDialog.nextStep')}}</el-button>
        <el-button size="mini" :loading="loading" @click="closeDialog">{{$t('common.cancelBtn')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { validateBlNoApi } from '@/api/uexpress/batchManager'
export default {
  name: 'ValidateBlDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      vm: this,
      loading: false,
      blForm: {
        blNo: ''
      },
      blFormRule: {
        blNo: [
          {required: true, message: this.$t('uexpressBatch.bindBlNoDialog.blNoInvalid'), trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    validateBlForm() {
      this.$refs.blForm.validate(valid => {
        if (valid) {
          this.getBlNoInfo()
        }
      })
    },
    async getBlNoInfo() {
      const res = await validateBlNoApi(this.blForm.blNo)
      if (res && res.ok) {
        if (res.content) {
          let _obj = {...res.content}
          _obj.exisitsBl = true
          this.$emit('nextStep', _obj)
        } else {
          this.$emit('nextStep', {blNo: this.blForm.blNo})
        }
        this.$refs.blForm.resetFields()
      }
    },
    closeDialog() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style scoped lang="scss">
</style>
