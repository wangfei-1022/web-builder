<template>
	<div class="page-edit-container full-page">
		<div class="page-edit-content">
       <el-tabs v-model="activeName">
          <!--核销详情/申请详情-->
          <el-tab-pane :label="totalDataObject.clearNo ? $t('fmsReceiveClear.clearDetail') : $t('fmsReceiveClear.applyDetail')" name="first">
            <div class="section clear-title" style="margin-bottom:0" v-if="operation === 'DETAIL'">
              <div v-if="totalDataObject.instructionState === 3" class="title">
                <span>
                  <!--申请核销编号-->
                  {{ $t('fmsReceiveClear.instructionNo')}}
                </span>
                <span style="margin-left: 15px;">{{totalDataObject.instructionNo}}</span>
                <svg-icon className="clear-img" iconClass="icon-yichehui-huise" />
                <span class="no-transactions" v-if="totalDataObject.instructionState === 5 || totalDataObject.instructionState === 6">无收款</span>
              </div>
              <div v-else-if="totalDataObject.clearNo" class="title">
                <span>
                  <!--核销编号-->
                  {{ $t('fmsReceiveClear.clearNo')}}
                </span>
                <span style="margin-left: 15px;">{{totalDataObject.clearNo}}</span>
                <svg-icon className="clear-img" iconClass="icon-yihexiao" />
                <span class="no-transactions" v-if="totalDataObject.instructionState === 5 || totalDataObject.instructionState === 6">无收款</span>
              </div>
              <div v-else-if="!totalDataObject.clearNo" class="title">
                <span>
                  <!--申请核销编号-->
                  {{ $t('fmsReceiveClear.instructionNo')}}
                </span>
                <span style="margin-left: 15px;">{{totalDataObject.instructionNo}}</span>
                <svg-icon className="clear-img" iconClass="icon-weihexiao" />
                <span class="no-transactions" v-if="totalDataObject.instructionState === 5 || totalDataObject.instructionState === 6">无收款</span>
              </div>
            </div>

            <div class="clear-detail-container">
              <div class="section origin-container">
                <div class="title">
                  <span class="title-item-des">
                    <svg-icon className="clear-module-icon" iconClass="icon-yingshouweixiao" />
                      <!--应收未销合计-->
                      {{$t('fmsReceiveClear.receiptClearAll')}}
                  </span>
                  <div class="currency-value-des">
                    <span v-for="(item, index) in totalDataObject.arClearingInfo.unInstructionAmounts" :key="index">
                      <span class="currency-value-item">{{item.currency}} {{item.value | numberToThousands}}</span>
                    </span>
                  </div>
                </div>
                <div class="section-content" v-if="totalDataObject.arClearingInfo.bills.length || totalDataObject.arClearingInfo.invoices.length">
                  <el-table :data="totalDataObject.arClearingInfo.invoices" v-if="totalDataObject.arClearingInfo.invoices.length" style="width: 100%" border>
                    <el-table-column prop="invoiceNo" :label="$t('fmsReceiveClear.invoiceNo')"></el-table-column>
                    <el-table-column prop="businessTypeNames" :label="$t('fmsReceiveClear.businessTypeName')">
                      <template slot-scope="{row}">
                        <span>{{row.businessTypeNames.join('、')}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="settlementCompanyName" :label="$t('fmsReceiveClear.settlementCompanyName')">
                      <template>
                        <span>{{totalDataObject.settlementCompanyName}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="invoiceTotalAmounts" :label="$t('fmsReceiveClear.currencyAmount')" align="right">
                      <template slot-scope="{row}">
                        <span v-for="(item, index) in row.invoiceTotalAmounts" :key="index">
                          <span>{{item.currency}}</span>
                          <span style="margin-right:10px">{{item.value | numberToThousands}}</span>
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="clearTotalAmounts" :label="$t('fmsReceiveClear.current_apply_currency_value')" align="right">
                      <template slot-scope="{row}">
                        <span v-for="(item, index) in row.clearTotalAmounts" :key="index">
                          <span>{{item.currency}}</span>
                          <span style="margin-right:10px">{{item.value | numberToThousands}}</span>
                        </span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table :data="totalDataObject.arClearingInfo.bills" v-if="totalDataObject.arClearingInfo.bills.length" style="width: 100%" border>
                    <el-table-column prop="billNo" :label="$t('fmsReceiveClear.billNo')"></el-table-column>
                    <el-table-column prop="businessTypeName" :label="$t('fmsReceiveClear.businessTypeName')"></el-table-column>
                    <el-table-column prop="settlementCompanyName" :label="$t('fmsReceiveClear.settlementCompanyName')">
                      <template>
                        <span>{{totalDataObject.settlementCompanyName}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="billTotalAmounts" :label="$t('fmsReceiveClear.currencyAmount')" align="right">
                      <template slot-scope="{row}">
                        <span v-for="(item, index) in row.billTotalAmounts" :key="index">
                          <span>{{item.currency}}</span>
                          <span style="margin-right:10px">{{item.value | numberToThousands}}</span>
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="clearTotalAmounts" :label="$t('fmsReceiveClear.current_apply_currency_value')" align="right">
                      <template slot-scope="{row}">
                        <span v-for="(item, index) in row.clearTotalAmounts" :key="index">
                          <span>{{item.currency}}</span>
                          <span style="margin-right:10px">{{item.value | numberToThousands}}</span>
                        </span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>

              <div class="section origin-container">
                <div class="title">
                  <span class="title-item-des">
                    <svg-icon className="clear-module-icon" iconClass="icon-yingfuweixiao" />
                    <!--应付未销合计-->
                    {{$t('fmsReceiveClear.payableClearAll')}}
                  </span>
                  <div class="currency-value-des">
                    <span v-for="(item, index) in totalDataObject.apClearingInfo.unInstructionAmounts" :key="index">
                      <span class="currency-value-item">{{item.currency}} {{item.value | numberToThousands}}</span>
                    </span>
                  </div>
                </div>
                <div class="section-content" v-if="totalDataObject.apClearingInfo.bills.length">
                  <el-table :data="totalDataObject.apClearingInfo.bills" style="width: 100%" border>
                    <el-table-column prop="billNo" :label="$t('fmsReceiveClear.billNo')"></el-table-column>
                    <el-table-column prop="businessTypeName" :label="$t('fmsReceiveClear.businessTypeName')"></el-table-column>
                    <el-table-column prop="settlementCompanyName" :label="$t('fmsReceiveClear.settlementCompanyName')">
                      <template>
                        <span>{{totalDataObject.settlementCompanyName}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="billTotalAmounts" :label="$t('fmsReceiveClear.currencyAmount')" align="right">
                      <template slot-scope="{row}">
                        <span v-for="(item, index) in row.billTotalAmounts" :key="index">
                          <span>{{item.currency}}</span>
                          <span style="margin-right:10px">{{item.value | numberToThousands}}</span>
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="clearTotalAmounts" :label="$t('fmsReceiveClear.current_apply_currency_value')" align="right">
                      <template slot-scope="{row}">
                        <span v-for="(item, index) in row.clearTotalAmounts" :key="index">
                          <span>{{item.currency}}</span>
                          <span style="margin-right:10px">{{item.value | numberToThousands}}</span>
                        </span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>

              <div class="section offset-container">
                <div class="title">
                  <div class="title-item">
                    <span class="title-item-des">
                      <svg-icon className="clear-module-icon" iconClass="icon-yingshouchongyingfu" />
                        <!--对冲详情-->
                        {{$t('fmsReceiveClear.offsetDetail')}}
                    </span>
                  </div>
                </div>
                <div class="section-content ">
                  <div class="same-curreny" v-if="totalDataObject.sameOffsetAmounts.length">
                    <div class="name link">
                      <!--同币对冲-->
                      {{$t('fmsReceiveClear.sameCurrencyOffset')}}
                    </div>
                    <div class="currency-value">
                      <span v-for="(item, index) in totalDataObject.sameOffsetAmounts" :key="index">
                        <span style="margin-left: 10px">{{item.currency}} {{item.value | numberToThousands}}</span>
                      </span>
                    </div>
                  </div>
                  <div class="text-container diff-curreny" v-if="totalDataObject.arOffsetAmounts.length > 0 || totalDataObject.apOffsetAmounts.length > 0">
                    <div class="name link" style="margin-bottom: 20px">
                      <!--异币对冲-->
                      {{$t('fmsReceiveClear.differentCurrencyOffset')}}
                    </div>
                    <div v-if="totalDataObject.arOffsetAmounts.length > 0" class="amount-container">
                      <el-row v-for="(item, index) in totalDataObject.arOffsetAmounts" :key="index + 'AR'" class="amount-row">
                        <el-col :span="4">
                          <div>
                            <span v-if="index === 0">
                              <!--应收-->
                              {{$t('fmsReceiveClear.AR')}}
                            </span>
                            <span v-else>&nbsp;&nbsp;</span>
                          </div>
                        </el-col>
                        <el-col :span="16" class="currency-value">
                          <span class="currency">{{item.currency}}</span>
                          <span class="value">{{item.value | numberToThousands}}</span>
                          <span class="symbol">x</span>
                          <span class="input">
                            <el-input v-model="item.exchangeRate" size="mini" disabled style="width:100px" />
                          </span>
                        </el-col>
                        <el-col :span="4" class="calc-total">
                          <div>
                            <span class="symbol">=</span>
                            <span class="total-transfer">{{item.calcTransferTotal | numberToThousands}}</span>
                          </div>
                        </el-col>
                      </el-row>
                      <el-row class="amount-row amount-total">
                        <el-col :span="20" class="total-currency">
                          <div class="link">
                            <span>
                              <!--应收合计-->
                              {{$t('fmsReceiveClear.AR_TOTAL')}}
                            </span>
                            <span>{{totalDataObject.diffOffsetCurrency}}</span>
                          </div>
                        </el-col>
                        <el-col :span="4" class="calc-total">
                          <div>
                            <span class="symbol">=</span>
                            <span class="total-transfer">{{totalDataObject.calcArOffsetAmountsTotal | numberToThousands}}</span>
                          </div>
                        </el-col>
                      </el-row>
                    </div>

                    <div v-if="totalDataObject.apOffsetAmounts.length > 0" class="amount-container">
                      <el-row v-for="(item, index) in totalDataObject.apOffsetAmounts" :key="index + 'AP'" class="amount-row">
                        <el-col :span="4">
                          <div>
                            <span v-if="index === 0">
                              <!--应付-->
                              {{$t('fmsReceiveClear.AP')}}
                            </span>
                            <span v-else>&nbsp;&nbsp;</span>
                          </div>
                        </el-col>
                        <el-col :span="16" class="currency-value">
                          <span class="currency">{{item.currency}}</span>
                          <span class="value">{{item.value | numberToThousands}}</span>
                          <span class="symbol">x</span>
                          <span class="input">
                            <el-input v-model="item.exchangeRate" size="mini" disabled style="width:100px" />
                          </span>
                        </el-col>
                        <el-col :span="4" class="calc-total">
                          <div>
                            <span class="symbol">=</span>
                            <span class="total-transfer">{{item.calcTransferTotal | numberToThousands}}</span>
                          </div>
                        </el-col>
                      </el-row>
                      <el-row class="amount-row amount-total">
                        <el-col :span="20" class="total-currency">
                          <div class="link">
                            <span>
                              <!--应付合计-->
                              {{$t('fmsReceiveClear.AP_TOTAL')}}
                            </span>
                            <span>{{totalDataObject.diffOffsetCurrency}}</span>
                          </div>
                        </el-col>
                        <el-col :span="4" class="calc-total">
                          <div>
                            <span class="symbol">=</span>
                            <span class="total-transfer">{{totalDataObject.calcApOffsetAmountsTotal | numberToThousands}}</span>
                          </div>
                        </el-col>
                      </el-row>
                    </div>

                    <el-row class="remain-row">
                      <el-col :span="6">
                        <div>
                          <!--剩余应收-->
                          {{$t('fmsReceiveClear.remainReceipt')}}
                        </div>
                      </el-col>
                      <el-col :span="14" class="total-currency">
                        <div>
                          <span>{{totalDataObject.diffOffsetCurrency}}</span>
                        </div>
                      </el-col>
                      <el-col :span="4" class="calc-total">
                        <div>
                          <span class="symbol"></span>
                          <span class="total-transfer">{{totalDataObject.calcRemainOffsetAmountsTotal | numberToThousands}}</span>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </div>

              <div class="section transactions-container" v-if="totalDataObject.claimList.length > 0">
                <div class="title">
                  <div class="title-item">
                    <span class="title-item-des">
                      <svg-icon className="clear-module-icon" iconClass="icon-querenshoukuan" />
                        <!--收款信息-->
                        {{$t('fmsReceiveClear.transactionsInfo')}}
                    </span>
                  </div>
                </div>
                <div class="section-content">
                  <div class="claim-list">
                    <el-row v-for="(item, index) in totalDataObject.claimList" :key="index">
                      <el-col :span="8">
                        <div class="claim-list-item">
                          <label>{{$t('fmsReceiveClear.claimNo')}}</label>
                          <span class="link">{{item.claimNo}}</span>
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="claim-list-item center">
                          <label>{{$t('fmsReceiveClear.claimAmount')}}</label>
                          <span>{{item.claimAmount | numberToThousands}}</span>
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="claim-list-item right">
                          <label>{{$t('fmsReceiveClear.useAmount')}}</label>
                          <span>{{item.useAmount | numberToThousands}}</span>
                        </div>
                      </el-col>
                    </el-row>
                  </div>

                  <div class="remain-calc-container">
                    <el-row class="amount-row">
                      <el-col :span="6">
                        <!--剩余应收-->
                        {{$t('fmsReceiveClear.remainReceipt')}}
                      </el-col>
                      <el-col :span="18">
                        <div class="currency-value">
                          <span class="currency">{{totalDataObject.diffOffsetCurrency}}</span>
                          <span class="value">{{totalDataObject.calcRemainOffsetAmountsTotal | numberToThousands}}</span>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row class="amount-row">
                      <el-col :span="6">
                        <!--使用金额合计-->
                        {{$t('fmsReceiveClear.useAmountTotal')}}
                      </el-col>
                      <el-col :span="18">
                        <div class="currency-value">
                          <span class="currency">{{totalDataObject.diffOffsetCurrency}}</span>
                          <span class="value">{{totalDataObject.receiptTransactionsTotal | numberToThousands}}</span>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row class="amount-row remain-calc-row">
                      <el-col :span="6">
                        <!--差额-->
                        {{$t('fmsReceiveClear.diffAmount')}}
                      </el-col>
                      <el-col :span="18">
                        <div class="currency-value">
                          <span class="currency">{{totalDataObject.diffOffsetCurrency}}</span>
                          <span class="value">{{totalDataObject.diffCalcTotal | numberToThousands}}</span>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </div>

              <div class="section origin-container">
                <div class="title">
                  <div class="title-item">
                    <span class="title-item-des">
                      <svg-icon className="clear-module-icon" iconClass="icon-zhuyishixiang" />
                      <!--其他-->
                      {{$t('fmsReceiveClear.other')}}
                    </span>
                  </div>
                </div>
                <div class="section-content description-container">
                  <div class="description-item"><span> {{$t('fmsReceiveClear.submitByName')}}</span><label>{{totalDataObject.submitByName}}</label></div>
                  <div class="description-item"><span> {{$t('fmsReceiveClear.submitDate')}}</span><label>{{totalDataObject.submitDate | parseTime}}</label></div>
                  <div class="description-item full"><span> {{$t('fmsReceiveClear.submitRemark')}}</span><label>{{totalDataObject.remark}}</label></div>
                  <div class="description-item full"><span> {{$t('fmsReceiveClear.submitClearReason')}}</span>
                    <label>
                      {{totalDataObject.clearDiffReason}}
                      {{totalDataObject.clearDiffRemark ? ('：'+ totalDataObject.clearDiffRemark) : ''}}
                    </label>
                  </div>
                  <div class="description-item" v-if="totalDataObject.clearNo"><span> {{$t('fmsReceiveClear.clearByName')}}</span><label>{{totalDataObject.clearByName}}</label></div>
                  <div class="description-item" v-if="totalDataObject.clearNo"><span> {{$t('fmsReceiveClear.clearDate')}}</span><label>{{totalDataObject.clearDate | parseTime}}</label></div>
                  <div class="description-item full" v-if="totalDataObject.clearNo"><span> {{$t('fmsReceiveClear.clearReason')}}</span>
                    <label>
                      {{totalDataObject.clearClearDiffReason}}
                      {{totalDataObject.clearClearDiffRemark ? ('：'+ totalDataObject.clearClearDiffRemark) : ''}}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="totalDataObject.clearNo ? $t('fmsReceiveClear.applyReceiptClearDetail') : $t('fmsReceiveClear.receiptClearDetail')" name="second" lazy>
            <clear-charge-detail :id="id" :totalData="totalDataObject" type="AR"/>
          </el-tab-pane>
          <el-tab-pane :label="totalDataObject.clearNo ? $t('fmsReceiveClear.applyPayableClearDetail') : $t('fmsReceiveClear.payableClearDetail')" name="third" lazy>
            <clear-charge-detail :id="id" :totalData="totalDataObject" type="AP"/>
          </el-tab-pane>
        </el-tabs>

			<clear-reason-modal ref="clearReasonModalRef" @ok="submitConfirmFn" />
		</div>
		<div class="page-edit-footer">
			<el-button type="primary" size="mini" plain @click="backList()" v-if="operation === 'DETAIL'">{{$t('common.close')}}</el-button>
			<el-button type="primary" size="mini" plain @click="backList()" v-if="operation === 'CLEAR'">{{$t('common.cancel')}}</el-button>
			<el-button type="primary" size="mini" :loading="rejectApplyLoading" @click="rejectApplyFn()" v-if="operation === 'CLEAR' && !totalDataObject.clearNo">{{$t('fmsReceiveClear.recallApply')}}</el-button>
			<el-button type="primary" size="mini" :loading="rejectLoading" @click="rejectFn()" v-if="operation === 'CLEAR' && totalDataObject.clearNo">{{$t('fmsReceiveClear.recallClear')}}</el-button>
			<el-button type="primary" size="mini" :loading="clearLoading" @click="confirmFn()" v-if="operation === 'CLEAR'">{{$t('common.confirm')}}</el-button>
		</div>
	</div>
</template>

<script>
import { getReceiptOffsetClearDetailApi, receiptOffsetClearAuditApi, receiptClearCancelApi, receiptApplyClearCancelApi } from "@/api/financial/fmsReceiptClear";
import ClearReasonModal from "@/views/financial/components/PayableClearReasonModal";
import ClearChargeDetail from "./components/clearChargeDetail";

export default {
	name: "FmsPayableOffsetClearDetail",
	components: {
		ClearReasonModal,
    ClearChargeDetail
	},
	data() {
		return {
      activeName: 'first',
			id: "",
			operation: "",
			origin: "",

			clearLoading: false,
      rejectApplyLoading: false,
      rejectLoading: false,
			totalDataObject: {
				instructionTransactionType: "", // 实收付类型 1 款项 2 钱包 3 水单 4 待付 5 完全平账 6 余额平账
				settlementOfficeId: "",
				settlementCompanyId: "",
				remark: "",
				arClearingInfo: {
					settlementSource: "",
					charges: [],
					bills: [],
					invoices: [],
					unInstructionAmounts: []
				},
				apClearingInfo: {
					settlementSource: "",
					charges: [],
					bills: [],
					invoices: [],
					unInstructionAmounts: []
				},
				sameOffsetAmounts: [], // 同币种对冲金额
				arOffsetAmounts: [], // 异币种对冲应收金额
				apOffsetAmounts: [], // 异币种对冲应付金额
				diffOffsetCurrency: "", // 异币种对冲目标币种
				claimList: [], // 收款列表

				// 前端使用
				calcArOffsetAmountsTotal: "", // 异币种目标币种应收合计
				calcApOffsetAmountsTotal: "", // 异币种目标币种应付合计
				calcRemainOffsetAmountsTotal: "", // 填写完汇率计算之后的应收值(异币种对冲之后剩余的)
				diffCalcTotal: "", // 收款之后的剩余值计算
				receiptTransactionsTotal: "" // 收款的使用总和
			},
			formData: {
				remark: ""
			}
		};
	},
	created() {
		this.id = this.$route.query.id;
		this.origin = this.$route.query.origin;
		this.operation = this.$route.query.operation;
		this.init();
	},
	methods: {
		init() {
			getReceiptOffsetClearDetailApi(this.id).then(res => {
				if (res.ok) {
					// 异币种应收合计
					let calcArOffsetAmountsTotal = 0;
					// 异币种应付合计
					let calcApOffsetAmountsTotal = 0;
					res.content.arOffsetAmounts.forEach(v => {
						v.currency = v.sourceCurrency;
						v.value = v.sourceValue;
						v.calcTransferTotal = v.targetValue;
						calcArOffsetAmountsTotal += Number(v.targetValue || 0);
					});
					res.content.apOffsetAmounts.forEach(v => {
						v.currency = v.sourceCurrency;
						v.value = v.sourceValue;
						v.calcTransferTotal = v.targetValue;
						calcApOffsetAmountsTotal += Number(v.targetValue || 0);
					});

					// 收款使用金额合计
					let receiptTransactionsTotal = 0;
					res.content.claims.forEach(v => {
						receiptTransactionsTotal += Number(v.useAmount || 0);
					});

					// 应收 减去 应付（从而看 是否关联收款）
					let calcRemainOffsetAmountsTotal = (calcArOffsetAmountsTotal - calcApOffsetAmountsTotal).toFixed(2);
					// 最终剩余的差额
					let diffCalcTotal = (calcRemainOffsetAmountsTotal - receiptTransactionsTotal).toFixed(2);

					this.totalDataObject = {
						...this.totalDataObject,
						...res.content,
						claimList: res.content.claims,
						arClearingInfo: {
							...this.totalDataObject.arClearingInfo,
							...res.content.arClearSourceInfo,
							unInstructionAmounts: res.content.arChargeTotalAmounts
						},
						apClearingInfo: {
							...this.totalDataObject.apClearingInfo,
							...res.content.apClearSourceInfo,
							unInstructionAmounts: res.content.apChargeTotalAmounts
						},
						diffOffsetCurrency: res.content.instructionCurrency,
						calcArOffsetAmountsTotal: calcArOffsetAmountsTotal,
						calcApOffsetAmountsTotal: calcApOffsetAmountsTotal,
						calcRemainOffsetAmountsTotal: calcRemainOffsetAmountsTotal,
						receiptTransactionsTotal: receiptTransactionsTotal,
						diffCalcTotal: diffCalcTotal // 最终剩余的差额
					};
				}
			});
		},
		backList() {
			if (this.origin) {
				this.$store.dispatch("tagsView/delView", this.$route);
				this.$router.push({ name: this.origin });
			}
		},
		submitConfirmFn(reason) {
			let data = {
				instructionId: this.id
			};
			// 如果是弹窗选原因
			if (reason) {
				data.clearDiffRemark = reason.remark;
				if (Number(this.totalDataObject.diffCalcTotal) > 0) {
					data.clearUnderReason = reason.reason;
				} else {
					data.clearOverReason = reason.reason;
				}
			}
			this.clearLoading = true;
			receiptOffsetClearAuditApi(data).then(res => {
        if (res.ok) {
          this.backList();
          this.$message.success(this.$t('fmsReceiveClear.clearSuccess'));
        }
        this.clearLoading = false;
      }).catch(() => {
        this.clearLoading = false;
      });
		},
		confirmFn() {
			if (this.totalDataObject.instructionTransactionType === 5) {
				// 完全平账
				this.submitConfirmFn();
			} else if (this.totalDataObject.instructionTransactionType === 6) {
				// 余额平账
				this.$refs.clearReasonModalRef.show(true);
			} else if (this.totalDataObject.instructionTransactionType === 1) {
				// 关联收款
				if (Number(this.totalDataObject.diffCalcTotal) !== 0) {
					let flag = Number(this.totalDataObject.diffCalcTotal) > 0;
					this.$refs.clearReasonModalRef.show(flag);
				} else {
					this.submitConfirmFn();
				}
			}
		},
		rejectApplyFn() {
			this.$confirm(this.$t('fmsReceiveClear.recallApplyInfo'), this.$t("receiveFms.mention"), {
				confirmButtonText: this.$t("common.confirm"),
				cancelButtonText: this.$t("common.cancel"),
				type: "warning"
			})
				.then(() => {
          this.rejectApplyLoading = true
					receiptApplyClearCancelApi({ instructionId: this.id }).then(res => {
						if (res.ok) {
							this.backList();
							this.$message.success(this.$t('fmsReceiveClear.recallApplySuccess'));
						}
            this.rejectApplyLoading = false
					});
				})
				.catch(() => {});
		},
		rejectFn() {
			this.$confirm(this.$t('fmsReceiveClear.recallClearInfo'), this.$t("receiveFms.mention"), {
				confirmButtonText: this.$t("common.confirm"),
				cancelButtonText: this.$t("common.cancel"),
				type: "warning"
			})
				.then(() => {
          this.rejectLoading = true
					receiptClearCancelApi({ instructionId: this.id }).then(res => {
						if (res.ok) {
							this.backList();
							this.$message.success(this.$t('fmsReceiveClear.recallClearSuccess'));
						}
            this.rejectLoading = false
					});
				})
				.catch(() => {});
		}
	}
};
</script>

<style lang="scss" scoped>
@import "../styles/clear.scss";
.page-edit-container .page-edit-content {
	padding: 0;
}
.clear-detail-container {
	padding: 20px;
}
.clear-title {
	font-size: 15px;
	font-weight: 600;
	height: 50px;
	line-height: 50px;
	background: #fff;
	position: relative;

	.clear-img {
		position: absolute;
		right: 100px;
		top: 0px;
		font-size: 110px;
	}
}

.description-container {
	overflow: hidden;
	.description-item {
		line-height: 35px;
		width: 50%;
		float: left;
		span {
			display: inline-block;
			margin-right: 10px;
			width: 90px;
			text-align: right;
			color: #777;
		}
		label {
			font-weight: 500;
		}
	}
	.description-item.full {
		width: 100%;
	}
}

.no-transactions {
	float: right;
	padding-right: 20px;
	color: red;
}

::v-deep .el-tabs__header{
  background: #fff;
  padding-left: 20px;
  line-height: 50px;
}
</style>
