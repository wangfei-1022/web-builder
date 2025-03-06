<template>
  <div class="info-section-module">
    <div class="info-title">
      {{$t('uexpressOrder.orderDetail.baseInfoTitle')}}
    </div>
    <div class="info-content">
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.detailBaseInfo.memberOrderNo')}}：</span>
        <span class="info-span">{{detail.memberOrderNo}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.detailBaseInfo.orderNo')}}：</span>
        <span class="info-span">{{detail.orderNo}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.detailBaseInfo.orderChannelNo')}}：</span>
        <span class="info-span">
          {{detail.orderChannelNo}}
          <a class="link" @click="getLabel">{{$t('uexpressOrder.detailBaseInfo.seeLabel')}}</a>
        </span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.previousChannelOrderNo')}}：</span>
        <span class="info-span">{{detail.previousChannelOrderNo}} </span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.detailBaseInfo.orderStateName')}}：</span>
        <span class="info-span">{{detail.orderStateName}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.detailBaseInfo.exceptionFlag')}}：</span>
        <span class="info-span">{{detail.exceptionFlag | filterBoolean(vm)}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.detailBaseInfo.exceptionType')}}：</span>
        <span class="info-span">{{detail.abnormalTypeName}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.redeliveryFlag')}}：</span>
        <span class="info-span">{{detail.redeliveryFlag | filterBoolean(vm)}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.sourceChannelOrderNo')}}：</span>
        <span class="info-span">{{detail.sourceChannelOrderNo}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.detailBaseInfo.exceptionMessage')}}：</span>
        <span class="info-span">{{detail.exceptionMessage}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.detailBaseInfo.salesSettlementStateName')}}：</span>
        <span class="info-span">{{detail.salesSettlementStateName}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.detailBaseInfo.detentionFlag')}}：</span>
        <span class="info-span">{{detail.detentionFlag | filterBoolean(vm)}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.detailBaseInfo.productName')}}：</span>
        <span class="info-span">{{detail.productName}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.detailBaseInfo.departureAreaName')}}：</span>
        <span class="info-span">{{detail.departureAreaName}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.detailBaseInfo.destinationAreaName')}}：</span>
        <span class="info-span">{{detail.consigneeCountryName}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.detailBaseInfo.channelName')}}：</span>
        <span class="info-span">{{detail.channelName}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.detailBaseInfo.channelSupplierName')}}：</span>
        <span class="info-span">{{detail.channelSupplierName}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.detailBaseInfo.channelProductName')}}：</span>
        <span class="info-span">{{detail.channelProductName}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.detailBaseInfo.goodsTypeName')}}：</span>
        <span class="info-span">{{detail.goodsTypeName}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.detailBaseInfo.customerName')}}：</span>
        <span class="info-span">{{detail.customerName}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.inboundTime')}}：</span>
        <span class="info-span">{{detail.inboundTime | parseTime}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.orderTime')}}：</span>
        <span class="info-span">{{detail.orderTime | parseTime}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.boxNo')}}：</span>
        <span class="info-span link" @click="viewBoxDetail">{{detail.boxDto ? detail.boxDto.boxNo : ''}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.outboundTime')}}：</span>
        <span class="info-span">{{detail.outboundTime | parseTime}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.outboundNo')}}：</span>
        <span class="info-span link" @click="viewBatchDetail">{{detail.outboundDto ? detail.outboundDto.outboundNo : ''}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.bolNo')}}：</span>
        <span class="info-span link" @click="viewBolDetail">{{detail.bolDto ? detail.bolDto.blNo : ''}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.detailBaseInfo.iossNo')}}：</span>
        <span class="info-span">{{detail.iossNo}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.detailBaseInfo.vatNo')}}：</span>
        <span class="info-span">{{detail.vatNo}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.detailBaseInfo.eoriNo')}}：</span>
        <span class="info-span">{{detail.eoriNo}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.detailBaseInfo.taxNo')}}：</span>
        <span class="info-span">{{detail.taxNo}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.detailBaseInfo.orderSourceName')}}：</span>
        <span class="info-span">{{detail.orderSourceName}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.detailBaseInfo.platformName')}}：</span>
        <span class="info-span">{{detail.platformName}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.detailBaseInfo.channelPushStateName')}}：</span>
        <span class="info-span">{{detail.channelPushStateName}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.detailBaseInfo.channelPushFailMessage')}}：</span>
        <span class="info-span">{{detail.channelPushFailMessage}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{$t('uexpressOrder.detailBaseInfo.remarks')}}：</span>
        <span class="info-span">{{detail.remarks}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { getOrderLabelApi } from '@/api/uexpress/orderManager'
export default {
  name: 'OrderBaseInfo',
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
    filterBoolean(ifException, vm) {
      return ifException ? vm.$t('common.trueText') : vm.$t('common.falseText')
    }
  },
  methods: {
    async getLabel() {
      const res = await getOrderLabelApi({orderId: this.detail.orderId, shardingKey: this.detail.shardingKey})
      if (res.ok && res.content) {
        if (res.content[0] && res.content[0].url) {
          let a = document.createElement('a');
          a.setAttribute('href', res.content[0].url);
          a.setAttribute('target', '_blank');
          a.click();
        }
      }
    },
    viewBoxDetail() {
      this.$router.push({name: 'UexpressBoxDetail', params: {boxId: this.detail.boxDto.id, shardingKey: this.detail.boxDto.shardingKey}})
    },
    viewBolDetail() {
      this.$router.push({name: 'UexpressBLDetail', params: { blId: this.detail.bolDto.id }})
    },
    viewBatchDetail() {
      this.$router.push({name: 'UexpressBatchDetail', params: {outboundId: this.detail.outboundDto.id, shardingKey: this.detail.outboundDto.shardingKey}})
    }
  }
}
</script>
<style lang="scss" scoped="">
.info-item{
  font-size: 14px;
  margin-bottom: 20px;
}
.link{
  color: #1890ff;
  cursor: pointer;
  margin-left: 5px;
}
.info-section-module .info-item .info-label{
  width: 112px;
  margin-right: 0px;
}
</style>
