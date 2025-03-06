<template>
    <div class="member-item">
      <div class="content">
        <el-form ref="baseForm" :rules="formRule" :model="form" label-width="120px" size="mini">
          <el-row>
            <el-col :span="14">
              <el-form-item :label="$t('contract.bill_base')" prop="billBaseType">
              <el-select v-model="form.billBaseType" key="billBaseType" size="mini" value-key="code" :placeholder="$t('contract.please_select')" @change="billChange" :disabled="isDisabled">
                <el-option v-for="item in billModeList" :key="item.code" :label="item.name" :value="item.code"/>
              </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10"  class="offset">
              <el-form-item label="" prop="billOffset">
              <el-select v-model="form.billOffset" size="mini" :placeholder="$t('contract.please_select')"  :disabled="isDisabled">
                <el-option v-for="item in billOffsetList" :key="item.code" :label="item.name" :value="item.code"/>
              </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 对账日期-->
          <el-row class="el-row">
            <el-col :span="14">
              <el-form-item :label="$t('contract.statement_base')" prop="statementBaseType">
              <el-select v-model="form.statementBaseType" size="mini" :placeholder="$t('contract.please_select')" @change="statementChange"  :disabled="isDisabled">
                <el-option v-for="item in statementModeList" :key="item.code" :label="item.name" :value="item.code"/>
              </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="offset">
              <el-form-item label="" prop="statementOffset" >
                <el-select v-model="form.statementOffset" size="mini" :placeholder="$t('contract.please_select')" :disabled="isDisabled">
                  <el-option v-for="item in statementOffsetList" :key="item.code" :label="item.name" :value="item.code"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="14">
              <el-form-item :label="$t('contract.invoice_base')" prop="invoiceBaseType">
              <el-select v-model="form.invoiceBaseType" size="mini" :placeholder="$t('contract.please_select')" @change="invoiceChange" :disabled="isDisabled">
                <el-option v-for="item in invoiceModeList" :key="item.code" :label="item.name" :value="item.code"/>
              </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="offset">
              <el-form-item label="" prop="invoiceOffset" >
              <el-select v-model="form.invoiceOffset" size="mini" :placeholder="$t('contract.please_select')" :disabled="isDisabled">
                <el-option v-for="item in invoiceOffsetList" :key="item.code" :label="item.name" :value="item.code"/>
              </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="14">
              <el-form-item :label="$t('contract.receipt_base')" prop="receiptBaseType" >
              <el-select v-model="form.receiptBaseType" size="mini" :placeholder="$t('contract.please_select')"  @change="receiptChange" :disabled="isDisabled">
                <el-option v-for="item in receiptModeList" :key="item.code" :label="item.name" :value="item.code"/>
              </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="offset">
              <el-form-item label="" prop="receiptOffset" >
              <el-select v-model="form.receiptOffset" size="mini" :placeholder="$t('contract.please_select')" :disabled="isDisabled">
                <el-option v-for="item in receiptOffsetList" :key="item.code" :label="item.name" :value="item.code"/>
              </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row  v-if="false">
            <el-col :span="14">
              <el-form-item :label="$t('contract.payment_base')" prop="paymentBaseType" >
              <el-select v-model="form.paymentBaseType" size="mini" :placeholder="$t('contract.please_select')"  @change="paymentChange" :disabled="isDisabled">
                <el-option v-for="item in paymentModeList" :key="item.code" :label="item.name" :value="item.code"/>
              </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="offset">
              <el-form-item label="" prop="paymentOffset" >
              <el-select v-model="form.paymentOffset" size="mini" :placeholder="$t('contract.please_select')" :disabled="isDisabled">
                <el-option v-for="item in paymentOffsetList" :key="item.code" :label="item.name" :value="item.code"/>
              </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
  </div>
</template>
<script>
import { getStatementModeApi, getBillModeApi, getInvoiceModeApi, getPayModeApi, getReceiptModeApi, getRechargeModeApi, getBusinessTypeListApi } from "@/api/partner/customerContract";
import { getCurrenciesListApi } from '@/api/common'
import { contractTypeMap } from "@/utils/constant"

