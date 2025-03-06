<template>
  <div class="option-btn-wrap">
    <el-button type="text" size="mini" @click="viewBoxDetail">
      {{$t('uexpressBatch.listLabel.viewDetailBtn')}}
    </el-button>
    <el-button type="text" size="mini" class="ml-10" v-if="params.data.blNo" @click="unbindBlNo">
      {{$t('uexpressBatch.listLabel.unbindBlNo')}}
    </el-button>
  </div>
</template>
<script>
import { unbindBlNoApi } from '@/api/uexpress/batchManager'
export default {
  name: "BoxListOptionBtn",
  data() {
    return {};
  },
  created() {},
  beforeMount() {},
  methods: {
    viewBoxDetail() {
      this.$router.push({name: 'UexpressBatchDetail', params: {outboundId: this.params.value, shardingKey: this.params.data.shardingKey}})
    },
    unbindBlNo() {
      this.$confirm(this.$t('uexpressBatch.listLabel.unbindBlWarnning'), this.$t('common.warnningText'), {
        confirmButtonText: this.$t('uexpressBatch.listLabel.unbindBlBtn'),
        cancelButtonText: this.$t('planManager.thinkOver'),
        type: 'warning'
      }).then(async () => {
        let data = {
          outboundIds: [this.params.value]
        }
        const res = await unbindBlNoApi(data)
        if (res && res.ok) {
          this.$message.success(this.$t('uexpressBatch.listLabel.unbindBlSuccess'))
          this.params.refreshData()
        }
      }).catch(() => {})
    }
  }
};
</script>
<style lang="scss" scoped>
.option-btn-wrap {
  span {
    cursor: pointer;
  }
}
</style>

