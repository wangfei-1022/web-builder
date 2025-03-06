<template>
  <div>
    <el-dialog :title="$t('fmsPayablePayment.confirmPay')" :visible.sync="visible"  width="1000px" :close-on-click-modal="false">
      <div v-show="step === 1">
        <el-table ref="tableRef" :data="unClearTotalAmounts" border style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column key="selection" type="selection" width="55"> </el-table-column>
          <el-table-column prop="currency1" :label="$t('fmsPayablePayment.paidSourceAmount')" min-width="120">
            <template slot-scope="{ row }">
              <div v-for="(item, index) in row.sourceAmountsAll" :key="index">{{item.currency}}&nbsp;{{item.value | numberToThousands}}</div>
            </template>
          </el-table-column>
          <el-table-column key="sourceCurrency" prop="sourceCurrency" :label="$t('fmsPayablePayment.unPayCurrency')" min-width="140"></el-table-column>
          <el-table-column key="sourceValue" prop="sourceValue" :label="$t('fmsPayablePayment.unPayAmount')" min-width="140">
            <template slot-scope="{ row }">
              <span>{{row.sourceValue | numberToThousands}}</span>
            </template>
          </el-table-column>
          <el-table-column key="exchangeRate" prop="exchangeRate" :label="$t('fmsPayablePayment.exchangeRate')" min-width="140" v-if="transForm.isMerge">
            <template slot-scope="{ row }">
              <el-input v-model="row.exchangeRate" @change="amountChange(row)" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column key="paidAmount" prop="paidAmount" :label="$t('fmsPayablePayment.payableAmountCurrent')" min-width="140" v-if="transForm.isMerge && false" >
             <template slot-scope="{ row }">
              <span>{{row.paidAmount | numberToThousands}}</span>
            </template>
          </el-table-column>
        </el-table>

        <div v-show="multipleSelection.length > 1" class="merge-container">
          <el-form ref="transFormRef" :model="transForm" :rules="transFormRules" label-width="00px" size="mini" inline label-position="right">
            <el-form-item label="" prop="isMerge">
              <!-- 合并支付 -->
              <el-checkbox v-model="transForm.isMerge" @change="mergeChange">{{$t('fmsPayablePayment.mergePay')}}</el-checkbox>
            </el-form-item>
            <el-form-item :label="$t('fmsPayablePayment.targetCurrency')" prop="targetCurrency" label-width="80px"  v-show="transForm.isMerge">
              <base-select type="currency" v-model="transForm.targetCurrency" />
            </el-form-item>
          </el-form>
        </div>

      </div>
      <div v-show="step === 2">
        <el-table :data="payInfoList" border style="width: 100%">
          <el-table-column prop="currency1" :label="$t('fmsPayablePayment.paidSourceAmount')" min-width="120">
            <template slot-scope="{ row }">
              <div v-for="(item, index) in row.sourceAmountsAll" :key="index">{{item.currency}}&nbsp;{{item.value | numberToThousands}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="value2" :label="$t('fmsPayablePayment.unPaySourceAmount')" min-width="120">
            <template slot-scope="{ row }">
              <div v-for="(item, index) in row.sourceAmounts" :key="index">{{item.sourceCurrency}}&nbsp;{{item.sourceValue | numberToThousands}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="payableAmountALL" :label="$t('fmsPayablePayment.payableAmountCurrent')" min-width="120" v-if="transForm.isMerge">
            <template slot-scope="{ row }">
              <el-input :value="formatNumberToThousands(row.payableAmountALL)" size="mini" disabled></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="paidAmount" :label="$t('fmsPayablePayment.paidAmount')" min-width="120">
            <template slot-scope="{ row }">
              <el-input v-model="row.paidAmount" size="mini" :disabled="transForm.isMerge" oninput="value=value.replace(/[^\d\.]/g,'')"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="paidTime" :label="$t('fmsPayablePayment.paidTime')" min-width="140">
            <template slot-scope="{ row }">
              <common-picker v-model="row.paidTime" pikcer-type="date" pickerFormat="yyyy-MM-dd" size="mini" />
            </template>
          </el-table-column>
          <el-table-column prop="paidFiles" :label="$t('fmsPayablePayment.paidFiles')" min-width="140">
            <template slot-scope="{ row }">
              <attach-sreenshot v-model="row.paidFiles" />
            </template>
          </el-table-column>
          <el-table-column prop="remarks" :label="$t('fmsPayablePayment.paidRemarks')" min-width="140">
            <template slot-scope="{ row }">
              <el-input v-model="row.remarks" size="mini"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false" size="mini">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="nextFn" size="mini" v-if="step === 1">{{$t('common.nextStep')}}</el-button>
        <el-button type="primary" @click="preFn" size="mini" v-if="step === 2">{{$t('common.previousStep')}}</el-button>
        <el-button type="primary" @click="submitPaymentFn" :loading="submitLoading" v-if="step === 2" size="mini">{{$t('common.confirm')}}</el-button>
      </span>
    </el-dialog>

    <payment-clear-reason-modal ref="paymentClearReasonModal" @ok="submitPayment"/>
  </div>
</template>
<script>
import { getPayablePaymentDetailApi, paymentFinishApi, paymentRejectApi } from "@/api/financial/fmsPayablePayment";
import { formatNumberToThousands } from "@/utils/index";
import PaymentClearReasonModal from './PaymentClearReasonModal'

export default {
	name: "PayDialog",
  components: {
    PaymentClearReasonModal
  },
	props: {
		detail: {
			type: Object,
			default: function () {
				return {};
			}
		}
	},
	data() {
		return {
      id: '',
      step: 1,
      payInfoList: [],
      visible: false,
      submitLoading: false,
      applyAmounts: [],
      unClearTotalAmounts: [],
      transForm: {
        isMerge: false,
        targetCurrency: ''
      },
      transFormRules: {
        targetCurrency: [{ required: true, message: this.$t('common.can_not_be_null'), trigger: 'blur' }]
      },
      multipleSelection: []
		};
	},
	beforeUpdate() {
    this.$nextTick(() => {
      this.$refs.tableRef && this.$refs.tableRef.doLayout()
    })
	},
	methods: {
    formatNumberToThousands(val) {
      return formatNumberToThousands(val)
    },
    show(id, unClearTotalAmounts, applyAmounts) {
      this.step = 1
      this.id = id
      this.visible = true
      this.transForm = {
        isMerge: false,
        targetCurrency: ''
      }
      let arr = []
      unClearTotalAmounts.forEach(v => {
        let obj = {
          ...v
        }
        obj.sourceAmountsAll = []
        // 寻找应付原币金额
        let itemIndex = applyAmounts.findIndex(item => item.currency === obj.currency)
        let itemO = applyAmounts[itemIndex]
        obj.sourceAmountsAll.push({
          currency: itemO.currency,
          value: itemO.value
        })
        obj.sourceValue = v.value
        obj.targetValue = v.value
        obj.sourceCurrency = v.currency
        obj.targetCurrency = v.currency
        obj.exchangeRate = 1
        obj.paidAmount = ''
        arr.push(obj)
      })
      this.applyAmounts = applyAmounts
      this.unClearTotalAmounts = arr
      this.$nextTick(() => {
        this.unClearTotalAmounts.forEach(row => {
          this.$refs.tableRef.toggleRowSelection(row);
        });
      })
    },
    amountChange(row) {
      if (row.sourceValue && row.exchangeRate) {
        row.paidAmount = (Number(row.sourceValue) * Number(row.exchangeRate)).toFixed(2)
      }
    },
    mergeChange() {
      if (this.transForm.isMerge) {
        this.unClearTotalAmounts.forEach(v => {
          v.exchangeRate = 1
          v.paidAmount = Number(v.exchangeRate) * Number(v.sourceValue)
        })
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    nextFn() {
      let payInfoList = []
      this.payInfoList = []
      let VALID = true
      if (this.multipleSelection.length === 0) {
        // 请先选择一行付款
        this.$message.error(this.$t('fmsPayablePayment.payError5'))
        return false
      }
      let paidTime = new Date().getTime() // ESIT-20922 默认当天
      if (this.transForm.isMerge) {
        if (!this.transForm.targetCurrency) {
          // 请先选择目标币种
          this.$message.error(this.$t('fmsPayablePayment.payError1'))
          return false
        }
        let obj = {
          sourceAmountsAll: [],
          sourceAmounts: [],
          payableAmountALL: 0,
          paidCurrency: this.transForm.targetCurrency,
          paidAmount: 0,
          paidTime: paidTime,
          remarks: '',
          paidFiles: []
        }
        let sourceAmountsAll = []
        this.multipleSelection.forEach(v => {
          if (!v.exchangeRate) {
            VALID = false
          }
          let itemIndex = this.applyAmounts.findIndex(item => item.currency === v.currency)
          sourceAmountsAll.push(this.applyAmounts[itemIndex])
          obj.sourceAmounts.push({
            sourceCurrency: v.sourceCurrency,
            sourceValue: v.sourceValue,
            exchangeRate: v.exchangeRate,
            targetCurrency: this.transForm.targetCurrency,
            targetValue: v.targetValue
          })
          obj.payableAmountALL += Number(v.sourceValue) * Number(v.exchangeRate)
        })
        obj.sourceAmountsAll = sourceAmountsAll
        obj.payableAmountALL = Number(obj.payableAmountALL).toFixed(2)
        obj.paidAmount = obj.payableAmountALL

        if (!VALID) {
          // '请填写勾选记录的本次原币应付金额和汇率!'
          this.$message.error(this.$t('fmsPayablePayment.payError2'))
          return false
        }
        payInfoList.push(obj)
      } else {
        this.multipleSelection.forEach(v => {
          // 寻找应付原币金额
          let itemIndex = this.applyAmounts.findIndex(item => item.currency === v.currency)
          let itemO = this.applyAmounts[itemIndex]
          payInfoList.push({
            sourceAmountsAll: [{
              currency: itemO.currency,
              value: itemO.value
            }],
            sourceAmounts: [{
              sourceCurrency: v.currency,
              sourceValue: v.sourceValue,
              exchangeRate: v.exchangeRate,
              targetCurrency: v.targetCurrency,
              targetValue: v.targetValue
            }],
            payableAmountALL: v.sourceValue, // 用来统一做对比实付金额判断
            paidCurrency: v.currency,
            paidAmount: v.sourceValue,
            paidTime: paidTime,
            remarks: '',
            paidFiles: []
          })
        })
        if (!VALID) {
          // 请填写勾选记录的本次原币应付金额
          this.$message.error(this.$t('fmsPayablePayment.payError3'))
          return false
        }
      }

      this.step = 2
      this.$nextTick(() => {
        this.payInfoList = payInfoList
      })
    },
    preFn() {
      this.step = 1
    },
    submitPayment(reasonMap) {
      // payInfoList 有可能是当前的  也能可能是填写原因后 回填组装的
      let payInfoList = this.payInfoList
      if (reasonMap) {
        this.payInfoList.forEach(v => {
          let reasonTarget = reasonMap[v.paidCurrency]
          if (reasonTarget) {
            // 核销大于付款
            if (reasonTarget.isClearMany) {
              v.payUnderReason = reasonTarget.reason
            } else {
              v.payOverReason = reasonTarget.reason
            }
            v.payDiffRemark = reasonTarget.remark
          }
        })
      }
      let data = {
        instructionId: this.id,
        payInfos: payInfoList
      }
      this.submitLoading = true
      paymentFinishApi(data).then(res => {
        if (res.ok) {
          // 确认付款成功
          this.$message.success(this.$t('fmsPayablePayment.paySuccess'))
          this.visible = false
          this.$emit('backList', true)
        }
        this.submitLoading = false
      })
    },
    submitPaymentFn() {
      let VALID = true
      this.payInfoList.forEach(v => {
        if (!v.paidAmount || !v.paidTime) {
          VALID = false
        }
      })
      if (!VALID) {
        // '请填写本次应付金额和实际付款时间!'
        this.$message.error(this.$t('fmsPayablePayment.payError4'))
        return false
      }

      // 存在不相同的则需要弹窗
      let diffList = []
      for (let index = 0, len = this.payInfoList.length; index < len; index++) {
        const v = this.payInfoList[index];
        // 实付不等于待付
        if (Number(v.payableAmountALL) !== Number(v.paidAmount)) {
          diffList.push({
            currency: v.paidCurrency,
            isClearMany: Number(v.payableAmountALL) > Number(v.paidAmount)
          })
        }
      }

      if (diffList.length) {
        this.$refs.paymentClearReasonModal.show(diffList)
        return false
      }

      // 不弹原因则 继续提交 当前的数据
      this.submitPayment()
		}
	}
};
</script>
<style lang="scss" scoped>
.merge-container{
  padding-top: 25px;
  padding-left: 11px;
}
</style>

