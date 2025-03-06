<template>
  <div class="info-box">
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBatch.detailClearanceInfo.polDeclareAgentName')}}: </span>
          <span class="info-content">{{detail.polDeclareAgentName}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBatch.detailClearanceInfo.podDeclareAgentName')}}: </span>
          <span class="info-content">{{detail.podDeclareAgentName}}</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'BatchClearanceInfo',
  data() {
    return {
      vm: this
    }
  },
  props: {
    detail: {
      type: Object,
      default: () => {}
    }
  },
  filters: {
    filterDate(date, vm) {
      return date ? vm.$moment(Number(date)).format('YYYY-MM-DD') : ''
    }
  }
}
</script>
<style lang="scss" scoped="">
.info-box{
  padding: 20px;
}
.info-inner-wrap{
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
