<template>
	<el-dialog :visible.sync="visible" :close-on-click-modal="false" width="800px" :title='$t("uexpressOrder.updateGoodsItem")'>
    <el-table :data="orderGoodsItemDtos" border>
      <el-table-column prop="seqNo" :label="$t('uexpressOrder.detailGoodsInfo.seqNo')" min-width="50">
        <template slot-scope="{$index}">
          {{$index + 1}}
        </template>
      </el-table-column>
      <el-table-column prop="englishName" :label="$t('uexpressOrder.detailGoodsInfo.englishName')" min-width="140">
        <template slot-scope="{row}">
          <el-input v-model="row.englishName" />
        </template>
      </el-table-column>
      <el-table-column prop="localName" :label="$t('uexpressOrder.detailGoodsInfo.localName')" min-width="140">
        <template slot-scope="{row}">
          <el-input v-model="row.localName" />
        </template>
      </el-table-column>
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
    <div slot="footer" class="option-btn-wrap">
      <el-button size="mini" @click="visible = false">{{ $t("common.cancel") }}</el-button>
      <el-button size="mini" type="primary" @click="confirmFn" :loading="loading">{{ $t("common.confirm") }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { updateGoodsItemListApi } from '@/api/uexpress/orderManager'
import { getOrderDetailApi } from '@/api/uexpress/orderManager'
export default {
	name: "UpdateGoodsItemListDialog",
	data() {
		return {
      // 批量换产品
      visible: false,
      loading: false,
      orderGoodsItemDtos: [],
      detail: {},
      row: {}
    };
	},
  methods: {
    // 批量换产品
    show(row) {
      this.row = row
      this.visible = true
      getOrderDetailApi({orderId: row.orderId, shardingKey: row.shardingKey}).then(res => {
        if(res.ok) {
          this.detail = res.content
          this.orderGoodsItemDtos = res.content.orderGoodsItemDtos
        }
      })
    },
    confirmFn() {
      let VALID = true
      this.orderGoodsItemDtos.forEach(v => {
        if(!v.englishName || !v.localName) {
          VALID = false
        }
      })
      let data = {
        orderId: this.row.orderId, 
        shardingKey: this.row.shardingKey,
        updateOrderSalesGoodsItemMemberDTOList: this.orderGoodsItemDtos
      }
      this.loading = true
      updateGoodsItemListApi(data).then(res => {
        if (res.ok) {
          this.visible = false
          this.$message.success(this.$t('uexpressOrder.operSuccess'))
        }
        this.loading = false
      })
    },
  }
};
</script>
<style lang="scss" scoped>

</style>

