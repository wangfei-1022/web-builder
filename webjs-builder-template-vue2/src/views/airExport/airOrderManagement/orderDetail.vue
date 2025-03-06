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
            <el-button type="primary" size="mini" @click="takeDelivery" v-if="order.isUnlocked && order.baseDTO.orderState === 60"
              v-permission="['air:order:export:arrived']">{{ $t('air.finished') }}</el-button>

            <!-- 取消订单 -->
            <el-button type="danger" size="mini" @click="cancellationOfOrder"
              v-if="order.isUnlocked && (order.baseDTO.orderState !== 95 &&
                order.baseDTO.orderState !== 100 && order.baseDTO.orderState !== 50 && order.baseDTO.orderState !== 60 && order.baseDTO.orderState !== 99)"
              v-permission="['air:order:export:cancellationOfOrder']">
              {{ $t('air.cancellationOfOrder') }}
            </el-button>
            <!-- 退关 -->
            <el-button type="danger" size="mini" @click="exitCustoms" v-permission="['air:order:export:exitCustoms']"
              v-if="order.isUnlocked && (order.baseDTO.orderState === 10 || order.baseDTO.orderState === 30 || order.baseDTO.orderState === 40)">
              {{ $t('air.exitCustoms') }}
            </el-button>

            <span style="margin-left:20px">
              {{ $t('air.serviceInformation') }}（
              {{ $t('air.productLine') }}：{{ order.spaceDTO.productAirlineName }}；
              {{ $t('air.receipt') }}：{{ order.spaceDTO.receiptCode }}；
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
        <el-tab-pane label="MAWB" name="MAWB" style="max-width: 1200px;" v-if="order.mblShow">
          <BL ref="mawb" :order="order" :id="order.jobId" :tabPane="activeTabName" :state="order.baseDTO.orderState" type="MAWB" />
        </el-tab-pane>
        <el-tab-pane label="HAWB" name="HAWB" style="max-width: 1200px;" v-if="order.hblShow">
          <BL ref="hawb" :order="order" :id="order.id" :state="order.baseDTO.orderState" type="HAWB" />
        </el-tab-pane>
        <!-- 费用 -->
        <el-tab-pane :label="$t('air.cost')" name="charge" lazy v-if="order.id">
          <charge ref="chargeRef" :id="order.id" v-if="activeTabName === 'charge'" />
        </el-tab-pane>
        <!-- 应收费用确认单 -->
        <el-tab-pane :label="$t('air.receivableExpenseConfirmationDocument')" name="receiveTab" lazy v-if="order.id">
          <receive-tab ref="receiveTabRef" :order="order" :tabPane="activeTabName" />
        </el-tab-pane>
        <!-- 应付费用确认单 -->
        <el-tab-pane :label="$t('air.payableExpenseConfirmation')" name="payTab" lazy v-if="order.id">
          <pay-tab ref="payTabRef" :order="order" :tabPane="activeTabName" />
        </el-tab-pane>
        <!-- 电子文件 -->
        <el-tab-pane :label="$t('air.electronicDocuments')" name="ElectronicFile" style="max-width: 1200px;">
          <electronic-file ref="electronicFile" :order="order" />
        </el-tab-pane>
        <!-- 订单操作日志 -->
        <el-tab-pane :label="$t('air.orderOperationLog')" name="orderOperationLog" style="max-width: 1200px;">
          <operationLog ref="orderOperationLog" :order="order" :tabPane="activeTabName" />
        </el-tab-pane>
        <!-- 报价信息 -->
        <el-tab-pane :label="$t('air.quotationInformation')" name="quotationInformation">
          <quotationInformation ref="quotationInformation" :order="order" :tabPane="activeTabName" />
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
        <el-form ref="cancellationForm" :model="cancellation" label-width="95px" label-position="left"
          style="margin-top: -5px;">
          <el-form-item :label="$t('air.cancellationReason')" prop="cancelReasonType"
            :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]">
            <el-select v-model="cancellation.cancelReasonType" placeholder="请选择" size="mini">
              <el-option v-for="item in cancellationList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div>{{ $t('air.cancellationOfOrderTip') }}</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancellationOfOrderVisible = false" size="mini">{{ $t('air.cancel') }}</el-button>
        <el-button type="primary" @click="submitCancellationOfOrderFn" size="mini">{{ $t('air.determine') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('air.exitCustoms')" :visible.sync="exitCustomsVisible" width="400px">
      <div>
        {{ $t('air.exitCustomsTip') }}
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="exitCustomsVisible = false" size="mini">{{ $t('air.cancel') }}</el-button>
        <el-button type="primary" @click="submitExitCustomsVisibleFn" size="mini">{{ $t('air.determine') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Basic from './orderDetailBasic'
import BL from './BL'
import charge from './chargeAll'
import receiveTab from './receiveTab'
import payTab from './payTab'
// import hawb from './HAWB'
import operationLog from './operationLog'
import quotationInformation from './quotationInformation'

import ElectronicFile from '../components/electronicFile'
import { toSimulateRefreshingCurrentActiveTag, toSimulateRefreshingListBackingTo } from '@/utils'

import { getAirExportOrderDetailApi, deliveryAirExportOrderListApi, cancelAirExportApi, shoutoutsAirExportApi } from '@/api/airExport'
import { batchSubmitJob, batchRejectSubmitJob, batchAcceptJob } from '@/api/chargeTabAtJob'
import { getTerminologyListByType } from '@/api/terminology'
import { deepCloneMethod } from '@/utils'
import orderMixin from './orderMixin'

export default {
  name: 'AirOrderManagementOrderDetail',
  mixins: [orderMixin],
  components: {
    Basic,
    BL,
    ElectronicFile,
    charge,
    receiveTab,
    payTab,
    operationLog,
    quotationInformation
  },
  data () {
    return {
      cancellation: {
        cancelReasonType: ""
      },
      cancellationList: [{
        value: '10',
        label: this.$t('air.priceProblem')
      }, {
        value: '20',
        label: this.$t('air.deliveryTimeProblem')
      }, {
        value: '30',
        label: this.$t('air.shippingSpaceProblem')
      }, {
        value: '99',
        label: this.$t('air.otherProblem')
      }],
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
      jobNoHistoryReversed: [],
      exitCustomsVisible: false
    }
  },
  created () {
    this.getDetail()
    this.$bus.$on('air/export/order', this.getDetail)
  },
  beforeDestory() {
    this.$bus.$off('air/export/order', this.getDetail)
  },
  methods: {
    getDetail () {
      let id = this.$route.query.id
      this.loading = true;
      getAirExportOrderDetailApi(id).then(res => {
        if (res.content) {
          res.content.orderLockState = res.content.lockOrderState
          res.content.isUnlocked = res.content.orderLockState === 0 || res.content.orderLockState === 30
          this.order = res.content

          // 直单
          if (this.order.spaceDTO.blMode === 1) {
            this.order.mblShow = true
          } else if (this.order.spaceDTO.blMode === 0) { // 非直单
            // 一主一分
            if (this.order.mergeFlag === false) {
              this.order.hblShow = true
              this.order.mblShow = true
            } else {
              this.order.hblShow = true
            }
          }
        }
        this.loading = false;
      })
    },
    takeDelivery () {
      this.takeDeliveryVisible = true
    },
    submitDeliveryFn () {
      this.takeDeliveryVisible = false
      deliveryAirExportOrderListApi(this.order.id).then(res => {
        if (res && res.ok) {
          this.reloadOrder()
          this.$message.success(this.$t('air.successfulEnd'))
        }
      })
    },
    cancellationOfOrder () {
      this.cancellation.cancelReasonType = ""
      this.cancellationOfOrderVisible = true;
    },
    submitCancellationOfOrderFn () {
      this.$refs.cancellationForm.validate(valid => {
        if (valid) {
          this.cancellationOfOrderVisible = false;
          let param = {
            "id": this.order.id,
            "cancelReasonType": this.cancellation.cancelReasonType
          }
          // 取消接口
          cancelAirExportApi(param).then(res => {
            if (res && res.ok) {
              this.reloadOrder();
              this.$message.success(this.$t('air.cancellationOfOrderEnd'));
              this.adjustConfirmFn(this.order)
            }
          });
        }
      })
    },
    // 退关
    exitCustoms () {
      this.exitCustomsVisible = true;
    },
    submitExitCustomsVisibleFn () {
      this.exitCustomsVisible = false;
      // 退关接口
      shoutoutsAirExportApi(this.order.id).then(res => {
        if (res && res.ok) {
          this.reloadOrder()
          this.$message.success(this.$t('air.exitCustomsEnd'));
          this.adjustConfirmFn(this.order)
        }
      });
    },
    reloadOrder () {
      this.getDetail()
    },
    backToList () {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: `AirOrderManagement` })
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
