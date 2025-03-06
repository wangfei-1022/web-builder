<template>
  <div class="info-box">
    <el-table :data="packageList">
      <el-table-column
        align="center"
        prop="orderNo"
        :label="$t('uexpressBL.detailPackageInfo.orderNo')"
        width="140">
      </el-table-column>
      <el-table-column
        align="center"
        prop="boxNo"
        :label="$t('uexpressBL.detailPackageInfo.boxNo')"
        width="140">
      </el-table-column>
      <el-table-column
        align="center"
        prop="outboundNo"
        :label="$t('uexpressBL.detailPackageInfo.outboundNo')"
        width="140">
      </el-table-column>
      <el-table-column
        align="center"
        prop="destinationAreaName"
        :label="$t('uexpressBL.detailPackageInfo.destinationAreaName')"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="channelName"
        :label="$t('uexpressBL.detailPackageInfo.channelName')"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="channelSupplierName"
        :label="$t('uexpressBL.detailPackageInfo.channelSupplierName')"
        width="140">
      </el-table-column>
      <el-table-column
        align="center"
        prop="weight"
        :label="$t('uexpressBL.detailPackageInfo.weight')"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="dimension"
        :label="$t('uexpressBL.detailPackageInfo.dimension')"
        width="120">
      </el-table-column>
    </el-table>
    <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getBLPackageList" />
  </div>
</template>
<script>
import { getBLParcelListApi } from '@/api/uexpress/blManager'
  export default {
    name: 'BLListInfo',
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
      'detail': function(val) {
        this.getBLPackageList()
      }
    },
    methods: {
      async getBLPackageList() {
        const res = await getBLParcelListApi({
          bolId: this.detail.id,
          bolSk: this.detail.shardingKey,
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
