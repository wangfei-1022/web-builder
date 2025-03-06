<template>
  <div class="info-box">
    <el-table :data="detail.logEntityLogDtos">
      <el-table-column
        align="center"
        prop="opByName"
        :label="$t('uexpressOrder.operationInfo.opByName')"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="opTime"
        :label="$t('uexpressOrder.operationInfo.opTime')"
        width="200">
        <template slot-scope="{row}">
          {{row.chargeTime | filterDate(vm)}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="opDesc"
        :label="$t('uexpressOrder.operationInfo.opDesc')"
        width="300">
      </el-table-column>
      <el-table-column
        align="center"
        prop="remarks"
        :label="$t('uexpressOrder.operationInfo.remarks')"
        width="300">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    name: 'BatchOperationInfo',
    data() {
      return {
        vm: this
      }
    },
    props: {
      detail: {
        type: Object,
        default: () => {}
      }
    },
    filters: {
      filterDate(_date, vm) {
        return _date ? vm.$moment(Number(_date)).format('YYYY-MM-DD HH:mm:ss') : ''
      }
    }
  }
</script>
<style lang="scss" scoped="">
.info-box{
  padding: 20px;
}
</style>
