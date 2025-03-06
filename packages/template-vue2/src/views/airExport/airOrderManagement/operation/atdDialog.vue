<template>
  <!-- 起飞 -->
  <el-dialog :close-on-click-modal="false" :title="$t('air.takeOff')" :visible.sync="visible" @close="closeFn"
    width="500px" v-loading="loading">
    <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="120px" label-position="left">
      <!-- 实际开航时间 -->
      <el-form-item :label="$t('air.atd2')" prop="atd">
        <CommonPicker v-model="formModel.atd" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm" size="mini" />
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeFn">{{ $t('air.cancel') }}</el-button>
      <el-button type="primary" @click="submitBaseInfo">{{ $t('air.determine') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { updateAirExportJobAtdBatchApi, updateAirExportOrderAtdBatchApi } from '@/api/airExport'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'
import { logServiceName, airLogBusinessType, logOrigin } from '@/utils/constant'
import orderMixin from '../orderMixin'

export default {
  name: 'BaseInfoDialog',
  components: {
    cargoLimitedSelect
  },
  mixins: [orderMixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    jobIds: {
      type: Array,
      default: function () {
        return []
      }
    },
    orderIds: {
      type: Array,
      default: function () {
        return []
      }
    },
    atd: {
      type: [String, Number],
      default: ''
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
      formModel: {
        atd: ''
      },
      formRules: {
        "atd": [{ required: true, message: this.$t('air.requiredAtd'), trigger: 'blur' }]
      }
    }
  },

  watch: {
    visible (val) {

      if (this.order.baseDTO.businessLockState === true) {
        this.businessLockState = true
      } else {
        this.businessLockState = false
      }
    },
    atd (val) {
      this.formModel.atd = val
    }
  },

  methods: {
    closeFn () {
      this.$emit('close')
    },
    submitBaseInfo () {
      let data = this.formModel
      data.ids = this.orderIds
      let fn = updateAirExportOrderAtdBatchApi
      if (this.jobIds && this.jobIds.length) {
        fn = updateAirExportJobAtdBatchApi
        data.ids = this.jobIds
      }
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.loading = true
          // 添加日志 记录数据
          this.logBtnSend({
            origin: logOrigin.LOGISTICS_LINKS,
            logCode: airLogBusinessType.TAKE_OFF,
            serviceName: logServiceName.AIR_SERVICE,
            businessType: airLogBusinessType.TAKE_OFF,
            content: {
              ...data
            }
          })
          fn(data).then(res => {
            if (res && res.ok) {
              this.$emit('refresh')
              this.$message.success(this.$t('air.atdSuccessfulEnd'))
              this.closeFn()
              this.adjustConfirmFn(this.order)
            }
            this.loading = false
          })
        }
      })

    }
  }
}
</script>

<style scoped lang="less"></style>
