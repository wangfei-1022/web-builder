<template>
  <div class="report-wrap">
    <!-- <span>{{$t('packageWarehouse.currReportMode')}}: </span>
    <span> &nbsp;&nbsp;{{channelList[choosedChannel].label}}</span> -->
    <el-button type="text" @click="showDialog = true" style="margin-left: 10px; font-size: 14px;">{{$t('packageWarehouse.setReportBtn')}}</el-button>
    <el-dialog ref="formData" :visible.sync="showDialog" :title="$t('packageWarehouse.setReportTitle')" width="400px" :close-on-click-modal="false">
      <!-- <div class="radio-wrap" v-if="showType == 'radiobox'">
        <el-radio-group v-model="choosedChannel[0]">
          <el-radio v-for="item in channelList" :key="item.value" :label="item.value" style="margin: 10px;">{{item.label}}</el-radio>
        </el-radio-group>
      </div> -->
      <div class="radio-wrap">
        <el-checkbox-group v-model="choosedChannel">
          <el-checkbox v-for="item in channelList" :key="item.label + item.value" :label="item.value">{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="showDialog = false">{{$t('packageWarehouse.confirmBtn')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'ReportController',
  props: {
    channel: {
      type: Array,
      /*
      * 0 报重量
      * 1 报国家
      * 2 报渠道
      */
      default: () => [0, 1, 2, 3]
    },
    reportList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showDialog: false
    }
  },
  computed: {
    channelList: function() {
      if (this.reportList.length === 0) {
        return [
          {
            label: this.$t('packageWarehouse.reportWeight'),
            value: 0
          },
          {
            label: this.$t('packageWarehouse.reportCountry'),
            value: 1
          },
          {
            label: this.$t('packageWarehouse.reportProduct'),
            value: 2
          },
          {
            label: this.$t('packageWarehouse.reportArea'),
            value: 3
          }
        ]
      } else {
        return this.reportList
      }
    },
    choosedChannel: {
      get: function() {
        return this.channel
      },
      set: function(val) {
        const _sortVal = val.sort((a, b) => a - b)
        this.$emit('update:channel', _sortVal)
      }
    }
  },
  watch: {},
  methods: {},
  mounted() {},
  created() {}
}
</script>
<style lang="scss" scoped>
.report-wrap{
  display: inline-block;
  vertical-align: baseline;
  font-size: 14px;
  color: #606266;
  margin-left: 10px;
}
</style>
