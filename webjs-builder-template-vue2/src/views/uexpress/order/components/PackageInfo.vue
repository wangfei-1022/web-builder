<template>
  <div class="info-section-module">
    <div class="info-title">
      {{$t('uexpressOrder.orderDetail.packageTitle')}}
    </div>
    <div class="info-content">
      <div class="info-item">
        <span class="info-label">
          {{$t('uexpressOrder.detailPackageInfo.preChargeWeight')}}({{detail.preWeightUnitName}}):
        </span>
        <span class="info-span">{{detail.preWeight}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">
          {{$t('uexpressOrder.detailPackageInfo.preDimension')}}({{detail.preDimensionUnitName}}):
        </span>
        <span class="info-span">{{detail.preDimension}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">
          {{$t('uexpressOrder.detailPackageInfo.weight')}}({{detail.weightUnitName}}):
        </span>
        <span class="info-span">{{detail.weight}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">
          {{$t('uexpressOrder.detailPackageInfo.preVolumeWeight')}}({{detail.volumeWeightUnitName}}):
        </span>
        <span class="info-span">{{detail.volumeWeight}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">
          {{$t('uexpressOrder.detailPackageInfo.chargeWeight')}}:
        </span>
        <span class="info-span">{{detail.chargeWeight}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">
          {{$t('uexpressOrder.detailPackageInfo.dimension')}}({{detail.dimensionUnitName}}):
        </span>
        <span class="info-span">{{detail.dimension}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">
          {{$t('uexpressOrder.detailPackageInfo.volumeWeightRate')}}:
        </span>
        <span class="info-span">{{detail.volumeWeightRate}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.declareWeight')}}({{detail.declareWeightUnitName}}):</span>
        <span class="info-span">{{detail.declareWeight}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.weightImageUrl')}}:</span>
        <span class="info-span" v-if="detail.weightImageUrlList && detail.weightImageUrlList.length">
          <PreviewImageList :imgList="detail.weightImageUrlList" imgWidth="200px" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import PreviewImageList from '@/components/ImagePreview/PreviewImageList'
  export default {
    name: 'OrderPackageInfo',
    data() {
      return {}
    },
    components: {
      PreviewImageList
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
