<template>
  <div>
    <el-table
      :data="tableData"
      border
      height="360"
      style="width: 100%"
      row-key="id"
      @expand-change="saveExpandStatus"
      :expand-row-keys="expandedIds">
      <el-table-column type="expand">
        <template slot-scope="props">
          <SectionTitle :title="$t('packageWarehouse.logisticManager.parcelListTitle')" style="margin-top: 0;" />
          <LogisticsParcelTable :tableData="props.row.parcelDTOList" @refreshData="refreshData" />
        </template>
      </el-table-column>
      <el-table-column prop="logisticsNo" min-width="180" :label="$t('packageWarehouse.logisticChild.logisticsNo')" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="chineseName" min-width="180" :label="$t('packageWarehouse.logisticChild.chineseName')" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="receivedTime" min-width="180" :label="$t('packageWarehouse.logisticChild.receivedTime')">
        <template slot-scope="{row}">
          {{row.inboundTime | filterDate(vm)}}
        </template>
      </el-table-column>
      <el-table-column prop="estimateArrivalTime" min-width="180" :label="$t('packageWarehouse.logisticChild.estimateArrivalTime')">
        <template slot-scope="{row}">
          {{row.inboundTime | filterDate(vm)}}
        </template>
      </el-table-column>
      <el-table-column prop="realArrivalTime" min-width="180" :label="$t('packageWarehouse.logisticChild.realArrivalTime')">
        <template slot-scope="{row}">
          {{row.inboundTime | filterDate(vm)}}
        </template>
      </el-table-column>
      <el-table-column prop="estimateLogisticsAmount" min-width="120" :label="$t('packageWarehouse.logisticChild.estimateLogisticsAmount')">
      </el-table-column>
      <el-table-column prop="realLogisticsAmount" min-width="120" :label="$t('packageWarehouse.logisticChild.realLogisticsAmount')">
      </el-table-column>
      <el-table-column prop="estimateParcelAmount" min-width="120" :label="$t('packageWarehouse.logisticChild.estimateParcelAmount')">
      </el-table-column>
      <el-table-column prop="realParcelAmount" min-width="120" :label="$t('packageWarehouse.logisticChild.realParcelAmount')">
      </el-table-column>
      <el-table-column prop="estimateWeight" min-width="140" :label="$t('packageWarehouse.logisticChild.estimateWeight')">
      </el-table-column>
      <el-table-column prop="logisticsStateName" min-width="120" :label="$t('packageWarehouse.logisticChild.logisticsStateName')">
      </el-table-column>
      <el-table-column prop="remark" min-width="180" show-overflow-tooltip :label="$t('packageWarehouse.logisticChild.remark')">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import LogisticsParcelTable from './LogisticsParcelTable'
  import SectionTitle from '@/components/Cargo/Common/sectionTitle'
  export default {
    name: 'LogisticsChildList',
    components: {
      SectionTitle,
      LogisticsParcelTable
    },
    props: {
      tableData: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        vm: this,
        expandedIds: []
      }
    },
    filters: {
      filterDate(time, vm) {
        return time ? vm.$moment(Number(time)).format('YYYY-MM-DD HH:mm:ss') : ''
      }
    },
    methods: {
      refreshData() {
        this.$emit('refreshData')
      },
      saveExpandStatus(row, expandedRows) {
        if (expandedRows.length > 0) {
          this.expandedIds = expandedRows.map(item => item.id)
        } else {
          this.expandedIds = []
        }
      }
    },
    mounted() {}
  }
</script>
<style lang="scss" scoped>
::v-deep .el-table__expanded-cell{
  padding: 5px;
}
</style>
