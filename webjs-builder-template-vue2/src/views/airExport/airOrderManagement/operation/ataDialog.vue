<template>
  <!-- 到港 -->
  <el-dialog :close-on-click-modal="false" :title="$t('air.arrivalAtPort')" :visible.sync="visible" @close="closeFn"
    width="400px" v-loading="loading">
    <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="120px" label-position="left">
      <!-- 实际到港时间 -->
      <el-form-item :label="$t('air.ata')" prop="ata">
        <CommonPicker v-model="formModel.ata" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm" size="mini" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeFn">{{ $t('air.cancel') }} </el-button>
      <el-button type="primary" @click="submitBaseInfo">{{ $t('air.determine') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { updateAirExportOrderAtaBatchApi, updateAirExportJobAtaBatchApi } from '@/api/airExport'
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
    ata: {
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

  watch: {
    ata (val) {
      this.formModel.ata = val
    }
  },

  data () {
    return {
      loading: false,
      formModel: {
        ata: ''
      },
      formRules: {
        "ata": [{ required: true, message: this.$t('air.requestAta'), trigger: 'blur' }]
      }
    }
  },

  methods: {
    closeFn () {
      this.$emit('close')
    },
    submitBaseInfo () {
      let data = this.formModel
      data.ids = this.orderIds
      let fn = updateAirExportOrderAtaBatchApi
      if (this.jobIds && this.jobIds.length) {
        fn = updateAirExportJobAtaBatchApi
        data.ids = this.jobIds
      }
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.loading = true
          // 添加日志 记录数据
          this.logBtnSend({
            origin: logOrigin.LOGISTICS_LINKS,
            logCode: airLogBusinessType.ARRIVAL_AT_PORT,
            serviceName: logServiceName.AIR_SERVICE,
            businessType: airLogBusinessType.ARRIVAL_AT_PORT,
            content: {
              ...data
            }
          })
          fn(data).then(res => {
            if (res && res.ok) {
              this.$emit('refresh')
              this.$message.success(this.$t('air.ataSuccessfulEnd'))
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
