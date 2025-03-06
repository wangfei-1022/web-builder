<template>
  <div class="info-box">
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBatch.detailPlateInfo.plateNo')}}: </span>
          <span class="info-content">{{detail.plateNo}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBatch.detailPlateInfo.driverName')}}: </span>
          <span class="info-content">{{detail.driverName}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBatch.detailPlateInfo.driverMobile')}}: </span>
          <span class="info-content">{{detail.driverMobile}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBatch.detailPlateInfo.truckSupplierName')}}: </span>
          <span class="info-content">{{detail.truckSupplierName}}</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'BatchPlateInfo',
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
