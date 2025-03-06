<template>
  <div class="info-box">
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBox.boxDetail.boxNo')}}: </span>
          <span class="info-content">{{detail.boxNo}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBox.boxDetail.boxStateName')}}: </span>
          <span class="info-content">{{detail.boxStateName}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBox.boxDetail.createTime')}}: </span>
          <span class="info-content">{{detail.createTime | parseTime}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBox.boxDetail.boxTime')}}: </span>
          <span class="info-content">{{detail.boxTime | parseTime}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBox.boxDetail.outboundNo')}}: </span>
          <span class="info-content">{{detail.outboundNo}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBox.boxDetail.outboundTime')}}: </span>
          <span class="info-content">{{detail.outboundTime | parseTime}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBox.boxDetail.destinationAreaName')}}: </span>
          <span class="info-content">{{detail.countries | filterCountries}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBox.boxDetail.channelNames')}}: </span>
          <span class="info-content">{{detail.channelNames | filterChannelNames}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBox.boxDetail.channelSupplierName')}}: </span>
          <span class="info-content">{{detail.channelSupplierName}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBox.boxDetail.parcelCount')}}: </span>
          <span class="info-content">{{detail.parcelCount}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBox.boxDetail.polName')}}: </span>
          <span class="info-content">{{detail.polName}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBox.boxDetail.podName')}}: </span>
          <span class="info-content">{{detail.podName}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBox.boxDetail.weight')}}: </span>
          <span class="info-content">{{detail.weight}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBox.boxDetail.boxWeight')}}: </span>
          <span class="info-content">{{detail.boxWeight}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBox.boxDetail.dimension')}}: </span>
          <span class="info-content">{{detail.dimension}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBox.boxDetail.remarks')}}: </span>
          <span class="info-content">{{detail.remarks}}</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import '@/styles/uexpress-base-info.scss'
  export default {
    name: 'BoxBaseInfo',
    data() {
      return {
        countriesStr: ''
      }
    },
    props: {
      detail: {
        type: Object,
        default: () => {}
      }
    },
    filters: {
      filterChannelNames(channelNames) {
        return channelNames && channelNames.length > 0 ? channelNames.join(',') : ''
      },
      filterCountries(countries) {
        let _arr = countries.map(item => item.localShortName)
        return _arr.join(',')
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
