<template>
  <div class="info-section-module">
    <div class="info-title">
      {{$t('uexpressOrder.orderDetail.pickUpPostAddress')}}
    </div>
    <div class="info-content">
      <div v-if="detail.firstMileType === 1">
        <div class="info-item">
          <span class="info-label">{{$t('uexpressOrder.pickupInfo.firstMileTypeName')}}: </span>
          <span class="info-content">{{detail.firstMileTypeName}}</span>
        </div>
        <div class="info-item">
          <span class="info-label">{{$t('uexpressOrder.pickupInfo.selfDeliveryStationName')}}: </span>
          <span class="info-content">{{detail.selfDeliveryStationName}}</span>
        </div>
        <div class="info-item">
          <span class="info-label">{{$t('uexpressOrder.pickupInfo.selfDeliveryCompanyName')}}: </span>
          <span class="info-content">{{detail.selfDeliveryCompanyName}}</span>
        </div>
        <div class="info-item">
          <span class="info-label">{{$t('uexpressOrder.pickupInfo.selfDeliveryNo')}}: </span>
          <span class="info-content">{{detail.selfDeliveryNo}}</span>
        </div>
      </div>
      <div v-if="detail.firstMileType === 2">
        <div class="info-item">
          <span class="info-label">{{$t('uexpressOrder.pickupInfo.firstMileTypeName')}}: </span>
          <span class="info-content">{{detail.firstMileTypeName}}</span>
        </div>
        <div class="info-item">
          <span class="info-label">{{$t('uexpressOrder.pickupInfo.pickUpDateTime')}}: </span>
          <span class="info-content">{{detail.pickUpDateTime | parseDate}}</span>
        </div>
        <div class="info-item full-line">
          <span class="info-label">{{$t('uexpressOrder.pickupInfo.pickUpPostAddress')}}: </span>
          <span class="info-content">
            {{detail.pickUpPostAddress.personalName}}
            {{detail.pickUpPostAddress.mobile}}
            {{detail.pickUpPostAddress.zipCode}}
            {{detail.pickUpPostAddress.detailAddress}}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderPackageInfo',
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
</style>
