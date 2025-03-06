<template>
  <div class="air-page" v-loading="loading">
    <div :class="{ 'fixed-header-opt': 1 === 1 }">
      <div class="air-inner-row">
        <div style="display: flex; justify-content: space-between; width: 100%">
          <div>
            <!-- 返回列表 -->
            <el-button type="primary" size="mini" plain @click="backToList">{{ $t('air.returnList') }}</el-button>
            <!--<el-button type="primary" size="mini" @click="reloadOrder">刷新</el-button>-->
            <!-- 完结 -->
            <!-- <el-button type="primary" size="mini" @click="takeDelivery"
              v-if="order.baseDTO.orderState !== 100 && order.baseDTO.orderState !== 95 && order.baseDTO.orderState !== 10"
              v-permission="['air:order:exportToC:arrived']">{{ $t('air.finished') }}</el-button> -->

            <!-- 取消订单 -->
            <!-- <el-button type="danger" size="mini" @click="cancellationOfOrder" v-if="order.baseDTO.orderState !== 95 &&
              order.baseDTO.orderState !== 100 && order.baseDTO.orderState !== 50"
              v-permission="['air:order:exportToC:cancellationOfOrder']">
              {{ $t('air.cancellationOfOrder') }}
            </el-button> -->

            <span style="margin-left:20px">
              {{ $t('air.serviceInformation') }}（
              {{ $t('air.packetChannel') }}：{{ order.baseDTO.bagChannel }}；
              {{ $t('air.pod2') }}：{{ order.spaceDTO.podCode }}；
              <!-- {{ $t('air.productLine') }}：{{ order.spaceDTO.productAirlineName }}； -->
              <!-- {{ $t('air.receipt') }}：{{ order.spaceDTO.receiptCode }}； -->
              {{ $t('air.weight') }}：{{ order.cargoDTO.actualGrossWeight }}；
              {{ $t('air.volume2') }}：{{ order.cargoDTO.actualVolume }}；
              {{ $t('air.actualChargeableWeight2') }}：{{ order.cargoDTO.actualChargeableWeight }}；）
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="air-inner-row">
      <el-tabs v-model="activeTabName" type="border-card" style="width:100%">
        <!-- 订单 -->
        <el-tab-pane :label="$t('air.order')" name="Basic" style="max-width: 1200px;">
          <basic ref="basic" :order="order" @refresh="reloadOrder" :tabPane="activeTabName" />
        </el-tab-pane>

        <!-- 应收费用确认单 -->
        <el-tab-pane :label="$t('air.receivableExpenseConfirmationDocument')" name="ReceiveToCTab" lazy v-if="order.id">
          <receive-tab ref="receiveTabRef" :order="order" :tabPane="activeTabName" />
        </el-tab-pane>
        <!-- 应付费用确认单 -->
        <el-tab-pane :label="$t('air.payableExpenseConfirmation')" name="PayToCTab" lazy v-if="order.id">
          <pay-tab ref="payTabRef" :order="order" :tabPane="activeTabName" />
        </el-tab-pane>
        <!-- 电子文件 -->
        <el-tab-pane :label="$t('air.electronicDocuments')" name="ElectronicFile" style="max-width: 1200px;">
          <electronic-file ref="electronicFile" :order="order" />
        </el-tab-pane>
      </el-tabs>
      <div v-show="loading" style="position: fixed;z-index: 9999;height: 100%;width: 100%;background-color: #2d3a4b22;
      display: flex;justify-content: center;align-items:center">
        <svg-icon icon-class="loading-bars" style="font-size:60px;" />
      </div>
    </div>

    <el-dialog :title="$t('air.finished')" :visible.sync="takeDeliveryVisible" width="400px">
      <div>{{ $t('air.finishedBeCareful') }}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="takeDeliveryVisible = false" size="mini">{{ $t('air.cancel') }}</el-button>
        <el-button type="primary" @click="submitDeliveryFn" size="mini">{{ $t('air.determine') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('air.cancellationOfOrder')" :visible.sync="cancellationOfOrderVisible" width="400px">
      <div>
        {{ $t('air.cancellationOfOrderTip') }}
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancellationOfOrderVisible = false" size="mini">{{ $t('air.cancel') }}</el-button>
        <el-button type="primary" @click="submitCancellationOfOrderFn" size="mini">{{ $t('air.determine') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Basic from './orderDetailBasic'
import receiveTab from './receiveTab'
import payTab from './payTab'
// import hawb from './HAWB'
import ElectronicFile from '../components/electronicFile'
import { toSimulateRefreshingCurrentActiveTag, toSimulateRefreshingListBackingTo } from '@/utils'

import { getAirExportOrderDetailApi, deliveryAirExportOrderListApi, cancelAirExportApi } from '@/api/airExport'
import { getCustomerDropDownListApi } from '@/api/common'


import { batchSubmitJob, batchRejectSubmitJob, batchAcceptJob } from '@/api/chargeTabAtJob'
import { getTerminologyListByType } from '@/api/terminology'
import { deepCloneMethod } from '@/utils'

export default {
  name: 'AirOrderManagementToCOrderDetail',
  components: {
    Basic,
    ElectronicFile,
    receiveTab,
    payTab
  },
  data () {
    return {
      cancellationOfOrderVisible: false,
      loading: false,
      order: {
        id: '',
        addressDTO: {},
        baseDTO: {},
        cargoDTO: {},
        spaceDTO: {},
        mblShow: false,
        hblShow: false
      },
      takeDeliveryVisible: false,
      job: {
        electronicFile: {}
      },
      nonsense: '',
      activeTabName: 'Basic',
      jobNoHistoryReversed: []
    }
  },
  created () {
    this.getDetail()
  },
  methods: {
    async getDetail () {
      let id = this.$route.query.id
      this.loading = true
      const res = await getAirExportOrderDetailApi(id)
      this.loading = false
      if (res && res.ok) {
        this.order = res.content
      }
    },
    takeDelivery () {
      this.takeDeliveryVisible = true
    },
    async submitDeliveryFn () {
      this.takeDeliveryVisible = false
      const deliveryRes = await deliveryAirExportOrderListApi(this.order.id)
      if (deliveryRes && deliveryRes.ok) {
        this.reloadOrder()
        this.$message.success(this.$t('air.successfulEnd'))
      }
    },
    cancellationOfOrder () {
      this.cancellationOfOrderVisible = true
    },
    async submitCancellationOfOrderFn () {
      this.cancellationOfOrderVisible = false
      // 取消接口
      const cancelRes = await cancelAirExportApi(this.order.id)
      if (cancelRes && cancelRes.ok) {
        this.reloadOrder()
        this.$message.success(this.$t('air.cancellationOfOrderEnd'))
      }
    },
    reloadOrder () {
      this.getDetail()
    },
    backToList () {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: `AirOrderManagementToC` })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.module.scss";

.air-page {
  padding: 8px 16px 0 16px;
}

.air-inner-row {
  margin-bottom: 10px;

  ::v-deep .el-tabs {
    background-color: #f5f7fa;
  }
}

.dialog-footer {
  text-align: center;
}
</style>
