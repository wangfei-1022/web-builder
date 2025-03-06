<template>
  <div class="mt-10">
    <el-table :data="tableData" :height="calcInfoHeight" style="width: 100%;">
      <el-table-column type="index" :index="setSeqNo" :label="$t('uexpressTrace.seqNo')" width="80" />
      <el-table-column prop="happenTime" :label="$t('uexpressTrace.happenTime')" width="160">
        <template slot-scope="{row}">
          {{row.happenTime | parseTimeZoneStr(row.happenTimeZone)}}
        </template>
      </el-table-column>
      <el-table-column prop="trackingCode" :label="$t('uexpressTrace.standTraceNode')" width="160">
        <template slot-scope="{row}">
          {{row | filterNode}}
        </template>
      </el-table-column>
      <el-table-column prop="trackingDesc" :label="$t('uexpressTrace.trackingDesc')" width="400"></el-table-column>
      <el-table-column prop="sourceTrackingCode" :label="$t('uexpressTrace.sourceTrackingCode')" width="160"></el-table-column>
      <el-table-column prop="sourceTrackingDesc" :label="$t('uexpressTrace.sourceTrackingDesc')" width="400"></el-table-column>
      <el-table-column prop="trackingChannelName" :label="$t('uexpressTrace.trackingChannelName')" width="100"></el-table-column>
      <el-table-column prop="happenCountryShortName" :label="$t('uexpressTrace.happenCountryShortName')" width="160"></el-table-column>
      <el-table-column prop="happenCityShortName" :label="$t('uexpressTrace.happenCityShortName')" width="160"></el-table-column>
      <el-table-column prop="happenAddress" :label="$t('uexpressTrace.happenAddress')" width="160"></el-table-column>
      <el-table-column prop="happenTimeZone" :label="$t('uexpressTrace.happenTimeZone')" width="160"></el-table-column>
      <el-table-column prop="collectTime" :label="$t('uexpressTrace.collectTime')" width="200">
        <template slot-scope="{row}">
          {{row.collectTime | parseTimeZoneStr(row.happenTimeZone)}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    name: 'TraceSearchDetail',
    props: {
      tableData: {
        type: Array,
        default: () => []
      },
      height: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        vm: this
      }
    },
    filters: {
      filterDate(dateStr, vm) {
        return dateStr ? vm.$moment(Number(dateStr)).format('YYYY-MM-DD HH:mm:ss') : ''
      },
      filterNode(obj) {
        if (obj) {
          return `${obj.trackingCode} / ${obj.trackingName}`
        }
        return ''
      }
    },
    computed: {
      calcInfoHeight: function() {
        return this.height - 60
      }
    },
    methods: {
      setSeqNo(index) {
        return index + 1
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
