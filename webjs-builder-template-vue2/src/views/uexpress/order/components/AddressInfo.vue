<template>
  <div class="">
    <div class="info-item">
      <span class="info-label">{{$t(`${transferKey}.personalName`)}}: </span>
      <span class="info-span">{{infoData.personalName}}</span>
    </div>
    <div class="info-item">
      <span class="info-label">{{$t(`${transferKey}.mobile`)}}: </span>
      <span class="info-span">{{infoData.mobile}}</span>
    </div>
    <div class="info-item">
      <span class="info-label">{{$t(`${transferKey}.companyName`)}}: </span>
      <span class="info-span">{{infoData.companyName}}</span>
    </div>
    <div class="info-item">
      <span class="info-label">{{$t(`${transferKey}.email`)}}: </span>
      <span class="info-span">{{infoData.email}}</span>
    </div>
    <div class="info-item full-line">
      <span class="info-label">{{$t(`${transferKey}.detailAddress`)}}: </span>
      <span class="info-span">{{infoData.detailAddress}}</span>
    </div>
    <div class="info-item full-line">
      <span class="info-label">{{$t(`${transferKey}.detailAddress2`)}}: </span>
      <span class="info-span">{{infoData.detailAddress2}}</span>
    </div>
    <div class="info-item">
      <span class="info-label">{{$t(`${transferKey}.houseNo`)}}: </span>
      <span class="info-span">{{infoData.houseNo}}</span>
    </div>
    <div class="info-item">
      <span class="info-label">{{$t(`${transferKey}.roomNo`)}}: </span>
      <span class="info-span">{{infoData.roomNo}}</span>
    </div>
    <div class="info-item full-line">
      <span class="info-label">{{$t(`${transferKey}.area1`)}}: </span>
      <span class="info-span">
        {{infoData.countryName}} {{infoData.provinceName}} {{infoData.cityName}}
      </span>
    </div>
    <div class="info-item">
      <span class="info-label">{{$t(`${transferKey}.zipCode`)}}: </span>
      <span class="info-span">{{infoData.zipCode}}</span>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ConsignorInfoTabs',
    data() {
      return {}
    },
    props: {
      infoData: {
        type: Object,
        default: () => {}
      },
      transferKey: {
        type: String,
        default: 'consigneeInfo'
      }
    },
    computed: {}
  }
</script>
<style lang="scss" scoped="">
.tab-item-wrap{
  padding: 10px;
}
.info-item{
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
