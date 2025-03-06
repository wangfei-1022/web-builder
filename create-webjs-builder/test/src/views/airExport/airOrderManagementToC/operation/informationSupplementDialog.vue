<template>
  <!-- 信息补录 -->
  <el-dialog :close-on-click-modal="false" :title="$t('air.informationSupplement')" :visible.sync="visible" @close="closeFn"
    width="1000px" v-loading="loading">
    <el-form ref="basicInfoFormRef" :model="informationModel"  label-width="98px"
      label-position="left" class="basicInfoForm">
      <!-- 小包渠道 -->
      <el-form-item :label="$t('air.packetChannel')" prop="bagChannel" size="mini">
        <el-input v-model="informationModel.bagChannel"  maxlength="500" disabled >
        </el-input>
      </el-form-item>
      <!-- 航空公司 -->
      <el-form-item :label="$t('air.airline')" prop="airlineId" size="mini">
        <type-select :placeholder="$t('air.placeholder')" v-model="informationModel.airlineName" type="airLine"
          style="width: 100%;" @selected="setAirCustomerInfo" />
      </el-form-item>

      <!-- 国内空运代理 业务类型等于【国际专线业务】，供应商类型包含【国内空运代理】的数据；-->
      <el-form-item :label="$t('air.nationalEncouragementscholarship')" prop="bookingAgentName" size="mini">
        <type-select v-model="informationModel.bookingAgentName"
                           type="supplier"
                           @selected="bookingAgentChange"
                           :request-params="{'businessType': 'AIR_EXPORT', 'partnerRole': 14014}"
                           />
      </el-form-item>
      <!-- 进仓操作代理 业务类型等于【国际专线业务】，供应商类型包含【报关行】的数据；-->
      <el-form-item :label="$t('air.inboundOperationAgent')" prop="loadingAgentName" size="mini">
        <type-select v-model="informationModel.loadingAgentName"
                           type="supplier"
                           @selected="loadingAgentChange"
                           :request-params="{'businessType': 'AIR_EXPORT', 'partnerRole': 16010}"
                           />
      </el-form-item>
      <!-- 起运港 -->
      <el-form-item :label="$t('air.pol')" prop="polCode" >
        <el-row>
          <el-col :span="10">
            <type-select v-model="informationModel.polCode" type="airport" @selected="selectedPol" />
          </el-col>
          <el-col :span="14" style="padding-left: 10px;">
            <el-input v-model="informationModel.pol" class="job-no-input" size="mini" disabled />
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 目的港 -->
      <el-form-item :label="$t('air.pod2')" prop="podCode" :rules="[{ required: true, message: $t('air.requiredPod'), trigger: 'change' }]">
        <el-row>
          <el-col :span="10">
            <type-select v-model="informationModel.podCode" type="airport" @selected="selectedPod"  />
          </el-col>
          <el-col :span="14" style="padding-left: 10px;">
            <el-input v-model="informationModel.pod" class="job-no-input" size="mini" disabled />
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeFn" size="mini">{{ $t('air.cancel') }}</el-button>
      <el-button type="primary" @click="submitBaseInfo" size="mini">{{ $t('air.determine') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { exportAirExportSupplementarySpaceC2Api } from '@/api/airExport'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'


export default {
  name: 'InformationSupplementDialog',
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
    }
  },
  watch: {
    visible (val) {
      this.informationModel = {
        bagChannel: this.order.baseDTO.bagChannel,
        airlineId: this.order.spaceDTO.airlineId,
        airlineName: this.order.spaceDTO.airlineName,
        airlineScacCode: this.order.spaceDTO.airlineScacCode,
        bookingAgentId: this.order.spaceDTO.bookingAgentId,
        bookingAgentName: this.order.spaceDTO.bookingAgentName,
        loadingAgentId: this.order.spaceDTO.loadingAgentId, // 进仓代理
        loadingAgentName: this.order.spaceDTO.loadingAgentName, // 进仓代理名称
        podCode: this.order.spaceDTO.podCode, // 卸货港
        pod: this.order.spaceDTO.pod,
        polCode: this.order.spaceDTO.polCode, // 装货港
        pol: this.order.spaceDTO.pol
      }
    }
  },
  data () {
    return {
      loading: false,
      informationModel: {
        bagChannel: "",
        airlineId: "",
        airlineName: "",
        airlineScacCode: "",
        bookingAgentId: "",
        bookingAgentName: '',
        loadingAgentId: '',
        loadingAgentName: '',
        pol: '',
        polCode: '',
        pod: '',
        podCode: ''
      }
    }
  },

  methods: {
    setAirCustomerInfo (customer) {
      this.informationModel.airlineId = customer.id
      this.informationModel.airlineName = customer.chineseName
      this.informationModel.airlineScacCode = customer.scacCode
    },
    bookingAgentChange (customer) {
      this.informationModel.bookingAgentId = customer.id
      this.informationModel.bookingAgentName = customer.chineseName
    },
    loadingAgentChange (customer) {
      this.informationModel.loadingAgentId = customer.id
      this.informationModel.loadingAgentName = customer.chineseName
    },
    selectedPol (port) {
      this.informationModel.pol = port.englishName
    },
    selectedPod (port) {
      this.informationModel.pod = port.englishName
    },
    closeFn () {
      this.$emit('close')
    },
    submitBaseInfo () {
      this.$refs.basicInfoFormRef.validate(valid => {
        if (valid) {
          this.submitBaseInfoApi()
        }
      })
    },
    async submitBaseInfoApi () {
      let data = this.informationModel
      data.orderId = this.order.id
      this.loading = true
      const res = await exportAirExportSupplementarySpaceC2Api(data)
      if (res && res.ok) {
        this.$emit('refresh')
        this.$message.success(this.$t('air.updateSuccessfully'))
        this.closeFn()
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">
.dialog-footer {
  text-align: center;
}

.basicInfoForm {
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
</style>
