<template>
  <div class="page-edit-container full-page" v-loading="loading">
    <div class="custmer-detail page-edit-content">
      <base-info :detail="detail" />
      <!-- 商品信息 -->
      <sku-info :detail="detail" />
      <!-- 包裹参数 -->
      <package-info :detail="detail" />

      <!-- 收/发件人信息 -->
      <div class="info-section-module">
        <div class="info-title">
          {{$t('uexpressOrder.orderDetail.consignorTitle')}}
        </div>
        <div class="info-content">
          <el-tabs v-model="activeName" type="border-card">
            <el-tab-pane :label="$t('uexpressOrder.consigneeInfo.title')" name="consignee">
              <address-info :infoData="detail.consignee" :transferKey="'uexpressOrder.consigneeInfo'" />
            </el-tab-pane>
            <el-tab-pane :label="$t('uexpressOrder.consignorInfo.title')" name="consignor">
              <address-info :infoData="detail.consignor" :transferKey="'uexpressOrder.consignorInfo'" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <!-- 揽收信息  -->
      <pickup-info :detail="detail" />

      <!-- 费用信息 -->
      <div class="info-section-module">
        <div class="info-title">
          {{$t('uexpressOrder.orderDetail.charges')}}
        </div>
        <div class="info-content">
          <el-table :data="detail.chargingInfoDtos" border>
            <el-table-column prop="chargingTypeName" :label="$t('uexpressOrder.chargesInfo.feeItemName')" min-width="120"></el-table-column>
            <el-table-column prop="chargeTime" :label="$t('uexpressOrder.chargesInfo.chargeTime')" min-width="200">
              <template slot-scope="{row}">
                {{row.chargeTime | parseTime}}
              </template>
            </el-table-column>
            <el-table-column prop="payTime" :label="$t('uexpressOrder.chargesInfo.payTime')" min-width="200">
              <template slot-scope="{row}">
                {{row.payTime | parseTime}}
              </template>
            </el-table-column>
            <el-table-column prop="totalCharges" :label="$t('uexpressOrder.chargesInfo.totalCharges')" min-width="120">
              <template slot-scope="{row}">
                <span v-for="(item, index) in row.totalCharges" :key="index">{{item.amount | numberToThousands}} {{item.currency}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="detail" :label="$t('uexpressOrder.chargesInfo.detail')" min-width="120">
              <template slot-scope="{row}">
                <el-popover placement="top" width="280" trigger="click">
                  <el-table :data="row.charges" border>
                    <el-table-column width="150" prop="feeItemName" :label="$t('uexpressOrder.chargesInfo.feeItem')"></el-table-column>
                    <el-table-column width="100" prop="amount" :label="$t('uexpressOrder.chargesInfo.amount')">
                      <template slot-scope="{row}">
                        <span>{{row.amount | numberToThousands}} {{row.currency}}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button type="text" slot="reference">{{$t('uexpressOrder.chargesInfo.viewDetail')}}</el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 操作日志 -->
      <div class="info-section-module">
        <div class="info-title">
          {{$t('uexpressOrder.orderDetail.logEntityLogDtos')}}
        </div>
        <div class="info-content">
          <el-table :data="detail.logEntityLogDtos" border>
            <el-table-column prop="opByName" :label="$t('uexpressOrder.operationInfo.opByName')" min-width="160"></el-table-column>
            <el-table-column prop="opTime" :label="$t('uexpressOrder.operationInfo.opTime')" min-width="200">
              <template slot-scope="{row}">
                {{row.opTime | parseTime}}
              </template>
            </el-table-column>
            <el-table-column prop="opDesc" :label="$t('uexpressOrder.operationInfo.opDesc')" min-width="300">
            </el-table-column>
            <el-table-column prop="remarks" :label="$t('uexpressOrder.operationInfo.remarks')" min-width="300"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="page-edit-footer">
      <el-button type="primary" size="mini" plain @click="backList">{{$t('common.close')}}</el-button>
    </div>
  </div>
</template>

<script>
import BaseInfo from './components/BaseInfo'
import AddressInfo from './components/AddressInfo'
import PackageInfo from './components/PackageInfo'
import PickupInfo from './components/PickupInfo'
import SkuInfo from './components/SkuInfo'
import { getOrderDetailApi } from '@/api/uexpress/orderManager'
export default {
  name: 'UexpressOrderDetail',
  components: {
    BaseInfo,
    AddressInfo,
    PackageInfo,
    PickupInfo,
    SkuInfo
  },
  data() {
    return {
      orderId: '',
      shardingKey: '',
      loading: false,
      detail: {
        consignee: {},
        consignor: {},
        pickUpPostAddress: {}
      },
      activeName: 'consignee'
    }
  },
  mounted() {
    this.orderId = this.$route.params.orderId
    this.shardingKey = this.$route.params.shardingKey
    this.getOrderDetail()
  },
  methods: {
    async getOrderDetail() {
      this.loading = true
      const res = await getOrderDetailApi({orderId: this.orderId, shardingKey: this.shardingKey})
      if (res.ok && res.content) {
        res.content.pickUpPostAddress = res.content.pickUpPostAddress || {}
        let weightImageUrlList = []
        if (Array.isArray(res.content.weightImageUrlList)) {
          res.content.weightImageUrlList.forEach(url => {
            weightImageUrlList.push({
              url: url
            })
          })
        }
        this.detail = {
          ...res.content,
          weightImageUrlList: weightImageUrlList
        }
      }
      this.loading = false
    },
    backList() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ name: 'UexpressOrderList' });
    },
    getSummaries(params) {
      const { columns, data } = params
      const sum = []

      columns.forEach((column, index) => {
        if (index === 0) {
          sum[index] = this.$t('uexpressOrder.orderDetail.totalText')
          return
        }

        if (column.property === 'amount' && this.detail && this.detail.totalAmounts) {
          const sumArr = this.detail.totalAmounts.map(item => `${item.value} ${item.currency}`)
          sum[index] = sumArr.join(',')
        } else {
          sum[index] = ''
        }
      })

      return sum
    }
  }
}
</script>
<style lang="scss" scoped>
.right-main-wrapper{
  overflow: hidden;
  overflow-y: auto;
}
.info-wrapper{
  width: 70%;
  margin-top: 20px;
  &:first-child{
    margin-top: 0;
  }
}
.section-title-wrap{
  margin-top: 0;
}
.info-content-wrap{
  border: 1px solid #ccc;
  border-top: 0 none;
}
.info-empty-text{
  font-size: 20px;
  width: 100%;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
</style>
