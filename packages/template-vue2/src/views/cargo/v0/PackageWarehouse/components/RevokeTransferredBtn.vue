<template>
  <el-button type="text" size="mini" @click="confirmInvoke">{{$t('packageWarehouse.revokeTransferred')}}</el-button>
</template>
<script>
import { revokTransferredApi } from '@/api/packageTransfer'
export default {
  name: 'RevokeTransferredBtn',
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
      this.$confirm(this.$t('packageWarehouse.revokeTip'), this.$t('common.tips'), {
        confirmButtonText: this.$t('packageWarehouse.dropEditBtn'),
        cancelButtonText: this.$t('packageWarehouse.cancelDrop'),
        confirmButtonClass: 'el-button--danger',
        type: 'warning'
      }).then(() => {
        this.revokeTransferred()
      }).catch(() => {})
    },
    async revokeTransferred() {
      this.params.showLoading()
      const res = await revokTransferredApi(this.params.value)
      if (res && res.ok) {
        this.params.spliceArray(this.params.value)
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
