<template>
  <div class="option-btn-wrap">
    <el-button type="text" size="mini" @click="modifyChannel">
      {{$t("common.modifyBtn")}}
    </el-button>
    <el-button type="text" size="mini" class="ml-10" @click="checkdelete">
      {{$t("common.deleteBtn")}}
    </el-button>
  </div>
</template>
<script>
import { deleteTraceChannelApi } from '@/api/uexpress/traceLine'
export default {
  name: "StandNodeOptionBtn",
  data() {
    return {};
  },
  created() {},
  beforeMount() {

  },
  methods: {
    modifyChannel() {
      this.params.modifyChannel(this.params.data)
    },
    checkdelete() {
      this.$confirm(this.$t('uexpressTrace.deleteTips'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.deleteBtn'),
        cancelButtonText: this.$t('common.cancelBtn'),
        type: 'error'
      }).then(() => {
        this.deleteTrace()
      }).catch(() => {})
    },
    async deleteTrace() {
      const res = await deleteTraceChannelApi({trackingChannelId: this.params.value})
      if (res.ok) {
        this.$message.success(this.$t('common.deleteSuccess'))
        this.params.refreshData()
      }
    }
  }
};
</script>
<style lang="scss" scoped>

</style>

