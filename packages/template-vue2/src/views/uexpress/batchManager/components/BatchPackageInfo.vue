<template>
  <div class="info-box">
    <el-table :data="packageList">
      <el-table-column
        align="center"
        prop="boxNo"
        :label="$t('uexpressBatch.detailPackageInfo.boxNo')"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="orderChannelNo"
        :label="$t('uexpressBatch.detailPackageInfo.orderChannelNo')"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="orderNo"
        :label="$t('uexpressBatch.detailPackageInfo.orderNo')"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="productName"
        :label="$t('uexpressBatch.detailPackageInfo.productName')"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="destinationAreaName"
        :label="$t('uexpressBatch.detailPackageInfo.destinationAreaName')"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="channelName"
        :label="$t('uexpressBatch.detailPackageInfo.channelName')"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="channelSupplierName"
        :label="$t('uexpressBatch.detailPackageInfo.channelSupplierName')"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="parcelStateName"
        :label="$t('uexpressBatch.detailPackageInfo.parcelStateName')"
        width="80">
      </el-table-column>
      <el-table-column
        align="center"
        prop="exceptionFlag"
        :label="$t('uexpressBatch.detailPackageInfo.exceptionFlag')"
        width="80">
      </el-table-column>
      <el-table-column
        align="center"
        prop="exceptionName"
        :label="$t('uexpressBatch.detailPackageInfo.exceptionName')"
        width="80">
      </el-table-column>
    </el-table>
    <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getBoxPackageList" />
  </div>
</template>
<script>
import { getBatchParcelListApi } from '@/api/uexpress/batchManager'
  export default {
    name: 'BatchPackageInfo',
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
        const res = await getBatchParcelListApi({
          outboundId: this.detail.id,
          outboundSk: this.detail.shardingKey,
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
      }
    }
  }
</script>
<style lang="scss" scoped="">
.info-box{
  padding: 20px;
}
</style>
