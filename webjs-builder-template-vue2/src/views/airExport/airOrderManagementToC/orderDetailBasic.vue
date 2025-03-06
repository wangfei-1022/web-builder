<template>
  <div class="app">
    <div>
      <div class="form-module-title ">
        <span>{{ $t('air.orderInformation') }}</span>
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
          <label>{{ $t('air.dataSource') }}</label>
          <span>{{ order.baseDTO.dataSourceDesc }}</span>
        </div>
      </div>

      <div class="form-module-title">
        <!-- 货物信息 -->
        <span>{{ $t('air.cargoInformation') }}</span>
        <!-- 隐藏入仓功能按钮 -->
        <!-- <el-button type="primary" class="order-btn" size="mini" @click="inboundFn"
          v-if="order.baseDTO.orderState !== 100 && order.baseDTO.orderState !== 95 && order.baseDTO.orderState === 30"
          v-permission="['air:order:exportToC:inbound']">{{ $t('air.inbound') }}</el-button> -->
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
        <!-- 信息补录 -->
        <el-button type="primary" class="order-btn" size="mini" @click="informationSupplementFn"  v-if="order.baseDTO.dataSource === 1 && order.baseDTO.businessLockState !== true"
        v-permission="['air:order:exportToC:informationSupplement']">{{ $t('air.informationSupplement') }}</el-button>
      </div>
      <div class="form-module-item">
        <div class="item">
          <!-- 小包渠道  -->
          <label>{{ $t('air.packetChannel') }}</label>
          <span>{{ order.baseDTO.bagChannel }}</span>
        </div>
        <div class="item">
          <!-- 航空公司 -->
          <label>{{ $t('air.airline') }}</label>
          <span>{{ order.spaceDTO.airlineName }}</span>
        </div>
        <div class="item">
          <!-- 国内空运代理 -->
          <label>{{ $t('air.nationalEncouragementscholarship') }}</label>
          <span>{{ order.spaceDTO.bookingAgentName }}</span>
        </div>
        <div class="item">
          <!-- 进仓操作代理 -->
          <label>{{ $t('air.inboundOperationAgent') }}</label>
          <span>{{ order.spaceDTO.loadingAgentName }}</span>
        </div>
        <div class="item">
          <!-- 航班号 -->
          <label>{{ $t('air.flightNo') }}</label>
          <span>{{ order.spaceDTO.flightNo }}</span>
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
          <!-- 到港日期 -->
          <label>{{ $t('air.eta') }}</label>
          <span>
            <span v-if="order.spaceDTO.ata">{{ parseTime(order.spaceDTO.ata) }}（{{ $t('air.actual') }}）</span>
            <span v-else-if="order.spaceDTO.eta">{{ parseTime(order.spaceDTO.eta) }}（{{ $t('air.predict') }}）</span>
          </span>
        </div>
        <div class="item">
          <!-- 卸货港 -->
          <label>{{ $t('air.pod2') }}</label>
          <span>{{ order.spaceDTO.pod || '--' }} / {{ order.spaceDTO.podCode || '--' }}</span>
        </div>

        <!-- <div class="item">
          产品航线
          <label>{{ $t('air.productAirlineName') }}</label>
          <span>{{ order.spaceDTO.productAirlineName }}</span>
        </div>
        <div class="item">
          航线计划
          <label>{{ $t('air.routePlan') }}</label>
          <span>{{ formattingRoutePlan(order) }}</span>
        </div>
        <div class="item">
          交货地
          <label>{{ $t('air.receipt') }}</label>
          <span>{{ order.spaceDTO.receipt || '--' }} / {{ order.spaceDTO.receiptCode || '--' }}</span>
        </div> -->
        <div class="item">
          <!-- 订舱备注 -->
          <label>{{ $t('air.remarks') }} </label>
          <span>{{ order.spaceDTO.bookingRemark }}</span>
        </div>
      </div>
    </div>


    <inbound @refresh="refreshFn" :visible="inboundVisible" @close="inboundClose" :orderId="order.id"></inbound>
    <informationSupplement @refresh="refreshFn" :visible="informationSupplementVisible" @close="informationSupplementClose" :order="order"></informationSupplement>

  </div>
</template>
<script>
import { updateAirExportOrderBaseInfoApi, bookingAirExportOrderApi } from '@/api/airExport'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'
import inbound from './operation/inboundDialog'
import informationSupplement from './operation/informationSupplementDialog'

import { parseTime } from '@/utils/index'

export default {
  name: 'AirOrderToCDetailBasic',
  components: {
    cargoLimitedSelect,
    inbound,
    informationSupplement
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
      informationSupplementVisible: false,
      inboundVisible: false
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
    formattingRoutePlan (value) {
      if (value.spaceDTO.flightNo && value.spaceDTO.etd) {
        return value.spaceDTO.flightNo + "_" + this.parseTime2(value.spaceDTO.etd)
      }
    },
    parseTime (value) {
      return parseTime(value, '{y}-{m}-{d} {h}:{i}')
    },
    parseTime2 (value) {
      return parseTime(value, '{m}-{d}')
    },
    refreshFn () {
      this.$emit('refresh')
    },
    inboundFn () {
      this.inboundVisible = true
    },
    inboundClose () {
      this.inboundVisible = false
    },
    informationSupplementFn() {
      this.informationSupplementVisible = true
    },
    informationSupplementClose() {
      this.informationSupplementVisible = false
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
