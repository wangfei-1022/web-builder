<template>
  <div>
    <el-table
      :data="tableData"
      border
      :height="height"
      size="mini"
      style="width: 100%">
      <el-table-column prop="orderNo" min-width="180" :label="$t('packageWarehouse.logisticParcel.orderNo')" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="trackingNo" min-width="180" :label="$t('packageWarehouse.logisticParcel.trackingNo')" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="trackingNo2" min-width="180" :label="$t('packageWarehouse.logisticParcel.trackingNo2')" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="customerRefNo" min-width="180" :label="$t('packageWarehouse.logisticParcel.customerRefNo')" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="productName" min-width="180" :label="$t('packageWarehouse.logisticParcel.productName')" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="inboundTime" :label="$t('packageWarehouse.logisticParcel.inboundTime')">
        <template slot-scope="{row}">
          {{row.inboundTime | filterDate(vm)}}
        </template>
      </el-table-column>
      <el-table-column prop="inboundWeight" :label="$t('packageWarehouse.logisticParcel.inboundWeight')">
      </el-table-column>
      <el-table-column prop="parcelId" :label="$t('packageWarehouse.logisticParcel.operation')">
        <template slot-scope="{row}">
          <el-button type="text" @click="unbindParcel(row.parcelId)">
            {{$t('packageWarehouse.logisticParcel.unbindParcelBtn')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import { unbindParcelApi } from '@/api/packageWarehouse'
  export default {
    name: 'LogisticsParcelTable',
    props: {
      tableData: {
        type: Array,
        default: () => []
      },
      height: {
        type: [String, Number],
        default: 'auto'
      }
    },
    data() {
      return {
        vm: this
      }
    },
    filters: {
      filterDate(time, vm) {
        return time ? vm.$moment(Number(time)).format('YYYY-MM-DD HH:mm:ss') : ''
      }
    },
    methods: {
      unbindParcel(_parcelId) {
        this.$confirm(this.$t('packageWarehouse.logisticParcel.unbindConfrim'), this.$t('common.tips'), {
          confirmButtonText: this.$t('packageWarehouse.logisticParcel.unbindParcelBtn'),
          cancelButtonText: this.$t('common.cancelBtn'),
          type: 'warning'
        }).then(() => {
          this.submitUnbind(_parcelId)
        }).catch(() => {})
      },
      async submitUnbind(_parcelId) {
        const res = await unbindParcelApi(_parcelId)
        if (res && res.ok) {
          this.$emit('refreshData')
        }
      }
    },
    mounted() {}
  }
</script>
<style lang="scss" scoped>
</style>
