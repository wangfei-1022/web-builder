<template>
  <div class="info-box">
    <el-table :data="packageList">
      <el-table-column
        align="center"
        prop="orderChannelNo"
        :label="$t('uexpressBox.boxPackageInfo.orderChannelNo')"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="orderNo"
        :label="$t('uexpressBox.boxPackageInfo.orderNo')"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="productName"
        :label="$t('uexpressBox.boxPackageInfo.productName')"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="destinationAreaName"
        :label="$t('uexpressBox.boxPackageInfo.destinationAreaName')"
        width="80">
      </el-table-column>
      <el-table-column
        align="center"
        prop="channelName"
        :label="$t('uexpressBox.boxPackageInfo.channelName')"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="channelSupplierName"
        :label="$t('uexpressBox.boxPackageInfo.channelSupplierName')"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="parcelStateName"
        :label="$t('uexpressBox.boxPackageInfo.parcelStateName')"
        width="80">
      </el-table-column>
      <el-table-column
        align="center"
        prop="id"
        :label="$t('common.operation')"
        width="120">
        <template slot-scope="{row}">
          <el-button type="text" @click="gotoOrderDetail(row)">{{$t('uexpressBox.boxPackageInfo.viewDetailBtn')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getBoxPackageList" />
  </div>
</template>
<script>
import { getBoxPackageListApi } from '@/api/uexpress/boxManager'
  export default {
    name: 'BoxPackageInfo',
    data() {
      return {
        packageList: [],
        pageSize: 50,
        pageNum: 0,
        total: 0
      }
    },
    props: {
      detail: {
        type: Object,
        default: () => {}
      }
    },
    watch: {
      'detail': function(newVal, oldVal) {
        this.getBoxPackageList()
      }
    },
    methods: {
      async getBoxPackageList() {
        const res = await getBoxPackageListApi({
          boxId: this.detail.id,
          boxSk: this.detail.shardingKey,
          pageSize: this.pageSize,
          pageNum: this.pageNum
        })
        if (res && res.ok) {
          this.packageList = res.content.list
          this.total = res.content.total
        } else {
          this.packageList = []
          this.total = 0
        }
      },
      gotoOrderDetail(orderObj) {
        if (orderObj.orderId && orderObj.orderShardingKey) {
          this.$router.push({name: 'UexpressOrderDetail', params: {orderId: orderObj.orderId, shardingKey: orderObj.orderShardingKey}})
        } else {
          this.$message.warning(this.$t('uexpressBox.boxPackageInfo.orderInvalid'))
        }
      }
    }
  }
</script>
<style lang="scss" scoped="">
.info-box{
  padding: 20px;
}
</style>
