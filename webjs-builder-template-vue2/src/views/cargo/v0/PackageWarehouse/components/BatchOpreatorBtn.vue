<template>
  <div class="edit-btn-wrap">
    <el-button type="text" size="mini" @click="viewDetail">{{$t('common.viewBtn')}}</el-button>
    <el-button type="text" size="mini" @click="modifyDetail">{{$t('common.modifyBtn')}}</el-button>
    <!-- <el-button type="text" size="mini" @click="bindPlan" v-show="!params.data.billId">{{$t('planManager.boundBill')}}</el-button>
    <el-button type="text" size="mini" @click="unbindPlan" v-show="params.data.billId">{{$t('planManager.unbindBill')}}</el-button> -->
  </div>

</template>
<script>
import { batchUnbindBillApi } from '@/api/planManager'
export default {
  name: 'BatchtOpreatorBtn',
  data() {
    return {}
  },
  computed: {},
  methods: {
    viewDetail() {
      this.params.viewBatch(this.params.data.id)
    },
    modifyDetail() {
      this.params.modifyBatch(this.params.data.id)
    },
    bindPlan() {
      this.$router.push({name: 'BillList', query: {batchId: this.params.data.id}})
    },
    unbindPlan() {
      this.$confirm(this.$t('planManager.unbindWarningTip'), this.$t('common.warnningText'), {
        confirmButtonText: this.$t('planManager.unbindBtn'),
        cancelButtonText: this.$t('planManager.thinkOver'),
        type: 'warning'
      }).then(async () => {
        const res = await batchUnbindBillApi(this.params.data.id)
        if (res && res.ok) {
          this.$message.success(this.$t('planManager.batchUnbindSuccess'))
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
