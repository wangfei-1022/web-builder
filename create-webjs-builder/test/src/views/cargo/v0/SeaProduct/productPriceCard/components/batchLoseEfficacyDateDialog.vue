<template>
  <!-- 失效 -->
  <el-dialog :close-on-click-modal="false" :title="$t('seaProduct.loseEfficacy')" :visible.sync="visible" @close="closeFn"
    width="500px" v-loading="loading">
    <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="120px" label-position="left">
      <!-- 失效时间 -->
      <el-form-item :label="$t('seaProduct.loseEfficacyDate')" prop="endDate">
        <CommonPicker v-model="formModel.expiryDateEnd" type="datetime" parentOption="betweenDependence"
          valueFormat="timestamp" format="yyyy-MM-dd" :startDependence="expiryDateStart" :endDependence="expiryDateEnd"
          :defaultValue="expiryDateStart" clearable size="mini" style="width:100%" />
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
  batchEfficacyPriceCardApi
} from "@/api/seaProduct";

export default {
  name: 'BatchLoseEfficacyDateDialog',
  components: {
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    expiryDateEnd: {
      type: [String, Number],
      default: ''
    },
    expiryDateStart: {
      type: [String, Number],
      default: ''
    },
    orderIds: {
      type: Array,
      default: function () {
        return []
      }
    }
  },

  data () {
    return {
      businessLockState: false,
      loading: false,
      formModel: {
        seaProductPriceCardIdList: [],
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
        this.formModel = {
          seaProductPriceCardIdList: [],
          expiryDateEnd: ''
        }
        this.expiryDateEnd = this.$moment(parseInt(this.expiryDateEnd, 10)).subtract(1, 'days').startOf('day').valueOf()
        this.expiryDateStart = this.$moment(parseInt(this.expiryDateStart, 10)).endOf('day').valueOf()
        console.log(this.expiryDateEnd, this.expiryDateStart)
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
          this.formModel.expiryDateEnd = this.$moment(parseInt(this.formModel.expiryDateEnd, 10)).endOf('day').valueOf()
          this.formModel.seaProductPriceCardIdList = this.orderIds
          console.log(this.formModel.expiryDateEnd)
          this.loading = true
          const res = await batchEfficacyPriceCardApi(this.formModel)
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
