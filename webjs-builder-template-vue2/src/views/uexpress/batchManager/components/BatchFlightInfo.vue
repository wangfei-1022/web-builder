<template>
  <div class="info-box">
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBatch.detailFlightInfo.flightNo')}}: </span>
          <span class="info-content">{{detail.flightNo}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBatch.detailFlightInfo.airLineName')}}: </span>
          <span class="info-content">{{detail.airLineName}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBatch.detailFlightInfo.polName')}}: </span>
          <span class="info-content">{{detail.polName}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBatch.detailFlightInfo.polName')}}: </span>
          <span class="info-content">{{detail.polName}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBatch.detailFlightInfo.atd')}}: </span>
          <span class="info-content">{{detail.atd | filterDate(vm)}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBatch.detailFlightInfo.ata')}}: </span>
          <span class="info-content">{{detail.ata | filterDate(vm)}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBatch.detailFlightInfo.transitFlag')}}: </span>
          <span class="info-content">{{detail.transitFlag | filterTransitFlag(vm)}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBatch.detailFlightInfo.secondFlightNo')}}: </span>
          <span class="info-content">{{detail.secondFlightNo}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBatch.detailFlightInfo.polAgentName')}}: </span>
          <span class="info-content">{{detail.polAgentName}}</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'BatchFlightInfo',
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
    },
    filterTransitFlag(flag, vm) {
      return flag ? vm.$t('uexpressBatch.detailFlightInfo.transitFlagTrue') : vm.$t('uexpressBatch.detailFlightInfo.transitFlagFalse')
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
