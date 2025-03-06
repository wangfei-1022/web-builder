<template>
  <div class="info-box">
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBL.detailClearanceInfo.polDeclareAgentName')}}: </span>
          <span class="info-content">{{detail.polDeclareAgentName}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBL.detailClearanceInfo.podDeclareAgentName')}}: </span>
          <span class="info-content">{{detail.podDeclareAgentName}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBL.detailClearanceInfo.importDeclareTime')}}: </span>
          <span class="info-content">{{detail.importDeclareTimeFormat}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBL.detailClearanceInfo.importDeclareFinishTime')}}: </span>
          <span class="info-content">{{detail.importDeclareFinishTimeFormat}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBL.detailClearanceInfo.mailDeliveryTime')}}: </span>
          <span class="info-content">{{detail.mailDeliveryTimeFormat}}</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'BLClearanceInfo',
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
      return date ? vm.$moment(Number(date)).format('YYYY-MM-DD HH:mm:ss') : ''
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
