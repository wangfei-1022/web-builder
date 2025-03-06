<template>
  <div class="info-box">
    <el-table :data="detail.internalTransits">
      <el-table-column
        align="center"
        prop="outboundNo"
        :label="$t('uexpressBL.detailPlateInfo.outboundNo')"
        width="220">
      </el-table-column>
      <el-table-column
        align="center"
        prop="plateNo"
        :label="$t('uexpressBL.detailPlateInfo.plateNo')"
        width="200">
      </el-table-column>
      <el-table-column
        align="center"
        prop="driverName"
        :label="$t('uexpressBL.detailPlateInfo.driverName')"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="driverMobile"
        :label="$t('uexpressBL.detailPlateInfo.driverMobile')"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="truckSupplierName"
        :label="$t('uexpressBL.detailPlateInfo.truckSupplierName')"
        width="220">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'BLPlateInfo',
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
  }
}
</script>
<style lang="scss" scoped="">
.info-box{
  padding: 20px;
}
.info-inner-wrap{
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
