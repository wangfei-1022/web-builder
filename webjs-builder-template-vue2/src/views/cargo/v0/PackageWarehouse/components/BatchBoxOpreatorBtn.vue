<template>
  <div class="edit-btn-wrap">
    <el-button type="text" size="mini" @click="unbindContainer">{{$t('packageWarehouse.batchManager.unbindBtn')}}</el-button>
  </div>
</template>
<script>
import { submitUnbindBatchApi } from '@/api/packageWarehouse'
export default {
  name: 'BatchBoxOpreatorBtn',
  data() {
    return {}
  },
  computed: {},
  methods: {
    unbindContainer() {
      this.$confirm(this.$t('packageWarehouse.batchManager.unbindWarningTip'), this.$t('common.warnningText'), {
        confirmButtonText: this.$t('packageWarehouse.batchManager.unbindBtn'),
        cancelButtonText: this.$t('packageWarehouse.batchManager.thinkOver'),
        type: 'warning'
      }).then(async () => {
        const res = await submitUnbindBatchApi({ids: [this.params.value]})
        if (res && res.ok) {
          this.$message.success(this.$t('packageWarehouse.batchManager.unbindSuccess'))
          this.params.refresh()
        }
      }).catch(() => {})
    }
  },
  created() {
  }
}
</script>
<style>
</style>
