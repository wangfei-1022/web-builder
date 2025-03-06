<template>
  <div v-loading="loading" class="right-main-wrapper">
    <div class="table-wrap">
      <el-table :data="dataList" style="width: 100%;height: calc(100vh - 200px);" :border="true">
        <el-table-column
          align="center"
          header-align="center"
          prop="orderNo"
          :label="$t('packageWarehouse.orderNo')"
          width="200">
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="trackingNo"
          :label="$t('packageWarehouse.trackingNo')"
          width="200">
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="customerRefNo"
          :label="$t('packageWarehouse.customerRefNo')"
          width="200">
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="countryName"
          :label="$t('packageWarehouse.countryName')"
          width="200">
        </el-table-column>
        <el-table-column
          align="right"
          header-align="center"
          prop="declareWeight"
          :label="$t('packageWarehouse.declareWeight')"
          width="200">
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="productName"
          :label="$t('packageWarehouse.productName')"
          width="200">
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="lockFlag"
          :label="$t('packageWarehouse.fastening')"
          width="160">
          <template slot-scope="{row}">
            {{row.lockFlag | filterLockFlag(vm)}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="parcelStateName"
          :label="$t('packageWarehouse.status')"
          width="160">
        </el-table-column>
      </el-table>
      <!-- <Pagination :total="totalData" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getData" /> -->
    </div>
  </div>
</template>
<script>
import { getLargePackageDetailApi } from '@/api/packageWarehouse'
export default {
  name: 'LargePackageDetail',
  components: {},
  data() {
    return {
      loading: false,
      dataList: [],
      // pageSize: 200,
      // pageNum: 1,
      vm: this
    }
  },
  computed: {},
  watch: {},
  filters: {
    filterLockFlag(lockFlag, vm) {
      return lockFlag ? vm.$t('common.trueText') : vm.$t('common.falseText')
    }
  },
  methods: {
    async getData() {
      this.loading = true
      const res = await getLargePackageDetailApi(this.$route.params.id)
      if (res && res.ok && res.content) {
        if (res.content.parcelDTOList) {
          this.dataList = res.content.parcelDTOList.sort((item1, item2) => Number(item1.parcelState) - Number(item2.parcelState))
        }
      } else {
        this.dataList = []
      }
      this.loading = false
      return true
    }
  },
  created() {
    this.getData()
  },
  mounted() { }
}
</script>
