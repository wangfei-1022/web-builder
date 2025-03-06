<template>
  <div style="position: relative;">
    <div style="margin-bottom: 10px;" :class="contactAbsolute ? 'contact-absolute' : ''"  v-if="payContracts.length || testContracts.length">
      关联合同：
      <span v-if="payContracts.length">
        付款
        <span class="link" v-for="(item, index) in payContracts" :key="index" @click="contractDetailFn(item)">{{item.contractNo}}</span>
      </span>
      <span v-if="testContracts.length">
        试单
        <span class="link" v-for="(item, index) in testContracts" :key="index" @click="contractDetailFn(item)">{{item.contractNo}}</span>
      </span>
    </div>
    <div class="total-container">
      <div class="total-item">
        <!-- 应收账款 -->
        <span class="item-title">{{$t("payableFms.arTotalList")}}：</span>
        <span v-if="arTotalList && arTotalList.length > 0">
          <span v-for="(item, index) in arTotalList" :key="index">
            {{item.currency}} {{item.value | numberToThousands}}
          </span>
        </span>
        <span v-else>暂无</span>
      </div>
      <div class="total-item">
        <!-- 利润合计 -->
        <span class="item-title">{{$t("payableFms.profitList")}}：</span>
        <span v-for="(item, index) in profitList" :key="index">
          {{item.currency}} {{item.value | numberToThousands}}
        </span>
      </div>
      <div class="total-item">
        <!-- 未收账款 -->
        <span class="item-title">{{$t("payableFms.arUnclearTotalList")}}：</span>
        <span v-if="arUnclearTotalList && arUnclearTotalList.length > 0">
          <span v-for="(item, index) in arUnclearTotalList" :key="index">
            {{item.currency}} {{item.value | numberToThousands}}
          </span>
        </span>
        <span v-else>暂无</span>
      </div>
      <div class="total-item">
        <!-- 利润人民币合计 -->
        <span class="item-title">{{$t("payableFms.profitCnyList")}}：</span>
        <span v-for="(item, index) in profitCnyList" :key="index">
          {{item.currency}} {{item.value | numberToThousands}}
        </span>
      </div>
    </div>

    <div class="sp-info" v-if="errorList.length > 0">
      <div><i class="el-icon-warning-outline" style="color: red;margin-right: 5px;font-weight: 700;font-size: 16px;"/>以下情况需要追加分管领导审批</div>
      
      <div style="margin-top: 7px;padding-left: 18px;color: red;">
        <span v-for="(item, index) in errorList" :key="index">
          {{index + 1}}.
          {{item.msg}}
          <el-tooltip class="item" placement="bottom" effect="blue" :visible-arrow="false" popper-class="tooltip-width" v-if="item.code === 3">
            <div slot="content">
              <div class="total-container-nr">
                <div class="total-item">
                  <!-- 已收账款原币 -->
                  <span class="item-title">{{$t("payableFms.arClearedAmounts")}}：</span>
                  <span v-if="approvalAmountInfo.arClearedAmounts && approvalAmountInfo.arClearedAmounts.length">
                    <span v-for="(item, index) in approvalAmountInfo.arClearedAmounts" :key="index">
                      {{item.currency}} {{item.value | numberToThousands}}
                    </span>
                  </span>
                  <span v-else>暂无</span>
                </div>
                <div class="total-item">
                  <!-- 已收账款本位币 -->
                  <span class="item-title">{{$t("payableFms.arClearedStandardAmount")}}：</span>
                  <span v-if="approvalAmountInfo.arClearedStandardAmount && approvalAmountInfo.arClearedStandardAmount.length">
                    <span v-for="(item, index) in approvalAmountInfo.arClearedStandardAmount" :key="index">
                      {{item.currency}} {{item.value | numberToThousands}}
                    </span>
                  </span>
                  <span v-else>暂无</span>
                </div>
                <div class="total-item">
                  <!-- 申请付款原币 -->
                  <span class="item-title">{{$t("payableFms.apApplyAmounts")}}：</span>
                  <span v-for="(item, index) in approvalAmountInfo.apApplyAmounts" :key="index">
                    {{item.currency}} {{item.value | numberToThousands}}
                  </span>
                </div>
                <div class="total-item">
                  <!-- 申请付款本位币 -->
                  <span class="item-title">{{$t("payableFms.apApplyStandardAmount")}}：</span>
                  <span v-for="(item, index) in approvalAmountInfo.apApplyStandardAmount" :key="index">
                    {{item.currency}} {{item.value | numberToThousands}}
                  </span>
                </div>
              </div>
            </div>
            <i class="el-icon-warning-outline" />
          </el-tooltip>
        </span>
      </div>

    </div>
  </div>