export default {
  name: 'AccountPeriodNew',
  props: {
    // 用作新增业务的入口
    isNew: {
      type: Boolean,
      default: false
    },
    defaultPeriod: {
      type: Object,
      default: function () {
        return {}
      }
    },
    business: {
      type: Object,
      default: function () {
        return {}
      }
    },
    contractType: {
      type: [String, Number],
      default: ''
    },
    mainId: {
      type: [String, Number],
      default: ''
    }
  },
  components: {},
  watch: {
    defaultPeriod: {
      handler(val) {
        this.init(val)
      },
      immediate: true
    },
    business: {
      handler(val) {
        this.init(val)
      },
      immediate: true
    },
    contractType: {
      handler() {
        this.setDisabled()
      },
      immediate: true
    },
    mainId: {
      handler() {
        this.setDisabled()
      },
      immediate: true
    }

  },

  data() {
    const validateDepositCurrency = (rule, value, callback) => {
      if (!this.form.deposit.amount || !value) {
        callback(this.$t("contract.cannot_be_null"));
      } else {
        callback();
      }
    };
    const validateBill = (rule, value, callback) => {
      if (!this.form.billOffset || !value) {
        callback(this.$t("contract.cannot_be_null"));
      } else {
        callback();
      }
    };

    const validateStatement = (rule, value, callback) => {
      if (!this.form.statementOffset || !value) {
        callback(this.$t("contract.cannot_be_null"));
      } else {
        callback();
      }
    };

    const validateInvoice = (rule, value, callback) => {
      if (!this.form.invoiceOffset || !value) {
        callback(this.$t("contract.cannot_be_null"));
      } else {
        callback();
      }
    };

    const validateReceipt = (rule, value, callback) => {
      if (!this.form.receiptOffset || !value) {
        callback(this.$t("contract.cannot_be_null"));
      } else {
        callback();
      }
    };

    const validatePayment = (rule, value, callback) => {
      if (!this.form.paymentOffset || !value) {
        callback(this.$t("contract.cannot_be_null"));
      } else {
        callback();
      }
    };

    return {
      isDisabled: false,
      statementModeList: [], // 对账类型
      statementOffsetList: [], // 偏移量
      statementModeMap: {},

      billModeList: [], // 出账类型
      billOffsetList: [], // 偏移量
      billModeMap: {},

      receiptModeList: [], // 收款类型
      receiptOffsetList: [],
      receiptModeMap: {},

      paymentModeList: [], // 付款类型
      paymentOffsetList: [],
      paymentModeMap: {},

      invoiceModeList: [], // 开票类型
      invoiceOffsetList: [],
      invoiceModeMap: {},

      formRule: {
        statementBaseType: [{ required: true, message: this.$t("contract.cannot_be_null")}],
        statementOffset: [{ required: true, message: this.$t("contract.cannot_be_null") }],
        invoiceBaseType: [{ required: true, message: this.$t("contract.cannot_be_null") }],
        invoiceOffset: [{ required: true, message: this.$t("contract.cannot_be_null") }],
        receiptBaseType: [{ required: true, message: this.$t("contract.cannot_be_null") }],
        receiptOffset: [{ required: true, message: this.$t("contract.cannot_be_null") }],
        paymentBaseType: [{ required: true, message: this.$t("contract.cannot_be_null") }],
        paymentOffset: [{ required: true, message: this.$t("contract.cannot_be_null") }],
        billBaseType: [{ required: true, message: this.$t("contract.cannot_be_null") }],
        billOffset: [{ required: true, message: this.$t("contract.cannot_be_null") }]
      },
      form: {
        receiptBaseType: '', // 收款类型
        receiptOffset: '',

        paymentBaseType: '', // 收款类型
        paymentOffset: '',

        billBaseType: '', // 出账类型
        billOffset: '',

        statementBaseType: '', // 对账类型
        statementOffset: '',

        invoiceBaseType: '', // 开票类型
        invoiceOffset: ''
      }
    };
  },
  created() {
    this.getBaseDataFn()
  },
  methods: {
    init(val) {
      let v = val || {}
        this.form = {
          receiptBaseType: v.receiptBaseType || '', // 收款类型
          receiptOffset: v.receiptOffset || '',

          paymentBaseType: v.paymentBaseType || '', // 付款类型
          paymentOffset: v.paymentOffset || '',

          billBaseType: v.billBaseType || '', // 出账类型
          billOffset: v.billOffset || '',

          statementBaseType: v.statementBaseType || '', // 对账类型
          statementOffset: v.statementOffset || '',

          invoiceBaseType: v.invoiceBaseType || '', // 开票类型
          invoiceOffset: v.invoiceOffset || ''
        }
        this.billChange()
        this.statementChange()
        this.invoiceChange()
        this.receiptChange()
    },
    setDisabled() {
      this.isDisabled = this.contractType === contractTypeMap.RECEIPT_TRIAL_CONTRACT ||
        this.contractType === contractTypeMap.RECEIPT_RECEIVE_PIECE_CONTRACT ||
        this.contractType === contractTypeMap.RECEIPT_PAYMENT_PIECE_CONTRACT
    },
    validate() {
      let v = true
      this.$refs.baseForm.validate(valid => {
        v = valid
      })
      if (!v) {
        setTimeout(() => {
          if (this.isNew) {
            this.$message.error(this.$t("contract.account_period_info_must_enter_all"));
          } else {
            this.$message.error(this.$t("contract.account_period_info_must_enter"));
          }
        }, 10)
      }
      return v
    },
    getValue() {
      let data = this.$extends(this.form, {})
      this.invoiceModeList.forEach(v => {
        if (v.code === this.form.invoiceBaseType) {
          data.invoiceBaseTypeName = v.name
        }
        v.children.forEach(x => {
          if (x.code === this.form.invoiceOffset) {
            data.invoiceOffsetTypeName = x.name
          }
        })
      })
      this.receiptModeList.forEach(v => {
        if (v.code === this.form.receiptBaseType) {
          data.receiptBaseTypeName = v.name
        }
        v.children.forEach(x => {
          if (x.code === this.form.receiptOffset) {
            data.receiptOffsetTypeName = x.name
          }
        })
      })
      this.paymentModeList.forEach(v => {
        if (v.code === this.form.paymentBaseType) {
          data.paymentBaseTypeName = v.name
        }
        v.children.forEach(x => {
          if (x.code === this.form.paymentOffset) {
            data.paymentOffsetTypeName = x.name
          }
        })
      })
      this.billModeList.forEach(v => {
        if (v.code === this.form.billBaseType) {
          data.billBaseTypeName = v.name
        }
        v.children.forEach(x => {
          if (x.code === this.form.billOffset) {
            data.billOffsetTypeName = x.name
          }
        })
      })
      this.statementModeList.forEach(v => {
        if (v.code === this.form.statementBaseType) {
          data.statementBaseTypeName = v.name
        }
        v.children.forEach(x => {
          if (x.code === this.form.statementOffset) {
            data.statementOffsetTypeName = x.name
          }
        })
      })
      return data
    },
    getBaseDataFn() {
      Promise.all([getStatementModeApi(), getBillModeApi(), getInvoiceModeApi(), getPayModeApi(),
      getReceiptModeApi(), getRechargeModeApi(), getCurrenciesListApi(), getBusinessTypeListApi()]).then(results => {
        const statementModeRes = results[0];
        const billModeRes = results[1];
        const invoiceModeRes = results[2]
        const paymentModeRes = results[3]
        const receiptModeRes = results[4]
        if (statementModeRes.ok) {
          this.statementModeList = statementModeRes.content || []
          this.statementModeList.forEach(x => {
            this.statementModeMap[x.code] = x.children
          })
        }
        if (billModeRes.ok) {
          this.billModeList = billModeRes.content || []
          this.billModeList.forEach(x => {
            this.billModeMap[x.code] = x.children
          })
        }
        if (invoiceModeRes.ok) {
          this.invoiceModeList = invoiceModeRes.content || []
          this.invoiceModeList.forEach(x => {
            this.invoiceModeMap[x.code] = x.children
          })
        }

        if (paymentModeRes.ok) {
          this.paymentModeList = paymentModeRes.content || []
          this.paymentModeList.forEach(x => {
            this.paymentModeMap[x.code] = x.children
          })
        }

        if (receiptModeRes.ok) {
          this.receiptModeList = receiptModeRes.content || []
          this.receiptModeList.forEach(x => {
            this.receiptModeMap[x.code] = x.children
          })
        }
        this.billChange()
        this.statementChange()
        this.invoiceChange()
        this.receiptChange()
        this.paymentChange()
      });
    },
    billChange() {
      this.billOffset = ''
      this.billOffsetList = this.billModeMap[this.form.billBaseType] || []
    },
    statementChange() {
      this.statementOffset = ''
      this.statementOffsetList = this.statementModeMap[this.form.statementBaseType] || []
    },
    invoiceChange() {
      this.invoiceOffset = ''
      this.invoiceOffsetList = this.invoiceModeMap[this.form.invoiceBaseType] || []
    },
    receiptChange() {
      this.receiptOffset = ''
      this.receiptOffsetList = this.receiptModeMap[this.form.receiptBaseType] || []
    },
    paymentChange() {
      this.paymentOffset = ''
      this.paymentOffsetList = this.paymentModeMap[this.form.paymentBaseType] || []
    }
  }
};
</script>
<style scoped lang="scss">
.el-form-item {
  width: 50%;
  float: left;
}
.el-row{
  width: 50%; float: left;
  ::v-deep .el-form-item{width: 100%!important;}
  .offset{
    ::v-deep{
      .el-form-item__content{ margin-left: 0 !important;}
    }
  }

}
</style>
