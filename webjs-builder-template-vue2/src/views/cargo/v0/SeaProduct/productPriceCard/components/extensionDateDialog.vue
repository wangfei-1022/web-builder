<template>
  <!-- 延期 -->
  <el-dialog :close-on-click-modal="false" :title="$t('seaProduct.extension')" :visible.sync="visible" @close="closeFn"
    width="500px" v-loading="loading">
    <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="120px" label-position="left">
      <!-- 延期时间 -->
      <el-form-item :label="$t('seaProduct.extensionDate')" prop="endDate">
        <CommonPicker v-model="formModel.expiryDateEnd" type="datetime" parentOption="followingDependence"
          valueFormat="timestamp" format="yyyy-MM-dd" :endDependence="expiryDateEnd" clearable size="mini"
          style="width:100%" />
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeFn">{{ $t('seaProduct.cancel') }}</el-button>
      <el-button type="primary" @click="submitBaseInfo">{{ $t('seaProduct.determine') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  extensionPriceCardApi
} from "@/api/seaProduct";

export default {
  name: 'ExtensionDateDialog',
  components: {
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    order: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },

  data () {
    return {
      businessLockState: false,
      loading: false,
      expiryDateEnd: "",
      formModel: {
        expiryDateEnd: ''
      },
      formRules: {
        "expiryDateEnd": [{ required: true, message: this.$t('seaProduct.placeholder'), trigger: 'blur' }]
      }
    }
  },

  watch: {
    visible (val) {
      if (val) {
        this.formModel.expiryDateEnd = this.order.expiryDateEnd
        this.expiryDateEnd = this.$moment(parseInt(this.order.expiryDateEnd, 10)).endOf('day').valueOf()
      }

    }
  },

  methods: {
    closeFn () {
      this.$emit('close')
    },
    async submitBaseInfo () {
      this.$refs.formRef.validate(async valid => {
        if (valid) {
          if (this.formModel.expiryDateEnd <= this.expiryDateEnd) {
            this.$message.warning(this.$t('seaProduct.extensionDateWarming'))
            return
          }
          this.formModel.expiryDateEnd = this.$moment(parseInt(this.formModel.expiryDateEnd, 10)).endOf('day').valueOf()
          this.loading = true
          const res = await extensionPriceCardApi(this.order.id, this.formModel)
          if (res && res.ok) {
            this.$emit('refresh')
            this.$message.success(this.$t('seaProduct.successSaved'))
            this.closeFn()
          }
          this.loading = false
        }
      })
    }
  }
}
</script>

<style scoped lang="less"></style>
