<template>
  <el-button type="text" size="mini" @click="confirmInvoke">{{$t('packageWarehouse.revokeOutboundBtn')}}</el-button>
</template>
<script>
import { revokeOutboundApi } from '@/api/packageWarehouse'
export default {
  name: 'RevokeOutboundBtn',
  data() {
    return {
      showEditDialog: false,
      fullscreenLoading: false,
      detailObj: null
    }
  },
  components: {},
  computed: {},
  methods: {
    confirmInvoke() {
      this.$confirm(this.$t('packageWarehouse.invokeTip'), this.$t('common.tips'), {
        confirmButtonText: this.$t('packageWarehouse.dropEditBtn'),
        cancelButtonText: this.$t('packageWarehouse.cancelDrop'),
        confirmButtonClass: 'el-button--danger',
        type: 'warning'
      }).then(() => {
        this.revokeOutbound()
      }).catch(() => {})
    },
    async revokeOutbound() {
      this.params.showLoading()
      const res = await revokeOutboundApi(this.params.value)
      if (res && res.ok) {
        if (res.content.failMsgName) {
          this.params.showError(res.content.failMsgName)
        } else {
          this.params.spliceArray(this.params.value)
        }
      } else {
        this.params.showError(res.errors.message)
      }
      this.params.closeLoading()
    }
  },
  created() {}
}
</script>
<style>
</style>
