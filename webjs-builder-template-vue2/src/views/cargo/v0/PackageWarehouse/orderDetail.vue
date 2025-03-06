<template>
  <div v-loading="loading" class="right-main-wrapper">
    <h3 class="content-title">
      <i class="iconfont icon-shuxingliebiaoxiangqing2"></i>
      {{$t('packageWarehouse.orderNo')}}: {{orderDetail.orderNo}}
    </h3>
    <section class="info-wrapper">
      <div class="base-info-wrap">
        <div class="left-info">
          <ul>
            <li>
              <span class="info-label">{{$t('packageWarehouse.trackingNo')}}:</span>
              <span>{{orderDetail.trackingNo}}</span>
            </li>
            <li>
              <span class="info-label">{{$t('packageWarehouse.customerRefNo')}}:</span>
              <span>{{orderDetail.customerRefNo}}</span>
            </li>
            <li>
              <span class="info-label">{{$t('packageWarehouse.boxNo')}}:</span>
              <span>{{orderDetail.boxNo}}</span>
            </li>
            <li>
              <span class="info-label">{{$t('packageWarehouse.ifWithElectric')}}:</span>
              <span>{{orderDetail | filterBatteryFlag(vm)}}</span>
            </li>
          </ul>
          <ul>
            <li>
              <span class="info-label">{{$t('packageWarehouse.customerOrderWeight')}}:</span>
              <span>{{orderDetail.createWeight}}KG</span>
            </li>
            <li>
              <span class="info-label">{{$t('packageWarehouse.customerOutWeight')}}:</span>
              <span>{{orderDetail.declareWeight}}KG</span>
            </li>
            <li>
              <span class="info-label">{{$t('packageWarehouse.parcelCoefficient')}}:</span>
              <span>{{orderDetail.parcelCoefficient}}</span>
            </li>
            <li>
              <span class="info-label">{{$t('packageWarehouse.chineseName')}}:</span>
              <span>{{orderDetail.chineseName}}</span>
            </li>
          </ul>
          <ul>
            <li>
              <span class="info-label">{{$t('packageWarehouse.length')}}:</span>
              <span>{{orderDetail.inboundLength}}cm</span>
            </li>
            <li>
              <span class="info-label">{{$t('packageWarehouse.width')}}:</span>
              <span>{{orderDetail.inboundWidth}}cm</span>
            </li>
            <li>
              <span class="info-label">{{$t('packageWarehouse.height')}}:</span>
              <span>{{orderDetail.inboundHeight}}cm</span>
            </li>
            <li>
              <span class="info-label">{{$t('packageWarehouse.bagNo')}}:</span>
              <span>{{orderDetail.bagNo}}</span>
            </li>
          </ul>
          <ul>
            <li>
              <span class="info-label">{{$t('packageWarehouse.grossHeavy')}}:</span>
              <span>{{orderDetail.inboundWeight}}KG</span>
            </li>
            <li>
              <span class="info-label">{{$t('packageWarehouse.bubbleHeavy')}}:</span>
              <span>{{orderDetail.inboundVolumeWeight}}KG</span>
            </li>
            <li>
              <span class="info-label">{{$t('packageWarehouse.totalHeavy')}}:</span>
              <span>{{orderDetail.inboundChargeWeight}}KG</span>
            </li>
          </ul>
        </div>
        <div class="right-status">
          <p class="status-title">{{$t('packageWarehouse.status')}}</p>
          <p class="status-text">{{orderDetail.parcelStateName}}</p>
        </div>
      </div>
    </section>
    <section class="info-wrapper" style="margin-top: 20px;">
      <template v-if="!orderDetail.addressDTO">
        <div class="address-info">
          <p class="info-empty-text">
            {{$t('packageWarehouse.addressInfoEmpty')}}
          </p>
        </div>
      </template>
      <template v-else>
        <div class="address-info">
          <div class="shipper-info">
            <h3>{{$t('packageWarehouse.shipperInfoTitle')}}</h3>
            <ul class="address-inner-box">
              <li>
                <span class="info-label">{{$t('packageWarehouse.name')}}: </span>
                <span>{{orderDetail.addressDTO.shipperName}}</span>
              </li>
              <li>
                <span class="info-label">{{$t('packageWarehouse.telphone')}}: </span>
                <span>{{orderDetail.addressDTO.shipperTel}}</span>
              </li>
              <li>
                <span class="info-label">{{$t('packageWarehouse.zipCode')}}: </span>
                <span>{{orderDetail.addressDTO.shipperZipcode}}</span>
              </li>
              <li>
                <span class="info-label">{{$t('packageWarehouse.company')}}: </span>
                <span>{{orderDetail.addressDTO.shipperCompanyName}}</span>
              </li>
              <li>
                <span class="info-label">{{$t('packageWarehouse.address')}}: </span>
                <span>
                  {{orderDetail.addressDTO.shipperCountry}} {{orderDetail.addressDTO.shipperProvince}} {{orderDetail.addressDTO.shipperCity}} {{orderDetail.addressDTO.shipperDistrict}}
                </span>
              </li>
              <li>
                <span class="info-label">{{$t('packageWarehouse.minute')}}: </span>
                <span>{{orderDetail.addressDTO.shipperMinute}}</span>
              </li>
            </ul>
          </div>
          <div class="consignee-info">
            <h3>{{$t('packageWarehouse.consigneeInfoTitle')}}</h3>
            <ul class="address-inner-box">
              <li>
                <span class="info-label">{{$t('packageWarehouse.name')}}: </span>
                <span>{{orderDetail.addressDTO.consigneeName}}</span>
              </li>
              <li>
                <span class="info-label">{{$t('packageWarehouse.telphone')}}: </span>
                <span>{{orderDetail.addressDTO.consigneeTel}}</span>
              </li>
              <li>
                <span class="info-label">{{$t('packageWarehouse.zipCode')}}: </span>
                <span>{{orderDetail.addressDTO.consigneeZipcode}}</span>
              </li>
              <li>
                <span class="info-label">{{$t('packageWarehouse.company')}}: </span>
                <span>{{orderDetail.addressDTO.consigneeCompanyName}}</span>
              </li>
              <li>
                <span class="info-label">{{$t('packageWarehouse.address')}}: </span>
                <span>
                  {{orderDetail.addressDTO.consigneeCountry}} {{orderDetail.addressDTO.consigneeProvince}} {{orderDetail.addressDTO.consigneeCity}} {{orderDetail.addressDTO.consigneeDistrict}}
                </span>
              </li>
              <li>
                <span class="info-label">{{$t('packageWarehouse.minute')}}: </span>
                <span>{{orderDetail.addressDTO.consigneeMinute}}</span>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </section>
    <section class="info-wrapper" style="margin-top: 30px;">
      <template v-if="!orderDetail.goodsDTOList || orderDetail.goodsDTOList.length === 0">
        <div class="address-info">
          <p class="info-empty-text">
            {{$t('packageWarehouse.goodsListEmpty')}}
          </p>
        </div>
      </template>
      <template v-else>
        <h3 style="font-size: 16px; font-weight: normal; margin-bottom: 0;">{{$t('packageWarehouse.packageInfoTitle')}}</h3>
        <el-table :data="orderDetail.goodsDTOList" :max-height="scrollTableHeight">
          <el-table-column
            prop="goodsCname"
            :label="$t('packageWarehouse.goodsCname')"
            width="180">
          </el-table-column>
          <el-table-column
            prop="goodsEname"
            :label="$t('packageWarehouse.goodsEname')"
            width="180">
          </el-table-column>
          <el-table-column
            prop="quantity"
            :label="$t('packageWarehouse.quantity')"
            width="180">
          </el-table-column>
          <el-table-column
            prop="declareValue"
            :label="$t('packageWarehouse.declareValue')"
            width="180">
          </el-table-column>
          <el-table-column
            prop="hscode"
            :label="$t('packageWarehouse.hscode')"
            width="180">
          </el-table-column>
          <el-table-column
            prop="skuCode"
            :label="$t('packageWarehouse.skuCode')"
            width="180">
          </el-table-column>
          <el-table-column
            prop="goodsUrl"
            :label="$t('packageWarehouse.goodsUrl')"
            width="180">
          </el-table-column>
        </el-table>
      </template>
    </section>
    <section class="info-wrapper" style="margin-top: 30px;">
      <h3 style="font-size: 16px; font-weight: normal; margin-bottom: 0;">{{$t('packageWarehouse.thumbnailTitle')}}</h3>
      <div class="thumbnail-wrap" v-if="orderDetail.weightUrlList">
        <el-image
          class="img-item"
          v-for="item in orderDetail.weightUrlList"
          :key="item"
          :src="item"
          :preview-src-list="orderDetail.weightUrlList">
        </el-image>
      </div>
    </section>
    <section class="info-wrapper" style="margin-top: 30px;">
      <h3 style="font-size: 16px; font-weight: normal; margin-bottom: 0;">{{$t('packageWarehouse.logListTitle')}}</h3>
      <el-table :data="orderDetail.logDTOList" height="500px">
        <el-table-column
          prop="updateByName"
          :label="$t('packageWarehouse.operatorName')"
          width="180">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          :label="$t('packageWarehouse.operatorTime')"
          width="180">
          <template slot-scope="{row}">
            {{ row.updateTime | filterDate(vm) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="opNodeCodeName"
          :label="$t('packageWarehouse.operatorNode')"
          width="180">
        </el-table-column>
        <el-table-column
          prop="opResult"
          :label="$t('packageWarehouse.operatorResult')"
          width="180">
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>
<script>
import { getOrderDetailApi } from '@/api/packageWarehouse'
export default {
  name: 'PackageOrderDetail',
  components: {},
  data() {
    return {
      vm: this,
      loading: false,
      id: '',
      orderDetail: {}
    }
  },
  computed: {
    currDate() {
      return this.$moment({ hour: 0, minute: 0 }).valueOf()
    },
    scrollTableHeight() {
      return document.documentElement.clientHeight - 550
    }
  },
  watch: {},
  filters: {
    filterBatteryFlag(obj, vm) {
      if (obj.parcelBatteryFlag === null || typeof obj.parcelBatteryFlag == 'undefined') {
        return ''
      } else {
        return obj.parcelBatteryFlag ? vm.$t('packageWarehouse.locked') : vm.$t('packageWarehouse.unlock')
      }
    },
    filterDate(dateTime, vm) {
      return dateTime ? vm.$moment(Number(dateTime)).format('YYYY-MM-DD HH:mm:ss') : ''
    }
  },
  methods: {
    async getOrderDetail() {
      this.loading = true
      const res = await getOrderDetailApi(this.id)
      if (res.ok && res.content) {
        this.orderDetail = {...this.orderDetail, ...res.content}
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
  margin-top: 10px;
  @include flexWrapRow;
  justify-content: flex-start;
  .img-item {
    font-size: 14px;
    width: 100px;
    height: auto;
    margin: 0 5px;
  }
}
</style>