</template>
<script>
import { 
  orderTotalByInstructionApi, 
  orderTotalByChargesApi, 
  orderTotalByConfirmationsApi, 
  orderTotalByBillsApi,
  getSpecialInfoByChargesApi,
  getSpecialInfoByConfirmationsApi,
  getSpecialInfoByBillsApi
  } from '@/api/financial/base'

export default {
	name: "PayableOrderChargeTotal",
	props: {
    contactAbsolute: {
			type: Boolean,
			default: true
		},
		instructionId: {
			type: String,
			default: ''
		},
    origin: {
			type: String,
			default: ''
		},
    ids: {
			type: Array,
			default: function() {
        return []
      }
		},
        applyCopyInfo: {
			type: Object,
			default: function() {
            return {
                ids: []
            }
            }
      },
    approvalSpecialInfo: {
			type: Object,
			default: function() {
        return {}
      }
		}
	},
	data() {
		return {
      arTotalList: [],
      arUnclearTotalList: [],
      profitList: [],
      profitCnyList: [],
      errorList: [],
      payContracts: [],
      testContracts: [],
      approvalAmountInfo: {
        apApplyAmounts: [],
        apApplyStandardAmount: [],
        arClearedAmounts: [],
        arClearedStandardAmount: []
      }
		}
	},
	created() {
	    this.init()
	},
	methods: {
		init() {
      // 详情入口
      if(this.instructionId) {
        let data = { instructionId: this.instructionId }
        orderTotalByInstructionApi(data).then(res => {
          if(res.ok) {
            this.formatData(res.content)
          }     
        })
        this.formatSpData(this.approvalSpecialInfo)
      }
      // 申请入口
      let ids = (this.applyCopyInfo.ids && this.applyCopyInfo.ids.length > 0) ? this.applyCopyInfo.ids : []
      if(ids.length === 0) {
        ids = this.ids.length >= 0 ?  this.ids : []
      }
      if(ids.length) {
        let orderfn = null
        let getInfoFn = null
        if (this.origin === 'CHARGE' || this.applyCopyInfo.origin === 'CHARGE') {
          orderfn = orderTotalByChargesApi
          getInfoFn = getSpecialInfoByChargesApi
        } else if (this.origin === 'CONFIRMATION') {
          orderfn = orderTotalByConfirmationsApi
          getInfoFn = getSpecialInfoByConfirmationsApi
        } else if (this.origin === 'BILL' || this.applyCopyInfo.origin === 'BILL') {
          orderfn = orderTotalByBillsApi
          getInfoFn = getSpecialInfoByBillsApi
        }
        if(orderfn) {
          orderfn(ids).then(res => {
            if(res.ok) {
              this.formatData(res.content)
            }
          })
        }
        if (getInfoFn) {
          getInfoFn(ids).then(res => {
            if(res.ok) {
              this.formatSpData(res.content)
            }
          })
        }
      }
		},
    contractDetailFn(row) {
      this.$router.push({
        name: 'CRMContractSupplierPaymentDetail',
        query: {
          id: row.contractId,
          contractType: row.contractType,
          type: "SUPPLIER",
          role: "PRODUCT"
        }
      })
    },
    formatData(list) {
      /*
      * 付款申请-应收账款 INSTRUCTION_ORDER_AR_TOTAL
      * 付款申请-未收账款（未销部分） INSTRUCTION_ORDER_AR_UNCLEAR_TOTAL 
      * 付款申请-利润合计 INSTRUCTION_ORDER_PROFIT_TOTAL 
      * 付款申请-利润CNY合计 INSTRUCTION_ORDER_PROFIT_CNY_TOTAL
      */
      list.forEach(v => {
        if(v.amountName === 'INSTRUCTION_ORDER_AR_TOTAL') {
          this.arTotalList = v.amounts || []
        }
        if(v.amountName === 'INSTRUCTION_ORDER_AR_UNCLEAR_TOTAL') {
          this.arUnclearTotalList = v.amounts || []
        }
        if(v.amountName === 'INSTRUCTION_ORDER_PROFIT_TOTAL') {
          this.profitList = v.amounts || []
        }
        if(v.amountName === 'INSTRUCTION_ORDER_PROFIT_CNY_TOTAL') {
          this.profitCnyList = v.amounts || []
        }
      })
    },
    formatSpData(detail) {
      if (!detail) {
        return
      }
      let payContracts = []
      let testContracts = []
      if(detail.approvalContractInfo && detail.approvalContractInfo.contracts) {
        detail.approvalContractInfo.contracts.forEach(v => {
          if(v.contractType === 2) {
            payContracts.push(v)
          }
          if(v.contractType === 20) {
            testContracts.push(v)
          }
        })
      }
      this.payContracts = payContracts
      this.testContracts = testContracts

      let errorList = []
      if(detail.existsInformalContractsFlag) {
        errorList.push({
          code: 1,
          msg: "关联合同存在非正式付款合同"
        })
      }
      if(detail.existsProfitAmountNegativeFlag) {
        errorList.push({
          code: 2,
          msg: "提交申请时毛利本位币金额为负"
        })
      }
      if(detail.existsArClearedAmountLessThenApApplyAmountFlag) {
        errorList.push({
          code: 3,
          msg: "已收账款本位币金额小于申请付款本位币金额"
        })
      }
      this.errorList = errorList
      if(detail.approvalAmountInfo) {
        let apApplyStandardAmount = detail.approvalAmountInfo.apApplyStandardAmount ? [detail.approvalAmountInfo.apApplyStandardAmount] : []
        let arClearedStandardAmount = detail.approvalAmountInfo.arClearedStandardAmount ? [detail.approvalAmountInfo.arClearedStandardAmount] : []
        this.approvalAmountInfo = {
          apApplyAmounts: detail.approvalAmountInfo.apApplyAmounts,
          apApplyStandardAmount: apApplyStandardAmount,
          arClearedAmounts: detail.approvalAmountInfo.arClearedAmounts,
          arClearedStandardAmount: arClearedStandardAmount,
        }
      }
    }
	}
}
</script>
<style lang="scss" scoped>
.contact-absolute {
  margin-bottom: 10px;
  position: absolute;
  top: -50px;
  right: 0;
}

.total-container{
  overflow: hidden;
  color: rgb(24, 144, 255);
  font-weight: 600;
  background: #f0f2f5;
  padding: 10px 0;
  font-size: 15px;

  .total-item {
    width: 50%;
    float: left;
    line-height: 28px;

    .item-title{
      width: 120px;
      text-align: right;
      display: inline-block;
    }
  }
}
.total-container-nr {
  overflow: hidden;
  color: white;
  font-weight: 600;
  font-size: 13px;

  .total-item {
    width: 50%;
    float: left;
    line-height: 28px;

    .item-title{
      width: 120px;
      text-align: right;
      display: inline-block;
    }
  }
}
.sp-info {
  padding: 10px;
  background: rgb(255,242,241);
  margin-top: 10px;
  border: 1px solid red;
  border-radius: 5px;
  font-size: 12px;
  color: #777;
}
</style>

