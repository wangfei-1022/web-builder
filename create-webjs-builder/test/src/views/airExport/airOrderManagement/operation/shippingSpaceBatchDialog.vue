<template>
  <!-- 改配 -->
  <el-dialog :title="$t('air.toMatch')" :visible.sync="visible" width="900px" @close="closeFn">
    <el-form ref="shippingSpaceFormRef" :model="shippingSpaceModel" :rules="shippingSpaceRules" label-width="95px"
      label-position="left" class="shippingSpaceForm" @close="closeFn">
      <!-- 航空公司 -->
      <el-form-item :label="$t('air.airlineName')" prop="airlineId">
        <!-- <cargo-limited-select :placeholder="$t('air.placeholder')" :method="airCustomerMethod"
          :select-label="shippingSpaceModel.airlineName" :select-value="shippingSpaceModel.airlineId" type="customer"
          style="width: 100%;" @set="setAirCustomerInfo" /> -->

        <type-select :placeholder="$t('air.placeholder')" v-model="shippingSpaceModel.airlineName" type="airLine"
          style="width: 100%;" @selected="setAirCustomerInfo" />

      </el-form-item>
      <!-- 订舱代理 -->
      <el-form-item :label="$t('air.bookingAgentPort')" prop="bookingAgentId">
        <!-- <cargo-limited-select :select-label="shippingSpaceModel.bookingAgentName"
          :select-value="shippingSpaceModel.bookingAgentId" :method-params="{ range: ['b_booking_agent'] }"
          type="customer" style="width: 100%;" @set="setBookingAgentInfo" /> -->

        <type-select v-model="shippingSpaceModel.bookingAgentName" type="supplier" style="width: 100%;"
          :request-params="{ 'partnerRole': 14014, 'businessType': 'AIR_EXPORT' }" @selected="setBookingAgentInfo" />
      </el-form-item>
      <!-- 航班号 -->
      <el-form-item :label="$t('air.flightNo')" prop="flightNo">
        <el-input v-model="shippingSpaceModel.flightNo" class="job-no-input" size="mini" />
      </el-form-item>
      <!-- 预计航班时间 -->
      <el-form-item :label="$t('air.etd2')" prop="etd">
        <CommonPicker v-model="shippingSpaceModel.etd" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm"
          size="mini" />
      </el-form-item>
      <!-- 预计到港时间 -->
      <el-form-item :label="$t('air.eta2')" prop="eta">
        <CommonPicker v-model="shippingSpaceModel.eta" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm"
          size="mini" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeFn" size="mini">{{ $t('air.cancel') }}</el-button>
      <el-button type="primary" @click="submitBaseInfo" size="mini">{{ $t('air.determine') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { updateAirExportOrderShippingSpaceBatchApi, updateAirExportJobShippingSpaceBatchApi } from '@/api/airExport'
import { getTerminologyListByTypeApi, airLineListApi } from '@/api/common'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'
import { logServiceName, airLogBusinessType, logOrigin } from '@/utils/constant'

export default {
  name: 'ShippingSpaceBatch',
  components: {
    cargoLimitedSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    order: {
      type: Object,
      default: function () {
        return {}
      }
    },
    jobIds: {
      type: Array,
      default: function () {
        return []
      }
    },
    orderIds: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      airCustomerMethod: airLineListApi,
      shippingSpaceModel: {
        airlineId: '',
        airlineName: '',
        airlineScacCode: '',
        bookingAgentId: '',
        bookingAgentName: '',
        flight: '',
        etd: '',
        eta: ''
      },
      shippingSpaceRules: {
        "airlineId": [{ required: true, message: this.$t('air.requiredAirline'), trigger: 'change' }],
        "bookingAgentId": [{ required: true, message: this.$t('air.requiredBookingAgentPort'), trigger: 'change' }],
        "etd": [{ required: true, message: this.$t('air.requiredEtd'), trigger: 'change' }],
        "eta": [{ required: true, message: this.$t('air.requiredEta'), trigger: 'change' }],
        "flightNo": [{ required: true, message: this.$t('air.requiredFlightNo'), trigger: 'blur' }]
      },
      freightTermList: []
    }
  },
  mounted () {
    this.initBasicData()
  },
  methods: {
    initBasicData () {
      getTerminologyListByTypeApi('FREIGHTTERM').then(res => {
        if (res && res.ok) {
          this.freightTermList = res.content
        }
      })
    },
    closeFn () {
      this.$emit('close')
    },
    submitBaseInfo () {
      let data = this.shippingSpaceModel
      data.orderIds = this.orderIds
      let fn = updateAirExportOrderShippingSpaceBatchApi
      if (this.jobIds && this.jobIds.length) {
        fn = updateAirExportJobShippingSpaceBatchApi
        data.jobIds = this.jobIds
      }
      this.$refs.shippingSpaceFormRef.validate(valid => {
        if (valid) {
          // 添加日志 记录数据
          this.logBtnSend({
            origin: logOrigin.SYSTEM_OPERATION,
            logCode: airLogBusinessType.TO_MATCH,
            serviceName: logServiceName.AIR_SERVICE,
            businessType: airLogBusinessType.TO_MATCH,
            content: {
              ...data
            }
          })
          fn(data).then(res => {
            if (res && res.ok) {
              this.$message.success(this.$t('air.batchMatchSuccessfully'))
              this.closeFn()
              this.$emit('refresh')
            }
          })
        }
      })
    },
    setCustomerInfo (customer) {
      this.shippingSpaceModel.customerId = customer.id
      this.shippingSpaceModel.customerName = customer.chineseName
    },
    setAirCustomerInfo (customer) {
      this.shippingSpaceModel.airlineId = customer.id
      this.shippingSpaceModel.airlineName = customer.chineseName
      this.shippingSpaceModel.airlineScacCode = customer.scacCode
    },
    setBookingAgentInfo (customer) {
      this.shippingSpaceModel.bookingAgentName = customer.chineseName
      this.shippingSpaceModel.bookingAgentId = customer.id
    }

  }
}
</script>

<style scoped lang="less">
.shippingSpaceForm {
  overflow: hidden;

  ::v-deep .el-form-item {
    width: 33%;
    float: left;
  }

  ::v-deep .el-col {
    margin-top: 0px;
  }

  ::v-deep .el-form-item__label {
    text-align: right;
  }
}

.dialog-footer {
  text-align: center;
}
</style>
