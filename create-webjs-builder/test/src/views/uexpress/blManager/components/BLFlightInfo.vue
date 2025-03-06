<template>
  <div class="info-box">
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBL.detailFlightInfo.flightNo')}}: </span>
          <span class="info-content">{{detail.flightNo}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBL.detailFlightInfo.airLineName')}}: </span>
          <span class="info-content">{{detail.airLineName}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBL.detailFlightInfo.polName')}}: </span>
          <span class="info-content">{{detail.polName}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBL.detailFlightInfo.polName')}}: </span>
          <span class="info-content">{{detail.polName}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBL.detailFlightInfo.eta')}}: </span>
          <span class="info-content">{{detail.atdFormat}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBL.detailFlightInfo.etd')}}: </span>
          <span class="info-content">{{detail.ataFormat}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBL.detailFlightInfo.transitFlag')}}: </span>
          <span class="info-content">{{detail.transitFlag | filterTransitFlag(vm)}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBL.detailFlightInfo.secondFlightNo')}}: </span>
          <span class="info-content">{{detail.secondFlightNo}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBL.detailFlightInfo.polAgentName')}}: </span>
          <span class="info-content">{{detail.polAgentName}}</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'BLFlightInfo',
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
      return flag ? vm.$t('uexpressBL.detailFlightInfo.transitFlagTrue') : vm.$t('uexpressBL.detailFlightInfo.transitFlagFalse')
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
