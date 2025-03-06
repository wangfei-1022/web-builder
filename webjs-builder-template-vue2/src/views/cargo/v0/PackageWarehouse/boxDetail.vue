<template>
  <div v-loading="loading" class="right-main-wrapper">
    <h3 class="content-title">
      <i class="iconfont icon-cangku1"></i>
      {{$t('packageWarehouse.boxNo')}}: {{boxDetail.boxNo}}
    </h3>
    <section class="info-wrapper" style="margin-top: 30px;">
      <template v-if="!boxDetail.parcelDTOList || boxDetail.parcelDTOList.length === 0">
        <div class="address-info">
          <p class="info-empty-text">
            {{$t('packageWarehouse.boxDetailEmpty')}}
          </p>
        </div>
      </template>
      <template v-else>
        <el-table :data="boxDetail.parcelDTOList" :max-height="scrollTableHeight">
          <el-table-column
            align="center"
            prop="orderNo"
            :label="$t('packageWarehouse.orderNo')"
            :show-overflow-tooltip="true"
            width="220">
          </el-table-column>
          <el-table-column
            align="center"
            prop="trackingNo"
            :label="$t('packageWarehouse.trackingNo')"
            :show-overflow-tooltip="true"
            width="220">
          </el-table-column>
          <el-table-column
            align="center"
            prop="chineseName"
            :label="$t('packageWarehouse.chineseName')"
            :show-overflow-tooltip="true"
            width="220">
          </el-table-column>
          <el-table-column
            align="center"
            prop="countryName"
            :label="$t('packageWarehouse.countryName')"
            width="180">
          </el-table-column>
          <el-table-column
            align="center"
            prop="inboundWeight"
            :label="$t('packageWarehouse.detailHeavy')"
            width="120">
          </el-table-column>
          <el-table-column
            align="center"
            prop="productName"
            :label="$t('packageWarehouse.productCode')"
            width="180">
          </el-table-column>
          <el-table-column
            align="center"
            prop="inboundTime"
            :label="$t('packageWarehouse.checkinDate')"
            width="220">
            <template slot-scope="scope">
              {{ scope.row.inboundTime | filterDate(vm)}}
            </template>
          </el-table-column>
        </el-table>
      </template>
    </section>
    <section class="info-wrapper" style="margin-top: 30px;">
      <h3 style="font-size: 16px; font-weight: normal; margin-bottom: 10px;">{{$t('packageWarehouse.verifiedTitle')}}</h3>
      <div class="verified-wrap">
        <el-row :gutter="10">
          <el-col :span="8">
            <span class="verified-label">{{$t('packageWarehouse.verifiedLength')}}: </span>
            <span class="verified-value">{{boxDetail.checkLength}}</span>
          </el-col>
          <el-col :span="8">
            <span class="verified-label">{{$t('packageWarehouse.verifiedWidth')}}: </span>
            <span class="verified-value">{{boxDetail.checkWidth}}</span>
          </el-col>
          <el-col :span="8">
            <span class="verified-label">{{$t('packageWarehouse.verifiedHeight')}}: </span>
            <span class="verified-value">{{boxDetail.checkHeight}}</span>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <span class="verified-label">{{$t('packageWarehouse.verifiedWeight')}}: </span>
            <span class="verified-value">{{boxDetail.checkTotalWeight}}</span>
          </el-col>
          <el-col :span="8">
            <span class="verified-label">{{$t('packageWarehouse.verifiedCode')}}: </span>
            <span class="verified-value">{{boxDetail.checkCode}}</span>
          </el-col>
        </el-row>
      </div>
    </section>
    <section class="info-wrapper" style="margin-top: 30px;">
      <h3 style="font-size: 16px; font-weight: normal; margin-bottom: 10px;">{{$t('packageWarehouse.thumbnailTitle')}}</h3>
      <div class="thumbnail-wrap" v-if="boxDetail.imageUrlList">
        <el-image
          class="img-item"
          v-for="item in boxDetail.imageUrlList"
          :key="item"
          :src="item"
          :preview-src-list="boxDetail.imageUrlList">
        </el-image>
      </div>
    </section>
  </div>
</template>
<script>
import { getBoxListDetailApi } from '@/api/packageWarehouse'
export default {
  name: 'BoxDetail',
  components: {},
  data() {
    return {
      vm: this,
      loading: false,
      id: '',
      boxDetail: {}
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
    async getOrderDetail() {
      this.loading = true
      const res = await getBoxListDetailApi(this.id)
      if (res.ok && res.content) {
        this.boxDetail = res.content
      }
      this.loading = false
    }
  },
  mounted() {
  },
  created() {
    // this.getMemberList()
    if (this.$route.params.id) {
      this.id = this.$route.params.id
      this.getOrderDetail()
    }
  }
}
</script>
<style lang="scss" scoped>
.right-main-wrapper{
  overflow: hidden;
  overflow-y: auto;
}
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
.thumbnail-wrap{
  width: 100%;
  padding: 20px 0;
  border: 1px solid #ccc;
  @include flexWrapRow;
  .img-item {
    font-size: 14px;
    width: 100px;
    height: auto;
    margin: 0 5px;
  }
}
.verified-wrap{
  min-width: 300px;
  font-size: 14px;
  span{
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }
}
</style>
