<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" :title="$t('charteredBoat.recordMasterBl')" width="550px">
      <el-form v-if="dialogVisible" ref="formData" label-width="110px" label-position="left" :model="formData" prop="mblNo">
        <el-form-item
          :label="this.$t('boatBlList.masterBlNo')"
          :rules="[
            { required: true, message: this.$t('boatBlList.masterBlNoEmptyError') }
          ]"
          prop="mblNo"
        >
          <el-input v-trim v-model="formData.mblNo" size="mini" maxlength="30" @change="mblNoChange" />
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
import { inputBlApi } from '@/api/bl'
export default {
  name: 'InputInfoDialog',
  props: {
    id: String,
    mblNo: String,
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      formData: {
        mblNo: ''
      },
      dialogVisible: false
    }
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.$emit('update:visible', false)
      }
    },
    visible(val) {
      if (val) {
        this.formData.mblNo = this.mblNo || ''
      }
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
        inputBlApi(this.formData, this.id).then(res => {
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
    },
    /**
     * 转大写
     */
    mblNoChange(val) {
      this.formData.mblNo = val.toUpperCase()
    }
  }

}
</script>

<style>

</style>
