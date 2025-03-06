<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" :title="$t('charteredBoat.markDeclareStatus')" width="550px">
      <el-form ref="formData" label-width="90px" label-position="left" :model="formData" prop="declareStatus">
        <el-form-item
          :label="$t('charteredBoat.declareStatus')"
          :rules="[
            { required: true, message: $t('boatBlList.declareStatusEmptyError') },
          ]"
          prop="declareStatus"
        >
          <el-radio-group v-model="formData.declareStatus">
            <el-radio label="1">{{$t('common.submited')}}</el-radio>
            <el-radio label="2">{{$t('common.declared')}}</el-radio>
            <el-radio label="3">{{$t('common.passed')}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- v-permission="['sys:template:update']" -->
        <el-button type="primary" size="mini" :disabled="loading" @click="saveForm('formData')">{{$t('common.confirmBtn')}}</el-button>
        <el-button size="mini" @click="dialogVisible = false">{{$t('common.cancelBtn')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { signDeclareApi } from '@/api/bl'
export default {
  name: 'MarkDeclarationStatusDialog',
  props: {
    ids: Array,
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      formData: {
        declareStatus: ''
      },
      dialogVisible: false
    }
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.formData.declareStatus = ''
        this.$emit('update:visible', false)
      }
    },
    visible(val) {
      this.dialogVisible = val
    }
  },
  methods: {
    /**
     * 保存接口
     */
    saveForm(refName) {
      this.$refs[refName].validate(valid => {
        if (!valid) {
          return false
        }
        this.loading = true
        signDeclareApi(this.formData, this.ids).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('charteredBoat.saveSuccess'))
            this.loading = false
            this.$emit('saved')
            this.dialogVisible = false
          } else {
            this.loading = false
          }
        }).catch(() => {
          this.loading = false
        })
      })
    }
  }

}
</script>

<style>

</style>
