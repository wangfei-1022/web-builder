<template>
  <div v-loading="loading" class="right-main-wrapper">
    <h3 class="content-title">
      <i class="iconfont icon-cangku1"></i>
      {{$t('packageTransfer.transferDetail.boxNo')}}: {{transferredDetail.requisitionNo}}
    </h3>
    <section class="info-wrapper" style="margin-top: 30px;">
      <template v-if="!transferredDetail.parcelDTOList || transferredDetail.parcelDTOList.length === 0">
        <div class="address-info">
          <p class="info-empty-text">
            {{$t('packageTransfer.transferDetail.transferredDetailEmpty')}}
          </p>
        </div>
      </template>
      <template v-else>
        <el-table :data="transferredDetail.parcelDTOList" :max-height="scrollTableHeight">
          <el-table-column
            align="center"
            prop="orderNo"
            :label="$t('packageTransfer.transferDetail.orderNo')"
            :show-overflow-tooltip="true"
            width="220">
          </el-table-column>
          <el-table-column
            align="center"
            prop="trackingNo"
            :label="$t('packageTransfer.transferDetail.trackingNo')"
            :show-overflow-tooltip="true"
            width="220">
          </el-table-column>
          <el-table-column
            align="center"
            prop="requisitionTime"
            :label="$t('packageTransfer.transferDetail.inboundTime')"
            width="220">
            <template slot-scope="scope">
              {{ scope.row.inboundTime | filterDate(vm)}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="loadingWarehouseName"
            :label="$t('packageTransfer.transferDetail.loadingWarehouseName')"
            :show-overflow-tooltip="true"
            width="220">
          </el-table-column>
          <el-table-column
            align="center"
            prop="destinationWarehouseName"
            :label="$t('packageTransfer.transferDetail.destinationWarehouseName')"
            width="220">
          </el-table-column>
          <el-table-column
            align="center"
            prop="productName"
            :label="$t('packageTransfer.transferDetail.productName')"
            width="180">
          </el-table-column>
          <el-table-column
            align="center"
            prop="inboundWeight"
            :label="$t('packageTransfer.transferDetail.inboundWeight')"
            width="180">
          </el-table-column>
        </el-table>
      </template>
    </section>
  </div>
</template>
<script>
import { getTransferredDetailApi } from '@/api/packageTransfer'
export default {
  name: 'TransferredDetail',
  components: {},
  data() {
    return {
      vm: this,
      loading: false,
      id: '',
      transferredDetail: {}
    }
  },
  computed: {
    currDate() {
      return this.$moment({ hour: 0, minute: 0 }).valueOf()
    },
    scrollTableHeight() {
      console.l
      return document.documentElement.clientHeight - 250
    }
  },
  watch: {},
  filters: {
    filterDate(val, _vm) {
      return val ? _vm.$moment(Number(val)).format('YYYY-MM-DD HH:mm:ss') : ''
    }
  },
  methods: {
    async getTransferredDetail() {
      this.loading = true
      const res = await getTransferredDetailApi(this.id)
      if (res.ok && res.content) {
        this.transferredDetail = res.content
      }
      this.transferredDetail.parcelDTOList.map(v => {
        v.loadingWarehouseName = this.transferredDetail.loadingWarehouseName
        v.destinationWarehouseName = this.transferredDetail.destinationWarehouseName
      })
      this.loading = false
    }
  },
  mounted() {
  },
  created() {
    // this.getMemberList()
    if (this.$route.params.id) {
      this.id = this.$route.params.id
      this.getTransferredDetail()
    }
  }
}
</script>
<style lang="scss" scoped>
@mixin flexTopRow{
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: flex-start;
}
.content-title{
  font-size: 20px;
  font-weight: normal;
  i{
    font-size: 20px;
  }
}
.base-info-wrap{
  @include flexTopRow;
  justify-content: flex-start;
  width: 100%;
  font-size: 14px;
}
.left-info{
  @include flexTopRow;
  width: 80%;
  ul{
    width: 25%;
    min-width: 200px;
    margin: 0;
    padding: 0;
    li{
      padding: 5px 0;
      @include flexTopRow;
      justify-content: flex-start;
      align-items: center;
      span{
        display: block;
        &.info-label{
          width: 100px;
          text-align: right;
        }
        &:nth-child(even){
          padding-left: 10px;
          width: auto;
        }
      }
    }
  }
}
.right-status{
  text-align: right;
  margin-left: 80px;
  p{
    margin: 3px 0;
    color: #000;
    &.status-title{
      font-size: 16px;
      color: #666;
    }
    &.status-text{
      margin-top: 10px;
      font-size: 20px;
    }
  }
}
@mixin flexWrapRow{
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
}
.address-info{
  @include flexTopRow;
  justify-content: flex-start;
  margin-top: 40px;
  min-height: 150px;
  .shipper-info,
  .consignee-info{
    width: 46%;
    h3{
      border-bottom: 1px solid #eee;
      height: 40px;
      line-height: 40px;
      text-indent: 20px;
      font-weight: normal;
      font-size: 16px;
      margin: 0;
    }
  }
  .shipper-info{
    border: 1px solid #ccc;
    border-right: 1px solid #ccc;
  }
  .consignee-info{
    border: 1px solid #ccc;
    border-left: 0 none;
  }
  .address-inner-box{
    @include flexWrapRow;
    li{
      font-size: 14px;
      width: 50%;
      margin: 5px 0;
      span.info-label{
        width: 80px;
      }
      &:nth-child(5),
      &:nth-child(6){
        width: 100%;
      }
    }
  }
}
.info-empty-text{
  font-size: 20px;
  width: 100%;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
</style>
