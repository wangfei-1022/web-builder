<template>
  <div class="info-module">
    <div class="title">{{$t("rechargeRecord.finAudited")}}</div>
    <div class="content">
      <div  v-if="type === 'AUDITED' || (type === 'DETAIL' && recordItem.rechargeState === 40)">
        <el-form ref="formRef" :inline="true" :rules="formDataRules" :model="formData" size="mini"  label-width="0px">
          <div class="supply-container">
            <div class="supply-container-part">
              <el-row>
                <el-col :span="4">{{$t("rechargeRecord.entryAccountCurrency")}}</el-col>
                <el-col :span="4" class="center">{{recordItem.entryAccountCurrency}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="4">{{$t("rechargeRecord.amount")}}</el-col>
                <el-col :span="4" class="center">{{recordItem.currency}}</el-col>
                <el-col :span="4" class="blod">{{recordItem.amount | numberToThousands}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="4">{{$t("rechargeRecord.transactionsAmount")}}</el-col>
                <el-col :span="4" class="center">{{recordItem.transactionsCurrency}}</el-col>
                <el-col :span="4" class="blod">{{recordItem.transactionsAmount | numberToThousands}}</el-col>
                <el-col :span="6" v-if="type === 'AUDITED'">
                  <!-- 手续费 -->
                  {{$t("rechargeRecord.handleFee")}}
                  <span class="blod" style="margin-left: 5px;">{{recordItem.currency}}</span>
                  <el-form-item label="" prop="handleFee">
                    <el-input v-model="formData.handleFee" @change="calcAmount" oninput="value=value.replace(/[^\d.]/g,'')" style="width: 100px"/>
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-if="type === 'AUDITED'">
                  <!-- 充值汇率 -->
                  {{$t("rechargeRecord.clearExchangeRate")}}
                  <el-form-item label='' prop="clearExchangeRate">
                    <el-input v-model="formData.clearExchangeRate" :disabled="formData.clearExchangeRateDisabled" @change="calcAmount" oninput="value=value.replace(/[^\d.]/g,'')" style="width: 100px"/>
                  </el-form-item>
                </el-col>

                <el-col :span="6" v-if="type === 'DETAIL' && recordItem.handleFee">
                  <!-- 手续费 -->
                  {{$t("rechargeRecord.handleFee")}}
                  <span class="blod" style="margin-left: 5px;">{{recordItem.currency}}</span>
                  {{recordItem.handleFee}}
                </el-col>
                <el-col :span="6" v-if="type === 'DETAIL'">
                  <!-- 充值汇率 -->
                  {{$t("rechargeRecord.clearExchangeRate")}}
                  &nbsp;&nbsp;
                  {{recordItem.entryRate}}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">{{$t("rechargeRecord.entryAmount")}}</el-col>
                <el-col :span="4" class="center">{{recordItem.entryAccountCurrency}}</el-col>
                <el-col :span="4" class="blod">
                  {{ (type === 'DETAIL' ? recordItem.entryAmount : formData.entryAmount ) | numberToThousands}}
                  <el-tooltip effect="blue" placement="bottom" :visible-arrow="false">
                    <!-- 实际充值金额=(收款金额合计+手续费)*充值汇率 -->
                    <div slot="content">{{$t("rechargeRecord.entryAmountInfo")}}</div>
                    <span class="fee-info"><i class="iconfont icon-gantanhao-xianxingyuankuang" /></span>
                  </el-tooltip>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-form>
      </div>

      <el-form ref="auditRef" class="audit-form" :rules="formDataRules" :model="formData" size="mini" label-width="100px" v-if="type === 'AUDITED'">
        <el-form-item :label='$t("rechargeRecord.finAuditedRes")' prop="resCode">
          <el-radio-group v-model="formData.resCode">
            <el-radio :label="1">{{$t("rechargeRecord.finAuditedAgree")}}</el-radio>
            <el-radio :label="2">{{$t("rechargeRecord.finAuditedReject")}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label='$t("rechargeRecord.confirmedRemarks1")' prop="confirmedRemarks" v-if="formData.resCode === 2">
          <el-input v-model="formData.confirmedRemarks" type="textarea"  />
        </el-form-item>
        <el-form-item :label='$t("rechargeRecord.confirmedRemarks2")' prop="confirmedRemarks2" v-if="formData.resCode === 1">
          <el-input v-model="formData.confirmedRemarks2" type="text" />
        </el-form-item>
      </el-form>

      <div v-if="type === 'DETAIL'" style="margin-top: 20px;">
        <div v-if="recordItem.rechargeState === 40">
          <div class="item">
            <!-- 充值时间 -->
            <label>{{$t("rechargeRecord.completeTime")}}：</label>
            <span>{{recordItem.completeTime | parseTime}}</span>
          </div>
          <div class="item">
            <label>{{$t("rechargeRecord.confirmedRemarks2")}}：</label>
            <span>{{recordItem.confirmedRemarks}}</span>
          </div>
        </div>
        <div v-if="recordItem.rechargeState === 30">
          <div class="item">
            <label>{{$t("rechargeRecord.amount")}}：</label>
            <span>{{recordItem.amount}}{{recordItem.currency}}</span>
          </div>
          <div class="item">
            <label>{{$t("rechargeRecord.payTime")}}：</label>
            <span>{{recordItem.rechargeStateName}}</span>
          </div>
          <div class="item">
            <!-- 拒绝时间 -->
            <label>{{$t("rechargeRecord.rejectTime")}}：</label>
            <span>{{recordItem.confirmedTime | parseTime}}</span>
          </div>
          <div class="item">
            <label>{{$t("rechargeRecord.confirmedRemarks1")}}：</label>
            <span>{{recordItem.confirmedRemarks}}</span>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>
<script>
export default {
	name: "RechargeRecordTransInfo",
  props: {
    recordItem: {
      type: Object,
      default: function () {
        return {}
      }
    },
    type: {
      type: String,
      default: ''
    }
  },
	data() {
		return {
      transAmount: 0, // 计算出收款金额
      formData: {
        entryAmount: 0, // 实际充值金额
        clearExchangeRate: null,
        clearExchangeRateDisabled: false,
        handleFee: null,
        resCode: 1,
        confirmedRemarks: '',
        confirmedRemarks2: ''
      },
      formDataRules: {
        resCode: [{ required: true, message: this.$t('common.can_not_be_null'), trigger: 'blur' }],
        clearExchangeRate: [{ required: true, message: this.$t('common.can_not_be_null'), trigger: 'blur' }],
        confirmedRemarks: [{ required: true, message: this.$t('common.can_not_be_null'), trigger: 'blur' }]
      }
		};
	},
	created() {
    if (this.type !== 'DETAIL') {
      let amount = 0
      this.recordItem.claims.forEach(v => {
        amount += v.useAmount
      })
      this.transAmount = amount
      if (this.recordItem.currency === this.recordItem.entryAccountCurrency) {
        this.formData.clearExchangeRate = 1
        this.formData.clearExchangeRateDisabled = true
        this.calcAmount()
      }
    }
	},
	methods: {
    validate() {
      let VALID = true
      // 审核通过
      if (this.formData.resCode === 1) {
        this.$refs.formRef.validate(valid => {
          VALID = valid
        })

        let VALUE_VALID = true
        if (this.recordItem.currency === this.recordItem.entryAccountCurrency) {
          // 同币种比较 实际充值金额 和 申请充值金额对比
          if (this.formData.entryAmount > this.recordItem.amount) {
            VALUE_VALID = false
          }
        } else {
          // 异币种比较 收款金额+手续费 和 申请充值金额对比
          if ((this.transAmount + Number(this.formData.handleFee || 0)).toFixed(2) > this.recordItem.amount) {
            VALUE_VALID = false
          }
        }

        if (!VALUE_VALID) {
          // 实际充值金额不能比申请充值金额大！
          this.$message.error(this.$t("rechargeRecord.entryAmountError"))
          return VALUE_VALID
        }

      } else {
        this.$refs.auditRef.validate(valid => {
          VALID = valid
        })
      }

      return VALID
    },
    getValue() {
      let data = {
        ...this.formData
      }
      if (this.formData.resCode === 1) {
        this.formData.confirmedRemarks = this.formData.confirmedRemarks2
      }
      // if (this.recordItem.currency === this.recordItem.entryAccountCurrency) {
      //   // 同币种比较 实际充值金额 和 申请充值金额对比
      //   if (this.formData.entryAmount === this.recordItem.amount && !this.formData.handleFee) {
      //     this.formData.handleFee = 0
      //   }
      // } else {
      //   // 异币种比较 收款金额+手续费 和 申请充值金额对比
      //   if ((this.transAmount + Number(this.formData.handleFee || 0)).toFixed(2) === this.recordItem.amount) {
      //     this.formData.handleFee = 0
      //   }
      // }
      return this.formData
    },
    calcAmount() {
      if (this.formData.clearExchangeRate) {
        this.formData.entryAmount = ((this.transAmount + Number(this.formData.handleFee || 0)) * Number(this.formData.clearExchangeRate)).toFixed(2)
      }
    }
	}
};
</script>
<style scoped lang="scss">
.supply-container{
  line-height: 28px;
  font-size: 14px;
  color: #777;

  .supply-container-part{
    background: rgb(232,242,252);
    padding: 15px;
    border-radius: 7px;
    .el-row{
      margin-bottom: 10px;
    }
  }
  .center{
    text-align: center;
    font-weight: 600;
    color: #000;
  }
  .blod{
    font-weight: 600;
    color: #000;
  }
  .input-container{
    padding: 15px;
  }
  .fee-info{
    margin-left:20px;
    color: #1890ff;
  }
}

.audit-form{
  padding: 15px;

  ::v-deep .el-form-item--mini .el-form-item__label {
    font-weight: 600!important;
  }
  ::v-deep .el-radio__label{
    font-weight: 600!important;
  }
}
</style>
