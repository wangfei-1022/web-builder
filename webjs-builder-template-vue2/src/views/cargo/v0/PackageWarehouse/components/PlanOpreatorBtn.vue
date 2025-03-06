<template>
  <div class="edit-btn-wrap">
    <el-button type="text" size="mini" @click="viewDetail">{{$t('common.editBtn')}}</el-button>
    <el-button type="text" size="mini" @click="deletePlan" v-show="showBtn">{{$t('common.deleteBtn')}}</el-button>
  </div>
</template>
<script>
import { deletePlanApi } from '@/api/planManager'
export default {
  name: 'PlanOpreatorBtn',
  data() {
    return {}
  },
  computed: {
    showBtn() {
      return this.params.data.billOrigin === 0
    }
  },
  methods: {
    viewDetail() {
      this.params.modifyPlan(this.params.data.id)
    },
    deletePlan() {
      this.$confirm(this.$t('planManager.deletePlanTip'), this.$t('common.warnningText'), {
        confirmButtonText: this.$t('common.deleteBtn'),
        cancelButtonText: this.$t('planManager.thinkOver'),
        type: 'warning'
      }).then(async () => {
        const res = await deletePlanApi(this.params.data.id)
        if (res && res.ok) {
          this.$message.success(this.$t('planManager.deletedSuccess'))
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
