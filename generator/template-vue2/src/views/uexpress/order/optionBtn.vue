<template>
  <div class="option-btn-wrap">
    <el-button
      type="text"
      size="mini"
      @click="params.context.componentParent.cancelFn(params.data)"
      v-if="params.data.orderState === 100 || params.data.orderState === 110">
      {{$t('common.cancelBtn')}}
    </el-button>
    <el-button
    type="text"
    size="mini"
    @click="params.context.componentParent.viewOrderDetail(params.data)">
      {{$t('uexpressOrder.viewOrderDetailBtn')}}
    </el-button>
    <el-button
    type="text"
    size="mini"
    @click="params.context.componentParent.viewTrackFn(params.data)">
      {{$t('uexpressOrder.viewTrack')}}
    </el-button>
    <el-button
      type="text"
      size="mini"
      v-if="params.context.componentParent.checkUpdateConsigneeAddress(params.data)"
      @click="params.context.componentParent.updateConsigneeAddressFn(params.data)"
    >
      {{$t('uexpressOrder.updateConsigneeAddress')}}
    </el-button>
    <el-button
      type="text"
      size="mini"
      v-if="params.context.componentParent.checkUpdateGoodsItemList(params.data)"
      @click="params.context.componentParent.updateGoodsItemListFn(params.data)"
    >
      {{$t('uexpressOrder.updateGoodsItem')}}
    </el-button>
    <el-button
      size="mini"
      type="text"
      @click="params.context.componentParent.printPdfFn(params.data)"
      v-if="params.context.componentParent.checkPrint(params.data)"
    >
      {{$t('uexpressOrder.printPdf')}}
    </el-button>
    <el-button
      type="text"
      size="mini"
      @click="params.context.componentParent.recoverFn(params.data)"
      v-if="params.data.orderState === 500">
      {{$t('uexpressOrder.recover')}}
    </el-button>
  </div>
</template>
<script>
import { cancelOrderApi } from '@/api/uexpress/orderManager'
export default {
  name: "OrderListOptionBtn",
  data() {
    return {};
  },
  methods: {

  }
};
</script>
<style lang="scss" scoped>
.option-btn-wrap {
  span {
    cursor: pointer;
  }
}
</style>

