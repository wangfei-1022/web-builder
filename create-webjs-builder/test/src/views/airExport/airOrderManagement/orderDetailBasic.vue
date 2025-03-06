<template>
  <div class="app">
    <div>
      <div class="form-module-title " v-if="order.baseDTO.orderState === 4">
        <span style="color:red">{{ $t('air.refusingBookSpace') }}</span>
      </div>
      <div class="form-module-item" v-if="order.baseDTO.orderState === 4">
        <div class="item">
          <span style="color:red">
            {{ order.affirmRemark }}</span>
        </div>
      </div>
      <div class="form-module-title ">
        <span>{{ $t('air.basicInformation') }}</span>
        <el-button type="primary" class="order-btn" size="mini" @click="basicInfo"
          v-if="order.isUnlocked && (order.baseDTO.orderState !== 100 && order.baseDTO.orderState !== 95 && order.baseDTO.orderState !== 99)"
          v-permission="['air:order:export:base']">{{ $t('air.orderModify') }} </el-button>
        <el-button type="primary" v-permission="['air:order:export:requester']" class="order-btn" size="mini"
          @click="requesterInfo"
          v-if="order.isUnlocked && (order.baseDTO.orderState === 0 || order.baseDTO.orderState === 3 || order.baseDTO.orderState === 5 || order.baseDTO.orderState === 10 || order.baseDTO.orderState === 30)">{{
            $t('air.requesterModify')
          }} </el-button>
      </div>
      <div class="form-module-item">
        <div class="item">
          <label>{{ $t('air.orderNumber') }}</label>
          <span>{{ order.baseDTO.orderNo }}</span>
        </div>
        <div class="item">
          <label>{{ $t('air.mblNoName') }}</label>
          <span>{{ order.baseDTO.mblNo }}</span>
        </div>
        <div class="item">
          <label>{{ $t('air.hblNoName') }}</label>
          <span>{{ order.baseDTO.hblNo }}</span>
        </div>
        <div class="item">
          <!--委托单位-->
          <label> {{ $t('air.requester') }} </label>
          <span>{{ order.baseDTO.customerName }}</span>
        </div>

        <div class="item">
          <!--操作模式-->
          <label> {{ $t('air.blModeDesc') }} </label>
          <span>{{ order.spaceDTO.blModeDesc }}</span>
        </div>
        <div class="item">
          <!--贸易条款-->
          <label> {{ $t('air.tradeTerms') }}</label>
          <span>{{ order.spaceDTO.tradeTerm }}</span>
        </div>
        <div class="item">
          <!--客户联系人-->
          <label>{{ $t('air.customerContact') }}</label>
          <span>{{ order.baseDTO.contactCnName }}</span>
        </div>
        <div class="item">
          <!-- 联系电话 -->
          <label>{{ $t('air.phone') }}</label>
          <span>{{ order.baseDTO.contactMobile }}</span>
        </div>
        <div class="item">
          <!-- 联系电话 -->
          <label>{{ $t('air.email') }}</label>
          <span>{{ order.baseDTO.contactEmail }}</span>
        </div>
        <div class="item">
          <!--客户类型-->
          <label> {{ $t('air.customerType') }} </label>
          <span>{{ order.baseDTO.signDesc }}</span>
        </div>
        <div class="item">
          <!--结算方式-->
          <label>{{ $t('air.settlementMethod') }} </label>
          <span>{{ order.baseDTO.settlementModeDesc }}</span>
        </div>
        <div class="item">
          <!--托书价格-->
          <label>{{ $t('air.joeBookPrices') }} </label>
          <span>{{ order.baseDTO.bookingReceivable }}</span>
        </div>
        <div class="item">
          <!--头程分泡(客户)-->
          <label>{{ $t('air.headPartOfTheBubble') }} </label>
          <span>{{ order.firstVolumetric }}</span>
        </div>
        <div class="item">
          <!--尾程分泡(客户)-->
          <label>{{ $t('air.tailSeparationBubble') }} </label>
          <span>{{ order.lastVolumetric }}</span>
        </div>
      </div>

      <div class="form-module-title">
        <!-- 货物信息 -->
        <span>{{ $t('air.cargoInformation') }}</span>
        <!-- 入仓 order.baseDTO.orderState !== 5 && order.baseDTO.orderState !== 10 &&-->
        <el-button type="primary" class="order-btn" size="mini" @click="inboundFn"
          v-if="order.isUnlocked && (order.baseDTO.orderState !== 100 && order.baseDTO.orderState !== 95 && order.baseDTO.orderState !== 99)"
          v-permission="['air:order:export:inbound']">{{ $t('air.inbound') }}</el-button>
      </div>
      <div class="form-module-item">
        <div class="item">
          <!-- 货物类型 -->
          <label>{{ $t('air.cargoType') }}</label>
          <span>{{ order.cargoDTO.cargoTypeDesc }}</span>
        </div>
        <div class="item">
          <!-- 件数(委/实) -->
          <label>{{ $t('air.orderAndActualQuantity') }} </label>
          <span>{{ order.cargoDTO.orderQuantity || '--' }}/{{ order.cargoDTO.actualQuantity || '--' }}</span>
        </div>
        <div class="item">
          <!-- 包装 -->
          <label>{{ $t('air.packType') }}</label>
          <span>{{ order.cargoDTO.packType }}</span>
        </div>
        <div class="item">
          <!-- 截止入仓时间 -->
          <label>{{ $t('air.inboundDeadline') }}</label>
          <span> {{ parseTime(order.spaceDTO.inboundDeadline) }} </span>
        </div>
        <div class="item">
          <!-- 毛重(委/实)/KGS -->
          <label>{{ $t('air.orderAndActualVolume') }}</label>
          <span>{{ order.cargoDTO.orderGrossWeight || '--' }}/{{ order.cargoDTO.actualGrossWeight || '--' }}</span>
        </div>
        <div class="item">
          <!-- 体积(委/实)/CBM -->
          <label>{{ $t('air.orderAndActualVolume2') }}</label>
          <span>{{ order.cargoDTO.orderVolume || '--' }}/{{ order.cargoDTO.actualVolume || '--' }}</span>
        </div>
        <div class="item">
          <!-- 计费重量(委/实)/M/T -->
          <label>{{ $t('air.orderAndActualChargeableWeight') }}</label>
          <span>{{ order.cargoDTO.orderChargeableWeight || '--' }}/{{
            order.cargoDTO.actualChargeableWeight ||
            '--'
          }}</span>
        </div>
        <div class="item">
          <!-- 货物英文品名 -->
          <label>{{ $t('air.cargoEnName') }}</label>
          <span>{{ order.cargoDTO.cargoEnName }}</span>
        </div>
        <div class="item">
          <!-- 货物中文品名  -->
          <label>{{ $t('air.cargoCnName') }}</label>
          <span>{{ order.cargoDTO.cargoCnName }}</span>
        </div>
        <div class="item">
          <!-- 托盘尺寸  -->
          <label>{{ $t('air.palletSizes') }}</label>
          <span>{{ order.cargoDTO.palletSizes }}</span>
        </div>
      </div>


      <div class="form-module-title">
        <!-- 舱位信息 -->
        <span>{{ $t('air.shippingSpecialist') }}</span>
        <!-- order.spaceDTO.shippingSpaceType == 3 && 暂去除类型限制 -->
        <!-- 订舱 -->
        <el-button type="primary" class="order-btn" size="mini" @click="bookingFn"
          v-if="order.isUnlocked && order.mblShow && (order.baseDTO.orderState === 10 || order.baseDTO.orderState === 30 || order.baseDTO.orderState === 40)"
          v-permission="['air:order:export:booking']">{{
            $t('air.booking')
          }}
        </el-button>
        <!-- 订舱确认 -->
        <el-button type="primary" class="order-btn" size="mini" @click="bookingConfirmation"
          v-if="order.isUnlocked && order.mblShow && order.baseDTO.orderState === 10" v-permission="['air:order:export:bookingConfirmation']">
          {{ $t('air.bookingConfirmation') }}</el-button>
        <!-- bookingConfirmation -->
        <!-- 改配 -->
        <el-button type="primary" class="order-btn" size="mini" @click="changeShippingSpace"
          v-if="order.isUnlocked && order.mblShow && order.baseDTO.orderState !== 5 && order.baseDTO.orderState !== 100 && order.baseDTO.orderState !== 95 && order.baseDTO.orderState !== 99 && order.baseDTO.businessLockState !== true"
          v-permission="['air:order:export:modificationSpace']">{{ $t('air.toMatch') }}</el-button>
        <!-- 起飞 -->
        <el-button type="primary" class="order-btn" size="mini" @click="atdFn"
          v-if="order.isUnlocked && (order.mblShow && order.baseDTO.orderState !== 100 && order.baseDTO.orderState !== 95 && order.baseDTO.orderState !== 99)"
          v-permission="['air:order:export:atd']">{{
            $t('air.takeOff')
          }}</el-button>
        <!-- 到港 -->
        <el-button type="primary" class="order-btn" size="mini" @click="ataFn"
          v-if="order.isUnlocked && (order.mblShow && order.baseDTO.orderState !== 100 && order.baseDTO.orderState !== 95 && order.baseDTO.orderState !== 99)"
          v-permission="['air:order:export:ata']">{{
            $t('air.arrivalAtPort')
          }}</el-button>
      </div>
      <div class="form-module-item">
        <div class="item">
          <!-- 舱位类型 -->
          <label>{{ $t('air.shippingSpaceTypeDesc') }}</label>
          <span>{{ order.spaceDTO.shippingSpaceTypeDesc }}</span>
        </div>

        <div class="item">
          <!-- 产品航线 -->
          <label>{{ $t('air.productAirlineName') }}</label>
          <span>{{ order.spaceDTO.productAirlineName }}</span>
        </div>
        <div class="item">
          <!-- 收货地 -->
          <label>{{ $t('air.delivery') }}</label>
          <span>{{ order.spaceDTO.delivery || '--' }} / {{ order.spaceDTO.deliveryCode || '--' }}</span>
        </div>
        <div class="item">
          <!-- 货好日期 -->
          <label>{{ $t('air.erd') }}</label>
          <span>{{ parseTime(order.spaceDTO.erd) }}</span>
        </div>
        <div class="item">
          <!-- 订舱代理 -->
          <label>{{ $t('air.bookingAgentPort') }}</label>
          <span>{{ order.spaceDTO.bookingAgentName }}</span>
        </div>
        <div class="item">
          <!-- 装货港 -->
          <label>{{ $t('air.pol') }}</label>
          <span>{{ order.spaceDTO.pol || '--' }} / {{ order.spaceDTO.polCode || '--' }}</span>
        </div>
        <div class="item">
          <!-- 航班日期 -->
          <label>{{ $t('air.etd') }}</label>
          <span>
            <span v-if="order.spaceDTO.atd">{{ parseTime(order.spaceDTO.atd) }}（{{ $t('air.actual') }}）</span>
            <span v-else-if="order.spaceDTO.etd">{{ parseTime(order.spaceDTO.etd) }}（{{ $t('air.predict') }}）</span>
          </span>
        </div>
        <div class="item">
          <!-- 进仓代理 -->
          <label>{{ $t('air.loadingAgentName') }}</label>
          <span>{{ order.spaceDTO.loadingAgentName }}</span>
        </div>
        <div class="item">
          <!-- 中转港 -->
          <label>{{ $t('air.transitPort') }}</label>
          <span>{{ order.spaceDTO.pot || '--' }} / {{ order.spaceDTO.potCode || '--' }}</span>
        </div>

        <div class="item">
          <!-- 到港日期 -->
          <label>{{ $t('air.eta') }}</label>
          <span>
            <span v-if="order.spaceDTO.ata">{{ parseTime(order.spaceDTO.ata) }}（{{ $t('air.actual') }}）</span>
            <span v-else-if="order.spaceDTO.eta">{{ parseTime(order.spaceDTO.eta) }}（{{ $t('air.predict') }}）</span>
          </span>
        </div>

        <div class="item">
          <!-- 目的港代理 -->
          <label>{{ $t('air.destinationAgentName') }}</label>
          <span>{{ order.spaceDTO.destinationAgentName }}</span>
        </div>
        <div class="item">
          <!-- 卸货港 -->
          <label>{{ $t('air.pod2') }}</label>
          <span>{{ order.spaceDTO.pod || '--' }} / {{ order.spaceDTO.podCode || '--' }}</span>
        </div>


        <div class="item">
          <!-- 航班号 -->
          <label>{{ $t('air.flightNo') }}</label>
          <span>{{ order.spaceDTO.flightNo }}</span>
        </div>
        <div class="item">
          <!-- 订舱备注 -->
          <label>{{ $t('air.remarks') }} </label>
          <span>{{ order.spaceDTO.bookingRemark }}</span>
        </div>
        <div class="item">
          <!-- 交货地 -->
          <label>{{ $t('air.receipt') }}</label>
          <span>{{ order.spaceDTO.receipt || '--' }} / {{ order.spaceDTO.receiptCode || '--' }}</span>
        </div>
        <div class="item">
          <!-- 产品备注 -->
          <label>{{ $t('air.productNote') }} </label>
          <span>{{ order.productRemark }}</span>
        </div>

      </div>
      <!-- 收发通信息 -->
      <div class="form-module-title">{{ $t('air.sendingAndReceivingMessages') }}</div>
      <div class="form-module-item shipping-info">
        <div class="item">
          <!-- 委托托运人 -->
          <label>{{ $t('air.orderShipperAddress') }}</label>
          <span>
            <el-input v-model="order.addressDTO.orderShipperAddress" :rows="8" type="textarea" wrap="off" disabled />
          </span>
        </div>
        <div class="item">
          <!-- 委托收货人 -->
          <label>{{ $t('air.orderConsigneeAddress') }}</label>
          <span>
            <el-input v-model="order.addressDTO.orderConsigneeAddress" :rows="8" type="textarea" wrap="off" disabled />
          </span>
        </div>
        <div class="item">
          <!-- 委托通知人 -->
          <label>{{ $t('air.orderNotifyAddress') }}</label>
          <span>
            <el-input v-model="order.addressDTO.orderNotifyAddress" :rows="8" type="textarea" wrap="off" disabled />
          </span>
        </div>
      </div>
    </div>


    <atd @refresh="refreshFn" :visible="atdFormVisible" @close="atdClose" :jobIds="[]" :orderIds="[order.id]"
      :order="order" :atd="order.spaceDTO.atd"></atd>
    <ata @refresh="refreshFn" :visible="ataFormVisible" @close="ataClose" :jobIds="[]" :orderIds="[order.id]"
      :ata="order.spaceDTO.ata" :order="order"></ata>
    <basic-info @refresh="refreshFn" :visible="basicInfoFormVisible" @close="basicInfoClose" :order="order"
      v-if="order.id"></basic-info>

    <requester-info @refresh="refreshFn" :visible="requesterInfoFormVisible" @close="requesterInfoClose" :order="order"
      v-if="order.id"></requester-info>
    <inbound @refresh="refreshFn" :visible="inboundVisible" @close="inboundClose" :orderId="order.id" :order="order"></inbound>

    <booking-confirmation @refresh="refreshFn" :visible="bookingConfirmationVisible" @close="bookingConfirmationClose"
      :order="order" v-if="order.id"></booking-confirmation>

    <shipping-space @refresh="refreshFn" :visible="shippingSpaceVisible" @close="shippingSpaceClose" :order="order"
      v-if="order.id"></shipping-space>
    <report-list-dialog v-if="reportDialog.isShow" :is-show="reportDialog.isShow" :print-data="reportDialog.data"
      :type-code="reportDialog.typeCode" @closeDialog="reportDialog.isShow = false" />

    <el-dialog :title="$t('air.bookingTip')" :visible.sync="bookingVisible" width="400px">
      <div>{{ $t('air.bookingTip1') }}{{ order.baseDTO.orderNo }} {{ $t('air.bookingTip2') }}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bookingVisible = false" size="mini">{{ $t('air.cancel') }} </el-button>
        <el-button type="primary" @click="bookingFile" size="mini">{{ $t('air.determine') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { updateAirExportOrderBaseInfoApi, bookingAirExportOrderApi } from '@/api/airExport'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'
import inbound from './operation/inboundDialog'
import shippingSpace from './operation/shippingSpaceDialog'
import basicInfo from './operation/baseInfoDialog'
import requesterInfo from './operation/requesterInfoDialog'
import ata from './operation/ataDialog'
import atd from './operation/atdDialog'
import reportListDialog from '@/components/Cargo/Report/reportListDialog'

import bookingConfirmation from './operation/bookingConfirmationDialog'

import { parseTime } from '@/utils/index'

export default {
  name: 'OrderDetailBasic',
  components: {
    cargoLimitedSelect,
    inbound,
    shippingSpace,
    basicInfo,
    requesterInfo,
    ata,
    atd,
    reportListDialog,
    bookingConfirmation
  },
  props: {
    order: {
      type: Object,
      default () {
        return {
          spaceDTO: {},
          addressDTO: {},
          cargoDTO: {},
          baseDTO: {}
        }
      }
    },
    tabPane: {
      type: String,
      default () {
        return ""
      }
    }
  },
  data () {
    return {
      reportDialog: { // 打印报表对话框
        isShow: false,
        typeCode: '',
        data: {
          jobId: '',
          assistInfo: '',
          definedInfo: '',
          entityIdList: [],
          remark: ''
        }
      },
      basicInfoModel: {
        customerName: '',
        customerId: '',
        hblFreightTerm: ''
      },
      basicInfoRules: {
        "customerId": [{ required: true, message: this.$t('air.requesterHold'), trigger: 'change' }]
      },
      basicInfoFormVisible: false,
      inboundVisible: false,
      shippingSpaceVisible: false,
      ataFormVisible: false,
      atdFormVisible: false,
      bookingVisible: false,
      bookingConfirmationVisible: false,
      requesterInfoFormVisible: false
    }
  },
  watch: {
    tabPane (newV) {
      if (newV === "Basic") {
        console.log("Basic", newV)
        this.$emit('refresh')
      }
    }
  },

  created () {
  },
  mounted () {

  },
  methods: {
    parseTime (value) {
      return parseTime(value, '{y}-{m}-{d} {h}:{i}')
    },
    bookingFn () {
      this.bookingVisible = true
      bookingAirExportOrderApi(this.order.id).then(res => {
        if (res && res.ok) {
          this.$message.success(this.$t('air.bookingSuccessfulEnd'))
          this.$emit('refresh')
        }
      })
    },
    bookingFile () {
      this.bookingVisible = false
      // 根据查询条件进行批量打印
      // const { blNo = null, blStatus = null, containerNo = null, hsCode = null, memberId = null, sealNo = null, vessel = null, voyage = null, declareStatus = null, declareMethod = null, polCode = null, podCode = null } = {}
      // const queryConditionJson = { blNo, blStatus, containerNo, hsCode, memberId, sealNo, vessel, voyage, declareStatus, declareMethod, polCode, podCode }
      // this.reportDialog.typeCode = 'AIR_BOOKING'
      // this.reportDialog.data = { queryConditionJson: queryConditionJson }

      this.reportDialog.typeCode = 'AIR_BOOKING'
      this.reportDialog.data = {
        jobId: this.order.id,
        entityIdList: [this.order.id]
      };
      // this.reportDialog.data = { queryConditionJson: JSON.stringify(queryConditionJson) }
      this.reportDialog.isShow = true
    },
    refreshFn () {
      this.$emit('refresh')
    },
    init () {

    },
    atdFn () {
      this.atdFormVisible = true
    },
    atdClose () {
      this.atdFormVisible = false
    },
    ataFn () {
      this.ataFormVisible = true
    },
    ataClose () {
      this.ataFormVisible = false
    },
    inboundFn () {
      this.inboundVisible = true
    },
    inboundClose () {
      this.inboundVisible = false
    },
    bookingConfirmation () {
      this.bookingConfirmationVisible = true
    },

    bookingConfirmationClose () {
      this.bookingConfirmationVisible = false

    },
    changeShippingSpace () {
      this.shippingSpaceVisible = true
    },
    shippingSpaceClose () {
      this.shippingSpaceVisible = false
    },

    setCustomerInfo (customer) {
      this.basicInfoModel.customerId = customer.id
      this.basicInfoModel.customerName = customer.chineseName
    },
    basicInfo () {
      this.basicInfoFormVisible = true
    },
    basicInfoClose () {
      this.$emit('refresh')
      this.basicInfoFormVisible = false
    },
    requesterInfo () {
      this.requesterInfoFormVisible = true
    },
    requesterInfoClose () {
      this.$emit('refresh')
      this.requesterInfoFormVisible = false
    },
    submitBaseInfo () {
      let data = this.basicInfoModel
      data.orderId = this.order.id
      this.$refs.basicInfoFormRef.validate(valid => {
        if (valid) {
          this.basicInfoFormVisible = false
          updateAirExportOrderBaseInfoApi(data).then(res => {
            if (res && res.ok) {
              this.$message.success(this.$t('air.updateSuccessfully'))
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.page-form {
  width: 100%;
  max-width: 1200px;
  padding: 20px 10px;
  background: #f5f7fa;
}

.form-module-title {
  font-size: 15px;
  margin-bottom: 10px;
  display: block;
  color: #1890ff;
  padding-left: 10px;
  border-left: 2px solid #1890ff;
  height: 28px;
  line-height: 28px;
}

.form-module-item {
  overflow: hidden;
  padding: 20px;
  background: #fff;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px 0 #efefef, 0 0 6px 0 #efefef;

  .item {
    width: 33%;
    float: left;
    padding: 0 20px;
    margin-bottom: 10px;

    label {
      font-size: 14px;
      margin-right: 20px;
    }

    span {
      font-size: 12px;
    }
  }
}

.charge-list-data {
  margin: 20px 0;
}

.operation-btn {
  padding: 20px;
  text-align: right;
  background: #fff;
}

.order-btn {
  margin-left: 12px;
}

.shipping-info .item label {
  display: block;
  margin-bottom: 8px;
}

.shipping-info .item span {
  display: inline-block;
  min-height: 200px;
  width: 100%;
  border-radius: 5px;

  ::v-deep .el-textarea.is-disabled .el-textarea__inner {
    background-color: #fff;
    font-size: 12px;
    color: #000;
  }
}

.dialog-footer {
  text-align: center;
}
</style>
