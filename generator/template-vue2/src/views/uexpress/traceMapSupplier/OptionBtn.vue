<template>
  <div class="option-btn-wrap">
    <el-button type="text" size="mini" @click="modifyMap">
      {{$t("common.modifyBtn")}}
    </el-button>
    <el-button type="text" size="mini" class="ml-10" @click="checkdelete">
      {{$t("common.deleteBtn")}}
    </el-button>
  </div>
</template>
<script>
import { deleteTraceMapApi } from '@/api/uexpress/traceLine'
export default {
  name: "StandNodeOptionBtn",
  data() {
    return {};
  },
  created() {},
  beforeMount() {

  },
  methods: {
    modifyMap() {
      this.params.modifyMap(this.params.data)
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
      const res = await deleteTraceMapApi({mappingId: this.params.value})
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

