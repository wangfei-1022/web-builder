<template>
  <!-- 订单调整 -->
  <el-dialog :close-on-click-modal="false" :title="$t('air.requesterModify')" :visible.sync="visible" @close="closeFn"
    width="990px" v-loading="loading">
    <el-form ref="basicInfoFormRef" :model="basicInfoModel" :rules="basicInfoRules" label-width="90px"
      label-position="left" class="basicInfoForm">
      <!-- 委托件数 -->
      <el-form-item :label="$t('air.orderQuantity')" prop="orderQuantity" size="mini">
        <el-input v-model="basicInfoModel.orderQuantity" class="job-no-input" size="mini" :disabled="businessLockState" />
      </el-form-item>
      <!-- 委托毛重 -->
      <el-form-item :label="$t('air.orderGrossWeight')" prop="orderGrossWeight">
        <el-input v-model="basicInfoModel.orderGrossWeight" class="job-no-input" size="mini"
          :disabled="businessLockState">
          <template slot="append">KGS</template>
        </el-input>
      </el-form-item>
      <!-- 委托体积 -->
      <el-form-item :label="$t('air.orderVolume')" prop="orderVolume">
        <el-input v-model="basicInfoModel.orderVolume" class="job-no-input" size="mini" :disabled="businessLockState">
          <template slot="append">CBM</template>
        </el-input>
      </el-form-item>
      <!-- 货物英文品名 -->
      <el-form-item :label="$t('air.cargoEnName')" prop="cargoEnName">
        <el-input v-model="basicInfoModel.cargoEnName" class="job-no-input" size="mini" type="textarea" rows="3"
          :disabled="businessLockState" />
      </el-form-item>
      <!-- 货物中文品名 -->
      <el-form-item :label="$t('air.cargoCnName')" prop="cargoCnName">
        <el-input v-model="basicInfoModel.cargoCnName" class="job-no-input" size="mini" type="textarea" rows="3"
          :disabled="businessLockState" />
      </el-form-item>
      <!-- 托盘尺寸 -->
      <el-form-item :label="$t('air.palletSizes')" prop="palletSizes">
        <el-input v-model="basicInfoModel.palletSizes" class="job-no-input" size="mini" type="textarea" rows="3"
          :disabled="businessLockState" />
      </el-form-item>


      <!-- 装货港 -->
      <el-form-item :label="$t('air.pol')" prop="polCode">
        <el-row>
          <el-col :span="8">
            <type-select v-model="basicInfoModel.polCode" type="airport" @selected="selectedPol"
              :disabled="businessLockState" />
          </el-col>
          <el-col :span="16" style="padding-left: 10px;">
            <el-input v-model="basicInfoModel.pol" class="job-no-input" size="mini" disabled />
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 卸货港 -->
      <el-form-item :label="$t('air.pod2')" prop="podCode">
        <el-row>
          <el-col :span="8">
            <type-select v-model="basicInfoModel.podCode" type="airport" @selected="selectedPod"
              :disabled="businessLockState" />
          </el-col>
          <el-col :span="16" style="padding-left: 10px;">
            <el-input v-model="basicInfoModel.pod" class="job-no-input" size="mini" disabled />
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 交货地 -->
      <el-form-item :label="$t('air.receipt')" prop="receiptCode">
        <el-row>
          <el-col :span="8">
            <type-select v-model="basicInfoModel.receiptCode" type="airport" @selected="selectedRec"
              :disabled="businessLockState" />
          </el-col>
          <el-col :span="16" style="padding-left: 10px;">
            <el-input v-model="basicInfoModel.receipt" class="job-no-input" size="mini" disabled />
          </el-col>
        </el-row>
      </el-form-item>

      <!-- 货物类型 -->
      <el-form-item :label="$t('air.cargoType')" prop="cargoType">
        <el-select v-model="basicInfoModel.cargoType" :placeholder="$t('air.placeholder')" style="width:100%" size="mini"
          :disabled="businessLockState">
          <el-option :label="$t('air.generalCargo')" value="0"></el-option>
          <el-option :label="$t('air.dangerousGoods')" value="1"></el-option>
          <el-option :label="$t('air.refrigeratedGoods')" value="2"></el-option>
          <el-option :label="$t('air.overweightCargo')" value="3"></el-option>
          <el-option :label="$t('air.hangGarment')" value="4"></el-option>
        </el-select>
      </el-form-item>
      <!-- 托书价格 -->
      <!-- <el-form-item :label="$t('air.joeBookPrices')" prop="bookingReceivable">
        <el-input v-model="basicInfoModel.bookingReceivable" class="job-no-input" size="mini" maxlength="100"
          show-word-limit>
        </el-input>
      </el-form-item> -->

      <!-- 贸易条款 -->
      <el-form-item :label="$t('air.tradeTerms')" prop="tradeTerm">
        <type-select v-model="basicInfoModel.tradeTerm" type="trade" termCode="TRADEMODE" :disabled="businessLockState" />
      </el-form-item>

      <!-- 航班日期  -->
      <el-form-item :label="$t('air.etd')" prop="etd">
        <CommonPicker :disabled="isDisable || businessLockState" v-model="basicInfoModel.etd" pikcer-type="datetime"
          pickerFormat="yyyy-MM-dd HH:mm" size="mini" />
      </el-form-item>
      <!-- 预计航班时间 -->
      <!-- <el-form-item :label="$t('air.etd')" prop="etd">
        <CommonPicker v-model="basicInfoModel.etd" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm" size="mini" />
      </el-form-item> -->
      <!-- 订舱备注 -->
      <el-form-item :label="$t('air.remarks')" prop="bookingRemark">
        <el-input v-model="basicInfoModel.bookingRemark" class="job-no-input" style="width:380%" size="mini"
          :disabled="businessLockState" show-word-limit>
        </el-input>
      </el-form-item>

    </el-form>

    <div v-if="businessLockState" style="margin-top: 0px;height: 10px;color:coral;text-align: center;"> {{
      $t('air.businessLocktWarning')
    }} </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="closeFn" size="mini">{{ $t('air.cancel') }}</el-button>
      <el-button type="primary" @click="submitBaseInfo" size="mini">{{ $t('air.determine') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { exportAirOrderEntrustAdjustment } from '@/api/airExport'
import { logServiceName, airLogBusinessType, logOrigin } from '@/utils/constant'
import orderMixin from '../orderMixin'

export default {
  name: 'RequesterInfoDialog',
  mixins: [orderMixin],
  components: {
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
      console.log("this.order.cargoDTO", this.order.cargoDTO)
      // 订单状态为【待报价】【待确认】【待配舱】时，允许用户修改。
      if (this.order.baseDTO.orderState === 0 || this.order.baseDTO.orderState === 3 || this.order.baseDTO.orderState === 5) {
        this.isDisable = false
      } else {
        this.isDisable = true
      }
      if (this.order.baseDTO.businessLockState === true) {
        this.businessLockState = true
      } else {
        this.businessLockState = false
      }
      this.basicInfoModel = {
        orderQuantity: this.order.cargoDTO.orderQuantity,
        orderGrossWeight: this.order.cargoDTO.orderGrossWeight,
        orderVolume: this.order.cargoDTO.orderVolume,
        cargoEnName: this.order.cargoDTO.cargoEnName,
        cargoCnName: this.order.cargoDTO.cargoCnName,
        palletSizes: this.order.cargoDTO.palletSizes,
        cargoType: this.order.cargoDTO.cargoType + "",
        bookingReceivable: this.order.baseDTO.bookingReceivable,
        bookingRemark: this.order.spaceDTO.bookingRemark,
        polCode: this.order.spaceDTO.polCode, // 装货港
        pol: this.order.spaceDTO.pol, // 装货港
        podCode: this.order.spaceDTO.podCode, // 卸货港
        pod: this.order.spaceDTO.pod, // 卸货港
        receiptCode: this.order.spaceDTO.receiptCode, // 交货地
        receipt: this.order.spaceDTO.receipt, // 交货地
        etd: this.order.spaceDTO.etd, // 预计航班时间
        tradeTerm: this.order.spaceDTO.tradeTerm
      }
    }
  },
  data () {
    return {
      businessLockState: false,
      isDisable: false,
      loading: false,
      contactList: [],
      basicInfoModel: {
        signDesc: "",
        customerLevel: "",
        settlementMode: "",
        settlementModeDesc: "",
        customerName: '',
        customerId: '',
        sellerId: '',
        sellerName: '',
        // hblFreightTerm: '',
        blMode: '',
        contactCnName: '',
        contactMobile: '',
        contactEmail: '',
        bookingReceivable: '',
        tradeTerm: '',
        operationId: "",
        operationName: "",
        polCode: "", // 装货港
        pol: "", // 装货港
        podCode: "", // 卸货港
        pod: "", // 卸货港
        receiptCode: "", // 交货地
        receipt: "", // 交货地
        etd: "" // 预计航班时间
      },
      basicInfoRules: {
        "orderQuantity": [{ required: true, message: this.$t('air.requiredOrderQuantity'), trigger: 'blur' }],
        "orderGrossWeight": [{ required: true, message: this.$t('air.requiredOrderGrossWeight'), trigger: 'blur' }],
        "orderVolume": [{ required: true, message: this.$t('air.requiredOrderVolume'), trigger: 'blur' }],
        "bookingReceivable": [{ required: true, message: this.$t('air.pleaseEnter'), trigger: 'blur' }],
        "polCode": [{ required: true, message: this.$t('air.requiredPol'), trigger: 'blur' }],
        "podCode": [{ required: true, message: this.$t('air.requiredPod'), trigger: 'blur' }],
        "receiptCode": [{ required: true, message: this.$t('air.requiredReceiptCode'), trigger: 'blur' }],
        "etd": [{ required: true, message: this.$t('air.requiredEtd'), trigger: 'blur' }],
        "cargoType": [{ required: true, message: this.$t('air.requiredCargoType'), trigger: 'blur' }],
        "tradeTerm": [{ required: true, message: this.$t('air.pleaseSelectData'), trigger: 'blur' }]
      },
      freightTermList: []
    }
  },
  methods: {
    // 收货地
    selectedRec (port) {
      this.basicInfoModel.receipt = port.englishName
    },
    selectedPol (port) {
      this.basicInfoModel.pol = port.englishName
    },
    selectedPod (port) {
      this.basicInfoModel.pod = port.englishName

      if (!this.basicInfoModel.receiptCode) {
        this.basicInfoModel.receiptCode = port.code3 // 交货地
        this.basicInfoModel.receipt = port.englishName // 交货地
      }

    },
    closeFn () {
      this.$emit('close')
    },
    submitBaseInfo () {
      let data = this.basicInfoModel
      data.orderId = this.order.id
      this.$refs.basicInfoFormRef.validate(valid => {
        if (valid) {
          this.loading = true
          exportAirOrderEntrustAdjustment(data).then(res => {
            if (res && res.ok) {
              this.$message.success(this.$t('air.updateSuccessfully'))
              this.closeFn()
              this.adjustConfirmFn(this.order)
            }
            this.loading = false
          })
        }
      })

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
