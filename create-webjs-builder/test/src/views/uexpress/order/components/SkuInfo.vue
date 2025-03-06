<template>
  <div class="info-section-module">
    <div class="info-title">
      {{$t('uexpressOrder.orderDetail.productTitle')}}
    </div>
    <div class="info-content">
      <el-table :data="detail.orderGoodsItemDtos" border>
        <el-table-column prop="seqNo" :label="$t('uexpressOrder.detailGoodsInfo.seqNo')" min-width="80"></el-table-column>
        <el-table-column prop="englishName" :label="$t('uexpressOrder.detailGoodsInfo.englishName')" min-width="140"></el-table-column>
        <el-table-column prop="localName" :label="$t('uexpressOrder.detailGoodsInfo.localName')" min-width="140"></el-table-column>
        <el-table-column prop="quantityValue" :label="$t('uexpressOrder.detailGoodsInfo.quantityValue')" min-width="80">
        </el-table-column>
        <el-table-column prop="weight" label="" min-width="140">
          <template slot="header">
            {{$t('uexpressOrder.detailGoodsInfo.weight')}}（KG）
          </template>
        </el-table-column>
        <el-table-column  prop="declareValue" label="" min-width="140">
          <template #header>
            {{$t('uexpressOrder.detailGoodsInfo.declareValue')}}（{{detail.preDeclaredCurrency}}）
          </template>
        </el-table-column>
        <el-table-column prop="sku" :label="$t('uexpressOrder.detailGoodsInfo.sku')" min-width="100"></el-table-column>
        <el-table-column prop="hsCode" :label="$t('uexpressOrder.detailGoodsInfo.hsCode')" min-width="100"></el-table-column>
        <el-table-column prop="salesUrl" :label="$t('uexpressOrder.detailGoodsInfo.salesUrl')" min-width="220"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'OrderProductInfo',
    data() {
      return {}
    },
    props: {
      detail: {
        type: Object,
        default: () => {}
      }
    }
  }
</script>
<style lang="scss" scoped>
.info-box{
  padding: 20px;
}
</style>
